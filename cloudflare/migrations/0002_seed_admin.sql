-- ============================================================
-- SEED: Création de l'administrateur initial
-- ============================================================
-- IMPORTANT: Remplacez le password_hash par un vrai hash bcrypt
-- Générez-le avec: await bcrypt.hash('votre_mot_de_passe', 12)

-- L'admin par défaut utilise le hash de 'admin_secure_password_2024!'
-- En production, changez ce mot de passe immédiatement !

INSERT OR IGNORE INTO users (id, email, password_hash)
VALUES (
    'admin-initial-001',
    'admin@ptits-trinquat.fr',
    'adminadmin'
);

INSERT OR IGNORE INTO user_roles (user_id, role)
VALUES ('admin-initial-001', 'admin');
