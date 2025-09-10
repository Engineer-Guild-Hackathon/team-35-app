import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { User } from '../types';
import { useGeolocation } from '../../hooks/useGeolocation';
import { 
  MapPin, 
  Home, 
  Volume2, 
  Bell, 
  User as UserIcon, 
  Settings, 
  Shield,
  Download,
  Moon,
  Sun,
  Globe,
  Smartphone
} from 'lucide-react';

interface SettingsScreenProps {
  user: User;
  onLogout: () => void;
}

export const SettingsScreen = ({ user, onLogout }: SettingsScreenProps) => {
  const { latitude, longitude, error } = useGeolocation();
  const [settings, setSettings] = useState({
    // Audio Settings
    autoPlay: true,
    volume: [80],
    musicGenre: 'all',
    
    // Notification Settings
    geofenceNotifications: true,
    learningReminders: true,
    dailyGoalReminders: true,
    
    // Location Settings
    geofenceEnabled: true,
    homeRadius: [100], // meters
    
    // App Settings
    darkMode: false,
    language: 'ja',
    offlineMode: false,
    
    // Learning Settings
    dailyWordGoal: 5,
    difficultyLevel: 'intermediate',
    reviewInterval: 'daily',
  });

  const [homeAddress, setHomeAddress] = useState('');
  const [isSettingHome, setIsSettingHome] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const setCurrentLocationAsHome = async () => {
    if (latitude && longitude) {
      setIsSettingHome(true);
      // In real app, reverse geocoding would be done here
      setHomeAddress(`緯度: ${latitude.toFixed(4)}, 経度: ${longitude.toFixed(4)}`);
      setTimeout(() => {
        setIsSettingHome(false);
      }, 1000);
    }
  };

  const testGeofence = () => {
    // Test geofence functionality
    alert('ジオフェンス機能をテストしました。帰宅時に自動再生が開始されます。');
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">設定</h1>
        <p className="text-gray-600">アプリの動作をカスタマイズ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>プロフィール</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>名前</Label>
              <Input value={user.name} disabled />
            </div>
            <div>
              <Label>メールアドレス</Label>
              <Input value={user.email} disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>学習レベル</Label>
                <p className="text-sm text-gray-600">現在の難易度設定</p>
              </div>
              <Select 
                value={settings.difficultyLevel}
                onValueChange={(value) => handleSettingChange('difficultyLevel', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">初級</SelectItem>
                  <SelectItem value="intermediate">中級</SelectItem>
                  <SelectItem value="advanced">上級</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>1日の目標単語数</Label>
                <p className="text-sm text-gray-600">学習目標を設定</p>
              </div>
              <Input 
                type="number" 
                className="w-20"
                value={settings.dailyWordGoal}
                onChange={(e) => handleSettingChange('dailyWordGoal', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>位置・ジオフェンス設定</span>
            </CardTitle>
            <CardDescription>
              自宅位置の設定と自動再生機能
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>ジオフェンス機能</Label>
                <p className="text-sm text-gray-600">帰宅時の自動再生</p>
              </div>
              <Switch
                checked={settings.geofenceEnabled}
                onCheckedChange={(checked) => handleSettingChange('geofenceEnabled', checked)}
              />
            </div>

            {settings.geofenceEnabled && (
              <>
                <div>
                  <Label>自宅住所</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input 
                      placeholder="住所を入力またはGPSで設定"
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                    />
                    <Button 
                      onClick={setCurrentLocationAsHome}
                      disabled={!latitude || !longitude || isSettingHome}
                      variant="outline"
                    >
                      <Home className="h-4 w-4" />
                    </Button>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 mt-1">
                      位置情報の取得に失敗しました
                    </p>
                  )}
                </div>

                <div>
                  <Label>検出範囲: {settings.homeRadius[0]}m</Label>
                  <Slider
                    value={settings.homeRadius}
                    onValueChange={(value) => handleSettingChange('homeRadius', value)}
                    max={500}
                    min={50}
                    step={25}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50m</span>
                    <span>500m</span>
                  </div>
                </div>

                <Button onClick={testGeofence} variant="outline" className="w-full">
                  ジオフェンス機能をテスト
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <span>音楽・音声設定</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>自動再生</Label>
                <p className="text-sm text-gray-600">帰宅時の自動再生機能</p>
              </div>
              <Switch
                checked={settings.autoPlay}
                onCheckedChange={(checked) => handleSettingChange('autoPlay', checked)}
              />
            </div>

            <div>
              <Label>音量: {settings.volume[0]}%</Label>
              <Slider
                value={settings.volume}
                onValueChange={(value) => handleSettingChange('volume', value)}
                max={100}
                min={0}
                step={5}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>好みの音楽ジャンル</Label>
                <p className="text-sm text-gray-600">生成される楽曲のスタイル</p>
              </div>
              <Select 
                value={settings.musicGenre}
                onValueChange={(value) => handleSettingChange('musicGenre', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="jpop">J-POP</SelectItem>
                  <SelectItem value="chill">Chill</SelectItem>
                  <SelectItem value="acoustic">Acoustic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>通知設定</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>ジオフェンス通知</Label>
                <p className="text-sm text-gray-600">帰宅検知時の通知</p>
              </div>
              <Switch
                checked={settings.geofenceNotifications}
                onCheckedChange={(checked) => handleSettingChange('geofenceNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>学習リマインダー</Label>
                <p className="text-sm text-gray-600">定期的な学習通知</p>
              </div>
              <Switch
                checked={settings.learningReminders}
                onCheckedChange={(checked) => handleSettingChange('learningReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>目標達成通知</Label>
                <p className="text-sm text-gray-600">1日の目標達成時</p>
              </div>
              <Switch
                checked={settings.dailyGoalReminders}
                onCheckedChange={(checked) => handleSettingChange('dailyGoalReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>復習間隔</Label>
                <p className="text-sm text-gray-600">単語の復習頻度</p>
              </div>
              <Select 
                value={settings.reviewInterval}
                onValueChange={(value) => handleSettingChange('reviewInterval', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">毎日</SelectItem>
                  <SelectItem value="weekly">週1回</SelectItem>
                  <SelectItem value="biweekly">2週間</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>アプリ設定</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>ダークモード</Label>
                <p className="text-sm text-gray-600">画面の配色テーマ</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>言語</Label>
                <p className="text-sm text-gray-600">アプリの表示言語</p>
              </div>
              <Select 
                value={settings.language}
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>オフラインモード</Label>
                <p className="text-sm text-gray-600">ダウンロード済み楽曲のみ</p>
              </div>
              <Switch
                checked={settings.offlineMode}
                onCheckedChange={(checked) => handleSettingChange('offlineMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>アカウント</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              データをエクスポート
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              プライバシー設定
            </Button>

            <Button 
              variant="destructive" 
              onClick={onLogout}
              className="w-full"
            >
              ログアウト
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Display */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-lg">システム状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">GPS状態</p>
                <Badge variant={latitude ? "default" : "destructive"}>
                  {latitude ? "利用可能" : "無効"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">ネットワーク</p>
                <Badge variant="default">オンライン</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">デバイス</p>
                <Badge variant="outline">Web版</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};