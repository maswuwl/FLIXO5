
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Gift as GiftIcon, Music, Star, Download, Globe } from 'lucide-react';
import { ContentItem } from '../types';
import Watermark from './Watermark';
import GiftsOverlay from './GiftsOverlay';
import CelebrityBadge from './CelebrityBadge';
import ProfileGuard from './ProfileGuard';
import { useNavigate } from 'react-router-dom';

interface VideoCardProps {
  item: ContentItem;
  onInteraction?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ item, onInteraction }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(true);
    if (onInteraction) onInteraction();
  };

  const isSovereign = item.author.celebrityTier === 0;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden" dir="rtl" onDoubleClick={handleDoubleClick}>
      <div className="absolute inset-0 z-0">
        <img src={item.mediaUrl} alt="content" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
      </div>

      {/* Interaction Column - Nano Icons (size 12-14) */}
      <div className="absolute left-2.5 bottom-20 flex flex-col space-y-3 items-center z-[110]">
        <div className="relative mb-1 cursor-pointer active-tap" onClick={() => navigate('/profile')}>
           <ProfileGuard isActive={isSovereign} size="sm" isSovereign={isSovereign}>
              <div className={`w-7 h-7 rounded-full p-0.5 ${isSovereign ? 'bg-yellow-500' : 'flixo-gradient'}`}>
                <img src={item.author.avatar} className="w-full h-full rounded-full border border-black object-cover" alt="avatar" />
              </div>
           </ProfileGuard>
           <button onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); }} className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center ${isFollowing ? 'bg-green-500' : 'bg-pink-500'}`}>
              <span className="text-white font-bold text-[7px]">{isFollowing ? '✓' : '+'}</span>
           </button>
        </div>

        <button onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }} className="flex flex-col items-center group active-tap">
          <div className={`p-1.5 rounded-full transition-all ${isLiked ? 'text-pink-500 bg-pink-500/10' : 'text-white bg-white/5 border border-white/10'}`}>
            <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
          </div>
          <span className="text-[7px] font-black mt-0.5 text-white">{(item.likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
        </button>

        <button className="flex flex-col items-center group active-tap">
          <div className="p-1.5 rounded-full text-white bg-white/5 border border-white/10">
            <MessageCircle size={14} />
          </div>
          <span className="text-[7px] font-black mt-0.5 text-white">{item.comments.toLocaleString()}</span>
        </button>

        <button onClick={(e) => { e.stopPropagation(); setShowGifts(true); }} className="flex flex-col items-center group active-tap">
          <div className="p-1.5 rounded-full text-white bg-white/5 border border-white/10 group-hover:bg-yellow-500 group-hover:text-black transition-all">
            <GiftIcon size={14} />
          </div>
          <span className="text-[7px] font-black mt-0.5 text-white">هدية</span>
        </button>

        <button className="flex flex-col items-center group active-tap">
          <div className="p-1.5 rounded-full text-white bg-white/5 border border-white/10">
            <Download size={14} />
          </div>
          <span className="text-[7px] font-black mt-0.5 text-white">حفظ</span>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black/80 to-transparent z-50">
        <div className="max-w-[85%] space-y-1">
          <div className="flex items-center space-x-1 space-x-reverse cursor-pointer">
            <span className="font-black text-xs text-white">{item.author.displayName}</span>
            <CelebrityBadge tier={item.author.celebrityTier as any} size={8} />
          </div>
          <p className="text-[9px] text-gray-100 font-bold leading-tight line-clamp-2 text-right">{item.content}</p>
          <div className="flex items-center space-x-1 space-x-reverse text-indigo-400 bg-black/30 w-fit px-1.5 py-0.5 rounded-full">
            <Music size={8} className="animate-spin" />
            <span className="text-[6px] font-black uppercase tracking-widest">Sovereign Audio</span>
          </div>
        </div>
      </div>

      {showGifts && <GiftsOverlay onClose={() => setShowGifts(false)} onSend={() => setShowGifts(false)} />}
      <Watermark type="video" />
    </div>
  );
};

export default VideoCard;
