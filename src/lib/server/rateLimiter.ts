import { and, eq, gt, lt } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { rateLimits } from './db/schema';
import { dev } from '$app/environment';
import type * as schema from './db/schema';

export interface RateLimitConfig {
	maxRequests: number;
	windowMs: number;
}

export interface RateLimitResult {
	allowed: boolean;
	retryAfter: number | null;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
	vote: {
		maxRequests: dev ? 1000 : 100,
		windowMs: 60 * 60 * 1000
	},
	tip: {
		maxRequests: dev ? 1000 : 3,
		windowMs: 60 * 60 * 1000
	}
};

type DbClient = DrizzleD1Database<typeof schema>;

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
	config: RateLimitConfig = DEFAULT_CONFIGS[action] || DEFAULT_CONFIGS.vote
): Promise<RateLimitResult> {
	validateInput(fingerprint, action);

	const now = Date.now();
	const windowStart = new Date(now - config.windowMs);

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
	if (existingEntries.length >= config.maxRequests) {
		// Find the oldest entry to calculate retry-after
		const oldestEntry = existingEntries.reduce((oldest, entry) =>
			entry.createdAt < oldest.createdAt ? entry : oldest
		);
		const retryAfter = Math.ceil((oldestEntry.createdAt.getTime() + config.windowMs - now) / 1000);
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
	if (countAfterInsert.length > config.maxRequests) {
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
				(oldestEntry.createdAt.getTime() + config.windowMs - Date.now()) / 1000
			);
			return { allowed: false, retryAfter: Math.max(1, retryAfter) };
		}

		return { allowed: false, retryAfter: Math.ceil(config.windowMs / 1000) };
	}

	return { allowed: true, retryAfter: null };
}

export async function cleanupRateLimits(
	db: DbClient,
	config: RateLimitConfig = DEFAULT_CONFIGS.vote
): Promise<void> {
	const cutoff = new Date(Date.now() - config.windowMs);

	// Delete entries older than the window
	await db.delete(rateLimits).where(lt(rateLimits.createdAt, cutoff));
}

export { DEFAULT_CONFIGS };
