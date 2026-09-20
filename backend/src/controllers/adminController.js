const User = require('../models/User');
const Article = require('../models/Article');
const Challenge = require('../models/Challenge');
const Quiz = require('../models/Quiz');
const UserProgress = require('../models/UserProgress');

// @desc    Get system administration dashboard metrics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalArticles = await Article.countDocuments({});
    const totalChallenges = await Challenge.countDocuments({});
    const totalQuizzes = await Quiz.countDocuments({});
    const totalCompletions = await UserProgress.countDocuments({});

    // Aggregate overall water saved & points awarded
    const aggregates = await User.aggregate([
      {
        $group: {
          _id: null,
          totalPointsAwarded: { $sum: '$totalPoints' },
          totalWaterSavedLiters: { $sum: '$waterSavedLiters' },
        },
      },
    ]);

    const stats = {
      totalUsers,
      totalArticles,
      totalChallenges,
      totalQuizzes,
      totalCompletions,
      totalPointsAwarded: aggregates[0] ? aggregates[0].totalPointsAwarded : 0,
      totalWaterSavedLiters: aggregates[0] ? aggregates[0].totalWaterSavedLiters : 0,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user accounts for admin management
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (promote/demote)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User '${user.username}' role updated to '${role}'.`,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminUsers,
  updateUserRole,
};
