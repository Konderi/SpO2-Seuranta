/**
 * Hapetus API - Cloudflare Workers Backend
 * Main entry point for the API
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authMiddleware } from './middleware/auth';
import dailyRoutes from './routes/daily';
import exerciseRoutes from './routes/exercise';
import statsRoutes from './routes/stats';
import userRoutes from './routes/user';

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
  origin: (origin) => origin,
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

// Protected routes (require authentication)
app.use('/api/*', authMiddleware);
app.route('/api/daily', dailyRoutes);
app.route('/api/exercise', exerciseRoutes);
app.route('/api/stats', statsRoutes);
app.route('/api/user', userRoutes);

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
