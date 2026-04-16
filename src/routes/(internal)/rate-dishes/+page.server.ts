import { getDb } from '$lib/server/db';
import { dishes, dishCriteriaVotes } from '$lib/server/db/schema';
import { sql, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, url }) => {
	const db = getDb(platform!.env.DB);
	const requestedId = url.searchParams.get('id');

	// All dishes sorted alphabetically for navigation
	const allDishes = await db
		.select({ id: dishes.id, name: dishes.name })
		.from(dishes)
		.orderBy(dishes.name);

	const totalDishes = allDishes.length;

	const ratedDishesResult = await db
		.select({ count: sql<number>`count(distinct dish_id)` })
		.from(dishCriteriaVotes);
	const ratedDishes = ratedDishesResult[0]?.count ?? 0;

	// Determine which dish to show
	let selectedId: string | null = null;

	if (requestedId && allDishes.some((d) => d.id === requestedId)) {
		selectedId = requestedId;
	} else {
		// Default: least-voted dish
		const leastVoted = await db
			.select({ id: dishes.id, voteCount: sql<number>`count(${dishCriteriaVotes.id})` })
			.from(dishes)
			.leftJoin(dishCriteriaVotes, sql`${dishes.id} = ${dishCriteriaVotes.dishId}`)
			.groupBy(dishes.id)
			.orderBy(sql`count(${dishCriteriaVotes.id}) asc, random()`)
			.limit(1);
		selectedId = leastVoted[0]?.id ?? null;
	}

	if (!selectedId) {
		return {
			dish: null,
			currentAverages: {},
			progress: { rated: ratedDishes, total: totalDishes },
			nav: { prevId: null, nextId: null, index: 0, total: totalDishes }
		};
	}

	// Load full dish data
	const dishRow = await db
		.select({
			id: dishes.id,
			name: dishes.name,
			description: dishes.description,
			imagePath: dishes.imagePath,
			imageAttribution: dishes.imageAttribution
		})
		.from(dishes)
		.where(eq(dishes.id, selectedId))
		.limit(1);

	const dish = dishRow[0] ?? null;

	// Nav: position in alphabetical list
	const index = allDishes.findIndex((d) => d.id === selectedId);
	const prevId = index > 0 ? allDishes[index - 1].id : null;
	const nextId = index < allDishes.length - 1 ? allDishes[index + 1].id : null;

	// Current vote averages
	const currentVotes = await db
		.select({
			criterionId: dishCriteriaVotes.criterionId,
			avgScore: sql<number>`avg(${dishCriteriaVotes.score})`,
			voteCount: sql<number>`count(*)`
		})
		.from(dishCriteriaVotes)
		.where(eq(dishCriteriaVotes.dishId, selectedId))
		.groupBy(dishCriteriaVotes.criterionId);

	const currentAverages: Record<string, { avgScore: number; voteCount: number }> = {};
	for (const vote of currentVotes) {
		currentAverages[vote.criterionId] = {
			avgScore: Math.round(vote.avgScore * 10) / 10,
			voteCount: vote.voteCount
		};
	}

	return {
		dish,
		currentAverages,
		progress: { rated: ratedDishes, total: totalDishes },
		nav: { prevId, nextId, index: index + 1, total: totalDishes }
	};
};
