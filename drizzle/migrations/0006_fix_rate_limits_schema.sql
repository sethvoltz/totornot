-- Migration: Fix rate_limits to use single row per fingerprint
-- Uses fingerprint as primary key with window_start and count columns

DROP TABLE IF EXISTS rate_limits;

CREATE TABLE rate_limits (
	fingerprint TEXT PRIMARY KEY,
	action TEXT NOT NULL,
	window_start INTEGER NOT NULL,
	count INTEGER NOT NULL DEFAULT 1
);
