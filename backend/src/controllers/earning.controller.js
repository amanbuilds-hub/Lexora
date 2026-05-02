const { SkillProfile, Task, EarningTransaction } = require('../models/earning.mongo');
const { recordEarning } = require('../utils/auditLog');

// @desc    Submit skill assessment
exports.submitAssessment = async (req, res) => {
  try {
    const { prisonerId, scores } = req.body;
    
    // Find highest score category
    const highest = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b);
    
    const profile = await SkillProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        prisonerId,
        primarySkill: highest[0],
        status: 'certified',
        $push: { assessmentResults: { category: highest[0], score: highest[1] } }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, skillMatched: highest[0] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get matched tasks for prisoner
exports.getMatchedTasks = async (req, res) => {
  try {
    const profile = await SkillProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Skill profile not found' });

    const tasks = await Task.find({ 
      skillRequired: profile.primarySkill,
      status: 'active'
    });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Record task completion and earning
exports.completeTaskUnit = async (req, res) => {
  try {
    const { taskId, units } = req.body;
    const task = await Task.findById(taskId);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const totalEarning = task.unitPrice * units;

    // Record in blockchain audit log
    const tx = await recordEarning(req.user.prisonerId, task._id, totalEarning);

    // Update task progress
    task.unitsCompleted += units;
    if (task.unitsCompleted >= task.totalUnitsNeeded) {
      task.status = 'completed';
    }
    await task.save();

    res.status(200).json({ success: true, tx });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get public product listings
exports.getPublicProducts = async (req, res) => {
  try {
    const tasks = await Task.find({ unitsCompleted: { $gt: 0 } });
    const products = tasks.map(t => ({
      name: t.productName,
      category: t.skillRequired,
      price: t.unitPrice * 2.5, // Retail price simulation
      makerId: "P-****" + Math.floor(1000 + Math.random() * 9000)
    }));
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
