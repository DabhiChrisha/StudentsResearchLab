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

module.exports = {
  upload,
  uploadImage,
  deleteImage,
};
