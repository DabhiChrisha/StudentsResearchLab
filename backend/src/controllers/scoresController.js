const prisma = require('../lib/prisma');
const { EXCLUDED_TEST_USERS, ADMIN_EMAIL } = require('../lib/adminUtils');

// GET /api/scores
exports.getScores = async (req, res, next) => {
  try {
    const records = await prisma.debateScore.findMany();
    
    // Get list of test/admin users to exclude
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

    const excludedEnrollments = new Set(
      testAdminUsers.map(u => (u.enrollment_no || "").trim().toUpperCase())
    );

    // Filter out test/admin users
    const filteredRecords = (records || []).filter(record => {
      const enrollmentNo = (record.enrollment_no || "").trim().toUpperCase();
      return !excludedEnrollments.has(enrollmentNo);
    });

    res.json({ records: filteredRecords });
  } catch (err) {
    next(err);
  }
};

// GET /api/scores/:student_id
exports.getScoreByStudentId = async (req, res, next) => {
  try {
    res.status(501).json({ detail: "Not Implemented securely for debate_scores yet" });
  } catch (err) {
    next(err);
  }
};
