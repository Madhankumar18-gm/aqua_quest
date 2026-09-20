import React from 'react';
import { Droplets, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-500/20 rounded-lg text-teal-400">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">AquaQuest</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Gamifying groundwater conservation & rainwater literacy. Empowering communities to track water savings, complete missions, and restore natural aquifers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/articles" className="hover:text-teal-400 transition">Groundwater Hub</a></li>
              <li><a href="/challenges" className="hover:text-teal-400 transition">Missions & Challenges</a></li>
              <li><a href="/quizzes" className="hover:text-teal-400 transition">Interactive Quizzes</a></li>
              <li><a href="/leaderboard" className="hover:text-teal-400 transition">Global Ranks</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Security & Trust</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-1.5 text-teal-400">
                <ShieldCheck className="w-4 h-4" /> Server-Authoritative Gamification
              </p>
              <p>JWT Secured & Role-Based Access Control</p>
              <p>© 2026 AquaQuest. All rights reserved.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          Built with <Heart className="w-3.5 h-3.5 text-red-500 inline mx-1" /> for global groundwater sustainability.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
