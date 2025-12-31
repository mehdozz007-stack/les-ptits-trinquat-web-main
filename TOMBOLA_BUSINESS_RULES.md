# 🎁 Règles Métier - Système Tombola/Trombinoscope

## Version: 1.0
## Date: 30 Décembre 2025

---

## 📋 Vue d'ensemble

Le système Tombola/Trombinoscope des P'tits Trinquât est régi par des règles métier strictes garantissant:

- ✅ **Cohérence** entre parents et lots
- ✅ **Sécurité** des données (pas d'orphelins)
- ✅ **Confidentialité** des emails (jamais affichés)
- ✅ **Intégrité** des transactions

---

## 1️⃣ INSCRIPTION DES PARENTS (Trombinoscope)

### 1.1 Conditions d'inscription

Un parent doit fournir:

| Champ | Type | Validation | Notes |
|-------|------|-----------|-------|
| **Prénom** | string | 2-50 caractères | Obligatoire |
| **Email** | string | RFC 5322 simplifié | Obligatoire, unique, jamais affichable |
| **Emoji** | string | 1-4 caractères | Obligatoire, élégant & sobre |
| **Rôle** | string | Parent/Bureau/Bénévole | Optionnel, défaut: "Parent participant" |
| **Classe(s)** | string | 0-100 caractères | Optionnel, ex: "CM1 A, CE2 B" |

### 1.2 Validations strictes

```typescript
❌ Rejeté:
- Prénom vide ou < 2 caractères
- Email invalide ou déjà utilisé
- Emoji manquant

✅ Accepté:
- Prénom valide (2-50 chars)
- Email unique et valide
- Emoji valide (4 chars max)
```

### 1.3 Protection des données

```
⚠️ RÈGLE CRITIQUE: L'email n'est JAMAIS affiché publiquement
- Stocké seulement en localStorage/BD
- Accessible uniquement via liens mailto: sécurisés
- Jamais exposé en UI ou console log
```

### 1.4 Suppression d'un parent

```
Lorsqu'un parent est supprimé:

1. Ses données (prénom, emoji, etc.) sont supprimées
2. TOUS ses lots associés sont supprimés EN CASCADE
3. Aucun lot orphelin ne peut exister

Résultat: Intégrité totale des données
```

---

## 2️⃣ AJOUT DES LOTS DE TOMBOLA

### 2.1 Conditions de création

Un lot **NE PEUT ÊTRE CRÉÉ** que si:

```typescript
✅ Le parent est inscrit et existe en BD/localStorage
✅ Le parent a fourni:
   - Titre (3-100 caractères)
   - Description (0-500 caractères, optionnelle)
   - Emoji (1-4 caractères)
```

### 2.2 Données du lot

| Champ | Type | Valeur par défaut | Notes |
|-------|------|------------------|-------|
| **ID** | string | UUID/CUID | Unique |
| **Titre** | string | - | 3-100 chars |
| **Description** | string | "" | Optionnel, 0-500 chars |
| **Emoji** | string | 🎁 | Choix limité |
| **Statut** | enum | `disponible` | Voir section 3 |
| **ownerId** | string | Parent courant | Immuable |
| **createdAt** | date | now() | Immuable |
| **reservedById** | string\|null | null | Voir section 3 |

### 2.3 État initial

```typescript
{
  statut: "disponible",
  reservedById: null,
  createdAt: timestamp
}
```

---

## 3️⃣ RÉSERVATION D'UN LOT

### 3.1 Conditions de réservation

Un parent **PEUT RÉSERVER** un lot si:

```typescript
✅ Le parent est inscrit
✅ Le parent n'est PAS le propriétaire du lot
✅ Le lot a le statut "disponible"
```

### 3.2 Transitions de statut

```
Cycle de vie d'un lot:

disponible ──[Réserver]──> reserved ──[Contact]──> Contact parent
     ↓                           ↓
  [Delete]              [Contact + Delete]
```

Statuts valides:
- `disponible` 🟢 - Peut être réservé
- `reserve` 🟡 - Réservé, attente de contact/remise
- `remis` 🔴 - Lot donné/fermé (futur)

### 3.3 Lors de la réservation

```typescript
À faire:
1. Changer statut → "reserve"
2. Enregistrer reservedById = parent ID
3. Afficher bouton "Contacter le parent"
4. Envoyer mailto: sécurisé vers l'email du propriétaire

⚠️ NE JAMAIS afficher l'email en clair
```

---

## 4️⃣ SÉCURITÉ & COHÉRENCE (Règle Critique)

### 4.1 Pas d'orphelins

```typescript
JAMAIS:
- Un lot sans parentId valide
- Un lot pointant vers un parent supprimé
- Un parent avec lots restants après suppression

TOUJOURS:
- Supprimer les lots EN CASCADE
- Vérifier l'intégrité au chargement
- Nettoyer les orphelins détectés
```

### 4.2 Validation au chargement

```typescript
À chaque démarrage:
1. Charger parents et lots
2. Vérifier: tout lot.parentId existe dans parents
3. Si orphelin détecté:
   - Supprimer le lot
   - Logger l'incident
   - Corriger localStorage
```

### 4.3 Doubles emails

```typescript
❌ Impossible: 2 parents avec même email
✅ Validation AVANT création
✅ Message d'erreur clair
```

---

## 5️⃣ AFFICHAGE & INTERFACE

### 5.1 Sections du Trombinoscope

```
┌─────────────────────────────────────┐
│  Nos parents participants (N)       │
├─────────────────────────────────────┤
│  [Je m'inscris]  [Ajouter un lot]   │
├─────────────────────────────────────┤
│  Parent 1    Parent 2    Parent 3    │  ← Grille
│  (Emoji)     (Emoji)     (Emoji)     │
└─────────────────────────────────────┘
```

### 5.2 Parent courant

```
Après inscription, le parent:

✅ Voit sa carte avec badge "✨ C'est toi!"
✅ Fond vert clair avec border verte
✅ Emoji en bounce animation (text-6xl)
✅ Peut immédiatement ajouter un lot
```

### 5.3 Sections des lots

```
┌───────────────────────────────────────┐
│  ✨ Tes lots (2)                      │  ← Parent courant
├───────────────────────────────────────┤
│  [Lot 1]  [Lot 2]                     │  ← Bleu clair
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│  🎁 Tous les lots (5)                │  ← Autres parents
├───────────────────────────────────────┤
│  [Lot 3]  [Lot 4]  [Lot 5]  ...       │  ← Gris neutre
└───────────────────────────────────────┘
```

---

## 6️⃣ MESSAGES & FEEDBACK

### 6.1 Messages de succès

```
✅ Bienvenue [Prénom]! Tu peux maintenant ajouter un lot.
✅ Lot "[Nom]" ajouté avec succès!
✅ Lot "[Nom]" réservé! Vous pouvez contacter [Prénom].
```

### 6.2 Messages d'erreur

```
⚠️ L'email n'est pas valide
⚠️ Un parent avec cet email est déjà inscrit
⚠️ Le prénom doit contenir entre 2 et 50 caractères
⚠️ Vous ne pouvez pas réserver votre propre lot
⚠️ Ce lot est déjà réservé
⚠️ Vous devez être inscrit pour réserver un lot
```

---

## 7️⃣ EMOJIS SÉLECTIONNÉS (Sobres & Cohérents)

### Parent
```
😊 🤍 🌿 ✨ 🌸 💚 🤗 🌟
```

### Lot
```
🎁 ✨ 📦 🎀 🌟 💝 🎊 🎉
```

### Status
```
🟢 Disponible
🟡 Réservé
🔴 Remis
```

### Action
```
📧 Contacter
🗑️ Supprimer
```

---

## 8️⃣ API DE VALIDATION

### Utilisation

```typescript
import TombolaValidation from "@/lib/tombola-validation";

// Valider inscription parent
const { valid, errors } = TombolaValidation.validateParentRegistration({
  prenom: "Marie",
  email: "marie@example.com",
  emoji: "🌿",
});

// Valider lot
const { valid, errors } = TombolaValidation.validateLotCreation({
  nom: "Tablette 10 pouces",
  description: "Légèrement rayée...",
  emoji: "💝",
});

// Vérifier doublons email
const isDuplicate = TombolaValidation.checkEmailDuplicate(
  "marie@example.com",
  parents
);

// Vérifier orphelins
const { isValid, orphanLots } = TombolaValidation.checkForOrphanLots(
  lots,
  parents
);

// Vérifier réservation valide
const canReserve = TombolaValidation.canReserveLot(
  lot.parentId,  // Propriétaire
  currentParentId // Réserveur
);
```

---

## 9️⃣ MIGRATION FUTURE (Vers Prisma/BD)

### À faire lors de la migration:

```typescript
1. Ajouter constraints en BD:
   - UNIQUE(email)
   - FK(Lot.parentId) → Parent.id
   - ON DELETE CASCADE

2. Implémenter dans lotService.ts:
   - getTotLotsStats()
   - getAvailableLots()
   - getParentLots(parentId)

3. Implémenter dans parentService.ts:
   - Soft delete si historique
   - Validation email avant insert
   - Cleanup orphans job

4. Tests à ajouter:
   - Test suppression cascadée
   - Test double email
   - Test intégrité référentielle
```

---

## 🔒 SÉCURITÉ - LISTE DE VÉRIFICATION

```
✅ Emails stockés seulement localement/BD (jamais UI)
✅ Validation stricte de tous les inputs
✅ Pas d'orphelins possibles (suppression cascadée)
✅ Doublons emails impossibles
✅ Parent ne peut pas réserver son lot
✅ Pas de mutation d'état sans validation
✅ TypeScript strict sur les types
✅ Logs d'incident de nettoyage d'orphelins
```

---

## 📚 Fichiers concernés

```
src/pages/Tombola.tsx          ← Logique principale
src/lib/tombola-validation.ts  ← Validation centralisée
src/lib/db/parentService.ts    ← Service parent (futur Prisma)
src/lib/db/lotService.ts       ← Service lot (futur Prisma)
```

---

**Document de référence pour tout développement futur sur le système Tombola.**
