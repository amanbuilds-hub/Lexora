const jwt = require('jsonwebtoken');
const User = require('../models/user.mysql');
const UserProfile = require('../models/user.profile.mongo');
const { sequelize } = require('../config/db');

// Token Utilities
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const sendTokenResponse = async (user, statusCode, res) => {
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Save refresh token to DB
  user.refreshToken = refreshToken;
  await user.save();

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('accessToken', accessToken, { ...cookieOptions, expires: new Date(Date.now() + 15 * 60 * 1000) }) // 15 mins
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
      success: true,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });
};

// @desc    Register Family
exports.registerFamily = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, phone, password, prisonerName, caseType, jailLocation, age } = req.body;

    // 1. Create User in MySQL
    const user = await User.create({
      name,
      phone,
      password,
      role: 'family'
    }, { transaction: t });

    // 2. Create Profile in MongoDB
    await UserProfile.create({
      userId: user.id,
      familyDetails: { associatedPrisonerId: 'PENDING_LINK' }, // Link later
      prisonerDetails: { name: prisonerName, caseType, jailLocation, age }
    });

    // 3. Simulate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`[OTP Simulation] To: ${phone}, Message: Your Lexora verification code is ${otp}`);

    await t.commit();
    res.status(201).json({ success: true, message: 'Family registered. Verify OTP to activate.', otp_simulated: otp });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Register Lawyer/NGO
exports.registerLawyer = async (req, res) => {
  try {
    const { name, email, password, barCouncilId, specialization } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: 'lawyer',
      status: 'pending' // Admin must approve
    });

    await UserProfile.create({
      userId: user.id,
      lawyerDetails: { barCouncilId, specialization }
    });

    res.status(201).json({ success: true, message: 'Lawyer registered. Awaiting Admin approval.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Login for all (General & Prisoner)
exports.login = async (req, res) => {
  try {
    const { email, phone, password, prisonerId, pin } = req.body;

    let user;

    if (prisonerId && pin) {
      // Prisoner Biometric Simulation (ID + PIN)
      user = await User.findOne({ where: { prisonerId } });
      if (!user || !(await user.comparePin(pin))) {
        return res.status(401).json({ message: 'Invalid Prisoner ID or PIN' });
      }
    } else {
      // General Login (Email or Phone)
      const query = email ? { email } : { phone };
      user = await User.findOne({ where: query });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout
exports.logout = async (req, res) => {
  res.cookie('accessToken', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.cookie('refreshToken', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out' });
};
