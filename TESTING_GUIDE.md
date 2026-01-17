# 🧪 Guide de Test Complet - Système Newsletter

## ✅ Checklist de Test

### Test 1: Configuration de Base
- [ ] Supabase project créé et accessible
- [ ] Environment variables configurées (.env.local)
- [ ] npm dependencies installées
- [ ] Application démarre sans erreur: `npm run dev`

### Test 2: Tables Supabase
```sql
-- Exécuter dans Supabase SQL Editor

-- Vérifier que les tables existent
SELECT * FROM information_schema.tables 
WHERE table_name IN ('newsletter_subscribers', 'newsletters', 'user_roles');

-- Vérifier que l'enum existe
SELECT * FROM pg_type WHERE typname = 'app_role';

-- Vérifier que la fonction exists
SELECT * FROM pg_proc WHERE proname = 'has_role';

-- Vérifier les RLS
SELECT * FROM pg_policies WHERE tablename = 'newsletter_subscribers';
```

**Résultat attendu:** 3 tables, 1 enum, 1 fonction, 4 policies

### Test 3: RLS Policies
```sql
-- Vérifier que RLS est activée
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('newsletter_subscribers', 'newsletters', 'user_roles');

-- Test: Insertion publique (avec consentement)
-- Doit réussir même sans authentification
INSERT INTO newsletter_subscribers (email, first_name, consent, is_active)
VALUES ('test@example.com', 'Test', true, true);
```

**Résultat attendu:** INSERT réussit

### Test 4: Inscription Newsletter (UI)
```
1. Aller à http://localhost:5173/
2. Scroll jusqu'à la section newsletter
3. Entrer un email et un prénom
4. Cocher "J'accepte de recevoir des informations"
5. Cliquer "S'abonner"

Résultat attendu:
- Message de succès affiché
- Email visible dans Supabase > newsletter_subscribers
```

### Test 5: Authentification Admin
```
1. Aller à http://localhost:5173/admin/newsletter
2. Voir le formulaire de connexion
3. Tenter de se connecter avec un email non existant
   → Erreur: "Email ou mot de passe incorrect" ✅
4. Cliquer sur "Créer un compte"
5. Entrer email et password
6. Soumettre le formulaire de création

Résultat attendu:
- Utilisateur créé dans Supabase auth.users
- Voir un message "Compte créé" ou similaire
```

### Test 6: Attribution du Rôle Admin
```sql
-- Dans Supabase SQL Editor

-- 1. Récupérer le user_id
SELECT id, email FROM auth.users 
WHERE email = 'test-admin@example.com';

-- 2. Copier le user_id et exécuter
INSERT INTO user_roles (user_id, role)
VALUES ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'admin');

-- 3. Vérifier l'insertion
SELECT * FROM user_roles 
WHERE user_id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

**Résultat attendu:** Rôle admin assigné, visible dans user_roles

### Test 7: Accès Admin (Après attribution rôle)
```
1. Se reconnecter (faire Déconnexion puis Connexion)
2. Entrer email et password du nouvel admin
3. Soumettre le formulaire

Résultat attendu:
- Redirection vers /admin/newsletter
- Voir le dashboard avec 3 onglets
- Pas de message d'erreur
```

### Test 8: Créer une Newsletter
```
1. Aller au tab "Créer"
2. Remplir le formulaire:
   - Titre: "Test Newsletter #1"
   - Sujet: "Test du système de newsletter"
   - Contenu: "<p>Ceci est un test</p>"
3. Cliquer sur "Afficher l'aperçu"
4. Vérifier que l'HTML s'affiche correctement
5. Cliquer "Créer le brouillon"

Résultat attendu:
- Message "Newsletter créée avec succès !"
- Newsletter visible dans tab "Historique"
- Statut: "Brouillon"
```

### Test 9: Gérer les Abonnés
```
1. Aller au tab "Abonnés"
2. Voir la liste des abonnés
3. Tester la recherche (par email ou nom)
4. Cliquer sur le toggle Actif/Inactif pour un abonné
5. Cliquer sur le bouton Supprimer (puis confirmer)

Résultat attendu:
- Recherche fonctionne
- Toggle change le statut is_active
- Suppression retire l'abonné de la liste
- Vérifier dans Supabase: newsletter_subscribers
```

### Test 10: Envoyer une Newsletter (Mock)
```
1. Aller au tab "Historique"
2. Voir le brouillon créé précédemment
3. Cliquer sur le bouton "Voir" (eye icon)
4. Vérifier le contenu HTML en aperçu
5. Cliquer sur le bouton "Envoyer" (send icon)
6. Confirmer dans le dialog

⚠️ Attention:
- Si RESEND_API_KEY n'est pas valide, l'envoi échouera
- Un vrai email sera ENVOYÉ aux abonnés actifs
- En développement, utiliser une adresse test
```

**Résultat attendu (en production):**
- Status change de "Brouillon" à "Envoyée"
- recipients_count = nombre d'abonnés actifs
- Emails reçus par les abonnés

**Résultat attendu (sans Resend):**
- Message d'erreur: "Failed to send newsletter"
- Voir les logs Supabase pour détails

### Test 11: Edge Function Logs
```bash
# Voir les logs de la fonction
supabase functions list --project-id votre-project-id

# Voir les logs détaillés (nécessite Supabase CLI)
supabase functions logs send-newsletter --project-id votre-project-id
```

### Test 12: Sécurité - Tests XSS
```
1. Créer une newsletter avec contenu malveillant:
   Titre: "<script>alert('XSS')</script>"
   Sujet: "Test <img src=x onerror=alert('XSS')>"
   Contenu: "<p>Bonjour</p>"

2. Envoyer la newsletter

Résultat attendu:
- Pas de popup alert
- Email reçu avec caractères échappés
- Les < et > deviennent &lt; et &gt;
```

### Test 13: Sécurité - Tests JWT
```bash
# Sans JWT
curl -X POST http://localhost:3000/functions/v1/send-newsletter \
  -H "Content-Type: application/json" \
  -d '{"newsletterId":"xxx"}'

Résultat attendu: 401 Unauthorized

# Avec JWT invalide
curl -X POST http://localhost:3000/functions/v1/send-newsletter \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" \
  -d '{"newsletterId":"xxx"}'

Résultat attendu: 401 Invalid authentication
```

### Test 14: Sécurité - Tests RLS
```sql
-- Essayer d'accéder aux newsletters en tant que user non-admin

-- 1. Créer un utilisateur non-admin
INSERT INTO auth.users (email, encrypted_password)
VALUES ('user@example.com', 'hashed_password');

-- 2. Vérifier qu'il ne peut pas voir les newsletters
SELECT * FROM newsletters;  -- Devrait retourner 0 rows

-- 3. Vérifier qu'il ne peut pas voir les abonnés
SELECT * FROM newsletter_subscribers;  -- Devrait retourner 0 rows
```

### Test 15: Intégration Complète
```
Scénario: Nouveau parent découvre le site et s'abonne

1. Visiteur atterrit sur http://localhost:5173/
2. Scroll jusqu'à la newsletter
3. S'abonne avec email: famille@example.com, Prénom: Dupont
4. Reçoit confirmation "Vous êtes abonné"

Scénario: Admin envoie une newsletter

1. Admin accède à /admin/newsletter
2. Crée une newsletter: "Bienvenue à nos nouveaux parents"
3. Va à l'onglet "Historique"
4. Envoie la newsletter aux abonnés actifs
5. Famille@example.com reçoit l'email dans sa boîte

Scénario: Admin gère les abonnés

1. Admin va à l'onglet "Abonnés"
2. Voit Dupont (famille@example.com) dans la liste
3. Peut le désactiver/réactiver
4. Peut le supprimer si nécessaire
```

---

## 🔍 Debugging

### Logs à Vérifier

**Frontend:**
```javascript
// Ouvrir la console du navigateur (F12)
// Rechercher les erreurs marquées en rouge
// Les logs de Supabase apparaissent ici
```

**Backend (Edge Function):**
```bash
# Afficher les logs de la fonction
supabase functions logs send-newsletter --project-id mon-projet

# Ou via le dashboard:
# Supabase > Logs > Edge Functions > send-newsletter
```

**Base de données:**
```bash
# Se connecter à Supabase
supabase projects list

# Voir les modifications récentes
supabase db pull --project-id mon-projet
```

### Problèmes Courants

**Problème: "Admin access required" quand j'envoie un email**
```
Cause: L'utilisateur n'a pas le rôle admin
Solution: 
1. Vérifier: SELECT * FROM user_roles WHERE user_id = 'xxx'
2. Si vide, exécuter: INSERT INTO user_roles (user_id, role) VALUES ('xxx', 'admin')
```

**Problème: "RESEND_API_KEY not found"**
```
Cause: La clé Resend n'est pas configurée
Solution:
1. Créer une clé à https://resend.com/api-keys
2. Ajouter dans Supabase > Secrets: RESEND_API_KEY
```

**Problème: Les emails ne s'envoient pas**
```
Cause: Plusieurs possibles
Solution:
1. Vérifier le statut de la fonction: supabase functions list
2. Vérifier les logs: supabase functions logs send-newsletter
3. Vérifier l'adresse "from" est vérifiée dans Resend
4. Vérifier qu'il y a des abonnés actifs avec consent = true
```

**Problème: "RLS policy issue" dans les requêtes**
```
Cause: L'utilisateur n'a pas les permissions RLS
Solution:
1. Vérifier être connecté
2. Si pas admin, vérifier les RLS policies
3. Revoir: supabase/migrations/...sql (lignes 80-137)
```

---

## 📊 Métriques de Succès

✅ **Test 1-7:** Configuration et authentification OK
✅ **Test 8:** CRUD newsletters OK
✅ **Test 9:** CRUD abonnés OK
✅ **Test 10:** Envoi d'emails OK (avec Resend)
✅ **Test 11:** Logs accessibles OK
✅ **Test 12:** Sécurité XSS OK
✅ **Test 13:** Sécurité JWT OK
✅ **Test 14:** Sécurité RLS OK
✅ **Test 15:** Intégration complète OK

Si tous les tests passent: **Le système est prêt pour la production! 🚀**

---

## 🚀 Prochaines Étapes (Production)

1. [ ] Domaine de envoi configuré (noreply@les-ptits-trinquat.fr)
2. [ ] SPF, DKIM, DMARC configurés
3. [ ] Backup automatique Supabase activé
4. [ ] Monitoring alertes configurées
5. [ ] Politique de confidentialité mise à jour
6. [ ] Email de désabonnement testé
7. [ ] Analytics newsletter configuré
8. [ ] Audit de sécurité complété
