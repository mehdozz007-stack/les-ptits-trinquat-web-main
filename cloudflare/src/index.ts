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
    // Create tables individually to avoid comment issues
    const statements = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
      
      `CREATE TABLE IF NOT EXISTS user_roles (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        UNIQUE (user_id, role),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id)`,
      
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`,
      
      `CREATE TABLE IF NOT EXISTS tombola_participants (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT,
        prenom TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Parent participant',
        classes TEXT,
        emoji TEXT NOT NULL DEFAULT '😊',
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_tombola_participants_user_id ON tombola_participants(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_tombola_participants_email ON tombola_participants(email)`,
      
      `CREATE TABLE IF NOT EXISTS tombola_lots (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        nom TEXT NOT NULL,
        description TEXT,
        icone TEXT NOT NULL DEFAULT '🎁',
        statut TEXT NOT NULL DEFAULT 'disponible' CHECK (statut IN ('disponible', 'reserve', 'remis')),
        parent_id TEXT NOT NULL,
        reserved_by TEXT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        FOREIGN KEY (parent_id) REFERENCES tombola_participants(id) ON DELETE CASCADE,
        FOREIGN KEY (reserved_by) REFERENCES tombola_participants(id) ON DELETE SET NULL
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_tombola_lots_parent_id ON tombola_lots(parent_id)`,
      `CREATE INDEX IF NOT EXISTS idx_tombola_lots_reserved_by ON tombola_lots(reserved_by)`,
      `CREATE INDEX IF NOT EXISTS idx_tombola_lots_statut ON tombola_lots(statut)`,
      
      `CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT,
        ip_address TEXT,
        user_agent TEXT,
        details TEXT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)`,
      `CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)`,
      
      `CREATE TABLE IF NOT EXISTS rate_limits (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        identifier TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        request_count INTEGER NOT NULL DEFAULT 1,
        window_start TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        UNIQUE (identifier, endpoint)
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier)`,
      `CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start)`
    ];

    // Execute each statement individually
    for (const statement of statements) {
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
