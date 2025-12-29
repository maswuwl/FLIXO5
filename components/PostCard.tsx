
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Globe, ShieldCheck, Sparkles, Download, Lock, Users } from 'lucide-react';
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
  const isSovereign = item.author.celebrityTier === 0;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.mediaUrl) return;
    
    try {
      const response = await fetch(item.mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FLIXO_MEDIA_${item.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile`); // يمكن تمرير ID المستخدم في النسخة المتقدمة
  };

  return (
    <div className="bg-[#111] border-y border-white/5 mb-2 shadow-xl animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse cursor-pointer group" onClick={goToProfile}>
          <div className={`relative p-0.5 rounded-full transition-transform group-hover:scale-110 ${isSovereign ? 'flixo-gradient' : 'bg-white/10'}`}>
            <img src={item.author.avatar} className="w-10 h-10 rounded-full border-2 border-black object-cover" alt="avatar" />
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 space-x-reverse">
              <span className="font-black text-sm text-white group-hover:text-indigo-400 transition-colors">{item.author.displayName}</span>
              <CelebrityBadge tier={item.author.celebrityTier as any} size={12} />
            </div>
            <div className="flex items-center text-[10px] text-gray-500 font-bold space-x-1 space-x-reverse">
              <span>{item.timestamp}</span>
              <span>•</span>
              <Globe size={10} title="عام" />
            </div>
          </div>
        </div>
        <button className="text-gray-500 p-2 hover:bg-white/5 rounded-full transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content Text */}
      <div className="px-4 pb-3 text-right">
        <p className="text-gray-200 text-sm font-medium leading-relaxed whitespace-pre-wrap">{item.content}</p>
      </div>

      {/* Media Content */}
      {item.mediaUrl && (
        <div 
          className="relative w-full aspect-video md:aspect-auto md:max-h-[500px] overflow-hidden bg-black cursor-pointer group"
          onClick={item.type === 'video' ? onVideoClick : undefined}
        >
          <img src={item.mediaUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="post content" />
          
          {/* Download Button Overlay */}
          <button 
            onClick={handleDownload}
            className="absolute top-4 left-4 p-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-2xl active:scale-90"
            title="تنزيل المحتوى"
          >
            <Download size={18} />
          </button>

          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
               <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 text-white shadow-2xl group-hover:scale-110 transition-transform">
                  <Play size={32} fill="currentColor" />
               </div>
            </div>
          )}
          
          <Watermark type={item.type as any} username={item.author.username} />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-3 flex justify-between items-center border-b border-white/5">
         <div className="flex items-center space-x-1 space-x-reverse">
            <div className="flex -space-x-1.5 space-x-reverse">
               <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                  <Heart size={10} fill="white" className="text-white" />
               </div>
               <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center border-2 border-black">
                  <Sparkles size={10} className="text-white" />
               </div>
            </div>
            <span className="text-[11px] text-gray-400 font-bold">{(item.likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
         </div>
         <div className="flex space-x-3 space-x-reverse">
            <span className="text-[11px] text-gray-400 font-bold">{item.comments} تعليق</span>
            <span className="text-[11px] text-gray-400 font-bold">{item.shares} مشاركة</span>
         </div>
      </div>

      {/* Action Buttons */}
      <div className="flex px-2 py-1">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`flex-1 flex items-center justify-center space-x-2 space-x-reverse py-3 rounded-xl transition-all active:scale-95 ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:bg-white/5'}`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-xs font-black">أعجبني</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse py-3 rounded-xl text-gray-400 hover:bg-white/5 transition-all">
          <MessageCircle size={20} />
          <span className="text-xs font-black">تعليق</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse py-3 rounded-xl text-gray-400 hover:bg-white/5 transition-all">
          <Share2 size={20} />
          <span className="text-xs font-black">مشاركة</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
