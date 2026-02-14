-- ============================================================
-- MIGRATION 0014: Restaurer les droits admin de mehdi@gmail.com
-- ============================================================
-- Description: Restaure le rôle admin pour mehdi@gmail.com
-- Date: 2026-02-14
-- ============================================================

-- Vérifier que mehdi existe
-- SELECT id, email FROM users WHERE email = 'mehdi@gmail.com';

-- Restaurer le rôle admin pour mehdi
INSERT OR IGNORE INTO user_roles (id, user_id, role, created_at)
SELECT 
    'role_admin_mehdi_restored',
    id,
    'admin',
    datetime('now')
FROM users
WHERE email = 'mehdi@gmail.com';

-- Vérification après restauration
-- SELECT ur.*, u.email FROM user_roles ur 
-- JOIN users u ON ur.user_id = u.id 
-- WHERE u.email = 'mehdi@gmail.com';
