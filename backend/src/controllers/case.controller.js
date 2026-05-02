const Case = require('../models/case.mysql');
const Hearing = require('../models/hearing.mysql');
const User = require('../models/user.mysql');

// @desc    Create a new case (Admin only)
exports.createCase = async (req, res) => {
  try {
    const { caseNumber, offenseType, arrestDate, prisonerId, lawyerId } = req.body;

    const newCase = await Case.create({
      caseNumber,
      offenseType,
      arrestDate,
      prisonerId,
      lawyerId
    });

    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get case details with hearings
exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findByPk(req.params.id, {
      include: [
        { model: Hearing, as: 'hearings' },
        { model: User, as: 'prisoner', attributes: ['id', 'name', 'prisonerId'] },
        { model: User, as: 'assignedLawyer', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.status(200).json({ success: true, data: caseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update case status and add hearing record
exports.updateCaseStatus = async (req, res) => {
  try {
    const { status, outcome, nextHearingDate } = req.body;
    const caseData = await Case.findByPk(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // 1. Update Case
    caseData.currentStatus = status;
    if (nextHearingDate) {
      caseData.nextHearingDate = nextHearingDate;
    }
    await caseData.save();

    // 2. Log Hearing if it's a status update from a hearing
    if (outcome) {
      await Hearing.create({
        caseId: caseData.id,
        hearingDate: new Date(),
        outcome,
        nextHearingDate
      });
    }

    res.status(200).json({ success: true, data: caseData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get prisoner's case (for Family dashboard)
exports.getPrisonerCase = async (req, res) => {
  try {
    // Assuming family is logged in and we have their profile linked to a prisoner
    const UserProfile = require('../models/user.profile.mongo');
    const profile = await UserProfile.findOne({ userId: req.user.id });
    
    if (!profile || !profile.prisonerDetails) {
      return res.status(404).json({ message: 'No linked prisoner found' });
    }

    // This is a simplified lookup for the demo
    const caseData = await Case.findOne({
      where: { prisonerId: req.query.prisonerId }, // In real app, get from profile linkage
      include: [{ model: Hearing, as: 'hearings' }]
    });

    res.status(200).json({ success: true, data: caseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
