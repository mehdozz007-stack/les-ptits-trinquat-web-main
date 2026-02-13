# 🚀 Déploiement Production - Checklist Étape par Étape

**Durée estimée**: 30 minutes | **Risque**: Très faible | **Rollback**: Possible

---

## 📌 AVANT DE COMMENCER

- [ ] Lire [PRODUCTION_READY.md](PRODUCTION_READY.md)
- [ ] Avoir accès Cloudflare Dashboard
- [ ] Terminal ouvert dans le répertoire du projet
- [ ] Connexion Internet stable
- [ ] Pas de modifications non committées en Git

```bash
# Vérifier l'état Git
git status
```

---

## ⚙️ ÉTAPE 1: CRÉER LA DATABASE PRODUCTION (5 min)

**Lieu**: Terminal au répertoire racine

```bash
cd cloudflare

# Créer la database
wrangler d1 create les-ptits-trinquat-prod
```

**Vous recevrez**:
```
✓ Creating database  les-ptits-trinquat-prod on account xxxxxxxx
✓ Created database les-ptits-trinquat-prod with ID xxxxx
✓ Created tables

[[d1_databases]]
binding = "DB"
database_name = "les-ptits-trinquat-prod"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  ← COPIER CETTE LIGNE
```

**Action**: 
- [ ] Copier le `database_id` (sans les guillemets)
- [ ] Exemple: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## 📝 ÉTAPE 2: METTRE À JOUR WRANGLER.TOML (2 min)

**Fichier**: `cloudflare/wrangler.toml`

**Avant**:
```toml
[[d1_databases]]
binding = "DB"
database_name = "les-ptits-trinquat-prod"
database_id = "REPLACE_WITH_PRODUCTION_DATABASE_ID"  ❌
```

**Après**:
```toml
[[d1_databases]]
binding = "DB"
database_name = "les-ptits-trinquat-prod"
database_id = "YOUR_COPIED_ID_HERE"  ✅
```

**Action**:
- [ ] Ouvrir VS Code (si ce n'est pas fait)
- [ ] Fichier: `cloudflare/wrangler.toml` 
- [ ] Ligne ~17: Remplacer `REPLACE_WITH_PRODUCTION_DATABASE_ID`
- [ ] Par votre ID copié
- [ ] Sauvegarder: `Ctrl+S`

---

## 🗄️ ÉTAPE 3: INITIALISER LA DATABASE (3 min)

**Lieu**: Terminal `cloudflare/`

```bash
# Vérifier qu'on est dans le bon répertoire
pwd  # Devrait afficher: .../cloudflare

# Exécuter la migration principale
npx wrangler d1 execute les-ptits-trinquat-prod --remote --file=migrations/0013_reset_and_add_admin_mehdi.sql

# Vous devriez voir:
# [✓] Executed 1234 number of commands
```

**Vérification**:
```bash
# Vérifier que les tables existent
npx wrangler d1 execute les-ptits-trinquat-prod \
  --command="SELECT COUNT(*) as tables FROM sqlite_master WHERE type='table';"

# Vous devriez voir: tables = 7
```

**Action**:
- [ ] Exécuter les commandes ci-dessus
- [ ] Vérifier que COUNT(*) = 8 (8 tables créées)

---

## 🔐 ÉTAPE 4: CONFIGURER JWT_SECRET (3 min)

**Lieu**: Terminal `cloudflare/`

```bash
# Générer une clé secrète sûre (si vous n'en avez pas)
# Option 1: macOS/Linux
openssl rand -base64 32

# Option 2: Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | % {[char](Get-Random -Min 33 -Max 127))} | Join-String)))

# COPIER LA CLÉE GÉNÉRÉE
```

**Configurer le secret**:
```bash
# À la racine du projet
cd ..
cd cloudflare

# Configurer le secret
wrangler secret put JWT_SECRET --env production

# Il vous demande d'entrer la clé:
# ✓ Enter the secret text:
# [Coller votre clé ici et appuyer Entrée]

# Vous devriez voir:
# ✓ Uploaded secret JWT_SECRET
```

**Action**:
- [ ] Générer ou avoir une clé secrète (min 32 caractères)
- [ ] `wrangler secret put JWT_SECRET --env production`
- [ ] Coller la clé et appuyer Entrée
- [ ] Vérifier: "Uploaded secret JWT_SECRET"

---

## 🏗️ ÉTAPE 5: BUILD DU PROJET (5 min)

**Lieu**: Terminal à la racine

```bash
# Retourner à la racine
cd /c/workspaceMZ/les-ptits-trinquat-web-main

# Builder le projet
npm run build

# Vous devriez voir de nombreuses lignes et à la fin:
# ✓ 2184 modules transformed.
# dist/index.html     3.18 kB │ gzip: 1.14 kB
```

**Vérification**:
```bash
# Vérifier que le build a réussi
ls -la dist/index.html

# Vérifier la taille
du -sh dist/
```

**Action**:
- [ ] `npm run build`
- [ ] Attendre la fin (sans erreurs)
- [ ] Vérifier que `dist/index.html` existe

---

## 🚀 ÉTAPE 6: DÉPLOYER L'API (3 min)

**Lieu**: Terminal dans `cloudflare/`

```bash
# S'assurer qu'on est dans cloudflare/
cd cloudflare

# IMPORTANT: SANS --env=dev pour production!
npm run deploy
npx wrangler deploy --env=""  # Empty string = top-level
# Vous devriez voir:
# ✓ Uploaded les-ptits-trinquat-api
# → https://les-ptits-trinquat-api.mehdozz007.workers.dev
```

**Vérification du déploiement**:
```bash
# Attendre 30 secondes après le déploiement
# Puis tester:
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health

# Vous devriez voir:
# {"status":"ok","timestamp":"2024-02-11T..."}
```

**Action**:
- [ ] `npm run deploy` (SANS `--env`)
- [ ] Attendre "Uploaded les-ptits-trinquat-api"
- [ ] Tester le health check
- [ ] Vérifier la réponse JSON

---

## 🌐 ÉTAPE 7: DÉPLOYER LE FRONT-END (5 min)

**Lieu**: Terminal à la racine

```bash
# Retourner à la racine
cd /c/workspaceMZ/les-ptits-trinquat-web-main

# Vérifier que dist/ existe
ls -la dist/index.html

# Déployer via GitHub Pages
npm run deploy

# Vous devriez voir:
# > gh-pages -d dist
# Published to https://mehdozz007.github.io/les-ptits-trinquat-web-main
```

**Alternative: Cloudflare Pages**:
- Aller sur https://dash.cloudflare.com/
- Workers & Pages → Create → Connect to Git
- Sélectionner le repo
- Cloudflare déploiera automatiquement

**Action**:
- [ ] `npm run deploy`
- [ ] Attendre le déploiement
- [ ] Vérifier l'URL

---

## ✅ ÉTAPE 8: VALIDATION FINALE (5 min)

### Test 1: Health Check

```bash
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health
```

**Réponse attendue**:
```json
{"status":"ok","timestamp":"2024-02-11T12:34:56Z"}
```

**Action**: 
- [ ] Tester et vérifier la réponse

### Test 2: GET Participants

```bash
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants
```

**Réponse attendue**:
```json
{"success":true,"data":[]}
```

**Action**:
- [ ] Tester et vérifier la réponse

### Test 3: Dans le Navigateur

**URL**: https://les-ptits-trinquat.pages.dev/tombola

**Actions à tester**:
- [ ] La page charge
- [ ] Pas d'erreur en F12 → Console
- [ ] Cliquer sur "Ajouter un participant"
- [ ] Remplir le formulaire
- [ ] Soumettre (Vérifier F12 → Network)
- [ ] La liste se met à jour
- [ ] La participant apparaît dans la liste

### Test 4: Vérifier les Logs

```bash
cd cloudflare

# Voir les logs en temps réel
npx wrangler tail --env production

# Dans une autre fenêtre, déclenchez des requêtes:
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/tombola/participants
```

**Action**:
- [ ] Vérifier qu'il n'y a pas d'erreurs (5xx)
- [ ] Vérifier les status 200, 201

---

## 📋 CHECKLIST FINALE

### Infrastructure ✅
- [ ] Database production créée
- [ ] Database ID dans wrangler.toml
- [ ] Migrations exécutées
- [ ] 7 tables créées

### Secrets 🔐
- [ ] JWT_SECRET configuré

### Build 🏗️
- [ ] npm run build réussi
- [ ] dist/index.html existe
- [ ] Pas d'erreurs TypeScript

### Déploiement 🚀
- [ ] API déployée (`npm run deploy`)
- [ ] Front-end déployé
- [ ] URLs fonctionnent

### Validation ✨
- [ ] Health check répond
- [ ] GET /api/tombola/participants répond
- [ ] Tombola page charge dans le navigateur
- [ ] Ajouter participant fonctionne
- [ ] Pas d'erreurs en console (F12)
- [ ] Pas d'erreurs dans wrangler tail

---

## 🎉 C'EST FAIT!

Si tous les points sont cochés, votre application est **EN PRODUCTION** et **FONCTIONNELLE** ✨

### Prochaines étapes:

1. **Surveiller les logs**:
   ```bash
   npx wrangler tail --env production
   ```

2. **Communiquer l'URL** aux participants:
   - `https://les-ptits-trinquat.pages.dev/tombola`

3. **Tester en production** avec de vraies données

4. **Documenter** (notes, IDs, dates, etc.)

---

## 🆘 Si Quelque Chose Ne Fonctionne Pas

### Erreur: "Could not resolve host"
- Vérifier la connectivité Internet
- Attendre 5 minutes (DNS peut prendre du temps)
- Vérifier dans Cloudflare Dashboard que le worker est déployé

### Erreur: "Database not found"
- Vérifier l'ID dans wrangler.toml
- La database a-t-elle été créée? `wrangler d1 list`

### Erreur: CORS issue
- F12 → Network → Chercher "Access-Control-Allow-Origin"
- Vérifier que `CORS_ORIGIN` est correct dans wrangler.toml

### Erreur: API retourne 500
- Regarder les logs: `npx wrangler tail --env production`
- Vérifier JWT_SECRET: `wrangler secret list --env production`

### Erreur: Page blanche
- F12 → Console → Chercher les erreurs
- Vérifier que l'API URL est correcte dans le navigateur

---

## 📞 Questions Rapides?

**Voir aussi**:
- [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) - Guide complet
- [VALIDATION_PRODUCTION.md](VALIDATION_PRODUCTION.md) - Validation détaillée
- [TROUBLESHOOTING_NETWORK_ERROR.md](TROUBLESHOOTING_NETWORK_ERROR.md) - Diagnostic de problèmes

---

**Status**: ✅ Prêt pour la production  
**Dernière mise à jour**: 11 Février 2026  
**Responsable**: Mehdi

