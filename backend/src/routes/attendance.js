const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

router.get("/attendance", async (req, res, next) => {
  try {
    const { data: attendanceRecords, error } = await supabase
      .from("attendance")
      .select("*");
    if (error) throw error;
    res.json(attendanceRecords);
  } catch (err) {
    next(err);
  }
});

router.get("/attendance/:student_id", async (req, res, next) => {
  try {
    const { student_id } = req.params;
    const { data: attendance, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", student_id);
    if (error) throw error;
    res.json(attendance);
  } catch (err) {
    next(err);
  }
});

router.get("/attendance/:enrollment_no/percentage", async (req, res, next) => {
  try {
    const { enrollment_no } = req.params;
    const { data: attendance, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("enrollment_no", String(enrollment_no).toUpperCase());
    if (error) throw error;
    res.json({ percentage: 0.0, records: attendance });
  } catch (err) {
    next(err);
  }
});

router.get("/attendance/:enrollment_no/srl_percentage", async (req, res, next) => {
  try {
    const { enrollment_no } = req.params;
    res.json({ srl_percentage: 0.0 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
