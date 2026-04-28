const express = require("express");
const { getScores } = require("../controllers/adminScoresController");
const { authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// User routes - allow all authenticated users to view scores
router.get("/api/user/scores", authenticatedUserMiddleware, getScores);

module.exports = router;
