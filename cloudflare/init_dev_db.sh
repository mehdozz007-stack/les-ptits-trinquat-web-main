#!/bin/bash

# Script d'initialisation de la base de données D1 locale pour développement
# Exécute les migrations nécessaires pour setup la BD de dev

echo "🗄️  Initialisation de la BD D1 locale (tombola-dev)..."
echo ""

# Migration 1: Schéma de base + RESET
echo "1️⃣  Création des tables de base..."
npx wrangler d1 execute tombola-dev --local --file=migrations/0012_reset_fresh_schema.sql

# Migration 2: Admin Mehdi (seed data)
echo "2️⃣  Setup du compte admin Mehdi..."
npx wrangler d1 execute tombola-dev --local --file=migrations/0013_reset_and_add_admin_mehdi.sql

# Migration 3: Rate limits + audit logs + newsletter
echo "3️⃣  Ajout des tables rate_limits et newsletter..."
npx wrangler d1 execute tombola-dev --local --file=migrations/0014_add_rate_limits_and_newsletter.sql

# Migration 4: Email verification OTP
echo "4️⃣  Ajout de la table email_verifications pour OTP..."
npx wrangler d1 execute tombola-dev --local --file=migrations/0015_email_verification_otp.sql

echo ""
echo "✅ BD locale initialisée avec succès!"
echo ""
echo "Vous pouvez maintenant démarrer le serveur de dev:"
echo "  npm run dev"
echo ""
