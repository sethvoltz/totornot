import { getDb } from '$lib/server/db';
import { dishes, votes } from '$lib/server/db/schema';
import { processVote } from '$lib/elo';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const ip = request.headers.get('CF-Connecting-IP') || null;
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
			ip
		});

		const { winner: winnerElo, loser: loserElo } = processVote(winnerDish.elo, loserDish.elo);

		await db.update(dishes).set({ elo: winnerElo }).where(eq(dishes.id, winnerId));
		await db.update(dishes).set({ elo: loserElo }).where(eq(dishes.id, loserId));

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
