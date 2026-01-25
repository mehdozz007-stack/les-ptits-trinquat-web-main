# Base de données Newsletter - Schéma complet

## Vue d'ensemble

Ce document décrit le schéma complet de la base de données pour le système de newsletter, incluant les tables, relations, politiques de sécurité RLS et fonctions.

---

## Architecture de sécurité

### Système de rôles

```sql
-- Enum pour les rôles applicatifs
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
```

### Fonction de vérification des rôles

```sql
-- Fonction SECURITY DEFINER pour éviter la récursion RLS
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

> **Note importante** : La fonction utilise `SECURITY DEFINER` pour s'exécuter avec les privilèges du propriétaire, évitant ainsi les problèmes de récursion RLS.

---

## Tables

### 1. Table `user_roles`

Gestion des rôles utilisateurs pour l'authentification et les autorisations.

```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Activer RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

#### Politiques RLS

```sql
-- Seuls les admins peuvent voir les rôles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
```

> **Sécurité** : Aucune politique INSERT/UPDATE/DELETE n'est définie, empêchant toute modification via l'API client. Les rôles doivent être attribués directement en base de données.

---

### 2. Table `newsletter_subscribers`

Stockage des abonnés à la newsletter.

```sql
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
```

#### Colonnes

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|----------|--------|-------------|
| `id` | UUID | Non | `gen_random_uuid()` | Identifiant unique |
| `email` | TEXT | Non | - | Adresse email (unique) |
| `first_name` | TEXT | Oui | - | Prénom de l'abonné |
| `consent` | BOOLEAN | Non | `false` | Consentement RGPD |
| `is_active` | BOOLEAN | Non | `true` | Statut d'abonnement |
| `created_at` | TIMESTAMP | Non | `now()` | Date d'inscription |

#### Politiques RLS

```sql
-- Inscription publique (consentement obligatoire)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (consent = true);

-- Lecture réservée aux admins
CREATE POLICY "Authenticated admins can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Modification réservée aux admins
CREATE POLICY "Authenticated admins can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Suppression réservée aux admins
CREATE POLICY "Authenticated admins can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
```

---

### 3. Table `newsletters`

Stockage des newsletters (brouillons et envoyées).

```sql
CREATE TABLE public.newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  recipients_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
```

#### Colonnes

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|----------|--------|-------------|
| `id` | UUID | Non | `gen_random_uuid()` | Identifiant unique |
| `title` | TEXT | Non | - | Titre interne (admin) |
| `subject` | TEXT | Non | - | Objet de l'email |
| `content` | TEXT | Non | - | Corps de la newsletter |
| `status` | TEXT | Non | `'draft'` | Statut : `draft` ou `sent` |
| `recipients_count` | INTEGER | Oui | `0` | Nombre de destinataires |
| `sent_at` | TIMESTAMP | Oui | - | Date d'envoi |
| `created_at` | TIMESTAMP | Non | `now()` | Date de création |
| `updated_at` | TIMESTAMP | Non | `now()` | Date de mise à jour |

#### Politiques RLS

```sql
-- Lecture réservée aux admins
CREATE POLICY "Authenticated admins can view newsletters"
ON public.newsletters
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Création réservée aux admins
CREATE POLICY "Authenticated admins can insert newsletters"
ON public.newsletters
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Modification réservée aux admins
CREATE POLICY "Authenticated admins can update newsletters"
ON public.newsletters
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Suppression réservée aux admins
CREATE POLICY "Authenticated admins can delete newsletters"
ON public.newsletters
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
```

#### Trigger de mise à jour automatique

```sql
-- Fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger sur la table newsletters
CREATE TRIGGER update_newsletters_updated_at
BEFORE UPDATE ON public.newsletters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

---

## Diagramme des relations

```
┌─────────────────────┐
│    auth.users       │
│  (Supabase Auth)    │
└──────────┬──────────┘
           │
           │ user_id (FK)
           ▼
┌─────────────────────┐
│    user_roles       │
│  - id (PK)          │
│  - user_id (FK)     │
│  - role (enum)      │
│  - created_at       │
└─────────────────────┘

┌─────────────────────┐      ┌─────────────────────┐
│newsletter_subscribers│      │    newsletters      │
│  - id (PK)          │      │  - id (PK)          │
│  - email (UNIQUE)   │      │  - title            │
│  - first_name       │      │  - subject          │
│  - consent          │      │  - content          │
│  - is_active        │      │  - status           │
│  - created_at       │      │  - recipients_count │
└─────────────────────┘      │  - sent_at          │
                             │  - created_at       │
                             │  - updated_at       │
                             └─────────────────────┘
```

> **Note** : Les tables `newsletter_subscribers` et `newsletters` sont indépendantes. Le lien entre elles est établi au moment de l'envoi via l'Edge Function.

---

## Mesures de sécurité

### 1. Row Level Security (RLS)

Toutes les tables ont RLS activé avec des politiques restrictives :

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `user_roles` | Admin | ❌ | ❌ | ❌ |
| `newsletter_subscribers` | Admin | Public* | Admin | Admin |
| `newsletters` | Admin | Admin | Admin | Admin |

*\* L'insertion publique requiert `consent = true`*

### 2. Fonction SECURITY DEFINER

La fonction `has_role()` utilise `SECURITY DEFINER` pour :
- Éviter la récursion infinie dans les politiques RLS
- Permettre la vérification des rôles sans exposer la table `user_roles`
- S'exécuter avec les privilèges du propriétaire de la fonction

### 3. Protection contre l'escalade de privilèges

- Les rôles sont stockés dans une table séparée (`user_roles`), **jamais** dans la table `profiles` ou `users`
- Aucune politique INSERT/UPDATE/DELETE sur `user_roles` via l'API client
- Seule une intervention directe en base de données permet d'attribuer des rôles

### 4. Protection XSS dans l'Edge Function

L'Edge Function `send-newsletter` utilise une fonction d'échappement HTML :

```typescript
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
```

Cette fonction est appliquée sur :
- Le sujet de l'email
- Le contenu de la newsletter
- Le prénom du destinataire

### 5. Authentification JWT

L'Edge Function vérifie :
1. La présence d'un token JWT valide dans le header `Authorization`
2. Le rôle `admin` de l'utilisateur via la fonction `has_role()`

```typescript
// Vérification du token
const authHeader = req.headers.get('Authorization');
const token = authHeader?.replace('Bearer ', '');

const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

// Vérification du rôle admin
const { data: isAdmin } = await supabaseAdmin.rpc('has_role', {
  _user_id: user.id,
  _role: 'admin'
});
```

---

## Edge Function : send-newsletter

### Endpoint

```
POST /functions/v1/send-newsletter
```

### Headers requis

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Corps de la requête

```json
{
  "newsletterId": "uuid-de-la-newsletter"
}
```

### Processus

1. Validation du JWT et du rôle admin
2. Récupération de la newsletter par ID
3. Récupération des abonnés actifs (`is_active = true`)
4. Envoi des emails via Resend API
5. Mise à jour de la newsletter (`status = 'sent'`, `sent_at`, `recipients_count`)

### Secrets requis

| Secret | Description |
|--------|-------------|
| `RESEND_API_KEY` | Clé API Resend pour l'envoi d'emails |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé de service pour bypass RLS |

---

## Création d'un administrateur

### Étapes

1. **Inscription** : L'utilisateur s'inscrit via `/admin/newsletter`

2. **Récupération de l'ID** : 
   ```sql
   SELECT id FROM auth.users WHERE email = 'admin@example.com';
   ```

3. **Attribution du rôle** :
   ```sql
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ('user-id-ici', 'admin');
   ```

---

## Bonnes pratiques

### À faire ✅

- Toujours vérifier le consentement RGPD avant inscription
- Utiliser `has_role()` pour les vérifications de permissions
- Échapper tout contenu HTML avant envoi
- Vérifier le JWT dans chaque Edge Function sensible

### À ne pas faire ❌

- Stocker les rôles dans la table `profiles` ou `users`
- Exposer les adresses email des abonnés publiquement
- Permettre l'auto-attribution de rôles via l'API client
- Envoyer des newsletters sans vérification admin

---

## Migration SQL complète

```sql
-- 1. Créer l'enum des rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Créer la table user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Créer la fonction has_role
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

-- 4. Créer la table newsletter_subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (consent = true);

CREATE POLICY "Authenticated admins can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated admins can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated admins can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Créer la table newsletters
CREATE TABLE public.newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  recipients_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated admins can view newsletters"
ON public.newsletters
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated admins can insert newsletters"
ON public.newsletters
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated admins can update newsletters"
ON public.newsletters
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated admins can delete newsletters"
ON public.newsletters
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Créer la fonction et le trigger de mise à jour
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_newsletters_updated_at
BEFORE UPDATE ON public.newsletters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

---

## Changelog

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2026-01-18 | Schéma initial avec RLS et sécurité complète |
