const express = require("express");
const { adminLogin, verifyAdminToken } = require("../controllers/adminAuthController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// Public routes
router.post("/api/admin/login", adminLogin);

// Protected routes
router.post("/api/admin/verify", adminAuthMiddleware, verifyAdminToken);

module.exports = router;
