
// Add missing types for the FLIXO ecosystem
export type CelebrityColorTier = 0 | 1 | 2 | 3 | 4 | 5;

export interface UserSocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  cover?: string;
  bio?: string;
  location?: string;
  birthDate?: string;
  followers: number;
  following: number;
  likes: number;
  isVerified: boolean;
  isPlatformChannel?: boolean;
  celebrityTier: CelebrityColorTier;
  referralCode?: string;
  isGuest?: boolean;
  hasPremiumWatermark?: boolean;
  socialLinks?: UserSocialLinks;
  autoPostEnabled?: {
    facebook: boolean;
    twitter: boolean;
    instagram: boolean;
  };
}

export interface ContentItem {
  id: string;
  type: 'video' | 'image' | 'text';
  author: User;
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  timestamp: string;
  isFeaturedByPlatform?: boolean;
  tags?: string[];
}

export interface CommunityCircle {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  tierRequired: number;
  icon: string;
}

export interface Memo {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  category: 'technical' | 'strategic' | 'ui' | 'general';
  status: 'pending' | 'discussing' | 'implemented' | 'archived';
  aiAnalysis: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  expiresAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in-progress' | 'completed' | 'on-hold';
  aiFeedback: string;
  timeline: { stage: string; date: string; completed: boolean }[];
  createdAt: string;
  buildRatio: number;
  errorRate: number;
}

export interface PlatformStats {
  activeUsers: number;
  dailyEngagement: string;
  serverStatus: 'stable' | 'warning' | 'critical';
  pendingUpdates: number;
  isAutoModActive: boolean;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
  type: 'static' | '3d' | 'animated';
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
}
