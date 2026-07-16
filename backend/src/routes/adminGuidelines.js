const express = require("express");
const { getAllGuidelines, upsertGuideline, upload } = require("../controllers/adminGuidelinesController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET /api/admin/guidelines — admin-only; all years
router.get("/api/admin/guidelines", adminAuthMiddleware, getAllGuidelines);

// POST /api/admin/guidelines — admin-only; multipart/form-data: year + pdf file
router.post("/api/admin/guidelines", adminAuthMiddleware, upload.single("pdf"), upsertGuideline);

module.exports = router;
