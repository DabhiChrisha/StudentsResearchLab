const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/imageUpload");
const multer = require("multer");

// Configure multer for memory storage (not disk)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files (JPEG, PNG, GIF, WebP)
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Only images are allowed.`));
    }
  },
});

// Multer instance for the shared upload endpoint — supports images and videos up to 100 MB
const uploadAny = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "video/mp4", "video/quicktime", "video/avi", "video/webm", "video/x-matroska",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MOV, AVI, WebM, MKV) are allowed."));
    }
  },
});

// Maps the optional `section` body field to Cloudinary folder names
const SECTION_FOLDER_MAP = {
  activity: "srl_activities",
  achievement: "srl_achievements",
  student: "srl_students",
  certificate: "srl_certificates",
};

// Multer instance for certificate uploads — images only (PDF converted on frontend), max 10MB
const uploadCertificate = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only image files are allowed for certificates. PDF files must be converted to images before uploading."));
    }
  },
});

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        message: "Please provide a file to upload",
      });
    }

    // Validate file size
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (req.file.size > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        error: "File too large",
        message: `File size must not exceed 10MB. Your file is ${(req.file.size / (1024 * 1024)).toFixed(2)}MB`,
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "srl_admin",
      req.file.originalname
    );

    return res.status(200).json({
      success: true,
      data: {
        url: uploadResult.url,
        public_id: uploadResult.cloudinary_id,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({
      success: false,
      error: "Upload failed",
      message: error.message || "Failed to upload image to Cloudinary",
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        error: "Invalid request",
        message: "public_id is required",
      });
    }

    const deleteResult = await deleteFromCloudinary(public_id);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: deleteResult,
    });
  } catch (error) {
    console.error("Image deletion error:", error);
    return res.status(500).json({
      success: false,
      error: "Deletion failed",
      message: error.message || "Failed to delete image from Cloudinary",
    });
  }
};

/**
 * POST /api/admin/upload
 * Generic media upload — uploads to Cloudinary and returns the URL.
 * The admin portal stores the returned URL and passes it when creating/updating records.
 *
 * Body fields:
 *   file        (multipart) — required
 *   section     (string)    — "activity" | "achievement" | "student" (optional, defaults to srl_admin)
 *   mediaType   (string)    — "image" | "video" (informational only; type is auto-detected)
 *
 * Response: { success: true, data: { url, publicId, resourceType } }
 */
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        message: "Please provide a file to upload",
      });
    }

    const { section } = req.body;
    const folder = SECTION_FOLDER_MAP[section] || "srl_admin";
    const resourceType = req.file.mimetype.startsWith("video/") ? "video" : "image";

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      folder,
      req.file.originalname
    );

    return res.status(200).json({
      success: true,
      data: {
        url: uploadResult.url,
        publicId: uploadResult.public_id,
        resourceType,
      },
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

/**
 * POST /api/admin/upload-certificate
 * Uploads a single certificate image to Cloudinary (srl_certificates folder).
 * PDF → image conversion is handled on the frontend before this endpoint is called.
 * Accessible by any authenticated user (not just admins).
 *
 * Body fields:
 *   file  (multipart) — required, must be an image
 *
 * Response: { success: true, data: { url, publicId } }
 */
const uploadCertificateHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        message: "Please provide an image file to upload.",
      });
    }

    // Backend size validation (belt-and-suspenders after multer limit)
    const MAX_CERT_SIZE = 10 * 1024 * 1024; // 10MB
    if (req.file.size > MAX_CERT_SIZE) {
      return res.status(400).json({
        success: false,
        error: "File too large",
        message: `Certificate size must be less than or equal to 10MB. Your file is ${(req.file.size / (1024 * 1024)).toFixed(2)}MB.`,
      });
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "srl_certificates",
      req.file.originalname,
      "image"
    );

    return res.status(200).json({
      success: true,
      data: {
        url: uploadResult.url,
        publicId: uploadResult.public_id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Certificate upload failed.",
    });
  }
};

module.exports = {
  upload,
  uploadAny,
  uploadCertificate,
  uploadImage,
  uploadMedia,
  uploadCertificateHandler,
  deleteImage,
};
