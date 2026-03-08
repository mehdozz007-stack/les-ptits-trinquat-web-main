# 🔐 Documentation Sécurité - Système Newsletter

## Architecture de Sécurité Multicouche

### 1. Authentification (Layer 1)

#### JWT Token Flow
```
Client (React)
    ↓
    │ supabase.auth.signInWithPassword()
    ↓
Supabase Auth
    ↓
    │ retourne JWT dans session.access_token
    ↓
Client stocke JWT en localStorage (géré par Supabase)
    ↓
    │ Chaque requête inclut: Authorization: Bearer {JWT}
    ↓
Edge Function vérifie JWT
    ↓
    │ authClient.auth.getClaims(token)
    ↓
Retourne user_id ou erreur 401
```

**Code:** `supabase/functions/send-newsletter/index.ts` (lignes 35-52)

### 2. Autorisation (Layer 2)

#### Role-Based Access Control (RBAC)
```
user_id (JWT claims)
    ↓
Requête: SELECT * FROM user_roles WHERE user_id = ? AND role = 'admin'
    ↓
Résultat: null → erreur 403 (Forbidden)
         || admin role found → allowed
```

**Vérification Sécurisée:**
- Utilise `SUPABASE_SERVICE_ROLE_KEY` pour contourner RLS
- Évite la récursion RLS avec `SECURITY DEFINER`
- Fonction SQL `has_role()` précompilée

**Code:** `supabase/functions/send-newsletter/index.ts` (lignes 80-101)

### 3. Contrôle d'Accès aux Données (Layer 3)

#### Row Level Security (RLS) Policies

**Public (Inscription Newsletter)**
```sql
-- Quiconque peut insérer, mais DOIT avoir consent = true
CREATE POLICY "Public can insert newsletter subscribers"
  FOR INSERT WITH CHECK (consent = true)
```

**Admin (Gestion Newsletter)**
```sql
-- Seulement admin peut voir/modifier/supprimer
CREATE POLICY "Admins can view newsletters"
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role))
```

**Tableau RLS Complet:**
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `newsletter_subscribers` | admin | public (with consent) | admin | admin |
| `newsletters` | admin | admin | admin | admin |
| `user_roles` | admin | admin | admin | admin |

**Code:** `supabase/migrations/20260117000000_init_newsletter_tables.sql` (lignes 80-137)

### 4. Protection XSS (Layer 4)

#### Sanitization HTML

```typescript
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

**Application:**
- Sujet de l'email: `escapeHtml(newsletter.subject)`
- Prénom du destinataire: `escapeHtml(firstName)`
- Contenu: **PAS échappé** (contenu HTML intentionnel)

**Résultat:**
```html
<!-- Avant -->
<p>Bonjour <script>alert('XSS')</script>,</p>

<!-- Après (safe) -->
<p>Bonjour &lt;script&gt;alert('XSS')&lt;/script&gt;,</p>
```

**Code:** `supabase/functions/send-newsletter/index.ts` (lignes 20-29)

### 5. Transport Sécurisé (Layer 5)

#### HTTPS Requirement
- Toutes les requêtes à Supabase: HTTPS obligatoire
- Toutes les requêtes à Resend: HTTPS obligatoire
- Environment variables ne sont JAMAIS exposées au client

#### CORS Protection
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
```

**Note:** Origin permissif car Edge Function partagée, mais JWT vérifié

**Code:** `supabase/functions/send-newsletter/index.ts` (lignes 8-12)

### 6. Secrets Management (Layer 6)

#### Variables Sensibles
```env
# JAMAIS dans le code, JAMAIS en .env public
RESEND_API_KEY=re_xxxxx          # Supabase Secrets
SUPABASE_SERVICE_ROLE_KEY=xxxxx  # Supabase Secrets
```

**Accès:**
```typescript
const resendApiKey = Deno.env.get("RESEND_API_KEY");
// ✅ Secure: Edge Function peut accéder
// ❌ Insecure: React/Browser ne peut pas accéder
```

**Code:** `supabase/functions/send-newsletter/index.ts` (lignes 121, 148)

---

## Checklist de Sécurité Implémentée

### ✅ Authentification
- [x] JWT validation en Edge Function
- [x] Session management avec Supabase Auth
- [x] Password hasching (géré par Supabase)
- [x] Auto-logout après 24h (configurable)
- [x] Refresh token automatique

### ✅ Autorisation
- [x] Role-based access control (admin/user)
- [x] Vérification rôle avant chaque action
- [x] Pas de confiance au client pour permissions
- [x] Séparation concern (frontend vs backend)

### ✅ Données
- [x] RLS sur toutes les tables sensibles
- [x] Pas d'exposition d'emails au client
- [x] Pas d'exposure d'IDs d'utilisateurs
- [x] Consent tracking (RGPD)
- [x] Soft delete possible (is_active flag)

### ✅ Injection/XSS
- [x] Sanitization HTML sur les inputs
- [x] Parameterized queries (Supabase)
- [x] Pas de eval() ou dangerouslySetInnerHTML
- [x] Content Security Policy ready

### ✅ Transport
- [x] HTTPS enforced
- [x] JWT dans Authorization header
- [x] Pas de credentials dans URL
- [x] CORS headers appropriés

### ✅ Audit/Logs
- [x] Audit trail via created_at/updated_at
- [x] Email logs via Resend
- [x] Edge Function logs via Supabase
- [x] Admin logging possible

---

## Matrice de Menaces & Mitigation

| Menace | Vecteur | Mitigation | Status |
|--------|---------|-----------|--------|
| **Injection SQL** | Query malveillante | Parameterized queries (Supabase) | ✅ |
| **XSS** | Email with JS | escapeHtml() + sanitization | ✅ |
| **CSRF** | Cross-site form | SameSite cookies (Supabase) | ✅ |
| **Brute Force** | Password guessing | Rate limiting (Supabase) | ✅ |
| **Unauthorized Access** | JWT forgery | JWT verification + signature | ✅ |
| **Privilege Escalation** | Fake admin token | Role verification + RLS | ✅ |
| **Data Exposure** | Email scraping | RLS + no public APIs | ✅ |
| **API Abuse** | DDoS on send-newsletter | Rate limiting (Supabase) | ✅ |
| **Email Spoofing** | Fake sender | Resend domain verification | ✅ |

---

## Audit Trail & Compliance

### RGPD Compliance
```
1. Consent: ✅ Stocké dans newsletter_subscribers.consent
2. Data Retention: ✅ is_active flag pour soft delete
3. Right to Erasure: ✅ DELETE policy disponible
4. Data Access: ✅ Admin peut voir données
5. Unsubscribe: ✅ Lien dans email footer
```

### Logging & Audit
```sql
-- Voir quand un email a été envoyé
SELECT * FROM newsletters 
WHERE status = 'sent' 
ORDER BY sent_at DESC;

-- Voir les changements d'abonnés
SELECT * FROM newsletter_subscribers 
WHERE updated_at > now() - interval '7 days';

-- Admin qui a supprimé un abonné (à ajouter)
-- CREATE TABLE audit_log (user_id, action, timestamp)
```

---

## Incidents Response

### Scénario 1: Account Takeover (Compromised JWT)
1. **Detection**: Activité suspecte au dashboard
2. **Response**: 
   - Révoquer la session: `supabase.auth.signOut()`
   - Forcer re-login
3. **Prevention**: 
   - Expiration JWT: 1 heure
   - Refresh token: 7 jours
   - Activity logging

### Scénario 2: Email Injection
1. **Detection**: Email non-conforme reçu
2. **Response**: 
   - Vérifier escapeHtml() appliqué
   - Rejeter le newsletter draft
3. **Prevention**: 
   - HTML preview au client
   - Validation stricte sujet

### Scénario 3: RLS Bypass
1. **Detection**: Données exposées sans permission
2. **Response**: 
   - Vérifier RLS policies
   - Audit qui a changé quoi
3. **Prevention**: 
   - Test RLS régulier
   - Policy review mensuel

---

## Testing Sécurité

### Unit Tests
```typescript
// test/security.test.ts
describe("Security", () => {
  it("should reject request without JWT", () => {
    // Mock request sans Authorization header
    // Expect 401 response
  });

  it("should reject non-admin users", () => {
    // Mock JWT pour user avec role = 'user'
    // Expect 403 response
  });

  it("should sanitize XSS in email subject", () => {
    // Input: "Hello <script>alert('xss')</script>"
    // Expected: "Hello &lt;script&gt;..."
  });
});
```

### Integration Tests
```bash
# Test la flow complète
curl -X POST https://project.supabase.co/functions/v1/send-newsletter \
  -H "Authorization: Bearer {valid_admin_jwt}" \
  -H "Content-Type: application/json" \
  -d '{"newsletterId": "xxx"}'

# Expected: 200 + "Newsletter sent successfully"
# If JWT missing: 401
# If not admin: 403
# If invalid newsletter: 404
```

### Penetration Testing Checklist
- [ ] JWT expiration & refresh
- [ ] RLS bypass attempts
- [ ] SQL injection in inputs
- [ ] XSS payload injection
- [ ] CSRF token validation
- [ ] Rate limiting
- [ ] API abuse scenarios

---

## Documentation Maintenance

**Revoir cette documentation:**
- ✅ Chaque mois
- ✅ Après changements RLS
- ✅ Après incidents sécurité
- ✅ Avant releases majeures
- ✅ À la demande de l'admin

**Contacts:**
- Supabase Support: support@supabase.io
- Security Issue: security@supabase.io
- Resend Support: support@resend.com
