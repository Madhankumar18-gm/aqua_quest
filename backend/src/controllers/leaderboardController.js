const User = require('../models/User');

// @desc    Get global leaderboard ranked by points, streak, or water saved
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const { sortBy = 'points', limit = 50 } = req.query;

    let sortField = { totalPoints: -1 };
    if (sortBy === 'streak') sortField = { currentStreak: -1, totalPoints: -1 };
    if (sortBy === 'water') sortField = { waterSavedLiters: -1, totalPoints: -1 };

    const topUsers = await User.find({ role: 'user' })
      .select('username level levelTitle totalPoints currentStreak maxStreak waterSavedLiters avatar badges createdAt')
      .sort(sortField)
      .limit(parseInt(limit, 10));

    const leaderboard = topUsers.map((u, index) => ({
      rank: index + 1,
      id: u._id,
      username: u.username,
      level: u.level,
      levelTitle: u.levelTitle,
      totalPoints: u.totalPoints,
      currentStreak: u.currentStreak,
      waterSavedLiters: u.waterSavedLiters,
      badgeCount: u.badges ? u.badges.length : 0,
      avatar: u.avatar,
    }));

    res.json({
      success: true,
      sortBy,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboard,
};
