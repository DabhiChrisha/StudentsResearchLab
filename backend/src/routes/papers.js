const express = require("express");
const prisma = require("../config/prisma");

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
    return trimmed.split(",").map((s) => s.trim()).filter((s) => s && s !== "-");
  }
  return [];
}

router.get("/papers/:studentName", async (req, res, next) => {
  try {
    const studentName = (req.params.studentName || "").trim();
    const enrollmentNo = (req.query.enrollment_no || "").toString().trim().toUpperCase();

    let paperTitles = [];

    // Primary: publications table by enrollment number
    if (enrollmentNo) {
      const pubRows = await prisma.publication.findMany({
        where: { enrollment_nos: { contains: enrollmentNo, mode: "insensitive" } },
        select: { title: true, enrollment_nos: true, category: true },
      });

      const enrollPattern = new RegExp(`(^|,)${enrollmentNo}(,|$)`);
      paperTitles = pubRows
        .filter((row) => {
          const isMatch = enrollPattern.test(row.enrollment_nos || "");
          const isUnderReview = (row.category || "").toLowerCase().includes("under review");
          return isMatch && !isUnderReview;
        })
        .map((row) => row.title);
    }

    // Fallback: legacy paper_authors → research_papers join
    if (paperTitles.length === 0 && studentName) {
      const legacyRows = await prisma.paperAuthor.findMany({
        where: { author_name: { contains: studentName, mode: "insensitive" } },
        include: { research_papers: true },
      });

      const seenIds = new Set();
      legacyRows.forEach((row) => {
        const p = row.research_papers;
        if (p && p.id && p.title && !seenIds.has(p.id)) {
          seenIds.add(p.id);
          paperTitles.push(p.title.trim());
        }
      });
    }

    // Hackathons + Research Areas from member_cv_profiles
    let hackathons = [];
    let researchAreas = [];

    if (enrollmentNo) {
      const profile = await prisma.memberCvProfile.findUnique({
        where: { enrollment_no: enrollmentNo },
        select: { hackathons: true, research_area: true },
      });

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
