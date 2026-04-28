const express = require("express");
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/adminStudentsController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET routes allow both admin and members (view access)
router.get("/api/admin/students", authenticatedUserMiddleware, getStudents);
router.get("/api/admin/students/:enrollmentNo", authenticatedUserMiddleware, getStudent);

// POST/PUT/DELETE routes require admin authentication only
router.post("/api/admin/students", adminAuthMiddleware, createStudent);
router.put("/api/admin/students/:enrollmentNo", adminAuthMiddleware, updateStudent);
router.delete("/api/admin/students/:enrollmentNo", adminAuthMiddleware, deleteStudent);

module.exports = router;
