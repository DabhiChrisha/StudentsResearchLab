const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.post("/join-us", async (req, res, next) => {
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
      resume_link,
      research_expertise,
      published_research,
      ongoing_research,
      source,
    } = req.body;

    // Basic validation
    if (!name || !enrollment || !email || !contact) {
      return res.status(400).json({ detail: "Missing required fields: Name, Enrollment, Email, and Contact are required." });
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
        resume_link,
        research_expertise: Array.isArray(research_expertise) ? research_expertise : [],
        research_publication: published_research,
        research_ongoing: ongoing_research,
        source: source || "Website",
      },
    });

    // Handle BigInt serialization
    const serializedData = JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

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
