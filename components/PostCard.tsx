
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
    <div className="glass-order4 rounded-[3rem] mb-10 overflow-hidden border border-pink-500/10 hover:border-pink-500/30 transition-all duration-700 shadow-2xl" dir="rtl">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse cursor-pointer group" onClick={() => navigate('/profile')}>
          <div className={`relative p-0.5 rounded-2xl transition-transform group-hover:scale-105 ${isSovereign ? 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-white/10'}`}>
            <img src={item.author.avatar} className="w-12 h-12 rounded-2xl border-2 border-[#140a1e] object-cover" alt="avatar" />
            {isSovereign && <div className="absolute -top-1 -right-1 bg-yellow-400 w-4 h-4 rounded-full border-2 border-black"></div>}
          </div>
          <div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="font-black text-sm text-white">{item.author.displayName}</span>
              <CelebrityBadge tier={item.author.celebrityTier as any} size={14} />
            </div>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{item.timestamp}</span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl transition-all"><MoreHorizontal size={22} /></button>
      </div>

      {/* Body */}
      <div className="px-8 pb-6 text-right">
        <p className="text-gray-200 text-sm font-bold leading-relaxed">{item.content}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {item.tags.map(tag => (
              <span key={tag} className="text-[9px] font-black text-pink-400 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20 hover:bg-pink-500 hover:text-white transition-colors cursor-pointer">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Media with Floating Actions */}
      {item.mediaUrl && (
        <div className="relative group/media m-4 rounded-[2rem] overflow-hidden">
          <div 
            className="relative w-full aspect-video overflow-hidden bg-black cursor-pointer"
            onClick={item.type === 'video' ? onVideoClick : undefined}
          >
            <img src={item.mediaUrl} className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-[3s]" alt="post" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
            
            {/* Quick Actions Overlay */}
            <div className="absolute top-4 left-4 flex flex-col space-y-3 translate-x-[-50px] opacity-0 group-hover/media:translate-x-0 group-hover/media:opacity-100 transition-all duration-500">
               <button onClick={handleDownload} className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-pink-500 transition-colors shadow-xl">
                  <Download size={18} />
               </button>
               <button className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-colors shadow-xl">
                  <Zap size={18} />
               </button>
            </div>

            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-pink-500/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 text-white shadow-xl scale-90 group-hover/media:scale-110 transition-transform">
                    <Play size={32} fill="currentColor" className="ml-1" />
                </div>
              </div>
            )}
            <Watermark type={item.type as any} username={item.author.username} />
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="px-8 py-5 flex items-center justify-between border-t border-white/5 bg-white/[0.02]">
        <div className="flex space-x-3 space-x-reverse bg-white/5 p-1 rounded-2xl">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-xl transition-all ${isLiked ? 'bg-pink-500/20 text-pink-500 shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            <Heart size={22} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'animate-bounce' : ''} />
            <span className="text-[10px] font-black">{item.likes + (isLiked ? 1 : 0)}</span>
          </button>
          
          <button className="flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <MessageCircle size={22} />
            <span className="text-[10px] font-black">{item.comments}</span>
          </button>

          <button className="flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <Share2 size={22} />
            <span className="text-[10px] font-black">{item.shares}</span>
          </button>
        </div>

        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isSaved ? 'text-pink-400 bg-pink-500/10 border border-pink-500/20 shadow-xl' : 'text-gray-500 hover:text-white bg-white/5 border border-transparent'}`}
        >
          <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
