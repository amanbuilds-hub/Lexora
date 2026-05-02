const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  legalChat,
  matchLawyers,
  uploadDocument
} = require('../controllers/legal.controller');

// AI Chatbot (Public/User)
router.post('/chat', legalChat);

// Lawyer Matching
router.get('/lawyers', protect, matchLawyers);

// Document Management
router.post('/upload', protect, uploadDocument);

module.exports = router;
