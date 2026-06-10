const mongoose = require('mongoose');

const LawyerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    enum: ['petty crime', 'theft', 'assault', 'fraud', 'general'],
    default: 'general'
  },
  state: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 5.0
  },
  proBonoCasesCompleted: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual association to User (as 'lawyerInfo')
LawyerSchema.virtual('lawyerInfo', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Lawyer', LawyerSchema);
