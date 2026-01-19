# 🚀 Commands & Prompts Guide

## 🎯 Commandes Rapides

### Développement

```bash
# Lancer le serveur de dev
npm run dev
# → http://localhost:8081/

# Build production
npm run build
# → ./dist/ (prêt pour déploiement)

# Preview du build
npm run preview
# → Teste le bundle de prod localement

# Linting (vérifier erreurs)
npm run lint
# → ESLint check

# Audit sécurité
npm audit fix
# → Fix les vulnérabilités npm
```

### Supabase

```bash
# Vérifier la status local Supabase
supabase status

# Voir les migrations appliquées
supabase migration list

# Appliquer les migrations
supabase db push

# Déployer les Edge Functions
supabase functions deploy send-newsletter

# Voir les logs des functions
supabase functions logs send-newsletter

# Ouvrir Supabase Studio local
supabase studio
```

---

## 📋 Prompts & Configurations

### Admin Newsletter Setup

**Pour créer un premier utilisateur admin:**

```sql
-- 1. Créer l'utilisateur (via Supabase Dashboard Auth)
-- Email: admin@lestriinquat.fr
-- Password: ••••••••

-- 2. Récupérer l'UUID
SELECT id FROM auth.users WHERE email = 'admin@lestriinquat.fr';

-- 3. Assigner le rôle admin (remplacer UUID)
INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000000'::uuid, 'admin'::app_role);

-- 4. Vérifier
SELECT * FROM public.user_roles WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid;
```

### RLS Policies Check

```sql
-- Vérifier que RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- Voir les policies
SELECT * FROM pg_policies;

-- Tester la policy (comme admin)
SELECT * FROM public.newsletter_subscribers;
-- Devrait retourner les données
```

### Newsletter Test

```sql
-- Ajouter un abonné test
INSERT INTO public.newsletter_subscribers (email, first_name, consent)
VALUES ('test@example.com', 'Test User', true);

-- Créer une newsletter test
INSERT INTO public.newsletters (title, subject, content, status)
VALUES (
  'Newsletter Test',
  'Test Subject',
  '<h1>Hello World</h1>',
  'draft'
);

-- Voir les brouillons
SELECT * FROM public.newsletters WHERE status = 'draft';
```

---

## 🔑 Variables d'Environnement

**`.env.local` - À configurer:**

```dotenv
# Obligatoire pour le site
VITE_SUPABASE_URL=https://ybzrbrjdzncdolczyvxz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Obligatoire pour les Edge Functions
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optionnel - Pour envoyer les emails
VITE_RESEND_API_KEY=re_xxxxxxxxxxxx
```

---

## 🧪 Testing Prompts

### Tester la Newsletter Subscribe (Frontend)

```javascript
// Ouvrir la console (F12) et exécuter:

// 1. Tester l'import Supabase
import { supabase } from '@/lib/supabase';
console.log('Supabase URL:', supabase.supabaseUrl);

// 2. Tester l'insert abonné
const { data, error } = await supabase
  .from('newsletter_subscribers')
  .insert({
    email: 'test@example.com',
    first_name: 'Test',
    consent: true
  });

console.log('Data:', data);
console.log('Error:', error);
```

### Tester l'Auth Admin

```javascript
// Vérifier la session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
console.log('User:', session?.user?.email);

// Vérifier le JWT
const token = session?.access_token;
console.log('Token:', token);

// Vérifier les claims
const { data: claims } = await supabase.auth.getClaims(token);
console.log('Claims:', claims);
```

---

## 📊 Prompts SQL Utiles

### Statistiques

```sql
-- Statistiques complètes
SELECT 
  COUNT(*) as total_subscribers,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_subscribers,
  COUNT(CASE WHEN consent = true THEN 1 END) as consented,
  COUNT(DISTINCT email) as unique_emails
FROM public.newsletter_subscribers;

-- Abonnés par date
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_subscribers
FROM public.newsletter_subscribers
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Newsletter stats
SELECT 
  title,
  status,
  recipients_count,
  sent_at,
  created_at
FROM public.newsletters
ORDER BY created_at DESC;
```

### Maintenance

```sql
-- Vérifier les doublons (emails)
SELECT email, COUNT(*) 
FROM public.newsletter_subscribers 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Nettoyer les abonnés inactifs (soft delete)
UPDATE public.newsletter_subscribers 
SET is_active = false 
WHERE created_at < NOW() - INTERVAL '1 year' AND is_active = true;

-- Reset (DANGER - Supprimer tous les abonnés)
DELETE FROM public.newsletter_subscribers;
TRUNCATE public.newsletters CASCADE;
```

---

## 🔧 Troubleshooting Prompts

### Diagnostiquer les erreurs

```bash
# Vérifier les dépendances
npm list @supabase/supabase-js

# Vérifier la version Node
node --version

# Vérifier npm
npm --version

# Checker les ports utilisés
lsof -i :8080-8085

# Kill un process sur un port (Mac/Linux)
lsof -ti:8081 | xargs kill -9

# Kill un process sur un port (Windows)
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### Debug Supabase Connection

```typescript
// Dans la console du navigateur:

// 1. Vérifier la connexion
const status = await supabase.auth.getSession();
console.log('Connected:', !!status);

// 2. Test query
const { data, error } = await supabase
  .from('newsletter_subscribers')
  .select('count()');
  
console.log('Data:', data);
console.log('Error:', error);

// 3. Vérifier RLS
// Si error: "row level security policy", RLS est actif
```

---

## 🚀 Déploiement Prompts

### Pre-Deploy Checklist

```bash
# 1. Audit sécurité
npm audit

# 2. Build test
npm run build

# 3. Preview test
npm run preview

# 4. Lint test
npm run lint

# 5. Vérifier .env.local est PAS dans git
grep -r "\.env\.local" .gitignore

# 6. Vérifier migrations sont appliquées
supabase db push

# 7. Deployer les functions
supabase functions deploy send-newsletter
```

### Deploy Production

```bash
# Sur GitHub Pages (via deploy script)
npm run deploy

# Sur Netlify/Vercel (après build)
npm run build
# Uploader le dossier ./dist/

# Sur Supabase Hosting (si disponible)
supabase projects deploy
```

---

## 📱 Routes de Debug

| Route | Description | Notes |
|-------|-------------|-------|
| `http://localhost:8081/` | Accueil | Voir newsletter form |
| `http://localhost:8081/admin/newsletter` | Admin dashboard | Requis: auth + admin role |
| `http://localhost:8081/404` | Page non trouvée | Test 404 |

---

## 🔐 Security Checklist

- [ ] `.env.local` n'est pas commité
- [ ] `SUPABASE_SERVICE_ROLE_KEY` jamais exposé au client
- [ ] RLS activé sur toutes les tables sensibles
- [ ] JWT validation en place
- [ ] CORS configuré correctement
- [ ] XSS protection activée
- [ ] Audit npm régulier: `npm audit`

---

## 📝 Notes Importantes

1. **Resend API** (optionnel):
   - Si vous voulez envoyer des emails réels
   - Créer compte: https://resend.com
   - Ajouter la clé dans `.env.local`

2. **Edge Functions**:
   - Déployer avec: `supabase functions deploy send-newsletter`
   - Logs: Supabase Dashboard > Functions > Logs

3. **RLS Policies**:
   - Très importantes pour la sécurité
   - Vérifier via: Supabase Dashboard > Authentication > Policies

---

**Status**: 🟢 **PRÊT À L'EMPLOI**

Commencez par: `npm run dev`  
Puis visitez: http://localhost:8081/admin/newsletter
