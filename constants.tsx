
import { ContentItem, User, Gift } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'admin_khalid',
    username: 'khalid_almontaser',
    displayName: 'خالد المنتصر',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KhalidYemen',
    cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
    bio: 'المدير التنفيذي والمؤسس لمنصة FLIXO. القوة والسيادة من قلب اليمن. 👑🇾🇪',
    followers: 10000000,
    following: 0,
    likes: 50000000,
    isVerified: true,
    isPlatformChannel: true,
    celebrityTier: 0,
    referralCode: 'YEMEN-KHALID'
  },
  {
    id: 'official_flixo',
    username: 'flixo_official',
    displayName: 'FLIXO اليمن',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=flixo_yemen',
    followers: 50000000,
    following: 1,
    likes: 100000000,
    isVerified: true,
    isPlatformChannel: true,
    celebrityTier: 0,
    bio: 'المنصة الرسمية لـ FLIXO - صوت اليمن للعالم.'
  }
];

export const MOCK_GIFTS: Gift[] = [
  { id: 'g1', name: 'الجنبية اليمانية', icon: '⚔️', price: 1000, type: '3d' },
  { id: 'g2', name: 'تاج السيادة', icon: '👑', price: 500, type: 'animated' },
  { id: 'g3', name: 'البن اليماني', icon: '☕', price: 10, type: 'static' },
];

export const MOCK_FEED: ContentItem[] = [
  {
    id: 'khalid_intro',
    type: 'video',
    author: MOCK_USERS[0],
    content: 'أهلاً بكم في فليكسو.. مستقبل اليمن الرقمي بين أيديكم. #خالد_المنتصر #اليمن #فليكسو',
    mediaUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80',
    likes: 1500000,
    comments: 25000,
    shares: 100000,
    saves: 200000,
    timestamp: 'الآن',
    isFeaturedByPlatform: true,
    tags: ['خالد_المنتصر', 'اليمن', 'السيادة']
  }
];
