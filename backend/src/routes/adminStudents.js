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

router.get("/admin/students", getStudents);
router.get("/admin/students/:enrollmentNo", getStudent);
router.post("/admin/students", createStudent);
router.put("/admin/students/:enrollmentNo", updateStudent);
router.delete("/admin/students/:enrollmentNo", deleteStudent);

module.exports = router;
