
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Sparkles, Download, Bookmark, Zap, Share, Trophy, Users } from 'lucide-react';
import { ContentItem } from '../types';
import Watermark from './Watermark';
import CelebrityBadge from './CelebrityBadge';
import SovereignPanorama from './SovereignPanorama';
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

  const isChessGame = item.type === 'chess_game';

  return (
    <div className={`glass-order4 rounded-[2rem] mb-6 overflow-hidden border transition-all duration-700 shadow-2xl ${isChessGame ? 'border-yellow-500/30 ring-1 ring-yellow-500/20' : 'border-pink-500/10'}`} dir="rtl">
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

      {/* Body */}
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

      {/* Media Overlay for Chess Games */}
      {isChessGame ? (
        <div onClick={() => navigate('/chess')} className="relative group/media mx-3 mb-3 rounded-[1.5rem] overflow-hidden shadow-inner cursor-pointer">
           <div className="aspect-video bg-gradient-to-br from-yellow-900/60 to-black flex items-center justify-center p-8 relative">
              <img src={item.mediaUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="bg" />
              <div className="relative z-10 flex flex-col items-center space-y-4">
                 <div className="flex items-center space-x-4 space-x-reverse">
                    <img src={item.author.avatar} className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-lg" />
                    <span className="text-xl font-black italic text-yellow-500">VS</span>
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-indigo-400 shadow-lg">
                       <Zap size={24} className="text-white animate-pulse" />
                    </div>
                 </div>
                 <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-2xl border border-yellow-500/30">
                    <span className="text-xs font-black text-white flex items-center">
                       <Trophy size={14} className="ml-2 text-yellow-500" />
                       مباراة سيادية مباشرة
                    </span>
                 </div>
                 <button className="bg-yellow-500 text-black px-8 py-3 rounded-full font-black text-xs shadow-xl animate-bounce">دخول الساحة الآن</button>
              </div>
              <div className="absolute top-4 left-4 flex items-center space-x-2 space-x-reverse bg-red-600 px-3 py-1 rounded-full">
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                 <span className="text-[8px] font-black text-white uppercase">LIVE</span>
              </div>
           </div>
        </div>
      ) : item.mediaUrl && (
        <div className="relative group/media mx-3 mb-3 rounded-[1.5rem] overflow-hidden shadow-inner">
          <div 
            className="relative w-full aspect-video overflow-hidden bg-black cursor-pointer"
            onClick={item.type === 'video' ? onVideoClick : undefined}
          >
            {item.type === 'video' ? (
              <img src={item.mediaUrl} className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-[3s]" alt="post" />
            ) : (
              <SovereignPanorama imageUrl={item.mediaUrl} compact={true} />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
            
            {/* Quick Actions Overlay */}
            <div className="absolute top-2 left-2 flex flex-col space-y-2 translate-x-[-30px] opacity-0 group-hover/media:translate-x-0 group-hover/media:opacity-100 transition-all duration-500 z-30">
               <button onClick={handleDownload} className="w-7 h-7 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-pink-500 transition-colors">
                  <Download size={12} />
               </button>
               <button className="w-7 h-7 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-colors">
                  <Zap size={12} />
               </button>
            </div>

            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-10 h-10 bg-pink-500/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 text-white shadow-xl scale-90 group-hover/media:scale-110 transition-transform">
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                </div>
              </div>
            )}
            <Watermark type={item.type as any} />
          </div>
        </div>
      )}

      {/* Actions Bar */}
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
