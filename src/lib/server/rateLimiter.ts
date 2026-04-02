import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { rateLimits } from './db/schema';
import type * as schema from './db/schema';

export interface RateLimitConfig {
	maxRequests: number;
	windowMs: number;
}

export interface RateLimitResult {
	allowed: boolean;
	retryAfter: number | null;
}

export interface RateLimitEnv {
	VOTE_RATE_LIMIT_PER_HOUR?: string;
	TIP_RATE_LIMIT_PER_HOUR?: string;
}

const DEFAULT_MAX_REQUESTS = 1000;
const WINDOW_MS = 60 * 60 * 1000;

type DbClient = DrizzleD1Database<typeof schema>;

function getConfig(action: string, env?: RateLimitEnv): RateLimitConfig {
	const maxRequests =
		action === 'tip'
			? parseInt(env?.TIP_RATE_LIMIT_PER_HOUR || '', 10) || DEFAULT_MAX_REQUESTS
			: parseInt(env?.VOTE_RATE_LIMIT_PER_HOUR || '', 10) || DEFAULT_MAX_REQUESTS;

	return {
		maxRequests,
		windowMs: WINDOW_MS
	};
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

	const effectiveConfig = config || getConfig(action, env);
	const now = Date.now();
	const windowStart = new Date(now - effectiveConfig.windowMs);

	const existing = await db
		.select()
		.from(rateLimits)
		.where(eq(rateLimits.fingerprint, fingerprint))
		.limit(1);

	if (existing.length === 0) {
		await db.insert(rateLimits).values({
			fingerprint,
			action,
			windowStart: new Date(),
			count: 1
		});
		return { allowed: true, retryAfter: null };
	}

	const record = existing[0];

	if (record.windowStart < windowStart) {
		await db
			.update(rateLimits)
			.set({ windowStart: new Date(), count: 1, action })
			.where(eq(rateLimits.fingerprint, fingerprint));
		return { allowed: true, retryAfter: null };
	}

	if (record.count >= effectiveConfig.maxRequests) {
		const retryAfter = Math.ceil(
			(record.windowStart.getTime() + effectiveConfig.windowMs - now) / 1000
		);
		return { allowed: false, retryAfter: Math.max(1, retryAfter) };
	}

	await db
		.update(rateLimits)
		.set({ count: record.count + 1 })
		.where(eq(rateLimits.fingerprint, fingerprint));

	return { allowed: true, retryAfter: null };
}

export async function cleanupRateLimits(db: DbClient, config?: RateLimitConfig): Promise<void> {
	const effectiveConfig = config || { maxRequests: DEFAULT_MAX_REQUESTS, windowMs: WINDOW_MS };
	const cutoff = new Date(Date.now() - effectiveConfig.windowMs);

	const { lt } = await import('drizzle-orm');
	await db.delete(rateLimits).where(lt(rateLimits.windowStart, cutoff));
}

export { getConfig, DEFAULT_MAX_REQUESTS, WINDOW_MS };
