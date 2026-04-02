import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const dishes = sqliteTable('dishes', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	description: text('description'),
	imagePath: text('image_path'),
	imageAttribution: text('image_attribution'),
	elo: real('elo').notNull().default(1200),
	submittedBy: text('submitted_by'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const votes = sqliteTable('votes', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	winnerId: text('winner_id')
		.notNull()
		.references(() => dishes.id),
	loserId: text('loser_id')
		.notNull()
		.references(() => dishes.id),
	ipHash: text('ip_hash'),
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

export const dishSubmissions = sqliteTable('dish_submissions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	dishName: text('dish_name').notNull(),
	description: text('description').notNull(),
	submitterName: text('submitter_name'),
	submitterIpHash: text('submitter_ip_hash'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});
