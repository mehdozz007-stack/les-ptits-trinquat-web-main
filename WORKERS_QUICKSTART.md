# Tombola API - Quick Start Guide

## 🚀 Local Development (5 minutes)

### Step 1: Install Dependencies
```bash
cd workers
npm install
```

### Step 2: Create Local Database
```bash
npm run db:create:dev
# Output: ✓ Created database 'tombola-dev'
```

### Step 3: Initialize Schema
```bash
npm run db:execute:dev
# Runs all CREATE TABLE statements from schema.sql
```

### Step 4: Start Dev Server
```bash
npm run dev
# Output: ⎚ Ready on http://localhost:8787
```

### Step 5: Update Frontend Config
Open `src/lib/db/tombolaAPI.ts` and set:
```typescript
const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8787' 
  : 'https://tombola-api.your-domain.com';
```

### Step 6: Start Frontend
```bash
cd ..
npm run dev
# Opens http://localhost:5173
```

## 📝 Manual API Testing

### Create Parent
```bash
curl -X POST http://localhost:8787/api/parents \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alice",
    "email": "alice@example.com",
    "emoji": "😊",
    "classes": "CP-1"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Alice",
  "email": "alice@example.com",
  "emoji": "😊",
  "classes": "CP-1",
  "created_at": "2024-12-28T10:30:00.000Z"
}
```

### Store Auth Token (Frontend)
```javascript
const authToken = {
  parentId: "550e8400-e29b-41d4-a716-446655440000",
  email: "alice@example.com"
};
localStorage.setItem('auth_token', JSON.stringify(authToken));
```

### Get Auth Header
```javascript
const token = JSON.parse(localStorage.getItem('auth_token'));
const authHeader = 'X-Parent-Auth: ' + btoa(JSON.stringify(token));
// X-Parent-Auth: eyJwYXJlbnRJZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20ifQ==
```

### Create Lot (Auth Required)
```bash
curl -X POST http://localhost:8787/api/lots \
  -H "Content-Type: application/json" \
  -H "X-Parent-Auth: eyJwYXJlbnRJZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20ifQ==" \
  -d '{
    "title": "LEGO Set 🧱",
    "description": "Brand new, never opened"
  }'
```

**Response:**
```json
{
  "id": "uuid-generated",
  "parent_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "LEGO Set 🧱",
  "description": "Brand new, never opened",
  "status": "available",
  "reserved_by": null,
  "created_at": "2024-12-28T10:35:00.000Z"
}
```

### List All Lots
```bash
curl http://localhost:8787/api/lots
```

### Reserve a Lot (Auth Required)
```bash
curl -X POST http://localhost:8787/api/lots/{lotId}/reserve \
  -H "X-Parent-Auth: eyJwYXJlbnRJZCI6Im90aGVyLXBhcmVudC1pZCIsImVtYWlsIjoib3RoZXJAZXhhbXBsZS5jb20ifQ=="
```

**Response:**
```json
{
  "id": "lot-uuid",
  "parent_id": "original-parent-id",
  "title": "LEGO Set 🧱",
  "description": "Brand new, never opened",
  "status": "reserved",
  "reserved_by": "other-parent-id",
  "created_at": "2024-12-28T10:35:00.000Z"
}
```

## ☁️ Production Deployment

### Prerequisites
- Cloudflare account (free tier works)
- Wrangler authenticated: `wrangler login`

### Step 1: Create Production Database
```bash
npm run db:create
# Output: ✓ Created database 'tombola'
```

### Step 2: Initialize Production Schema
```bash
npm run db:execute
# Runs all CREATE TABLE statements on production database
```

### Step 3: Deploy Worker
```bash
npm run deploy
# Output: 
# ✓ Uploaded tombola-api
# https://tombola-api.your-account.workers.dev
```

### Step 4: Update Frontend
```typescript
const API_BASE = 'https://tombola-api.your-account.workers.dev';
```

### Step 5: Test Production
```bash
curl https://tombola-api.your-account.workers.dev/api/parents
# Should return empty array
```

## 🔒 Security Checklist

- ✅ Parent emails never exposed in list endpoints (privacy)
- ✅ User can only delete own account
- ✅ User can only delete own lots
- ✅ Cannot reserve own lots (self-prevention)
- ✅ Deleted parent automatically deletes cascade (no orphans)
- ✅ Email uniqueness enforced (no duplicates)

## 🐛 Troubleshooting

### Issue: "Database not found"
```
Error: Database 'tombola-dev' does not exist
```
**Solution:**
```bash
npm run db:create:dev  # Create it first
npm run db:execute:dev # Initialize schema
```

### Issue: "401 Unauthorized"
```
Error: Invalid or missing X-Parent-Auth header
```
**Solution:**
- Ensure localStorage has valid auth token
- Check header format: `Base64(JSON.stringify({ parentId, email }))`
- Use TombolaAPI client which handles this automatically

### Issue: "Email already exists"
```
Error: UNIQUE constraint failed: parents.email
```
**Solution:**
- Email must be unique per parent
- Use different email or delete existing parent first

### Issue: "Can't reserve own lot"
```
Error: Cannot reserve your own lot
```
**Solution:**
- This is intentional security feature
- Reserve lots created by other parents only

## 📚 API Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/parents | No | List all parents (sanitized) |
| POST | /api/parents | No | Create parent |
| DELETE | /api/parents/:id | Yes | Delete parent (cascade) |
| GET | /api/lots | No | List all lots |
| POST | /api/lots | Yes | Create lot (for current parent) |
| DELETE | /api/lots/:id | Yes | Delete lot (owner only) |
| POST | /api/lots/:id/reserve | Yes | Reserve lot |
| GET | /api/health | No | Health check |

## 🔧 Advanced

### Database Management

**View Data**
```bash
# Development
wrangler d1 execute tombola-dev --remote=false --command="SELECT * FROM parents LIMIT 5"

# Production
wrangler d1 execute tombola --command="SELECT * FROM parents LIMIT 5"
```

**Backup Database**
```bash
# Export development data
wrangler d1 execute tombola-dev --remote=false --command="SELECT * FROM parents" > backup.sql
```

**Reset Database**
```bash
# Delete all data (be careful!)
npm run db:execute:dev  # Re-run schema to reset
```

---

**For detailed documentation:** See [CLOUDFLARE_D1_MIGRATION.md](CLOUDFLARE_D1_MIGRATION.md)

**Status:** Ready for testing and deployment ✅
