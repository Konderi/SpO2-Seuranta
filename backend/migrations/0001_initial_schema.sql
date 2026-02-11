-- Hapetus Database Schema - Initial Migration
-- Created: 2026-02-11

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  last_login INTEGER
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  spo2_low_threshold INTEGER DEFAULT 90,
  spo2_high_threshold INTEGER DEFAULT 100,
  heart_rate_low_threshold INTEGER DEFAULT 50,
  heart_rate_high_threshold INTEGER DEFAULT 120,
  large_font_enabled INTEGER DEFAULT 0,
  notifications_enabled INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daily measurements table
CREATE TABLE IF NOT EXISTS daily_measurements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  spo2 INTEGER NOT NULL CHECK(spo2 >= 50 AND spo2 <= 100),
  heart_rate INTEGER NOT NULL CHECK(heart_rate >= 30 AND heart_rate <= 250),
  notes TEXT,
  measured_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Exercise measurements table
CREATE TABLE IF NOT EXISTS exercise_measurements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  exercise_duration INTEGER,
  spo2_before INTEGER NOT NULL CHECK(spo2_before >= 50 AND spo2_before <= 100),
  heart_rate_before INTEGER NOT NULL CHECK(heart_rate_before >= 30 AND heart_rate_before <= 250),
  spo2_after INTEGER NOT NULL CHECK(spo2_after >= 50 AND spo2_after <= 100),
  heart_rate_after INTEGER NOT NULL CHECK(heart_rate_after >= 30 AND heart_rate_after <= 250),
  notes TEXT,
  measured_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_user_date ON daily_measurements(user_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_user_date ON exercise_measurements(user_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_user_settings_timestamp 
AFTER UPDATE ON user_settings
BEGIN
  UPDATE user_settings SET updated_at = strftime('%s', 'now') WHERE user_id = NEW.user_id;
END;

CREATE TRIGGER IF NOT EXISTS update_daily_measurements_timestamp 
AFTER UPDATE ON daily_measurements
BEGIN
  UPDATE daily_measurements SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_exercise_measurements_timestamp 
AFTER UPDATE ON exercise_measurements
BEGIN
  UPDATE exercise_measurements SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
END;
