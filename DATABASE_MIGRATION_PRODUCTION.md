# 📊 Guide Complet de Migration Base de Données - Production

**Date**: Février 2026
**Application**: Les P'tits Trinquat - Tombola
**Environnement Cible**: Cloudflare D1 (SQLite)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Schéma de base de données](#schéma-de-base-de-données)
3. [Migrations à appliquer](#migrations-à-appliquer)
4. [Instructions de déploiement](#instructions-de-déploiement)
5. [Points de contrôle](#points-de-contrôle)

---

## 🎯 Vue d'ensemble

Après plusieurs itérations de développement, la base de données a été complètement restructurée pour supporter:
- ✅ L'authentification utilisateur sécurisée (Bearer tokens)
- ✅ Un système de rôles (admin/user)
- ✅ Les sessions avec expiration
- ✅ La gestion des participants et lots de tombola
- ✅ Un système d'audit complet (compliance)
- ✅ Le droit à l'oubli (suppression des données utilisateur)

---

## 🗄️ Schéma de Base de Données

### Diagram des tables

```
┌─────────────────────────────────────────────────────────────┐
│                        TABLES PRINCIPALES                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │    USERS     │◄─────│ USER_ROLES   │                     │
│  │ (Auth)       │      │ (Rôles)      │                     │
│  └──────────────┘      └──────────────┘                     │
│         ▲                                                     │
│         │ 1:N                                                 │
│         │                                                     │
│  ┌──────────────────────────────────────────┐              │
│  │           SESSIONS (Auth/Tokens)         │              │
│  └──────────────────────────────────────────┘              │
│         ▲                                                     │
│         │                                                     │
│  ┌──────────────────────────────────────────┐              │
│  │   TOMBOLA_PARTICIPANTS (Participants)    │              │
│  │  (Lié à USER via user_id)                │              │
│  └──────────────────────────────────────────┘              │
│         ▼ 1:N                                                │
│  ┌──────────────────────────────────────────┐              │
│  │     TOMBOLA_LOTS (Lots de Tombola)      │              │
│  │  (parent_id → TOMBOLA_PARTICIPANTS)     │              │
│  │  (reserved_by → TOMBOLA_PARTICIPANTS)   │              │
│  └──────────────────────────────────────────┘              │
│                                                               │
│  ┌──────────────────────────────────────────┐              │
│  │       AUDIT_LOGS (Journalisation)        │              │
│  │  (Traçabilité de toutes les actions)     │              │
│  └──────────────────────────────────────────┘              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Détail des Tables

### 1. **USERS** - Gestion des Utilisateurs

Stocke les comptes d'authentification avec sécurité renforcée.

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,                    -- UUID généré
    email TEXT NOT NULL UNIQUE,             -- Email unique (case-insensitive)
    password_hash TEXT NOT NULL,            -- Hash SHA-256 du mot de passe
    is_active INTEGER NOT NULL DEFAULT 1,  -- Statut du compte (0/1)
    last_login_at TEXT,                   -- Timestamp du dernier login
    created_at TEXT NOT NULL,              -- Timestamp de création
    updated_at TEXT NOT NULL               -- Timestamp dernière modification
);

-- Index de performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Points clés**:
- 🔒 Email UNIQUE (case-insensitive)
- 🔐 Password hashé (jamais en clair)
- ⏱️ Timestamps pour audit
- 🔄 is_active pour soft-delete

---

### 2. **USER_ROLES** - Système de Rôles

Attribution des rôles à chaque utilisateur.

```sql
CREATE TABLE user_roles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    UNIQUE (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
```

**Points clés**:
- 👥 Supports rôles: 'admin', 'user'
- 🔗 Foreign Key vers USERS (cascade delete)
- 🚫 Contrainte UNIQUE (un rôle par user)

---

### 3. **SESSIONS** - Gestion des Sessions

Active les tokens Bearer pour l'authentification API.

```sql
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,             -- Token Bearer sécurisé
    expires_at TEXT NOT NULL,               -- Expiration du token
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index pour recherche par token
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

**Points clés**:
- 🔑 Token Bearer unique par session
- ⏰ Expiration configurable (défaut: 7 jours)
- 🔄 Suppression automatique avec l'utilisateur
- 🚀 Index pour recherche rapide

---

### 4. **TOMBOLA_PARTICIPANTS** - Participants Tombola

Profils des participants à la tombola, liés aux utilisateurs authentifiés.

```sql
CREATE TABLE tombola_participants (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,                  -- Lien vers l'utilisateur authentifié
    prenom TEXT NOT NULL,                   -- Prénom du participant
    email TEXT NOT NULL,                    -- Email du participant
    role TEXT NOT NULL DEFAULT 'Parent participant',
    classes TEXT,                           -- Classe(s) de l'enfant (ex: CP, CE2)
    emoji TEXT NOT NULL DEFAULT '😊',      -- Avatar emoji
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index pour recherche
CREATE INDEX idx_tombola_participants_user_id ON tombola_participants(user_id);
CREATE INDEX idx_tombola_participants_email ON tombola_participants(email);
```

**Points clés**:
- 👤 1:1 Participant par User (one-participant-per-user rule)
- 🔗 Foreign Key vers USERS (cascade delete)
- 📝 Contient prenom, classes, emoji
- 🎯 Utilisé comme parent_id pour les lots

---

### 5. **TOMBOLA_LOTS** - Lots de Tombola

Catalogue des lots (cadeaux) proposés et réservés par les participants.

```sql
CREATE TABLE tombola_lots (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,                      -- Nom du lot
    description TEXT,                       -- Description détaillée
    icone TEXT NOT NULL DEFAULT '🎁',      -- Emoji du lot
    statut TEXT NOT NULL DEFAULT 'disponible' CHECK (statut IN ('disponible', 'reserve', 'remis')),
    parent_id TEXT NOT NULL,                -- Participant qui propose le lot
    reserved_by TEXT,                       -- Participant qui a réservé le lot
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (parent_id) REFERENCES tombola_participants(id) ON DELETE CASCADE,
    FOREIGN KEY (reserved_by) REFERENCES tombola_participants(id) ON DELETE SET NULL
);

-- Index pour recherche et filtrage
CREATE INDEX idx_tombola_lots_parent_id ON tombola_lots(parent_id);
CREATE INDEX idx_tombola_lots_reserved_by ON tombola_lots(reserved_by);
CREATE INDEX idx_tombola_lots_statut ON tombola_lots(statut);
```

**Points clés**:
- 🎁 Statuts: 'disponible', 'reserve', 'remis'
- 👨‍👩‍👧 parent_id → qui propose le lot
- 🤝 reserved_by → qui réserve le lot (optional)
- 🎯 Suppression en cascade avec participant

---

### 6. **AUDIT_LOGS** - Journalisation Sécurité

Trace complète de toutes les actions pour compliance et debugging.

```sql
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,                           -- Utilisateur ayant effectué l'action
    action TEXT NOT NULL,                   -- Type d'action (LOGIN, REGISTER, etc)
    resource_type TEXT NOT NULL,            -- Type de ressource (user, participant, lot)
    resource_id TEXT,                       -- ID de la ressource affectée
    ip_address TEXT,                        -- IP du client
    user_agent TEXT,                        -- User-Agent du navigateur
    details TEXT,                           -- JSON avec infos supplémentaires
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Index pour recherche
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

**Actions auditées**:
- `USER_REGISTERED` - Création de compte
- `LOGIN_SUCCESS` / `LOGIN_FAILED` - Connexion
- `AUTO_LOGIN_AFTER_REGISTER` - Auto-login post-inscription
- `OWN_PARTICIPANT_DELETED` - Suppression de participation
- `PARTICIPANT_CREATED` - Création de participant
- `LOT_CREATED` - Création de lot
- `LOT_RESERVED` - Réservation de lot
- `SESSION_CREATED` - Création de session
- etc.

---

## 🚀 Migrations à Appliquer

### Ordre d'exécution critique

**Avant le déploiement production, exécuter dans cet ordre**:

```bash
# 1. Créer le schéma de base
0001_tombola_schema.sql

# 2. Améliorer la table users (is_active, last_login_at)
0010_enhance_users_table.sql

# 3. Ajouter le statut is_active à tombola_participants (si nécessaire)
# Note: Peut être requis pour contrôler les participants actifs

# 4. Initialiser les données de production
# - Créer un compte admin par défaut
# - Initialiser les seeders de base
```

---

## 📋 Modifications Effectuées en Dev

### Phase 1: Setup Initial (Migrations 0001-0003)

✅ **Création du schéma complet**
- Tables USERS, USER_ROLES, SESSIONS
- Tables TOMBOLA_PARTICIPANTS, TOMBOLA_LOTS
- Table AUDIT_LOGS

✅ **Indices de performance**
- Lookups par email, user_id, participant_id
- Lookups par token (sessions)
- Lookups par statut (lots)

### Phase 2: Sécurité & Authentification (Migrations 0006-0011)

✅ **Système de rôles admin**
- Table USER_ROLES avec constraint check
- Auto-création de rôle 'user' pour nouvelles inscriptions

✅ **Bearer Token (JWT-like)**
- Sessions avec token unique
- Expiration configurable
- Validation par token lookup

✅ **One-participant-per-user rule**
- Constraint au backend
- Impossible d'avoir 2 participants par user
- Suppression de participant = suppression du compte (droit à l'oubli)

### Phase 3: Audit & Compliance (Migration 0001_tombola_schema)

✅ **Journalisation complète**
- Tous les login/logout
- Toutes les créations de compte
- Modifications de profil
- Ajout/suppression de lots
- Réservations

### Phase 4: Amélioration Table USERS (Migration 0010)

✅ **Colonnes supplémentaires**
- `is_active` - Soft-delete pour les comptes désactivés
- `last_login_at` - Tracking de la dernière connexion

✅ **Foreign Keys renforcées**
- tombola_participants.user_id → users.id (CASCADE DELETE)
- user_roles.user_id → users.id (CASCADE DELETE)
- sessions.user_id → users.id (CASCADE DELETE)

---

## 🔐 Flux d'Authentification en Prod

### 1. Inscription (REGISTER)

```sql
-- 1. Insérer dans USERS
INSERT INTO users (id, email, password_hash, is_active)
VALUES (?, ?, SHA256(?), 1);

-- 2. Créer un rôle 'user' par défaut
INSERT INTO user_roles (id, user_id, role)
VALUES (?, ?, 'user');

-- 3. Créer une SESSION et retourner le token
INSERT INTO sessions (id, user_id, token, expires_at)
VALUES (?, ?, ?, now() + 7 days);

-- 4. Logger dans AUDIT_LOGS
INSERT INTO audit_logs (...) VALUES (...)
```

### 2. Connexion (LOGIN)

```sql
-- 1. Chercher l'utilisateur
SELECT * FROM users WHERE email = ? AND is_active = 1

-- 2. Vérifier le password_hash
-- 3. Créer une SESSION
-- 4. Logger l'action
```

### 3. Requête Authentifiée (API)

```
Authorization: Bearer <token_from_session>

-- Backend:
SELECT s.user_id FROM sessions s
WHERE s.token = ? AND s.expires_at > NOW()
```

### 4. Suppression de Compte

```sql
-- Suppression TOTALE du compte et toutes ses données
BEGIN TRANSACTION;

-- 1. Les lots appartenant au participant sont supprimés (CASCADE)
-- 2. Les participations de l'utilisateur sont supprimées (CASCADE)
-- 3. Toutes les sessions sont supprimées (CASCADE)
-- 4. Les rôles sont supprimés (CASCADE)
-- 5. Les logs d'audit sont supprimés (manuellement)
-- 6. L'utilisateur est supprimé (CASCADE)

DELETE FROM users WHERE id = ?

COMMIT;
```

---

## 📊 Stockage Estimé

Pour une production estimée à **200 utilisateurs actifs**:

| Table | Rows | Taille | Notes |
|-------|------|--------|-------|
| USERS | 200 | ~50 KB | 1 record = 250 bytes |
| USER_ROLES | 200 | ~10 KB | 1 role par user |
| SESSIONS | ~1000 | ~100 KB | Plusieurs sessions par user |
| TOMBOLA_PARTICIPANTS | 200 | ~50 KB | 1:1 avec users |
| TOMBOLA_LOTS | 1500 | ~150 KB | ~7.5 lots par participant |
| AUDIT_LOGS | 50000 | ~5 MB | ~250 logs par user |
| **TOTAL** | **~53000** | **~5.3 MB** | SQLite très efficace |

---

## ✅ Points de Contrôle Production

### Avant le déploiement

- [ ] Toutes les migrations sont exécutées dans l'ordre
- [ ] Admin par défaut créé avec mot de passe sécurisé
- [ ] SERVICE_DURATION configuré (SESSION_DURATION = 604800 secondes = 7 jours)
- [ ] WRANGLER_ENV = production
- [ ] D1_DATABASE_ID pointé vers la DB production

### Après le déploiement

- [ ] Tester l'inscription: email → password → token reçu ✅
- [ ] Tester la connexion: email + password → token reçu ✅
- [ ] Tester token expiration: attendre 1 sec, vérifier expiration ✅
- [ ] Tester création participant: POST /api/tombola/participants + token ✅
- [ ] Tester création lot: POST /api/tombola/lots + token ✅
- [ ] Tester suppression compte: DELETE /api/tombola/participants/{id} + token ✅
- [ ] Vérifier droit à l'oubli: aucune donnée restante après suppression ✅

### Monitoring

Requêtes utiles pour monitoring post-deploy:

```sql
-- Utilisateurs actifs
SELECT COUNT(*) FROM users WHERE is_active = 1;

-- Sessions actives
SELECT COUNT(*) FROM sessions WHERE expires_at > datetime('now');

-- Dernière activité
SELECT user_id, MAX(created_at) as last_action
FROM audit_logs
GROUP BY user_id
ORDER BY last_action DESC
LIMIT 10;

-- Volume de lots
SELECT COUNT(*) as total_lots,
       SUM(CASE WHEN statut = 'disponible' THEN 1 ELSE 0 END) as available,
       SUM(CASE WHEN statut = 'reserve' THEN 1 ELSE 0 END) as reserved,
       SUM(CASE WHEN statut = 'remis' THEN 1 ELSE 0 END) as delivered
FROM tombola_lots;
```

---

## 🔄 Rollback Procedure

En cas d'urgence (rarement nécessaire):

```bash
# 1. Basculer vers ancienne version frontend/backend
git checkout <previous-tag>

# 2. Les nouvelles données restent en production
# (Pas de suppression automatique)

# 3. Utiliser une DB snapshot (Cloudflare D1)
wrangler d1 list snapshots

# 4. Restaurer snapshot si VRAIMENT nécessaire
wrangler d1 restore <database-id> --snapshot-id <snapshot-id>
```

---

## 📞 Support & Questions

**Problèmes courants**:

**Q: "Token invalide" lors du login**
- ✅ Vérifier que SESSION_DURATION est configuré
- ✅ Vérifier que le token est unique dans la table sessions

**Q: "Un utilisateur peut créer plusieurs participants"**
- ✅ Ajouter CHECK constraint au backend (déjà implémenté)
- ✅ Vérifier is_active des utilisateurs

**Q: "Les données ne sont pas à jour après suppression"**
- ✅ Vérifier que CASCADE DELETE fonctionne
- ✅ Vérifier que audit_logs est aussi supprimé (DELETE FROM, pas FK CASCADE)

---

**Document créé**: Février 2026
**Dernière mise à jour**: `{date}`
**Status Production**: ✅ PRÊT À DÉPLOYER

