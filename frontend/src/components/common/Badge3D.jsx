import React, { useState } from 'react';
import { Award, Shield, Flame, Zap, Waves, Droplet, CheckCircle, BookOpen, Users, HelpCircle, ShieldCheck } from 'lucide-react';

const iconMap = {
  award: Award,
  shield: Shield,
  flame: Flame,
  zap: Zap,
  waves: Waves,
  droplet: Droplet,
  'check-circle': CheckCircle,
  'book-open': BookOpen,
  users: Users,
  'help-circle': HelpCircle,
  'shield-check': ShieldCheck,
};

const categoryGlowMap = {
  points: 'from-amber-500/30 to-yellow-500/10 border-amber-500/50 text-amber-400',
  streak: 'from-orange-500/30 to-red-500/10 border-orange-500/50 text-orange-400',
  quizzes: 'from-indigo-500/30 to-purple-500/10 border-indigo-500/50 text-indigo-400',
  challenges: 'from-emerald-500/30 to-teal-500/10 border-emerald-500/50 text-emerald-400',
  water_saved: 'from-cyan-500/30 to-blue-500/10 border-cyan-500/50 text-cyan-400',
  special: 'from-teal-500/30 to-emerald-500/10 border-teal-500/50 text-teal-300',
};

const Badge3D = ({ badge, isUnlocked = true, size = 'md' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const IconComponent = iconMap[badge.iconName] || Award;
  const categoryTheme = categoryGlowMap[badge.category] || categoryGlowMap.points;

  const sizeClasses = {
    sm: 'w-20 h-20 text-xs',
    md: 'w-28 h-28 text-sm',
    lg: 'w-36 h-36 text-base',
  }[size] || 'w-28 h-28 text-sm';

  const iconSize = { sm: 24, md: 32, lg: 44 }[size] || 32;

  return (
    <div
      className="perspective-1000 group cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative ${sizeClasses} rounded-full transform-style-3d transition-all duration-700 shadow-2xl ${
          isFlipped ? 'rotate-y-180' : 'group-hover:rotate-y-12 group-hover:scale-105'
        }`}
      >
        {/* Front 3D Coin Face */}
        <div
          className={`absolute inset-0 rounded-full border-2 transform-style-3d flex flex-col items-center justify-center p-2 text-center backface-hidden ${
            isUnlocked
              ? `bg-gradient-to-br ${categoryTheme} shadow-lg shadow-teal-500/20`
              : 'bg-slate-900/90 border-slate-800 text-slate-500 opacity-60'
          }`}
        >
          {/* 3D Depth Layer Pop-Out Icon */}
          <div className="transform-style-3d translate-z-30 transition-transform group-hover:translate-z-40">
            <div
              className={`p-3 rounded-full bg-slate-950/60 border border-white/10 shadow-inner ${
                isUnlocked ? '' : 'grayscale'
              }`}
            >
              <IconComponent size={iconSize} className="filter drop-shadow-md" />
            </div>
          </div>

          {/* 3D Reflection Surface Metallic Glare */}
          <div className="absolute inset-0 rounded-full reflection-metallic pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" />

          {/* Glowing Aura Ring */}
          {isUnlocked && (
            <div className="absolute -inset-1 rounded-full border border-teal-400/30 animate-pulse-glow-3d pointer-events-none" />
          )}
        </div>

        {/* Back 3D Description Face */}
        <div className="absolute inset-0 rounded-full border-2 border-teal-500/50 bg-slate-900/95 p-3 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 text-xs text-slate-200 shadow-2xl">
          <p className="font-bold text-teal-300 text-[11px] mb-1 line-clamp-1">{badge.name}</p>
          <p className="text-[10px] text-slate-300 leading-tight line-clamp-3">{badge.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Badge3D;
