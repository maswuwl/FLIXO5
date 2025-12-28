
import React, { useState } from 'react';
import { MOCK_GIFTS } from '../constants';
import { Gift } from '../types';
import { X, Zap } from 'lucide-react';

interface GiftsOverlayProps {
  onClose: () => void;
  onSend: (gift: Gift) => void;
}

const GiftsOverlay: React.FC<GiftsOverlayProps> = ({ onClose, onSend }) => {
  const [multiplier, setMultiplier] = useState(1);
  const multipliers = [1, 10, 50, 100];

  return (
    <div className="absolute inset-x-0 bottom-0 bg-black/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[40px] p-6 z-50 animate-slide-up shadow-[0_-20px_50px_rgba(0,0,0,0.5)]" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h3 className="font-black text-xl tracking-tight">إرسال هدية</h3>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">ادعم من تحب الآن</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Multiplier Selector */}
      <div className="flex justify-center space-x-2 space-x-reverse mb-6 bg-white/5 p-1 rounded-2xl border border-white/5">
        {multipliers.map(m => (
          <button 
            key={m}
            onClick={() => setMultiplier(m)}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${multiplier === m ? 'flixo-gradient text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            x{m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 max-h-64 overflow-y-auto pb-4 no-scrollbar">
        {MOCK_GIFTS.map((gift) => (
          <button 
            key={gift.id}
            onClick={() => onSend(gift)}
            className="flex flex-col items-center p-3 rounded-2xl hover:bg-white/5 transition-all group relative border border-transparent hover:border-pink-500/20 active:scale-95"
          >
            {gift.price > 100 && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1 animate-pulse shadow-lg">
                <Zap size={10} className="text-black" />
              </div>
            )}
            <span className="text-3xl mb-1 group-hover:scale-125 transition-transform duration-300 transform-gpu">{gift.icon}</span>
            <span className="text-[10px] text-gray-400 font-bold truncate w-full text-center">{gift.name}</span>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-yellow-500 text-[10px]">🪙</span>
              <span className="text-[10px] font-black">{gift.price * multiplier}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <span className="text-yellow-500">🪙</span>
          </div>
          <div>
            <span className="block font-black text-sm">1,240</span>
            <span className="text-[10px] text-gray-500 font-bold">الرصيد المتاح</span>
          </div>
        </div>
        <button className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-transform">
          شحن الآن
        </button>
      </div>
    </div>
  );
};

export default GiftsOverlay;
