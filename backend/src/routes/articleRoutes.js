const express = require('express');
const { body } = require('express-validator');
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', getAllArticles);
router.get('/:id', getArticleById);

// Admin-only routes
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  [
    body('title').notEmpty().withMessage('Article title is required'),
    body('summary').notEmpty().withMessage('Summary is required'),
    body('content').notEmpty().withMessage('Article content is required'),
    body('category').notEmpty().withMessage('Category is required'),
    validateRequest,
  ],
  createArticle
);

router.put('/:id', protect, authorizeRoles('admin'), updateArticle);
router.delete('/:id', protect, authorizeRoles('admin'), deleteArticle);

module.exports = router;
