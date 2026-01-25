# Prompt Copilot – Administration Newsletter

## Contexte

Tu travailles sur le site web existant de l'Association de Parents d'Élèves **Les P'tits Trinquât**.

La newsletter publique est déjà en place :
- Formulaire d'inscription sur la page d'accueil
- Stockage des emails dans Supabase (table `newsletter_subscribers`)
- Envoi via Resend (Edge Function `send-newsletter`)

⚠️ **Ne pas modifier la partie publique existante.**

---

## Objectif

Ajouter une page d'administration privée permettant à l'équipe de l'association de :

1. Consulter la liste des abonnés à la newsletter
2. Rédiger et envoyer des newsletters
3. Gérer les envois et l'historique

Le tout depuis le site, dans le **respect strict du thème existant**.

---

## Accès & Sécurité

### Implémentation actuelle

L'authentification est gérée via **Supabase Auth** avec système de rôles :

1. **Authentification Supabase** : login/password classique
2. **Table `user_roles`** : attribution des rôles (admin/user)
3. **Fonction `has_role()`** : vérification des permissions en SQL
4. **Hook `useAdminAuth`** : gestion de l'état d'authentification côté React

### Politiques RLS

Les tables `newsletter_subscribers` et `newsletters` sont protégées par Row Level Security :

```sql
-- Inscription publique (avec consentement obligatoire)
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (consent = true);

-- Lecture réservée aux admins
CREATE POLICY "Admins can view subscribers" ON newsletter_subscribers
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Modifications réservées aux admins  
CREATE POLICY "Admins can update subscribers" ON newsletter_subscribers
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Suppression réservée aux admins
CREATE POLICY "Admins can delete subscribers" ON newsletter_subscribers
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Newsletters : accès admin uniquement
CREATE POLICY "Admins can manage newsletters" ON newsletters
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
```

### Créer un compte administrateur

1. S'inscrire sur `/admin/newsletter` (formulaire de connexion)
2. Récupérer l'`user_id` depuis la table `auth.users` (via le backend)
3. Insérer le rôle admin :
```sql
INSERT INTO user_roles (user_id, role) VALUES ('user-id-ici', 'admin');
```

### Comportement

- Formulaire de connexion si non authentifié
- Message "Accès refusé" si authentifié mais non admin
- Redirection automatique vers le contenu admin si autorisé
- Meta tag `robots: noindex, nofollow`

---

## Route & Structure

### Route dédiée

```
/admin/newsletter
```

---

## Contenu de la page Admin Newsletter

### 1. En-tête

- Bouton retour vers le site
- Titre "Administration Newsletter"
- Bouton actualiser les données
- Bouton déconnexion

---

### 2. Liste des abonnés

#### Affichage

Tableau avec :

| Champ | Description |
|-------|-------------|
| Prénom | Si renseigné lors de l'inscription |
| Email | Adresse email de l'abonné |
| Date d'inscription | Format : `dd MMM yyyy` (ex: 15 janv. 2024) |
| Statut | Actif / Désinscrit (badge coloré) |

#### Fonctionnalités

- ✅ Recherche par email ou prénom
- ✅ Compteur total d'abonnés (actifs / total)
- ✅ Basculer le statut (actif ↔ désinscrit)
- ✅ Supprimer un abonné (avec confirmation)

---

### 3. Éditeur de newsletter

#### Formulaire admin

| Champ | Type | Description |
|-------|------|-------------|
| Titre interne | Input texte | Usage admin uniquement |
| Sujet | Input texte | Objet de l'email |
| Contenu | Textarea | Corps de la newsletter |

#### Boutons

- `Enregistrer le brouillon` - Sauvegarde sans envoyer
- `Prévisualiser` - Aperçu avant envoi (Dialog modal)
- `Envoyer la newsletter` - Envoi avec confirmation

---

### 4. Historique des envois

Liste des newsletters avec :
- Titre et sujet
- Date d'envoi ou création
- Statut (envoyé / brouillon)
- Action de suppression

---

### 5. Envoi & Sécurité

#### Processus

1. Envoi via Edge Function `send-newsletter` (Resend API)
2. **Sanitization XSS** : le contenu est échappé avant insertion HTML
3. Sauvegarde dans la table `newsletters`
4. Mise à jour du compteur `recipients_count`

#### Protection XSS

L'Edge Function utilise `escapeHtml()` pour nettoyer :
- Le sujet de l'email
- Le contenu de la newsletter
- Le prénom du destinataire

---

## Design & UX

### Impératifs

- **Respect strict du thème existant**
- Composants shadcn-ui : Card, Button, Input, Badge, Dialog
- Tokens sémantiques Tailwind (pas de couleurs en dur)

### Responsive

- Desktop : grille 2 colonnes
- Mobile : empilé verticalement

---

## Stack technique

| Technologie | Usage |
|-------------|-------|
| React + TypeScript | Framework UI |
| Vite | Bundler |
| Tailwind CSS | Styles utilitaires |
| shadcn-ui | Composants UI |
| framer-motion | Animations |
| Supabase Auth | Authentification |
| Supabase RLS | Sécurité des données |
| Resend | Envoi d'emails |

---

## Structure des fichiers

```
src/
├── pages/
│   └── AdminNewsletter.tsx          # Page principale
├── components/
│   └── admin/
│       ├── AdminLayout.tsx          # Auth + protection admin
│       ├── SubscribersList.tsx      # Liste des abonnés
│       ├── NewsletterEditor.tsx     # Éditeur de newsletter
│       └── NewsletterHistory.tsx    # Historique des envois
├── hooks/
│   ├── useAdminAuth.ts              # Hook authentification Supabase
│   └── useNewsletterAdmin.ts        # Logique métier
└── App.tsx                          # Route /admin/newsletter

supabase/
├── functions/
│   └── send-newsletter/
│       └── index.ts                 # Edge Function (avec protection XSS)
└── config.toml
```

---

## Tables Supabase

### `newsletter_subscribers`

| Colonne | Type | RLS |
|---------|------|-----|
| id | UUID | Admin uniquement |
| first_name | TEXT | Admin uniquement |
| email | TEXT | Admin uniquement |
| created_at | TIMESTAMP | Admin uniquement |
| is_active | BOOLEAN | Admin uniquement |
| consent | BOOLEAN | Admin uniquement |

### `newsletters`

| Colonne | Type | RLS |
|---------|------|-----|
| id | UUID | Admin uniquement |
| title | TEXT | Admin uniquement |
| subject | TEXT | Admin uniquement |
| content | TEXT | Admin uniquement |
| status | TEXT | Admin uniquement |
| sent_at | TIMESTAMP | Admin uniquement |
| recipients_count | INTEGER | Admin uniquement |
| created_at | TIMESTAMP | Admin uniquement |
| updated_at | TIMESTAMP | Admin uniquement |

### `user_roles`

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| user_id | UUID | Référence auth.users |
| role | app_role | 'admin' ou 'user' |
| created_at | TIMESTAMP | Date de création |

---

## Résultat

Une page admin newsletter :
- 🔐 Sécurisée par Supabase Auth + RLS
- 🛡️ Protégée contre XSS
- 🎨 Intégrée au design existant
- ✨ Simple d'utilisation
