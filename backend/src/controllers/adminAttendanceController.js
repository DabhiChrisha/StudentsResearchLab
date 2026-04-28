const prisma = require("../lib/prisma");

/**
 * Get all attendance records - GET /api/admin/attendance
 * Fetches from leaderboard_stats table
 */
exports.getAttendance = async (req, res, next) => {
  try {
    const records = await prisma.LeaderboardStat.findMany({
      orderBy: [{ period: "desc" }, { enrollment_no: "asc" }],
    });

    res.json({
      success: true,
      data: records || [],
      count: records.length,
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    next(error);
  }
};

/**
 * Get attendance by student - GET /api/admin/attendance/student/:enrollmentNo
 * Fetches from leaderboard_stats table
 */
exports.getAttendanceByStudent = async (req, res, next) => {
  try {
    const { enrollmentNo } = req.params;

    if (!enrollmentNo) {
      return res.status(400).json({
        success: false,
        message: "enrollmentNo is required",
      });
    }

    const records = await prisma.LeaderboardStat.findMany({
      where: { enrollment_no: String(enrollmentNo) },
      orderBy: { period: "desc" },
    });

    res.json({
      success: true,
      data: records || [],
      enrollment_no: enrollmentNo,
      count: records.length,
    });
  } catch (error) {
    console.error("Get student attendance error:", error);
    next(error);
  }
};

/**
 * Mark attendance - POST /api/admin/attendance
 * Updates in leaderboard_stats table
 */
exports.markAttendance = async (req, res, next) => {
  try {
    const { enrollment_no, date, hours = 0, attendance = 0 } = req.body;

    if (!enrollment_no || !date) {
      return res.status(400).json({
        success: false,
        message: "enrollment_no and date are required",
      });
    }

    // Format date as YYYY-MM-DD for period
    const period = typeof date === "string" ? date.split("T")[0] : date;

    // Get student name for create operation
    const student = await prisma.StudentsDetail.findFirst({
      where: { enrollment_no: String(enrollment_no) },
    });

    const record = await prisma.LeaderboardStat.upsert({
      where: {
        enrollment_no_period: {
          enrollment_no: String(enrollment_no),
          period: String(period),
        },
      },
      update: {
        hours: hours ? parseFloat(hours) : undefined,
        attendance: attendance ? parseInt(attendance) : undefined,
      },
      create: {
        enrollment_no: String(enrollment_no),
        period: String(period),
        hours: parseFloat(hours) || 0,
        attendance: parseInt(attendance) || 0,
        student_name: student?.student_name || "",
        serial_no: 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: record,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    next(error);
  }
};

/**
 * Update attendance - PUT /api/admin/attendance/:id
 */
exports.updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { hours, attendance } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }

    const record = await prisma.LeaderboardStat.update({
      where: { id: parseInt(id) },
      data: {
        hours: hours ? parseFloat(hours) : undefined,
        attendance: attendance ? parseInt(attendance) : undefined,
      },
    });

    res.json({
      success: true,
      message: "Attendance updated successfully",
      data: record,
    });
  } catch (error) {
    console.error("Update attendance error:", error);
    next(error);
  }
};

/**
 * Delete attendance - DELETE /api/admin/attendance/:id
 */
exports.deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }

    await prisma.LeaderboardStat.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    console.error("Delete attendance error:", error);
    next(error);
  }
};