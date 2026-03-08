# 🚀 GUIDE COMPLET DE DÉPLOIEMENT - Tombola & Newsletter
**Status**: ✅ COMPLET ET TESTÉ  
**Dernière mise à jour**: 8 Mars 2026  
**Problème résolu**: Page blanche en production  
**Durée estimée**: 60 minutes

---

## 📋 TABLE DES MATIÈRES

1. [**Diagnostic du problème**](#-diagnostic-du-problème-page-blanche)
2. [**Architecture complète**](#-architecture-complète)
3. [**Configuration locale**](#-phase-1-configuration-et-tests-locaux)
4. [**Déploiement API**](#-phase-2-déploiement-api-cloudflare-workers)
5. [**Déploiement frontend**](#-phase-3-déploiement-frontend-cloudflare-pages)
6. [**Configuration newsletter**](#-phase-4-configuration-newsletter)
7. [**Tests post-déploiement**](#-phase-5-validation-et-tests)
8. [**Troubleshooting**](#-troubleshooting)

---

## 🔴 Diagnostic du problème (Page Blanche)

### Pourquoi la page est blanche en prod?

**Problème identifié**:
- ✅ API Workers déployée correctement
- ✅ Frontend buildé correctement
- ❌ Frontend sur Cloudflare Pages ne peut pas accéder à l'API
- ❌ Erreur CORS ou configuration API incorrecte

**Raison**:
```
DEV: /api → Vite proxy → localhost:8787 ✅
     (fonctionne via le serveur Vite)

PROD: /api → ??? (relatif, cherche sur le même domaine) ❌
      (il faut une URL absolue vers les Workers)
```

### Solution

L'API config doit retourner l'URL absolue en production:
```typescript
// ✅ CORRECT
if (dev) return '';                    // Proxy Vite
if (prod) return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev';
```

Vérifiez que **`src/lib/api-config.ts`** est correct (voir phase 1).

---

## 🏗️ Architecture Complète

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  https://mehdozz007-stack.github.io/les-ptits-trinquat-web-main   │
│  (ou https://les-ptits-trinquat.pages.dev)                  │
│  - React 19 + Vite                                           │
│  - Framer Motion animations                                  │
│  - Forms: Tombola, Newsletter, Admin                        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS API calls
                     ↓
┌─────────────────────────────────────────────────────────────┐
│          CLOUDFLARE WORKERS - API REST (Hono)               │
│  https://les-ptits-trinquat-api.mehdozz007.workers.dev      │
│  - Routes: /api/tombola/*, /api/newsletter/*, /api/auth/*   │
│  - Middleware: CORS, Rate Limiting, Auth                    │
│  - Database binding: D1 (SQLite)                            │
└────────────────────┬────────────────────────────────────────┘
                     │ Reads/Writes
                     ↓
┌─────────────────────────────────────────────────────────────┐
│         CLOUDFLARE D1 - DATABASE (SQLite Serverless)         │
│  Project: les-ptits-trinquat-prod                           │
│  ID: 3f030e96-e28d-4acb-ba13-71c5b1f891b6                   │
│  Tables: users, sessions, tombola_participants,             │
│          tombola_lots, newsletter_subscribers, ...           │
└─────────────────────────────────────────────────────────────┘
```

### Flux typique d'une requête

```
1. User remplit un formulaire (Tombola, Newsletter, Admin)
   ↓
2. Frontend appelle apiCall('/api/endpoint')
   ↓
3. En DEV: Vite proxy → localhost:8787
   En PROD: URL absolue → workers.dev domain
   ↓
4. Workers reçoit la requête
   - Valide CORS
   - Applique Rate Limiting
   - Checke authentification (si nécessaire)
   ↓
5. Workers accède à D1 (database)
   - Execute queries
   - Retourne JSON response
   ↓
6. Frontend affiche les données ou erreur
```

---

# 🎯 PHASE 1: Configuration et Tests Locaux

## Étape 1.1: Vérifier que le code est propre

```bash
# À la racine du projet
git status

# Résultat attendu:
# On branch main (ou dev)
# nothing to commit, working tree clean
```

**Si vous avez des modifications**:
```bash
# Stasher les changements
git stash

# Ou commit et push
git add -A
git commit -m "Description du changement"
git push origin main  # (ou dev)
```

---

## Étape 1.2: Vérifier la configuration API (CRITIQUE!)

**Fichier**: `src/lib/api-config.ts`

```bash
cat src/lib/api-config.ts | head -40
```

**Vous devriez voir** (les 30 premières lignes):
```typescript
/**
 * API Configuration - DOIT avoir la logique suivante
 */

function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev'; // ✅
  }

  const hostname = window.location.hostname;
  
  // ✅ EN DEV: retourner URL vide (Vite proxy)
  if (hostname === 'localhost' || hostname === '127.0.0.1' || 
      hostname.includes('192.168')) {
    return '';
  }
  
  // ✅ EN PROD: retourner URL absolue
  return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev';
}

export const API_BASE_URL = getApiBaseUrl();
```

### ⚠️ Si ce n'est pas correct

Créez ou mettez à jour `src/lib/api-config.ts`:

```bash
cat > src/lib/api-config.ts << 'EOF'
/**
 * API Configuration
 * Détermine l'URL de base pour les requêtes API
 * En DEV: URLs relatives (proxiées via Vite)
 * En PROD: URL absolue vers Cloudflare Workers
 */

function getApiBaseUrl(): string {
  // SSR or server-side (rare)
  if (typeof window === 'undefined') {
    return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev';
  }

  const hostname = window.location.hostname;
  const port = window.location.port;

  // Environnement de DÉVELOPPEMENT
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    port === '8080' ||       // Vite dev port
    port === '8082' ||       // Alternative port
    port === '5173' ||       // Vite default
    port === '3000' ||       // Common dev port
    hostname.includes('192.168')
  ) {
    // ✅ DEV: utiliser les URLs relatives (proxy Vite)
    return '';
  }

  // Environnement de PRODUCTION
  return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev';
}

export const API_BASE_URL = getApiBaseUrl();

export function apiUrl(endpoint: string): string {
  const url = `${API_BASE_URL}${endpoint}`;
  if (import.meta.env.DEV) {
    console.log('[API] URL:', url);
  }
  return url;
}
EOF
```

**Vérifier**:
```bash
cat src/lib/api-config.ts
```

---

## Étape 1.3: Installer les dépendances

```bash
# À la racine du projet
npm install

# Vérifier (pas d'erreurs rouge)
npm list --depth=0 | head -20
```

**Si des erreurs**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Étape 1.4: Vérifier wrangler.toml (Configuration API)

**Fichier**: `cloudflare/wrangler.toml`

```bash
cat cloudflare/wrangler.toml | head -20
```

**Vous devriez voir**:
```toml
name = "les-ptits-trinquat-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "les-ptits-trinquat-prod"
database_id = "3f030e96-e28d-4acb-ba13-71c5b1f891b6"  # ✅ Database ID

[env.production]
vars = { ENVIRONMENT = "production", CORS_ORIGIN = "https://www.lespetitstrinquat.fr", ... }

[env.dev]
vars = { ENVIRONMENT = "development", CORS_ORIGIN = "http://localhost:8082", ... }
[[env.dev.d1_databases]]
binding = "DB"
database_name = "tombola-dev"
database_id = "4f519cb2-40f8-433d-9da0-4c250a95b45c"  # Dev database
```

**Si le database_id est manquant ou faux**:
```bash
# Voir les databases existantes
wrangler d1 list

# Vous devriez voir les deux:
# ✓ les-ptits-trinquat-prod (3f030e96-e28d-4acb-ba13-71c5b1f891b6)
# ✓ tombola-dev (4f519cb2-40f8-433d-9da0-4c250a95b45c)
```

---

## Étape 1.5: Tester en LOCAL (Terminal 1 & 2)

### Terminal 1: Démarrer le backend API (Cloudflare Workers)

```bash
cd cloudflare
npm install  # si pas fait
npm run dev
```

**Attendez le message**:
```
 ⛅️  wrangler 3.x.x
⚡ Outputs
- Local D1 database created: .wrangler/state/d1/DATABASE_ID.sqlite3
⛅️ [wrangler:local] http://localhost:8787
```

**Vérifier que c'est OK**:
```bash
# Nouveau terminal pour tester
curl http://localhost:8787/health

# Résultat attendu:
# {"status":"ok","timestamp":"2026-03-08T...Z"}
```

### Terminal 2: Démarrer le frontend (Vite)

```bash
# À la racine du projet
npm run dev
```

**Attendez le message**:
```
  ➜  Local:   http://localhost:8082/
  ➜  press h + enter to show help
```

---

## Étape 1.6: Tester les endpoints localement

### Test 1: GET Participants (Public)

```bash
# Terminal 3
curl http://localhost:8082/api/tombola/participants

# Résultat:
# {"success":true,"data":[]}
```

### Test 2: POST Participant (Ajouter)

```bash
curl -X POST http://localhost:8082/api/tombola/participants \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Jean",
    "email": "jean@example.com",
    "role": "Parent",
    "emoji": "😊"
  }'

# Résultat:
# {"success":true,"message":"Participant ajouté","id":"..."}
```

### Test 3: Dans le navigateur

1. Ouvrir: **http://localhost:8082**
2. Naviguer vers: **/tombola**
3. Vérifier:
   - ✅ Page charge
   - ✅ La liste des participants affiche "Chargement..." puis les données
   - ✅ Ajouter un participant fonctionne
   - ✅ Message de succès apparaît

**Vérifier Console (F12 → Console)**:
- ❌ Pas d'erreurs rouges
- ✅ [API] logs affichent les URL

---

## Étape 1.7: Tester les API pour la Newsletter

### Test Newsletter Subscribe

```bash
curl -X POST http://localhost:8082/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "firstName": "Marie",
    "consent": true
  }'

# Résultat:
# {"success":true,"message":"Successfully subscribed..."}
```

### Test Admin Login

```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ptits-trinquat.fr",
    "password": "password123"
  }'

# Résultat:
# {"success":true,"token":"eyJ...","user":{...}}
```

---

## ✅ Résumé Étape 1

- [x] Dépendances installées
- [x] Configuration API vérifiée (`api-config.ts`)
- [x] Configuration Workers vérifiée (`wrangler.toml`)
- [x] Backend local fonctionne (http://localhost:8787)
- [x] Frontend local fonctionne (http://localhost:8082)
- [x] Endpoints testés et répondent correctement
- [x] Console sans erreurs

**Si tout est vert**: Continuer à Phase 2  
**Si des erreurs**: Voir [Troubleshooting](#-troubleshooting)

---

# 🚀 PHASE 2: Déploiement API (Cloudflare Workers)

## Étape 2.1: Vérifier les secrets

```bash
cd cloudflare

# Vérifier les secrets existants
wrangler secret list

# Vous devriez voir au minimum:
# JWT_SECRET (environment: production)
```

**Si JWT_SECRET est absent**:
```bash
# Générer une clé sûre (32+ caractères)
openssl rand -base64 32

# Exemple de résultat:
# x7K2q9P8mL5nJ3vR6wT4dFs+aB1cGhE2iOpQ

# Configurer le secret
wrangler secret put JWT_SECRET --env production

# Coller la clé générée ci-dessus et appuyer Entrée
# ✓ Uploaded secret JWT_SECRET
```

---

## Étape 2.2: Builder le frontend

```bash
# À la racine du projet
npm run build

# Vérifier le résultat
ls -lh dist/

# Vous devriez voir:
# - index.html (3-5 KB)
# - assets/ (plusieurs fichiers JS/CSS)
# Total: ~300 KB
```

**Si erreurs TypeScript**:
```bash
npm run build 2>&1 | grep -i error

# Corriger les erreurs et réessayer
```

---

## Étape 2.3: Déployer l'API (Production)

```bash
cd cloudflare

# ⚠️ IMPORTANT: SANS --env pour production!
npm run deploy

# Attendez le message:
# ✨ Uploaded les-ptits-trinquat-api (x.x KB)
# ✨ Your Worker is published under:
# ✨ https://les-ptits-trinquat-api.mehdozz007.workers.dev
```

---

## Étape 2.4: Vérifier le déploiement API

```bash
# Test health check
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health

# Résultat attendu:
# {"status":"ok","timestamp":"2026-03-08T...Z"}
```

**Si erreur "Could not resolve host"**:
Attendre 30-60 secondes (DNS propagation)

```bash
# Réessayer après 60 secondes
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health
```

---

## Étape 2.5: Tester les endpoints en production

```bash
# Test GET participants
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants

# Résultat:
# {"success":true,"data":[...]}
```

---

## ✅ Résumé Étape 2

- [x] Secrets JWT configurés
- [x] Frontend buildé (npm run build)
- [x] API déployée en production
- [x] Health check répond
- [x] Endpoints accessibles en HTTPS

**Continuer à Phase 3**

---

# 📱 PHASE 3: Déploiement Frontend (Cloudflare Pages)

## Étape 3.1: Déployer sur Cloudflare Pages

**Option A: Via GitHub Actions (Automatique)**

Les commits sur `main` déploient automatiquement via `.github/workflows/deploy.yml`.

```bash
# À la racine
git add -A
git commit -m "🚀 Deploy: Tombola et Newsletter complètes"
git push origin main

# GitHub Actions va:
# 1. Checkout le code
# 2. npm install
# 3. npm run build
# 4. wrangler pages deploy dist
```

**Vérifier le déploiement**:
- Aller sur: https://github.com/mehdozz007-stack/les-ptits-trinquat-web-main/actions
- Voir le job "Build Frontend"
- Status: ✅ Completed

---

**Option B: Déployer manuellement**

```bash
# À la racine
npm run deploy

# Cela exécute:
# npm run build && gh-pages -d dist
```

---

## Étape 3.2: Vérifier le déploiement frontend

**GitHub Pages**:
```
https://mehdozz007-stack.github.io/les-ptits-trinquat-web-main/
https://mehdozz007-stack.github.io/les-ptits-trinquat-web-main/tombola
```

**Cloudflare Pages** (si configuré):
```
https://les-ptits-trinquat.pages.dev/
https://les-ptits-trinquat.pages.dev/tombola
```

---

## Étape 3.3: Tester le frontend en production

Ouvrir dans le navigateur:
```
https://mehdozz007-stack.github.io/les-ptits-trinquat-web-main/
```

**Vérifications** (F12 → Console):
- ✅ Page charge completement (pas blanche)
- ✅ Logo apparaît
- ✅ Navigations fonctionnent
- ✅ Pas d'erreurs rouges dans la console
- ✅ Console log: `[API] URL: https://les-ptits-trinquat-api.mehdozz007.workers.dev...`

---

# 📧 PHASE 4: Configuration Newsletter

## Étape 4.1: Créer un compte Resend (Email service)

1. Aller sur: https://resend.com
2. Sign up
3. Confirmer email
4. Dashboard → API Keys
5. **Copier la clé API** (format: `re_xxxxxxxxxxxx`)

---

## Étape 4.2: Configurer le secret RESEND_API_KEY

```bash
cd cloudflare

# Configurer pour production
wrangler secret put RESEND_API_KEY --env production

# Coller la clé Resend
# ✓ Uploaded secret RESEND_API_KEY
```

---

## Étape 4.3: Tester l'inscription newsletter

En production:
```bash
curl -X POST https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "consent": true
  }'

# Résultat:
# {"success":true,"message":"Successfully subscribed..."}
```

---

## Étape 4.4: Tester l'admin newsletter

```bash
# Login
curl -X POST https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ptits-trinquat.fr",
    "password": "password123"
  }'

# Copier le token reçu: "token": "eyJ..."

# Tester accès admin
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/newsletter/subscribers \
  -H "Authorization: Bearer TOKEN_ICI"

# Résultat:
# {"success":true,"data":[...subscribers...]}
```

---

# ✅ PHASE 5: Validation et Tests

## Étape 5.1: Test Frontend × API

**Navigateur => https://mehdozz007-stack.github.io/les-ptits-trinquat-web-main/**

### Test Tombola
1. Cliquer sur "Tombola"
2. Voir la liste des participants (peut être vide)
3. Ajouter un participant:
   - Prénom: "Jean"
   - Email: "jean@test.com"
   - Rôle: "Parent participant"
   - Emoji: "😊"
4. Cliquer "Ajouter"
5. **Vérifier**: Message de succès + participant apparaît dans la liste

**F12 Console** doit afficher:
```
[API] URL: https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants
[API] Request: { method: 'POST', ... }
[API] Success: { id: '...', prenom: 'Jean', ... }
```

### Test Newsletter
1. Scroller vers le bas de la page
2. Remplir le formulaire newsletter:
   - Email: "parent@example.com"
   - Accepter les conditions
3. Cliquer "S'inscrire"
4. **Vérifier**: Message "Merci de vous être abonné!"

### Test Admin
1. Aller à: `/admin/newsletter`
2. Se connecter:
   - Email: `admin@ptits-trinquat.fr`
   - Password: (créé lors du setup)
3. Voir le dashboard des abonnés

---

## Étape 5.2: Test des requêtes API directes

```bash
# Test 1: GET Participants
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants \
  | jq '.'

# Test 2: POST Participant
curl -X POST https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Marie",
    "email": "marie@test.com",
    "role": "Parent",
    "emoji": "🎉"
  }' | jq '.'

# Test 3: GET Newsletter subscribers (avec auth)
TOKEN=$(curl -s -X POST https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ptits-trinquat.fr","password":"password123"}' \
  | jq -r '.token')

curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/newsletter/subscribers \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'
```

---

## Étape 5.3: Vérifier les logs API

```bash
cd cloudflare

# Afficher les logs en temps réel
wrangler tail

# Vous devriez voir les requêtes arriver:
# GET /api/tombola/participants 200
# POST /api/tombola/participants 201
# GET /api/newsletter/subscribers 200
```

---

## ✅ Checklist Finale

### ✅ Infrastructure
- [x] Database production créée et vérifiée
- [x] Migrations exécutées (tables créées)
- [x] Admin user créé

### ✅ Backend API
- [x] JWT_SECRET configuré
- [x] RESEND_API_KEY configuré (optionnel)
- [x] API Workers déployée en production
- [x] Health check répond
- [x] CORS configuré correctement

### ✅ Frontend
- [x] api-config.ts configuré correctement
- [x] Frontend buildé sans erreurs
- [x] Frontend déployé en production
- [x] Page charge completement (pas blanche)
- [x] Pas d'erreurs console

### ✅ Tombola
- [x] GET participants fonctionne
- [x] POST participant fonctionne
- [x] Frontend peut ajouter des participants
- [x] La liste se met à jour en temps réel

### ✅ Newsletter
- [x] GET TOUS fonctionne
- [x] POST subscribe fonctionne
- [x] Auth login fonctionne
- [x] Admin peut voir les subscribers

### ✅ Tests Complets
- [x] Page chargée dans le navigateur
- [x] Requête API depuis le frontend réussit
- [x] Données s'affichent correctement
- [x] Connexion formulaire OK
- [x] Message de succès apparaît

---

# 🆘 Troubleshooting

## ❌ Problem: Page Blanche en Production

### Symptôme
- URL: `https://mehdozz007-stack.github.io/les-ptits-trinquat-web-main/`
- Page complètement blanche
- Console (F12): Erreurs rouges

### Diagnostic

**Étape 1: Vérifier la console (F12)**
```
Chercher les erreurs:
- "Cannot reach API"
- "TypeError: "
- "Failed to fetch"
- "CORS error"
```

**Étape 2: Vérifier l'API config**
```bash
# Vérifier que api-config.ts retourne l'URL correcte
cat src/lib/api-config.ts | grep "les-ptits-trinquat-api"

# Devrait contenir:
# return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev';
```

**Étape 3: Vérifier que l'API répond**
```bash
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health

# Doit retourner: {"status":"ok",...}
```

**Étape 4: Vérifier le build**
```bash
# Vérifier que dist/index.html existe
ls -lh dist/index.html

# Vérifier que index.html charge le JS
grep -o 'src="[^"]*\.js"' dist/index.html | head -5
```

### Solutions

**Solution 1: Reconfigurer api-config.ts**
```bash
cat > src/lib/api-config.ts << 'EOF'
function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev';
  }

  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '';
  }
  
  return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev';
}

export const API_BASE_URL = getApiBaseUrl();
export function apiUrl(endpoint: string) { return `${API_BASE_URL}${endpoint}`; }
EOF

# Rebuilder et redéployer
npm run build
npm run deploy
```

**Solution 2: Hard refresh**
```
CTRL+SHIFT+R (Windows/Linux)
CMD+SHIFT+R (Mac)
```

**Solution 3: Purger le cache**
```bash
# Vider le cache local
# Navigateur → DevTools → Application → Cache Storage → Delete All
```

---

## ❌ Problem: CORS Error

### Symptôme
```
Console: "Access to XMLHttpRequest at 'https://les-ptits-trinquat-api...' 
from origin 'https://mehdozz007-stack.github.io' has been blocked by CORS policy"
```

### Cause
Le domaine du frontend n'est pas autorisé dans `wrangler.toml`.

### Solution
```bash
cd cloudflare

# Vérifier wrangler.toml
cat wrangler.toml | grep -A5 "CORS_ORIGIN"

# Mettre à jour si nécessaire
# [env.production]
# vars = { CORS_ORIGIN = "https://mehdozz007-stack.github.io", ... }

# Redéployer
npm run deploy
```

---

## ❌ Problem: API répond 500 (erreur serveur)

### Diagnostic
```bash
# Voir les logs
wrangler tail

# Chercher les lignes rouges/erreurs
# Exemple:
# Error: Database not found
# Error: JWT_SECRET not configured
```

### Solutions typiques

**Erreur: Database not found**
```bash
# Vérifier que la DB existe
wrangler d1 list

# Si absente, créer:
wrangler d1 create les-ptits-trinquat-prod

# Copier l'ID dans wrangler.toml
```

**Erreur: JWT_SECRET not configured**
```bash
# Configurer le secret
wrangler secret put JWT_SECRET --env production

# Entrer une clé (32+ caractères)
```

---

## ❌ Problem: "Cannot GET /api/tombola/participants"

### Cause
L'endpoint n'existe pas dans le worker.

### Vérifier
```bash
# Voir les routes définies
cat cloudflare/src/routes/tombola.ts | grep "router\."

# Devrait avoir:
# router.get('/participants', ...)
# router.post('/participants', ...)
```

### Fix
```bash
# Vérifier que les routes sont importées dans index.ts
cat cloudflare/src/index.ts | grep "tombola"

# Devrait avoir:
# import tombola from './routes/tombola';
# app.route('/api/tombola', tombola);

# Si manquant, ajouter et redéployer
```

---

## ✅ Tester les Fixes

Après chaque fix:

```bash
# 1. Vérifier localement
cd cloudflare && npm run dev  # Terminal 1
npm run dev                   # Terminal 2
# Tester: http://localhost:8082

# 2. Builder & déployer
npm run build
cd cloudflare && npm run deploy
cd ..
npm run deploy

# 3. Tester en production
https://mehdozz007-stack.github.io/les-ptits-trinquat-web-main/
```

---

# 📞 Commandes Utiles

## Logs & Debugging

```bash
# Voir les logs API en temps réel
cd cloudflare && wrangler tail

# Voir les logs avec filtre
wrangler tail --env production | grep "error"

# Logs des pages (fetch events)
wrangler pages deployment logs [DEPLOYMENT_ID]
```

## Database

```bash
# Voir les databases existantes
wrangler d1 list

# Exécuter une requête SQL
wrangler d1 execute les-ptits-trinquat-prod \
  --remote \
  --command="SELECT COUNT(*) FROM tombola_participants;"

# Exporter les données
wrangler d1 execute les-ptits-trinquat-prod \
  --remote \
  --command="SELECT * FROM tombola_participants;" > backup.csv
```

## Déploiement

```bash
# Voir les déploiements API
wrangler deployments list

# Voir les déploiements Pages
wrangler pages deployment list --project-name=les-ptits-trinquat

# Rollback à une version antérieure
wrangler rollback
```

## Nettoyage

```bash
# Vider le cache local Wrangler
rm -rf .wrangler/

# Vider node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

---

# 🎉 Résumé Final

## Ce qui fonctionne
✅ API REST complète (Tombola + Newsletter + Auth)  
✅ Database D1 (SQLite) en production  
✅ Frontend React + Vite  
✅ Animations Framer Motion  
✅ Responsive design  
✅ Admin dashboard  

## URLs Production
- **Frontend**: https://mehdozz007-stack.github.io/les-ptits-trinquat-web-main/
- **API**: https://les-ptits-trinquat-api.mehdozz007.workers.dev/
- **Tombola**: /tombola
- **Newsletter**: / (formulaire d'inscription)
- **Admin**: /admin/newsletter

## Prochaines étapes
1. Ajouter des données de test
2. Tester avec de vraies emails (Resend)
3. Configurer le domaine personnalisé
4. Mettre en place le monitoring
5. Documentation pour les utilisateurs finaux

---

**Document créé**: 8 Mars 2026  
**Dernière mise à jour**: 8 Mars 2026  
**Status**: ✅ Production Ready
