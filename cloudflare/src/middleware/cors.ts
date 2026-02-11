// ============================================================
// Middleware CORS - Les P'tits Trinquat API
// ============================================================

import { Context, Next } from 'hono';
import type { Env } from '../types';

// ============================================================
// Configuration CORS
// ============================================================
export function getCorsHeaders(origin: string, allowedOrigin: string, environment: string): Record<string, string> {
  // Liste des origines autorisées (development)
  const devOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081'
  ];

  // En production: strictement CORS_ORIGIN et nos domaines Cloudflare Pages
  const productionOrigins = [
    allowedOrigin,
    'https://les-ptits-trinquat.pages.dev',
    'https://main.les-ptits-trinquat.pages.dev',
    'https://078fb4a5.les-ptits-trinquat.pages.dev'
  ];

  const allowedOrigins = environment === 'production' ? productionOrigins : [allowedOrigin, ...devOrigins];

  // Vérifier si l'origine est autorisée
  const isAllowed = allowedOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true'
  };
}

// ============================================================
// Middleware CORS
// ============================================================
export async function corsMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const origin = c.req.header('Origin') || '';
  const corsHeaders = getCorsHeaders(origin, c.env.CORS_ORIGIN, c.env.ENVIRONMENT);

  // Répondre immédiatement aux requêtes OPTIONS (preflight)
  if (c.req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Continuer avec la requête
  await next();

  // Ajouter les headers CORS à la réponse
  Object.entries(corsHeaders).forEach(([key, value]) => {
    c.res.headers.set(key, value);
  });
}
