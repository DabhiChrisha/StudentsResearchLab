const prisma = require('../lib/prisma');

// srl_student_profiles has been dropped. These routes now proxy to member_cv_profiles.

const serializeForJson = (value) =>
  JSON.parse(
    JSON.stringify(value, (_key, val) => (typeof val === 'bigint' ? val.toString() : val))
  );

exports.getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await prisma.memberCvProfile.findMany({
      orderBy: { updated_at: 'desc' },
    });
    res.json({ success: true, count: profiles.length, data: serializeForJson(profiles) });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const { enrollmentNo } = req.params;
    const profile = await prisma.memberCvProfile.findUnique({
      where: { enrollment_no: enrollmentNo.trim().toUpperCase() },
    });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Not found', message: 'Profile not found' });
    }
    res.json({ success: true, data: serializeForJson(profile) });
  } catch (err) {
    next(err);
  }
};

exports.createProfile   = async (req, res, next) => res.status(410).json({ success: false, message: 'Use /api/admin/member-cv instead' });
exports.updateProfile   = async (req, res, next) => res.status(410).json({ success: false, message: 'Use /api/admin/member-cv instead' });
exports.deleteProfile   = async (req, res, next) => res.status(410).json({ success: false, message: 'Use /api/admin/member-cv instead' });
exports.restoreProfile  = async (req, res, next) => res.status(410).json({ success: false, message: 'Use /api/admin/member-cv instead' });
