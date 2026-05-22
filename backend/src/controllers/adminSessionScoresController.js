const prisma = require("../lib/prisma");

exports.getSessionScores = async (req, res, next) => {
  try {
    const sessions = await prisma.session_attendee.findMany({
      include: {
        session_score: true,
      },
      orderBy: [
        { date: "desc" },
        { round: "asc" },
      ],
    });

    const data = sessions.map((session) => {
      const normalizedRound = session.round && session.round > 0 ? session.round : 1;
      const scores = session.session_score?.scores || {};
      const scoreEntries = Object.entries(scores).map(([enrollment_no, score]) => ({
        enrollment_no,
        score: Number(score),
      }));

      return {
        id: session.id,
        date: session.date ? session.date.toISOString().slice(0, 10) : null,
        type: session.type,
        round: normalizedRound,
        attendees: Array.isArray(session.attendees) ? session.attendees : [],
        scores,
        scoreEntries,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteSessionScore = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedScores = await prisma.session_score.deleteMany({
      where: { r_id: id },
    });

    const deletedAttendees = await prisma.session_attendee.deleteMany({
      where: { id },
    });

    if (deletedScores.count === 0 && deletedAttendees.count === 0) {
      return res.status(404).json({
        error: "Not found",
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSessionScoresByDateEvent = async (req, res, next) => {
  try {
    const { date, type } = req.query;
    const dateText = String(date || "").trim();
    const typeText = String(type || "").trim();

    if (!dateText || !typeText) {
      return res.status(400).json({
        error: "Bad request",
        message: "date and type are required",
      });
    }

    const parsedDate = new Date(`${dateText}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        error: "Bad request",
        message: "date must be a valid YYYY-MM-DD value",
      });
    }

    const sessions = await prisma.session_attendee.findMany({
      where: {
        date: parsedDate,
        type: typeText,
      },
      select: { id: true },
    });

    if (sessions.length === 0) {
      return res.status(404).json({
        error: "Not found",
        message: "No session data found for the selected date and event",
      });
    }

    const ids = sessions.map((session) => session.id);

    await prisma.session_score.deleteMany({
      where: { r_id: { in: ids } },
    });

    const deletedAttendees = await prisma.session_attendee.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    res.json({
      success: true,
      message: "Session event deleted successfully",
      deletedCount: deletedAttendees.count,
      ids,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSessionScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { enrollment_no, score, removeEnrollment, scores } = req.body || {};

    const session = await prisma.session_attendee.findUnique({
      where: { id },
      include: { session_score: true },
    });

    if (!session) {
      return res.status(404).json({
        error: "Not found",
        message: "Session not found",
      });
    }

    const existingScores = session.session_score?.scores && typeof session.session_score.scores === "object"
      ? { ...session.session_score.scores }
      : {};

    let nextScores = existingScores;

    if (scores && typeof scores === "object") {
      const sanitized = {};
      for (const [key, value] of Object.entries(scores)) {
        const enrollment = String(key || "").trim();
        const numeric = Number(value);
        if (!enrollment || Number.isNaN(numeric)) continue;
        sanitized[enrollment] = numeric;
      }
      nextScores = sanitized;
    } else {
      const enrollment = String(enrollment_no || "").trim();
      if (!enrollment) {
        return res.status(400).json({
          error: "Bad request",
          message: "enrollment_no is required when scores object is not provided",
        });
      }

      if (removeEnrollment) {
        delete nextScores[enrollment];
      } else {
        const numeric = Number(score);
        if (Number.isNaN(numeric)) {
          return res.status(400).json({
            error: "Bad request",
            message: "score must be a valid number",
          });
        }
        nextScores[enrollment] = numeric;
      }
    }

    const nextAttendees = Object.keys(nextScores);

    await prisma.session_attendee.update({
      where: { id },
      data: { attendees: nextAttendees },
    });

    await prisma.session_score.upsert({
      where: { r_id: id },
      create: { r_id: id, scores: nextScores },
      update: { scores: nextScores },
    });

    const updated = await prisma.session_attendee.findUnique({
      where: { id },
      include: { session_score: true },
    });

    const resultScores = updated?.session_score?.scores || {};
    const normalizedRound = updated.round && updated.round > 0 ? updated.round : 1;
    const scoreEntries = Object.entries(resultScores).map(([key, value]) => ({
      enrollment_no: key,
      score: Number(value),
    }));

    res.json({
      success: true,
      data: {
        id: updated.id,
        date: updated.date ? updated.date.toISOString().slice(0, 10) : null,
        type: updated.type,
        round: normalizedRound,
        attendees: Array.isArray(updated.attendees) ? updated.attendees : [],
        scores: resultScores,
        scoreEntries,
      },
    });
  } catch (error) {
    next(error);
  }
};