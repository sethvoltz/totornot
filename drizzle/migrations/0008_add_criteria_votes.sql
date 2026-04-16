CREATE TABLE IF NOT EXISTS `dish_criteria_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`dish_id` text NOT NULL,
	`criterion_id` text NOT NULL,
	`score` real NOT NULL,
	`voter_id` text,
	`ip_hash` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`dish_id`) REFERENCES `dishes`(`id`) ON UPDATE no action ON DELETE no action
);
