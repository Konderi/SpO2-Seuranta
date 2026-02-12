/**
 * Statistics Routes
 */

import { Hono } from 'hono';
import { Env } from '../index';

const stats = new Hono<{ Bindings: Env }>();

// Get 7-day averages
stats.get('/week', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;

  try {
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);

    const { results } = await db.prepare(
      `SELECT 
        AVG(spo2) as avg_spo2,
        AVG(heart_rate) as avg_heart_rate,
        AVG(systolic) as avg_systolic,
        AVG(diastolic) as avg_diastolic,
        MIN(spo2) as min_spo2,
        MAX(spo2) as max_spo2,
        MIN(heart_rate) as min_heart_rate,
        MAX(heart_rate) as max_heart_rate,
        MIN(systolic) as min_systolic,
        MAX(systolic) as max_systolic,
        MIN(diastolic) as min_diastolic,
        MAX(diastolic) as max_diastolic,
        COUNT(*) as count
       FROM daily_measurements 
       WHERE user_id = ? AND measured_at >= ?`
    ).bind(user.uid, sevenDaysAgo).all();

    return c.json({ data: results[0] || null });
  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// Get statistics for custom date range
stats.get('/range', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const startDate = c.req.query('start');
  const endDate = c.req.query('end');

  if (!startDate || !endDate) {
    return c.json({ error: 'Start and end dates are required' }, 400);
  }

  try {
    const { results } = await db.prepare(
      `SELECT 
        AVG(spo2) as avg_spo2,
        AVG(heart_rate) as avg_heart_rate,
        AVG(systolic) as avg_systolic,
        AVG(diastolic) as avg_diastolic,
        MIN(spo2) as min_spo2,
        MAX(spo2) as max_spo2,
        MIN(heart_rate) as min_heart_rate,
        MAX(heart_rate) as max_heart_rate,
        MIN(systolic) as min_systolic,
        MAX(systolic) as max_systolic,
        MIN(diastolic) as min_diastolic,
        MAX(diastolic) as max_diastolic,
        COUNT(*) as count
       FROM daily_measurements 
       WHERE user_id = ? AND measured_at BETWEEN ? AND ?`
    ).bind(user.uid, startDate, endDate).all();

    return c.json({ data: results[0] || null });
  } catch (error) {
    console.error('Error fetching range stats:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// Get daily aggregates for charting
stats.get('/daily', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const days = parseInt(c.req.query('days') || '30');

  try {
    const startDate = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);

    const { results } = await db.prepare(
      `SELECT 
        DATE(measured_at, 'unixepoch') as date,
        AVG(spo2) as avg_spo2,
        AVG(heart_rate) as avg_heart_rate,
        AVG(systolic) as avg_systolic,
        AVG(diastolic) as avg_diastolic,
        MIN(spo2) as min_spo2,
        MAX(spo2) as max_spo2,
        COUNT(*) as count
       FROM daily_measurements 
       WHERE user_id = ? AND measured_at >= ?
       GROUP BY date
       ORDER BY date DESC`
    ).bind(user.uid, startDate).all();

    return c.json({ data: results });
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

export default stats;
