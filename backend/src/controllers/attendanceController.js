const prisma = require('../lib/prisma');

// GET /api/attendance
exports.getAllAttendance = async (req, res, next) => {
  try {
    const attendanceRecords = await prisma.attendance.findMany();
    res.json(attendanceRecords);
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
    res.json(attendance);
  } catch (err) {
    next(err);
  }
};

// GET /api/attendance/:enrollment_no/percentage
exports.getAttendancePercentage = async (req, res, next) => {
  try {
    const { enrollment_no } = req.params;
    const attendance = await prisma.attendance.findMany({
      where: {
        enrollment_no: String(enrollment_no).toUpperCase(),
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
    res.json({ srl_percentage: 0.0 });
  } catch (err) {
    next(err);
  }
};
