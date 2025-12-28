
import { ContentItem, User, Gift } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'admin_khalid',
    username: 'khalid_almontaser',
    displayName: 'خالد المنتصر',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KhalidGold',
    cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
    bio: 'المدير التنفيذي والمؤسس لمنصة FLIXO. القوة في الابتكار. 👑',
    followers: 10000000,
    following: 0,
    likes: 50000000,
    isVerified: true,
    isPlatformChannel: true,
    celebrityTier: 0, // ذهبي - السيادة
    referralCode: 'BOSS-KHALID'
  },
  {
    id: 'official_flixo',
    username: 'flixo_official',
    displayName: 'FLIXO',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=flixo_logo',
    followers: 50000000,
    following: 1,
    likes: 100000000,
    isVerified: true,
    isPlatformChannel: true,
    celebrityTier: 0, // ذهبي - المنصة
    bio: 'المنصة الرسمية لـ FLIXO - عالم من الترفيه المتصل.'
  },
  {
    id: 'support_team',
    username: 'support',
    displayName: 'فريق الدعم',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=support_flixo',
    followers: 2000000,
    following: 0,
    likes: 5000000,
    isVerified: true,
    celebrityTier: 0, // ذهبي - دعم فني
    bio: 'مركز الاستجابة السريعة لمستخدمي فليكسو.'
  }
];

export const MOCK_GIFTS: Gift[] = [
  { id: 'g1', name: 'Rose', icon: '🌹', price: 1, type: 'static' },
  { id: 'g2', name: 'Crown', icon: '👑', price: 100, type: '3d' },
  { id: 'g3', name: 'Rocket', icon: '🚀', price: 500, type: 'animated' },
];

export const MOCK_FEED: ContentItem[] = [
  {
    id: 'khalid_intro',
    type: 'video',
    author: MOCK_USERS[0],
    content: 'مستقبل التواصل الاجتماعي يبدأ من هنا. أهلاً بكم في FLIXO. #خالد_المنتصر #فليكسو',
    mediaUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80',
    likes: 1500000,
    comments: 25000,
    shares: 100000,
    saves: 200000,
    timestamp: 'الآن',
    isFeaturedByPlatform: true,
    tags: ['خالد_المنتصر', 'فليكسو', 'الريادة']
  }
];
