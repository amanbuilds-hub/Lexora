const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: String, // UUID from MySQL
    required: true,
    unique: true
  },
  // Extra data based on role
  prisonerDetails: {
    caseType: String,
    jailLocation: String,
    age: Number,
    admissionDate: Date,
    skillLevel: String,
    earningHistory: [{ date: Date, amount: Number, task: String }]
  },
  familyDetails: {
    relationship: String,
    address: String,
    associatedPrisonerId: String
  },
  lawyerDetails: {
    barCouncilId: String,
    specialization: [String],
    documents: [String], // URLs to certificates
    yearsOfExperience: Number
  },
  jailAuthDetails: {
    designation: String,
    jailId: String
  }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);
