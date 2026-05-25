const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

const { isExcludedStudent } = require("../lib/adminUtils");

// ── In-process cache disabled for leaderboard correctness ────────────────────
// Student and score edits must be reflected immediately in admin dashboards.
function getCachedLeaderboard(period) {
  return null;
}
function setCachedLeaderboard(period, students) {
  return;
}
function invalidateLeaderboardCache() {}
module.exports.invalidateLeaderboardCache = invalidateLeaderboardCache;

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

function parseJsonArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value || typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (_err) {
    return [];
  }
}

function normalizeStatus(value) {
  return String(value || "").trim().toLowerCase();
}

function countJsonArrayByStatus(value, targetStatuses) {
  const items = parseJsonArray(value);
  if (items.length === 0) return 0;

  const targets = targetStatuses.map(normalizeStatus).filter(Boolean);
  let matchedCount = 0;
  let sawExplicitStatus = false;

  items.forEach((item) => {
    let statusValue = "";

    if (item && typeof item === "object" && !Array.isArray(item)) {
      statusValue = normalizeStatus(
        item.status ||
        item.application_status ||
        item.publication_status ||
        item.category ||
        item.type ||
        item.state
      );
    } else if (typeof item === "string") {
      statusValue = normalizeStatus(item);
    }

    if (statusValue) {
      sawExplicitStatus = true;
    }

    if (statusValue && targets.some((target) => statusValue === target || statusValue.includes(target))) {
      matchedCount += 1;
    }
  });

  if (matchedCount > 0) return matchedCount;

  // Keep legacy counts for rows that do not store a status field yet.
  return sawExplicitStatus ? 0 : items.length;
}

function parseScoresMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}

async function buildWeeklyLeaderboard() {
  const now = new Date();
  const since = new Date(now);
  since.setDate(since.getDate() - 7);

  const [sessions, detailRows] = await Promise.all([
    prisma.session_attendee.findMany({
      where: {
        date: { gte: since },
      },
      include: {
        session_score: true,
      },
      orderBy: [
        { date: "desc" },
        { round: "asc" },
      ],
    }),
    prisma.studentsDetail.findMany({
      select: {
        enrollment_no: true,
        student_name: true,
        profile_image: true,
        department: true,
        semester: true,
        division: true,
        batch: true,
      },
    }),
  ]);

  const scoreMap = new Map();
  const attendanceMap = new Map();

  sessions.forEach((session) => {
    const sessionScores = parseScoresMap(session.session_score?.scores);
    const attendees = Array.isArray(session.attendees) ? session.attendees : [];

    attendees.forEach((enrollment) => {
      const key = String(enrollment || "").trim().toUpperCase();
      if (!key) return;
      attendanceMap.set(key, (attendanceMap.get(key) || 0) + 1);
    });

    Object.entries(sessionScores).forEach(([enrollmentNo, scoreValue]) => {
      const key = String(enrollmentNo || "").trim().toUpperCase();
      if (!key) return;
      const numericScore = Number(scoreValue);
      if (Number.isNaN(numericScore)) return;
      scoreMap.set(key, (scoreMap.get(key) || 0) + numericScore);
    });
  });

  const enrollmentsInScore = [...scoreMap.keys()];
  const detailMap = {};
  detailRows.forEach((r) => {
    const en = (r.enrollment_no || "").trim().toUpperCase();
    detailMap[en] = r;
  });

  const memberCvRows = enrollmentsInScore.length > 0
    ? await prisma.memberCvProfile.findMany({
        where: { enrollment_no: { in: enrollmentsInScore } },
        select: { enrollment_no: true, research_work: true, research_papers: true },
      })
    : [];

  const memberCvCountMap = {};
  memberCvRows.forEach((r) => {
    const en = (r.enrollment_no || "").trim().toUpperCase();
    memberCvCountMap[en] = {
      ongoing_research_count: countJsonArrayByStatus(r.research_work, ["ongoing"]),
      publication_count: countJsonArrayByStatus(r.research_papers, ["published"]),
    };
  });

  let students = enrollmentsInScore
    .filter((en) => Boolean(detailMap[en]))
    .filter((en) => {
      const detail = detailMap[en] || {};
      return !isExcludedStudent(detail.student_name, en);
    })
    .map((en) => {
      const detail = detailMap[en] || {};
      const memberCvCounts = memberCvCountMap[en] || { ongoing_research_count: 0, publication_count: 0 };
      const totalScore = Number(scoreMap.get(en) || 0);
      const totalAttendance = Number(attendanceMap.get(en) || 0);

      return {
        enrollment_no: en,
        name: detail.student_name || r.student_name || "Unknown",
        profile_image: detail.profile_image || null,
        image: detail.profile_image || null,
        total_score: totalScore,
        attendance_percentage: `${totalAttendance}%`,
        total_hours: "0 Hrs",
        dept: detail.department || "CE",
        semester: detail.semester || "6th",
        div: detail.division || "-",
        batch: detail.batch || "-",
        ongoing_research_count: memberCvCounts.ongoing_research_count,
        publication_count: memberCvCounts.publication_count,
        _score: totalScore,
        _hours: 0,
        _att: totalAttendance,
      };
    });

  students.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    if (b._att !== a._att) return b._att - a._att;
    return a.name.localeCompare(b.name);
  });

  students.forEach((s, i) => {
    s.rank = i + 1;
    delete s._score;
    delete s._hours;
    delete s._att;
  });

  return {
    leaderboard: students,
    period: "Last 7 Days",
    since: since.toISOString(),
    until: now.toISOString(),
  };
}

async function buildLeaderboard(period) {
  // Return cached result if still fresh
  const cached = getCachedLeaderboard(period);
  if (cached) return cached;

  // Fetch only the stats for this period first
  let statsRows = await prisma.leaderboardStat.findMany({
    where: { period },
    select: { serial_no: true, student_name: true, enrollment_no: true, attendance: true, hours: true, debate_score: true },
  });

  let effectiveRows = statsRows || [];

  if (effectiveRows.length === 0 && isAcademicYearPeriod(period)) {
    const [startYear] = String(period).split("-").map((part) => parseInt(part, 10));
    const months = academicYearPeriods(startYear);
    const monthlyRows = await prisma.leaderboardStat.findMany({
      where: { period: { in: months } },
      select: { serial_no: true, student_name: true, enrollment_no: true, attendance: true, hours: true, debate_score: true },
    });
    effectiveRows = groupRowsByStudent(monthlyRows);
  }

  // Only look up student details for the enrollments actually in the leaderboard
  // (avoids a full-table scan of students_details on every leaderboard request)
  const enrollmentsInStats = [...new Set(
    effectiveRows.map(r => (r.enrollment_no || "").trim().toUpperCase()).filter(Boolean)
  )];

  const detailRows = enrollmentsInStats.length > 0
    ? await prisma.studentsDetail.findMany({
        where: { enrollment_no: { in: enrollmentsInStats } },
        select: { enrollment_no: true, student_name: true, profile_image: true, department: true, semester: true, division: true, batch: true },
      })
    : [];

  const memberCvRows = enrollmentsInStats.length > 0
    ? await prisma.memberCvProfile.findMany({
        where: { enrollment_no: { in: enrollmentsInStats } },
        select: { enrollment_no: true, research_work: true, research_papers: true },
      })
    : [];

  const detailMap = {};
  detailRows.forEach((r) => {
    const en = (r.enrollment_no || "").trim().toUpperCase();
    detailMap[en] = r;
  });

  const memberCvCountMap = {};
  memberCvRows.forEach((r) => {
    const en = (r.enrollment_no || "").trim().toUpperCase();
    memberCvCountMap[en] = {
      ongoing_research_count: countJsonArrayByStatus(r.research_work, ["ongoing"]),
      publication_count: countJsonArrayByStatus(r.research_papers, ["published"]),
    };
  });

  // Compute max attendance for the period.
  // For academic-year periods, sum the per-month max values so the
  // attendance percentage is calculated the same way as monthly periods.
  let maxAtt;
  if (isAcademicYearPeriod(period)) {
    const [startYear] = String(period).split("-").map((p) => parseInt(p, 10));
    const months = academicYearPeriods(startYear);
    maxAtt = months.reduce((acc, m) => acc + (PERIOD_MAX_ATT[m] || 0), 0) || (PERIOD_MAX_ATT[period] || 1);
  } else {
    maxAtt = PERIOD_MAX_ATT[period] || 1;
  }

  let students = effectiveRows
    .filter((r) => {
      const en = (r.enrollment_no || "").trim().toUpperCase();
      const detail = detailMap[en] || {};
      return en && Boolean(detail);
    })
    .filter((r) => {
      const en = (r.enrollment_no || "").trim().toUpperCase();
      const detail = detailMap[en] || {};
      return !isExcludedStudent(detail.student_name || r.student_name, en);
    })
    .map((r) => {
      const en = (r.enrollment_no || "").trim().toUpperCase();
      const detail = detailMap[en] || {};
      const memberCvCounts = memberCvCountMap[en] || { ongoing_research_count: 0, publication_count: 0 };
      const attPct = maxAtt > 0 ? Math.round(((r.attendance || 0) / maxAtt) * 100) : 0;
      const hrs = parseFloat(r.hours || 0);

      return {
        enrollment_no: en,
        name: detail.student_name || r.student_name || "Unknown",
        profile_image: detail.profile_image || null,
        image: detail.profile_image || null, // backward-compat alias
        total_score: r.debate_score || 0,
        attendance_percentage: `${attPct}%`,
        total_hours: hrs > 0 ? `${hrs.toFixed(1)} Hrs` : "0 Hrs",
        dept: detail.department || "CE",
        semester: detail.semester || "6th",
        div: detail.division || "-",
        batch: detail.batch || "-",
        ongoing_research_count: memberCvCounts.ongoing_research_count,
        publication_count: memberCvCounts.publication_count,
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

  setCachedLeaderboard(period, students);
  return students;
}

router.get("/api/leaderboard", async (req, res, next) => {
  try {
    const result = await buildWeeklyLeaderboard();
    res.json(result);
  } catch (err) {
    console.error("GET /api/leaderboard error:", err);
    next(err);
  }
});

router.get("/api/leaderboard/weekly", async (req, res, next) => {
  try {
    const result = await buildWeeklyLeaderboard();
    res.json(result);
  } catch (err) {
    console.error("GET /api/leaderboard/weekly error:", err);
    next(err);
  }
});

router.get("/api/leaderboard/monthly", async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year  = parseInt(req.query.year)  || now.getFullYear();
    const period = monthYearToPeriod(month, year);
    const monthName = MONTH_FULL[month - 1];

    let students = await buildLeaderboard(period);

    if (students.length === 0) {
      const fallbackPeriod = "Apr 2026";
      students = await buildLeaderboard(fallbackPeriod);
      return res.json({ leaderboard: students, period: fallbackPeriod, month: 4, year: 2026, monthName: "April" });
    }

    res.json({ leaderboard: students, period, month, year, monthName });
  } catch (err) {
    next(err);
  }
});

router.get("/api/leaderboard/top-hours", async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year  = now.getFullYear();
    let period = monthYearToPeriod(month, year);
    let monthName = MONTH_FULL[month - 1];

    let students = await buildLeaderboard(period);

    if (students.length === 0) {
      period = "Apr 2026";
      monthName = "April";
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
