#!/bin/bash

echo "🧹 Cleaning up..."

# Kill any running processes
pkill -f "next dev" 2>/dev/null
pkill -f "node server.mjs" 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

sleep 1

# Clean caches
echo "🗑️  Removing caches..."
rm -rf .next
rm -rf node_modules/.cache

# Regenerate Prisma
echo "⚙️  Regenerating Prisma client..."
npx prisma generate

echo "✅ Cleanup complete!"
echo "🚀 Starting dev server..."
npm run dev

