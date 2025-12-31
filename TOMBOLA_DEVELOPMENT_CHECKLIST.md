# ✅ Tombola Development Checklist

## Avant chaque modification

### Code Review
- [ ] Importer `TombolaValidation` avant modification
- [ ] Vérifier les types TypeScript (pas de `any`)
- [ ] Tester la validation avant sauvegarde
- [ ] Vérifier qu'aucun email n'est exposé
- [ ] Vérifier la suppression cascadée si nécessaire

### Sécurité
- [ ] Email **jamais** affiché en clair en UI
- [ ] Valider les inputs **avant** modification d'état
- [ ] Pas de `localStorage` direct (utiliser `saveLots`/`saveParents`)
- [ ] Vérifier les doublons email
- [ ] Vérifier les parents orphelins

### Tests
- [ ] Tester avec donnée valide
- [ ] Tester avec donnée invalide
- [ ] Tester avec cas limites
- [ ] Vérifier messages d'erreur
- [ ] Vérifier localStorage cohérent

---

## Modification: Ajouter une validation

### 1. Ajouter la règle dans `tombola-validation.ts`

```typescript
export const TombolaValidation = {
  // Nouvelle fonction
  isValidXXX(value: string): boolean {
    return value.length >= 3; // Exemple
  },
};
```

### 2. Ajouter le test dans `tombola-validation.test.ts`

```typescript
describe("XXX validation", () => {
  it("should accept valid XXX", () => {
    expect(TombolaValidation.isValidXXX("valid")).toBe(true);
  });

  it("should reject invalid XXX", () => {
    expect(TombolaValidation.isValidXXX("")).toBe(false);
  });
});
```

### 3. Utiliser dans `Tombola.tsx`

```typescript
const validation = TombolaValidation.isValidXXX(value);
if (!validation) {
  setValidationErrors([{ field: "xxx", message: "..." }]);
  return;
}
```

---

## Modification: Ajouter un nouveau champ parent

### Checklist:
- [ ] Ajouter à l'interface `Parent` dans `Tombola.tsx`
- [ ] Ajouter au form state `parentForm`
- [ ] Ajouter à `handleAddParent()` création
- [ ] Ajouter validation dans `validateParentRegistration()`
- [ ] Ajouter input dans formulaire
- [ ] Ajouter test dans `tombola-validation.test.ts`
- [ ] Vérifier localStorage est mis à jour
- [ ] Tester affichage dans carte parent

**Exemple:** Ajouter champ "Téléphone"

```typescript
// 1. Interface
interface Parent {
  // ...
  phone?: string;  // Optionnel
}

// 2. Form state
const [parentForm, setParentForm] = useState({
  // ...
  phone: "",
});

// 3. Validation
validateParentRegistration(data) {
  // ...
  if (data.phone && !this.isValidPhone(data.phone)) {
    errors.push("Numéro invalide");
  }
}

// 4. Input UI
<Input
  placeholder="06 12 34 56 78"
  value={parentForm.phone}
  onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })}
/>

// 5. Test
it("should accept valid phone", () => {
  expect(TombolaValidation.isValidPhone("0612345678")).toBe(true);
});
```

---

## Modification: Ajouter un nouveau statut de lot

### Statuts actuels:
```typescript
"disponible" | "reserve" | "remis"
```

### Pour en ajouter un (ex: "pending"):

- [ ] Mettre à jour l'interface `Lot` type `statut`
- [ ] Mettre à jour le schéma Prisma (`LotStatus` enum)
- [ ] Créer fonction transition valide:
  ```typescript
  const validTransitions = {
    "disponible": ["reserve", "remis"],
    "reserve": ["disponible", "remis"],
    "remis": [], // Terminal
    "pending": ["disponible"],
  };
  ```
- [ ] Ajouter test transition valide
- [ ] Ajouter badge UI avec emoji
- [ ] Ajouter documentation dans TOMBOLA_BUSINESS_RULES.md

---

## Modification: Supprimer une validation

⚠️ **ATTENTION:** Ne jamais supprimer sans:

- [ ] Audit de pourquoi elle existe
- [ ] Accord équipe (validation métier importante)
- [ ] Régression tests
- [ ] Mise à jour documentation

### Process:

1. Commenter la validation
2. Tester les cas "problématiques"
3. Si ok, documenter le changement
4. Ajouter note dans `TOMBOLA_BUSINESS_RULES.md`

---

## Bug: Email visible en UI

### Steps pour investiguer:

```bash
# 1. Chercher tous les `email` affichés
grep -r "\.email" src/pages/Tombola.tsx
grep -r "parent\.email" src/pages/Tombola.tsx

# 2. Vérifier que seul mailto: accède à email
grep -r "mailto:" src/pages/Tombola.tsx

# 3. Vérifier localStorage n'expose rien
grep -r "JSON.stringify(parents)" src/

# 4. Vérifier console.log ne loggue pas email
grep -r "console\." src/pages/Tombola.tsx
```

### Solution type:

```typescript
// ❌ MAUVAIS
<p>{parent.email}</p>

// ✅ BON
<a href={`mailto:${lot.parentEmail}`}>
  Contacter
</a>

// ✅ BON (sécurisé)
// Email n'existe que dans href, jamais visible
```

---

## Bug: Lot orphelin créé

### Steps pour reproduire:

1. Créer parent "Alice"
2. Créer lot pour Alice
3. Supprimer Alice
4. Vérifier lot "orphelin"

### Devrait être impossible!

Si ça arrive:

```typescript
// 1. Vérifier handleDeleteParent()
const handleDeleteParent = (id: string) => {
  // Doit aussi supprimer ses lots!
  const parentLots = TombolaValidation.getParentLots(id, lots);
  const remainingLots = lots.filter((l) => !parentLots.includes(l.id));
  saveLots(remainingLots); // ← Doit être présent
};

// 2. Vérifier localStorage n'a pas de résidus
localStorage.removeItem("tombola_parents");
localStorage.removeItem("tombola_lots");

// 3. Recharger et tester
```

---

## Migration: localStorage → Prisma

### Pre-migration checklist:

- [ ] Exporter tous les parents/lots JSON
- [ ] Backup localStorage
- [ ] Audit: pas d'orphelins
- [ ] Vérifier intégrité références
- [ ] Script SQL prêt

### Mise à jour lotService.ts:

```typescript
// Avant: localStorage
// Après:
export async function getAllLots() {
  return prisma.lot.findMany({
    include: { owner: { select: { ... } } },
  });
}
```

### Mise à jour parentService.ts:

```typescript
// Ajouter constraint BD:
export async function createParent(data: { email: string }) {
  // email UNIQUE en BD
  return prisma.parent.create({ data });
}
```

### Tests à ajouter:

```typescript
test("deleting parent deletes lots", async () => {
  const parent = await createParent(...);
  const lot = await createLot({ ownerId: parent.id });
  await deleteParent(parent.id);
  expect(await getLot(lot.id)).toBeNull();
});

test("cannot create duplicate email", async () => {
  await createParent({ email: "test@example.com" });
  expect(() =>
    createParent({ email: "test@example.com" })
  ).toThrow("Unique constraint");
});
```

---

## Performance: Si N parents > 100

### Problème:
- Grille devient lente
- Animations lag
- Re-render excessif

### Solutions:

1. **Virtualiser la grille** (React Window)
   ```typescript
   import { FixedSizeGrid } from "react-window";
   ```

2. **Paginer les lots** (ex: 20 par page)
   ```typescript
   const [page, setPage] = useState(1);
   const lotPerPage = 20;
   const paginatedLots = lots.slice(
     (page - 1) * lotPerPage,
     page * lotPerPage
   );
   ```

3. **Débouncer les filtres**
   ```typescript
   const [search, setSearch] = useDebounce("", 300);
   ```

---

## Dépannage Rapide

| Problème | Solution |
|----------|----------|
| Email visible | Vérifier aucune `<p>{email}</p>` ou console.log |
| Lot orphelin | Vérifier handleDeleteParent() supprime les lots |
| Pas de validation | Importer TombolaValidation et utiliser |
| Doublon email | Vérifier checkEmailDuplicate() avant save |
| TypeError parent null | Vérifier parentExists() ou currentParentId |
| localStorage corrompu | Dev tools → Application → Storage → Clear |
| Emoji invalide | Vérifier isValidEmoji() → max 4 chars |

---

## Conventions du code

### Naming:
```typescript
// ✅ Parent/Lot data
const parent: Parent
const lot: Lot
const parentId: string
const lotId: string

// ✅ Handlers
const handleAddParent = () => {}
const handleDeleteLot = () => {}

// ❌ Mauvais
const p: any
const addP = () => {}
const updateState = () => {}
```

### Validation:
```typescript
// ✅ Toujours avant mutation
if (!TombolaValidation.isValidEmail(email)) return;
const newParent = { ... };
saveParents([...parents, newParent]);

// ❌ Jamais après
saveParents([...parents, newParent]);
if (!validate(newParent)) removeParent();
```

### Erreurs:
```typescript
// ✅ Typage des erreurs
const validationErrors: ValidationError[] = [];
setValidationErrors([{ field: "email", message: "..." }]);

// ❌ String simple
setError("something went wrong");
```

---

## Documentation à tenir à jour

Quand vous modifiez le système, mettez à jour:

- [ ] `TOMBOLA_BUSINESS_RULES.md` (règles métier)
- [ ] `AUDIT_SECURITY_REPORT.md` (sécurité)
- [ ] `tombola-validation.test.ts` (tests)
- [ ] Commentaires JSDoc dans le code
- [ ] Ce fichier (checklist)

---

**Dernière mise à jour:** 30 Décembre 2025  
**Mainteneur:** Équipe APE P'tits Trinquât
