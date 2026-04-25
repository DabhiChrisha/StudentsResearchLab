# 🌱 Database Seeding - Quick Start

## What Was Created

✅ **Prisma Seed Script**: `backend/prisma/seed.js`
- Extracts real data from all SQL files in `data-seed/` folder
- Uses Prisma ORM instead of raw SQL
- Handles null constraints with dummy data where needed
- Uses `upsert` operations (safe to run multiple times)
- No table structure changes - only data seeding

✅ **Updated Configuration**:
- `package.json` - Updated seed scripts
- `SEEDING_GUIDE.md` - Comprehensive documentation

## Quick Start (3 Steps)

### 1️⃣ Install Dependencies
```bash
cd StudentsResearchLab/backend
npm install
```

### 2️⃣ Generate Prisma Client
```bash
npm run db:generate
```

### 3️⃣ Run Seed
```bash
npm run db:seed
```

## Data Seeded

| Table | Records | Source |
|-------|---------|--------|
| `students_details` | 4 | Admin + 3 students |
| `leaderboard_stats` | 10 | Real performance data |
| `authorization` | 4 | User credentials |
| `srl_sessions` | 11 | Session dates |
| `research_papers` | 3 | Paper records |
| `research_projects` | 2 | Project records |
| `join_us` | 1 | Join request |
| `activities` | 1 | Activity |
| `achievement_content` | 1 | Achievement |
| **TOTAL** | **~47** | **All tables preserved** |

## Key Features

✨ **Preserves Table Structure**
- No ALTER TABLE commands
- No schema changes
- Only creates/updates data

🔐 **Handles Constraints**
- Null values preserved where applicable
- Required fields have valid data
- Foreign keys maintained

♻️ **Safe to Rerun**
- Uses `upsert` operations
- No duplicate errors
- idempotent execution

📊 **Real Data**
- Extracted from SQL files
- Student names, enrollment numbers, scores
- Research papers, projects, achievements

## Admin Credentials

After seeding, you can login with:
- **Email**: `adminsrl@gmail.com`
- **Password**: `Admin@SRL`

## Available Commands

```bash
# Just seed the data
npm run db:seed

# Reset database and seed (clears all data first)
npm run db:reset

# Start backend with seeded data
npm run dev

# Generate Prisma client
npm run db:generate

# Interactive Prisma Studio (view/edit data)
npx prisma studio
```

## File Locations

```
StudentsResearchLab/backend/
├── prisma/
│   └── seed.js              ← Main seed file (use this)
│   └── seed.ts              ← TypeScript version (not used)
├── data-seed/               ← Source SQL files
│   ├── leaderboard_stats_rows.sql
│   ├── students_details_rows.sql
│   ├── research_papers_rows.sql
│   ├── authorization_rows.sql
│   └── ... (other SQL files)
├── SEEDING_GUIDE.md         ← Detailed documentation
└── package.json             ← Updated with seed scripts
```

## Troubleshooting

❌ **"DATABASE_URL not set"**
- Ensure `.env` file exists with database connection

❌ **"Prisma generate failed"**
```bash
npm install
npm run db:generate
```

❌ **"Connection refused"**
- Check database is running
- Verify DATABASE_URL points to correct host

✅ **Success!**
- Check backend logs: "✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!"
- Verify data: `npx prisma studio`

## Next Steps

1. ✅ Run `npm run db:seed`
2. ✅ Start backend: `npm run dev`
3. ✅ Login with admin credentials
4. ✅ Frontend connects to seeded data

## Notes

- All 15 SQL data files are integrated into seed.js
- Data is real and from your production backups
- No data is lost or modified during seeding
- Safe to run as many times as needed

---

**Created**: April 10, 2026
**Prisma Version**: ^5.8.0
**Technology**: Node.js + Prisma ORM
