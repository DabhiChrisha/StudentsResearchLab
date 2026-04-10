const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

const mapTimelineIcon = (row, index) => {
  if (index === 0) return "beginning";
  if (row?.category === "success") return "alumni";
  if (row?.category === "learning") return "theory";
  return "impactthon";
};

router.get("/timeline", async (req, res, next) => {
  try {
    const data = await prisma.sessionContent.findMany({
      select: {
        id: true,
        serial_no: true,
        title: true,
        description: true,
        category: true,
        type: true,
        date_raw: true,
        session_date: true,
      },
      orderBy: { serial_no: "asc" },
    });

    const timeline = (data || []).map((row, index) => ({
      id: row.id,
      step: row.serial_no,
      title: row.title,
      description: row.description || "",
      icon: mapTimelineIcon(row, index),
      category: row.category,
      type: row.type,
      date_raw: row.date_raw,
      session_date: row.session_date,
    }));

    res.json({ data: timeline });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
