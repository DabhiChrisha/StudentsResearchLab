const express = require("express");
const { getPapersByStudent } = require("../controllers/papersController");

const router = express.Router();

// GET /api/papers/:studentName?enrollment_no=XXX
// Returns papers, hackathons, research areas and counts for a single student.
// Primary source: `publications` table (enrollment_nos column).
// Fallback: `paper_authors` → `research_papers` join (legacy data).
router.get("/papers/:studentName", getPapersByStudent);

module.exports = router;
