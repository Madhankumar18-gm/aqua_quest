const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    iconName: {
      type: String,
      default: 'award',
    },
    category: {
      type: String,
      enum: ['points', 'streak', 'quizzes', 'challenges', 'water_saved', 'special'],
      default: 'points',
    },
    requirementType: {
      type: String,
      required: true,
      enum: ['totalPoints', 'currentStreak', 'quizzesCompleted', 'challengesCompleted', 'waterSavedLiters'],
    },
    requirementThreshold: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Badge', badgeSchema);
