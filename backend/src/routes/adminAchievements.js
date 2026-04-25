const express = require("express");
const { adminAuthMiddleware } = require("../middleware/adminAuth");
const {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require("../controllers/adminAchievementsController");

const router = express.Router();

// All routes require authentication
router.use(adminAuthMiddleware);

// GET /api/admin/achievements
router.get("/api/admin/achievements", getAchievements);

// POST /api/admin/achievements
router.post("/api/admin/achievements", createAchievement);

// PUT /api/admin/achievements/:id
router.put("/api/admin/achievements/:id", updateAchievement);

// DELETE /api/admin/achievements/:id
router.delete("/api/admin/achievements/:id", deleteAchievement);

module.exports = router;
