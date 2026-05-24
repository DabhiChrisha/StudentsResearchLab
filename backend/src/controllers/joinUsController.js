const prisma = require('../lib/prisma');

// POST /api/join-us
exports.submitJoinUs = async (req, res, next) => {
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

    res.json({ data });
  } catch (err) {
    next(err);
  }
};
