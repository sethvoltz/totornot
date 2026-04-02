-- Migration: Rename IP columns to ip_hash for hashed IP storage
-- Rename columns
ALTER TABLE votes RENAME COLUMN ip TO ip_hash;
ALTER TABLE dish_submissions RENAME COLUMN submitter_ip TO submitter_ip_hash;
