const prisma = require('../lib/prisma');
const { EXCLUDED_TEST_USERS, ADMIN_EMAIL } = require('../lib/adminUtils');

function parseArrayField(val) {
  if (!val || val === "-") return [];
  if (Array.isArray(val)) return val.filter((v) => v && v !== "-");
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (["[]", "", "-"].includes(trimmed)) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter((v) => v && v !== "-");
    } catch (e) {
      // Ignore parse error
    }
    // Comma-separated fallback
    return trimmed
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s !== "-");
  }
  return [];
}

// Check if enrollment should be excluded
async function isExcludedEnrollment(enrollmentNo) {
  const student = await prisma.studentsDetail.findFirst({
    where: {
      enrollment_no: {
        equals: enrollmentNo,
        mode: 'insensitive',
      },
    },
    select: {
      member_type: true,
      is_admin: true,
      email: true,
      student_name: true,
    },
  });

  if (!student) return false;

  // Exclude admin users
  if (student.member_type === "admin" || student.is_admin === true) return true;

  // Exclude admin email
  if (student.email && student.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;

  // Exclude test users by name
  if (student.student_name) {
    const nameNormalized = (student.student_name || "").trim().toLowerCase();
    if (EXCLUDED_TEST_USERS.names.some(name => name.toLowerCase() === nameNormalized)) {
      return true;
    }
  }

  return false;
}

// GET /api/member-metrics/:enrollment_no
exports.getMemberMetrics = async (req, res, next) => {
  try {
    const lookup = req.params.enrollment_no.trim().toUpperCase();

    // Check if this enrollment is excluded
    if (await isExcludedEnrollment(lookup)) {
      return res.json({
        research_areas: [],
        research_papers: [],
        hackathons: [],
        patents: [],
        projects: [],
      });
    }

    const rows = await prisma.memberCvProfile.findMany({
      where: {
        enrollment_no: {
          equals: lookup,
          mode: 'insensitive',
        },
      },
      select: {
        research_area: true,
        research_papers: true,
        hackathons: true,
        patents: true,
        projects: true,
      },
    });

    if (!rows || rows.length === 0) {
      return res.json({
        research_areas: [],
        research_papers: [],
        hackathons: [],
        patents: [],
        projects: [],
      });
    }

    const profile = rows[0];

    let researchAreas = [];
    let raVal = profile.research_area;
    if (raVal && raVal !== "-") {
      if (typeof raVal === "string") {
        researchAreas = raVal
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s && s !== "-");
      }
    }

    res.json({
      research_areas: researchAreas,
      research_papers: parseArrayField(profile.research_papers),
      hackathons: parseArrayField(profile.hackathons),
      patents: parseArrayField(profile.patents),
      projects: parseArrayField(profile.projects),
    });
  } catch (err) {
    next(err);
  }
};
