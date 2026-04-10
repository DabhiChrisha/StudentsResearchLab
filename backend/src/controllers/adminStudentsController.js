const prisma = require("../lib/prisma");

/**
 * Get all students - GET /api/admin/students
 */
exports.getStudents = async (req, res, next) => {
  try {
    const students = await prisma.studentsDetail.findMany({
      where: {
        member_type: { not: "admin" },
      },
      orderBy: { created_at: "desc" },
    });

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get students error:", error);
    next(error);
  }
};

/**
 * Get single student - GET /api/admin/students/:enrollmentNo
 */
exports.getStudent = async (req, res, next) => {
  try {
    const { enrollmentNo } = req.params;

    const student = await prisma.studentsDetail.findUnique({
      where: { enrollment_no: enrollmentNo },
    });

    if (!student) {
      return res.status(404).json({
        error: "Not found",
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get student error:", error);
    next(error);
  }
};

/**
 * Create student - POST /api/admin/students
 */
exports.createStudent = async (req, res, next) => {
  try {
    const {
      student_name,
      enrollment_no,
      email,
      contact_no,
      department,
      institute_name,
      semester,
      division,
      batch,
      gender,
      member_type = "member",
    } = req.body;

    // Validate required fields
    if (!student_name || !enrollment_no || !email) {
      return res.status(400).json({
        error: "Invalid input",
        message: "student_name, enrollment_no, and email are required",
      });
    }

    // Check if student already exists
    const existing = await prisma.studentsDetail.findUnique({
      where: { enrollment_no },
    });

    if (existing) {
      return res.status(400).json({
        error: "Conflict",
        message: "Student with this enrollment number already exists",
      });
    }

    const student = await prisma.studentsDetail.create({
      data: {
        student_name,
        enrollment_no,
        email,
        contact_no: contact_no || null,
        department: department || null,
        institute_name: institute_name || null,
        semester: parseInt(semester) || 0,
        division: division || null,
        batch: batch || null,
        gender: gender || null,
        member_type: member_type === "admin" ? "member" : member_type,
      },
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Create student error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Conflict",
        message: "Duplicate enrollment_no or email",
      });
    }
    next(error);
  }
};

/**
 * Update student - PUT /api/admin/students/:enrollmentNo
 */
exports.updateStudent = async (req, res, next) => {
  try {
    const { enrollmentNo } = req.params;
    const {
      student_name,
      email,
      contact_no,
      department,
      institute_name,
      semester,
      division,
      batch,
      gender,
      member_type,
    } = req.body;

    // Check if student exists
    const existing = await prisma.studentsDetail.findUnique({
      where: { enrollment_no: enrollmentNo },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Not found",
        message: "Student not found",
      });
    }

    // Prepare update data
    const updateData = {};
    if (student_name) updateData.student_name = student_name;
    if (email) updateData.email = email;
    if (contact_no) updateData.contact_no = contact_no;
    if (department) updateData.department = department;
    if (institute_name) updateData.institute_name = institute_name;
    if (semester) updateData.semester = parseInt(semester);
    if (division) updateData.division = division;
    if (batch) updateData.batch = batch;
    if (gender) updateData.gender = gender;
    if (member_type && member_type !== "admin") {
      updateData.member_type = member_type;
    }

    const student = await prisma.studentsDetail.update({
      where: { enrollment_no: enrollmentNo },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Update student error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Conflict",
        message: "Email already exists",
      });
    }
    next(error);
  }
};

/**
 * Delete student - DELETE /api/admin/students/:enrollmentNo
 */
exports.deleteStudent = async (req, res, next) => {
  try {
    const { enrollmentNo } = req.params;

    // Check if student exists
    const existing = await prisma.studentsDetail.findUnique({
      where: { enrollment_no: enrollmentNo },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Not found",
        message: "Student not found",
      });
    }

    await prisma.studentsDetail.delete({
      where: { enrollment_no: enrollmentNo },
    });

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);
    next(error);
  }
};
