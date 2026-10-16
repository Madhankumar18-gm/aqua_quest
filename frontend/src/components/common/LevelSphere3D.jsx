import React from 'react';
import { Droplets, Sparkles, Award } from 'lucide-react';

const LevelSphere3D = ({ user }) => {
  const currentXP = user?.totalPoints || 0;
  const level = user?.level || 1;
  const levelTitle = user?.levelTitle || 'Water Saver Trainee';

  // XP progression calculation (every 200 XP = 1 Level)
  const xpInCurrentLevel = currentXP % 200;
  const fillPercentage = Math.min(100, Math.max(15, (xpInCurrentLevel / 200) * 100));

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-slate-900/80 rounded-3xl border border-slate-800/90 shadow-2xl backdrop-blur-md transform-style-3d group">
      {/* 3D Glass Liquid Orb Container */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-slate-700/60 shadow-2xl shadow-teal-500/20 flex items-center justify-center overflow-hidden transform-style-3d group-hover:border-teal-400/80 transition-all duration-500">
        
        {/* Animated 3D Liquid Fill Container */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-600 via-cyan-500 to-sky-400 transition-all duration-1000 ease-out"
          style={{ height: `${fillPercentage}%` }}
        >
          {/* Animated Undulating Liquid Wave Top Edge */}
          <div className="absolute -top-4 left-0 right-0 h-6 overflow-hidden">
            <svg
              className="w-[200%] h-full animate-wave-liquid fill-cyan-400/90"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,-20 1200,40 L1200,120 L0,120 Z" />
            </svg>
          </div>

          {/* Floating Liquid Bubbles */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute bottom-2 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-bounce duration-1000" />
            <div className="absolute bottom-6 left-2/3 w-3 h-3 bg-white/40 rounded-full animate-bounce duration-700" />
            <div className="absolute bottom-10 left-1/2 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping duration-1000" />
          </div>
        </div>

        {/* 3D Glass Specular Highlight Overlay */}
        <div className="absolute inset-0 rounded-full reflection-glass pointer-events-none z-20" />

        {/* Center 3D Content Badge */}
        <div className="relative z-30 flex flex-col items-center justify-center text-center transform-style-3d translate-z-30 group-hover:translate-z-40 transition-transform duration-300">
          <div className="p-2.5 rounded-full bg-slate-950/80 border border-teal-400/40 shadow-xl mb-1 flex items-center justify-center text-teal-400">
            <Droplets size={26} className="animate-pulse" />
          </div>
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-lg">
            LVL {level}
          </span>
          <span className="text-[11px] font-bold tracking-wider text-teal-300 uppercase bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-teal-500/30 mt-1 shadow-md">
            {xpInCurrentLevel} / 200 XP
          </span>
        </div>

        {/* Floating Outer 3D Holographic Orbit Ring */}
        <div className="absolute -inset-3 rounded-full border border-teal-500/30 animate-ring-3d pointer-events-none z-10" />
      </div>

      {/* Level Title & Progress Descriptor */}
      <div className="mt-4 text-center transform-style-3d translate-z-20">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-teal-500/20 to-sky-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold tracking-wide shadow-md">
          <Award size={14} />
          {levelTitle}
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          {200 - xpInCurrentLevel} XP required for Level {level + 1}
        </p>
      </div>
    </div>
  );
};

export default LevelSphere3D;
