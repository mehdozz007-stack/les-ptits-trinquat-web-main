#!/bin/bash
# Script de vérification de la connexion Supabase

echo "🔍 Vérification de la configuration Supabase..."
echo ""

# Vérifier les variables d'environnement
if [ -f .env.local ]; then
    echo "✅ Fichier .env.local trouvé"
    echo ""
    
    # Extraire les variables
    SUPABASE_URL=$(grep VITE_SUPABASE_URL .env.local | cut -d '=' -f2)
    SUPABASE_KEY=$(grep VITE_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2)
    
    echo "📍 URL Supabase: $SUPABASE_URL"
    
    if [ "$SUPABASE_KEY" = "remplacez_par_votre_anon_key" ] || [ -z "$SUPABASE_KEY" ]; then
        echo "❌ ERREUR: Clé Anon Key non configurée"
        echo "   → Allez sur votre dashboard Supabase et copiez la clé 'anon'"
    else
        echo "✅ Clé Anon Key configurée"
    fi
    
else
    echo "❌ Fichier .env.local non trouvé"
    echo "   → Créez le fichier .env.local avec vos clés Supabase"
fi

echo ""
echo "🔧 Pour configurer Supabase:"
echo "1. Allez sur: https://ybzrbrjdzncdolczyvxz.supabase.co"
echo "2. Cliquez sur Settings → API"
echo "3. Copiez les clés anon (public) et service_role (secret)"
echo "4. Mettez à jour .env.local avec vos clés"
echo "5. Relancez le serveur de développement avec: npm run dev"
