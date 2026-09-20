const Quiz = require('../models/Quiz');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const { awardUserProgress } = require('../utils/gamification');

// @desc    Get all available quizzes (sanitized overview)
// @route   GET /api/quizzes
// @access  Public / Private
const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({}).sort({ createdAt: -1 });

    let enrichedQuizzes = quizzes.map((q) => ({
      id: q._id,
      title: q.title,
      description: q.description,
      category: q.category,
      difficulty: q.difficulty,
      pointsReward: q.pointsReward,
      passingScorePercentage: q.passingScorePercentage,
      totalQuestions: q.questions.length,
    }));

    if (req.user) {
      const userCompletions = await UserProgress.find({
        userId: req.user._id,
        activityType: 'quiz',
      });
      const completedSet = new Set(userCompletions.map((uc) => uc.activityId.toString()));

      enrichedQuizzes = enrichedQuizzes.map((q) => ({
        ...q,
        isPassed: completedSet.has(q.id.toString()),
      }));
    }

    res.json({
      success: true,
      count: enrichedQuizzes.length,
      quizzes: enrichedQuizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz questions (stripping answer keys to prevent client cheating)
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Strip correct answer indices & explanations before sending to client
    const sanitizedQuestions = quiz.questions.map((q, idx) => ({
      questionIndex: idx,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json({
      success: true,
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        pointsReward: quiz.pointsReward,
        passingScorePercentage: quiz.passingScorePercentage,
        totalQuestions: sanitizedQuestions.length,
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers -> Server-Authoritative Evaluation & Point Awarding
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const userId = req.user._id;
    const { answers } = req.body; // Expected format: [{ questionIndex: 0, selectedOptionIndex: 1 }]

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission format. Answers array required.',
      });
    }

    // Map user answers by questionIndex
    const answerMap = new Map();
    answers.forEach((ans) => answerMap.set(ans.questionIndex, ans.selectedOptionIndex));

    let correctCount = 0;
    const detailedResults = quiz.questions.map((q, idx) => {
      const selectedIndex = answerMap.has(idx) ? answerMap.get(idx) : null;
      const isCorrect = selectedIndex === q.correctOptionIndex;
      if (isCorrect) correctCount++;

      return {
        questionIndex: idx,
        questionText: q.questionText,
        options: q.options,
        userSelectedIndex: selectedIndex,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const totalQuestions = quiz.questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= quiz.passingScorePercentage;

    let pointsAwarded = 0;
    let waterSavedAwarded = 0;
    let isFirstTimeAward = false;
    let newBadges = [];

    const activityKey = `quiz_${quizId}`;

    if (passed) {
      // Check if already awarded points for this quiz previously
      const existingCompletion = await UserProgress.findOne({ userId, activityKey });

      if (!existingCompletion) {
        isFirstTimeAward = true;
        pointsAwarded = quiz.pointsReward;
        waterSavedAwarded = 15; // 15L water saved bonus for groundwater literacy

        await UserProgress.create({
          userId,
          activityType: 'quiz',
          activityId: quizId,
          activityKey,
          pointsEarned: pointsAwarded,
          waterSavedLiters: waterSavedAwarded,
          scorePercentage,
          details: { correctCount, totalQuestions },
        });

        const user = await User.findById(userId);
        const gamificationResult = await awardUserProgress({
          user,
          pointsEarned: pointsAwarded,
          waterSavedLiters: waterSavedAwarded,
          updateStreak: true,
        });

        newBadges = gamificationResult.newBadges;
      }
    }

    res.json({
      success: true,
      message: passed
        ? isFirstTimeAward
          ? `Quiz Passed! Congratulations, you earned +${pointsAwarded} pts!`
          : `Quiz Passed with ${scorePercentage}%! (Points already awarded previously)`
        : `Quiz completed. You scored ${scorePercentage}%. Passing requirement is ${quiz.passingScorePercentage}%.`,
      passed,
      scorePercentage,
      correctCount,
      totalQuestions,
      pointsEarned: pointsAwarded,
      isFirstTimeAward,
      newBadges,
      detailedResults,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private/Admin
const createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }
    res.json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  submitQuiz,
  createQuiz,
  deleteQuiz,
};
