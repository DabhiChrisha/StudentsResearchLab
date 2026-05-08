const prisma = require('../lib/prisma');
const { shouldExcludeFromResearchers } = require('../lib/adminUtils');

// ─── helpers ─────────────────────────────────────────────────────────────────

function safeArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); if (Array.isArray(p)) return p.filter(Boolean); } catch (_) {}
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

// ─── GET /api/researchers ────────────────────────────────────────────────────
// Single source of truth: srl_student_profiles joined with students_details.
// All arrays, all counts, all profile data come exclusively from these two tables.
// No member_cv_profiles, no publications, no paper_authors queries.

exports.getResearchers = async (req, res, next) => {
  try {
    const profiles = await prisma.srlStudentProfile.findMany({
      where: { is_active: true },
      include: { students_details: true },
    });

    // Filter out admin/test users using the joined identity row
    const filtered = profiles.filter(
      p => p.students_details && !shouldExcludeFromResearchers(p.students_details)
    );

    const researchers = filtered.map(profile => {
      const sd = profile.students_details;
      const en = (profile.enrollment_no || '').trim().toUpperCase();

      // ── all arrays from srl_student_profiles ────────────────────────────
      const hackathons      = safeArray(profile.hackathons);
      const papersPublished = safeArray(profile.papers_published);
      const researchWorks   = safeArray(profile.research_works);
      const ongoingResearch = safeArray(profile.ongoing_research);
      const achievements    = safeArray(profile.achievements);
      const srlPublications = safeArray(profile.srl_publications);

      // ── counts derived from arrays — no external table queries ──────────
      const srlPublished    = srlPublications.filter(
        p => (p.category || '').toLowerCase() !== 'paper under review'
      );
      const hackathonsCount    = hackathons.length;
      const researchWorksCount = researchWorks.length;
      // prefer structured srl_publications count; fall back to simple list
      const publicationsCount  = srlPublished.length || papersPublished.length;

      return {
        // ── identity (from students_details) ────────────────────────────
        student_name:  sd.student_name,
        enrollment_no: en,
        photo:         sd.profile_image || '/students/schoolstudent.png',
        department:    sd.department    || 'CE',
        semester:      sd.semester      || '',
        batch:         sd.batch         || '-',
        email:         sd.email         || '',

        // ── profile (from srl_student_profiles) ─────────────────────────
        linkedin:              profile.linkedin   || '',
        reflection:            profile.reflection || '',
        roles:                 safeArray(profile.roles),
        research:              safeArray(profile.research_areas),
        achievements_extended: profile.achievements_extended || null,
        metadata:              profile.metadata   || null,

        // ── full arrays (sent once — no second round-trip needed) ────────
        hackathons,
        papersPublished,
        researchWorks,
        ongoingResearch,
        achievements,
        srlPublications,

        // ── pre-computed counts ──────────────────────────────────────────
        hackathonsCount,
        researchWorksCount,
        publicationsCount,
      };
    });

    res.json({ researchers });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/researchers/sync ───────────────────────────────────────────────
// Legacy sync endpoint — kept for backward compatibility.
// Writes to srl_student_profiles (primary) and member_cv_profiles (legacy compat).

exports.syncResearchers = async (req, res, next) => {
  try {
    const { type, data } = req.body;

    if (type === 'achievements') {
      for (const [name, info] of Object.entries(data)) {
        const student = await prisma.studentsDetail.findFirst({
          where: { student_name: { contains: name, mode: 'insensitive' } },
        });
        if (!student) continue;
        const en = student.enrollment_no;

        // 1. Legacy member_cv_profiles sync (backward compat)
        const current = await prisma.memberCvProfile.findUnique({
          where: { enrollment_no: en }, select: { projects: true },
        });
        let extended = {};
        try {
          if (current?.projects) {
            extended = typeof current.projects === 'string'
              ? JSON.parse(current.projects) : current.projects;
          }
        } catch (_) {}
        extended.achievements_extended = info;

        await prisma.memberCvProfile.upsert({
          where: { enrollment_no: en },
          update: {
            hackathons:    JSON.stringify(info.hackathons || []),
            research_area: Array.isArray(info.researchWork) ? info.researchWork.join(',') : '',
            projects:      JSON.stringify(extended),
          },
          create: {
            enrollment_no: en,
            hackathons:    JSON.stringify(info.hackathons || []),
            research_area: Array.isArray(info.researchWork) ? info.researchWork.join(',') : '',
            projects:      JSON.stringify(extended),
          },
        });

        // 2. Primary srl_student_profiles sync
        await prisma.srlStudentProfile.upsert({
          where:  { enrollment_no: en },
          update: {
            hackathons:            info.hackathons || [],
            research_areas:        Array.isArray(info.researchWork) ? info.researchWork : [],
            achievements_extended: info,
            updated_at:            new Date(),
            updated_by:            'sync',
          },
          create: {
            enrollment_no:         en,
            hackathons:            info.hackathons || [],
            research_areas:        Array.isArray(info.researchWork) ? info.researchWork : [],
            achievements_extended: info,
            created_by:            'sync',
          },
        });
      }

    } else if (type === 'publications') {
      for (const [name, pubs] of Object.entries(data)) {
        const student = await prisma.studentsDetail.findFirst({
          where: { student_name: { contains: name, mode: 'insensitive' } },
        });
        if (!student) continue;
        const en = student.enrollment_no;

        // 1. Legacy sync
        const current = await prisma.memberCvProfile.findUnique({
          where: { enrollment_no: en }, select: { projects: true },
        });
        let extended = {};
        try {
          if (current?.projects) {
            extended = typeof current.projects === 'string'
              ? JSON.parse(current.projects) : current.projects;
          }
        } catch (_) {}
        extended.srlPublications = pubs;

        await prisma.memberCvProfile.upsert({
          where:  { enrollment_no: en },
          update: { projects: JSON.stringify(extended) },
          create: { enrollment_no: en, projects: JSON.stringify(extended) },
        });

        // 2. Primary srl_student_profiles sync
        await prisma.srlStudentProfile.upsert({
          where:  { enrollment_no: en },
          update: { srl_publications: pubs, updated_at: new Date(), updated_by: 'sync' },
          create: { enrollment_no: en, srl_publications: pubs, created_by: 'sync' },
        });
      }
    }

    res.json({ message: 'Sync successful' });
  } catch (err) {
    next(err);
  }
};
