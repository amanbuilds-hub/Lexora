const axios = require('axios');
const Lawyer = require('../models/lawyer.mysql');
const User = require('../models/user.mysql');

// @desc    Chat with AI Legal Assistant
exports.legalChat = async (req, res) => {
  try {
    const { message, language } = req.body;
    
    // System Prompt for Legal Rights in India
    const systemPrompt = `You are Lexora AI, a legal aid assistant for undertrial prisoners in India. 
    Explain rights clearly in ${language === 'hindi' ? 'Hindi' : 'English'}. 
    Focus on:
    1. Section 436A: Bail if half the max sentence is served.
    2. Article 39A: Free legal aid for those who cannot afford it.
    3. Right to speedy trial and fair hearing.
    If the user provides case duration, check eligibility for 436A. 
    Keep responses empathetic and premium. Do not give official legal advice, but inform about rights.`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemma-3-1b-it:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lexora.india', // Site URL
        'X-Title': 'Lexora Legal Aid'
      }
    });

    const aiMessage = response.data.choices[0].message.content;
    res.status(200).json({ success: true, message: aiMessage });
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'AI Assistant temporarily unavailable' });
  }
};

// @desc    Match lawyers for a case
exports.matchLawyers = async (req, res) => {
  try {
    const { caseType, state } = req.query;

    const lawyers = await Lawyer.findAll({
      where: {
        specialization: caseType || 'general',
        state: state || 'Delhi',
        availability: true
      },
      include: [{
        model: User,
        as: 'lawyerInfo', // Assuming association set up
        attributes: ['name', 'email']
      }],
      limit: 5,
      order: [['rating', 'DESC']]
    });

    res.status(200).json({ success: true, lawyers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload documents
exports.uploadDocument = async (req, res) => {
  try {
    const { docBase64, docType, prisonerId } = req.body;
    const UserProfile = require('../models/user.profile.mongo');

    // Store in MongoDB Profile
    await UserProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { 'lawyerDetails.documents': { docType, data: docBase64, date: new Date() } } }
    );

    res.status(200).json({ success: true, message: 'Document uploaded securely' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
