
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Brain, Gift as GiftIcon, Music, UserPlus, Star } from 'lucide-react';
import { ContentItem, Gift as GiftType, CelebrityColorTier } from '../types';
import Watermark from './Watermark';
import GiftsOverlay from './GiftsOverlay';
import CelebrityBadge from './CelebrityBadge';
import ProfileGuard from './ProfileGuard';

interface VideoCardProps {
  item: ContentItem;
  onInteraction?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ item, onInteraction }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [showSuperStar, setShowSuperStar] = useState(false);
  
  const handleDoubleClick = () => {
    setIsLiked(true);
    setShowSuperStar(true);
    setTimeout(() => setShowSuperStar(false), 1000);
    if (onInteraction) onInteraction();
  };

  const isSovereign = item.author.celebrityTier === 0;

  return (
    <div 
      className={`relative w-full h-screen bg-black overflow-hidden video-snap-item ${item.isFeaturedByPlatform ? 'border-r-[6px] border-yellow-500/50' : ''}`} 
      dir="rtl"
      onDoubleClick={handleDoubleClick}
    >
      <div className="absolute inset-0">
        <img src={item.mediaUrl} alt="content" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
      </div>

      {/* أنيمشن النجمة الذهبية عند الضغط المزدوج */}
      {showSuperStar && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="animate-ping">
            <Star size={120} className="text-yellow-500 fill-yellow-500 shadow-[0_0_50px_rgba(245,158,11,0.8)]" />
          </div>
        </div>
      )}

      <div className="absolute left-4 bottom-40 flex flex-col space-y-6 items-center z-40">
        <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center group">
          <div className={`p-4 rounded-full transition-all duration-300 group-active:scale-150 ${isLiked ? 'text-pink-500 bg-pink-500/20 shadow-lg' : 'text-white glass-morphism'}`}>
            <Heart size={28} fill={isLiked ? 'currentColor' : 'none'} />
          </div>
          <span className="text-[10px] font-black mt-1.5 drop-shadow-lg">{item.likes + (isLiked ? 1 : 0)}</span>
        </button>
        <button onClick={() => setShowGifts(true)} className="flex flex-col items-center group">
          <div className="p-4 rounded-full text-white glass-morphism group-hover:bg-yellow-500/20 transition-all">
            <GiftIcon size={28} className="group-hover:text-yellow-500" />
          </div>
          <span className="text-[10px] font-black mt-1.5 drop-shadow-lg">هدية</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="p-4 rounded-full text-white glass-morphism">
            <MessageCircle size={28} />
          </div>
          <span className="text-[10px] font-black mt-1.5 drop-shadow-lg">{item.comments}</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="p-4 rounded-full text-white glass-morphism">
            <Share2 size={28} />
          </div>
          <span className="text-[10px] font-black mt-1.5 drop-shadow-lg">نشر</span>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 pb-24 z-20 pointer-events-none">
        <div className="flex flex-col space-y-4 max-w-[85%] pointer-events-auto">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="relative group">
              <ProfileGuard isActive={isSovereign} size="sm" isSovereign={isSovereign}>
                <div className={`w-14 h-14 rounded-full p-0.5 ${isSovereign ? 'bg-yellow-500/20' : 'flixo-gradient'}`}>
                  <img src={item.author.avatar} className="w-full h-full rounded-full border-2 border-black object-cover" alt="avatar" />
                </div>
              </ProfileGuard>
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`absolute -bottom-1 -left-1 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center transition-all ${isFollowing ? 'bg-green-500' : 'bg-pink-500'}`}
              >
                {isFollowing ? <span className="text-[10px] text-white font-bold">✓</span> : <UserPlus size={12} className="text-white" />}
              </button>
            </div>
            <div className="flex flex-col text-right">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="font-black text-xl drop-shadow-lg">
                  {item.author.displayName}
                </span>
                <CelebrityBadge tier={item.author.celebrityTier as any} size={16} />
              </div>
              <span className="text-[10px] font-bold text-white/60">@{item.author.username}</span>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-3xl border border-white/5 text-right">
            <p className="text-sm font-bold text-white leading-relaxed">{item.content}</p>
          </div>
        </div>
      </div>

      {showGifts && <GiftsOverlay onClose={() => setShowGifts(false)} onSend={(gift) => { alert(`تم إرسال ${gift.name}!`); setShowGifts(false); }} />}
      <Watermark type="video" username={item.author.username} />
    </div>
  );
};

export default VideoCard;
