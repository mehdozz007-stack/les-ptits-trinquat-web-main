# 🚀 Guide Mise en Production

**Après tests complétés en développement global**

---

## État Actuel

```
Branche:        tombolaProd
API Dev:        ✅ https://les-ptits-trinquat-api.medhozz007.workers.dev
API Prod:       🔄 À déployer
Base de données: ✅ tombola-dev (développement)
Frontend:       ✅ https://les-ptits-trinquat.pages.dev
Tombola:        ✅ Fonctionnelle en dev
Admin Panel:    ✅ Fonctionnel en dev
```

---

## Checklist Pré-Production

### ✅ Avant de Merger vers `main`

- [x] Tous les tests passent localement
- [x] Pas de warnings console dans le navigateur
- [x] `wrangler tail` affiche les logs sans erreur
- [x] Base de données D1 contient des données valides
- [x] Inscription participant fonctionne
- [x] Création de lot fonctionne
- [x] Réservation de lot fonctionne
- [ ] Panel admin authentification fonctionne
- [ ] Suppression de participants fonctionne
- [ ] Données persistées correctement

---

## 📋 Configuration Production - Étapes Détaillées

### Étape 1: Mise à jour du wrangler.toml

Créer un environnement `production` dans `cloudflare/wrangler.toml`:

```toml
# ============================================================
# Environnement de production
# ============================================================
[env.production]
name = "les-ptits-trinquat-api-prod"
routes = [
  { pattern = "les-ptits-trinquat-api.medhozz007.workers.dev/*", zone_name = "medhozz007.workers.dev" }
]

# Base de données production (à créer)
[[env.production.d1_databases]]
binding = "DB"
database_name = "tombola-prod"
database_id = "XXXXX"  # À récupérer après création

# Variables production
[env.production.vars]
ENVIRONMENT = "production"
CORS_ORIGIN = "https://les-ptits-trinquat.pages.dev"
SESSION_DURATION = "604800"
RATE_LIMIT_MAX = "100"
LOG_LEVEL = "info"
```

### Étape 2: Créer la Base de Données Production

```bash
cd cloudflare

# Créer une nouvelle base de données D1 pour la production
npx wrangler d1 create tombola-prod

# Récupérer le database_id et le mettre dans wrangler.toml [env.production]
```

**Résultat attendu:**
```
✅ Database created
📝 Add the following to your wrangler.toml:
   database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Étape 3: Initialiser la Base de Données Production

```bash
cd cloudflare

# Exécuter les migrations sur la BD production
npx wrangler d1 execute tombola-prod --file=migrations/0001_reset_schema.sql --remote
npx wrangler d1 execute tombola-prod --file=migrations/0002_seed_admin.sql --remote
```

### Étape 4: Configurer les Secrets Production

```bash
cd cloudflare

# Configurer pour l'environnement production
npx wrangler secret put RESEND_API_KEY --env production
# (Copier la clé API Resend)

npx wrangler secret put JWT_SECRET --env production
# (Générer un secret aléatoire - min 32 caractères)
# Suggestion: $(openssl rand -base64 32)

npx wrangler secret put ADMIN_PASSWORD_SALT --env production
# (Clé de salage PBKDF2 - min 32 caractères)
```

### Étape 5: Vérifier les Secrets

```bash
npx wrangler secret list --env production
```

---

## 🔐 Identifiants Admin Production

**À générer après déploiement:**

```
Email:    admin@tombola.fr
Password: À définir via /auth/reset-admin
```

**Réinitialiser admin en prod:**
```bash
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/api/auth/reset-admin
# Génère un nouvel admin avec credentials par défaut
```

---

## 📦 Processus de Déploiement

### Phase 1: Préparation (Local)

```bash
# 1. Vérifier qu'on est sur la branche correcte
git status
git branch -a

# 2. Mettre à jour le wrangler.toml avec config production
# (voir Étape 1 ci-dessus)

# 3. Tester les migrations localement
cd cloudflare
npx wrangler d1 execute tombola-dev --file=migrations/0001_reset_schema.sql --local
npx wrangler d1 execute tombola-dev --file=migrations/0002_seed_admin.sql --local
```

### Phase 2: Déploiement de la Base de Données

```bash
cd cloudflare

# 1. Créer la BD production
npx wrangler d1 create tombola-prod

# 2. Noter le database_id et mettre à jour wrangler.toml

# 3. Initialiser les tables
npx wrangler d1 execute tombola-prod --file=migrations/0001_reset_schema.sql --remote
npx wrangler d1 execute tombola-prod --file=migrations/0002_seed_admin.sql --remote

# 4. Vérifier
npx wrangler d1 execute tombola-prod --remote --command "SELECT COUNT(*) as tables FROM sqlite_master WHERE type='table';"
```

### Phase 3: Déployer l'API Production

```bash
cd cloudflare

# 1. Configurer les secrets (voir Étape 4)

# 2. Déployer en production
npx wrangler deploy --env production

# 3. Vérifier le déploiement
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/health
```

### Phase 4: Vérifier les Endpoints

```bash
# Santé de l'API
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/health

# Lister les participants (public)
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/api/tombola/participants

# Diagnostic (vérifier les données)
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/diagnostic
```

### Phase 5: Merger et Mettre à Jour le Frontend

```bash
# 1. Merger vers main
git checkout main
git pull origin main
git merge tombolaProd
git push origin main

# 2. Le frontend Cloudflare Pages se redéploiera automatiquement
# L'API_URL sera automatiquement routée vers /api/tombola/... 
# qui sera servie par les Workers
```

---

## 🔗 URLs de Production

| Composant | URL | Statut |
|-----------|-----|--------|
| **Site Web** | https://les-ptits-trinquat.pages.dev | ✅ Cloudflare Pages |
| **API Tombola** | https://les-ptits-trinquat-api.medhozz007.workers.dev | ✅ Cloudflare Workers |
| **Tombola Frontend** | https://les-ptits-trinquat.pages.dev/tombola | ✅ Pages + Workers |
| **Admin Panel** | https://les-ptits-trinquat.pages.dev/admin/tombola | ✅ Pages + Workers |
| **Health Check** | https://les-ptits-trinquat-api.medhozz007.workers.dev/health | ✅ API |

**Note:** L'URL API dans le code frontend s'adapte automatiquement via `lib/api-config.ts`

---

## 🔄 Migration des Données Dev → Prod

Si vous voulez copier les données existantes:

```bash
# 1. Exporter depuis dev
npx wrangler d1 execute tombola-dev --remote --command "SELECT * FROM tombola_participants" > participants.json

# 2. Importer en prod
# (Utiliser un script Node.js ou les outils Cloudflare)
```

**⚠️ Attention:** Vérifier que les IDs ne créent pas de conflits.

---

## 📊 Monitoring en Production

### Logs en Temps Réel

```bash
# Voir les logs production
npx wrangler tail --env production

# Avec filtres
npx wrangler tail --env production | grep -i error
```

### Dashboard Cloudflare

1. Aller sur https://dash.cloudflare.com
2. Sélectionner le compte "medhozz007"
3. Aller dans "Workers & Pages"
4. Sélectionner "les-ptits-trinquat-api"
5. Voir les métriques et logs

---

## 🆘 Troubleshooting Production

| Problème | Solution |
|----------|----------|
| **CORS Error** | Vérifier `CORS_ORIGIN` dans wrangler.toml [env.production.vars] |
| **Database Not Found** | Vérifier database_id dans wrangler.toml [env.production.d1_databases] |
| **Auth Failed** | Vérifier secrets: `npx wrangler secret list --env production` |
| **API Timeout** | Vérifier les logs: `npx wrangler tail --env production` |
| **Données Manquantes** | Vérifier migrations: `npx wrangler d1 execute tombola-prod --remote --command "SELECT COUNT(*) FROM tombola_participants;"` |

---

## 🔄 Rollback en Cas de Problème

### Rollback Code

```bash
# 1. Annuler le commit
git revert HEAD
git push origin main

# 2. Redéployer l'ancienne version
cd cloudflare
npx wrangler deploy --env production

# 3. Vérifier
npx wrangler tail --env production
```

### Rollback Base de Données

```bash
# ⚠️ ATTENTION: Destructif!

# 1. Supprimer la BD production (si catastrophe)
# (À faire via le dashboard Cloudflare - pas de CLI)

# 2. Recréer à partir de la sauvegarde
npx wrangler d1 create tombola-prod
npx wrangler d1 execute tombola-prod --file=migrations/0001_reset_schema.sql --remote
```

---

## 📝 Checklist Finales

Avant de déclarer le déploiement production réussi:

- [ ] API répond sur `https://les-ptits-trinquat-api.medhozz007.workers.dev/health`
- [ ] Frontend accessible sur `https://les-ptits-trinquat.pages.dev`
- [ ] Inscription participant fonctionne
- [ ] Création de lot fonctionne
- [ ] Panel admin login fonctionne
- [ ] Admin peut voir les participants
- [ ] Logs production ne montrent pas d'erreurs
- [ ] CORS fonctionne (pas d'erreurs dans DevTools)
- [ ] Variables env sont configurées
- [ ] Secrets sont en place
- [ ] Base de données contient les données initiales

---

## 📞 Contacts & Ressources

- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Workers Docs:** https://developers.cloudflare.com/workers
- **D1 Docs:** https://developers.cloudflare.com/d1
- **Pages Docs:** https://developers.cloudflare.com/pages

---

**Déploiement production - Prêt à lancer!** 🚀🎉

