const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/sessions", async (req, res, next) => {
  try {
    const data = await prisma.sessionContent.findMany({
      orderBy: { serial_no: "desc" },
    });
    res.json({ sessions: data || [] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
