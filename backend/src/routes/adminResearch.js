const express = require("express");
const {
  getResearch,
  createResearch,
  updateResearch,
  deleteResearch,
  getJoinRequests,
  updateJoinRequest,
  deleteJoinRequest,
} = require("../controllers/adminResearchController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// All routes require admin authentication
router.use(adminAuthMiddleware);

// Research/Papers routes
router.get("/admin/research", getResearch);
router.post("/admin/research", createResearch);
router.put("/admin/research/:id", updateResearch);
router.delete("/admin/research/:id", deleteResearch);

// Join requests routes
router.get("/admin/join-requests", getJoinRequests);
router.put("/admin/join-requests/:id", updateJoinRequest);
router.delete("/admin/join-requests/:id", deleteJoinRequest);

module.exports = router;
