const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

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

/**
 * Maps a month (1-12) + year to the period key stored in leaderboard_stats.
 * Nov and Dec 2025 are combined into one period.
 * Falls back to the latest available period if the requested one has no data.
 */
function monthYearToPeriod(month, year) {
  if (year === 2025 && (month === 11 || month === 12)) return "Dec 2025";
  return `${MONTH_ABB[month - 1]} ${year}`;
}

/**
 * Fetch all rows for a given period from leaderboard_stats,
 * merge with students_details for profile info, and return
 * a formatted array sorted by (debate_score desc, hours desc, attendance desc).
 */
async function buildLeaderboard(period) {
  const [statsRes, detailsRes] = await Promise.all([
    supabase
      .from("leaderboard_stats")
      .select("serial_no, student_name, enrollment_no, attendance, hours, debate_score")
      .eq("period", period),
    supabase
      .from("students_details")
      .select("enrollment_no, profile_image, department, semester, division, batch"),
  ]);

  if (statsRes.error) {
    console.error("❌ leaderboard_stats query error:", statsRes.error);
    throw statsRes.error;
  }
  // details failure is non-fatal — just use empty map
  const detailRows = detailsRes.data || [];

  const detailMap = {};
  detailRows.forEach((r) => {
    const en = (r.enrollment_no || "").trim().toUpperCase();
    detailMap[en] = r;
  });

  const maxAtt = PERIOD_MAX_ATT[period] || 1;

  let students = (statsRes.data || [])
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

  students.forEach((s, i) => {
    s.rank = i + 1;
    delete s._score;
    delete s._hours;
    delete s._att;
  });

  return students;
}

// ── Routes ────────────────────────────────────────────────────────────────

// GET /api/leaderboard — All Time
router.get("/leaderboard", async (req, res, next) => {
  try {
    const students = await buildLeaderboard("All Time");
    res.json({ leaderboard: students });
  } catch (err) {
    next(err);
  }
});

// GET /api/leaderboard/monthly?month=3&year=2026
// Defaults to current month; falls back to latest period if no data.
router.get("/leaderboard/monthly", async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year  = parseInt(req.query.year)  || now.getFullYear();
    const period = monthYearToPeriod(month, year);
    const monthName = MONTH_FULL[month - 1];

    let students = await buildLeaderboard(period);

    // If no data for requested period, fall back to latest available
    if (students.length === 0) {
      const fallbackPeriod = "Mar 2026";
      students = await buildLeaderboard(fallbackPeriod);
      return res.json({
        leaderboard: students,
        period: fallbackPeriod,
        month: 3,
        year: 2026,
        monthName: "March",
      });
    }

    res.json({ leaderboard: students, period, month, year, monthName });
  } catch (err) {
    next(err);
  }
});

// GET /api/leaderboard/top-hours — top contributors by hours (current/latest month)
router.get("/leaderboard/top-hours", async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year  = now.getFullYear();
    let period = monthYearToPeriod(month, year);
    let monthName = MONTH_FULL[month - 1];

    let students = await buildLeaderboard(period);

    // Fall back to latest period with data
    if (students.length === 0) {
      period = "Mar 2026";
      monthName = "March";
      students = await buildLeaderboard(period);
    }

    // Re-sort by hours desc for this endpoint
    students.sort((a, b) => {
      const hA = parseFloat((a.total_hours || "0").replace(" Hrs", "")) || 0;
      const hB = parseFloat((b.total_hours || "0").replace(" Hrs", "")) || 0;
      return hB - hA;
    });
    students.forEach((s, i) => { s.rank = i + 1; });

    res.json({
      leaderboard: students,
      period,
      month,
      year,
      monthName,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance_debug — kept for compatibility, now returns empty
router.get("/attendance_debug", async (req, res) => {
  res.json([]);
});

module.exports = router;
