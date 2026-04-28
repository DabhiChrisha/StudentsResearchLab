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
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET routes allow both admin and members (view access)
router.get("/api/admin/research", authenticatedUserMiddleware, getResearch);
router.get("/api/admin/join-requests", authenticatedUserMiddleware, getJoinRequests);

// POST/PUT/DELETE routes require admin authentication only
router.post("/api/admin/research", adminAuthMiddleware, createResearch);
router.put("/api/admin/research/:id", adminAuthMiddleware, updateResearch);
router.delete("/api/admin/research/:id", adminAuthMiddleware, deleteResearch);

// Join request update/delete require admin authentication
router.put("/api/admin/join-requests/:id", adminAuthMiddleware, updateJoinRequest);
router.delete("/api/admin/join-requests/:id", adminAuthMiddleware, deleteJoinRequest);

module.exports = router;
