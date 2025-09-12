import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

// Firebase認証エラーを日本語メッセージに変換
export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'このメールアドレスは登録されていません。';
    case 'auth/wrong-password':
      return 'パスワードが間違っています。';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています。';
    case 'auth/weak-password':
      return 'パスワードは6文字以上で入力してください。';
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません。';
    case 'auth/too-many-requests':
      return '試行回数が多すぎます。しばらく時間をおいてから再度お試しください。';
    case 'auth/network-request-failed':
      return 'ネットワークエラーが発生しました。接続を確認してください。';
    default:
      return '認証エラーが発生しました。しばらく時間をおいてから再度お試しください。';
  }
};

// FirebaseUserを内部のUser型に変換
const mapFirebaseUserToUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    // Firestoreからユーザー情報を取得
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: userData?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
      homeLocation: userData?.homeLocation,
    };
  } catch (error) {
    console.error('mapFirebaseUserToUser: Error fetching user data from Firestore:', error);
    // Firestoreからデータが取得できない場合はFirebase認証の基本情報を使用
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
      homeLocation: undefined,
    };
  }
};

// ユーザー新規登録
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    // Firebase Authenticationで認証アカウント作成
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // ユーザープロフィール更新
    await updateProfile(firebaseUser, { displayName: name });

    // Firestoreにユーザー情報を保存
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await mapFirebaseUserToUser(firebaseUser);
    return { success: true, user };
  } catch (error) {
    const authError = error as AuthError;
    return { 
      success: false, 
      error: getAuthErrorMessage(authError)
    };
  }
};

// ログイン
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = await mapFirebaseUserToUser(userCredential.user);
    return { success: true, user };
  } catch (error) {
    const authError = error as AuthError;
    return { 
      success: false, 
      error: getAuthErrorMessage(authError)
    };
  }
};

// ログアウト
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return { 
      success: false, 
      error: getAuthErrorMessage(authError)
    };
  }
};

// 認証状態の監視
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  console.log('authService: Setting up auth state subscription');
  
  return onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('authService: Auth state changed, firebaseUser:', firebaseUser ? 'exists' : 'null');
    
    if (firebaseUser) {
      try {
        const user = await mapFirebaseUserToUser(firebaseUser);
        console.log('authService: Successfully mapped user:', user.email);
        callback(user);
      } catch (error) {
        console.error('authService: Error mapping Firebase user:', error);
        callback(null);
      }
    } else {
      console.log('authService: No user logged in');
      callback(null);
    }
  }, (error) => {
    console.error('authService: Auth state change error:', error);
    callback(null);
  });
};