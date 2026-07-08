/**
 * Génère la date du build et la met à disposition pour Vite
 * Utilisé pour injecter la date de déploiement dans les pages légales
 */

const fs = require('fs');
const path = require('path');

// Formatter la date en français (DD/MM/YYYY)
function formatDateFR(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Générer la date du build
const buildDate = formatDateFR(new Date());

// Créer le fichier de configuration
const buildInfoPath = path.join(__dirname, '..', 'src', 'lib', 'buildInfo.ts');

const content = `/**
 * Auto-generated file - Do not edit manually
 * Generated at build time with the deployment date
 */

export const BUILD_DATE = '${buildDate}';
export const LAST_UPDATE_DATE = '${buildDate}';
`;

// Créer le répertoire s'il n'existe pas
const dir = path.dirname(buildInfoPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Écrire le fichier
fs.writeFileSync(buildInfoPath, content, 'utf-8');

console.log(`✅ Build info generated: ${buildDate}`);
