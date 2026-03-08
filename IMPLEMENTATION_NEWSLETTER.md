# 📋 Guide d'Implémentation - Système Newsletter avec Supabase

## ✅ Étapes Complétées

### 1. Infrastructure Supabase
- ✅ Créé `supabase/config.toml` - Configuration de Supabase
- ✅ Créé `supabase/migrations/20260117000000_init_newsletter_tables.sql` - Migration complète
- ✅ Tables créées: `user_roles`, `newsletter_subscribers`, `newsletters`
- ✅ Politiques RLS configurées pour la sécurité
- ✅ Fonction `has_role()` créée pour vérifier les permissions

### 2. Edge Function
- ✅ Créé `supabase/functions/send-newsletter/index.ts` - Fonction d'envoi d'emails
- ✅ Vérification JWT complète
- ✅ Vérification du rôle admin
- ✅ Sécurité XSS avec `escapeHtml()`
- ✅ Intégration Resend pour l'envoi d'emails

### 3. Hooks React
- ✅ `src/hooks/admin/useAdminAuth.ts` - Gestion authentification admin
- ✅ `src/hooks/admin/useNewsletterAdmin.ts` - CRUD newsletters
- ✅ `src/hooks/admin/useNewsletterSubscription.ts` - Inscription publique
- ✅ `src/lib/supabase.ts` - Client Supabase

### 4. Composants
- ✅ `src/components/admin/newsletter/NewsletterEditor.tsx` - Éditeur de newsletters
- ✅ `src/components/admin/newsletter/SubscribersList.tsx` - Gestion des abonnés
- ✅ `src/components/admin/newsletter/NewsletterHistory.tsx` - Historique des envois
- ✅ `src/components/newsletter/NewsletterSubscription.tsx` - Formulaire inscription publique
- ✅ `src/pages/AdminNewsletter.tsx` - Page admin protégée

---

## 🔧 Configuration Requise

### 1. Variables d'Environnement (.env.local)

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend (Edge Functions)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email
RESEND_API_KEY=re_your_key_here
```

### 2. Configuration Supabase Dashboard

#### Créer les tables et RLS:
1. Aller à SQL Editor dans Supabase
2. Copier-coller le contenu de `supabase/migrations/20260117000000_init_newsletter_tables.sql`
3. Exécuter la migration

#### Créer un Admin:
```sql
-- 1. L'utilisateur s'inscrit sur /admin/newsletter
-- 2. Récupérer son user_id depuis auth.users
-- 3. Attribuer le rôle admin avec cette commande:
INSERT INTO user_roles (user_id, role) 
VALUES ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'admin');
```

---

## 🚀 Déployer l'Edge Function

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

---

## 🔐 Système de Sécurité

### Architecture RLS (Row Level Security)
```
┌─────────────────────────────────────────┐
│         PUBLIC (non-authentifié)        │
│  ✅ Peut s'abonner à la newsletter     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       AUTHENTIFIÉ (a un compte)         │
│  ✅ JWT vérifié dans Edge Function     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    ADMIN (table user_roles = admin)     │
│  ✅ Peut gérer les newsletters         │
│  ✅ Peut voir les abonnés             │
│  ✅ Peut envoyer les emails           │
└─────────────────────────────────────────┘
```

### Points de Sécurité Implémentés
1. ✅ **JWT Validation** - Chaque Edge Function valide le JWT
2. ✅ **Admin Role Check** - Vérification rôle admin
3. ✅ **XSS Protection** - Fonction `escapeHtml()` sur les inputs
4. ✅ **RLS Policies** - Limite l'accès aux données
5. ✅ **CORS Headers** - Tous les endpoints sécurisés

---

## 📱 Routes de l'Application

| Route | Protection | Composant | Description |
|-------|-----------|-----------|-------------|
| `/` | Public | `Index.tsx` + `NewsletterSubscription` | Accueil + inscription |
| `/admin/newsletter` | Auth + Admin | `AdminNewsletter.tsx` | Panel admin |
| `/evenements` | Public | `Evenements.tsx` | Événements |
| `/a-propos` | Public | `APropos.tsx` | À propos |
| `/contact` | Public | `Contact.tsx` | Contact |

---

## 🧪 Tester le Système

### Test 1: Inscription Newsletter (Public)
1. Aller à `/` (page d'accueil)
2. Remplir le formulaire d'inscription
3. Vérifier que l'email est ajouté dans Supabase

### Test 2: Connexion Admin
1. Aller à `/admin/newsletter`
2. S'inscrire avec un nouvel email/password
3. Attribuer le rôle admin via SQL (voir ci-dessus)
4. Se reconnecter pour accéder au panel

### Test 3: Créer une Newsletter
1. Aller à l'onglet "Créer"
2. Remplir titre, sujet, contenu
3. Vérifier le brouillon dans "Historique"

### Test 4: Envoyer une Newsletter
1. Aller à "Historique"
2. Cliquer sur "Envoyer" pour un brouillon
3. Vérifier les logs dans Supabase

---

## 🐛 Troubleshooting

### Erreur: "Admin access required"
- **Cause**: L'utilisateur n'a pas le rôle admin
- **Solution**: Exécuter le SQL d'attribution de rôle admin

### Erreur: "RESEND_API_KEY not found"
- **Cause**: La clé Resend n'est pas configurée dans Edge Function
- **Solution**: Ajouter RESEND_API_KEY dans les secrets Supabase

### Erreur: "Invalid authentication"
- **Cause**: Le JWT est expiré ou invalide
- **Solution**: Se reconnecter

### Emails ne s'envoient pas
- **Cause**: Adresse "from" pas vérifiée sur Resend
- **Solution**: Vérifier `noreply@les-ptits-trinquat.fr` sur Resend

---

## 📊 Flux de Données

```
1. Inscription Newsletter (Public)
   └─ useNewsletterSubscription.subscribe()
      └─ supabase.from("newsletter_subscribers").insert()
         └─ RLS: consent = true

2. Admin Panel
   └─ useAdminAuth() - JWT + role check
      └─ useNewsletterAdmin() - CRUD operations
         └─ RLS: user is admin

3. Envoi Newsletter
   └─ sendNewsletter() (NewsletterHistory)
      └─ fetch("/functions/v1/send-newsletter")
         └─ Edge Function vérifies JWT + admin role
            └─ Récupère les abonnés actifs
               └─ Envoie via Resend API
                  └─ Met à jour status et recipients_count
```

---

## 📝 Maintenance

### Backups
```bash
# Exporter les données des abonnés
supabase db pull --project-id your-project-id
```

### Monitoring
1. Supabase Dashboard → Logs → Postgre
2. Supabase Dashboard → Logs → Edge Functions
3. Resend Dashboard → Emails envoyés

### Nettoyage
```sql
-- Supprimer les abonnés inactifs
DELETE FROM newsletter_subscribers 
WHERE is_active = false AND updated_at < now() - interval '6 months';
```

---

## ✨ Fonctionnalités Avancées (À Ajouter)

- [ ] Campagnes de newsletter programmées
- [ ] Segmentation des abonnés par groupe
- [ ] A/B testing des sujets
- [ ] Liens de suivi (UTM)
- [ ] Unsubscribe automatique
- [ ] Dashboard de statistiques (taux d'ouverture)
- [ ] Intégration Google Analytics

---

## 📞 Support

Pour toute question ou problème, vérifier:
1. Les logs Supabase
2. Les variables d'environnement
3. Les permissions RLS
4. Le statut de l'Edge Function
