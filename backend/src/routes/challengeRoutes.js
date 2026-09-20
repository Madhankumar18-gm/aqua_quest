const express = require('express');
const { body } = require('express-validator');
const {
  getChallenges,
  submitChallengeCompletion,
  createChallenge,
  deleteChallenge,
} = require('../controllers/challengeController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { submissionLimiter } = require('../middleware/rateLimiter');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getChallenges);
router.post('/:id/complete', protect, submissionLimiter, submitChallengeCompletion);

// Admin-only routes
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('pointsReward').isNumeric().withMessage('Points reward must be a number'),
    body('waterSavedRewardLiters').isNumeric().withMessage('Water saved reward must be a number'),
    validateRequest,
  ],
  createChallenge
);

router.delete('/:id', protect, authorizeRoles('admin'), deleteChallenge);

module.exports = router;
