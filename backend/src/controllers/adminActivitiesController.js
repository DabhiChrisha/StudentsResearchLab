const prisma = require("../lib/prisma");

/**
 * Get all activities - GET /api/admin/activities
 */
exports.getActivities = async (req, res, next) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { id: "desc" },
    });

    res.json({
      success: true,
      data: activities || [],
    });
  } catch (error) {
    console.error("Get activities error:", error);
    next(error);
  }
};

/**
 * Create activity - POST /api/admin/activities
 */
exports.createActivity = async (req, res, next) => {
  try {
    const { title, description, category, date, link, brief, photo } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description: description || null,
        category: category || null,
        date: date || null,
        link: link || null,
        brief: brief || null,
        Photo: photo || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: activity,
    });
  } catch (error) {
    console.error("Create activity error:", error);
    next(error);
  }
};

/**
 * Update activity - PUT /api/admin/activities/:id
 */
exports.updateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, date, link, brief, photo } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (date !== undefined) updateData.date = date;
    if (link !== undefined) updateData.link = link;
    if (brief !== undefined) updateData.brief = brief;
    if (photo !== undefined) updateData.Photo = photo;

    const activity = await prisma.activity.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Activity updated successfully",
      data: activity,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Activity not found",
      });
    }
    console.error("Update activity error:", error);
    next(error);
  }
};

/**
 * Delete activity - DELETE /api/admin/activities/:id
 */
exports.deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.activity.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Activity not found",
      });
    }
    console.error("Delete activity error:", error);
    next(error);
  }
};
