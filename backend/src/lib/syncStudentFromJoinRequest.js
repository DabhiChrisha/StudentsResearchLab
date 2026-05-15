const prisma = require("./prisma");
const { broadcast } = require("../utils/sseManager");

const DEFAULT_INSTITUTE = "KSV University";
const DEFAULT_BATCH = "2026-2030";

function clip(value, maxLen) {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

/**
 * When a join-us request is approved, upsert students_details (+ CV profile if new).
 * Maps join_us columns → students_details fields.
 */
async function syncStudentFromJoinRequest(joinRequest) {
  const enrollment_no = clip(
    String(joinRequest.enrollment || "").toUpperCase(),
    20,
  );
  if (!enrollment_no) {
    throw new Error("Join request is missing enrollment number");
  }

  const semesterRaw = parseInt(String(joinRequest.semester ?? ""), 10);
  const semester =
    Number.isFinite(semesterRaw) && semesterRaw > 0 ? semesterRaw : 1;

  const student_name = clip(joinRequest.name, 150);
  const email = clip(String(joinRequest.email || "").toLowerCase(), 150);
  const batch = clip(joinRequest.batch, 20) || DEFAULT_BATCH;
  const institute_name =
    clip(joinRequest.college, 100) || DEFAULT_INSTITUTE;
  const department =
    clip(joinRequest.department, 50) ||
    clip(joinRequest.branch, 50) ||
    null;
  const contact_no = clip(joinRequest.contact, 15);
  const division = clip(joinRequest.division, 5);

  if (!student_name || !email) {
    throw new Error("Join request is missing name or email");
  }

  // Another student may already use this email
  const emailOwner = await prisma.studentsDetail.findUnique({
    where: { email },
  });
  if (emailOwner && emailOwner.enrollment_no !== enrollment_no) {
    const err = new Error(
      `Email ${email} is already registered to enrollment ${emailOwner.enrollment_no}`,
    );
    err.code = "P2002";
    throw err;
  }

  const existing = await prisma.studentsDetail.findUnique({
    where: { enrollment_no },
  });

  const studentData = {
    student_name,
    email,
    contact_no,
    department,
    institute_name,
    semester,
    division,
    batch,
    member_type: "General Members",
    member: "student member",
  };

  let student;
  let created = false;

  await prisma.$transaction(async (tx) => {
    if (existing) {
      student = await tx.studentsDetail.update({
        where: { enrollment_no },
        data: {
          student_name: studentData.student_name,
          email: studentData.email,
          contact_no: studentData.contact_no,
          department: studentData.department,
          institute_name: studentData.institute_name,
          semester: studentData.semester,
          division: studentData.division,
          batch: studentData.batch,
          ...(existing.member_type
            ? {}
            : { member_type: studentData.member_type }),
        },
      });
    } else {
      student = await tx.studentsDetail.create({
        data: {
          enrollment_no,
          ...studentData,
        },
      });
      created = true;
    }

    const cvPayload = {
      student_name: studentData.student_name,
      department: studentData.department,
      semester: studentData.semester,
      institute: studentData.institute_name,
    };

    await tx.memberCvProfile.upsert({
      where: { enrollment_no },
      create: {
        enrollment_no,
        ...cvPayload,
      },
      update: cvPayload,
    });
  });

  broadcast("student_changed", {
    enrollment_no,
    action: created ? "created" : "updated",
    source: "join_request_approved",
  });

  return { student, created };
}

module.exports = { syncStudentFromJoinRequest };
