-- ============================================================
-- Migration: Améliorer la table users avec contraintes complètes
-- ============================================================

-- Créer la nouvelle table avec toutes les contraintes
CREATE TABLE users_new (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    last_login_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users_new(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users_new(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users_new(created_at);

-- Copier les données existantes (si elles existent)
INSERT OR IGNORE INTO users_new 
SELECT id, email, password_hash, 1, NULL, created_at, updated_at 
FROM users;

-- Supprimer l'ancienne table
DROP TABLE IF EXISTS users;

-- Renommer la nouvelle table
ALTER TABLE users_new RENAME TO users;

-- ============================================================
-- Mettre à jour la clé étrangère de tombola_participants vers users
-- ============================================================

-- Créer une nouvelle table tombola_participants avec contrainte étrangère correcte
CREATE TABLE tombola_participants_updated (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Parent participant',
    classes TEXT,
    emoji TEXT NOT NULL DEFAULT '😊',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Copier les données existantes
INSERT INTO tombola_participants_updated 
SELECT id, user_id, prenom, email, role, classes, emoji, created_at 
FROM tombola_participants
WHERE user_id IS NOT NULL;

-- Supprimer l'ancienne table
DROP TABLE tombola_participants;

-- Renommer la nouvelle table
ALTER TABLE tombola_participants_updated RENAME TO tombola_participants;

-- Recréer les index
CREATE INDEX IF NOT EXISTS idx_tombola_participants_user_id ON tombola_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_tombola_participants_email ON tombola_participants(email);
