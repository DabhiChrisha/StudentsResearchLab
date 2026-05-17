const express = require("express");
const prisma = require("../config/prisma");
const { broadcast } = require("../utils/sseManager");

const router = express.Router();

router.get("/api/publications", async (req, res, next) => {
  try {
    const { search, event_type, year, category } = req.query;

    // Only APPROVED publications are visible on the public website
    const where = { status: "APPROVED" };

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
      select: {
        id: true, title: true, authors: true, type_of_publication: true,
        publisher: true, department: true, institute: true, link_to_paper: true,
        conference_location: true, published_date: true, conference_date: true,
        publisher_logo_id: true,
        symbol: { select: { logo_url: true } },
      },
      orderBy: [{ published_date: "desc" }, { id: "desc" }],
    });

    const toTitleCase = (str) =>
      str ? str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : "";

    const mapped = (data || []).map((row) => {
      const { symbol, ...rest } = row;
      return {
        ...rest,
        student_authors:   Array.isArray(row.authors) ? row.authors.join(", ") : "",
        event_type:        toTitleCase(row.type_of_publication),
        paper_url:         row.link_to_paper,
        venue:             row.conference_location || row.publisher || "",
        date:              row.published_date ? new Date(row.published_date).toISOString().split("T")[0] : null,
        conference_date:   row.conference_date ? new Date(row.conference_date).toISOString().split("T")[0] : null,
        year:              row.published_date ? new Date(row.published_date).getUTCFullYear() : null,
        logo_url:          symbol?.logo_url || null,
        publisher_logo_id: row.publisher_logo_id ?? null,
        tags:              [],
        description:       "",
      };
    });

    res.json({ publications: mapped });
  } catch (err) {
    next(err);
  }
});

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
      publisher,
      publisher_logo_id,
      venue,
      conference_date,
    } = req.body;

    const allowed = ['conference', 'book chapter', 'journal', 'patent', 'poster', 'research article'];
    const chosenType = (typeof event_type === 'string' && event_type.trim()) ? event_type.trim().toLowerCase() : null;
    const finalType = allowed.includes(chosenType) ? chosenType : 'conference';
    const isPoster = finalType === 'poster';

    const logoId = publisher_logo_id ? parseInt(publisher_logo_id, 10) : null;
    const resolvedPublisher = publisher || (isPoster ? (institution || null) : "Students Research Lab");

    const data = await prisma.publication.create({
      data: {
        title,
        authors: [first_author, ...(co_authors ? co_authors.split(",").map((x) => x.trim()).filter(Boolean) : [])],
        type_of_publication: finalType,
        publisher:           resolvedPublisher,
        department:          department || "General",
        institute:           institution || "LDRP-ITR",
        link_to_paper:       paper_link || null,
        published_date:      date ? new Date(date) : new Date(),
        conference_date:     conference_date ? new Date(conference_date) : (date ? new Date(date) : null),
        conference_location: venue || null,
        status:              "PENDING",
        ...(logoId && !Number.isNaN(logoId) ? { publisher_logo_id: logoId } : {}),
      },
    });

    // Notify all connected admin portal clients in real time
    broadcast('publication_pending', { id: data.id, title: data.title });

    res.json({
      success: true,
      message: "Publication submitted for approval",
      status:  "PENDING",
      data:    [data],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
