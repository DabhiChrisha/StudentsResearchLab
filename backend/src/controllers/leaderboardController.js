const prisma = require('../lib/prisma');
const { isExcludedStudent } = require('../lib/adminUtils');

// ── Constants ─────────────────────────────────────────────────────────────

// Max observed attendance per period (used to compute attendance_percentage)
const PERIOD_MAX_ATT = {
  "Dec 2025": 33,
  "Jan 2026": 12,
  "Feb 2026": 18,
  "Mar 2026": 16,
  "Apr 2026": 5,
  "All Time": 100,
  "2026-2027": 100,
  "2025-2026": 100,
};

const MONTH_ABB = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MONTH_FULL = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];

// ── Helpers ───────────────────────────────────────────────────────────────

function monthYearToPeriod(month, year) {
  if (year === 2025 && (month === 11 || month === 12)) return "Dec 2025";
  return `${MONTH_ABB[month - 1]} ${year}`;
}

function academicYearStartForDate(date) {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return month >= 5 ? year : year - 1;
}

function academicYearPeriods(startYear) {
  return [
    `May ${startYear}`,
    `Jun ${startYear}`,
    `Jul ${startYear}`,
    `Aug ${startYear}`,
    `Sep ${startYear}`,
    `Oct ${startYear}`,
    `Nov ${startYear}`,
    `Dec ${startYear}`,
    `Jan ${startYear + 1}`,
    `Feb ${startYear + 1}`,
    `Mar ${startYear + 1}`,
    `Apr ${startYear + 1}`,
  ];
}

function isAcademicYearPeriod(period) {
  return /^\d{4}-\d{4}$/.test(String(period || "").trim());
}

function groupRowsByStudent(rows) {
  const grouped = new Map();

  rows.forEach((row) => {
    const enrollmentNo = String(row.enrollment_no || "").trim().toUpperCase();
    const key = enrollmentNo || String(row.student_name || "").trim().toLowerCase();
    const score = Number(row.debate_score || 0);
    const attendance = Number(row.attendance || 0);
    const hours = Number(row.hours || 0);

    if (!grouped.has(key)) {
      grouped.set(key, {
        ...row,
        enrollment_no: enrollmentNo,
        debate_score: score,
        attendance,
        hours,
      });
      return;
    }

    const existing = grouped.get(key);
    existing.debate_score = Number(existing.debate_score || 0) + score;
    existing.attendance = Number(existing.attendance || 0) + attendance;
    existing.hours = Number(existing.hours || 0) + hours;
  });

  return Array.from(grouped.values());
}

async function buildLeaderboard(period) {
  const [statsRows, detailRows] = await Promise.all([
    prisma.leaderboardStat.findMany({
      where: {
        period: period,
      },
      select: {
        serial_no: true,
        student_name: true,
        enrollment_no: true,
        attendance: true,
        hours: true,
        debate_score: true,
      },
    }),
    prisma.studentsDetail.findMany({
      select: {
        enrollment_no: true,
        profile_image: true,
        department: true,
        semester: true,
        division: true,
        batch: true,
      },
    }),
  ]);

  const detailMap = {};
  detailRows.forEach((r) => {
    const en = (r.enrollment_no || "").trim().toUpperCase();
    detailMap[en] = r;
  });

  let effectiveRows = statsRows || [];

  if (effectiveRows.length === 0 && isAcademicYearPeriod(period)) {
    const [startYear] = String(period).split("-").map((part) => parseInt(part, 10));
    const months = academicYearPeriods(startYear);
    const monthlyRows = await prisma.leaderboardStat.findMany({
      where: {
        period: { in: months },
      },
      select: {
        serial_no: true,
        student_name: true,
        enrollment_no: true,
        attendance: true,
        hours: true,
        debate_score: true,
      },
    });
    effectiveRows = groupRowsByStudent(monthlyRows);
  }

  const maxAtt = PERIOD_MAX_ATT[period] || 1;

  let students = (effectiveRows || [])
    .filter((r) => !isExcludedStudent(r.student_name, r.enrollment_no))
    .map((r) => {
      const en = (r.enrollment_no || "").trim().toUpperCase();
      const detail = detailMap[en] || {};
      const attPct = maxAtt > 0 ? Math.round((r.attendance / maxAtt) * 100) : 0;
      const hrs = parseFloat(r.hours || 0);

      return {
        enrollment_no: en,
        name: r.student_name || "Unknown",
        image: detail.profile_image || null,
        total_score: r.debate_score || 0,
        attendance_percentage: `${attPct}%`,
        total_hours: hrs > 0 ? `${hrs.toFixed(1)} Hrs` : "0 Hrs",
        dept: detail.department || "CE",
        semester: detail.semester || "6th",
        div: detail.division || "-",
        batch: detail.batch || "-",
        // private sort keys
        _score: r.debate_score || 0,
        _hours: hrs,
        _att: r.attendance || 0,
      };
    });

  students.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    if (b._hours !== a._hours) return b._hours - a._hours;
    return b._att - a._att;
  });

  return students.map(s => {
    const { _score, _hours, _att, ...rest } = s;
    return rest;
  });
}

// GET /api/leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const now = new Date();
    const academicYearStart = academicYearStartForDate(now);
    const academicYearPeriod = `${academicYearStart}-${academicYearStart + 1}`;
    const previousAcademicYearPeriod = `${academicYearStart - 1}-${academicYearStart}`;

    // Try to get academic year data; fallback to previous academic year if not found
    let students = await buildLeaderboard(academicYearPeriod);
    let period = academicYearPeriod;
    
    if (!students || students.length === 0) {
      students = await buildLeaderboard(previousAcademicYearPeriod);
      period = previousAcademicYearPeriod;
    }

    res.json({
      period,
      timestamp: now.toISOString(),
      leaderboard: students || [],
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/leaderboard/:period
exports.getLeaderboardByPeriod = async (req, res, next) => {
  try {
    const { period } = req.params;
    const students = await buildLeaderboard(period);

    res.json({
      period,
      leaderboard: students,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/leaderboard-stats
exports.getLeaderboardStats = async (req, res, next) => {
  try {
    const periods = ["Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026"];

    const stats = {};
    for (const period of periods) {
      try {
        stats[period] = await buildLeaderboard(period);
      } catch (e) {
        stats[period] = [];
      }
    }

    res.json(stats);
  } catch (err) {
    next(err);
  }
};
