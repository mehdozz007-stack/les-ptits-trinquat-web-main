# 🧪 Validation Pré-Production - Tombola

## ✅ Validation Complète Avant Déploiement

### 1️⃣ Vérification du Code

```bash
# À la racine du projet

# Lint des fichiers
npm run lint

# TypeScript check (via Vite)
npm run build
```

**✅ Critères de validation**:
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'erreurs ESLint critiques
- [ ] Pas d'avertissements de sécurité

---

### 2️⃣ Vérification de la Build

```bash
# À la racine du projet

# Clean build
rm -rf dist/
npm run build

# Vérifier la taille
ls -lah dist/
du -sh dist/
```

**✅ Critères de validation**:
- [ ] Build réussi (exit code 0)
- [ ] `dist/index.html` existe
- [ ] Taille < 2MB (gzipped)
- [ ] Pas de warnings lors du build

---

### 3️⃣ Vérification de la Configuration

**cloudflare/wrangler.toml**:
```bash
# Vérifier que production est bien configurée
grep -A 3 "^\[\[d1_databases\]\]" cloudflare/wrangler.toml
```

**✅ Critères**:
- [ ] `database_name` = `les-ptits-trinquat-prod`
- [ ] `database_id` est remplacé (pas `REPLACE_WITH_...`)
- [ ] `ENVIRONMENT = "production"`
- [ ] `CORS_ORIGIN = "https://les-ptits-trinquat.pages.dev"`

---

### 4️⃣ Vérification des Secrets

```bash
cd cloudflare

# Vérifier que les secrets sont configurés
wrangler secret list --env production
```

**✅ Vérifier que vous avez**:
- [ ] `JWT_SECRET` (minimum 32 caractères)
- [ ] Optionnel: `BCRYPT_ROUNDS`

---

### 5️⃣ Vérification des Migrations

```bash
cd cloudflare

# Vérifier que les fichiers de migration existent
ls -la migrations/
```

**✅ Vous devriez avoir**:
- [ ] `0001_tombola_schema.sql` ✨ (Principal)
- [ ] `0002_seed_admin.sql` (Admin initial)
- [ ] `0005_unique_email_tombola.sql` (Contrainte email unique)

---

### 6️⃣ Test de Construction (Build Final)

```bash
# À la racine du projet

# Build final
npm run build

# Vérifier qu'on peut servir la build localement
npm run preview

# Tester dans le navigateur: http://localhost:4173
```

**✅ Critères**:
- [ ] Page Accueil charge
- [ ] Navigation fonctionne
- [ ] Page Tombola charge
- [ ] Pas d'erreurs en console (F12)

---

### 7️⃣ Vérification de la Base de Données Production

```bash
cd cloudflare

# Lister les databases
wrangler d1 list

# Vérifier que la DB production existe et montre l'ID correct
```

**✅ Vous devriez voir**:
- [ ] `les-ptits-trinquat-prod` dans la liste

---

### 8️⃣ Checklist de Sécurité

- [ ] **CORS**: Strictement limité à `https://les-ptits-trinquat.pages.dev`
- [ ] **Authentification**: JWT_SECRET configuré
- [ ] **Base de données**: Séparée (prod vs dev)
- [ ] **Secrets**: À part et non versionñés
- [ ] **HTTPS**: Obligatoire (Cloudflare)
- [ ] **Rate limiting**: 60 req/min activé

---

## 🚀 Étapes de Déploiement Final

### Phase 1: Préparation (À faire UNE FOIS)

```bash
cd cloudflare

# 1. Créer la database production
wrangler d1 create les-ptits-trinquat-prod
# → Noter l'ID retourné

# 2. Mettre à jour wrangler.toml avec l'ID reçu
# Éditer: database_id = "VOTRE_ID_ICI"

# 3. Initialiser la DB
npx wrangler d1 execute les-ptits-trinquat-prod \
  --file=migrations/0001_tombola_schema.sql

# 4. Configurer les secrets
wrangler secret put JWT_SECRET --env production
# → Entrer une clé secrète longue (min 32 chars)
```

### Phase 2: Build & Déploiement

```bash
# À la racine du projet

# 1. Build du front
npm run build

# 2. Déployer l'API
cd cloudflare
npm run deploy  # SANS --env pour production

# 3. Déployer le front
cd ..
npm run deploy  # ou via Cloudflare Pages
```

### Phase 3: Validation

```bash
# Tester health check
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health

# Tester les endpoints
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants

# Vérifier dans le navigateur
# https://les-ptits-trinquat.pages.dev/tombola
```

---

## 📝 Configuration pour Production

### Variables d'Environnement Requises

```toml
# wrangler.toml - [vars] section

ENVIRONMENT = "production"
CORS_ORIGIN = "https://les-ptits-trinquat.pages.dev"
SESSION_DURATION = "604800"    # 7 jours
RATE_LIMIT_MAX = "60"          # 60 requêtes
RATE_LIMIT_WINDOW = "60"       # par minute
```

### Secrets Requis

```bash
# À configurer avec wrangler secret put <NAME> --env production

JWT_SECRET       # Minimum 32 caractères, aléatoire et sûr
BCRYPT_ROUNDS    # Optionnel (défaut: 12)
```

---

## 🔍 Monitoring Post-Déploiement

### Logs en Temps Réel

```bash
cd cloudflare
npx wrangler tail --env production
```

Chercher:
- ✅ Requêtes réussies (status 200, 201)
- ❌ Erreurs (status 4xx, 5xx)
- 🔒 Tentatives d'authentification

### Vérifications Quotidiennes

- [ ] Au moins 1 requête à `/health` répond
- [ ] Pas de 500 errors
- [ ] CORS fonctionne (pas de `Access-Control-Allow-Origin` missing)
- [ ] Les participants peuvent s'inscrire

---

## 🆘 Points Critiques à Ne Pas Oublier

⚠️ **ERREUR COURANTE #1**: Utiliser la database `tombola-dev` en production
- ❌ Mauvais: `database_id = "4f519cb2-40f8-433d-9da0-4c250a95b45c"`
- ✅ Bon: Votre database production ID unique

⚠️ **ERREUR COURANTE #2**: CORS trop permissif
- ❌ Mauvais: Permettre tous les `.workers.dev`
- ✅ Bon: Seulement votre domaine spécifique

⚠️ **ERREUR COURANTE #3**: Déployer sans migrations
- ❌ Mauvais: Deployer avant d'exécuter `0001_tombola_schema.sql`
- ✅ Bon: Exécuter les migrations d'abord

⚠️ **ERREUR COURANTE #4**: Oublier JWT_SECRET
- ❌ Mauvais: L'authenticati on échouera
- ✅ Bon: `wrangler secret put JWT_SECRET --env production`

---

## ✨ Après Production

### Première Semaine

- Surveiller les logs pour les erreurs
- Tester manuellement les principales fonctionnalités
- Recueillir les retours utilisateurs

### Maintenance Régulière

- Vérifier les logs audit
- Mettre à jour les dépendances npm (npm audit fix)
- Renouveler JWT_SECRET tous les ans
- Monitorer la taille de la DB

---

## 📞 Aide Rapide

**Si ça ne marche pas en production**:

1. Vérifier les logs: `npx wrangler tail --env production`
2. Vérifier les erreurs du navigateur: F12 → Console
3. Vérifier CORS: Ouvrir Network tab (F12), chercher 'Access-Control'
4. Vérifier la DB: `wrangler d1 list` et `wrangler d1 info les-ptits-trinquat-prod`
5. Redéployer: `cd cloudflare && npm run deploy`

