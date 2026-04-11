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
router.get("/admin/achievements", getAchievements);

// POST /api/admin/achievements
router.post("/admin/achievements", createAchievement);

// PUT /api/admin/achievements/:id
router.put("/admin/achievements/:id", updateAchievement);

// DELETE /api/admin/achievements/:id
router.delete("/admin/achievements/:id", deleteAchievement);

module.exports = router;
