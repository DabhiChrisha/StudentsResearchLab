const express = require("express");
const {
  getScores,
  getScoresByStudent,
  createScore,
  updateScore,
  deleteScore,
  aggregateScores,
} = require("../controllers/adminScoresController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET routes allow both admin and members (view access)
router.get("/api/admin/scores", authenticatedUserMiddleware, getScores);
router.get("/api/admin/scores/:enrollmentNo", authenticatedUserMiddleware, getScoresByStudent);

// POST/PUT/DELETE routes require admin authentication only
router.post("/api/admin/scores", adminAuthMiddleware, createScore);
router.put("/api/admin/scores/:id", adminAuthMiddleware, updateScore);
router.delete("/api/admin/scores/:id", adminAuthMiddleware, deleteScore);

// Aggregate endpoint - POST /api/admin/scores/aggregate?month=MM&year=YYYY
router.post("/api/admin/scores/aggregate", adminAuthMiddleware, aggregateScores);

module.exports = router;
