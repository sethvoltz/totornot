import { getDb } from '$lib/server/db';
import { dishes } from '$lib/server/db/schema';
import {
	parseCookie,
	nextCooldownIds,
	extractCookieValue,
	COOKIE_NAME
} from '$lib/server/dishCooldown';
import { json } from '@sveltejs/kit';
import { sql, notInArray } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform, request, cookies }) => {
	const db = getDb(platform!.env.DB);

	const excludeIds = parseCookie(extractCookieValue(request.headers.get('cookie') ?? ''));

	// Attempt query with exclusion if we have enough dishes to exclude
	let randomDishes =
		excludeIds.length >= 2
			? await db
					.select()
					.from(dishes)
					.where(notInArray(dishes.id, excludeIds))
					.orderBy(sql`RANDOM()`)
					.limit(2)
			: await db
					.select()
					.from(dishes)
					.orderBy(sql`RANDOM()`)
					.limit(2);

	// Safety valve: if exclusion left fewer than 2 results, retry without it
	if (randomDishes.length < 2 && excludeIds.length >= 2) {
		randomDishes = await db
			.select()
			.from(dishes)
			.orderBy(sql`RANDOM()`)
			.limit(2);
	}

	if (randomDishes.length < 2) {
		return json({ dishes: [] });
	}

	// Append new IDs and trim to window
	const newIds = randomDishes.map((d) => d.id);
	const updatedCookie = nextCooldownIds(excludeIds, newIds);

	cookies.set(COOKIE_NAME, updatedCookie.join(','), {
		path: '/api/dishes/random',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 7200
	});

	return json({ dishes: randomDishes });
};
