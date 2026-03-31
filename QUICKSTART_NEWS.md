# 🚀 Guide Démarrage Rapide - Actualités

## Pour les Administrateurs

### Accéder à l'interface d'administration:
1. Ouvrez: `https://votresite.fr/admin/news`
2. Ou en dev: `http://localhost:8082/admin/news`

### Créer une actualité:

1. Cliquez sur **+ Créer une actualité**
2. Remplissez le formulaire:
   - **Titre** (requis)
   - **Type**: Événement, Annonce, Information, etc.
   - **Contenu** (requis)
   - **Image** (optionnel - URL)
   
3. **Si Événement**, ajoutez:
   - Date (YYYY-MM-DD)
   - Heure (HH:MM)
   - Lieu
   
4. Cochez **"Publier immédiatement"** ou laissez décoché pour brouillon
5. Cliquez **Créer**

### Gérer une actualité:

**Sur chaque carte:**
- **Éditer**: Modifiez titre, contenu, dates, etc.
- **Publié/Brouillon**: Toggle la visibilité publique
- **Archiver**: Masquer sans supprimer
- **Supprimer**: Suppression permanente

### Filtrer les actualités:

- **Recherche**: Tapez un mot clé
- **Type**: Filtrez par type (événement, annonce, etc.)
- **Statut** (admin): Publiés, Brouillons, Archivés

---

## Pour les Développeurs

### Installation & Configuration

```bash
# 1. Cloner le repo
git clone <repo>
cd les-ptits-trinquat-web-main

# 2. Installer les dépendances
npm install

# 3. Variables d'environnement
# .env.local (déjà configuré)
VITE_API_URL=http://localhost:8787
```

### Développement Local

```bash
# Terminal 1: Cloudflare Workers
wrangler dev

# Terminal 2: Frontend Vite
npm run dev

# Ouvrir: http://localhost:8082/admin/news
```

### Utiliser le Hook useNews

```typescript
import { useNews, useCreateNews, useUpdateNews } from '@/hooks/useNews';

// Récupérer les actualités publiées
const { data: news, isLoading } = useNews();

// Créer une actualité
const { mutateAsync } = useCreateNews();
await mutateAsync({
  title: 'Mon actualité',
  content: 'Contenu...',
  type: 'annonce',
  is_published: true
});

// Modifier
const updateMutation = useUpdateNews();
await updateMutation.mutateAsync({
  id: 'news_123',
  data: { title: 'Nouveau titre' }
});
```

### Utiliser les Composants

```tsx
import { NewsForm, NewsList, NewsCard } from '@/components/news';

// Formulaire complet
<NewsForm 
  initialData={editingNews}
  onClose={() => setShowForm(false)}
/>

// Liste avec filtres
<NewsList 
  news={allNews}
  isAdmin={true}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

// Afficher une actualité
<NewsCard 
  news={item}
  isAdmin={true}
  onEdit={handleEdit}
/>
```

### Routes API

```bash
# Récupérer actualités publiées
GET /api/news

# Créer
POST /api/news
Body: { title, content, type, is_published, ... }

# Modifier
PUT /api/news/:id

# Supprimer
DELETE /api/news/:id

# Archiver
PATCH /api/news/:id/archive
Body: { is_archived: true }

# Publier
PATCH /api/news/:id/publish
Body: { is_published: true }
```

### Tester l'API

```bash
# Exécuter le script de test
bash test-news-api.sh http://localhost:8787

# Ou utiliser curl individuellement:
curl -X GET http://localhost:8787/api/news
curl -X POST http://localhost:8787/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "content": "Test content",
    "type": "annonce"
  }'
```

---

## Structure des Fichiers

```
src/
  pages/
    AdminNews.tsx              ← Page admin
  components/
    news/
      NewsForm.tsx            ← Formulaire
      NewsCard.tsx            ← Carte
      NewsList.tsx            ← Liste
      index.ts
  hooks/
    useNews.ts                ← Tous les hooks
  App.tsx                     ← Route /admin/news

cloudflare/
  src/routes/
    news.ts                   ← Routes API
  migrations/
    0007_create_news_table.sql
```

---

## Dépannage

### Erreur: "News item not found"
- Vérifier que l'ID existe
- Vérifier la connexion API

### Erreur: "Invalid type"
- Types valides: `evenement`, `annonce`, `presse`, `information`, `document`

### Les actualités n'apparaissent pas?
- Vérifier `is_published = 1`
- Vérifier `is_archived = 0`
- Tester: `GET /api/news/all` pour admin

### Date passée n'archive pas automatiquement?
- C'est normal! L'archivage est manuel
- Les événements passés s'affichent dans une section spéciale

---

## Types d'Actualités

```
🎪 Événement (evenement)
   Champs spéciaux: date, heure, lieu
   
📢 Annonce (annonce)
   Champs simples
   
ℹ️ Information (information)
   Champs simples
   
📰 Presse (presse)
   Article de presse/communiqué
   
📄 Document (document)
   Fichier ou lien document
```

---

## Déploiement

```bash
# 1. Build
npm run build

# 2. Deploy frontend
npm run deploy

# 3. Deploy backend (Wrangler)
cd cloudflare
wrangler deploy

# 4. Init BD (une fois)
curl https://your-api.workers.dev/init-db
```

---

## Points Importants

✅ **Réactivité en temps réel** - Les modifications rafraîchissent instantanément la liste
✅ **Brouillons** - Créez sans publier
✅ **Archive** - Gardez les anciennes actualités
✅ **Images** - Supportées via URL
✅ **Événements** - Date/Heure/Lieu automatiques
✅ **Responsive** - Fonctionne sur mobile

---

## Besoin d'aide?

1. Lire `NEWS_MANAGEMENT_SYSTEM.md` (documentation complète)
2. Lire `IMPLEMENTATION_NEWS_SUMMARY.md` (résumé technique)
3. Vérifier les logs: `wrangler tail logs`
4. Console du navigateur (F12) pour erreurs frontend

---

**Version:** 1.0.0 (31 Mars 2026)
**Status:** ✅ Production Ready
