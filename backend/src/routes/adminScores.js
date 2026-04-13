const express = require("express");
const {
  getScores,
  getScoresByStudent,
  createScore,
  updateScore,
  deleteScore,
} = require("../controllers/adminScoresController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// All routes require admin authentication
router.use(adminAuthMiddleware);

router.get("/api/admin/scores", getScores);
router.get("/api/admin/scores/:enrollmentNo", getScoresByStudent);
router.post("/api/admin/scores", createScore);
router.put("/api/admin/scores/:id", updateScore);
router.delete("/api/admin/scores/:id", deleteScore);

module.exports = router;
