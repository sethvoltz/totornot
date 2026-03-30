import { getDb } from '$lib/server/db';
import { dishes } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);

	// Get two random dishes using ORDER BY RANDOM()
	const randomDishes = await db
		.select()
		.from(dishes)
		.orderBy(sql`RANDOM()`)
		.limit(2);

	// If we don't have at least 2 dishes, return empty
	if (randomDishes.length < 2) {
		return { dishes: [] };
	}

	return { dishes: randomDishes };
};
