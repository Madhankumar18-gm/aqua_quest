const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      enum: ['quiz', 'challenge', 'daily_checkin', 'article_read'],
      required: true,
    },
    activityId: {
      type: String,
      required: true,
    },
    // Unique identifier key for idempotency checks (e.g. quiz_ID, challenge_ID_2026-09-19)
    activityKey: {
      type: String,
      required: true,
    },
    pointsEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    waterSavedLiters: {
      type: Number,
      default: 0,
      min: 0,
    },
    scorePercentage: {
      type: Number,
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique compound index so the exact same activity key cannot be awarded twice to the same user
userProgressSchema.index({ userId: 1, activityKey: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
