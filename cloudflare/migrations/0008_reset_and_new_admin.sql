-- ============================================================
-- Migration: Réinitialisation complète + Nouvel admin mehdoz007@gmail.com
-- ============================================================
-- Supprime toutes les tables et réinitialise la base
-- Crée le nouvel admin

-- Supprimer les tables (avec le bon ordre pour les contraintes FK)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS rate_limits;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS tombola_participants;
DROP TABLE IF EXISTS tombola_lots;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;

-- Recréer les tables
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, role)
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tombola_participants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(email),
  UNIQUE(telephone)
);

CREATE TABLE tombola_lots (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  icone TEXT,
  parent_id TEXT,
  statut TEXT NOT NULL CHECK(statut IN ('disponible', 'reserve', 'remis')),
  created_at TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES tombola_lots(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  user_id TEXT,
  changes JSON,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE rate_limits (
  id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  request_count INTEGER DEFAULT 0,
  reset_at TEXT NOT NULL
);

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
