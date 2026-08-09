-- ============================================================
-- Migration 0021: Garantir que l'utilisateur a le rôle admin
-- ============================================================

-- Vérifier et corriger le rôle pour mehdi@gmail.com
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'mehdi-admin-001' 
  AND role != 'admin';

-- Si l'entrée n'existe pas, l'insérer
INSERT OR IGNORE INTO user_roles (id, user_id, role, created_at)
VALUES (
    'role-mehdi-admin-001',
    'mehdi-admin-001',
    'admin',
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
);

-- Afficher le résultat pour vérification
SELECT u.email, ur.role 
FROM users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
WHERE u.email = 'mehdi@gmail.com';
