# 🐛 Troubleshooting & FAQ

## ✅ Status Actuel

```
✅ Serveur de développement: RUNNING (http://localhost:8081/)
✅ Build: SUCCESS (49.49s)
✅ Dépendances: INSTALLED (426 packages)
✅ Supabase: CONFIGURED
✅ Variables d'env: SET (.env.local)
⚠️ Vulnérabilités npm: 3 high (run npm audit fix)
```

---

## 🔴 Erreurs Courantes & Solutions

### Erreur #1: "Port 8080 is already in use"

**Symptôme:**
```
Port 8080 is in use, trying another one...
VITE v7.2.7 ready in 621 ms
➜ Local: http://localhost:8081/
```

**Solution:** ✅ Automatique - Vite utilise le port 8081

**Si vous voulez forcer le port 8080:**
```bash
# Trouver quel processus utilise 8080
lsof -i :8080

# Tuer le processus
kill -9 <PID>

# Ou relancer Vite
npm run dev -- --port 8080
```

---

### Erreur #2: "Missing Supabase environment variables"

**Symptôme:**
```
⚠️ Missing Supabase environment variables. Newsletter features will not work.
```

**Cause:** `.env.local` manque ou clés incorrectes

**Solution:**
1. Vérifier que `.env.local` existe:
   ```bash
   ls -la .env.local
   ```

2. Vérifier les clés:
   ```bash
   cat .env.local | grep VITE_SUPABASE
   ```

3. Les clés doivent être au format JWT (commence par `eyJ`):
   ```
   VITE_SUPABASE_URL=https://ybzrbrjdzncdolczyvxz.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```

4. Redémarrer le serveur:
   ```bash
   npm run dev
   ```

---

### Erreur #3: "Cannot find module '@/lib/supabase'"

**Symptôme:**
```
Error: Cannot find module '@/lib/supabase'
```

**Cause:** Alias TypeScript non configuré ou module manquant

**Solution:**
1. Vérifier le fichier existe:
   ```bash
   ls src/lib/supabase.ts
   ```

2. Vérifier `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```

3. Vérifier `vite.config.ts`:
   ```typescript
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "./src"),
     }
   }
   ```

---

### Erreur #4: "401 Unauthorized" dans Admin Dashboard

**Symptôme:**
```
Error: 401 Unauthorized
Admin dashboard blank or error
```

**Causes possibles:**
1. Pas authentifié
2. Rôle admin pas assigné
3. JWT expiré
4. RLS policy bloquant

**Solutions:**

**A. Vérifier l'authentification:**
```javascript
// Console (F12)
const { data: { session } } = await supabase.auth.getSession();
console.log('Authentifié:', !!session);
console.log('Email:', session?.user?.email);
```

**B. Vérifier le rôle admin:**
```sql
-- Supabase SQL Editor
SELECT * FROM public.user_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'votre@email.com');

-- Si aucun résultat → role pas assigné!
-- Ajouter le rôle:
INSERT INTO public.user_roles (user_id, role) 
VALUES ((SELECT id FROM auth.users WHERE email = 'votre@email.com'), 'admin');
```

**C. Vérifier RLS Policies:**
```sql
-- Voir les policies
SELECT * FROM pg_policies WHERE tablename = 'user_roles';

-- Tester la policy
SELECT * FROM public.user_roles;
-- Si erreur RLS → policy bloquant
```

---

### Erreur #5: "CORS error" lors de l'envoi de newsletter

**Symptôme:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Cause:** CORS headers manquants dans la fonction d'envoi

**Solution:** Vérifier [supabase/functions/send-newsletter/index.ts](supabase/functions/send-newsletter/index.ts)

Le fichier a déjà les headers CORS:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

Si erreur persiste:
1. Déployer la fonction:
   ```bash
   supabase functions deploy send-newsletter
   ```

2. Vérifier les logs:
   ```bash
   supabase functions logs send-newsletter
   ```

---

### Erreur #6: "Toast notifications not working"

**Symptôme:**
```
useToast is not a hook
Toast notifications ne s'affichent pas
```

**Cause:** Toast provider pas initié

**Solution:** Vérifier [src/App.tsx](src/App.tsx)

Le fichier a déjà:
```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />      {/* ← Required */}
      <Sonner />       {/* ← Required */}
      {/* ... */}
    </TooltipProvider>
  </QueryClientProvider>
);
```

---

### Erreur #7: "Newsletter table doesn't exist"

**Symptôme:**
```
relation "public.newsletters" does not exist
```

**Cause:** Migrations pas appliquées

**Solution:**
1. Vérifier la migration:
   ```bash
   ls -la supabase/migrations/
   ```

2. Appliquer les migrations:
   ```bash
   supabase db push
   ```

3. Vérifier dans Supabase Dashboard > SQL Editor:
   ```sql
   SELECT * FROM public.newsletters LIMIT 1;
   ```

---

### Erreur #8: "Build fails with TypeScript errors"

**Symptôme:**
```
error TS7006: Parameter 'x' implicitly has an 'any' type
```

**Cause:** Types TypeScript manquants

**Solution:**

**A. Ajouter le type:**
```typescript
// ❌ Wrong
const handleClick = (e) => { ... }

// ✅ Right
const handleClick = (e: React.MouseEvent) => { ... }
```

**B. Ou désactiver strictement (não recomandé):
```json
// tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": false
  }
}
```

**C. Checker tout avant build:**
```bash
npm run lint
```

---

### Erreur #9: "Newsletter subscribers list is empty"

**Symptôme:**
```
Tableau de bord admin
Liste des abonnés vide
```

**Causes:**
1. Pas d'abonnés dans la base
2. RLS policy bloquant les SELECT
3. Connexion Supabase mauvaise

**Solutions:**

**A. Ajouter un abonné test:**
```sql
INSERT INTO public.newsletter_subscribers (email, first_name, consent)
VALUES ('test@example.com', 'Test', true);
```

**B. Vérifier RLS:**
```sql
SELECT * FROM public.newsletter_subscribers;
-- Si error → RLS policy bloquant
```

**C. Vérifier la connexion:**
```javascript
// Console
const { data, error } = await supabase
  .from('newsletter_subscribers')
  .select('*');
console.log('Data:', data);
console.log('Error:', error);
```

---

### Erreur #10: "Email not sending (Resend)"

**Symptôme:**
```
Newsletter créée mais pas d'email reçu
```

**Causes:**
1. `VITE_RESEND_API_KEY` pas configurée
2. API Key invalide
3. Domaine pas vérifié sur Resend
4. Fonction pas déployée

**Solutions:**

**A. Vérifier la clé:**
```bash
grep RESEND .env.local
```

**B. Vérifier le domaine Resend:**
- Aller sur https://resend.com/dashboard
- Vérifier que le domaine est vérifié
- Utiliser "test@resend.dev" pour les tests

**C. Déployer la fonction:**
```bash
supabase functions deploy send-newsletter
```

**D. Voir les logs:**
```bash
supabase functions logs send-newsletter
```

---

## 🟡 Avertissements (Non-Critiques)

### ⚠️ "3 high severity vulnerabilities"

**Symptôme:**
```
3 high severity vulnerabilities
npm audit fix
```

**Action:** (Optionnel mais recommandé)
```bash
npm audit fix
```

**Risque:** Bas - C'est pour les dépendances de dev

---

### ⚠️ "Browserslist is 7 months old"

**Symptôme:**
```
Browserslist: browsers data (caniuse-lite) is 7 months old.
```

**Action:** (Optionnel)
```bash
npx update-browserslist-db@latest
```

**Risque:** Aucun - Juste mise à jour des données

---

## 🆘 FAQ

### Q: Comment réinitialiser la base de données?

**A:** ⚠️ DANGER - Cela supprimera tout!

```sql
-- Option 1: Supabase Dashboard > SQL Editor
TRUNCATE public.newsletters CASCADE;
TRUNCATE public.newsletter_subscribers CASCADE;

-- Option 2: CLI
supabase db reset
```

### Q: Où sont les logs?

**A:** Plusieurs endroits:

1. **Browser Console**: F12 > Console
2. **Terminal**: Où vous avez lancé `npm run dev`
3. **Supabase Logs**: Dashboard > Logs
4. **Function Logs**: `supabase functions logs send-newsletter`

### Q: Comment changer le mot de passe admin?

**A:** Via Supabase:

1. Dashboard > Authentication > Users
2. Cliquer sur l'utilisateur
3. "Reset password" ou "Change password"

### Q: Comment ajouter des abonnés en bulk?

**A:** Via SQL ou CSV import:

```sql
-- Via SQL
INSERT INTO public.newsletter_subscribers (email, first_name, consent)
VALUES 
  ('user1@example.com', 'User 1', true),
  ('user2@example.com', 'User 2', true),
  ('user3@example.com', 'User 3', true);

-- Via CSV: Supabase Dashboard > Table > Import
```

### Q: Puis-je utiliser un autre service email que Resend?

**A:** Oui! Modifier [supabase/functions/send-newsletter/index.ts](supabase/functions/send-newsletter/index.ts):

- SendGrid
- Mailgun
- AWS SES
- etc.

---

## 📞 Besoin d'Aide?

1. **Vérifier les logs** (F12 > Console)
2. **Vérifier la console du terminal**
3. **Vérifier Supabase Dashboard > Logs**
4. **Vérifier `.env.local`**
5. **Relancer le serveur**: `npm run dev`

---

## 🔄 Checklist de Diagnostic

```
Avant de signaler un problème, vérifier:

□ Node.js installé: `node --version`
□ npm installé: `npm --version`
□ Dépendances installées: `npm list @supabase/supabase-js`
□ .env.local existe: `ls -la .env.local`
□ Variables d'env correctes: `cat .env.local`
□ Serveur lancé: http://localhost:8081/
□ Pas d'erreurs dans console: F12 > Console
□ Pas d'erreurs dans terminal
□ Supabase accessible: https://ybzrbrjdzncdolczyvxz.supabase.co
□ Authentifié dans Supabase: vérifier Auth tab
□ Rôle admin assigné: SELECT * FROM user_roles
□ RLS activé: vérifier policies
```

---

**Status**: 🟢 **Prêt à l'emploi - Tous les services fonctionnent!**

Démarrer: `npm run dev`  
Accéder au site: http://localhost:8081/  
Admin panel: http://localhost:8081/admin/newsletter
