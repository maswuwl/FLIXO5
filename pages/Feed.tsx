
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
      {/* Aura Tabs & Controls */}
      <div className="p-6 flex items-center justify-between shrink-0">
        <div className="w-12 h-12 glass-order4 rounded-2xl flex items-center justify-center text-pink-400/50 hover:text-pink-400 border border-white/10 transition-all cursor-pointer">
           <SlidersHorizontal size={20} />
        </div>
        
        <div className="flex glass-order4 rounded-3xl p-1.5 border border-pink-500/10 flex-1 mx-4 shadow-xl">
          <button 
            onClick={() => setViewMode('posts')}
            className={`flex-1 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'posts' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'text-gray-500 hover:text-white'}`}
          >
            الموجز
          </button>
          <button 
            onClick={() => setViewMode('reels')}
            className={`flex-1 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'reels' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'text-gray-500 hover:text-white'}`}
          >
            بث لايفو
          </button>
        </div>

        <button className="w-12 h-12 glass-order4 rounded-2xl flex items-center justify-center text-pink-400 hover:bg-pink-500/10 border border-white/10 shadow-lg active:scale-90 transition-all">
          <Command size={22} />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto no-scrollbar pb-40 ${viewMode === 'reels' ? 'snap-y snap-mandatory' : ''}`}>
        {viewMode === 'posts' ? (
          <div className="max-w-xl mx-auto pt-2 px-4 space-y-6">
            
            {/* Thinking Bar - "بماذا تفكر" - Order 4 Style */}
            <div 
              onClick={() => navigate('/create')}
              className="mx-2 glass-order4 rounded-[2.5rem] p-4 border border-pink-500/10 flex items-center space-x-4 space-x-reverse cursor-pointer hover:bg-white/5 transition-all group shadow-xl"
            >
              <div className="relative">
                <img 
                  src={currentUser?.avatar} 
                  className="w-11 h-11 rounded-full border-2 border-pink-500/40 object-cover shadow-[0_0_10px_rgba(236,72,153,0.3)]" 
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#140a1e]"></div>
              </div>
              <div className="flex-1 bg-white/5 rounded-full px-6 py-3 text-[11px] text-gray-400 font-bold border border-white/5 group-hover:border-pink-500/30 transition-all">
                بماذا تفكر يا {currentUser?.displayName.split(' ')[0]}؟
              </div>
              <div className="flex space-x-2 space-x-reverse opacity-60 group-hover:opacity-100 transition-opacity">
                 <div className="p-2 text-pink-400"><ImageIcon size={18} /></div>
                 <div className="p-2 text-purple-400"><Sparkles size={18} /></div>
              </div>
            </div>

            {/* Small Story Circles - Order 4 (Half Size) */}
            <div className="flex space-x-4 space-x-reverse px-2 mb-6 overflow-x-auto no-scrollbar pb-2">
               <div className="flex-none flex flex-col items-center space-y-2 group cursor-pointer">
                  <div className="w-11 h-11 rounded-full border-2 border-dashed border-pink-500/40 flex items-center justify-center bg-pink-500/5 group-hover:bg-pink-500/10 transition-all">
                    <Plus size={16} className="text-pink-400" />
                  </div>
                  <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">تأسيس</span>
               </div>
               {MOCK_USERS.map(u => (
                 <div key={u.id} className="flex-none flex flex-col items-center space-y-2 cursor-pointer group">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-md group-hover:scale-110 transition-transform">
                      <div className="w-full h-full rounded-full border-2 border-[#050208] overflow-hidden">
                        <img src={u.avatar} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-[8px] text-white/60 font-bold truncate w-11 text-center">{u.displayName.split(' ')[0]}</span>
                 </div>
               ))}
            </div>

            {/* Content Feed */}
            <div className="space-y-10">
              {displayFeed.map((item) => (
                <div key={item.id} className="relative transition-all duration-500 hover:scale-[1.01]">
                  {item.isFeaturedByPlatform && (
                    <div className="absolute -top-3 -right-2 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase shadow-xl border border-white/30 animate-pulse">
                      <Zap size={12} className="ml-1" fill="white" /> سيادة أثيرية
                    </div>
                  )}
                  <PostCard item={item} onVideoClick={() => setViewMode('reels')} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Reels Mode */
          <div className="h-full w-full bg-black">
            {displayFeed.filter(i => i.type === 'video').map((item) => (
              <div key={item.id} className="h-full w-full snap-start">
                <VideoCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Pulse - Order 4 */}
      {isTuning && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[150] px-8 py-3 glass-order4 rounded-full flex items-center space-x-3 space-x-reverse border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-pulse">
          <Sparkles size={18} className="text-pink-400" />
          <span className="text-[10px] font-black italic text-pink-100 uppercase tracking-widest">الأثير يحلل بيانات خالد..</span>
        </div>
      )}
    </div>
  );
};

export default Feed;
