
import React from 'react';
import { authService } from '../services/authService';

interface WatermarkProps {
  type?: 'video' | 'image';
}

const Watermark: React.FC<WatermarkProps> = () => {
  const currentUser = authService.getCurrentUser();
  if (currentUser?.hasPremiumWatermark) return null;

  return (
    <div className="absolute bottom-24 right-4 z-50 pointer-events-none select-none">
      <div className="flex flex-col items-center group">
        {/* الشعار الراقص السيادي فقط */}
        <div className="flex space-x-0.5 items-center relative" dir="ltr">
          {["F","L","I","X","O"].map((char, i) => (
            <div key={i} className="relative dancing-letter" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="text-white font-black text-[12px] italic tracking-tight drop-shadow-md">{char}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-1">
          <span className="text-[6px] font-black text-white/40 uppercase tracking-[0.2em]">Sovereign Content</span>
        </div>
      </div>

      <style>{`
        .dancing-letter { animation: float 1.5s infinite ease-in-out; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      `}</style>
    </div>
  );
};

export default Watermark;
