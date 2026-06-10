const mongoose = require('mongoose');

const HearingSchema = new mongoose.Schema({
  hearingDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  participants: {
    type: mongoose.Schema.Types.Mixed
  },
  outcome: {
    type: String
  },
  nextHearingDate: {
    type: Date
  },
  presidingJudge: {
    type: String
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Hearing', HearingSchema);
