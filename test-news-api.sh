#!/bin/bash

# ============================================================
# Script de Test - Système de Gestion des Actualités
# ============================================================

API_URL="${1:-http://localhost:8787}"

echo "🔧 Test des Routes API News"
echo "────────────────────────────────────"
echo "API URL: $API_URL"
echo ""

# 1. Initialiser la BD
echo "1️⃣  Initialisation de la base de données..."
curl -X GET "$API_URL/init-db" \
  -H "Content-Type: application/json" \
  -s | jq .
echo ""

# 2. Créer une actualité d'événement
echo "2️⃣  Création d'un événement..."
EVENT_RESPONSE=$(curl -X POST "$API_URL/api/news" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Vide grenier - Test",
    "content": "Rejoignez-nous pour notre vide grenier de printemps!",
    "type": "evenement",
    "image_url": "https://via.placeholder.com/400x300",
    "event_date": "2026-04-12",
    "event_time": "10:00",
    "event_location": "Cour de l école",
    "is_published": true
  }' \
  -s)

EVENT_ID=$(echo $EVENT_RESPONSE | jq -r '.data.id')
echo $EVENT_RESPONSE | jq .
echo "Event ID: $EVENT_ID"
echo ""

# 3. Créer une annonce
echo "3️⃣  Création d'une annonce..."
ANNONCE_RESPONSE=$(curl -X POST "$API_URL/api/news" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fermeture de l école - Pont de mai",
    "content": "Les classes seront fermées du 1er au 3 mai pour le pont de mai.",
    "type": "annonce",
    "is_published": true
  }' \
  -s)

ANNONCE_ID=$(echo $ANNONCE_RESPONSE | jq -r '.data.id')
echo $ANNONCE_RESPONSE | jq .
echo "Annonce ID: $ANNONCE_ID"
echo ""

# 4. Récupérer toutes les actualités publiées
echo "4️⃣  Récupération des actualités publiées..."
curl -X GET "$API_URL/api/news" \
  -H "Content-Type: application/json" \
  -s | jq '.data | length' | xargs echo "Nombre d'actualités:"
echo ""

# 5. Récupérer une actualité spécifique
echo "5️⃣  Récupération d'une actualité spécifique..."
curl -X GET "$API_URL/api/news/$EVENT_ID" \
  -H "Content-Type: application/json" \
  -s | jq .
echo ""

# 6. Modifier une actualité
echo "6️⃣  Modification d'une actualité..."
curl -X PUT "$API_URL/api/news/$ANNONCE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fermeture de l école - Pont de mai (MODIFIÉE)"
  }' \
  -s | jq .
echo ""

# 7. Publier/Dépublier
echo "7️⃣  Test de publication..."
curl -X PATCH "$API_URL/api/news/$ANNONCE_ID/publish" \
  -H "Content-Type: application/json" \
  -d '{"is_published": false}' \
  -s | jq .
echo ""

# 8. Archiver
echo "8️⃣  Test d'archivage..."
curl -X PATCH "$API_URL/api/news/$EVENT_ID/archive" \
  -H "Content-Type: application/json" \
  -d '{"is_archived": true}' \
  -s | jq .
echo ""

# 9. Récupérer TOUTES les actualités (admin)
echo "9️⃣  Récupération de TOUTES les actualités (admin)..."
curl -X GET "$API_URL/api/news/all" \
  -H "Content-Type: application/json" \
  -s | jq '.data | length' | xargs echo "Nombre total:"
echo ""

# 10. Supprimer une actualité
echo "🔟 Suppression d'une actualité..."
curl -X DELETE "$API_URL/api/news/$ANNONCE_ID" \
  -H "Content-Type: application/json" \
  -s | jq .
echo ""

echo "✅ Tests terminés!"
