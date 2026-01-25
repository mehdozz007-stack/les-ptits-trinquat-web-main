// ============================================================
// Middleware Rate Limiting - Les P'tits Trinquat API
// ============================================================

import { Context, Next } from 'hono';
import type { Env } from '../types';
import { checkRateLimit } from '../utils/security';

// ============================================================
// Middleware Rate Limiting
// ============================================================
export async function rateLimitMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  // Identifier par IP
  const identifier = c.req.header('CF-Connecting-IP') || 
                     c.req.header('X-Forwarded-For') || 
                     'unknown';
  
  const endpoint = new URL(c.req.url).pathname;
  const maxRequests = parseInt(c.env.RATE_LIMIT_MAX || '60', 10);
  const windowSeconds = parseInt(c.env.RATE_LIMIT_WINDOW || '60', 10);
  
  const { allowed, remaining, resetAt } = await checkRateLimit(
    c.env.DB,
    identifier,
    endpoint,
    maxRequests,
    windowSeconds
  );
  
  // Ajouter les headers de rate limiting
  c.res.headers.set('X-RateLimit-Limit', maxRequests.toString());
  c.res.headers.set('X-RateLimit-Remaining', remaining.toString());
  c.res.headers.set('X-RateLimit-Reset', resetAt.toISOString());
  
  if (!allowed) {
    return c.json({
      success: false,
      error: 'Too many requests. Please try again later.',
      retry_after: Math.ceil((resetAt.getTime() - Date.now()) / 1000)
    }, 429);
  }
  
  await next();
}

// ============================================================
// Rate Limiting spécifique pour l'authentification
// ============================================================
export async function authRateLimitMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const identifier = c.req.header('CF-Connecting-IP') || 
                     c.req.header('X-Forwarded-For') || 
                     'unknown';
  
  // Limite stricte pour l'auth: 5 tentatives par minute
  const { allowed, remaining, resetAt } = await checkRateLimit(
    c.env.DB,
    identifier,
    'auth',
    5,
    60
  );
  
  c.res.headers.set('X-RateLimit-Limit', '5');
  c.res.headers.set('X-RateLimit-Remaining', remaining.toString());
  c.res.headers.set('X-RateLimit-Reset', resetAt.toISOString());
  
  if (!allowed) {
    return c.json({
      success: false,
      error: 'Too many login attempts. Please try again later.',
      retry_after: Math.ceil((resetAt.getTime() - Date.now()) / 1000)
    }, 429);
  }
  
  await next();
}
