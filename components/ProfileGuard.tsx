
import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface ProfileGuardProps {
  children: React.ReactNode;
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
  isSovereign?: boolean;
}

const ProfileGuard: React.FC<ProfileGuardProps> = ({ children, isActive, size = 'md', isSovereign = false }) => {
  if (!isActive) return <>{children}</>;

  const shieldSizes = {
    sm: 12,
    md: 16,
    lg: 24
  };

  const colors = isSovereign 
    ? { border: 'border-yellow-500', shadow: 'shadow-yellow-500/80', bg: 'bg-yellow-600', glow: 'rgba(245,158,11,0.6)' }
    : { border: 'border-blue-500', shadow: 'shadow-blue-500/50', bg: 'bg-blue-600', glow: 'rgba(59,130,246,0.5)' };

  return (
    <div className="relative inline-block group pointer-events-auto">
      {/* الإطار المتوهج اللامع */}
      <div className={`absolute inset-0 rounded-full border-[3px] ${colors.border} shadow-[0_0_20px_${colors.glow}] animate-pulse z-10 pointer-events-none`}>
        {isSovereign && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400/20 via-transparent to-white/30 animate-spin-slow opacity-50"></div>
        )}
      </div>
      
      {/* طبقة الحماية الشفافة التي تمنع السحب أو القوائم السياقية دون حجب النقر الأساسي */}
      <div 
        className="absolute inset-0 rounded-full z-20 bg-transparent select-none cursor-pointer" 
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitUserSelect: 'none' }}
      ></div>
      
      <div className="relative z-0">
        {children}
      </div>

      {/* أيقونة الدرع في الأسفل */}
      <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 z-30 ${colors.bg} border-2 border-black p-0.5 rounded-full shadow-lg transition-transform duration-500 scale-110 pointer-events-none`}>
        <ShieldCheck size={shieldSizes[size]} className="text-white" fill="currentColor" />
      </div>
    </div>
  );
};

export default ProfileGuard;
