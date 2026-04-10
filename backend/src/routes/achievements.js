const express = require("express");
const { getAchievements } = require("../controllers/achievementsController");

const router = express.Router();

// GET /api/achievements — full achievement content ordered newest first
router.get("/achievements", getAchievements);

module.exports = router;
