-- ============================================================
-- CLEANUP: Supprimer toutes les tables
-- ============================================================

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS rate_limits;
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS newsletters;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tombola_lots;
DROP TABLE IF EXISTS tombola_participants;

-- Verify cleanup
SELECT 'Database cleaned successfully' as status;
