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
    // Select only the fields the frontend actually needs
    const profiles = await prisma.memberCvProfile.findMany({
      include: {
        patents: true,
        students_details: {
          select: {
            student_name: true,
            enrollment_no: true,
            profile_image: true,
            department: true,
            semester: true,
            batch: true,
            email: true,
            member: true,
            member_type: true,
            is_admin: true,
          },
        },
        patents: {
          select: {
            patent_id: true,
            patent_title: true,
            application_date: true,
            application_status: true,
          },
        },
      },
    });

    const allPublications = await prisma.publication.findMany();

    const filtered = profiles.filter(
      p => p.students_details && !shouldExcludeFromResearchers(p.students_details)
    );

    const researchers = filtered.map(profile => {
      const sd = profile.students_details;
      const en = (profile.enrollment_no || '').trim().toUpperCase();

      const hackathons      = safeArray(profile.hackathons);
      const research_papers = safeArray(profile.research_papers);
      const research_work   = safeArray(profile.research_work);

      const patentsList     = (profile.patents || []).map(p => p.patent_title).filter(Boolean);
      
      const leadership      = safeArray(profile.leadership);
      const awards          = safeArray(profile.awards);
      const certifications  = safeArray(profile.certifications);
      const additional      = safeArray(profile.additional_achievements);
      const achievements    = [...awards, ...certifications, ...additional];

      // Serialize BigInt values from patents
      const serializedPatents = (profile.patents || []).map(p => ({
        ...p,
        patent_id: p.patent_id?.toString ? p.patent_id.toString() : p.patent_id,
      }));

      // Match SRL publications by student name
      const srlPubs = allPublications.filter(pub => {
        const authStr = typeof pub.authors === 'string' ? pub.authors : JSON.stringify(pub.authors || '');
        const srlMemStr = typeof pub.srl_member === 'string' ? pub.srl_member : JSON.stringify(pub.srl_member || '');
        return authStr.toLowerCase().includes(sd.student_name.toLowerCase()) || 
               srlMemStr.toLowerCase().includes(sd.student_name.toLowerCase());
      }).map(pub => ({
        id: pub.id?.toString ? pub.id.toString() : pub.id,
        title: pub.title,
        category: pub.category,
        link: pub.link,
        authors: pub.authors,
      }));

      return {
        student_name:  sd.student_name,
        enrollment_no: en,
        profile_image: sd.profile_image || null,
        photo:         sd.profile_image || null,
        department:    profile.department || sd.department || 'CE',
        semester:      sd.semester      || '',
        batch:         sd.batch         || '-',
        email:         sd.email         || '',
        linkedin:      profile.linkedin_id || '',

        reflection: profile.reflection || '',
        roles:      sd.member === 'Research Assistant' ? ['Research Assistant'] : [],
        research:   normalizeArray(profile.research_areas),

        hackathons,
        research_papers,
        research_work,
        achievements,
        certifications,
        achievements_extended: { leadership, awards },
        patents: serializedPatents,
        srlPublications: srlPubs,

        hackathonsCount:    hackathons.length,
        patentsCount:       patentsList.length,
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
            hackathons: info.hackathons || [],
            updated_at: new Date(),
          },
          create: {
            enrollment_no: en,
            student_name:  student.student_name,
            hackathons:    info.hackathons || [],
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
