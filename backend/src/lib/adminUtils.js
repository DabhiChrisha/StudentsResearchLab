const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "admin-secret-key-change-in-production";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "adminsrl@gmail.com";

/**
 * Test users and admin data to exclude from public API responses
 */
const EXCLUDED_TEST_USERS = {
  names: [
    "kandarp dipakkumar gajjar",
    "nancy rajesh patel",
  ],
  emails: [
    // Add test email patterns if needed
  ],
  enrollmentNos: [
    // Add test enrollment numbers if needed
  ],
};

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

/**
 * Check if a user should be excluded (test user or admin)
 */
const shouldExcludeUser = (student) => {
  if (!student) return true;

  // Exclude admin users by member_type
  if (student.member_type === "admin") return true;

  // Exclude by is_admin flag
  if (student.is_admin === true) return true;

  // Exclude admin email
  if (isAdminEmail(student.email)) return true;

  // Exclude test users by name
  if (student.student_name) {
    const nameNormalized = (student.student_name || "").trim().toLowerCase();
    if (EXCLUDED_TEST_USERS.names.some(name => name.toLowerCase() === nameNormalized)) {
      return true;
    }
  }

  // Exclude test users by email
  if (student.email) {
    const emailNormalized = (student.email || "").trim().toLowerCase();
    if (EXCLUDED_TEST_USERS.emails.some(email => email.toLowerCase() === emailNormalized)) {
      return true;
    }
  }

  // Exclude test users by enrollment number
  if (student.enrollment_no) {
    const enrollNormalized = (student.enrollment_no || "").trim().toUpperCase();
    if (EXCLUDED_TEST_USERS.enrollmentNos.some(enroll => enroll.toUpperCase() === enrollNormalized)) {
      return true;
    }
  }

  return false;
};

/**
 * Filter out test and admin users from an array of students/users
 */
const filterOutTestAndAdminUsers = (users) => {
  if (!Array.isArray(users)) return [];
  return users.filter(user => !shouldExcludeUser(user));
};

/**
 * Check if a student name should be excluded (for leaderboard, etc.)
 */
const isExcludedStudent = (studentName) => {
  if (!studentName) return false;
  const nameNormalized = (studentName || "").trim().toLowerCase();
  return EXCLUDED_TEST_USERS.names.some(name => name.toLowerCase() === nameNormalized);
};

module.exports = {
  generateAdminToken,
  isAdminEmail,
  shouldExcludeUser,
  filterOutTestAndAdminUsers,
  isExcludedStudent,
  EXCLUDED_TEST_USERS,
  JWT_SECRET,
  ADMIN_EMAIL,
};
