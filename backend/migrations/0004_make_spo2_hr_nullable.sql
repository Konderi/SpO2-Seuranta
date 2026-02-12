-- Migration: Make SpO2 and Heart Rate nullable for BP-only measurements
-- Created: 2026-02-12
-- Description: Allow null values for spo2 and heart_rate to support BP-only measurements
-- Note: This migration assumes 0002 and 0003 have already been applied

-- SQLite doesn't support ALTER COLUMN, so we need to recreate the table
-- Step 1: Create new table with nullable spo2 and heart_rate
CREATE TABLE daily_measurements_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  spo2 INTEGER CHECK(spo2 IS NULL OR (spo2 >= 50 AND spo2 <= 100)),
  heart_rate INTEGER CHECK(heart_rate IS NULL OR (heart_rate >= 30 AND heart_rate <= 250)),
  systolic INTEGER CHECK(systolic IS NULL OR (systolic >= 80 AND systolic <= 200)),
  diastolic INTEGER CHECK(diastolic IS NULL OR (diastolic >= 50 AND diastolic <= 130)),
  notes TEXT,
  measured_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  -- Ensure at least one measurement type is present
  CHECK (
    (spo2 IS NOT NULL AND heart_rate IS NOT NULL) OR 
    (systolic IS NOT NULL AND diastolic IS NOT NULL)
  )
);

-- Step 2: Copy data from old table
INSERT INTO daily_measurements_new 
SELECT id, user_id, spo2, heart_rate, systolic, diastolic, notes, measured_at, created_at, updated_at
FROM daily_measurements;

-- Step 3: Drop old table
DROP TABLE daily_measurements;

-- Step 4: Rename new table to original name
ALTER TABLE daily_measurements_new RENAME TO daily_measurements;

-- Step 5: Recreate indexes
CREATE INDEX idx_daily_user_measured ON daily_measurements(user_id, measured_at DESC);
CREATE INDEX idx_daily_measured_at ON daily_measurements(measured_at DESC);
