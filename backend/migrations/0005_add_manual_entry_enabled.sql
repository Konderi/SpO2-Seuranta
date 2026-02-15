-- Migration: Add manual_entry_enabled to user_settings
-- Date: 2026-02-15
-- Description: Adds a boolean flag to allow users to manually select date/time for measurements

-- Add manual_entry_enabled column to user_settings table
ALTER TABLE user_settings ADD COLUMN manual_entry_enabled INTEGER DEFAULT 0;
