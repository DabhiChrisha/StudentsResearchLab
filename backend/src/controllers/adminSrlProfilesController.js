const prisma = require('../lib/prisma');

// ─── helpers ─────────────────────────────────────────────────────────────────

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const t = val.trim();
    if (!t || t === '[]') return [];
    try { return JSON.parse(t); } catch (_) {}
    return t.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function jsonOrNull(val) {
  if (val === undefined || val === null) return null;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch (_) { return null; }
}

// ─── GET all profiles ─────────────────────────────────────────────────────────

exports.getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await prisma.srlStudentProfile.findMany({
      where: { is_active: true },
      orderBy: { updated_at: 'desc' },
    });

    res.json({ success: true, count: profiles.length, data: profiles });
  } catch (err) {
    next(err);
  }
};

// ─── GET single profile by enrollment_no ─────────────────────────────────────

exports.getProfile = async (req, res, next) => {
  try {
    const { enrollmentNo } = req.params;

    const profile = await prisma.srlStudentProfile.findUnique({
      where: { enrollment_no: enrollmentNo.trim().toUpperCase() },
    });

    if (!profile || !profile.is_active) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'SRL student profile not found',
      });
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

// ─── POST create profile ──────────────────────────────────────────────────────

exports.createProfile = async (req, res, next) => {
  try {
    const {
      enrollment_no,
      linkedin,
      roles,
      reflection,
      research_areas,
      ongoing_research,
      research_works,
      achievements,
      papers_published,
      hackathons,
      srl_publications,
      achievements_extended,
      metadata,
    } = req.body;

    const en = (enrollment_no || '').trim().toUpperCase();

    if (!en) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'enrollment_no is required',
      });
    }

    // Verify the student exists in students_details
    const student = await prisma.studentsDetail.findUnique({
      where: { enrollment_no: en },
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `No student found with enrollment_no ${en}. Create the student first.`,
      });
    }

    // Check for soft-deleted existing record
    const existing = await prisma.srlStudentProfile.findUnique({
      where: { enrollment_no: en },
    });
    if (existing) {
      if (existing.is_active) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'A profile already exists for this student. Use PUT to update it.',
        });
      }
      // Restore soft-deleted record instead of creating a new one
      const restored = await prisma.srlStudentProfile.update({
        where: { enrollment_no: en },
        data: {
          linkedin:              linkedin || null,
          roles:                 toArray(roles),
          reflection:            reflection || null,
          research_areas:        toArray(research_areas),
          ongoing_research:      toArray(ongoing_research),
          research_works:        toArray(research_works),
          achievements:          toArray(achievements),
          papers_published:      toArray(papers_published),
          hackathons:            toArray(hackathons),
          srl_publications:      toArray(srl_publications),
          achievements_extended: jsonOrNull(achievements_extended),
          metadata:              jsonOrNull(metadata),
          is_active:             true,
          deleted_at:            null,
          updated_at:            new Date(),
          updated_by:            req.admin?.email || null,
        },
      });
      return res.status(201).json({
        success: true,
        message: 'Profile restored from soft-delete',
        data: restored,
      });
    }

    const profile = await prisma.srlStudentProfile.create({
      data: {
        enrollment_no:         en,
        linkedin:              linkedin || null,
        roles:                 toArray(roles),
        reflection:            reflection || null,
        research_areas:        toArray(research_areas),
        ongoing_research:      toArray(ongoing_research),
        research_works:        toArray(research_works),
        achievements:          toArray(achievements),
        papers_published:      toArray(papers_published),
        hackathons:            toArray(hackathons),
        srl_publications:      toArray(srl_publications),
        achievements_extended: jsonOrNull(achievements_extended),
        metadata:              jsonOrNull(metadata),
        created_by:            req.admin?.email || null,
        updated_by:            req.admin?.email || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'SRL student profile created',
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// ─── PUT update profile ───────────────────────────────────────────────────────

exports.updateProfile = async (req, res, next) => {
  try {
    const { enrollmentNo } = req.params;
    const en = (enrollmentNo || '').trim().toUpperCase();

    const existing = await prisma.srlStudentProfile.findUnique({
      where: { enrollment_no: en },
    });

    if (!existing || !existing.is_active) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'SRL student profile not found',
      });
    }

    const {
      linkedin,
      roles,
      reflection,
      research_areas,
      ongoing_research,
      research_works,
      achievements,
      papers_published,
      hackathons,
      srl_publications,
      achievements_extended,
      metadata,
    } = req.body;

    const updateData = { updated_at: new Date(), updated_by: req.admin?.email || null };

    // Only overwrite fields that were explicitly provided in the request body
    if (linkedin           !== undefined) updateData.linkedin              = linkedin || null;
    if (roles              !== undefined) updateData.roles                 = toArray(roles);
    if (reflection         !== undefined) updateData.reflection            = reflection || null;
    if (research_areas     !== undefined) updateData.research_areas        = toArray(research_areas);
    if (ongoing_research   !== undefined) updateData.ongoing_research      = toArray(ongoing_research);
    if (research_works     !== undefined) updateData.research_works        = toArray(research_works);
    if (achievements       !== undefined) updateData.achievements          = toArray(achievements);
    if (papers_published   !== undefined) updateData.papers_published      = toArray(papers_published);
    if (hackathons         !== undefined) updateData.hackathons            = toArray(hackathons);
    if (srl_publications   !== undefined) updateData.srl_publications      = toArray(srl_publications);
    if (achievements_extended !== undefined) updateData.achievements_extended = jsonOrNull(achievements_extended);
    if (metadata           !== undefined) updateData.metadata              = jsonOrNull(metadata);

    const profile = await prisma.srlStudentProfile.update({
      where: { enrollment_no: en },
      data: updateData,
    });

    res.json({ success: true, message: 'Profile updated', data: profile });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE profile (soft delete) ────────────────────────────────────────────

exports.deleteProfile = async (req, res, next) => {
  try {
    const { enrollmentNo } = req.params;
    const en = (enrollmentNo || '').trim().toUpperCase();

    const existing = await prisma.srlStudentProfile.findUnique({
      where: { enrollment_no: en },
    });

    if (!existing || !existing.is_active) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'SRL student profile not found',
      });
    }

    await prisma.srlStudentProfile.update({
      where: { enrollment_no: en },
      data: {
        is_active:  false,
        deleted_at: new Date(),
        updated_by: req.admin?.email || null,
      },
    });

    res.json({ success: true, message: 'Profile soft-deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── PUT restore soft-deleted profile ────────────────────────────────────────

exports.restoreProfile = async (req, res, next) => {
  try {
    const { enrollmentNo } = req.params;
    const en = (enrollmentNo || '').trim().toUpperCase();

    const existing = await prisma.srlStudentProfile.findUnique({
      where: { enrollment_no: en },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'SRL student profile not found',
      });
    }

    if (existing.is_active) {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Profile is not deleted',
      });
    }

    const profile = await prisma.srlStudentProfile.update({
      where: { enrollment_no: en },
      data: {
        is_active:  true,
        deleted_at: null,
        updated_at: new Date(),
        updated_by: req.admin?.email || null,
      },
    });

    res.json({ success: true, message: 'Profile restored', data: profile });
  } catch (err) {
    next(err);
  }
};
