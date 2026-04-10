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
    const { serial_no, date_raw, session_date, title, description, category, type, linkedin_url, image_url, media_urls = [] } = req.body;

    if (!title || !serial_no) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title and serial_no are required",
      });
    }

    const entry = await prisma.sessionContent.create({
      data: {
        serial_no: parseInt(serial_no),
        date_raw: date_raw || null,
        session_date: session_date ? new Date(session_date) : null,
        title,
        description: description || null,
        category: category || null,
        type: type || "video",
        linkedin_url: linkedin_url || null,
        image_url: image_url || null,
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
        message: "serial_no must be unique",
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
