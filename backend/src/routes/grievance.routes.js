const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  submitGrievance,
  getGrievanceStatus,
  resolveGrievance,
  listGrievances
} = require('../controllers/grievance.controller');

const { validate, schemas } = require('../middleware/validate');

// Public/Family (Anonymous)
router.post('/submit', validate(schemas.grievance), submitGrievance);
router.get('/status/:token', getGrievanceStatus);

// Admin only
router.get('/list', protect, authorize('admin'), listGrievances);
router.put('/:id/resolve', protect, authorize('admin'), resolveGrievance);

module.exports = router;
