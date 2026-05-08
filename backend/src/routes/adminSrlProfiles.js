const express = require('express');
const {
  getAllProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  restoreProfile,
} = require('../controllers/adminSrlProfilesController');
const { adminAuthMiddleware, authenticatedUserMiddleware } = require('../middleware/adminAuth');

const router = express.Router();

// Read access: authenticated users (admin OR member)
router.get('/api/admin/srl-profiles',                authenticatedUserMiddleware, getAllProfiles);
router.get('/api/admin/srl-profiles/:enrollmentNo',  authenticatedUserMiddleware, getProfile);

// Write access: admin only
router.post('/api/admin/srl-profiles',                           adminAuthMiddleware, createProfile);
router.put('/api/admin/srl-profiles/:enrollmentNo',              adminAuthMiddleware, updateProfile);
router.delete('/api/admin/srl-profiles/:enrollmentNo',           adminAuthMiddleware, deleteProfile);
router.put('/api/admin/srl-profiles/:enrollmentNo/restore',      adminAuthMiddleware, restoreProfile);

module.exports = router;
