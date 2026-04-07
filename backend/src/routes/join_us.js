const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

router.post("/join-us", async (req, res, next) => {
  try {
    const {
      name,
      enrollment,
      semester,
      division,
      branch,
      college,
      contact,
      email,
      batch,
      source,
      reference_name,
    } = req.body;

    const { data, error } = await supabase
      .from("join_us")
      .insert([
        {
          name,
          enrollment,
          semester,
          division,
          branch,
          college,
          contact,
          email,
          batch,
          source,
          reference_name: reference_name || "",
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({ detail: error.message });
    }

    res.json({ data });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
