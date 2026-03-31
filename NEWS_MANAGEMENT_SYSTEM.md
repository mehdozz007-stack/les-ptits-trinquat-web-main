# Système de Gestion des Actualités - Documentation Complète

## 📋 Aperçu

Un système complet et moderne de gestion des actualités (news) pour le site des Petits Trinquat. Inclut:
- **Interface d'administration** pour créer, modifier, archiver et publier les actualités
- **API RESTful** avec CRUD complet
- **Base de données SQLite3** avec migrations
- **Composants React réutilisables** avec design moderne
- **Gestion des états de publication et d'archivage**

## 🏗️ Architecture

### Backend (Cloudflare Workers + D1 SQLite)

**Fichiers:**
- `cloudflare/migrations/0007_create_news_table.sql` - Schéma de la table news
- `cloudflare/src/routes/news.ts` - Routes API CRUD
- `cloudflare/src/index.ts` - Enregistrement des routes

**Routes API:**
```
GET    /api/news              - Récupérer actualités publiées
GET    /api/news/all          - Récupérer TOUTES les actualités (admin)
GET    /api/news/:id          - Récupérer une actualité spécifique
POST   /api/news              - Créer une actualité
PUT    /api/news/:id          - Modifier une actualité
DELETE /api/news/:id          - Supprimer une actualité
PATCH  /api/news/:id/archive  - Archiver/désarchiver
PATCH  /api/news/:id/publish  - Publier/dépublier
```

### Frontend (React + TypeScript)

**Pages:**
- `src/pages/AdminNews.tsx` - Interface d'administration complète

**Composants:**
- `src/components/news/NewsForm.tsx` - Formulaire de création/modification
- `src/components/news/NewsCard.tsx` - Carte d'affichage d'une actualité
- `src/components/news/NewsList.tsx` - Liste avec filtres et recherche

**Hooks personnalisés:**
- `src/hooks/useNews.ts` - Ensemble complet des hooks React Query

**Routes:**
- `/admin/news` - Page d'administration des actualités

## 📦 Schéma de la Base de Données

```sql
CREATE TABLE news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('evenement', 'annonce', 'presse', 'information', 'document')),
  image_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  event_date TEXT,           -- Pour les événements
  event_time TEXT,           -- Pour les événements
  event_location TEXT,       -- Pour les événements
  is_published INTEGER,      -- 0 = brouillon, 1 = publié
  is_archived INTEGER,       -- 0 = actif, 1 = archivé
  created_by TEXT            -- Référence à user.id
);
```

## 🔌 Utilisation de l'API

### Créer une actualité

```bash
POST /api/news
Content-Type: application/json

{
  "title": "Vide grenier de printemps",
  "content": "Rejoignez-nous pour notre traditionnel vide grenier...",
  "type": "evenement",
  "image_url": "https://example.com/image.jpg",
  "event_date": "2026-04-12",
  "event_time": "10:00",
  "event_location": "Cour de l'école",
  "is_published": true
}
```

### Récupérer les actualités publiées

```bash
GET /api/news
```

Retourne uniquement les actualités publiées et non archivées.

### Archiver une actualité

```bash
PATCH /api/news/{id}/archive
Content-Type: application/json

{
  "is_archived": true
}
```

### Publier/Dépublier

```bash
PATCH /api/news/{id}/publish
Content-Type: application/json

{
  "is_published": false  // Pour dépublier
}
```

## ⚛️ Utilisation des Hooks React

### Récupérer les actualités publiées

```tsx
import { useNews } from '@/hooks/useNews';

export function MyComponent() {
  const { data: news, isLoading, error } = useNews();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur</div>;

  return (
    <div>
      {news?.map(item => (
        <h2 key={item.id}>{item.title}</h2>
      ))}
    </div>
  );
}
```

### Créer une actualité

```tsx
import { useCreateNews } from '@/hooks/useNews';

export function CreateForm() {
  const { mutateAsync, isPending } = useCreateNews();

  const handleSubmit = async (data) => {
    try {
      await mutateAsync(data);
      // Succès affiché par toast
    } catch (error) {
      // Erreur affichée par toast
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ title: '...' });
    }}>
      {/* Champs */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Enregistrement...' : 'Créer'}
      </button>
    </form>
  );
}
```

### Tous les hooks disponibles

```tsx
// Récupérer actualités publiées
const { data, isLoading } = useNews();

// Récupérer actualité spécifique
const { data } = useNewsItem(id);

// Récupérer TOUTES actualités (admin)
const { data } = useAllNews();

// Créer
const { mutateAsync } = useCreateNews();
await createMutation.mutateAsync(data);

// Modifier
const { mutateAsync } = useUpdateNews();
await updateMutation.mutateAsync({ id, data });

// Supprimer
const { mutateAsync } = useDeleteNews();
await deleteMutation.mutateAsync(id);

// Archiver
const { mutateAsync } = useArchiveNews();
await archiveMutation.mutateAsync({ id, is_archived: true });

// Publier
const { mutateAsync } = usePublishNews();
await publishMutation.mutateAsync({ id, is_published: true });
```

## 🎨 Utilisation des Composants

### NewsForm

```tsx
import { NewsForm } from '@/components/news';

export function MyPage() {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <>
      {showForm && (
        <NewsForm 
          onClose={() => setShowForm(false)}
          initialData={editingNews}  // Optionnel pour modifier
        />
      )}
    </>
  );
}
```

### NewsList

```tsx
import { NewsList } from '@/components/news';

export function MyPage() {
  const { data: news } = useNews();
  
  return (
    <NewsList
      news={news}
      isAdmin={userIsAdmin}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onArchive={handleArchive}
      onPublish={handlePublish}
    />
  );
}
```

### NewsCard

```tsx
import { NewsCard } from '@/components/news';

export function MyPage() {
  return news?.map(item => (
    <NewsCard
      key={item.id}
      news={item}
      isAdmin={true}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ));
}
```

## 🔐 Sécurité

**Actuellement:** Pas de vérification d'authentification sur l'API

**À implémenter (bonus):**
```tsx
// Dans news.ts - vérifier le token admin
const verifyAdminToken = (c) => {
  const token = c.req.header('Authorization');
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  // Vérifier le token...
};

// Appliquer sur POST/PUT/DELETE:
news.post('/', verifyAdminToken, async (c) => {
  // ...
});
```

## 🎯 Types de Actualités

- **evenement** - Événement scolaire avec date/heure/lieu
- **annonce** - Annonce générale
- **information** - Information pour les parents
- **presse** - Articles de presse ou communiqués
- **document** - Document à télécharger

Chaque type a une couleur et un emoji associés pour meilleure reconnaissance.

## 📊 Catégorisation Automatique

Les actualités s'affichent automatiquement dans différentes sections:

1. **Actualités** - Publiées, non archivées, non passées
2. **Événements Passés** - Type="evenement", date passée
3. **Archive** - is_archived=1

## 🚀 Déploiement

1. **Migrations DB:**
   ```bash
   # Exécuter l'endpoint init-db
   curl https://your-api.workers.dev/init-db
   ```

2. **Frontend:**
   ```bash
   npm run build
   npm run deploy
   ```

3. **Variables d'environnement:**
   ```
   VITE_API_URL=https://your-api.workers.dev
   ```

## 📝 Exemples d'Actualités

### Événement

```json
{
  "title": "Vide grenier de printemps",
  "content": "Rejoignez-nous pour notre traditionnel vide grenier...",
  "type": "evenement",
  "image_url": "https://...",
  "event_date": "2026-04-12",
  "event_time": "10:00",
  "event_location": "Cour de l'école",
  "is_published": true
}
```

### Annonce

```json
{
  "title": "Fermeture des classes - Pont de mai",
  "content": "Les classes seront fermées du 1er au 3 mai...",
  "type": "annonce",
  "is_published": true
}
```

### Article de Press

```json
{
  "title": "Les P'tits Trinquat à la une du journal local",
  "content": "Notre école a été mise en avant dans le journal...",
  "type": "presse",
  "image_url": "https://...",
  "is_published": true
}
```

## 🐛 Dépannage

**Les actualités n'apparaissent pas?**
- Vérifier `is_published = 1`
- Vérifier `is_archived = 0`
- Vérifier la route `/api/news` en GET

**Erreur lors de création?**
- Vérifier les champs requis (title, content, type)
- Vérifier le format de la date (YYYY-MM-DD)
- Vérifier les CORS dans le backend

**API non accessible?**
- En dev: Vérifier que Cloudflare Workers tourne sur localhost:8787
- En prod: Vérifier VITE_API_URL dans .env.production

## 📈 Évolutions Futures

- [ ] Authentification admin sur l'API
- [ ] Catégories personnalisées
- [ ] Tags/Mots-clés
- [ ] Galerie d'images
- [ ] Commentaires modérés
- [ ] Exportation PDF
- [ ] Analytics (vues/impressions)
- [ ] Programmation de publication
- [ ] Webhooks (newsletter automatique)

## 📞 Support

Pour questions ou bugs, consultez les logs:
- Backend: `wrangler tail logs`
- Frontend: Console du navigateur (F12)
- DB: Vérifier migrations via `/api/news/all`
