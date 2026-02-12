# 🎊 Guide d'Activation de la Tombola

## Problème Identifié
❌ **Erreur d'inscription** : La base de données D1 n'a pas été initialisée

## ✅ Solution - 3 étapes

### Étape 1: Vérifier que les dépendances sont installées
```bash
cd cloudflare && npm install
```
**Résultat attendu:** Dépendances installées sans erreurs

### Étape 2: Démarrer le serveur backend (Terminal 1)
```bash
cd cloudflare
npm run dev
```
**Résultat attendu:** "Local mode enabled" et le serveur écoute sur `http://127.0.0.1:8787`

### Étape 3: Démarrer le serveur frontend (Terminal 2)
```bash
cd ..
npm run dev
```
**Résultat attendu:** Accédez à `http://localhost:8080/tombola`

---

## 🧪 Tester l'API

### Tester l'inscription (POST)
```bash
curl -X POST https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Jean",
    "email": "jean@example.com",
    "role": "Parent participant",
    "emoji": "😊"
  }'
```

### Consulter les participants (GET)
```bash
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants
```

---

## 🚀 Architecture Locale

```
Frontend (Port 8080) --[proxy /api]--> Backend (Port 8787)
  ↓                                          ↓
http://localhost:8080                 http://127.0.0.1:8787
  vite.config.ts                        wrangler dev
  proxy: /api -> 127.0.0.1:8787         uses local D1 database
```

### Vérifier le statut
```bash
# Frontend
curl http://localhost:8080/

# Backend
curl http://127.0.0.1:8787/health

# Tester l'API via le proxy
curl http://localhost:8080/api/tombola/participants
```

---

## � Statut Déploiement

### Production (main branch)
✅ **API**: https://les-ptits-trinquat-api.mehdozz007.workers.dev
✅ **Database**: Cloudflare D1 (les-ptits-trinquat-prod)
✅ **Endpoints**: GET/POST participants, GET/POST lots fonctionnels
✅ **Admin**: mehdoz007@gmail.com créé

### Développement (dev branch)
🔄 **Frontend**: http://localhost:8080 (wrangler dev)
🔄 **Backend**: http://127.0.0.1:8787 (npm run dev)
🔄 **Database**: Local D1 instance

**⚠️ Important**: Développer sur la branche `dev` avant de merger vers `main`

---

## ⚠️ Important pour le Développement

### Configuration Requise
- ✅ Assurez-vous d'être sur la branche `dev`: `git checkout dev`
- ✅ Dépendances installées: `cd cloudflare && npm install && cd ..`
- ✅ Deux terminals séparés pour le développement local

### Ordre de Démarrage
1. **D'abord**: Terminal 1 → `cd cloudflare && npm run dev` (backend)
2. **Ensuite**: Terminal 2 → `npm run dev` (frontend)
3. **Puis**: Ouvrir http://localhost:8080/tombola

### Arrêter le Développement
- Appuyer sur `Ctrl+C` dans les deux terminals pour arrêter les serveurs

---

## 📞 En Cas de Problème

1. **"Permission denied" ou "Unauthorized"**
   - Exécutez: `wrangler login`

2. **"Database not found"**
   - La base de données doit être créée d'abord

3. **"Impossible de vous inscrire"**
   - Vérifiez les logs dans le navigateur (F12 > Console)
   - Vérifiez `wrangler tail` pour les erreurs serveur

