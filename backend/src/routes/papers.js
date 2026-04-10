const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

function parseArrayField(val) {
  if (!val || val === "-") return [];
  if (Array.isArray(val)) return val.filter((v) => v && v !== "-");
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (["[]", "", "-"].includes(trimmed)) return [];
    try {
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
      if (Array.isArray(parsed)) return parsed.filter((v) => v && v !== "-");
    } catch (e) {
      // ignore
    }
    return trimmed
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s !== "-");
  }
  return [];
}

// GET /api/papers/:studentName?enrollment_no=XXX
// Returns papers, hackathons, research areas and counts for a single student.
// Primary source: `publications` table (enrollment_nos column).
// Fallback: `paper_authors` → `research_papers` join (legacy data).
router.get("/papers/:studentName", async (req, res, next) => {
  try {
    const studentName = (req.params.studentName || "").trim();
    const enrollmentNo = (req.query.enrollment_no || "").toString().trim().toUpperCase();

    // --- Papers: query publications table by enrollment number ---
    let paperTitles = [];
    if (enrollmentNo) {
      const { data: pubRows, error: pubError } = await supabase
        .from("publications")
        .select("title, enrollment_nos, category")
        .ilike("enrollment_nos", `%${enrollmentNo}%`);

      if (pubError) throw pubError;

      // Double-check the match is exact (avoid "30144" matching "30144X")
      const enrollPattern = new RegExp(`(^|,)${enrollmentNo}(,|$)`);
      paperTitles = (pubRows || [])
        .filter((row) => {
          const isMatch = enrollPattern.test(row.enrollment_nos || "");
          const isUnderReview = (row.category || "").toLowerCase().includes("under review");
          return isMatch && !isUnderReview;
        })
        .map((row) => row.title);
    }

    // --- Fallback: legacy paper_authors table (if publications table is empty for this student) ---
    if (paperTitles.length === 0 && studentName) {
      const { data: legacyRows } = await supabase
        .from("paper_authors")
        .select("author_name, research_papers ( id, title )")
        .ilike("author_name", studentName);

      const seenIds = new Set();
      (legacyRows || []).forEach((row) => {
        const items = Array.isArray(row.research_papers)
          ? row.research_papers
          : [row.research_papers];
        items.forEach((p) => {
          if (p && p.id && p.title && !seenIds.has(p.id)) {
            seenIds.add(p.id);
            paperTitles.push(p.title.trim());
          }
        });
      });
    }

    // --- Hackathons + Research Areas: member_cv_profiles ---
    let hackathons = [];
    let researchAreas = [];

    if (enrollmentNo) {
      const { data: profile } = await supabase
        .from("member_cv_profiles")
        .select("hackathons, research_area")
        .eq("enrollment_no", enrollmentNo)
        .single();

      if (profile) {
        hackathons = parseArrayField(profile.hackathons);
        researchAreas = parseArrayField(profile.research_area);
      }
    }

    res.json({
      research_works_count: paperTitles.length,
      papers_published_count: paperTitles.length,
      hackathons_count: hackathons.length,
      research_areas: researchAreas,
      hackathons: hackathons,
      papers: paperTitles,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
