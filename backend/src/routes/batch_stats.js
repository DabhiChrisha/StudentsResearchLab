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
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter((v) => v && v !== "-");
    } catch (e) {
      // ignore
    }
    return trimmed.split(",").map((s) => s.trim()).filter((s) => s && s !== "-");
  }
  return [];
}

router.get("/api/batch-member-stats", async (req, res, next) => {
  try {
    const [paperRows, profileRows] = await Promise.all([
      prisma.paperAuthor.findMany({
        include: { research_papers: true },
      }),
      prisma.memberCvProfile.findMany({
        select: { enrollment_no: true, hackathons: true },
      }),
    ]);

    const authorPapers = {};
    paperRows.forEach((row) => {
      const author = (row.author_name || "").trim();
      if (!author) return;
      const p = row.research_papers;
      if (p && p.id && p.title && p.title.trim()) {
        if (!authorPapers[author]) authorPapers[author] = new Set();
        authorPapers[author].add(p.id);
      }
    });

    const enrollmentHackathons = {};
    profileRows.forEach((profile) => {
      const enroll = (profile.enrollment_no || "").toString().trim().toUpperCase();
      if (!enroll) return;
      enrollmentHackathons[enroll] = parseArrayField(profile.hackathons).length;
    });

    const statsByName = {};
    Object.entries(authorPapers).forEach(([name, paperIds]) => {
      const count = paperIds.size;
      statsByName[name] = { research_works_count: count, papers_published_count: count };
    });

    res.json({ stats_by_name: statsByName, hackathons_by_enrollment: enrollmentHackathons });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
