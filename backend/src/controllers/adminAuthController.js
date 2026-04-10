const prisma = require("../lib/prisma");
const { generateAdminToken, isAdminEmail } = require("../lib/adminUtils");

/**
 * Admin Login - POST /api/admin/login
 * Authenticates admin user and returns JWT token
 */
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Email and password are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const passwordValue = String(password).trim();

    // Check if email is admin
    if (!isAdminEmail(normalizedEmail)) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    // Get admin user from students_details using Prisma
    const adminUser = await prisma.studentsDetail.findUnique({
      where: { email: normalizedEmail },
    });

    if (!adminUser) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    // Verify password from login_password field
    const storedPassword = String(adminUser.login_password || "").trim();

    if (!storedPassword || storedPassword !== passwordValue) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    const adminName = adminUser.student_name || "Admin";
    const enrollmentNo = adminUser.enrollment_no || "";

    // Generate JWT token
    const token = generateAdminToken(normalizedEmail, enrollmentNo, adminName);

    return res.json({
      success: true,
      token,
      user: {
        email: normalizedEmail,
        name: adminName,
        enrollmentNo,
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
