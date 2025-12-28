"""
🗂️ GUIDE DE NAVIGATION - Base de Données Prisma pour APE Tombola
===================================================================

Tu trouveras ci-dessous un guide complet pour naviguer dans la structure
de la base de données et ses documentations.
"""

# 📚 STRUCTURE DES FICHIERS

## /src/lib/db/ - Cœur de la base de données

| Fichier | Type | Purpose | Audience |
|---------|------|---------|----------|
| `prisma.ts` | ⚙️ Config | Singleton Prisma Client | Devs (lire une fois) |
| `parentService.ts` | 📝 API | CRUD pour parents | Devs (utiliser souvent) |
| `lotService.ts` | 📝 API | CRUD + réservations lots | Devs (utiliser souvent) |
| `utils.ts` | 🔐 Security | Validation + sécurité email | Devs (utiliser souvent) |
| `index.ts` | 📦 Exports | Point d'entrée centralisé | Devs (importer depuis ici) |
| `README.md` | 📖 Docs | Documentation COMPLÈTE | Lire en entier |
| `USAGE_EXAMPLES.tsx` | 💡 Examples | 6 exemples React réels | Copier/coller dans Tombola.tsx |
| `SETUP_GUIDE.ts` | 🛠️ Setup | Checklist + commandes | Consul en cas de besoin |
| `SCHEMA_VERIFICATION.ts` | ✅ Verify | Schéma + intégrité données | Référence technique |

## /prisma/ - Configuration Prisma

| Fichier | Purpose |
|---------|---------|
| `schema.prisma` | 🎯 Définition du schéma (tables, relations, enums) |
| `dev.db` | 💾 Base de données SQLite (créée auto) |
| `migrations/` | 📜 Historique des modifications BD |

---

# 🚀 PAR OÙ COMMENCER?

## Je suis développeur et je veux utiliser la BD

### Option 1: Lecture rapide (5 min)
```
1. Lire src/lib/db/README.md (section "Utilisation côté Frontend")
2. Copier un exemple de src/lib/db/USAGE_EXAMPLES.tsx
3. Adapté dans ton composant React
```

### Option 2: Comprendre complètement (30 min)
```
1. Lire src/lib/db/README.md (tout)
2. Étudier src/lib/db/USAGE_EXAMPLES.tsx (tous les exemples)
3. Consulter src/lib/db/SCHEMA_VERIFICATION.ts (si besoin de détails)
```

### Option 3: Débugger un problème (5-10 min)
```
1. Consulter src/lib/db/SETUP_GUIDE.ts (section "TROUBLESHOOTING")
2. Exécuter une commande pour voir la BD: npx prisma studio
3. Vérifier les données et les relations
```

---

# 📖 CONTENU DE LA DOCUMENTATION

## 📖 README.md (COMPLÈTE - À LIRE!)

**Sections:**
1. **Vue d'ensemble** - Stack technologique
2. **Schéma de base de données** - Structure tables Parent + Lot
3. **Structure des fichiers** - Organisation du code
4. **Sécurité & Confidentialité** - Email is PRIVÉ ⚠️
5. **API des Services** - Référence complète de parentService et lotService
6. **Utilitaires de Sécurité** - Validation et contrôle d'accès
7. **Utilisation côté Frontend** - Comment importer et utiliser
8. **Cas d'usage principaux** - 3 scénarios réels
9. **Migration & Maintenance** - Commandes Prisma

👉 **À lire en entier pour comprendre le système!**

---

## 💡 USAGE_EXAMPLES.tsx (COPY/PASTE READY!)

**6 exemples pratiques avec React:**

1. **TromboscopeExample** - Afficher liste parents sans email
2. **RegisterParentExample** - Formulaire d'inscription
3. **AvailableLotsExample** - Afficher lots disponibles
4. **CreateLotExample** - Formulaire ajouter un lot
5. **reserveThisLot()** - Réserver un lot avec validations
6. **ContactOwnerButton** - Contacter le propriétaire (sécurisé!)
+ LotStatsExample - Afficher statistiques

✅ **À copier/coller directement dans Tombola.tsx!**

---

## 🛠️ SETUP_GUIDE.ts (RÉFÉRENCE)

**Sections:**
1. ✅ Checklist - Vérifier que tout est ok
2. 🛠️ Commandes utiles - All Prisma commands
3. 🔐 Sécurité - Email privacy rules
4. 📚 Structure fichiers - Tree view
5. 🚀 Intégration Tombola.tsx - Étapes précises
6. 📊 Modèle de données - Tables + relations
7. 🔗 Migration vers PostgreSQL - Pour production
8. 🐛 Troubleshooting - Solutions courantes

✅ **À consulter en cas de problème!**

---

## ✅ SCHEMA_VERIFICATION.ts (TECHNIQUE)

**Sections:**
1. Schéma complet SQL - Copy de migration.sql
2. Relations & Intégrité - Contraintes FK et index
3. Énumération des valeurs - LotStatus enum, roles, etc
4. Exemples de données - INSERT statements
5. Vérification - Commandes pour voir la BD
6. Performance - Indexes et complexité
7. Audit - Colonnes createdAt/updatedAt
8. Sécurité email - Redondant mais important!
9. Migration PostgreSQL - Pour production
10. Checklist vérification - ✅ tout est bon?

✅ **À consulter pour vérifications techniques!**

---

# 🔑 CONCEPTS CLÉS À RETENIR

## 1️⃣ Email est PRIVÉ ⚠️

```typescript
// ❌ JAMAIS:
const parent = await parentService.getParentById(id);
return <div>{parent.email}</div>;

// ✅ TOUJOURS:
const parents = await parentService.getAllParents();
// getAllParents() exclut l'email

// ✅ CONTACT SÉCURISÉ:
const email = await parentService.getParentEmail(parentId);  // Côté serveur
// Utiliser pour mailto: ou API backend uniquement
```

## 2️⃣ Services sont les points d'accès uniques

```typescript
import { parentService, lotService } from "@/lib/db";

// Créer
const parent = await parentService.createParent({...});
const lot = await lotService.createLot({...});

// Lister
const parents = await parentService.getAllParents();
const lots = await lotService.getAllLots();

// Mettre à jour
await parentService.updateParent(id, {...});
await lotService.reserveLot(lotId, parentId);

// Supprimer
await parentService.deleteParent(id);
await lotService.deleteLot(id);
```

## 3️⃣ Lot peut avoir 3 statuts

```typescript
enum LotStatus {
  AVAILABLE  // 🟢 Dispo pour réservation
  RESERVED   // 🟡 Réservé par quelqu'un
  GIVEN      // 🔴 Remis au gagnant
}
```

## 4️⃣ Relations 1-N entre Parent et Lot

```
Un Parent peut proposer PLUSIEURS Lots (1-∞)
Un Parent peut réserver PLUSIEURS Lots (1-∞)
Un Lot appartient à exactement 1 Parent (ownerId FK)
Un Lot peut être réservé par AU MAXIMUM 1 Parent (reservedById FK)
```

---

# 🔄 FLUX TYPIQUE D'UTILISATION

## 1. Inscription Parent

```typescript
// Formulaire → Validation → Créer en BD
const newParent = await parentService.createParent({
  firstName: "Marie",
  emoji: "😊",
  role: "Parent participant",
  classes: "CM1 A",
  email: "marie@example.com",  // Privé!
});
```

## 2. Afficher Trombinoscope

```typescript
// Charger parents → Afficher grille (sans email!)
const parents = await parentService.getAllParents();
// { id, firstName, emoji, role, classes, createdAt } - pas d'email
```

## 3. Créer un Lot

```typescript
// Parent connecté ajoute un lot
const newLot = await lotService.createLot({
  title: "Tablette tactile",
  description: "Bon état",
  icon: "🎁",
  ownerId: parentConnectéId,  // De la session
});
```

## 4. Réserver un Lot

```typescript
// Vérifier que c'est possible
const permission = await canParentReserveLot(parentId, lotId);

// Réserver
if (permission.canReserve) {
  await lotService.reserveLot(lotId, parentId);
}
```

## 5. Contacter le Propriétaire

```typescript
// Front: appel API sécurisé
const response = await fetch("/api/lots/contact-owner", {
  method: "POST",
  body: JSON.stringify({ lotId }),
});
const { mailto } = await response.json();
window.location.href = mailto;  // Ouvre client email

// Backend (Node/API):
const email = await parentService.getParentEmail(lot.ownerId);
const mailto = `mailto:${email}?subject=Lot: ${lot.title}`;
return { mailto };  // Email reste PRIVÉ
```

---

# 🎯 CHECKLIST AVANT COMMENCER

- [ ] Lire `README.md` (complet)
- [ ] Copier un exemple de `USAGE_EXAMPLES.tsx`
- [ ] Tester que `npm run build` fonctionne
- [ ] Ouvrir `npx prisma studio` pour voir la BD
- [ ] Comprendre que email est PRIVÉ!
- [ ] Commencer à intégrer dans `Tombola.tsx`

---

# 📞 BESOIN D'AIDE?

| Problème | Où chercher |
|----------|-------------|
| "Comment utiliser parentService?" | USAGE_EXAMPLES.tsx + README.md |
| "Email apparaît en UI!" | SETUP_GUIDE.ts section Sécurité |
| "La migration a échoué" | SETUP_GUIDE.ts section Troubleshooting |
| "Où est la structure de la BD?" | SCHEMA_VERIFICATION.ts |
| "Comment contacter un parent?" | USAGE_EXAMPLES.tsx ContactOwnerButton |
| "Je veux voir la BD graphiquement" | Exécuter: npx prisma studio |

---

# 🚀 PROCHAINES ÉTAPES

1. ✅ BD créée
2. ✅ Services TypeScript complets
3. ✅ Documentation complète
4. ⏳ **Intégrer dans Tombola.tsx** (remplacer localStorage)
5. ⏳ Créer API REST sécurisée (pour les emails)
6. ⏳ Ajouter authentification (savoir qui est connecté)
7. ⏳ Merger vers main + déployer

---

**Happy coding! 🎉**

Pour toute question, consulter les fichiers de doc dans `/src/lib/db/`
