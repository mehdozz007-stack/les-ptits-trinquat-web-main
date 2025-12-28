# 📚 Base de Données - Documentation Technique

## 🎯 Vue d'ensemble

La base de données SQLite + Prisma ORM gère l'ensemble du système de Trombinoscope et de Tombola pour l'APE "Les P'tits Trinquat".

**Stack Technologique :**
- **SGBD** : SQLite (léger, performant, open-source)
- **ORM** : Prisma 7.2.0 (typage TypeScript fort, migrations simples)
- **Client** : Prisma Client (auto-généré, typé)

---

## 📊 Schéma de base de données

### Table `parents`

Chaque parent s'inscrit lui-même via le formulaire du Trombinoscope.

| Champ | Type | Constraints | Description |
|-------|------|-----------|-------------|
| `id` | STRING | PK, @default(cuid()) | Identifiant unique |
| `firstName` | STRING | NOT NULL | Prénom du parent |
| `emoji` | STRING | NOT NULL | Emoji choisi (😊, 🤗, etc) |
| `role` | STRING | NOT NULL | "Parent participant", "Membre du bureau", etc |
| `classes` | STRING | NULLABLE | Classes des enfants (ex: CM1 A, CM2 B) |
| `email` | STRING | NOT NULL, UNIQUE | Email privé - jamais affiché en UI ⚠️ |
| `createdAt` | DATETIME | NOT NULL, @default(now()) | Date d'inscription |

**Relations:**
- `proposedLots`: 1-∞ (Un parent propose plusieurs lots)
- `reservedLots`: 1-∞ (Un parent réserve plusieurs lots)

---

### Table `lots`

Les lots proposés par les parents pour la tombola.

| Champ | Type | Constraints | Description |
|-------|------|-----------|-------------|
| `id` | STRING | PK, @default(cuid()) | Identifiant unique |
| `title` | STRING | NOT NULL | Nom du lot (ex: "Tablette tactile") |
| `description` | STRING | NULLABLE | Description courte |
| `icon` | STRING | NOT NULL | Emoji du lot (🎁, 📚, 🎮, etc) |
| `status` | ENUM | NOT NULL, @default(AVAILABLE) | AVAILABLE \| RESERVED \| GIVEN |
| `ownerId` | STRING | FK → Parent, NOT NULL | Parent qui propose le lot |
| `reservedById` | STRING | FK → Parent, NULLABLE | Parent qui réserve (null si disponible) |
| `createdAt` | DATETIME | NOT NULL, @default(now()) | Date de création |
| `updatedAt` | DATETIME | NOT NULL, @updatedAt | Dernière modification |

**Relations:**
- `owner`: 1 Parent propose le lot (relation obligatoire)
- `reservedBy`: 1 Parent réserve le lot (relation optionnelle)

**Enum LotStatus:**
```typescript
enum LotStatus {
  AVAILABLE // 🟢 Disponible pour réservation
  RESERVED  // 🟡 Réservé par un autre parent
  GIVEN     // 🔴 Remis au gagnant
}
```

---

## 🛠️ Structure des fichiers

```
src/lib/db/
├── prisma.ts              // Instance singleton Prisma Client
├── parentService.ts       // Fonctions pour gérer les parents
├── lotService.ts          // Fonctions pour gérer les lots
├── utils.ts               // Utilitaires de sécurité & validation
└── index.ts               // Exports centralisés

prisma/
├── schema.prisma          // Définition du schéma
└── migrations/
    └── 20251228134043_init/
        └── migration.sql  // Migration SQLite initiale

.env                       // Configuration (DATABASE_URL)
prisma.config.ts          // Configuration Prisma 7
```

---

## 🔐 Sécurité & Confidentialité

### ⚠️ Règle Critique : L'email est PRIVÉ

**L'email d'un parent ne doit JAMAIS être affiché dans l'UI (React/Frontend).**

#### ✅ Accès sécurisé à l'email :

**Côté Serveur/API uniquement :**
```typescript
import { parentService } from "@/lib/db";

// ✅ AUTORISÉ : Récupérer l'email côté API
const email = await parentService.getParentEmail(parentId);

// ✅ UTILISER POUR : 
// - Générer un lien mailto: sécurisé
// - Envoyer des emails via un service
```

**Côté Frontend :**
```typescript
// ❌ INTERDIT : Exposed email
const parent = await fetch(`/api/parents/${id}`);
console.log(parent.email); // ⚠️ JAMAIS !

// ✅ AUTORISÉ : Contact via endpoint sécurisé
const response = await fetch(`/api/lots/${lotId}/contact-owner`, {
  method: "POST",
});
// L'email est utilisé côté serveur, jamais exposé
```

---

## 📖 API des Services

### Parent Service (`parentService.ts`)

#### `createParent(data)` → Promise<Parent>
Crée un nouveau parent.

```typescript
const parent = await parentService.createParent({
  firstName: "Marie",
  emoji: "😊",
  role: "Parent participant",
  classes: "CM1 A",
  email: "marie@example.com",
});
```

#### `getAllParents()` → Promise<Parent[]>
Récupère tous les parents **SANS l'email** pour affichage en UI.

```typescript
const parents = await parentService.getAllParents();
// Retourne: { id, firstName, emoji, role, classes, createdAt }
```

#### `getParentEmail(parentId)` → Promise<string | null>
Récupère l'email d'un parent (accès privé, serveur uniquement).

```typescript
const email = await parentService.getParentEmail(parentId);
```

#### `getParentById(id)` → Promise<Parent | null>
Récupère un parent complet (avec email).

```typescript
const parent = await parentService.getParentById(parentId);
```

#### `updateParent(id, data)` → Promise<Parent>
Met à jour un parent.

```typescript
await parentService.updateParent(parentId, {
  emoji: "🤗",
  classes: "CM2 B",
});
```

#### `deleteParent(id)` → Promise<Parent>
Supprime un parent et ses lots (cascade).

```typescript
await parentService.deleteParent(parentId);
```

---

### Lot Service (`lotService.ts`)

#### `createLot(data)` → Promise<Lot>
Crée un nouveau lot.

```typescript
const lot = await lotService.createLot({
  title: "Tablette tactile",
  description: "Tablette 10 pouces, bon état",
  icon: "🎁",
  ownerId: parentId,
});
```

#### `getAllLots()` → Promise<Lot[]>
Récupère tous les lots avec infos du propriétaire (email inclus côté backend).

```typescript
const lots = await lotService.getAllLots();
// Structure: { id, title, description, icon, status, owner: { id, firstName, emoji, email }, reservedBy }
```

#### `getAvailableLots()` → Promise<Lot[]>
Récupère uniquement les lots disponibles.

```typescript
const available = await lotService.getAvailableLots();
```

#### `getParentLots(ownerId)` → Promise<Lot[]>
Récupère les lots proposés par un parent.

```typescript
const myLots = await lotService.getParentLots(parentId);
```

#### `getParentReservedLots(reservedById)` → Promise<Lot[]>
Récupère les lots réservés par un parent.

```typescript
const myReservations = await lotService.getParentReservedLots(parentId);
```

#### `reserveLot(lotId, parentId)` → Promise<Lot>
Réserve un lot pour un parent.

```typescript
await lotService.reserveLot(lotId, parentId);
// Change: status → RESERVED, reservedById → parentId
```

#### `markLotAsGiven(lotId)` → Promise<Lot>
Marque un lot comme remis.

```typescript
await lotService.markLotAsGiven(lotId);
// Change: status → GIVEN
```

#### `cancelLotReservation(lotId)` → Promise<Lot>
Annule la réservation d'un lot.

```typescript
await lotService.cancelLotReservation(lotId);
// Change: status → AVAILABLE, reservedById → null
```

#### `updateLot(id, data)` → Promise<Lot>
Met à jour un lot.

```typescript
await lotService.updateLot(lotId, {
  title: "Tablette 10 pouces",
  description: "Bon état, léger usage",
});
```

#### `deleteLot(id)` → Promise<Lot>
Supprime un lot.

```typescript
await lotService.deleteLot(lotId);
```

#### `getLotStats()` → Promise<Stats>
Récupère les statistiques des lots.

```typescript
const stats = await lotService.getLotStats();
// Retourne: { total, available, reserved, given }
```

---

## 🛡️ Utilitaires de Sécurité (`utils.ts`)

#### `validateEmail(email)` → boolean
Valide une adresse email.

```typescript
import { validateEmail } from "@/lib/db/utils";
validateEmail("marie@example.com"); // true
```

#### `validateParentData(data)` → { isValid, errors }
Valide les données d'inscription d'un parent.

```typescript
const validation = validateParentData({
  firstName: "Marie",
  email: "marie@example.com",
  emoji: "😊",
  role: "Parent",
});

if (!validation.isValid) {
  console.log(validation.errors);
}
```

#### `validateLotData(data)` → { isValid, errors }
Valide les données d'un lot.

```typescript
const validation = validateLotData({
  title: "Tablette",
  icon: "🎁",
  ownerId: parentId,
});
```

#### `canParentReserveLot(parentId, lotId)` → { canReserve, reason }
Vérifie si un parent peut réserver un lot.

```typescript
const permission = await canParentReserveLot(parentId, lotId);
if (permission.canReserve) {
  await lotService.reserveLot(lotId, parentId);
}
```

---

## 🚀 Utilisation côté Frontend

### Importer les services

```typescript
import { parentService, lotService } from "@/lib/db";
```

### Exemple: Afficher les parents (sans email!)

```typescript
async function displayParents() {
  // ✅ getAllParents() NE RETOURNE PAS les emails
  const parents = await parentService.getAllParents();
  
  return parents.map(parent => (
    <Card>
      <div>{parent.emoji}</div>
      <h3>{parent.firstName}</h3>
      <p>{parent.role}</p>
    </Card>
  ));
}
```

### Exemple: Contacter un parent (sécurisé)

**Frontend :**
```typescript
async function contactParentOwner(lotId: string) {
  // Appel à un endpoint API sécurisé
  const response = await fetch(`/api/contact-owner`, {
    method: "POST",
    body: JSON.stringify({ lotId }),
  });
  
  const { mailto } = await response.json();
  // Ouvre le client email avec mailto:
  window.location.href = mailto;
}
```

**Backend/API (Node.js ou Serverless) :**
```typescript
import { lotService, parentService } from "@/lib/db";

export async function POST(req: Request) {
  const { lotId } = await req.json();
  
  // Récupérer le lot avec l'email du propriétaire
  const lot = await lotService.getLotDetails(lotId);
  const email = await parentService.getParentEmail(lot.ownerId);
  
  // Créer un lien mailto sécurisé
  const mailto = `mailto:${email}?subject=Lot: ${lot.title}`;
  
  return { mailto }; // L'email reste PRIVÉ
}
```

---

## 📈 Cas d'usage principaux

### 1. Inscription d'un parent

```typescript
import { parentService } from "@/lib/db";
import { validateParentData } from "@/lib/db/utils";

async function registerParent(formData) {
  // Valider les données
  const validation = validateParentData(formData);
  if (!validation.isValid) {
    return { error: validation.errors };
  }
  
  // Créer le parent
  const parent = await parentService.createParent(formData);
  return { parent };
}
```

### 2. Ajouter un lot

```typescript
import { lotService } from "@/lib/db";
import { validateLotData } from "@/lib/db/utils";

async function addLot(formData, parentId) {
  const validation = validateLotData({
    ...formData,
    ownerId: parentId,
  });
  
  if (!validation.isValid) {
    return { error: validation.errors };
  }
  
  const lot = await lotService.createLot({
    ...formData,
    ownerId: parentId,
  });
  
  return { lot };
}
```

### 3. Réserver un lot

```typescript
import { lotService } from "@/lib/db";
import { canParentReserveLot } from "@/lib/db/utils";

async function reserveLot(lotId, parentId) {
  // Vérifier que c'est possible
  const permission = await canParentReserveLot(parentId, lotId);
  
  if (!permission.canReserve) {
    return { error: permission.reason };
  }
  
  // Réserver
  const lot = await lotService.reserveLot(lotId, parentId);
  return { lot };
}
```

---

## 🔧 Migration & Maintenance

### Afficher le schéma actuel

```bash
npx prisma db push
```

### Créer une nouvelle migration

```bash
npx prisma migrate dev --name description_de_la_migration
```

### Voir la BD avec Prisma Studio

```bash
npx prisma studio
```

### Réinitialiser la BD (développement uniquement)

```bash
npx prisma migrate reset
```

---

## ✨ Prochaines étapes

1. **Intégrer la BD au frontend Tombola.tsx** (remplacer localStorage par Prisma)
2. **Créer une API REST** (Next.js API Routes ou serverless functions)
3. **Implémenter l'authentification** (pour le contexte du parent)
4. **Ajouter les emails** (envoi de notifications)
5. **Migrer vers PostgreSQL** si nécessaire (compatible Prisma)

---

## 📞 Support

Pour toute question sur la structure BD ou les services, consulter :
- [Documentation Prisma](https://www.prisma.io/docs/)
- [Schéma complet](./prisma/schema.prisma)
- Services TypeScript : `src/lib/db/`
