const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/achievements", async (req, res, next) => {
  try {
    const data = await prisma.achievementContent.findMany({
      orderBy: { serial_no: "desc" },
    });
    res.json({ achievements: data || [] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
