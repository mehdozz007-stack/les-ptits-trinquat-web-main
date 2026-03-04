# Guide de nettoyage pour publication open-source

Ce guide détaille toutes les étapes nécessaires pour supprimer les références à Lovable et préparer le projet pour une publication personnelle ou open-source.

---

## 📋 Checklist rapide

- [ ] Nettoyer `index.html` (meta tags, scripts)
- [ ] Nettoyer `.env` (variables de configuration)
- [ ] Supprimer `supabase/config.toml` ou remplacer par config générique
- [ ] Mettre à jour `README.md`
- [ ] Nettoyer les fichiers de documentation
- [ ] Vérifier les composants React
- [ ] Configurer votre propre Supabase

---

## 1. Fichier `index.html`

### Éléments à supprimer

```html
<!-- SUPPRIMER ces meta tags Lovable -->
<meta property="og:image" content="https://lovable.dev/opengraph-image-p-...">
<meta name="twitter:image" content="https://lovable.dev/opengraph-image-p-...">
<meta name="twitter:card" content="summary_large_image">

<!-- SUPPRIMER le script de tagging Lovable -->
<script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
```

### Résultat attendu

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Les P'tits Trinquat</title>
    <meta name="description" content="Association de Parents d'Élèves - Groupe scolaire Anne Frank – Charles Dickens">
    
    <!-- Vos propres meta tags OG si nécessaire -->
    <meta property="og:title" content="Les P'tits Trinquat">
    <meta property="og:description" content="Association de Parents d'Élèves">
    <meta property="og:image" content="/votre-image-og.png">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 2. Fichier `.env`

### Configuration actuelle (Lovable Cloud)

```env
VITE_SUPABASE_PROJECT_ID="solygkoogcdamggsilzf"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJ..."
VITE_SUPABASE_URL="https://solygkoogcdamggsilzf.supabase.co"
```

### Configuration pour votre propre Supabase

```env
# Remplacer par vos propres valeurs Supabase
VITE_SUPABASE_URL="https://VOTRE_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="votre_anon_key_ici"
```

### Créer un fichier `.env.example`

```env
# Configuration Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Ne pas commiter le fichier .env avec les vraies valeurs !
```

---

## 3. Fichier `supabase/config.toml`

### Option A : Supprimer complètement

Si vous n'utilisez pas les Edge Functions en développement local, supprimez ce fichier.

### Option B : Remplacer par une configuration générique

```toml
# Configuration Supabase locale
# Remplacer project_id par votre propre ID de projet

project_id = "votre_project_id"

[functions.send-newsletter]
verify_jwt = false

[functions.get-contact-link]
verify_jwt = false
```

---

## 4. Fichier `src/integrations/supabase/client.ts`

Ce fichier est généralement auto-généré. Pour une publication open-source, créez une version générique :

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 5. Fichier `README.md`

### Sections à mettre à jour

1. **Badges** : Remplacer les badges Lovable par vos propres badges
2. **Installation** : Ajouter les instructions de configuration Supabase
3. **Déploiement** : Retirer les références à Lovable

### Exemple de section Installation mise à jour

```markdown
## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn ou bun
- Un compte Supabase (gratuit)

### Étapes

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-username/les-ptits-trinquat.git
   cd les-ptits-trinquat
   ```

2. **Configurer Supabase**
   - Créer un projet sur [supabase.com](https://supabase.com)
   - Exécuter les migrations SQL (voir `supabase/migrations/`)
   - Copier les clés API

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos clés Supabase
   ```

4. **Installer et lancer**
   ```bash
   npm install
   npm run dev
   ```
```

---

## 6. Rechercher et remplacer dans le code

### Termes à rechercher

```bash
# Dans le terminal, à la racine du projet :
grep -r "lovable" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.html"
grep -r "Lovable" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.html"
grep -r "gpteng" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.html"
grep -r "gptengineer" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.html"
```

### Fichiers potentiellement concernés

| Fichier | Contenu potentiel |
|---------|-------------------|
| `index.html` | Scripts, meta tags |
| `package.json` | Dépendance `lovable-tagger` |
| Documentation | Références textuelles |
| Commentaires | Notes de développement |

---

## 7. Dépendances à retirer

### Dans `package.json`

```bash
# Retirer la dépendance lovable-tagger
npm uninstall lovable-tagger
# ou
bun remove lovable-tagger
```

### Vérifier les imports

Rechercher les imports de lovable-tagger dans le code :

```bash
grep -r "lovable-tagger" --include="*.ts" --include="*.tsx"
```

Si trouvé, supprimer l'import et l'utilisation associée.

---

## 8. Configuration Supabase autonome

### Créer votre projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et la clé anon

### Exécuter les migrations

Les fichiers SQL sont dans `supabase/migrations/`. Exécutez-les dans l'ordre dans l'éditeur SQL de Supabase.

### Configurer les secrets pour les Edge Functions

Dans Supabase Dashboard → Settings → Edge Functions → Secrets :

| Secret | Description |
|--------|-------------|
| `RESEND_API_KEY` | Clé API Resend pour l'envoi d'emails |

### Déployer les Edge Functions

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier votre projet
supabase link --project-ref VOTRE_PROJECT_ID

# Déployer les fonctions
supabase functions deploy send-newsletter
supabase functions deploy get-contact-link
```

---

## 9. Fichiers de documentation

### Mettre à jour ces fichiers

| Fichier | Action |
|---------|--------|
| `docs/prompt-copilot-fullstack.md` | Retirer "Lovable Cloud" |
| `docs/prompt-admin-newsletter.md` | Vérifier les références |
| `docs/CHANGELOG-tombola-features.md` | Vérifier les références |

### Contenu déjà nettoyé

Le `README.md` principal a déjà été purgé des références Lovable.

---

## 10. Créer votre premier admin

Après avoir configuré votre propre Supabase :

```sql
-- 1. Un utilisateur s'inscrit via /admin/newsletter

-- 2. Récupérer son user_id
SELECT id, email FROM auth.users;

-- 3. Attribuer le rôle admin
INSERT INTO user_roles (user_id, role) 
VALUES ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'admin');
```

---

## 11. Vérification finale

### Checklist de vérification

```bash
# 1. Build de production réussit
npm run build

# 2. Pas d'erreurs liées à Lovable
npm run dev
# Vérifier la console du navigateur

# 3. Recherche finale
grep -r "lovable" dist/ --include="*.js" --include="*.html"
# Devrait retourner vide
```

### Test fonctionnel

- [ ] Page d'accueil s'affiche
- [ ] Inscription newsletter fonctionne
- [ ] Page tombola fonctionne
- [ ] Admin newsletter accessible (après création du compte admin)
- [ ] Envoi de newsletter fonctionne

---

## 📁 Structure finale recommandée

```
├── .env.example          # Template de configuration
├── .gitignore            # Ignorer .env, node_modules, dist
├── README.md             # Documentation mise à jour
├── docs/
│   ├── prompt-copilot-fullstack.md
│   ├── prompt-admin-newsletter.md
│   ├── prompt-open-source-cleanup.md  # Ce fichier
│   └── CHANGELOG-tombola-features.md
├── public/
├── src/
├── supabase/
│   ├── functions/
│   │   ├── send-newsletter/
│   │   └── get-contact-link/
│   └── migrations/       # Scripts SQL à exécuter
└── package.json
```

---

## 🎉 Résultat

Après avoir suivi ce guide, votre projet sera :

- ✅ **Indépendant** de Lovable Cloud
- ✅ **Configurable** avec votre propre Supabase
- ✅ **Publiable** sur GitHub ou autre plateforme
- ✅ **Déployable** sur Vercel, Netlify, ou autre hébergeur

---

## 📞 Support

Pour toute question sur la configuration Supabase :
- [Documentation Supabase](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
