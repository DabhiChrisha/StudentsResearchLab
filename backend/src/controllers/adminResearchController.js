const prisma = require("../lib/prisma");

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
    if (file_url) updateData.file_url = file_url;
    if (status) updateData.status = status;

    const { data, error } = await supabase
      .from("papers")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: "Not found",
        message: "Research paper not found",
      });
    }

    res.json({
      success: true,
      message: "Research paper updated successfully",
      data: data[0],
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
 */
exports.getJoinRequests = async (req, res, next) => {
  try {
    const requests = await prisma.joinUs.findMany({
      orderBy: { created_at: "desc" },
    });

    res.json({
      success: true,
      data: requests || [],
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

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: "Invalid input",
        message: "status must be 'approved' or 'rejected'",
      });
    }

    // Note: JoinUs model doesn't have a status field, update DB schema if needed
    // For now, return success without updating
    res.json({
      success: true,
      message: "Join request update successful (status field not in schema)",
      data: { id, status, note: "Update schema to add status field to join_us table" },
    });
  } catch (error) {
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
