const express = require("express");
const multer = require("multer");
const prisma = require("../config/prisma");
const { broadcast } = require("../utils/sseManager");
const { uploadToCloudinary } = require("../utils/imageUpload");
const {
  sendJoinRequestConfirmationEmail,
  sendAdminNotificationEmail,
  isValidEmail,
} = require("../services/emailService");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const multerUpload = upload.single("resume");

const JOIN_US_DUPLICATE_FIELDS = {
  enrollment: {
    message: "Enrollment Number already exists.",
    joinUsField: "enrollment",
    studentField: "enrollment_no",
  },
  contact: {
    message: "Contact Number already exists.",
    joinUsField: "contact",
    studentField: "contact_no",
  },
  email: {
    message: "Email ID already exists.",
    joinUsField: "email",
    studentField: "email",
  },
};

function normalizeJoinField(field, value) {
  const normalized = String(value || "").trim();
  if (field === "email") return normalized.toLowerCase();
  if (field === "contact") return normalized.replace(/\D/g, "");
  if (field === "enrollment") return normalized.toUpperCase();
  return normalized;
}

async function valueExistsInJoinUs(field, value) {
  const config = JOIN_US_DUPLICATE_FIELDS[field];
  const whereValue = field === "email" || field === "enrollment"
    ? { equals: value, mode: "insensitive" }
    : value;

  const existing = await prisma.joinUs.findFirst({
    where: { [config.joinUsField]: whereValue },
    select: { id: true },
  });

  return Boolean(existing);
}

async function valueExistsInStudents(field, value) {
  const config = JOIN_US_DUPLICATE_FIELDS[field];
  const whereValue = field === "email" || field === "enrollment"
    ? { equals: value, mode: "insensitive" }
    : value;

  const existing = await prisma.studentsDetail.findFirst({
    where: { [config.studentField]: whereValue },
    select: { id: true },
  });

  return Boolean(existing);
}

async function fieldValueExists(field, value) {
  const existsInStudents = await valueExistsInStudents(field, value);
  if (existsInStudents) return true;
  return await valueExistsInJoinUs(field, value);
}

async function getJoinUsDuplicateField({ enrollment, contact, email }) {
  const normalizedEnrollment = normalizeJoinField("enrollment", enrollment);
  if (normalizedEnrollment) {
    if (await fieldValueExists("enrollment", normalizedEnrollment)) {
      return "enrollment";
    }
  }

  const normalizedContact = normalizeJoinField("contact", contact);
  if (normalizedContact) {
    if (await fieldValueExists("contact", normalizedContact)) {
      return "contact";
    }
  }

  const normalizedEmail = normalizeJoinField("email", email);
  if (normalizedEmail) {
    if (await fieldValueExists("email", normalizedEmail)) {
      return "email";
    }
  }

  return null;
}

router.post("/api/upload-temp-resume", (req, res, next) => {
  multerUpload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ detail: "PDF file size must be less than 10 MB." });
      }
      return res.status(400).json({ detail: err.message });
    }
    next();
  });
}, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: "No resume file provided." });
    }

    const originalName = String(req.file.originalname || "resume.pdf").trim();
    const isPdf = req.file.mimetype === "application/pdf" ||
      (["", "application/octet-stream"].includes(req.file.mimetype) && originalName.toLowerCase().endsWith(".pdf"));
    if (!isPdf) {
      return res.status(400).json({ detail: "Resume must be a PDF file." });
    }
    if (!originalName.toLowerCase().endsWith(".pdf")) {
      return res.status(400).json({ detail: "Resume file name must end with .pdf." });
    }

    const uploadRes = await uploadToCloudinary(req.file.buffer, "join_resumes", originalName, "raw");
    res.json({ success: true, url: uploadRes.url });
  } catch (err) {
    res.status(500).json({ detail: "Resume upload failed. Please try again later." });
  }
});

router.post("/api/join-us/validate-unique", async (req, res) => {
  try {
    const duplicateField = await getJoinUsDuplicateField(req.body || {});

    if (duplicateField) {
      return res.status(409).json({
        success: false,
        field: duplicateField,
        detail: JOIN_US_DUPLICATE_FIELDS[duplicateField].message,
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ detail: "Unable to validate your details. Please try again." });
  }
});

router.post("/api/join-us", upload.none(), async (req, res, next) => {
  try {
    const {
      name,
      enrollment,
      semester,
      division,
      college,
      contact,
      email,
      batch,
      department,
      after_ug,
      cpi,
      ieee_member_2026,
      ieee_membership,
      research_expertise,
      published_research,
      ongoing_research,
      source,
      resume_link,
      description,
    } = req.body;

    // Basic validation
    if (!name || !enrollment || !email || !contact || !department) {
      return res.status(400).json({ detail: "Missing required fields: Name, Enrollment, Email, Contact, and Department/Course are required." });
    }
    if (!resume_link) {
      return res.status(400).json({ detail: "Missing resume link. Please wait for the resume to finish uploading." });
    }

    const normalizedEnrollment = normalizeJoinField("enrollment", enrollment);
    const normalizedContact = normalizeJoinField("contact", contact);
    const normalizedEmail = normalizeJoinField("email", email);
    const duplicateField = await getJoinUsDuplicateField({
      enrollment: normalizedEnrollment,
      contact: normalizedContact,
      email: normalizedEmail,
    });

    if (duplicateField) {
      return res.status(409).json({
        success: false,
        field: duplicateField,
        detail: JOIN_US_DUPLICATE_FIELDS[duplicateField].message,
      });
    }

    // Mapping frontend fields to DB columns
    const data = await prisma.joinUs.create({
      data: {
        name,
        enrollment: normalizedEnrollment,
        semester: String(semester),
        division,
        college,
        contact: normalizedContact,
        email: normalizedEmail,
        batch,
        department,
        after_ug,
        cpi: cpi ? String(cpi) : null,
        ieee_member_2026,
        ieee_membership,
        resume_link: resume_link,
        research_expertise: Array.isArray(research_expertise) ? research_expertise : (research_expertise ? [research_expertise] : []),
        research_publication: published_research,
        research_ongoing: ongoing_research,
        source: source || "Website",
        description: description || null,
        status: "pending",
      },
    });

    // Handle BigInt serialization
    const serializedData = JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    broadcast("join_request_pending", {
      id: serializedData.id,
      action: "pending",
      name: serializedData.name,
    });

    // Trigger confirmation email asynchronously (fire-and-forget)
    // Removed setTimeout to prevent serverless suspension issues
    const recipientEmail = String(email || "").trim();
    if (!recipientEmail || !isValidEmail(recipientEmail)) {
    } else {
      sendJoinRequestConfirmationEmail({ to: recipientEmail, studentName: name }).catch((emailErr) => {
      });
    }

    // Notify admin recipients about a new join request
    sendAdminNotificationEmail({
      studentName: name,
      email: recipientEmail,
      enrollment,
      department,
      batch,
      source: source || "Website",
    }).catch(() => {});

    res.json({ success: true, data: serializedData });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ detail: "This enrollment number or email is already registered." });
    }
    res.status(500).json({ detail: "An unexpected error occurred during submission. Please try again." });
  }
});

module.exports = router;
