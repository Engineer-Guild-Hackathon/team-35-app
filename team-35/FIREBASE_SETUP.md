# Firebase Authentication セットアップガイド

## 前提条件
- Firebase プロジェクトが作成済みである
- Firebase CLI がインストール済みである（オプション）

## セットアップ手順

### 1. Firebase コンソールでの設定

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクトを選択（または新規作成）
3. **Authentication** → **Sign-in method** → **Email/Password** を有効化
4. **Project Settings** → **General** → **Your apps** からWeb設定を取得

### 2. 環境変数の設定

1. `.env.example` をコピーして `.env` ファイルを作成：
```bash
cp .env.example .env
```

2. `.env` ファイルにFirebase設定値を記入：
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Firestore データベースの設定

1. Firebase Console → **Firestore Database** → **Create database**
2. **Start in test mode** を選択（開発用）
3. リージョンを選択（asia-northeast1 推奨）

### 4. セキュリティルールの設定（本番用）

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - 本人のみアクセス可
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Words collection - 本人のみアクセス可
    match /words/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Songs collection - 本人のみアクセス可  
    match /songs/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 実装済み機能

### ✅ 認証機能
- [x] メールアドレス・パスワードによる新規登録
- [x] ログイン
- [x] ログアウト
- [x] 認証状態の監視
- [x] エラーハンドリング（日本語メッセージ）
- [x] 入力バリデーション

### ✅ ユーザー管理
- [x] Firestore にユーザー情報を保存
- [x] プロフィール情報の管理
- [x] 認証状態のアプリ全体での共有

## 使用方法

### コンポーネントでの認証状態取得
```tsx
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, loading, login, register, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <LoginScreen onLogin={login} onRegister={register} />;
  
  return (
    <div>
      <p>ようこそ、{user.name}さん</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
};
```

## トラブルシューティング

### よくあるエラー

1. **Firebase configuration error**
   → `.env` ファイルの設定値を確認

2. **Auth domain not whitelisted**
   → Firebase Console → Authentication → Settings → Authorized domains に追加

3. **Firestore permission denied**
   → セキュリティルールを確認

## 開発用エミュレーター（オプション）

ローカル開発でFirebaseエミュレーターを使用する場合：

1. Firebase CLI をインストール：
```bash
npm install -g firebase-tools
```

2. エミュレーター設定：
```bash
firebase init emulators
```

3. `src/lib/firebase.ts` でエミュレーター設定のコメントアウトを解除

4. エミュレーター起動：
```bash
firebase emulators:start
```