const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getStats, 
  exportEarningsCSV, 
  exportPrisonReportPDF 
} = require('../controllers/admin.controller');

// Admin Analytics
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/export/earnings', protect, authorize('admin'), exportEarningsCSV);
router.get('/export/report', protect, authorize('admin'), exportPrisonReportPDF);

// Admin dashboard (dummy from before)
router.get('/dashboard', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Jail Authority Admin Dashboard',
    stats: {
      pendingApprovals: 5,
      totalPrisoners: 1200,
      activeHearings: 12
    }
  });
});

// Admin can approve lawyers
router.patch('/approve-lawyer/:id', protect, authorize('admin'), async (req, res) => {
  const User = require('../models/user.mysql');
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.role !== 'lawyer') {
      return res.status(404).json({ message: 'Lawyer not found' });
    }
    user.status = 'active';
    await user.save();
    res.status(200).json({ success: true, message: 'Lawyer approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
