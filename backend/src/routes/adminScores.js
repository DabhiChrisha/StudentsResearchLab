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

router.get("/admin/scores", getScores);
router.get("/admin/scores/:enrollmentNo", getScoresByStudent);
router.post("/admin/scores", createScore);
router.put("/admin/scores/:id", updateScore);
router.delete("/admin/scores/:id", deleteScore);

module.exports = router;
