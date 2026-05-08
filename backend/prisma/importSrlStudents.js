/**
 * importSrlStudents.js
 *
 * One-time import script: migrates all data from srlStudents.json
 * into the srl_student_profiles table (and upserts basic info into
 * students_details for any student not already seeded).
 *
 * Run from the backend/ directory:
 *   node prisma/importSrlStudents.js
 *
 * Safe to re-run: all operations are upserts.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('../src/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const JSON_PATH = path.resolve(__dirname, '../../frontend/src/data/srlStudents.json');

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch (_) {}
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

async function main() {
  console.log('📂 Reading srlStudents.json...');

  if (!fs.existsSync(JSON_PATH)) {
    console.error(`❌ File not found: ${JSON_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(JSON_PATH, 'utf-8');
  const students = JSON.parse(raw);

  console.log(`✅ Found ${students.length} student records\n`);

  let upsertedStudents = 0;
  let upsertedProfiles = 0;
  let skipped = 0;

  for (const s of students) {
    const en = (s.enrollment_no || '').trim().toUpperCase();

    if (!en || !s.student_name || !s.email) {
      console.warn(`⚠️  Skipping record with missing required fields: ${JSON.stringify({ enrollment_no: s.enrollment_no, student_name: s.student_name })}`);
      skipped++;
      continue;
    }

    // 1. Ensure the student exists in students_details (non-destructive upsert)
    try {
      await prisma.studentsDetail.upsert({
        where: { enrollment_no: en },
        // Do not overwrite existing data — only fill in what's missing
        update: {},
        create: {
          student_name:   s.student_name,
          enrollment_no:  en,
          institute_name: 'LDRP-ITR',
          department:     s.department || null,
          semester:       parseInt(s.semester) || 0,
          division:       s.division || null,
          batch:          s.batch || '',
          email:          s.email,
          contact_no:     s.contact_no || null,
          profile_image:  s.photo || null,
          member_type:    'member',
        },
      });
      upsertedStudents++;
    } catch (err) {
      // Unique constraint on email from a different enrollment — skip profile but warn
      if (err.code === 'P2002') {
        console.warn(`⚠️  Skipping students_details upsert for ${en}: ${err.message}`);
      } else {
        throw err;
      }
    }

    // 2. Upsert into srl_student_profiles
    const roles           = toArray(s.roles);
    const researchAreas   = toArray(s.research);
    const ongoingResearch = toArray(s.ongoingResearch);
    const researchWorks   = toArray(s.researchWorks);
    const achievements    = toArray(s.achievements);
    const papersPublished = toArray(s.papersPublished);
    const hackathons      = toArray(s.hackathons);
    const srlPublications = toArray(s.srlPublications);

    const profileData = {
      linkedin:              s.linkedin || null,
      roles,
      reflection:            s.reflection || null,
      research_areas:        researchAreas,
      ongoing_research:      ongoingResearch,
      research_works:        researchWorks,
      achievements,
      papers_published:      papersPublished,
      hackathons,
      srl_publications:      srlPublications,
      achievements_extended: s.achievements_extended || null,
      is_active:             true,
      updated_at:            new Date(),
      updated_by:            'import-script',
    };

    try {
      await prisma.srlStudentProfile.upsert({
        where:  { enrollment_no: en },
        update: profileData,
        create: {
          enrollment_no: en,
          ...profileData,
          created_by: 'import-script',
        },
      });
      upsertedProfiles++;
      console.log(`  ✔  ${en} — ${s.student_name}`);
    } catch (err) {
      console.error(`  ✖  Failed for ${en}: ${err.message}`);
    }
  }

  console.log(`
========================================
  Import complete
  students_details upserted : ${upsertedStudents}
  srl_student_profiles upserted : ${upsertedProfiles}
  skipped                   : ${skipped}
========================================`);
}

main()
  .catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
