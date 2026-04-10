const prisma = require('../lib/prisma');

// GET /api/scores
exports.getScores = async (req, res, next) => {
  try {
    const records = await prisma.debateScore.findMany();
    res.json({ records });
  } catch (err) {
    next(err);
  }
};

// GET /api/scores/:student_id
exports.getScoreByStudentId = async (req, res, next) => {
  try {
    res.status(501).json({ detail: "Not Implemented securely for debate_scores yet" });
  } catch (err) {
    next(err);
  }
};
