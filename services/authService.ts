
import { User } from '../types';
import { MOCK_USERS } from '../constants';

const AUTH_KEY = 'flixo_auth_user';

export const authService = {
  login: (username: string): User | null => {
    try {
      const user = MOCK_USERS.find(u => u.username === username) || MOCK_USERS[0];
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    } catch (e) {
      console.error("Auth Login Error", e);
      return null;
    }
  },

  updateUser: (updatedUser: User) => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userUpdate'));
    } catch (e) {
      console.error("Update User Error", e);
    }
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
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (!saved || saved === "undefined") return null;
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Invalid user data in storage, clearing...");
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(AUTH_KEY) !== null;
  }
};
