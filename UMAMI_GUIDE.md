# 📊 Guide Umami - Analyse du Site Web

Umami est un système d'analyse web respectueux de la vie privée **RGPD-compliant** qui vous permet de suivre le comportement de vos visiteurs.

## 🚀 Accès au Dashboard

**URL:** [https://cloud.umami.is](https://cloud.umami.is)  
**Website ID:** `4ac64079-273f-4ec2-bc4f-397010975839`

## 📱 Données Trackées

### 1️⃣ **Page Views** (Vues de page)
- Toutes les pages visitées
- Temps passé sur chaque page
- Appareils et navigateurs utilisés

### 2️⃣ **Événements Personnalisés**

#### Newsletter
```
Événement: newsletter_subscription_success
Données: {
  firstName: "Jean",     // Prénom du nouvel abonné
  email: "jean@..."      // Email
}
```

#### Tombola - Participants
```
Événement: tombola_participant_registration
Données: {
  name: "Marie",         // Nom du participant
  email: "marie@...",    // Email
  emoji: "😊"            // Emoji choisi
}
```

#### Tombola - Lots
```
Événement: tombola_lot_proposed
Données: {
  lotName: "Jeu de société",
  emoji: "🎮",
  participantName: "Jean"
}

Événement: tombola_lot_reserved
Données: {
  lotName: "Jeu de société",
  participantName: "Marie",
  emoji: "🎮"
}

Événement: tombola_lot_contact_clicked
Données: {
  lotName: "Jeu de société",
  contactType: "owner",
  emoji: "🎮"
}

Événement: tombola_lot_delivered
Données: {
  lotName: "Jeu de société",
  emoji: "🎮"
}
```

## 📈 Tableaux de Bord Recommandés

### Vue Générale
- **Visiteurs uniques** (par jour/semaine/mois)
- **Pages les plus visitées**
- **Temps moyen par page**
- **Taux de rebond**

### Analyse Engagement
- **Événement:** Regardez l'onglet "Events"
- **Leaderboards:** Quels lots sont les plus réservés?
- **Conversions:** Taux d'inscription newsletter vs visiteurs

### Performance
- **Appareils:** Répartition mobile/desktop
- **Navigateurs:** Chrome, Safari, Firefox, etc.
- **Localisations:** Région géographique des visiteurs

## 💡 Cas d'Utilisation

### Mesurer le Succès d'une Actualité
1. Allez dans **Events** fil
2. Filtrez par `tombola_lot_proposed`
3. Comparez: QUI propose quoi, QUAND

### Analyser la Newsletter
1. Onglet **Events** → `newsletter_subscription_success`
2. Voyez: Combien de nouvelles inscriptions par jour?
3. Tendance: Montante ou baissante?

### Optimiser l'UX Tombola
1. Mesurez: Type de lots populaires (via `emoji`)
2. Analysez: Ratio réservations/contacts (lot_reserved vs lot_contact_clicked)
3. Décidez: Faut-il ajuster les règles de réservation?

## 🔒 Données Sécurisées

✅ **Respectueux de la vie privée:**
- Pas de cookies tiers
- Pas de suivi cross-domain
- Anonyme par défaut
- **RGPD compliant**

✅ **Cloudflare Protection:**
- Les données sont hébergées sur l'infrastructure Umami Cloud sécurisée
- Chiffrement en transit (HTTPS)

## 📖 Documentation Complète

Pour plus de détails: [https://umami.is/docs](https://umami.is/docs)

## 🔧 Maintenance

### Vérifier que le tracking fonctionne
1. Ouvrez DevTools (F12)
2. Console → Cherchez `[Umami] Event tracked`
3. Chaque action doit afficher un log

### Si le tracking ne fonctionne pas
- Vérifiez que `index.html` contient le script Umami
- Confirmo que le Website ID est correct : `4ac64079-273f-4ec2-bc4f-397010975839`
- Attendez 5-10 minutes dopo une action réelle
- Rafraîchissez le dashboard Umami

## 📞 Support

- **Umami Community:** [https://github.com/umami-software/umami](https://github.com/umami-software/umami)
- **Issues:** Questions sur ce setup? Ajoutez des logs dans les event handlers

---

**Dernière mise à jour:** 9 mars 2026
