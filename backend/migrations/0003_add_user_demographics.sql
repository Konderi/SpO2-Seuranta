-- Add user demographics (gender and age) to user_settings
-- Migration 0003 - Created: 2026-02-12

-- Add gender column (male/female/other)
ALTER TABLE user_settings 
ADD COLUMN gender TEXT CHECK(gender IS NULL OR gender IN ('male', 'female', 'other'));

-- Add birth_year column (for age calculation)
ALTER TABLE user_settings 
ADD COLUMN birth_year INTEGER CHECK(birth_year IS NULL OR (birth_year >= 1900 AND birth_year <= 2026));

-- Add date_of_birth as alternative (more precise than birth_year)
-- Stored as ISO 8601 string: YYYY-MM-DD
ALTER TABLE user_settings 
ADD COLUMN date_of_birth TEXT;

-- Note: We store birth_year/date_of_birth instead of age because:
-- 1. Age changes every year, birth date doesn't
-- 2. Calculate age dynamically based on current date
-- 3. More accurate for medical thresholds
