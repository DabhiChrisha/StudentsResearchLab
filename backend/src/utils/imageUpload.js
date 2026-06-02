const cloudinary = require("cloudinary").v2;
require("../config/env");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} folder - Cloudinary folder name
 * @param {String} fileName - Original file name
 * @returns {Promise} - Cloudinary upload response
 */
const uploadToCloudinary = async (fileBuffer, folder = "srl_admin", fileName = "image", resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    // Sanitize fileName to only contain alphanumeric characters, underscores, and dashes
    const safeFileName = fileName.split(".")[0].replace(/[^a-zA-Z0-9_-]/g, "_");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        public_id: `${folder}_${Date.now()}_${safeFileName}`,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            cloudinary_id: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @param {String} resourceType - Cloudinary resource type (e.g. image, raw)
 * @returns {Promise} - Cloudinary delete response
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return { success: true, result };
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {String} cloudinaryUrl - Cloudinary URL
 * @returns {String|null} - Public ID
 */
const extractPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return null;
  try {
    const parts = cloudinaryUrl.split("/upload/");
    if (parts.length < 2) return null;
    let path = parts[1];
    // Remove version like v1234567890/
    if (path.match(/^v\d+\//)) {
      path = path.replace(/^v\d+\//, "");
    }
    // Remove file extension
    path = path.replace(/\.[^/.]+$/, "");
    return path;
  } catch (error) {
    return null;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
};
