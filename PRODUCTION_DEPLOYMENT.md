# 🚀 Guide Mise en Production

**Après tests complétés en développement global**

---

## État Actuel

```
Branche:        tombolaProd
API:            ✅ Déployée (dev)
Base de données: ✅ Créée et testée
Liens sociaux:  ✅ Bas-gauche
Sélecteur:      ✅ Bas-gauche coloré
```

---

## Checklist Pré-Production

### ✅ Avant de Merger vers `main`

- [ ] Tous les tests passent localement
- [ ] Pas de warnings console dans le navigateur
- [ ] `wrangler tail` affiche les logs sans erreur
- [ ] Base de données D1 contient des données valides
- [ ] Inscription participant fonctionne
- [ ] Création de lot fonctionne
- [ ] Réservation de lot fonctionne

### ✅ Configuration Production

1. **CORS Origin**
   ```toml
   # Dans cloudflare/wrangler.toml
   CORS_ORIGIN = "https://les-ptits-trinquat.pages.dev"
   ```

2. **Secrets à configurer**
   ```bash
   cd cloudflare
   npx wrangler secret put RESEND_API_KEY
   # Paste clé API Resend
   
   npx wrangler secret put JWT_SECRET
   # Paste secret (min 32 chars)
   ```

3. **Variables env**
   ```toml
   ENVIRONMENT = "production"
   SESSION_DURATION = "604800"
   RATE_LIMIT_MAX = "60"
   ```

---

## Commandes Déploiement

### 1. Tester avant merger
```bash
# Sur branche tombolaProd
cd cloudflare
npm run deploy
```

### 2. Merger vers main
```bash
git checkout main
git pull origin main
git merge tombolaProd
git push origin main
```

### 3. Déployer production
```bash
cd cloudflare
npx wrangler deploy
```

### 4. Vérifier
```bash
# Voir les logs
npx wrangler tail

# Test rapide
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/health
```

---

## Différences Dev vs Prod

| Aspect | Développement | Production |
|--------|---------------|------------|
| **URL API** | Proxy local | `medhozz007.workers.dev` |
| **CORS** | localhost:5173 | pages.dev |
| **ENV** | development | production |
| **Logs** | wrangler tail | Dashboard Cloudflare |
| **Cache** | Désactivé | Activé |

---

## Rollback en Cas de Pb

```bash
# Revenir à la version précédente
git revert HEAD
cd cloudflare
npx wrangler deploy
```

---

**Prêt à passer en prod!** 🎉

