# 📖 GUIDE COMPLET - Newsletter avec API REST Cloudflare D1

Remplace entièrement **Supabase** par **Cloudflare Workers + D1 (SQLite)**

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────┬─────────────────────────────────┐
│  Frontend React             │  Backend Cloudflare Workers D1  │
├─────────────────────────────┼─────────────────────────────────┤
│ • Newsletter subscription   │ • API REST endpoints            │
│ • Admin dashboard           │ • Database D1 (SQLite)          │
│ • Auth forms                │ • Sessions (Tokens JWT)         │
│ • Hooks (API calls)         │ • Rate limiting                 │
└─────────────────────────────┴─────────────────────────────────┘
```

---

## ⚙️ CONFIGURATION D'ENVIRONNEMENT

### `.env.local` (Frontend)
```env
# API REST Cloudflare Workers
VITE_API_URL=http://localhost:8082/api    # Développement
# VITE_API_URL=https://api.lespetitstrinquat.fr/api  # Production

# Email Resend (optionnel)
VITE_RESEND_KEY=re_xxxxxxxxxxxxx
```

### `cloudflare/.env.production.vars` (Backend)
```env
ENVIRONMENT=production
CORS_ORIGIN=https://www.lespetitstrinquat.fr
SESSION_DURATION=604800
RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW=60

# Email Resend (optionnel - côté serveur)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

## 📁 STRUCTURE DES FICHIERS

### ✅ Fichiers Modifiés
```
src/
├── lib/
│   ├── api.ts                    ✅ Créé - Configuration API centralisée
│   └── supabase.ts               ❌ Supprimé - Plus besoin
├── hooks/
│   ├── useNewsletterSubscription.ts    ✅ Utilise API REST
│   ├── useAdminAuth.ts                 ✅ Utilise API REST
│   ├── useNewsletterAdmin.ts           ✅ Utilise API REST
│   └── admin/                          ✅ Synchronisés
│       ├── useAdminAuth.ts
│       ├── useNewsletterAdmin.ts
│       └── useNewsletterSubscription.ts
```

### 🔧 Backend Existing
```
cloudflare/src/
├── routes/
│   ├── auth.ts                   ✅ API authentification
│   ├── newsletter.ts             ✅ API newsletter
│   └── tombola.ts                ✅ API tombola
└── middleware/
    └── auth.ts                   ✅ Vérification JWT
```

### 💾 Database D1
```
users                    - Authentification
sessions                 - Sessions JWT
newsletter_subscribers   - Abonnés
audit_logs              - Logs d'audit
```

---

## 🔄 FLUX DE FONCTIONNEMENT

### 1️⃣ Inscription Newsletter

```
1. Utilisateur → Formulaire newsletter
2. useNewsletterSubscription().subscribe(data)
3. apiCall() → POST /api/newsletter/subscribe
4. Cloudflare → Valide + Insère en D1
5. Réponse → Toast succès
```

### 2️⃣ Authentification Admin

```
1. Admin → Email + Mot de passe
2. useAdminAuth().signIn(email, password)
3. apiCall() → POST /auth/login
4. Cloudflare → Hash + Vérifie + Crée session
5. Token → localStorage via authManager
6. Tous les appels API incluent: Authorization: Bearer TOKEN
```

### 3️⃣ Envoi Newsletter

```
1. Admin → Compose message
2. useNewsletterAdmin().sendNewsletter()
3. apiCall() → POST /api/newsletter/send
4. Cloudflare → Récupère abonnés + Envoie (Resend optionnel)
5. Réponse → Nombre de destinataires
```

---

## 🚀 LANCER LE PROJET

### Terminal 1 - Frontend
```bash
npm run dev
# ➜ Local: http://localhost:5173
```

### Terminal 2 - Backend API
```bash
cd cloudflare && npm run dev
# ➜ API: http://localhost:8082
```

### Vérifier
```
✅ Newsletter subscribe fonctionne
✅ Admin login/logout marche
✅ Pas d'erreurs console
✅ Compilation sans erreur
```

---

## 📡 API REST ENDPOINTS

### Newsletter

| Endpoint | Méthode | Auth | Body |
|----------|---------|------|------|
| `/newsletter/subscribe` | POST | ✗ | `{ email, first_name?, consent }` |
| `/newsletter/unsubscribe` | POST | ✗ | `{ email }` |
| `/newsletter/subscribers` | GET | ✅ Admin | - |
| `/newsletter/send` | POST | ✅ Admin | `{ subject, content, html? }` |

### Authentification

| Endpoint | Méthode | Auth | Body |
|----------|---------|------|------|
| `/auth/login` | POST | ✗ | `{ email, password }` |
| `/auth/signup` | POST | ✗ | `{ email, password, first_name? }` |
| `/auth/me` | GET | ✅ | - |
| `/auth/logout` | POST | ✅ | - |

### Tombola

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/tombola/participants` | GET | ✗ | Liste publique |
| `/tombola/participants/my` | GET | ✅ | Mes participants |
| `/tombola/participants` | POST | ✅ | Créer participant |

---

## 💻 EXEMPLES DE CODE

### Form Newsletter Basique
```tsx
import { useState } from "react";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const { subscribe, isLoading, isSuccess } = useNewsletterSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribe({ email, firstName, consent });
  };

  if (isSuccess) return <p>Bienvenue ! ✅</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Prénom (optionnel)"
      />
      <label>
        <input
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          type="checkbox"
          required
        />
        J'accepte de recevoir la newsletter
      </label>
      <button disabled={isLoading} type="submit">
        {isLoading ? "Chargement..." : "S'inscrire"}
      </button>
    </form>
  );
}
```

### Admin Dashboard
```tsx
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNewsletterAdmin } from "@/hooks/useNewsletterAdmin";
import { useEffect } from "react";

export function AdminNewsletter() {
  const { isAdmin, signOut } = useAdminAuth();
  const { subscribers, isLoading, fetchSubscribers } = useNewsletterAdmin();

  useEffect(() => {
    if (isAdmin) fetchSubscribers();
  }, [isAdmin]);

  if (!isAdmin) return <p>Accès refusé</p>;

  return (
    <div>
      <h1>Gestion Newsletter</h1>
      <p>Abonnés: {subscribers.length}</p>
      <button onClick={signOut}>Déconnexion</button>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {subscribers.map((sub) => (
            <li key={sub.id}>
              {sub.email} - {sub.first_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 🔒 SÉCURITÉ INTÉGRÉE

✅ **JWT Tokens** - Sessions côté serveur  
✅ **Rate Limiting** - Protection contre les abus  
✅ **Password Hashing** - SHA256 dès l'enregistrement  
✅ **CORS Configuré** - Accès limité au domaine  
✅ **Validation Input** - Sanitize toutes les données  
✅ **Logs d'Audit** - Trace complète des actions  
✅ **RGPD Compliant** - Consentement newsletter requis  

---

## 📧 Email (Resend) - Optionnel

### Cloudflare Workers Email Route
```typescript
// cloudflare/src/routes/email.ts

import { Hono } from 'hono';
import type { Env, ApiResponse } from '../types';
import { requireAuth } from '../middleware/auth';

const email = new Hono<{ Bindings: Env }>();

email.post('/send', requireAuth, async (c) => {
  try {
    const body = await c.req.json<{
      to: string;
      subject: string;
      content: string;
      html?: string;
    }>();

    if (!c.env.RESEND_API_KEY) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Resend non configuré'
      }, 400);
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@lespetitstrinquat.fr',
        to: body.to,
        subject: body.subject,
        html: body.html || body.content,
      }),
    });

    const result = await response.json<{ id: string }>();

    return c.json<ApiResponse>({
      success: true,
      data: { messageId: result.id }
    });
  } catch (error) {
    return c.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur d\'envoi'
    }, 500);
  }
});

export default email;
```

### Enregistrer dans `cloudflare/src/index.ts`
```typescript
import email from './routes/email';
app.route('/email', email);
```

---

## ⚠️ DÉPANNAGE

| Problème | Solution |
|----------|----------|
| "API unreachable" | Vérifier Workers en cours (terminal 2) |
| "Token invalide" | Se reconnecter admin |
| "Email déjà inscrit" | Normal ! Unsubscribe puis subscribe |
| "Admin droit refusé" | User doit avoir rôle "admin" en BD |

---

## ✅ CHECKLIST FINALE

- [x] Supprimer `src/lib/supabase.ts`
- [x] Créer `src/lib/api.ts`
- [x] Modifier hooks newsletter/auth
- [x] Copier vers `src/hooks/admin/`
- [x] Variables d'env `.env.local`
- [x] `npm install` (dépendances OK)
- [x] Terminal 1: `npm run dev`
- [x] Terminal 2: `cd cloudflare && npm run dev`
- [x] Tester s'inscrire newsletter
- [x] Tester admin login
- [x] Zéro erreur console

---

## 🎉 SUCCÈS !

Votre projet Newsletter est **100% opérationnel** avec :

✅ **API REST Cloudflare Workers**  
✅ **Database D1 (SQLite)**  
✅ **Zéro dépendance Supabase**  
✅ **Prêt pour la production**  

```bash
npm run dev              # Terminal 1
cd cloudflare && npm run dev  # Terminal 2

# Ouvrir: http://localhost:5173 ✅
```
