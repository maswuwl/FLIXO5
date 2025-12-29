
import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import VideoCard from '../components/VideoCard';
import { MOCK_FEED, MOCK_USERS } from '../constants';
import { Brain, Sparkles, Plus, Zap, Command, Heart, Filter, SlidersHorizontal, Image as ImageIcon, Video as VideoIcon, UserCircle } from 'lucide-react';
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
      setTimeout(() => setIsTuning(false), 1500);
    };
    tune();
  }, []);

  return (
    <div className="h-full bg-transparent overflow-hidden flex flex-col">
      {/* الترويسة والتحكم */}
      <div className="p-3 flex items-center justify-between shrink-0 bg-black/10 backdrop-blur-md">
        <div className="w-8 h-8 glass-order4 rounded-lg flex items-center justify-center text-pink-400 active:scale-90 transition-all cursor-pointer" onClick={() => navigate('/settings')}>
           <SlidersHorizontal size={12} />
        </div>
        
        <div className="flex glass-order4 rounded-2xl p-1 border border-pink-500/10 flex-1 mx-3 shadow-lg">
          <button 
            onClick={() => setViewMode('posts')}
            className={`flex-1 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'posts' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-500'}`}
          >
            الموجز
          </button>
          <button 
            onClick={() => setViewMode('reels')}
            className={`flex-1 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'reels' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-500'}`}
          >
            بث لايفو
          </button>
        </div>

        {/* أيقونة الملف الشخصي للمستخدم الحالي */}
        <div 
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-xl flixo-gradient p-0.5 shadow-lg active:scale-90 transition-transform cursor-pointer"
        >
          <img src={currentUser?.avatar} className="w-full h-full rounded-[10px] border border-black object-cover" alt="me" />
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto no-scrollbar pb-32 ${viewMode === 'reels' ? 'snap-y snap-mandatory' : ''}`}>
        {viewMode === 'posts' ? (
          <div className="max-w-xl mx-auto pt-1 px-3 space-y-4">
            
            {/* شريط التفكير السيادي - مع صورة المستخدم */}
            <div 
              onClick={() => navigate('/create')}
              className="mx-1 glass-order4 rounded-[1.8rem] p-3 border border-pink-500/10 flex items-center space-x-3 space-x-reverse cursor-pointer hover:bg-white/5 transition-all group shadow-xl"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl flixo-gradient p-0.5 shadow-lg group-hover:rotate-6 transition-transform">
                  <img src={currentUser?.avatar} className="w-full h-full rounded-[14px] border border-black object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
              </div>
              <div className="flex-1 bg-white/5 rounded-2xl px-5 py-3 text-[10px] text-gray-400 font-bold border border-white/5 group-hover:border-pink-500/40 transition-all">
                بماذا تفكر يا {currentUser?.displayName.split(' ')[0]}؟
              </div>
              <div className="p-3 text-pink-400 opacity-60 group-hover:opacity-100 transition-opacity">
                 <ImageIcon size={18} />
              </div>
            </div>

            {/* القصص - أول دائرة هي صورة المستخدم لإضافة قصة */}
            <div className="flex space-x-4 space-x-reverse px-1 mb-4 overflow-x-auto no-scrollbar pb-2">
               <div className="flex-none flex flex-col items-center space-y-2 group cursor-pointer" onClick={() => navigate('/create')}>
                  <div className="relative w-12 h-12 rounded-2xl flixo-gradient p-0.5 shadow-lg group-active:scale-90 transition-transform">
                    <img src={currentUser?.avatar} className="w-full h-full rounded-[14px] border border-black object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Plus size={16} className="text-white" />
                    </div>
                  </div>
                  <span className="text-[7px] text-pink-500 font-black uppercase tracking-widest">قصتي</span>
               </div>
               {MOCK_USERS.map(u => (
                 <div key={u.id} className="flex-none flex flex-col items-center space-y-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-[14px] border border-black overflow-hidden">
                        <img src={u.avatar} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-[7px] text-white/50 font-bold truncate w-12 text-center">{u.displayName.split(' ')[0]}</span>
                 </div>
               ))}
            </div>

            {/* المحتوى */}
            <div className="space-y-6">
              {displayFeed.map((item) => (
                <div key={item.id} className="relative transition-all duration-500">
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

      {isTuning && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[150] px-6 py-2 glass-order4 rounded-full flex items-center space-x-2 space-x-reverse border border-pink-500/40 shadow-2xl animate-pulse">
          <Sparkles size={14} className="text-pink-400" />
          <span className="text-[9px] font-black italic text-white uppercase tracking-widest">تنسيق الأفق...</span>
        </div>
      )}
    </div>
  );
};

export default Feed;
