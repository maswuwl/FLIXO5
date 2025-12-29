
import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import VideoCard from '../components/VideoCard';
import { MOCK_FEED, MOCK_USERS } from '../constants';
import { Brain, Sparkles, Plus, Zap, Command, Heart, Filter, SlidersHorizontal, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { recommendationEngine } from '../services/recommendationService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'posts' | 'reels'>('posts');
  const [displayFeed, setDisplayFeed] = useState(MOCK_FEED);
  const [isTuning, setIsTuning] = useState(false);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const tune = async () => {
      setIsTuning(true);
      const ranked = recommendationEngine.rankContent(MOCK_FEED);
      setDisplayFeed(ranked);
      setTimeout(() => setIsTuning(false), 2000);
    };
    tune();
  }, []);

  return (
    <div className="h-full bg-transparent overflow-hidden flex flex-col animate-order4">
      {/* Aura Tabs & Controls - Compact (h-12) */}
      <div className="p-3 flex items-center justify-between shrink-0">
        <div className="w-8 h-8 glass-order4 rounded-lg flex items-center justify-center text-pink-400/50 hover:text-pink-400 border border-white/10 transition-all cursor-pointer">
           <SlidersHorizontal size={12} />
        </div>
        
        <div className="flex glass-order4 rounded-2xl p-1 border border-pink-500/10 flex-1 mx-3 shadow-lg">
          <button 
            onClick={() => setViewMode('posts')}
            className={`flex-1 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'posts' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30' : 'text-gray-500 hover:text-white'}`}
          >
            الموجز
          </button>
          <button 
            onClick={() => setViewMode('reels')}
            className={`flex-1 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'reels' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30' : 'text-gray-500 hover:text-white'}`}
          >
            بث لايفو
          </button>
        </div>

        <button className="w-8 h-8 glass-order4 rounded-lg flex items-center justify-center text-pink-400 hover:bg-pink-500/10 border border-white/10 shadow-md active:scale-90 transition-all">
          <Command size={14} />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto no-scrollbar pb-32 ${viewMode === 'reels' ? 'snap-y snap-mandatory' : ''}`}>
        {viewMode === 'posts' ? (
          <div className="max-w-xl mx-auto pt-1 px-3 space-y-4">
            
            {/* Thinking Bar - Compact (Avatar 11 -> 6) */}
            <div 
              onClick={() => navigate('/create')}
              className="mx-1 glass-order4 rounded-2xl p-3 border border-pink-500/10 flex items-center space-x-3 space-x-reverse cursor-pointer hover:bg-white/5 transition-all group shadow-lg"
            >
              <div className="relative">
                <img 
                  src={currentUser?.avatar} 
                  className="w-8 h-8 rounded-full border border-pink-500/40 object-cover shadow-sm" 
                />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-[#140a1e]"></div>
              </div>
              <div className="flex-1 bg-white/5 rounded-full px-4 py-2 text-[9px] text-gray-400 font-bold border border-white/5 group-hover:border-pink-500/30 transition-all">
                بماذا تفكر يا {currentUser?.displayName.split(' ')[0]}؟
              </div>
              <div className="flex space-x-1 space-x-reverse opacity-60 group-hover:opacity-100 transition-opacity">
                 <div className="p-1.5 text-pink-400"><ImageIcon size={12} /></div>
                 <div className="p-1.5 text-purple-400"><Sparkles size={12} /></div>
              </div>
            </div>

            {/* Story Circles - Compact (Avatar 11 -> 6) */}
            <div className="flex space-x-3 space-x-reverse px-1 mb-4 overflow-x-auto no-scrollbar pb-1">
               <div className="flex-none flex flex-col items-center space-y-1.5 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full border border-dashed border-pink-500/40 flex items-center justify-center bg-pink-500/5 group-hover:bg-pink-500/10 transition-all">
                    <Plus size={12} className="text-pink-400" />
                  </div>
                  <span className="text-[6px] text-gray-500 font-black uppercase tracking-widest">تأسيس</span>
               </div>
               {MOCK_USERS.map(u => (
                 <div key={u.id} className="flex-none flex flex-col items-center space-y-1.5 cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-sm group-hover:scale-110 transition-transform">
                      <div className="w-full h-full rounded-full border border-[#050208] overflow-hidden">
                        <img src={u.avatar} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-[6px] text-white/60 font-bold truncate w-8 text-center">{u.displayName.split(' ')[0]}</span>
                 </div>
               ))}
            </div>

            {/* Content Feed */}
            <div className="space-y-6">
              {displayFeed.map((item) => (
                <div key={item.id} className="relative transition-all duration-500 hover:scale-[1.01]">
                  {item.isFeaturedByPlatform && (
                    <div className="absolute -top-2 -right-1 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-[7px] font-black uppercase shadow-lg border border-white/30 animate-pulse">
                      <Zap size={8} className="ml-1" fill="white" /> سيادة أثيرية
                    </div>
                  )}
                  <PostCard item={item} onVideoClick={() => setViewMode('reels')} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full w-full bg-black">
            {displayFeed.filter(i => i.type === 'video').map((item) => (
              <div key={item.id} className="h-full w-full snap-start">
                <VideoCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Pulse - Compact */}
      {isTuning && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[150] px-4 py-1.5 glass-order4 rounded-full flex items-center space-x-2 space-x-reverse border border-pink-500/30 shadow-md animate-pulse">
          <Sparkles size={12} className="text-pink-400" />
          <span className="text-[8px] font-black italic text-pink-100 uppercase tracking-widest">تحليل..</span>
        </div>
      )}
    </div>
  );
};

export default Feed;
