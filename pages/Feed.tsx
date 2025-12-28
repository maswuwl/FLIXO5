
import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import { MOCK_FEED, MOCK_USERS } from '../constants';
import { Brain, Search, BarChart, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recommendationEngine } from '../services/recommendationService';
import ProfileGuard from '../components/ProfileGuard';
import GlobalSearch from '../components/GlobalSearch';

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'for-you' | 'following' | 'live'>('for-you');
  const [displayFeed, setDisplayFeed] = useState(MOCK_FEED);
  const [userPersona, setUserPersona] = useState('جاري تحليل ذوقك...');
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  const [isTuning, setIsTuning] = useState(false);

  const tuneFeed = async () => {
    setIsTuning(true);
    const ranked = recommendationEngine.rankContent(MOCK_FEED);
    setDisplayFeed(ranked);
    const persona = await recommendationEngine.getUserPersona();
    setUserPersona(persona);
    setTimeout(() => setIsTuning(false), 1500);
  };

  useEffect(() => {
    tuneFeed();
  }, [activeTab]);

  return (
    <div className="relative h-screen bg-black" dir="rtl">
      {/* Algorithm Insights Overlay */}
      {showAlgorithmInfo && (
        <div className="absolute inset-0 z-[130] bg-black/90 backdrop-blur-2xl p-8 flex flex-col items-center justify-center animate-fade-in">
          <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mb-6 border border-pink-500/30 animate-pulse">
            <Brain size={40} className="text-pink-500" />
          </div>
          <h2 className="text-2xl font-black mb-2 italic text-white">رؤية الخوارزمية لك</h2>
          <p className="text-pink-400 font-bold mb-8 text-center px-6">"{userPersona}"</p>
          
          <div className="w-full space-y-4 max-w-xs">
            <p className="text-[10px] text-gray-500 uppercase font-black text-center tracking-widest">أكثر ما لفت انتباهك:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {recommendationEngine.getTopTags().map(tag => (
                <span key={tag} className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-xs font-bold text-white">#{tag}</span>
              ))}
            </div>
          </div>
          <button onClick={() => setShowAlgorithmInfo(false)} className="mt-12 px-8 py-3 bg-white text-black rounded-full font-black text-xs active:scale-95 transition-all">فهمت ذلك</button>
        </div>
      )}

      {/* EXTREME TOP CONTROLS */}
      {/* Menu at Absolute Top Left (Corner) */}
      <div className="fixed top-4 left-4 z-[160]">
         <button 
           onClick={() => {
              const sidebarBtn = document.getElementById('sidebar-toggle-btn');
              if (sidebarBtn) sidebarBtn.click();
           }} 
           className="p-3 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl text-white shadow-2xl active:scale-90 transition-all hover:bg-white/10"
         >
           <Menu size={22} />
         </button>
      </div>

      {/* Search at Absolute Top Right (Corner) */}
      <div className="fixed top-4 right-4 z-[160]">
        <GlobalSearch />
      </div>

      {/* Right Controls Stack */}
      <div className="fixed top-32 right-6 z-[95] flex flex-col items-center space-y-4">
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => navigate('/notifications')} 
            className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white relative active:scale-90 transition-all"
          >
            <Bell size={22} />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-black animate-pulse"></div>
          </button>

          <button 
            onClick={() => navigate('/profile')} 
            className="group relative active:scale-90 transition-all"
          >
            <ProfileGuard isActive={MOCK_USERS[0].celebrityTier === 0} size="sm" isSovereign={true}>
              <div className="w-12 h-12 rounded-2xl border-2 border-yellow-500/50 overflow-hidden shadow-xl bg-black">
                <img src={MOCK_USERS[0].avatar} className="w-full h-full object-cover" alt="Me" />
              </div>
            </ProfileGuard>
          </button>
          
          <button 
            onClick={() => setShowAlgorithmInfo(true)}
            className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 group active:scale-90 transition-all"
          >
            <Brain size={22} className={`transition-colors ${isTuning ? 'text-pink-500 animate-spin' : 'text-gray-300 group-hover:text-pink-500'}`} />
          </button>
        </div>
      </div>

      {/* Top Header Navigation Tabs */}
      <div className="absolute top-0 left-0 right-0 z-[80] bg-gradient-to-b from-black/95 via-black/30 to-transparent pt-20 pb-10">
        <div className="flex justify-center space-x-8 space-x-reverse pointer-events-auto">
          <button onClick={() => setActiveTab('following')} className={`text-base font-black tracking-tighter transition-all ${activeTab === 'following' ? 'text-white scale-105' : 'text-white/40'}`}>أتابعهم</button>
          <button onClick={() => setActiveTab('for-you')} className={`text-base font-black tracking-tighter transition-all ${activeTab === 'for-you' ? 'text-white scale-110 relative' : 'text-white/40'}`}>
            لك
            {activeTab === 'for-you' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>}
          </button>
        </div>
      </div>

      <div className="video-snap-container h-full">
        {displayFeed.map((item) => (
          <VideoCard key={item.id} item={item} onInteraction={() => tuneFeed()} />
        ))}
      </div>

      {isTuning && (
        <div className="absolute bottom-28 left-6 z-[85] flex items-center bg-indigo-600/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[9px] font-black italic shadow-2xl animate-bounce border border-white/20">
          <BarChart size={12} className="ml-2" /> جاري تحسين محتواك...
        </div>
      )}
    </div>
  );
};

export default Feed;
