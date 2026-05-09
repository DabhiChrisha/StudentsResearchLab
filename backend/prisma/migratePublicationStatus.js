/**
 * One-time migration: adds approval workflow columns to the publication table.
 * Run once: node prisma/migratePublicationStatus.js
 */
require('dotenv').config();
const { PrismaClient } = require('../src/generated/prisma');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function run() {
  console.log('🔧 Adding approval workflow columns to publication table...');

  // Add status column (default PENDING for new rows)
  await prisma.$executeRaw`
    ALTER TABLE publication
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
  `;
  console.log('  ✅ status column added');

  // Add approved_by column
  await prisma.$executeRaw`
    ALTER TABLE publication
    ADD COLUMN IF NOT EXISTS approved_by VARCHAR(150)
  `;
  console.log('  ✅ approved_by column added');

  // Add approved_at column
  await prisma.$executeRaw`
    ALTER TABLE publication
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ
  `;
  console.log('  ✅ approved_at column added');

  // Make publisher nullable (poster type does not require a publisher)
  await prisma.$executeRaw`
    ALTER TABLE publication
    ALTER COLUMN publisher DROP NOT NULL
  `;
  console.log('  ✅ publisher column made nullable');

  // Back-fill all existing publications as APPROVED so the live site is not affected
  const { count } = await prisma.publication.updateMany({
    where: { status: 'PENDING' },
    data:  { status: 'APPROVED' },
  });
  console.log(`  ✅ ${count} existing publication(s) back-filled as APPROVED`);

  console.log('\n✅ Migration complete. Run: npx prisma generate');
}

run()
  .catch((err) => { console.error('❌ Migration failed:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
