const prisma = require('../lib/prisma');

// ── Constants ─────────────────────────────────────────────────────────────

const EXCLUDED_NAMES = new Set([
  "kandarp dipakkumar gajjar",
  "nancy rajesh patel",
]);

// Max observed attendance per period (used to compute attendance_percentage)
const PERIOD_MAX_ATT = {
  "Dec 2025": 33,
  "Jan 2026": 12,
  "Feb 2026": 18,
  "Mar 2026": 16,
  "All Time": 74,
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

  const maxAtt = PERIOD_MAX_ATT[period] || 1;

  let students = (statsRows || [])
    .filter((r) => !EXCLUDED_NAMES.has((r.student_name || "").trim().toLowerCase()))
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
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const period = monthYearToPeriod(month, year);
    const students = await buildLeaderboard(period);

    res.json({
      period,
      timestamp: now.toISOString(),
      leaderboard: students,
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
    const periods = ["Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"];

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
