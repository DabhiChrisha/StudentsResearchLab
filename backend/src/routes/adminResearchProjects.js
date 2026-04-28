const express = require("express");
const {
  getResearchProjects,
  createResearchProject,
  updateResearchProject,
  deleteResearchProject,
} = require("../controllers/adminResearchProjectsController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET routes - allow both admin and members (view access)
router.get("/api/admin/research-projects", authenticatedUserMiddleware, getResearchProjects);

// POST/PUT/DELETE routes - require admin authentication only
router.post("/api/admin/research-projects", adminAuthMiddleware, createResearchProject);
router.put("/api/admin/research-projects/:id", adminAuthMiddleware, updateResearchProject);
router.delete("/api/admin/research-projects/:id", adminAuthMiddleware, deleteResearchProject);

module.exports = router;
