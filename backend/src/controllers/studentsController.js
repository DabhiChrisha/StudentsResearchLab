const prisma = require('../lib/prisma');

// GET /api/students
exports.getStudents = async (req, res, next) => {
  try {
    const scores = await prisma.debateScore.findMany({
      select: {
        enrollment_no: true,
        points: true,
      },
    });

    const details = await prisma.studentsDetail.findMany({
      select: {
        enrollment_no: true,
        student_name: true,
      },
    });

    // Build name map
    const nameMap = {};
    details.forEach((rec) => {
      if (rec.enrollment_no) {
        const en = String(rec.enrollment_no).trim().toUpperCase();
        if (rec.student_name) {
          nameMap[en] = rec.student_name;
        }
      }
    });

    // Aggregate points
    const pointsMap = {};
    scores.forEach((sc) => {
      if (sc.enrollment_no) {
        const en = String(sc.enrollment_no).trim().toUpperCase();
        const points = sc.points || 0;
        pointsMap[en] = (pointsMap[en] || 0) + points;
      }
    });

    const result = [];
    for (const [en, total] of Object.entries(pointsMap)) {
      result.push({
        id: en,
        enrollment_no: en,
        name: nameMap[en] || "Unknown Student",
        attendance_percentage: 0.0,
        total_score: total,
      });
    }

    res.json({ students: result });
  } catch (err) {
    next(err);
  }
};
