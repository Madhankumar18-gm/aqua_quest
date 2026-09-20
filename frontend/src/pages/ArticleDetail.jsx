import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowLeft, Clock, User, Tag, Calendar, Share2, CheckCircle2 } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticleDetail();
  }, [id]);

  const fetchArticleDetail = async () => {
    try {
      const res = await axiosInstance.get(`/articles/${id}`);
      if (res.data.success) {
        setArticle(res.data.article);
      }
    } catch (err) {
      console.error('Failed to load article detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading article..." />;
  if (!article) return <div className="text-center py-12 text-slate-400 text-sm font-semibold">Article not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <Link to="/articles" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-400 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Groundwater Hub
      </Link>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-lg inline-block">
          {article.category}
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 pt-2 border-b border-slate-800 pb-4">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-teal-400" /> {article.author}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-sky-400" /> {article.readingTimeMinutes} min read</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-purple-400" /> {new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-64 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Article Content */}
      <div className="card-panel space-y-6 text-slate-200 leading-relaxed text-sm sm:text-base">
        <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-300 text-xs sm:text-sm font-semibold">
          <strong className="block text-teal-400 font-extrabold mb-1">Key Takeaway:</strong>
          {article.summary}
        </div>

        <div className="prose prose-invert max-w-none space-y-4 whitespace-pre-line text-slate-300 leading-relaxed">
          {article.content}
        </div>
      </div>

      {/* Footer Callout */}
      <div className="card-panel bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border-teal-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">Put Knowledge Into Action</h3>
          <p className="text-xs text-slate-400 mt-0.5">Complete a water conservation challenge to earn server points!</p>
        </div>
        <Link
          to="/challenges"
          className="btn-primary shrink-0 px-6 py-2.5 text-xs font-bold"
        >
          View Active Missions
        </Link>
      </div>

    </div>
  );
};

export default ArticleDetail;

