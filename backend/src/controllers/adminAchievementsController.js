const prisma = require("../lib/prisma");

/**
 * Get all achievements - GET /api/admin/achievements
 */
exports.getAchievements = async (req, res, next) => {
  try {
    const achievements = await prisma.achievementContent.findMany({
      orderBy: { serial_no: "desc" },
    });

    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error("Get achievements error:", error);
    next(error);
  }
};

/**
 * Create achievement - POST /api/admin/achievements
 */
exports.createAchievement = async (req, res, next) => {
  try {
    const { date_raw, achievement_date, title, description, category, linkedin_url, image_url, media_urls = [] } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    // Get the max serial_no and calculate the next one
    const maxSerialNo = await prisma.achievementContent.findFirst({
      orderBy: { serial_no: "desc" },
      select: { serial_no: true },
    });

    const nextSerialNo = (maxSerialNo?.serial_no || 0) + 1;

    const achievement = await prisma.achievementContent.create({
      data: {
        serial_no: nextSerialNo,
        date_raw: date_raw || null,
        achievement_date: achievement_date ? new Date(achievement_date) : null,
        title: title.trim(),
        description: description ? description.trim() : null,
        category: category ? category.trim() : null,
        type: "image", // Always set to image
        linkedin_url: linkedin_url ? linkedin_url.trim() : null,
        image_url: image_url ? image_url.trim() : null,
        media_urls,
        created_at: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Achievement created successfully",
      data: achievement,
    });
  } catch (error) {
    console.error("Create achievement error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Conflict",
        message: "Duplicate entry error",
      });
    }
    next(error);
  }
};

/**
 * Update achievement - PUT /api/admin/achievements/:id
 */
exports.updateAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date_raw, achievement_date, title, description, category, type, linkedin_url, image_url, media_urls } = req.body;

    const updateData = {};
    if (date_raw) updateData.date_raw = date_raw;
    if (achievement_date) updateData.achievement_date = new Date(achievement_date);
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (type) updateData.type = type;
    if (linkedin_url) updateData.linkedin_url = linkedin_url;
    if (image_url) updateData.image_url = image_url;
    if (media_urls) updateData.media_urls = media_urls;

    const achievement = await prisma.achievementContent.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Achievement updated successfully",
      data: achievement,
    });
  } catch (error) {
    console.error("Update achievement error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Achievement not found",
      });
    }
    next(error);
  }
};

/**
 * Delete achievement - DELETE /api/admin/achievements/:id
 */
exports.deleteAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.achievementContent.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Achievement deleted successfully",
    });
  } catch (error) {
    console.error("Delete achievement error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Achievement not found",
      });
    }
    next(error);
  }
};
