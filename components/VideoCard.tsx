
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Gift as GiftIcon, Music, Star, Download, Globe } from 'lucide-react';
import { ContentItem } from '../types';
import Watermark from './Watermark';
import GiftsOverlay from './GiftsOverlay';
import CelebrityBadge from './CelebrityBadge';
import ProfileGuard from './ProfileGuard';
import SovereignPanorama from './SovereignPanorama';
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
        {item.type === 'video' ? (
          <img src={item.mediaUrl} alt="content" className="w-full h-full object-cover opacity-80" />
        ) : (
          <SovereignPanorama imageUrl={item.mediaUrl} compact={false} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none"></div>
      </div>

      {/* Interaction Column - Nano Icons */}
      <div className="absolute left-2.5 bottom-24 flex flex-col space-y-4 items-center z-[110]">
        <div className="relative mb-1 cursor-pointer active-tap" onClick={() => navigate('/profile')}>
           <ProfileGuard isActive={isSovereign} size="sm" isSovereign={isSovereign}>
              <div className={`w-8 h-8 rounded-full p-0.5 ${isSovereign ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30' : 'flixo-gradient'}`}>
                <img src={item.author.avatar} className="w-full h-full rounded-full border border-black object-cover" alt="avatar" />
              </div>
           </ProfileGuard>
           <button onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); }} className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-black flex items-center justify-center ${isFollowing ? 'bg-green-500' : 'bg-pink-500'} shadow-lg`}>
              <span className="text-white font-bold text-[8px]">{isFollowing ? '✓' : '+'}</span>
           </button>
        </div>

        <button onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }} className="flex flex-col items-center group active-tap">
          <div className={`p-2 rounded-full transition-all ${isLiked ? 'text-pink-500 bg-pink-500/10' : 'text-white bg-white/10 backdrop-blur-md border border-white/20'}`}>
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </div>
          <span className="text-[8px] font-black mt-1 text-white drop-shadow-md">{(item.likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
        </button>

        <button className="flex flex-col items-center group active-tap">
          <div className="p-2 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20">
            <MessageCircle size={16} />
          </div>
          <span className="text-[8px] font-black mt-1 text-white drop-shadow-md">{item.comments.toLocaleString()}</span>
        </button>

        <button onClick={(e) => { e.stopPropagation(); setShowGifts(true); }} className="flex flex-col items-center group active-tap">
          <div className="p-2 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-yellow-500 group-hover:text-black transition-all">
            <GiftIcon size={16} />
          </div>
          <span className="text-[8px] font-black mt-1 text-white drop-shadow-md">هدية</span>
        </button>

        <button className="flex flex-col items-center group active-tap">
          <div className="p-2 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20">
            <Download size={16} />
          </div>
          <span className="text-[8px] font-black mt-1 text-white drop-shadow-md">حفظ</span>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 pt-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-50 pointer-events-none">
        <div className="max-w-[80%] space-y-2">
          <div className="flex items-center space-x-1.5 space-x-reverse cursor-pointer pointer-events-auto" onClick={() => navigate('/profile')}>
            <span className="font-black text-sm text-white drop-shadow-md">{item.author.displayName}</span>
            <CelebrityBadge tier={item.author.celebrityTier as any} size={10} />
          </div>
          <p className="text-[11px] text-gray-100 font-bold leading-relaxed line-clamp-3 text-right drop-shadow-sm">{item.content}</p>
          <div className="flex items-center space-x-2 space-x-reverse text-indigo-400 bg-black/40 w-fit px-3 py-1 rounded-full border border-white/10">
            <Music size={10} className="animate-spin-slow" />
            <span className="text-[8px] font-black uppercase tracking-widest">Sovereign Audio Sync</span>
          </div>
        </div>
      </div>

      {showGifts && <GiftsOverlay onClose={() => setShowGifts(false)} onSend={() => setShowGifts(false)} />}
      <Watermark type="video" />
    </div>
  );
};

export default VideoCard;
