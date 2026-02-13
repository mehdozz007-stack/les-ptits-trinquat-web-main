#!/usr/bin/env node

/**
 * Génère un hash PBKDF2-SHA256 pour un mot de passe
 * Compatible avec le système de hashage du backend Cloudflare Workers
 * (combine salt + hash en base64)
 */

const crypto = require('crypto');

function generatePasswordHash(password) {
  // Générer un salt aléatoire (16 bytes = 128 bits)
  const salt = crypto.randomBytes(16);
  
  // Paramètres PBKDF2 (même que dans security.ts)
  const iterations = 100000;
  const keyLength = 32; // SHA256 = 32 bytes
  const digest = 'sha256';
  
  // Générer le hash
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest);
  
  // Combiner salt + hash (comme dans le code frontend)
  const combined = Buffer.concat([salt, hash]);
  
  // Encoder en base64 (comme btoa en JavaScript)
  const hashedPassword = combined.toString('base64');
  
  return hashedPassword;
}

// Générer le hash pour "poiuytreza4U!"
const password = 'poiuytreza4U!';
const hash = generatePasswordHash(password);

console.log(`\n📝 Hash du mot de passe "${password}":\n`);
console.log(`${hash}\n`);
console.log('✅ Copie ce hash dans la migration SQL (dans la colonne password_hash)\n');
