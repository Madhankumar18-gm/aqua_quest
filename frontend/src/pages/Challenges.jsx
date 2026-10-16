import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card3D from '../components/common/Card3D';
import {
  Target,
  Droplets,
  Waves,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';

const Categories = ['All', 'Household Saving', 'Community Action', 'Audit & Fix', 'Rainwater Harvesting', 'Daily Habits'];
const Difficulties = ['All', 'Easy', 'Medium', 'Hard'];

const Challenges = () => {
  const { isAuthenticated, refreshUser } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Modal State
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [reflectionNote, setReflectionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalFeedback, setModalFeedback] = useState(null);

  useEffect(() => {
    fetchChallenges();
  }, [selectedCategory, selectedDifficulty]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      let url = '/challenges';
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await axiosInstance.get(url);
      if (res.data.success) {
        setChallenges(res.data.challenges);
      }
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (challenge) => {
    setActiveChallenge(challenge);
    setReflectionNote('');
    setModalFeedback(null);
  };

  const handleCloseModal = () => {
    setActiveChallenge(null);
    setModalFeedback(null);
  };

  const handleSubmitCompletion = async (e) => {
    e.preventDefault();
    if (!activeChallenge) return;
    setSubmitting(true);
    setModalFeedback(null);

    try {
      const res = await axiosInstance.post(`/challenges/${activeChallenge._id}/complete`, {
        reflectionNote,
      });

      if (res.data.success) {
        setModalFeedback({
          type: 'success',
          message: res.data.message,
          badges: res.data.newBadges || [],
        });
        await refreshUser();
        fetchChallenges();
      }
    } catch (err) {
      setModalFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to complete challenge.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-bold tracking-wide">
          <Target className="w-4 h-4 text-sky-400" /> Conservation Missions
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Water Conservation Challenges</h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
          Take real-world action, reduce household waste, and earn server-verified conservation points.
        </p>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
          {Categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-bold">Difficulty:</span>
          {Difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                selectedDifficulty === diff
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid with 3D Cards */}
      {loading ? (
        <LoadingSpinner message="Fetching water conservation challenges..." />
      ) : challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((item) => (
            <Card3D key={item._id} maxTilt={12} scale={1.02}>
              <div
                className={`card-panel-3d flex flex-col justify-between space-y-6 h-full transition ${
                  item.isCompletedToday
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'hover:border-sky-500/50'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 bg-slate-950 border border-slate-700 text-sky-400 text-[11px] font-black rounded-lg translate-z-20">
                      {item.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider translate-z-20 ${
                        item.difficulty === 'Easy'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.difficulty === 'Medium'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {item.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white mb-1.5 translate-z-30">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed translate-z-10">{item.description}</p>
                  </div>

                  {/* Rewards pill */}
                  <div className="flex items-center gap-3 p-3 bg-slate-950/90 rounded-xl border border-slate-800/90 text-xs font-bold translate-z-20 shadow-inner">
                    <div className="flex items-center gap-1 text-sky-400">
                      <Droplets className="w-4 h-4" />
                      <span>+{item.pointsReward} PTS</span>
                    </div>
                    <span className="text-slate-700">|</span>
                    <div className="flex items-center gap-1 text-teal-400">
                      <Waves className="w-4 h-4" />
                      <span>+{item.waterSavedRewardLiters}L Saved</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="translate-z-30">
                  {item.isCompletedToday ? (
                    <div className="w-full py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md">
                      <CheckCircle2 className="w-4 h-4" /> Completed Today
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(item)}
                      disabled={!isAuthenticated}
                      className="btn-primary-3d w-full py-2.5 text-xs font-black"
                    >
                      {isAuthenticated ? 'Complete Mission & Claim Rewards' : 'Log In to Complete'}
                    </button>
                  )}
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      ) : (
        <div className="card-panel-3d p-12 text-center text-slate-400 text-xs sm:text-sm font-semibold">
          No challenges found matching your selected filters.
        </div>
      )}

      {/* Completion Modal */}
      {activeChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-panel-3d bg-slate-900/95 border-slate-700 p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-float-3d">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-300 text-xs font-bold rounded-md border border-sky-500/30">
                {activeChallenge.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{activeChallenge.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">{activeChallenge.instructions}</p>
            </div>

            {modalFeedback ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-3 ${
                    modalFeedback.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  {modalFeedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <span>{modalFeedback.message}</span>
                </div>

                {modalFeedback.badges && modalFeedback.badges.length > 0 && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-amber-300 text-xs">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> New Badge Unlocked!
                    </p>
                    {modalFeedback.badges.map((b) => (
                      <p key={b.code} className="text-white font-bold">{b.name} — {b.description}</p>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleCloseModal}
                  className="btn-secondary-3d w-full py-2.5 text-xs font-bold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitCompletion} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Action Reflection / Proof Description (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={reflectionNote}
                    onChange={(e) => setReflectionNote(e.target.value)}
                    placeholder="e.g. Fixed the kitchen sink washer tap dripping 1 drop per sec."
                    className="w-full p-3 bg-slate-800/90 border border-slate-700/80 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-3d w-full py-3 text-xs font-black"
                >
                  {submitting ? 'Submitting to Server...' : 'Confirm Action & Claim Rewards'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Challenges;
