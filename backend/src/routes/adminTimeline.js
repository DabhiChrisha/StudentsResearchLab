const express = require("express");
const {
  getTimeline,
  createTimelineEntry,
  updateTimelineEntry,
  deleteTimelineEntry,
} = require("../controllers/adminTimelineController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET routes allow both admin and members (view access)
router.get("/api/admin/timeline", authenticatedUserMiddleware, getTimeline);

// POST/PUT/DELETE routes require admin authentication only
router.post("/api/admin/timeline", adminAuthMiddleware, createTimelineEntry);
router.put("/api/admin/timeline/:id", adminAuthMiddleware, updateTimelineEntry);
router.delete("/api/admin/timeline/:id", adminAuthMiddleware, deleteTimelineEntry);

module.exports = router;
