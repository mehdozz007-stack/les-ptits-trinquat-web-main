npm# 🔍 Troubleshooting: NetworkError lors de l'inscription

## ⚠️ Le Problème
```
NetworkError when attempting to fetch resource
```

Cela signifie que le navigateur n'a pas pu communiquer avec l'API.

## ✅ Solutions dans l'ordre

### 1️⃣ Vérifier que l'API est déployée
```bash
# Terminal 1 - Déployer l'API (environnement dev)
cd cloudflare
npm run deploy -- --env=dev
# Vous devriez voir: "✓ Uploaded les-ptits-trinquat-api-dev"
```

**Vérification**: Aller sur https://dash.cloudflare.com et chercher `les-ptits-trinquat-api-dev` dans Workers & Pages

### 2️⃣ Vérifier que la base de données est initialisée
```bash
# Terminal 2 - Initialiser les tables
npx wrangler d1 execute tombola-dev --file=migrations/0001_tombola_schema.sql --remote

# Initialiser les données
npx wrangler d1 execute tombola-dev --file=migrations/0002_seed_admin.sql --remote
```

### 3️⃣ Tester l'API directement
```bash
# Terminal 3 - Tester avec le navigateur (plus fiable que curl)
# Copie/colle dans le navigateur:
https://les-ptits-trinquat-api-dev.mehdozz007.workers.dev/health
https://les-ptits-trinquat-api-dev.mehdozz007.workers.dev/api/tombola/participants
```

**Si DNS ne résout pas** (erreur curl #6):
- Tester la connectivité Internet: `ping 8.8.8.8` (DNS Google)
- Vérifier le DNS local: `nslookup google.com`
- Essayer avec navigateur (Chrome/Firefox) - c'est plus fiable
- Si navigateur marche aussi pas: problème de connectivité/firewall

### 4️⃣ Vérifier les logs du navigateur
1. Ouvrir DevTools: `F12`
2. Aller à l'onglet `Console`
3. Chercher les messages avec 📥 📤 ✅ ❌
4. Noter les URLs exactes et les erreurs

### 5️⃣ Relancer le dev server
```bash
# Arrêter: Ctrl+C
# Redémarrer:
npm run dev
```

### 6️⃣ Vider le cache
- `Ctrl+Shift+Delete` pour ouvrir "Effacer les données de navigation"
- Cocher "Cache" et "Cookies"
- Rafraîchir: `F5`

---

## 🔗 Endpoints importants

- **GET participants**: `https://les-ptits-trinquat-api-dev.mehdozz007.workers.dev/api/tombola/participants`
- **POST participants**: `https://les-ptits-trinquat-api-dev.mehdozz007.workers.dev/api/tombola/participants`
- **Health check**: `https://les-ptits-trinquat-api-dev.mehdozz007.workers.dev/health`

## 📋 Checklist

- [ ] API déployée (`npm run deploy -- --env=dev`)
- [ ] Base de données initialisée (migrations exécutées)
- [ ] Dev server relancé
- [ ] Cache navigateur vidé
- [ ] Console DevTools ouverte (voir les logs)
- [ ] Test GET direct: `curl https://les-ptits-trinquat-api-dev.mehdozz007.workers.dev/api/tombola/participants`

---

## 🆘 Si ça ne marche pas

Regarder dans DevTools Console et chercher:
- Erreur CORS? → Vérifier wrangler.toml
- 404? → L'endpoint n'existe pas
- 500? → Erreur serveur (voir `npm wrangler tail`)
- Timeout? → L'API ne répond pas

