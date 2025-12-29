
// Add missing types for the FLIXO ecosystem
export type CelebrityColorTier = 0 | 1 | 2 | 3 | 4 | 5;

export interface ExternalAsset {
  id: string;
  type: 'website' | 'blog' | 'store' | 'youtube' | 'adsense';
  url: string;
  label: string;
  isVerified: boolean;
  publishingPermitted: boolean;
  incomeTrackingEnabled: boolean;
}

export interface UserSocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  linkedAssets: ExternalAsset[];
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

// Fixed missing Gift interface
export interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
  type: '3d' | 'animated' | 'static';
}

// Fixed missing Memo interface
export interface Memo {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  aiAnalysis?: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
}

// Fixed missing Project interface
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'in-progress' | 'completed' | 'on-hold';
  aiFeedback?: string;
  createdAt: string;
  buildRatio: number;
  errorRate: number;
  timeline: {
    stage: string;
    date: string;
    completed: boolean;
  }[];
}

// Fixed missing PlatformStats interface
export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  growth: number;
}

// Fixed missing SystemLog interface
export interface SystemLog {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}
