const express = require('express');
const { body } = require('express-validator');
const {
  getQuizzes,
  getQuizById,
  submitQuiz,
  createQuiz,
  deleteQuiz,
} = require('../controllers/quizController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { submissionLimiter } = require('../middleware/rateLimiter');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getQuizzes);
router.get('/:id', protect, getQuizById);
router.post('/:id/submit', protect, submissionLimiter, submitQuiz);

// Admin routes
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  [
    body('title').notEmpty().withMessage('Quiz title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
    validateRequest,
  ],
  createQuiz
);

router.delete('/:id', protect, authorizeRoles('admin'), deleteQuiz);

module.exports = router;
