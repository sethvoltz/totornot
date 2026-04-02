import { and, eq, lt } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { rateLimits } from './db/schema';
import type * as schema from './db/schema';

export interface RateLimitConfig {
	maxRequests: number; // bucket capacity and max tokens (per hour)
	windowMs: number; // refill period in ms (always 1 hour = 3600000)
}

export interface RateLimitResult {
	allowed: boolean;
	retryAfter: number | null; // seconds until next request allowed
}

export interface RateLimitEnv {
	VOTE_RATE_LIMIT_PER_HOUR?: string;
	TIP_RATE_LIMIT_PER_HOUR?: string;
}

const DEFAULT_MAX_REQUESTS = 1000;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour in ms

type DbClient = DrizzleD1Database<typeof schema>;

export function getConfig(action: string, env?: RateLimitEnv): RateLimitConfig {
	const maxRequests =
		action === 'tip'
			? parseInt(env?.TIP_RATE_LIMIT_PER_HOUR || '', 10) || DEFAULT_MAX_REQUESTS
			: parseInt(env?.VOTE_RATE_LIMIT_PER_HOUR || '', 10) || DEFAULT_MAX_REQUESTS;

	return { maxRequests, windowMs: WINDOW_MS };
}

function validateInput(fingerprint: string, action: string): void {
	if (!fingerprint || fingerprint.trim().length === 0) {
		throw new Error('Invalid fingerprint: must be non-empty');
	}
	if (!action || action.trim().length === 0) {
		throw new Error('Invalid action: must be non-empty');
	}
	if (fingerprint.length > 256) {
		throw new Error('Invalid fingerprint: too long (max 256 chars)');
	}
	if (action.length > 64) {
		throw new Error('Invalid action: too long (max 64 chars)');
	}
}

export async function checkRateLimit(
	db: DbClient,
	fingerprint: string,
	action: string,
	env?: RateLimitEnv,
	config?: RateLimitConfig
): Promise<RateLimitResult> {
	validateInput(fingerprint, action);

	const { maxRequests, windowMs } = config || getConfig(action, env);
	const refillRatePerMs = maxRequests / windowMs; // tokens per ms
	const now = Date.now();

	const existing = await db
		.select()
		.from(rateLimits)
		.where(and(eq(rateLimits.fingerprint, fingerprint), eq(rateLimits.action, action)))
		.limit(1);

	if (existing.length === 0) {
		// First request: full bucket, consume one token
		await db.insert(rateLimits).values({
			fingerprint,
			action,
			tokens: maxRequests - 1,
			lastRefill: now
		});
		return { allowed: true, retryAfter: null };
	}

	const record = existing[0];
	const elapsedMs = now - record.lastRefill;
	const refilled = elapsedMs * refillRatePerMs;
	const currentTokens = Math.min(maxRequests, record.tokens + refilled);

	if (currentTokens < 1) {
		// Not enough tokens - calculate how long until 1 token refills
		const msUntilToken = (1 - currentTokens) / refillRatePerMs;
		const retryAfter = Math.ceil(msUntilToken / 1000);
		return { allowed: false, retryAfter: Math.max(1, retryAfter) };
	}

	// Consume one token and update
	await db
		.update(rateLimits)
		.set({ tokens: currentTokens - 1, lastRefill: now })
		.where(and(eq(rateLimits.fingerprint, fingerprint), eq(rateLimits.action, action)));

	return { allowed: true, retryAfter: null };
}

export async function cleanupRateLimits(db: DbClient, config?: RateLimitConfig): Promise<void> {
	const { windowMs } = config || { maxRequests: DEFAULT_MAX_REQUESTS, windowMs: WINDOW_MS };
	// Remove rows whose buckets would be fully refilled by now (inactive users)
	const cutoff = Date.now() - windowMs;
	await db.delete(rateLimits).where(lt(rateLimits.lastRefill, cutoff));
}

export { DEFAULT_MAX_REQUESTS, WINDOW_MS };
