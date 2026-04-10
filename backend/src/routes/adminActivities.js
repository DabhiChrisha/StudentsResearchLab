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

router.get("/admin/activities", getActivities);
router.post("/admin/activities", createActivity);
router.put("/admin/activities/:id", updateActivity);
router.delete("/admin/activities/:id", deleteActivity);

module.exports = router;
