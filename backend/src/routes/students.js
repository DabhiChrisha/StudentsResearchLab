const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

router.get("/students", async (req, res, next) => {
  try {
    // Equivalent to the Python logic using Supabase JS
    const { data: scores, error: scoresError } = await supabase
      .from("debate_scores")
      .select("enrollment_no, points");

    if (scoresError) throw scoresError;

    const { data: details, error: detailsError } = await supabase
      .from("students_details")
      .select("enrollment_no, student_name");

    if (detailsError) throw detailsError;

    // Build name map
    const nameMap = {};
    details.forEach((rec) => {
      if (rec.enrollment_no) {
        const en = String(rec.enrollment_no).trim().toUpperCase();
        if (rec.student_name) {
          nameMap[en] = rec.student_name;
        }
      }
    });

    // Aggregate points
    const pointsMap = {};
    scores.forEach((sc) => {
      if (sc.enrollment_no) {
        const en = String(sc.enrollment_no).trim().toUpperCase();
        const points = sc.points || 0;
        pointsMap[en] = (pointsMap[en] || 0) + points;
      }
    });

    const result = [];
    for (const [en, total] of Object.entries(pointsMap)) {
      result.push({
        id: en,
        enrollment_no: en,
        name: nameMap[en] || "Unknown Student",
        attendance_percentage: 0.0,
        total_score: total,
      });
    }

    res.json({ students: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
