const prisma = require("../lib/prisma");

// GET /api/admin/member-cv?enrollment_no=ABC123
// Get CV profile by enrollment number
exports.getCvByEnrollment = async (req, res, next) => {
  try {
    const { enrollment_no } = req.query;

    if (!enrollment_no) {
      return res.status(400).json({
        message: "enrollment_no query parameter is required",
      });
    }

    const normalizedEnrollment = String(enrollment_no).toUpperCase();

    const cv = await prisma.memberCvProfile.findUnique({
      where: {
        enrollment_no: normalizedEnrollment,
      },
    });

    if (!cv) {
      return res.status(404).json({
        message: `CV profile not found for enrollment: ${enrollment_no}`,
        data: null,
      });
    }

    res.json({
      success: true,
      data: cv,
    });
  } catch (err) {
    console.error("Error fetching CV profile:", err);
    res.status(500).json({
      message: err.message,
      data: null,
    });
  }
};

// PUT /api/admin/member-cv
// Create or update CV profile
exports.updateCv = async (req, res, next) => {
  try {
    const {
      enrollment_no,
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
        message: "enrollment_no is required",
      });
    }

    const normalizedEnrollment = String(enrollment_no).toUpperCase();

    // Verify student exists
    const student = await prisma.studentsDetail.findFirst({
      where: {
        enrollment_no: {
          equals: normalizedEnrollment,
          mode: "insensitive",
        },
      },
      select: {
        student_name: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: `Student not found with enrollment: ${enrollment_no}`,
      });
    }

    // Upsert CV profile
    const cv = await prisma.memberCvProfile.upsert({
      where: {
        enrollment_no: normalizedEnrollment,
      },
      update: {
        research_work_summary: research_work_summary || null,
        research_area: research_area || null,
        hackathons: hackathons || [],
        research_papers: research_papers || [],
        patents: patents || [],
        projects: projects || [],
        updated_by: updated_by || null,
        updated_at: new Date(),
      },
      create: {
        enrollment_no: normalizedEnrollment,
        student_name: student.student_name,
        research_work_summary: research_work_summary || null,
        research_area: research_area || null,
        hackathons: hackathons || [],
        research_papers: research_papers || [],
        patents: patents || [],
        projects: projects || [],
        updated_by: updated_by || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.json({
      success: true,
      message: "CV profile updated successfully",
      data: cv,
    });
  } catch (err) {
    console.error("Error updating CV profile:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};
