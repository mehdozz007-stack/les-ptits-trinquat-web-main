-- ============================================================
-- Migration: Corriger la clé étrangère sur user_id
-- Supprimer la contrainte de clé étrangère qui empêche 
-- l'insertion de participants avec les UUIDs générés côté client
-- ============================================================

-- D'abord SUPPRIMER les références de clés étrangères (lots)
DELETE FROM tombola_lots;

-- Créer une table temporaire avec les bonnes contraintes (SANS clé étrangère sur user_id)
CREATE TABLE tombola_participants_new (
    id TEXT PRIMARY KEY,
    user_id TEXT,  -- Pas de contrainte de clé étrangère - UUID généré côté client
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Parent participant',
    classes TEXT,
    emoji TEXT NOT NULL DEFAULT '😊',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Copier les participants existants
INSERT INTO tombola_participants_new 
SELECT id, user_id, prenom, email, role, classes, emoji, created_at 
FROM tombola_participants;

-- Supprimer l'ancienne table
DROP TABLE tombola_participants;

-- Renommer la nouvelle table
ALTER TABLE tombola_participants_new RENAME TO tombola_participants;

-- Recréer les index
CREATE INDEX IF NOT EXISTS idx_tombola_participants_user_id ON tombola_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_tombola_participants_email ON tombola_participants(email);
