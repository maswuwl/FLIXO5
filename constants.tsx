
import { ContentItem, User, Gift, Group } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'admin_khalid',
    username: 'khalid_almontaser',
    displayName: 'خالد المنتصر',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KhalidAdmin',
    cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200',
    bio: 'المدير السيادي والمطور الأول. نبني مستقبل اليمن الرقمي بشموخ. 🇾🇪👑',
    followers: 12500000,
    following: 0,
    likes: 58000000,
    isVerified: true,
    isPlatformChannel: true,
    celebrityTier: 0,
    referralCode: 'KHALID-KING'
  },
  {
    id: 'flixo_official',
    username: 'flixo_official',
    displayName: 'فليكسو اليمن',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=flixo_yemen_v6',
    followers: 50000000,
    following: 1,
    likes: 120000000,
    isVerified: true,
    isPlatformChannel: true,
    celebrityTier: 0,
    bio: 'المنصة الرسمية والوحيدة لـ FLIXO. القوة والسيادة من تعز إلى كل العالم.'
  },
  {
    id: 'sara_yemen',
    username: 'sara_creative',
    displayName: 'سارة اليمنية',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SaraYemen',
    followers: 850000,
    following: 120,
    likes: 4200000,
    isVerified: true,
    celebrityTier: 2,
    bio: 'مبدعة محتوى في عالم فليكسو. أعشق الفن والذكاء الاصطناعي.'
  }
];

export const MOCK_FEED: ContentItem[] = [
  {
    id: 'chess_live_1',
    type: 'chess_game',
    author: MOCK_USERS[0],
    content: 'أنا الآن في مواجهة كبرى ضد نظام فليكسو AI في ساحة الشطرنج الملكية. تفضلوا بالمشاهدة والدعم! ⚔️👑',
    mediaUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200',
    likes: 12500,
    comments: 890,
    shares: 450,
    saves: 1200,
    timestamp: 'الآن مباشر',
    isFeaturedByPlatform: true,
    gameData: {
      player1: 'خالد المنتصر',
      player2: 'نظام فليكسو AI',
      status: 'live'
    },
    tags: ['شطرنج_فليكسو', 'سيادة_عقلية']
  },
  {
    id: 'post_1',
    type: 'video',
    author: MOCK_USERS[0],
    content: 'نحن لا نبني مجرد تطبيق، نحن نبني إمبراطورية رقمية تعزز السيادة الوطنية. فليكسو هو المستقبل! 🇾🇪🚀',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    likes: 2400000,
    comments: 45000,
    shares: 120000,
    saves: 300000,
    timestamp: 'الآن',
    isFeaturedByPlatform: true,
    tags: ['خالد_المنتصر', 'اليمن', 'سيادة_فليكسو']
  },
  {
    id: 'post_2',
    type: 'image',
    author: MOCK_USERS[2],
    content: 'أجواء خيالية اليوم بفضل فلاتر فليكسو الذكية! شكراً خالد المنتصر على هذا الإبداع. ✨',
    mediaUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    likes: 85000,
    comments: 1200,
    shares: 5400,
    saves: 12000,
    timestamp: 'منذ ساعة',
    tags: ['إبداع', 'فليكسو_ماركت']
  }
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'صناع المحتوى السيادي',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200',
    description: 'تجمع نخبة المبدعين في منصة فليكسو لتطوير الأفكار والتعاون البرمجي.',
    membersCount: 15400,
    isVerified: true,
    verificationType: 'royal',
    ownerId: 'admin_khalid'
  },
  {
    id: 'g2',
    name: 'نادي الشطرنج العالمي',
    cover: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=1200',
    description: 'لمحبي التحديات العقلية والمواجهات المباشرة في ساحة فليكسو.',
    membersCount: 8900,
    isVerified: true,
    verificationType: 'community',
    ownerId: 'sara_yemen'
  }
];

export const MOCK_GIFTS: Gift[] = [
  { id: 'g1', name: 'الجنبية الملكية', icon: '⚔️', price: 2000, type: '3d' },
  { id: 'g2', name: 'التاج السيادي', icon: '👑', price: 1000, type: 'animated' },
  { id: 'g3', name: 'البن اليماني', icon: '☕', price: 50, type: 'static' },
  { id: 'g4', name: 'البخور التعزي', icon: '🔥', price: 500, type: 'static' }
];
