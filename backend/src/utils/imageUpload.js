const cloudinary = require("cloudinary").v2;
require("../config/env");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MIME types that are images and should be force-converted to WebP.
// Videos and raw files are uploaded as-is.
const IMAGE_MIMES = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/gif",
  "image/webp", "image/avif", "image/bmp",
  "image/tiff", "image/tif", "image/heic", "image/heif",
]);

/**
 * Returns true when the MIME type is a raster image that Cloudinary can
 * convert to WebP. SVG is excluded — it stays as SVG.
 */
const isConvertibleImage = (mimeType) =>
  mimeType ? IMAGE_MIMES.has(mimeType.toLowerCase()) : false;

/**
 * Upload a file buffer to Cloudinary.
 *
 * For every raster image (JPEG, PNG, GIF, WebP, AVIF, BMP, TIFF …) the file
 * is converted to WebP server-side by Cloudinary before storage.
 * Videos and raw files are uploaded without conversion.
 *
 * @param {Buffer}  fileBuffer   - Multer memory buffer
 * @param {string}  folder       - Cloudinary folder (e.g. "srl/activities")
 * @param {string}  fileName     - Original file name (used to build public_id)
 * @param {string}  resourceType - "image" | "video" | "raw" | "auto"
 * @param {string}  [mimeType]   - MIME type; when provided, drives WebP conversion decision
 * @returns {Promise<{success, url, public_id, cloudinary_id}>}
 */
const uploadToCloudinary = async (
  fileBuffer,
  folder = "srl/uploads",
  fileName = "image",
  resourceType = "auto",
  mimeType = null
) => {
  return new Promise((resolve, reject) => {
    const safeFileName = fileName
      .split(".")[0]
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    // Determine whether to convert to WebP.
    // Convert when:
    //   - resourceType is explicitly "image", OR
    //   - resourceType is "auto" and the MIME type is a known raster image
    const convertToWebp =
      resourceType === "image" ||
      (resourceType === "auto" && isConvertibleImage(mimeType));

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      public_id: `${Date.now()}_${safeFileName}`,
      overwrite: true,
      // WebP conversion + quality optimisation for images only
      ...(convertToWebp && {
        format: "webp",
        quality: "auto:best",
      }),
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
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
 * Delete an asset from Cloudinary.
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return { success: true, result };
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Extract the Cloudinary public_id from a secure_url.
 */
const extractPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return null;
  try {
    const parts = cloudinaryUrl.split("/upload/");
    if (parts.length < 2) return null;
    let p = parts[1].replace(/^v\d+\//, "");
    return p.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
};
