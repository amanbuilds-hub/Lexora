const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Grievance = require('../models/grievance.mongo');

const createHash = (data) => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

// AI Urgency Detection (Keyword Based for speed)
const detectUrgency = (description) => {
  const urgentKeywords = ['abuse', 'blood', 'injury', 'beating', 'starving', 'emergency', 'pain', 'hit', 'assault'];
  const isUrgent = urgentKeywords.some(word => description.toLowerCase().includes(word));
  return isUrgent ? 'Urgent' : 'Standard';
};

// @desc    Submit a grievance (Anonymous)
exports.submitGrievance = async (req, res) => {
  try {
    const { category, description } = req.body;
    const token = uuidv4().split('-')[0].toUpperCase(); // Simple 8-char token
    const urgency = detectUrgency(description);

    // Initial Audit Entry
    const payload = { category, description, urgency };
    const initialHash = createHash({ action: 'submission', payload, previousHash: '0'.repeat(64) });

    const grievance = await Grievance.create({
      token,
      category,
      description,
      urgency,
      auditChain: [{
        action: 'submission',
        payload,
        previousHash: '0'.repeat(64),
        currentHash: initialHash
      }]
    });

    // If Urgent, emit notification (simulated)
    if (urgency === 'Urgent') {
      console.log(`🚨 [URGENT ALERT] High-priority grievance received (Token: ${token}). Notifying Jail Admin and SHRC.`);
    }

    res.status(201).json({ 
      success: true, 
      token, 
      urgency,
      message: 'Grievance submitted anonymously. Keep your token to track status.' 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Track status via token
exports.getGrievanceStatus = async (req, res) => {
  try {
    const grievance = await Grievance.findOne({ token: req.params.token });
    if (!grievance) return res.status(404).json({ message: 'Invalid token' });

    res.status(200).json({ 
      success: true, 
      data: {
        status: grievance.status,
        category: grievance.category,
        urgency: grievance.urgency,
        response: grievance.adminResponse,
        history: grievance.auditChain
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resolve grievance (Admin)
exports.resolveGrievance = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    // Update Audit Chain
    const lastEntry = grievance.auditChain[grievance.auditChain.length - 1];
    const payload = { status, adminResponse };
    const currentHash = createHash({ action: 'resolution', payload, previousHash: lastEntry.currentHash });

    grievance.status = status;
    grievance.adminResponse = adminResponse;
    grievance.auditChain.push({
      action: 'resolution',
      payload,
      previousHash: lastEntry.currentHash,
      currentHash
    });

    await grievance.save();
    res.status(200).json({ success: true, message: 'Grievance updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    List all grievances (Admin)
exports.listGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find().sort({ urgency: 1, createdAt: -1 });
    res.status(200).json({ success: true, grievances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
