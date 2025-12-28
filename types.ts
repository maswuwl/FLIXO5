
export interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  aiCommentary: string;
  timestamp: string;
  sourceUrl?: string;
}

export interface AuctionItem {
  id: string;
  name: string;
  currentBid: number;
  highestBidder: string;
  endTime: string;
  image: string;
}

export interface SocialLinks {
  youtube?: string;
  instagram?: string;
  telegram?: string;
  snapchat?: string;
  externalWebsite?: string;
}

export type CelebrityColorTier = 0 | 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  cover?: string;
  bio?: string;
  followers: number;
  following: number;
  likes: number;
  isVerified: boolean;
  isPlatformChannel?: boolean;
  socialLinks?: SocialLinks;
  referralCode?: string;
  earnedCoins?: number;
  celebrityTier?: CelebrityColorTier;
  lastShareDate?: string;
  subscriptionType?: 'monthly' | '3months' | '6months' | 'yearly' | '3years';
}

export interface ChessMatch {
  id: string;
  playerWhite: User;
  playerBlack: User | 'AI_SYSTEM';
  spectators: number;
  boardState: string;
  status: 'active' | 'finished';
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
  type: 'static' | 'animated' | '3d';
}

export interface ContentItem {
  id: string;
  type: 'video' | 'post' | 'live';
  author: User;
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  timestamp: string;
  tags?: string[];
  isLive?: boolean;
  isFeaturedByPlatform?: boolean;
}
