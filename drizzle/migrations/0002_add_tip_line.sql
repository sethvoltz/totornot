-- Migration: Add tip line feature
-- Created: 2026-04-01
-- Adds submitted_by column to dishes and creates dish_submissions table

-- Add submitted_by column to dishes table
-- Populated when a tip submission is accepted and promoted to a dish
ALTER TABLE dishes ADD COLUMN submitted_by TEXT;

-- Create dish_submissions table for tip line submissions
-- This table is write-only from the app - no read endpoints exist
-- Access is protected by Turnstile verification and rate limiting
CREATE TABLE dish_submissions (
	id TEXT PRIMARY KEY,
	dish_name TEXT NOT NULL,
	description TEXT NOT NULL,
	submitter_name TEXT,
	created_at INTEGER NOT NULL
);
