-- ============================================================
-- Migration: Ajouter contrainte UNIQUE sur email
-- ============================================================
-- SQLite ne supporte pas ALTER TABLE ADD CONSTRAINT, donc on crée une nouvelle table
CREATE TABLE IF NOT EXISTS tombola_participants_new (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    role TEXT NOT NULL DEFAULT 'Parent participant',
    classes TEXT,
    emoji TEXT NOT NULL DEFAULT '😊',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Copier les données de l'ancienne table
INSERT INTO tombola_participants_new SELECT * FROM tombola_participants;

-- Supprimer l'ancienne table
DROP TABLE tombola_participants;

-- Renommer la nouvelle table
ALTER TABLE tombola_participants_new RENAME TO tombola_participants;

-- Recréer les indexes
CREATE INDEX IF NOT EXISTS idx_tombola_participants_user_id ON tombola_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_tombola_participants_email ON tombola_participants(email);
