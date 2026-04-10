const prisma = require('../lib/prisma');

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
      // Ignore parse error
    }
    // Comma-separated fallback
    return trimmed
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s !== "-");
  }
  return [];
}

// GET /api/member-metrics/:enrollment_no
exports.getMemberMetrics = async (req, res, next) => {
  try {
    const lookup = req.params.enrollment_no.trim().toUpperCase();

    const rows = await prisma.memberCvProfile.findMany({
      where: {
        enrollment_no: {
          equals: lookup,
          mode: 'insensitive',
        },
      },
      select: {
        research_area: true,
        research_papers: true,
        hackathons: true,
        patents: true,
        projects: true,
      },
    });

    if (!rows || rows.length === 0) {
      return res.json({
        research_areas: [],
        research_papers: [],
        hackathons: [],
        patents: [],
        projects: [],
      });
    }

    const profile = rows[0];

    let researchAreas = [];
    let raVal = profile.research_area;
    if (raVal && raVal !== "-") {
      if (typeof raVal === "string") {
        researchAreas = raVal
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s && s !== "-");
      }
    }

    res.json({
      research_areas: researchAreas,
      research_papers: parseArrayField(profile.research_papers),
      hackathons: parseArrayField(profile.hackathons),
      patents: parseArrayField(profile.patents),
      projects: parseArrayField(profile.projects),
    });
  } catch (err) {
    next(err);
  }
};
