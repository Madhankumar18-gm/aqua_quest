import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Target,
  HelpCircle,
  BarChart3,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'articles', 'challenges', 'quizzes', 'users'
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [articlesList, setArticlesList] = useState([]);
  const [challengesList, setChallengesList] = useState([]);
  const [quizzesList, setQuizzesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Form states for creating content
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', summary: '', content: '', category: 'Groundwater Depletion', readingTimeMinutes: 4, author: 'AquaQuest Admin' });

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const res = await axiosInstance.get('/admin/stats');
        if (res.data.success) setStats(res.data.stats);
      } else if (activeTab === 'users') {
        const res = await axiosInstance.get('/admin/users');
        if (res.data.success) setUsersList(res.data.users);
      } else if (activeTab === 'articles') {
        const res = await axiosInstance.get('/articles');
        if (res.data.success) setArticlesList(res.data.articles);
      } else if (activeTab === 'challenges') {
        const res = await axiosInstance.get('/challenges');
        if (res.data.success) setChallengesList(res.data.challenges);
      } else if (activeTab === 'quizzes') {
        const res = await axiosInstance.get('/quizzes');
        if (res.data.success) setQuizzesList(res.data.quizzes);
      }
    } catch (err) {
      console.error('Admin API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/articles', newArticle);
      if (res.data.success) {
        setFeedback({ type: 'success', text: 'Article created successfully!' });
        setShowArticleModal(false);
        fetchAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to create article.' });
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await axiosInstance.delete(`/articles/${id}`);
      if (res.data.success) {
        setFeedback({ type: 'success', text: 'Article deleted.' });
        fetchAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to delete article.' });
    }
  };

  const handleUpdateRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change user role to ${newRole}?`)) return;
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setFeedback({ type: 'success', text: res.data.message });
        fetchAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to update user role.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="card-panel bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border-purple-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-full text-xs font-bold mb-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" /> Admin Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AquaQuest Administration Panel</h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">Manage platform content, user roles, and system telemetry.</p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs underline font-bold">Dismiss</button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'stats' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> System Overview
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <Users className="w-4 h-4" /> User Accounts
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'articles' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Articles
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'challenges' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <Target className="w-4 h-4" /> Missions
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'quizzes' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Quizzes
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching administration telemetry..." />
      ) : (
        <div>
          {/* Tab 1: System Telemetry Stats */}
          {activeTab === 'stats' && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card-panel space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Registered Users</span>
                <p className="text-3xl sm:text-4xl font-black text-white">{stats.totalUsers}</p>
              </div>
              <div className="card-panel space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Groundwater Articles</span>
                <p className="text-3xl sm:text-4xl font-black text-teal-400">{stats.totalArticles}</p>
              </div>
              <div className="card-panel space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Active Challenges</span>
                <p className="text-3xl sm:text-4xl font-black text-sky-400">{stats.totalChallenges}</p>
              </div>
              <div className="card-panel space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Quizzes Created</span>
                <p className="text-3xl sm:text-4xl font-black text-amber-400">{stats.totalQuizzes}</p>
              </div>
              <div className="card-panel space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Activity Ledger Completions</span>
                <p className="text-3xl sm:text-4xl font-black text-purple-400">{stats.totalCompletions}</p>
              </div>
              <div className="card-panel space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Water Saved</span>
                <p className="text-3xl sm:text-4xl font-black text-emerald-400">{stats.totalWaterSavedLiters} L</p>
              </div>
            </div>
          )}

          {/* Tab 2: User Accounts */}
          {activeTab === 'users' && (
            <div className="card-panel overflow-hidden p-0! shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-slate-950 text-[11px] uppercase text-slate-400 font-extrabold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Username</th>
                      <th className="py-3.5 px-4 sm:px-6">Email</th>
                      <th className="py-3.5 px-4 sm:px-6">Role</th>
                      <th className="py-3.5 px-4 sm:px-6">Points</th>
                      <th className="py-3.5 px-4 sm:px-6">Level</th>
                      <th className="py-3.5 px-4 sm:px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-800/50 transition">
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-white">{u.username}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-400 font-mono">{u.email}</td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-sky-400 font-extrabold">{u.totalPoints}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-teal-300 text-xs font-semibold">Lvl {u.level}</td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <button
                            onClick={() => handleUpdateRole(u._id, u.role)}
                            className="btn-secondary px-3 py-1 text-xs font-bold"
                          >
                            Toggle Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Articles */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-bold text-white">Articles ({articlesList.length})</h3>
                <button
                  onClick={() => setShowArticleModal(true)}
                  className="btn-primary px-4 py-2 text-xs font-extrabold"
                >
                  <Plus className="w-4 h-4" /> Publish New Article
                </button>
              </div>

              <div className="card-panel overflow-hidden p-0! divide-y divide-slate-800">
                {articlesList.map((art) => (
                  <div key={art._id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{art.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{art.category} • By {art.author}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteArticle(art._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Challenges */}
          {activeTab === 'challenges' && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white">Missions & Challenges ({challengesList.length})</h3>
              <div className="card-panel overflow-hidden p-0! divide-y divide-slate-800">
                {challengesList.map((c) => (
                  <div key={c._id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{c.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{c.category} • +{c.pointsReward} PTS • +{c.waterSavedRewardLiters}L Saved</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Quizzes */}
          {activeTab === 'quizzes' && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white">Interactive Quizzes ({quizzesList.length})</h3>
              <div className="card-panel overflow-hidden p-0! divide-y divide-slate-800">
                {quizzesList.map((q) => (
                  <div key={q.id || q._id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{q.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{q.category} • {q.totalQuestions} Questions • +{q.pointsReward} PTS</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Modal for Creating Article */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-panel bg-slate-900 border-slate-700 p-6 sm:p-8 max-w-xl w-full space-y-4 shadow-2xl">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">Publish Groundwater Article</h3>
            <form onSubmit={handleCreateArticle} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Category</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-400"
                >
                  <option value="Groundwater Depletion">Groundwater Depletion</option>
                  <option value="Rainwater Harvesting">Rainwater Harvesting</option>
                  <option value="Aquifer Recharge">Aquifer Recharge</option>
                  <option value="Water Conservation Tips">Water Conservation Tips</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Summary</label>
                <textarea
                  required
                  rows="2"
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Content Body</label>
                <textarea
                  required
                  rows="5"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="btn-secondary px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 text-xs font-extrabold"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

