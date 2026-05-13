const express = require("express");
const multer = require("multer");
const { uploadAny } = require("../controllers/imageUploadController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");
const {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
} = require("../controllers/adminSessionsController");

const router = express.Router();

// GET routes allow both admin and members (view access)
router.get("/api/admin/sessions", authenticatedUserMiddleware, getSessions);

// POST/PUT/DELETE routes require admin authentication only
// uploadAny accepts both images and videos (up to 100 MB) so session media uploads work correctly
router.post("/api/admin/sessions", adminAuthMiddleware, uploadAny.single("image"), createSession);
router.put("/api/admin/sessions/:id", adminAuthMiddleware, uploadAny.single("image"), updateSession);
router.delete("/api/admin/sessions/:id", adminAuthMiddleware, deleteSession);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large",
        message: "File size must not exceed 100MB",
      });
    }
    return res.status(400).json({
      success: false,
      error: "Upload error",
      message: error.message,
    });
  } else if (error && error.message && error.message.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      error: "Invalid file",
      message: error.message || "Only image or video files are allowed",
    });
  }
  next(error);
});

module.exports = router;
