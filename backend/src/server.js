require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedDatabase = require('./utils/seedData');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const quizRoutes = require('./routes/quizRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const defaultOrigins = [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((url) => url.trim()).filter(Boolean)
  : defaultOrigins;

const isProduction = process.env.NODE_ENV === 'production';

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, health checks)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (!isProduction) {
        // Allow unlisted origins during development mode
        return callback(null, true);
      }

      // Strictly reject unlisted origins in production
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);


// Apply global rate limiter
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'AquaQuest API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect DB
    await connectDB();

    // 2. Seed initial admin & content idempotently
    await seedDatabase();

    // 3. Start Express app
    app.listen(PORT, () => {
      console.log(`[AquaQuest Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[AquaQuest API] Health check available at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error(`[Server Initialization Error]: ${error.message}`);
    process.exit(1);
  }
};

startServer();
