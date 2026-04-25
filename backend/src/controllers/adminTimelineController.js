const prisma = require("../lib/prisma");

/**
 * Get all timeline entries - GET /api/admin/timeline
 */
exports.getTimeline = async (req, res, next) => {
  try {
    const entries = await prisma.sessionContent.findMany({
      orderBy: { session_date: "desc" },
    });

    res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Get timeline error:", error);
    next(error);
  }
};

/**
 * Create timeline entry - POST /api/admin/timeline
 */
exports.createTimelineEntry = async (req, res, next) => {
  try {
    const { date_raw, session_date, title, description, category, type, linkedin_url, image_url, media_urls = [] } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    // Get the max serial_no and calculate the next one
    const maxSerialNo = await prisma.sessionContent.findFirst({
      orderBy: { serial_no: "desc" },
      select: { serial_no: true },
    });

    const nextSerialNo = (maxSerialNo?.serial_no || 0) + 1;

    const entry = await prisma.sessionContent.create({
      data: {
        serial_no: nextSerialNo,
        date_raw: date_raw || null,
        session_date: session_date ? new Date(session_date) : null,
        title: title.trim(),
        description: description ? description.trim() : null,
        category: category ? category.trim() : null,
        type: type || "video",
        linkedin_url: linkedin_url ? linkedin_url.trim() : null,
        image_url: image_url ? image_url.trim() : null,
        media_urls,
        created_at: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Timeline entry created successfully",
      data: entry,
    });
  } catch (error) {
    console.error("Create timeline entry error:", error);
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
 * Update timeline entry - PUT /api/admin/timeline/:id
 */
exports.updateTimelineEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date_raw, session_date, title, description, category, type, linkedin_url, image_url, media_urls } = req.body;

    const updateData = {};
    if (date_raw) updateData.date_raw = date_raw;
    if (session_date) updateData.session_date = new Date(session_date);
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (type) updateData.type = type;
    if (linkedin_url) updateData.linkedin_url = linkedin_url;
    if (image_url) updateData.image_url = image_url;
    if (media_urls) updateData.media_urls = media_urls;

    const entry = await prisma.sessionContent.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Timeline entry updated successfully",
      data: entry,
    });
  } catch (error) {
    console.error("Update timeline entry error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Timeline entry not found",
      });
    }
    next(error);
  }
};

/**
 * Delete timeline entry - DELETE /api/admin/timeline/:id
 */
exports.deleteTimelineEntry = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.sessionContent.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Timeline entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete timeline entry error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Not found",
        message: "Timeline entry not found",
      });
    }
    next(error);
  }
};
