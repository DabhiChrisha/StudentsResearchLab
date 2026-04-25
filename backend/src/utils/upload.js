const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * Upload a local file to Cloudinary and return the secure_url.
 * Deletes the temp file after upload (success or failure).
 */
async function uploadMedia(filePath, folder = 'srl') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto', // handles images AND videos
    });
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return result.secure_url;
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw err;
  }
}

module.exports = { uploadMedia };
