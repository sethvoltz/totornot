import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	checkRateLimit,
	cleanupRateLimits,
	getConfig,
	DEFAULT_MAX_REQUESTS,
	WINDOW_MS
} from './rateLimiter';
import type { RateLimitConfig } from './rateLimiter';

describe('rateLimiter', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mockDb: any;

	beforeEach(() => {
		mockDb = {
			select: vi.fn(),
			insert: vi.fn(),
			update: vi.fn(),
			delete: vi.fn()
		};
	});

	describe('checkRateLimit', () => {
		it('should allow first request and create new row', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						limit: vi.fn().mockResolvedValue([])
					})
				})
			});
			mockDb.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined)
			});

			const result = await checkRateLimit(mockDb, 'test-fingerprint', 'vote');

			expect(result.allowed).toBe(true);
			expect(result.retryAfter).toBeNull();
			expect(mockDb.insert).toHaveBeenCalled();
		});

		it('should deny requests at the limit', async () => {
			const config: RateLimitConfig = { maxRequests: 3, windowMs: 60000 };
			const now = Date.now();

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						limit: vi.fn().mockResolvedValue([
							{
								fingerprint: 'test-fingerprint',
								action: 'vote',
								windowStart: new Date(now - 30000),
								count: 3
							}
						])
					})
				})
			});

			const result = await checkRateLimit(mockDb, 'test-fingerprint', 'vote', undefined, config);

			expect(result.allowed).toBe(false);
			expect(result.retryAfter).toBeGreaterThan(0);
		});

		it('should calculate correct retryAfter based on window expiry', async () => {
			const windowMs = 60000;
			const config: RateLimitConfig = { maxRequests: 2, windowMs };
			const now = Date.now();

			// Window started 30 seconds ago, so expires in 30 seconds
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						limit: vi.fn().mockResolvedValue([
							{
								fingerprint: 'test-fingerprint',
								action: 'vote',
								windowStart: new Date(now - 30000),
								count: 2
							}
						])
					})
				})
			});

			const result = await checkRateLimit(mockDb, 'test-fingerprint', 'vote', undefined, config);

			expect(result.allowed).toBe(false);
			expect(result.retryAfter).toBeGreaterThanOrEqual(29);
			expect(result.retryAfter).toBeLessThanOrEqual(31);
		});

		it('should reset window when expired', async () => {
			const windowMs = 60000;
			const config: RateLimitConfig = { maxRequests: 2, windowMs };
			const now = Date.now();

			// Window started 70 seconds ago (expired)
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						limit: vi.fn().mockResolvedValue([
							{
								fingerprint: 'test-fingerprint',
								action: 'vote',
								windowStart: new Date(now - 70000),
								count: 5
							}
						])
					})
				})
			});
			mockDb.update.mockReturnValue({
				set: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue(undefined)
				})
			});

			const result = await checkRateLimit(mockDb, 'test-fingerprint', 'vote', undefined, config);

			expect(result.allowed).toBe(true);
			expect(mockDb.update).toHaveBeenCalled();
		});

		it('should increment count when under limit', async () => {
			const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 };
			const now = Date.now();

			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						limit: vi.fn().mockResolvedValue([
							{
								fingerprint: 'test-fingerprint',
								action: 'vote',
								windowStart: new Date(now - 10000),
								count: 2
							}
						])
					})
				})
			});
			mockDb.update.mockReturnValue({
				set: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue(undefined)
				})
			});

			const result = await checkRateLimit(mockDb, 'test-fingerprint', 'vote', undefined, config);

			expect(result.allowed).toBe(true);
			expect(mockDb.update).toHaveBeenCalled();
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

		it('should handle different fingerprints independently', async () => {
			mockDb.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						limit: vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([])
					})
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

		it('should use VOTE_RATE_LIMIT_PER_HOUR from env', async () => {
			const env = { VOTE_RATE_LIMIT_PER_HOUR: '50' };
			const config = getConfig('vote', env);
			expect(config.maxRequests).toBe(50);
		});

		it('should use TIP_RATE_LIMIT_PER_HOUR from env', async () => {
			const env = { TIP_RATE_LIMIT_PER_HOUR: '10' };
			const config = getConfig('tip', env);
			expect(config.maxRequests).toBe(10);
		});

		it('should fallback to default for invalid env value', async () => {
			const env = { VOTE_RATE_LIMIT_PER_HOUR: 'invalid' };
			const config = getConfig('vote', env);
			expect(config.maxRequests).toBe(DEFAULT_MAX_REQUESTS);
		});

		it('should fallback to default for empty env value', async () => {
			const env = { VOTE_RATE_LIMIT_PER_HOUR: '' };
			const config = getConfig('vote', env);
			expect(config.maxRequests).toBe(DEFAULT_MAX_REQUESTS);
		});

		it('should fallback to default for unknown action', async () => {
			const config = getConfig('unknown-action');
			expect(config.maxRequests).toBe(DEFAULT_MAX_REQUESTS);
		});
	});

	describe('cleanupRateLimits', () => {
		it('should delete entries with expired windows', async () => {
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

	describe('getConfig', () => {
		it('should return default when no env provided', () => {
			const config = getConfig('vote');
			expect(config.maxRequests).toBe(DEFAULT_MAX_REQUESTS);
			expect(config.windowMs).toBe(WINDOW_MS);
		});

		it('should use vote limit for unknown action', async () => {
			const env = { VOTE_RATE_LIMIT_PER_HOUR: '50' };
			const config = getConfig('unknown-action', env);
			expect(config.maxRequests).toBe(50);
		});
	});
});
