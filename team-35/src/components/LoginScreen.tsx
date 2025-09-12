import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Music, MapPin, Headphones } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
}

export const LoginScreen = ({ onLogin, onRegister }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    console.log('LoginScreen: handleLogin called with', { email, password: password ? '[HIDDEN]' : 'empty' });
    setLoading(true);
    setError('');
    
    try {
      const result = await onLogin(email, password);
      console.log('LoginScreen: onLogin result', result);
      if (!result.success) {
        setError(result.error || 'ログインに失敗しました');
      }
    } catch (error) {
      console.error('LoginScreen: handleLogin error', error);
      setError('ログイン処理でエラーが発生しました');
    }
    
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    const result = await onRegister(email, password, name);
    if (!result.success) {
      setError(result.error || '登録に失敗しました');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* App Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Music className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ミミコーチ</h1>
          <p className="text-muted-foreground">音楽で覚える英単語学習アプリ</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="bg-card rounded-lg p-3 shadow-sm mb-2">
              <Music className="h-6 w-6 text-primary mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground">音楽学習</p>
          </div>
          <div className="text-center">
            <div className="bg-card rounded-lg p-3 shadow-sm mb-2">
              <MapPin className="h-6 w-6 text-blue-600 mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground">GPS連携</p>
          </div>
          <div className="text-center">
            <div className="bg-card rounded-lg p-3 shadow-sm mb-2">
              <Headphones className="h-6 w-6 text-green-600 mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground">自動再生</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ミミコーチへようこそ</CardTitle>
            <CardDescription>アカウントを作成するか、既存のアカウントでログインしてください</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">ログイン</TabsTrigger>
                <TabsTrigger value="register">新規登録</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="パスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button 
                  onClick={handleLogin} 
                  disabled={loading || !email || !password} 
                  className="w-full"
                >
                  {loading ? '処理中...' : 'ログイン'}
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">お名前</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="田中太郎"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">メールアドレス</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">パスワード</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="パスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button 
                  onClick={handleRegister} 
                  disabled={loading || !email || !password || !name} 
                  className="w-full"
                >
                  {loading ? '処理中...' : 'アカウント作成'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  パスワードは6文字以上で入力してください
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
