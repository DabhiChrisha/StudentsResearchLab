const express = require("express");
const { getCvByEnrollment, updateCv } = require("../controllers/adminCvController");
const { adminAuthMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// All routes require admin authentication
router.use(adminAuthMiddleware);

router.get("/admin/member-cv", getCvByEnrollment);
router.put("/admin/member-cv", updateCv);

module.exports = router;
