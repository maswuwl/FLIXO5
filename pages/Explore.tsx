
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Hash, Zap, Trophy, Crown, MapPin, ExternalLink, Navigation } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { geminiService } from '../services/geminiService';

const Explore: React.FC = () => {
  const [localVibes, setLocalVibes] = useState<any>(null);
  const [loadingLocal, setLoadingLocal] = useState(false);

  const trends = [
    { tag: 'SummerVibe', count: '1.2M posts', icon: <TrendingUp size={16} /> },
    { tag: 'FlixoChallenge', count: '850K posts', icon: <Hash size={16} /> },
    { tag: 'LiveConcert', count: '420K posts', icon: <Zap size={16} /> },
    { tag: 'FoodArt', count: '310K posts', icon: <TrendingUp size={16} /> },
  ];

  const fetchLocalVibes = () => {
    setLoadingLocal(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const vibes = await geminiService.findLocalVibes(pos.coords.latitude, pos.coords.longitude);
      setLocalVibes(vibes);
      setLoadingLocal(false);
    }, () => setLoadingLocal(false));
  };

  useEffect(() => {
    fetchLocalVibes();
  }, []);

  return (
    <div className="flex flex-col h-full bg-black p-4 space-y-6 pt-12 overflow-y-auto pb-24" dir="rtl">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="بحث عن مبدعين، هاشتاقات، تحديات..." 
          className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-gray-500 text-sm"
        />
      </div>

      {/* Local Vibes - Maps Grounding */}
      <div className="bg-gradient-to-br from-blue-900/40 to-black rounded-3xl border border-blue-500/20 p-5 shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black italic flex items-center text-blue-400">
            <MapPin className="ml-2 animate-bounce" size={20} />
            أجواء قريبة منك (Local Vibes)
          </h3>
          <button onClick={fetchLocalVibes} className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold">تحديث</button>
        </div>
        
        {loadingLocal ? (
          <div className="flex flex-col items-center py-8 space-y-3">
             <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
             <p className="text-[10px] text-blue-300 font-bold">جاري تحديد أكثر المواقع شهرة حولك...</p>
          </div>
        ) : localVibes ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-300 leading-relaxed mb-4">{localVibes.text}</p>
            <div className="grid grid-cols-1 gap-2">
              {localVibes.places.map((p: any, idx: number) => (
                <a 
                  key={idx} 
                  href={p.maps?.uri} 
                  target="_blank" 
                  className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-2 bg-blue-500/20 rounded-lg"><Navigation size={14} className="text-blue-400" /></div>
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">{p.maps?.title || 'موقع مشهور'}</span>
                  </div>
                  <ExternalLink size={14} className="text-blue-400" />
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-xs text-gray-500">فعل الموقع لرؤية الأماكن القريبة</p>
          </div>
        )}
      </div>

      {/* Hall of Fame - Leaderboard */}
      <div className="bg-gradient-to-r from-yellow-900/40 to-black rounded-3xl border border-yellow-500/20 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black italic flex items-center text-yellow-500">
            <Trophy className="ml-2" size={20} />
            لوحة الشرف اليومية
          </h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase">مباشر الآن</span>
        </div>
        
        <div className="flex justify-around items-end pt-4">
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <img src={MOCK_USERS[1].avatar} className="w-14 h-14 rounded-full border-2 border-gray-400 object-cover" />
              <div className="absolute -top-2 -right-2 bg-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black text-black">2</div>
            </div>
            <span className="text-[10px] font-bold">{MOCK_USERS[1].displayName}</span>
          </div>

          <div className="flex flex-col items-center scale-125">
            <div className="relative mb-3">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">
                <Crown size={24} />
              </div>
              <div className="p-1 flixo-gradient rounded-full">
                <img src={MOCK_USERS[0].avatar} className="w-16 h-16 rounded-full border-2 border-black object-cover" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-black text-black shadow-lg">1</div>
            </div>
            <span className="text-[10px] font-black text-yellow-500">{MOCK_USERS[0].displayName}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <img src={MOCK_USERS[2].avatar} className="w-14 h-14 rounded-full border-2 border-orange-600 object-cover" />
              <div className="absolute -top-2 -right-2 bg-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black text-black">3</div>
            </div>
            <span className="text-[10px] font-bold">{MOCK_USERS[2].displayName}</span>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp className="ml-2 text-pink-500" /> مواضيع رائجة
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {trends.map((trend, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center text-pink-500 mb-1">
                {trend.icon}
                <span className="font-bold mr-1 text-sm">#{trend.tag}</span>
              </div>
              <span className="text-xs text-gray-400">{trend.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
