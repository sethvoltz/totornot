-- Initial migration: Create dishes, votes, and rate_limits tables

CREATE TABLE IF NOT EXISTS dishes (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT,
	elo REAL NOT NULL DEFAULT 1200,
	created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS votes (
	id TEXT PRIMARY KEY,
	dish_id TEXT NOT NULL REFERENCES dishes(id),
	value INTEGER NOT NULL,
	fingerprint TEXT NOT NULL,
	created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_limits (
	id TEXT PRIMARY KEY,
	fingerprint TEXT NOT NULL,
	action TEXT NOT NULL,
	window_start INTEGER NOT NULL,
	count INTEGER NOT NULL DEFAULT 1
);
