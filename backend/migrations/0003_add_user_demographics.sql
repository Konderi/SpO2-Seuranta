-- Migration 0003: Add user demographics fields
-- Adds gender and birth_year to user_settings table

ALTER TABLE user_settings ADD COLUMN gender TEXT;
ALTER TABLE user_settings ADD COLUMN birth_year INTEGER;
