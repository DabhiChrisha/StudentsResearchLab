const prisma = require('../lib/prisma');
const { shouldExcludeFromResearchers } = require('../lib/adminUtils');

function safeArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); if (Array.isArray(p)) return p.filter(Boolean); } catch (_) {}
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

// Normalize array fields that may contain objects (e.g. {title, doi, journal, year}).
// Extracts a meaningful string from objects; discards empty ones.
function normalizeArray(val) {
  return safeArray(val).map(item => {
    if (typeof item === 'string') return item.trim() || null;
    if (typeof item === 'object' && item !== null) {
      const str = item.title || item.name || item.description || item.details || '';
      return str.trim() || null;
    }
    return null;
  }).filter(Boolean);
}

// ─── GET /api/researchers ────────────────────────────────────────────────────
// Source: member_cv_profiles joined with students_details via FK.

exports.getResearchers = async (req, res, next) => {
  try {
    // Select only the fields the frontend actually needs — avoids sending
    // login_password, cv_url, contact_no, gender, and other unused columns.
    const profiles = await prisma.memberCvProfile.findMany({
      include: {
        patents: true,
        students_details: {
          select: {
            student_name:  true,
            enrollment_no: true,
            profile_image: true,
            department:    true,
            semester:      true,
            batch:         true,
            email:         true,
            member:        true,
          },
        },
      },
    });

    const filtered = profiles.filter(
      p => p.students_details && !shouldExcludeFromResearchers(p.students_details)
    );

    const researchers = filtered.map(profile => {
      const sd = profile.students_details;
      const en = (profile.enrollment_no || '').trim().toUpperCase();

      const hackathons      = normalizeArray(profile.hackathons);
      const papersPublished = normalizeArray(profile.research_papers);
      const allResearchWork = normalizeArray(profile.research_work);
      const researchAreas   = normalizeArray(profile.research_areas);
      const leadership      = normalizeArray(profile.leadership);
      const awards          = normalizeArray(profile.awards);
      const achievements    = normalizeArray(profile.additional_achievements);

      // Ongoing items are counted in the metric but NOT shown in the display list
      const completedWork = allResearchWork.filter(
        w => !w.toLowerCase().startsWith('ongoing')
      );
      const ongoingWork = allResearchWork.filter(
        w => w.toLowerCase().startsWith('ongoing')
      );

      // Serialize BigInt values from patents
      const serializedPatents = (profile.patents || []).map(p => ({
        ...p,
        patent_id: p.patent_id?.toString ? p.patent_id.toString() : p.patent_id,
      }));

      return {
        student_name:  sd.student_name,
        enrollment_no: en,
        profile_image: sd.profile_image || null,
        photo:         sd.profile_image || null, // backward-compat alias
        department:    sd.department    || 'CE',
        semester:      sd.semester      || '',
        batch:         sd.batch         || '-',
        email:         sd.email         || '',

        linkedin:   profile.linkedin_id || '',
        reflection: profile.reflection  || '',
        roles:      sd.member === 'Research Assistant' ? ['Research Assistant'] : [],
        research:   researchAreas,

        hackathons,
        papersPublished,
        researchWorks:   completedWork,
        ongoingResearch: ongoingWork,
        achievements,
        achievements_extended: { leadership, awards },
        patents: serializedPatents,
        srlPublications: [],

        hackathonsCount:    hackathons.length,
        researchWorksCount: allResearchWork.length,
        publicationsCount:  papersPublished.length,
      };
    });

    res.json({ researchers });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/researchers/sync ───────────────────────────────────────────────

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

        await prisma.memberCvProfile.upsert({
          where: { enrollment_no: en },
          update: {
            hackathons:    info.hackathons || [],
            research_work: Array.isArray(info.researchWork) ? info.researchWork : [],
            updated_at:    new Date(),
          },
          create: {
            enrollment_no: en,
            student_name:  student.student_name,
            hackathons:    info.hackathons || [],
            research_work: Array.isArray(info.researchWork) ? info.researchWork : [],
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

        await prisma.memberCvProfile.upsert({
          where:  { enrollment_no: en },
          update: { research_papers: pubs, updated_at: new Date() },
          create: {
            enrollment_no:   en,
            student_name:    student.student_name,
            research_papers: pubs,
          },
        });
      }
    }

    res.json({ message: 'Sync successful' });
  } catch (err) {
    next(err);
  }
};
