const prisma = require('../lib/prisma');

// GET /api/activities
exports.getActivities = async (req, res, next) => {
  try {
    const activities = await prisma.activity.findMany();

    res.json({ data: activities });
  } catch (err) {
    next(err);
  }
};
