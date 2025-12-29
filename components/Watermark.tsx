
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
      <div className="flex flex-col items-center">
        {/* الشعار الراقص والمهتز (FX Vibe) */}
        <div className="w-7 h-7 flixo-gradient rounded-lg flex items-center justify-center animate-fx-vibe border border-white/30 shadow-[0_0_15px_rgba(236,72,153,0.5)]">
           <span className="text-white font-black text-[12px] tracking-tighter">FX</span>
        </div>
        
        <div className="mt-1 flex space-x-0.5 items-center relative" dir="ltr">
          {["F","L","I","X","O"].map((char, i) => (
            <div key={i} className="relative dancing-letter" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="text-white font-black text-[14px] italic tracking-tight drop-shadow-md">{char}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .dancing-letter {
          animation: float 1.5s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes fx-vibe {
            0%, 100% { transform: scale(1) rotate(0deg); }
            15% { transform: scale(1.2) rotate(-15deg); }
            30% { transform: scale(1.2) rotate(15deg); }
            50% { transform: scale(1.35) rotate(0deg); }
            70% { transform: scale(1.2) rotate(-10deg); }
            85% { transform: scale(1.2) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default Watermark;
