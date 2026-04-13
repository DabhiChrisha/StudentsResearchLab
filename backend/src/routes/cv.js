const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/api/cv/:enrollment_no", async (req, res, next) => {
  try {
    const { enrollment_no } = req.params;

    const cv = await prisma.memberCvProfile.findUnique({
      where: { enrollment_no: String(enrollment_no).toUpperCase() },
    });

    if (!cv) {
      return res.status(404).json({
        detail: `CV profile not found for enrollment: ${enrollment_no}`,
      });
    }

    res.json({ data: cv });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
