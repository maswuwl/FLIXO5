
import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import PostCard from '../components/PostCard';
import { MOCK_FEED, MOCK_USERS } from '../constants';
import { Brain, Bell, Menu, X, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recommendationEngine } from '../services/recommendationService';
import ProfileGuard from '../components/ProfileGuard';
import GlobalSearch from '../components/GlobalSearch';

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'facebook' | 'reels'>('facebook');
  const [displayFeed, setDisplayFeed] = useState(MOCK_FEED);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  const [isTuning, setIsTuning] = useState(false);
  const [userPersona, setUserPersona] = useState('جاري تحليل ذوقك...');

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
  }, []);

  const openReels = (index: number) => {
    setSelectedVideoIndex(index);
    setViewMode('reels');
  };

  const closeReels = () => {
    setViewMode('facebook');
  };

  return (
    <div className="relative h-full bg-black overflow-hidden" dir="rtl">
      
      {/* 1. الزر العائم للقائمة (Menu) - المعاد لمكانه الأصلي */}
      <div className="fixed top-20 left-4 z-[150] pointer-events-auto">
         <button 
           onClick={() => document.getElementById('sidebar-toggle-btn')?.click()} 
           className="p-3 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl text-white shadow-2xl active:scale-90 transition-all hover:bg-white/10"
         >
           <Menu size={22} />
         </button>
      </div>

      {/* 2. الزر العائم للبحث (Search) - المعاد لمكانه الأصلي */}
      <div className="fixed top-20 right-4 z-[150] pointer-events-auto">
        <GlobalSearch />
      </div>

      {/* Algorithm Insights Overlay */}
      {showAlgorithmInfo && (
        <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-2xl p-8 flex flex-col items-center justify-center animate-fade-in">
          <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mb-6 border border-pink-500/30 animate-pulse">
            <Brain size={40} className="text-pink-500" />
          </div>
          <h2 className="text-2xl font-black mb-2 italic text-white">رؤية الخوارزمية لك</h2>
          <p className="text-pink-400 font-bold mb-8 text-center px-6">"{userPersona}"</p>
          <button onClick={() => setShowAlgorithmInfo(false)} className="mt-12 px-8 py-3 bg-white text-black rounded-full font-black text-xs active:scale-95 transition-all">فهمت ذلك</button>
        </div>
      )}

      {/* Content Area */}
      <div className={`h-full overflow-y-auto no-scrollbar ${viewMode === 'reels' ? 'snap-y snap-mandatory' : 'pt-32'}`}>
        
        {viewMode === 'facebook' ? (
          <div className="max-w-2xl mx-auto space-y-2 pb-24">
            {/* Story Bar */}
            <div className="flex space-x-4 space-x-reverse px-4 mb-6 overflow-x-auto no-scrollbar pb-2">
               <div className="flex-none w-16 text-center space-y-1">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-pink-500 p-0.5 flex items-center justify-center bg-white/5 text-pink-500">
                    <span className="text-2xl font-black">+</span>
                  </div>
                  <span className="text-[10px] text-white/60 font-bold">قصتك</span>
               </div>
               {MOCK_USERS.map(u => (
                 <div key={u.id} className="flex-none w-16 text-center space-y-1">
                    <div className="w-16 h-16 rounded-full flixo-gradient p-0.5">
                      <img src={u.avatar} className="w-full h-full rounded-full border-2 border-black object-cover" />
                    </div>
                    <span className="text-[10px] text-white/60 font-bold truncate block w-16">{u.displayName}</span>
                 </div>
               ))}
            </div>

            {/* Posts Grid (Facebook Style) */}
            {displayFeed.map((item, index) => (
              <PostCard 
                key={item.id} 
                item={item} 
                onVideoClick={() => openReels(index)} 
              />
            ))}
          </div>
        ) : (
          /* Reels Mode (Full Screen) */
          <div className="h-full w-full bg-black relative">
            {/* Close Reels Button */}
            <button 
              onClick={closeReels}
              className="fixed top-20 right-6 z-[200] p-3 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/20 active:scale-90 shadow-2xl"
            >
              <X size={24} />
            </button>
            
            <div className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
              {displayFeed.filter(i => i.type === 'video').map((item) => (
                <div key={item.id} className="h-full w-full snap-start">
                  <VideoCard item={item} onInteraction={tuneFeed} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Tuning Indicator */}
      {isTuning && viewMode === 'facebook' && (
        <div className="fixed bottom-28 left-6 z-[160] flex items-center bg-indigo-600/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[9px] font-black italic shadow-2xl animate-bounce border border-white/20">
          <BarChart size={12} className="ml-2" /> جاري تحسين الموجز...
        </div>
      )}

      {/* Floating Brain Button for Insights */}
      {viewMode === 'facebook' && (
        <div className="fixed bottom-32 right-6 z-[150] pointer-events-auto">
          <button 
            onClick={() => setShowAlgorithmInfo(true)}
            className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-pink-500 shadow-2xl active:scale-90 transition-all"
          >
            <Brain size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;
