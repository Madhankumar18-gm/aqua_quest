import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, ShieldCheck, Award, Flame, Zap, BookOpen, Target, ArrowRight, Sparkles, Compass, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card3D from '../components/common/Card3D';
import HydroCore3D from '../components/common/HydroCore3D';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 3D Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Top Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-lg shadow-teal-500/10 animate-float-3d">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Gamifying Global Water Conservation & Groundwater Literacy</span>
              </div>

              {/* 3D Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-tight transform-style-3d">
                Save Water. Earn Badges. <br />
                <span className="gradient-text font-black">
                  Protect Earth's Aquifers.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                AquaQuest turns daily water saving into an interactive quest. Complete household missions, test your groundwater knowledge, maintain daily streaks, and climb the global leaderboard.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="btn-primary-3d w-full sm:w-auto px-8 py-3.5 text-base rounded-2xl"
                  >
                    Go to Dashboard <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary-3d w-full sm:w-auto px-8 py-3.5 text-base rounded-2xl"
                    >
                      Start Your Quest <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/articles"
                      className="btn-secondary-3d w-full sm:w-auto px-8 py-3.5 text-base rounded-2xl"
                    >
                      Explore Groundwater Hub <Compass className="w-5 h-5 text-teal-400" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: 3D Hydro Core Widget */}
            <div className="lg:col-span-5 flex justify-center">
              <HydroCore3D />
            </div>

          </div>

          {/* Key Stats Grid with 3D Tilt Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-14">
            <Card3D maxTilt={15} scale={1.05}>
              <div className="card-panel-3d text-center h-full">
                <p className="text-3xl sm:text-4xl font-black text-teal-400 translate-z-20">2B+</p>
                <p className="text-xs text-slate-300 font-semibold mt-1 translate-z-10">Rely on Groundwater</p>
              </div>
            </Card3D>
            <Card3D maxTilt={15} scale={1.05}>
              <div className="card-panel-3d text-center h-full">
                <p className="text-3xl sm:text-4xl font-black text-sky-400 translate-z-20">500L+</p>
                <p className="text-xs text-slate-300 font-semibold mt-1 translate-z-10">Water Saved / User</p>
              </div>
            </Card3D>
            <Card3D maxTilt={15} scale={1.05}>
              <div className="card-panel-3d text-center h-full">
                <p className="text-3xl sm:text-4xl font-black text-amber-400 translate-z-20">100%</p>
                <p className="text-xs text-slate-300 font-semibold mt-1 translate-z-10">Server-Verified Points</p>
              </div>
            </Card3D>
            <Card3D maxTilt={15} scale={1.05}>
              <div className="card-panel-3d text-center h-full">
                <p className="text-3xl sm:text-4xl font-black text-emerald-400 translate-z-20">7+</p>
                <p className="text-xs text-slate-300 font-semibold mt-1 translate-z-10">Unlockable Badges</p>
              </div>
            </Card3D>
          </div>

        </div>
      </section>

      {/* Feature Highlights with 3D Tilt Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black text-white">Gamified Conservation Pillars</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
            Learn, act, and track your progress through server-authoritative gamification modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <Card3D maxTilt={12}>
            <div className="card-panel-3d space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl w-fit border border-teal-500/20 shadow-lg translate-z-30">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white translate-z-20">Groundwater Articles</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed translate-z-10">
                  Explore expert insights into subterranean aquifers, rainwater harvesting mechanics, and local recharge pits.
                </p>
              </div>
              <Link to="/articles" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 pt-2 translate-z-20">
                Read Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card3D>

          <Card3D maxTilt={12}>
            <div className="card-panel-3d space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl w-fit border border-sky-500/20 shadow-lg translate-z-30">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white translate-z-20">Missions & Challenges</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed translate-z-10">
                  Fix household leaks, collect RO reject water, and complete 5-minute shower challenges to earn points and save liters.
                </p>
              </div>
              <Link to="/challenges" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 pt-2 translate-z-20">
                View Missions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card3D>

          <Card3D maxTilt={12}>
            <div className="card-panel-3d space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl w-fit border border-amber-500/20 shadow-lg translate-z-30">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white translate-z-20">Badges, Levels & Ranks</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed translate-z-10">
                  Build your daily streak, unlock achievements like "Aquifer Defender", and climb the global conservation leaderboard.
                </p>
              </div>
              <Link to="/leaderboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 pt-2 translate-z-20">
                Check Leaderboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card3D>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Card3D maxTilt={6}>
          <div className="card-panel-3d p-8 sm:p-12 text-center bg-gradient-to-r from-teal-950/60 via-slate-900/90 to-sky-950/60 border border-teal-500/30 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex p-3 bg-teal-500/20 rounded-2xl text-teal-400 border border-teal-500/30 shadow-lg translate-z-30">
                <Droplets className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white translate-z-20">
                Ready to Become a Water Guardian?
              </h2>
              <p className="text-slate-300 text-xs sm:text-base leading-relaxed translate-z-10">
                Join thousands of users preserving groundwater through real-world actions. Start your journey today!
              </p>
              <div className="pt-2 translate-z-30">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/register'}
                  className="btn-primary-3d inline-flex px-8 py-3.5 text-base rounded-2xl"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Join AquaQuest Now'} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </Card3D>
      </section>
    </div>
  );
};

export default Home;
