import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, ShieldCheck, Award, Flame, Zap, BookOpen, Target, ArrowRight, CheckCircle2, Sparkles, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/30 via-slate-900 to-slate-900 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-300 text-xs sm:text-sm font-semibold tracking-wide">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Gamifying Global Water Conservation & Groundwater Literacy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Save Water. Earn Badges. <br />
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Protect Earth's Aquifers.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            AquaQuest turns daily water saving into an interactive quest. Complete household missions, test your groundwater knowledge, maintain daily streaks, and climb the global leaderboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base rounded-2xl"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base rounded-2xl"
                >
                  Start Your Quest <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/articles"
                  className="btn-secondary w-full sm:w-auto px-8 py-3.5 text-base rounded-2xl"
                >
                  Explore Groundwater Hub <Compass className="w-5 h-5 text-teal-400" />
                </Link>
              </>
            )}
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
            <div className="card-panel text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-400">2B+</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Rely on Groundwater</p>
            </div>
            <div className="card-panel text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-sky-400">500L+</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Water Saved / User</p>
            </div>
            <div className="card-panel text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Server-Verified Points</p>
            </div>
            <div className="card-panel text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">7+</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Unlockable Badges</p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Gamified Conservation Pillars</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
            Learn, act, and track your progress through server-authoritative gamification modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="card-panel-hover space-y-4">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit border border-teal-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Groundwater Articles</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Explore expert insights into subterranean aquifers, rainwater harvesting mechanics, and local recharge pits.
            </p>
            <Link to="/articles" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300">
              Read Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="card-panel-hover space-y-4">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit border border-sky-500/20">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Missions & Challenges</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Fix household leaks, collect RO reject water, and complete 5-minute shower challenges to earn points and save liters.
            </p>
            <Link to="/challenges" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300">
              View Missions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="card-panel-hover space-y-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Badges, Levels & Ranks</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Build your daily streak, unlock achievements like "Aquifer Defender", and climb the global conservation leaderboard.
            </p>
            <Link to="/leaderboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300">
              Check Leaderboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Awareness Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-panel bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border-teal-500/30 p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Environmental Mission</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Why Groundwater Literacy Matters
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Groundwater makes up over 99% of liquid freshwater on Earth. Unregulated over-extraction leads to dry wells, land subsidence, and water scarcity. AquaQuest educates users on natural aquifer replenishment.
              </p>
            </div>
            <Link to="/quizzes" className="btn-primary shrink-0 px-6 py-3 text-sm">
              Test Your Knowledge <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

