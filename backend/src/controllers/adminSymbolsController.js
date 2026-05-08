const multer = require("multer");
const prisma = require("../lib/prisma");
const { uploadToCloudinary } = require("../utils/imageUpload");

// Memory storage — no temp files; buffer goes straight to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type. Only images are allowed."));
  },
});

exports.upload = upload;

// POST /api/admin/symbols
// multipart/form-data: publisher_name (string) + logo (image file)
exports.createSymbol = async (req, res, next) => {
  try {
    const publisher_name = req.body.publisher_name?.trim();

    if (!publisher_name) {
      return res.status(400).json({ error: "Invalid input", message: "publisher_name is required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Invalid input", message: "logo file is required" });
    }

    // Uniqueness check (case-insensitive)
    const existing = await prisma.symbol.findFirst({
      where: { publisher_name: { equals: publisher_name, mode: "insensitive" } },
    });
    if (existing) {
      return res.status(409).json({ error: "Conflict", message: "publisher_name already exists in the Symbol table" });
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "srl/publisher_logos",
      req.file.originalname
    );

    const symbol = await prisma.symbol.create({
      data: { publisher_name, logo_url: uploadResult.url },
    });

    res.status(201).json({
      success: true,
      data: {
        id: symbol.id,
        publisher_name: symbol.publisher_name,
        logo_url: symbol.logo_url,
      },
    });
  } catch (err) {
    console.error("Create symbol error:", err);
    next(err);
  }
};
