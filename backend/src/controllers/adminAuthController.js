const prisma = require("../lib/prisma");
const { generateAdminToken } = require("../lib/adminUtils");

/**
 * Admin Login - POST /api/admin/login
 * Authenticates admin user using the `authorization` table.
 * Uses raw SQL because the table has no PK (@@ignore in Prisma schema).
 */
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Email and password are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const passwordValue = String(password).trim();

    // Query the authorization table directly via raw SQL
    const rows = await prisma.$queryRaw`
      SELECT user_ID, password
      FROM authorization
      WHERE LOWER(user_ID) = ${normalizedEmail}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    const storedPassword = String(rows[0].password || "").trim();

    if (!storedPassword || storedPassword !== passwordValue) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateAdminToken(normalizedEmail, "", "Admin");

    return res.json({
      success: true,
      token,
      user: {
        email: normalizedEmail,
        name: "Admin",
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    next(error);
  }
};

/**
 * Verify Admin Token - POST /api/admin/verify
 * Verifies JWT token validity
 */
exports.verifyAdminToken = async (req, res) => {
  try {
    // req.admin is set by middleware if token is valid
    return res.json({
      success: true,
      user: req.admin,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid token",
    });
  }
};
