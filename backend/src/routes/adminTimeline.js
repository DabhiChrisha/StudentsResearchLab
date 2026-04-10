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

router.get("/admin/timeline", getTimeline);
router.post("/admin/timeline", createTimelineEntry);
router.put("/admin/timeline/:id", updateTimelineEntry);
router.delete("/admin/timeline/:id", deleteTimelineEntry);

module.exports = router;
