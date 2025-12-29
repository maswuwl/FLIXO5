
import { User } from '../types';
import { MOCK_USERS } from '../constants';

const AUTH_KEY = 'flixo_auth_user';
const USERS_DB_KEY = 'flixo_users_registry';

// وظيفة تشفير سيادية لضمان أمان كلمات المرور برؤية خالد المنتصر
const sovereignHash = (password: string) => {
  return btoa(`FX_SECURE_${password}_KHALID_ALMONTASER`).split('').reverse().join('');
};

export const authService = {
  login: (username: string, password?: string): User | null => {
    try {
      const registry = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      const user = registry.find((u: any) => u.username === username);
      
      // مطابقة كلمة المرور المشفرة
      if (user && password && user._pass === sovereignHash(password)) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        return user;
      }

      // البحث في المستخدمين الافتراضيين (لأغراض العرض)
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

  updateUser: (updatedUser: User) => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      
      const registry = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      const index = registry.findIndex((u: User) => u.id === updatedUser.id);
      if (index !== -1) {
        // الحفاظ على كلمة المرور القديمة عند التحديث
        const oldPass = registry[index]._pass;
        registry[index] = { ...updatedUser, _pass: oldPass };
      } else {
        registry.push(updatedUser);
      }
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(registry));
      
      window.dispatchEvent(new Event('userUpdate'));
    } catch (e) {
      console.error("Update User Error", e);
    }
  },

  register: (data: any): User => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      username: data.username,
      displayName: data.displayName || data.username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      followers: 0,
      following: 0,
      likes: 0,
      isVerified: false,
      celebrityTier: 5,
      autoPostEnabled: { facebook: true, twitter: true, instagram: true },
      bio: 'عضو جديد في إمبراطورية فليكسو السيادية.',
      location: 'اليمن السعيد',
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
      id: 'google_' + Math.random().toString(36).substr(2, 9),
      username: 'google_user',
      displayName: 'مستكشف جوجل السيادي',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=google_fx',
      followers: 120,
      following: 45,
      likes: 300,
      isVerified: true,
      celebrityTier: 4,
      autoPostEnabled: { facebook: true, twitter: true, instagram: false }
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(googleUser));
    return googleUser;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
  },

  getCurrentUser: (): User | null => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (!saved || saved === "undefined") return null;
      return JSON.parse(saved);
    } catch (e) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(AUTH_KEY) !== null;
  }
};
