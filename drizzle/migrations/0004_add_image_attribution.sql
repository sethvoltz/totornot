-- Migration: Add image_attribution column to dishes table

ALTER TABLE dishes ADD COLUMN image_attribution TEXT;
