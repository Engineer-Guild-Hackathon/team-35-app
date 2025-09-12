import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Word } from '../types';
import { mockWords } from '../data/mockData';
import {
  Search,
  Plus,
  BookOpen,
  TrendingUp,
  Clock,
  Edit,
  Volume2,
  Star,
} from 'lucide-react';

interface WordsScreenProps {
  onNavigate: (screen: string) => void;
}

export const WordsScreen = ({ onNavigate }: WordsScreenProps) => {
  const [words] = useState<Word[]>(mockWords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(words.map((word) => word.category)))];

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.japanese.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const beginnerWords = filteredWords.filter((word) => word.difficulty === 'beginner');
  const intermediateWords = filteredWords.filter((word) => word.difficulty === 'intermediate');
  const advancedWords = filteredWords.filter((word) => word.difficulty === 'advanced');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 80) return 'text-green-600';
    if (level >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const playPronunciation = (word: Word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const WordCard = ({ word }: { word: Word }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-bold text-lg">{word.english}</h3>
              <Button variant="ghost" size="sm" onClick={() => playPronunciation(word)} className="h-8 w-8 p-0">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground mb-2">{word.japanese}</p>
            {word.pronunciation && (
              <p className="text-sm text-muted-foreground font-mono">[{word.pronunciation}]</p>
            )}
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${getMasteryColor(word.masteryLevel)}`}>{word.masteryLevel}%</div>
            <Progress value={word.masteryLevel} className="w-16 h-2 mt-1" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={getDifficultyColor(word.difficulty)}>{word.difficulty}</Badge>
            <Badge variant="outline">{word.category}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            {word.lastReviewed && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {word.lastReviewed.toLocaleDateString()}
              </div>
            )}
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">単語管理</h1>
          <p className="text-muted-foreground">登録した英単語を管理・学習</p>
        </div>
        <Button onClick={() => onNavigate('add-word')} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>単語を追加</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{words.length}</div>
            <div className="text-sm text-muted-foreground">総単語数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">
              {Math.round(words.reduce((sum, word) => sum + word.masteryLevel, 0) / words.length)}%
            </div>
            <div className="text-sm text-muted-foreground">平均習得度</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">{words.filter((word) => word.masteryLevel >= 80).length}</div>
            <div className="text-sm text-muted-foreground">習得済み</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{words.filter((word) => word.masteryLevel < 60).length}</div>
            <div className="text-sm text-muted-foreground">要復習</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>検索・フィルター</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="英単語または日本語で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'すべて' : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Words List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">すべて ({filteredWords.length})</TabsTrigger>
          <TabsTrigger value="beginner">初級 ({beginnerWords.length})</TabsTrigger>
          <TabsTrigger value="intermediate">中級 ({intermediateWords.length})</TabsTrigger>
          <TabsTrigger value="advanced">上級 ({advancedWords.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="beginner" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beginnerWords.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intermediate" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {intermediateWords.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advancedWords.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredWords.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">単語が見つかりません</h3>
            <p className="text-muted-foreground mb-4">検索条件を変更するか、新しい単語を追加してください。</p>
            <Button onClick={() => onNavigate('add-word')}>
              <Plus className="h-4 w-4 mr-2" />
              単語を追加
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
