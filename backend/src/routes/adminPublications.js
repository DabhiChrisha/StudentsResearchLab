const express = require("express");
const {
  getPublications,
  getPublication,
  createPublication,
  updatePublication,
  deletePublication,
} = require("../controllers/adminPublicationsController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET routes - allow both admin and members (view access)
router.get("/api/admin/publication", authenticatedUserMiddleware, getPublications);
router.get("/api/admin/publication/:id", authenticatedUserMiddleware, getPublication);
// Backward-compatible aliases
router.get("/api/admin/publications", authenticatedUserMiddleware, getPublications);
router.get("/api/admin/publications/:id", authenticatedUserMiddleware, getPublication);

// POST/PUT/DELETE routes - require admin authentication only
router.post("/api/admin/publication", adminAuthMiddleware, createPublication);
router.put("/api/admin/publication/:id", adminAuthMiddleware, updatePublication);
router.delete("/api/admin/publication/:id", adminAuthMiddleware, deletePublication);
// Backward-compatible aliases
router.post("/api/admin/publications", adminAuthMiddleware, createPublication);
router.put("/api/admin/publications/:id", adminAuthMiddleware, updatePublication);
router.delete("/api/admin/publications/:id", adminAuthMiddleware, deletePublication);

module.exports = router;
