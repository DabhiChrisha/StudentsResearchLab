const express = require("express");
const prisma = require("../config/prisma");
const upload = require("../middleware/multer");
const { uploadMedia } = require("../utils/upload");

const router = express.Router();

// GET /api/activities
router.get("/api/activities", async (req, res, next) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { sequence: "asc" },
    });
    res.json({ data: activities });
  } catch (err) {
    next(err);
  }
});

// POST /api/activities/:id/photo — upload/replace photo for an activity
router.post("/api/activities/:id/photo", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const id = parseInt(req.params.id);
    const photo_url = await uploadMedia(req.file.path, "srl/activities");

    const updated = await prisma.activity.update({
      where: { id },
      data: { Photo: photo_url },
    });

    res.json({ photo_url, activity: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
