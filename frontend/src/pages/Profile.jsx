import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  User as UserIcon,
  Award,
  History,
  Droplets,
  Flame,
  Waves,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [updateMessage, setUpdateMessage] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/users/profile');
      if (res.data.success) {
        setProfileData(res.data.profile);
        setUsernameInput(res.data.profile.username);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMessage(null);
    try {
      const res = await axiosInstance.put('/users/profile', { username: usernameInput });
      if (res.data.success) {
        setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
        fetchProfile();
      }
    } catch (err) {
      setUpdateMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading user profile & badge showcase..." />;
  if (!profileData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header card */}
      <div className="card-panel bg-gradient-to-r from-slate-900 via-slate-900/95 to-teal-950/40 border-slate-700/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shrink-0">
            {profileData.username ? profileData.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-extrabold text-white truncate">{profileData.username}</h1>
            <p className="text-xs sm:text-sm text-teal-400 font-extrabold mt-0.5">{profileData.levelTitle} (Level {profileData.level})</p>
            <p className="text-xs text-slate-400 mt-0.5">{profileData.email}</p>
          </div>
        </div>

        {/* User stats overview */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center shrink-0">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Points</p>
            <p className="text-base sm:text-xl font-extrabold text-sky-400 mt-0.5">{profileData.totalPoints}</p>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Active Streak</p>
            <p className="text-base sm:text-xl font-extrabold text-amber-400 mt-0.5">{profileData.currentStreak}d</p>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Water Saved</p>
            <p className="text-base sm:text-xl font-extrabold text-teal-400 mt-0.5">{profileData.waterSavedLiters}L</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Section */}
      <div className="card-panel space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-teal-400" /> Account Settings
        </h2>

        {updateMessage && (
          <div
            className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
              updateMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {updateMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{updateMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="flex flex-col sm:flex-row items-end gap-4 max-w-md">
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Display Username
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-400 text-xs sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={updating}
            className="btn-primary w-full sm:w-auto px-5 py-2.5 text-xs font-bold shrink-0"
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Earned Badges Showcase */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" /> Earned Badges ({profileData.badges ? profileData.badges.length : 0})
        </h2>

        {profileData.badges && profileData.badges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileData.badges.map((badge, idx) => (
              <div
                key={idx}
                className="card-panel flex items-start gap-4"
              >
                <div className="p-3 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl text-slate-950 font-bold shadow shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{badge.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{badge.description}</p>
                  <span className="inline-block text-[10px] text-teal-400 mt-2 font-mono font-semibold">
                    Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-panel p-8 text-center text-slate-400 text-xs sm:text-sm font-semibold">
            No badges unlocked yet. Complete daily challenges and quizzes to earn your first badge!
          </div>
        )}
      </div>

      {/* Activity History Ledger */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-sky-400" /> Server Progress Ledger
        </h2>

        {profileData.history && profileData.history.length > 0 ? (
          <div className="card-panel overflow-hidden p-0! divide-y divide-slate-800">
            {profileData.history.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-950 rounded-xl text-teal-400 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white capitalize">{item.activityType.replace('_', ' ')}</p>
                    <p className="text-[11px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  {item.pointsEarned > 0 && (
                    <span className="font-extrabold text-sky-400 text-xs">+{item.pointsEarned} PTS</span>
                  )}
                  {item.waterSavedLiters > 0 && (
                    <span className="font-extrabold text-teal-400 text-xs">+{item.waterSavedLiters}L Saved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-panel p-8 text-center text-slate-400 text-xs sm:text-sm font-semibold">
            No activities recorded in your ledger yet.
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;

