import { drizzle } from 'drizzle-orm/d1';
import { dishes } from './schema';

const seedDishes = [
	{
		id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
		name: 'Mashed Potatoes',
		description: 'Creamy whipped potatoes with butter and cream',
		elo: 1200
	},
	{
		id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
		name: 'French Fries',
		description: 'Crispy golden-fried potato strips',
		elo: 1200
	},
	{
		id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
		name: 'Baked Potato',
		description: 'Fluffy whole potato baked until tender with crispy skin',
		elo: 1200
	},
	{
		id: 'd4e5f6a7-b8c9-0123-def1-234567890123',
		name: 'Potato Soup',
		description: 'Hearty creamy soup loaded with chunks of potato',
		elo: 1200
	},
	{
		id: 'e5f6a7b8-c9d0-1234-ef12-345678901234',
		name: 'Potato Salad',
		description: 'Chilled diced potatoes in a tangy dressing with herbs',
		elo: 1200
	},
	{
		id: 'f6a7b8c9-d0e1-2345-f123-456789012345',
		name: 'Hash Browns',
		description: 'Shredded potato patties pan-fried until golden and crispy',
		elo: 1200
	},
	{
		id: 'a7b8c9d0-e1f2-3456-1234-567890123456',
		name: 'Potato Gratin',
		description: 'Thinly sliced potatoes layered with cream and melted cheese',
		elo: 1200
	},
	{
		id: 'b8c9d0e1-f2a3-4567-2345-678901234567',
		name: "Shepherd's Pie",
		description: 'Savory meat filling topped with fluffy mashed potato crust',
		elo: 1200
	},
	{
		id: 'c9d0e1f2-a3b4-5678-3456-789012345678',
		name: 'Potato Gnocchi',
		description: 'Soft pillowy potato dumplings served with your favourite sauce',
		elo: 1200
	},
	{
		id: 'd0e1f2a3-b4c5-6789-4567-890123456789',
		name: 'Potato Latkes',
		description: 'Crispy pan-fried potato pancakes traditionally served with sour cream',
		elo: 1200
	}
];

export async function seed(db: D1Database) {
	const client = drizzle(db);

	for (const dish of seedDishes) {
		await client.insert(dishes).values(dish).onConflictDoNothing();
	}

	console.log(`Seeded ${seedDishes.length} dishes`);
}
