const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendOtpEmail, isValidEmail } = require("../services/emailService");

const SALT_ROUNDS = 12;
const OTP_EXPIRY_MINUTES = 10;

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid input", message: "A valid email is required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check authorization table — respond generically regardless of result
    const authUser = await prisma.authorization.findFirst({
      where: { user_ID: { equals: normalizedEmail, mode: "insensitive" } },
      select: { user_ID: true },
    });

    if (!authUser) {
      // Generic response — do not reveal whether email exists
      return res.json({ success: true, message: "If this email is registered, an OTP has been sent." });
    }

    // Look up student name for email personalisation
    const student = await prisma.studentsDetail.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
      select: { student_name: true },
    });
    const studentName = student?.student_name || "User";

    // Generate 6-digit OTP — never log this value
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Delete any existing OTP rows for this email (cleanup old requests)
    await prisma.password_reset_otps.deleteMany({ where: { email: normalizedEmail } });

    // Insert new OTP row
    await prisma.password_reset_otps.create({
      data: { email: normalizedEmail, otp_hash: otpHash, expires_at: expiresAt, used: false },
    });

    // Send OTP email — fire and let errors propagate to global handler
    await sendOtpEmail({ to: normalizedEmail, studentName, otp });

    return res.json({ success: true, message: "If this email is registered, an OTP has been sent." });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Invalid input", message: "Email and OTP are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const enteredOtp = String(otp).trim();

    // Find most recent unused, unexpired OTP for this email
    const otpRow = await prisma.password_reset_otps.findFirst({
      where: {
        email: normalizedEmail,
        used: false,
        expires_at: { gte: new Date() },
      },
      orderBy: { created_at: "desc" },
    });

    if (!otpRow) {
      return res.status(400).json({ error: "Invalid request", message: "Invalid or expired OTP." });
    }

    const match = await bcrypt.compare(enteredOtp, otpRow.otp_hash);
    if (!match) {
      return res.status(400).json({ error: "Invalid request", message: "Invalid or expired OTP." });
    }

    // Mark OTP as used — kept in DB so reset-password can re-verify
    await prisma.password_reset_otps.update({
      where: { id: otpRow.id },
      data: { used: true },
    });

    return res.json({ success: true, message: "OTP verified." });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Invalid input", message: "Email, OTP, and new password are required." });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: "Invalid input", message: "Password must be at least 6 characters." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const enteredOtp = String(otp).trim();

    // Find the verified (used=true) unexpired OTP — proves verify-otp was called first
    const otpRow = await prisma.password_reset_otps.findFirst({
      where: {
        email: normalizedEmail,
        used: true,
        expires_at: { gte: new Date() },
      },
      orderBy: { created_at: "desc" },
    });

    if (!otpRow) {
      return res.status(400).json({ error: "Invalid request", message: "OTP verification required before resetting password." });
    }

    // Re-verify OTP hash to prevent token reuse across sessions
    const match = await bcrypt.compare(enteredOtp, otpRow.otp_hash);
    if (!match) {
      return res.status(400).json({ error: "Invalid request", message: "Invalid request." });
    }

    // Hash the new password — never store plaintext
    const newHash = await bcrypt.hash(String(newPassword), SALT_ROUNDS);

    // Update authorization table
    await prisma.authorization.updateMany({
      where: { user_ID: normalizedEmail },
      data: { password: newHash },
    });

    // Clean up OTP row
    await prisma.password_reset_otps.delete({ where: { id: otpRow.id } });

    return res.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
};
