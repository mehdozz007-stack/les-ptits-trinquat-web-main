# 🎊 Guide d'Activation de la Tombola

## Problème Identifié
❌ **Erreur d'inscription** : La base de données D1 n'a pas été initialisée

## ✅ Solution - 3 étapes

### Étape 1: Déployer l'API mise à jour
```bash
cd cloudflare && npm install
npm install --save-dev wrangler@latest
npm list wrangler
npx wrangler deploy
```
**Résultat attendu:** "Successfully published to https://les-ptits-trinquat-api.medhozz007.workers.dev"

### Étape 2: Créer les tables de base de données
```bash
npx wrangler d1 execute tombola-dev --file=migrations/0001_tombola_schema.sql --remote
```
**Résultat attendu:** Aucune erreur, tables créées

### Étape 3: Initialiser l'utilisateur admin
```bash
npx wrangler d1 execute tombola-dev --file=migrations/0002_seed_admin.sql --remote
```
**Résultat attendu:** Admin créé avec succès

---

## 🧪 Tester l'API

### Tester l'inscription (POST)
```bash
curl -X POST https://les-ptits-trinquat-api.medhozz007.workers.dev/api/tombola/participants \
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
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/api/tombola/participants
```

---

## 🚀 Tester Localement

### Dev server frontend (terminal 1)
```bash
npm run dev
```
Accédez à: http://localhost:8081/tombola

### Voir les logs backend (terminal 2)
```bash
cd cloudflare
wrangler tail
```

---

## 📝 Changements Effectués

1. **Endpoint d'inscription rendu PUBLIC** (sans authentification requise)
   - Fichier: `cloudflare/src/routes/tombola.ts` ligne 92
   - Ancien: `POST /participants - Créer un participant (auth requis)`
   - Nouveau: `POST /participants - Créer un participant (public)`

2. **Amélioration des messages d'erreur**
   - Fichier: `src/components/tombola/ParticipantForm.tsx`
   - Affichage du message d'erreur réel du serveur

3. **Amélioration du hook API**
   - Fichier: `src/hooks/useTombolaParticipants.ts`
   - Meilleure gestion des réponses JSON
   - Logging amélioré pour le débogage

---

## ⚠️ Important
Assurez-vous que:
- ✅ Vous êtes connecté à Cloudflare CLI (`wrangler whoami`)
- ✅ Le projet Cloudflare est configuré (`cloudflare/wrangler.toml`)
- ✅ La base de données D1 "tombola-dev" existe

---

## 📞 En Cas de Problème

1. **"Permission denied" ou "Unauthorized"**
   - Exécutez: `wrangler login`

2. **"Database not found"**
   - La base de données doit être créée d'abord

3. **"Impossible de vous inscrire"**
   - Vérifiez les logs dans le navigateur (F12 > Console)
   - Vérifiez `wrangler tail` pour les erreurs serveur

