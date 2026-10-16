import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card3D from '../components/common/Card3D';
import { BookOpen, Search, Clock, ArrowRight } from 'lucide-react';

const categories = [
  'All',
  'Groundwater Depletion',
  'Rainwater Harvesting',
  'Aquifer Recharge',
  'Water Conservation Tips',
  'Policy & Science',
];

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = '/articles';
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await axiosInstance.get(url);
      if (res.data.success) {
        setArticles(res.data.articles);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-300 text-xs font-bold tracking-wide">
          <BookOpen className="w-4 h-4 text-teal-400" /> Groundwater Knowledge Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Groundwater & Hydrogeology Articles</h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
          Learn about aquifer recharge mechanics, rainwater harvesting techniques, and practical water saving tips.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow-lg shadow-teal-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

        </div>
      </div>

      {/* Article Grid with 3D Cards */}
      {loading ? (
        <LoadingSpinner message="Fetching groundwater articles..." />
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Card3D key={art._id} maxTilt={12} scale={1.02}>
              <Link
                to={`/articles/${art._id}`}
                className="card-panel-3d overflow-hidden flex flex-col p-0! group shadow-xl h-full"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/90 backdrop-blur-md border border-slate-700 text-teal-300 text-[11px] font-black rounded-lg shadow translate-z-20">
                    {art.category}
                  </span>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{art.readingTimeMinutes} min read</span>
                      <span>•</span>
                      <span>By {art.author}</span>
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-teal-300 transition line-clamp-2 translate-z-20">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed translate-z-10">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-black text-teal-400 translate-z-20">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </Card3D>
          ))}
        </div>
      ) : (
        <div className="card-panel-3d p-12 text-center text-slate-400 text-xs sm:text-sm font-semibold">
          No articles found matching your criteria. Try adjusting your search query or category filter.
        </div>
      )}

    </div>
  );
};

export default Articles;
