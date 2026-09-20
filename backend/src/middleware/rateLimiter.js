const rateLimit = require('express-rate-limit');

const isProduction = process.env.NODE_ENV === 'production';

// Helper to parse env limit or fallback to default environment threshold
const getLimit = (envVar, defaultDev, defaultProd) => {
  const parsed = parseInt(envVar, 10);
  if (!isNaN(parsed) && parsed > 0) {
    return parsed;
  }
  return isProduction ? defaultProd : defaultDev;
};

// General API rate limiter (Dev: 200/15m, Prod: 200/15m)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: getLimit(process.env.RATE_LIMIT_API_MAX, 200, 200),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Strict rate limiter for Authentication (Dev: 60/15m, Prod: 10/15m)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: getLimit(process.env.RATE_LIMIT_AUTH_MAX, 60, 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

// Rate limiter for challenge & quiz submissions (Dev: 60/1m, Prod: 10/1m)
const submissionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: getLimit(process.env.RATE_LIMIT_SUBMISSION_MAX, 60, 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Submission rate limit exceeded. Please wait a moment before trying again.',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  submissionLimiter,
};

