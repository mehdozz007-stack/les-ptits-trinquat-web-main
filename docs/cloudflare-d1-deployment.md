# Guide de Déploiement Cloudflare D1 - Les P'tits Trinquat

> Configuration et installation complète pour Cloudflare Pages + Workers + D1

## 📋 Table des matières

1. [Prérequis](#-prérequis)
2. [Architecture Cloudflare](#-architecture-cloudflare)
3. [Installation Rapide](#-installation-rapide)
4. [Configuration D1](#-configuration-d1)
5. [Déploiement Workers](#-déploiement-workers)
6. [Déploiement Pages](#-déploiement-pages)
7. [Configuration Secrets](#-configuration-secrets)
8. [Vérification](#-vérification)

---

## 📦 Prérequis

### Comptes et Outils Requis

| Élément | Description | Installation |
|---------|-------------|--------------|
| **Compte Cloudflare** | [dash.cloudflare.com](https://dash.cloudflare.com) | Gratuit |
| **Node.js** | Version 18+ | [nodejs.org](https://nodejs.org) |
| **Wrangler CLI** | `npm install -g wrangler` | Via npm |
| **Git** | Contrôle de version | [git-scm.com](https://git-scm.com) |
| **Compte Resend** | Envoi d'emails | [resend.com](https://resend.com) |

### Installation Wrangler

```bash
# Installation globale
npm install -g wrangler

# Authentification (ouvre le navigateur)
wrangler login

# Vérification
wrangler whoami
```

---

## 🏗 Architecture Cloudflare

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Cloudflare  │    │  Cloudflare  │    │  Cloudflare  │  │
│  │    Pages     │◄──►│   Workers    │◄──►│     D1       │  │
│  │  (Frontend)  │    │  (API Hono)  │    │  (SQLite)    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                             │                               │
│                             ▼                               │
│                      ┌──────────────┐                       │
│                      │    Resend    │                       │
│                      │   (Emails)   │                       │
│                      └──────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Comparaison Supabase → Cloudflare

| Supabase | Cloudflare | Notes |
|----------|------------|-------|
| PostgreSQL | D1 (SQLite) | Syntaxe similaire, quelques différences |
| Edge Functions | Workers | API différente, même concept |
| Supabase Auth | Workers + D1 | Implémentation manuelle requise |
| RLS Policies | Logique Workers | Vérification dans le code |
| Realtime | Durable Objects | Optionnel, plus complexe |

---

## 🗄 Configuration D1

### Création de la Base de Données

```bash
# Créer la base D1
wrangler d1 create les-ptits-trinquat-db

# Résultat (noter le database_id) :
# ✅ Successfully created DB 'les-ptits-trinquat-db'
# [[d1_databases]]
# binding = "DB"
# database_name = "les-ptits-trinquat-db"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Configuration wrangler.toml

Créer `wrangler.toml` à la racine du projet :

```toml
name = "les-ptits-trinquat"
main = "workers/index.ts"
compatibility_date = "2024-01-01"

# Base de données D1
[[d1_databases]]
binding = "DB"
database_name = "les-ptits-trinquat-db"
database_id = "VOTRE_DATABASE_ID"

# Variables d'environnement
[vars]
ENVIRONMENT = "production"

# KV pour les sessions (optionnel)
# [[kv_namespaces]]
# binding = "SESSIONS"
# id = "VOTRE_KV_ID"
```

---

## 📝 Migration de la Base de Données

### Adaptation SQLite (D1)

> ⚠️ D1 utilise SQLite, pas PostgreSQL. Quelques adaptations sont nécessaires.

Créer `migrations/0001_initial.sql` :

```sql
-- ============================================================
-- MIGRATION D1 (SQLite) - Les P'tits Trinquat
-- ============================================================

-- Note: SQLite n'a pas d'ENUM, on utilise TEXT avec CHECK

-- 1. TABLE USER_ROLES
CREATE TABLE IF NOT EXISTS user_roles (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (user_id, role)
);

-- 2. TABLE USERS (Authentification personnalisée)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 3. TABLE SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 4. TABLE NEWSLETTER_SUBSCRIBERS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    consent INTEGER NOT NULL DEFAULT 0 CHECK (consent IN (0, 1)),
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 5. TABLE NEWSLETTERS
CREATE TABLE IF NOT EXISTS newsletters (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent')),
    sent_at TEXT,
    recipients_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 6. TABLE TOMBOLA_PARTICIPANTS
CREATE TABLE IF NOT EXISTS tombola_participants (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Parent participant',
    classes TEXT,
    emoji TEXT NOT NULL DEFAULT '😊',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 7. TABLE TOMBOLA_LOTS
CREATE TABLE IF NOT EXISTS tombola_lots (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    nom TEXT NOT NULL,
    description TEXT,
    icone TEXT NOT NULL DEFAULT '🎁',
    statut TEXT NOT NULL DEFAULT 'disponible' CHECK (statut IN ('disponible', 'réservé', 'remis')),
    parent_id TEXT NOT NULL REFERENCES tombola_participants(id),
    reserved_by TEXT REFERENCES tombola_participants(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 8. INDEX POUR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_tombola_lots_parent_id ON tombola_lots(parent_id);
CREATE INDEX IF NOT EXISTS idx_tombola_lots_statut ON tombola_lots(statut);
```

### Exécuter la Migration

```bash
# Migration locale (développement)
wrangler d1 execute les-ptits-trinquat-db --local --file=migrations/0001_initial.sql

# Migration production
wrangler d1 execute les-ptits-trinquat-db --file=migrations/0001_initial.sql
```

---

## ⚡ Configuration Workers

### Structure des Workers

```
workers/
├── index.ts              # Point d'entrée principal
├── routes/
│   ├── auth.ts           # Authentification
│   ├── newsletter.ts     # API Newsletter
│   ├── tombola.ts        # API Tombola
│   └── email.ts          # Envoi emails (Resend)
├── middleware/
│   ├── auth.ts           # Vérification session
│   └── cors.ts           # Headers CORS
├── utils/
│   ├── password.ts       # Hash/verify passwords
│   ├── session.ts        # Gestion sessions
│   └── email.ts          # Templates emails
└── types.ts              # Types TypeScript
```

### Worker Principal (`workers/index.ts`)

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Env = {
  DB: D1Database;
  RESEND_API_KEY: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Env }>();

// Middleware CORS
app.use('/*', cors({
  origin: ['https://les-ptits-trinquat.pages.dev', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Routes API
app.get('/api/health', (c) => c.json({ status: 'ok' }));

// Newsletter - Inscription publique
app.post('/api/newsletter/subscribe', async (c) => {
  const { email, first_name, consent } = await c.req.json();
  
  if (!consent) {
    return c.json({ error: 'Consent required' }, 400);
  }
  
  try {
    await c.env.DB.prepare(
      'INSERT INTO newsletter_subscribers (email, first_name, consent) VALUES (?, ?, 1)'
    ).bind(email, first_name || null).run();
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Email already subscribed' }, 409);
  }
});

// Tombola - Liste publique (sans emails)
app.get('/api/tombola/participants', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT id, prenom, role, classes, emoji, created_at FROM tombola_participants'
  ).all();
  
  return c.json(result.results);
});

// Tombola - Liste des lots
app.get('/api/tombola/lots', async (c) => {
  const result = await c.env.DB.prepare(`
    SELECT l.*, 
           p.prenom as parent_prenom, p.emoji as parent_emoji,
           r.prenom as reserver_prenom, r.emoji as reserver_emoji
    FROM tombola_lots l
    LEFT JOIN tombola_participants p ON l.parent_id = p.id
    LEFT JOIN tombola_participants r ON l.reserved_by = r.id
  `).all();
  
  return c.json(result.results);
});

// Auth - Login (exemple simplifié)
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  
  // Récupérer l'utilisateur
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first();
  
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  
  // Vérifier le mot de passe (bcrypt via WebCrypto)
  // ... implémentation hash verification
  
  // Créer une session
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  
  await c.env.DB.prepare(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)'
  ).bind(user.id, token, expiresAt).run();
  
  return c.json({ token, user: { id: user.id, email: user.email } });
});

// Middleware Auth pour routes admin
const requireAdmin = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const token = authHeader.slice(7);
  
  const session = await c.env.DB.prepare(`
    SELECT s.*, u.id as user_id, ur.role
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).bind(token).first();
  
  if (!session || session.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }
  
  c.set('user', session);
  await next();
};

// Routes Admin protégées
app.get('/api/admin/subscribers', requireAdmin, async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT * FROM newsletter_subscribers ORDER BY created_at DESC'
  ).all();
  
  return c.json(result.results);
});

app.post('/api/admin/newsletter/send', requireAdmin, async (c) => {
  const { subject, content } = await c.req.json();
  
  // Récupérer les abonnés actifs
  const subscribers = await c.env.DB.prepare(
    'SELECT * FROM newsletter_subscribers WHERE is_active = 1 AND consent = 1'
  ).all();
  
  // Échapper le contenu HTML
  const escapeHtml = (text: string) => text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  // Envoyer via Resend
  const results = [];
  for (const subscriber of subscribers.results as any[]) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Les P\'tits Trinquat <newsletter@ptits-trinquat.fr>',
          to: subscriber.email,
          subject: escapeHtml(subject),
          html: content.replace('{{prenom}}', escapeHtml(subscriber.first_name || 'Parent')),
        }),
      });
      
      results.push({ email: subscriber.email, success: response.ok });
    } catch (error) {
      results.push({ email: subscriber.email, success: false });
    }
  }
  
  // Sauvegarder la newsletter
  await c.env.DB.prepare(`
    INSERT INTO newsletters (title, subject, content, status, sent_at, recipients_count)
    VALUES (?, ?, ?, 'sent', datetime('now'), ?)
  `).bind(subject, subject, content, results.filter(r => r.success).length).run();
  
  return c.json({ sent: results.filter(r => r.success).length, total: results.length });
});

export default app;
```

### Dépendance Hono

```bash
# Ajouter Hono pour les Workers
npm install hono
```

---

## 🌐 Déploiement Pages

### Configuration Build

Créer/modifier `package.json` :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy:worker": "wrangler deploy",
    "deploy:pages": "wrangler pages deploy dist",
    "db:migrate": "wrangler d1 execute les-ptits-trinquat-db --file=migrations/0001_initial.sql",
    "db:migrate:local": "wrangler d1 execute les-ptits-trinquat-db --local --file=migrations/0001_initial.sql"
  }
}
```

### Déploiement Initial

```bash
# 1. Build du frontend
npm run build

# 2. Déployer le Worker
npm run deploy:worker

# 3. Déployer les Pages
npm run deploy:pages

# 4. Exécuter les migrations
npm run db:migrate
```

### Configuration Pages (Dashboard)

1. Aller sur [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create application** → **Pages**
3. Connecter le repository GitHub
4. Configuration :
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

---

## 🔐 Variables d'Environnement

### Secrets à Configurer

```bash
# Configurer les secrets du Worker
wrangler secret put RESEND_API_KEY
# Entrer la clé API Resend

wrangler secret put JWT_SECRET
# Entrer une clé secrète pour les JWT (ex: openssl rand -hex 32)
```

### Variables Pages

Dans le dashboard Cloudflare Pages :
1. **Settings** → **Environment variables**
2. Ajouter :

| Variable | Production | Preview |
|----------|------------|---------|
| `VITE_API_URL` | `https://les-ptits-trinquat.workers.dev` | `http://localhost:8787` |

---

## 🔧 Adaptation du Code

### Nouveau Client API (`src/lib/api.ts`)

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Newsletter
  async subscribeNewsletter(data: { email: string; first_name?: string; consent: boolean }) {
    return this.fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tombola
  async getTombolaParticipants() {
    return this.fetch('/api/tombola/participants');
  }

  async getTombolaLots() {
    return this.fetch('/api/tombola/lots');
  }

  // Auth
  async login(email: string, password: string) {
    const result = await this.fetch<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(result.token);
    return result;
  }

  async logout() {
    this.setToken(null);
  }

  // Admin
  async getSubscribers() {
    return this.fetch('/api/admin/subscribers');
  }

  async sendNewsletter(subject: string, content: string) {
    return this.fetch('/api/admin/newsletter/send', {
      method: 'POST',
      body: JSON.stringify({ subject, content }),
    });
  }
}

export const api = new ApiClient();
```

### Modification des Hooks

Remplacer les imports Supabase par le nouveau client API :

```typescript
// Avant (Supabase)
import { supabase } from "@/integrations/supabase/client";

// Après (Cloudflare)
import { api } from "@/lib/api";
```

---

## ✅ Checklist de Déploiement

### Préparation
- [ ] Compte Cloudflare créé
- [ ] Wrangler CLI installé et configuré
- [ ] Base D1 créée
- [ ] `wrangler.toml` configuré

### Base de Données
- [ ] Migration exécutée en local
- [ ] Migration exécutée en production
- [ ] Admin initial créé

### Workers
- [ ] Code Worker déployé
- [ ] Secrets configurés (RESEND_API_KEY, JWT_SECRET)
- [ ] Routes testées

### Frontend
- [ ] Variables d'environnement configurées
- [ ] Build réussi
- [ ] Pages déployées

### Tests
- [ ] Inscription newsletter ✓
- [ ] Affichage tombola ✓
- [ ] Login admin ✓
- [ ] Envoi newsletter ✓

---

## 🔄 Différences Clés Supabase vs Cloudflare D1

| Aspect | Supabase | Cloudflare D1 |
|--------|----------|---------------|
| **SQL** | PostgreSQL | SQLite |
| **UUID** | `gen_random_uuid()` | `lower(hex(randomblob(16)))` |
| **Boolean** | `boolean` | `INTEGER (0/1)` |
| **Timestamp** | `timestamptz` | `TEXT (ISO 8601)` |
| **Enum** | `CREATE TYPE` | `CHECK constraint` |
| **RLS** | Politiques natives | Logique dans Workers |
| **Auth** | Supabase Auth | Implémentation custom |
| **Realtime** | WebSocket natif | Durable Objects |

---

## 📞 Support

- **Documentation Cloudflare D1**: [developers.cloudflare.com/d1](https://developers.cloudflare.com/d1)
- **Documentation Workers**: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- **Documentation Pages**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Hono Framework**: [hono.dev](https://hono.dev)

---

*Guide de déploiement pour Les P'tits Trinquat - Migration Cloudflare D1*
