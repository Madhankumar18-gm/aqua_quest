const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    instructions: {
      type: String,
      default: 'Take action today, document your steps, and report your completion to claim points.',
    },
    category: {
      type: String,
      enum: ['Household Saving', 'Community Action', 'Audit & Fix', 'Rainwater Harvesting', 'Daily Habits'],
      default: 'Household Saving',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    pointsReward: {
      type: Number,
      required: true,
      min: 10,
      max: 500,
    },
    waterSavedRewardLiters: {
      type: Number,
      required: true,
      min: 5,
    },
    durationType: {
      type: String,
      enum: ['daily', 'weekly', 'one-time'],
      default: 'daily',
    },
    iconName: {
      type: String,
      default: 'droplet',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Challenge', challengeSchema);
