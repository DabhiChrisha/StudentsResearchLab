const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "admin-secret-key-change-in-production";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "adminsrl@gmail.com";

/**
 * Generate JWT token for admin login
 */
const generateAdminToken = (email, enrollmentNo, name) => {
  const token = jwt.sign(
    {
      email,
      enrollmentNo,
      name,
      isAdmin: true,
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
  return token;
};

/**
 * Verify if email is admin
 */
const isAdminEmail = (email) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedAdmin = String(ADMIN_EMAIL).trim().toLowerCase();
  return normalizedEmail === normalizedAdmin;
};

module.exports = {
  generateAdminToken,
  isAdminEmail,
  JWT_SECRET,
  ADMIN_EMAIL,
};
