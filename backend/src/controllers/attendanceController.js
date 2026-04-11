const prisma = require('../lib/prisma');
const { EXCLUDED_TEST_USERS, ADMIN_EMAIL } = require('../lib/adminUtils');

// Get excluded enrollments (cached per request)
async function getExcludedEnrollments() {
  const testAdminUsers = await prisma.studentsDetail.findMany({
    where: {
      OR: [
        { member_type: "admin" },
        { is_admin: true },
        { email: ADMIN_EMAIL },
        {
          student_name: {
            in: EXCLUDED_TEST_USERS.names,
            mode: 'insensitive',
          },
        },
      ],
    },
    select: {
      enrollment_no: true,
    },
  });

  return new Set(
    testAdminUsers.map(u => (u.enrollment_no || "").trim().toUpperCase())
  );
}

// GET /api/attendance
exports.getAllAttendance = async (req, res, next) => {
  try {
    const attendanceRecords = await prisma.attendance.findMany();
    const excludedEnrollments = await getExcludedEnrollments();

    // Filter out test/admin users
    const filteredRecords = (attendanceRecords || []).filter(record => {
      const enrollmentNo = (record.enrollment_no || "").trim().toUpperCase();
      return !excludedEnrollments.has(enrollmentNo);
    });

    res.json(filteredRecords);
  } catch (err) {
    next(err);
  }
};

// GET /api/attendance/:student_id
exports.getAttendanceByStudentId = async (req, res, next) => {
  try {
    const { student_id } = req.params;
    const attendance = await prisma.attendance.findMany({
      where: {
        student_id: student_id,
      },
    });

    const excludedEnrollments = await getExcludedEnrollments();

    // Filter out test/admin users
    const filteredAttendance = (attendance || []).filter(record => {
      const enrollmentNo = (record.enrollment_no || "").trim().toUpperCase();
      return !excludedEnrollments.has(enrollmentNo);
    });

    res.json(filteredAttendance);
  } catch (err) {
    next(err);
  }
};

// GET /api/attendance/:enrollment_no/percentage
exports.getAttendancePercentage = async (req, res, next) => {
  try {
    const { enrollment_no } = req.params;
    const normalizedEnrollment = String(enrollment_no).toUpperCase();

    const excludedEnrollments = await getExcludedEnrollments();

    // Check if this enrollment is excluded
    if (excludedEnrollments.has(normalizedEnrollment)) {
      return res.json({ percentage: 0.0, records: [] });
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        enrollment_no: normalizedEnrollment,
      },
    });
    res.json({ percentage: 0.0, records: attendance });
  } catch (err) {
    next(err);
  }
};

// GET /api/attendance/:enrollment_no/srl_percentage
exports.getSrlPercentage = async (req, res, next) => {
  try {
    const { enrollment_no } = req.params;
    const normalizedEnrollment = String(enrollment_no).toUpperCase();

    const excludedEnrollments = await getExcludedEnrollments();

    // Check if this enrollment is excluded
    if (excludedEnrollments.has(normalizedEnrollment)) {
      return res.json({ srl_percentage: 0.0 });
    }

    res.json({ srl_percentage: 0.0 });
  } catch (err) {
    next(err);
  }
};
