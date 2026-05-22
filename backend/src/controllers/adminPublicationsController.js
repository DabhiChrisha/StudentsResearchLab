const prisma = require("../lib/prisma");
const { broadcast } = require("../utils/sseManager");

const VALID_STATUSES  = ['PENDING', 'APPROVED', 'REJECTED'];
const ALLOWED_TYPES   = ['conference', 'book chapter', 'journal', 'patent', 'poster', 'research artical'];

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
      publicationData.type_of_publication = ALLOWED_TYPES.includes(lower) ? lower : null;
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

  // Legacy alias from admin UI
  if (body.category !== undefined && publicationData.type_of_publication === undefined) {
    const rawCat = normalizeString(body.category);
    if (rawCat) {
      const lower = rawCat.toLowerCase();
      publicationData.type_of_publication = ALLOWED_TYPES.includes(lower) ? lower : null;
    }
  }

  // Publisher logo — either a predefined Symbol ID or null
  if (body.publisher_logo_id !== undefined) {
    const raw = body.publisher_logo_id;
    if (raw === null || raw === "" || raw === "null") {
      publicationData.publisher_logo_id = null;
    } else {
      const parsed = Number.parseInt(raw, 10);
      publicationData.publisher_logo_id = Number.isNaN(parsed) ? null : parsed;
    }
  }

  return publicationData;
};

const toAdminPublicationResponse = (row) => {
  const publishedDate  = row.published_date  ? new Date(row.published_date).toISOString().split("T")[0]  : null;
  const conferenceDate = row.conference_date ? new Date(row.conference_date).toISOString().split("T")[0] : null;
  const logo_url = row.logo_url || null;

  return {
    id: row.id,
    title: row.title,
    student_authors:   Array.isArray(row.authors) ? row.authors.join(", ") : "",
    event_type:        row.type_of_publication,
    paper_url:         row.link_to_paper,
    venue:             row.conference_location,
    date:              publishedDate,
    conference_date:   conferenceDate,
    year:              publishedDate ? Number.parseInt(publishedDate.split("-")[0], 10) : null,
    publisher_logo_id: row.publisher_logo_id ?? null,
    logo_url:          logo_url,
    status:            row.status,
    approved_by:       row.approved_by ?? null,
    approved_at:       row.approved_at ? new Date(row.approved_at).toISOString() : null,
  };
};

/**
 * GET /api/admin/publication[?status=PENDING|APPROVED|REJECTED]
 */
exports.getPublications = async (req, res, next) => {
  try {
    const where = {};

    const { status } = req.query;
    if (status) {
      const upper = status.toUpperCase();
      if (!VALID_STATUSES.includes(upper)) {
        return res.status(400).json({ error: "Invalid input", message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
      }
      where.status = upper;
    }

    // Fetch publications (no symbol relation available) and resolve publisher logos
    const publications = await prisma.publication.findMany({
      where,
      orderBy: [{ created_at: "desc" }, { published_date: "desc" }],
    });

    // Resolve publisher logos by matching publication.publisher -> symbol.publisher_name
    const publishers = Array.from(new Set(publications.map(p => p.publisher).filter(Boolean)));
    let symbolRows = [];
    if (publishers.length > 0) {
      symbolRows = await prisma.symbol.findMany({ where: { publisher_name: { in: publishers } }, select: { publisher_name: true, logo_url: true } });
    }
    const symbolMap = symbolRows.reduce((acc, s) => { acc[s.publisher_name] = s.logo_url; return acc; }, {});

    const publicationsWithLogo = publications.map(p => ({ ...p, logo_url: symbolMap[p.publisher] || null }));

    res.json({ success: true, data: publicationsWithLogo.map(toAdminPublicationResponse) });
  } catch (error) {
    console.error("Get publications error:", error);
    next(error);
  }
};

/**
 * GET /api/admin/publication/:id
 */
exports.getPublication = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publication id" });
    }

    const publication = await prisma.publication.findUnique({ where: { id } });

    // Resolve logo by publisher name if available
    if (publication && publication.publisher) {
      const symbolRow = await prisma.symbol.findUnique({ where: { publisher_name: publication.publisher }, select: { logo_url: true } });
      publication.logo_url = symbolRow?.logo_url || null;
    }

    if (!publication) {
      return res.status(404).json({ error: "Not found", message: "Publication not found" });
    }

    res.json({ success: true, data: toAdminPublicationResponse(publication) });
  } catch (error) {
    console.error("Get publication error:", error);
    next(error);
  }
};

/**
 * POST /api/admin/publication
 * Admin-created publications are immediately APPROVED.
 */
exports.createPublication = async (req, res, next) => {
  try {
    const publicationData = buildPublicationData(req.body);

    if (!publicationData.title) {
      return res.status(400).json({ error: "Invalid input", message: "title is required" });
    }

    const resolvedType = publicationData.type_of_publication ?? "conference";
    if (resolvedType !== 'poster' && !publicationData.publisher) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Publisher is required for this publication type",
      });
    }

    const now = new Date();
    const publication = await prisma.publication.create({
      data: {
        ...publicationData,
        authors:             publicationData.authors             ?? [],
        published_date:      publicationData.published_date      ?? now,
        type_of_publication: resolvedType,
        publisher:           publicationData.publisher           ?? null,
        department:          publicationData.department          ?? "General",
        institute:           publicationData.institute           ?? "LDRP-ITR",
        publisher_logo_id:   publicationData.publisher_logo_id  ?? null,
        status:              "APPROVED",
        approved_by:         req.admin?.email ?? null,
        approved_at:         now,
      },
    });

    // Resolve logo via publisher name (text) if available
    if (publication.publisher) {
      const symbolRow = await prisma.symbol.findUnique({ where: { publisher_name: publication.publisher }, select: { logo_url: true } });
      publication.logo_url = symbolRow?.logo_url || null;
    }

    broadcast("publication_approved", { id: publication.id, title: publication.title });
    broadcast("publication_changed", { id: publication.id });

    res.status(201).json({
      success: true,
      message: "Publication created successfully",
      data: toAdminPublicationResponse(publication),
    });
  } catch (error) {
    console.error("Create publication error:", error.code, error.meta, error.message);
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publisher_logo_id — referenced symbol does not exist" });
    }
    next(error);
  }
};

/**
 * PUT /api/admin/publication/:id
 * Status is NOT changed by this endpoint — use approve/reject endpoints.
 */
exports.updatePublication = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publication id" });
    }

    const updateData = buildPublicationData(req.body);

    const touchesType      = req.body.event_type !== undefined || req.body.type_of_publication !== undefined || req.body.category !== undefined;
    const touchesPublisher = req.body.publisher !== undefined || req.body.institute !== undefined;

    if (touchesType || touchesPublisher) {
      let effectiveType = updateData.type_of_publication;
      if (effectiveType === undefined) {
        const current = await prisma.publication.findUnique({ where: { id }, select: { type_of_publication: true } });
        if (!current) {
          return res.status(404).json({ error: "Not found", message: "Publication not found" });
        }
        effectiveType = current.type_of_publication;
      }
      if (effectiveType !== 'poster' && touchesPublisher && !updateData.publisher) {
        return res.status(400).json({
          error: "Invalid input",
          message: "Publisher is required for this publication type",
        });
      }
    }

    const publication = await prisma.publication.update({ where: { id }, data: updateData });

    // Resolve logo via publisher name if available
    if (publication.publisher) {
      const symbolRow = await prisma.symbol.findUnique({ where: { publisher_name: publication.publisher }, select: { logo_url: true } });
      publication.logo_url = symbolRow?.logo_url || null;
    }

    if (publication.status === "APPROVED") {
      broadcast("publication_approved", { id: publication.id, title: publication.title });
    }
    broadcast("publication_changed", { id: publication.id });

    res.json({
      success: true,
      message: "Publication updated successfully",
      data: toAdminPublicationResponse(publication),
    });
  } catch (error) {
    console.error("Update publication error:", error.code, error.meta, error.message);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Not found", message: "Publication not found" });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publisher_logo_id — referenced symbol does not exist" });
    }
    next(error);
  }
};

/**
 * DELETE /api/admin/publication/:id
 */
exports.deletePublication = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publication id" });
    }

    await prisma.publication.delete({ where: { id } });

    broadcast("publication_changed", { id });

    res.json({ success: true, message: "Publication deleted successfully" });
  } catch (error) {
    console.error("Delete publication error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Not found", message: "Publication not found" });
    }
    next(error);
  }
};

/**
 * PATCH /api/admin/publication/:id/approve
 */
exports.approvePublication = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publication id" });
    }

    const existing = await prisma.publication.findUnique({ where: { id }, select: { status: true } });
    if (!existing) {
      return res.status(404).json({ error: "Not found", message: "Publication not found" });
    }
    if (existing.status === 'APPROVED') {
      return res.status(409).json({ error: "Conflict", message: "Publication is already approved" });
    }

    const publication = await prisma.publication.update({
      where: { id },
      data: {
        status:      "APPROVED",
        approved_by: req.admin.email,
        approved_at: new Date(),
      },
    });

    // Resolve logo via publisher name if available
    if (publication.publisher) {
      const symbolRow = await prisma.symbol.findUnique({ where: { publisher_name: publication.publisher }, select: { logo_url: true } });
      publication.logo_url = symbolRow?.logo_url || null;
    }

    // Notify all connected clients so the public website updates in real time
    broadcast('publication_approved', { id: publication.id, title: publication.title });

    res.json({
      success: true,
      message: "Publication approved successfully",
      status:  "APPROVED",
      data:    toAdminPublicationResponse(publication),
    });
  } catch (error) {
    console.error("Approve publication error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Not found", message: "Publication not found" });
    }
    next(error);
  }
};

/**
 * PATCH /api/admin/publication/:id/reject
 */
exports.rejectPublication = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publication id" });
    }

    const existing = await prisma.publication.findUnique({ where: { id }, select: { status: true } });
    if (!existing) {
      return res.status(404).json({ error: "Not found", message: "Publication not found" });
    }
    if (existing.status === 'REJECTED') {
      return res.status(409).json({ error: "Conflict", message: "Publication is already rejected" });
    }

    const publication = await prisma.publication.update({
      where: { id },
      data: {
        status:      "REJECTED",
        approved_by: null,
        approved_at: null,
      },
    });

    // Resolve logo via publisher name if available
    if (publication.publisher) {
      const symbolRow = await prisma.symbol.findUnique({ where: { publisher_name: publication.publisher }, select: { logo_url: true } });
      publication.logo_url = symbolRow?.logo_url || null;
    }

    // Notify admin portal clients so the pending list refreshes in real time
    broadcast('publication_rejected', { id: publication.id });

    res.json({
      success: true,
      message: "Publication rejected successfully",
      status:  "REJECTED",
      data:    toAdminPublicationResponse(publication),
    });
  } catch (error) {
    console.error("Reject publication error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Not found", message: "Publication not found" });
    }
    next(error);
  }
};
