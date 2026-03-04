-- ============================================================
-- Migration: Ajouter administrateur mehdozz007@gmail.com
-- ============================================================
-- Ajoute un nouvel administrateur pour la tombola

-- Hash PBKDF2 du mot de passe 'poiuytreza4U!'
-- Généré avec: crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256')

INSERT OR IGNORE INTO users (id, email, password_hash)
VALUES (
    'admin-mehdozz-001',
    'mehdozz007@gmail.com',
    'nfH5nIjzpjj1d4u1EzDTdr9PN49CRYq3dLuAZrh/xzQMwOX5kVed5IzKcntF1+WC'
);

INSERT OR IGNORE INTO user_roles (user_id, role)
VALUES ('admin-mehdozz-001', 'admin');

-- Afficher un message de confirmation
SELECT 'Admin mehdozz007@gmail.com créé avec succès' as message;
