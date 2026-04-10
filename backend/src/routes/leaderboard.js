const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

const EXCLUDED_NAMES = new Set([
  "kandarp dipakkumar gajjar",
  "nancy rajesh patel",
]);

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

function monthYearToPeriod(month, year) {
  if (year === 2025 && (month === 11 || month === 12)) return "Dec 2025";
  return `${MONTH_ABB[month - 1]} ${year}`;
}

async function buildLeaderboard(period) {
  const [statsRows, detailRows] = await Promise.all([
    prisma.leaderboardStat.findMany({
      where: { period },
      select: { serial_no: true, student_name: true, enrollment_no: true, attendance: true, hours: true, debate_score: true },
    }),
    prisma.studentsDetail.findMany({
      select: { enrollment_no: true, profile_image: true, department: true, semester: true, division: true, batch: true },
    }),
  ]);

  const detailMap = {};
  detailRows.forEach((r) => {
    const en = (r.enrollment_no || "").trim().toUpperCase();
    detailMap[en] = r;
  });

  const maxAtt = PERIOD_MAX_ATT[period] || 1;

  let students = statsRows
    .filter((r) => !EXCLUDED_NAMES.has((r.student_name || "").trim().toLowerCase()))
    .map((r) => {
      const en = (r.enrollment_no || "").trim().toUpperCase();
      const detail = detailMap[en] || {};
      const attPct = maxAtt > 0 ? Math.round(((r.attendance || 0) / maxAtt) * 100) : 0;
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

router.get("/leaderboard", async (req, res, next) => {
  try {
    const students = await buildLeaderboard("All Time");
    res.json({ leaderboard: students });
  } catch (err) {
    next(err);
  }
});

router.get("/leaderboard/monthly", async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year  = parseInt(req.query.year)  || now.getFullYear();
    const period = monthYearToPeriod(month, year);
    const monthName = MONTH_FULL[month - 1];

    let students = await buildLeaderboard(period);

    if (students.length === 0) {
      const fallbackPeriod = "Mar 2026";
      students = await buildLeaderboard(fallbackPeriod);
      return res.json({ leaderboard: students, period: fallbackPeriod, month: 3, year: 2026, monthName: "March" });
    }

    res.json({ leaderboard: students, period, month, year, monthName });
  } catch (err) {
    next(err);
  }
});

router.get("/leaderboard/top-hours", async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year  = now.getFullYear();
    let period = monthYearToPeriod(month, year);
    let monthName = MONTH_FULL[month - 1];

    let students = await buildLeaderboard(period);

    if (students.length === 0) {
      period = "Mar 2026";
      monthName = "March";
      students = await buildLeaderboard(period);
    }

    students.sort((a, b) => {
      const hA = parseFloat((a.total_hours || "0").replace(" Hrs", "")) || 0;
      const hB = parseFloat((b.total_hours || "0").replace(" Hrs", "")) || 0;
      return hB - hA;
    });
    students.forEach((s, i) => { s.rank = i + 1; });

    res.json({ leaderboard: students, period, month, year, monthName });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
