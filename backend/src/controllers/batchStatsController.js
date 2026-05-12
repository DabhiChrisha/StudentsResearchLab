const prisma = require('../lib/prisma');

// GET /api/batch-member-stats
// Source: member_cv_profiles joined with students_details.

exports.getBatchStats = async (req, res, next) => {
  try {
    const profiles = await prisma.memberCvProfile.findMany({
      select: {
        enrollment_no:   true,
        hackathons:      true,
        research_papers: true,
        projects:        true,
        students_details: { select: { student_name: true } },
      },
    });

    const statsByName          = {};
    const enrollmentHackathons = {};

    for (const p of profiles) {
      const en       = (p.enrollment_no || '').trim().toUpperCase();
      const name     = p.students_details?.student_name || null;
      const hackArr  = Array.isArray(p.hackathons)      ? p.hackathons.filter(Boolean)      : [];
      const paperArr = Array.isArray(p.research_papers) ? p.research_papers.filter(Boolean) : [];
      const workArr  = Array.isArray(p.projects)        ? p.projects.filter(Boolean)        : [];

      if (en) enrollmentHackathons[en] = hackArr.length;

      if (name) {
        statsByName[name] = {
          research_works_count:   workArr.length,
          papers_published_count: paperArr.length,
        };
      }
    }

    res.json({
      stats_by_name:            statsByName,
      hackathons_by_enrollment: enrollmentHackathons,
    });
  } catch (err) {
    next(err);
  }
};
