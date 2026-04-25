const prisma = require('../lib/prisma');

// GET /api/publications
exports.getPublications = async (req, res, next) => {
  try {
    const { search, event_type, year, category } = req.query;

    const where = {};

    if (year) {
      where.year = parseInt(year);
    }

    if (event_type) {
      where.event_type = {
        contains: event_type,
        mode: 'insensitive',
      };
    }

    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          student_authors: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          venue: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const data = await prisma.publication.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { id: 'desc' },
      ],
    });

    res.json({ publications: data || [] });
  } catch (err) {
    next(err);
  }
};

// POST /api/submit-publication
exports.submitPublication = async (req, res, next) => {
  try {
    const {
      first_author,
      co_authors,
      department,
      institution,
      title,
      event_type,
      is_srl_member,
      paper_link,
      date,
      summary,
    } = req.body;

    const newSubmission = await prisma.publicationSubmission.create({
      data: {
        first_author,
        co_authors: co_authors || "",
        department,
        institution,
        title,
        event_type,
        is_srl_member: is_srl_member === "yes" || is_srl_member === true,
        paper_link: paper_link || "",
        date: date ? new Date(date) : null,
        summary,
      },
    });

    res.json({ data: newSubmission });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};
