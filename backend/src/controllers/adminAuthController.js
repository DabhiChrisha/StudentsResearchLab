const prisma = require("../lib/prisma");
const { generateAdminToken } = require("../lib/adminUtils");

/**
 * Admin Login - POST /api/admin/login
<<<<<<< HEAD
 * Authenticates admin user from authorization table and returns JWT token
=======
 * Authenticates admin user using the `authorization` table.
 * Uses raw SQL because the table has no PK (@@ignore in Prisma schema).
>>>>>>> 2fa7a3745d33d09cc5e6af0c962a1b353dfeb748
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

<<<<<<< HEAD
    // Find user in authorization table by user_ID (email)
    const authUser = await prisma.authorization.findUnique({
      where: { user_ID: normalizedEmail },
=======
    // Query the authorization table using Prisma ORM
    const adminUser = await prisma.authorization.findFirst({
      where: {
        user_ID: {
          equals: normalizedEmail,
          mode: 'insensitive'
        }
      }
>>>>>>> 2fa7a3745d33d09cc5e6af0c962a1b353dfeb748
    });

    if (!authUser) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

<<<<<<< HEAD
    // Verify password
    const storedPassword = String(authUser.password || "").trim();
=======
    const storedPassword = String(adminUser.password || "").trim();
>>>>>>> 2fa7a3745d33d09cc5e6af0c962a1b353dfeb748

    if (!storedPassword || storedPassword !== passwordValue) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

<<<<<<< HEAD
    // Try to get additional info from students_details
    const studentInfo = await prisma.studentsDetail.findUnique({
      where: { email: normalizedEmail },
      select: { student_name: true, enrollment_no: true },
    });

    const adminName = studentInfo?.student_name || "Admin";
    const enrollmentNo = studentInfo?.enrollment_no || "";

=======
>>>>>>> 2fa7a3745d33d09cc5e6af0c962a1b353dfeb748
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
