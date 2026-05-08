const express = require('express');
const {
  listPublishers,
  getPublisher,
  uploadCustomLogo,
  upload,
} = require('../controllers/publicationSymbolController');
const { adminAuthMiddleware } = require('../middleware/adminAuth');

const router = express.Router();

// Public — frontend calls these to populate the publisher dropdown and fetch logos
router.get('/api/publication-symbol',      listPublishers);
router.get('/api/publication-symbol/:id',  getPublisher);

// Admin-only — called when admin selects "Other" and uploads a custom publisher logo.
// Returns symbol_id + logo_url; frontend includes symbol_id as publisher_logo_id
// in the subsequent POST /api/admin/publication request.
router.post(
  '/api/publication-symbol/upload',
  adminAuthMiddleware,
  upload.single('logo'),
  uploadCustomLogo,
);

module.exports = router;
