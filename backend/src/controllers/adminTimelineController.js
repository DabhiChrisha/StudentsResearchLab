const prisma = require("../lib/prisma");
const { broadcast } = require("../utils/sseManager");

const serializeTimelineEntry = (entry) => ({
  ...entry,
  id: entry.id.toString(),
});

/**
 * Get all timeline entries - GET /api/admin/timeline
 */
exports.getTimeline = async (req, res, next) => {
  try {
    const entries = await prisma.timeline_entries.findMany({
      orderBy: { display_order: "asc" },
    });

    res.json({
      success: true,
      data: entries.map(serializeTimelineEntry),
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
    const {
      step,
      title,
      description,
      icon_svg,
      display_order,
      is_active = true,
    } = req.body;

    if (!step || !step.toString().trim()) {
      return res.status(400).json({
        error: "Invalid input",
        message: "step is required",
      });
    }

    if (!title || !title.toString().trim()) {
      return res.status(400).json({
        error: "Invalid input",
        message: "title is required",
      });
    }

    const maxDisplayOrder = await prisma.timeline_entries.findFirst({
      orderBy: { display_order: "desc" },
      select: { display_order: true },
    });

    const nextDisplayOrder = (maxDisplayOrder?.display_order || 0) + 1;

    const entry = await prisma.timeline_entries.create({
      data: {
        step: step.toString().trim(),
        title: title.toString().trim(),
        description: description ? description.toString().trim() : "",
        icon_svg: icon_svg || null,
        display_order: display_order !== undefined ? Number(display_order) : nextDisplayOrder,
        is_active: Boolean(is_active),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    broadcast("session_changed", { id: entry.id.toString() });

    res.status(201).json({
      success: true,
      message: "Timeline entry created successfully",
      data: serializeTimelineEntry(entry),
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
    const { step, title, description, icon_svg, display_order, is_active } = req.body;

    const updateData = {};
    if (step !== undefined) updateData.step = step.toString();
    if (title !== undefined) updateData.title = title.toString();
    if (description !== undefined) updateData.description = description?.toString() ?? "";
    if (icon_svg !== undefined) updateData.icon_svg = icon_svg;
    if (display_order !== undefined) updateData.display_order = Number(display_order);
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);
    updateData.updated_at = new Date();

    const entry = await prisma.timeline_entries.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    broadcast("session_changed", { id: entry.id.toString() });

    res.json({
      success: true,
      message: "Timeline entry updated successfully",
      data: serializeTimelineEntry(entry),
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

    await prisma.timeline_entries.delete({
      where: { id: BigInt(id) },
    });

    broadcast("session_changed", { id: parseInt(id) });

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
