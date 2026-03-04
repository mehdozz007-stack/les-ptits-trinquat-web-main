#!/usr/bin/env node

/**
 * Script de réinitialisation D1 et création d'utilisateur admin
 * Utilise Wrangler pour exécuter les migrations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dbName = 'les-ptits-trinquat-prod';
const migrationDir = path.join(__dirname, 'migrations');

console.log('📊 Réinitialisation de la base de données D1...\n');

// Lire et afficher le script de réinitialisation
const resetScript = fs.readFileSync(path.join(migrationDir, '0012_reset_fresh_schema.sql'), 'utf8');

console.log('🔄 Exécution du script 0012_reset_fresh_schema.sql...\n');

// Exécuter le script SQL sur D1
try {
  // Utiliser wrangler d1 execute pour exécuter le SQL
  const command = `wrangler d1 execute ${dbName} --file="${path.join(migrationDir, '0012_reset_fresh_schema.sql')}"`;
  console.log(`Commande: ${command}\n`);
  
  const output = execSync(command, { 
    encoding: 'utf8',
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  console.log('✅ Migration 0012 exécutée avec succès!\n');
  console.log(output);
} catch (error) {
  console.error('❌ Erreur lors de l\'exécution de la migration:');
  console.error(error.message);
  process.exit(1);
}

// Maintenant ajouter l'utilisateur admin via l'API (via un curl ou autre)
console.log('\n📝 Ajout de l\'utilisateur admin Mehdi...\n');
console.log('Note: L\'utilisateur doit être créé via l\'API backend pour hasher correctement le mot de passe.');
console.log('Email: mehdi@gmail.com');
console.log('Mot de passe: poiuytreza4U!');
console.log('Rôle: admin');

console.log('\n✨ Base de données réinitialisée!');
console.log('Redéployer maintenant pour appliquer les changements.');
