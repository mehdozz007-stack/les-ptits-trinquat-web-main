-- ============================================================
-- Migration 0022: Créer l'administrateur mehdi@gmail.com
-- Mot de passe: poiuytreza4U!
-- ============================================================

-- Étape 1: Créer ou mettre à jour l'utilisateur mehdi@gmail.com
INSERT INTO users (email, password_hash)
VALUES ('mehdi@gmail.com', 'RyCMR6WIOsLbFe/bgJ1/gtTn107r0OY1ut56y5b4BEIKxDxswQYTIppAf5Ld1+b2')
ON CONFLICT(email) DO UPDATE SET
    password_hash = 'RyCMR6WIOsLbFe/bgJ1/gtTn107r0OY1ut56y5b4BEIKxDxswQYTIppAf5Ld1+b2',
    updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now');

-- Étape 2: Créer le rôle admin pour mehdi@gmail.com
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM users
WHERE email = 'mehdi@gmail.com'
ON CONFLICT(user_id, role) DO NOTHING;

-- Étape 3: Vérifier que l'utilisateur et le rôle sont bien définis
SELECT 
    u.id,
    u.email,
    ur.role,
    u.created_at
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'mehdi@gmail.com';
