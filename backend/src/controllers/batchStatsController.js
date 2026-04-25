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

// GET /api/batch-member-stats
exports.getBatchStats = async (req, res, next) => {
  try {
    // Fetch ALL paper_authors with joined research_papers
    const paperRows = await prisma.paperAuthor.findMany({
      include: {
        researchPaper: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Fetch ALL member_cv_profiles for hackathons
    const profileRows = await prisma.memberCvProfile.findMany({
      select: {
        enrollment_no: true,
        hackathons: true,
      },
    });

    let authorPapers = {};
    (paperRows || []).forEach((row) => {
      let author = (row.author_name || "").trim();
      if (!author) return;

      let paper = row.researchPaper;
      if (paper) {
        let items = Array.isArray(paper) ? paper : [paper];
        items.forEach((p) => {
          let pid = p.id;
          let title = p.title;
          if (pid && title && title.trim()) {
            if (!authorPapers[author]) {
              authorPapers[author] = new Set();
            }
            authorPapers[author].add(pid);
          }
        });
      }
    });

    let enrollmentHackathons = {};
    (profileRows || []).forEach((profile) => {
      let enroll = (profile.enrollment_no || "")
        .toString()
        .trim()
        .toUpperCase();
      if (!enroll) return;

      let hacks = parseArrayField(profile.hackathons);
      enrollmentHackathons[enroll] = hacks.length;
    });

    let statsByName = {};
    Object.entries(authorPapers).forEach(([name, paperIds]) => {
      let count = paperIds.size;
      statsByName[name] = {
        research_works_count: count,
        papers_published_count: count,
      };
    });

    res.json({
      stats_by_name: statsByName,
      hackathons_by_enrollment: enrollmentHackathons,
    });
  } catch (err) {
    next(err);
  }
};
