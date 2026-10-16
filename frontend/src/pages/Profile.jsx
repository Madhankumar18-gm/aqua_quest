import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card3D from '../components/common/Card3D';
import Badge3D from '../components/common/Badge3D';
import {
  User as UserIcon,
  Award,
  History,
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

  if (loading) return <LoadingSpinner message="Loading user profile & 3D badge showcase..." />;
  if (!profileData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 3D Header Banner Card */}
      <Card3D maxTilt={8} scale={1.01}>
        <div className="card-panel-3d bg-gradient-to-r from-slate-900 via-slate-900/95 to-teal-950/50 border-slate-700/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-sky-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shrink-0 transform-style-3d translate-z-30">
              {profileData.username ? profileData.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white truncate translate-z-20">{profileData.username}</h1>
              <p className="text-xs sm:text-sm text-teal-400 font-extrabold translate-z-10">{profileData.levelTitle} (Level {profileData.level})</p>
              <p className="text-xs text-slate-400 font-medium">{profileData.email}</p>
            </div>
          </div>

          {/* User stats overview */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center shrink-0 translate-z-20">
            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-inner">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Points</p>
              <p className="text-base sm:text-xl font-black text-sky-400 mt-0.5">{profileData.totalPoints}</p>
            </div>
            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-inner">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Active Streak</p>
              <p className="text-base sm:text-xl font-black text-amber-400 mt-0.5">{profileData.currentStreak}d</p>
            </div>
            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-inner">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Water Saved</p>
              <p className="text-base sm:text-xl font-black text-teal-400 mt-0.5">{profileData.waterSavedLiters}L</p>
            </div>
          </div>
        </div>
      </Card3D>

      {/* Edit Profile Section */}
      <div className="card-panel-3d space-y-4">
        <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
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
            className="btn-primary-3d w-full sm:w-auto px-5 py-2.5 text-xs font-extrabold shrink-0"
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* 3D Holographic Badge Showcase Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" /> 3D Earned Badges ({profileData.badges ? profileData.badges.length : 0})
          </h2>
          <span className="text-xs text-slate-400 font-bold">Click coins to flip 3D descriptions</span>
        </div>

        {profileData.badges && profileData.badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center pt-2">
            {profileData.badges.map((badge, idx) => (
              <Badge3D key={idx} badge={badge} isUnlocked={true} size="md" />
            ))}
          </div>
        ) : (
          <div className="card-panel-3d p-8 text-center text-slate-400 text-xs sm:text-sm font-semibold">
            No badges unlocked yet. Complete daily challenges and quizzes to earn your first 3D badge!
          </div>
        )}
      </div>

      {/* Activity History Ledger */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <History className="w-5 h-5 text-sky-400" /> Server Progress Ledger
        </h2>

        {profileData.history && profileData.history.length > 0 ? (
          <div className="card-panel-3d overflow-hidden p-0! divide-y divide-slate-800/80 shadow-2xl">
            {profileData.history.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs sm:text-sm hover:bg-slate-800/40 transition duration-150">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-950 rounded-xl text-teal-400 border border-slate-800 shadow-inner">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white capitalize">{item.activityType.replace('_', ' ')}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  {item.pointsEarned > 0 && (
                    <span className="font-black text-sky-400 text-xs">+{item.pointsEarned} PTS</span>
                  )}
                  {item.waterSavedLiters > 0 && (
                    <span className="font-black text-teal-400 text-xs">+{item.waterSavedLiters}L Saved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-panel-3d p-8 text-center text-slate-400 text-xs sm:text-sm font-semibold">
            No activities recorded in your ledger yet.
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
