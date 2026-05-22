const express = require("express");
const multer = require("multer");
const prisma = require("../config/prisma");
const { broadcast } = require("../utils/sseManager");
const { uploadToCloudinary } = require("../utils/imageUpload");
const { sendJoinRequestConfirmationEmail } = require("../services/emailService");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const multerUpload = upload.single("resume");

router.post("/api/upload-temp-resume", (req, res, next) => {
  multerUpload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ detail: "Resume PDF size must be less than or equal to 10MB." });
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
    const uploadRes = await uploadToCloudinary(req.file.buffer, "join_resumes", req.file.originalname || "resume.pdf", "raw");
    res.json({ success: true, url: uploadRes.url });
  } catch (err) {
    console.error("Temp Resume upload failed:", err);
    res.status(500).json({ detail: "Resume upload failed. Please try again later." });
  }
});

router.post("/api/join-us", upload.none(), async (req, res, next) => {
  try {
    const {
      name,
      enrollment,
      semester,
      division,
      branch,
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
    } = req.body;

    // Basic validation
    if (!name || !enrollment || !email || !contact) {
      return res.status(400).json({ detail: "Missing required fields: Name, Enrollment, Email, and Contact are required." });
    }
    if (!resume_link) {
      return res.status(400).json({ detail: "Missing resume link. Please wait for the resume to finish uploading." });
    }

    // Mapping frontend fields to DB columns
    const data = await prisma.joinUs.create({
      data: {
        name,
        enrollment,
        semester: String(semester),
        division,
        branch,
        college,
        contact,
        email,
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

    // Trigger confirmation email
    try {
      await sendJoinRequestConfirmationEmail({ to: email, studentName: name });
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
    }

    res.json({ success: true, data: serializedData });
  } catch (err) {
    console.error("Join Us Submission Error Stack:", err);
    if (err.code === "P2002") {
      return res.status(400).json({ detail: "This enrollment number or email is already registered." });
    }
    res.status(500).json({ detail: "Internal Server Error", message: err.message, stack: err.stack });
  }
});

module.exports = router;
