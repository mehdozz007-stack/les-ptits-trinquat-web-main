# Schéma Complet de la Base de Données - Les P'tits Trinquat

> Documentation technique pour GitHub Copilot et déploiement indépendant

## 📋 Table des matières

1. [Stack Technique](#-stack-technique)
2. [Architecture de la Base de Données](#-architecture-de-la-base-de-données)
3. [Schéma des Tables](#-schéma-des-tables)
4. [Relations entre Tables](#-relations-entre-tables)
5. [Sécurité et RLS](#-sécurité-et-rls)
6. [Fonctions et Triggers](#-fonctions-et-triggers)
7. [Migration SQL Complète](#-migration-sql-complète)

---

## 🛠 Stack Technique

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18.3 | Bibliothèque UI |
| **TypeScript** | 5.0+ | Typage statique |
| **Vite** | 5.0+ | Build tool & dev server |
| **Tailwind CSS** | 3.4+ | Framework CSS utilitaire |
| **shadcn/ui** | latest | Composants UI accessibles |
| **Framer Motion** | 12.x | Animations fluides |
| **React Router** | 6.x | Navigation SPA |
| **React Hook Form** | 7.x | Gestion des formulaires |
| **Zod** | 3.x | Validation des données |
| **TanStack Query** | 5.x | Gestion d'état serveur |

### Backend (Supabase)
| Technologie | Usage |
|-------------|-------|
| **PostgreSQL** | Base de données relationnelle |
| **Supabase Auth** | Authentification utilisateurs |
| **Supabase RLS** | Row Level Security |
| **Edge Functions (Deno)** | Logique serveur |
| **Resend** | Envoi d'emails |

### Outils de Développement
| Outil | Usage |
|-------|-------|
| **ESLint** | Linting du code |
| **Bun** | Package manager & runtime |
| **Lucide React** | Icônes modernes |

---

## 🗄 Architecture de la Base de Données

```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTHENTIFICATION                          │
├─────────────────────────────────────────────────────────────────┤
│  auth.users (Supabase managed)                                  │
│  └── user_roles (rôles applicatifs)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         NEWSLETTER                               │
├─────────────────────────────────────────────────────────────────┤
│  newsletter_subscribers ←── newsletters                          │
│  (abonnés)                   (campagnes)                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          TOMBOLA                                 │
├─────────────────────────────────────────────────────────────────┤
│  tombola_participants ←── tombola_lots                           │
│  (donateurs)              (lots donnés/réservés)                 │
│        │                                                         │
│        └── tombola_participants_public (vue sans email)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Schéma des Tables

### 1. Table `user_roles` (Gestion des Rôles)

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|----------|--------|-------------|
| `id` | `uuid` | Non | `gen_random_uuid()` | Identifiant unique |
| `user_id` | `uuid` | Non | - | Référence à auth.users |
| `role` | `app_role` | Non | - | Rôle de l'utilisateur |
| `created_at` | `timestamptz` | Non | `now()` | Date de création |

**Enum `app_role`:**
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
```

---

### 2. Table `newsletter_subscribers` (Abonnés Newsletter)

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|----------|--------|-------------|
| `id` | `uuid` | Non | `gen_random_uuid()` | Identifiant unique |
| `email` | `text` | Non | - | Adresse email (unique) |
| `first_name` | `text` | Oui | `null` | Prénom de l'abonné |
| `consent` | `boolean` | Non | `false` | Consentement RGPD |
| `is_active` | `boolean` | Non | `true` | Statut d'abonnement |
| `created_at` | `timestamptz` | Non | `now()` | Date d'inscription |

**Contraintes:**
- `email` doit être unique
- `consent = true` requis pour l'insertion (politique RLS)

---

### 3. Table `newsletters` (Campagnes Newsletter)

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|----------|--------|-------------|
| `id` | `uuid` | Non | `gen_random_uuid()` | Identifiant unique |
| `title` | `text` | Non | - | Titre interne |
| `subject` | `text` | Non | - | Objet de l'email |
| `content` | `text` | Non | - | Contenu HTML/texte |
| `status` | `text` | Non | `'draft'` | Statut: draft/sent |
| `sent_at` | `timestamptz` | Oui | `null` | Date d'envoi |
| `recipients_count` | `integer` | Oui | `0` | Nombre de destinataires |
| `created_at` | `timestamptz` | Non | `now()` | Date de création |
| `updated_at` | `timestamptz` | Non | `now()` | Dernière modification |

---

### 4. Table `tombola_participants` (Participants Tombola)

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|----------|--------|-------------|
| `id` | `uuid` | Non | `gen_random_uuid()` | Identifiant unique |
| `prenom` | `text` | Non | - | Prénom du participant |
| `email` | `text` | Non | - | Email (privé) |
| `role` | `text` | Non | `'Parent participant'` | Rôle affiché |
| `classes` | `text` | Oui | `null` | Classes des enfants |
| `emoji` | `text` | Non | `'😊'` | Avatar emoji |
| `created_at` | `timestamptz` | Non | `now()` | Date d'inscription |

---

### 5. Table `tombola_lots` (Lots de la Tombola)

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|----------|--------|-------------|
| `id` | `uuid` | Non | `gen_random_uuid()` | Identifiant unique |
| `nom` | `text` | Non | - | Nom du lot |
| `description` | `text` | Oui | `null` | Description détaillée |
| `icone` | `text` | Non | `'🎁'` | Icône emoji |
| `statut` | `text` | Non | `'disponible'` | disponible/réservé/remis |
| `parent_id` | `uuid` | Non | - | FK → tombola_participants |
| `reserved_by` | `uuid` | Oui | `null` | FK → tombola_participants |
| `created_at` | `timestamptz` | Non | `now()` | Date de création |

---

### 6. Vue `tombola_participants_public` (Vue Publique)

> Vue sécurisée excluant les emails pour l'affichage public

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | `uuid` | Identifiant |
| `prenom` | `text` | Prénom |
| `role` | `text` | Rôle |
| `classes` | `text` | Classes |
| `emoji` | `text` | Avatar |
| `created_at` | `timestamptz` | Date |

---

## 🔗 Relations entre Tables

```
┌──────────────────┐       ┌──────────────────┐
│   auth.users     │       │   user_roles     │
│ (Supabase Auth)  │◄──────│                  │
│                  │ 1:N   │ user_id (FK)     │
│                  │       │ role (enum)      │
└──────────────────┘       └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│ tombola_         │       │  tombola_lots    │
│ participants     │◄──────│                  │
│                  │ 1:N   │ parent_id (FK)   │
│                  │◄──────│ reserved_by (FK) │
└──────────────────┘ 0:N   └──────────────────┘
```

**Clés Étrangères:**

```sql
-- tombola_lots.parent_id → tombola_participants.id
FOREIGN KEY (parent_id) REFERENCES tombola_participants(id)

-- tombola_lots.reserved_by → tombola_participants.id (nullable)
FOREIGN KEY (reserved_by) REFERENCES tombola_participants(id)
```

---

## 🔐 Sécurité et RLS

### Fonction de Vérification des Rôles

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

> ⚠️ `SECURITY DEFINER` permet d'éviter les appels récursifs RLS

### Politiques RLS par Table

#### `user_roles`
| Politique | Commande | Condition |
|-----------|----------|-----------|
| Admins can view all roles | SELECT | `has_role(auth.uid(), 'admin')` |

#### `newsletter_subscribers`
| Politique | Commande | Condition |
|-----------|----------|-----------|
| Anyone can subscribe | INSERT | `consent = true` |
| Admins can view | SELECT | `has_role(auth.uid(), 'admin')` |
| Admins can update | UPDATE | `has_role(auth.uid(), 'admin')` |
| Admins can delete | DELETE | `has_role(auth.uid(), 'admin')` |

#### `newsletters`
| Politique | Commande | Condition |
|-----------|----------|-----------|
| Admins can view | SELECT | `has_role(auth.uid(), 'admin')` |
| Admins can insert | INSERT | `has_role(auth.uid(), 'admin')` |
| Admins can update | UPDATE | `has_role(auth.uid(), 'admin')` |
| Admins can delete | DELETE | `has_role(auth.uid(), 'admin')` |

#### `tombola_participants`
| Politique | Commande | Condition |
|-----------|----------|-----------|
| Authenticated can insert | INSERT | `true` (authentifié) |
| Admins can view all | SELECT | `has_role(auth.uid(), 'admin')` |
| Admins can update | UPDATE | `has_role(auth.uid(), 'admin')` |
| Admins can delete | DELETE | `has_role(auth.uid(), 'admin')` |

#### `tombola_lots`
| Politique | Commande | Condition |
|-----------|----------|-----------|
| Anyone can view | SELECT | `true` |
| Authenticated can insert own | INSERT | `EXISTS(SELECT 1 FROM tombola_participants WHERE id = parent_id)` |
| Admins can update | UPDATE | `has_role(auth.uid(), 'admin')` |
| Admins can delete | DELETE | `has_role(auth.uid(), 'admin')` |

---

## ⚙️ Fonctions et Triggers

### Trigger de Mise à Jour Automatique

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Application sur newsletters
CREATE TRIGGER update_newsletters_updated_at
BEFORE UPDATE ON public.newsletters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

---

## 📝 Migration SQL Complète

```sql
-- ============================================================
-- MIGRATION COMPLÈTE - Les P'tits Trinquat
-- Base de données PostgreSQL (Supabase compatible)
-- ============================================================

-- 1. ENUM DES RÔLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. TABLE USER_ROLES
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role app_role NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. FONCTION HAS_ROLE (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. TABLE NEWSLETTER_SUBSCRIBERS
CREATE TABLE public.newsletter_subscribers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    first_name text,
    consent boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 5. TABLE NEWSLETTERS
CREATE TABLE public.newsletters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    status text NOT NULL DEFAULT 'draft',
    sent_at timestamptz,
    recipients_count integer DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

-- 6. TABLE TOMBOLA_PARTICIPANTS
CREATE TABLE public.tombola_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    prenom text NOT NULL,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'Parent participant',
    classes text,
    emoji text NOT NULL DEFAULT '😊',
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tombola_participants ENABLE ROW LEVEL SECURITY;

-- 7. TABLE TOMBOLA_LOTS
CREATE TABLE public.tombola_lots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nom text NOT NULL,
    description text,
    icone text NOT NULL DEFAULT '🎁',
    statut text NOT NULL DEFAULT 'disponible',
    parent_id uuid NOT NULL REFERENCES tombola_participants(id),
    reserved_by uuid REFERENCES tombola_participants(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tombola_lots ENABLE ROW LEVEL SECURITY;

-- 8. VUE PUBLIQUE (SANS EMAIL)
CREATE VIEW public.tombola_participants_public AS
SELECT id, prenom, role, classes, emoji, created_at
FROM public.tombola_participants;

-- 9. FONCTION UPDATE_UPDATED_AT
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 10. TRIGGER NEWSLETTERS
CREATE TRIGGER update_newsletters_updated_at
BEFORE UPDATE ON public.newsletters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- POLITIQUES RLS
-- ============================================================

-- USER_ROLES
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- NEWSLETTER_SUBSCRIBERS
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT
TO public
WITH CHECK (consent = true);

CREATE POLICY "Authenticated admins can view subscribers"
ON public.newsletter_subscribers FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated admins can update subscribers"
ON public.newsletter_subscribers FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated admins can delete subscribers"
ON public.newsletter_subscribers FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- NEWSLETTERS
CREATE POLICY "Authenticated admins can view newsletters"
ON public.newsletters FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated admins can insert newsletters"
ON public.newsletters FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated admins can update newsletters"
ON public.newsletters FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated admins can delete newsletters"
ON public.newsletters FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- TOMBOLA_PARTICIPANTS
CREATE POLICY "Authenticated users can insert participants"
ON public.tombola_participants FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view all participant data"
ON public.tombola_participants FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update participants"
ON public.tombola_participants FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete participants"
ON public.tombola_participants FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- TOMBOLA_LOTS
CREATE POLICY "Anyone can view lots"
ON public.tombola_lots FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert their own lots"
ON public.tombola_lots FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM tombola_participants
    WHERE tombola_participants.id = tombola_lots.parent_id
));

CREATE POLICY "Only admins can update lots"
ON public.tombola_lots FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lots"
ON public.tombola_lots FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- ============================================================
-- CRÉATION ADMIN INITIAL
-- ============================================================
-- Après création d'un utilisateur via Supabase Auth :
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('UUID_DE_L_UTILISATEUR', 'admin');
```

---

## 🔒 Mesures de Sécurité Implémentées

### 1. Protection des Données
- ✅ RLS activé sur toutes les tables
- ✅ Vue publique sans emails (`tombola_participants_public`)
- ✅ Fonction `has_role()` avec `SECURITY DEFINER`
- ✅ Consentement RGPD obligatoire pour inscription newsletter

### 2. Protection XSS (Edge Functions)
```typescript
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

### 3. Authentification Edge Functions
```typescript
// Vérification JWT
const authHeader = req.headers.get("Authorization");
const token = authHeader?.replace("Bearer ", "");
const { data: { user }, error } = await supabase.auth.getUser(token);

// Vérification rôle admin
const { data: roleData } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", user.id)
  .eq("role", "admin")
  .single();
```

### 4. Secrets Requis
| Secret | Usage |
|--------|-------|
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_ANON_KEY` | Clé publique |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé admin (Edge Functions) |
| `RESEND_API_KEY` | Envoi d'emails |

---

*Documentation générée pour Les P'tits Trinquat - Version open source*
