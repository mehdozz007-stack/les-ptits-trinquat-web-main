# Changelog – Fonctionnalités ajoutées depuis Tombola

Ce document récapitule toutes les fonctionnalités ajoutées au projet depuis l'implémentation du trombinoscope/tombola.

---

## 🎰 Tombola (Trombinoscope)

### Nouvelles pages

| Fichier | Description |
|---------|-------------|
| `src/pages/Tombola.tsx` | Page principale de la tombola |

### Nouveaux composants

| Fichier | Description |
|---------|-------------|
| `src/components/tombola/TombolaHero.tsx` | Hero section avec titre et description |
| `src/components/tombola/ParticipantGrid.tsx` | Grille du trombinoscope (vue publique) |
| `src/components/tombola/ParticipantForm.tsx` | Formulaire d'inscription participant |
| `src/components/tombola/ParticipantCard.tsx` | Carte individuelle participant |
| `src/components/tombola/ParticipantSelector.tsx` | Sélecteur "Je suis..." (floating) |
| `src/components/tombola/LotGrid.tsx` | Grille des lots disponibles |
| `src/components/tombola/LotForm.tsx` | Formulaire d'ajout de lot |
| `src/components/tombola/LotCard.tsx` | Carte lot avec réservation et contact |
| `src/components/tombola/SolidaritySection.tsx` | Section esprit solidaire |

### Nouveaux hooks

| Fichier | Description |
|---------|-------------|
| `src/hooks/useTombolaParticipants.ts` | CRUD participants (vue publique sans email) |
| `src/hooks/useTombolaLots.ts` | CRUD lots + fonction getContactLink |

### Nouvelles Edge Functions

| Fichier | Description |
|---------|-------------|
| `supabase/functions/get-contact-link/index.ts` | Génère mailto sans exposer l'email |

### Nouvelles tables Supabase

| Table | Description |
|-------|-------------|
| `tombola_participants` | Participants avec email (protégé) |
| `tombola_participants_public` | Vue sans email (lecture publique) |
| `tombola_lots` | Lots proposés et réservations |

---

## 📧 Newsletter Admin

### Nouvelles pages

| Fichier | Description |
|---------|-------------|
| `src/pages/AdminNewsletter.tsx` | Interface d'administration newsletter |

### Nouveaux composants

| Fichier | Description |
|---------|-------------|
| `src/components/admin/AdminLayout.tsx` | Wrapper avec auth + vérification admin |
| `src/components/admin/SubscribersList.tsx` | Liste des abonnés (recherche, toggle, delete) |
| `src/components/admin/NewsletterEditor.tsx` | Éditeur de newsletter (brouillon, preview, envoi) |
| `src/components/admin/NewsletterHistory.tsx` | Historique des newsletters envoyées |

### Nouveaux hooks

| Fichier | Description |
|---------|-------------|
| `src/hooks/useAdminAuth.ts` | Authentification Supabase + vérification rôle admin |
| `src/hooks/useNewsletterAdmin.ts` | CRUD newsletters et subscribers |
| `src/hooks/useNewsletterSubscription.ts` | Inscription publique newsletter |

### Nouvelles Edge Functions

| Fichier | Description |
|---------|-------------|
| `supabase/functions/send-newsletter/index.ts` | Envoi newsletter via Resend (auth + admin) |

### Nouvelles tables Supabase

| Table | Description |
|-------|-------------|
| `newsletter_subscribers` | Abonnés newsletter |
| `newsletters` | Historique des newsletters |
| `user_roles` | Rôles utilisateurs (admin/user) |

---

## 🔐 Sécurité

### Implémentations

| Élément | Description |
|---------|-------------|
| Supabase Auth | Authentification login/password |
| Table `user_roles` | Système de rôles séparé |
| Fonction `has_role()` | Vérification rôle en SQL (SECURITY DEFINER) |
| RLS Policies | Protection données sensibles (emails) |
| JWT Validation | Vérification token dans Edge Functions |
| Admin Check | Vérification rôle admin dans Edge Functions |
| XSS Protection | Sanitization `escapeHtml()` dans send-newsletter |
| Vue publique | `tombola_participants_public` sans email |

### Politiques RLS ajoutées

```sql
-- Newsletter subscribers
- "Admins can view subscribers" (SELECT)
- "Admins can update subscribers" (UPDATE)
- "Admins can delete subscribers" (DELETE)
- "Anyone can subscribe to newsletter" (INSERT avec consent=true)

-- Newsletters (admin uniquement)
- "Authenticated admins can view/insert/update/delete newsletters"

-- Tombola participants (email protégé)
- "Admins can view all participant data" (SELECT)
- "Admins can update participants" (UPDATE - admin only)
- "Admins can delete participants" (DELETE - admin only)
- "Authenticated users can insert participants" (INSERT)

-- Tombola lots
- "Anyone can view lots" (SELECT)
- "Authenticated users can insert their own lots" (INSERT - vérifie parent_id existe)
- "Only admins can update lots" (UPDATE - admin only)
- "Admins can delete lots" (DELETE - admin only)

-- User roles
- "Admins can view all roles"
```

---

## 📝 Documentation

| Fichier | Description |
|---------|-------------|
| `docs/prompt-admin-newsletter.md` | Guide original admin newsletter |
| `docs/prompt-copilot-fullstack.md` | Guide complet Newsletter + Tombola |
| `docs/CHANGELOG-tombola-features.md` | Ce fichier |

---

## ⚙️ Configuration

### supabase/config.toml

```toml
project_id = "votre_project_id"

[functions.send-newsletter]
verify_jwt = false

[functions.get-contact-link]
verify_jwt = false
```

### Secrets requis

| Secret | Usage |
|--------|-------|
| `RESEND_API_KEY` | Envoi emails via Resend |

---

## 🛣️ Routes ajoutées

| Route | Description |
|-------|-------------|
| `/tombola` | Page trombinoscope et lots |
| `/admin/newsletter` | Administration newsletter |

---

## 📦 Dépendances utilisées

Aucune nouvelle dépendance ajoutée - utilise le stack existant :
- React + TypeScript
- Tailwind CSS + shadcn-ui
- framer-motion
- @supabase/supabase-js
- react-router-dom

---

## 🔄 Flux de données

### Tombola

```
[Page Tombola]
    ↓
[ParticipantForm] → INSERT tombola_participants
    ↓
[ParticipantGrid] ← SELECT FROM tombola_participants_public (sans email)
    ↓
[ParticipantSelector] → Sélection identité locale
    ↓
[LotForm] → INSERT tombola_lots (avec parent_id)
    ↓
[LotGrid] ← SELECT FROM tombola_lots + JOIN vue publique
    ↓
[LotCard.handleContact] → Edge Function get-contact-link
    ↓
[Edge Function] → mailto:email (email jamais exposé au client)
```

### Newsletter

```
[Page Accueil]
    ↓
[NewsletterSection] → INSERT newsletter_subscribers (public, consent=true)

[Page Admin]
    ↓
[AdminLayout] → Supabase Auth + vérification has_role('admin')
    ↓
[SubscribersList] ← SELECT FROM newsletter_subscribers (RLS admin)
    ↓
[NewsletterEditor] → INSERT/UPDATE newsletters
    ↓
[Bouton Envoyer] → Edge Function send-newsletter (JWT + admin check)
    ↓
[Edge Function] → Resend API → Emails envoyés
```

---

## ✅ Checklist d'intégration

Pour reproduire ces fonctionnalités dans un autre projet :

### 1. Base de données
- [ ] Créer table `user_roles` avec enum `app_role`
- [ ] Créer fonction `has_role()` (SECURITY DEFINER)
- [ ] Créer tables `newsletter_subscribers`, `newsletters`
- [ ] Créer tables `tombola_participants`, `tombola_lots`
- [ ] Créer vue `tombola_participants_public`
- [ ] Activer RLS sur toutes les tables
- [ ] Créer les politiques RLS

### 2. Edge Functions
- [ ] Créer `send-newsletter` avec auth + admin check + XSS
- [ ] Créer `get-contact-link` avec auth
- [ ] Configurer `config.toml` avec `verify_jwt = false`

### 3. Frontend
- [ ] Créer composants admin avec `AdminLayout`
- [ ] Créer hooks d'authentification (`useAdminAuth`)
- [ ] Créer hooks métier (`useNewsletterAdmin`, `useTombolaLots`, etc.)
- [ ] Ajouter routes dans `App.tsx`

### 4. Secrets
- [ ] Configurer `RESEND_API_KEY` dans Supabase secrets

### 5. Premier admin
- [ ] S'inscrire via l'interface
- [ ] Ajouter manuellement le rôle admin en SQL
