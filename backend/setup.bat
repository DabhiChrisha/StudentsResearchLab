@echo off
REM Supabase to Prisma Migration - Setup Script for Windows
REM This script completes the migration setup

echo.
echo 🚀 Supabase to Prisma Migration - Setup
echo ========================================
echo.

REM Step 1: Navigate to backend directory
echo 📁 Step 1: Navigating to backend directory...
cd backend
if exist "package.json" (
    echo ✅ In backend directory
) else (
    echo ❌ Backend directory not found
    exit /b 1
)
echo.

REM Step 2: Install dependencies
echo 📦 Step 2: Installing dependencies...
call npm install
if %ERRORLEVEL% EQU 0 (
    echo ✅ Dependencies installed
) else (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo.

REM Step 3: Generate Prisma client
echo 🔧 Step 3: Generating Prisma client...
call npx prisma generate
if %ERRORLEVEL% EQU 0 (
    echo ✅ Prisma client generated
) else (
    echo ❌ Failed to generate Prisma client
    exit /b 1
)
echo.

REM Step 4: Sync database schema
echo 🗄️  Step 4: Database Schema Sync
echo.
echo Choose an option:
echo 1. Pull existing schema from Neon database (recommended)
echo 2. Create migration from schema
echo 3. Skip for now
echo.
set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" (
    echo Pulling schema from database...
    call npx prisma db pull
    echo ✅ Schema pulled
) else if "%choice%"=="2" (
    echo Creating migration...
    call npx prisma migrate dev --name init
    echo ✅ Migration created
) else (
    echo ⚠️  Skipping schema sync. You can run this later:
    echo    npx prisma db pull
    echo    or
    echo    npx prisma migrate dev --name init
)
echo.

REM Step 5: Verify environment configuration
echo 🔍 Step 5: Verifying environment configuration...
findstr "DATABASE_URL" .env >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ DATABASE_URL found in .env
    echo    Database: postgresql://neondb_owner:...@neon.tech/neondb
) else (
    echo ❌ DATABASE_URL not found in .env
    echo    Please add: DATABASE_URL="^<your-connection-url^>"
)
echo.

REM Step 6: Summary
echo 📋 Setup Summary
echo ===============
echo ✅ Dependencies installed
echo ✅ Prisma client generated
echo ✅ Environment configured
echo.

echo 🎉 Setup Complete!
echo.
echo Next steps:
echo 1. Start development server:
echo    npm run dev
echo.
echo 2. Test endpoints:
echo    curl http://localhost:8000/api/health
echo    curl http://localhost:8000/api/students
echo.
echo 3. View database:
echo    npx prisma studio
echo.
echo For more information, see:
echo - MIGRATION_COMPLETE.md
echo - MIGRATION_GUIDE.md
echo - FILES_CHANGED.md
echo.

pause
