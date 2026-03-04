# Schéma Base de Données SQLite - Cloudflare D1

> Documentation complète pour le déploiement sur Cloudflare D1

## 📋 Vue d'Ensemble

Cette documentation décrit le schéma de base de données SQLite optimisé pour Cloudflare D1, couvrant les fonctionnalités Newsletter et Tombola.

---

## 🗄 Architecture des Tables

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTIFICATION                          │
├─────────────────────────────────────────────────────────────┤
│  users ─────────────┬─── user_roles                          │
│                     └─── sessions                            │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    NEWSLETTER    │  │     TOMBOLA      │  │    SÉCURITÉ      │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ newsletter_      │  │ tombola_         │  │ audit_logs       │
│ subscribers      │  │ participants     │  │ rate_limits      │
│ newsletters      │  │ tombola_lots     │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 📊 Schéma Détaillé des Tables

### 1. `users` - Utilisateurs

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | TEXT | PK, DEFAULT randomblob | UUID unique |
| `email` | TEXT | NOT NULL, UNIQUE, NOCASE | Email (insensible à la casse) |
| `password_hash` | TEXT | NOT NULL | Hash PBKDF2 du mot de passe |
| `created_at` | TEXT | NOT NULL, DEFAULT now | Date ISO 8601 |
| `updated_at` | TEXT | NOT NULL, DEFAULT now | Date ISO 8601 |

### 2. `user_roles` - Rôles Utilisateurs

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | TEXT | PK | UUID unique |
| `user_id` | TEXT | NOT NULL, FK → users | Référence utilisateur |
| `role` | TEXT | NOT NULL, CHECK (admin/user) | Rôle applicatif |
| `created_at` | TEXT | NOT NULL, DEFAULT now | Date création |

**Contraintes:**
- `UNIQUE (user_id, role)` - Un utilisateur ne peut avoir qu'une fois chaque rôle
- `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`

### 3. `sessions` - Sessions Actives

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | TEXT | PK | UUID unique |
| `user_id` | TEXT | NOT NULL, FK → users | Référence utilisateur |
| `token` | TEXT | NOT NULL, UNIQUE | Token de session (64 chars hex) |
| `expires_at` | TEXT | NOT NULL | Date d'expiration ISO 8601 |
| `created_at` | TEXT | NOT NULL, DEFAULT now | Date création |

### 4. `newsletter_subscribers` - Abonnés Newsletter

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | TEXT | PK | UUID unique |
| `email` | TEXT | NOT NULL, UNIQUE, NOCASE | Email abonné |
| `first_name` | TEXT | NULL | Prénom (optionnel) |
| `consent` | INTEGER | NOT NULL, CHECK (0/1) | Consentement RGPD |
| `is_active` | INTEGER | NOT NULL, DEFAULT 1 | Statut actif |
| `created_at` | TEXT | NOT NULL, DEFAULT now | Date inscription |

### 5. `newsletters` - Campagnes Newsletter

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | TEXT | PK | UUID unique |
| `title` | TEXT | NOT NULL | Titre interne |
| `subject` | TEXT | NOT NULL | Objet de l'email |
| `content` | TEXT | NOT NULL | Contenu HTML |
| `status` | TEXT | NOT NULL, CHECK | draft/sent/failed |
| `sent_at` | TEXT | NULL | Date d'envoi |
| `recipients_count` | INTEGER | DEFAULT 0 | Nombre de destinataires |
| `created_at` | TEXT | NOT NULL, DEFAULT now | Date création |
| `updated_at` | TEXT | NOT NULL, DEFAULT now | Date modification |

### 6. `tombola_participants` - Participants Tombola

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | TEXT | PK | UUID unique |
| `user_id` | TEXT | NULL, FK → users | Lien vers compte (optionnel) |
| `prenom` | TEXT | NOT NULL | Prénom affiché |
| `email` | TEXT | NOT NULL | Email (privé) |
| `role` | TEXT | NOT NULL, DEFAULT | Rôle affiché |
| `classes` | TEXT | NULL | Classes des enfants |
| `emoji` | TEXT | NOT NULL, DEFAULT '😊' | Avatar emoji |
| `created_at` | TEXT | NOT NULL, DEFAULT now | Date inscription |

### 7. `tombola_lots` - Lots de la Tombola

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | TEXT | PK | UUID unique |
| `nom` | TEXT | NOT NULL | Nom du lot |
| `description` | TEXT | NULL | Description détaillée |
| `icone` | TEXT | NOT NULL, DEFAULT '🎁' | Icône emoji |
| `statut` | TEXT | NOT NULL, CHECK | disponible/réservé/remis |
| `parent_id` | TEXT | NOT NULL, FK | Donateur du lot |
| `reserved_by` | TEXT | NULL, FK | Réservant |
| `created_at` | TEXT | NOT NULL, DEFAULT now | Date création |

### 8. `audit_logs` - Journalisation

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | TEXT | PK | UUID unique |
| `user_id` | TEXT | NULL | Utilisateur (si connecté) |
| `action` | TEXT | NOT NULL | Type d'action |
| `resource_type` | TEXT | NOT NULL | Type de ressource |
| `resource_id` | TEXT | NULL | ID de la ressource |
| `ip_address` | TEXT | NULL | Adresse IP |
| `user_agent` | TEXT | NULL | User-Agent |
| `details` | TEXT | NULL | Détails JSON |
| `created_at` | TEXT | NOT NULL, DEFAULT now | Date |

### 9. `rate_limits` - Protection Anti-Abus

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | TEXT | PK | UUID unique |
| `identifier` | TEXT | NOT NULL | IP ou identifiant |
| `endpoint` | TEXT | NOT NULL | Route concernée |
| `request_count` | INTEGER | NOT NULL, DEFAULT 1 | Compteur |
| `window_start` | TEXT | NOT NULL, DEFAULT now | Début de fenêtre |

---

## 🔐 Mesures de Sécurité

### 1. Authentification

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUX D'AUTHENTIFICATION                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Client ──► POST /auth/login ──► Worker                      │
│                                    │                         │
│                                    ▼                         │
│                            ┌──────────────┐                  │
│                            │ Rate Limit   │ (5/min)          │
│                            └──────────────┘                  │
│                                    │                         │
│                                    ▼                         │
│                            ┌──────────────┐                  │
│                            │ Validation   │                  │
│                            │ Email/Pass   │                  │
│                            └──────────────┘                  │
│                                    │                         │
│                                    ▼                         │
│                            ┌──────────────┐                  │
│                            │ PBKDF2       │                  │
│                            │ Verify       │                  │
│                            └──────────────┘                  │
│                                    │                         │
│                                    ▼                         │
│                            ┌──────────────┐                  │
│                            │ Create       │                  │
│                            │ Session      │                  │
│                            └──────────────┘                  │
│                                    │                         │
│  Client ◄── { token } ◄───────────┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2. Hash de Mot de Passe (PBKDF2)

```typescript
// Algorithme utilisé : PBKDF2-SHA256
// Itérations : 100,000
// Sel : 16 bytes aléatoires
// Longueur du hash : 32 bytes

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedBits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: salt,
    iterations: 100000,
    hash: 'SHA-256'
  }, keyMaterial, 256);
  // Combine salt + hash en base64
}
```

### 3. Protection XSS

```typescript
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

### 4. Rate Limiting

| Endpoint | Limite | Fenêtre |
|----------|--------|---------|
| `/auth/login` | 5 requêtes | 60 secondes |
| `/auth/register` | 3 requêtes | 60 secondes |
| Routes générales | 60 requêtes | 60 secondes |
| `/newsletter/subscribe` | 10 requêtes | 60 secondes |

### 5. Validation des Entrées

```typescript
// Validation email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Limites de longueur
const LIMITS = {
  email: 255,
  password: { min: 8, max: 128 },
  name: 100,
  content: 50000
};

// Sanitization
function sanitizeString(input: string, maxLength: number): string {
  return input.trim().slice(0, maxLength);
}
```

### 6. Contrôle d'Accès (Équivalent RLS)

| Ressource | Public | Authentifié | Admin |
|-----------|--------|-------------|-------|
| Participants (sans email) | ✅ Lecture | ✅ Lecture | ✅ Tout |
| Participants (avec email) | ❌ | ❌ | ✅ Lecture |
| Lots | ✅ Lecture | ✅ Création* | ✅ Tout |
| Réservation lot | ❌ | ✅ Propre profil | ✅ Tout |
| Abonnés newsletter | ❌ | ❌ | ✅ Tout |
| Newsletters | ❌ | ❌ | ✅ Tout |

*Création uniquement pour son propre profil participant

---

## 🔄 Différences SQLite vs PostgreSQL

| Aspect | PostgreSQL (Supabase) | SQLite (D1) |
|--------|----------------------|-------------|
| UUID | `gen_random_uuid()` | `lower(hex(randomblob(16)))` |
| Boolean | `boolean` | `INTEGER (0/1)` |
| Timestamp | `timestamptz` | `TEXT (ISO 8601)` |
| Enum | `CREATE TYPE` | `CHECK constraint` |
| Case insensitive | `ILIKE` | `COLLATE NOCASE` |
| RLS | Politiques natives | Logique Workers |

---

## 📝 Migration SQL Complète

Voir le fichier : `cloudflare/migrations/0001_initial_schema.sql`

---

## ⚙️ Configuration Secrets

```bash
# Configurer les secrets Cloudflare Workers
wrangler secret put RESEND_API_KEY
wrangler secret put JWT_SECRET
```

| Secret | Description | Exemple |
|--------|-------------|---------|
| `RESEND_API_KEY` | Clé API Resend | `re_xxxxx` |
| `JWT_SECRET` | Clé signature tokens (min 32 chars) | `openssl rand -hex 32` |

---

## 🚀 Commandes de Déploiement

```bash
cd cloudflare

# Installation des dépendances
npm install

# Créer la base D1
npm run db:create

# Exécuter les migrations
npm run db:migrate

# Créer l'admin initial
npm run db:seed

# Développement local
npm run dev

# Déploiement production
npm run deploy
```

---

*Documentation Cloudflare D1 - Les P'tits Trinquat*
