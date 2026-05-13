const express = require("express");
const multer = require("multer");
const { upload, uploadAny, uploadImage, uploadMedia, deleteImage } = require("../controllers/imageUploadController");
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

// Shared media upload — accepts images and videos, maps section to Cloudinary folder
router.post(
  "/api/admin/upload",
  adminAuthMiddleware,
  uploadAny.single("file"),
  uploadMedia
);

// Delete image route
router.post(
  "/admin/delete-image",
  adminAuthMiddleware,
  deleteImage
);

// Error handling middleware for multer - must be registered last
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large",
        message: "File exceeds the maximum allowed size for this endpoint",
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

module.exports = router;
