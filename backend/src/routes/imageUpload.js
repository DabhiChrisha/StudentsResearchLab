const express = require("express");
const multer = require("multer");
const { upload, uploadImage, deleteImage } = require("../controllers/imageUploadController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// Health check endpoint (public - no auth required)
router.get("/api/health/upload-status", (req, res) => {
  res.json({
    success: true,
    message: "Image upload service is running",
    timestamp: new Date().toISOString(),
  });
});

// Upload image route with error handling
router.post(
  "/admin/upload-image",
  adminAuthMiddleware,
  upload.single("image"),
  uploadImage
);

// Error handling middleware for multer
router.post("/api/admin/upload-image", (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large",
        message: "File size must not exceed 10MB",
      });
    }
    return res.status(400).json({
      success: false,
      error: "Upload error",
      message: error.message,
    });
  } else if (error) {
    return res.status(400).json({
      success: false,
      error: "Invalid file",
      message: error.message || "File validation failed",
    });
  }
  next();
});

// Delete image route
router.post(
  "/admin/delete-image",
  adminAuthMiddleware,
  deleteImage
);

module.exports = router;
