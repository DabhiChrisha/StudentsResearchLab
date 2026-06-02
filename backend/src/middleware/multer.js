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

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg|mp4|mov|avi|mkv|webm/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) cb(null, true);
  else cb(new Error('File type not supported'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

module.exports = upload;
