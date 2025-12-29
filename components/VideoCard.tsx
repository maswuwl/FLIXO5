
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
  const [showSuperStar, setShowSuperStar] = useState(false);
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(true);
    setShowSuperStar(true);
    setTimeout(() => setShowSuperStar(false), 1000);
    if (onInteraction) onInteraction();
  };

  const isSovereign = item.author.celebrityTier === 0;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden" dir="rtl" onDoubleClick={handleDoubleClick}>
      <div className="absolute inset-0 z-0">
        <img src={item.mediaUrl} alt="content" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
      </div>

      {showSuperStar && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="animate-ping"><Star size={120} className="text-yellow-500 fill-yellow-500" /></div>
        </div>
      )}

      {/* Interaction Column */}
      <div className="absolute left-4 bottom-28 flex flex-col space-y-6 items-center z-[110]">
        <div className="relative mb-4 cursor-pointer active-tap" onClick={() => navigate('/profile')}>
           <ProfileGuard isActive={isSovereign} size="md" isSovereign={isSovereign}>
              <div className={`w-14 h-14 rounded-full p-0.5 ${isSovereign ? 'bg-yellow-500' : 'flixo-gradient'}`}>
                <img src={item.author.avatar} className="w-full h-full rounded-full border-2 border-black object-cover" alt="avatar" />
              </div>
           </ProfileGuard>
           <button onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); }} className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center ${isFollowing ? 'bg-green-500' : 'bg-pink-500 animate-pulse'}`}>
              <span className="text-white font-bold text-xs">{isFollowing ? '✓' : '+'}</span>
           </button>
        </div>

        <button onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }} className="flex flex-col items-center group active-tap">
          <div className={`p-4 rounded-full transition-all ${isLiked ? 'text-pink-500 bg-pink-500/10' : 'text-white bg-white/5 border border-white/10'}`}>
            <Heart size={28} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'animate-insane' : 'group-hover:animate-pulse-vibe'} />
          </div>
          <span className="text-[10px] font-black mt-1 text-white shadow-xl">{(item.likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
        </button>

        <button className="flex flex-col items-center group active-tap">
          <div className="p-4 rounded-full text-white bg-white/5 border border-white/10">
            <Download size={28} className="animate-pulse-vibe" />
          </div>
          <span className="text-[10px] font-black mt-1 text-white shadow-xl">حفظ</span>
        </button>

        <button onClick={(e) => { e.stopPropagation(); setShowGifts(true); }} className="flex flex-col items-center group active-tap">
          <div className="p-4 rounded-full text-white bg-white/5 border border-white/10 group-hover:bg-yellow-500 group-hover:text-black transition-all">
            <GiftIcon size={28} className="animate-tango-dance" />
          </div>
          <span className="text-[10px] font-black mt-1 text-white shadow-xl">هدية</span>
        </button>

        <button className="flex flex-col items-center group active-tap">
          <div className="p-4 rounded-full text-white bg-white/5 border border-white/10">
            <Share2 size={28} />
          </div>
          <span className="text-[10px] font-black mt-1 text-white shadow-xl">نشر</span>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 pt-20 bg-gradient-to-t from-black/90 to-transparent z-50">
        <div className="max-w-[80%] space-y-3">
          <div className="flex items-center space-x-2 space-x-reverse cursor-pointer">
            <span className="font-black text-xl text-white">{item.author.displayName}</span>
            <CelebrityBadge tier={item.author.celebrityTier as any} size={16} />
          </div>
          <p className="text-sm text-gray-200 font-bold leading-relaxed line-clamp-3 text-right">{item.content}</p>
          <div className="flex items-center space-x-2 space-x-reverse text-indigo-400 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
            <Music size={14} className="animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sovereign Soundtrack • FLIXO</span>
          </div>
        </div>
      </div>

      {showGifts && <GiftsOverlay onClose={() => setShowGifts(false)} onSend={() => setShowGifts(false)} />}
      <Watermark type="video" username={item.author.username} />
    </div>
  );
};

export default VideoCard;
