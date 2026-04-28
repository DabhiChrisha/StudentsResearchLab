const express = require("express");
const {
  getMemberCVByEnrollment,
  updateMemberCV,
  getAllMemberCVs,
} = require("../controllers/adminMemberCVController");
const { adminAuthMiddleware, authenticatedUserMiddleware } = require("../middleware/adminAuth");

const router = express.Router();

// GET routes allow both admin and members (view access)
router.get("/api/admin/member-cv", authenticatedUserMiddleware, getMemberCVByEnrollment);
router.get("/api/admin/member-cv/all", adminAuthMiddleware, getAllMemberCVs);

// PUT route - members can edit their own, admins can edit any
router.put("/api/admin/member-cv", authenticatedUserMiddleware, updateMemberCV);

module.exports = router;
