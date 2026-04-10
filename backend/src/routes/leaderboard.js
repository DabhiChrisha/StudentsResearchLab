const express = require("express");
const {
  getLeaderboard,
  getLeaderboardByPeriod,
  getLeaderboardStats,
} = require("../controllers/leaderboardController");

const router = express.Router();

const MONTH_FULL = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];

// GET /api/leaderboard — All Time
router.get("/leaderboard", getLeaderboard);

// GET /api/leaderboard/monthly?month=3&year=2026
router.get("/leaderboard/monthly", async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year  = parseInt(req.query.year)  || now.getFullYear();
    const monthName = MONTH_FULL[month - 1];

    // Build period based on month/year
    const MONTH_ABB = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let period;
    if (year === 2025 && (month === 11 || month === 12)) {
      period = "Dec 2025";
    } else {
      period = `${MONTH_ABB[month - 1]} ${year}`;
    }

    // Call the period-based endpoint
    req.params.period = period;
    return getLeaderboardByPeriod(req, res, next);
  } catch (err) {
    next(err);
  }
});

// GET /api/leaderboard/top-hours
router.get("/leaderboard/top-hours", async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year  = now.getFullYear();
    const monthName = MONTH_FULL[month - 1];

    // Just return current leaderboard
    const MONTH_ABB = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let period;
    if (year === 2025 && (month === 11 || month === 12)) {
      period = "Dec 2025";
    } else {
      period = `${MONTH_ABB[month - 1]} ${year}`;
    }

    req.params.period = period;
    return getLeaderboardByPeriod(req, res, next);
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance_debug — kept for compatibility, now returns empty
router.get("/attendance_debug", async (req, res) => {
  res.json([]);
});

module.exports = router;
