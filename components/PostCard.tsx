
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Sparkles, Download, Bookmark, Zap, Share } from 'lucide-react';
import { ContentItem } from '../types';
import Watermark from './Watermark';
import CelebrityBadge from './CelebrityBadge';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  item: ContentItem;
  onVideoClick?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ item, onVideoClick }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isSovereign = item.author.celebrityTier === 0;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.mediaUrl) return;
    const response = await fetch(item.mediaUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FLIXO_${item.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-order4 rounded-[2rem] mb-6 overflow-hidden border border-pink-500/10 hover:border-pink-500/30 transition-all duration-700 shadow-2xl" dir="rtl">
      {/* Header - Compact */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 space-x-reverse cursor-pointer group" onClick={() => navigate('/profile')}>
          <div className={`relative p-0.5 rounded-xl transition-transform group-hover:scale-105 ${isSovereign ? 'bg-pink-500 shadow-lg' : 'bg-white/10'}`}>
            <img src={item.author.avatar} className="w-8 h-8 rounded-xl border border-[#140a1e] object-cover" alt="avatar" />
            {isSovereign && <div className="absolute -top-0.5 -right-0.5 bg-yellow-400 w-2.5 h-2.5 rounded-full border border-black"></div>}
          </div>
          <div>
            <div className="flex items-center space-x-1.5 space-x-reverse">
              <span className="font-black text-[10px] text-white">{item.author.displayName}</span>
              <CelebrityBadge tier={item.author.celebrityTier as any} size={10} />
            </div>
            <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">{item.timestamp}</span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg transition-all"><MoreHorizontal size={12} /></button>
      </div>

      {/* Body - Text reduced by 30% */}
      <div className="px-5 pb-3 text-right">
        <p className="text-gray-200 text-[10px] font-bold leading-relaxed">{item.content}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.tags.map(tag => (
              <span key={tag} className="text-[7px] font-black text-pink-400 bg-pink-500/10 px-2 py-1 rounded-full border border-pink-500/20 hover:bg-pink-500 hover:text-white transition-colors cursor-pointer">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Media with Floating Actions */}
      {item.mediaUrl && (
        <div className="relative group/media mx-3 mb-3 rounded-[1.5rem] overflow-hidden">
          <div 
            className="relative w-full aspect-video overflow-hidden bg-black cursor-pointer"
            onClick={item.type === 'video' ? onVideoClick : undefined}
          >
            <img src={item.mediaUrl} className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-[3s]" alt="post" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
            
            {/* Quick Actions Overlay - Reduced Icons */}
            <div className="absolute top-2 left-2 flex flex-col space-y-2 translate-x-[-30px] opacity-0 group-hover/media:translate-x-0 group-hover/media:opacity-100 transition-all duration-500">
               <button onClick={handleDownload} className="w-7 h-7 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-pink-500 transition-colors">
                  <Download size={12} />
               </button>
               <button className="w-7 h-7 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-colors">
                  <Zap size={12} />
               </button>
            </div>

            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 bg-pink-500/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 text-white shadow-xl scale-90 group-hover/media:scale-110 transition-transform">
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                </div>
              </div>
            )}
            <Watermark type={item.type as any} />
          </div>
        </div>
      )}

      {/* Actions Bar - Icons reduced by 50% */}
      <div className="px-5 py-3 flex items-center justify-between border-t border-white/5 bg-white/[0.02]">
        <div className="flex space-x-2 space-x-reverse bg-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-lg transition-all ${isLiked ? 'bg-pink-500/20 text-pink-500' : 'text-gray-500 hover:text-white'}`}
          >
            <Heart size={11} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'animate-bounce' : ''} />
            <span className="text-[8px] font-black">{item.likes + (isLiked ? 1 : 0)}</span>
          </button>
          
          <button className="flex items-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-lg text-gray-500 hover:text-white transition-all">
            <MessageCircle size={11} />
            <span className="text-[8px] font-black">{item.comments}</span>
          </button>

          <button className="flex items-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-lg text-gray-500 hover:text-white transition-all">
            <Share2 size={11} />
            <span className="text-[8px] font-black">{item.shares}</span>
          </button>
        </div>

        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${isSaved ? 'text-pink-400 bg-pink-500/10 border border-pink-500/20' : 'text-gray-500 hover:text-white bg-white/5'}`}
        >
          <Bookmark size={12} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
