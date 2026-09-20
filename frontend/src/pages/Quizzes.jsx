import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { HelpCircle, Droplets, CheckCircle2, ArrowRight, Award, Zap } from 'lucide-react';

const Quizzes = () => {
  const { isAuthenticated } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/quizzes');
      if (res.data.success) {
        setQuizzes(res.data.quizzes);
      }
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-300 text-xs font-bold tracking-wide">
          <HelpCircle className="w-4 h-4 text-teal-400" /> Interactive Knowledge Tests
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Groundwater & Conservation Quizzes</h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Answer hydrogeology questions. Scores are evaluated strictly on the backend to award points and unlock badges.
        </p>
      </div>

      {/* Quiz List */}
      {loading ? (
        <LoadingSpinner message="Fetching interactive quizzes..." />
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`card-panel flex flex-col justify-between space-y-6 transition ${
                quiz.isPassed
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'hover:border-teal-500/40'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-700 text-teal-300 text-[11px] font-extrabold rounded-lg">
                    {quiz.category}
                  </span>
                  <span className="px-2.5 py-0.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {quiz.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-1.5">{quiz.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{quiz.description}</p>
                </div>

                {/* Details pill */}
                <div className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-bold">
                  <div className="flex items-center gap-1 text-sky-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>{quiz.totalQuestions} Questions</span>
                  </div>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-1 text-teal-400">
                    <Droplets className="w-4 h-4" />
                    <span>+{quiz.pointsReward} PTS</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {quiz.isPassed ? (
                  <Link
                    to={`/quizzes/${quiz.id}`}
                    className="w-full py-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Passed — Retake Quiz
                  </Link>
                ) : (
                  <Link
                    to={isAuthenticated ? `/quizzes/${quiz.id}` : '/login'}
                    className="btn-primary w-full py-2.5 text-xs font-extrabold"
                  >
                    {isAuthenticated ? 'Take Quiz Now' : 'Log In to Start'} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-panel p-12 text-center text-slate-400 text-xs sm:text-sm font-semibold">
          No quizzes available yet.
        </div>
      )}

    </div>
  );
};

export default Quizzes;

