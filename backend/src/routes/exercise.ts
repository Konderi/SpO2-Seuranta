/**
 * Exercise Measurements Routes
 */

import { Hono } from 'hono';
import { Env } from '../index';

const exercise = new Hono<{ Bindings: Env }>();

// Get all exercise measurements for user
exercise.get('/', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;

  try {
    const { results } = await db.prepare(
      `SELECT * FROM exercise_measurements 
       WHERE user_id = ? 
       ORDER BY measured_at DESC 
       LIMIT 100`
    ).bind(user.uid).all();

    return c.json({ data: results });
  } catch (error) {
    console.error('Error fetching exercise measurements:', error);
    return c.json({ error: 'Failed to fetch measurements' }, 500);
  }
});

// Create new exercise measurement
exercise.post('/', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;

  try {
    const body = await c.req.json();
    const {
      exercise_type,
      exercise_duration,
      spo2_before,
      heart_rate_before,
      spo2_after,
      heart_rate_after,
      notes,
      measured_at
    } = body;

    // Validation
    if (!exercise_type || !spo2_before || !heart_rate_before || !spo2_after || !heart_rate_after || !measured_at) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const id = crypto.randomUUID();
    const timestamp = Math.floor(Date.now() / 1000);

    await db.prepare(
      `INSERT INTO exercise_measurements 
       (id, user_id, exercise_type, exercise_duration, spo2_before, heart_rate_before, 
        spo2_after, heart_rate_after, notes, measured_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, user.uid, exercise_type, exercise_duration || null,
      spo2_before, heart_rate_before, spo2_after, heart_rate_after,
      notes || null, measured_at, timestamp, timestamp
    ).run();

    return c.json({
      message: 'Exercise measurement created successfully',
      data: { id, exercise_type, spo2_before, heart_rate_before, spo2_after, heart_rate_after }
    }, 201);
  } catch (error) {
    console.error('Error creating exercise measurement:', error);
    return c.json({ error: 'Failed to create measurement' }, 500);
  }
});

// Delete exercise measurement
exercise.delete('/:id', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const id = c.req.param('id');

  try {
    const { results } = await db.prepare(
      'SELECT user_id FROM exercise_measurements WHERE id = ?'
    ).bind(id).all();

    if (!results || results.length === 0) {
      return c.json({ error: 'Measurement not found' }, 404);
    }

    if (results[0].user_id !== user.uid) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await db.prepare('DELETE FROM exercise_measurements WHERE id = ?').bind(id).run();

    return c.json({ message: 'Measurement deleted successfully' });
  } catch (error) {
    console.error('Error deleting exercise measurement:', error);
    return c.json({ error: 'Failed to delete measurement' }, 500);
  }
});

export default exercise;
