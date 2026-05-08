const express = require('express');
const { getBatchStats } = require('../controllers/batchStatsController');

const router = express.Router();

router.get('/api/batch-member-stats', getBatchStats);

module.exports = router;
