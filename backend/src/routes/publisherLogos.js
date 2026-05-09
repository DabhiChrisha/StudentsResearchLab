const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

// GET /api/publisher-logos — list all active publishers (id + name only, no logo_url)
router.get("/api/publisher-logos", async (req, res, next) => {
  try {
    const publishers = await prisma.symbol.findMany({
      where: { is_active: true },
      select: { id: true, publisher_name: true },
      orderBy: { id: "asc" },
    });
    res.json({ success: true, data: publishers });
  } catch (err) {
    next(err);
  }
});

// GET /api/publisher-logos/:id — single publisher with logo_url
router.get("/api/publisher-logos/:id", async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid input", message: "Invalid publisher id" });
    }

    const publisher = await prisma.symbol.findUnique({ where: { id } });

    if (!publisher) {
      return res.status(404).json({ error: "Not found", message: "Publisher not found" });
    }

    res.json({
      success: true,
      data: {
        id: publisher.id,
        publisher: publisher.publisher_name,
        logo_url: publisher.logo_url,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
