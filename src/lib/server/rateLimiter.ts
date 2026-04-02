import { and, eq, gt, lt } from 'drizzle-orm';
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

	// Count existing requests in the sliding window
	const existingEntries = await db
		.select()
		.from(rateLimits)
		.where(
			and(
				eq(rateLimits.fingerprint, fingerprint),
				eq(rateLimits.action, action),
				gt(rateLimits.createdAt, windowStart)
			)
		);

	// Check if we're at or over the limit
	if (existingEntries.length >= effectiveConfig.maxRequests) {
		// Find the oldest entry to calculate retry-after
		const oldestEntry = existingEntries.reduce((oldest, entry) =>
			entry.createdAt < oldest.createdAt ? entry : oldest
		);
		const retryAfter = Math.ceil(
			(oldestEntry.createdAt.getTime() + effectiveConfig.windowMs - now) / 1000
		);
		return { allowed: false, retryAfter: Math.max(1, retryAfter) };
	}

	// Insert the new request
	const newId = crypto.randomUUID();
	await db.insert(rateLimits).values({
		id: newId,
		fingerprint,
		action,
		createdAt: new Date()
	});

	// Re-check count after insert (handles race conditions)
	const countAfterInsert = await db
		.select({ count: rateLimits.id })
		.from(rateLimits)
		.where(
			and(
				eq(rateLimits.fingerprint, fingerprint),
				eq(rateLimits.action, action),
				gt(rateLimits.createdAt, windowStart)
			)
		);

	// If we exceeded the limit, remove our entry and deny
	if (countAfterInsert.length > effectiveConfig.maxRequests) {
		await db.delete(rateLimits).where(eq(rateLimits.id, newId));

		// Re-fetch to find oldest for retry-after
		const entries = await db
			.select()
			.from(rateLimits)
			.where(
				and(
					eq(rateLimits.fingerprint, fingerprint),
					eq(rateLimits.action, action),
					gt(rateLimits.createdAt, windowStart)
				)
			);

		if (entries.length > 0) {
			const oldestEntry = entries.reduce((oldest, entry) =>
				entry.createdAt < oldest.createdAt ? entry : oldest
			);
			const retryAfter = Math.ceil(
				(oldestEntry.createdAt.getTime() + effectiveConfig.windowMs - Date.now()) / 1000
			);
			return { allowed: false, retryAfter: Math.max(1, retryAfter) };
		}

		return { allowed: false, retryAfter: Math.ceil(effectiveConfig.windowMs / 1000) };
	}

	return { allowed: true, retryAfter: null };
}

export async function cleanupRateLimits(db: DbClient, config?: RateLimitConfig): Promise<void> {
	const effectiveConfig = config || { maxRequests: DEFAULT_MAX_REQUESTS, windowMs: WINDOW_MS };
	const cutoff = new Date(Date.now() - effectiveConfig.windowMs);

	await db.delete(rateLimits).where(lt(rateLimits.createdAt, cutoff));
}

export { getConfig, DEFAULT_MAX_REQUESTS, WINDOW_MS };
