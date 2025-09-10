import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { User, Word, VocabularySong } from '../types';
import { mockWords, mockSongs } from '../../data/mockData';
import { useGeolocation } from '../../hooks/useGeolocation';
import { 
  Music, 
  BookOpen, 
  MapPin, 
  TrendingUp, 
  Play, 
  Home,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface DashboardProps {
  user: User;
}

export const Dashboard = ({ user }: DashboardProps) => {
  const [words] = useState<Word[]>(mockWords);
  const [songs] = useState<VocabularySong[]>(mockSongs);
  const [currentSong, setCurrentSong] = useState<VocabularySong | null>(null);
  const { latitude, longitude, error, isNearHome } = useGeolocation();

  // Mock home location for demo
  const homeLocation = { latitude: 35.6762, longitude: 139.6503 }; // Tokyo

  useEffect(() => {
    // Simulate geofencing trigger
    if (user.homeLocation && isNearHome(user.homeLocation)) {
      // Auto-play today's vocabulary song
      const todaySong = songs[0];
      setCurrentSong(todaySong);
      // In real app, this would trigger audio playback
    }
  }, [latitude, longitude, user.homeLocation, isNearHome, songs]);

  const todayWords = words.filter(word => 
    word.masteryLevel < 70 || !word.lastReviewed
  ).slice(0, 5);

  const averageMastery = words.reduce((sum, word) => sum + word.masteryLevel, 0) / words.length;

  const playVocabularySong = (song: VocabularySong) => {
    setCurrentSong(song);
    // In real app, this would play the actual audio
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          おかえりなさい、{user.name}さん！
        </h1>
        <p className="text-gray-600">今日も楽しく英単語を学びましょう</p>
      </div>

      {/* GPS Status */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">GPS ステータス</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-orange-600 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              位置情報の取得に失敗しました
            </p>
          ) : latitude && longitude ? (
            <div className="space-y-2">
              <p className="text-green-600 flex items-center">
                <Home className="h-4 w-4 mr-2" />
                位置情報を取得中です
              </p>
              <div className="text-sm text-gray-600">
                現在地: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </div>
              {isNearHome(homeLocation) && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  自宅周辺を検知 - ボキャブラリーソング自動再生中
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-gray-600">位置情報を取得中...</p>
          )}
        </CardContent>
      </Card>

      {/* Today's Learning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>学習進捗</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>総合習熟度</span>
                <span>{Math.round(averageMastery)}%</span>
              </div>
              <Progress value={averageMastery} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{words.length}</div>
                <div className="text-sm text-gray-600">登録単語</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{songs.length}</div>
                <div className="text-sm text-gray-600">楽曲数</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Song */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Music className="h-5 w-5" />
              <span>現在の楽曲</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentSong ? (
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">{currentSong.title}</h3>
                  <p className="text-sm text-gray-600">{currentSong.artist}</p>
                </div>
                <Badge variant="secondary">{currentSong.genre}</Badge>
                <Button
                  onClick={() => playVocabularySong(currentSong)}
                  className="w-full"
                  variant="outline"
                >
                  <Play className="h-4 w-4 mr-2" />
                  再生
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>楽曲を選択してください</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Words */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>今日の復習単語</span>
          </CardTitle>
          <CardDescription>
            習熟度の低い単語や復習が必要な単語です
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayWords.map((word) => (
              <div key={word.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{word.english}</h4>
                      <p className="text-sm text-gray-600">{word.japanese}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {word.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">習熟度</div>
                  <div className="font-medium">{word.masteryLevel}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Songs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Music className="h-5 w-5" />
            <span>ボキャブラリーソング</span>
          </CardTitle>
          <CardDescription>
            あなたの単語が組み込まれた楽曲一覧
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.map((song) => (
              <div key={song.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{song.title}</h4>
                    <p className="text-sm text-gray-600">{song.artist}</p>
                  </div>
                  <Badge variant="outline">{song.genre}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </div>
                  <Button
                    onClick={() => playVocabularySong(song)}
                    size="sm"
                    variant="outline"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    再生
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};