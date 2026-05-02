const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createCase,
  getCaseById,
  updateCaseStatus,
  getPrisonerCase
} = require('../controllers/case.controller');

// Admin only: Create and Update
router.post('/', protect, authorize('admin'), createCase);
router.put('/:id/status', protect, authorize('admin'), updateCaseStatus);

// Admin & Lawyer: Get details
router.get('/:id', protect, authorize('admin', 'lawyer'), getCaseById);

// Family: Get their prisoner's case
router.get('/my-prisoner/status', protect, authorize('family'), getPrisonerCase);

module.exports = router;
