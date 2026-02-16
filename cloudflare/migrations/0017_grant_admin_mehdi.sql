-- ============================================================
-- Migration: Ajouter droits admin à mehdi@gmail.com
-- ============================================================

-- Vérifier si mehdi@gmail.com existe et ajouter le rôle admin
INSERT OR IGNORE INTO user_roles (id, user_id, role, created_at)
SELECT 
    'role_admin_mehdi_' || lower(hex(randomblob(8))),
    u.id,
    'admin',
    datetime('now')
FROM users u
WHERE u.email = 'mehdi@gmail.com';
