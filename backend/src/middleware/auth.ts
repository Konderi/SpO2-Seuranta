/**
 * Firebase Authentication Middleware
 * Validates Firebase ID tokens from requests
 */

import { Context, Next } from 'hono';
import { Env } from '../index';

interface DecodedToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
}

/**
 * Verify Firebase ID token
 * In production, this would use Firebase Admin SDK
 * For now, we'll implement a basic JWT verification
 */
async function verifyFirebaseToken(token: string, env: Env): Promise<DecodedToken | null> {
  try {
    // TODO: Implement proper Firebase token verification
    // For now, we'll use a simple validation
    // In production, use firebase-admin or fetch from Firebase REST API
    
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.FIREBASE_PROJECT_ID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.users || data.users.length === 0) {
      return null;
    }

    const user = data.users[0];
    return {
      uid: user.localId,
      email: user.email,
      email_verified: user.emailVerified,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized', message: 'Missing or invalid authorization header' }, 401);
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  const decodedToken = await verifyFirebaseToken(token, c.env);

  if (!decodedToken) {
    return c.json({ error: 'Unauthorized', message: 'Invalid or expired token' }, 401);
  }

  // Attach user info to context
  c.set('user', decodedToken);

  await next();
}
