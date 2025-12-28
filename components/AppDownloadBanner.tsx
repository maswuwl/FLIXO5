
import React, { useState, useEffect } from 'react';
import { Download, X, Star, Smartphone, ArrowUpRight } from 'lucide-react';

const AppDownloadBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] animate-slide-down" dir="rtl">
      <div className="bg-black/60 backdrop-blur-xl border-b border-white/10 p-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/10 rounded-full text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="w-12 h-12 flixo-gradient rounded-2xl flex items-center justify-center shadow-lg rotate-3">
            <span className="text-white font-black text-xl">F</span>
          </div>
          
          <div className="flex flex-col">
            <h4 className="text-sm font-black text-white leading-tight">تطبيق FLIXO</h4>
            <div className="flex items-center mt-0.5">
              <div className="flex text-yellow-500 ml-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} fill="currentColor" />)}
              </div>
              <span className="text-[9px] text-gray-400 font-bold">أكثر من 10 مليون تحميل</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => window.open('https://flixo.link/download', '_blank')}
          className="flixo-gradient px-5 py-2.5 rounded-2xl text-[11px] font-black text-white shadow-xl shadow-pink-500/20 active:scale-95 transition-all flex items-center space-x-2 space-x-reverse"
        >
          <span>تحميل التطبيق</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default AppDownloadBanner;
