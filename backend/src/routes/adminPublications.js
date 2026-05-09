const express = require("express");
const {
  getPublications,
  getPublication,
  createPublication,
  updatePublication,
  deletePublication,
  approvePublication,
  rejectPublication,
} = require("../controllers/adminPublicationsController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET — allow both admin and authenticated members (read access)
router.get("/api/admin/publication",     authenticatedUserMiddleware, getPublications);
router.get("/api/admin/publication/:id", authenticatedUserMiddleware, getPublication);
// Backward-compatible aliases
router.get("/api/admin/publications",      authenticatedUserMiddleware, getPublications);
router.get("/api/admin/publications/:id",  authenticatedUserMiddleware, getPublication);

// Approval workflow — admin only
router.patch("/api/admin/publication/:id/approve", adminAuthMiddleware, approvePublication);
router.patch("/api/admin/publication/:id/reject",  adminAuthMiddleware, rejectPublication);
// Backward-compatible aliases
router.patch("/api/admin/publications/:id/approve", adminAuthMiddleware, approvePublication);
router.patch("/api/admin/publications/:id/reject",  adminAuthMiddleware, rejectPublication);

// POST / PUT / DELETE — admin only
router.post("/api/admin/publication",        adminAuthMiddleware, createPublication);
router.put("/api/admin/publication/:id",     adminAuthMiddleware, updatePublication);
router.delete("/api/admin/publication/:id",  adminAuthMiddleware, deletePublication);
// Backward-compatible aliases
router.post("/api/admin/publications",         adminAuthMiddleware, createPublication);
router.put("/api/admin/publications/:id",      adminAuthMiddleware, updatePublication);
router.delete("/api/admin/publications/:id",   adminAuthMiddleware, deletePublication);

module.exports = router;
