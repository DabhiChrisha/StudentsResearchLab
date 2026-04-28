const express = require("express");
const {
  getAttendance,
  getAttendanceByStudent,
  markAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/adminAttendanceController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET routes allow both admin and members (view access)
router.get("/api/admin/attendance", authenticatedUserMiddleware, getAttendance);
router.get("/api/admin/attendance/student/:enrollmentNo", authenticatedUserMiddleware, getAttendanceByStudent);

// POST/PUT/DELETE routes require admin authentication only
router.post("/api/admin/attendance", adminAuthMiddleware, markAttendance);
router.put("/api/admin/attendance/:id", adminAuthMiddleware, updateAttendance);
router.delete("/api/admin/attendance/:id", adminAuthMiddleware, deleteAttendance);

module.exports = router;
