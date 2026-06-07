const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Vercel serverless functions can only write to /tmp at runtime.
const uploadsDir =
  process.env.VERCEL || process.env.NODE_ENV === "production"
    ? path.join(os.tmpdir(), "uploads")
    : path.join(__dirname, "../../uploads");

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const ALLOWED_MIMES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'image/svg+xml', 'image/avif', 'image/bmp', 'image/tiff',
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm',
]);
const ALLOWED_EXTS = /\.(jpeg|jpg|png|gif|webp|svg|avif|bmp|tiff|tif|mp4|mov|avi|mkv|webm)$/i;

const fileFilter = (req, file, cb) => {
  const extOk = ALLOWED_EXTS.test(path.extname(file.originalname));
  const mimeOk = ALLOWED_MIMES.has(file.mimetype);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error('File type not supported'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

module.exports = upload;
