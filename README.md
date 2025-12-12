# Les P'tits Trinquat - Site Web de l'Association de Parents d'Élèves

Site web officiel de l'association de parents d'élèves "Les P'tits Trinquat" du groupe scolaire Anne Frank – Charles Dickens à Montpellier.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Bun](https://img.shields.io/badge/Bun-Latest-f471b5?logo=bun)

## 📑 Table des matières

- [À propos du projet](#-à-propos-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies-utilisées)
- [Installation](#-installation)
- [Structure du projet](#-structure-du-projet)
- [Développement](#-développement)
- [Déploiement](#-déploiement)
- [Configuration DNS](#-configuration-dns-ovhcloud)
- [Personnalisation](#-personnalisation)
- [Contribution](#-contribution)
- [Contact](#-contact)

## 🎯 À propos du projet

Ce site permet aux parents d'élèves de :
- Découvrir l'association et ses missions
- Consulter les événements à venir
- Télécharger les comptes-rendus de réunions
- Découvrir les partenaires de l'association
- Contacter l'équipe du bureau

## 🚀 Fonctionnalités

- **Page d'accueil** : Présentation de l'association avec statistiques et aperçus
- **Événements** : Liste des événements avec filtres et détails
- **Comptes-rendus** : Documents téléchargeables (conseils d'école, AG, etc.)
- **Partenaires** : Galerie des partenaires locaux
- **À propos** : Mission, valeurs et membres du bureau
- **Contact** : Formulaire de contact et FAQ
- **Optimisé Mobile** : Design responsive
- **Animations** : Transitions fluides avec Framer Motion
- **Accessibilité** : Composants WCAG compliant

## 🛠️ Technologies utilisées

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides
- **shadcn/ui** - Composants UI accessibles
- **React Router** - Navigation SPA
- **React Query** - Gestion d'état asynchrone
- **Lucide Icons** - Icônes modernes
- **Bun** - Runtime JavaScript ultra-rapide

## 📦 Installation

### Prérequis

- **Bun 1.0+** (recommandé) ou Node.js 18+
- Git

### Installer Bun (optionnel mais recommandé)

```bash
curl -fsSL https://bun.sh/install | bash
```

### Étapes

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/les-ptits-trinquat-web-main.git

# Accéder au répertoire
cd les-ptits-trinquat-web-main

# Installer les dépendances (avec Bun)
bun install

# Ou avec npm
npm install
```

## 📁 Structure du projet

```
les-ptits-trinquat-web-main/
├── src/
│   ├── assets/              # Images et ressources statiques
│   ├── components/
│   │   ├── home/            # Composants de la page d'accueil
│   │   ├── layout/          # Header, Footer, Layout
│   │   └── ui/              # Composants UI réutilisables (shadcn)
│   ├── hooks/               # Hooks React personnalisés
│   ├── lib/                 # Utilitaires
│   ├── pages/               # Pages de l'application
│   ├── App.tsx              # Composant racine
│   ├── main.tsx             # Point d'entrée
│   └── index.css            # Styles globaux
├── public/
│   ├── documents/           # PDFs des comptes-rendus
│   ├── _redirects           # Configuration SPA Cloudflare
│   └── robots.txt           # SEO
├── .github/
│   └── workflows/           # GitHub Actions (déploiement automatique)
├── vite.config.ts           # Configuration Vite
├── tailwind.config.ts       # Configuration Tailwind
├── tsconfig.json            # Configuration TypeScript
├── package.json             # Dépendances et scripts
└── bun.lockb                # Lock file Bun
```

## 🔧 Développement

### Lancer le serveur de développement

```bash
bun run dev
```

Le site sera accessible sur `http://localhost:8080`

### Commandes disponibles

```bash
# Lancer le serveur de développement
bun run dev

# Build pour la production
bun run build

# Preview du build en local
bun run preview

# Linting (ESLint)
bun run lint

# Build en mode développement (avec sourcemaps)
bun run build:dev
```

### Hot Module Replacement (HMR)

Le code se recharge automatiquement lors de vos modifications. Aucune configuration supplémentaire nécessaire.

## 🚀 Déploiement

### Build de production

```bash
bun run build
```

Les fichiers seront générés dans le dossier `dist/`.

### Option 1: Cloudflare Pages ⭐ (Recommandée)

**Avantages:**
- ✅ CDN gratuit global
- ✅ Déploiement continu automatique
- ✅ SSL/TLS automatique
- ✅ Très simple à configurer

**Étapes:**

1. Allez sur [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Pages** → **Create a project**
3. Connectez votre dépôt GitHub
4. Configurez:
   - **Framework**: React
   - **Build command**: `bun run build`
   - **Build output directory**: `dist`
5. Cliquez sur **Save and Deploy**

**Déploiement automatique:** À chaque push sur `main`, le site se déploie automatiquement.

```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Option 2: GitHub Pages

**Étapes:**

1. Allez sur votre dépôt GitHub
2. **Settings** → **Pages**
3. **Source**: GitHub Actions
4. ✅ Cochez "Enforce HTTPS"

**Déploiement automatique:** Le workflow `.github/workflows/deploy-github-pages.yml` se déclenche automatiquement.

**Accès:** `https://[votre-username].github.io/les-ptits-trinquat-web-main/`

### Option 3: Netlify

**Étapes:**

1. Allez sur [netlify.com](https://netlify.com)
2. **New site from Git**
3. Connectez votre dépôt GitHub
4. Configurez:
   - **Build command**: `bun run build`
   - **Publish directory**: `dist`
5. Cliquez sur **Deploy**

### Option 4: Vercel

**Étapes:**

1. Allez sur [vercel.com](https://vercel.com)
2. **Import Project**
3. Sélectionnez votre dépôt GitHub
4. Vercel détecte automatiquement la configuration
5. Cliquez sur **Deploy**

---

## 🌐 Configuration DNS OVHCloud

### Prérequis
- Domaine acheté sur OVHCloud
- Accès à votre panel OVHCloud

### Pointer votre domaine vers Cloudflare (Recommandé)

#### Sur OVHCloud:

1. Allez sur [ovh.com/manager](https://www.ovh.com/manager)
2. **Domaines** → Sélectionnez votre domaine
3. **Onglet "Serveurs DNS"**
4. **Modifier** et remplacez par les serveurs Cloudflare:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ns3.cloudflare.com
   ns4.cloudflare.com
   ```
5. Cliquez sur **Valider**

#### Sur Cloudflare:

1. **Add a Site** et entrez votre domaine
2. Sélectionnez le plan **Free**
3. Une fois validé, allez dans **Pages** → Votre projet
4. **Settings** → **Custom domains**
5. Ajoutez votre domaine
6. Validez les DNS records

**Attendez 24-48h pour la propagation DNS**

### Pointer votre domaine vers GitHub Pages

#### Sur OVHCloud:

1. **Zone DNS** → **Ajouter une entrée**
2. Créez ces records:

```
Type: A
Nom: @
Cible: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153

Type: CNAME
Nom: www
Cible: [votre-username].github.io
```

3. Attendez la validation DNS

#### Sur GitHub:

1. **Settings** → **Pages**
2. **Custom domain**: Entrez votre domaine OVHCloud
3. ✅ Cochez "Enforce HTTPS"

### Vérifier la propagation DNS

```bash
# Vérifier les serveurs DNS
nslookup votredomaine.com

# Vérifier le certificat SSL
openssl s_client -connect votredomaine.com:443

# Vérifier l'accès HTTP
curl https://votredomaine.com
```

---

## 🎨 Personnalisation

### Contenu

- **Événements** : Modifier `src/pages/Evenements.tsx`
- **Comptes-rendus** : Ajouter les PDFs dans `public/documents/` et mettre à jour `src/pages/ComptesRendus.tsx`
- **Partenaires** : Modifier `src/pages/Partenaires.tsx`
- **Membres du bureau** : Modifier `src/pages/APropos.tsx`
- **Informations de contact** : Modifier `src/pages/Contact.tsx`

### Couleurs et Design

Les couleurs sont définies dans `src/index.css` via des variables CSS :

```css
:root {
  --primary: 24 95% 53%;      /* Orange chaleureux */
  --secondary: 330 81% 60%;   /* Rose vif */
  --sky: 199 89% 48%;         /* Bleu ciel */
  --sunshine: 45 93% 47%;     /* Jaune soleil */
}
```

Modifiez les valeurs HSL pour personnaliser le design.

### Configuration Tailwind

Modifiez `tailwind.config.ts` pour:
- Ajouter des fonts personnalisées
- Changer les breakpoints
- Ajouter de nouveaux composants

### Configuration Vite

Le `vite.config.ts` est configuré avec:
- Code splitting automatique
- Minification optimisée
- Support du `base` path pour sous-domaines

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

### Guidelines

- Respecter le TypeScript strict
- Tester les changements localement
- Vérifier que `bun run lint` passe
- Ajouter des commentaires pour le code complexe

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

- **Email** : contact@ptits-trinquat.fr
- **Site** : [ptits-trinquat.fr](https://ptits-trinquat.fr)
- **Facebook** : Les P'tits Trinquat
- **Instagram** : @lesptits_trinquat

## 🆘 Troubleshooting

### "npm/bun install échoue"
```bash
# Vérifier la version de Node/Bun
node --version
bun --version

# Supprimer les fichiers de cache
rm -rf node_modules bun.lockb
bun install
```

### "Le serveur dev ne démarre pas"
```bash
# Vérifier que le port 8080 est libre
lsof -i :8080

# Lancer sur un port différent
bun run dev -- --port 3000
```

### "DNS non résolu après déploiement"
- Attendez 24-48h après le changement sur OVHCloud
- Vérifiez avec `nslookup votredomaine.com`
- Videz le cache DNS: `ipconfig /flushdns` (Windows) ou `sudo dscacheutil -flushcache` (macOS)

### "Certificat SSL invalide"
- Attendez la validation du certificat (quelques minutes)
- Force refresh: `Ctrl+Shift+R` (ou `Cmd+Shift+R` sur macOS)

---

Fait avec ❤️ pour les enfants du groupe scolaire Anne Frank – Charles Dickens
# Déploiement
