const express = require("express");
const { getBatchStats } = require("../controllers/batchStatsController");

const router = express.Router();

router.get("/batch-member-stats", getBatchStats);

module.exports = router;
