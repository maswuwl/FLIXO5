
import { User } from '../types';
import { MOCK_USERS } from '../constants';

const AUTH_KEY = 'flixo_auth_user';
const USERS_DB_KEY = 'flixo_users_registry';

const sovereignHash = (password: string) => {
  return btoa(`FX_SECURE_${password}_KHALID_ALMONTASER_SOVEREIGN`).split('').reverse().join('');
};

export const authService = {
  login: (username: string, password?: string): User | null => {
    try {
      const isAdmin = username === 'khalid_almontaser' || username === 'خالد المنتصر';
      const isFamily = username.includes('المنتصر') || username.toLowerCase().includes('almontaser');
      
      if (isAdmin) {
        const adminUser = MOCK_USERS[0];
        localStorage.setItem(AUTH_KEY, JSON.stringify(adminUser));
        return adminUser;
      }

      const registry = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      let user = registry.find((u: any) => u.username === username);
      
      if (user && password && user._pass === sovereignHash(password)) {
        if (isFamily) {
          user.isVerified = true;
          user.celebrityTier = 0;
          if (!user.displayName.includes('👑')) {
            user.displayName = `${user.displayName} 👑`;
          }
        }
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        return user;
      }

      const mockUser = MOCK_USERS.find(u => u.username === username);
      if (mockUser) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
        return mockUser;
      }
      
      return null;
    } catch (e) {
      return null;
    }
  },

  register: (data: any): User => {
    const isFamily = 
      (data.username && (data.username.includes('المنتصر') || data.username.toLowerCase().includes('almontaser'))) || 
      (data.displayName && (data.displayName.includes('المنتصر') || data.displayName.toLowerCase().includes('almontaser')));
    
    const newUser: User = {
      id: `u_${Date.now()}`,
      username: data.username,
      displayName: isFamily ? `${data.displayName || data.username} 👑` : (data.displayName || data.username),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      followers: isFamily ? 150000 : 0,
      following: 0,
      likes: isFamily ? 500000 : 0,
      isVerified: isFamily,
      celebrityTier: isFamily ? 0 : 5,
      autoPostEnabled: { facebook: true, twitter: true, instagram: true },
      socialLinks: { linkedAssets: [] }, // تهيئة الأصول الرقمية
      bio: isFamily ? 'عضو في الأسرة السيادية المؤسسة لمنصة فليكسو.' : 'عضو في مجتمع فليكسو العالمي.',
      location: 'اليمن',
      birthDate: '2000-01-01'
    };
    
    const registry = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    registry.push({ ...newUser, _pass: sovereignHash(data.password) });
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(registry));
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return newUser;
  },

  googleLogin: (): User => {
    const googleUser: User = {
      id: 'google_khalid_admin',
      username: 'khalid_almontaser',
      displayName: 'خالد المنتصر 👑',
      avatar: MOCK_USERS[0].avatar,
      followers: 10000000,
      following: 0,
      likes: 50000000,
      isVerified: true,
      celebrityTier: 0,
      autoPostEnabled: { facebook: true, twitter: true, instagram: true },
      socialLinks: { linkedAssets: [] }
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(googleUser));
    return googleUser;
  },

  updateUser: (updatedUser: User) => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      const registry = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      const index = registry.findIndex((u: User) => u.id === updatedUser.id);
      if (index !== -1) {
        const oldPass = registry[index]._pass;
        registry[index] = { ...updatedUser, _pass: oldPass };
      }
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(registry));
      window.dispatchEvent(new Event('userUpdate'));
    } catch (e) {}
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
  },

  getCurrentUser: (): User | null => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated: (): boolean => localStorage.getItem(AUTH_KEY) !== null
};
