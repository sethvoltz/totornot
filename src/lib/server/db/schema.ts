import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const dishes = sqliteTable('dishes', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const votes = sqliteTable('votes', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	dishId: text('dish_id')
		.notNull()
		.references(() => dishes.id),
	value: integer('value').notNull(), // 1 = "to", -1 = "not"
	fingerprint: text('fingerprint').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const rateLimits = sqliteTable('rate_limits', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	fingerprint: text('fingerprint').notNull(),
	action: text('action').notNull(),
	windowStart: integer('window_start', { mode: 'timestamp' }).notNull(),
	count: integer('count').notNull().default(1)
});
