# Tombola API - Cloudflare Workers + D1

Infrastructure serverless pour la gestion des tombolas et parents.

## 🏗 Architecture

```
workers/
├── src/
│   ├── index.ts              # Worker principal
│   ├── db/
│   │   └── schema.sql        # Schéma D1
│   ├── routes/
│   │   ├── parents.ts        # Endpoints parents
│   │   └── lots.ts           # Endpoints lots
│   ├── services/
│   │   ├── parent.service.ts
│   │   ├── lot.service.ts
│   │   └── auth.service.ts
│   └── types/
│       └── models.ts         # TypeScript types
├── wrangler.toml             # Configuration
└── package.json
```

## 🗄 Base de données

### Tables

**parents**
- `id` (TEXT PRIMARY KEY) - UUID unique
- `first_name` (TEXT) - Prénom
- `email` (TEXT UNIQUE) - Email unique (sécurisé, non exposé publiquement)
- `emoji` (TEXT) - Emoji choisi
- `classes` (TEXT) - Classes des enfants
- `created_at` (TIMESTAMP)

**lots**
- `id` (TEXT PRIMARY KEY)
- `parent_id` (FK → parents) - Propriétaire
- `title` (TEXT) - Titre du lot
- `description` (TEXT) - Description
- `status` (available | reserved | delivered)
- `reserved_by` (FK → parents, nullable)
- `created_at` (TIMESTAMP)

**reservations**
- `id` (PRIMARY KEY)
- `lot_id` (FK)
- `requester_id` (FK)
- `created_at` (TIMESTAMP)

## 🔌 API Endpoints

### Parents

**GET /api/parents**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "first_name": "Alice",
      "emoji": "😊",
      "classes": "CM1-CM2",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**POST /api/parents**
```json
{
  "first_name": "Alice",
  "email": "alice@example.com",
  "emoji": "😊",
  "classes": "CM1-CM2"
}
```

**DELETE /api/parents/:id**
- Requires: `X-Parent-Auth` header
- Cascade délète les lots du parent

### Lots

**GET /api/lots**
Retourne tous les lots disponibles et réservés

**POST /api/lots**
```json
{
  "title": "Tablette",
  "description": "iPad 10 pouces"
}
```
- Requires: `X-Parent-Auth`
- Associe automatiquement au parent courant

**DELETE /api/lots/:id**
- Requires: `X-Parent-Auth`
- Vérifie l'ownership

**POST /api/lots/:id/reserve**
- Requires: `X-Parent-Auth`
- Change le statut à "reserved"
- Enregistre le requester_id

## 🔐 Authentification

Format du token `X-Parent-Auth`:
```typescript
{
  parentId: string;
  email: string;
}
```

Encodé en Base64 dans le header:
```
X-Parent-Auth: eyJwYXJlbnRJZCI6IiIsImVtYWlsIjoiIn0=
```

## 🚀 Déploiement

### Setup initial

```bash
cd workers
npm install
```

### Développement local

```bash
# Base de données locale
wrangler d1 create tombola-dev --local

# Initialiser le schéma
wrangler d1 execute tombola-dev --file=src/db/schema.sql --local

# Lancer le dev server
npm run dev
```

### Production

```bash
# Créer la DB en production
npm run db:create

# Exécuter le schéma
npm run db:execute

# Déployer
npm run deploy
```

## 🔒 Sécurité

✅ **Implémenté:**
- Email unique par parent (DB constraint)
- Soft auth via localStorage
- Ownership validation (Services)
- CORS headers
- Type-safe avec TypeScript strict

## 📊 Contraintes DB

- Aucun lot orphelin (ON DELETE CASCADE)
- Email unique (UNIQUE constraint)
- Statut limité à 3 valeurs (CHECK)

## 🛠 Maintenance

```bash
# Type checking
npm run type-check

# Voir les bases D1
wrangler d1 info tombola

# Exécuter une requête
wrangler d1 execute tombola --command="SELECT * FROM parents"
```
