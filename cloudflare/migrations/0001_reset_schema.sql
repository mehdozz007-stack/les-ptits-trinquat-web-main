-- ============================================================
-- REINIT: Supprimer toutes les tables ET relancer le schéma
-- ============================================================

-- Supprimer toutes les tables (ordonnées correctement)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS rate_limits;
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS newsletters;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS tombola_lots;
DROP TABLE IF EXISTS tombola_participants;
DROP TABLE IF EXISTS users;

-- MAINTENANT - RÉCRÉER LES TABLES TOMBOLA

-- ============================================================
-- 1. TABLE USERS
-- ============================================================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- 2. TABLE USER_ROLES
-- ============================================================
CREATE TABLE user_roles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- ============================================================
-- 3. TABLE SESSIONS
-- ============================================================
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- ============================================================
-- 4. TABLE TOMBOLA_PARTICIPANTS
-- ============================================================
CREATE TABLE tombola_participants (
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

CREATE INDEX idx_tombola_participants_user_id ON tombola_participants(user_id);
CREATE INDEX idx_tombola_participants_email ON tombola_participants(email);

-- ============================================================
-- 5. TABLE TOMBOLA_LOTS
-- ============================================================
CREATE TABLE tombola_lots (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    icone TEXT,
    statut TEXT DEFAULT 'disponible' CHECK (statut IN ('disponible', 'réservé', 'remis')),
    parent_id TEXT NOT NULL,
    reserved_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES tombola_participants(id) ON DELETE CASCADE,
    FOREIGN KEY (reserved_by) REFERENCES tombola_participants(id) ON DELETE SET NULL
);

CREATE INDEX idx_tombola_lots_parent_id ON tombola_lots(parent_id);
CREATE INDEX idx_tombola_lots_reserved_by ON tombola_lots(reserved_by);
CREATE INDEX idx_tombola_lots_statut ON tombola_lots(statut);

-- ============================================================
-- 6. TABLE AUDIT_LOGS
-- ============================================================
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================================
-- 7. TABLE RATE_LIMITS
-- ============================================================
CREATE TABLE rate_limits (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(identifier, endpoint)
);

CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier);

SELECT '✅ Database reset successfully!' as status;
