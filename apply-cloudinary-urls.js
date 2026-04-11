/**
 * apply-cloudinary-urls.js
 *
 * Reads cloudinary-url-map.json and patches exported_data.json in-place
 * with the correct Cloudinary URLs for:
 *  1. activities.Photo
 *  2. sessionContents.image_url  (video thumbnails)
 *  3. sessionContents.media_urls (photo-type session images)
 *  4. researchProjectMembers.student_image_url (from students profile_image)
 */

const fs = require('fs');
const path = require('path');

const urlMapPath  = path.join(__dirname, 'cloudinary-url-map.json');
const dataPath    = path.join(__dirname, 'backend', 'prisma', 'exported_data.json');

const urlMap = JSON.parse(fs.readFileSync(urlMapPath, 'utf-8'));
const data   = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let changes = 0;

// ─── Helper ──────────────────────────────────────────────────────────────────
// Look up a key that contains the given filename fragment (case-insensitive)
function lookupByFragment(fragment) {
  const lower = fragment.toLowerCase();
  for (const [key, url] of Object.entries(urlMap)) {
    if (key.toLowerCase().includes(lower)) return url;
  }
  return null;
}

// ─── 1. Activities ───────────────────────────────────────────────────────────
// Map activity title keywords → file fragments
const activityTitleToFragment = {
  'IndiaAI Impact Summit':        'SRL-Students-Researchers-Team-at-the-IndiaAI-Impact-Summit-2026',
  'IndiaSkills':                  'KSV-Students-Witness-Excellence-at-IndiaSkills-Regional-Competition-2026',
  'MMPSRPC Students Research Lab':'MMPSRPC-Students-Research-Lab-Where-Ideas-Turn-into-Meaningful-Research',
  'Research Internship':          'Research-Internship-Project-Presentations-at-KSV-Students-Research-Lab',
  'Regional AI':                  'Students-Research-Lab-Members-from-KSV-at-Regional-AI-Impact-Conference',
  'IMG20260224':                  'IMG20260224121158',    // Bridging Theory & Practice
};

console.log('\n=== Patching Activities ===');
for (const activity of data.activities) {
  if (activity.Photo) { console.log(`  [SKIP] id=${activity.id} already has Photo`); continue; }

  for (const [keyword, fragment] of Object.entries(activityTitleToFragment)) {
    if (activity.title && activity.title.includes(keyword.split(' ')[0])) {
      const url = lookupByFragment(fragment);
      if (url) {
        console.log(`  [SET]  id=${activity.id} "${activity.title.trim()}" -> ${url}`);
        activity.Photo = url;
        changes++;
        break;
      }
    }
  }

  if (!activity.Photo) {
    console.log(`  [WARN] id=${activity.id} "${(activity.title||'').trim()}" - no match found`);
  }
}

// Special case: "Bridging Theory & Practice" → use the IMG20260224 photo
for (const activity of data.activities) {
  if (!activity.Photo && activity.title && activity.title.includes('Bridging')) {
    const url = lookupByFragment('IMG20260224121158');
    if (url) {
      console.log(`  [SET]  id=${activity.id} "Bridging Theory..." -> ${url}`);
      activity.Photo = url;
      changes++;
    }
  }
}

// ─── 2. SessionContent thumbnails (image_url) ────────────────────────────────
// Sessions with type=video need a thumbnail image_url.
// Sessions with type=photo use media_urls (already populated from Cloudinary earlier).
//
// Mapping: serial_no → thumbnail key fragment
const sessionThumbnailMap = {
  3: 'video-thumb-1',   // Alumni Manan Darji / Dhwani
  4: 'video-thumb-2',   // Alumni Shubham / Dhruvkumar / Jay
  5: 'video-thumb-3',   // Articulation of Algorithmic Concepts
};

// For session serial_no=1 (Dhruvkumar - photo type), populate media_urls
const dhruvkumarImages = Object.entries(urlMap)
  .filter(([k]) => k.includes('Sessions/Alumni-Success-Dhruvkumar/img-'))
  .sort(([a],[b]) => a.localeCompare(b))
  .map(([,v]) => v);

console.log('\n=== Patching Session Contents ===');
for (const session of data.sessionContents) {
  // Photo-type session: set media_urls
  if (session.serial_no === 1 && session.type === 'photo') {
    if (!session.media_urls || session.media_urls.length === 0) {
      session.media_urls = dhruvkumarImages;
      console.log(`  [SET]  serial=${session.serial_no} media_urls (${dhruvkumarImages.length} images)`);
      changes++;
    } else {
      console.log(`  [SKIP] serial=${session.serial_no} media_urls already set`);
    }
  }

  // Video-type sessions: set image_url thumbnail
  if (sessionThumbnailMap[session.serial_no]) {
    const fragment = sessionThumbnailMap[session.serial_no];
    const url = lookupByFragment(fragment);
    if (url && !session.image_url) {
      console.log(`  [SET]  serial=${session.serial_no} image_url -> ${url}`);
      session.image_url = url;
      changes++;
    } else if (session.image_url) {
      console.log(`  [SKIP] serial=${session.serial_no} image_url already set`);
    } else {
      console.log(`  [WARN] serial=${session.serial_no} - could not find thumbnail for "${fragment}"`);
    }
  }
}

// ─── 3. ResearchProjectMembers student_image_url ─────────────────────────────
// Build a lookup: enrollment_no → profile_image from studentsDetails
const studentImageByEnrollment = {};
for (const student of data.studentsDetails) {
  if (student.profile_image) {
    studentImageByEnrollment[student.enrollment_no] = student.profile_image;
  }
}

console.log('\n=== Patching ResearchProjectMembers ===');
for (const member of data.researchProjectMembers) {
  if (member.student_image_url) {
    console.log(`  [SKIP] project=${member.project_id} enrollment=${member.enrollment_no} already set`);
    continue;
  }
  const img = studentImageByEnrollment[member.enrollment_no];
  if (img) {
    console.log(`  [SET]  project=${member.project_id} enrollment=${member.enrollment_no} -> ${img}`);
    member.student_image_url = img;
    changes++;
  } else {
    console.log(`  [WARN] project=${member.project_id} enrollment=${member.enrollment_no} - no profile image`);
  }
}

// ─── Write output ─────────────────────────────────────────────────────────────
if (changes > 0) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n✅ Done! Applied ${changes} URL changes to exported_data.json`);
} else {
  console.log('\n✅ No changes needed — all URLs already set.');
}
