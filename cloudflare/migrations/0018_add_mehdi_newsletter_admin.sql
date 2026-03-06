-- ============================================================
-- Migration 0018: Ajouter mehdi@gmail.com comme admin newsletter
-- ============================================================

-- Insérer l'utilisateur
INSERT OR REPLACE INTO users (id, email, password_hash, created_at, updated_at)
VALUES (
    'mehdi-admin-001',
    'mehdi@gmail.com',
    'NEb2LVUxOjJIGenDVE32y9lKRbWPyZU6zgH8WvAA7TAQcK/x8ING9mOyn1mNBw1h',
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now'),
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
);

-- Attribuer le rôle admin
INSERT OR REPLACE INTO user_roles (id, user_id, role, created_at)
VALUES (
    'role-mehdi-admin-001',
    'mehdi-admin-001',
    'admin',
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
);
