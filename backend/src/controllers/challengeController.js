const Challenge = require('../models/Challenge');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const { awardUserProgress } = require('../utils/gamification');

// @desc    Get all active water conservation challenges
// @route   GET /api/challenges
// @access  Public / Private
const getChallenges = async (req, res, next) => {
  try {
    const { category, difficulty, durationType } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (durationType) query.durationType = durationType;

    const challenges = await Challenge.find(query).sort({ createdAt: -1 });

    // If user is authenticated, attach completion status to each challenge
    let enrichedChallenges = challenges.map((c) => c.toObject());

    if (req.user) {
      const now = new Date();
      const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const userCompletions = await UserProgress.find({
        userId: req.user._id,
        activityType: 'challenge',
      });

      const completedKeysSet = new Set(userCompletions.map((uc) => uc.activityKey));

      enrichedChallenges = enrichedChallenges.map((c) => {
        const key = c.durationType === 'daily' ? `challenge_${c._id}_${dateKey}` : `challenge_${c._id}`;
        return {
          ...c,
          isCompletedToday: completedKeysSet.has(key),
        };
      });
    }

    res.json({
      success: true,
      count: enrichedChallenges.length,
      challenges: enrichedChallenges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit challenge completion proof (Server Authoritative Points)
// @route   POST /api/challenges/:id/complete
// @access  Private
const submitChallengeCompletion = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user._id;
    const { reflectionNote } = req.body;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Conservation challenge not found',
      });
    }

    const now = new Date();
    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const activityKey = challenge.durationType === 'daily' ? `challenge_${challengeId}_${dateKey}` : `challenge_${challengeId}`;

    // Check idempotency in ledger
    const existingProgress = await UserProgress.findOne({ userId, activityKey });
    if (existingProgress) {
      return res.status(400).json({
        success: false,
        message: challenge.durationType === 'daily' ? 'You have already completed this daily challenge today!' : 'You have already completed this challenge!',
      });
    }

    // Record ledger entry
    await UserProgress.create({
      userId,
      activityType: 'challenge',
      activityId: challengeId,
      activityKey,
      pointsEarned: challenge.pointsReward,
      waterSavedLiters: challenge.waterSavedRewardLiters,
      details: { reflectionNote: reflectionNote || 'Completed action' },
    });

    const user = await User.findById(userId);
    const { newBadges, levelInfo } = await awardUserProgress({
      user,
      pointsEarned: challenge.pointsReward,
      waterSavedLiters: challenge.waterSavedRewardLiters,
      updateStreak: true,
    });

    res.json({
      success: true,
      message: `Challenge completed! You earned +${challenge.pointsReward} pts & saved +${challenge.waterSavedRewardLiters}L water.`,
      pointsEarned: challenge.pointsReward,
      waterSavedLiters: challenge.waterSavedRewardLiters,
      totalPoints: user.totalPoints,
      totalWaterSaved: user.waterSavedLiters,
      levelInfo,
      newBadges,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Already completed this challenge!',
      });
    }
    next(error);
  }
};

// @desc    Create new challenge
// @route   POST /api/challenges
// @access  Private/Admin
const createChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Conservation challenge created successfully',
      challenge,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete challenge
// @route   DELETE /api/challenges/:id
// @access  Private/Admin
const deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }
    res.json({
      success: true,
      message: 'Challenge deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChallenges,
  submitChallengeCompletion,
  createChallenge,
  deleteChallenge,
};
