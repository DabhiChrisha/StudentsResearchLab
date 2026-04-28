const prisma = require("../lib/prisma");

const serializeForJson = (value) =>
  JSON.parse(
    JSON.stringify(value, (_key, val) => (typeof val === "bigint" ? val.toString() : val))
  );

/**
 * Get member CV by enrollment - GET /api/admin/member-cv?enrollment_no=...
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

    // Members can view only their own CV profile.
    if (requestUser && !requestUser.isAdmin) {
      const requestedEnrollment = String(enrollment_no);
      const userEnrollment = String(requestUser.enrollmentNo || "");

      if (!userEnrollment || requestedEnrollment !== userEnrollment) {
        return res.status(403).json({
          success: false,
          message: "You can only view your own profile",
        });
      }
    }

    const memberCV = await prisma.MemberCvProfile.findUnique({
      where: { enrollment_no: String(enrollment_no) },
    });

    if (!memberCV) {
      return res.json({
        success: true,
        data: null,
        message: "No CV profile found - using defaults",
      });
    }

    res.json({
      success: true,
      data: serializeForJson(memberCV),
    });
  } catch (error) {
    console.error("Get member CV error:", error);
    next(error);
  }
};

/**
 * Update member CV - PUT /api/admin/member-cv
 */
exports.updateMemberCV = async (req, res, next) => {
  try {
    const {
      enrollment_no,
      student_name,
      research_work_summary,
      research_area,
      hackathons,
      research_papers,
      patents,
      projects,
      updated_by,
    } = req.body;

    if (!enrollment_no) {
      return res.status(400).json({
        success: false,
        message: "enrollment_no is required",
      });
    }

    // Check if member trying to edit is only editing their own profile
    const requestUser = req.user;
    if (requestUser && !requestUser.isAdmin) {
      // Member can only edit their own profile
      if (String(enrollment_no) !== String(requestUser.enrollmentNo || "")) {
        return res.status(403).json({
          success: false,
          message: "You can only edit your own profile",
        });
      }
    }

    const existingMemberCV = await prisma.MemberCvProfile.findUnique({
      where: { enrollment_no: String(enrollment_no) },
      select: { id: true },
    });

    let memberCV;

    if (existingMemberCV) {
      memberCV = await prisma.MemberCvProfile.update({
        where: { enrollment_no: String(enrollment_no) },
        data: {
          student_name: student_name || undefined,
          research_work_summary: research_work_summary || null,
          research_area: research_area || null,
          hackathons: hackathons || [],
          research_papers: research_papers || [],
          patents: patents || [],
          projects: projects || [],
          updated_by: updated_by || requestUser?.email || null,
          updated_at: new Date(),
        },
      });
    } else {
      const maxIdResult = await prisma.$queryRaw`
        SELECT COALESCE(MAX(id), 0) AS max_id
        FROM member_cv_profiles
      `;
      const maxId = Array.isArray(maxIdResult) && maxIdResult[0] ? BigInt(maxIdResult[0].max_id || 0) : 0n;

      memberCV = await prisma.MemberCvProfile.create({
        data: {
          id: maxId + 1n,
          enrollment_no: String(enrollment_no),
          student_name: student_name || "Unknown",
          research_work_summary: research_work_summary || null,
          research_area: research_area || null,
          hackathons: hackathons || [],
          research_papers: research_papers || [],
          patents: patents || [],
          projects: projects || [],
          updated_by: updated_by || requestUser?.email || null,
        },
      });
    }

    res.json({
      success: true,
      data: serializeForJson(memberCV),
      message: "CV profile updated successfully",
    });
  } catch (error) {
    console.error("Update member CV error:", error);
    next(error);
  }
};

/**
 * Get all member CVs - GET /api/admin/member-cv/all
 * Admin only
 */
exports.getAllMemberCVs = async (req, res, next) => {
  try {
    const memberCVs = await prisma.MemberCvProfile.findMany({
      orderBy: { updated_at: "desc" },
    });

    res.json({
      success: true,
      data: serializeForJson(memberCVs),
      count: memberCVs.length,
    });
  } catch (error) {
    console.error("Get all member CVs error:", error);
    next(error);
  }
};
