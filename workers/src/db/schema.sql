-- Tombola Database Schema for Cloudflare D1

-- Create parents table
CREATE TABLE IF NOT EXISTS parents (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL DEFAULT '😊',
  classes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create lots table
CREATE TABLE IF NOT EXISTS lots (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'reserved', 'delivered')),
  reserved_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
  FOREIGN KEY (reserved_by) REFERENCES parents(id) ON DELETE SET NULL
);

-- Create reservations table for audit trail
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  lot_id TEXT NOT NULL,
  requester_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES lots(id) ON DELETE CASCADE,
  FOREIGN KEY (requester_id) REFERENCES parents(id) ON DELETE CASCADE
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_lots_parent_id ON lots(parent_id);
CREATE INDEX IF NOT EXISTS idx_lots_status ON lots(status);
CREATE INDEX IF NOT EXISTS idx_reservations_lot_id ON reservations(lot_id);
CREATE INDEX IF NOT EXISTS idx_reservations_requester_id ON reservations(requester_id);
CREATE INDEX IF NOT EXISTS idx_parents_email ON parents(email);
