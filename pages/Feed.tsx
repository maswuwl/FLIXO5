
import React, { useState } from 'react';
import { 
  Plus, Video, ImageIcon, Smile, MoreHorizontal, 
  Heart, MessageCircle, Share2, Globe, Sparkles 
} from 'lucide-react';
import { authService } from '../services/authService';
import { MOCK_FEED, MOCK_USERS } from '../constants';

const Feed: React.FC = () => {
  const user = authService.getCurrentUser();
  const [posts, setPosts] = useState(MOCK_FEED);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stories Section */}
      <div className="flex space-x-2 space-x-reverse overflow-x-auto no-scrollbar pb-2">
        <div className="flex-none w-32 h-52 bg-[#18191a] rounded-xl overflow-hidden relative cursor-pointer group shadow-lg">
          <img src={user?.avatar} className="w-full h-[70%] object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-10 h-10 bg-indigo-500 rounded-full border-4 border-[#18191a] flex items-center justify-center text-white z-20">
            <Plus size={24} />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[30%] bg-[#242526] flex items-end justify-center pb-2">
            <span className="text-[11px] font-bold">إنشاء قصة</span>
          </div>
        </div>
        
        {MOCK_USERS.map((u, i) => (
          <div key={i} className="flex-none w-32 h-52 bg-white/5 rounded-xl overflow-hidden relative cursor-pointer group shadow-lg">
            <img src={`https://images.unsplash.com/photo-${1550000000000 + i}?auto=format&fit=crop&w=300&q=80`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute top-3 right-3 w-10 h-10 rounded-full border-4 border-indigo-500 p-0.5 shadow-xl">
               <img src={u.avatar} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="absolute bottom-3 right-3 left-3">
              <span className="text-[11px] font-bold text-white drop-shadow-md truncate block">{u.displayName}</span>
            </div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          </div>
        ))}
      </div>

      {/* Create Post Section */}
      <div className="bg-[#18191a] rounded-xl p-4 shadow-xl border border-white/5">
        <div className="flex items-center space-x-3 space-x-reverse mb-4">
          <img src={user?.avatar} className="w-10 h-10 rounded-full object-cover" />
          <button className="flex-1 bg-[#3a3b3c] hover:bg-[#4e4f50] text-gray-400 text-right px-4 py-2.5 rounded-full text-sm transition-colors">
            بماذا تفكر يا {user?.displayName.split(' ')[0]}؟
          </button>
        </div>
        <hr className="border-white/5 mb-2" />
        <div className="flex items-center justify-between">
          <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse py-2 hover:bg-white/5 rounded-lg transition-colors">
            <Video className="text-red-500" size={20} />
            <span className="text-sm font-medium text-gray-400">فيديو مباشر</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse py-2 hover:bg-white/5 rounded-lg transition-colors">
            <ImageIcon className="text-green-500" size={20} />
            <span className="text-sm font-medium text-gray-400">صور/فيديو</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse py-2 hover:bg-white/5 rounded-lg transition-colors">
            <Smile className="text-yellow-500" size={20} />
            <span className="text-sm font-medium text-gray-400">نشاط/شعور</span>
          </button>
        </div>
      </div>

      {/* Posts Wave */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#18191a] rounded-xl shadow-xl border border-white/5 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <img src={post.author.avatar} className="w-10 h-10 rounded-full border border-white/10" />
                  <div className="text-right">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <span className="font-bold text-sm">{post.author.displayName}</span>
                      {post.isFeaturedByPlatform && <Sparkles size={12} className="text-indigo-400" />}
                    </div>
                    <div className="flex items-center text-[11px] text-gray-500 font-medium">
                      <span>{post.timestamp}</span>
                      <span className="mx-1">•</span>
                      <Globe size={10} />
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-full text-gray-500"><MoreHorizontal size={20} /></button>
              </div>
              <p className="text-sm leading-relaxed mb-4">{post.content}</p>
            </div>
            
            {post.mediaUrl && (
              <div className="w-full bg-black flex items-center justify-center overflow-hidden max-h-[500px]">
                <img src={post.mediaUrl} className="w-full object-contain" />
              </div>
            )}

            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-1 space-x-reverse">
                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-[#18191a]">
                  <Heart size={10} fill="white" />
                </div>
                <span className="text-xs text-gray-400">{post.likes.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse text-xs text-gray-400">
                <span>{post.comments} تعليقاً</span>
                <span>{post.shares} مشاركة</span>
              </div>
            </div>

            <div className="flex items-center p-1">
              <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse py-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                <Heart size={18} />
                <span className="text-sm font-bold">أعجبني</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse py-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                <MessageCircle size={18} />
                <span className="text-sm font-bold">تعليق</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse py-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                <Share2 size={18} />
                <span className="text-sm font-bold">مشاركة</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
