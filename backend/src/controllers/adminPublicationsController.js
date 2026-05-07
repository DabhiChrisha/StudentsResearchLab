const prisma = require("../lib/prisma");

const normalizeString = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return String(value).trim() || null;
};

const normalizeDate = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const buildPublicationData = (body) => {
  const publicationData = {};

  if (body.title !== undefined) publicationData.title = normalizeString(body.title);
  if (body.student_authors !== undefined || body.authors !== undefined) {
    const authorsRaw = normalizeString(body.student_authors ?? body.authors);
    publicationData.authors = authorsRaw ? authorsRaw.split(",").map((a) => a.trim()).filter(Boolean) : [];
  }
  if (body.department !== undefined) publicationData.department = normalizeString(body.department);
  if (body.institute !== undefined || body.publisher !== undefined) {
    publicationData.institute = normalizeString(body.institute);
    publicationData.publisher = normalizeString(body.publisher);
  }
  if (body.event_type !== undefined || body.type_of_publication !== undefined) {
    const raw = normalizeString(body.event_type ?? body.type_of_publication);
    if (raw) {
      const lower = raw.toLowerCase();
      const allowed = ['conference', 'book chapter', 'journal', 'patent'];
      publicationData.type_of_publication = allowed.includes(lower) ? lower : null;
    }
  }
  if (body.paper_url !== undefined || body.link_to_paper !== undefined) {
    publicationData.link_to_paper = normalizeString(body.paper_url ?? body.link_to_paper);
  }
  if (body.venue !== undefined) publicationData.conference_location = normalizeString(body.venue);
  if (body.date !== undefined || body.published_date !== undefined || body.conference_date !== undefined) {
    publicationData.published_date = normalizeDate(body.date ?? body.published_date);
    publicationData.conference_date = normalizeDate(body.conference_date);
  }

  // Legacy aliases from admin UI
  if (body.category !== undefined && publicationData.type_of_publication === undefined) {
    const rawCat = normalizeString(body.category);
    if (rawCat) {
      const lower = rawCat.toLowerCase();
      const allowed = ['conference', 'book chapter', 'journal', 'patent'];
      publicationData.type_of_publication = allowed.includes(lower) ? lower : null;
    }
  }

  return publicationData;
};

const toAdminPublicationResponse = (row) => {
  const publishedDate = row.published_date ? new Date(row.published_date).toISOString().split("T")[0] : null;
  const conferenceDate = row.conference_date ? new Date(row.conference_date).toISOString().split("T")[0] : null;

  return {
    ...row,
    student_authors: Array.isArray(row.authors) ? row.authors.join(", ") : "",
    event_type: row.type_of_publication,
    paper_url: row.link_to_paper,
    venue: row.conference_location,
    date: publishedDate,
    year: publishedDate ? Number.parseInt(publishedDate.split("-")[0], 10) : null,
  };
};

/**
 * Get all publications - GET /api/admin/publication
 */
exports.getPublications = async (req, res, next) => {
  try {
    const publications = await prisma.publication.findMany({
      orderBy: [{ published_date: "desc" }, { created_at: "desc" }],
    });

    res.json({
      success: true,
      data: publications.map(toAdminPublicationResponse),
    });
  } catch (error) {
    console.error("Get publications error:", error);
    next(error);
  }
};

/**
 * Get single publication - GET /api/admin/publication/:id
 */
exports.getPublication = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publication id" });
    }

    const publication = await prisma.publication.findUnique({
      where: { id },
    });

    if (!publication) {
      return res.status(404).json({
        error: "Not found",
        message: "Publication not found",
      });
    }

    res.json({
      success: true,
      data: toAdminPublicationResponse(publication),
    });
  } catch (error) {
    console.error("Get publication error:", error);
    next(error);
  }
};

/**
 * Create publication - POST /api/admin/publication
 */
exports.createPublication = async (req, res, next) => {
  try {
    const publicationData = buildPublicationData(req.body);

    // Validate required fields
    if (!publicationData.title) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    const publication = await prisma.publication.create({
      data: {
        ...publicationData,
        authors: publicationData.authors ?? [],
        published_date: publicationData.published_date ?? new Date(),
        type_of_publication: publicationData.type_of_publication ?? "conference",
        publisher: publicationData.publisher ?? "Students Research Lab",
        department: publicationData.department ?? "General",
        institute: publicationData.institute ?? "LDRP-ITR",
      },
    });

    res.status(201).json({
      success: true,
      message: "Publication created successfully",
      data: toAdminPublicationResponse(publication),
    });
  } catch (error) {
    console.error("Create publication error:", error);
    next(error);
  }
};

/**
 * Update publication - PUT /api/admin/publication/:id
 */
exports.updatePublication = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publication id" });
    }

    const updateData = buildPublicationData(req.body);

    const publication = await prisma.publication.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Publication updated successfully",
      data: toAdminPublicationResponse(publication),
    });
  } catch (error) {
    console.error("Update publication error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Publication not found",
      });
    }
    next(error);
  }
};

/**
 * Delete publication - DELETE /api/admin/publication/:id
 */
exports.deletePublication = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publication id" });
    }

    await prisma.publication.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Publication deleted successfully",
    });
  } catch (error) {
    console.error("Delete publication error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Publication not found",
      });
    }
    next(error);
  }
};
