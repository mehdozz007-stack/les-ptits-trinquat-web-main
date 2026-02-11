-- Fix lot status constraint to use consistent values (without accents)
-- This migration updates the CHECK constraint to accept 'reserve' instead of 'réservé'

-- SQLite doesn't support ALTER TABLE DROP CONSTRAINT, so we need to recreate the table
-- First, save the data
CREATE TABLE tombola_lots_backup AS SELECT * FROM tombola_lots;

-- Drop the old table
DROP TABLE tombola_lots;

-- Recreate with corrected CHECK constraint
CREATE TABLE IF NOT EXISTS tombola_lots (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    icone TEXT,
    statut TEXT DEFAULT 'disponible' CHECK (statut IN ('disponible', 'reserve', 'remis')),
    parent_id TEXT NOT NULL,
    reserved_by TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES tombola_participants(id),
    FOREIGN KEY (reserved_by) REFERENCES tombola_participants(id)
);

-- Update any existing 'réservé' values to 'reserve'
INSERT INTO tombola_lots 
SELECT id, nom, description, icone, CASE WHEN statut = 'réservé' THEN 'reserve' ELSE statut END, parent_id, reserved_by, created_at 
FROM tombola_lots_backup;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_tombola_lots_parent_id ON tombola_lots(parent_id);
CREATE INDEX IF NOT EXISTS idx_tombola_lots_status ON tombola_lots(statut);

-- Drop backup table
DROP TABLE tombola_lots_backup;
