# Prompt Complet : Migration Cloudflare D1 - Tombola Standalone

> **Objectif** : Créer un backend Cloudflare Workers + D1 (SQLite) fonctionnel en local pour la fonctionnalité Tombola.

---

## 📋 Vue d'Ensemble du Projet

### Stack Technique
- **Frontend** : React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend** : Cloudflare Workers (Hono.js)
- **Base de données** : Cloudflare D1 (SQLite)
- **Authentification** : Sessions avec tokens sécurisés (PBKDF2-SHA256)

### Fonctionnalités Tombola
1. **Participants** : Inscription des parents avec prénom, email, classe, emoji
2. **Lots** : Création et gestion des lots par les participants
3. **Réservation** : Système de réservation de lots entre participants
4. **Contact** : Génération sécurisée de liens mailto (sans exposer les emails)

---

## 🗄️ Schéma Base de Données SQLite (D1)

### Architecture des Tables

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTIFICATION                          │
├─────────────────────────────────────────────────────────────┤
│  users ─────────────┬─── user_roles                          │
│                     └─── sessions                            │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                                         ▼
┌──────────────────────────────────┐     ┌──────────────────┐
│           TOMBOLA                │     │    SÉCURITÉ      │
├──────────────────────────────────┤     ├──────────────────┤
│  tombola_participants            │     │ audit_logs       │
│  tombola_lots                    │     │ rate_limits      │
└──────────────────────────────────┘     └──────────────────┘
```

---

## 📝 Migration SQL Complète

Créer le fichier `cloudflare/migrations/0001_tombola_schema.sql` :

```sql
-- ============================================================
-- CLOUDFLARE D1 (SQLite) - Tombola Standalone
-- Migration initiale complète
-- ============================================================

-- ============================================================
-- 1. TABLE USERS (Authentification)
-- ============================================================
-- Stocke les comptes utilisateurs pour l'authentification admin
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Index pour recherche rapide par email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- 2. TABLE USER_ROLES (Gestion des rôles)
-- ============================================================
-- Permet d'assigner des rôles (admin, user) aux utilisateurs
CREATE TABLE IF NOT EXISTS user_roles (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    UNIQUE (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- ============================================================
-- 3. TABLE SESSIONS (Gestion des sessions)
-- ============================================================
-- Stocke les sessions actives avec token et expiration
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- ============================================================
-- 4. TABLE TOMBOLA_PARTICIPANTS (Participants Tombola)
-- ============================================================
-- Stocke les participants à la tombola (parents d'élèves)
-- Note: L'email est privé et ne doit JAMAIS être exposé publiquement
CREATE TABLE IF NOT EXISTS tombola_participants (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Parent participant',
    classes TEXT,
    emoji TEXT NOT NULL DEFAULT '😊',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Index pour recherche par user_id et email
CREATE INDEX IF NOT EXISTS idx_tombola_participants_user_id ON tombola_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_tombola_participants_email ON tombola_participants(email);

-- ============================================================
-- 5. TABLE TOMBOLA_LOTS (Lots de la Tombola)
-- ============================================================
-- Stocke les lots proposés par les participants
-- Statuts possibles : disponible, réservé, remis
CREATE TABLE IF NOT EXISTS tombola_lots (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    nom TEXT NOT NULL,
    description TEXT,
    icone TEXT NOT NULL DEFAULT '🎁',
    statut TEXT NOT NULL DEFAULT 'disponible' CHECK (statut IN ('disponible', 'réservé', 'remis')),
    parent_id TEXT NOT NULL,
    reserved_by TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (parent_id) REFERENCES tombola_participants(id) ON DELETE CASCADE,
    FOREIGN KEY (reserved_by) REFERENCES tombola_participants(id) ON DELETE SET NULL
);

-- Index pour recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_tombola_lots_parent_id ON tombola_lots(parent_id);
CREATE INDEX IF NOT EXISTS idx_tombola_lots_reserved_by ON tombola_lots(reserved_by);
CREATE INDEX IF NOT EXISTS idx_tombola_lots_statut ON tombola_lots(statut);

-- ============================================================
-- 6. TABLE AUDIT_LOGS (Journalisation sécurité)
-- ============================================================
-- Enregistre toutes les actions sensibles pour audit
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    details TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================
-- 7. TABLE RATE_LIMITS (Protection contre les abus)
-- ============================================================
-- Stocke les compteurs de requêtes pour le rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    identifier TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    window_start TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    UNIQUE (identifier, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);
```

---

## 📝 Migration Seed Admin

Créer le fichier `cloudflare/migrations/0002_seed_admin.sql` :

```sql
-- ============================================================
-- SEED: Création de l'utilisateur admin initial
-- ============================================================
-- IMPORTANT: Remplacer le password_hash par un vrai hash PBKDF2
-- Le hash ci-dessous est pour le mot de passe "admin123" (À CHANGER!)

-- Insérer l'utilisateur admin
INSERT INTO users (id, email, password_hash) VALUES (
    'admin-user-id-001',
    'admin@example.com',
    'REPLACE_WITH_REAL_PBKDF2_HASH'
);

-- Assigner le rôle admin
INSERT INTO user_roles (user_id, role) VALUES (
    'admin-user-id-001',
    'admin'
);
```

---

## 📁 Structure des Fichiers Backend

```
cloudflare/
├── migrations/
│   ├── 0001_tombola_schema.sql    # Schéma complet
│   └── 0002_seed_admin.sql        # Données initiales
├── src/
│   ├── index.ts                   # Point d'entrée Hono
│   ├── types.ts                   # Types TypeScript
│   ├── middleware/
│   │   ├── auth.ts                # Middleware authentification
│   │   ├── cors.ts                # Configuration CORS
│   │   └── rateLimit.ts           # Rate limiting
│   ├── routes/
│   │   ├── auth.ts                # Routes login/logout
│   │   └── tombola.ts             # Routes API tombola
│   └── utils/
│       └── security.ts            # Fonctions hachage/tokens
├── package.json
├── tsconfig.json
└── wrangler.toml                  # Configuration Cloudflare
```

---

## ⚙️ Configuration wrangler.toml

```toml
# ============================================================
# Configuration Cloudflare Workers - Tombola Standalone
# ============================================================

name = "tombola-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# ============================================================
# Base de données D1
# ============================================================
[[d1_databases]]
binding = "DB"
database_name = "tombola-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Remplacé après création

# ============================================================
# Variables d'environnement (non sensibles)
# ============================================================
[vars]
ENVIRONMENT = "production"
CORS_ORIGIN = "https://votre-app.pages.dev"
SESSION_DURATION = "604800"  # 7 jours en secondes
RATE_LIMIT_MAX = "60"
RATE_LIMIT_WINDOW = "60"

# ============================================================
# Environnement de développement local
# ============================================================
[env.dev]
vars = { ENVIRONMENT = "development", CORS_ORIGIN = "http://localhost:5173" }

# ============================================================
# Secrets (à configurer via wrangler secret put)
# ============================================================
# - JWT_SECRET: Clé secrète pour les tokens (min 32 caractères)
```

---

## 📦 package.json Backend

```json
{
  "name": "tombola-api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev --local --persist",
    "deploy": "wrangler deploy",
    "db:create": "wrangler d1 create tombola-db",
    "db:migrate": "wrangler d1 execute tombola-db --local --file=migrations/0001_tombola_schema.sql",
    "db:seed": "wrangler d1 execute tombola-db --local --file=migrations/0002_seed_admin.sql",
    "db:migrate:remote": "wrangler d1 execute tombola-db --file=migrations/0001_tombola_schema.sql",
    "db:reset": "rm -rf .wrangler && npm run db:migrate && npm run db:seed"
  },
  "dependencies": {
    "hono": "^4.0.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240117.0",
    "typescript": "^5.3.0",
    "wrangler": "^3.22.0"
  }
}
```

---

## 🔧 Types TypeScript

Créer `cloudflare/src/types.ts` :

```typescript
// ============================================================
// Types pour Cloudflare D1 - Tombola
// ============================================================

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  SESSION_DURATION: string;
  RATE_LIMIT_MAX: string;
  RATE_LIMIT_WINDOW: string;
}

// ============================================================
// Modèles de données
// ============================================================

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface TombolaParticipant {
  id: string;
  user_id: string | null;
  prenom: string;
  email: string;
  role: string;
  classes: string | null;
  emoji: string;
  created_at: string;
}

// Version publique sans email
export interface TombolaParticipantPublic {
  id: string;
  prenom: string;
  role: string;
  classes: string | null;
  emoji: string;
  created_at: string;
}

export interface TombolaLot {
  id: string;
  nom: string;
  description: string | null;
  icone: string;
  statut: 'disponible' | 'réservé' | 'remis';
  parent_id: string;
  reserved_by: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  details: string | null;
  created_at: string;
}

// ============================================================
// Types API
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================
// Types Authentification
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface AuthContext {
  user: User;
  session: Session;
  role: string;
}
```

---

## 🔐 Middleware Authentification

Créer `cloudflare/src/middleware/auth.ts` :

```typescript
import { Context, Next } from 'hono';
import { Env, AuthContext, User, Session } from '../types';

// ============================================================
// Middleware: Vérification de session
// ============================================================
export async function requireAuth(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Token manquant' }, 401);
  }

  const token = authHeader.substring(7);
  const db = c.env.DB;

  try {
    // Vérifier la session
    const session = await db
      .prepare(`
        SELECT s.*, u.email, u.id as user_id
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
      `)
      .bind(token)
      .first<Session & { email: string }>();

    if (!session) {
      return c.json({ success: false, error: 'Session invalide ou expirée' }, 401);
    }

    // Récupérer le rôle
    const roleResult = await db
      .prepare('SELECT role FROM user_roles WHERE user_id = ?')
      .bind(session.user_id)
      .first<{ role: string }>();

    // Ajouter le contexte d'authentification
    c.set('auth', {
      user: { id: session.user_id, email: session.email } as User,
      session: session,
      role: roleResult?.role || 'user'
    } as AuthContext);

    await next();
  } catch (error) {
    console.error('Erreur auth:', error);
    return c.json({ success: false, error: 'Erreur d\'authentification' }, 500);
  }
}

// ============================================================
// Middleware: Vérification rôle Admin
// ============================================================
export async function requireAdmin(c: Context<{ Bindings: Env }>, next: Next) {
  await requireAuth(c, async () => {
    const auth = c.get('auth') as AuthContext;
    
    if (auth.role !== 'admin') {
      return c.json({ success: false, error: 'Accès admin requis' }, 403);
    }
    
    await next();
  });
}
```

---

## 🌐 Middleware CORS

Créer `cloudflare/src/middleware/cors.ts` :

```typescript
import { Context, Next } from 'hono';
import { Env } from '../types';

export async function corsMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const origin = c.env.CORS_ORIGIN || '*';
  
  // Preflight OPTIONS
  if (c.req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  await next();

  // Ajouter les headers CORS à la réponse
  c.res.headers.set('Access-Control-Allow-Origin', origin);
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
```

---

## 🛡️ Utilitaires Sécurité

Créer `cloudflare/src/utils/security.ts` :

```typescript
// ============================================================
// Fonctions de sécurité - Hachage et Tokens
// ============================================================

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const HASH_LENGTH = 32;

// ============================================================
// Hachage de mot de passe (PBKDF2-SHA256)
// ============================================================
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    HASH_LENGTH * 8
  );

  const hashArray = new Uint8Array(derivedBits);
  
  // Combiner salt + hash en base64
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);
  
  return btoa(String.fromCharCode(...combined));
}

// ============================================================
// Vérification de mot de passe
// ============================================================
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const combined = Uint8Array.from(atob(storedHash), c => c.charCodeAt(0));
    
    const salt = combined.slice(0, SALT_LENGTH);
    const originalHash = combined.slice(SALT_LENGTH);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      HASH_LENGTH * 8
    );

    const newHash = new Uint8Array(derivedBits);
    
    // Comparaison constante pour éviter timing attacks
    if (newHash.length !== originalHash.length) return false;
    
    let result = 0;
    for (let i = 0; i < newHash.length; i++) {
      result |= newHash[i] ^ originalHash[i];
    }
    
    return result === 0;
  } catch {
    return false;
  }
}

// ============================================================
// Génération de token de session
// ============================================================
export function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================================
// Génération d'UUID
// ============================================================
export function generateUUID(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================================
// Échappement HTML (protection XSS)
// ============================================================
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// Validation email
// ============================================================
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
}

// ============================================================
// Sanitization de chaîne
// ============================================================
export function sanitizeString(input: string, maxLength: number = 255): string {
  return input.trim().slice(0, maxLength);
}
```

---

## 🚀 Point d'Entrée API (index.ts)

Créer `cloudflare/src/index.ts` :

```typescript
import { Hono } from 'hono';
import { Env } from './types';
import { corsMiddleware } from './middleware/cors';
import authRoutes from './routes/auth';
import tombolaRoutes from './routes/tombola';

const app = new Hono<{ Bindings: Env }>();

// ============================================================
// Middlewares globaux
// ============================================================
app.use('*', corsMiddleware);

// ============================================================
// Health check
// ============================================================
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Tombola API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// Routes
// ============================================================
app.route('/auth', authRoutes);
app.route('/tombola', tombolaRoutes);

// ============================================================
// 404 Handler
// ============================================================
app.notFound((c) => {
  return c.json({ success: false, error: 'Route non trouvée' }, 404);
});

// ============================================================
// Error Handler
// ============================================================
app.onError((err, c) => {
  console.error('Erreur serveur:', err);
  return c.json({ 
    success: false, 
    error: c.env.ENVIRONMENT === 'development' ? err.message : 'Erreur interne' 
  }, 500);
});

export default app;
```

---

## 🔑 Routes Authentification

Créer `cloudflare/src/routes/auth.ts` :

```typescript
import { Hono } from 'hono';
import { Env, LoginRequest, LoginResponse, ApiResponse } from '../types';
import { verifyPassword, generateSessionToken, isValidEmail, sanitizeString } from '../utils/security';

const auth = new Hono<{ Bindings: Env }>();

// ============================================================
// POST /auth/login - Connexion
// ============================================================
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json<LoginRequest>();
    const email = sanitizeString(body.email?.toLowerCase() || '', 255);
    const password = body.password || '';

    // Validation
    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({ success: false, error: 'Email invalide' }, 400);
    }
    if (password.length < 8 || password.length > 128) {
      return c.json<ApiResponse>({ success: false, error: 'Mot de passe invalide' }, 400);
    }

    const db = c.env.DB;

    // Rechercher l'utilisateur
    const user = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first<{ id: string; email: string; password_hash: string }>();

    if (!user) {
      return c.json<ApiResponse>({ success: false, error: 'Identifiants incorrects' }, 401);
    }

    // Vérifier le mot de passe
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return c.json<ApiResponse>({ success: false, error: 'Identifiants incorrects' }, 401);
    }

    // Récupérer le rôle
    const roleResult = await db
      .prepare('SELECT role FROM user_roles WHERE user_id = ?')
      .bind(user.id)
      .first<{ role: string }>();

    // Créer la session
    const token = generateSessionToken();
    const sessionDuration = parseInt(c.env.SESSION_DURATION || '604800');
    const expiresAt = new Date(Date.now() + sessionDuration * 1000).toISOString();

    await db
      .prepare(`
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES (?, ?, ?)
      `)
      .bind(user.id, token, expiresAt)
      .run();

    // Audit log
    await db
      .prepare(`
        INSERT INTO audit_logs (user_id, action, resource_type, ip_address)
        VALUES (?, 'login', 'session', ?)
      `)
      .bind(user.id, c.req.header('CF-Connecting-IP') || 'unknown')
      .run();

    return c.json<ApiResponse<LoginResponse>>({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: roleResult?.role || 'user'
        }
      }
    });

  } catch (error) {
    console.error('Erreur login:', error);
    return c.json<ApiResponse>({ success: false, error: 'Erreur serveur' }, 500);
  }
});

// ============================================================
// POST /auth/logout - Déconnexion
// ============================================================
auth.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json<ApiResponse>({ success: true, message: 'Déconnecté' });
    }

    const token = authHeader.substring(7);
    const db = c.env.DB;

    await db
      .prepare('DELETE FROM sessions WHERE token = ?')
      .bind(token)
      .run();

    return c.json<ApiResponse>({ success: true, message: 'Déconnecté' });
  } catch (error) {
    return c.json<ApiResponse>({ success: true, message: 'Déconnecté' });
  }
});

// ============================================================
// GET /auth/me - Utilisateur courant
// ============================================================
auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json<ApiResponse>({ success: false, error: 'Non authentifié' }, 401);
  }

  const token = authHeader.substring(7);
  const db = c.env.DB;

  const session = await db
    .prepare(`
      SELECT s.*, u.email, ur.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `)
    .bind(token)
    .first<{ user_id: string; email: string; role: string }>();

  if (!session) {
    return c.json<ApiResponse>({ success: false, error: 'Session invalide' }, 401);
  }

  return c.json<ApiResponse>({
    success: true,
    data: {
      id: session.user_id,
      email: session.email,
      role: session.role || 'user'
    }
  });
});

export default auth;
```

---

## 🎟️ Routes Tombola

Créer `cloudflare/src/routes/tombola.ts` :

```typescript
import { Hono } from 'hono';
import { Env, TombolaParticipant, TombolaParticipantPublic, TombolaLot, ApiResponse } from '../types';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { sanitizeString, escapeHtml, isValidEmail, generateUUID } from '../utils/security';

const tombola = new Hono<{ Bindings: Env }>();

// ============================================================
// PARTICIPANTS
// ============================================================

// GET /tombola/participants - Liste publique (sans emails)
tombola.get('/participants', async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db
      .prepare(`
        SELECT id, prenom, role, classes, emoji, created_at
        FROM tombola_participants
        ORDER BY created_at DESC
      `)
      .all<TombolaParticipantPublic>();

    return c.json<ApiResponse<TombolaParticipantPublic[]>>({
      success: true,
      data: results || []
    });
  } catch (error) {
    console.error('Erreur liste participants:', error);
    return c.json<ApiResponse>({ success: false, error: 'Erreur serveur' }, 500);
  }
});

// POST /tombola/participants - Créer un participant
tombola.post('/participants', async (c) => {
  try {
    const body = await c.req.json();
    const db = c.env.DB;

    // Validation
    const prenom = sanitizeString(body.prenom || '', 100);
    const email = sanitizeString(body.email?.toLowerCase() || '', 255);
    const role = sanitizeString(body.role || 'Parent participant', 100);
    const classes = body.classes ? sanitizeString(body.classes, 100) : null;
    const emoji = body.emoji || '😊';

    if (!prenom || prenom.length < 2) {
      return c.json<ApiResponse>({ success: false, error: 'Prénom requis (min 2 caractères)' }, 400);
    }
    if (!isValidEmail(email)) {
      return c.json<ApiResponse>({ success: false, error: 'Email invalide' }, 400);
    }

    // Vérifier si l'email existe déjà
    const existing = await db
      .prepare('SELECT id FROM tombola_participants WHERE email = ?')
      .bind(email)
      .first();

    if (existing) {
      return c.json<ApiResponse>({ success: false, error: 'Cet email est déjà inscrit' }, 409);
    }

    // Créer le participant
    const id = generateUUID();
    await db
      .prepare(`
        INSERT INTO tombola_participants (id, prenom, email, role, classes, emoji)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(id, escapeHtml(prenom), email, escapeHtml(role), classes ? escapeHtml(classes) : null, emoji)
      .run();

    // Retourner sans l'email
    return c.json<ApiResponse<TombolaParticipantPublic>>({
      success: true,
      data: {
        id,
        prenom: escapeHtml(prenom),
        role: escapeHtml(role),
        classes: classes ? escapeHtml(classes) : null,
        emoji,
        created_at: new Date().toISOString()
      }
    }, 201);

  } catch (error) {
    console.error('Erreur création participant:', error);
    return c.json<ApiResponse>({ success: false, error: 'Erreur serveur' }, 500);
  }
});

// GET /tombola/contact/:participantId - Générer lien de contact sécurisé
tombola.get('/contact/:participantId', async (c) => {
  try {
    const participantId = c.req.param('participantId');
    const db = c.env.DB;

    const participant = await db
      .prepare('SELECT email, prenom FROM tombola_participants WHERE id = ?')
      .bind(participantId)
      .first<{ email: string; prenom: string }>();

    if (!participant) {
      return c.json<ApiResponse>({ success: false, error: 'Participant non trouvé' }, 404);
    }

    // Générer le lien mailto
    const subject = encodeURIComponent(`Tombola - Contact de ${participant.prenom}`);
    const mailtoLink = `mailto:${participant.email}?subject=${subject}`;

    return c.json<ApiResponse<{ link: string }>>({
      success: true,
      data: { link: mailtoLink }
    });
  } catch (error) {
    console.error('Erreur contact:', error);
    return c.json<ApiResponse>({ success: false, error: 'Erreur serveur' }, 500);
  }
});

// ============================================================
// LOTS
// ============================================================

// GET /tombola/lots - Liste des lots avec infos participant
tombola.get('/lots', async (c) => {
  try {
    const db = c.env.DB;

    const { results } = await db
      .prepare(`
        SELECT 
          l.*,
          p.prenom as parent_prenom,
          p.emoji as parent_emoji,
          r.prenom as reserved_by_prenom,
          r.emoji as reserved_by_emoji
        FROM tombola_lots l
        JOIN tombola_participants p ON l.parent_id = p.id
        LEFT JOIN tombola_participants r ON l.reserved_by = r.id
        ORDER BY l.created_at DESC
      `)
      .all();

    return c.json<ApiResponse>({
      success: true,
      data: results || []
    });
  } catch (error) {
    console.error('Erreur liste lots:', error);
    return c.json<ApiResponse>({ success: false, error: 'Erreur serveur' }, 500);
  }
});

// POST /tombola/lots - Créer un lot
tombola.post('/lots', async (c) => {
  try {
    const body = await c.req.json();
    const db = c.env.DB;

    // Validation
    const nom = sanitizeString(body.nom || '', 200);
    const description = body.description ? sanitizeString(body.description, 1000) : null;
    const icone = body.icone || '🎁';
    const parentId = body.parent_id;

    if (!nom || nom.length < 2) {
      return c.json<ApiResponse>({ success: false, error: 'Nom du lot requis' }, 400);
    }
    if (!parentId) {
      return c.json<ApiResponse>({ success: false, error: 'Participant requis' }, 400);
    }

    // Vérifier que le participant existe
    const participant = await db
      .prepare('SELECT id FROM tombola_participants WHERE id = ?')
      .bind(parentId)
      .first();

    if (!participant) {
      return c.json<ApiResponse>({ success: false, error: 'Participant non trouvé' }, 404);
    }

    // Créer le lot
    const id = generateUUID();
    await db
      .prepare(`
        INSERT INTO tombola_lots (id, nom, description, icone, parent_id)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(id, escapeHtml(nom), description ? escapeHtml(description) : null, icone, parentId)
      .run();

    return c.json<ApiResponse>({
      success: true,
      data: {
        id,
        nom: escapeHtml(nom),
        description: description ? escapeHtml(description) : null,
        icone,
        statut: 'disponible',
        parent_id: parentId,
        reserved_by: null,
        created_at: new Date().toISOString()
      }
    }, 201);

  } catch (error) {
    console.error('Erreur création lot:', error);
    return c.json<ApiResponse>({ success: false, error: 'Erreur serveur' }, 500);
  }
});

// PATCH /tombola/lots/:id/reserve - Réserver un lot
tombola.patch('/lots/:id/reserve', async (c) => {
  try {
    const lotId = c.req.param('id');
    const body = await c.req.json();
    const reservedBy = body.reserved_by;
    const db = c.env.DB;

    if (!reservedBy) {
      return c.json<ApiResponse>({ success: false, error: 'Participant requis' }, 400);
    }

    // Vérifier le lot
    const lot = await db
      .prepare('SELECT * FROM tombola_lots WHERE id = ?')
      .bind(lotId)
      .first<TombolaLot>();

    if (!lot) {
      return c.json<ApiResponse>({ success: false, error: 'Lot non trouvé' }, 404);
    }
    if (lot.statut !== 'disponible') {
      return c.json<ApiResponse>({ success: false, error: 'Lot non disponible' }, 400);
    }
    if (lot.parent_id === reservedBy) {
      return c.json<ApiResponse>({ success: false, error: 'Vous ne pouvez pas réserver votre propre lot' }, 400);
    }

    // Réserver
    await db
      .prepare(`
        UPDATE tombola_lots 
        SET statut = 'réservé', reserved_by = ?
        WHERE id = ?
      `)
      .bind(reservedBy, lotId)
      .run();

    return c.json<ApiResponse>({
      success: true,
      message: 'Lot réservé avec succès'
    });

  } catch (error) {
    console.error('Erreur réservation:', error);
    return c.json<ApiResponse>({ success: false, error: 'Erreur serveur' }, 500);
  }
});

// PATCH /tombola/lots/:id/cancel - Annuler réservation
tombola.patch('/lots/:id/cancel', async (c) => {
  try {
    const lotId = c.req.param('id');
    const body = await c.req.json();
    const participantId = body.participant_id;
    const db = c.env.DB;

    // Vérifier le lot
    const lot = await db
      .prepare('SELECT * FROM tombola_lots WHERE id = ?')
      .bind(lotId)
      .first<TombolaLot>();

    if (!lot) {
      return c.json<ApiResponse>({ success: false, error: 'Lot non trouvé' }, 404);
    }
    if (lot.statut !== 'réservé') {
      return c.json<ApiResponse>({ success: false, error: 'Lot non réservé' }, 400);
    }
    if (lot.reserved_by !== participantId) {
      return c.json<ApiResponse>({ success: false, error: 'Non autorisé' }, 403);
    }

    // Annuler
    await db
      .prepare(`
        UPDATE tombola_lots 
        SET statut = 'disponible', reserved_by = NULL
        WHERE id = ?
      `)
      .bind(lotId)
      .run();

    return c.json<ApiResponse>({
      success: true,
      message: 'Réservation annulée'
    });

  } catch (error) {
    console.error('Erreur annulation:', error);
    return c.json<ApiResponse>({ success: false, error: 'Erreur serveur' }, 500);
  }
});

// DELETE /tombola/lots/:id - Supprimer un lot (propriétaire ou admin)
tombola.delete('/lots/:id', async (c) => {
  try {
    const lotId = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    const participantId = body.participant_id;
    const db = c.env.DB;

    // Vérifier le lot
    const lot = await db
      .prepare('SELECT * FROM tombola_lots WHERE id = ?')
      .bind(lotId)
      .first<TombolaLot>();

    if (!lot) {
      return c.json<ApiResponse>({ success: false, error: 'Lot non trouvé' }, 404);
    }

    // Vérifier autorisation (propriétaire uniquement pour l'instant)
    if (lot.parent_id !== participantId) {
      return c.json<ApiResponse>({ success: false, error: 'Non autorisé' }, 403);
    }

    // Supprimer
    await db
      .prepare('DELETE FROM tombola_lots WHERE id = ?')
      .bind(lotId)
      .run();

    return c.json<ApiResponse>({
      success: true,
      message: 'Lot supprimé'
    });

  } catch (error) {
    console.error('Erreur suppression:', error);
    return c.json<ApiResponse>({ success: false, error: 'Erreur serveur' }, 500);
  }
});

export default tombola;
```

---

## 🚀 Guide de Démarrage Local

### Étape 1 : Installation

```bash
cd cloudflare
npm install
```

### Étape 2 : Créer la base de données locale

```bash
# Créer la structure D1
npm run db:migrate

# (Optionnel) Ajouter l'admin
npm run db:seed
```

### Étape 3 : Lancer le serveur de développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:8787`

### Étape 4 : Tester l'API

```bash
# Health check
curl http://localhost:8787/

# Liste des participants
curl http://localhost:8787/tombola/participants

# Créer un participant
curl -X POST http://localhost:8787/tombola/participants \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Marie","email":"marie@test.com","role":"Parent","classes":"CP","emoji":"🌸"}'

# Liste des lots
curl http://localhost:8787/tombola/lots
```

---

## 🔐 Sécurité Implémentée

| Protection | Implémentation |
|------------|----------------|
| XSS | Échappement HTML via `escapeHtml()` |
| Injection SQL | Requêtes paramétrées D1 |
| Bruteforce | Rate limiting (configurable) |
| Sessions | Tokens 64 chars hex, expiration |
| Mots de passe | PBKDF2-SHA256, 100k itérations |
| CORS | Configuration par environnement |
| Emails | Non exposés publiquement |

---

## 📋 Checklist de Déploiement Production

1. [ ] Créer la base D1 sur Cloudflare : `npm run db:create`
2. [ ] Mettre à jour `database_id` dans `wrangler.toml`
3. [ ] Exécuter les migrations : `npm run db:migrate:remote`
4. [ ] Configurer le secret JWT : `wrangler secret put JWT_SECRET`
5. [ ] Créer l'admin avec un vrai hash PBKDF2
6. [ ] Mettre à jour `CORS_ORIGIN` avec l'URL de production
7. [ ] Déployer : `npm run deploy`

---

*Documentation générée pour la migration Tombola vers Cloudflare D1*
