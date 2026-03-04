# 🚀 Guide de Déploiement en Production - Tombola

## ✅ Checklist Pré-Production

### 1️⃣ Configuration Cloudflare D1 (BASE DE DONNÉES)

**CRITIQUE**: Vous DEVEZ créer une database D1 séparée pour la production!

```bash
# Créer la database production
wrangler d1 create les-ptits-trinquat-prod

# Vous recevrez un output avec l'ID, exemple:
# [[d1_databases]]
# binding = "DB"
# database_name = "les-ptits-trinquat-prod"  
# database_id = "abc123def456..." ← COPIER CETTE ID
```

**Mise à jour de wrangler.toml**:
```toml
[[d1_databases]]
binding = "DB"
database_name = "les-ptits-trinquat-prod"
database_id = "VOTRE_ID_ICI"  # ← Remplacer par l'ID reçu
```

---

### 2️⃣ Initialiser la Base de Données Production

```bash
cd cloudflare

# Créer les tables
npx wrangler d1 execute les-ptits-trinquat-prod \
  --file=migrations/0001_tombola_schema.sql

# Vérifier que c'est OK
npx wrangler d1 execute les-ptits-trinquat-prod \
  --command="SELECT COUNT(*) as tables FROM sqlite_master WHERE type='table';"
```

---

### 3️⃣ Configurer les Secrets Production

```bash
cd cloudflare

# JWT_SECRET (minimum 32 caractères)
wrangler secret put JWT_SECRET --env production
# → Entrer une clé secrète longue et sûre

# BCRYPT_ROUNDS (optionnel, défaut: 12)
wrangler secret put BCRYPT_ROUNDS --env production
# → Entrer un nombre entre 10 et 14
```

**⚠️ IMPORTANT**: Conservez ces secrets en sécurité! Vous ne pourrez pas les récupérer après.

---

### 4️⃣ Vérifier la Configuration CORS

Le CORS est maintenant strict en production:
- ✅ Autorisé: `https://les-ptits-trinquat.pages.dev`
- ✅ Autorisé: `https://les-ptits-trinquat-api.mehdozz007.workers.dev`
- ❌ Refusé: Toute autre origine

**Si vous changez de domaine**: Modifier `CORS_ORIGIN` dans `wrangler.toml`

---

### 5️⃣ Builder le Front-End

```bash
# À la racine du projet
npm run build

# Vérifier que le build est OK
ls -la dist/

# Vous devriez voir:
# - index.html
# - assets/
# - robots.txt
# - _redirects
# - _routes.json
```

**✅ Critères de succès**:
- ✓ Pas d'erreurs TypeScript
- ✓ Pas d'avertissements critiques
- ✓ `dist/index.html` existe

---

### 6️⃣ Déployer l'API Production

```bash
cd cloudflare

# Déployer en production (SANS --env=dev)
npm run deploy

# Vous devriez voir:
# ✓ Uploaded les-ptits-trinquat-api
# → https://les-ptits-trinquat-api.mehdozz007.workers.dev
```

**Vérifier le déploiement**:
```bash
# Test du health check
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health

# Vous devriez recevoir:
# {"status":"ok","timestamp":"2024-02-11T..."}
```

---

### 7️⃣ Déployer le Front-End Production

```bash
# À la racine du projet

# Si vous utilisez GitHub Pages:
npm run deploy

# Si vous utilisez Cloudflare Pages:
# → Connecter le repo sur https://dash.cloudflare.com
# → Cloudflare déploiera automatiquement
```

---

### 8️⃣ Tests Post-Déploiement

```bash
# 1. Test de santé de l'API
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health

# 2. Test GET participants (liste publique)
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants \

# 3. Test POST participant (avec données)
curl -X POST https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Test","email":"test@example.com","role":"Parent","emoji":"😊"}'

# 4. Test CORS (depuis le navigateur)
# Ouvrir: https://les-ptits-trinquat.pages.dev/tombola
# Ouvrir DevTools (F12) → Console
# Chercher les messages ✅ ou ❌
```

---

## 📋 Points Critiques à Vérifier

- [ ] Database D1 production créée
- [ ] `database_id` correct dans `wrangler.toml`
- [ ] Migrations exécutées sur la DB production
- [ ] JWT_SECRET configuré (minimum 32 chars)
- [ ] Front-end buildé sans erreurs
- [ ] API déployée en production (`npm run deploy` SANS `--env`)
- [ ] Health check répond
- [ ] GET `/api/tombola/participants` fonctionne
- [ ] POST `/api/tombola/participants` fonctionne
- [ ] CORS fonctionne depuis le navigateur
- [ ] Pas d'erreurs dans DevTools Console
- [ ] Pas d'erreurs dans les logs Cloudflare (`npx wrangler tail`)

---

## 🆘 Troubleshooting Production

### ❌ "Could not resolve host"
- Vérifier la connectivité Internet
- Vérifier que l'API est déployée dans Cloudflare Dashboard

### ❌ CORS Error
- Vérifier que le domaine est autorisé dans `wrangler.toml`
- Vérifier que le CORS middleware le reconnaît

### ❌ Database Error (500)
- Vérifier que la DB est créée: `wrangler d1 list`
- Vérifier que l'ID est correct dans `wrangler.toml`
- Vérifier les logs: `npx wrangler tail --env production`

### ❌ Authentification échoue
- Vérifier que JWT_SECRET est configuré
- Vérifier les logs avec `npx wrangler tail --env production`

---

## 🔒 Sécurité en Production

✅ **Ce qui est en place**:
- CORS strict limité à `https://les-ptits-trinquat.pages.dev`
- Authentification par JWT
- Rate limiting (60 req/min par IP)
- Audit logs pour toutes les actions
- HTTPS obligatoire (Cloudflare)

⚠️ **À faire**:
- Surveiller les logs d'audit régulièrement
- Mettre à jour les dépendances npm
- Renouveler les secrets JWT annuellement
- Activer WAF (Web Application Firewall) dans Cloudflare Dashboard

---

## 📞 Contact / Support

En cas de problème:
1. Vérifier les logs: `npx wrangler tail --env production`
2. Vérifier DevTools Console du navigateur
3. Vérifier le Cloudflare Dashboard
