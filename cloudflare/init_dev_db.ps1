# Script d'initialisation de la base de données D1 locale pour développement
# Exécute les migrations nécessaires pour setup la BD de dev
# Usage: .\init_dev_db.ps1

Write-Host "🗄️  Initialisation de la BD D1 locale (tombola-dev)..." -ForegroundColor Cyan
Write-Host ""

# Migration 1: Schéma de base + RESET
Write-Host "1️⃣  Création des tables de base..." -ForegroundColor Yellow
npx wrangler d1 execute tombola-dev --local --file=migrations/0012_reset_fresh_schema.sql

# Migration 2: Admin Mehdi (seed data)
Write-Host "2️⃣  Setup du compte admin Mehdi..." -ForegroundColor Yellow
npx wrangler d1 execute tombola-dev --local --file=migrations/0013_reset_and_add_admin_mehdi.sql

# Migration 3: Rate limits + audit logs + newsletter
Write-Host "3️⃣  Ajout des tables rate_limits et newsletter..." -ForegroundColor Yellow
npx wrangler d1 execute tombola-dev --local --file=migrations/0014_add_rate_limits_and_newsletter.sql

# Migration 4: Email verification OTP
Write-Host "4️⃣  Ajout de la table email_verifications pour OTP..." -ForegroundColor Yellow
npx wrangler d1 execute tombola-dev --local --file=migrations/0015_email_verification_otp.sql

Write-Host ""
Write-Host "✅ BD locale initialisée avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "Vous pouvez maintenant démarrer le serveur de dev:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
