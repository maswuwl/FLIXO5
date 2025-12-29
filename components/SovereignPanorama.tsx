
import React, { useState, useEffect, useRef } from 'react';
import { Move3d, Compass } from 'lucide-react';

interface SovereignPanoramaProps {
  imageUrl?: string;
  isEditing?: boolean;
  compact?: boolean;
}

const SovereignPanorama: React.FC<SovereignPanoramaProps> = ({ imageUrl, isEditing, compact }) => {
  const [offset, setOffset] = useState({ x: 50, y: 50 });
  const [hasGyro, setHasGyro] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // معالجة حركة الجيروسكوب للهواتف
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        setHasGyro(true);
        // التعديل ليكون التحريك أكثر سلاسة وأقل حدة في الموجز
        const sensitivity = compact ? 2 : 1.5;
        const xPercent = 50 + (e.gamma / sensitivity); 
        const yPercent = 50 + (e.beta / (sensitivity * 1.5));
        setOffset({ 
          x: Math.max(0, Math.min(100, xPercent)), 
          y: Math.max(0, Math.min(100, yPercent)) 
        });
      }
    };

    // معالجة حركة الماوس للحواسيب
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasGyro && containerRef.current) {
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setOffset({ x, y });
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
      <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-black to-purple-900 animate-gradient-slow bg-[length:400%_400%]">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Compass size={compact ? 40 : 120} className="text-white animate-spin-slow" />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
    >
      <div 
        className="absolute inset-[-30%] transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: `${offset.x}% ${offset.y}%`,
          transform: `scale(1.15) rotateX(${(offset.y - 50) / 15}deg) rotateY(${(offset.x - 50) / 15}deg)`,
          willChange: 'transform, background-position'
        }}
      />
      
      {/* Overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none"></div>
      
      {/* 360 Indicator - متموضع حسب نوع العرض */}
      {!isEditing && (
        <div className={`absolute flex items-center space-x-1.5 space-x-reverse bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 animate-fade-in z-20 ${compact ? 'bottom-3 right-3' : 'top-16 left-6'}`}>
          <Move3d size={compact ? 10 : 12} className="text-indigo-400 animate-pulse" />
          <span className={`${compact ? 'text-[6px]' : 'text-[8px]'} font-black text-white uppercase tracking-widest`}>أفق 360°</span>
        </div>
      )}
    </div>
  );
};

export default SovereignPanorama;
