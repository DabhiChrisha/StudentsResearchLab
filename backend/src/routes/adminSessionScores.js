const express = require("express");
const { adminAuthMiddleware } = require("../middleware/adminAuth");
const { getSessionScores, deleteSessionScore, deleteSessionScoresByDateEvent, updateSessionScore } = require("../controllers/adminSessionScoresController");

const router = express.Router();

router.get("/api/admin/session-scores", adminAuthMiddleware, getSessionScores);
router.delete("/api/admin/session-scores/event", adminAuthMiddleware, deleteSessionScoresByDateEvent);
router.put("/api/admin/session-scores/:id", adminAuthMiddleware, updateSessionScore);
router.delete("/api/admin/session-scores/:id", adminAuthMiddleware, deleteSessionScore);

module.exports = router;