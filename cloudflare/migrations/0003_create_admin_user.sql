-- Migration: Create admin user for mehdi@gmail.com
-- Created: 2026-03-08

-- Insert admin user
INSERT INTO users (id, email, password_hash, is_active, created_at, updated_at)
VALUES (
  'admin_mehdi_001',
  'mehdi@gmail.com',
  '136w0YAAWCBRPKYwsvZWZcDxS0A4YCWVi9t097x+K4kuMX8Eou17w2jTJw5/tVDF',
  1,
  datetime('now'),
  datetime('now')
);

-- Grant admin role
INSERT INTO user_roles (id, user_id, role, created_at)
VALUES (
  'role_admin_mehdi_001',
  'admin_mehdi_001',
  'admin',
  datetime('now')
);
