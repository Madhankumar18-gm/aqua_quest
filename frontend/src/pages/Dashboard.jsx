import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import LevelSphere3D from '../components/common/LevelSphere3D';
import Card3D from '../components/common/Card3D';
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
  Sparkles,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState(null);

  if (!user) return null;

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
      
      {/* 3D Dashboard Main Banner & Level Sphere */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Banner Card */}
        <div className="lg:col-span-2 card-panel-3d bg-gradient-to-r from-slate-900 via-slate-900/95 to-teal-950/50 border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-5 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-sky-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-xl shadow-teal-500/30 shrink-0 transform-style-3d translate-z-30">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white truncate">
                  Welcome back, {user.username}!
                </h1>
                <span className="px-3 py-0.5 bg-teal-500/20 border border-teal-500/40 text-teal-300 rounded-full text-xs font-bold shrink-0 uppercase tracking-wide shadow-sm">
                  {user.role}
                </span>
              </div>
              <p className="text-teal-400 font-bold text-xs sm:text-sm flex items-center gap-1.5 truncate">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" /> Level {user.level || 1} — {user.levelTitle || 'Water Saver Trainee'}
              </p>
            </div>
          </div>

          {/* Daily Streak Check-in Button */}
          <div className="pt-2">
            <button
              onClick={handleDailyCheckin}
              disabled={checkinLoading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition duration-200 active:translate-y-0.5 disabled:opacity-50"
            >
              <Flame className="w-5 h-5 fill-slate-950 shrink-0" />
              <span>{checkinLoading ? 'Claiming Reward...' : 'Claim Daily Streak (+15 PTS)'}</span>
            </button>
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
        </div>

        {/* 3D Glass Liquid Level Sphere Component */}
        <div className="lg:col-span-1">
          <LevelSphere3D user={user} />
        </div>
      </div>

      {/* 3D Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        
        <Card3D maxTilt={15} scale={1.03}>
          <div className="card-panel-3d space-y-2 h-full">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 translate-z-10">Total Points</span>
              <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20 translate-z-20"><Droplets className="w-4 h-4" /></div>
            </div>
            <p className="text-3xl font-black text-white translate-z-30">{user.totalPoints || 0}</p>
            <p className="text-[11px] text-sky-400 font-bold translate-z-10">Server-authoritative balance</p>
          </div>
        </Card3D>

        <Card3D maxTilt={15} scale={1.03}>
          <div className="card-panel-3d space-y-2 h-full">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 translate-z-10">Active Streak</span>
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20 translate-z-20"><Flame className="w-4 h-4" /></div>
            </div>
            <p className="text-3xl font-black text-white translate-z-30">{user.currentStreak || 0} Days</p>
            <p className="text-[11px] text-amber-400 font-bold translate-z-10">Max Streak: {user.maxStreak || 0} Days</p>
          </div>
        </Card3D>

        <Card3D maxTilt={15} scale={1.03}>
          <div className="card-panel-3d space-y-2 h-full">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 translate-z-10">Water Saved</span>
              <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20 translate-z-20"><Waves className="w-4 h-4" /></div>
            </div>
            <p className="text-3xl font-black text-white translate-z-30">{user.waterSavedLiters || 0} L</p>
            <p className="text-[11px] text-teal-400 font-bold translate-z-10">Estimated groundwater saved</p>
          </div>
        </Card3D>

        <Card3D maxTilt={15} scale={1.03}>
          <div className="card-panel-3d space-y-2 h-full">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 translate-z-10">Badges Earned</span>
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20 translate-z-20"><Award className="w-4 h-4" /></div>
            </div>
            <p className="text-3xl font-black text-white translate-z-30">{user.badges ? user.badges.length : 0}</p>
            <p className="text-[11px] text-purple-400 font-bold translate-z-10">Conservation honors</p>
          </div>
        </Card3D>

      </div>

      {/* Quick Launch Quests with 3D Tilt Cards */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-teal-400" /> Conservation Quests & Activities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          <Card3D maxTilt={12}>
            <Link to="/challenges" className="card-panel-3d space-y-4 block h-full flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl w-fit border border-sky-500/20 group-hover:scale-105 transition-transform translate-z-30">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition translate-z-20">Conservation Missions</h3>
                <p className="text-xs text-slate-400 leading-relaxed translate-z-10">Complete daily household challenges & submit your progress.</p>
              </div>
              <span className="text-xs font-black text-sky-400 flex items-center gap-1 pt-2 translate-z-20">
                Start Missions <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </Card3D>

          <Card3D maxTilt={12}>
            <Link to="/quizzes" className="card-panel-3d space-y-4 block h-full flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl w-fit border border-teal-500/20 group-hover:scale-105 transition-transform translate-z-30">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition translate-z-20">Interactive Quizzes</h3>
                <p className="text-xs text-slate-400 leading-relaxed translate-z-10">Test your hydrogeology literacy and earn server-verified points.</p>
              </div>
              <span className="text-xs font-black text-teal-400 flex items-center gap-1 pt-2 translate-z-20">
                Take a Quiz <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </Card3D>

          <Card3D maxTilt={12}>
            <Link to="/articles" className="card-panel-3d space-y-4 block h-full flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit border border-emerald-500/20 group-hover:scale-105 transition-transform translate-z-30">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition translate-z-20">Groundwater Hub</h3>
                <p className="text-xs text-slate-400 leading-relaxed translate-z-10">Read articles on rainwater harvesting and aquifer management.</p>
              </div>
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1 pt-2 translate-z-20">
                Read Articles <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </Card3D>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
