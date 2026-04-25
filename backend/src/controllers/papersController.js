const prisma = require('../lib/prisma');
const { EXCLUDED_TEST_USERS, ADMIN_EMAIL, isExcludedStudent } = require('../lib/adminUtils');

function parseArrayField(val) {
  if (!val || val === "-") return [];
  if (Array.isArray(val)) return val.filter((v) => v && v !== "-");
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (["[]", "", "-"].includes(trimmed)) return [];
    try {
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
      if (Array.isArray(parsed)) return parsed.filter((v) => v && v !== "-");
    } catch (e) {
      // ignore
    }
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

// GET /api/papers/:studentName
exports.getPapersByStudent = async (req, res, next) => {
  try {
    const studentName = (req.params.studentName || "").trim();
    const enrollmentNo = (req.query.enrollment_no || "").toString().trim().toUpperCase();

    // Check if student name is excluded
    if (studentName && isExcludedStudent(studentName)) {
      return res.json({
        research_works_count: 0,
        papers_published_count: 0,
        hackathons_count: 0,
        research_areas: [],
        hackathons: [],
        papers: [],
      });
    }

    // Check if enrollment is excluded
    if (enrollmentNo && (await isExcludedEnrollment(enrollmentNo))) {
      return res.json({
        research_works_count: 0,
        papers_published_count: 0,
        hackathons_count: 0,
        research_areas: [],
        hackathons: [],
        papers: [],
      });
    }

    // --- Papers: query publications table by enrollment number ---
    let paperTitles = [];
    if (enrollmentNo) {
      const pubRows = await prisma.publication.findMany({
        where: {
          enrollment_nos: {
            contains: enrollmentNo,
            mode: 'insensitive',
          },
        },
        select: {
          title: true,
          enrollment_nos: true,
          category: true,
        },
      });

      // Double-check the match is exact (avoid "30144" matching "30144X")
      const enrollPattern = new RegExp(`(^|,)${enrollmentNo}(,|$)`);
      paperTitles = (pubRows || [])
        .filter((row) => {
          const isMatch = enrollPattern.test(row.enrollment_nos || "");
          const isUnderReview = (row.category || "").toLowerCase().includes("under review");
          return isMatch && !isUnderReview;
        })
        .map((row) => row.title);
    }

    // --- Fallback: legacy paper_authors table (if publications table is empty for this student) ---
    if (paperTitles.length === 0 && studentName) {
      const legacyRows = await prisma.paperAuthor.findMany({
        where: {
          author_name: {
            contains: studentName,
            mode: 'insensitive',
          },
        },
        include: {
          researchPaper: true,
        },
      });

      const seenIds = new Set();
      (legacyRows || []).forEach((row) => {
        if (row.researchPaper && row.researchPaper.id && row.researchPaper.title && !seenIds.has(row.researchPaper.id)) {
          seenIds.add(row.researchPaper.id);
          paperTitles.push(row.researchPaper.title.trim());
        }
      });
    }

    // --- Hackathons + Research Areas: member_cv_profiles ---
    let hackathons = [];
    let researchAreas = [];

    if (enrollmentNo) {
      const profile = await prisma.memberCvProfile.findUnique({
        where: {
          enrollment_no: enrollmentNo,
        },
        select: {
          hackathons: true,
          research_area: true,
        },
      });

      if (profile) {
        hackathons = parseArrayField(profile.hackathons);
        researchAreas = parseArrayField(profile.research_area);
      }
    }

    res.json({
      research_works_count: paperTitles.length,
      papers_published_count: paperTitles.length,
      hackathons_count: hackathons.length,
      research_areas: researchAreas,
      hackathons: hackathons,
      papers: paperTitles,
    });
  } catch (err) {
    next(err);
  }
};
