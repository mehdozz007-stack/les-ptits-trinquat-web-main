-- ============================================================
-- Migration: Réinitialiser pour authentification réelle
-- (Passer de UUIDs clients aléatoires à users authentifiés)
-- ============================================================

-- 1. Supprimer les lots existants (contrainte étrangère)
DELETE FROM tombola_lots;

-- 2. Supprimer les participants existants
DELETE FROM tombola_participants;

-- 3. Recréer la table users avec toutes les contraintes
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    last_login_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Index pour performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 4. Recréer la table tombola_participants avec FK vers users
DROP TABLE IF EXISTS tombola_participants;

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

-- 5. Recréer la table tombola_lots avec les bonnes contraintes
DROP TABLE IF EXISTS tombola_lots;

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
