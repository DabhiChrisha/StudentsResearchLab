const express = require("express");
const {
  getTimeline,
  createTimelineEntry,
  updateTimelineEntry,
  deleteTimelineEntry,
} = require("../controllers/adminTimelineController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// All routes require admin authentication
router.use(adminAuthMiddleware);

router.get("/api/admin/timeline", getTimeline);
router.post("/api/admin/timeline", createTimelineEntry);
router.put("/api/admin/timeline/:id", updateTimelineEntry);
router.delete("/api/admin/timeline/:id", deleteTimelineEntry);

module.exports = router;
