const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

router.get("/cv/:enrollment_no", async (req, res, next) => {
  try {
    const { enrollment_no } = req.params;

    const { data: cv, error } = await supabase
      .from("member_cv_profiles")
      .select("*")
      .eq("enrollment_no", String(enrollment_no).toUpperCase())
      .single();

    if (error || !cv) {
      return res.status(404).json({
        detail: `CV profile not found for enrollment: ${enrollment_no}`,
      });
    }

    res.json({
      data: cv,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
