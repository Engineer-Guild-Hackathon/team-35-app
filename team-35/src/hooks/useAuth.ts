import { useState, useEffect } from 'react';
import { User } from '../types';

// Mock Firebase auth for demo purposes
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate Firebase auth check
    try { const savedUser = localStorage.getItem('mimicoach_user'); if (savedUser) { try { setUser(JSON.parse(savedUser)); } catch { localStorage.removeItem('mimicoach_user'); setUser(null); } } } finally { }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, use Firebase Auth
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      setUser(mockUser);
      localStorage.setItem('mimicoach_user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (email: string, password: string, name: string) => {
    // Mock registration
    if (email && password && name) {
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
      };
      setUser(mockUser);
      localStorage.setItem('mimicoach_user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid data' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mimicoach_user');
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};
