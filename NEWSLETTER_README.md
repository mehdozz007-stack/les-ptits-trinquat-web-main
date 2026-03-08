# 📧 Newsletter System - Les P'tits Trinquât

> Un système de newsletter complètement sécurisé avec authentification, autorisation et protection XSS.

## 🎯 Vue d'Ensemble

Ce système permet à l'association de:
1. **Gérer les abonnés** à la newsletter de manière sécurisée
2. **Créer et envoyer** des newsletters aux parents
3. **Protéger les données** avec authentification et RLS
4. **Permettre l'inscription publique** avec consentement RGPD

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React Frontend                        │
├────────────────────────────────────────────────────────┤
│ NewsletterSubscription (Public)                         │
│ AdminNewsletter (Protected by AdminLayout)             │
│ - NewsletterEditor (Create drafts)                      │
│ - SubscribersList (Manage subscribers)                  │
│ - NewsletterHistory (View & send emails)              │
└────────────────────────────────────────────────────────┘
              ↓
         Supabase Auth
              ↓
┌────────────────────────────────────────────────────────┐
│            Supabase Backend                             │
├────────────────────────────────────────────────────────┤
│ Tables:                                                │
│ - newsletter_subscribers (with RLS)                    │
│ - newsletters (with RLS)                               │
│ - user_roles (admin only)                              │
│                                                        │
│ Functions:                                             │
│ - has_role() (security definer)                        │
│                                                        │
│ Edge Functions:                                        │
│ - send-newsletter (Deno + JWT verification)           │
└────────────────────────────────────────────────────────┘
              ↓
         Resend API
              ↓
     📧 Emails envoyés aux abonnés
```

## 📁 Structure des Fichiers

```
les-ptits-trinquat-web-main/
├── supabase/
│   ├── config.toml                              # Configuration Supabase
│   ├── functions/
│   │   └── send-newsletter/
│   │       └── index.ts                         # Edge Function (Deno)
│   └── migrations/
│       └── 20260117000000_init_newsletter_tables.sql
│
├── src/
│   ├── hooks/
│   │   ├── admin/
│   │   │   ├── useAdminAuth.ts                 # Auth + role check
│   │   │   ├── useNewsletterAdmin.ts           # CRUD operations
│   │   │   └── useNewsletterSubscription.ts    # Public subscription
│   │   └── ...
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx                 # Protection auth
│   │   │   └── newsletter/
│   │   │       ├── NewsletterEditor.tsx        # Create/Edit
│   │   │       ├── SubscribersList.tsx         # Manage subscribers
│   │   │       └── NewsletterHistory.tsx       # Send & view history
│   │   │
│   │   └── newsletter/
│   │       └── NewsletterSubscription.tsx      # Public signup form
│   │
│   ├── lib/
│   │   └── supabase.ts                         # Supabase client
│   │
│   └── pages/
│       └── AdminNewsletter.tsx                 # Admin dashboard
│
├── IMPLEMENTATION_NEWSLETTER.md                 # Guide complet setup
├── SECURITY.md                                  # Architecture sécurité
├── TESTING_GUIDE.md                            # Tests complets
├── .env.example                                # Variables d'env
├── setup-newsletter.sh                         # Script installation
└── README.md                                   # Ce fichier
```

## ⚡ Démarrage Rapide

### 1. Configuration Supabase

```bash
# Clone le repo
git clone <repo>
cd les-ptits-trinquat-web-main

# Copier les env
cp .env.example .env.local

# Éditer .env.local avec vos clés Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key
```

### 2. Créer les Tables

```bash
# Ouvrir Supabase SQL Editor et exécuter:
# supabase/migrations/20260117000000_init_newsletter_tables.sql
```

### 3. Déployer la Edge Function

```bash
supabase functions deploy send-newsletter --project-id your-project-id
```

### 4. Configurer les Secrets

```bash
# Ajouter via Supabase Dashboard > Settings > Secrets
RESEND_API_KEY=re_your_key
```

### 5. Créer le Premier Admin

```sql
-- Dans Supabase SQL Editor
INSERT INTO user_roles (user_id, role)
VALUES ('user-id-from-auth-users', 'admin');
```

### 6. Tester

```bash
npm run dev

# Visiter:
# - Inscription newsletter: http://localhost:5173/
# - Admin dashboard: http://localhost:5173/admin/newsletter
```

## 🔐 Sécurité

Tous les éléments de sécurité sont implémentés:

- ✅ **JWT Validation** - Vérification du token dans Edge Function
- ✅ **Role-Based Access** - Admin check systématique
- ✅ **RLS Policies** - Contrôle d'accès aux données
- ✅ **XSS Protection** - Sanitization des inputs
- ✅ **HTTPS Only** - Communication sécurisée
- ✅ **Secrets Management** - Clés non exposées au client

Voir [SECURITY.md](./SECURITY.md) pour les détails complets.

## 📚 Documentation

| Document | Contenu |
|----------|---------|
| [IMPLEMENTATION_NEWSLETTER.md](./IMPLEMENTATION_NEWSLETTER.md) | Configuration complète et déploiement |
| [SECURITY.md](./SECURITY.md) | Architecture sécurité et threat model |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Guide de test complet avec checklist |
| [.env.example](./.env.example) | Variables d'environnement requises |

## 🧪 Tests

Voir [TESTING_GUIDE.md](./TESTING_GUIDE.md) pour les 15 tests complets.

Quick test:
```bash
npm run dev

# Test 1: Inscription newsletter
# Aller à / et s'abonner

# Test 2: Admin login
# Aller à /admin/newsletter et créer un compte

# Test 3: Créer une newsletter
# Remplir le formulaire et vérifier dans "Historique"

# Test 4: Envoyer une newsletter
# Cliquer "Envoyer" et vérifier les logs
```

## 📧 Flux de Travail Typique

### Pour un Parent (Public)
```
1. Visite la page d'accueil
2. Voit le formulaire d'inscription newsletter
3. Entre email + prénom
4. Coche "J'accepte de recevoir"
5. Clique "S'abonner"
6. Reçoit les newsletters à l'avenir
```

### Pour un Admin
```
1. Accède à /admin/newsletter
2. Crée un compte (première fois) ou se connecte
3. Admins: Crée une newsletter avec titre/sujet/contenu
4. Peut visualiser un aperçu HTML
5. Sauvegarde le brouillon
6. Envoi aux abonnés actifs
7. Voit confirmation d'envoi et statistiques
8. Peut gérer les abonnés (désactiver, supprimer)
9. Historique garde trace de tous les envois
```

## 🚀 Production

Avant de publier:

1. [ ] Vérifier toutes les variables d'env
2. [ ] Tester avec vraies adresses email (Resend)
3. [ ] Configurer domaine d'envoi (SPF, DKIM)
4. [ ] Audit de sécurité complété
5. [ ] Backup Supabase activé
6. [ ] Monitoring mis en place
7. [ ] RGPD/Privacy policy à jour

Voir [IMPLEMENTATION_NEWSLETTER.md](./IMPLEMENTATION_NEWSLETTER.md#-production) pour checklist complète.

## 🆘 Support

### Problèmes Courants
- **"Admin access required"** → Rôle admin non assigné
- **"RESEND_API_KEY not found"** → Secret non configuré
- **Emails ne s'envoient pas** → Vérifier Resend logs
- **RLS policy issue** → Vérifier migration SQL exécutée

Voir [TESTING_GUIDE.md#-debugging](./TESTING_GUIDE.md#-debugging) pour solutions détaillées.

### Resources
- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## 📝 Maintenance

Vérifications régulières:
- Monthly: Revoir les logs (anomalies, performances)
- Quarterly: Audit de sécurité
- As needed: Backups, updates, monitoring

## 📄 Licence

Copyright © 2026 Les P'tits Trinquât. Tous droits réservés.

---

**Créé avec ❤️ pour l'Association Les P'tits Trinquât**

Dernière mise à jour: 17 janvier 2026
