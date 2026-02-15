# 🚀 DEPLOYMENT_OTP_SYSTEM.md

## Étapes de Déploiement du Système OTP

### Phase 1: Préparation Base de Données

```bash
# 1. Connecter à la DB D1 (production)
# Vérifier que la connexion est active

# 2. Exécuter la migration 0015
# File: cloudflare/migrations/0015_email_verification_otp.sql

# SQL pour exécuter:
CREATE TABLE email_verifications (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  verified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_verifications_email ON email_verifications(email);
CREATE INDEX idx_email_verifications_expires_at ON email_verifications(expires_at);
CREATE INDEX idx_email_verifications_verified ON email_verifications(verified);

# 3. Vérifier la table créée
SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table' AND name='email_verifications';
```

### Phase 2: Configuration Cloudflare Workers

```bash
# 1. Naviguer au répertoire Cloudflare
cd cloudflare

# 2. Vérifier les variables d'environnement dans wrangler.toml
# Doit contenir:
# [env.production]
# vars = { RESEND_API_KEY = "re_xxxxx..." }

# 3. Build du projet
npm run build

# 4. Déployer
wrangler deploy

# 5. Vérifier le déploiement
# - Vérifier les routes /auth/send-code et /auth/verify-code actives
# - Tester un appel POST simple
curl -X POST https://les-ptits-trinquat-api.mehdozz007.workers.dev/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Phase 3: Build Frontend

```bash
# 1. Retourner à la racine
cd ..

# 2. Installer les dépendances (si nécessaire)
npm install

# 3. Build pour production
npm run build

# 4. Vérifier les composants
# Les fichiers suivants doivent être présents:
# - src/components/tombola/AuthTombolaForm.tsx (modifié)
# - src/components/tombola/AuthTombolaFormOTP.tsx (nouveau)

# 5. Déployer sur Cloudflare Pages
# (Déploiement automatique via GitHub push à main)
git add .
git commit -m "feat: Add OTP email verification system"
git push origin main
```

### Phase 4: Tests de Validation

#### Test Backend - send-code

```bash
# Test 1: Email valide
curl -X POST http://localhost:3000/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Expected Response:
# {"success":true,"message":"Verification code sent"}

# Test 2: Email invalide
curl -X POST http://localhost:3000/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email"}'

# Expected Response:
# {"success":false,"error":"Invalid email format"}

# Test 3: Rate limiting (multiple rapid requests)
# Doit être bloqué après ~10 tentatives
```

#### Test Backend - verify-code

```bash
# Test 1: Code valide (obtenu d'un send-code précédent)
curl -X POST http://localhost:3000/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","code":"123456"}'

# Expected Response (si code correct):
# {
#   "success": true,
#   "data": {
#     "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#     "user": { "id": "user-abc123", "email": "user@example.com" }
#   }
# }

# Test 2: Code invalide
curl -X POST http://localhost:3000/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","code":"000000"}'

# Expected Response:
# {"success":false,"error":"Invalid verification code"}

# Test 3: Code expiré (attendre >10 min)
# Même code invalide doit retourner erreur
```

#### Test Frontend - UI Flow

```
1. Naviguer vers page inscription/connexion
2. Cliquer sur "utiliser un code par email"
3. Entrer email valide
4. Cliquer "Recevoir le code"
5. Vérifier email reçu (Resend dashboard)
6. Entrer les 6 chiffres du code
7. Vérifier countdown timer 60sec
8. Cliquer "Vérifier"
9. Entrer prénom, classe(s), choisir emoji
10. Accepter conditions
11. Cliquer "Créer mon profil"
12. Vérifier success animation
13. Vérifier redirection vers tombola
14. Vérifier localStorage: tombola_auth_token, tombola_current_user

Test Mobile:
- Responsive design sur screen <768px
- Input fields lisibles
- Buttons cliquables
- Animations fluides
```

#### Test Base de Données

```bash
# Vérifier les données OTP stockées (sans exposer les codes)
SELECT 
  email,
  verified,
  created_at,
  expires_at,
  CASE WHEN expires_at > datetime('now') THEN 'Valid' ELSE 'Expired' END as status
FROM email_verifications
ORDER BY created_at DESC
LIMIT 10;

# Vérifier les utilisateurs créés via OTP
SELECT id, email, created_at FROM users WHERE email LIKE '%@%' ORDER BY created_at DESC LIMIT 5;

# Vérifier les participants créés automatiquement
SELECT p.id, p.prenom, p.email, p.created_at 
FROM tombola_participants p
JOIN users u ON p.user_id = u.id
WHERE u.created_via_otp = true
ORDER BY p.created_at DESC;
```

### Phase 5: Rollback (si nécessaire)

```bash
# 1. Désactiver OTP UI (option)
# Dans AuthTombolaForm: importer et conditional render OTP component

# 2. Si table DB compromise:
# Supprimer la table (archive first)
DROP TABLE IF EXISTS email_verifications;

# 3. Restaurer déploiement précédent
wrangler deployments rollback --message "Rollback OTP system"

# 4. Frontend: Reset à version précédente
git revert <commit-hash>
```

---

## 📋 Checklist Déploiement

### Avant la Production
- [ ] Code review des fichiers OTP (utils, services, routes)
- [ ] Tests unitaires backend routes (send-code, verify-code)
- [ ] Tests E2E frontend OTP flow
- [ ] Vérifier RESEND_API_KEY dans wrangler.toml
- [ ] Database migration backup
- [ ] Plan de rollback documenté
- [ ] Monitoring/alertes configurées

### Déploiement
- [ ] Phase 1: Migration DB exécutée et vérifiée
- [ ] Phase 2: Cloudflare Workers build & deploy
- [ ] Phase 3: Frontend build & deploy à Cloudflare Pages
- [ ] Phase 4: Tests de validation (backend + frontend)
- [ ] Phase 5: Production smoke tests

### Post-Déploiement
- [ ] Monitorer les erreurs (Sentry, logs)
- [ ] Vérifier les emails Resend envoyés
- [ ] Tester flux complet - 2-3 utilisateurs réels
- [ ] Vérifier les audit logs (OTP_SENT, OTP_VERIFIED)
- [ ] Collecter feedback utilisateurs
- [ ] Mesurer adoption vs traditional auth

---

## 🔍 Monitoring & Debugging

### Logs à Surveiller

**Backend Cloudflare Workers:**
```
ERROR: sendVerificationEmail failed - ...
ERROR: Invalid email format - ...
WARN: Rate limit exceeded - ...
INFO: OTP_SENT - email: user@example.com
INFO: OTP_VERIFIED - email: user@example.com, user_id: abc123
```

**Database Audits:**
```sql
SELECT action, user_id, details, timestamp FROM audit_logs 
WHERE action IN ('OTP_SENT', 'OTP_VERIFIED') 
ORDER BY timestamp DESC LIMIT 50;
```

**Frontend Errors:**
```javascript
// Browser console
console.error("[AuthOTP] Verify code error: ...")
localStorage.getItem('tombola_auth_token')
localStorage.getItem('tombola_current_user')
```

### Health Check

```bash
# Vérifier que le système OTP fonctionne

# 1. Envoyer un code
response=$(curl -s -X POST https://api.example.com/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"health-check@example.com"}')

if echo "$response" | grep -q '"success":true'; then
  echo "✅ send-code endpoint: OK"
else
  echo "❌ send-code endpoint: FAILED"
  echo "$response"
fi

# 2. Vérifier la table DB
sqlite3 production.db "SELECT COUNT(*) FROM email_verifications;"

# 3. Check email delivery (Resend API)
# Voir dashboard Resend pour health status
```

---

## 🎯 Métriques de Succès

Après le déploiement, tracker:

1. **Adoption**: % utilisateurs utilisant OTP vs traditional auth
2. **Success Rate**: % codes vérifiés avec succès / codes envoyés
3. **Time-to-Code**: Temps moyen entre send et verify
4. **Error Rate**: % erreurs / tentatives
5. **Email Delivery**: % emails livrés (via Resend)
6. **Bounce Rate**: % emails bounced
7. **User Feedback**: Satisfaction feedback

---

## 📞 Support

### Si des Erreurs Apparaissent

1. **"Email not received"**
   - Checker Resend dashboard pour bounce/suppression
   - Vérifier RESEND_API_KEY dans wrangler.toml
   - Tester avec email différent

2. **"Rate limit exceeded"**
   - Attendre 15 minutes avant retry
   - Vérifier pas d'attaques DDoS dans logs

3. **"Code expired"**
   - Codes valides seulement 10 minutes
   - Utilisateur peut demander nouveau code

4. **"Database error"**
   - Vérifier table email_verifications créée
   - Checker D1 connection status
   - Voir logs Cloudflare pour détails

5. **"Token invalid"**
   - Vérifier localStorage contient token
   - Vérifier token pas expiré (7 jours)
   - Check JWT signature en prod

### Contact Développeurs

- Frontend Issues: Voir src/components/tombola/AuthTombolaFormOTP.tsx
- Backend Issues: Voir cloudflare/src/routes/auth.ts
- Database Issues: Voir cloudflare/migrations/0015_email_verification_otp.sql
- Email Issues: Voir cloudflare/src/services/emailVerificationService.ts

---

## 📝 Version History

- **v1.0** - Initial OTP system implementation
  - Send-code endpoint
  - Verify-code endpoint
  - React OTP component
  - 10-minute code expiration
  - Rate limiting + Audit logging

---

## License & Credits

Système OTP pour Les P'tits Trinquat  
© 2026 - Production Ready Implementation
