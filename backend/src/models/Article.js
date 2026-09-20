const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
      maxlength: [300, 'Summary cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Groundwater Depletion', 'Rainwater Harvesting', 'Aquifer Recharge', 'Water Conservation Tips', 'Policy & Science'],
      default: 'Groundwater Depletion',
    },
    readingTimeMinutes: {
      type: Number,
      default: 3,
      min: 1,
    },
    author: {
      type: String,
      default: 'AquaQuest Expert Team',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    },
    likesCount: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('Article', articleSchema);
