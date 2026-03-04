# Prompt Copilot – Guide Fullstack Newsletter & Tombola

## Contexte

Tu travailles sur le site web de l'Association de Parents d'Élèves **Les P'tits Trinquât**.

Le projet utilise **Supabase** pour le backend (base de données, authentification, Edge Functions).

---

## Stack Technique

| Technologie | Usage |
|-------------|-------|
| React 18 + TypeScript | Framework UI |
| Vite | Bundler |
| Tailwind CSS | Styles utilitaires |
| shadcn-ui | Composants UI |
| framer-motion | Animations |
| Supabase Auth | Authentification |
| Supabase RLS | Sécurité des données (Row Level Security) |
| Supabase Edge Functions | Backend serverless (Deno) |
| Resend | Envoi d'emails |

---

## Architecture Sécurité

### Système de rôles

```sql
-- Enum des rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Table des rôles utilisateurs
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Fonction de vérification (SECURITY DEFINER pour éviter récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### Authentification Edge Functions

Toutes les Edge Functions sensibles doivent vérifier le JWT :

```typescript
// Vérification JWT dans Edge Function
const authHeader = req.headers.get("Authorization");
if (!authHeader?.startsWith("Bearer ")) {
  return new Response(
    JSON.stringify({ error: "Authentication required" }),
    { status: 401, headers: corsHeaders }
  );
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

const authClient = createClient(supabaseUrl, supabaseAnonKey, {
  global: { headers: { Authorization: authHeader } }
});

const token = authHeader.replace("Bearer ", "");
const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);

if (claimsError || !claimsData?.claims) {
  return new Response(
    JSON.stringify({ error: "Invalid authentication" }),
    { status: 401, headers: corsHeaders }
  );
}

const userId = claimsData.claims.sub;
```

### Vérification rôle Admin

```typescript
// Après vérification JWT, vérifier le rôle admin
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const { data: roleData } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", userId)
  .eq("role", "admin")
  .maybeSingle();

if (!roleData) {
  return new Response(
    JSON.stringify({ error: "Admin access required" }),
    { status: 403, headers: corsHeaders }
  );
}
```

---

# PARTIE 1 : NEWSLETTER

## Tables Supabase

### `newsletter_subscribers`

| Colonne | Type | Default | RLS |
|---------|------|---------|-----|
| id | UUID | gen_random_uuid() | Admin uniquement (SELECT/UPDATE/DELETE) |
| first_name | TEXT | NULL | Inscription publique autorisée |
| email | TEXT | NOT NULL | |
| consent | BOOLEAN | false | INSERT avec consent=true |
| is_active | BOOLEAN | true | |
| created_at | TIMESTAMP | now() | |

### `newsletters`

| Colonne | Type | Default | RLS |
|---------|------|---------|-----|
| id | UUID | gen_random_uuid() | Admin uniquement |
| title | TEXT | NOT NULL | |
| subject | TEXT | NOT NULL | |
| content | TEXT | NOT NULL | |
| status | TEXT | 'draft' | |
| sent_at | TIMESTAMP | NULL | |
| recipients_count | INTEGER | 0 | |
| created_at | TIMESTAMP | now() | |
| updated_at | TIMESTAMP | now() | |

### Politiques RLS Newsletter

```sql
-- Inscription publique (avec consentement obligatoire)
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (consent = true);

-- Lecture/modification réservées aux admins
CREATE POLICY "Admins can view subscribers" ON newsletter_subscribers
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update subscribers" ON newsletter_subscribers
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete subscribers" ON newsletter_subscribers
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
```

## Edge Function : send-newsletter

**Fichier** : `supabase/functions/send-newsletter/index.ts`

**Config** : `supabase/config.toml`
```toml
[functions.send-newsletter]
verify_jwt = false  # Validation manuelle dans le code
```

**Sécurité** :
- ✅ Vérification JWT obligatoire
- ✅ Vérification rôle admin obligatoire
- ✅ Sanitization XSS (escapeHtml) sur sujet, contenu et prénom
- ✅ Envoi via Resend API

**Secret requis** : `RESEND_API_KEY`

## Structure Frontend Newsletter

```
src/
├── pages/
│   └── AdminNewsletter.tsx          # Page admin protégée
├── components/
│   └── admin/
│       ├── AdminLayout.tsx          # Wrapper auth + rôle admin
│       ├── SubscribersList.tsx      # Liste abonnés (recherche, toggle, delete)
│       ├── NewsletterEditor.tsx     # Éditeur (brouillon, preview, envoi)
│       └── NewsletterHistory.tsx    # Historique des envois
├── hooks/
│   ├── useAdminAuth.ts              # État auth + signIn/signUp/signOut
│   ├── useNewsletterAdmin.ts        # CRUD newsletters + subscribers
│   └── useNewsletterSubscription.ts # Inscription publique
└── components/newsletter/
    └── NewsletterSection.tsx        # Formulaire inscription (public)
```

## Secrets Requis

| Secret | Usage |
|--------|-------|
| RESEND_API_KEY | Envoi emails newsletter |
| SUPABASE_URL | Auto-configuré |
| SUPABASE_ANON_KEY | Auto-configuré |
| SUPABASE_SERVICE_ROLE_KEY | Edge Functions (bypass RLS) |

---

## Points de Vigilance

### ⚠️ Ne jamais faire

1. **Exposer les emails** côté client (utiliser vue publique ou Edge Function)
2. **Faire confiance au client** pour les permissions (toujours vérifier côté serveur)
3. **Utiliser VITE_* dans Edge Functions** (utiliser Deno.env.get())
4. **Oublier CORS** dans les Edge Functions
5. **Stocker les rôles dans la table profiles** (table user_roles séparée)

### ✅ Toujours faire

1. **Vérifier JWT** dans chaque Edge Function sensible
2. **Vérifier le rôle admin** pour les actions privilégiées
3. **Utiliser RLS** sur toutes les tables avec données sensibles
4. **Sanitizer les entrées** (XSS, injection)
5. **Utiliser la vue publique** pour les données participants

---

## Créer un Admin

```sql
-- 1. L'utilisateur s'inscrit via /admin/newsletter
-- 2. Récupérer son user_id depuis auth.users
-- 3. Attribuer le rôle admin
INSERT INTO user_roles (user_id, role) 
VALUES ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'admin');
```

---

## Routes

| Route | Protection | Description |
|-------|------------|-------------|
| `/` | Public | Accueil + inscription newsletter |
| `/admin/newsletter` | Auth + Admin | Gestion newsletter |
| `/evenements` | Public | Événements |
| `/comptes-rendus` | Code accès | Documents protégés |
| `/partenaires` | Public | Partenaires |
| `/a-propos` | Public | À propos |
| `/contact` | Public | Contact |
