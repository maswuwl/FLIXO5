
import React from 'react';
import { CelebrityColorTier } from '../types';
import { BadgeCheck, Users, Star, Megaphone, ShieldCheck, Share2, Sparkles } from 'lucide-react';

interface CelebrityBadgeProps {
  tier: CelebrityColorTier;
  size?: number;
}

const tierConfig = {
  0: { 
    icon: <BadgeCheck fill="white" className="text-amber-400" />, 
    shadow: 'drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]',
    animate: 'animate-logo-pulse'
  },
  1: { 
    gradient: 'from-indigo-600 to-blue-700', 
    icon: <Users size={14} />, 
    label: 'المنتصر'
  },
  2: { 
    gradient: 'from-fuchsia-500 to-pink-600', 
    icon: <Star size={14} fill="currentColor" />, 
    label: 'نجم'
  },
  3: { 
    gradient: 'from-green-500 to-emerald-700', 
    icon: <Megaphone size={14} />, 
    label: 'معلن'
  },
  4: { 
    gradient: 'from-cyan-500 to-blue-600', 
    icon: <ShieldCheck size={14} />, 
    label: 'مميز'
  },
  5: { 
    gradient: 'from-slate-500 to-slate-700', 
    icon: <Share2 size={14} />, 
    label: 'ناشر'
  }
};

const CelebrityBadge: React.FC<CelebrityBadgeProps> = ({ tier, size = 16 }) => {
  const config = tierConfig[tier];

  // للسيادة: إشارة ذهبية مشعة فقط
  if (tier === 0) {
    return (
      <div className={`relative inline-flex items-center justify-center ${config.shadow} ${config.animate}`}>
        <div className="absolute inset-0 bg-yellow-400 blur-md opacity-20 animate-pulse"></div>
        {React.cloneElement(config.icon as React.ReactElement, { size: size + 8 })}
        <Sparkles size={10} className="absolute -top-1 -right-1 text-white animate-bounce opacity-80" />
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 space-x-reverse bg-gradient-to-r ${config.gradient} px-2.5 py-1 rounded-lg shadow-lg border border-white/20 animate-fade-in`}>
      <div className="text-white">
        {React.cloneElement(config.icon as React.ReactElement, { size: size - 2 })}
      </div>
      <span className="text-[10px] font-black text-white uppercase tracking-tighter whitespace-nowrap">
        {config.label}
      </span>
    </div>
  );
};

export default CelebrityBadge;
