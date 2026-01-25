// ============================================================
// Middleware CORS - Les P'tits Trinquat API
// ============================================================

import { Context, Next } from 'hono';
import type { Env } from '../types';

// ============================================================
// Configuration CORS
// ============================================================
export function getCorsHeaders(origin: string, allowedOrigin: string): Record<string, string> {
  // Liste des origines autorisées
  const allowedOrigins = [
    allowedOrigin,
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081'
  ];
  
  // Vérifier si l'origine est autorisée
  const isAllowed = allowedOrigins.includes(origin) || 
                    origin.endsWith('.pages.dev') ||
                    origin.endsWith('.workers.dev');
  
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
  const corsHeaders = getCorsHeaders(origin, c.env.CORS_ORIGIN);
  
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
