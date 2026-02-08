# 📋 Résumé de Déploiement - Tombola

**Date:** 7 février 2026  
**Branche:** `tombolaProd`  
**Statut:** ✅ Déployé en développement global

---

## 🎯 Objectif
Lancer la tombola sur serveur avec base de données Cloudflare D1 (développement global) avant mise en production.

---

## ✅ État du Déploiement

### Développement Global (Cloudflare)

| Composant | Statut | Détails |
|-----------|--------|---------|
| **API Cloudflare** | ✅ Déployée | `https://les-ptits-trinquat-api.medhozz007.workers.dev` |
| **Base de données D1** | ✅ Créée | `tombola-dev` - 7 tables |
| **Utilisateur Admin** | ✅ Créé | Email: `medhozz007@gmail.com` |
| **Migrations SQL** | ✅ Exécutées | 22 requêtes de configuration |
| **Version ID** | ✅ | `538fb010-fc21-4505-81fb-db7e1ac1ecd1` |

---

## 🚀 Déploiement Effectué

### Étape 1: Installation des dépendances
```bash
cd cloudflare
npm install
```
✅ Wrangler et dépendances installés

### Étape 2: Déploiement API
```bash
npx wrangler deploy
```
✅ **Résultat:** API déployée avec succès  
- Upload: 102.23 KiB (gzip: 22.57 KiB)
- Startup time: 5 ms

### Étape 3: Création des tables D1
```bash
npx wrangler d1 execute tombola-dev --file=migrations/0001_tombola_schema.sql --remote
```
✅ **Résultat:** 7 tables créées
- Tables: `users`, `user_roles`, `sessions`, `tombola_participants`, `tombola_lots`, `newsletter_subscribers`, `audit_logs`
- Taille BD: 155 KB

### Étape 4: Initialisation Admin
```bash
npx wrangler d1 execute tombola-dev --file=migrations/0002_seed_admin.sql --remote
```
✅ **Résultat:** Compte admin créé

---

## 🔗 Endpoints API Disponibles

### Publics (sans authentification)
```
POST   /api/tombola/participants        → Créer un participant
GET    /api/tombola/participants        → Lister les participants
POST   /api/tombola/lots                → Créer un lot
GET    /api/tombola/lots                → Lister les lots
```

### Authentifiés (avec Bearer Token)
```
PATCH  /api/tombola/lots/:id/reserve    → Réserver un lot
GET    /api/tombola/contact-link/:lotId → Obtenir un lien de contact
```

### Admin (authentification + rôle admin)
```
GET    /api/tombola/admin/participants  → Voir tous les participants
DELETE /api/tombola/admin/participants/:id → Supprimer un participant
```

---

## 🧪 Configuration de Test

### Frontend - Développement Local
```bash
# Terminal 1 - à la racine
npm run dev
```
- URL: `http://localhost:5173`
- Auto-proxy vers API Cloudflare

### Backend - Monitoring
```bash
# Terminal 2 - dans cloudflare/
npx wrangler tail
```
- Affiche les logs en temps réel
- Utile pour le débogage

---

## 📊 Liaison Base de Données

**Binding Cloudflare:**
```
env.DB → D1 Database (tombola-dev)
```

**Environnement:** Production configuré
```toml
ENVIRONMENT = "production"
CORS_ORIGIN = "https://les-ptits-trinquat.pages.dev"
SESSION_DURATION = "604800" (7 jours)
RATE_LIMIT_MAX = "60"
```

---

## 🎮 Comment Tester

### 1. Accéder à la Tombola
```
http://localhost:5173/tombola
```

### 2. S'inscrire
- Remplir le formulaire
- L'utilisateur est sauvegardé dans `tombola-dev`

### 3. Proposer un lot
- Sélectionner vous-même
- Ajouter des lots

### 4. Réserver un lot
- Changer de participant
- Cliquer "Réserver"

### 5. Vérifier la BD
```bash
npx wrangler d1 execute tombola-dev --remote --command "SELECT COUNT(*) as participants FROM tombola_participants"
```

---

## 🔍 Diagnostique API

### Health Check
```bash
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/health
```

### Lister les participants
```bash
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/api/tombola/participants
```

### Créer un participant
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

---

## 📝 Variables d'Environnement

**Fichier:** `cloudflare/wrangler.toml`

```toml
# Base de données
[[d1_databases]]
binding = "DB"
database_name = "tombola-dev"
database_id = "4f519cb2-40f8-433d-9da0-4c250a95b45c"

# Variables
[vars]
ENVIRONMENT = "production"
CORS_ORIGIN = "https://les-ptits-trinquat.pages.dev"
SESSION_DURATION = "604800"
RATE_LIMIT_MAX = "60"
```

---

## 📍 Prochaines Étapes

### ✅ Actuellement
- [ ] Utiliser l'application
- [ ] Vérifier les logs avec `wrangler tail`
- [ ] Tester tous les endpoints

### 🚀 Avant Mise en Production
- [ ] Changer `CORS_ORIGIN` vers le domaine production
- [ ] Configurer les secrets: `RESEND_API_KEY`, `JWT_SECRET`
- [ ] Tester avec données réelles
- [ ] Valiser les performances
- [ ] Créer un backup de la BD

### 📦 Mise en Production
```bash
# 1. Basculer vers branche main
git checkout main
git merge tombolaProd

# 2. Redéployer
cd cloudflare
npx wrangler deploy

# 3. Vérifier
wrangler tail
```

---

## 🆘 Troubleshooting

| Problème | Solution |
|----------|----------|
| API ne répond pas | Vérifier `wrangler tail` pour les erreurs |
| Erreur inscription | Consulter DevTools Console (F12) |
| CORS error | Vérifier `CORS_ORIGIN` dans wrangler.toml |
| Données non sauvegardées | Vérifier les logs SQL dans `wrangler tail` |
| DB peut pas se connecter | Vérifier `database_id` dans wrangler.toml |

---

## 📚 Fichiers Importants

```
cloudflare/
├── wrangler.toml                    # Configuration Cloudflare
├── src/
│   ├── index.ts                     # Point d'entrée API
│   ├── routes/tombola.ts            # Endpoints tombola
│   └── middleware/
│       ├── auth.ts                  # Authentification
│       └── rateLimit.ts             # Limitation de requêtes
├── migrations/
│   ├── 0001_tombola_schema.sql      # Tables
│   └── 0002_seed_admin.sql          # Admin utilisateur
└── package.json                     # Dépendances

src/
├── hooks/useTombolaParticipants.ts  # Fetch API
└── components/tombola/
    ├── ParticipantForm.tsx          # Inscription
    ├── LotForm.tsx                  # Proposer lot
    └── ParticipantSelector.tsx      # Sélection (bas-gauche)
```

---

**Déploiement complété le 2026-02-07** ✨

