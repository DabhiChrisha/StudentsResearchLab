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

router.get("/api/admin/attendance", getAttendance);
router.get("/api/admin/attendance/student/:enrollmentNo", getAttendanceByStudent);
router.post("/api/admin/attendance", markAttendance);
router.put("/api/admin/attendance/:id", updateAttendance);
router.delete("/api/admin/attendance/:id", deleteAttendance);

module.exports = router;
