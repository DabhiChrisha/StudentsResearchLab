# Database Seeding Guide

## Overview

This guide explains how to seed your database using Prisma with real data from the SQL files in the `data-seed` folder.

## Prerequisites

- Node.js and npm installed
- Prisma CLI installed (`npm install -g @prisma/client prisma`)
- `.env` file configured with your database connection string

## Files Structure

```
backend/
├── prisma/
│   ├── schema.prisma       (Prisma schema - defines database structure)
│   └── seed.js            (Seed script - populates database with data)
├── data-seed/
│   ├── leaderboard_stats_rows.sql
│   ├── students_details_rows.sql
│   ├── research_papers_rows.sql
│   ├── research_projects_rows.sql
│   ├── authorization_rows.sql
│   ├── srl_sessions_rows.sql
│   ├── join_us_rows.sql
│   ├── activities_rows.sql
│   ├── achievement_content_rows.sql
│   └── ... (other SQL files)
└── package.json
```

## Seeding Methods

### Method 1: Using Prisma Seed Command (Recommended)

This method uses Prisma's native seeding feature:

```bash
npm run db:seed
```

This command:
- Reads data directly from the seed.js file
- Uses Prisma's upsert operations to avoid duplicates
- Makes efficient database writes
- Doesn't modify any table structures

### Method 2: Using Package.json Scripts

Available scripts:

```bash
# Just seed the data
npm run db:seed

# Reset database and seed (clears all data first)
npm run db:reset

# Generate Prisma client
npm run db:generate

# Pull schema from database
npm run db:pull

# Run migrations
npm run db:migrate
```

## What Gets Seeded

The seed script creates the following records:

- **students_details**: 4 student records including admin user
- **leaderboard_stats**: 10 leaderboard statistics (with period, score, attendance data)
- **authorization**: 4 authorization records (user credentials)
- **srl_sessions**: 11 session dates from Nov 2025 to Feb 2026
- **research_papers**: 3 research paper records
- **research_projects**: 2 research project records
- **join_us**: 1 join request record
- **activities**: 1 activity record
- **achievement_content**: 1 achievement record

**Total: ~47 records across 9 tables**

## Data Handling

### Null Constraint Handling

For fields with null constraints:
- Fields that accept null values are preserved as `null` in seed data
- Fields that require values have dummy/placeholder data provided
- Example: `cpi` field is null (optional), `enrollment_no` is required and always provided

### Period Format

- Leaderboard stats use `period` field in format: "Dec 2025", "Jan 2026", "Feb 2026", "All Time"
- This format is preserved exactly as in the source SQL

### Data Integrity

- Uses `upsert` operations (update if exists, create if not)
- Prevents duplicate records on subsequent runs
- Maintains referential integrity between tables

## Example Usage

### First Time Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations (if needed)
npm run db:migrate

# Seed the database
npm run db:seed
```

### Running Again

```bash
# Just seed (creates/updates without clearing)
npm run db:seed

# Or reset and seed (clears all data first)
npm run db:reset
```

## Important Notes

1. **Tables Not Modified**: The seed script doesn't change any table definitions or schema
2. **Data Extraction**: Data is extracted from SQL files using hardcoded values (not dependent on file format)
3. **Upsert Strategy**: Using `upsert` means running seed multiple times is safe
4. **Admin Credentials**: Default admin user is created with:
   - Email: `adminsrl@gmail.com`
   - Password: `Admin@SRL`

## Troubleshooting

### Issue: "Prisma generate failed"

**Solution**: Install dependencies and regenerate:
```bash
npm install
npm run db:generate
```

### Issue: "Database connection failed"

**Solution**: Check your `.env` file has the correct DATABASE_URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/srl_db"
```

### Issue: "Unique constraint violated"

**Solution**: This shouldn't happen with upsert, but if it does:
```bash
npm run db:reset
npm run db:seed
```

### Issue: "Field xyz is required"

**Solution**: The seed data includes dummy values for all required fields. If you see this error, the schema might have changed. Check `prisma/schema.prisma`.

## Customizing Seed Data

To modify seed data:

1. Open `prisma/seed.js`
2. Find the data array you want to modify (e.g., `leaderboardData`, `authData`)
3. Update the values
4. Run: `npm run db:seed`

Example: Adding a new student

```javascript
const studentsDetailsData = [
  // ... existing data
  {
    id: 200,
    student_name: 'New Student Name',
    enrollment_no: '24BECE30999',
    // ... other fields
  },
];
```

## Verifying Seed Data

After seeding, verify data in your database:

```bash
# Using Prisma Studio (interactive UI)
npx prisma studio

# Or using your database client (e.g., psql for PostgreSQL)
psql -U user -d srl_db -c "SELECT * FROM leaderboard_stats LIMIT 5;"
```

## Production Considerations

- Review and validate seed data before production
- Consider sensitive data (passwords, emails)
- Test seed operations in development first
- Keep data-seed folder in version control with real data
- Consider creating separate seed files for different environments

## Support

For issues or questions about seeding:
1. Check error messages in terminal output
2. Review `prisma/schema.prisma` for table definitions
3. Verify Prisma and dependencies are properly installed
4. Check database connection in `.env`

---

**Last Updated**: April 2026
**Prisma Version**: 5.8.0 or higher
