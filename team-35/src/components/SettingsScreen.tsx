import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { User } from "../types";
import { useGeolocation } from "../hooks/useGeolocation";
import { MapPin, Home, Volume2, Bell, User as UserIcon, Settings, Shield, Download, Moon, Sun, Globe, Smartphone } from "lucide-react";

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
    musicGenre: "all",

    // Notification Settings
    geofenceNotifications: true,
    learningReminders: true,
    dailyGoalReminders: true,

    // Location Settings
    geofenceEnabled: true,
    homeRadius: [100], // meters

    // App Settings
    darkMode: false,
    language: "ja",
    offlineMode: false,

    // Learning Settings
    dailyWordGoal: 5,
    difficultyLevel: "intermediate",
    reviewInterval: "daily",
  });

  const [homeAddress, setHomeAddress] = useState("");
  const [isSettingHome, setIsSettingHome] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
    alert("ジオフェンス機能をテストしました。帰宅時に自動再生が開始されます。");
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">設定</h1>
        <p className="text-muted-foreground">アプリの動作をカスタマイズ</p>
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
                <p className="text-sm text-muted-foreground">現在の難易度設定</p>
              </div>
              <Select value={settings.difficultyLevel} onValueChange={(value) => handleSettingChange("difficultyLevel", value)}>
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
          </CardContent>
        </Card>

        {/* Audio & Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <span>オーディオ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ボリューム</Label>
              <Slider value={settings.volume} onValueChange={(v) => handleSettingChange("volume", v)} max={100} step={1} className="w-full" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>自動再生</Label>
                <p className="text-sm text-muted-foreground">帰宅時に楽曲を自動再生</p>
              </div>
              <Switch checked={settings.autoPlay} onCheckedChange={(checked) => handleSettingChange("autoPlay", checked)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>学習リマインダー</Label>
                <p className="text-sm text-muted-foreground">毎日の通知を受け取る</p>
              </div>
              <Switch checked={settings.learningReminders} onCheckedChange={(checked) => handleSettingChange("learningReminders", checked)} />
            </div>
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>位置情報</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>ジオフェンス</Label>
                <p className="text-sm text-muted-foreground">帰宅範囲で再生を開始</p>
              </div>
              <Switch checked={settings.geofenceEnabled} onCheckedChange={(checked) => handleSettingChange("geofenceEnabled", checked)} />
            </div>

            <div>
              <Label>自宅半径（m）</Label>
              <Slider value={settings.homeRadius} onValueChange={(v) => handleSettingChange("homeRadius", v)} min={50} max={500} step={10} />
              <p className="text-xs text-muted-foreground">現在値: {settings.homeRadius[0]}m</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>現在地を自宅に設定</Label>
                <p className="text-sm text-muted-foreground">緯度経度から住所を推定</p>
              </div>
              <Button variant="outline" onClick={setCurrentLocationAsHome} disabled={!latitude || !longitude || isSettingHome}>
                <Home className="h-4 w-4 mr-2" />
                設定
              </Button>
            </div>
            {homeAddress && <p className="text-sm text-muted-foreground">{homeAddress}</p>}
            <Button variant="ghost" onClick={testGeofence}>
              ジオフェンスをテスト
            </Button>
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
                <p className="text-sm text-muted-foreground">画面の配色テーマ</p>
              </div>
              <Switch checked={settings.darkMode} onCheckedChange={(checked) => handleSettingChange("darkMode", checked)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>言語</Label>
                <p className="text-sm text-muted-foreground">アプリの表示言語</p>
              </div>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
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
                <p className="text-sm text-muted-foreground">ダウンロード済み楽曲のみ</p>
              </div>
              <Switch checked={settings.offlineMode} onCheckedChange={(checked) => handleSettingChange("offlineMode", checked)} />
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

            <Button variant="destructive" onClick={onLogout} className="w-full">
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
                <p className="font-medium">GPS 状態</p>
                <Badge variant={latitude ? "default" : "destructive"}>{latitude ? "利用可能" : "無効"}</Badge>
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
                <Badge variant="outline">Web</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
