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

    console.log(`\n[🔐 AUTH] Login attempt for: ${normalizedEmail}`);

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
      console.log(`[❌ AUTH] User not found in authorization table: ${normalizedEmail}`);
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    console.log(`[✅ AUTH] User found in authorization table`);
    console.log(`[🔍 DB VALUES] Email: ${normalizedEmail}, is_admin: ${adminUser.is_admin}, Type: ${typeof adminUser.is_admin}`);

    // ============================================
    // STEP 2: Verify password from authorization table
    // ============================================
    const storedPassword = String(adminUser.password || "").trim();

    if (!storedPassword || storedPassword !== passwordValue) {
      console.log(`[❌ AUTH] Password verification failed for: ${normalizedEmail}`);
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    console.log(`[✅ AUTH] Password verified for: ${normalizedEmail}`);

    // ============================================
    // STEP 3: Check admin status from authorization table (is_admin field)
    // ============================================
    // IMPORTANT: is_admin status comes ONLY from authorization table
    // Explicitly check for true - null, undefined, false all mean NOT admin
    const isAdmin = adminUser.is_admin === true;
    
    const roleEmoji = isAdmin ? "👑 ADMIN" : "👤 USER";
    console.log(`[✅ AUTH] ${roleEmoji} | is_admin from authorization table: ${adminUser.is_admin} | Email: ${normalizedEmail}`);

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

    console.log(`[✅ AUTH] ${roleEmoji} login successful - Token generated\n`);

    return res.json({
      success: true,
      token,
      user: {
        email: normalizedEmail,
        name: name,
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
