const express = require("express");
const multer = require("multer");
const { upload } = require("../controllers/imageUploadController");
const {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/adminActivitiesController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET routes allow both admin and members (view access)
router.get("/api/admin/activities", authenticatedUserMiddleware, getActivities);

// POST/PUT/DELETE routes require admin authentication only
router.post("/api/admin/activities", adminAuthMiddleware, upload.single("photo"), createActivity);
router.put("/api/admin/activities/:id", adminAuthMiddleware, upload.single("photo"), updateActivity);
router.delete("/api/admin/activities/:id", adminAuthMiddleware, deleteActivity);

// Error handling middleware for multer
router.use((error, req, res, next) => {
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
  } else if (error && error.message && error.message.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      error: "Invalid file",
      message: error.message || "Only image files are allowed",
    });
  }
  next(error);
});

module.exports = router;


