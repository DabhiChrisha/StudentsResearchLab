const prisma = require("../lib/prisma");
const { broadcast } = require("../utils/sseManager");

const serializeForJson = (value) =>
  JSON.parse(
    JSON.stringify(value, (_key, val) => (typeof val === "bigint" ? val.toString() : val))
  );

/**
 * GET /api/admin/member-cv?enrollment_no=...
 */
exports.getMemberCVByEnrollment = async (req, res, next) => {
  try {
    const { enrollment_no } = req.query;
    const requestUser = req.user;

    if (!enrollment_no) {
      return res.status(400).json({
        success: false,
        message: "enrollment_no query parameter is required",
      });
    }

    if (requestUser && !requestUser.isAdmin) {
      const requestedEnrollment = String(enrollment_no);
      const userEnrollment = String(requestUser.enrollmentNo || "");
      if (!userEnrollment || requestedEnrollment !== userEnrollment) {
        return res.status(403).json({ success: false, message: "You can only view your own profile" });
      }
    }

    const memberCV = await prisma.memberCvProfile.findUnique({
      where: { enrollment_no: String(enrollment_no) },
      include: { students_details: { select: { profile_image: true } } },
    });

    if (!memberCV) {
      return res.json({ success: true, data: null, message: "No CV profile found - using defaults" });
    }

    const serialized = serializeForJson(memberCV);
    // Merge profile_image from students_details so the frontend can display it
    serialized.profile_image = memberCV.students_details?.profile_image || null;

    res.json({ success: true, data: serialized });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/member-cv
 */
exports.updateMemberCV = async (req, res, next) => {
  try {
    const {
      enrollment_no,
      student_name,
      linkedin_id,
      semester,
      department,
      institute,
      organization,
      reflection,
      profile_image,
      research_areas,
      hackathons,
      research_papers,
      research_work,
      leadership,
      awards,
      certifications,
      additional_achievements,
      internships,
    } = req.body;

    if (!enrollment_no) {
      return res.status(400).json({ success: false, message: "enrollment_no is required" });
    }

    const requestUser = req.user;
    if (requestUser && !requestUser.isAdmin) {
      if (String(enrollment_no) !== String(requestUser.enrollmentNo || "")) {
        return res.status(403).json({ success: false, message: "You can only edit your own profile" });
      }
    }

    const existingMemberCV = await prisma.memberCvProfile.findUnique({
      where: { enrollment_no: String(enrollment_no) },
      select: { id: true },
    });

    let memberCV;

    const cvData = {
      student_name:            student_name            || undefined,
      linkedin_id:             linkedin_id             ?? null,
      semester:                semester                ?? null,
      department:              department              ?? null,
      institute:               institute               ?? null,
      organization:            organization            ?? null,
      reflection:              reflection              ?? null,
      research_areas:          research_areas          || [],
      hackathons:              hackathons              || [],
      research_papers:         research_papers         || [],
      research_work:           research_work           || [],
      leadership:              leadership              || [],
      awards:                  awards                  || [],
      certifications:          certifications          || [],
      additional_achievements: additional_achievements || [],
      internships:             internships             || [],
    };

    if (existingMemberCV) {
      memberCV = await prisma.memberCvProfile.update({
        where: { enrollment_no: String(enrollment_no) },
        data: { ...cvData, updated_at: new Date() },
      });
    } else {
      // For create, student_name is required — use "Unknown" as fallback
      const { student_name: _sn, ...cvDataWithoutName } = cvData;
      memberCV = await prisma.memberCvProfile.create({
        data: {
          enrollment_no: String(enrollment_no),
          student_name:  student_name || "Unknown",
          ...cvDataWithoutName,
        },
      });
    }

    // profile_image lives in students_details — update it there if provided
    if (profile_image !== undefined) {
      await prisma.studentsDetail.update({
        where: { enrollment_no: String(enrollment_no) },
        data: { profile_image: profile_image || null },
      });
    }

    broadcast("student_changed", { enrollment_no: String(enrollment_no) });

    res.json({ success: true, data: serializeForJson(memberCV), message: "CV profile updated successfully" });
  } catch (error) {
    console.error("[Member CV] Update error:", error);
    next(error);
  }
};

/**
 * GET /api/admin/member-cv/all  (admin only)
 */
exports.getAllMemberCVs = async (req, res, next) => {
  try {
    const memberCVs = await prisma.memberCvProfile.findMany({
      orderBy: { updated_at: "desc" },
    });

    res.json({ success: true, data: serializeForJson(memberCVs), count: memberCVs.length });
  } catch (error) {
    next(error);
  }
};
