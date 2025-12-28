/**
 * VÉRIFICATION DU SCHÉMA DE BASE DE DONNÉES
 * 
 * Structure complète de la BD SQLite pour APE Tombola
 */

// ============================================================================
// SCHÉMA COMPLET (tel que généré par Prisma)
// ============================================================================

/*
CREATE TABLE "parents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "classes" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "parents_email_key" ON "parents"("email");

CREATE TABLE "lots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "ownerId" TEXT NOT NULL,
    "reservedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "lots_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lots_reservedById_fkey" FOREIGN KEY ("reservedById") REFERENCES "parents" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "lots_ownerId_idx" ON "lots"("ownerId");
CREATE INDEX "lots_reservedById_idx" ON "lots"("reservedById");
CREATE INDEX "lots_status_idx" ON "lots"("status");
*/

// ============================================================================
// RELATIONS ET INTÉGRITÉ
// ============================================================================

/*
RELATIONS:
1. Parent.proposedLots (1-∞)
   - Un parent peut proposer plusieurs lots
   - FK: Lot.ownerId → Parent.id
   - Comportement DELETE: CASCADE (supprimer le lot si parent supprimé)

2. Parent.reservedLots (1-∞)
   - Un parent peut réserver plusieurs lots
   - FK: Lot.reservedById → Parent.id
   - Comportement DELETE: SET NULL (garder le lot mais pas de réservation)

CONTRAINTES D'INTÉGRITÉ:
- Email unique dans parents
- ownerId obligatoire dans lots (FK not null)
- reservedById nullable dans lots (FK nullable)
- Status a valeurs enum: AVAILABLE | RESERVED | GIVEN
*/

// ============================================================================
// ÉNUMÉRATION DES VALEURS
// ============================================================================

/*
LotStatus enum:
  - AVAILABLE: Lot disponible pour réservation
  - RESERVED:  Lot réservé par quelqu'un
  - GIVEN:     Lot remis au gagnant

Role:
  - "Parent participant"
  - "Membre du bureau"
  - "Bénévole"
  - (autres valeurs possibles)

Classes:
  - Libre: "CM1 A", "CP B et C", "GS/CP", etc.
*/

// ============================================================================
// EXEMPLES DE DONNÉES
// ============================================================================

/*
INSERT parents (id, firstName, emoji, role, classes, email):
  ('parent_001', 'Marie', '😊', 'Parent participant', 'CM1 A', 'marie@example.com')
  ('parent_002', 'Thomas', '🤗', 'Membre du bureau', 'CP B', 'thomas@example.com')
  ('parent_003', 'Sophie', '💪', 'Parent participant', 'CM2 A, CM2 B', 'sophie@example.com')

INSERT lots (id, title, description, icon, status, ownerId, reservedById):
  ('lot_001', 'Tablette 10"', 'Tablette d''occasion, bon état', '🎁', 'AVAILABLE', 'parent_001', null)
  ('lot_002', 'Livres jeunesse', 'Pack de 5 livres pour enfants', '📚', 'RESERVED', 'parent_002', 'parent_001')
  ('lot_003', 'Jeu de société', 'Jeu familial amusant', '🎲', 'GIVEN', 'parent_003', 'parent_001')
*/

// ============================================================================
// VÉRIFICATION: Afficher le schéma actuel
// ============================================================================

/*
COMMANDE POUR VOIR LE SCHÉMA ACTUEL:

1. Avec Prisma Studio (GUI)
   $ npx prisma studio
   → http://localhost:5555

2. Avec SQLite CLI
   $ sqlite3 prisma/dev.db
   sqlite> .tables          // Lister les tables
   sqlite> .schema parents  // Voir la structure d'une table
   sqlite> SELECT * FROM parents;  // Voir les données
   sqlite> .quit

3. Avec Prisma CLI
   $ npx prisma db pull    // Récupérer le schéma de la BD
   $ npx prisma validate    // Valider le schema.prisma
*/

// ============================================================================
// VÉRIFICATION: Compter les données
// ============================================================================

/*
COMMANDS POUR VÉRIFIER LES DONNÉES:

const stats = {
  parents: await prisma.parent.count(),
  lots: await prisma.lot.count(),
  lotsAvailable: await prisma.lot.count({ where: { status: 'AVAILABLE' } }),
  lotsReserved: await prisma.lot.count({ where: { status: 'RESERVED' } }),
  lotsGiven: await prisma.lot.count({ where: { status: 'GIVEN' } }),
};

console.log(stats);
// Output example:
// {
//   parents: 3,
//   lots: 10,
//   lotsAvailable: 6,
//   lotsReserved: 3,
//   lotsGiven: 1
// }
*/

// ============================================================================
// PERFORMANCE ET INDEXES
// ============================================================================

/*
INDEXES CRÉÉS:
1. parents.email (UNIQUE) - Recherche rapide par email
2. lots.ownerId - Recherche rapide par propriétaire
3. lots.reservedById - Recherche rapide par réservation
4. lots.status - Recherche rapide par statut

COMPLEXITÉ DES REQUÊTES:
- Chercher un parent: O(1) → index email
- Lister lots disponibles: O(n) → index status
- Trouver les lots d'un parent: O(m) → index ownerId
- Réserver un lot: O(1) + O(1) → index lot + parent
*/

// ============================================================================
// AUDIT: Qui a créé/modifié quoi?
// ============================================================================

/*
COLONNES D'AUDIT:
- Parent.createdAt: Date de création du parent
- Lot.createdAt: Date de création du lot
- Lot.updatedAt: Dernière modification du lot

Pour ajouter updatedAt à Parent:
1. Modifier schema.prisma:
   model Parent {
     ...
     updatedAt DateTime @updatedAt
   }

2. Créer une migration:
   $ npx prisma migrate dev --name add_updated_at_to_parent

3. updatedAt est automatiquement géré par Prisma
*/

// ============================================================================
// SÉCURITÉ: Email est PRIVÉ
// ============================================================================

/*
RÈGLES DE SÉCURITÉ APPLIQUÉES:

1. Email stocké en BD (parent.email)
   - INDEX UNIQUE: parent_email_key
   - JAMAIS exposé en UI

2. Accès à l'email
   ✅ CÔTÉ SERVEUR/API:
      const email = await parentService.getParentEmail(parentId);
      // Utiliser pour mailto: ou email notification
   
   ❌ JAMAIS EN FRONTEND:
      return <p>{parent.email}</p>;  // ❌ DANGER!

3. Contact entre parents
   ✅ PATTERN SÉCURISÉ:
      User A clique "Contacter Parent B"
      → Frontend appelle API: /api/contact-lot/{lotId}
      → Backend récupère Lot + email du propriétaire
      → Backend retourne lien mailto: préfabriqué
      → Frontend ouvre mailto: dans le navigateur
      → Email du propriétaire reste invisible

*/

// ============================================================================
// MIGRATION: Vers PostgreSQL/Supabase
// ============================================================================

/*
QUAND PASSER À PRODUCTION:

1. CHANGER .env
   AVANT: DATABASE_URL="file:./dev.db"
   APRÈS: DATABASE_URL="postgresql://user:password@host/dbname"
   OU:    DATABASE_URL="postgresql://user:password@db.supabase.co:5432/postgres"

2. AUCUNE MODIFICATION DE CODE TYPESCRIPT
   - Même services
   - Même requêtes
   - Même relations

3. APPLIQUER MIGRATIONS EN PRODUCTION
   $ npx prisma migrate deploy
   (Crée les mêmes tables en PostgreSQL)

4. VÉRIFIER LA COMPATIBILITÉ
   SQLite → PostgreSQL: 100% compatible
   Tous les types et relations marchent identiquement
*/

// ============================================================================
// ✅ CHECKLIST DE VÉRIFICATION
// ============================================================================

/*
✅ BD Créée et accessibleBASE DE DONNÉES
[ ] npx prisma studio fonctionne
[ ] Tables parents et lots visibles
[ ] Indexes créés (email unique, status, ownerId)
[ ] Aucune erreur de migration

✅ Données Correctes
[ ] Ajouter un parent: OK
[ ] Ajouter un lot: OK
[ ] Réserver un lot: OK
[ ] Statistiques correctes: OK

✅ Services Typescript
[ ] parentService importable et fonctionnel
[ ] lotService importable et fonctionnel
[ ] Email jamais retourné par getAllParents()
[ ] Email retourné par getParentEmail() (serveur uniquement)

✅ Build & Compilation
[ ] npm run build réussit
[ ] Aucune erreur TypeScript
[ ] Aucun warning Prisma

✅ Git
[ ] Tous les fichiers commitées
[ ] .env en .gitignore
[ ] dev.db en .gitignore
[ ] Push sur branche tombinoscope
*/

export default {
  schemaFile: "../../../prisma/schema.prisma",
  migrationFile: "../../../prisma/migrations/20251228134043_init/migration.sql",
  readmeFile: "./README.md",
  setupGuideFile: "./SETUP_GUIDE.ts",
  usageExamplesFile: "./USAGE_EXAMPLES.tsx",
};
