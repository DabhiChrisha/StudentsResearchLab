# Supabase to Prisma Migration Guide

## Migration Completed ✅

This document outlines the migration from Supabase to Prisma ORM with Neon PostgreSQL.

### What Changed

#### 1. **Database Connection**
- **Before**: Supabase JS SDK with SUPABASE_URL and SUPABASE_ANON_KEY
- **After**: Prisma ORM with DATABASE_URL for direct PostgreSQL connection
- **New Database**: Neon PostgreSQL (ep-quiet-hill-amh9bnb5-pooler.c-5.us-east-1.aws.neon.tech)

#### 2. **Architecture**
- **Controllers**: New `src/controllers/` directory with business logic separated from routes
- **Prisma Client**: New `src/lib/prisma.js` for database connection management
- **Prisma Schema**: New `prisma/schema.prisma` with all table definitions

#### 3. **Removed Dependencies**
- Removed: `@supabase/supabase-js`
- Removed: `supabase.js` (no longer needed)

#### 4. **New Dependencies**
- Added: `@prisma/client` (^5.8.0)
- Added: `prisma` as devDependency (^5.8.0)

### Tables Migrated

All 14 tables have been mapped to Prisma models:
- `StudentsDetail` (students_details)
- `Attendance` (attendance)
- `DebateScore` (debate_scores)
- `SessionContent` (session_content)
- `SrlSession` (srl_sessions)
- `LeaderboardStat` (leaderboard_stats)
- `AchievementContent` (achievement_content)
- `JoinUs` (join_us)
- `MemberCvProfile` (member_cv_profiles)
- `Publication` (publications)
- `PublicationSubmission` (publications_submissions)
- `ResearchPaper` (research_papers)
- `PaperAuthor` (paper_authors)
- `Activity` (activities)

### Routes Updated

All 16 route files have been updated to use Prisma controllers:
- ✅ students.js
- ✅ attendance.js
- ✅ sessions.js
- ✅ scores.js
- ✅ timeline.js
- ✅ publications.js
- ✅ papers.js
- ✅ activities.js
- ✅ leaderboard.js
- ✅ achievements.js
- ✅ cv.js
- ✅ metrics.js
- ✅ join_us.js
- ✅ batch_stats.js
- ✅ researchers.js
- ✅ (index.js - routes registration)

### Controllers Created

16 new controller files in `src/controllers/`:
- `studentsController.js`
- `attendanceController.js`
- `sessionsController.js`
- `scoresController.js`
- `timelineController.js`
- `publicationsController.js`
- `papersController.js`
- `activitiesController.js`
- `leaderboardController.js`
- `achievementsController.js`
- `cvController.js`
- `metricsController.js`
- `joinUsController.js`
- `batchStatsController.js`
- `researchersController.js`

## Next Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Sync Database Schema (if needed)
```bash
# Pull existing schema from database
npx prisma db pull

# Or create tables from schema
npx prisma migrate dev --name init
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Verify Endpoints
Test all endpoints to ensure they work with Prisma:
```bash
curl http://localhost:8000/api/students
curl http://localhost:8000/api/sessions
curl http://localhost:8000/api/publications
# ... test other endpoints
```

## Configuration

### Environment Variables
Update your `.env` file:

```env
DATABASE_URL="postgresql://neondb_owner:npg_qGgDu6Cm0RxQ@ep-quiet-hill-amh9bnb5-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
PORT=8000
```

## Important Notes

### 1. Database Connections
- Prisma uses connection pooling by default
- Max connection pool: 2 (can be configured)
- Neon provides automatic connection pooling

### 2. Relationship Handling
- Relationships are defined in the schema
- Use `.include()` to fetch related data
- Use `.select()` to optimize queries

### 3. JSON Fields
- JSON data is stored as strings (using `.projects` column as JSON store)
- Use `JSON.parse()` when reading, `JSON.stringify()` when writing
- Consider using `Json` type in Prisma for better handling

### 4. Case Sensitivity
- Prisma queries maintain case sensitivity from database
- Use `mode: 'insensitive'` for case-insensitive searches
- Example: `where: { enrollment_no: { equals: value, mode: 'insensitive' } }`

### 5. Error Handling
- Errors are thrown directly (not wrapped in error objects)
- Controllers use try-catch for consistent error handling
- Express error handler in index.js catches and formats errors

## Troubleshooting

### Issue: "PrismaClientInitializationError"
**Solution**: Ensure DATABASE_URL is set correctly in .env file

### Issue: Table not found (42P01)
**Solution**: 
1. Verify tables exist in Neon database
2. Run schema sync: `npx prisma db pull`
3. Check table names match schema definitions

### Issue: Connection timeout
**Solution**: 
1. Check DATABASE_URL is accessible
2. Verify firewall/security group rules
3. Test with psql: `psql "$DATABASE_URL"`

### Issue: Prisma client not working
**Solution**: Regenerate Prisma client: `npx prisma generate`

## Performance Optimization

### Queries
- Use `.select()` to fetch only needed columns
- Use `.include()` selectively for relationships
- Use `.where()` with proper indexes

### Connection Pooling
- Neon provides automatic connection pooling
- For serverless environments, use Prisma Data Proxy or PrismaClient configuration

### Caching
- Consider adding Redis for frequently accessed data
- Cache leaderboard data (updated periodically)
- Cache researcher profiles

## Security Considerations

1. **Environment Variables**: Never commit .env file to version control
2. **SQL Injection**: Prisma protects against SQL injection by default
3. **Connection String**: Use strong credentials and SSL/TLS
4. **Rate Limiting**: Consider implementing rate limiting for public APIs

## Useful Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Pull database schema
npx prisma db pull

# Create migration
npx prisma migrate dev --name migration_name

# View database in Prisma Studio
npx prisma studio

# Format schema
npx prisma format
```

## Further Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Neon Documentation](https://neon.tech/docs/introduction)
- [Prisma Best Practices](https://www.prisma.io/docs/concepts/more/best-practices)

---

**Migration Date**: April 2026
**Status**: ✅ Complete
