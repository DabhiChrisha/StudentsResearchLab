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
        name: detail.student_name || "Unknown",
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

// Aggregates session scores and attendance hours from date-wise records for a
// given calendar month. Uses session_attendee + session_score (for points) and
// the attendance table (for hours) — the same tables the admin portal writes to
// via XLSX upload and manual session entry.
async function buildMonthlyLeaderboard(month, year) {
  const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const startOfNextMonth = new Date(Date.UTC(year, month, 1));

  const [sessions, attendanceRows] = await Promise.all([
    prisma.session_attendee.findMany({
      where: { date: { gte: startOfMonth, lt: startOfNextMonth } },
      include: { session_score: true },
      orderBy: [{ date: "asc" }, { round: "asc" }],
    }),
    prisma.attendance.findMany({
      where: { date: { gte: startOfMonth, lt: startOfNextMonth }, present: true },
      select: { enrollment_no: true, hours_logged: true },
    }),
  ]);

  // Aggregate per-student scores from session_score.scores JSON
  const scoreMap = new Map();
  sessions.forEach((session) => {
    const sessionScores = parseScoresMap(session.session_score?.scores);
    Object.entries(sessionScores).forEach(([enrollmentNo, scoreValue]) => {
      const key = String(enrollmentNo || "").trim().toUpperCase();
      if (!key) return;
      const numericScore = Number(scoreValue);
      if (Number.isNaN(numericScore)) return;
      scoreMap.set(key, (scoreMap.get(key) || 0) + numericScore);
    });
  });

  // Aggregate per-student hours from attendance table
  const hoursMap = new Map();
  attendanceRows.forEach((row) => {
    const key = String(row.enrollment_no || "").trim().toUpperCase();
    if (!key) return;
    const hrs = parseFloat(String(row.hours_logged || 0));
    if (hrs > 0) hoursMap.set(key, (hoursMap.get(key) || 0) + hrs);
  });

  // Union of students who have scores OR hours so the Top Hours tab shows all
  // students who logged time even if they have no session score that month.
  const enrollmentsUnion = [...new Set([...scoreMap.keys(), ...hoursMap.keys()])];
  if (enrollmentsUnion.length === 0) return [];

  const [detailRows, memberCvRows] = await Promise.all([
    prisma.studentsDetail.findMany({
      where: { enrollment_no: { in: enrollmentsUnion } },
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
    prisma.memberCvProfile.findMany({
      where: { enrollment_no: { in: enrollmentsUnion } },
      select: { enrollment_no: true, research_work: true, research_papers: true },
    }),
  ]);

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

  let students = enrollmentsUnion
    .filter((en) => Boolean(detailMap[en]))
    .filter((en) => {
      const detail = detailMap[en] || {};
      return !isExcludedStudent(detail.student_name, en);
    })
    .map((en) => {
      const detail = detailMap[en] || {};
      const memberCvCounts = memberCvCountMap[en] || { ongoing_research_count: 0, publication_count: 0 };
      const totalScore = scoreMap.get(en) || 0;
      const hrs = hoursMap.get(en) || 0;

      return {
        enrollment_no: en,
        name: detail.student_name || "Unknown",
        profile_image: detail.profile_image || null,
        image: detail.profile_image || null,
        total_score: totalScore,
        attendance_percentage: "0%",
        total_hours: hrs > 0 ? `${hrs.toFixed(1)} Hrs` : "0 Hrs",
        dept: detail.department || "CE",
        semester: detail.semester || "6th",
        div: detail.division || "-",
        batch: detail.batch || "-",
        ongoing_research_count: memberCvCounts.ongoing_research_count,
        publication_count: memberCvCounts.publication_count,
        _score: totalScore,
        _hours: hrs,
        _att: 0,
      };
    });

  students.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    if (b._hours !== a._hours) return b._hours - a._hours;
    return a.name.localeCompare(b.name);
  });

  students.forEach((s, i) => {
    s.rank = i + 1;
    delete s._score;
    delete s._hours;
    delete s._att;
  });

  return students;
}

async function buildLeaderboard(period) {
  // Return cached result if still fresh
  const cached = getCachedLeaderboard(period);
  if (cached) return cached;

  // Build a list of candidate period strings to try.
  // leaderboard_stats rows may be stored as either "YYYY-MM" (e.g. "2025-12")
  // or "Mon YYYY" (e.g. "Dec 2025") depending on how the admin entered them.
  // We query with both forms so the lookup succeeds regardless of which was used.
  function alternatePeriodForms(p) {
    const isoMatch = String(p || "").trim().match(/^(\d{4})-(\d{2})$/);
    if (isoMatch) {
      // "2025-12" → also try "Dec 2025"
      const mon = parseInt(isoMatch[2], 10);
      if (mon >= 1 && mon <= 12) return [p, `${MONTH_ABB[mon - 1]} ${isoMatch[1]}`];
    }
    const parts = String(p || "").trim().split(/\s+/);
    if (parts.length === 2 && /^\d{4}$/.test(parts[1])) {
      const idx = MONTH_ABB.findIndex((m) => m.toLowerCase() === parts[0].substring(0, 3).toLowerCase());
      if (idx !== -1) return [p, `${parts[1]}-${String(idx + 1).padStart(2, "0")}`];
    }
    return [p];
  }

  const periodCandidates = alternatePeriodForms(period);

  // Fetch only the stats for this period first
  let statsRows = await prisma.leaderboardStat.findMany({
    where: { period: { in: periodCandidates } },
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

// GET /api/leaderboard/periods — returns all distinct "Mon YYYY" strings from
// BOTH data sources, sorted chronologically oldest → newest:
//   1. session_attendee.date  — date-wise session records (new path)
//   2. leaderboard_stats.period — period-string records (legacy path)
// This ensures months entered via either workflow appear in the dropdown.
router.get("/api/leaderboard/periods", async (req, res, next) => {
  try {
    const [sessions, statRows] = await Promise.all([
      prisma.session_attendee.findMany({
        select: { date: true },
        distinct: ["date"],
        orderBy: { date: "asc" },
      }),
      prisma.leaderboardStat.findMany({
        select: { period: true },
        distinct: ["period"],
      }),
    ]);

    const seen = new Set();

    // Source 1: extract year-month from actual session dates
    sessions.forEach((s) => {
      const d = new Date(s.date);
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth(); // 0-indexed
      const key = `${year}-${String(month + 1).padStart(2, "0")}`;
      seen.add(key);
    });

    // Source 2: parse leaderboard_stats period strings.
    // Two formats exist depending on how the admin entered the data:
    //   "YYYY-MM"   e.g. "2025-12", "2026-04"  (written by createScore via date)
    //   "Mon YYYY"  e.g. "Dec 2025", "Apr 2026" (written by older imports)
    statRows.forEach((r) => {
      const raw = String(r.period || "").trim();

      // Format 1: "YYYY-MM"
      const isoMatch = raw.match(/^(\d{4})-(\d{2})$/);
      if (isoMatch) {
        const year = isoMatch[1];
        const mon  = isoMatch[2]; // already zero-padded
        seen.add(`${year}-${mon}`);
        return;
      }

      // Format 2: "Mon YYYY" / "Month YYYY"
      const parts = raw.split(/\s+/);
      if (parts.length !== 2) return;
      if (!/^\d{4}$/.test(parts[1])) return;
      const prefix = parts[0].substring(0, 3);
      const idx = MONTH_ABB.findIndex((m) => m.toLowerCase() === prefix.toLowerCase());
      if (idx === -1) return;
      seen.add(`${parts[1]}-${String(idx + 1).padStart(2, "0")}`);
    });

    // Sort chronologically and convert keys to "Mon YYYY" labels
    const periods = Array.from(seen)
      .sort()
      .map((key) => {
        const [year, mon] = key.split("-");
        return `${MONTH_ABB[parseInt(mon, 10) - 1]} ${year}`;
      });

    res.json({ periods });
  } catch (err) {
    next(err);
  }
});

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
    const month = parseInt(req.query.month, 10) || (now.getUTCMonth() + 1);
    const year  = parseInt(req.query.year, 10)  || now.getUTCFullYear();
    const period = monthYearToPeriod(month, year);
    const monthName = MONTH_FULL[month - 1];

    // Primary: aggregate from date-wise session records
    let students = await buildMonthlyLeaderboard(month, year);

    // Fallback: if no session data exists for this month, serve legacy leaderboard_stats
    if (students.length === 0) {
      students = await buildLeaderboard(period);
    }

    res.json({ leaderboard: students, period, month, year, monthName });
  } catch (err) {
    next(err);
  }
});

router.get("/api/leaderboard/top-hours", async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month, 10) || (now.getUTCMonth() + 1);
    const year  = parseInt(req.query.year, 10)  || now.getUTCFullYear();
    const period = monthYearToPeriod(month, year);
    const monthName = MONTH_FULL[month - 1];

    // Primary: aggregate from date-wise session records
    let students = await buildMonthlyLeaderboard(month, year);

    // Fallback: if no session data exists for this month, serve legacy leaderboard_stats
    if (students.length === 0) {
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
