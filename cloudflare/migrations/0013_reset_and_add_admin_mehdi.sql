-- ============================================================
-- Migration Complète: Réinitialisation + Admin Mehdi
-- ============================================================

-- Étape 1: Supprimer toutes les tables existantes
DROP TABLE IF EXISTS tombola_lots;
DROP TABLE IF EXISTS tombola_participants;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS audit_logs;

-- ============================================================
-- TABLE USERS - Authentification
-- ============================================================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    last_login_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================================
-- TABLE USER_ROLES - Gestion des rôles
-- ============================================================
CREATE TABLE user_roles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    UNIQUE (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- ============================================================
-- TABLE SESSIONS - Gestion des sessions
-- ============================================================
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- ============================================================
-- TABLE TOMBOLA_PARTICIPANTS - Participants
-- ============================================================
CREATE TABLE tombola_participants (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Parent participant',
    classes TEXT,
    emoji TEXT NOT NULL DEFAULT '😊',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, email)
);

CREATE INDEX idx_tombola_participants_user_id ON tombola_participants(user_id);
CREATE INDEX idx_tombola_participants_email ON tombola_participants(email);
CREATE INDEX idx_tombola_participants_created_at ON tombola_participants(created_at);

-- ============================================================
-- TABLE TOMBOLA_LOTS - Lots
-- ============================================================
CREATE TABLE tombola_lots (
    id TEXT PRIMARY KEY,
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

CREATE INDEX idx_tombola_lots_parent_id ON tombola_lots(parent_id);
CREATE INDEX idx_tombola_lots_reserved_by ON tombola_lots(reserved_by);
CREATE INDEX idx_tombola_lots_statut ON tombola_lots(statut);
CREATE INDEX idx_tombola_lots_created_at ON tombola_lots(created_at);

-- ============================================================
-- TABLE AUDIT_LOGS - Journalisation sécurité
-- ============================================================
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    details TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================
-- INSÉRER L'UTILISATEUR ADMIN MEHDI
-- Password: poiuytreza4U!
-- Hash: PBKDF2-SHA256 (100000 iterations, salt + hash en base64)
-- ============================================================
INSERT INTO users (id, email, password_hash, is_active, created_at, updated_at)
VALUES (
    'user_admin_mehdi_001',
    'mehdi@gmail.com',
    'UYl2YsiDl+zdGIn4rxg1Dv/qqGVgA7mIxC0+w74MKoGHDTeM7KC24ADYxPIxe9hl',
    1,
    datetime('now'),
    datetime('now')
);

-- ============================================================
-- ASSIGNER LE RÔLE ADMIN À MEHDI
-- ============================================================
INSERT INTO user_roles (id, user_id, role, created_at)
VALUES (
    'role_admin_mehdi_001',
    'user_admin_mehdi_001',
    'admin',
    datetime('now')
);

-- ============================================================
-- Vérification
-- ============================================================
-- SELECT * FROM users WHERE email = 'mehdi@gmail.com';
-- SELECT ur.* FROM user_roles ur JOIN users u ON ur.user_id = u.id WHERE u.email = 'mehdi@gmail.com';
