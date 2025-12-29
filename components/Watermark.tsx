
import React from 'react';
import { authService } from '../services/authService';
import { ShieldCheck } from 'lucide-react';

interface WatermarkProps {
  type?: 'video' | 'image';
}

const Watermark: React.FC<WatermarkProps> = () => {
  const currentUser = authService.getCurrentUser();
  if (currentUser?.hasPremiumWatermark) return null;

  return (
    <div className="absolute bottom-24 right-4 z-50 pointer-events-none select-none">
      <div className="flex flex-col items-center group">
        {/* إطار الصورة الشخصية السيادي */}
        <div className="relative mb-2">
          <div className="w-10 h-10 rounded-full flixo-gradient p-0.5 shadow-[0_0_15px_rgba(236,72,153,0.5)] animate-fx-vibe">
            <div className="w-full h-full rounded-full border border-black overflow-hidden bg-black">
              <img src={currentUser?.avatar} className="w-full h-full object-cover" alt="owner" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-0.5 border border-black">
            <ShieldCheck size={10} className="text-white" fill="currentColor" />
          </div>
        </div>
        
        {/* الشعار الراقص */}
        <div className="mt-1 flex space-x-0.5 items-center relative" dir="ltr">
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
        @keyframes fx-vibe {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default Watermark;
