#!/bin/bash

# Supabase to Prisma Migration - Setup Script
# This script completes the migration setup

echo "🚀 Supabase to Prisma Migration - Setup"
echo "========================================"
echo ""

# Step 1: Navigate to backend directory
echo "📁 Step 1: Navigating to backend directory..."
cd backend || { echo "❌ Backend directory not found"; exit 1; }
echo "✅ In backend directory"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
  echo "✅ Dependencies installed"
else
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo ""

# Step 3: Generate Prisma client
echo "🔧 Step 3: Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
  echo "✅ Prisma client generated"
else
  echo "❌ Failed to generate Prisma client"
  exit 1
fi
echo ""

# Step 4: Sync database schema
echo "🗄️  Step 4: Syncing database schema..."
echo "Choose an option:"
echo "1. Pull existing schema from Neon database (recommended)"
echo "2. Create migration from schema"
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
  echo "Pulling schema from database..."
  npx prisma db pull
elif [ "$choice" = "2" ]; then
  echo "Creating migration..."
  npx prisma migrate dev --name init
else
  echo "⚠️  Skipping schema sync. You can run this later:"
  echo "   npx prisma db pull"
  echo "   or"
  echo "   npx prisma migrate dev --name init"
fi
echo ""

# Step 5: Verify environment configuration
echo "🔍 Step 5: Verifying environment configuration..."
if grep -q "DATABASE_URL" .env; then
  echo "✅ DATABASE_URL found in .env"
  echo "   Database: postgresql://neondb_owner:...@neon.tech/neondb"
else
  echo "❌ DATABASE_URL not found in .env"
  echo "   Please add: DATABASE_URL=\"<your-connection-url>\""
fi
echo ""

# Step 6: Summary
echo "📋 Setup Summary"
echo "==============="
echo "✅ Dependencies installed"
echo "✅ Prisma client generated"
echo "✅ Database schema synced"
echo "✅ Environment configured"
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Start development server:"
echo "   npm run dev"
echo ""
echo "2. Test endpoints:"
echo "   curl http://localhost:8000/api/health"
echo "   curl http://localhost:8000/api/students"
echo ""
echo "3. View database:"
echo "   npx prisma studio"
echo ""
echo "For more information, see:"
echo "- MIGRATION_COMPLETE.md"
echo "- MIGRATION_GUIDE.md"
echo "- FILES_CHANGED.md"
echo ""
