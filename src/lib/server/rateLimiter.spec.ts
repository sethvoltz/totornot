import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkRateLimit, cleanupRateLimits, DEFAULT_CONFIGS } from './rateLimiter';
import type { RateLimitConfig } from './rateLimiter';

describe('rateLimiter', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mockDb: any;

	beforeEach(() => {
		mockDb = {
			select: vi.fn(),
			insert: vi.fn(),
			delete: vi.fn()
		};
	});

	describe('checkRateLimit', () => {
		it('should allow requests under the limit', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce([]) // First check
						.mockResolvedValueOnce([{ id: 'new' }]) // Re-check
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			const result = await checkRateLimit(mockDb, 'test-fingerprint', 'vote');

			expect(result.allowed).toBe(true);
			expect(result.retryAfter).toBeNull();
		});

		it('should deny requests at the limit', async () => {
			const config: RateLimitConfig = { maxRequests: 3, windowMs: 60000 };
			const now = Date.now();

			const entries = [
				{ id: '1', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 1000) },
				{ id: '2', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 2000) },
				{ id: '3', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 3000) }
			];

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValueOnce(entries)
				})
			});

			const result = await checkRateLimit(mockDb, 'test-fingerprint', 'vote', config);

			expect(result.allowed).toBe(false);
			expect(result.retryAfter).toBeGreaterThan(0);
		});

		it('should calculate correct retryAfter based on oldest entry', async () => {
			const windowMs = 60000;
			const config: RateLimitConfig = { maxRequests: 2, windowMs };
			const now = Date.now();

			// Oldest entry was 30 seconds ago
			const entries = [
				{ id: '1', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 30000) },
				{ id: '2', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 10000) }
			];

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValueOnce(entries)
				})
			});

			const result = await checkRateLimit(mockDb, 'test-fingerprint', 'vote', config);

			expect(result.allowed).toBe(false);
			expect(result.retryAfter).toBeGreaterThanOrEqual(29);
			expect(result.retryAfter).toBeLessThanOrEqual(31);
		});

		it('should use sliding window - allow after oldest entry expires', async () => {
			const windowMs = 60000;
			const config: RateLimitConfig = { maxRequests: 2, windowMs };
			const now = Date.now();

			// Only one entry within window
			const entries = [
				{ id: '2', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 10000) }
			];

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce(entries) // First check
						.mockResolvedValueOnce([{ id: 'new' }]) // Re-check
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			const result = await checkRateLimit(mockDb, 'test-fingerprint', 'vote', config);

			expect(result.allowed).toBe(true);
		});

		it('should insert a new entry when allowed', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce([]) // First check
						.mockResolvedValueOnce([{ id: 'new' }]) // Re-check
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			await checkRateLimit(mockDb, 'test-fingerprint', 'vote');

			expect(mockDb.insert).toHaveBeenCalled();
		});

		it('should not insert when rate limited', async () => {
			const config: RateLimitConfig = { maxRequests: 1, windowMs: 60000 };
			const entries = [{ id: '1', fingerprint: 'test', action: 'vote', createdAt: new Date() }];

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValueOnce(entries)
				})
			});

			await checkRateLimit(mockDb, 'test-fingerprint', 'vote', config);

			expect(mockDb.insert).not.toHaveBeenCalled();
		});

		it('should handle race condition - remove own entry if limit exceeded after insert', async () => {
			const config: RateLimitConfig = { maxRequests: 2, windowMs: 60000 };
			const now = Date.now();

			const entriesFirstCheck = [
				{ id: '1', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 5000) }
			];

			const entriesAfterInsert = [
				{ id: '1', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 5000) },
				{ id: '2', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 1000) },
				{ id: 'new', fingerprint: 'test', action: 'vote', createdAt: new Date() }
			];

			const entriesAfterDelete = [
				{ id: '1', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 5000) },
				{ id: '2', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 1000) }
			];

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce(entriesFirstCheck) // First check
						.mockResolvedValueOnce(entriesAfterInsert) // Re-check after insert
						.mockResolvedValueOnce(entriesAfterDelete) // After delete re-fetch
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});
			mockDb.delete.mockReturnValue({
				where: vi.fn().mockResolvedValue(undefined)
			});

			const result = await checkRateLimit(mockDb, 'test', 'vote', config);

			expect(result.allowed).toBe(false);
			expect(mockDb.delete).toHaveBeenCalled();
		});

		it('should use correct default config for vote action', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce([])
						.mockResolvedValueOnce([{ id: 'new' }])
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			await checkRateLimit(mockDb, 'test', 'vote');

			expect(DEFAULT_CONFIGS.vote).toBeDefined();
			expect(DEFAULT_CONFIGS.vote.maxRequests).toBe(1000);
			expect(DEFAULT_CONFIGS.vote.windowMs).toBe(60 * 60 * 1000);
		});

		it('should use correct default config for tip action', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce([])
						.mockResolvedValueOnce([{ id: 'new' }])
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			await checkRateLimit(mockDb, 'test', 'tip');

			expect(DEFAULT_CONFIGS.tip).toBeDefined();
			expect(DEFAULT_CONFIGS.tip.maxRequests).toBe(1000);
			expect(DEFAULT_CONFIGS.tip.windowMs).toBe(60 * 60 * 1000);
		});

		it('should ensure retryAfter is at least 1 second', async () => {
			const config: RateLimitConfig = { maxRequests: 1, windowMs: 60000 };
			const now = Date.now();

			const entries = [
				{ id: '1', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 59900) }
			];

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValueOnce(entries)
				})
			});

			const result = await checkRateLimit(mockDb, 'test-fingerprint', 'vote', config);

			expect(result.allowed).toBe(false);
			expect(result.retryAfter).toBeGreaterThanOrEqual(1);
		});

		it('should handle different fingerprints independently', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce([])
						.mockResolvedValueOnce([{ id: 'new' }])
						.mockResolvedValueOnce([])
						.mockResolvedValueOnce([{ id: 'new' }])
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			const result1 = await checkRateLimit(mockDb, 'fingerprint-1', 'vote');
			const result2 = await checkRateLimit(mockDb, 'fingerprint-2', 'vote');

			expect(result1.allowed).toBe(true);
			expect(result2.allowed).toBe(true);
		});

		it('should handle different actions independently', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce([])
						.mockResolvedValueOnce([{ id: 'new' }])
						.mockResolvedValueOnce([])
						.mockResolvedValueOnce([{ id: 'new' }])
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			const result1 = await checkRateLimit(mockDb, 'test', 'vote');
			const result2 = await checkRateLimit(mockDb, 'test', 'tip');

			expect(result1.allowed).toBe(true);
			expect(result2.allowed).toBe(true);
		});

		it('should throw on empty fingerprint', async () => {
			await expect(checkRateLimit(mockDb, '', 'vote')).rejects.toThrow('Invalid fingerprint');
		});

		it('should throw on whitespace-only fingerprint', async () => {
			await expect(checkRateLimit(mockDb, '   ', 'vote')).rejects.toThrow('Invalid fingerprint');
		});

		it('should throw on empty action', async () => {
			await expect(checkRateLimit(mockDb, 'test', '')).rejects.toThrow('Invalid action');
		});

		it('should throw on whitespace-only action', async () => {
			await expect(checkRateLimit(mockDb, 'test', '   ')).rejects.toThrow('Invalid action');
		});

		it('should throw on too long fingerprint', async () => {
			const longFingerprint = 'a'.repeat(257);
			await expect(checkRateLimit(mockDb, longFingerprint, 'vote')).rejects.toThrow('too long');
		});

		it('should throw on too long action', async () => {
			const longAction = 'a'.repeat(65);
			await expect(checkRateLimit(mockDb, 'test', longAction)).rejects.toThrow('too long');
		});

		it('should fallback to vote config for unknown action', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce([])
						.mockResolvedValueOnce([{ id: 'new' }])
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			const result = await checkRateLimit(mockDb, 'test', 'unknown-action');
			expect(result.allowed).toBe(true);
		});

		it('should count entries correctly', async () => {
			const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 };
			const now = Date.now();

			const entries = [
				{ id: '1', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 4000) },
				{ id: '2', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 3000) },
				{ id: '3', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 2000) },
				{ id: '4', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 1000) }
			];

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce(entries) // First check - 4 entries
						.mockResolvedValueOnce([...entries, { id: 'new' }]) // Re-check - 5 entries
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			const result = await checkRateLimit(mockDb, 'test', 'vote', config);
			expect(result.allowed).toBe(true);
		});

		it('should reject when count equals maxRequests', async () => {
			const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 };
			const now = Date.now();

			const entries = [
				{ id: '1', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 5000) },
				{ id: '2', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 4000) },
				{ id: '3', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 3000) },
				{ id: '4', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 2000) },
				{ id: '5', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 1000) }
			];

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValueOnce(entries)
				})
			});

			const result = await checkRateLimit(mockDb, 'test', 'vote', config);
			expect(result.allowed).toBe(false);
		});

		it('should use sliding window - only count entries within window', async () => {
			const windowMs = 60000;
			const config: RateLimitConfig = { maxRequests: 2, windowMs };
			const now = Date.now();

			// One entry is outside window (65 seconds ago)
			const entriesWithinWindow = [
				{ id: '2', fingerprint: 'test', action: 'vote', createdAt: new Date(now - 10000) }
			];

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce(entriesWithinWindow) // First check
						.mockResolvedValueOnce([...entriesWithinWindow, { id: 'new' }]) // Re-check
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			const result = await checkRateLimit(mockDb, 'test', 'vote', config);
			expect(result.allowed).toBe(true);
		});
	});

	describe('cleanupRateLimits', () => {
		it('should delete entries older than the window', async () => {
			mockDb.delete.mockReturnValue({
				where: vi.fn().mockResolvedValue(undefined)
			});

			await cleanupRateLimits(mockDb);

			expect(mockDb.delete).toHaveBeenCalled();
		});

		it('should accept custom config', async () => {
			mockDb.delete.mockReturnValue({
				where: vi.fn().mockResolvedValue(undefined)
			});

			const customConfig: RateLimitConfig = { maxRequests: 100, windowMs: 30000 };
			await cleanupRateLimits(mockDb, customConfig);

			expect(mockDb.delete).toHaveBeenCalled();
		});
	});

	describe('sliding window behavior', () => {
		it('should allow request after oldest entry expires from window', async () => {
			const windowMs = 1000;
			const config: RateLimitConfig = { maxRequests: 1, windowMs };

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValueOnce([]) // First check
						.mockResolvedValueOnce([{ id: 'new' }]) // Re-check
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			const result1 = await checkRateLimit(mockDb, 'test', 'vote', config);
			expect(result1.allowed).toBe(true);
		});

		it('should correctly calculate when next request will be allowed', async () => {
			const windowMs = 3600000;
			const config: RateLimitConfig = { maxRequests: 100, windowMs };
			const now = Date.now();

			// 100 requests, oldest was 30 minutes ago
			const entries = Array.from({ length: 100 }, (_, i) => ({
				id: String(i),
				fingerprint: 'test',
				action: 'vote',
				createdAt: new Date(now - 1800000 + i * 100)
			}));

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValueOnce(entries)
				})
			});

			const result = await checkRateLimit(mockDb, 'test', 'vote', config);

			expect(result.allowed).toBe(false);
			expect(result.retryAfter).toBeGreaterThan(1700);
			expect(result.retryAfter).toBeLessThan(1900);
		});
	});
});
