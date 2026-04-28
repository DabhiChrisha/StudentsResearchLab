const express = require("express");
const {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/adminActivitiesController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET routes allow both admin and members (view access)
router.get("/api/admin/activities", authenticatedUserMiddleware, getActivities);

// POST/PUT/DELETE routes require admin authentication only
router.post("/api/admin/activities", adminAuthMiddleware, createActivity);
router.put("/api/admin/activities/:id", adminAuthMiddleware, updateActivity);
router.delete("/api/admin/activities/:id", adminAuthMiddleware, deleteActivity);

module.exports = router;
