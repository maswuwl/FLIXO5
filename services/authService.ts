
import { User } from '../types';
import { MOCK_USERS } from '../constants';

const AUTH_KEY = 'flixo_auth_user';

export const authService = {
  login: (username: string): User | null => {
    const user = MOCK_USERS.find(u => u.username === username) || MOCK_USERS[0];
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  updateUser: (updatedUser: User) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
    // إرسال حدث مخصص لتنبيه المكونات بتحديث البيانات
    window.dispatchEvent(new Event('userUpdate'));
  },

  loginAsGuest: (): User => {
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      username: 'guest',
      displayName: 'زائر فليكسو',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
      followers: 0,
      following: 0,
      likes: 0,
      isVerified: false,
      celebrityTier: 5,
      isGuest: true
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(guestUser));
    return guestUser;
  },

  register: (data: any): User => {
    const newUser: User = {
      ...MOCK_USERS[0],
      id: `u_${Date.now()}`,
      username: data.username,
      displayName: data.displayName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      celebrityTier: 5,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
  },

  getCurrentUser: (): User | null => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(AUTH_KEY) !== null;
  }
};
