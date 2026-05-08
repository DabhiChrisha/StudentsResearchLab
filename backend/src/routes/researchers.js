const express = require('express');
const { getResearchers, syncResearchers } = require('../controllers/researchersController');

const router = express.Router();

router.get('/api/researchers', getResearchers);
router.post('/api/researchers/sync', syncResearchers);

module.exports = router;
