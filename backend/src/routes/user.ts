/**
 * User Routes
 */

import { Hono } from 'hono';
import { Env } from '../index';

const user = new Hono<{ Bindings: Env }>();

// Get or create user profile
user.get('/profile', async (c) => {
  const authUser = c.get('user');
  const db = c.env.DB;

  try {
    let { results } = await db.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(authUser.uid).all();

    // Create user if doesn't exist
    if (!results || results.length === 0) {
      const timestamp = Math.floor(Date.now() / 1000);
      await db.prepare(
        'INSERT INTO users (id, email, display_name, created_at, updated_at, last_login) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(authUser.uid, authUser.email, authUser.email, timestamp, timestamp, timestamp).run();

      // Create default settings
      await db.prepare(
        'INSERT INTO user_settings (user_id) VALUES (?)'
      ).bind(authUser.uid).run();

      results = await db.prepare(
        'SELECT * FROM users WHERE id = ?'
      ).bind(authUser.uid).all().then(r => r.results);
    } else {
      // Update last login
      await db.prepare(
        'UPDATE users SET last_login = ? WHERE id = ?'
      ).bind(Math.floor(Date.now() / 1000), authUser.uid).run();
    }

    return c.json({ data: results[0] });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Get user settings
user.get('/settings', async (c) => {
  const authUser = c.get('user');
  const db = c.env.DB;

  try {
    const { results } = await db.prepare(
      'SELECT * FROM user_settings WHERE user_id = ?'
    ).bind(authUser.uid).all();

    return c.json({ data: results[0] || null });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

// Update user settings
user.put('/settings', async (c) => {
  const authUser = c.get('user');
  const db = c.env.DB;

  try {
    const body = await c.req.json();
    const {
      spo2_low_threshold,
      spo2_high_threshold,
      heart_rate_low_threshold,
      heart_rate_high_threshold,
      large_font_enabled,
      notifications_enabled
    } = body;

    await db.prepare(
      `UPDATE user_settings 
       SET spo2_low_threshold = ?, spo2_high_threshold = ?,
           heart_rate_low_threshold = ?, heart_rate_high_threshold = ?,
           large_font_enabled = ?, notifications_enabled = ?
       WHERE user_id = ?`
    ).bind(
      spo2_low_threshold, spo2_high_threshold,
      heart_rate_low_threshold, heart_rate_high_threshold,
      large_font_enabled ? 1 : 0, notifications_enabled ? 1 : 0,
      authUser.uid
    ).run();

    return c.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

export default user;
