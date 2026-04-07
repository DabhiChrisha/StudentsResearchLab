const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

router.get("/scores", async (req, res, next) => {
  try {
    const { data: records, error } = await supabase.from("debate_scores").select("*");
    if (error) throw error;
    res.json({ records });
  } catch (err) {
    next(err);
  }
});

router.get("/scores/:student_id", (req, res) => {
  res.status(501).json({ detail: "Not Implemented securely for debate_scores yet" });
});

module.exports = router;
