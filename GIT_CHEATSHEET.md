# 📚 Git Cheat Sheet - Les P'tits Trinquat

## 🔧 Configuration Initiale

```bash
# Configurer votre nom et email
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Vérifier la configuration
git config --list
```

---

## 🌿 Gestion des Branches

### Voir les branches
```bash
# Lister toutes les branches locales
git branch

# Lister toutes les branches (locales + distantes)
git branch -a

# Voir le commit actuel de chaque branche
git branch -v

# Voir les branches avec leur dernier commit
git branch -vv
```

### Créer une branche
```bash
# Créer une nouvelle branche depuis la branche courante
git branch <nom-branche>

# Créer une branche depuis une branche spécifique
git branch <nom-branche> <branche-source>

# Créer et basculer sur la nouvelle branche
git checkout -b <nom-branche>
git switch -c <nom-branche>  # Syntaxe moderne
```

### Basculer entre branches
```bash
# Basculer sur une branche existante
git checkout <nom-branche>
git switch <nom-branche>  # Syntaxe moderne

# Basculer en créant une branche de suivi pour une branche distante
git checkout --track origin/<nom-branche>
```

### Supprimer une branche
```bash
# Supprimer une branche locale
git branch -d <nom-branche>

# Forcer la suppression (même si non fusionnée)
git branch -D <nom-branche>

# Supprimer une branche distante
git push origin --delete <nom-branche>
```

### Renommer une branche
```bash
# Renommer la branche courante
git branch -m <nouveau-nom>

# Renommer une autre branche
git branch -m <ancien-nom> <nouveau-nom>

# Pusher le renommage
git push origin -u <nouveau-nom>
git push origin --delete <ancien-nom>
```

---

## 📝 Commits

### Vérifier l'état
```bash
# Voir les modifications non stagées
git status

# Voir les différences détaillées
git diff

# Voir les différences staged
git diff --staged
```

### Ajouter des fichiers
```bash
# Ajouter un fichier spécifique
git add <chemin-fichier>

# Ajouter tous les fichiers modifiés
git add .
git add -A

# Ajouter de manière interactive
git add -p
```

### Créer un commit
```bash
# Commit simple
git commit -m "Message du commit"

# Commit avec description détaillée
git commit -m "Titre" -m "Description détaillée du changement"

# Committer tous les fichiers modifiés (tracked)
git commit -am "Message du commit"

# Modifier le dernier commit
git commit --amend
```

### Voir l'historique
```bash
# Voir les commits de la branche courante
git log

# Voir les 5 derniers commits en une ligne
git log --oneline -5

# Voir les commits avec les branches
git log --graph --oneline --all

# Voir l'historique d'un fichier
git log -- <chemin-fichier>

# Voir les commits depuis une date
git log --since="2 weeks ago"
git log --until="1 week ago"
```

### Annuler des commits
```bash
# Annuler le dernier commit (garder les modifications)
git reset --soft HEAD~1

# Annuler le dernier commit (supprimer les modifications staged)
git reset --mixed HEAD~1

# Annuler le dernier commit (supprimer toutes les modifications)
git reset --hard HEAD~1

# Revenir à un commit spécifique
git reset --hard <hash-commit>

# Créer un commit d'annulation
git revert <hash-commit>
```

---

## 🔀 Fusionner et Rebaser

### Fusionner (merge)
```bash
# Fusionner une branche dans la branche courante
git merge <nom-branche>

# Fusionner sans créer de commit merge (si possible)
git merge --ff-only <nom-branche>

# Fusionner en créant un commit merge obligatoire
git merge --no-ff <nom-branche>

# Fusionner avec message personnalisé
git merge -m "Titre du merge" <nom-branche>
```

### Rebaser
```bash
# Rebaser la branche courante sur une autre
git rebase <branche-destination>

# Rebaser de manière interactive
git rebase -i HEAD~3  # Les 3 derniers commits

# Continuer après une résolution de conflit
git rebase --continue

# Annuler un rebase
git rebase --abort
```

### Résoudre les conflits
```bash
# Voir les fichiers en conflit
git status

# Voir les détails des conflits
git diff

# Résoudre en faveur de la branche courante
git checkout --ours <fichier>

# Résoudre en faveur de la branche fusionnée
git checkout --theirs <fichier>

# Après résolution, staguer et continuer
git add <fichier>
git commit
```

---

## 📤 Push et Pull

### Récupérer les changements
```bash
# Récupérer les changements (sans fusionner)
git fetch

# Récupérer et fusionner
git pull

# Pull avec rebase (plus propre que merge)
git pull --rebase

# Récupérer d'une branche spécifique distante
git fetch origin <nom-branche>
```

### Envoyer les changements
```bash
# Pusher la branche courante
git push

# Pusher une branche spécifique
git push origin <nom-branche>

# Pusher et créer une branche de suivi
git push -u origin <nom-branche>

# Pusher toutes les branches
git push --all

# Pusher les tags
git push origin --tags

# Forcer le push (danger! utiliser avec prudence)
git push --force
git push --force-with-lease  # Plus sûr
```

### Supprimer une branche distante
```bash
git push origin --delete <nom-branche>
git push origin :<nom-branche>  # Syntaxe alternative
```

---

## 🔍 Inspection et Debugging

### Voir les détails
```bash
# Voir les informations d'un commit
git show <hash-commit>

# Voir qui a modifié chaque ligne d'un fichier
git blame <chemin-fichier>

# Voir les changements entre deux commits
git diff <commit1>..<commit2>

# Voir les changements entre deux branches
git diff <branche1>..<branche2>
```

### Rechercher
```bash
# Rechercher un commit par message
git log --grep="texte-recherche"

# Rechercher un commit par auteur
git log --author="nom-auteur"

# Trouver quel commit a introduit une modification
git log -S "texte" -- <chemin-fichier>
```

### Nettoyer
```bash
# Voir les branches que l'on peut supprimer
git branch --merged

# Voir les branches non fusionnées
git branch --no-merged

# Nettoyer les références de branches supprimées
git fetch --prune

# Supprimer les fichiers non tracés (attention!)
git clean -fd
```

---

## 🔐 Remotes

### Gérer les remotes
```bash
# Voir tous les remotes
git remote -v

# Voir les détails d'un remote
git remote show origin

# Ajouter un remote
git remote add <nom> <url>

# Renommer un remote
git remote rename <ancien-nom> <nouveau-nom>

# Supprimer un remote
git remote remove <nom>

# Changer l'URL d'un remote
git remote set-url origin <nouvelle-url>
```

---

## 🎯 Workflow Complet - Les P'tits Trinquat

### 1️⃣ Démarrer une nouvelle feature
```bash
# Récupérer les derniers changements
git fetch origin

# Créer une branche depuis dev
git checkout -b feature/ma-feature origin/dev

# Ou depuis une branche spécifique
git checkout -b feature/ma-feature origin/<branche>
```

### 2️⃣ Travailler sur la feature
```bash
# Voir le statut
git status

# Ajouter et commiter
git add .
git commit -m "feat: Description du changement"

# Pusher la branche
git push -u origin feature/ma-feature
```

### 3️⃣ Mettre à jour depuis dev
```bash
# Récupérer les changements de dev
git fetch origin dev

# Rebaser ou merger
git rebase origin/dev
# ou
git merge origin/dev
```

### 4️⃣ Fusionner avec dev
```bash
# Basculer sur dev
git checkout dev

# Récupérer les derniers changements
git fetch origin

# Mettre à jour dev localement
git pull origin dev

# Fusionner la feature
git merge feature/ma-feature

# Pusher
git push origin dev
```

### 5️⃣ Nettoyer
```bash
# Supprimer la branche locale
git branch -d feature/ma-feature

# Supprimer la branche distante
git push origin --delete feature/ma-feature
```

---

## 📊 Comparaison de Commits/Branches

```bash
# Nombre de commits entre deux branches
git rev-list --count dev..feature

# Voir les commits présents dans feature mais pas dans dev
git log dev..feature --oneline

# Voir les fichiers modifiés entre deux branches
git diff --name-only dev..feature

# Voir les fichiers supprimés
git diff --name-status --diff-filter=D dev..feature
```

---

## 🚨 Commandes de Secours

```bash
# Voir l'historique des actions (reflog)
git reflog

# Revenir à un commit après un reset
git reset --hard <hash-reflog>

# Récupérer un commit supprimé
git cherry-pick <hash-commit>

# Voir les fichiers en attente de fusion
git ls-files -u

# Stasher les changements temporairement
git stash
git stash list
git stash pop
git stash drop
```

---

## 💡 Tips & Bonnes Pratiques

```bash
# Créer un alias pour les commandes fréquentes
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'

# Voir les alias configurés
git config --global --get-regexp alias

# Créer un patch d'un commit
git format-patch -1 <hash-commit>

# Appliquer un patch
git apply <fichier.patch>
```

---

## 📚 Ressources

- Aide rapide: `git help <commande>`
- Documentation officielle: https://git-scm.com/doc
- Visualiser git: https://git-school.github.io/visualizing-git/

---

**Version:** 1.0  
**Dernière mise à jour:** Décembre 2025  
**Projet:** Les P'tits Trinquat
