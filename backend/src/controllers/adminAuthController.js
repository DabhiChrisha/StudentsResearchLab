const prisma = require("../lib/prisma");
const { generateAdminToken } = require("../lib/adminUtils");
const bcrypt = require("bcryptjs");

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
      },
      select: {
        user_ID: true,
        password: true,
        is_admin: true,
      },
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
    const storedPassword = adminUser.password || "";

    if (!storedPassword) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(passwordValue, storedPassword);
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    // ============================================
    // STEP 3: Role determination — explicit two-branch lookup
    //
    //   is_admin = true  → check admin_users  → Admin Portal
    //   is_admin = false → check current_students → Member Portal
    //   is_admin = null  → no role assigned   → Unauthorized
    // ============================================
    if (adminUser.is_admin === null || adminUser.is_admin === undefined) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Account has no assigned role. Contact an administrator.",
      });
    }

    const isAdmin = adminUser.is_admin === true;

    // Fetch the student profile record (students_details acts as current_students)
    const studentDetail = await prisma.studentsDetail.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive'
        }
      }
    });

    if (isAdmin) {
      // ── ADMIN branch ──────────────────────────────────────────────────────
      // User exists in admin_users (authorization.is_admin = true).
      // Proceed to Admin Portal. students_details is used for name only.
    } else {
      // ── MEMBER branch ─────────────────────────────────────────────────────
      // User must exist in current_students (students_details) to access
      // the Member Portal. A credential record without a student profile
      // means the account was never properly provisioned → deny.
      if (!studentDetail) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Account is not associated with an active member profile.",
        });
      }
    }

    const name = studentDetail?.student_name || "User";
    const enrollmentNo = studentDetail?.enrollment_no || "";

    // ============================================
    // STEP 4: Generate JWT token carrying role for portal routing
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
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid token",
    });
  }
};
