const multer = require("multer");
const prisma = require("../lib/prisma");
const { uploadToCloudinary } = require("../utils/imageUpload");

// Memory storage — no temp files; buffer goes straight to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Invalid file type. Only PDF files are allowed."));
  },
});

exports.upload = upload;

// GET /api/admin/guidelines — all years, newest first
exports.getAllGuidelines = async (req, res, next) => {
  try {
    const guidelines = await prisma.guideline.findMany({
      orderBy: { year: "desc" },
    });
    res.json({ success: true, data: guidelines });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/guidelines
// multipart/form-data: year (number) + pdf (file)
// One guideline per year — replaces the existing PDF for that year instead of creating a duplicate.
exports.upsertGuideline = async (req, res, next) => {
  try {
    const year = parseInt(req.body.year, 10);

    if (!year || Number.isNaN(year)) {
      return res.status(400).json({ error: "Invalid input", message: "year is required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Invalid input", message: "pdf file is required" });
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "srl/guidelines",
      `guidelines_${year}`,
      "raw",
      req.file.mimetype
    );

    const guideline = await prisma.guideline.upsert({
      where: { year },
      update: { pdf_url: uploadResult.url, public_id: uploadResult.public_id, uploaded_at: new Date() },
      create: { year, pdf_url: uploadResult.url, public_id: uploadResult.public_id },
    });

    res.status(200).json({ success: true, data: guideline });
  } catch (err) {
    next(err);
  }
};
