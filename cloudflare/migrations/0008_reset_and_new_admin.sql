-- ============================================================
-- Migration: Réinitialisation complète + Nouvel admin mehdoz007@gmail.com
-- ============================================================
-- Supprime toutes les tables et réinitialise la base avec le bon schéma
-- Crée le nouvel admin

-- Supprimer les tables (avec le bon ordre pour les contraintes FK)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS rate_limits;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS tombola_participants;
DROP TABLE IF EXISTS tombola_lots;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;

-- ============================================================
-- 1. TABLE USERS (Authentification)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- 2. TABLE USER_ROLES (Gestion des rôles)
-- ============================================================
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

CREATE INDEX IF NOT EXISTS idx_tombola_participants_user_id ON tombola_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_tombola_participants_email ON tombola_participants(email);

-- ============================================================
-- 5. TABLE TOMBOLA_LOTS (Lots de la Tombola)
-- ============================================================
CREATE TABLE IF NOT EXISTS tombola_lots (
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
);

CREATE INDEX IF NOT EXISTS idx_tombola_lots_parent_id ON tombola_lots(parent_id);
CREATE INDEX IF NOT EXISTS idx_tombola_lots_reserved_by ON tombola_lots(reserved_by);
CREATE INDEX IF NOT EXISTS idx_tombola_lots_statut ON tombola_lots(statut);

-- ============================================================
-- 6. TABLE AUDIT_LOGS (Journalisation sécurité)
-- ============================================================
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

-- ============================================================
-- Créer le nouvel admin mehdoz007@gmail.com
-- ============================================================
-- Hash PBKDF2 du mot de passe 'poiuytreza4U!'

INSERT INTO users (id, email, password_hash)
VALUES (
    'admin-mehdoz-001',
    'mehdoz007@gmail.com',
    'nfH5nIjzpjj1d4u1EzDTdr9PN49CRYq3dLuAZrh/xzQMwOX5kVed5IzKcntF1+WC'
);

INSERT INTO user_roles (user_id, role)
VALUES ('admin-mehdoz-001', 'admin');

-- Confirmation
SELECT 'Base de données réinitialisée avec succès!' as status;
SELECT 'Admin mehdoz007@gmail.com créé avec succès' as message;
