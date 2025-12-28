
import React from 'react';
import { authService } from '../services/authService';

interface WatermarkProps {
  type: 'video' | 'image';
  username?: string;
}

const Watermark: React.FC<WatermarkProps> = ({ type, username }) => {
  const currentUser = authService.getCurrentUser();
  if (currentUser?.hasPremiumWatermark) return null;

  const letters = "FLIXO".split("");
  const userLetters = username ? `@${username}`.split("") : [];

  return (
    <div className="absolute inset-0 z-50 pointer-events-none select-none overflow-hidden">
      <div className="likee-watermark-container">
        <div className="flex items-center">
          <div className="w-6 h-6 flixo-gradient rounded-lg flex items-center justify-center ml-3 logo-pulse shadow-[0_0_15px_rgba(236,72,153,0.8)] border border-white/20">
             <span className="text-white font-black text-[11px] tracking-tighter">FX</span>
          </div>
          <div className="flex items-center" dir="ltr">
            <div className="flex space-x-0.5 items-center mr-3 relative">
              {letters.map((char, i) => (
                <div key={i} className="relative dancing-letter" style={{ animationDelay: `${i * 0.15}s` }}>
                  <span className="absolute inset-0 text-pink-500 font-black text-[22px] italic blur-[1px] opacity-70 translate-x-[1.5px] translate-y-[1.5px]">{char}</span>
                  <span className="relative text-white font-black text-[22px] italic tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{char}</span>
                </div>
              ))}
            </div>
            {username && (
              <div className="flex items-center border-l border-white/20 pl-3">
                {userLetters.map((char, i) => (
                  <div key={i} className="relative dancing-letter" style={{ animationDelay: `${(i + 5) * 0.1}s` }}>
                    <span className="absolute inset-0 text-indigo-500 font-black text-[14px] italic blur-[1px] opacity-60 translate-x-[1px] translate-y-[1px]">{char}</span>
                    <span className="relative text-white/90 font-black text-[14px] italic tracking-tighter">{char}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watermark;
