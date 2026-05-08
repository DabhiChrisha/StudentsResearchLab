const express = require("express");
const { createSymbol, upload } = require("../controllers/adminSymbolsController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// POST /api/admin/symbols — admin-only; multipart/form-data: publisher_name + logo file
router.post("/api/admin/symbols", adminAuthMiddleware, upload.single("logo"), createSymbol);

module.exports = router;
