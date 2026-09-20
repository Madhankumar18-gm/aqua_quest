const Badge = require('../models/Badge');
const UserProgress = require('../models/UserProgress');

// Calculate user level & title based on total points
const calculateLevel = (points) => {
  if (points < 100) return { level: 1, title: 'Water Saver Trainee' };
  if (points < 250) return { level: 2, title: 'Hydro Apprentice' };
  if (points < 500) return { level: 3, title: 'Aquifer Defender' };
  if (points < 1000) return { level: 4, title: 'Groundwater Guardian' };
  if (points < 2000) return { level: 5, title: 'Water Conservation Hero' };
  return { level: 6 + Math.floor((points - 2000) / 1000), title: 'Master Hydrogeologist' };
};

// Check and award new badges to user based on server stats
const evaluateBadges = async (user) => {
  try {
    const allBadges = await Badge.find({});
    if (!allBadges || allBadges.length === 0) return [];

    // Counts from user progress ledger
    const quizzesCount = await UserProgress.countDocuments({ userId: user._id, activityType: 'quiz' });
    const challengesCount = await UserProgress.countDocuments({ userId: user._id, activityType: 'challenge' });

    const newBadgesAwarded = [];
    const existingBadgeCodes = new Set(user.badges.map((b) => b.badgeCode));

    for (const badge of allBadges) {
      if (existingBadgeCodes.has(badge.code)) continue;

      let qualified = false;

      switch (badge.requirementType) {
        case 'totalPoints':
          if (user.totalPoints >= badge.requirementThreshold) qualified = true;
          break;
        case 'currentStreak':
          if (user.currentStreak >= badge.requirementThreshold) qualified = true;
          break;
        case 'waterSavedLiters':
          if (user.waterSavedLiters >= badge.requirementThreshold) qualified = true;
          break;
        case 'quizzesCompleted':
          if (quizzesCount >= badge.requirementThreshold) qualified = true;
          break;
        case 'challengesCompleted':
          if (challengesCount >= badge.requirementThreshold) qualified = true;
          break;
        default:
          break;
      }

      if (qualified) {
        user.badges.push({ badgeCode: badge.code, earnedAt: new Date() });
        existingBadgeCodes.add(badge.code);
        newBadgesAwarded.push(badge);
      }
    }

    return newBadgesAwarded;
  } catch (err) {
    console.error('[Gamification Error] Failed to evaluate badges:', err);
    return [];
  }
};

// Server-authoritative update of user points, level, water saved, streak, and badges
const awardUserProgress = async ({ user, pointsEarned = 0, waterSavedLiters = 0, updateStreak = false }) => {
  // 1. Add points and water saved
  user.totalPoints += pointsEarned;
  user.waterSavedLiters += waterSavedLiters;

  // 2. Recalculate level
  const levelInfo = calculateLevel(user.totalPoints);
  user.level = levelInfo.level;
  user.levelTitle = levelInfo.title;

  // 3. Update streak if applicable
  if (updateStreak) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!user.lastActiveDate) {
      user.currentStreak = 1;
      user.lastActiveDate = now;
    } else {
      const lastActive = new Date(user.lastActiveDate);
      const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

      const diffTime = today.getTime() - lastActiveDay.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 1) {
        // Consecutive day
        user.currentStreak += 1;
        user.lastActiveDate = now;
      } else if (diffDays > 1) {
        // Streak broken
        user.currentStreak = 1;
        user.lastActiveDate = now;
      } else if (diffDays === 0) {
        // Already active today, maintain streak
        user.lastActiveDate = now;
      }
    }

    if (user.currentStreak > user.maxStreak) {
      user.maxStreak = user.currentStreak;
    }
  }

  // 4. Evaluate and grant newly unlocked badges
  const newBadges = await evaluateBadges(user);

  // 5. Save user
  await user.save();

  return {
    user,
    newBadges,
    levelInfo,
  };
};

module.exports = {
  calculateLevel,
  evaluateBadges,
  awardUserProgress,
};
