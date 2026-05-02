const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
  token: { 
    type: String, 
    required: true, 
    unique: true 
  },
  category: { 
    type: String, 
    enum: ['Physical abuse', 'Medical neglect', 'Visitation denied', 'Food deprivation', 'Other'],
    required: true 
  },
  urgency: { 
    type: String, 
    enum: ['Urgent', 'Standard'], 
    default: 'Standard' 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In Review', 'Resolved'], 
    default: 'Pending' 
  },
  adminResponse: { 
    type: String 
  },
  // Blockchain-style audit trail
  auditChain: [{
    action: String, // 'submission', 'review', 'resolution'
    payload: Object,
    previousHash: String,
    currentHash: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Grievance', GrievanceSchema);
