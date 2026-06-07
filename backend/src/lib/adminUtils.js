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
    "kandarp gajjar",
    "nancy patel",
  ],
  emails: [],
  enrollmentNos: [
    "22BECE30091",
    "22BEIT30123",
  ],
};

/**
 * Generate JWT token for admin login
 * @param {string} email - User email
 * @param {string} enrollmentNo - Enrollment number
 * @param {string} name - User name
 * @param {boolean} isAdmin - Whether user is admin (from is_admin field)
 */
const generateAdminToken = (email, enrollmentNo, name, isAdmin = false) => {
  const token = jwt.sign(
    {
      email,
      enrollmentNo,
      name,
      isAdmin: isAdmin === true,
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
const isExcludedStudent = (studentName, enrollmentNo) => {
  if (enrollmentNo) {
    const enrollNormalized = enrollmentNo.trim().toUpperCase();
    if (EXCLUDED_TEST_USERS.enrollmentNos.some(en => en.toUpperCase() === enrollNormalized)) {
      return true;
    }
  }
  if (!studentName) return false;
  const nameNormalized = studentName.trim().toLowerCase();
  return EXCLUDED_TEST_USERS.names.some(name => name.toLowerCase() === nameNormalized);
};

// Used only by /api/researchers — excludes true admins but allows Research Assistants through.
const shouldExcludeFromResearchers = (student) => {
  if (!student) return true;
  if (student.member_type === "admin") return true;
  if (student.is_admin === true) return true;
  if (isAdminEmail(student.email)) return true;
  return false;
};

/**
 * Get academic year format (e.g., "2026-2027") for a given month/year
 * Academic year starts in May (month 5) and ends in April (month 4)
 */
const getMonthAcademicYear = (month, year) => {
  const monthNum = typeof month === 'string' ? parseInt(month, 10) : month;
  if (monthNum >= 5) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

/**
 * Get all months and years within an academic year range
 * Academic year: May of startYear to April of (startYear + 1)
 */
const getAllMonthsInAcademicYear = (startYear) => {
  const months = [];
  const monthNames = ["May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  const monthNumbers = [5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4];
  const years = [startYear, startYear, startYear, startYear, startYear, startYear, startYear, startYear, startYear + 1, startYear + 1, startYear + 1, startYear + 1];
  
  for (let i = 0; i < monthNames.length; i++) {
    months.push({ month: monthNames[i], number: monthNumbers[i], year: years[i] });
  }
  return months;
};

/**
 * Aggregate debate scores to leaderboard_stats for an academic year
 * Creates/updates leaderboard_stats entries with academic year format (e.g., "2026-2027")
 * Also creates missing rows for students who don't have entries for current month
 * Supports negative scores (subtraction)
 */
const aggregateDebateScoresToLeaderboard = async (prisma, triggerMonth, triggerYear) => {
  try {
    const academicYearFormat = getMonthAcademicYear(triggerMonth, triggerYear);
    const academicYearStart = parseInt(academicYearFormat.split('-')[0], 10);
    const monthsInYear = getAllMonthsInAcademicYear(academicYearStart);
    
    // Format current month for monthly leaderboard entry
    const monthLabel = new Date(triggerYear, triggerMonth - 1, 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    // Get all students
    const allStudents = await prisma.studentsDetail.findMany({
      select: {
        id: true,
        enrollment_no: true,
        student_name: true,
        email: true,
        member_type: true,
        is_admin: true,
      },
    });

    // Get max serial_no
    const maxSerialResult = await prisma.leaderboardStat.aggregate({
      _max: { serial_no: true },
    });
    let currentSerialNo = (maxSerialResult._max.serial_no || 0) + 1;

    const results = [];

    for (const student of allStudents) {
      // Calculate total debate score for all months in this academic year
      let totalDebateScore = 0;
      
      for (const monthData of monthsInYear) {
        const debateScore = await prisma.debateScore.findFirst({
          where: {
            enrollment_no: student.enrollment_no,
            month: String(monthData.number).padStart(2, '0'),
            year: monthData.year,
          },
        });
        
        if (debateScore && debateScore.points !== null) {
          totalDebateScore += debateScore.points; // Supports negative scores
        }
      }

      // ===== 1. Create/Update academic year entry =====
      const existingAcadYearEntry = await prisma.leaderboardStat.findFirst({
        where: {
          enrollment_no: student.enrollment_no,
          period: academicYearFormat,
        },
      });

      if (existingAcadYearEntry) {
        // Update existing entry
        await prisma.leaderboardStat.update({
          where: { id: existingAcadYearEntry.id },
          data: {
            student_name: student.student_name,
            debate_score: totalDebateScore,
          },
        });
      } else {
        // Create new entry
        await prisma.leaderboardStat.create({
          data: {
            serial_no: currentSerialNo++,
            enrollment_no: student.enrollment_no,
            student_name: student.student_name,
            period: academicYearFormat,
            debate_score: totalDebateScore,
            attendance: 0,
            hours: 0,
          },
        });
      }

      // ===== 2. Create/Update current month entry if missing =====
      const currentMonthScore = await prisma.debateScore.findFirst({
        where: {
          enrollment_no: student.enrollment_no,
          month: String(triggerMonth).padStart(2, '0'),
          year: triggerYear,
        },
      });

      const existingMonthEntry = await prisma.leaderboardStat.findFirst({
        where: {
          enrollment_no: student.enrollment_no,
          period: monthLabel,
        },
      });

      if (existingMonthEntry && currentMonthScore) {
        // Update existing month entry with current score
        await prisma.leaderboardStat.update({
          where: { id: existingMonthEntry.id },
          data: {
            student_name: student.student_name,
            debate_score: currentMonthScore.points || 0,
          },
        });
      } else if (!existingMonthEntry) {
        // Create new month entry (even if no score, create with 0)
        await prisma.leaderboardStat.create({
          data: {
            serial_no: currentSerialNo++,
            enrollment_no: student.enrollment_no,
            student_name: student.student_name,
            period: monthLabel,
            debate_score: currentMonthScore?.points || 0,
            attendance: 0,
            hours: 0,
          },
        });
      }
      
      results.push({
        enrollment_no: student.enrollment_no,
        student_name: student.student_name,
        totalDebateScore,
        currentMonthScore: currentMonthScore?.points || 0,
        academicYearFormat,
        monthLabel,
      });
    }

    return {
      success: true,
      academicYearFormat,
      monthLabel,
      updatedCount: results.length,
      results,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateAdminToken,
  isAdminEmail,
  shouldExcludeUser,
  shouldExcludeFromResearchers,
  filterOutTestAndAdminUsers,
  isExcludedStudent,
  getMonthAcademicYear,
  getAllMonthsInAcademicYear,
  aggregateDebateScoresToLeaderboard,
  EXCLUDED_TEST_USERS,
  JWT_SECRET,
  ADMIN_EMAIL,
};
