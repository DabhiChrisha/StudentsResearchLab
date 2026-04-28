const prisma = require("../lib/prisma");

const monthValueToNumber = (month) => {
  const trimmed = String(month ?? "").trim();
  const numeric = Number.parseInt(trimmed, 10);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }

  const monthLookup = {
    jan: 1,
    january: 1,
    feb: 2,
    february: 2,
    mar: 3,
    march: 3,
    apr: 4,
    april: 4,
    may: 5,
    jun: 6,
    june: 6,
    jul: 7,
    july: 7,
    aug: 8,
    august: 8,
    sep: 9,
    sept: 9,
    september: 9,
    oct: 10,
    october: 10,
    nov: 11,
    november: 11,
    dec: 12,
    december: 12,
  };

  return monthLookup[trimmed.toLowerCase()] || 0;
};

const monthNumberToLabel = (monthNumber, year) => {
  const monthName = new Date(year, monthNumber - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return monthName;
};

/**
 * Get all scores - GET /api/admin/scores or /api/user/scores
 * Query params: ?month=MM&year=YYYY (optional, defaults to current month)
 * Returns both monthly scores (from debate_scores) and leaderboard stats + available months
 */
exports.getScores = async (req, res, next) => {
  try {
    // Get month/year from query params or use current
    let queryMonth = req.query.month;
    let queryYear = req.query.year ? parseInt(req.query.year) : undefined;

    const now = new Date();
    let currentMonth, currentYear;

    if (queryMonth && queryYear) {
      currentMonth = String(queryMonth).padStart(2, "0");
      currentYear = queryYear;
    } else {
      currentMonth = String(now.getMonth() + 1).padStart(2, "0");
      currentYear = now.getFullYear();
    }

    // Get all available months from debate_scores
    const rawMonths = await prisma.debateScore.findMany({
      distinct: ["month", "year"],
      select: {
        month: true,
        year: true,
      },
    });

    const availableMonths = rawMonths
      .map((item) => {
        const monthNumber = monthValueToNumber(item.month);

        return {
          month: String(item.month).padStart(2, "0"),
          year: item.year,
          monthNumber,
          value: `${item.year}-${String(monthNumber).padStart(2, "0")}`,
          label: monthNumber ? monthNumberToLabel(monthNumber, item.year) : `${item.month} ${item.year}`,
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.monthNumber - a.monthNumber;
      });

    // Get this month's debate scores
    const monthlyScores = await prisma.debateScore.findMany({
      where: {
        month: currentMonth,
        year: currentYear,
      },
      orderBy: { points: "desc" },
      select: {
        id: true,
        enrollment_no: true,
        month: true,
        year: true,
        points: true,
      },
    });

    // Get all-time leaderboard stats
    const leaderboardStats = await prisma.leaderboardStat.findMany({
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
      data: {
        currentMonth: `${currentMonth}/${currentYear}`,
        currentYear,
        monthlyScores: monthlyScores || [],
        leaderboardStats: leaderboardStats || [],
        availableMonths: availableMonths || [],
      },
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
