const prisma = require('../lib/prisma');

// POST /api/join-us
exports.submitJoinUs = async (req, res, next) => {
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
      source,
      reference_name,
    } = req.body;

  const data = await prisma.joinUs.create({
      data: {
        name,
        enrollment,
        semester,
        division,
        college,
        contact,
        email,
        batch,
        department,
        source,
      },
    });

    res.json({ data });
  } catch (err) {
    next(err);
  }
};
