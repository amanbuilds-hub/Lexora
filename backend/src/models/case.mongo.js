const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    unique: true,
    required: true
  },
  offenseType: {
    type: String,
    required: true
  },
  arrestDate: {
    type: Date,
    required: true
  },
  currentStatus: {
    type: String,
    enum: [
      'Registered',
      'Hearing Scheduled',
      'In Progress',
      'Bail Granted',
      'Acquitted',
      'Convicted',
      'Closed'
    ],
    default: 'Registered'
  },
  nextHearingDate: {
    type: Date
  },
  isPendingFlagged: {
    type: Boolean,
    default: false
  },
  aiAlertMessage: {
    type: String
  },
  prisonerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lawyer'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for hearings associated with this case
CaseSchema.virtual('hearings', {
  ref: 'Hearing',
  localField: '_id',
  foreignField: 'caseId'
});

// Virtual for prisoner (User)
CaseSchema.virtual('prisoner', {
  ref: 'User',
  localField: 'prisonerId',
  foreignField: '_id',
  justOne: true
});

// Virtual for lawyer
CaseSchema.virtual('lawyer', {
  ref: 'Lawyer',
  localField: 'lawyerId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Case', CaseSchema);
