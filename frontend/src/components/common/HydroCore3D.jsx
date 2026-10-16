import React, { useState } from 'react';

const HydroCore3D = () => {
  const [activeTab, setActiveTab] = useState(0);

  const stats = [
    { label: 'Liters Conserved', value: '1.42M+', sub: 'Community Total', color: 'from-teal-400 to-emerald-400' },
    { label: 'Aqua Warriors', value: '48.5K', sub: 'Active Guardians', color: 'from-sky-400 to-cyan-400' },
    { label: 'Impact Score', value: '98.4%', sub: 'Aquifer Health', color: 'from-indigo-400 to-sky-400' },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center perspective-1000 group">
      {/* Ambient Neon Backlight Halo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500/30 via-sky-500/20 to-emerald-500/30 blur-3xl group-hover:scale-110 transition-transform duration-700 animate-pulse-glow-3d pointer-events-none" />

      {/* 3D Orbit Ring 1 */}
      <div
        className="absolute w-72 h-72 rounded-full border border-teal-500/30 border-dashed animate-ring-3d pointer-events-none"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(65deg) rotateY(15deg)' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-teal-400 shadow-[0_0_15px_#2dd4bf]" />
      </div>

      {/* 3D Orbit Ring 2 (Counter Rotation) */}
      <div
        className="absolute w-84 h-84 rounded-full border border-sky-400/20 pointer-events-none"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(75deg) rotateY(-25deg)',
          animation: 'rotateRing3d 18s linear infinite reverse',
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
      </div>

      {/* Central 3D Liquid Orb Core */}
      <div
        className="relative w-56 h-56 rounded-full bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-900/90 border border-teal-400/40 p-4 shadow-2xl shadow-teal-500/20 backdrop-blur-xl flex flex-col items-center justify-center text-center cursor-pointer transform-style-3d group-hover:scale-105 group-hover:rotate-1 transition-all duration-500"
        onClick={() => setActiveTab((prev) => (prev + 1) % stats.length)}
      >
        {/* Specular Glare Arc */}
        <div className="absolute top-3 left-6 right-6 h-12 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

        {/* Liquid Surface Ripple inside Orb */}
        <div className="absolute inset-2 rounded-full overflow-hidden opacity-30 pointer-events-none">
          <div className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2 rounded-[40%] bg-gradient-to-r from-teal-500 via-sky-500 to-emerald-500 animate-wave-liquid opacity-40" />
        </div>

        {/* Center Content */}
        <div className="relative z-10 translate-z-30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            Live Hydro Core
          </div>

          <div className={`text-4xl font-black tracking-tight bg-gradient-to-r ${stats[activeTab].color} bg-clip-text text-transparent drop-shadow-sm`}>
            {stats[activeTab].value}
          </div>

          <div className="text-sm font-bold text-slate-200 mt-1">
            {stats[activeTab].label}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {stats[activeTab].sub}
          </div>
        </div>

        {/* Orbiting Satellite Data Chips */}
        <div className="absolute -bottom-3 flex gap-1.5 z-20">
          {stats.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeTab === idx ? 'w-6 bg-teal-400 shadow-[0_0_8px_#2dd4bf]' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HydroCore3D;
