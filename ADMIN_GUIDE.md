# 🔐 Guide d'Accès - Tableau de Bord Newsletter

## 🎯 Accès Rapide

**URL**: http://localhost:8081/admin/newsletter

---

## ✅ Prérequis

### 1. **Créer un Utilisateur Admin dans Supabase**

1. Allez sur votre dashboard Supabase:
   https://ybzrbrjdzncdolczyvxz.supabase.co

2. Cliquez sur **Authentication** → **Users** (dans le menu de gauche)

3. Cliquez sur **"Add user"** → **"Create new user"**

4. Remplissez:
   - **Email**: Votre email (ex: admin@example.com)
   - **Password**: Un mot de passe sécurisé (minimum 6 caractères)
   - Cochez **"Generate random password"** (optionnel)

5. Cliquez **"Create user"**

### 2. **Assigner le Rôle Admin**

Après création de l'utilisateur, vous devez assigner le rôle `admin`.

**Option A: Via Supabase SQL Editor**

1. Allez sur **SQL Editor** dans Supabase Dashboard
2. Exécutez cette requête (remplacez `USER_ID` par l'UUID de votre utilisateur):

```sql
-- Trouver l'UUID de votre utilisateur
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';

-- Puis assigner le rôle admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('VOTRE_UUID_ICI', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Vérifier que c'est assigné
SELECT * FROM public.user_roles WHERE user_id = 'VOTRE_UUID_ICI';
```

**Option B: Via Application (si implémenté)**

- À coder dans une fonction admin setup

---

## 🔑 Se Connecter

### Première connexion:

1. Allez sur: http://localhost:8081/admin/newsletter
2. Vous serez redirigé vers la page de login
3. Entrez vos identifiants (email + password)
4. Cliquez **"Sign In"**

### Si ça ne marche pas:

- ✅ Vérifiez que l'utilisateur existe dans Supabase Auth
- ✅ Vérifiez que le rôle `admin` est assigné
- ✅ Ouvrez la console (F12) pour voir les erreurs
- ✅ Vérifiez les variables `.env.local`

---

## 📊 Tableau de Bord

Une fois connecté, vous avez accès à:

### 📋 **Colonne Gauche: Gestion des Abonnés**

**Liste des Abonnés:**
- 🔍 Recherche par email/nom
- ✏️ Statut (actif/inactif) avec toggle
- 🗑️ Bouton supprimer
- 📊 Compteur total/actif

**Fonctionnalités:**
```
Actions disponibles:
┌─────────────────────────────┐
│ 🔍 Recherche                │
│ ✅ Activer/Désactiver       │
│ 🗑️ Supprimer abonné         │
│ 🔄 Actualiser la liste      │
└─────────────────────────────┘
```

### 📝 **Colonne Droite: Gestion des Newsletters**

**Éditeur de Newsletter:**
- 📌 Titre de la newsletter
- 📧 Sujet (objet email)
- 📄 Contenu (éditeur texte)
- 👥 Nombre de destinataires
- 💾 Bouton "Enregistrer comme brouillon"
- 📤 Bouton "Envoyer la newsletter"

**Historique:**
- 📜 Liste des newsletters créées
- 📊 Statut (draft/sent)
- 🗑️ Supprimer newsletter
- 👁️ Voir détails

---

## 💾 Workflows

### 1️⃣ **Créer une Newsletter**

```
1. Remplir le formulaire:
   - Titre: "Newsletter Janvier 2026"
   - Sujet: "Les news du mois"
   - Contenu: Votre message
   
2. Cliquer "Enregistrer comme brouillon"
   → Sauvegardé avec status "draft"
   
3. Plus tard, cliquer "Envoyer la newsletter"
   → Status passe à "sent"
   → Emails envoyés aux abonnés
```

### 2️⃣ **Gérer les Abonnés**

```
1. Voir la liste complète
2. Rechercher un abonné
3. Désactiver (mais ne pas supprimer)
   → L'abonné ne recevra pas les emails
4. Supprimer si demande
   → Suppression définitive
```

### 3️⃣ **Envoyer une Newsletter**

```
1. Créer ou éditer une newsletter
2. Vérifier le contenu
3. Voir le nombre de destinataires
4. Cliquer "Envoyer la newsletter"
5. Confirmer l'envoi
6. Status passe à "sent"
```

---

## 🚀 Fonctionnalités Disponibles

| Fonctionnalité | Status | Notes |
|---|---|---|
| Voir la liste des abonnés | ✅ Actif | Recherche, statut, suppression |
| Créer une newsletter | ✅ Actif | Sauvegarde en brouillon |
| Envoyer une newsletter | ✅ Actif | Envoie via Resend |
| Voir l'historique | ✅ Actif | Avec statuts |
| Activer/désactiver abonnés | ✅ Actif | Sans suppression |
| Statistiques | 🟡 En dev | Vue des stats d'envoi |
| Templates | 🟡 En dev | Templates pré-définies |

---

## 📧 Configuration Email (Resend)

### Pour Activer l'Envoi d'Emails:

1. Créer un compte: https://resend.com
2. Vérifier votre domaine
3. Récupérer votre **API Key**
4. Ajouter dans `.env.local`:
   ```
   VITE_RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
   ```
5. Redémarrer le serveur

### Sans Configuration:
- ✅ Vous pouvez tester l'interface
- ❌ Les emails ne seront pas envoyés
- 💡 Peut être testé en mode "dry-run"

---

## 🐛 Troubleshooting

### **Problème: "Accès refusé" ou "Unauthorized"**
```
Solution:
1. Vérifier que vous êtes connecté (email affiché en haut)
2. Vérifier que user_id a le rôle 'admin' dans user_roles
3. Vérifier les RLS policies sur Supabase

Requête SQL pour vérifier:
SELECT * FROM public.user_roles 
WHERE user_id = 'votre_uuid';
```

### **Problème: La liste des abonnés n'apparaît pas**
```
Solution:
1. Vérifier que .env.local a les bonnes clés
2. Vérifier que les tables existent (Supabase > SQL Editor)
3. Vérifier les RLS policies

Requête SQL:
SELECT * FROM public.newsletter_subscribers LIMIT 5;
```

### **Problème: Les emails ne s'envoient pas**
```
Solution:
1. Vérifier que VITE_RESEND_API_KEY est dans .env.local
2. Vérifier que c'est une clé valide de Resend
3. Vérifier les logs dans Supabase (Functions)

Logs:
Supabase Dashboard > Logs > Functions > send-newsletter
```

---

## 📱 Accès Mobile

Le tableau de bord est responsive!

- 📱 Fonctionne sur téléphone/tablette
- 📱 Menu adaptatif
- 📱 Touch-friendly buttons

Accès via: http://VOTRE_IP:8081/admin/newsletter

---

## 🔒 Sécurité

- ✅ Authentification requise
- ✅ Rôle admin obligatoire
- ✅ RLS activé sur les tables
- ✅ JWT validation
- ✅ XSS protection
- ✅ CORS configuré

---

## 📞 Support

Si vous avez des problèmes:

1. **Vérifier la console** (F12 > Console)
2. **Vérifier les logs Supabase**
3. **Vérifier .env.local**
4. **Relancer le serveur**: `npm run dev`

---

**Status**: 🟢 **PRÊT À L'EMPLOI**

Accédez au tableau de bord: http://localhost:8081/admin/newsletter
