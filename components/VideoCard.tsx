
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Brain, Gift as GiftIcon, Music, UserPlus, Star, Download, Globe, Lock, ShieldCheck } from 'lucide-react';
import { ContentItem, Gift as GiftType, CelebrityColorTier } from '../types';
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

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.mediaUrl) return;
    const link = document.createElement('a');
    link.href = item.mediaUrl;
    link.download = `FLIXO_VIDEO_${item.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/profile');
  };

  const isSovereign = item.author.celebrityTier === 0;

  return (
    <div 
      className={`relative w-full h-full bg-black overflow-hidden video-snap-item ${item.isFeaturedByPlatform ? 'border-r-[6px] border-yellow-500/50' : ''}`} 
      dir="rtl"
      onDoubleClick={handleDoubleClick}
    >
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <img src={item.mediaUrl} alt="content" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
      </div>

      {/* Double Tap Animation */}
      {showSuperStar && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="animate-ping">
            <Star size={120} className="text-yellow-500 fill-yellow-500 shadow-[0_0_50px_rgba(245,158,11,0.8)]" />
          </div>
        </div>
      )}

      {/* Interaction Column */}
      <div className="absolute left-4 bottom-28 flex flex-col space-y-6 items-center z-[110]">
        <div className="relative mb-4 cursor-pointer" onClick={goToProfile}>
           <ProfileGuard isActive={isSovereign} size="md" isSovereign={isSovereign}>
              <div className={`w-14 h-14 rounded-full p-0.5 ${isSovereign ? 'bg-yellow-500' : 'flixo-gradient'}`}>
                <img src={item.author.avatar} className="w-full h-full rounded-full border-2 border-black object-cover" alt="avatar" />
              </div>
           </ProfileGuard>
           <button 
              onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); }}
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center transition-all ${isFollowing ? 'bg-green-500' : 'bg-pink-500'}`}
            >
              {isFollowing ? <span className="text-[10px] text-white font-bold">✓</span> : <span className="text-white font-bold">+</span>}
           </button>
        </div>

        <button onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }} className="flex flex-col items-center">
          <div className={`p-4 rounded-full transition-all ${isLiked ? 'text-pink-500 bg-pink-500/10' : 'text-white bg-white/5 backdrop-blur-md border border-white/10'}`}>
            <Heart size={28} fill={isLiked ? 'currentColor' : 'none'} />
          </div>
          <span className="text-[10px] font-black mt-1 text-white drop-shadow-lg">{(item.likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
        </button>

        <button onClick={handleDownload} className="flex flex-col items-center">
          <div className="p-4 rounded-full text-white bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
            <Download size={28} />
          </div>
          <span className="text-[10px] font-black mt-1 text-white drop-shadow-lg">حفظ</span>
        </button>

        <button className="flex flex-col items-center">
          <div className="p-4 rounded-full text-white bg-white/5 backdrop-blur-md border border-white/10">
            <MessageCircle size={28} />
          </div>
          <span className="text-[10px] font-black mt-1 text-white drop-shadow-lg">{item.comments}</span>
        </button>

        <button onClick={(e) => { e.stopPropagation(); setShowGifts(true); }} className="flex flex-col items-center group">
          <div className="p-4 rounded-full text-white bg-white/5 backdrop-blur-md border border-white/10 group-active:bg-yellow-500 group-active:text-black">
            <GiftIcon size={28} />
          </div>
          <span className="text-[10px] font-black mt-1 text-white drop-shadow-lg">هدية</span>
        </button>

        <button className="flex flex-col items-center">
          <div className="p-4 rounded-full text-white bg-white/5 backdrop-blur-md border border-white/10">
            <Share2 size={28} />
          </div>
          <span className="text-[10px] font-black mt-1 text-white drop-shadow-lg">نشر</span>
        </button>
      </div>

      {/* Caption & Info Area */}
      <div className="absolute inset-x-0 bottom-0 p-6 pt-20 bg-gradient-to-t from-black/90 to-transparent z-50">
        <div className="max-w-[80%] space-y-3">
          <div className="flex items-center space-x-2 space-x-reverse cursor-pointer" onClick={goToProfile}>
            <span className="font-black text-xl text-white">{item.author.displayName}</span>
            <CelebrityBadge tier={item.author.celebrityTier as any} size={16} />
            <Globe size={12} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-200 font-bold leading-relaxed line-clamp-3 text-right">{item.content}</p>
          <div className="flex items-center space-x-2 space-x-reverse text-indigo-400">
            <Music size={14} className="animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sovereign Soundtrack • FLIXO</span>
          </div>
        </div>
      </div>

      {showGifts && (
        <GiftsOverlay 
          onClose={() => setShowGifts(false)} 
          onSend={(gift) => { 
            alert(`تم إرسال ${gift.name}!`); 
            setShowGifts(false); 
          }} 
        />
      )}
      <Watermark type="video" username={item.author.username} />
    </div>
  );
};

export default VideoCard;
