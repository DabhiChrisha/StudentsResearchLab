const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

const mapTimelineIcon = (row, index) => {
  if (index === 0) return "beginning";
  const text = `${row?.title || ""} ${row?.description || ""}`.toLowerCase();
  if (text.includes("alumni")) return "alumni";
  if (text.includes("theory") || text.includes("practice")) return "theory";
  return "impactthon";
};

router.get("/api/timeline", async (req, res, next) => {
  try {
    const data = await prisma.timeline_entries.findMany({
      select: {
        id: true,
        step: true,
        title: true,
        description: true,
        icon_svg: true,
        display_order: true,
        is_active: true,
      },
      where: { is_active: true },
      orderBy: { display_order: "asc" },
    });

    const timeline = (data || []).map((row, index) => ({
      id: row.id.toString(),
      step: row.step,
      title: row.title,
      description: row.description || "",
      icon: mapTimelineIcon(row, index),
      icon_svg: row.icon_svg,
      display_order: row.display_order,
    }));

    res.json({ data: timeline });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
