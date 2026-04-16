import { getDb } from '$lib/server/db';
import { dishes, dishCriteriaVotes } from '$lib/server/db/schema';
import { hashIp } from '$lib/server/crypto';
import { checkRateLimit } from '$lib/server/rateLimiter';
import { captureServerEvent } from '$lib/server/posthog';
import { validateCsrf } from '$lib/server/csrf';
import { topsis, TopsisError } from '$lib/server/topsis';
import { CRITERIA_IDS } from '$lib/criteria';
import { sql } from 'drizzle-orm';
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

		const body = (await request.json()) as { weights?: Record<string, number> };
		const { weights } = body;

		if (!weights) {
			return new Response(JSON.stringify({ error: 'weights are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const missingCriteria = CRITERIA_IDS.filter((id) => !(id in weights));
		if (missingCriteria.length > 0) {
			return new Response(
				JSON.stringify({ error: `Missing criteria: ${missingCriteria.join(', ')}` }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const roundedWeights: Record<string, number> = {};
		for (const [criterionId, score] of Object.entries(weights)) {
			if (typeof score !== 'number' || score < -5.0 || score > 5.0) {
				return new Response(
					JSON.stringify({ error: `Invalid score for ${criterionId}: must be -5.0 to 5.0` }),
					{
						status: 400,
						headers: { 'Content-Type': 'application/json' }
					}
				);
			}
			roundedWeights[criterionId] = Math.round(score * 10) / 10;
		}

		const db = getDb(platform!.env.DB);

		if (ipHash) {
			const rateLimitResult = await checkRateLimit(db, ipHash, 'spud_match', platform?.env);

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

		const averagedVotes = await db
			.select({
				dishId: dishCriteriaVotes.dishId,
				criterionId: dishCriteriaVotes.criterionId,
				avgScore: sql<number>`avg(${dishCriteriaVotes.score})`
			})
			.from(dishCriteriaVotes)
			.groupBy(dishCriteriaVotes.dishId, dishCriteriaVotes.criterionId);

		const matrix = new Map<string, Map<string, number>>();
		for (const vote of averagedVotes) {
			if (!matrix.has(vote.dishId)) {
				matrix.set(vote.dishId, new Map());
			}
			matrix.get(vote.dishId)!.set(vote.criterionId, Math.round(vote.avgScore * 10) / 10);
		}

		let results;
		try {
			results = topsis({ matrix, weights: roundedWeights, topN: 1 });
		} catch (error) {
			if (error instanceof TopsisError) {
				return new Response(JSON.stringify({ error: error.message }), {
					status: 503,
					headers: { 'Content-Type': 'application/json' }
				});
			}
			throw error;
		}

		if (results.length === 0) {
			return new Response(
				JSON.stringify({ error: 'No suitable dishes found with current ratings' }),
				{
					status: 503,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const topResult = results[0];

		const dishResult = await db
			.select()
			.from(dishes)
			.where(sql`${dishes.id} = ${topResult.dishId}`)
			.limit(1);

		if (dishResult.length === 0) {
			return new Response(JSON.stringify({ error: 'Dish not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const dish = dishResult[0];

		captureServerEvent({
			distinctId: ipHash ?? 'anonymous',
			event: 'spud_match_completed',
			properties: {
				dish_id: dish.id,
				dish_name: dish.name,
				score: topResult.score,
				weights: roundedWeights
			}
		});

		return new Response(
			JSON.stringify({
				match: {
					dishId: dish.id,
					name: dish.name,
					description: dish.description,
					imagePath: dish.imagePath,
					imageAttribution: dish.imageAttribution,
					score: Math.round(topResult.score * 1000) / 1000
				}
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Spud match error:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
