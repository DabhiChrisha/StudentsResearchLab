const express = require("express");
const { getMemberMetrics } = require("../controllers/metricsController");

const router = express.Router();

router.get("/member-metrics/:enrollment_no", getMemberMetrics);

module.exports = router;
