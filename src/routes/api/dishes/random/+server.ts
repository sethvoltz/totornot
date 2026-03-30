import { getDb } from '$lib/server/db';
import { dishes } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	const db = getDb(platform!.env.DB);

	const randomDishes = await db
		.select()
		.from(dishes)
		.orderBy(sql`RANDOM()`)
		.limit(2);

	if (randomDishes.length < 2) {
		return new Response(JSON.stringify({ dishes: [] }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ dishes: randomDishes }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
