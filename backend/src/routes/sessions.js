const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

// GET /api/sessions — full session content for Sessions page
router.get("/sessions", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("session_content")
      .select("*")
      .order("serial_no", { ascending: false }); // newest first

    if (error) {
      const msg = error.message || "";
      if (
        error.code === "42P01" ||
        msg.includes("does not exist") ||
        msg.includes("relation")
      ) {
        return res.json({ sessions: [] });
      }
      throw error;
    }

    res.json({ sessions: data || [] });
  } catch (err) {
    next(err);
  }
});

// GET /api/srl_sessions — attendance dates only (existing, kept for attendance route)
router.get("/srl_sessions", async (req, res, next) => {
  try {
    const { data: records, error } = await supabase
      .from("srl_sessions")
      .select("session_date");
    if (error) throw error;
    res.json({ records });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
