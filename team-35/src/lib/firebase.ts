import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase設定 - 環境変数から取得 (Web版では直接設定)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAwhLXAidTodaVui4yLQ-AV0y00o8QWa3s",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "trans-grid-425812-r4.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "trans-grid-425812-r4", 
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "trans-grid-425812-r4.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "174793626998",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:174793626998:web:85704df45baa9fb85e9657"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// Authentication初期化
export const auth = getAuth(app);

// Firestore初期化
export const db = getFirestore(app);

// 開発環境用のエミュレーター設定（オプション）
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // 注意: エミュレーターを使用する場合のみコメントアウトを外してください
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, 'localhost', 8080);
}