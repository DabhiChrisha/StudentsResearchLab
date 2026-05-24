/**
 * One-off migration script: safely adds `description TEXT` column to the
 * `join_us` table using IF NOT EXISTS so it is safe to re-run.
 *
 * Run with:  node add-description-column.js
 * Delete after confirming the column exists.
 */
require('dotenv').config();

const { PrismaClient } = require('./src/generated/prisma');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

async function main() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Connecting to database...');
    await prisma.$connect();

    console.log('Adding description column to join_us table (IF NOT EXISTS)...');
    await prisma.$executeRawUnsafe(
      'ALTER TABLE join_us ADD COLUMN IF NOT EXISTS description TEXT;'
    );
    console.log('\u2705  Column `description` added (or already existed) in join_us.');

    // Verify the column exists
    const result = await prisma.$queryRawUnsafe(
      `SELECT column_name, data_type
       FROM information_schema.columns
       WHERE table_name = 'join_us' AND column_name = 'description';`
    );
    console.log('Column verification result:', result);
  } catch (err) {
    console.error('\u274c  Error:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
