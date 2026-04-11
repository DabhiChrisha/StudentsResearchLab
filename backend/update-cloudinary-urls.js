/**
 * update-cloudinary-urls.js
 *
 * Connects to the live database via Prisma and updates all image/video URLs
 * with their Cloudinary equivalents from cloudinary-url-map.json.
 *
 * Tables updated:
 *  1. students_details         → profile_image
 *  2. activities               → Photo
 *  3. session_content          → image_url, media_urls
 *  4. achievement_content      → image_url, media_urls
 *  5. research_project_members → student_image_url
 *
 * Run from backend/ directory:
 *   node update-cloudinary-urls.js
 */

require('dotenv').config();
const path = require('path');
const fs   = require('fs');
const { Pool }        = require('pg');
const { PrismaPg }    = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Load the URL map from root of project
const urlMapPath = path.join(__dirname, '..', 'cloudinary-url-map.json');
const urlMap = JSON.parse(fs.readFileSync(urlMapPath, 'utf-8'));

// Load the updated exported_data (has correct URLs after apply-cloudinary-urls.js)
const exportedData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'prisma', 'exported_data.json'), 'utf-8')
);

// Use same Prisma + PrismaPg adapter as the app
const pool    = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lookupByFragment(fragment) {
  const lower = fragment.toLowerCase();
  const entry = Object.entries(urlMap).find(([k]) => k.toLowerCase().includes(lower));
  return entry ? entry[1] : null;
}

function lookupExact(key) {
  return urlMap[key] || null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  let totalUpdated = 0;

  // ── 1. students_details → profile_image ─────────────────────────────────────
  console.log('\n📸 Updating students_details.profile_image ...');
  const students = await prisma.studentsDetail.findMany();

  for (const student of students) {
    // Find in exported_data for the correct Cloudinary URL
    const exported = exportedData.studentsDetails.find(
      s => s.enrollment_no === student.enrollment_no
    );
    const newUrl = exported?.profile_image || null;

    if (newUrl && newUrl !== student.profile_image) {
      await prisma.studentsDetail.update({
        where: { enrollment_no: student.enrollment_no },
        data:  { profile_image: newUrl },
      });
      console.log(`  ✅ ${student.student_name} → ${newUrl.split('/').pop()}`);
      totalUpdated++;
    } else if (!newUrl) {
      // skip silently
    } else {
      console.log(`  ⏭️  ${student.student_name} already up to date`);
    }
  }

  // ── 2. activities → Photo ────────────────────────────────────────────────────
  console.log('\n🖼️  Updating activities.Photo ...');

  // Direct id → url map key (spaces-in-filename version)
  const activityIdToKeyFragment = {
    17: 'SRL Students Researchers Team at the IndiaAI Impact Summit 2026',
    3:  'Students Research Lab Members from KSV at Regional AI Impact Conference',
    2:  'KSV Students Witness Excellence at IndiaSkills Regional Competition 2026',
    4:  'Research Internship Project Presentations at KSV Students Research Lab',
    1:  'MMPSRPC Students Research Lab Where Ideas Turn into Meaningful Research',
    18: 'IMG20260224121158',
  };

  const activities = await prisma.activity.findMany();
  for (const activity of activities) {
    const fragment = activityIdToKeyFragment[activity.id];
    if (!fragment) { console.log(`  ⏭️  id=${activity.id} no mapping`); continue; }

    const newUrl = lookupByFragment(fragment);
    if (!newUrl) { console.log(`  ⚠️  id=${activity.id} "${activity.title}" - URL not found in map`); continue; }

    if (newUrl !== activity.Photo) {
      await prisma.activity.update({
        where: { id: activity.id },
        data:  { Photo: newUrl },
      });
      console.log(`  ✅ id=${activity.id} "${(activity.title||'').trim().substring(0,45)}"`);
      totalUpdated++;
    } else {
      console.log(`  ⏭️  id=${activity.id} already up to date`);
    }
  }

  // ── 3. session_content → image_url & media_urls ──────────────────────────────
  console.log('\n🎬 Updating session_content ...');

  // Thumbnail URLs from URL map (serial_no → key fragment)
  const sessionThumbnailFragment = {
    3: 'video-thumb-1',
    4: 'video-thumb-2',
    5: 'video-thumb-3',
  };

  // Photo-session media_urls (serial=1, Dhruvkumar)
  const dhruvkumarImages = Object.entries(urlMap)
    .filter(([k]) => k.includes('Sessions/Alumni-Success-Dhruvkumar/img-'))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);

  const sessions = await prisma.sessionContent.findMany({ orderBy: { serial_no: 'asc' } });
  for (const session of sessions) {
    let newImageUrl    = session.image_url;
    let newMediaUrls   = session.media_urls;
    let changed        = false;

    // Photo-type session → set media_urls if empty
    if (session.serial_no === 1 && session.type === 'photo') {
      if (!newMediaUrls || newMediaUrls.length === 0) {
        newMediaUrls = dhruvkumarImages;
        changed = true;
      }
    }

    // Video sessions → set thumbnail image_url
    if (sessionThumbnailFragment[session.serial_no]) {
      const fragment = sessionThumbnailFragment[session.serial_no];
      const url = lookupByFragment(fragment);
      if (url && url !== session.image_url) {
        newImageUrl = url;
        changed = true;
      }
    }

    if (changed) {
      await prisma.sessionContent.update({
        where: { serial_no: session.serial_no },
        data:  { image_url: newImageUrl, media_urls: newMediaUrls },
      });
      console.log(`  ✅ serial=${session.serial_no} "${session.title.substring(0,45)}"`);
      totalUpdated++;
    } else {
      console.log(`  ⏭️  serial=${session.serial_no} already up to date`);
    }
  }

  // ── 4. achievement_content → image_url & media_urls ─────────────────────────
  console.log('\n🏆 Updating achievement_content ...');

  const achievements = await prisma.achievementContent.findMany({ orderBy: { serial_no: 'asc' } });
  for (const ach of achievements) {
    // Match from exported data by serial_no
    const exported = exportedData.achievementContents.find(a => a.serial_no === ach.serial_no);
    if (!exported) { console.log(`  ⚠️  serial=${ach.serial_no} not in exported_data`); continue; }

    const newImageUrl  = exported.image_url  || ach.image_url;
    const newMediaUrls = exported.media_urls && exported.media_urls.length > 0
      ? exported.media_urls
      : ach.media_urls;

    const imageChanged = newImageUrl  !== ach.image_url;
    const mediaChanged = JSON.stringify(newMediaUrls) !== JSON.stringify(ach.media_urls);

    if (imageChanged || mediaChanged) {
      await prisma.achievementContent.update({
        where: { serial_no: ach.serial_no },
        data:  { image_url: newImageUrl, media_urls: newMediaUrls },
      });
      console.log(`  ✅ serial=${ach.serial_no} "${ach.title.substring(0,45)}"`);
      totalUpdated++;
    } else {
      console.log(`  ⏭️  serial=${ach.serial_no} already up to date`);
    }
  }

  // ── 5. research_project_members → student_image_url ─────────────────────────
  console.log('\n👤 Updating research_project_members.student_image_url ...');

  // Build enrollment → profile_image lookup from live students DB
  const liveStudents = await prisma.studentsDetail.findMany({
    select: { enrollment_no: true, profile_image: true, student_name: true },
  });
  const profileByEnrollment = {};
  for (const s of liveStudents) {
    if (s.profile_image) profileByEnrollment[s.enrollment_no] = s.profile_image;
  }

  const members = await prisma.research_project_members.findMany();
  for (const member of members) {
    const newUrl = profileByEnrollment[member.enrollment_no];
    if (!newUrl) { console.log(`  ⚠️  ${member.enrollment_no} no profile image`); continue; }

    if (newUrl !== member.student_image_url) {
      await prisma.research_project_members.update({
        where: {
          project_id_enrollment_no: {
            project_id: member.project_id,
            enrollment_no: member.enrollment_no,
          },
        },
        data: { student_image_url: newUrl },
      });
      console.log(`  ✅ project=${member.project_id} ${member.enrollment_no}`);
      totalUpdated++;
    } else {
      console.log(`  ⏭️  project=${member.project_id} ${member.enrollment_no} already up to date`);
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log(`\n✅ Done. Updated ${totalUpdated} records in the database.`);
}

main()
  .catch(err => { console.error('❌ Error:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
