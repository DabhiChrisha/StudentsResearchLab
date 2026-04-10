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
      source,
      reference_name,
    } = req.body;

    const data = await prisma.joinUs.create({
      data: {
        name,
        enrollment,
        semester,
        division,
        branch,
        college,
        contact,
        email,
        batch,
        source,
      },
    });

    res.json({ data: [data] });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ detail: "Enrollment number already submitted." });
    }
    res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
