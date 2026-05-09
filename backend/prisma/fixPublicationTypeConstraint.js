/**
 * One-time fix: updates the publication_type_of_publication_check constraint
 * to include all currently allowed publication types.
 * Run: node prisma/fixPublicationTypeConstraint.js
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
  console.log('🔧 Updating publication_type_of_publication_check constraint...');

  await prisma.$executeRaw`
    ALTER TABLE publication
    DROP CONSTRAINT IF EXISTS publication_type_of_publication_check
  `;
  console.log('  ✅ Old constraint dropped');

  await prisma.$executeRaw`
    ALTER TABLE publication
    ADD CONSTRAINT publication_type_of_publication_check
    CHECK (type_of_publication IN (
      'conference',
      'book chapter',
      'journal',
      'patent',
      'poster',
      'research artical'
    ))
  `;
  console.log('  ✅ New constraint added');

  console.log('\n✅ Done — all publication types are now accepted by the DB.');
}

run()
  .catch((err) => { console.error('❌ Failed:', err.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
