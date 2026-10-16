import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card3D from '../components/common/Card3D';
import { Trophy, Flame, Droplets, Waves } from 'lucide-react';

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
        <h1 className="text-3xl sm:text-4xl font-black text-white">Water Conservation Leaderboard</h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
          Rankings are calculated server-authoritatively based on total conservation points, active streaks, and water saved.
        </p>
      </div>

      {/* Sort Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setSortBy('points')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-1.5 ${
            sortBy === 'points'
              ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <Droplets className="w-4 h-4 text-sky-400" /> Total Points
        </button>

        <button
          onClick={() => setSortBy('streak')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-1.5 ${
            sortBy === 'streak'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" /> Active Streak
        </button>

        <button
          onClick={() => setSortBy('water')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-1.5 ${
            sortBy === 'water'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20'
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
          
          {/* Top 3 3D Extruded Podium Showcase */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 items-end max-w-4xl mx-auto perspective-1000">
              
              {/* Rank 2 (Silver Podium) */}
              {topThree[1] && (
                <Card3D maxTilt={15} scale={1.03}>
                  <div className="card-panel-3d text-center space-y-3 order-2 sm:order-1 relative shadow-2xl border-slate-700/80">
                    <div className="w-14 h-14 mx-auto bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-950 rounded-full flex items-center justify-center font-black text-xl shadow-lg translate-z-30">
                      #2
                    </div>
                    <h3 className="font-extrabold text-white text-base truncate translate-z-20">{topThree[1].username}</h3>
                    <p className="text-xs text-slate-400 font-bold translate-z-10">{topThree[1].levelTitle}</p>
                    <div className="pt-2 border-t border-slate-800 font-black text-sky-400 text-xs sm:text-sm translate-z-20">
                      {sortBy === 'points' && `${topThree[1].totalPoints} PTS`}
                      {sortBy === 'streak' && `${topThree[1].currentStreak} Days Streak`}
                      {sortBy === 'water' && `${topThree[1].waterSavedLiters} L Saved`}
                    </div>
                  </div>
                </Card3D>
              )}

              {/* Rank 1 (Gold 3D Podium Center) */}
              {topThree[0] && (
                <Card3D maxTilt={15} scale={1.06}>
                  <div className="card-panel-3d bg-gradient-to-b from-amber-500/25 via-slate-900 to-slate-900 border-amber-400/80 p-6 sm:p-8 text-center space-y-3 order-1 sm:order-2 shadow-2xl relative glow-amber">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full tracking-wider flex items-center gap-1 shadow-lg translate-z-40">
                      <Trophy className="w-3.5 h-3.5" /> Champion
                    </div>
                    <div className="w-18 h-18 mx-auto bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-slate-950 rounded-full flex items-center justify-center font-black text-3xl shadow-xl shadow-amber-500/30 translate-z-40">
                      #1
                    </div>
                    <h3 className="font-black text-white text-lg sm:text-xl truncate translate-z-30">{topThree[0].username}</h3>
                    <p className="text-xs text-amber-300 font-bold translate-z-20">{topThree[0].levelTitle}</p>
                    <div className="pt-2 border-t border-amber-500/40 font-black text-amber-400 text-sm sm:text-base translate-z-30">
                      {sortBy === 'points' && `${topThree[0].totalPoints} PTS`}
                      {sortBy === 'streak' && `${topThree[0].currentStreak} Days Streak`}
                      {sortBy === 'water' && `${topThree[0].waterSavedLiters} L Saved`}
                    </div>
                  </div>
                </Card3D>
              )}

              {/* Rank 3 (Bronze Podium) */}
              {topThree[2] && (
                <Card3D maxTilt={15} scale={1.03}>
                  <div className="card-panel-3d text-center space-y-3 order-3 relative shadow-2xl border-amber-800/80">
                    <div className="w-14 h-14 mx-auto bg-gradient-to-tr from-amber-700 to-amber-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xl shadow-lg translate-z-30">
                      #3
                    </div>
                    <h3 className="font-extrabold text-white text-base truncate translate-z-20">{topThree[2].username}</h3>
                    <p className="text-xs text-slate-400 font-bold translate-z-10">{topThree[2].levelTitle}</p>
                    <div className="pt-2 border-t border-slate-800 font-black text-sky-400 text-xs sm:text-sm translate-z-20">
                      {sortBy === 'points' && `${topThree[2].totalPoints} PTS`}
                      {sortBy === 'streak' && `${topThree[2].currentStreak} Days Streak`}
                      {sortBy === 'water' && `${topThree[2].waterSavedLiters} L Saved`}
                    </div>
                  </div>
                </Card3D>
              )}

            </div>
          )}

          {/* Full Table */}
          <div className="card-panel-3d overflow-hidden p-0! shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950/90 text-[11px] uppercase text-slate-400 font-black border-b border-slate-800">
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
                        className={`transition duration-200 ${
                          isSelf ? 'bg-teal-500/20 font-bold text-white' : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-black text-slate-400">
                          #{item.rank}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-black text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-xs font-black text-white shadow">
                            {item.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate">{item.username}</span>
                          {isSelf && <span className="text-[10px] bg-teal-400 text-slate-950 px-2 py-0.5 rounded font-black shrink-0 shadow-sm">(You)</span>}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-xs text-teal-400 font-bold">
                          Lvl {item.level} • {item.levelTitle}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-black text-sky-400">
                          {item.totalPoints} PTS
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-amber-400 font-black">
                          🔥 {item.currentStreak}d
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-teal-300 font-black">
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
