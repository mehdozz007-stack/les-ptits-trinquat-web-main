# 📧 Guide Complet de Déploiement Newsletter en Production

**Dernière mise à jour**: Mars 2026  
**Version**: 1.0 - Déploiement Production avec Cloudflare D1 SQLite  
**Branche**: `newsletter`  
**Status**: ✅ Production-Ready

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Pré-requis](#pré-requis)
4. [Configuration Pré-Déploiement](#configuration-pré-déploiement)
5. [Déploiement Step-by-Step](#déploiement-step-by-step)
6. [Variables d'Environnement](#variables-denvironnement)
7. [Secrets Cloudflare](#secrets-cloudflare)
8. [Base de Données D1](#base-de-données-d1)
9. [Tests Post-Déploiement](#tests-post-déploiement)
10. [Rollback & Troubleshooting](#rollback--troubleshooting)

---

## 🎯 Vue d'ensemble

### Qu'est-ce que la Newsletter ?

Système complet de gestion des newsletters pour **Les P'tits Trinquat**:

#### 🔴 Partie Publique
- ✅ Formulaire d'inscription sur le site public
- ✅ Validation GDPR avec consentement explicite
- ✅ Validation d'email robuste
- ✅ Gestion des désabonnements

#### 🟠 Partie Administrateur
- ✅ Dashboard privé pour les administrateurs
- ✅ Liste complète des abonnés avec recherche/filtre
- ✅ Création et édition de newsletters
- ✅ Envoi immédiat ou brouillon
- ✅ Test d'email avant envoi
- ✅ Export CSV des abonnés
- ✅ Gestion du statut d'abonnement

#### 📧 Intégration Email
- ✅ **Email Service**: Resend.io (API REST)
- ✅ **Templates**: HTML responsive (email-safe)
- ✅ **Environnements**: Adresses différentes dev/prod
- ✅ **Tracking**: Journal des événements d'envoi

---

## 🏗️ Architecture

### Stack Technologique

```
┌─────────────────────────────────────────────────┐
│         Frontend (React 19 + TypeScript)        │
│  http://localhost:8082  →  Production Domain    │
└──────────────┬──────────────────────────────────┘
               │ /api/newsletter/*
               ↓
┌─────────────────────────────────────────────────┐
│    Cloudflare Workers API (Hono Framework)      │
│  http://localhost:8787  →  Production Domain    │
│    Path: cloudflare/src/routes/newsletter.ts    │
└──────────────┬──────────────────────────────────┘
               │ D1 Binding
               ↓
┌─────────────────────────────────────────────────┐
│   Cloudflare D1 Database (SQLite Serverless)    │
│     Dev: tombola-dev                            │
│     Prod: les-ptits-trinquat-prod               │
└─────────────────────────────────────────────────┘
               │ RESEND_API_KEY
               ↓
┌─────────────────────────────────────────────────┐
│        Resend.io API (Email Service)            │
│    https://api.resend.com/emails                │
└─────────────────────────────────────────────────┘
```

### Flux d'Inscription

```
Visiteur remplit le formulaire
    ↓
Frontend valide email + consentement GDPR
    ↓
POST /api/newsletter/subscribe
    ↓
Backend vérifie email unique
    ↓
Insérez dans newsletter_subscribers
    ↓
Réponse succès au frontend ✅
```

### Flux d'Envoi (Admin)

```
Admin crée newsletter dans le dashboard
    ↓
Prévisualise avec l'email template
    ↓
Envoie test (1 email seulement)
    ↓
Approuve et clique "Envoyer à tous"
    ↓
Boucle sur newsletter_subscribers (is_active=1)
    ↓
API Resend pour chaque email
    ↓
Journalise dans newsletter_email_events
    ↓
Met à jour newsletter status = 'sent'
```

---

## 📋 Pré-requis

### Comptes & Accès Requis

- ✅ Accès à [Cloudflare Dashboard](https://dash.cloudflare.com)
- ✅ Compte [Resend.io](https://resend.com) (gratuit ou payant)
- ✅ Git et branche `newsletter` à jour
- ✅ Node.js >= 18.14.0
- ✅ npm >= 9.0.0
- ✅ Connaissances de base Cloudflare Workers

### Architectures Supportées

| Élément | Dev | Production |
|---------|-----|------------|
| **Frontend** | `http://localhost:8082` | `https://www.lespetitstrinquat.fr` |
| **Backend** | `http://localhost:8787` | `https://les-ptits-trinquat-api.mehdozz007.workers.dev` |
| **Database** | `tombola-dev` (D1) | `les-ptits-trinquat-prod` (D1) |
| **Email From** | `onboarding@resend.dev` | `Les P'tits Trinquat <newsletter@lespetitstrinquat.fr>` |
| **CORS Origin** | `http://localhost:8082` | `https://www.lespetitstrinquat.fr` |

---

## ⚙️ Configuration Pré-Déploiement

### ✅ Étape 0: Vérifier la Branche

```bash
# Assurez-vous d'être sur la branche newsletter
git branch -a
git checkout newsletter
git pull origin newsletter

# Vérifiez que le code est propre
git status
```

**Résultat attendu**: `On branch newsletter` et `nothing to commit`

---

### ✅ Étape 1: Vérifier Dépendances Installées

```bash
# À la racine du projet
npm install

# Allez dans cloudflare et installez aussi
cd cloudflare
npm install
cd ..

# Vérifiez les versions
node --version   # Doit être >= 18.14.0
npm --version    # Doit être >= 9.0.0
```

**Résultat attendu**: 
- ✓ Tous les packages installés dans node_modules
- ✓ Pas d'erreurs en rouge (warnings OK)
- ✓ `npx wrangler --version` fonctionne

---

### ✅ Étape 2: Vérifier la Configuration Cloudflare

```bash
cd cloudflare

# Vérifiez que wrangler.toml existe et est bien structuré
cat wrangler.toml | head -30

# Vérifiez que les bindings D1 sont corrects
grep -A 5 "d1_databases" wrangler.toml
```

**Fichier wrangler.toml attendu** (extrait):
```toml
name = "les-ptits-trinquat-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "les-ptits-trinquat-prod"
database_id = "3f030e96-e28d-4acb-ba13-71c5b1f891b6"

[env.production]
vars = { ENVIRONMENT = "production", CORS_ORIGIN = "https://www.lespetitstrinquat.fr", ... }

[env.dev]
vars = { ENVIRONMENT = "development", CORS_ORIGIN = "http://localhost:8082", ... }
```

---

## 🚀 Déploiement Step-by-Step

### 🔵 PHASE 1: Préparation Locale (15 minutes)

#### Étape 1.1: Tester en Développement Local

```bash
# Terminal 1: Backend Cloudflare Workers
cd cloudflare
npm run dev

# Attendez le message: "Local mode enabled"
# L'API sera disponible à http://127.0.0.1:8787
```

```bash
# Terminal 2: Frontend Vite (à la racine)
npm run dev

# Attendez le message: "Local app running at http://localhost:8082"
```

**Tests locaux** avant déploiement:

```bash
# Terminal 3: Tests API

# 1. Test health check backend
curl http://127.0.0.1:8787/health
# Résultat attendu: {"status":"ok","timestamp":"..."}

# 2. Test inscription publique
curl -X POST http://127.0.0.1:8787/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-local@example.com",
    "first_name": "Test",
    "consent": true
  }'
# Résultat: {"success":true,"message":"Successfully subscribed..."}

# 3. Vérifier dans la DB locale
cd cloudflare
npx wrangler d1 execute tombola-dev \
  --command="SELECT COUNT(*) as count FROM newsletter_subscribers;"
# Résultat: count=1 (ou plus si vous avez déjà des données)
```

✅ **Si tous les tests réussissent**, continuez.  
❌ **Si une erreur**: Vérifiez les logs du terminal backend, consultez [Troubleshooting](#troubleshooting).

---

#### Étape 1.2: Build du Frontend

```bash
# À la racine
npm run build

# Vérifiez le contenu de dist/
ls -la dist/
# Vous devriez voir:
# - index.html
# - assets/
# - _redirects
# - _routes.json
# - robots.txt
```

**Résultat attendu**: Pas d'erreurs TypeScript ou build, tous les assets générés.

---

### 🔵 PHASE 2: Configuration Cloudflare (10 minutes)

#### Étape 2.1: Créer la Base de Données Production (SI N'EXISTE PAS)

```bash
cd cloudflare

# Vérifiez d'abord si la BD existe
wrangler d1 list

# Si "les-ptits-trinquat-prod" n'existe pas:
wrangler d1 create les-ptits-trinquat-prod

# Vous recevrez une réponse comme:
# ✅ Successfully created DB "les-ptits-trinquat-prod"
# [[d1_databases]]
# binding = "DB"
# database_name = "les-ptits-trinquat-prod"
# database_id = "3f030e96-e28d-4acb-ba13-71c5b1f891b6"  ← COPIER CETTE ID
```

**Si la base existe déjà** (à partir de déploiements précédents):
- Gardez l'ID existant (dans wrangler.toml)
- Les migrations seront appliquées à cette base

---

#### Étape 2.2: Appliquer les Migrations D1 Production

```bash
cd cloudflare

# Exécutez CHAQUE migration dans l'ordre
# (Certaines dépendent des précédentes)

# Les migrations newsletter essentielles sont:
# 0014 → 0018 → 0020

# Commande pour appliquer:
npx wrangler d1 execute les-ptits-trinquat-prod \
  --remote \
  --file=migrations/0014_add_rate_limits_and_newsletter.sql

npx wrangler d1 execute les-ptits-trinquat-prod \
  --remote \
  --file=migrations/0018_add_mehdi_newsletter_admin.sql

npx wrangler d1 execute les-ptits-trinquat-prod \
  --remote \
  --file=migrations/0020_recreate_newsletter_tables.sql
```

**Résultat attendu pour chaque migration**:
```
✓ Executed 1 statement
```

**Vérifier que les tables existent**:

```bash
npx wrangler d1 execute les-ptits-trinquat-prod \
  --remote \
  --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

**Tables attendues** (entre autres):
- `newsletter_subscribers` ✅
- `newsletters` ✅
- `newsletter_email_events` ✅
- `users` ✅
- `user_roles` ✅
- `rate_limits` ✅

---

#### Étape 2.3: Configurer les Secrets Cloudflare

Les secrets **NE PEUVENT PAS** être stockés dans `wrangler.toml` (fichier git).  
Ils doivent être configurés via CLI pour être **sécurisés**.

##### 🔒 Secret 1: RESEND_API_KEY (CRITIQUE)

```bash
cd cloudflare

# Pour la production
wrangler secret put RESEND_API_KEY --env production

# Vous êtes invité à entrer la clé (elle ne s'affichera pas)
# → Allez sur https://resend.com → Settings → API Keys
# → Copiez la clé (commence par "re_")
# → Collez-la et appuyez sur Entrée
```

**Résultat attendu**:
```
✓ Uploaded secret RESEND_API_KEY to les-ptits-trinquat-api (production)
```

##### 🔒 Secret 2: JWT_SECRET (CRITIQUE)

```bash
# Générez une clé secrète sécurisée (minimum 32 caractères)
# Options:
# 1. Python: python -c "import secrets; print(secrets.token_urlsafe(32))"
# 2. OpenSSL: openssl rand -hex 32
# 3. Node.js: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Utilisez la clé générée:
wrangler secret put JWT_SECRET --env production

# Collez la clé et appuyez Entrée
```

**Résultat attendu**:
```
✓ Uploaded secret JWT_SECRET to les-ptits-trinquat-api (production)
```

##### 🔒 Secret 3: BCRYPT_ROUNDS (OPTIONNEL)

```bash
wrangler secret put BCRYPT_ROUNDS --env production

# Entrez: 12 (ou 10-14, plus = plus lent mais plus sûr)
```

---

**⚠️ TRÈS IMPORTANT**: 
- Ces secrets sont **STOCKÉS CHEZ CLOUDFLARE**, pas dans votre repo
- Vous ne pouvez **PAS les récupérer** après
- Documentez-les dans un **endroit sûr** (gestionnaire de mots de passe)
- Les secrets dev/prod sont **séparés**

Vérifier les secrets configurés:

```bash
wrangler secret list --env production

# Résultat: Liste des secrets (valeurs masquées)
# RESEND_API_KEY
# JWT_SECRET
# BCRYPT_ROUNDS (optionnel)
```

---

### 🔵 PHASE 3: Déploiement (5 minutes)

#### Étape 3.1: Déployer l'API Cloudflare Workers

```bash
cd cloudflare

# Déployer en production (IMPORTANT: pas de --env=dev !)
npm run deploy

# Vous devriez voir:
# ✓ Uploading les-ptits-trinquat-api (2 files)
# ✓ Uploaded les-ptits-trinquat-api
# → https://les-ptits-trinquat-api.mehdozz007.workers.dev
```

**Vérifier le déploiement**:

```bash
# Test health check de production
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health

# Résultat: {"status":"ok","timestamp":"2024-02-11T..."}
```

✅ **L'API est maintenant en production!**

---

#### Étape 3.2: Déployer le Frontend

```bash
# À la racine du projet

# Option A: Si vous utilisez GitHub Pages
npm run deploy

# Option B: Si Cloudflare Pages est configuré
# → Cloudflare déploiera automatiquement au push sur main
# → Pas de commande nécessaire
```

**Vérifier le déploiement frontend**:

```bash
# Accédez à votre domaine et vérifiez que:
# - La newsletter section s'affiche ✅
# - Les styles sont chargés ✅
# - Pas d'erreurs console ✅
```

---

## 📊 Variables d'Environnement

### Configuration dans `wrangler.toml`

```toml
# PRODUCTION
[env.production]
vars = {
  ENVIRONMENT = "production",
  CORS_ORIGIN = "https://www.lespetitstrinquat.fr",
  SESSION_DURATION = "604800",          # 7 jours en secondes
  RATE_LIMIT_MAX = "60",                # Max 60 requêtes
  RATE_LIMIT_WINDOW = "60",             # Par fenêtre de 60s
  NEWSLETTER_FROM_EMAIL = "Les P'tits Trinquat <newsletter@lespetitstrinquat.fr>",
  SITE_URL = "https://lespetitstrinquat.fr"
}

# DÉVELOPPEMENT
[env.dev]
vars = {
  ENVIRONMENT = "development",
  CORS_ORIGIN = "http://localhost:8082",
  SESSION_DURATION = "604800",
  RATE_LIMIT_MAX = "60",
  RATE_LIMIT_WINDOW = "60",
  NEWSLETTER_FROM_EMAIL = "onboarding@resend.dev",
  SITE_URL = "http://localhost:8082"
}
```

### Modification des Variables

Pour modifier une variable:

```bash
cd cloudflare

# 1. Modifiez wrangler.toml
nano wrangler.toml
# Trouvez [env.production] et modifiez la valeur

# 2. Redéployez
npm run deploy
```

---

## 🔐 Secrets Cloudflare

### Résumé des Secrets

| Secret | Exemple | Environnement | Obligatoire |
|--------|---------|---------------|-------------|
| `RESEND_API_KEY` | `re_xxxxx...` | prod + dev | ✅ OUI |
| `JWT_SECRET` | `a1b2c3d4...` (32+ chars) | prod + dev | ✅ OUI |
| `BCRYPT_ROUNDS` | `12` | prod + dev | ❌ Non (défaut: 12) |

### Gérer les Secrets

```bash
cd cloudflare

# Lister les secrets configurés
wrangler secret list --env production

# Ajouter/Modifier un secret
wrangler secret put <NAME> --env production

# Supprimer un secret (attention!)
wrangler secret delete <NAME> --env production

# Les secrets dist/prod et dev sont SÉPARÉS
wrangler secret put RESEND_API_KEY --env dev  # Dev seulement
wrangler secret put RESEND_API_KEY --env production  # Prod seulement
```

### 🔴 Secrets Dev vs Prod

**Dev** (`--env dev`):
- RESEND_API_KEY: Utilise `onboarding@resend.dev` (test Resend)
- JWT_SECRET: Peut être simple (local seulement)
- À utiliser pour tester localement

**Prod** (`--env production`):
- RESEND_API_KEY: Votre clé Resend payante/production
- JWT_SECRET: Clé sécurisée complexe
- À utiliser pour production réelle

---

## 🗄️ Base de Données D1

### Structure des Tables

#### `newsletter_subscribers` (Abonnés)

```sql
CREATE TABLE newsletter_subscribers (
    id TEXT PRIMARY KEY,                    -- UUID généré automatiquement
    email TEXT NOT NULL UNIQUE,             -- Email unique (case-insensitive)
    first_name TEXT,                        -- Prénom optionnel
    consent INTEGER NOT NULL DEFAULT 0,     -- GDPR: 0=non, 1=oui
    is_active INTEGER NOT NULL DEFAULT 1,   -- 0=désabonné, 1=actif
    unsubscribed_at TEXT,                   -- Timestamp désinscription
    created_at TEXT NOT NULL,               -- ISO timestamp
    updated_at TEXT NOT NULL                -- ISO timestamp
);
```

#### `newsletters` (Brouillons & Envoyés)

```sql
CREATE TABLE newsletters (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,                    -- Titre interne
    subject TEXT NOT NULL,                  -- Sujet email
    content TEXT NOT NULL,                  -- Contenu texte/HTML
    status TEXT DEFAULT 'draft',            -- draft/sent/failed
    preview_text TEXT,                      -- Aperçu (140 chars)
    html_template TEXT,                     -- HTML email généré
    sent_at TEXT,                           -- NULL si pas envoyé
    sent_by TEXT,                           -- User ID qui a envoyé
    recipients_count INTEGER DEFAULT 0,     -- Nombre de destinataires
    created_by TEXT,                        -- User ID qui a créé
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

#### `newsletter_email_events` (Journal d'envois)

```sql
CREATE TABLE newsletter_email_events (
    id TEXT PRIMARY KEY,
    newsletter_id TEXT NOT NULL,             -- Lien à newsletter
    subscriber_id TEXT NOT NULL,             -- Lien à subscriber
    event_type TEXT,                         -- sent/opened/clicked/bounced/complained
    event_timestamp TEXT,
    created_at TEXT NOT NULL
    -- FOREIGN KEYs: newsletter_id, subscriber_id
);
```

### Commandes SQL Utiles

```bash
cd cloudflare

# Vérifier les tables
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --command="SELECT name FROM sqlite_master WHERE type='table';"

# Compter les abonnés
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --command="SELECT COUNT(*) as total FROM newsletter_subscribers;"

# Compter les abonnés actifs
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --command="SELECT COUNT(*) as active FROM newsletter_subscribers WHERE is_active = 1;"

# Lister les 10 derniers abonnés
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --command="SELECT email, first_name, is_active, created_at FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 10;"

# Vérifier les utilisateurs admin
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --command="SELECT u.email, ur.role FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id;"
```

### Sauvegarde & Export

```bash
# Exporter tous les abonnés (CSV)
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --command="SELECT email, first_name, is_active, created_at FROM newsletter_subscribers;" \
  > subscribers_export.csv
```

---

## 🧪 Tests Post-Déploiement

### ✅ Checklist de Validation

Après le déploiement, testez **CHAQUE** fonctionnalité:

```bash
PROD_API="https://les-ptits-trinquat-api.mehdozz007.workers.dev"
PROD_SITE="https://www.lespetitstrinquat.fr"
```

#### Test 1: Health Check

```bash
curl "${PROD_API}/health"

# Résultat de succès:
# {"status":"ok","timestamp":"2024-02-11T..."}
```

#### Test 2: Inscription Publique

```bash
curl -X POST "${PROD_API}/api/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-prod@example.com",
    "first_name": "Test Prod",
    "consent": true
  }'

# Résultat de succès:
# {"success":true,"message":"Successfully subscribed..."}
```

**En cas d'erreur 409** (déjà inscrit):
```bash
# Désinscrivez et réessayez
curl -X POST "${PROD_API}/api/newsletter/unsubscribe" \
  -H "Content-Type: application/json" \
  -d '{"email": "test-prod@example.com"}'
```

#### Test 3: Frontend Newsletter Section

```bash
# Accédez au site
curl -s "${PROD_SITE}" | grep -i "newsletter" | head -5

# Vérifiez que:
# - La section "La newsletter des P'tits Trinquat" apparaît
# - Le formulaire s'affiche
# - Les boutons sont cliquables
```

#### Test 4: Admin Panel (Authentification)

Pour tester le panel admin, vous avez besoin de:
- Email admin: `mehdi@gmail.com`
- Mot de passe: Défini lors de la création de l'admin

```bash
# 1. Authentifiez-vous
curl -X POST "${PROD_API}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mehdi@gmail.com",
    "password": "VOTRE_MOT_DE_PASSE"
  }'

# Résultat:
# {"success":true,"data":{"token":"eyJ0eXAi...","user":{...}}}

# 2. Copiez le token
TOKEN="eyJ0eXAi..."

# 3. Accédez à la liste des abonnés
curl -X GET "${PROD_API}/api/newsletter/admin/subscribers" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json"

# Résultat: Liste JSON de tous les abonnés
```

#### Test 5: Newsletter Admin UI

```bash
# 1. Accédez au panel admin
# URL: ${PROD_SITE}/admin/newsletter/auth
# Entrez: mehdi@gmail.com + mot de passe
# Redirect vers: ${PROD_SITE}/admin/newsletter

# 2. Testez les fonctionnalités:
# ✓ Liste des abonnés affichée
# ✓ Recherche fonctionne
# ✓ Boutons toggle/delete répondent
# ✓ Export CSV fonctionne
# ✓ Créer/Prévisualiser newsletter fonctionne
# ✓ Envoyer test email fonctionne
```

#### Test 6: Rate Limiting

```bash
# Fait 61 requêtes rapidement (limit est 60 par 60s)
for i in {1..61}; do
  curl -X POST "${PROD_API}/api/newsletter/subscribe" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"spam${i}@example.com\",\"consent\":true}" &
  sleep 0.1
done

# Les dernières devraient obtenir: 429 Too Many Requests
```

#### Test 7: CORS (en navigateur)

```javascript
// Ouvrez la console du navigateur sur ${PROD_SITE}
// Collez:
fetch('https://les-ptits-trinquat-api.mehdozz007.workers.dev/health')
  .then(r => r.json())
  .then(console.log)

// Résultat: ✓ Pas d'erreur CORS
// {"status":"ok","timestamp":"..."}
```

#### Test 8: Email d'Envoi

Vérifiez que l'email `NEWSLETTER_FROM_EMAIL` est correct:

```bash
# Dans le production D1
cd cloudflare
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --command="SELECT * FROM newsletters WHERE status = 'sent' LIMIT 1;" 

# Cherchez le champ "sent_by" - doit correspondre à mehdi@gmail.com
```

---

## 🔄 Rollback & Troubleshooting

### 🔴 Problème 1: API retourne 500

**Cause possible**: Secrets non configurés

```bash
# Vérifiez les secrets
cd cloudflare
wrangler secret list --env production

# Résultat: DOIT contenir RESEND_API_KEY et JWT_SECRET
# Si manquants: configurez-les (voir Étape 2.3)
```

### 🔴 Problème 2: Database tables don'existe pas

```bash
# Vérifiez que les migrations ont été appliquées
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --command="SELECT name FROM sqlite_master WHERE type='table';"

# Si newsletter_subscribers manque: réapplique la migration 0020
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --file=migrations/0020_recreate_newsletter_tables.sql
```

### 🔴 Problème 3: Inscription échoue avec "Already subscribed"

```bash
# Vérifiez que l'email n'existe pas déjà
cd cloudflare
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --command="SELECT * FROM newsletter_subscribers WHERE email = 'test@example.com';"

# Si présent: désinscrivez via API
curl -X POST https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Ensuite réessayez l'inscription
```

### 🔴 Problème 4: Resend API retourne erreur

```bash
# Cause possible: RESEND_API_KEY invalide ou expiré

# Solution 1: Vérifiez la clé sur https://resend.com
# Solution 2: Recréez la clé si elle a expiré
# Solution 3: Reconfigurée le secret

wrangler secret put RESEND_API_KEY --env production
# Entrez la nouvelle clé

# Redéployez (optionnel, secrets sont live)
npm run deploy
```

### 🔴 Problème 5: Frontend ne voit pas l'API

```bash
# Vérifiez CORS_ORIGIN dans wrangler.toml
grep CORS_ORIGIN cloudflare/wrangler.toml

# Doit contenir: https://www.lespetitstrinquat.fr
# Si manquant: modifiez wrangler.toml et redéployez

[env.production]
vars = { CORS_ORIGIN = "https://www.lespetitstrinquat.fr", ... }

npm run deploy
```

### 🔧 Rollback Complet (Retour à la Dernière Version)

```bash
# 1. Retournez à la dernière version stable
git log --oneline | head -10
git checkout <COMMIT_HASH_STABLE>

# 2. Redéployez
cd cloudflare && npm run deploy
cd ..
npm run build && npm run deploy
```

---

## 📈 Monitoring & Maintenance

### Logs en Production

```bash
# Visualiser les logs Cloudflare
cd cloudflare
wrangler tail --env production

# Affiche les logs en temps réel
# Utile pour déboguer les erreurs en production
```

### Vérifier la Santé de l'API

```bash
# Cron tous les jours (ou manuellement)
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health

# Doit toujours retourner: {"status":"ok","timestamp":"..."}
```

### Exporter les Données Régulièrement

```bash
# Chaque mois: exportez les abonnés
cd cloudflare
npx wrangler d1 execute les-ptits-trinquat-prod --remote \
  --command="SELECT email, first_name, is_active, created_at FROM newsletter_subscribers;" \
  > backups/subscribers_$(date +%Y-%m-%d).csv
```

---

## 📖 Commandes Rapides

### Résumé - Préparation & Déploiement

```bash
# 1. PRÉPARATION
git checkout newsletter
git pull origin newsletter
npm install && cd cloudflare && npm install && cd ..

# 2. DEV TEST (terminal 1)
cd cloudflare && npm run dev

# 3. DEV TEST (terminal 2)
npm run dev

# 4. BUILD
npm run build

# 5. DB PRODUCTION
cd cloudflare
npx wrangler d1 create les-ptits-trinquat-prod  # Si première fois
npx wrangler d1 execute les-ptits-trinquat-prod --remote --file=migrations/0014_add_rate_limits_and_newsletter.sql
npx wrangler d1 execute les-ptits-trinquat-prod --remote --file=migrations/0018_add_mehdi_newsletter_admin.sql
npx wrangler d1 execute les-ptits-trinquat-prod --remote --file=migrations/0020_recreate_newsletter_tables.sql

# 6. SECRETS
wrangler secret put RESEND_API_KEY --env production
wrangler secret put JWT_SECRET --env production

# 7. DEPLOY
npm run deploy

# 8. VÉRIFIER
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health
```

---

## ✅ Checklist Final

Avant de déclarer le déploiement **RÉUSSI**:

- [ ] Backend API répond sur https://les-ptits-trinquat-api.mehdozz007.workers.dev
- [ ] Frontend accédé sur https://www.lespetitstrinquat.fr
- [ ] Newsletter section affichée sur le site
- [ ] Formulaire public d'inscription fonctionne
- [ ] Email test envoyé via Resend
- [ ] Admin panel accessible via /admin/newsletter/auth
- [ ] List des abonnés charge dans le admin panel
- [ ] Chercher/Filtrer les abonnés fonctionne
- [ ] Export CSV fonctionne
- [ ] Créer/Prévisualiser une newsletter fonctionne
- [ ] Envoyer un test email fonctionne
- [ ] Pas d'erreurs TypeScript dans la console
- [ ] Pas d'erreurs CORS
- [ ] Rate limiting active (test avec 61 requêtes)
- [ ] Données présentes dans D1 production
- [ ] Secrets configuration vérifiés

---

## 📞 Support & Questions

### Ressources de Déploiement

- 📚 [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- 📚 [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- 📚 [Resend Email API](https://resend.com/docs)
- 📚 [Hono Framework](https://hono.dev)

### Contacts Équipe

- **Admin Newsletter**: mehdi@gmail.com
- **Réseau Production**: Cloudflare Dashboard
- **Emails**: Resend.io Console

---

## 🎉 Status

**Version**: 1.0  
**Date**: Mars 2026  
**Statut**: ✅ **PRODUCTION READY**

Sautes maintenant prêt à déployer la newsletter en production ! 🚀
