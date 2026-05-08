const prisma = require('../lib/prisma');

// GET /api/batch-member-stats
// Returns per-student counts for card metrics.
// Single source of truth: srl_student_profiles joined with students_details.
// No paper_authors, research_papers, or member_cv_profiles queries.

exports.getBatchStats = async (req, res, next) => {
  try {
    const profiles = await prisma.srlStudentProfile.findMany({
      where: { is_active: true },
      select: {
        enrollment_no:    true,
        hackathons:       true,
        papers_published: true,
        research_works:   true,
        students_details: { select: { student_name: true } },
      },
    });

    const statsByName          = {};
    const enrollmentHackathons = {};

    for (const p of profiles) {
      const en      = (p.enrollment_no || '').trim().toUpperCase();
      const name    = p.students_details?.student_name || null;
      const hackArr = Array.isArray(p.hackathons)       ? p.hackathons.filter(Boolean)       : [];
      const paperArr = Array.isArray(p.papers_published) ? p.papers_published.filter(Boolean) : [];
      const workArr  = Array.isArray(p.research_works)   ? p.research_works.filter(Boolean)   : [];

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
