const prisma = require('../lib/prisma');

// GET /api/publication
exports.getPublications = async (req, res, next) => {
  try {
    const { search, event_type, year, category } = req.query;

    const where = {
      status: 'APPROVED', // Only show approved publications on the public website
    };

    if (year) {
      // Find publications with published_date or conference_date in that year
      // Prisma DateTime filtering
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      where.published_date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (event_type || category) {
      // Map event_type or category to type_of_publication
      where.type_of_publication = {
        contains: event_type || category,
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
          conference_location: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          publisher: {
            contains: search,
            mode: 'insensitive',
          },
        }
      ];
    }

    const data = await prisma.publication.findMany({
      where,
      orderBy: [
        { published_date: 'desc' },
      ],
    });

    // Fetch logos to map manually since relation is not defined in Prisma schema
    const logoIds = data.map(p => p.publisher_logo_id).filter(id => id !== null);
    let logosMap = {};
    if (logoIds.length > 0) {
      const symbols = await prisma.symbol.findMany({
        where: { id: { in: logoIds } }
      });
      symbols.forEach(sym => {
        logosMap[sym.id] = sym.logo_url;
      });
    }

    // Map the new fields to match the frontend expectations
    const mappedData = data.map(pub => {
      // Extract year from published_date
      const pubYear = pub.published_date ? new Date(pub.published_date).getFullYear() : null;
      
      return {
        id: pub.id,
        title: pub.title,
        student_authors: pub.authors ? pub.authors.join(", ") : "",
        first_author: pub.authors && pub.authors.length > 0 ? pub.authors[0] : "",
        venue: pub.conference_location || "",
        date: pub.published_date ? pub.published_date.toISOString() : null,
        conference_date: pub.conference_date ? pub.conference_date.toISOString() : null,
        event_type: pub.type_of_publication || "",
        description: "", // No longer exists in the new schema
        paper_url: pub.link_to_paper || "",
        tags: [], // No longer exists
        category: pub.type_of_publication || "", // For backward compatibility
        year: pubYear,
        publisher: pub.publisher || "",
        logo_url: pub.publisher_logo_id ? logosMap[pub.publisher_logo_id] : "",
      };
    });

    res.json({ publications: mappedData || [] });
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
    next(err);
  }
};
