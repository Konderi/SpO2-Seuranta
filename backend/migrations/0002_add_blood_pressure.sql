-- Blood Pressure Support Migration
-- Created: 2026-02-12
-- Adds systolic and diastolic blood pressure fields to all measurement tables

-- Add blood pressure columns to daily_measurements
ALTER TABLE daily_measurements 
  ADD COLUMN systolic INTEGER CHECK(systolic IS NULL OR (systolic >= 80 AND systolic <= 200));

ALTER TABLE daily_measurements 
  ADD COLUMN diastolic INTEGER CHECK(diastolic IS NULL OR (diastolic >= 50 AND diastolic <= 130));

-- Add blood pressure columns to exercise_measurements (before exercise)
ALTER TABLE exercise_measurements 
  ADD COLUMN systolic_before INTEGER CHECK(systolic_before IS NULL OR (systolic_before >= 80 AND systolic_before <= 200));

ALTER TABLE exercise_measurements 
  ADD COLUMN diastolic_before INTEGER CHECK(diastolic_before IS NULL OR (diastolic_before >= 50 AND diastolic_before <= 130));

-- Add blood pressure columns to exercise_measurements (after exercise)
ALTER TABLE exercise_measurements 
  ADD COLUMN systolic_after INTEGER CHECK(systolic_after IS NULL OR (systolic_after >= 80 AND systolic_after <= 200));

ALTER TABLE exercise_measurements 
  ADD COLUMN diastolic_after INTEGER CHECK(diastolic_after IS NULL OR (diastolic_after >= 50 AND diastolic_after <= 130));

-- Add blood pressure threshold settings
ALTER TABLE user_settings 
  ADD COLUMN systolic_high_threshold INTEGER DEFAULT 140;

ALTER TABLE user_settings 
  ADD COLUMN diastolic_high_threshold INTEGER DEFAULT 90;

ALTER TABLE user_settings 
  ADD COLUMN systolic_low_threshold INTEGER DEFAULT 90;

ALTER TABLE user_settings 
  ADD COLUMN diastolic_low_threshold INTEGER DEFAULT 60;

-- Note: Blood pressure is optional - all columns are nullable
-- Normal BP ranges:
--   Systolic: 90-120 mmHg (normal), <90 (low), ≥140 (high)
--   Diastolic: 60-80 mmHg (normal), <60 (low), ≥90 (high)
