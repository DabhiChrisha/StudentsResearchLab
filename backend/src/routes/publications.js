const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/api/publications", async (req, res, next) => {
  try {
    const { search, event_type, year, category } = req.query;

    const where = {};

    if (year) where.year = parseInt(year);
    if (event_type) where.event_type = { equals: event_type, mode: "insensitive" };
    if (category) where.category = { contains: category, mode: "insensitive" };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { student_authors: { contains: search, mode: "insensitive" } },
        { venue: { contains: search, mode: "insensitive" } },
      ];
    }

    const data = await prisma.publication.findMany({
      where,
      orderBy: [{ year: "desc" }, { serial_no: "desc" }],
    });

    res.json({ publications: data || [] });
  } catch (err) {
    next(err);
  }
});

// publications_submissions table does not exist in Neon DB.
// Submissions are stored directly in the publications table pending review.
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

    const data = await prisma.publication.create({
      data: {
        student_authors: first_author + (co_authors ? `, ${co_authors}` : ""),
        department: department || null,
        institute: institution || null,
        title,
        event_type,
        is_srl_member: is_srl_member === "yes" || is_srl_member === true,
        paper_url: paper_link || null,
        date: date || null,
        description: summary || null,
        category: "Under Review",
      },
    });

    res.json({ data: [data] });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
