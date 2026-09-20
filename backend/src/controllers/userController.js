const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const Badge = require('../models/Badge');
const { awardUserProgress } = require('../utils/gamification');

// @desc    Get complete user profile with activity history & badges
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Fetch user progress ledger items
    const progressHistory = await UserProgress.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    // Fetch full badge metadata for user's earned badges
    const earnedBadgeCodes = user.badges.map((b) => b.badgeCode);
    const badgeDetails = await Badge.find({ code: { $in: earnedBadgeCodes } });

    const enrichedBadges = user.badges.map((ub) => {
      const meta = badgeDetails.find((bd) => bd.code === ub.badgeCode);
      return {
        badgeCode: ub.badgeCode,
        earnedAt: ub.earnedAt,
        name: meta ? meta.name : ub.badgeCode,
        description: meta ? meta.description : '',
        iconName: meta ? meta.iconName : 'award',
      };
    });

    res.json({
      success: true,
      profile: {
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
        badges: enrichedBadges,
        history: progressHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details (avatar, username)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken by another user',
        });
      }
      user.username = username;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Claim daily check-in streak reward (Server Authoritative & Idempotent)
// @route   POST /api/users/daily-checkin
// @access  Private
const claimDailyCheckin = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const activityKey = `daily_checkin_${dateKey}`;

    // Check if daily checkin has already been claimed today
    const existingCheckin = await UserProgress.findOne({ userId, activityKey });
    if (existingCheckin) {
      return res.status(400).json({
        success: false,
        message: 'Daily check-in reward already claimed today! Come back tomorrow.',
      });
    }

    const pointsReward = 15;
    const waterSavedReward = 5;

    // Record progress ledger entry first to guarantee single processing
    await UserProgress.create({
      userId,
      activityType: 'daily_checkin',
      activityId: dateKey,
      activityKey,
      pointsEarned: pointsReward,
      waterSavedLiters: waterSavedReward,
    });

    const user = await User.findById(userId);
    const { newBadges } = await awardUserProgress({
      user,
      pointsEarned: pointsReward,
      waterSavedLiters: waterSavedReward,
      updateStreak: true,
    });

    res.json({
      success: true,
      message: `Daily check-in successful! Earned +${pointsReward} points & +${waterSavedReward}L water saved.`,
      pointsEarned: pointsReward,
      waterSavedLiters: waterSavedReward,
      currentStreak: user.currentStreak,
      totalPoints: user.totalPoints,
      newBadges,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Daily check-in reward already claimed today!',
      });
    }
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  claimDailyCheckin,
};
