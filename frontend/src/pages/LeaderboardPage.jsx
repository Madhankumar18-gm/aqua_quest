import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Trophy, Flame, Droplets, Waves, Award, Medal, Sparkles } from 'lucide-react';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('points'); // 'points', 'streak', 'water'

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/leaderboard?sortBy=${sortBy}`);
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-bold tracking-wide">
          <Trophy className="w-4 h-4 text-amber-400" /> Global Ranks
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Water Conservation Leaderboard</h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Rankings are calculated server-authoritatively based on total conservation points, active streaks, and water saved.
        </p>
      </div>

      {/* Sort Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setSortBy('points')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            sortBy === 'points'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <Droplets className="w-4 h-4 text-sky-400" /> Total Points
        </button>

        <button
          onClick={() => setSortBy('streak')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            sortBy === 'streak'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" /> Active Streak
        </button>

        <button
          onClick={() => setSortBy('water')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            sortBy === 'water'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <Waves className="w-4 h-4 text-teal-400" /> Water Saved (L)
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Calculating global rankings..." />
      ) : (
        <div className="space-y-8">
          
          {/* Top 3 Podium Showcase */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 items-end max-w-4xl mx-auto">
              
              {/* Rank 2 (Silver) */}
              {topThree[1] && (
                <div className="card-panel text-center space-y-3 order-2 sm:order-1 relative shadow-lg">
                  <div className="w-12 h-12 mx-auto bg-slate-400/20 border border-slate-400 text-slate-300 rounded-full flex items-center justify-center font-black text-lg shadow">
                    #2
                  </div>
                  <h3 className="font-bold text-white text-base truncate">{topThree[1].username}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{topThree[1].levelTitle}</p>
                  <div className="pt-2 border-t border-slate-800 font-extrabold text-sky-400 text-xs sm:text-sm">
                    {sortBy === 'points' && `${topThree[1].totalPoints} PTS`}
                    {sortBy === 'streak' && `${topThree[1].currentStreak} Days Streak`}
                    {sortBy === 'water' && `${topThree[1].waterSavedLiters} L Saved`}
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold Podium Center) */}
              {topThree[0] && (
                <div className="card-panel bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border-amber-400/60 p-6 sm:p-8 text-center space-y-3 order-1 sm:order-2 shadow-2xl relative">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full tracking-wider flex items-center gap-1 shadow">
                    <Trophy className="w-3.5 h-3.5" /> Champion
                  </div>
                  <div className="w-16 h-16 mx-auto bg-amber-400 text-slate-950 rounded-full flex items-center justify-center font-black text-2xl shadow-lg">
                    #1
                  </div>
                  <h3 className="font-extrabold text-white text-lg sm:text-xl truncate">{topThree[0].username}</h3>
                  <p className="text-xs text-amber-300 font-semibold">{topThree[0].levelTitle}</p>
                  <div className="pt-2 border-t border-amber-500/30 font-black text-amber-400 text-sm sm:text-base">
                    {sortBy === 'points' && `${topThree[0].totalPoints} PTS`}
                    {sortBy === 'streak' && `${topThree[0].currentStreak} Days Streak`}
                    {sortBy === 'water' && `${topThree[0].waterSavedLiters} L Saved`}
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] && (
                <div className="card-panel text-center space-y-3 order-3 relative shadow-lg">
                  <div className="w-12 h-12 mx-auto bg-amber-700/20 border border-amber-700 text-amber-500 rounded-full flex items-center justify-center font-black text-lg shadow">
                    #3
                  </div>
                  <h3 className="font-bold text-white text-base truncate">{topThree[2].username}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{topThree[2].levelTitle}</p>
                  <div className="pt-2 border-t border-slate-800 font-extrabold text-sky-400 text-xs sm:text-sm">
                    {sortBy === 'points' && `${topThree[2].totalPoints} PTS`}
                    {sortBy === 'streak' && `${topThree[2].currentStreak} Days Streak`}
                    {sortBy === 'water' && `${topThree[2].waterSavedLiters} L Saved`}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Full Table */}
          <div className="card-panel overflow-hidden p-0! shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950 text-[11px] uppercase text-slate-400 font-extrabold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Rank</th>
                    <th className="py-3.5 px-4 sm:px-6">Conservation Champion</th>
                    <th className="py-3.5 px-4 sm:px-6">Level & Title</th>
                    <th className="py-3.5 px-4 sm:px-6">Total Points</th>
                    <th className="py-3.5 px-4 sm:px-6">Streak</th>
                    <th className="py-3.5 px-4 sm:px-6">Water Saved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {leaderboard.map((item) => {
                    const isSelf = user && (user.id === item.id || user._id === item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`transition ${
                          isSelf ? 'bg-teal-500/15 font-bold text-white' : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-400">
                          #{item.rank}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-xs font-extrabold text-white shadow">
                            {item.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate">{item.username}</span>
                          {isSelf && <span className="text-[10px] bg-teal-400 text-slate-950 px-2 py-0.5 rounded font-black shrink-0">(You)</span>}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-xs text-teal-400 font-semibold">
                          Lvl {item.level} • {item.levelTitle}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-extrabold text-sky-400">
                          {item.totalPoints} PTS
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-amber-400 font-bold">
                          🔥 {item.currentStreak}d
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-teal-300 font-bold">
                          💧 {item.waterSavedLiters} L
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default LeaderboardPage;

