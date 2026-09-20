const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { awardUserProgress } = require('../utils/gamification');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, avatar } = req.body;

    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: userExists.email === email.toLowerCase() ? 'Email is already registered' : 'Username is already taken',
      });
    }

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password, // Password hashed automatically by pre-save hook
      avatar: avatar || 'droplet-blue',
    });

    // Award initial welcome bonus streak & stats setup
    await awardUserProgress({ user, pointsEarned: 20, waterSavedLiters: 10, updateStreak: true });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to AquaQuest.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        totalPoints: user.totalPoints,
        level: user.level,
        levelTitle: user.levelTitle,
        currentStreak: user.currentStreak,
        maxStreak: user.maxStreak,
        waterSavedLiters: user.waterSavedLiters,
        avatar: user.avatar,
        badges: user.badges,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update active streak upon login
    await awardUserProgress({ user, pointsEarned: 0, waterSavedLiters: 0, updateStreak: true });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        totalPoints: user.totalPoints,
        level: user.level,
        levelTitle: user.levelTitle,
        currentStreak: user.currentStreak,
        maxStreak: user.maxStreak,
        waterSavedLiters: user.waterSavedLiters,
        avatar: user.avatar,
        badges: user.badges,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        totalPoints: user.totalPoints,
        level: user.level,
        levelTitle: user.levelTitle,
        currentStreak: user.currentStreak,
        maxStreak: user.maxStreak,
        lastActiveDate: user.lastActiveDate,
        waterSavedLiters: user.waterSavedLiters,
        avatar: user.avatar,
        badges: user.badges,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
