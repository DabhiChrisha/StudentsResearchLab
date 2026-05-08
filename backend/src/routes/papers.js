const express = require('express');
const { getPapersByStudent } = require('../controllers/papersController');

const router = express.Router();

router.get('/api/papers/:studentName', getPapersByStudent);

module.exports = router;
