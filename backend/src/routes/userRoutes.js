const express = require('express');
const { getUserProfile, updateProfile, claimDailyCheckin } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { submissionLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.post('/daily-checkin', protect, submissionLimiter, claimDailyCheckin);

module.exports = router;
