-- ============================================================
-- Migration 0022: Créer l'administrateur mehdi@gmail.com
-- Mot de passe: poiuytreza4U!
-- ============================================================

-- Étape 1: Vérifier si mehdi@gmail.com existe déjà
SELECT COUNT(*) as user_exists FROM users WHERE email = 'mehdi@gmail.com';

-- Étape 2: Créer l'utilisateur s'il n'existe pas
INSERT OR IGNORE INTO users (email, password_hash)
VALUES ('mehdi@gmail.com', 'sha256:9a6d68a809df4b84817ef274dceb0afb854843e507c15f836f3833b5cae58630');

-- Étape 3: Mettre à jour le mot de passe si l'utilisateur existait déjà
UPDATE users 
SET password_hash = 'sha256:9a6d68a809df4b84817ef274dceb0afb854843e507c15f836f3833b5cae58630',
    updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
WHERE email = 'mehdi@gmail.com';

-- Étape 4: Créer le rôle admin s'il n'existe pas
INSERT OR IGNORE INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM users
WHERE email = 'mehdi@gmail.com';

-- Étape 5: Vérifier que l'utilisateur et le rôle sont bien définis
SELECT 
    u.id,
    u.email,
    ur.role,
    u.created_at
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'mehdi@gmail.com';
