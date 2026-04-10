const express = require("express");
const { getSessions, getSrlSessions } = require("../controllers/sessionsController");

const router = express.Router();

// GET /api/sessions — full session content for Sessions page
router.get("/sessions", getSessions);

// GET /api/srl_sessions — attendance dates only (existing, kept for attendance route)
router.get("/srl_sessions", getSrlSessions);

module.exports = router;
