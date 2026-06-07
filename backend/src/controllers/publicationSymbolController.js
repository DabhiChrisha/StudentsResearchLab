const multer = require('multer');
const prisma = require('../lib/prisma');
const { uploadToCloudinary } = require('../utils/imageUpload');

// Memory storage — no temp files on disk; buffer goes straight to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'image/webp', 'image/avif', 'image/bmp', 'image/tiff', 'image/svg+xml',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, AVIF, BMP, TIFF or SVG images are accepted.'));
  },
});

exports.upload = upload;

// ── GET /api/publication-symbol ────────────────────────────────────────────────
// Returns all active publishers (id + name + logo_url) for dropdown population.
exports.listPublishers = async (req, res, next) => {
  try {
    const publishers = await prisma.symbol.findMany({
      where: { is_active: true },
      select: { id: true, publisher_name: true, logo_url: true },
      orderBy: { id: 'asc' },
    });
    res.json({ success: true, data: publishers });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/publication-symbol/:id ───────────────────────────────────────────
// Returns a single publisher with its logo_url.
// Used by the frontend immediately after the user selects a predefined publisher.
exports.getPublisher = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'publisher id must be a positive integer',
      });
    }

    const symbol = await prisma.symbol.findUnique({ where: { id } });

    if (!symbol) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `No publisher found with id ${id}`,
      });
    }

    if (!symbol.is_active) {
      return res.status(410).json({
        success: false,
        error: 'Gone',
        message: `Publisher with id ${id} is no longer active`,
      });
    }

    res.json({
      success:        true,
      symbol_id:      symbol.id,
      publisher_name: symbol.publisher_name,
      logo_url:       symbol.logo_url || null,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/publication-symbol/upload-public ────────────────────────────────
// Called when a public user selects "Other" in the Add Publication form.
// No admin auth required — the publication itself goes through PENDING approval.
// Accepts multipart/form-data: { publisher_name: string, logo: <image file> }
exports.uploadCustomLogoPublic = async (req, res, next) => {
  try {
    const publisher_name = req.body.publisher_name?.trim();

    if (!publisher_name) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'publisher_name is required',
      });
    }
    if (publisher_name.length > 200) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'publisher_name must be 200 characters or fewer',
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'logo file is required',
      });
    }

    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(
        req.file.buffer,
        'srl/logos',
        req.file.originalname,
        'image',
        req.file.mimetype,
      );
    } catch (uploadErr) {
      return res.status(502).json({
        success: false,
        error: 'Upload failed',
        message: 'Could not upload logo to Cloudinary. Please try again.',
      });
    }

    const symbol = await prisma.symbol.upsert({
      where:  { publisher_name },
      update: { logo_url: uploadResult.url, is_active: true },
      create: { publisher_name, logo_url: uploadResult.url },
    });

    res.status(201).json({
      success:        true,
      symbol_id:      symbol.id,
      publisher_name: symbol.publisher_name,
      logo_url:       symbol.logo_url,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/publication-symbol/upload ───────────────────────────────────────
// Called when admin selects "Other" in the Add Publication form.
// Accepts multipart/form-data: { publisher_name: string, logo: <image file> }
// Uploads to Cloudinary, upserts a Symbol row, and returns the symbol_id + logo_url
// so the frontend can include publisher_logo_id in the publication create payload.
exports.uploadCustomLogo = async (req, res, next) => {
  try {
    const publisher_name = req.body.publisher_name?.trim();

    if (!publisher_name) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'publisher_name is required',
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'logo file is required',
      });
    }

    // Upload logo to Cloudinary under publication-symbols/
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(
        req.file.buffer,
        'srl/logos',
        req.file.originalname,
        'image',
        req.file.mimetype,
      );
    } catch (uploadErr) {
      return res.status(502).json({
        success: false,
        error: 'Upload failed',
        message: 'Could not upload logo to Cloudinary. Please try again.',
      });
    }

    // Upsert Symbol row — handles retries with the same publisher name gracefully
    const symbol = await prisma.symbol.upsert({
      where:  { publisher_name },
      update: { logo_url: uploadResult.url, is_active: true },
      create: { publisher_name, logo_url: uploadResult.url },
    });

    res.status(201).json({
      success:        true,
      symbol_id:      symbol.id,
      publisher_name: symbol.publisher_name,
      logo_url:       symbol.logo_url,
    });
  } catch (err) {
    next(err);
  }
};
