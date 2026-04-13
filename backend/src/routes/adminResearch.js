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
router.get("/api/admin/research", getResearch);
router.post("/api/admin/research", createResearch);
router.put("/api/admin/research/:id", updateResearch);
router.delete("/api/admin/research/:id", deleteResearch);

// Join requests routes
router.get("/api/admin/join-requests", getJoinRequests);
router.put("/api/admin/join-requests/:id", updateJoinRequest);
router.delete("/api/admin/join-requests/:id", deleteJoinRequest);

module.exports = router;
