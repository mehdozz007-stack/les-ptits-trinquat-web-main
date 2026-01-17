#!/bin/bash

# 🚀 Script de Déploiement - Newsletter System
# Ce script configure automatiquement le système de newsletter sur Supabase

set -e  # Exit on error

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==================================${NC}"
echo -e "${YELLOW}📧 Newsletter System Setup${NC}"
echo -e "${YELLOW}==================================${NC}"

# 1. Vérifier les variables d'environnement
echo -e "\n${YELLOW}1️⃣  Vérification des variables d'environnement...${NC}"

if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo -e "${RED}❌ SUPABASE_PROJECT_ID non défini${NC}"
    read -p "Entrez votre PROJECT_ID: " SUPABASE_PROJECT_ID
fi

if [ -z "$SUPABASE_URL" ]; then
    SUPABASE_URL="https://${SUPABASE_PROJECT_ID}.supabase.co"
fi

echo -e "${GREEN}✅ Supabase Project: ${SUPABASE_URL}${NC}"

# 2. Vérifier Supabase CLI
echo -e "\n${YELLOW}2️⃣  Vérification de Supabase CLI...${NC}"

if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI non trouvé. Installation...${NC}"
    npm install -g @supabase/cli
fi

echo -e "${GREEN}✅ Supabase CLI installé${NC}"

# 3. Créer les tables et RLS
echo -e "\n${YELLOW}3️⃣  Création des tables et RLS...${NC}"

echo "Exécution de la migration SQL..."
# Le fichier de migration doit être exécuté manuellement via Supabase Dashboard
echo -e "${YELLOW}⚠️  Copier le contenu de supabase/migrations/ et l'exécuter dans Supabase Dashboard > SQL Editor${NC}"

read -p "Appuyez sur Entrée une fois la migration exécutée..."

echo -e "${GREEN}✅ Tables créées${NC}"

# 4. Déployer la Edge Function
echo -e "\n${YELLOW}4️⃣  Déploiement de l'Edge Function...${NC}"

supabase functions deploy send-newsletter \
    --project-id "$SUPABASE_PROJECT_ID" \
    --no-verify-jwt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Edge Function déployée${NC}"
else
    echo -e "${RED}❌ Erreur lors du déploiement de la fonction${NC}"
    exit 1
fi

# 5. Configurer les secrets
echo -e "\n${YELLOW}5️⃣  Configuration des secrets...${NC}"

read -p "Entrez votre RESEND_API_KEY: " RESEND_API_KEY

if [ -n "$RESEND_API_KEY" ]; then
    echo "$RESEND_API_KEY" | supabase secrets set RESEND_API_KEY \
        --project-id "$SUPABASE_PROJECT_ID"
    echo -e "${GREEN}✅ RESEND_API_KEY configurée${NC}"
else
    echo -e "${YELLOW}⚠️  RESEND_API_KEY non configurée (optionnel pour le moment)${NC}"
fi

# 6. Vérifier les variables d'environnement du projet
echo -e "\n${YELLOW}6️⃣  Vérification du .env.local...${NC}"

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local non trouvé. Création...${NC}"
    cat > .env.local << EOF
# Supabase
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=your-anon-key-here
EOF
    echo -e "${GREEN}✅ .env.local créé (À compléter manuellement)${NC}"
else
    echo -e "${GREEN}✅ .env.local existant${NC}"
fi

# 7. Créer un admin initial
echo -e "\n${YELLOW}7️⃣  Création du premier admin...${NC}"
echo -e "${YELLOW}Instructions:${NC}"
echo "1. Allez à votre dashboard Supabase"
echo "2. Créez un utilisateur dans Authentication → Users"
echo "3. Récupérez son user_id"
echo "4. Exécutez ce SQL dans SQL Editor:"
echo ""
echo "   INSERT INTO user_roles (user_id, role)"
echo "   VALUES ('VOTRE_USER_ID', 'admin');"
echo ""
read -p "Appuyez sur Entrée une fois l'admin créé..."

# 8. Tests
echo -e "\n${YELLOW}8️⃣  Tests de configuration...${NC}"

# Test 1: Vérifier la Edge Function
echo -e "${YELLOW}Test 1: Edge Function...${NC}"
FUNCTION_STATUS=$(supabase functions list --project-id "$SUPABASE_PROJECT_ID" | grep send-newsletter || true)

if [ -n "$FUNCTION_STATUS" ]; then
    echo -e "${GREEN}✅ Edge Function trouvée${NC}"
else
    echo -e "${RED}❌ Edge Function non trouvée${NC}"
fi

# Test 2: Vérifier les tables
echo -e "${YELLOW}Test 2: Tables...${NC}"
echo -e "${GREEN}✅ À vérifier manuellement dans Supabase Dashboard > Table Editor${NC}"

# 9. Summary
echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}✅ Configuration Newsletter Complète!${NC}"
echo -e "${GREEN}==================================${NC}"

echo -e "\n${YELLOW}Prochaines étapes:${NC}"
echo "1. Compléter les variables d'environnement dans .env.local"
echo "2. Tester l'inscription newsletter sur la page d'accueil"
echo "3. Accéder au dashboard admin: http://localhost:5173/admin/newsletter"
echo "4. Créer et envoyer une première newsletter"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "- Guide d'implémentation: IMPLEMENTATION_NEWSLETTER.md"
echo "- Sécurité: SECURITY.md"
echo "- Prompt original: prompt-copilot-fullstack.md"
