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
// Endpoint d'Initialisation de la Base de Données
// ============================================================
app.get('/init-db', async (c) => {
  try {
    // Créer les tables
    const initSql = `
      -- Création de la table users
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Création de la table user_roles
      CREATE TABLE IF NOT EXISTS user_roles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'user', 'moderator')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Création de la table sessions
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Création de la table tombola_participants
      CREATE TABLE IF NOT EXISTS tombola_participants (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        prenom TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT DEFAULT 'Parent participant',
        classes TEXT,
        emoji TEXT DEFAULT '😊',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Création de la table tombola_lots
      CREATE TABLE IF NOT EXISTS tombola_lots (
        id TEXT PRIMARY KEY,
        nom TEXT NOT NULL,
        description TEXT,
        icone TEXT,
        statut TEXT DEFAULT 'disponible' CHECK (statut IN ('disponible', 'réservé', 'remis')),
        parent_id TEXT NOT NULL,
        reserved_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES tombola_participants(id),
        FOREIGN KEY (reserved_by) REFERENCES tombola_participants(id)
      );

      -- Création de la table audit_logs
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        action TEXT NOT NULL,
        resource_type TEXT,
        resource_id TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Création de la table rate_limits
      CREATE TABLE IF NOT EXISTS rate_limits (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        request_count INTEGER DEFAULT 1,
        window_start DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(identifier, endpoint)
      );

      -- Créer les index
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_tombola_participants_email ON tombola_participants(email);
      CREATE INDEX IF NOT EXISTS idx_tombola_lots_parent_id ON tombola_lots(parent_id);
      CREATE INDEX IF NOT EXISTS idx_tombola_lots_status ON tombola_lots(statut);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
    `;

    // Exécuter le SQL
    for (const statement of initSql.split(';').filter(s => s.trim())) {
      if (statement.trim()) {
        await c.env.DB.prepare(statement).run();
      }
    }

    return c.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error: any) {
    console.error('DB init error:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
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
