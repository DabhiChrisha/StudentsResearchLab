const express = require("express");
const {
  getAllAttendance,
  getAttendanceByStudentId,
  getAttendancePercentage,
  getSrlPercentage,
} = require("../controllers/attendanceController");

const router = express.Router();

router.get("/attendance", getAllAttendance);
router.get("/attendance/:student_id", getAttendanceByStudentId);
router.get("/attendance/:enrollment_no/percentage", getAttendancePercentage);
router.get("/attendance/:enrollment_no/srl_percentage", getSrlPercentage);

module.exports = router;
