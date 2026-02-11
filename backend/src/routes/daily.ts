/**
 * Daily Measurements Routes
 */

import { Hono } from 'hono';
import { Env } from '../index';

const daily = new Hono<{ Bindings: Env }>();

// Get all daily measurements for user
daily.get('/', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;

  try {
    const { results } = await db.prepare(
      `SELECT * FROM daily_measurements 
       WHERE user_id = ? 
       ORDER BY measured_at DESC 
       LIMIT 100`
    ).bind(user.uid).all();

    return c.json({ data: results });
  } catch (error) {
    console.error('Error fetching daily measurements:', error);
    return c.json({ error: 'Failed to fetch measurements' }, 500);
  }
});

// Get daily measurements by date range
daily.get('/range', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const startDate = c.req.query('start');
  const endDate = c.req.query('end');

  if (!startDate || !endDate) {
    return c.json({ error: 'Start and end dates are required' }, 400);
  }

  try {
    const { results } = await db.prepare(
      `SELECT * FROM daily_measurements 
       WHERE user_id = ? AND measured_at BETWEEN ? AND ?
       ORDER BY measured_at DESC`
    ).bind(user.uid, startDate, endDate).all();

    return c.json({ data: results });
  } catch (error) {
    console.error('Error fetching daily measurements:', error);
    return c.json({ error: 'Failed to fetch measurements' }, 500);
  }
});

// Create new daily measurement
daily.post('/', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;

  try {
    const body = await c.req.json();
    const { spo2, heart_rate, notes, measured_at } = body;

    // Validation
    if (!spo2 || !heart_rate || !measured_at) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (spo2 < 50 || spo2 > 100) {
      return c.json({ error: 'SpO2 must be between 50 and 100' }, 400);
    }

    if (heart_rate < 30 || heart_rate > 250) {
      return c.json({ error: 'Heart rate must be between 30 and 250' }, 400);
    }

    const id = crypto.randomUUID();
    const timestamp = Math.floor(Date.now() / 1000);

    await db.prepare(
      `INSERT INTO daily_measurements (id, user_id, spo2, heart_rate, notes, measured_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, user.uid, spo2, heart_rate, notes || null, measured_at, timestamp, timestamp).run();

    return c.json({
      message: 'Measurement created successfully',
      data: { id, spo2, heart_rate, notes, measured_at }
    }, 201);
  } catch (error) {
    console.error('Error creating daily measurement:', error);
    return c.json({ error: 'Failed to create measurement' }, 500);
  }
});

// Update daily measurement
daily.put('/:id', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const id = c.req.param('id');

  try {
    const body = await c.req.json();
    const { spo2, heart_rate, notes } = body;

    // Verify ownership
    const { results } = await db.prepare(
      'SELECT user_id FROM daily_measurements WHERE id = ?'
    ).bind(id).all();

    if (!results || results.length === 0) {
      return c.json({ error: 'Measurement not found' }, 404);
    }

    if (results[0].user_id !== user.uid) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await db.prepare(
      `UPDATE daily_measurements 
       SET spo2 = ?, heart_rate = ?, notes = ?
       WHERE id = ?`
    ).bind(spo2, heart_rate, notes || null, id).run();

    return c.json({ message: 'Measurement updated successfully' });
  } catch (error) {
    console.error('Error updating daily measurement:', error);
    return c.json({ error: 'Failed to update measurement' }, 500);
  }
});

// Delete daily measurement
daily.delete('/:id', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const id = c.req.param('id');

  try {
    // Verify ownership
    const { results } = await db.prepare(
      'SELECT user_id FROM daily_measurements WHERE id = ?'
    ).bind(id).all();

    if (!results || results.length === 0) {
      return c.json({ error: 'Measurement not found' }, 404);
    }

    if (results[0].user_id !== user.uid) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await db.prepare('DELETE FROM daily_measurements WHERE id = ?').bind(id).run();

    return c.json({ message: 'Measurement deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily measurement:', error);
    return c.json({ error: 'Failed to delete measurement' }, 500);
  }
});

export default daily;
