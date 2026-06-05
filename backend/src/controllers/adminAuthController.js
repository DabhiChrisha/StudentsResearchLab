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

    // ============================================
    // STEP 1: Query authorization table for credentials
    // ============================================
    const adminUser = await prisma.authorization.findFirst({
      where: {
        user_ID: {
          equals: normalizedEmail,
          mode: 'insensitive'
        }
      }
    });

    if (!adminUser) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    // ============================================
    // STEP 2: Verify password from authorization table
    // ============================================
    const storedPassword = String(adminUser.password || "").trim();

    if (!storedPassword || storedPassword !== passwordValue) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    // ============================================
    // STEP 3: Check admin status from authorization table (is_admin field)
    // ============================================
    // IMPORTANT: is_admin status comes ONLY from authorization table
    // Explicitly check for true - null, undefined, false all mean NOT admin
    const isAdmin = adminUser.is_admin === true;

    // ============================================
    // STEP 4: Get user details from StudentsDetail table (name & enrollment only)
    // ============================================
    const studentDetail = await prisma.studentsDetail.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive'
        }
      }
    });

    const name = studentDetail?.student_name || "User";
    const enrollmentNo = studentDetail?.enrollment_no || "";

    // ============================================
    // STEP 5: Generate JWT token with admin status from authorization table
    // ============================================
    const token = generateAdminToken(normalizedEmail, enrollmentNo, name, isAdmin);


    return res.json({
      success: true,
      token,
      user: {
        email: normalizedEmail,
        name: name,
        enrollmentNo,
        enrollment_no: enrollmentNo,
        role: isAdmin ? "admin" : "member",
        is_admin: isAdmin,
      },
    });
  } catch (error) {
    console.error("[❌ AUTH] Admin login error:", error);
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
