const express = require("express");
const { getScores, getScoreByStudentId } = require("../controllers/scoresController");

const router = express.Router();

router.get("/scores", getScores);
router.get("/scores/:student_id", getScoreByStudentId);

module.exports = router;
