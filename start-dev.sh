#!/bin/bash

# Script to start both frontend and backend dev servers
# Run from the root directory: bash start-dev.sh

echo "🚀 Démarrage de la Tombola en mode développement..."
echo ""

# Check if backend is running
echo "1️⃣  Démarrage du backend (port 8787)..."
cd cloudflare
npm run dev &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 3

# Go back to root
cd ..

# Start frontend
echo "2️⃣  Démarrage du frontend (port 8081)..."
npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
sleep 3

echo ""
echo "✅ Les deux serveurs sont en train de démarrer!"
echo ""
echo "URLs:"
echo "   Frontend:  http://localhost:8081"
echo "   Backend:   http://localhost:8787"
echo "   Tombola:   http://localhost:8081/tombola"
echo ""
echo "Pour arrêter, appuyez sur Ctrl+C"
echo ""

# Wait for processes
wait
