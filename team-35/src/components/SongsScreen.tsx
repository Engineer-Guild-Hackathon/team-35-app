import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { VocabularySong } from "../types";
import { mockSongs, mockWords } from "../data/mockData";
import { useWordsStore } from "../store/useWordsStore";
import { useSongsStore } from "../store/useSongsStore";
import {
  Play,
  Pause,
  Music,
  Clock,
  User,
  Volume2,
  Shuffle,
  SkipForward,
  Heart,
  Download,
  Share,
  Eye,
} from "lucide-react";

interface SongsScreenProps {
  onNavigate: (screen: string) => void;
}

export const SongsScreen = ({ onNavigate }: SongsScreenProps) => {
  const { words } = useWordsStore();
  const { songs, currentSong, setCurrentSong, initializeWithMockData } = useSongsStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showLyrics, setShowLyrics] = useState<string | null>(null);

  // Initialize with mock data if empty
  useEffect(() => {
    initializeWithMockData(mockSongs);
  }, [initializeWithMockData]);

  const playSong = (song: VocabularySong) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentTime(0);
    }
    // In real app, this would control actual audio playback
  };

  const getWordsInSong = (song: VocabularySong) => {
    return words.filter((word) => song.words.includes(word.id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case "jpop":
        return "bg-pink-100 text-pink-800";
      case "chill":
        return "bg-blue-100 text-blue-800";
      case "acoustic":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const SongCard = ({ song }: { song: VocabularySong }) => {
    const wordsInSong = getWordsInSong(song);
    const isCurrentSong = currentSong?.id === song.id;

    return (
      <Card className={`hover:shadow-md transition-all ${isCurrentSong ? "ring-2 ring-blue-500" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Album Art Placeholder */}
            <div className="bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg w-16 h-16 flex items-center justify-center">
              <Music className="h-8 w-8 text-white" />
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{song.title}</h3>
              <p className="text-muted-foreground flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{song.artist}</span>
              </p>

              <div className="flex items-center space-x-3 mt-2">
                <Badge className={getGenreColor(song.genre)}>{song.genre}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(song.duration)}
                </div>
              </div>

              {/* Words in Song */}
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">含まれる単語</p>
                <div className="flex flex-wrap gap-2">
                  {wordsInSong.map((word) => (
                    <Badge key={word.id} variant="outline" className="text-xs">
                      {word.english}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-end space-y-2">
              <Button onClick={() => playSong(song)} className="h-12 w-12 rounded-full" variant={isCurrentSong && isPlaying ? "secondary" : "default"}>
                {isCurrentSong && isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowLyrics(showLyrics === song.id ? null : song.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Lyrics */}
          {showLyrics === song.id && (
            <div className="mt-4 p-3 rounded-md bg-muted">
              <p className="text-sm text-muted-foreground">歌詞プレビュー（ダミー）</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const jpopSongs = songs.filter((s) => s.genre === 'jpop');
  const chillSongs = songs.filter((s) => s.genre === 'chill');
  const acousticSongs = songs.filter((s) => s.genre === 'acoustic');

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Now Playing Bar */}
      {currentSong && (
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg w-12 h-12 flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{currentSong.title}</h3>
              <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
              <div className="mt-2">
                <Progress value={(currentTime / currentSong.duration) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentSong.duration)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button onClick={() => playSong(currentSong)} variant="default" size="sm">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Music className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{songs.length}</div>
            <div className="text-sm text-muted-foreground">総楽曲数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">
              {Math.floor(songs.reduce((sum, song) => sum + song.duration, 0) / 60)}
            </div>
            <div className="text-sm text-muted-foreground">総再生時間（分）</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">アーティスト数</div>
          </CardContent>
        </Card>
      </div>

      {/* Songs by Genre */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">すべて ({songs.length})</TabsTrigger>
          <TabsTrigger value="jpop">J-POP ({jpopSongs.length})</TabsTrigger>
          <TabsTrigger value="chill">Chill ({chillSongs.length})</TabsTrigger>
          <TabsTrigger value="acoustic">Acoustic ({acousticSongs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </TabsContent>
        <TabsContent value="jpop" className="mt-6 space-y-4">
          {jpopSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </TabsContent>
        <TabsContent value="chill" className="mt-6 space-y-4">
          {chillSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </TabsContent>
        <TabsContent value="acoustic" className="mt-6 space-y-4">
          {acousticSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="text-lg">ボキャブラリーソングについて</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-foreground">
            <p>• あなたが登録した英単語が自然な歌詞に組み込まれます。</p>
            <p>• Suno AI を使用して、J-POP やチル系の聴きやすい曲を生成します。</p>
            <p>• 繰り返し聴くことで、単語を自然に記憶できます。</p>
            <p>• GPS 機能により、帰宅時に自動で再生されます。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
