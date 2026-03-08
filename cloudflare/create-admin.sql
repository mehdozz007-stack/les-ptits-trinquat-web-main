-- Create admin user for mehdi@gmail.com

INSERT INTO users (id, email, password_hash, is_active, created_at, updated_at)
VALUES (
  'f085a3522e04febd',
  'mehdi@gmail.com',
  '136w0YAAWCBRPKYwsvZWZcDxS0A4YCWVi9t097x+K4kuMX8Eou17w2jTJw5/tVDF',
  1,
  datetime('now'),
  datetime('now')
);


-- Add admin role

INSERT INTO user_roles (id, user_id, role, created_at)
VALUES (
  'cf90ecc516502738',
  'f085a3522e04febd',
  'admin',
  datetime('now')
);
