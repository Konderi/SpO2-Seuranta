/**
 * Hapetus API - Cloudflare Workers Backend
 * Minimal test version
 */

import { Hono } from 'hono';

export interface Env {
  DB: D1Database;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_CLIENT_EMAIL: string;
  CORS_ORIGIN: string;
}

const app = new Hono<{ Bindings: Env }>();

// Simple health check
app.get('/', (c) => {
  return c.json({
    name: 'Hapetus API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
