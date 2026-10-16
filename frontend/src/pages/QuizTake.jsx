import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card3D from '../components/common/Card3D';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Droplets,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active taking state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Server Result State
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, [id]);

  const fetchQuizData = async () => {
    try {
      const res = await axiosInstance.get(`/quizzes/${id}`);
      if (res.data.success) {
        setQuiz(res.data.quiz);
      }
    } catch (err) {
      console.error('Failed to load quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIdx, optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (selectedAnswers[currentQuestionIndex] === undefined) {
      return;
    }
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(selectedAnswers).map(([qIdx, optIdx]) => ({
        questionIndex: parseInt(qIdx, 10),
        selectedOptionIndex: optIdx,
      }));

      const res = await axiosInstance.post(`/quizzes/${id}/submit`, {
        answers: formattedAnswers,
      });

      if (res.data.success) {
        setResult(res.data);
        await refreshUser();
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading quiz questions..." />;
  if (!quiz) return <div className="text-center py-12 text-slate-400 text-sm font-semibold">Quiz not found.</div>;

  // Render Result View if quiz is submitted
  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link to="/quizzes" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-400 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </Link>

        {/* 3D Result Header Card */}
        <Card3D maxTilt={10} scale={1.02}>
          <div
            className={`card-panel-3d text-center space-y-4 shadow-2xl ${
              result.passed
                ? 'bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/50 glow-emerald'
                : 'bg-gradient-to-b from-slate-900 to-slate-900 border-slate-700/80'
            }`}
          >
            <div
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-black shadow-xl translate-z-40 ${
                result.passed ? 'bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950' : 'bg-slate-700 text-white'
              }`}
            >
              {result.scorePercentage}%
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white translate-z-30">
              {result.passed ? 'Quiz Passed!' : 'Quiz Attempt Completed'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-medium translate-z-20">{result.message}</p>

            {result.pointsEarned > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 border border-sky-500/40 rounded-full text-sky-300 text-xs font-black translate-z-30 shadow-md">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>+{result.pointsEarned} PTS Server-Awarded!</span>
              </div>
            )}

            {result.newBadges && result.newBadges.length > 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-2xl max-w-md mx-auto space-y-2 text-amber-300 text-xs translate-z-30 shadow-lg">
                <p className="font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> New Badge Unlocked!
                </p>
                {result.newBadges.map((b) => (
                  <p key={b.code} className="text-white font-black">{b.name} — {b.description}</p>
                ))}
              </div>
            )}
          </div>
        </Card3D>

        {/* Question Explanations List */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-black text-white">Answer Key & Detailed Explanations</h3>
          <div className="space-y-4">
            {result.detailedResults.map((item, idx) => (
              <div
                key={idx}
                className={`card-panel-3d space-y-3 ${
                  item.isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/15'
                    : 'border-red-500/40 bg-red-950/15'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                    Q{idx + 1}. {item.questionText}
                  </h4>
                  {item.isCorrect ? (
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-red-500/20 text-red-300 text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  {item.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-xl text-xs font-bold border ${
                        optIdx === item.correctOptionIndex
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                          : optIdx === item.userSelectedIndex
                          ? 'bg-red-500/20 border-red-500/40 text-red-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {opt} {optIdx === item.correctOptionIndex && ' (Correct Answer)'}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-teal-400 font-bold block mb-0.5">Explanation:</strong>
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setResult(null)}
            className="btn-secondary-3d px-6 py-2.5 text-xs font-extrabold"
          >
            <RefreshCw className="w-4 h-4" /> Retake Quiz
          </button>
          <Link
            to="/quizzes"
            className="btn-primary-3d px-6 py-2.5 text-xs font-extrabold"
          >
            Back to All Quizzes
          </Link>
        </div>
      </div>
    );
  }

  // Active Quiz View
  const currentQ = quiz.questions[currentQuestionIndex];
  const totalQ = quiz.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQ - 1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs text-teal-400 font-extrabold uppercase tracking-wider">{quiz.category}</span>
          <h1 className="text-lg sm:text-2xl font-black text-white">{quiz.title}</h1>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[11px] text-slate-400 font-bold block">Question</span>
          <span className="text-base sm:text-lg font-black text-sky-400">{currentQuestionIndex + 1} / {totalQ}</span>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2">
        {quiz.questions.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              idx === currentQuestionIndex
                ? 'bg-teal-400 shadow-lg shadow-teal-400/40 scale-y-125'
                : selectedAnswers[idx] !== undefined
                ? 'bg-sky-500'
                : 'bg-slate-800'
            }`}
          ></div>
        ))}
      </div>

      {/* Question Card */}
      <Card3D maxTilt={6} scale={1.01}>
        <div className="card-panel-3d p-6 sm:p-8 space-y-6">
          <h2 className="text-base sm:text-xl font-black text-white leading-snug translate-z-30">
            {currentQuestionIndex + 1}. {currentQ.questionText}
          </h2>

          {/* Options with Tactile 3D Depth */}
          <div className="space-y-3">
            {currentQ.options.map((optText, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                  className={`quiz-option-btn w-full p-4 rounded-xl text-left font-bold text-xs sm:text-sm border transition-all duration-200 flex items-center justify-between transform-style-3d translate-z-20 active:translate-z-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-500/20 via-sky-500/20 to-teal-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/20 scale-[1.01]'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <span className="translate-z-10">{optText}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-transform ${
                      isSelected ? 'border-teal-400 bg-teal-400 text-slate-950 font-black scale-110' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && '✓'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card3D>

      {/* Nav Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="btn-secondary-3d px-5 py-2.5 text-xs font-bold"
        >
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="quiz-submit-btn btn-primary-3d px-8 py-2.5 text-xs font-black"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz & Calculate Score'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQ - 1, prev + 1))}
            className="quiz-next-btn btn-primary-3d px-6 py-2.5 text-xs font-black"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};

export default QuizTake;
