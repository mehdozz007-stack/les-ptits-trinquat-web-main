# 🚀 PLAN D'ACTION FINAL - Déploiement Complet

**Date**: 8 Mars 2026  
**Phase 1**: ✅ Complétée  
**Phase 2**: 🔄 En cours (GitHub Actions)  
**Phase 3-5**: ⏳ À venir

---

## 📋 État Actuel

### ✅ Complété (Phase 1)

```
✅ Configuration locale vérifiée
✅ api-config.ts corrigé (port 8082 ajouté)
✅ npm dependencies OK
✅ Frontend buildé (dist/ généré)
✅ Backend API lancé localement
✅ Frontend Vite lancé localement
✅ Commit pushé vers GitHub
✅ GitHub Actions déclenché automatiquement
```

### 🔄 En Cours (Phase 2)

```
🔄 GitHub Actions: Build & Deploy Frontend
   └─ Étape 1: npm install
   └─ Étape 2: npm run build
   └─ Étape 3: wrangler pages deploy dist
   
   Temps estimé: 5-10 minutes
   Status: À vérifier sur https://github.com/mehdozz007/les-ptits-trinquat-web-main/actions
```

### ⏳ À Faire (Phase 3-5)

```
⏳ Phase 3: Test Frontend en Production
   └─ Accéder à https://mehdozz007.github.io/les-ptits-trinquat-web-main/
   └─ Vérifier que la page charge
   └─ Checker la console (F12): doit voir [API] logs

⏳ Phase 4: Test Tombola & Newsletter
   └─ POST participant fonctionne
   └─ Ajouter un lot fonctionne
   └─ Newsletter subscribe responds

⏳ Phase 5: Tests Complets & Monitoring
   └─ Vérifier les logs API (wrangler tail)
   └─ Tester depuis le navigateur en prod
   └─ Vérifier aucune erreur rouge
```

---

## 🎯 TÂCHES PRIORITAIRES - À FAIRE MAINTENANT

### Tâche 1: Vérifier le déploiement GitHub Actions

**URL**: https://github.com/mehdozz007/les-ptits-trinquat-web-main/actions

**Étapes**:
1. Ouvrir le lien ci-dessus
2. Cliquer sur le job "Build Frontend" le plus récent
3. Vérifier le status:
   - 🟢 **Green**: Déploiement réussi ✅
   - 🟡 **Yellow**: En cours de exécution ⏳
   - 🔴 **Red**: Erreur (voir les logs)

**Si 🟢 Green**:
```bash
✅ Le déploiement est terminé
✅ Frontend est en production
✅ Passer à Tâche 2
```

**Si 🔴 Red**:
```bash
❌ Vérifier les logs pour l'erreur
❌ Généralement: Cloudflare credentials
❌ Solution: Vérifier secrets GitHub
   - Settings → Secrets and variables → Actions
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID
```

---

### Tâche 2: Tester le Frontend en Production

**URL de test**: 
```
https://mehdozz007.github.io/les-ptits-trinquat-web-main/
```

**Vérifications** (F12 → Console):
```javascript
✅ Page load: index.html charge sans erreur
✅ [API] URL should show: https://les-ptits-trinquat-api.mehdozz007.workers.dev
✅ Pas d'erreurs rouges dans la console
✅ Logo apparaît
✅ Navigation fonctionne
```

**Si la page est blanche**:
```bash
❌ Vérifier la console F12 pour les erreurs
❌ Erreur commune: "Cannot reach API"
❌ Solution: Vérifier api-config.ts (voir ci-dessous)
```

---

### Tâche 3: Tester la Tombola

**URL**:
```
https://mehdozz007.github.io/les-ptits-trinquat-web-main/tombola
```

**Tester**:
1. Page charge
2. Liste des participants affiche
3. Ajouter un participant:
   ```json
   {
     "prenom": "Test",
     "email": "test@example.com",
     "role": "Parent",
     "emoji": "😊"
   }
   ```
4. Voir le message "✅ Participant ajouté!"
5. La liste se met à jour

**Console (F12)**:
```
[API] POST /api/tombola/participants
[API] Success: { id: "...", prenom: "Test", ... }
```

---

### Tâche 4: Tester la Newsletter

**URL**: https://mehdozz007.github.io/les-ptits-trinquat-web-main/

**Tester**:
1. Scroller jusqu'au formulaire newsletter
2. Entrer un email
3. Cliquer "S'inscrire"
4. Voir: "✅ Merci de vous être abonné!"

**Console (F12)**:
```
[API] POST /api/newsletter/subscribe
[API] Success: { message: "Successfully subscribed..." }
```

---

### Tâche 5: Vérifier les Logs API

```bash
cd cloudflare

# Voir les logs en temps réel (production)
wrangler tail

# Arrêter avec: Ctrl+C
```

**Que chercher**:
```
✅ GET /api/tombola/participants 200
✅ POST /api/tombola/participants 201
✅ POST /api/newsletter/subscribe 201
✅ Pas d'erreurs 500
❌ Si erreurs: Lire le message d'erreur
```

---

## 🔧 DÉPANNAGE RAPIDE

### ❌ Problem 1: Page Blanche en Production

**Diagnostic**:
```bash
# Vérifier F12 Console pour erreurs
# Exemple d'erreur: "TypeError: Cannot reach API"
```

**Cause**: api-config.ts retourne la mauvaise URL

**Fix**:
```typescript
// Vérifier src/lib/api-config.ts
// En production, doit retourner:
return 'https://les-ptits-trinquat-api.mehdozz007.workers.dev';

// EN DEV (localhost), doit retourner:
return ''; // (URL relative, proxiée par Vite)
```

**Commandes**:
```bash
# 1. Vérifier le contenu
cat src/lib/api-config.ts | grep "les-ptits-trinquat-api"

# 2. Si incorrect:
# Éditer le fichier manuellement dans VS Code

# 3. Committer et pusher
git add src/lib/api-config.ts
git commit -m "Fix: Correct API URL in api-config.ts"
git push origin main

# 4. GitHub Actions redéploiera automatiquement
```

---

### ❌ Problem 2: CORS Error

**Erreur console**:
```
"Access to XMLHttpRequest ... blocked by CORS policy"
```

**Cause**: Domaine du frontend n'est pas autorisé dans wrangler.toml

**Fix**:
```bash
# Vérifier wrangler.toml
cat cloudflare/wrangler.toml | grep CORS_ORIGIN

# Doit avoir:
# [env.production]
# vars = { CORS_ORIGIN = "https://mehdozz007.github.io", ... }

# Si incorrect, éditer et redéployer
cd cloudflare
npm run deploy  # Sans --env pour production
```

---

### ❌ Problem 3: GitHub Actions Failed (🔴 Red)

**Vérifier les logs** sur: https://github.com/mehdozz007/les-ptits-trinquat-web-main/actions

**Erreur commune**: 
```
"Error: CLOUDFLARE_API_TOKEN not found"
```

**Fix**:
```bash
# Aller sur GitHub
# Settings → Secrets and variables → Actions

# Vérifier que ces secrets existent:
✅ CLOUDFLARE_API_TOKEN
✅ CLOUDFLARE_ACCOUNT_ID

# S'ils manquent:
# 1. Obtenir les credentials de Cloudflare
# 2. Ajouter les secrets via le dashboard GitHub
# 3. Retrigger le job
```

---

## ✅ VALIDATION FINALE

Quand **TOUT FONCTIONNE**, vous devriez voir:

```
✅ Frontend: https://mehdozz007.github.io/les-ptits-trinquat-web-main/
   - Page charge complètement
   - Pas de contenu blanc ou cassé
   - Logo visible
   - Navigation fonctionne

✅ Tombola: /tombola
   - Liste des participants s'affiche
   - Ajouter un participant fonctionne
   - Message de succès apparaît

✅ Newsletter: /
   - Formulaire d'inscription visible
   - Submit fonctionne
   - Confirmation apparaît

✅ API: https://les-ptits-trinquat-api.mehdozz007.workers.dev
   - Health check: curl <domain>/health
   - Response: {"status":"ok",...}
   - Logs: wrangler tail montre les requêtes

✅ Console F12):
   - [API] logs visibles
   - Pas d'erreurs rouges
   - Pas d'avertissements critiques
```

---

## 📊 RÉSUMÉ TECHNIQUE

### Versions Utilisées

```
Frontend:
- React 19.3.1
- Vite 7.2.7
- Framer Motion 12.23.25
- TypeScript 5.7.2

Backend:
- Cloudflare Workers
- Hono 4.9.x
- D1 SQLite (Cloudflare)
- Node.js compat mode

Database:
- Cloudflare D1 (SQLite)
- Production: les-ptits-trinquat-prod
- Development: tombola-dev

Deployment:
- Frontend: GitHub Pages + Cloudflare Pages
- API: Cloudflare Workers
- CI/CD: GitHub Actions
```

### URLs de Référence

**Production**:
- Frontend: https://mehdozz007.github.io/les-ptits-trinquat-web-main/
- API: https://les-ptits-trinquat-api.mehdozz007.workers.dev/

**Development**:
- Frontend: http://localhost:8082/
- API: http://localhost:8787/

**GitHub**:
- Repo: https://github.com/mehdozz007/les-ptits-trinquat-web-main
- Actions: https://github.com/.../actions
- Branches: main (production), dev (développement)

---

## 🎯 PLAN FUTUR (Après Validation)

Une fois tout validé en production:

1. **Documentation des utilisateurs**
   - Guide Tombola pour les parents
   - Guide Newsletter pour les admins
   - FAQ & troubleshooting

2. **Ajustements & Améliorations**
   - Ajouter des vraies données de test
   - Configurer domaine personnalisé
   - Ajouter le monitoring & alertes

3. **Sécurité & Performance**
   - Audit de sécurité complet
   - Tests de charge
   - Optimisation des assets

4. **Maintenance Continue**
   - Mises à jour npm mensuelles
   - Backup de données hebdomadaires
   - Monitoring 24/7

---

**Document créé**: 8 Mars 2026  
**Prochaine mise à jour**: Après validation en production

**✍️ À faire en priorité**: Tâche 1-5 ci-dessus!
