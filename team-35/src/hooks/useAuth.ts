import { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  subscribeToAuthState 
} from '../lib/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase認証状態の監視を開始
    const unsubscribe = subscribeToAuthState((user) => {
      setUser(user);
      setLoading(false);
    });

    // クリーンアップ関数でsubscriptionを解除
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: 'メールアドレスとパスワードを入力してください。' };
    }
    
    const result = await loginUser(email, password);
    return result;
  };

  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      return { success: false, error: '全ての項目を入力してください。' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'パスワードは6文字以上で入力してください。' };
    }
    
    const result = await registerUser(email, password, name);
    return result;
  };

  const logout = async () => {
    const result = await logoutUser();
    if (!result.success && result.error) {
      console.error('Logout error:', result.error);
      // ログアウトエラーの場合でも、UIでは成功として扱う
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};
