# ✅ Checklist de Déploiement - Newsletter System

## Phase 1: Préparation (Semaine 1)

### 1.1 Compte Supabase
- [ ] Créer un compte Supabase (https://supabase.com)
- [ ] Créer un nouveau projet
- [ ] Récupérer: URL et ANON_KEY
- [ ] Récupérer: SERVICE_ROLE_KEY (garder secret!)

### 1.2 Compte Resend
- [ ] Créer un compte Resend (https://resend.com)
- [ ] Créer une clé API
- [ ] Vérifier le domaine d'envoi (noreply@les-ptits-trinquat.fr)
- [ ] Récupérer: RESEND_API_KEY

### 1.3 Préparation Locale
- [ ] Cloner le repository
- [ ] Créer `.env.local` à partir de `.env.example`
- [ ] Remplir toutes les variables d'environnement
- [ ] Tester: `npm install` et `npm run dev`

## Phase 2: Infrastructure (Semaine 1-2)

### 2.1 Base de Données
- [ ] Ouvrir Supabase SQL Editor
- [ ] Copier le contenu de `supabase/migrations/20260117000000_init_newsletter_tables.sql`
- [ ] Exécuter la migration complète
- [ ] Vérifier les tables créées:
  - [ ] `newsletter_subscribers`
  - [ ] `newsletters`
  - [ ] `user_roles`
  - [ ] Enum `app_role`
  - [ ] Fonction `has_role()`

### 2.2 Row Level Security (RLS)
- [ ] Vérifier que RLS est **activée** sur toutes les tables
- [ ] Vérifier les 4 policies sur `newsletter_subscribers`
- [ ] Vérifier les policies sur `newsletters`
- [ ] Vérifier les policies sur `user_roles`
- [ ] Tester inscription publique (sans auth)

### 2.3 Edge Function
- [ ] Vérifier `supabase/functions/send-newsletter/index.ts` existe
- [ ] Vérifier `supabase/config.toml` configuré correctement
- [ ] Déployer la fonction:
  ```bash
  supabase functions deploy send-newsletter --project-id your-project-id
  ```
- [ ] Vérifier via: `supabase functions list --project-id your-project-id`

### 2.4 Secrets Supabase
- [ ] Aller à Supabase > Settings > Secrets
- [ ] Ajouter `RESEND_API_KEY` avec votre clé
- [ ] Redéployer la Edge Function pour l'appliquer
- [ ] Tester le secret est accessible

## Phase 3: Frontend (Semaine 2)

### 3.1 Composants React
- [ ] NewsletterSubscription existe et fonctionne
- [ ] AdminLayout existe et protège les routes
- [ ] NewsletterEditor crée des brouillons
- [ ] SubscribersList affiche les abonnés
- [ ] NewsletterHistory affiche l'historique

### 3.2 Hooks React
- [ ] `useAdminAuth` - Authentification
- [ ] `useNewsletterAdmin` - CRUD newsletters
- [ ] `useNewsletterSubscription` - Inscription publique
- [ ] `supabase.ts` - Client configuré

### 3.3 Page Admin
- [ ] `/admin/newsletter` existe
- [ ] Protégée par `AdminLayout`
- [ ] 3 onglets: Créer, Historique, Abonnés
- [ ] Logout fonctionne

## Phase 4: Testing (Semaine 2-3)

### 4.1 Tests Unitaires
- [ ] Inscription newsletter (public)
- [ ] Création utilisateur admin
- [ ] Attribution rôle admin
- [ ] Création newsletter (brouillon)
- [ ] Modification newsletter

### 4.2 Tests Intégration
- [ ] Flux complet: inscription → création → envoi
- [ ] Vérifier emails reçus
- [ ] Vérifier historique mis à jour
- [ ] Vérifier RLS fonctionnelle

### 4.3 Tests Sécurité
- [ ] XSS protection: `<script>alert('xss')</script>`
- [ ] JWT validation: requête sans token = 401
- [ ] Admin check: user non-admin ne peut pas envoyer
- [ ] RLS enforcement: données cachées non-auth users

### 4.4 Tests Performance
- [ ] Page d'accueil charge < 3s
- [ ] Admin dashboard charge < 2s
- [ ] Envoi newsletter à 100+ abonnés < 30s

## Phase 5: Documentation (Semaine 3)

### 5.1 Docs Complétées
- [ ] IMPLEMENTATION_NEWSLETTER.md
- [ ] SECURITY.md
- [ ] TESTING_GUIDE.md
- [ ] NEWSLETTER_README.md
- [ ] .env.example

### 5.2 Docs Projet
- [ ] Ajouter section Newsletter au README principal
- [ ] Créer guide admin pour les utilisateurs
- [ ] Screenshots/démonstration préparés

## Phase 6: Pré-Production (Semaine 3-4)

### 6.1 Environnement de Staging
- [ ] Créer un projet Supabase séparé pour staging
- [ ] Copier la configuration
- [ ] Tester avec vraies adresses email (test@example.com)
- [ ] Vérifier tous les logs Supabase

### 6.2 Domaine Email
- [ ] Vérifier domaine dans Resend
- [ ] Configurer SPF record
  ```
  v=spf1 include:resend.com ~all
  ```
- [ ] Configurer DKIM (via Resend dashboard)
- [ ] Configurer DMARC (optionnel mais recommandé)
- [ ] Tester délivrabilité (spam score)

### 6.3 Backups & Disaster Recovery
- [ ] Activer backups automatiques Supabase
- [ ] Configurer point de restauration
- [ ] Tester la restauration sur copie

### 6.4 Monitoring
- [ ] Configurer alertes Supabase:
  - [ ] Alerte si RLS désactivée
  - [ ] Alerte si fonction échoue
  - [ ] Alerte si quota dépassé
- [ ] Suivi Resend:
  - [ ] Bounce rate
  - [ ] Complaint rate
  - [ ] Delivery rate

## Phase 7: Production (Semaine 4)

### 7.1 Déploiement
- [ ] `npm run build` fonctionne sans erreur
- [ ] Build size acceptable
- [ ] Déployer sur production
- [ ] Vérifier site fonctionne: `https://les-ptits-trinquat.fr/`

### 7.2 Vérifications Finales
- [ ] Page accueil charge correctement
- [ ] Inscription newsletter fonctionne
- [ ] `/admin/newsletter` accessible aux admins
- [ ] Envoi test newsletter réussit
- [ ] Email reçu dans inbox (pas spam)

### 7.3 Post-Déploiement
- [ ] Monitorer les logs pendant 24h
- [ ] Aucune erreur 500
- [ ] RLS fonctionne (data sécurisée)
- [ ] Performances acceptables

## Phase 8: Onboarding (Semaine 4-5)

### 8.1 Formation Utilisateurs
- [ ] Créer 1-2 admins de test
- [ ] Démonstration du dashboard
- [ ] Guide "Comment créer une newsletter"
- [ ] Guide "Comment gérer les abonnés"

### 8.2 Premiers Envois
- [ ] Créer newsletter test interne
- [ ] Envoyer aux admins uniquement
- [ ] Vérifier formatage HTML
- [ ] Corriger si nécessaire

### 8.3 Lancement Public
- [ ] Annoncer sur site principal
- [ ] Partager lien inscription newsletter
- [ ] Créer première newsletter pour les abonnés
- [ ] Célébrer! 🎉

## Maintenance Régulière

### Quotidien
- [ ] Vérifier aucune erreur dans les logs
- [ ] Monitoring performancs Supabase

### Hebdo
- [ ] Vérifier taux de bounce Resend
- [ ] Vérifier nouvelles inscriptions
- [ ] Répondre aux emails de support

### Mensuel
- [ ] Audit complet des logs
- [ ] Review des statistiques
- [ ] Backup test (restore sur copie)
- [ ] Update documentation si changements

### Trimestriel
- [ ] Audit de sécurité complet
- [ ] Review des RLS policies
- [ ] Performance audit
- [ ] Planification nouvelles features

## KPIs de Succès

- ✅ Taux d'inscription > 5% des visiteurs
- ✅ Taux de consentement > 80%
- ✅ Taux de délivrabilité > 95%
- ✅ Taux de rebond < 2%
- ✅ Pas d'incident de sécurité
- ✅ Temps de chargement < 2s
- ✅ Uptime > 99.9%

## Contacts d'Urgence

- **Supabase Support**: support@supabase.io
- **Resend Support**: support@resend.com
- **Security Issue**: security@supabase.io
- **Admin Local**: [À remplir]

## Notes

```
Commencer Phase 1: __/__/____
Fin Phase 8 (Production): __/__/____

Signataire: _________________
Date: __/__/____
```

---

**Ce checklist doit être complété à 100% avant la mise en production.**

Bonne chance! 🚀
