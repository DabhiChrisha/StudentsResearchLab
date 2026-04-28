const express = require("express");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");
const {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require("../controllers/adminAchievementsController");

const router = express.Router();

// GET routes allow both admin and members (view access)
router.get("/api/admin/achievements", authenticatedUserMiddleware, getAchievements);

// POST/PUT/DELETE routes require admin authentication only
router.post("/api/admin/achievements", adminAuthMiddleware, createAchievement);
router.put("/api/admin/achievements/:id", adminAuthMiddleware, updateAchievement);
router.delete("/api/admin/achievements/:id", adminAuthMiddleware, deleteAchievement);

module.exports = router;
