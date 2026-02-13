/**
 * Hapetus API - Cloudflare Workers Backend
 * Main entry point for the API
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { decode } from '@tsndr/cloudflare-worker-jwt';
import { importX509, jwtVerify } from 'jose';

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
  origin: (origin) => {
    // Allow requests from your domains only
    const allowedOrigins = [
      'https://hapetus.info',
      'https://www.hapetus.info',
      'https://api.hapetus.info',
      'http://localhost:3000',      // Next.js dev
      'http://localhost:19006',     // Expo dev
      'http://localhost:19000',     // Expo dev alternative
    ];
    
    // Allow if origin is in the list, or if no origin (mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return origin || '*';
    }
    
    return null;
  },
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

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

interface AuthUser {
  uid: string;
  email?: string;
}

async function verifyFirebaseToken(token: string, env: Env): Promise<AuthUser | null> {
  try {
    console.log('🔍 Verifying Firebase token...', token.substring(0, 20) + '...');
    
    // Decode the token to get the payload without verification first
    const { payload } = decode(token);
    
    if (!payload) {
      console.log('❌ Failed to decode token');
      return null;
    }
    
    console.log('✅ Token decoded, sub:', payload.sub);
    
    // Validate basic claims
    const now = Math.floor(Date.now() / 1000);
    
    // Check expiration
    if (!payload.exp || payload.exp < now) {
      console.log('❌ Token expired', { exp: payload.exp, now });
      return null;
    }
    
    // Check issued at
    if (!payload.iat || payload.iat > now) {
      console.log('❌ Token used before issued', { iat: payload.iat, now });
      return null;
    }
    
    // Check audience (should be your project ID)
    if (payload.aud !== env.FIREBASE_PROJECT_ID) {
      console.log('❌ Invalid audience', { aud: payload.aud, expected: env.FIREBASE_PROJECT_ID });
      return null;
    }
    
    console.log('✅ Audience valid');
    
    // Check issuer
    const expectedIssuer = `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`;
    if (payload.iss !== expectedIssuer) {
      console.log('❌ Invalid issuer', { iss: payload.iss, expected: expectedIssuer });
      return null;
    }
    
    console.log('✅ Issuer valid');
    
    // Check subject (user ID) exists
    if (!payload.sub || payload.sub.length === 0 || payload.sub.length > 128) {
      console.log('❌ Invalid subject');
      return null;
    }
    
    console.log('✅ Subject valid, fetching public keys...');
    
    // Fetch Google's public keys to verify signature
    const keysResponse = await fetch(
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
      { cf: { cacheTtl: 3600 } } // Cache keys for 1 hour
    );
    
    if (!keysResponse.ok) {
      console.log('❌ Failed to fetch public keys', keysResponse.status);
      return null;
    }
    
    const publicKeys: Record<string, string> = await keysResponse.json();
    console.log('✅ Public keys fetched, count:', Object.keys(publicKeys).length);
    
    // Get the key ID from token header
    const { header } = decode(token);
    if (!header || !(header as any).kid) {
      console.log('❌ No kid in token header');
      return null;
    }
    
    const kid = (header as any).kid;
    console.log('🔑 Key ID:', kid);
    
    const publicKeyCert = publicKeys[kid];
    if (!publicKeyCert) {
      console.log('❌ Public key not found for kid:', kid, 'Available keys:', Object.keys(publicKeys));
      return null;
    }
    
    console.log('✅ Public key found, verifying signature...');
    
    // Verify the token signature using jose library
    try {
      // Import the X.509 certificate
      const publicKey = await importX509(publicKeyCert, 'RS256');
      
      // Verify the JWT
      const { payload: verifiedPayload } = await jwtVerify(token, publicKey, {
        audience: env.FIREBASE_PROJECT_ID,
        issuer: `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`,
      });
      
      console.log('✅✅✅ Token verified successfully! User:', verifiedPayload.sub);
      
      // All validations passed, return the user info
      return {
        uid: verifiedPayload.sub as string,
        email: verifiedPayload.email as string | undefined,
      };
    } catch (verifyError) {
      console.log('❌ Signature verification error:', verifyError);
      return null;
    }
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return null;
  }
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Handles errors safely without exposing internal details to clients
 * @param error The error that occurred
 * @param context Description for server logs
 * @param c Hono context for returning JSON response
 * @returns JSON error response
 */
function handleError(error: any, context: string, c: any) {
  // Log detailed error for debugging (server logs only)
  console.error(`${context}:`, error);
  
  // Return generic error message to client (don't expose internal details)
  return c.json({ error: context }, 500);
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
    console.error('Failed to fetch daily measurements:', error);
    return c.json({ error: 'Failed to fetch measurements' }, 500);
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
    const { spo2, heart_rate, systolic, diastolic, notes, measured_at } = body;

    // Check if SpO2/HR or BP data is provided
    const hasSpO2Data = typeof spo2 === 'number' && !isNaN(spo2) && spo2 > 0;
    const hasHRData = typeof heart_rate === 'number' && !isNaN(heart_rate) && heart_rate > 0;
    const hasBPData = typeof systolic === 'number' && !isNaN(systolic) && 
                      typeof diastolic === 'number' && !isNaN(diastolic);

    // At least one measurement type required
    if (!hasSpO2Data && !hasBPData) {
      return c.json({ error: 'At least SpO2 or BP measurements required' }, 400);
    }

    if (!measured_at) {
      return c.json({ error: 'Measurement timestamp is required' }, 400);
    }

    // Validate SpO2 ONLY if provided
    if (hasSpO2Data && (spo2 < 50 || spo2 > 100)) {
      return c.json({ error: 'SpO2 must be between 50 and 100' }, 400);
    }

    // Validate heart rate ONLY if provided
    if (hasHRData && (heart_rate < 30 || heart_rate > 250)) {
      return c.json({ error: 'Heart rate must be between 30 and 250' }, 400);
    }

    // Validate BP ONLY if provided
    if (typeof systolic === 'number' && (systolic < 80 || systolic > 200)) {
      return c.json({ error: 'Systolic pressure must be between 80 and 200' }, 400);
    }

    if (typeof diastolic === 'number' && (diastolic < 50 || diastolic > 130)) {
      return c.json({ error: 'Diastolic pressure must be between 50 and 130' }, 400);
    }

    if (typeof systolic === 'number' && typeof diastolic === 'number' && systolic <= diastolic) {
      return c.json({ error: 'Systolic pressure must be greater than diastolic' }, 400);
    }

    const id = crypto.randomUUID();
    const timestamp = Math.floor(Date.now() / 1000);

    await c.env.DB.prepare(
      'INSERT INTO daily_measurements (id, user_id, spo2, heart_rate, systolic, diastolic, notes, measured_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      id, 
      user.uid, 
      spo2 || null, 
      heart_rate || null, 
      systolic || null, 
      diastolic || null, 
      notes || null, 
      measured_at, 
      timestamp, 
      timestamp
    ).run();

    return c.json({
      message: 'Measurement created successfully',
      data: { id, spo2, heart_rate, systolic, diastolic, notes, measured_at }
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

    // Validate input
    if (spo2 && (spo2 < 50 || spo2 > 100)) {
      return c.json({ error: 'SpO2 must be between 50 and 100' }, 400);
    }

    if (heart_rate && (heart_rate < 30 || heart_rate > 250)) {
      return c.json({ error: 'Heart rate must be between 30 and 250' }, 400);
    }

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

    // Validate SpO2 values
    if (spo2_before < 50 || spo2_before > 100 || spo2_after < 50 || spo2_after > 100) {
      return c.json({ error: 'SpO2 values must be between 50 and 100' }, 400);
    }

    // Validate heart rate values
    if (heart_rate_before < 30 || heart_rate_before > 250 || heart_rate_after < 30 || heart_rate_after > 250) {
      return c.json({ error: 'Heart rate values must be between 30 and 250' }, 400);
    }

    // Validate exercise duration if provided
    if (exercise_duration && (exercise_duration < 0 || exercise_duration > 10000)) {
      return c.json({ error: 'Exercise duration must be between 0 and 10000 minutes' }, 400);
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
    
    // Build dynamic UPDATE query based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    
    if (body.spo2_low_threshold !== undefined) {
      updates.push('spo2_low_threshold = ?');
      values.push(body.spo2_low_threshold);
    }
    if (body.spo2_high_threshold !== undefined) {
      updates.push('spo2_high_threshold = ?');
      values.push(body.spo2_high_threshold);
    }
    if (body.heart_rate_low_threshold !== undefined) {
      updates.push('heart_rate_low_threshold = ?');
      values.push(body.heart_rate_low_threshold);
    }
    if (body.heart_rate_high_threshold !== undefined) {
      updates.push('heart_rate_high_threshold = ?');
      values.push(body.heart_rate_high_threshold);
    }
    if (body.large_font_enabled !== undefined) {
      updates.push('large_font_enabled = ?');
      values.push(body.large_font_enabled ? 1 : 0);
    }
    if (body.notifications_enabled !== undefined) {
      updates.push('notifications_enabled = ?');
      values.push(body.notifications_enabled ? 1 : 0);
    }
    if (body.gender !== undefined) {
      updates.push('gender = ?');
      values.push(body.gender || null);
    }
    if (body.birth_year !== undefined) {
      updates.push('birth_year = ?');
      values.push(body.birth_year || null);
    }
    
    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }
    
    // Add user_id to values for WHERE clause
    values.push(authUser.uid);
    
    const query = `UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = ?`;
    
    await c.env.DB.prepare(query).bind(...values).run();

    return c.json({ message: 'Settings updated successfully' });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return c.json({ error: 'Failed to update settings', message: error.message }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404);
});

// Error handler
app.onError((err, c) => {
  // Log detailed error for debugging (server logs only)
  console.error('Error:', err);
  
  // Return generic error message to client (don't expose internal details)
  return c.json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred. Please try again later.',
  }, 500);
});

export default app;
