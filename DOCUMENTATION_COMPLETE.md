# 📚 DOCUMENTATION COMPLÈTE - Les P'tits Trinquat

**Dernière mise à jour**: 18 Juillet 2026  
**Status**: ✅ **PRODUCTION READY**  
**Version**: 2.0 (Consolidated)

---

## 📋 TABLE DES MATIÈRES

1. [Démarrage Rapide](#démarrage-rapide)
2. [Vue d'Ensemble du Projet](#vue-densemble-du-projet)
3. [Architecture Complète](#architecture-complète)
4. [Configuration & Installation](#configuration--installation)
5. [Utilisation - Admin](#utilisation---admin)
6. [Système Newsletter](#système-newsletter)
7. [Système Tombola](#système-tombola)
8. [Migration Base de Données - Production](#migration-base-de-données---production)
9. [Implémentation Détaillée - Newsletter](#implémentation-détaillée---newsletter)
10. [Implémentation Détaillée - Tombola](#implémentation-détaillée---tombola)
11. [Sécurité & Protection](#sécurité--protection)
12. [Déploiement Production](#déploiement-production)
13. [Tests & Validation](#tests--validation)
14. [Troubleshooting & FAQ](#troubleshooting--faq)
15. [Monitoring & Analytics](#monitoring--analytics)
16. [Commandes Utiles](#commandes-utiles)

---

# 🚀 DÉMARRAGE RAPIDE

## Installation Immédiate

### 1️⃣ Lancer le serveur
```bash
cd c:\workspaceMZ\les-ptits-trinquat-web-main
npm run dev
```

### 2️⃣ Accéder au site
- **Site Principal**: http://localhost:8081/
- **Admin Newsletter**: http://localhost:8081/admin/newsletter

### 3️⃣ Services
| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:8081 | ✅ Live |
| API (Cloudflare) | https://les-ptits-trinquat-api.mehdozz007.workers.dev | ✅ Prod |
| Supabase | https://ybzrbrjdzncdolczyvxz.supabase.co | ✅ Connected |
| Umami Analytics | https://cloud.umami.is | ✅ Active |

---

# 📊 VUE D'ENSEMBLE DU PROJET

## ✅ Ce Qui Fonctionne

| Feature | Status | Notes |
|---------|--------|-------|
| Site Principal | ✅ Live | Accueil, pages, contact |
| Newsletter Subscription | ✅ Live | Formulaire public + RGPD |
| Admin Dashboard | ✅ Live | Gestion abonnés/newsletters |
| Tombola | ✅ Live | Participants + Lots + Réservations |
| Database | ✅ Connected | Supabase PostgreSQL + Cloudflare D1 |
| Authentication | ✅ Active | Supabase Auth + JWT |
| Email Sending | ✅ Ready | Resend API |
| Responsive Design | ✅ Live | Mobile/Tablet/Desktop |
| Analytics | ✅ Live | Umami (RGPD-compliant) |

## Stack Technologique

### Frontend
- **Framework**: React 19 + TypeScript
- **Build**: Vite 7.2.7
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **Router**: React Router v6

### Backend
- **API**: Cloudflare Workers (Hono)
- **Database**: 
  - Supabase (PostgreSQL) - Newsletter/Admin
  - Cloudflare D1 (SQLite) - Tombola
- **Email**: Resend API
- **Auth**: JWT + Supabase Auth
- **Monitoring**: Umami Analytics

### Infrastructure
- **Hosting**: Cloudflare Pages (Frontend) + Cloudflare Workers (API)
- **CDN**: Cloudflare Global Network
- **Repository**: GitHub

---

# 🏗️ ARCHITECTURE COMPLÈTE

## Flux Global

```
┌─────────────────────────────────────────────────────────┐
│                   UTILISATEUR (Browser)                 │
│  https://www.lespetitstrinquat.fr                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ↓
┌─────────────────────────────────────────────────────────┐
│              CLOUDFLARE PAGES (Frontend)                 │
│  - React App (SSG)                                       │
│  - Assets statiques                                      │
│  - Redirects (_redirects, _routes.json)                │
└────────────────────┬────────────────────────────────────┘
                     │ /api/* proxy
                     ↓
┌─────────────────────────────────────────────────────────┐
│         CLOUDFLARE WORKERS (Backend API)                 │
│  https://les-ptits-trinquat-api.mehdozz007.workers.dev   │
│  - Hono Framework                                        │
│  - CORS Middleware                                       │
│  - JWT Authentication                                    │
│  - Rate Limiting                                         │
└────────────────┬──────────────────────┬─────────────────┘
                 │                      │
                 ↓                      ↓
         ┌──────────────┐       ┌──────────────┐
         │ SUPABASE     │       │ CLOUDFLARE   │
         │ (PostgreSQL) │       │ D1 (SQLite)  │
         │              │       │              │
         │ • Users      │       │ • Tombola    │
         │ • Sessions   │       │ • Lots       │
         │ • Newsletters│       │ • Auctions   │
         │ • Audit Logs │       │              │
         └──────────────┘       └──────────────┘
```

## Endpoints API

### Newsletter
```
POST   /api/newsletter/subscribe      - S'inscrire
POST   /api/newsletter/unsubscribe    - Se désabonner
GET    /api/newsletter/subscribers    - Liste (admin)
POST   /api/newsletter/send           - Envoyer (admin)
DELETE /api/newsletter/subscribers/:id - Supprimer (admin)
```

### Tombola
```
GET    /api/tombola/participants      - Liste participants
POST   /api/tombola/participants      - Ajouter participant
GET    /api/tombola/lots              - Liste lots
POST   /api/tombola/lots              - Ajouter lot
POST   /api/tombola/reservations      - Réserver lot
GET    /api/health                    - Health check
```

### Auth
```
POST   /api/auth/login                - Connexion admin
POST   /api/auth/logout               - Déconnexion
GET    /api/auth/me                   - Infos utilisateur
POST   /api/auth/refresh              - Rafraîchir token
```

---

# ⚙️ CONFIGURATION & INSTALLATION

## Pré-requis

- **Node.js**: v18+ (vérifier: `node -v`)
- **npm**: v9+ (vérifier: `npm -v`)
- **Git**: (vérifier: `git -v`)
- **Compte Supabase**: https://supabase.com
- **Compte Cloudflare**: https://cloudflare.com

## Installation Locale

### Étape 1: Cloner le repository
```bash
git clone https://github.com/mehdozz007/les-ptits-trinquat-web-main.git
cd les-ptits-trinquat-web-main
```

### Étape 2: Installer les dépendances
```bash
# Frontend
npm install

# Backend
cd cloudflare
npm install
cd ..
```

### Étape 3: Configurer les variables d'environnement

**Fichier: `.env.local` (à créer)**
```env
# SUPABASE
VITE_SUPABASE_URL=https://ybzrbrjdzncdolczyvxz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# API
VITE_API_URL=http://localhost:8787/api

# CLOUDFLARE
CLOUDFLARE_ACCOUNT_ID=votre_account_id
CLOUDFLARE_API_TOKEN=votre_api_token
```

### Étape 4: Lancer les serveurs

**Terminal 1 - Backend**:
```bash
cd cloudflare
npm run dev
# ➜ http://localhost:8787
```

**Terminal 2 - Frontend**:
```bash
npm run dev
# ➜ http://localhost:8081
```

---

# 👤 UTILISATION - ADMIN

## Accéder à l'Admin

1. **URL**: http://localhost:8081/admin/newsletter
2. **Email**: Votre email admin
3. **Password**: Votre mot de passe

## Dashboard Admin

### Section 1: Gestion des Abonnés

**Vue d'ensemble**:
```
👥 Abonnés: 1,523
├─ Actifs: 1,450
├─ Inactifs: 73
└─ Dernière inscription: 15 Juillet 2026
```

**Actions disponibles**:
- 🔍 Rechercher par email ou prénom
- ➕ Ajouter manuellement
- ⚙️ Modifier le statut
- 🗑️ Supprimer
- 📥 Export CSV

### Section 2: Créer une Newsletter

**Formulaire**:
```
Sujet: [Texte]
Destinataires: [Tous / Groupe sélectionné]
Contenu: [Éditeur HTML riche]
Options:
  ☐ Envoyer immédiatement
  ☐ Garder en brouillon
  ☐ Programmer pour plus tard
```

**Étapes**:
1. Écrire le sujet
2. Composer le contenu
3. Prévisualiser
4. Tester avec votre email
5. Envoyer ou sauvegarder

### Section 3: Historique des Envois

**Affiche**:
```
Newsletter | Date | Destinataires | Status
-----------|------|---------------|-------
"Nouvelle rentrée" | 15/07 | 1,450 | ✅ Envoyé
"Fête d'école" | 08/07 | 1,430 | ✅ Envoyé
"Appel à dons" | 01/07 | 1,400 | ⏳ Brouillon
```

---

# 📧 SYSTÈME NEWSLETTER

## Architecture Newsletter

### Frontend (React)
```
NewsletterSubscription.tsx
├─ Formulaire d'inscription
├─ Validation email + consentement RGPD
└─ useNewsletterSubscription hook

AdminNewsletter.tsx
├─ NewsletterEditor (Créer)
├─ SubscribersList (Gérer)
└─ NewsletterHistory (Envoyer)
```

### Backend (Cloudflare)
```
routes/newsletter.ts
├─ POST /subscribe - Inscription
├─ DELETE /unsubscribe - Désabonnement
├─ POST /send - Envoi (admin)
├─ GET /subscribers - Liste (admin)
└─ GET /subscriber/:id - Détail (admin)
```

### Database (Supabase)

**Table: newsletter_subscribers**
```sql
id          UUID PRIMARY KEY
email       TEXT UNIQUE NOT NULL
first_name  TEXT
is_active   BOOLEAN DEFAULT true
consent     BOOLEAN DEFAULT false
created_at  TIMESTAMP DEFAULT now()
updated_at  TIMESTAMP DEFAULT now()
```

**Table: newsletters**
```sql
id          UUID PRIMARY KEY
subject     TEXT NOT NULL
content     TEXT NOT NULL
sent_count  INTEGER DEFAULT 0
status      ENUM (draft, sent, scheduled)
created_at  TIMESTAMP DEFAULT now()
sent_at     TIMESTAMP
```

## Flux d'Inscription

```
1. Utilisateur accède au site
   ↓
2. Scroll vers la newsletter
   ↓
3. Remplit: Email + Prénom
   ↓
4. Coche: "J'accepte de recevoir..."
   ↓
5. Clique "S'abonner"
   ↓
6. Frontend envoie: POST /api/newsletter/subscribe
   ↓
7. Backend valide et insère en DB
   ↓
8. Toast de confirmation s'affiche
   ↓
9. Email reçoit confirmation d'inscription
```

## Sécurité Newsletter

### RGPD Compliant
✅ Consentement explicite requis  
✅ Droit à l'oubli (droit de suppression)  
✅ Lien de désabonnement dans chaque email  
✅ Données stockées sécurisées  
✅ Audit logs de tous les envois  

### Validations
```javascript
// Email valide
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Consentement obligatoire
if (!consent) throw new Error('Consent required');

// Email unique
SELECT * FROM newsletter_subscribers WHERE email = ?
if (exists) throw new Error('Email already subscribed');

// Limite de débit
Rate limit: 10 inscriptions/minute par IP
```

---

# 🎊 SYSTÈME TOMBOLA

## Vue d'Ensemble Tombola

**Qu'est-ce que c'est?**
Un système d'échange de lots entre parents de l'école. Les participants proposent des lots, les autres les réservent.

**Fonctionnalités**:
- ✅ Inscription de participants
- ✅ Proposition de lots
- ✅ Réservation de lots
- ✅ Liste publique (sans données sensibles)
- ✅ Gestion admin (avec données complètes)

## Architecture Tombola

### Frontend
```
TombolaProtected.tsx (Page principale)
├─ TombolaParticipants (Inscription)
├─ TombolaLots (Proposer lots)
├─ LotsList (Liste publique)
└─ ReservationForm (Réserver)

AdminTombola.tsx (Admin)
├─ ParticipantsList (Gestion)
├─ LotsList (Tous les lots)
└─ ReservationsList (Toutes réservations)
```

### Backend (Cloudflare D1)
```
routes/tombola.ts
├─ GET /participants - Liste publique
├─ POST /participants - Ajouter participant
├─ GET /lots - Liste publique
├─ POST /lots - Proposer lot
├─ POST /reservations - Réserver lot
└─ DELETE /reservations/:id - Annuler réservation
```

### Database (D1 SQLite)

**Table: tombola_participants**
```sql
id          UUID PRIMARY KEY
name        TEXT NOT NULL
email       TEXT NOT NULL UNIQUE
phone       TEXT
emoji       TEXT (🌟 emoji choisi)
created_at  TIMESTAMP DEFAULT now()
```

**Table: tombola_lots**
```sql
id          UUID PRIMARY KEY
name        TEXT NOT NULL
description TEXT
emoji       TEXT
reserved_by UUID REFERENCES tombola_participants
proposed_by UUID REFERENCES tombola_participants
created_at  TIMESTAMP
reserved_at TIMESTAMP
```

## Flux Tombola

```
PARTICIPANT:
1. Inscription → Propose lot 1 + lot 2
   ↓
2. Lot 1 est réservé par Participant B
   ↓
3. Participant B peut contacter le proposant
   ↓
4. Remise du lot

ADMIN:
1. Voir tous les participants
2. Voir tous les lots proposés + réservés
3. Voir les contacts
4. Gérer les remises
5. Export CSV si besoin
```

## Sécurité Tombola

### Protection Authentification
```
/tombola → Non authentifiée (consultation)
/admin/tombola → Admin seulement
```

### Données Publiques vs Privées
```
PUBLIQUE:
- Nom du participant
- Emoji
- Lot proposé
- Lot réservé

PRIVÉ (Admin seulement):
- Email
- Téléphone
- Qui a réservé quel lot
```

### Rate Limiting
```
Registrations: 5 par IP par jour
Lot proposals: 10 par participant
```

---

# � MIGRATION BASE DE DONNÉES - PRODUCTION

## 📋 Vue d'Ensemble

**Date**: Février 2026  
**Application**: Les P'tits Trinquat - Tombola  
**Environnement Cible**: Cloudflare D1 (SQLite)

Après plusieurs itérations de développement, la base de données a été complètement restructurée pour supporter:
- ✅ L'authentification utilisateur sécurisée (Bearer tokens)
- ✅ Un système de rôles (admin/user)
- ✅ Les sessions avec expiration
- ✅ La gestion des participants et lots de tombola
- ✅ Un système d'audit complet (compliance)
- ✅ Le droit à l'oubli (suppression des données utilisateur)

## 🗄️ Schéma de Base de Données

### Tables Principales

```
┌──────────────┐      ┌──────────────┐
│    USERS     │◄─────│ USER_ROLES   │
│ (Auth)       │      │ (Rôles)      │
└──────────────┘      └──────────────┘

┌──────────────────────────────────────────┐
│           SESSIONS (Auth/Tokens)         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│   TOMBOLA_PARTICIPANTS (Participants)    │
└──────────────────────────────────────────┘
        ↓ 1:N
┌──────────────────────────────────────────┐
│     TOMBOLA_LOTS (Lots de Tombola)      │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│       AUDIT_LOGS (Journalisation)        │
└──────────────────────────────────────────┘
```

### Détail des Tables

**USERS**: Gestion des utilisateurs avec sécurité renforcée
- `id` (UUID) - Identifiant unique
- `email` (UNIQUE) - Email case-insensitive
- `password_hash` - Password sécurisé
- `is_active` - Soft-delete
- `last_login_at` - Suivi connexions

**USER_ROLES**: Système de rôles
- `id` (UUID)
- `user_id` - Foreign Key vers USERS (CASCADE)
- `role` - 'admin' ou 'user'

**SESSIONS**: Gestion des tokens Bearer
- `id` (UUID)
- `user_id` - Foreign Key vers USERS (CASCADE)
- `token` - Bearer token unique
- `expires_at` - Expiration (défaut: 7 jours)

**TOMBOLA_PARTICIPANTS**: Participants à la tombola
- `id` (UUID)
- `user_id` - Foreign Key vers USERS (CASCADE)
- `email`, `prenom`, `classes`, `emoji`

**TOMBOLA_LOTS**: Catalogue des lots
- `id` (UUID)
- `parent_id` - Qui propose
- `reserved_by` - Qui réserve (nullable)
- `statut` - 'disponible', 'reserve', 'remis'

**AUDIT_LOGS**: Trace complète des actions
- `id` (UUID)
- `user_id` - Qui a fait l'action
- `action` - Type d'action
- `details` - JSON avec détails
- `created_at` - Timestamp

## 🚀 Migrations à Appliquer

### Ordre d'Exécution

```bash
# 1. Créer le schéma de base
0001_tombola_schema.sql

# 2. Améliorer la table users
0010_enhance_users_table.sql

# 3. Initialiser les données de production
# Créer compte admin par défaut
# Initialiser les seeders
```

## 🔄 Flux d'Authentification

### 1. Inscription (REGISTER)
```sql
INSERT INTO users (id, email, password_hash, is_active)
VALUES (?, ?, SHA256(?), 1);

INSERT INTO user_roles (id, user_id, role)
VALUES (?, ?, 'user');

INSERT INTO sessions (id, user_id, token, expires_at)
VALUES (?, ?, ?, now() + 7 days);
```

### 2. Connexion (LOGIN)
```sql
SELECT * FROM users WHERE email = ? AND is_active = 1
-- Vérifier password_hash
-- Créer une SESSION
-- Logger l'action
```

### 3. Suppression de Compte
```sql
BEGIN TRANSACTION;
-- 1. Lots supprimés (CASCADE)
-- 2. Participations supprimées (CASCADE)
-- 3. Sessions supprimées (CASCADE)
-- 4. Rôles supprimés (CASCADE)
-- 5. Logs supprimés (manuellement)
-- 6. Utilisateur supprimé (CASCADE)
DELETE FROM users WHERE id = ?
COMMIT;
```

## 📊 Stockage Estimé

| Table | Rows | Taille | Notes |
|-------|------|--------|-------|
| USERS | 200 | ~50 KB | 1 record = 250 bytes |
| USER_ROLES | 200 | ~10 KB | 1 role par user |
| SESSIONS | ~1000 | ~100 KB | Plusieurs sessions |
| TOMBOLA_PARTICIPANTS | 200 | ~50 KB | 1:1 avec users |
| TOMBOLA_LOTS | 1500 | ~150 KB | ~7.5 par participant |
| AUDIT_LOGS | 50000 | ~5 MB | ~250 par user |
| **TOTAL** | **~53000** | **~5.3 MB** | Très efficace |

## ✅ Points de Contrôle Production

**Avant le déploiement**:
- [ ] Toutes les migrations exécutées dans l'ordre
- [ ] Admin par défaut créé
- [ ] SERVICE_DURATION configuré (7 jours)
- [ ] WRANGLER_ENV = production
- [ ] D1_DATABASE_ID pointé vers production

**Après le déploiement**:
- [ ] Tester inscription
- [ ] Tester connexion
- [ ] Vérifier rate limiting
- [ ] Vérifier audit logs

---

# 🛠️ IMPLÉMENTATION DÉTAILLÉE - NEWSLETTER

## Configuration Requise

### Variables d'Environnement (.env.local)

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email
RESEND_API_KEY=re_your_key_here
```

## Déployer l'Edge Function

```bash
# S'assurer que vous êtes dans le dossier du projet
cd /chemin/vers/les-ptits-trinquat-web-main

# Installer Supabase CLI si nécessaire
npm install -g @supabase/cli

# Déployer la fonction
supabase functions deploy send-newsletter --project-id your-project-id

# Vérifier les logs
supabase functions list --project-id your-project-id
```

## Système de Sécurité - RLS

```
┌─────────────────────────────────────────┐
│         PUBLIC (non-authentifié)        │
│  ✅ Peut s'abonner à la newsletter      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       AUTHENTIFIÉ (a un compte)         │
│  ✅ JWT vérifié dans Edge Function      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    ADMIN (table user_roles = admin)     │
│  ✅ Peut gérer les newsletters          │
│  ✅ Peut voir les abonnés               │
│  ✅ Peut envoyer les emails             │
└─────────────────────────────────────────┘
```

### Points de Sécurité Implémentés

1. ✅ **JWT Validation** - Chaque Edge Function valide le JWT
2. ✅ **Admin Role Check** - Vérification rôle admin
3. ✅ **XSS Protection** - Fonction `escapeHtml()` sur inputs
4. ✅ **RLS Policies** - Limite l'accès aux données
5. ✅ **CORS Headers** - Tous les endpoints sécurisés

## Tester le Système

### Test 1: Inscription Newsletter (Public)
1. Aller à `/` (page d'accueil)
2. Remplir le formulaire d'inscription
3. Vérifier que l'email est ajouté en DB

### Test 2: Connexion Admin
1. Aller à `/admin/newsletter`
2. S'inscrire avec email/password
3. Attribuer le rôle admin via SQL
4. Se reconnecter pour accéder au panel

### Test 3: Créer une Newsletter
1. Aller à l'onglet "Créer"
2. Remplir titre, sujet, contenu
3. Vérifier le brouillon dans "Historique"

### Test 4: Envoyer une Newsletter
1. Aller à "Historique"
2. Cliquer sur "Envoyer"
3. Vérifier les logs Supabase

## Troubleshooting Newsletter

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Admin access required" | Pas de rôle admin | Exécuter SQL d'attribution |
| "RESEND_API_KEY not found" | Clé non configurée | Ajouter dans secrets Supabase |
| "Invalid authentication" | JWT expiré | Se reconnecter |
| Emails ne s'envoient pas | Adresse "from" non vérifiée | Vérifier sur Resend |

---

# 🎊 IMPLÉMENTATION DÉTAILLÉE - TOMBOLA

## Contraintes Métier Implémentées

### 1️⃣ Isolation totale entre participants ✓
- Hook `useCurrentUser` génère ID utilisateur unique
- API `/api/tombola/participants/my` filtre par `user_id`
- API `/api/tombola/lots/my` filtre les données
- Validation backend obligatoire

### 2️⃣ ParticipantSelector.tsx (CRITIQUE) ✓
- Affiche UNIQUEMENT les participants de l'utilisateur actuel
- Utilise `useCurrentUser` pour récupérer `user_id`
- Appelle `fetchMyParticipants(userId)` pour filtrer
- Affichage "Vos participants"

### 3️⃣ Règles d'accès aux boutons des lots ✓

**Lot "disponible"**:
- ✅ Tous les utilisateurs: Bouton "Réserver" (sauf propriétaire)
- ✅ Propriétaire: Bouton "Supprimer"
- ✅ Sans profil: Message "Sélectionnez votre profil"

**Lot "réservé"**:
- ✅ Réservataire: Bouton "Contacter"
- ✅ Propriétaire: Boutons "Marquer remis" + "Supprimer"
- ✅ Autres: Message "Lot réservé"

**Lot "remis"**:
- ✅ Propriétaire et réservataire: Visible sans actions
- ✅ Autres: Message "Lot remis"

### 4️⃣ Sécurité backend obligatoire ✓
- `POST /tombola/participants` - Associe `user_id`
- `POST /tombola/lots/:id/mark-remis` - Vérifie ownership
- `DELETE /tombola/lots/:id` - Valide `user_id` + `parent_id`
- Refus 403 si non autorisé

### 5️⃣ Synchronisation temps réel ✓
- Context `TombolaRefreshContext` - Gère refresh global
- `triggerRefresh()` appelée après chaque mutation
- Refetch automatique après:
  - Création/suppression participant
  - Réservation/changement statut lot
  - Marquage comme remis

## Fichiers Modifiés

### Frontend
| Fichier | Modification |
|---------|-------------|
| `src/hooks/useCurrentUser.ts` | ✨ Gestion `user_id` client |
| `src/hooks/useTombolaParticipants.ts` | Ajout `fetchMyParticipants()` |
| `src/hooks/useTombolaLots.ts` | Passage `user_id` |
| `src/components/tombola/ParticipantSelector.tsx` | Filtre par `user_id` |
| `src/components/tombola/LotCard.tsx` | Logique visibilité complète |

### Backend (Cloudflare Workers)
| Fichier | Modification |
|---------|-------------|
| `cloudflare/src/routes/tombola.ts` | 3 nouvelles routes sécurisées |
| `cloudflare/src/types.ts` | Ajout `user_id?` |
| `cloudflare/src/middleware/auth.ts` | Fix TypeScript |

## Nouvelles Routes API

### 1. GET `/api/tombola/participants/my?user_id=...` (SÉCURISÉE)
Retourne uniquement les participants créés par cet user_id

### 2. GET `/api/tombola/lots/my?user_id=...` (SÉCURISÉE)
Retourne uniquement les lots des participants de cet user_id

### 3. Modifications de routes existantes
- `POST /tombola/participants` - Sauvegarde `user_id`
- `POST /tombola/lots/:id/mark-remis` - Valide `user_id`
- `DELETE /tombola/lots/:id` - Valide `user_id`

## Vérifications Sécurité Production

### 1. Isolation user_id ✓
```bash
curl "https://api.example.com/api/tombola/participants/my?user_id=USER_1"
# Chaque user_id doit voir SEULEMENT SES données
```

### 2. Validation ownership lots ✓
```bash
curl -X DELETE "https://api.example.com/api/tombola/lots/LOT_ID" \
  -H "Content-Type: application/json" \
  -d '{"parent_id":"P1", "user_id":"WRONG_USER"}'
# Doit retourner 403 Unauthorized
```

### 3. Filtrage backend ✓
```bash
curl "https://api.example.com/api/tombola/lots/my?user_id=USER_ID"
# Retourne SEULEMENT les lots de cet user_id
```

### 4. CORS configuré ✓
```bash
curl -I "https://api.example.com/api/tombola/participants" \
  -H "Origin: https://your-domain.com"
# Doit avoir Access-Control-Allow-Origin
```

## Monitoring Production

```bash
# Cloudflare Workers - Tail logs
npm run tail

# D1 Database - Vérifier participants
wrangler d1 execute tombola-db \
  --command "SELECT COUNT(*) FROM tombola_participants"
```

### Métriques à Vérifier
- ✅ Nombre de participants par user_id
- ✅ Distribution des lots (disponible/reserve/remis)
- ✅ Erreurs 403 Unauthorized
- ✅ Performance API (latence < 500ms)

## Dépannage Production

| Problème | Solution |
|----------|----------|
| Participants non filtrés | Vérifier `fetchMyParticipants()` |
| Bouton "Qui êtes-vous ?" caché | Enlever `hidden` de ParticipantSelector |
| Lots non synchronisés | Vérifier `triggerRefresh()` |
| Erreur 403 sur delete | Passer `user_id` en body JSON |
| localStorage ne persiste pas | Vérifier cookies autorisés |
| CORS error | Ajouter domaine dans Workers CORS |

---

# �🔐 SÉCURITÉ & PROTECTION

## 6 Couches de Sécurité

### Layer 1: Authentification
```
🔑 JWT Token Flow:
   - Login → Supabase Auth
   - Reçoit JWT token
   - Token stocké en localStorage
   - Token envoyé en header Authorization
   - Backend vérifie la signature JWT
```

### Layer 2: Autorisation (RBAC)
```
👤 Rôles:
   - public: Inscription newsletter, consultation tombola
   - admin: Accès dashboard, gestion abonnés, gestion tombola
   
🔍 Vérification:
   - Requête admin → Vérifie rôle = 'admin'
   - Sinon → Erreur 403 Forbidden
```

### Layer 3: Row Level Security (RLS)
```
🛡️ Supabase RLS Policies:
   - Publique: Peut insérer newsletter (avec consentement)
   - Admin: Peut lire/modifier tout
   - User: Peut voir seulement ses données

🛡️ Cloudflare D1 (D1 n'a pas RLS natif):
   - Vérification au niveau API
   - Logique d'autorisation en TypeScript
```

### Layer 4: Input Validation
```
✅ Validation:
   - Email: /^[\w-\.]+@[\w-\.]+\.\w+$/
   - Passwords: 8+ chars, regex complexity
   - Names: A-Z, a-z, spaces, hyphens
   - HTML: Échappement XSS

❌ Protection:
   - Pas d'SQL injection (prepared statements)
   - Pas de XSS (sanitization HTML)
   - Pas de CSRF (SameSite cookies)
```

### Layer 5: Network Security
```
🌐 CORS (Cross-Origin Resource Sharing):
   - Strictement limité à: https://www.lespetitstrinquat.fr
   - Refuse: localhost, *.workers.dev, autres domaines
   
🔒 HTTPS Obligatoire:
   - Tous les endpoints HTTPS
   - Redirect HTTP → HTTPS automatique
   
🚫 Rate Limiting:
   - 60 requêtes/minute par IP
   - 5 registrations/jour par IP
```

### Layer 6: Data Encryption
```
🔐 En transit (TLS 1.3):
   - Tous les requêtes chiffrées
   
🔐 Au repos:
   - Supabase: Chiffrement par défaut
   - D1: Chiffrement Cloudflare
   - Passwords: Hashed avec bcrypt (12 rounds)
```

## Secrets Management

### Secrets Stockés Chez Cloudflare
```
cloudflare/.env.production.vars

JWT_SECRET              (32+ caractères)
BCRYPT_ROUNDS          (10-14)
CORS_ORIGIN            (https://www.lespetitstrinquat.fr)
SESSION_DURATION       (604800 = 7 jours)
RATE_LIMIT_MAX         (60 req/min)
RESEND_API_KEY         (optional, re_xxx)
```

### Secrets Jamais Commitées
```
❌ Ne JAMAIS pusher:
- .env files
- API keys
- Private keys
- Database passwords

✅ À la place:
- Utiliser Cloudflare Secrets
- Utiliser Variables d'environnement
- Utiliser .env.example (template)
```

---

# 🚀 DÉPLOIEMENT PRODUCTION

## Checklist Pré-Production

### ✅ Code
- [ ] Pas d'erreurs TypeScript: `npm run build`
- [ ] Pas de console.log() ou debugger
- [ ] Tests passent: `npm run test`
- [ ] Git commit tous les changements

### ✅ Configuration
- [ ] .env.local configuré (voir .env.example)
- [ ] wrangler.toml configuration production
- [ ] Database migration exécutée
- [ ] Secrets Cloudflare configurés

### ✅ Database
- [ ] D1 production créée
- [ ] Tables migrées: `0001_tombola_schema.sql`
- [ ] Admin créé: `0002_seed_admin.sql`
- [ ] Tests de requête réussis

### ✅ Sécurité
- [ ] CORS strictement limité
- [ ] JWT_SECRET configuré (32+ chars)
- [ ] Pas d'URLs hardcodées sensibles
- [ ] Rate limiting activé

## Déploiement Étape par Étape

### Phase 1: Préparer le code
```bash
# Vérifier qu'on est sur la bonne branche
git status
git branch

# Créer une branche de déploiement
git checkout -b deploy/production-2026-07-18

# Mettre à jour le code
git pull origin main
```

### Phase 2: Build la production
```bash
# Vérifier la build
npm run build

# Taille optimale?
ls -lh dist/

# Servir localement (test final)
npm run preview
# Tester: http://localhost:4173
```

### Phase 3: Déployer l'API
```bash
cd cloudflare

# Vérifier les migrations
npx wrangler d1 execute les-ptits-trinquat-prod \
  --file=migrations/0001_tombola_schema.sql

# Déployer en production
npm run deploy

# Vérifier le déploiement
curl https://les-ptits-trinquat-api.mehdozz007.workers.dev/health
```

### Phase 4: Déployer le Frontend
```bash
# À la racine

# Vérifier les assets
ls -la dist/

# Commit et push
git add -A
git commit -m "Deploy production 2026-07-18"
git push origin main

# GitHub Pages déploie automatiquement!
# Vérifier: https://mehdozz007.github.io/les-ptits-trinquat-web-main/
```

### Phase 5: Valider le déploiement
```bash
# Vérifier que tout fonctionne
https://www.lespetitstrinquat.fr

# Admin accessible?
https://www.lespetitstrinquat.fr/admin/newsletter

# API responsive?
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/health

# Pas d'erreurs console (F12)?
✅ Oui = Déploiement réussi!
```

---

# 🧪 TESTS & VALIDATION

## Test 1: Configuration de Base
```bash
✅ Supabase project créé et accessible
✅ npm dependencies installées (426 packages)
✅ npm run dev démarre sans erreur
✅ http://localhost:8081 charge
```

## Test 2: Pages Principales
```bash
Test Pages:
✅ Accueil (/)
✅ À Propos (/a-propos)
✅ Contact (/contact)
✅ Actualités (/actualites)
✅ Partenaires (/partenaires)
✅ Mentions Légales (/mentions-legales)
✅ Politique de Confidentialité (/politique-confidentialite)
```

## Test 3: Newsletter
```bash
✅ Inscription newsletter fonctionne
✅ Email valide requis
✅ Consentement RGPD obligatoire
✅ Toast de confirmation s'affiche
✅ Admin dashboard accessible
✅ Créer newsletter fonctionne
✅ Envoyer email fonctionne
```

## Test 4: Tombola
```bash
✅ Page /tombola charge (non authentifiée)
✅ Inscription participant fonctionne
✅ Proposition de lot fonctionne
✅ Réservation de lot fonctionne
✅ Admin dashboard affiche tous les données
✅ Suppression lot fonctionne
```

## Test 5: Authentification
```bash
✅ Login avec credentials valides
✅ Erreur avec credentials invalides
✅ Signup nouveau compte fonctionne
✅ Token JWT valide
✅ Token expiré → refresh
✅ Logout déconnecte
```

## Test 6: Responsive Design
```bash
✅ Desktop (1920x1080)
✅ Tablet (768x1024)
✅ Mobile (375x667)
✅ Images responsive
✅ Menu mobile fonctionne
✅ Touches tactiles réactives
```

---

# 🐛 TROUBLESHOOTING & FAQ

## Erreur: "Port 8080 is already in use"

**Symptôme**:
```
Port 8080 is in use, trying another one...
➜ Local: http://localhost:8081/
```

**Solution**: ✅ Automatique - Vite utilise le port 8081

## Erreur: "Cannot find module '@/lib/supabase'"

**Cause**: Alias TypeScript non configuré

**Solution**:
```bash
# Vérifier tsconfig.json
cat tsconfig.json | grep -A 5 '"@"'

# Doit contenir:
# "@": ["./src"]
```

## Erreur: "401 Unauthorized" Admin Dashboard

**Cause**: Pas authentifié ou rôle admin pas assigné

**Solution**:
```sql
-- Supabase SQL Editor

-- Vérifier l'authentification
SELECT * FROM auth.users WHERE email = 'votre@email.com';

-- Assigner le rôle admin
INSERT INTO user_roles (user_id, role)
VALUES ('USER_ID_ICE', 'admin');

-- Vérifier
SELECT * FROM user_roles WHERE user_id = 'USER_ID_ICE';
```

## Erreur: "NetworkError when attempting to fetch resource"

**Cause**: API non accessible

**Solution**:
```bash
# Vérifier que l'API est déployée
curl https://les-ptits-trinquat-api.medhozz007.workers.dev/health

# Vérifier CORS
curl -H "Origin: http://localhost:8081" \
     -H "Access-Control-Request-Method: GET" \
     https://les-ptits-trinquat-api.medhozz007.workers.dev/health
```

## Erreur: "PDF cannot be downloaded"

**Cause**: Fichier manquant ou chemin incorrect

**Solution**:
```bash
# Vérifier que le fichier existe
ls -la public/documents/

# Vérifier le chemin dans actualites.ts
grep -n "fileUrl" src/lib/actualites.ts
```

---

# 📊 MONITORING & ANALYTICS

## Umami Analytics Setup

### Accès
**URL**: https://cloud.umami.is  
**Website ID**: 4ac64079-273f-4ec2-bc4f-397010975839

### Données Trackées

**Page Views**:
- Toutes les pages visitées
- Temps passé par page
- Appareils utilisés

**Événements Newsletter**:
```javascript
newsletter_subscription_success → {
  firstName: "Jean",
  email: "jean@email.com"
}
```

**Événements Tombola**:
```javascript
tombola_participant_registration → { name, emoji }
tombola_lot_proposed → { lotName, participantName }
tombola_lot_reserved → { lotName, emoji }
tombola_lot_contact_clicked → { lotName }
tombola_lot_delivered → { lotName }
```

### Tableaux de Bord Recommandés

**Vue Générale**:
- Visiteurs uniques (jour/semaine/mois)
- Pages les plus visitées
- Temps moyen par page
- Taux de rebond

**Analyse Engagement**:
- Événements newsletter
- Événements tombola
- Conversions (visits → inscriptions)

**Performance**:
- Appareils (mobile vs desktop)
- Navigateurs
- Localisations géographiques

---

# 📝 COMMANDES UTILES

## Frontend

```bash
# Lancer le dev server
npm run dev

# Build pour production
npm run build

# Prévisualiser la build
npm run preview

# Lint le code
npm run lint

# Lancer les tests
npm run test
```

## Backend (Cloudflare)

```bash
# À la racine, puis:
cd cloudflare

# Dev server local
npm run dev

# Déployer en prod
npm run deploy

# Exécuter migrations
npx wrangler d1 execute les-ptits-trinquat-prod \
  --file=migrations/0001_tombola_schema.sql

# Query la DB
npx wrangler d1 execute les-ptits-trinquat-prod \
  --command="SELECT * FROM tombola_participants"

# Lister les DBs
wrangler d1 list
```

## Git

```bash
# Vérifier le statut
git status

# Ajouter les changements
git add -A

# Commit
git commit -m "Description des changements"

# Push
git push origin main

# Voir l'historique
git log --oneline -10

# Voir les branches
git branch -a

# Créer une branche
git checkout -b feature/mon-feature

# Fusionner une branche
git merge feature/mon-feature
```

## Supabase

```bash
# Se connecter
supabase login

# Voir le status
supabase status

# Exécuter une migration
supabase migration up

# Créer une migration
supabase migration new mon_changement

# Voir les migrations
supabase migration list
```

## Divers

```bash
# Vérifier les versions
node -v
npm -v
git -v

# Installer les dépendances
npm install

# Mettre à jour les packages
npm update

# Audit des vulnérabilités
npm audit
npm audit fix

# Vider le cache
npm cache clean --force
```

---

## 📞 Support & Contacts

### Emails
- **Association**: parents.frank.dickens@gmail.com
- **Technique**: Consultez le README.md

### Documentation
- **Index Complet**: DOCUMENTATION_INDEX.md
- **Admin Guide**: ADMIN_GUIDE.md
- **Repo GitHub**: https://github.com/medhozz007/les-ptits-trinquat-web-main

### Ressources Externes
- **Supabase Docs**: https://supabase.com/docs
- **Cloudflare Docs**: https://developers.cloudflare.com
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs/

---

**Dernière mise à jour**: 18 Juillet 2026  
**Version**: 2.0  
**Status**: ✅ Production Ready
