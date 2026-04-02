import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	checkRateLimit,
	cleanupRateLimits,
	getConfig,
	DEFAULT_MAX_REQUESTS,
	WINDOW_MS
} from './rateLimiter';
import type { RateLimitConfig } from './rateLimiter';

// Token bucket math:
// - capacity = maxRequests
// - refill rate = maxRequests / windowMs tokens/ms
// - retryAfter = ceil((1 - tokens) / refillRate / 1000) seconds

function makeDb(record?: {
	fingerprint: string;
	action: string;
	tokens: number;
	lastRefill: number;
}) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db: any = {
		insert: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		select: vi.fn()
	};

	const rows = record ? [record] : [];

	db.select.mockReturnValue({
		from: vi.fn().mockReturnValue({
			where: vi.fn().mockReturnValue({
				limit: vi.fn().mockResolvedValue(rows)
			})
		})
	});
	db.insert.mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) });
	db.update.mockReturnValue({
		set: vi.fn().mockReturnValue({
			where: vi.fn().mockResolvedValue(undefined)
		})
	});
	db.delete.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });

	return db;
}

describe('rateLimiter - token bucket', () => {
	const config: RateLimitConfig = { maxRequests: 10, windowMs: 10000 };
	// refill rate = 10 / 10000 = 0.001 tokens/ms
	// retryAfter when empty = 1 / 0.001 / 1000 = 1 second

	describe('first request (no row)', () => {
		it('should allow and insert row with maxRequests - 1 tokens', async () => {
			const db = makeDb();

			const result = await checkRateLimit(db, 'fp', 'vote', undefined, config);

			expect(result.allowed).toBe(true);
			expect(result.retryAfter).toBeNull();
			expect(db.insert).toHaveBeenCalledOnce();

			const insertedValues = db.insert.mock.results[0].value.values.mock.calls[0][0];
			expect(insertedValues.tokens).toBe(config.maxRequests - 1); // 9
			expect(insertedValues.fingerprint).toBe('fp');
			expect(insertedValues.action).toBe('vote');
		});
	});

	describe('existing row - full bucket', () => {
		it('should allow when tokens > 1 and decrement', async () => {
			const now = Date.now();
			const db = makeDb({ fingerprint: 'fp', action: 'vote', tokens: 5, lastRefill: now });

			const result = await checkRateLimit(db, 'fp', 'vote', undefined, config);

			expect(result.allowed).toBe(true);

			const setArgs = db.update.mock.results[0].value.set.mock.calls[0][0];
			// tokens should be 5 + tiny_refill - 1, i.e. just under 5
			expect(setArgs.tokens).toBeGreaterThan(3.9);
			expect(setArgs.tokens).toBeLessThan(5);
		});
	});

	describe('empty bucket - rate limited', () => {
		it('should deny when tokens < 1', async () => {
			const now = Date.now();
			// tokens = 0, no time elapsed → still 0
			const db = makeDb({ fingerprint: 'fp', action: 'vote', tokens: 0, lastRefill: now });

			const result = await checkRateLimit(db, 'fp', 'vote', undefined, config);

			expect(result.allowed).toBe(false);
			expect(result.retryAfter).toBeGreaterThanOrEqual(1);
			expect(db.update).not.toHaveBeenCalled();
		});

		it('should calculate correct retryAfter when tokens = 0', async () => {
			const now = Date.now();
			// refill rate = 10/10000 = 0.001 tokens/ms
			// need 1 token: 1 / 0.001 = 1000ms = 1 second
			const db = makeDb({ fingerprint: 'fp', action: 'vote', tokens: 0, lastRefill: now });

			const result = await checkRateLimit(db, 'fp', 'vote', undefined, config);

			expect(result.allowed).toBe(false);
			expect(result.retryAfter).toBe(1);
		});

		it('should calculate correct retryAfter when tokens = 0.5 (half a token short)', async () => {
			const now = Date.now();
			// need 0.5 more tokens: 0.5 / 0.001 = 500ms → ceil(0.5) = 1 second
			const db = makeDb({ fingerprint: 'fp', action: 'vote', tokens: 0.5, lastRefill: now });

			const result = await checkRateLimit(db, 'fp', 'vote', undefined, config);

			expect(result.allowed).toBe(false);
			expect(result.retryAfter).toBe(1);
		});

		it('retryAfter should reflect remaining time when partially refilled', async () => {
			// config: 60 req/hour → refill rate = 60/3600000 tokens/ms = 1 token/min
			const hourlyConfig: RateLimitConfig = { maxRequests: 60, windowMs: 3600000 };
			const now = Date.now();
			// bucket empty, last refill was 30 seconds ago
			// refilled = 30000 * (60/3600000) = 0.5 tokens → still < 1
			// need 0.5 more tokens: 0.5 / (60/3600000) = 30000ms = 30 seconds
			const db = makeDb({ fingerprint: 'fp', action: 'vote', tokens: 0, lastRefill: now - 30000 });

			const result = await checkRateLimit(db, 'fp', 'vote', undefined, hourlyConfig);

			expect(result.allowed).toBe(false);
			expect(result.retryAfter).toBeGreaterThanOrEqual(29);
			expect(result.retryAfter).toBeLessThanOrEqual(31);
		});
	});

	describe('token refill over time', () => {
		it('should allow after sufficient time has elapsed to refill a token', async () => {
			// config: 10 req / 10000ms → 1 token per 1000ms
			// tokens = 0, last refill was 1500ms ago → refilled = 1.5 tokens → can consume 1
			const db = makeDb({
				fingerprint: 'fp',
				action: 'vote',
				tokens: 0,
				lastRefill: Date.now() - 1500
			});

			const result = await checkRateLimit(db, 'fp', 'vote', undefined, config);

			expect(result.allowed).toBe(true);

			const setArgs = db.update.mock.results[0].value.set.mock.calls[0][0];
			// 0 + 1.5 - 1 = 0.5 tokens remaining
			expect(setArgs.tokens).toBeGreaterThan(0.4);
			expect(setArgs.tokens).toBeLessThan(0.6);
		});

		it('should cap refilled tokens at maxRequests', async () => {
			// tokens = 9, last refill was ages ago → would refill past capacity
			const db = makeDb({ fingerprint: 'fp', action: 'vote', tokens: 9, lastRefill: 0 });

			const result = await checkRateLimit(db, 'fp', 'vote', undefined, config);

			expect(result.allowed).toBe(true);

			const setArgs = db.update.mock.results[0].value.set.mock.calls[0][0];
			// capped at 10, minus 1 consumed = 9
			expect(setArgs.tokens).toBe(9);
		});
	});

	describe('exact limit boundary', () => {
		it('should allow the Nth request and deny the N+1th', async () => {
			// Simulate N=3 capacity, fresh bucket
			const smallConfig: RateLimitConfig = { maxRequests: 3, windowMs: 10000 };
			const now = Date.now();

			// Request 1: no row → insert with tokens = 2
			const db1 = makeDb();
			expect((await checkRateLimit(db1, 'fp', 'vote', undefined, smallConfig)).allowed).toBe(true);

			// Request 2: tokens = 2 → allowed, tokens become 1
			const db2 = makeDb({ fingerprint: 'fp', action: 'vote', tokens: 2, lastRefill: now });
			expect((await checkRateLimit(db2, 'fp', 'vote', undefined, smallConfig)).allowed).toBe(true);

			// Request 3: tokens = 1 → allowed, tokens become 0
			const db3 = makeDb({ fingerprint: 'fp', action: 'vote', tokens: 1, lastRefill: now });
			expect((await checkRateLimit(db3, 'fp', 'vote', undefined, smallConfig)).allowed).toBe(true);

			// Request 4: tokens = 0 → denied
			const db4 = makeDb({ fingerprint: 'fp', action: 'vote', tokens: 0, lastRefill: now });
			expect((await checkRateLimit(db4, 'fp', 'vote', undefined, smallConfig)).allowed).toBe(false);
		});
	});

	describe('env config', () => {
		it('should use VOTE_RATE_LIMIT_PER_HOUR', () => {
			expect(getConfig('vote', { VOTE_RATE_LIMIT_PER_HOUR: '30' }).maxRequests).toBe(30);
		});

		it('should use TIP_RATE_LIMIT_PER_HOUR', () => {
			expect(getConfig('tip', { TIP_RATE_LIMIT_PER_HOUR: '5' }).maxRequests).toBe(5);
		});

		it('should fall back to DEFAULT_MAX_REQUESTS on invalid env value', () => {
			expect(getConfig('vote', { VOTE_RATE_LIMIT_PER_HOUR: 'nope' }).maxRequests).toBe(
				DEFAULT_MAX_REQUESTS
			);
		});

		it('should fall back to DEFAULT_MAX_REQUESTS on empty env value', () => {
			expect(getConfig('vote', { VOTE_RATE_LIMIT_PER_HOUR: '' }).maxRequests).toBe(
				DEFAULT_MAX_REQUESTS
			);
		});

		it('should use vote limit for unknown action', () => {
			expect(getConfig('unknown', { VOTE_RATE_LIMIT_PER_HOUR: '42' }).maxRequests).toBe(42);
		});

		it('windowMs should always be WINDOW_MS', () => {
			expect(getConfig('vote').windowMs).toBe(WINDOW_MS);
			expect(getConfig('tip').windowMs).toBe(WINDOW_MS);
		});
	});

	describe('input validation', () => {
		let db: ReturnType<typeof makeDb>;
		beforeEach(() => {
			db = makeDb();
		});

		it('should throw on empty fingerprint', async () => {
			await expect(checkRateLimit(db, '', 'vote')).rejects.toThrow('Invalid fingerprint');
		});
		it('should throw on whitespace fingerprint', async () => {
			await expect(checkRateLimit(db, '   ', 'vote')).rejects.toThrow('Invalid fingerprint');
		});
		it('should throw on empty action', async () => {
			await expect(checkRateLimit(db, 'fp', '')).rejects.toThrow('Invalid action');
		});
		it('should throw on whitespace action', async () => {
			await expect(checkRateLimit(db, 'fp', '   ')).rejects.toThrow('Invalid action');
		});
		it('should throw on fingerprint > 256 chars', async () => {
			await expect(checkRateLimit(db, 'a'.repeat(257), 'vote')).rejects.toThrow('too long');
		});
		it('should throw on action > 64 chars', async () => {
			await expect(checkRateLimit(db, 'fp', 'a'.repeat(65))).rejects.toThrow('too long');
		});
	});

	describe('cleanupRateLimits', () => {
		it('should delete rows with lastRefill older than windowMs', async () => {
			const db = makeDb();
			await cleanupRateLimits(db);
			expect(db.delete).toHaveBeenCalled();
		});
	});
});
