const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  submitAssessment,
  getMatchedTasks,
  completeTaskUnit,
  getPublicProducts
} = require('../controllers/earning.controller');

// Prisoner only: Assessment and Tasks
router.post('/assess', protect, authorize('prisoner'), submitAssessment);
router.get('/tasks', protect, authorize('prisoner'), getMatchedTasks);
router.post('/record', protect, authorize('prisoner'), completeTaskUnit);

// Public: Product listings
router.get('/products', getPublicProducts);

module.exports = router;
