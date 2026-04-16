import { getDb } from '$lib/server/db';
import { dishes, dishCriteriaVotes } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hashIp } from '$lib/server/crypto';
import { checkRateLimit } from '$lib/server/rateLimiter';
import { captureServerEvent } from '$lib/server/posthog';
import { validateCsrf } from '$lib/server/csrf';
import { CRITERIA_IDS } from '$lib/criteria';
import type { RequestHandler } from './$types';

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
		const ipHash = ip && ipHashSecret ? await hashIp(ip, ipHashSecret) : null;

		if (!ipHashSecret) {
			console.warn('IP_HASH_SECRET not configured - rate limiting disabled');
		}

		const body = (await request.json()) as { dishId?: string; votes?: Record<string, number> };
		const { dishId, votes } = body;

		if (!dishId || !votes) {
			return new Response(JSON.stringify({ error: 'dishId and votes are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const missingCriteria = CRITERIA_IDS.filter((id) => !(id in votes));
		if (missingCriteria.length > 0) {
			return new Response(
				JSON.stringify({ error: `Missing criteria: ${missingCriteria.join(', ')}` }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		for (const [criterionId, score] of Object.entries(votes)) {
			if (typeof score !== 'number' || score < -5.0 || score > 5.0) {
				return new Response(
					JSON.stringify({ error: `Invalid score for ${criterionId}: must be -5.0 to 5.0` }),
					{
						status: 400,
						headers: { 'Content-Type': 'application/json' }
					}
				);
			}
		}

		const db = getDb(platform!.env.DB);

		if (ipHash) {
			const rateLimitResult = await checkRateLimit(db, ipHash, 'criteria_vote', platform?.env);

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

		const dishResult = await db.select().from(dishes).where(eq(dishes.id, dishId)).limit(1);

		if (dishResult.length === 0) {
			return new Response(JSON.stringify({ error: 'Dish not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const voteRows = CRITERIA_IDS.map((criterionId) => ({
			dishId,
			criterionId,
			score: Math.round(votes[criterionId] * 10) / 10,
			ipHash
		}));

		await db.insert(dishCriteriaVotes).values(voteRows);

		captureServerEvent({
			distinctId: ipHash ?? 'anonymous',
			event: 'criteria_vote_completed',
			properties: {
				dish_id: dishId,
				dish_name: dishResult[0].name,
				votes
			}
		});

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Criteria vote error:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
