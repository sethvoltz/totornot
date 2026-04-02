import { getDb } from '$lib/server/db';
import { dishes, votes } from '$lib/server/db/schema';
import { processVote } from '$lib/elo';
import { eq, sql } from 'drizzle-orm';
import { hashIp } from '$lib/server/crypto';
import { checkRateLimit } from '$lib/server/rateLimiter';
import type { RequestHandler } from './$types';

function validateCsrf(request: Request): boolean {
	const origin = request.headers.get('Origin');
	const referer = request.headers.get('Referer');

	const allowedOrigins = ['https://totornot.com', 'https://staging.totornot.com'];

	if (origin && allowedOrigins.some((o) => origin.startsWith(o))) {
		return true;
	}

	if (referer && allowedOrigins.some((o) => referer.startsWith(o))) {
		return true;
	}

	return false;
}

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		if (!validateCsrf(request)) {
			return new Response(JSON.stringify({ error: 'Forbidden' }), {
				status: 403,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const ip = request.headers.get('CF-Connecting-IP');
		const ipHashSecret = platform?.env.IP_HASH_SECRET;

		if (!ipHashSecret) {
			console.error('IP_HASH_SECRET not configured');
			return new Response(JSON.stringify({ error: 'Server configuration error' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const ipHash = ip ? await hashIp(ip, ipHashSecret) : null;

		const body = (await request.json()) as { winnerId?: string; loserId?: string };
		const { winnerId, loserId } = body;

		if (!winnerId || !loserId) {
			return new Response(JSON.stringify({ error: 'winnerId and loserId are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (winnerId === loserId) {
			return new Response(JSON.stringify({ error: 'winnerId and loserId must be different' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const db = getDb(platform!.env.DB);

		// Rate limiting
		if (ipHash) {
			const rateLimitResult = await checkRateLimit(db, ipHash, 'vote');

			if (!rateLimitResult.allowed) {
				return new Response(
					JSON.stringify({
						error: 'Rate limit exceeded',
						retryAfter: rateLimitResult.retryAfter
					}),
					{
						status: 429,
						headers: {
							'Content-Type': 'application/json',
							'Retry-After': String(rateLimitResult.retryAfter)
						}
					}
				);
			}
		}

		const winnerResult = await db.select().from(dishes).where(eq(dishes.id, winnerId)).limit(1);
		const loserResult = await db.select().from(dishes).where(eq(dishes.id, loserId)).limit(1);

		if (winnerResult.length === 0 || loserResult.length === 0) {
			return new Response(JSON.stringify({ error: 'One or both dishes not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const winnerDish = winnerResult[0];
		const loserDish = loserResult[0];

		await db.insert(votes).values({
			winnerId,
			loserId,
			ipHash
		});

		const { winner: winnerElo, loser: loserElo } = processVote(winnerDish.elo, loserDish.elo);

		const winnerDelta = winnerElo - winnerDish.elo;
		const loserDelta = loserElo - loserDish.elo;

		await db
			.update(dishes)
			.set({ elo: sql`elo + ${winnerDelta}` })
			.where(eq(dishes.id, winnerId));
		await db
			.update(dishes)
			.set({ elo: sql`elo + ${loserDelta}` })
			.where(eq(dishes.id, loserId));

		return new Response(
			JSON.stringify({
				winnerId,
				loserId,
				winnerElo,
				loserElo
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Vote error:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
