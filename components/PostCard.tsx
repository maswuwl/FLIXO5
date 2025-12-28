
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { ContentItem } from '../types';
import Watermark from './Watermark';

interface PostCardProps {
  item: ContentItem;
}

const PostCard: React.FC<PostCardProps> = ({ item }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white/5 border-y border-white/10 mb-2 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img src={item.author.avatar} className="w-10 h-10 rounded-full border border-white/10" alt="avatar" />
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-bold">{item.author.displayName}</span>
              {item.author.isVerified && <span className="text-blue-500">●</span>}
            </div>
            <span className="text-xs text-gray-500">@{item.author.username} • {item.timestamp}</span>
          </div>
        </div>
        <button className="text-gray-500">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-200 text-sm whitespace-pre-wrap">{item.content}</p>
      </div>

      {item.mediaUrl && (
        <div className="relative rounded-2xl overflow-hidden mb-4 border border-white/10 bg-black">
          <img src={item.mediaUrl} className="w-full h-auto object-cover max-h-96" alt="post content" />
          <Watermark type="image" username={item.author.username} />
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-2 text-sm ${isLiked ? 'text-pink-500' : 'text-gray-400'}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{item.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-gray-400">
            <MessageCircle size={20} />
            <span>{item.comments}</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-gray-400">
            <Share2 size={20} />
            <span>{item.shares}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
