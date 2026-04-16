import { getDb } from '$lib/server/db';
import { dishes, dishCriteriaVotes } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);

	const totalDishesResult = await db.select({ count: sql<number>`count(*)` }).from(dishes);
	const totalDishes = totalDishesResult[0]?.count ?? 0;

	const ratedDishesResult = await db
		.select({ count: sql<number>`count(distinct dish_id)` })
		.from(dishCriteriaVotes);
	const ratedDishes = ratedDishesResult[0]?.count ?? 0;

	const leastVotedDish = await db
		.select({
			id: dishes.id,
			name: dishes.name,
			description: dishes.description,
			imagePath: dishes.imagePath,
			imageAttribution: dishes.imageAttribution,
			voteCount: sql<number>`count(${dishCriteriaVotes.id})`
		})
		.from(dishes)
		.leftJoin(dishCriteriaVotes, sql`${dishes.id} = ${dishCriteriaVotes.dishId}`)
		.groupBy(dishes.id)
		.orderBy(sql`count(${dishCriteriaVotes.id}) asc, random()`)
		.limit(1);

	const dish = leastVotedDish[0];

	const currentVotes =
		dish && dish.voteCount > 0
			? await db
					.select({
						criterionId: dishCriteriaVotes.criterionId,
						avgScore: sql<number>`avg(${dishCriteriaVotes.score})`,
						voteCount: sql<number>`count(*)`
					})
					.from(dishCriteriaVotes)
					.where(sql`${dishCriteriaVotes.dishId} = ${dish.id}`)
					.groupBy(dishCriteriaVotes.criterionId)
			: [];

	const currentAverages: Record<string, { avgScore: number; voteCount: number }> = {};
	for (const vote of currentVotes) {
		currentAverages[vote.criterionId] = {
			avgScore: Math.round(vote.avgScore * 10) / 10,
			voteCount: vote.voteCount
		};
	}

	return {
		dish: dish
			? {
					id: dish.id,
					name: dish.name,
					description: dish.description,
					imagePath: dish.imagePath,
					imageAttribution: dish.imageAttribution
				}
			: null,
		currentAverages,
		progress: {
			rated: ratedDishes,
			total: totalDishes
		}
	};
};
