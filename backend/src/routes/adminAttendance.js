const express = require("express");
const {
  getAttendance,
  getAttendanceByStudent,
  markAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/adminAttendanceController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// All routes require admin authentication
router.use(adminAuthMiddleware);

router.get("/admin/attendance", getAttendance);
router.get("/admin/attendance/student/:enrollmentNo", getAttendanceByStudent);
router.post("/admin/attendance", markAttendance);
router.put("/admin/attendance/:id", updateAttendance);
router.delete("/admin/attendance/:id", deleteAttendance);

module.exports = router;
