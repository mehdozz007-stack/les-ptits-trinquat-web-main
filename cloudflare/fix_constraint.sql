-- Fix lot status constraint - recreate table with correct CHECK values
PRAGMA foreign_keys = OFF;

-- Backup existing data
CREATE TABLE tombola_lots_backup AS SELECT * FROM tombola_lots;

-- Drop the old table
DROP TABLE tombola_lots;

-- Recreate with correct constraint
CREATE TABLE tombola_lots (
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

-- Restore data with status conversion
INSERT INTO tombola_lots 
SELECT id, nom, description, icone, 
       CASE WHEN statut = 'réservé' THEN 'reserve' ELSE statut END as statut, 
       parent_id, reserved_by, created_at 
FROM tombola_lots_backup;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_tombola_lots_parent_id ON tombola_lots(parent_id);
CREATE INDEX IF NOT EXISTS idx_tombola_lots_status ON tombola_lots(statut);

-- Drop backup
DROP TABLE tombola_lots_backup;

PRAGMA foreign_keys = ON;
