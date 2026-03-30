-- Migration: Add image_path column to dishes table

ALTER TABLE dishes ADD COLUMN image_path TEXT;
