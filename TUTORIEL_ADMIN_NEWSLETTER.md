# 📧 GUIDE D'UTILISATION - Espace Admin Newsletter

Guide complet pour gérer la newsletter des P'tits Trinquat

---

## 🔑 CONNEXION À L'ADMIN

### Étape 1 : Accéder à la page de connexion

```
URL: https://lespetitstrinquat.fr/admin/newsletter
ou http://localhost:8082/admin/newsletter (en local)
```

### Étape 2 : Entrer vos identifiants

```
Email:    admin@lespetitstrinquat.fr
Mot de passe: [Votre mot de passe]
```

### Étape 3 : Cliquer "Se connecter"

```
✅ Connexion réussie → Accès au dashboard
❌ Connexion échouée → Vérifier email/mdp
```

---

## 📊 TABLEAU DE BORD ADMIN

### Vue d'ensemble

```
┌─────────────────────────────────────────────────┐
│ GESTION NEWSLETTER - ADMIN                      │
├─────────────────────────────────────────────────┤
│                                                 │
│ 👥 Abonnés: 1,523                             │
│                                                 │
│ ┌──────────────────────────────────────────┐  │
│ │ Rechercher un abonné...                  │  │
│ └──────────────────────────────────────────┘  │
│                                                 │
│ LISTE DES ABONNÉS                              │
│ ┌──────────────────────────────────────────┐  │
│ │ Email              │ Prénom   │ Actions  │  │
│ ├──────────────────────────────────────────┤  │
│ │ marie@email.com    │ Marie    │ ⚙️ 🗑️    │  │
│ │ jean@email.com     │ Jean     │ ⚙️ 🗑️    │  │
│ │ sophie@email.com   │ Sophie   │ ⚙️ 🗑️    │  │
│ └──────────────────────────────────────────┘  │
│                                                 │
│ [Envoyer une Newsletter]  [Déconnexion]      │
└─────────────────────────────────────────────────┘
```

### Chiffres clés

- **Total abonnés** : Nombre total de personnes inscrites
- **Abonnés actifs** : Ceux qui reçoivent nos emails
- **Newsletters envoyées** : Historique d'envois

---

## 👥 GÉRER LES ABONNÉS

### 1️⃣ Consulter la liste

```
La liste affiche:
├─ Email de l'abonné
├─ Prénom (si renseigné)
├─ Statut (actif/inactif)
├─ Date d'inscription
└─ Actions (modifier, supprimer)
```

### 2️⃣ Rechercher un abonné

```
1. Cliquer dans la barre "Rechercher un abonné..."
2. Taper l'email ou le nom
3. La liste se filtre automatiquement
```

**Exemple:**
```
Recherche: "marie"
↓
Résultats: marie@email.com (Marie)
```

### 3️⃣ Activer/Désactiver un abonné

```
1. Trouver l'abonné dans la liste
2. Cliquer l'icône ⚙️ (engrenage)
3. "Modifier le statut"
   ├─ ✅ Actif → Reçoit les emails
   └─ ❌ Inactif → Ne reçoit rien
```

**Cas d'usage:**
- Quelqu'un demande à arrêter → Désactiver
- Quelqu'un se réinscrit → Réactiver

### 4️⃣ Supprimer un abonné

```
1. Cliquer l'icône 🗑️ (trash)
2. Confirmer: "Êtes-vous sûr ?"
3. ✅ Abonné supprimé
```

⚠️ **Attention:** Suppression = perte de données définitive !

### 5️⃣ Exporter la liste

```
1. Cliquer "Télécharger CSV"
2. Fichier téléchargé: newsletter_subscribers.csv
3. Ouvrir dans Excel/Google Sheets

Contient: email, prénom, date inscription, statut
```

---

## 📨 ENVOYER UNE NEWSLETTER

### Étape 1 : Préparer le message

```
1. Cliquer le bouton [Envoyer une Newsletter]
2. Une fenêtre s'ouvre avec le formulaire
```

### Étape 2 : Remplir les champs

#### **Objet (Sujet)**
```
❌ Mauvais:   "Bonjour"
✅ Bon:       "🎄 Fête d'école 2026 - Informations importantes"
✅ Bon:       "Newsletter du mois de mars - Nouvelles activités"
```

**Conseils:**
- Être clair et attractif
- Inclure emojis (Plus vu dans la boîte aux lettres)
- Max 60 caractères (pour affichage sur mobile)

#### **Contenu (Message)**
```
Exemple simple:

Chère famille,

Nous avons le plaisir de vous annoncer...

[Votre texte ici]

Cordialement,
L'équipe des P'tits Trinquat
```

**Conseils:**
- Être courtois et professionnel
- Laisser des espaces entre les paragraphes
- Inclure un appel à l'action (lien, date, etc.)

#### **HTML (Optionnel - Pour les emails stylisés)**
```html
<div style="background: #f0f0f0; padding: 20px; border-radius: 5px;">
  <h1 style="color: #333;">Titre de votre newsletter</h1>
  <p>Votre contenu ici</p>
  <a href="https://lespetitstrinquat.fr" style="color: #007bff;">
    Lire la suite
  </a>
</div>
```

⚠️ **Note:** Si HTML vide → Utilise le contenu texte

### Étape 3 : Aperçu

```
1. Cliquer [Aperçu]
2. Voir comment ça s'affiche
3. ← [Editer] ou [Envoyer]
```

### Étape 4 : Envoyer

```
1. Réviser une dernière fois
2. Cliquer [Envoyer]
3. Confirmation: "Newsletter envoyée à 1,523 abonnés" ✅
```

---

## 📋 TEMPLATES PRÊTS À L'EMPLOI

### Template 1 : Annonce d'évènement
```
Objet: 🎉 Fête d'école 2026 - Rejoignez la fête !

Contenu:

Chère famille,

Nous sommes heureux de vous inviter à notre fête d'école !

📅 Date: Samedi 19 juin 2026
🕐 Horaire: 14h00 - 19h00
📍 Lieu: Cour de l'école

Au programme:
✨ Jeux en famille
✨ Spectacles
✨ Douceurs gourmandes
✨ Ambiance festive

Nous vous attendons nombreux !

Cliquez ici pour plus d'infos:
https://lespetitstrinquat.fr/actualites

Cordialement,
L'équipe des P'tits Trinquat
```

### Template 2 : Information importante
```
Objet: ℹ️ Fermeture école - Vacances scolaires

Contenu:

Chères familles,

Veuillez noter que l'école sera fermée du 17 au 21 avril 
pour les vacances scolaires.

Réouverture: Lundi 24 avril 2026

Bonnes vacances à tous !

L'équipe pédagogique
```

### Template 3 : Appel à participation
```
Objet: 🤝 Nous avons besoin de vous - Vente de crêpes

Contenu:

Chère communauté,

L'association organise une vente de crêpes pour financer 
les sorties pédagogiques.

📅 Vendredi 20 février 2026
🕐 16h30 - 18h00
📍 Parvis de l'école

Nous cherchons des bénévoles pour:
👨‍🍳 Faire les crêpes
🎫 Vendre les tickets
📢 Accueillir les visiteurs

Intéressé(e)? Répondez à cet email !

Merci pour votre soutien !
```

---

## 📊 VOIR L'HISTORIQUE D'ENVOIS

### Consulter les envois précédents

```
1. Cliquer [Historique]
2. Voir tous les emails envoyés:
   ├─ Date d'envoi
   ├─ Objet
   ├─ Nombre de destinataires
   ├─ Statut (envoyé avec succès)
   └─ Aperçu
```

### Réenvoyer une newsletter

```
1. Trouver l'email dans l'historique
2. Cliquer [Dupliquer]
3. Le formulaire se remplit avec le contenu
4. Modifier si besoin
5. [Envoyer]
```

---

## ⚙️ PARAMÈTRES ADMIN

### Modifier mon profil

```
1. Cliquer l'icône 👤 (profil) en haut à droite
2. [Paramètres]
3. Modifier:
   ├─ Prénom
   ├─ Email
   └─ Mot de passe (⚠️ Confidentiel)
4. [Sauvegarder]
```

### Changer le mot de passe

```
1. [Paramètres] → [Sécurité]
2. Ancien mot de passe: [...]
3. Nouveau mot de passe: [...]
4. Confirmer: [...]
5. [Changer]
```

**Conseils sécurité:**
- Mot de passe: 8+ caractères
- Inclure majuscules, minuscules, chiffres
- Unique (ne pas réutiliser)
- Changer tous les 3-6 mois

---

## 🔔 NOTIFICATIONS & ALERTES

### Vous recevrez une notification si:

```
✅ Newsletter envoyée avec succès
✅ Nouvel abonné inscrit
⚠️ Erreur d'envoi (destinataire invalide)
⚠️ Trop d'emails en même temps (rate limit)
```

### Où les voir?

```
1. 🔔 Cloche en haut à droite
2. Ou dans "Notifications" (menu)
3. Ou dans votre email (si configuré)
```

---

## 🔐 BONNES PRATIQUES

### ✅ À FAIRE

```
✅ Envoyer une newsletter par mois max (sauf urgence)
✅ Relire avant d'envoyer
✅ Utiliser des objets clairs et attrayants
✅ Respecter les horaires (pas avant 8h, pas après 20h)
✅ Mettre à jour les infos de contact régulièrement
✅ Segmenter les listes (familles, partenaires, etc.)
✅ Inclure un lien "Se désinscrire"
```

### ❌ À NE PAS FAIRE

```
❌ Spammer (emails trop fréquents)
❌ Envoyer à des emails invalides
❌ Mauvais contenu (hors sujet)
❌ Partager les emails (RGPD)
❌ Oublier de signer
❌ Mettre des infos sensibles
❌ Envoyer sans vérifier la cible
```

---

## 🐛 DÉPANNAGE

### Problème: "Impossible de se connecter"

```
1. Vérifier l'email (pas d'espace, @, etc.)
2. Vérifier le mot de passe (majuscule/minuscule)
3. Vérifier que vous êtes admin en BD
4. Réinitialiser le mot de passe
   → [Mot de passe oublié?]
```

### Problème: "Newsletter ne s'envoie pas"

```
Vérifier:
1. Objet rempli? ✅
2. Contenu rempli? ✅
3. Affichage de l'objet? (< 60 caractères)
4. Vérifier la console (F12) pour erreurs
5. Reload la page
```

### Problème: "Les abonnés ne reçoivent rien"

```
Possibles causes:
1. Abonnés marqués comme inactifs
   → Les réactiver
2. Emails en spam
   → Demander d'ajouter à contacts
3. Erreur technique
   → Vérifier logs Cloudflare Workers
```

### Problème: "Impossible de trouver un abonné"

```
1. Vérifier l'email exact (tirez-le du formulaire)
2. Utiliser une partie seulement (prénom)
3. Chercher sans accents
4. Vérifier que l'abonné est actif (pas supprimé)
```

---

## 📱 ACCÈS MOBILE

### L'admin fonctionne sur mobile?

```
✅ OUI - Responsive design
```

### Instructions mobile

```
1. Ouvrir le navigateur
2. Aller à: https://lespetitstrinquat.fr/admin/newsletter
3. Se connecter
4. Tout est accessible (peut être moins ergonomique)
5. Pour envoyer une newsletter:
   → Recommandé sur ordinateur
```

---

## 🆘 SUPPORT & AIDE

### Besoin d'aide?

```
📧 Email: admin@lespetitstrinquat.fr
📞 Appel: (à remplir)
💬 Slack: (à remplir)
```

### Questions fréquentes

**Q: Combien de temps avant que ça soit reçu?**
R: Immédiat en général (max 5 minutes)

**Q: Peut-on programmer l'envoi?**
R: Actuellement non - envoyer manuellement

**Q: Comment ajouter des images?**
R: Via HTML custom ou texte avec lien

**Q: Combien on peut inviter de personnes?**
R: Nombre illimité - L'API gère automatiquement

---

## ✨ CONSEILS POUR RÉUSSIR

### 1. Cadence d'envoi
```
📅 Idéal: 1 newsletter par mois
📅 Spécial: 1-2 par semaine en cas d'urgence
📅 Maximum: 2-3 par semaine (éviter lassitude)
```

### 2. Meilleur moment d'envoi
```
⏰ Jours: Lundi-Jeudi (plus lu)
⏰ Heures: 9h-11h ou 17h-19h
⏰ À éviter: Dimanche, jours fériés
```

### 3. Taux de lecture
```
📊 Bon: 20-30%
📊 Très bon: 30-40%
📊 Excellent: 40%+

💡 Améliorer: Meilleur objet, plus court, clearer
```

### 4. Taux de clic
```
📊 Acceptable: 5-10%
📊 Bon: 10-15%
💡 Améliorer: Plus de liens, appel à l'action clair
```

---

## 📚 RESSOURCES UTILES

### Outils externes recommandés

```
🎨 Créer des images:
   → Canva (gratuit, templates)
   → Figma (avancé)

📝 Écrire du contenu
   → Grammaire française
   → Générateur de texte IA

🔗 Raccourcir les URLs
   → bit.ly
   → tinyurl.com

📊 Analyser les résultats
   → Google Analytics
   → Mailchimp (si intégré)
```

---

## ✅ CHECKLIST AVANT ENVOI

Avant chaque envoi, vérifier:

```
□ Objet clair et attractif (< 60 caractères)
□ Destinataires corrects
□ Contenu sans fautes
□ Liens valides (testés)
□ Images affichent bien
□ Aperçu vérifié
□ Pas de caractères bizarres
□ Signature incluse
□ Mentionner comment se désinscrire (RGPD)
□ Envoyer à bonne heure
```

---

## 🎉 C'EST PRÊT!

Vous êtes maintenant prêt(e) à gérer la newsletter ! 

**Besoin de refresh?** Revenir à ce guide 📖

**Bonne chance!** 🚀
