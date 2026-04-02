-- Migration: Token bucket rate limiting
-- One row per (fingerprint, action) pair
-- tokens: current token count (REAL to allow fractional accumulation)
-- last_refill: epoch milliseconds when tokens were last calculated

DROP TABLE IF EXISTS rate_limits;

CREATE TABLE rate_limits (
	fingerprint TEXT NOT NULL,
	action TEXT NOT NULL,
	tokens REAL NOT NULL,
	last_refill INTEGER NOT NULL,
	PRIMARY KEY (fingerprint, action)
);
