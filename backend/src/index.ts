/**
 * Hapetus API - Cloudflare Workers Backend
 * Main entry point for the API
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { decode, verify } from '@tsndr/cloudflare-worker-jwt';

export interface Env {
  DB: D1Database;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
  CORS_ORIGIN: string;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Health check
app.get('/', (c) => {
  return c.json({
    name: 'Hapetus API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Public routes
app.get('/health', (c) => c.json({ status: 'ok' }));

// Test database connection
app.get('/api/test-db', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT 1 as test').first();
    return c.json({ success: true, result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

interface AuthUser {
  uid: string;
  email?: string;
}

async function verifyFirebaseToken(token: string, env: Env): Promise<AuthUser | null> {
  try {
    // Decode the token to get the payload without verification first
    const { payload } = decode(token);
    
    if (!payload) {
      console.log('Failed to decode token');
      return null;
    }
    
    // Validate basic claims
    const now = Math.floor(Date.now() / 1000);
    
    // Check expiration
    if (!payload.exp || payload.exp < now) {
      console.log('Token expired');
      return null;
    }
    
    // Check issued at
    if (!payload.iat || payload.iat > now) {
      console.log('Token used before issued');
      return null;
    }
    
    // Check audience (should be your project ID)
    if (payload.aud !== env.FIREBASE_PROJECT_ID) {
      console.log('Invalid audience', payload.aud, 'expected', env.FIREBASE_PROJECT_ID);
      return null;
    }
    
    // Check issuer
    const expectedIssuer = `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`;
    if (payload.iss !== expectedIssuer) {
      console.log('Invalid issuer', payload.iss, 'expected', expectedIssuer);
      return null;
    }
    
    // Check subject (user ID) exists
    if (!payload.sub || payload.sub.length === 0 || payload.sub.length > 128) {
      console.log('Invalid subject');
      return null;
    }
    
    // Fetch Google's public keys to verify signature
    const keysResponse = await fetch(
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
      { cf: { cacheTtl: 3600 } } // Cache keys for 1 hour
    );
    
    if (!keysResponse.ok) {
      console.log('Failed to fetch public keys');
      return null;
    }
    
    const publicKeys: Record<string, string> = await keysResponse.json();
    
    // Get the key ID from token header
    const { header } = decode(token);
    if (!header || !(header as any).kid) {
      console.log('No kid in token header');
      return null;
    }
    
    const kid = (header as any).kid;
    const publicKeyCert = publicKeys[kid];
    if (!publicKeyCert) {
      console.log('Public key not found for kid:', kid);
      return null;
    }
    
    // Verify the token signature using the public key
    const isValid = await verify(token, publicKeyCert, { algorithm: 'RS256', throwError: false });
    
    if (!isValid) {
      console.log('Token signature verification failed');
      return null;
    }
    
    // All validations passed, return the user info
    return {
      uid: payload.sub || (payload as any).user_id,
      email: (payload as any).email,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// ============================================================================
// DAILY MEASUREMENTS ROUTES
// ============================================================================

// Get all daily measurements for user
app.get('/api/daily', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM daily_measurements WHERE user_id = ? ORDER BY measured_at DESC LIMIT 100'
    ).bind(user.uid).all();

    return c.json({ data: results });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch measurements', message: error.message }, 500);
  }
});

// Get daily measurements by date range
app.get('/api/daily/range', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  const startDate = c.req.query('start');
  const endDate = c.req.query('end');

  if (!startDate || !endDate) {
    return c.json({ error: 'Start and end dates are required' }, 400);
  }

  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM daily_measurements WHERE user_id = ? AND measured_at BETWEEN ? AND ? ORDER BY measured_at DESC'
    ).bind(user.uid, startDate, endDate).all();

    return c.json({ data: results });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch measurements', message: error.message }, 500);
  }
});

// Create new daily measurement
app.post('/api/daily', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const body: any = await c.req.json();
    const { spo2, heart_rate, notes, measured_at } = body;

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

    await c.env.DB.prepare(
      'INSERT INTO daily_measurements (id, user_id, spo2, heart_rate, notes, measured_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, user.uid, spo2, heart_rate, notes || null, measured_at, timestamp, timestamp).run();

    return c.json({
      message: 'Measurement created successfully',
      data: { id, spo2, heart_rate, notes, measured_at }
    }, 201);
  } catch (error: any) {
    return c.json({ error: 'Failed to create measurement', message: error.message }, 500);
  }
});

// Update daily measurement
app.put('/api/daily/:id', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  const id = c.req.param('id');

  try {
    const body: any = await c.req.json();
    const { spo2, heart_rate, notes } = body;

    // Verify ownership
    const { results }: any = await c.env.DB.prepare(
      'SELECT user_id FROM daily_measurements WHERE id = ?'
    ).bind(id).all();

    if (!results || results.length === 0) {
      return c.json({ error: 'Measurement not found' }, 404);
    }

    if (results[0].user_id !== user.uid) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await c.env.DB.prepare(
      'UPDATE daily_measurements SET spo2 = ?, heart_rate = ?, notes = ? WHERE id = ?'
    ).bind(spo2, heart_rate, notes || null, id).run();

    return c.json({ message: 'Measurement updated successfully' });
  } catch (error: any) {
    return c.json({ error: 'Failed to update measurement', message: error.message }, 500);
  }
});

// Delete daily measurement
app.delete('/api/daily/:id', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  const id = c.req.param('id');

  try {
    // Verify ownership
    const { results }: any = await c.env.DB.prepare(
      'SELECT user_id FROM daily_measurements WHERE id = ?'
    ).bind(id).all();

    if (!results || results.length === 0) {
      return c.json({ error: 'Measurement not found' }, 404);
    }

    if (results[0].user_id !== user.uid) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await c.env.DB.prepare('DELETE FROM daily_measurements WHERE id = ?').bind(id).run();

    return c.json({ message: 'Measurement deleted successfully' });
  } catch (error: any) {
    return c.json({ error: 'Failed to delete measurement', message: error.message }, 500);
  }
});

// ============================================================================
// EXERCISE MEASUREMENTS ROUTES
// ============================================================================

// Get all exercise measurements
app.get('/api/exercise', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM exercise_measurements WHERE user_id = ? ORDER BY measured_at DESC LIMIT 100'
    ).bind(user.uid).all();

    return c.json({ data: results });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch measurements', message: error.message }, 500);
  }
});

// Create exercise measurement
app.post('/api/exercise', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const body: any = await c.req.json();
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

    if (!exercise_type || !spo2_before || !heart_rate_before || !spo2_after || !heart_rate_after || !measured_at) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const id = crypto.randomUUID();
    const timestamp = Math.floor(Date.now() / 1000);

    await c.env.DB.prepare(
      'INSERT INTO exercise_measurements (id, user_id, exercise_type, exercise_duration, spo2_before, heart_rate_before, spo2_after, heart_rate_after, notes, measured_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      id, user.uid, exercise_type, exercise_duration || null,
      spo2_before, heart_rate_before, spo2_after, heart_rate_after,
      notes || null, measured_at, timestamp, timestamp
    ).run();

    return c.json({
      message: 'Exercise measurement created successfully',
      data: { id, exercise_type, spo2_before, heart_rate_before, spo2_after, heart_rate_after }
    }, 201);
  } catch (error: any) {
    return c.json({ error: 'Failed to create measurement', message: error.message }, 500);
  }
});

// Delete exercise measurement
app.delete('/api/exercise/:id', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  const id = c.req.param('id');

  try {
    const { results }: any = await c.env.DB.prepare(
      'SELECT user_id FROM exercise_measurements WHERE id = ?'
    ).bind(id).all();

    if (!results || results.length === 0) {
      return c.json({ error: 'Measurement not found' }, 404);
    }

    if (results[0].user_id !== user.uid) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await c.env.DB.prepare('DELETE FROM exercise_measurements WHERE id = ?').bind(id).run();

    return c.json({ message: 'Measurement deleted successfully' });
  } catch (error: any) {
    return c.json({ error: 'Failed to delete measurement', message: error.message }, 500);
  }
});

// ============================================================================
// STATISTICS ROUTES
// ============================================================================

// Get 7-day averages
app.get('/api/stats/week', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);

    const { results }: any = await c.env.DB.prepare(
      `SELECT 
        AVG(spo2) as avg_spo2,
        AVG(heart_rate) as avg_heart_rate,
        MIN(spo2) as min_spo2,
        MAX(spo2) as max_spo2,
        MIN(heart_rate) as min_heart_rate,
        MAX(heart_rate) as max_heart_rate,
        COUNT(*) as count
       FROM daily_measurements 
       WHERE user_id = ? AND measured_at >= ?`
    ).bind(user.uid, sevenDaysAgo).all();

    return c.json({ data: results[0] || null });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch statistics', message: error.message }, 500);
  }
});

// Get statistics for custom date range
app.get('/api/stats/range', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  const startDate = c.req.query('start');
  const endDate = c.req.query('end');

  if (!startDate || !endDate) {
    return c.json({ error: 'Start and end dates are required' }, 400);
  }

  try {
    const { results }: any = await c.env.DB.prepare(
      `SELECT 
        AVG(spo2) as avg_spo2,
        AVG(heart_rate) as avg_heart_rate,
        MIN(spo2) as min_spo2,
        MAX(spo2) as max_spo2,
        MIN(heart_rate) as min_heart_rate,
        MAX(heart_rate) as max_heart_rate,
        COUNT(*) as count
       FROM daily_measurements 
       WHERE user_id = ? AND measured_at BETWEEN ? AND ?`
    ).bind(user.uid, startDate, endDate).all();

    return c.json({ data: results[0] || null });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch statistics', message: error.message }, 500);
  }
});

// Get daily aggregates for charting
app.get('/api/stats/daily', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const user = await verifyFirebaseToken(token, c.env);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  const days = parseInt(c.req.query('days') || '30');

  try {
    const startDate = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);

    const { results } = await c.env.DB.prepare(
      `SELECT 
        DATE(measured_at, 'unixepoch') as date,
        AVG(spo2) as avg_spo2,
        AVG(heart_rate) as avg_heart_rate,
        MIN(spo2) as min_spo2,
        MAX(spo2) as max_spo2,
        COUNT(*) as count
       FROM daily_measurements 
       WHERE user_id = ? AND measured_at >= ?
       GROUP BY date
       ORDER BY date DESC`
    ).bind(user.uid, startDate).all();

    return c.json({ data: results });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch statistics', message: error.message }, 500);
  }
});

// ============================================================================
// USER ROUTES
// ============================================================================

// Get or create user profile
app.get('/api/user/profile', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const authUser = await verifyFirebaseToken(token, c.env);
  if (!authUser) return c.json({ error: 'Invalid token' }, 401);

  try {
    let { results }: any = await c.env.DB.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(authUser.uid).all();

    // Create user if doesn't exist
    if (!results || results.length === 0) {
      const timestamp = Math.floor(Date.now() / 1000);
      await c.env.DB.prepare(
        'INSERT INTO users (id, email, display_name, created_at, updated_at, last_login) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(authUser.uid, authUser.email, authUser.email, timestamp, timestamp, timestamp).run();

      // Create default settings
      await c.env.DB.prepare(
        'INSERT INTO user_settings (user_id) VALUES (?)'
      ).bind(authUser.uid).run();

      const res: any = await c.env.DB.prepare(
        'SELECT * FROM users WHERE id = ?'
      ).bind(authUser.uid).all();
      results = res.results;
    } else {
      // Update last login
      await c.env.DB.prepare(
        'UPDATE users SET last_login = ? WHERE id = ?'
      ).bind(Math.floor(Date.now() / 1000), authUser.uid).run();
    }

    return c.json({ data: results[0] });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch profile', message: error.message }, 500);
  }
});

// Get user settings
app.get('/api/user/settings', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const authUser = await verifyFirebaseToken(token, c.env);
  if (!authUser) return c.json({ error: 'Invalid token' }, 401);

  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM user_settings WHERE user_id = ?'
    ).bind(authUser.uid).all();

    return c.json({ data: results[0] || null });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch settings', message: error.message }, 500);
  }
});

// Update user settings
app.put('/api/user/settings', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const authUser = await verifyFirebaseToken(token, c.env);
  if (!authUser) return c.json({ error: 'Invalid token' }, 401);

  try {
    const body: any = await c.req.json();
    const {
      spo2_low_threshold,
      spo2_high_threshold,
      heart_rate_low_threshold,
      heart_rate_high_threshold,
      large_font_enabled,
      notifications_enabled
    } = body;

    await c.env.DB.prepare(
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
  } catch (error: any) {
    return c.json({ error: 'Failed to update settings', message: error.message }, 500);
  }
});

// Test database connection
app.get('/api/test-db', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT 1 as test').first();
    return c.json({ success: true, result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message,
  }, 500);
});

export default app;
