const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * Upload a local temp file to Cloudinary and return the secure_url.
 * Images are converted to WebP automatically via the `format` transformation.
 * Videos are uploaded as-is. Temp file is deleted after upload.
 */
async function uploadMedia(filePath, folder = 'srl/uploads') {
  const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(filePath);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: isVideo ? 'video' : 'image',
      // Convert every non-video upload to WebP server-side
      ...(!isVideo && { format: 'webp', quality: 'auto:best' }),
    });
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return result.secure_url;
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw err;
  }
}

module.exports = { uploadMedia };
