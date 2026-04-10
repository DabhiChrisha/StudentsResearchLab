const prisma = require('../lib/prisma');

// GET /api/sessions
exports.getSessions = async (req, res, next) => {
  try {
    const data = await prisma.sessionContent.findMany({
      orderBy: [
        { serial_no: 'desc' },
      ],
    });

    res.json({ sessions: data || [] });
  } catch (err) {
    next(err);
  }
};

// GET /api/srl_sessions
exports.getSrlSessions = async (req, res, next) => {
  try {
    const records = await prisma.srlSession.findMany({
      select: {
        session_date: true,
      },
    });
    res.json({ records });
  } catch (err) {
    next(err);
  }
};
