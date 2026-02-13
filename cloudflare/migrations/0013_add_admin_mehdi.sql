-- ============================================================
-- Migration: Ajouter utilisateur admin Mehdi
-- ============================================================

-- Insérer l'utilisateur Mehdi avec le mot de passe hashé
INSERT INTO users (id, email, password_hash, is_active, created_at, updated_at)
VALUES (
    'user_' || lower(hex(randomblob(8))),
    'mehdi@gmail.com',
    -- Hash du mot de passe "poiuytreza4U!" (généré avec bcrypt, on simule ici)
    -- Pour un vrai hash bcrypt, utiliser: $2b$10$... (exemple)
    '$2b$10$qK5zC7Jk2qK5zC7Jk2qK5OpUz0z0z0z0z0z0z0z0z0z0z0z0z0z0z0',
    1,
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now'),
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
);

-- Récupérer l'ID de l'utilisateur qu'on vient de créer et ajouter le rôle admin
INSERT INTO user_roles (id, user_id, role, created_at)
SELECT 
    'role_' || lower(hex(randomblob(8))),
    users.id,
    'admin',
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
FROM users
WHERE email = 'mehdi@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = users.id AND role = 'admin'
);

-- Vérification
-- SELECT * FROM users WHERE email = 'mehdi@gmail.com';
-- SELECT ur.* FROM user_roles ur JOIN users u ON ur.user_id = u.id WHERE u.email = 'mehdi@gmail.com';
