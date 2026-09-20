import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import {
  Droplets,
  Flame,
  Award,
  Waves,
  Zap,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Target,
  HelpCircle,
  Trophy,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState(null);

  if (!user) return null;

  // Level progress calculation
  const getLevelProgress = (points) => {
    if (points < 100) return { min: 0, max: 100, current: points };
    if (points < 250) return { min: 100, max: 250, current: points };
    if (points < 500) return { min: 250, max: 500, current: points };
    if (points < 1000) return { min: 500, max: 1000, current: points };
    if (points < 2000) return { min: 1000, max: 2000, current: points };
    return { min: 2000, max: 5000, current: points };
  };

  const progress = getLevelProgress(user.totalPoints || 0);
  const progressPercent = Math.min(
    100,
    Math.round(((progress.current - progress.min) / (progress.max - progress.min)) * 100)
  );

  const handleDailyCheckin = async () => {
    setCheckinLoading(true);
    setCheckinMessage(null);
    try {
      const res = await axiosInstance.post('/users/daily-checkin');
      if (res.data.success) {
        setCheckinMessage({ type: 'success', text: res.data.message });
        await refreshUser();
      }
    } catch (err) {
      setCheckinMessage({
        type: 'error',
        text: err.response?.data?.message || 'Daily check-in reward already claimed today!',
      });
    } finally {
      setCheckinLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* User Banner Header */}
      <div className="card-panel bg-gradient-to-r from-slate-900 via-slate-900/95 to-teal-950/40 border-slate-700/80 p-5 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-lg shadow-teal-500/20 shrink-0">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-3xl font-extrabold text-white truncate max-w-full">Welcome back, {user.username}!</h1>
              <span className="px-2.5 py-0.5 bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded-full text-xs font-bold shrink-0 uppercase tracking-wide">
                {user.role}
              </span>
            </div>
            <p className="text-teal-400 font-bold text-xs sm:text-sm mt-1 flex items-center gap-1.5 truncate">
              <Sparkles className="w-4 h-4 shrink-0" /> Level {user.level || 1} — {user.levelTitle || 'Water Saver Trainee'}
            </p>
          </div>
        </div>

        {/* Daily Streak Check-in Button */}
        <div className="w-full lg:w-auto shrink-0">
          <button
            onClick={handleDailyCheckin}
            disabled={checkinLoading}
            className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-95"
          >
            <Flame className="w-4 h-4 fill-slate-950 shrink-0" />
            <span>{checkinLoading ? 'Claiming...' : 'Claim Daily Streak (+15 PTS)'}</span>
          </button>
        </div>
      </div>

      {checkinMessage && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-3 ${
            checkinMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}
        >
          {checkinMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{checkinMessage.text}</span>
        </div>
      )}

      {/* Level Progress Bar */}
      <div className="card-panel space-y-3">
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
          <span className="text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-400" /> Level Progression
          </span>
          <span className="text-teal-400 font-extrabold">
            {progress.current} / {progress.max} PTS ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-sky-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-[11px] text-slate-400 font-medium text-right">
          Earn {progress.max - progress.current} more points to reach the next tier!
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="card-panel space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Points</span>
            <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20"><Droplets className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{user.totalPoints || 0}</p>
          <p className="text-[11px] text-sky-400 font-semibold">Server-authoritative balance</p>
        </div>

        <div className="card-panel space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Active Streak</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20"><Flame className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{user.currentStreak || 0} Days</p>
          <p className="text-[11px] text-amber-400 font-semibold">Max Streak: {user.maxStreak || 0} Days</p>
        </div>

        <div className="card-panel space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Water Saved</span>
            <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20"><Waves className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{user.waterSavedLiters || 0} L</p>
          <p className="text-[11px] text-teal-400 font-semibold">Estimated groundwater saved</p>
        </div>

        <div className="card-panel space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Badges Earned</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20"><Award className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{user.badges ? user.badges.length : 0}</p>
          <p className="text-[11px] text-purple-400 font-semibold">Conservation honors</p>
        </div>

      </div>

      {/* Quick Launch Quests */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-teal-400" /> Conservation Quests & Activities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link
            to="/challenges"
            className="card-panel-hover space-y-4 group"
          >
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit border border-sky-500/20 group-hover:scale-105 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">Conservation Missions</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Complete daily household challenges & submit your progress.</p>
            </div>
            <span className="text-xs font-extrabold text-sky-400 flex items-center gap-1">
              Start Missions <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/quizzes"
            className="card-panel-hover space-y-4 group"
          >
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit border border-teal-500/20 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">Interactive Quizzes</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Test your hydrogeology literacy and earn server-verified points.</p>
            </div>
            <span className="text-xs font-extrabold text-teal-400 flex items-center gap-1">
              Take a Quiz <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/articles"
            className="card-panel-hover space-y-4 group"
          >
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">Groundwater Hub</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Read articles on rainwater harvesting and aquifer management.</p>
            </div>
            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
              Read Articles <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

