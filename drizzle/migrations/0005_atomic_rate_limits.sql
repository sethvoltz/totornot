-- Migration: Rate limits with sliding window support
-- Each request gets a row with timestamp for proper sliding window calculation
-- Cleanup needed to prevent unbounded growth

DROP TABLE IF EXISTS rate_limits;

CREATE TABLE rate_limits (
	id TEXT PRIMARY KEY,
	fingerprint TEXT NOT NULL,
	action TEXT NOT NULL,
	created_at INTEGER NOT NULL
);

-- Index for efficient sliding window queries
CREATE INDEX idx_rate_limits_lookup ON rate_limits(fingerprint, action, created_at);
