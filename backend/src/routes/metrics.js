const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

const PUBLICATION_METRIC_TYPE_FILTERS = [
  "conference",
  "journal",
  "research article",
  "research artical",
  "paper",
  "poster",
  "case",
  "book",
];

function normalizeJsonList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "[]") return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function getHackathonText(entry) {
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  if (typeof entry === "object") {
    return [entry.title, entry.name, entry.status, entry.result, entry.position]
      .filter(Boolean)
      .join(" ");
  }
  return String(entry);
}

function summarizeHackathons(rows) {
  return rows.reduce(
    (summary, row) => {
      normalizeJsonList(row.hackathons).forEach((entry) => {
        const text = getHackathonText(entry).toLowerCase();
        if (!text) return;

        if (/\bwinner\b|\brunner[-\s]?up\b|\b1st\b|\b2nd\b|\b3rd\b|\bfirst\b|\bsecond\b|\bthird\b/.test(text)) {
          summary.winners += 1;
        }

        if (/\bfinalist\b|\bsemifinalist\b|\bshortlisted\b|\bselected\b/.test(text)) {
          summary.finalists += 1;
        }
      });
      return summary;
    },
    { winners: 0, finalists: 0 },
  );
}

router.get("/api/impact-metrics", async (req, res, next) => {
  try {
    const [srlSessions, researchPublications, ongoingResearchProjects, hackathonRows] = await Promise.all([
      prisma.sessionContent.count(),
      prisma.publication.count({
        where: {
          status: "APPROVED",
          OR: PUBLICATION_METRIC_TYPE_FILTERS.map((type) => ({
            type_of_publication: {
              contains: type,
              mode: "insensitive",
            },
          })),
        },
      }),
      prisma.memberCvProfile.count(),
      prisma.memberCvProfile.findMany({
        select: { hackathons: true },
      }),
    ]);
    const hackathons = summarizeHackathons(hackathonRows);

    res.json({
      success: true,
      data: {
        srlSessions,
        researchPublications,
        ongoingResearchProjects,
        hackathonWinners: hackathons.winners,
        hackathonFinalists: hackathons.finalists,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
