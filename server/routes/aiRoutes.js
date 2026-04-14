const express = require('express');
const router = express.Router();
const { askAI } = require('../controllers/aiController');

// URL: /api/ai/ask
router.post('/ask', askAI);

module.exports = router;