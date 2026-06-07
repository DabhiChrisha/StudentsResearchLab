const express = require("express");
const { forgotPassword, verifyOtp, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/api/auth/forgot-password", forgotPassword);
router.post("/api/auth/verify-otp", verifyOtp);
router.post("/api/auth/reset-password", resetPassword);

module.exports = router;
