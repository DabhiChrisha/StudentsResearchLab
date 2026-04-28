const prisma = require("../lib/prisma");

/**
 * Get all research projects - GET /api/admin/research-projects
 */
exports.getResearchProjects = async (req, res, next) => {
  try {
    const projects = await prisma.research_projects.findMany({
      include: {
        research_project_members: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Get research projects error:", error);
    next(error);
  }
};

/**
 * Create research project - POST /api/admin/research-projects
 */
exports.createResearchProject = async (req, res, next) => {
  try {
    const { title, description, team_image_url, social_link, guide_name } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    const project = await prisma.research_projects.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        team_image_url: team_image_url ? team_image_url.trim() : null,
        social_link: social_link ? social_link.trim() : null,
        guide_name: guide_name ? guide_name.trim() : null,
        created_at: new Date(),
      },
      include: {
        research_project_members: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Research project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Create research project error:", error);
    next(error);
  }
};

/**
 * Update research project - PUT /api/admin/research-projects/:id
 */
exports.updateResearchProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, team_image_url, social_link, guide_name } = req.body;

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (team_image_url !== undefined) updateData.team_image_url = team_image_url ? team_image_url.trim() : null;
    if (social_link !== undefined) updateData.social_link = social_link ? social_link.trim() : null;
    if (guide_name !== undefined) updateData.guide_name = guide_name ? guide_name.trim() : null;

    const project = await prisma.research_projects.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        research_project_members: true,
      },
    });

    res.json({
      success: true,
      message: "Research project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Update research project error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Research project not found",
      });
    }
    next(error);
  }
};

/**
 * Delete research project - DELETE /api/admin/research-projects/:id
 */
exports.deleteResearchProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete related research_project_members first due to foreign key
    await prisma.research_project_members.deleteMany({
      where: { project_id: parseInt(id) },
    });

    // Then delete the project
    await prisma.research_projects.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Research project deleted successfully",
    });
  } catch (error) {
    console.error("Delete research project error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Research project not found",
      });
    }
    next(error);
  }
};
