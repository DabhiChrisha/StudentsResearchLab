const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

// GET /api/guidelines — latest guideline PDF (public, used by the frontend Guidelines button)
router.get("/api/guidelines", async (req, res, next) => {
  try {
    const guideline = await prisma.guideline.findFirst({
      orderBy: { year: "desc" },
    });

    if (!guideline) {
      return res.status(404).json({ error: "Not found", message: "No guidelines uploaded yet" });
    }

    res.json({ success: true, data: guideline });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
