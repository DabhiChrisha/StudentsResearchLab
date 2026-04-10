const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

// GET /api/achievements — full achievement content ordered newest first
router.get("/achievements", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("achievement_content")
      .select("*")
      .order("serial_no", { ascending: false });

    if (error) {
      const msg = error.message || "";
      if (
        error.code === "42P01" ||
        msg.includes("does not exist") ||
        msg.includes("relation")
      ) {
        return res.json({ achievements: [] });
      }
      throw error;
    }

    res.json({ achievements: data || [] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
