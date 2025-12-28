# 🎁 Base de Données - Quick Start Guide

## 📍 Tu es ici?

Si tu as créé la page Tombola et tu veux utiliser la base de données Prisma, **tu es au bon endroit!**

---

## 🚀 Démarrage en 3 étapes

### 1. Lire la documentation (5-10 min)
```bash
# Ouvre ce fichier EN PREMIER pour naviguer:
src/lib/db/INDEX.md
```

### 2. Comprendre les services (10 min)
```bash
# La doc COMPLÈTE est ici:
src/lib/db/README.md
```

### 3. Copier les exemples (5 min)
```bash
# 6 exemples React prêts à copy/paste:
src/lib/db/USAGE_EXAMPLES.tsx
```

---

## 📚 Ce que tu vas trouver

### Services TypeScript
```typescript
import { parentService, lotService } from "@/lib/db";

// Créer un parent
const parent = await parentService.createParent({
  firstName: "Marie",
  emoji: "😊",
  role: "Parent participant",
  email: "marie@example.com",  // PRIVÉ - jamais affiché!
  classes: "CM1 A"
});

// Lister parents (sans email!)
const parents = await parentService.getAllParents();

// Créer un lot
const lot = await lotService.createLot({
  title: "Tablette tactile",
  description: "Bon état",
  icon: "🎁",
  ownerId: parentId
});

// Réserver un lot
await lotService.reserveLot(lotId, parentId);
```

### Base de Données
- **SQLite** : léger, performant, aucune dépendance externe
- **Prisma ORM** : typage TypeScript fort, migrations simples
- **2 tables** : parents + lots avec relations

---

## ⚡ Les 3 choses les plus importantes

### 1️⃣ Email est PRIVÉ ⚠️
```typescript
// ✅ BON:
const parents = await parentService.getAllParents();
// Retourne: { id, firstName, emoji, role, classes }
// ❌ Email ABSENT pour la sécurité

// ❌ MAUVAIS:
const parent = await parentService.getParentById(id);
return <div>{parent.email}</div>;  // DANGER!
```

### 2️⃣ Contact entre parents (Pattern sécurisé)
```
User A clique "Contacter User B"
  ↓
Frontend appelle API sécurisée
  ↓
Backend récupère email du propriétaire
  ↓
Backend retourne lien mailto: préfabriqué
  ↓
Frontend ouvre lien dans navigateur
  ↓
Email reste INVISIBLE ✅
```

### 3️⃣ Services sont ton point d'accès unique
```typescript
import { parentService, lotService } from "@/lib/db";
// C'est tout ce que tu dois importer!
```

---

## 📖 Structure de la documentation

```
src/lib/db/
├── INDEX.md                  🗺️  COMMENCE PAR CELUI-CI
├── README.md                 📖  Documentation COMPLÈTE (30 min)
├── USAGE_EXAMPLES.tsx        💡  6 exemples React
├── SETUP_GUIDE.ts            🛠️  Commandes Prisma
└── SCHEMA_VERIFICATION.ts    ✅  Schéma technique

Racine:
├── DATABASE_SUMMARY.md       📊  Résumé implémentation
└── DATABASE_ARCHITECTURE.txt 🏗️  Diagramme architecture
```

---

## 🔄 Flux typique

```
1. User remplit formulaire inscription
   ↓
2. parentService.createParent({ firstName, emoji, role, email })
   ↓
3. Parent créé en BD ✅
   ↓
4. Afficher trombinoscope avec getAllParents()
   ↓
5. Parent ajoute un lot
   ↓
6. lotService.createLot({ title, icon, ownerId })
   ↓
7. Lot créé (status: AVAILABLE) ✅
   ↓
8. Autre parent réserve le lot
   ↓
9. lotService.reserveLot(lotId, parentId)
   ↓
10. Lot réservé (status: RESERVED) ✅
```

---

## 💡 Exemples rapides

### Afficher les parents
```typescript
const parents = await parentService.getAllParents();
return (
  <div className="grid grid-cols-3 gap-4">
    {parents.map(p => (
      <Card key={p.id}>
        <div className="text-4xl">{p.emoji}</div>
        <h3>{p.firstName}</h3>
        <p>{p.role}</p>
      </Card>
    ))}
  </div>
);
```

### Créer un parent
```typescript
const newParent = await parentService.createParent({
  firstName: form.firstName,
  emoji: selectedEmoji,
  role: form.role,
  email: form.email,
  classes: form.classes
});
```

### Réserver un lot
```typescript
await lotService.reserveLot(lotId, currentParentId);
// status passe de AVAILABLE à RESERVED
```

---

## 🛠️ Commandes utiles

```bash
# Voir la BD avec interface graphique
npx prisma studio
# → Ouvre http://localhost:5555

# Créer une nouvelle migration (après modifier schema.prisma)
npx prisma migrate dev --name description

# Réinitialiser la BD (dev uniquement)
npx prisma migrate reset

# Vérifier que tout compile
npm run build
```

---

## ⚠️ Pièges à éviter

### ❌ NE PAS exposer l'email
```typescript
// MAUVAIS:
{parent.email}                    // ❌
<a href={`mailto:${parent.email}`}> // ❌

// BON:
API sécurisée qui retourne mailto: link
```

### ❌ NE PAS oublier les validations
```typescript
// MAUVAIS:
await parentService.createParent(userInput);  // ❌ Pas de validation

// BON:
const validation = validateParentData(userInput);
if (!validation.isValid) {
  return { error: validation.errors };
}
await parentService.createParent(userInput);  // ✅
```

### ❌ NE PAS accéder à Prisma directement
```typescript
// MAUVAIS:
import { prisma } from "@/lib/db";  // ❌ Détail d'implémentation
prisma.parent.findMany();           // ❌

// BON:
import { parentService } from "@/lib/db";  // ✅
await parentService.getAllParents();       // ✅
```

---

## 📊 Base de Données - Vue d'ensemble

**2 Tables:**
1. **parents** - Inscription des parents
2. **lots** - Lots proposés pour la tombola

**Relations:**
- 1 Parent propose plusieurs Lots
- 1 Parent peut réserver plusieurs Lots
- 1 Lot appartient à exactement 1 Parent
- 1 Lot peut être réservé par max 1 Parent

**Statuts des lots:**
- 🟢 AVAILABLE - Disponible pour réservation
- 🟡 RESERVED - Réservé par quelqu'un
- 🔴 GIVEN - Remis au gagnant

---

## 🆘 Besoin d'aide?

| Problème | Solution |
|----------|----------|
| "Comment utiliser la BD?" | Lire `src/lib/db/INDEX.md` |
| "Quel service utiliser?" | Lire `src/lib/db/README.md` |
| "Exemples React?" | Consulter `src/lib/db/USAGE_EXAMPLES.tsx` |
| "Email apparaît en UI" | Lire `SETUP_GUIDE.ts` section Sécurité |
| "Comment contacter un parent?" | Voir exemple ContactOwnerButton |
| "Erreur migration Prisma?" | Lire `SETUP_GUIDE.ts` section Troubleshooting |

---

## 🎁 Bonus

Tous les fichiers de documentation incluent :
- ✅ Exemples réels
- ✅ Explications détaillées
- ✅ Patterns de sécurité
- ✅ Commandes Prisma
- ✅ Troubleshooting
- ✅ Prêt pour migration PostgreSQL

---

## 📍 Résumé

```
Base de Données:        ✅ SQLite + Prisma
Services TypeScript:    ✅ 6 services complets
Documentation:          ✅ 5 fichiers détaillés
Exemples React:         ✅ 6 exemples copy/paste
Sécurité Email:         ✅ Implémentée
Build Status:           ✅ passing (✓ built in 9.62s)

Status: 🟢 PRÊT POUR UTILISATION!
```

---

**Pour commencer:** 👉 Ouvre `src/lib/db/INDEX.md`

**Happy coding!** 🎉
