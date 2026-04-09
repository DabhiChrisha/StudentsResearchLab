const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

// GET /api/researchers
router.get("/researchers", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("students_details")
      .select("*")
      .order("student_name", { ascending: true });

    if (error) {
      const msg = error.message || "";
      if (
        error.code === "42P01" ||
        msg.includes("does not exist") ||
        msg.includes("relation")
      ) {
        return res.json({ researchers: [] });
      }
      throw error;
    }

    res.json({ researchers: data || [] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
