#!/bin/bash

# Initialize D1 Local Database with Migrations
# This script runs all migrations to set up the local database

echo "🔄 Initializing D1 Local Database..."

MIGRATIONS_PATH="$(dirname "$0")/migrations"

if [ ! -d "$MIGRATIONS_PATH" ]; then
    echo "❌ Migrations directory not found: $MIGRATIONS_PATH"
    exit 1
fi

MIGRATION_COUNT=$(ls -1 "$MIGRATIONS_PATH"/*.sql 2>/dev/null | wc -l)

if [ "$MIGRATION_COUNT" -eq 0 ]; then
    echo "❌ No migrations found in $MIGRATIONS_PATH"
    exit 1
fi

echo "📍 Found $MIGRATION_COUNT migration(s)"

# Run init endpoint to execute all migrations
echo "🚀 Running migrations via API..."

RESPONSE=$(curl -s -X POST http://127.0.0.1:8787/api/init-db \
  -H "Content-Type: application/json")

SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true' | head -1)

if [ -n "$SUCCESS" ]; then
    echo "✅ Database initialization completed successfully!"
    echo "$RESPONSE" | grep -o '"message":"[^"]*"'
else
    echo "❌ Database initialization failed"
    echo "Response: $RESPONSE"
    echo "ℹ️  Make sure 'wrangler dev' is running on http://127.0.0.1:8787"
    exit 1
fi

echo ""
echo "✨ You can now use the API!"
