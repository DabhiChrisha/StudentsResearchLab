const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/api/publications", async (req, res, next) => {
  try {
    const { search, event_type, year, category } = req.query;

    const where = {};

    if (event_type) where.type_of_publication = { equals: event_type, mode: "insensitive" };
    if (category) where.type_of_publication = { equals: category, mode: "insensitive" };
    if (year) {
      const yr = Number.parseInt(year, 10);
      if (!Number.isNaN(yr)) {
        where.published_date = {
          gte: new Date(`${yr}-01-01`),
          lt: new Date(`${yr + 1}-01-01`),
        };
      }
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { authors: { hasSome: [search] } },
        { conference_location: { contains: search, mode: "insensitive" } },
      ];
    }

    const data = await prisma.publication.findMany({
      where,
      orderBy: [{ published_date: "desc" }, { created_at: "desc" }],
    });

    const toTitleCase = (str) =>
      str ? str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : "";

    const mapped = (data || []).map((row) => ({
      ...row,
      student_authors: Array.isArray(row.authors) ? row.authors.join(", ") : "",
      event_type: toTitleCase(row.type_of_publication),
      paper_url: row.link_to_paper,
      venue: row.conference_location || row.publisher || "",
      date: row.published_date ? new Date(row.published_date).toISOString().split("T")[0] : null,
      year: row.published_date ? new Date(row.published_date).getUTCFullYear() : null,
      tags: [],
      description: "",
    }));

    res.json({ publications: mapped });
  } catch (err) {
    next(err);
  }
});

// publication_submissions table does not exist in Neon DB.
// Submissions are stored directly in the publication table pending review.
router.post("/api/submit-publication", async (req, res, next) => {
  try {
    const {
      first_author,
      co_authors,
      department,
      institution,
      title,
      event_type,
      paper_link,
      date,
      summary,
      is_srl_member,
    } = req.body;

    const allowed = ['conference', 'book chapter', 'journal', 'patent'];
    const chosenType = (typeof event_type === 'string' && event_type.trim()) ? event_type.trim().toLowerCase() : null;
    const finalType = allowed.includes(chosenType) ? chosenType : 'conference';

    const data = await prisma.publication.create({
      data: {
        title,
        authors: [first_author, ...(co_authors ? co_authors.split(",").map((x) => x.trim()).filter(Boolean) : [])],
        type_of_publication: finalType,
        publisher: institution || "Students Research Lab",
        department: department || "General",
        institute: institution || "LDRP-ITR",
        link_to_paper: paper_link || null,
        published_date: date ? new Date(date) : new Date(),
        conference_date: date ? new Date(date) : null,
        conference_location: null,
      },
    });

    res.json({ data: [data] });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
