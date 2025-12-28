/**
 * SETUP GUIDE - Configuration de la base de données Prisma
 * 
 * Ce fichier liste tous les outils et commandes pour gérer la BD
 */

// ============================================================================
// 📋 CHECKLIST : Vérifier que tout est bien configuré
// ============================================================================

/*
✅ INSTALLATION
  - [ ] npm install @prisma/client prisma  (déjà fait)
  - [ ] .env contient: DATABASE_URL="file:./dev.db"
  - [ ] prisma.config.ts configuré pour SQLite
  - [ ] prisma/schema.prisma avec modèles Parent et Lot
  - [ ] npm run build: ✓ built in 9.61s

✅ BASE DE DONNÉES
  - [ ] prisma/dev.db créée
  - [ ] Tables: parents, lots
  - [ ] Relations: Parent 1-∞ Lot
  - [ ] Enum: LotStatus (AVAILABLE, RESERVED, GIVEN)
  - [ ] Indexes sur ownerId, reservedById, status

✅ SERVICES TYPESCRIPT
  - [ ] src/lib/db/prisma.ts (singleton instance)
  - [ ] src/lib/db/parentService.ts (CRUD parents)
  - [ ] src/lib/db/lotService.ts (CRUD lots + réservations)
  - [ ] src/lib/db/utils.ts (sécurité + validation)
  - [ ] src/lib/db/index.ts (exports centralisés)

✅ DOCUMENTATION
  - [ ] src/lib/db/README.md (doc complète)
  - [ ] src/lib/db/USAGE_EXAMPLES.tsx (exemples React)
*/

// ============================================================================
// 🛠️ COMMANDES UTILES
// ============================================================================

/*
1. VOIR LA BASE DE DONNÉES EN DIRECT (GUI Prisma Studio)
   $ npx prisma studio
   → Ouvre http://localhost:5555
   → Interface graphique pour ajouter/modifier/supprimer des données

2. CRÉER UNE NOUVELLE MIGRATION (après modifier schema.prisma)
   $ npx prisma migrate dev --name description_de_la_migration
   Exemple:
   $ npx prisma migrate dev --name add_lot_status_enum

3. RÉINITIALISER LA BD (développement uniquement, PERTE DE DONNÉES!)
   $ npx prisma migrate reset
   → Supprime tout et recrée à partir des migrations

4. VOIR LE SCHÉMA ACTUALISÉ
   $ npx prisma db push
   → Applique le schema.prisma actuel

5. GÉNÉRER LES TYPES TYPESCRIPT
   $ npx prisma generate
   → Régénère le contenu de /generated/prisma

6. VÉRIFIER LES ERREURS
   $ npx prisma validate
   → Valide le schema.prisma

7. LISTER TOUTES LES MIGRATIONS
   $ npx prisma migrate status
   → Affiche l'historique des migrations
*/

// ============================================================================
// 🔐 SÉCURITÉ: Email est PRIVÉ
// ============================================================================

/*
⚠️ RÈGLE STRICTE:
   - Email stocké en BD mais JAMAIS affichage en UI React
   - Accès via services côté serveur uniquement
   - Frontend utilise getParentEmail() via API sécurisée

❌ NE PAS FAIRE:
   const parent = await parentService.getParentById(id);
   return <p>{parent.email}</p>;  // ❌ ERREUR !

✅ FAIRE:
   const parents = await parentService.getAllParents();
   // getAllParents() exclut l'email
   return parents.map(p => <p>{p.firstName}</p>);
*/

// ============================================================================
// 📚 STRUCTURE DES FICHIERS
// ============================================================================

/*
/src/lib/db/
├── prisma.ts              ← Singleton Prisma Client
├── parentService.ts       ← CRUD + queries pour Parents
├── lotService.ts          ← CRUD + queries pour Lots
├── utils.ts               ← Validation + sécurité
├── index.ts               ← Exports centralisés
├── README.md              ← Documentation détaillée
├── USAGE_EXAMPLES.tsx     ← Exemples React
└── SETUP_GUIDE.ts         ← Ce fichier

/prisma/
├── schema.prisma          ← Définition BD
├── dev.db                 ← BD SQLite (créée au runtime)
├── migrations/
│   └── 20251228134043_init/
│       └── migration.sql  ← SQL appliqué
└── migrations/migration_lock.toml

/.env                      ← DATABASE_URL="file:./dev.db"
/prisma.config.ts          ← Config Prisma 7
*/

// ============================================================================
// 🚀 INTÉGRATION DANS TOMBOLA.TSX
// ============================================================================

/*
ÉTAPES POUR REMPLACER localStorage par Prisma:

1. IMPORTER LES SERVICES
   import { parentService, lotService } from "@/lib/db";

2. REMPLACER useState + localStorage par useEffect + services
   
   AVANT (localStorage):
   const [parents, setParents] = useState<Parent[]>([]);
   useEffect(() => {
     const saved = localStorage.getItem("tombola_parents");
     if (saved) setParents(JSON.parse(saved));
   }, []);

   APRÈS (Prisma):
   const [parents, setParents] = useState<Parent[]>([]);
   useEffect(() => {
     async function load() {
       const data = await parentService.getAllParents();
       setParents(data);
     }
     load();
   }, []);

3. REMPLACER localStorage.setItem() par createParent()
   
   AVANT:
   const newParent = { id: Date.now().toString(), ... };
   saveParents([...parents, newParent]);

   APRÈS:
   const newParent = await parentService.createParent({
     firstName, emoji, role, classes, email
   });
   setParents([...parents, newParent]);

4. VERIFIER AUCUN EMAIL EXPOSÉ
   - Pas de {parent.email} dans le JSX
   - Contacts via API sécurisée uniquement
*/

// ============================================================================
// 📊 MODÈLE DE DONNÉES
// ============================================================================

/*
TABLE: parents
┌────────┬──────────┬────────┬──────────────────┬─────────┬──────────┬──────────────┐
│ id     │ firstName│ emoji  │ role             │ classes │ email    │ createdAt    │
├────────┼──────────┼────────┼──────────────────┼─────────┼──────────┼──────────────┤
│ abc123 │ Marie    │ 😊     │ Parent par...    │ CM1 A   │ marie@.. │ 2025-12-28   │
│ def456 │ Thomas   │ 🤗     │ Membre du bureau │ CP B    │ thomas@..│ 2025-12-28   │
└────────┴──────────┴────────┴──────────────────┴─────────┴──────────┴──────────────┘

TABLE: lots
┌────────┬────────┬──────────┬─────────┬──────────┬─────────┬────────────┬────────────┐
│ id     │ title  │ icon     │ status  │ ownerId  │ reserved│ createdAt  │ updatedAt  │
├────────┼────────┼──────────┼─────────┼──────────┼─────────┼────────────┼────────────┤
│ xyz789 │ Tablette│🎁       │AVAILABLE│ abc123   │ null    │ 2025-12-28 │ 2025-12-28 │
│ uvw012 │ Livre  │📚        │RESERVED │ def456   │ abc123  │ 2025-12-28 │ 2025-12-28 │
└────────┴────────┴──────────┴─────────┴──────────┴─────────┴────────────┴────────────┘

RELATIONS:
- Parent.proposedLots → Lot[] (where ownerId = parentId)
- Parent.reservedLots → Lot[] (where reservedById = parentId)
- Lot.owner → Parent (ownerId FK)
- Lot.reservedBy → Parent (reservedById FK, nullable)
*/

// ============================================================================
// 🔗 MIGRATION VERS PRODUCTION
// ============================================================================

/*
QUAND PASSER À PostgreSQL / Supabase:

1. AUCUNE MODIFICATION DE CODE TYPESCRIPT
   - Services Prisma restent identiques
   - Requêtes identiques
   - Types identiques

2. SEULE MODIFICATION: connection string dans .env
   AVANT: DATABASE_URL="file:./dev.db"
   APRÈS: DATABASE_URL="postgresql://user:password@host/dbname"

3. CRÉER NOUVELLE MIGRATION
   $ npx prisma migrate dev --name migrate_to_postgres

4. DÉPLOYER LA MIGRATION EN PROD
   $ npx prisma migrate deploy

Voilà! Aucun changement de logique métier.
*/

// ============================================================================
// 🐛 TROUBLESHOOTING
// ============================================================================

/*
PROBLÈME: "Cannot find module '@prisma/client'"
SOLUTION:
  $ npm install @prisma/client

PROBLÈME: "Datasource "db": SQLite database not found"
SOLUTION:
  $ npx prisma migrate dev --name init

PROBLÈME: "email already exists"
SOLUTION:
  L'email doit être unique. Utiliser un email différent ou supprimer le parent.
  $ npx prisma studio  (pour supprimer rapidement)

PROBLÈME: "Foreign key constraint failed"
SOLUTION:
  Impossible d'ajouter un lot pour un parent qui n'existe pas.
  Créer le parent d'abord: await parentService.createParent()

PROBLÈME: Build échoue avec erreur Prisma
SOLUTION:
  $ rm -rf node_modules generated
  $ npm install
  $ npx prisma generate
  $ npm run build
*/

// ============================================================================
// ✅ PROCHAINES ÉTAPES
// ============================================================================

/*
1. ✅ BD SQLite créée avec schema Parent + Lot
2. ✅ Services TypeScript complets
3. ✅ Documentation et exemples React

SUIVANT:
4. [ ] Intégrer Prisma dans Tombola.tsx (remplacer localStorage)
5. [ ] Créer une API REST simple (Next.js Routes ou serverless)
6. [ ] Ajouter l'authentification (pour savoir qui est connecté)
7. [ ] Envoyer des emails sur contact
8. [ ] Déployer sur main branch
9. [ ] En production: migrer vers PostgreSQL/Supabase si besoin

COMMANDES FINALES:
$ npx prisma studio        (voir la BD)
$ npm run build            (vérifier la build)
$ git add && git commit    (valider les changes)
$ git push origin tombinoscope  (pousser)
*/

export default {
  docs: "Voir src/lib/db/README.md",
  examples: "Voir src/lib/db/USAGE_EXAMPLES.tsx",
  commands: "Voir les commandes ci-dessus",
};
