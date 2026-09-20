import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Droplets,
  Flame,
  Award,
  BookOpen,
  Target,
  HelpCircle,
  Trophy,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Articles', path: '/articles', icon: BookOpen },
    { name: 'Missions', path: '/challenges', icon: Target },
    { name: 'Quizzes', path: '/quizzes', icon: HelpCircle },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin Panel', path: '/admin', icon: ShieldAlert, highlight: true });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/90 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group focus-visible:outline-none">
            <div className="p-2 bg-gradient-to-tr from-teal-600 to-sky-500 rounded-xl shadow-md shadow-teal-500/20 group-hover:scale-105 group-hover:shadow-teal-500/30 transition-all">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                AquaQuest
              </span>
              <span className="text-[10px] font-semibold text-teal-400/80 -mt-1 tracking-wider uppercase hidden sm:inline-block">
                Groundwater Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                    active
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                      : link.highlight
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-teal-400' : 'text-slate-400'}`} />
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-teal-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Gamification Status Bar or Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Streak Counter */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-bold text-amber-400" title="Active Daily Streak">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>{user.currentStreak || 0}d</span>
                </div>

                {/* Level & Points Bar */}
                <div className="flex items-center gap-2.5 px-3 py-1 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs font-semibold shadow-inner">
                  <div className="flex items-center gap-1 text-teal-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>Lvl {user.level || 1}</span>
                  </div>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-1 text-sky-300 font-bold">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span>{user.totalPoints || 0} pts</span>
                  </div>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    aria-label="User Account Menu"
                    aria-expanded={profileDropdownOpen}
                    className="flex items-center gap-2 p-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-white text-xs shadow">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-700/60">
                        <p className="text-sm font-bold text-white truncate">{user.username}</p>
                        <p className="text-xs text-teal-400 font-semibold">{user.levelTitle || 'Water Saver'}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700/50 hover:text-white transition"
                      >
                        <Award className="w-4 h-4 text-teal-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700/50 hover:text-white transition"
                      >
                        <User className="w-4 h-4 text-sky-400" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Join AquaQuest
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-teal-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  active
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-teal-400' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-800/80 rounded-xl text-xs font-bold text-slate-300 mb-2">
                <span className="text-teal-400">Lvl {user.level || 1} • {user.totalPoints || 0} pts</span>
                <span className="text-amber-400 flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> {user.currentStreak || 0}d streak</span>
              </div>
              <Link
                to="/dashboard"
                className="block px-3.5 py-2 rounded-xl text-sm font-bold text-teal-300 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="block px-3.5 py-2 rounded-xl text-sm font-bold text-sky-300 hover:bg-slate-800"
              >
                Profile & Achievements
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center py-2.5 text-xs font-bold text-slate-300 bg-slate-800 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn-primary w-full text-center"
              >
                Join AquaQuest
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

