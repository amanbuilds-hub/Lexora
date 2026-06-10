const mongoose = require('mongoose');

// 1. Skill Profile
const SkillProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  prisonerId: { type: String, required: true },
  primarySkill: { type: String, enum: ['carpentry', 'pottery', 'coding', 'farming', 'textile', 'none'], default: 'none' },
  assessmentResults: [{
    category: String,
    score: Number,
    date: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['unskilled', 'training', 'certified'], default: 'unskilled' }
});

// 2. Task
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  skillRequired: { type: String, required: true },
  productName: String,
  unitPrice: Number, // Earning per unit
  totalUnitsNeeded: Number,
  unitsCompleted: { type: Number, default: 0 },
  deadline: Date,
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
});

// 3. Earning Transaction (Audit Log)
const EarningTransactionSchema = new mongoose.Schema({
  prisonerId: { type: String, required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  amount: { type: Number, required: true },
  splits: {
    family: Number, // 60%
    prison: Number, // 20%
    rehab: Number   // 20%
  },
  previousHash: { type: String, required: true },
  currentHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = {
  SkillProfile: mongoose.model('SkillProfile', SkillProfileSchema),
  Task: mongoose.model('Task', TaskSchema),
  EarningTransaction: mongoose.model('EarningTransaction', EarningTransactionSchema)
};
