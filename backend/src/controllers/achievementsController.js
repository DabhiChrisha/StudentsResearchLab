const prisma = require('../lib/prisma');

// GET /api/achievements
exports.getAchievements = async (req, res, next) => {
  try {
    const data = await prisma.achievementContent.findMany({
      orderBy: [
        { serial_no: 'desc' },
      ],
    });

    res.json({ achievements: data || [] });
  } catch (err) {
    next(err);
  }
};
