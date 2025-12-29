
import React, { useState, useEffect, useRef } from 'react';
import { Move3d, Compass, Globe, Radio } from 'lucide-react';

interface SovereignPanoramaProps {
  imageUrl?: string;
  isEditing?: boolean;
  compact?: boolean;
}

const SovereignPanorama: React.FC<SovereignPanoramaProps> = ({ imageUrl, isEditing, compact }) => {
  const [offset, setOffset] = useState({ x: 50, y: 50 });
  const [hasGyro, setHasGyro] = useState(false);
  const [showSphere, setShowSphere] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        setHasGyro(true);
        const sensitivity = compact ? 2.5 : 1.8;
        const xPercent = 50 + (e.gamma / sensitivity); 
        const yPercent = 50 + (e.beta / (sensitivity * 1.5));
        setOffset({ 
          x: Math.max(0, Math.min(100, xPercent)), 
          y: Math.max(0, Math.min(100, yPercent)) 
        });
        if (Math.abs(e.gamma) > 5) setShowSphere(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasGyro && containerRef.current) {
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setOffset({ x, y });
        setShowSphere(false);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hasGyro, compact]);

  if (!imageUrl) {
    return (
      <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
        <Globe size={40} className="text-indigo-500 animate-spin-slow opacity-20" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black"
    >
      {/* الصورة الأساسية مع تأثير البانوراما */}
      <div 
        className="absolute inset-[-40%] transition-transform duration-700 ease-out transform-gpu"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: `${offset.x}% ${offset.y}%`,
          transform: `scale(1.2) rotateX(${(offset.y - 50) / 12}deg) rotateY(${(offset.x - 50) / 12}deg)`,
          willChange: 'transform, background-position'
        }}
      />
      
      {/* طبقة التظليل السيادي */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"></div>
      
      {/* أيقونة الكرة الدوارة في المنتصف (Facebook Style 360) */}
      {showSphere && !isEditing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="relative group">
            {/* الحلقات الدوارة */}
            <div className="absolute inset-[-20px] border-2 border-indigo-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
            <div className="absolute inset-[-10px] border border-pink-500/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
            
            {/* الكرة المركزية */}
            <div className="w-16 h-16 bg-black/40 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <div className="relative">
                <Globe size={28} className="text-white animate-pulse" />
                <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 animate-ping"></div>
              </div>
            </div>
            
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[7px] font-black text-white uppercase tracking-[0.3em] bg-black/60 px-3 py-1 rounded-full border border-white/10 shadow-lg">
                حرك الهاتف للاستكشاف 360°
              </span>
            </div>
          </div>
        </div>
      )}

      {/* مؤشر 360 الصغير في الزاوية */}
      {!isEditing && (
        <div className={`absolute flex items-center space-x-1.5 space-x-reverse bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 animate-fade-in z-20 ${compact ? 'bottom-3 right-3' : 'top-16 left-6'}`}>
          <Radio size={compact ? 10 : 12} className="text-indigo-400 animate-pulse" />
          <span className={`${compact ? 'text-[6px]' : 'text-[8px]'} font-black text-white uppercase tracking-widest`}>Sovereign View 360</span>
        </div>
      )}
    </div>
  );
};

export default SovereignPanorama;
