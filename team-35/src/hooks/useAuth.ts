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
    console.log('useAuth: Starting authentication state monitoring');
    
    // 2秒のタイムアウトを設定してローディングを強制終了
    const timeout = setTimeout(() => {
      console.warn('Firebase authentication timeout - proceeding without user');
      setLoading(false);
    }, 2000);

    try {
      // Firebase認証状態の監視を開始
      const unsubscribe = subscribeToAuthState((user) => {
        console.log('useAuth: Auth state changed, user:', user ? 'logged in' : 'not logged in');
        clearTimeout(timeout);
        setUser(user);
        setLoading(false);
      });

      // 認証状態が変更されたらタイムアウトをクリア
      return () => {
        console.log('useAuth: Cleaning up auth subscription');
        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (error) {
      console.error('useAuth: Error setting up auth subscription:', error);
      clearTimeout(timeout);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('useAuth: login called with', { email, password: password ? '[HIDDEN]' : 'empty' });
    
    if (!email || !password) {
      console.log('useAuth: login validation failed - missing email or password');
      return { success: false, error: 'メールアドレスとパスワードを入力してください。' };
    }
    
    try {
      console.log('useAuth: calling loginUser...');
      const result = await loginUser(email, password);
      console.log('useAuth: loginUser result', result);
      return result;
    } catch (error) {
      console.error('useAuth: login error', error);
      return { success: false, error: 'ログイン処理でエラーが発生しました。' };
    }
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
