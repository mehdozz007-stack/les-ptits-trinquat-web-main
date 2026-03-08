/**
 * Script pour créer un utilisateur admin dans Cloudflare D1
 * Usage: node create-admin.cjs
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction de hash PBKDF2 (même que dans le code TypeScript)
function hashPassword(password) {
  // Générer un sel aléatoire
  const salt = crypto.randomBytes(16);

  // Dériver la clé avec PBKDF2
  const derivedBits = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

  // Combiner sel et hash
  const combined = Buffer.concat([salt, derivedBits]);

  // Encoder en base64
  return combined.toString('base64');
}

// Fonction pour générer un ID
function generateId() {
  return crypto.randomBytes(8).toString('hex').toLowerCase();
}

function createAdmin() {
  const email = 'mehdi@gmail.com';
  const password = 'poiuytreza4U!';

  console.log(`Creating admin user: ${email}`);

  try {
    const passwordHash = hashPassword(password);
    const userId = generateId();

    console.log('Generated credentials:');
    console.log(`  User ID: ${userId}`);
    console.log(`  Email: ${email}`);
    console.log(`  Password (hashed): ${passwordHash.substring(0, 50)}...`);

    // SQL statements pour créer l'utilisateur
    const createUserSQL = `
INSERT INTO users (id, email, password_hash, is_active, created_at, updated_at)
VALUES (
  '${userId}',
  '${email}',
  '${passwordHash}',
  1,
  datetime('now'),
  datetime('now')
);
`;

    const createRoleSQL = `
INSERT INTO user_roles (id, user_id, role, created_at)
VALUES (
  '${generateId()}',
  '${userId}',
  'admin',
  datetime('now')
);
`;

    console.log('\n--- SQL to execute ---\n');
    console.log(createUserSQL);
    console.log(createRoleSQL);

    // Sauvegarder les commandes SQL dans un fichier
    const sqlContent = `-- Create admin user for mehdi@gmail.com
${createUserSQL}

-- Add admin role
${createRoleSQL}`;

    const sqlPath = path.join(__dirname, 'cloudflare', 'create-admin.sql');
    fs.mkdirSync(path.dirname(sqlPath), { recursive: true });
    fs.writeFileSync(sqlPath, sqlContent);
    console.log(`\n✅ SQL saved to: cloudflare/create-admin.sql`);
    console.log('\nTo execute, run:');
    console.log(`  cd cloudflare && wrangler d1 execute les-ptits-trinquat-prod --file=./create-admin.sql`);

  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
