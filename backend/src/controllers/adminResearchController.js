const prisma = require("../lib/prisma");

const serializeForJson = (value) =>
  JSON.parse(
    JSON.stringify(value, (_key, val) => (typeof val === "bigint" ? val.toString() : val))
  );

/**
 * Get all research papers - GET /api/admin/research
 */
exports.getResearch = async (req, res, next) => {
  try {
    const papers = await prisma.researchPaper.findMany({
      include: { paper_authors: true },
      orderBy: { created_at: "desc" },
    });

    res.json({
      success: true,
      data: papers || [],
    });
  } catch (error) {
    console.error("Get research error:", error);
    next(error);
  }
};

/**
 * Create research paper - POST /api/admin/research
 */
exports.createResearch = async (req, res, next) => {
  try {
    const { title, authors = [], publishing_year, link_to_paper, link_to_pdf, type_of_event } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    const paper = await prisma.researchPaper.create({
      data: {
        title,
        publishing_year: publishing_year || new Date().getFullYear(),
        link_to_paper: link_to_paper || null,
        link_to_pdf: link_to_pdf || null,
        type_of_event: type_of_event || null,
        paper_authors: {
          create: Array.isArray(authors)
            ? authors.map((author) => ({
                author_name: author,
                is_srl_member: null,
              }))
            : [],
        },
      },
      include: { paper_authors: true },
    });

    res.status(201).json({
      success: true,
      message: "Research paper created successfully",
      data: paper,
    });
  } catch (error) {
    console.error("Create research error:", error);
    next(error);
  }
};

/**
 * Update research paper - PUT /api/admin/research/:id
 */
exports.updateResearch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, file_url, status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (file_url) updateData.link_to_paper = file_url;

    const paper = await prisma.researchPaper.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { paper_authors: true },
    });

    res.json({
      success: true,
      message: "Research paper updated successfully",
      data: paper,
    });
  } catch (error) {
    console.error("Update research error:", error);
    next(error);
  }
};

/**
 * Delete research paper - DELETE /api/admin/research/:id
 */
exports.deleteResearch = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.researchPaper.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Research paper deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Research paper not found",
      });
    }
    console.error("Delete research error:", error);
    next(error);
  }
};

/**
 * Get all join requests - GET /api/admin/join-requests
 * Merges in locally-stored statuses from JSON file (no DB column yet).
 */
exports.getJoinRequests = async (req, res, next) => {
  try {
    const requests = await prisma.joinUs.findMany({
      orderBy: { created_at: "desc" },
    });

    // Load statuses from local JSON file (if exists)
    const fs = require("fs");
    const path = require("path");
    const statusFile = path.join(__dirname, "..", "data", "join_status.json");
    let statuses = {};
    try {
      if (fs.existsSync(statusFile)) {
        const raw = fs.readFileSync(statusFile, "utf8");
        statuses = JSON.parse(raw || "{}");
      }
    } catch (err) {
      console.error("Failed to read join_status.json:", err.message);
      statuses = {};
    }

    const merged = serializeForJson(requests || []).map((r) => ({
      ...r,
      status: statuses[String(r.id)] || "pending",
    }));

    res.json({
      success: true,
      data: merged,
    });
  } catch (error) {
    console.error("Get join requests error:", error);
    next(error);
  }
};

/**
 * Approve/Reject join request - PUT /api/admin/join-requests/:id
 */
exports.updateJoinRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        error: "Invalid input",
        message: "status must be 'pending', 'approved' or 'rejected'",
      });
    }

    // Persist status to local JSON file (no DB column yet)
    const fs = require("fs");
    const path = require("path");
    const dataDir = path.join(__dirname, "..", "data");
    const statusFile = path.join(dataDir, "join_status.json");

    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

      let statuses = {};
      if (fs.existsSync(statusFile)) {
        const raw = fs.readFileSync(statusFile, "utf8");
        statuses = JSON.parse(raw || "{}");
      }

      statuses[String(id)] = status;
      fs.writeFileSync(statusFile, JSON.stringify(statuses, null, 2), "utf8");

      res.json({
        success: true,
        message: "Join request status saved",
        data: { id, status },
      });
    } catch (err) {
      console.error("Failed to persist join request status:", err);
      return res.status(500).json({ success: false, error: "Failed to persist status" });
    }
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Join request not found",
      });
    }
    console.error("Update join request error:", error);
    next(error);
  }
};

/**
 * Delete join request - DELETE /api/admin/join-requests/:id
 */
exports.deleteJoinRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.joinUs.delete({
      where: { id: BigInt(id) },
    });

    res.json({
      success: true,
      message: "Join request deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Join request not found",
      });
    }
    console.error("Delete join request error:", error);
    next(error);
  }
};
