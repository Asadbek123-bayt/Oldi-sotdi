import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithPhone: (phoneNumber: string, code: string) => Promise<boolean>;
  logout: () => void;
  switchPersona: (role: UserRole) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const DEMO_USER: UserProfile = {
  id: 'usr-101',
  full_name: 'Jasur Boboyev',
  phone_number: '+998 90 123 45 67',
  telegram_username: '@jasur_avto',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  is_verified: true,
  role: 'user',
  created_at: '2025-01-15T10:00:00Z',
};

const DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  full_name: 'Avtobozor Administrator',
  phone_number: '+998 71 200 00 00',
  telegram_username: '@avtobozor_admin',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  is_verified: true,
  role: 'admin',
  created_at: '2024-01-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('avtobozor_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USER;
      }
    }
    // Default logged in as demo user for best frictionless UX
    return DEMO_USER;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('avtobozor_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('avtobozor_user');
    }
  }, [user]);

  const loginWithPhone = async (phoneNumber: string, code: string): Promise<boolean> => {
    // Demo verification code is 7777 or any 4 digit code in demo mode
    if (code === '7777' || code.length === 4) {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        full_name: 'Foydalanuvchi',
        phone_number: phoneNumber,
        is_verified: true,
        role: 'user',
        created_at: new Date().toISOString(),
      };
      setUser(newUser);
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const switchPersona = (role: UserRole) => {
    if (role === 'admin') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEMO_USER);
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        loginWithPhone,
        logout,
        switchPersona,
        updateProfile,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
