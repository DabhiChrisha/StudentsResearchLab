const express = require("express");
const {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/adminActivitiesController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// All routes require admin authentication
router.use(adminAuthMiddleware);

router.get("/api/admin/activities", getActivities);
router.post("/api/admin/activities", createActivity);
router.put("/api/admin/activities/:id", updateActivity);
router.delete("/api/admin/activities/:id", deleteActivity);

module.exports = router;
