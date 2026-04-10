const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

router.get("/activities", async (req, res, next) => {
  try {
    const { data: activities, error } = await supabase
      .from("activities")
      .select("*");

    if (error) throw error;

    res.json({ data: activities });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
