import { getDb } from '$lib/server/db';
import { dishes } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	const ranked = await db.select().from(dishes).orderBy(desc(dishes.elo));
	return { dishes: ranked };
};
