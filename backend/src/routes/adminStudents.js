const express = require("express");
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/adminStudentsController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// All routes require admin authentication
router.use(adminAuthMiddleware);

router.get("/api/admin/students", getStudents);
router.get("/api/admin/students/:enrollmentNo", getStudent);
router.post("/api/admin/students", createStudent);
router.put("/api/admin/students/:enrollmentNo", updateStudent);
router.delete("/api/admin/students/:enrollmentNo", deleteStudent);

module.exports = router;
