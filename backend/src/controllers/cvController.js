const prisma = require('../lib/prisma');
const { EXCLUDED_TEST_USERS, ADMIN_EMAIL } = require('../lib/adminUtils');

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

// GET /api/cv/:enrollment_no
exports.getCvProfile = async (req, res, next) => {
  try {
    const { enrollment_no } = req.params;
    const normalizedEnrollment = String(enrollment_no).toUpperCase();

    // Check if this enrollment is excluded
    if (await isExcludedEnrollment(normalizedEnrollment)) {
      return res.status(404).json({
        detail: `CV profile not found for enrollment: ${enrollment_no}`,
      });
    }

    const cv = await prisma.memberCvProfile.findUnique({
      where: {
        enrollment_no: normalizedEnrollment,
      },
    });

    if (!cv) {
      return res.status(404).json({
        detail: `CV profile not found for enrollment: ${enrollment_no}`,
      });
    }

    res.json({
      data: cv,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};
