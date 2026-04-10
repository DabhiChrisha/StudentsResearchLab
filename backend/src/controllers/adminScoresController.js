const prisma = require("../lib/prisma");

/**
 * Get all scores - GET /api/admin/scores
 * Fetches from leaderboard_stats table
 */
exports.getScores = async (req, res, next) => {
  try {
    const scores = await prisma.leaderboardStat.findMany({
      orderBy: { period: "desc" },
      select: {
        id: true,
        enrollment_no: true,
        student_name: true,
        period: true,
        debate_score: true,
        attendance: true,
        hours: true,
        created_at: true,
      },
    });

    res.json({
      success: true,
      data: scores,
    });
  } catch (error) {
    console.error("Get scores error:", error);
    next(error);
  }
};

/**
 * Get scores by student - GET /api/admin/scores/:enrollmentNo
 * Fetches from leaderboard_stats table
 */
exports.getScoresByStudent = async (req, res, next) => {
  try {
    const { enrollmentNo } = req.params;

    const scores = await prisma.leaderboardStat.findMany({
      where: { enrollment_no: enrollmentNo },
      orderBy: { period: "desc" },
      select: {
        id: true,
        enrollment_no: true,
        student_name: true,
        period: true,
        debate_score: true,
        attendance: true,
        hours: true,
        created_at: true,
      },
    });

    res.json({
      success: true,
      data: scores,
    });
  } catch (error) {
    console.error("Get student scores error:", error);
    next(error);
  }
};

/**
 * Create or update score - POST /api/admin/scores
 * Uses leaderboard_stats table
 */
exports.createScore = async (req, res, next) => {
  try {
    const { enrollment_no, points, debate_score, date, period } = req.body;

    if (!enrollment_no) {
      return res.status(400).json({
        error: "Invalid input",
        message: "enrollment_no is required",
      });
    }

    const scoreValue = parseInt(points || debate_score || 0) || 0;

    // Determine period from date or use provided period
    let periodValue = period;
    if (!periodValue && date) {
      const dateObj = new Date(date);
      periodValue = dateObj.toISOString().substring(0, 7); // YYYY-MM format
    }

    if (!periodValue) {
      return res.status(400).json({
        error: "Invalid input",
        message: "period or date is required",
      });
    }

    // Get student name from database
    const student = await prisma.studentsDetail.findUnique({
      where: { enrollment_no },
      select: { student_name: true },
    });

    if (!student) {
      return res.status(404).json({
        error: "Not found",
        message: "Student not found",
      });
    }

    // Get the next serial_no for this period
    const lastRecord = await prisma.leaderboardStat.findFirst({
      where: { period: periodValue },
      orderBy: { serial_no: "desc" },
    });
    const nextSerialNo = (lastRecord?.serial_no || 0) + 1;

    // Create new record in leaderboard_stats
    const score = await prisma.leaderboardStat.create({
      data: {
        serial_no: nextSerialNo,
        enrollment_no,
        student_name: student.student_name,
        period: periodValue,
        debate_score: scoreValue,
      },
    });

    res.status(201).json({
      success: true,
      message: "Score created successfully",
      data: score,
    });
  } catch (error) {
    console.error("Create score error:", error);
    next(error);
  }
};

/**
 * Update score - PUT /api/admin/scores/:id
 * Uses leaderboard_stats table
 */
exports.updateScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { points, debate_score } = req.body;

    const scoreValue = parseInt(points || debate_score);
    if (scoreValue === undefined) {
      return res.status(400).json({
        error: "Invalid input",
        message: "points or debate_score is required",
      });
    }

    const score = await prisma.leaderboardStat.update({
      where: { id: parseInt(id) },
      data: { debate_score: scoreValue },
    });

    res.json({
      success: true,
      message: "Score updated successfully",
      data: score,
    });
  } catch (error) {
    console.error("Update score error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Score not found",
      });
    }
    next(error);
  }
};

/**
 * Delete score - DELETE /api/admin/scores/:id
 * Uses leaderboard_stats table
 */
exports.deleteScore = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.leaderboardStat.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Score deleted successfully",
    });
  } catch (error) {
    console.error("Delete score error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Score not found",
      });
    }
    next(error);
  }
};
