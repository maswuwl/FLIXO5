
import React from 'react';
import { authService } from '../services/authService';

interface WatermarkProps {
  type: 'video' | 'image';
  username?: string;
}

const Watermark: React.FC<WatermarkProps> = ({ type }) => {
  const currentUser = authService.getCurrentUser();
  if (currentUser?.hasPremiumWatermark) return null;

  const letters = "FLIXO".split("");

  return (
    <div className="absolute inset-0 z-50 pointer-events-none select-none overflow-hidden">
      <div className="likee-watermark-container">
        <div className="flex items-center">
          {/* الشعار المتراقص (FX Dancing Logo) */}
          <div className="w-8 h-8 flixo-gradient rounded-lg flex items-center justify-center ml-4 animate-fx-vibe border border-white/30">
             <span className="text-white font-black text-[14px] tracking-tighter">FX</span>
          </div>
          
          <div className="flex items-center" dir="ltr">
            <div className="flex space-x-1 items-center relative">
              {letters.map((char, i) => (
                <div key={i} className="relative dancing-letter" style={{ animationDelay: `${i * 0.15}s` }}>
                  <span className="absolute inset-0 text-pink-500 font-black text-[24px] italic blur-[1px] opacity-70 translate-x-[1.5px] translate-y-[1.5px]">{char}</span>
                  <span className="relative text-white font-black text-[24px] italic tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{char}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .likee-watermark-container {
          position: absolute;
          bottom: 120px;
          right: 20px;
          opacity: 0.8;
          display: flex;
          align-items: center;
          transition: all 0.5s ease;
        }

        .dancing-letter {
          animation: float 2s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes fx-vibe {
            0%, 100% { transform: scale(1) rotate(0deg); }
            15% { transform: scale(1.1) rotate(-10deg); }
            30% { transform: scale(1.1) rotate(10deg); }
            45% { transform: scale(1.2) rotate(-15deg); }
            60% { transform: scale(1.2) rotate(15deg); }
            80% { transform: scale(1.1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default Watermark;
