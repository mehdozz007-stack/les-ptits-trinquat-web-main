// ============================================================
// Point d'Entrée Principal - Les P'tits Trinquat API
// Cloudflare Workers avec D1
// ============================================================

import { Hono } from 'hono';
import type { Env } from './types';
import { corsMiddleware } from './middleware/cors';
import { rateLimitMiddleware } from './middleware/rateLimit';
import auth from './routes/auth';
import newsletter from './routes/newsletter';
import tombola from './routes/tombola';

// ============================================================
// Application Hono
// ============================================================
const app = new Hono<{ Bindings: Env }>();

// ============================================================
// Middlewares Globaux
// ============================================================

// CORS pour toutes les routes
app.use('*', corsMiddleware);

// ============================================================
// Routes de Santé
// ============================================================

app.get('/', (c) => {
  return c.json({
    name: 'Les P\'tits Trinquat API',
    version: '1.0.0',
    status: 'healthy',
    environment: c.env.ENVIRONMENT
  });
});

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// Routes API
// ============================================================

// Authentification
app.route('/api/auth', auth);

// Newsletter
app.route('/api/newsletter', newsletter);

// Tombola
app.route('/api/tombola', tombola);

// ============================================================
// Gestion des erreurs
// ============================================================

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  
  return c.json({
    success: false,
    error: c.env.ENVIRONMENT === 'development' 
      ? err.message 
      : 'An internal error occurred'
  }, 500);
});

// 404 pour les routes non trouvées
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Route not found'
  }, 404);
});

// ============================================================
// Export du Worker
// ============================================================

export default app;
