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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, Save, Volume2, Lightbulb, BookOpen } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { setJSON, getJSON } from "../lib/storage";
import { Word } from "../types";

interface AddWordScreenProps {
  onNavigate: (screen: string) => void;
}

export const AddWordScreen = ({ onNavigate }: AddWordScreenProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    english: "",
    japanese: "",
    pronunciation: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    category: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "ビジネス",
    "旅行",
    "健康",
    "感情",
    "性格",
    "学習",
    "科学",
    "技術",
    "料理",
    "音楽",
    "スポーツ",
    "自然",
  ];

  const difficultyOptions = [
    { value: "beginner", label: "初級", description: "基本的な単語" },
    { value: "intermediate", label: "中級", description: "日常会話レベル" },
    { value: "advanced", label: "上級", description: "専門的・学術的な単語" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.english.trim())
      newErrors.english = "英単語を入力してください";
    if (!formData.japanese.trim())
      newErrors.japanese = "日本語の意味を入力してください";
    if (!formData.category) newErrors.category = "カテゴリーを選択してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const now = new Date();
    const newWord: Word = {
      id: String(Date.now()),
      userId: user?.id ?? "guest",
      english: formData.english.trim(),
      japanese: formData.japanese.trim(),
      pronunciation: formData.pronunciation.trim() || undefined,
      difficulty: formData.difficulty,
      category: formData.category,
      createdAt: now,
      masteryLevel: 0,
    };

    const existing = getJSON<Word[]>("customWords", []);
    existing.unshift(newWord);
    setJSON("customWords", existing);

    setIsLoading(false);
    onNavigate("words");
  };

  const playPronunciation = () => {
    if ("speechSynthesis" in window && formData.english) {
      const utterance = new SpeechSynthesisUtterance(formData.english);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  const getExampleSentence = () => {
    const examples = [
      `I need to improve my ${formData.english} skills.`,
      `The ${formData.english} was very important.`,
      `She showed great ${formData.english} in her work.`,
      `This ${formData.english} is essential for success.`,
    ];
    return examples[Math.floor(Math.random() * examples.length)];
  };

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => onNavigate("words")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>戻る</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            新しい単語を追加
          </h1>
          <p className="text-muted-foreground">
            学習したい英単語を登録しましょう
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>単語情報</span>
          </CardTitle>
          <CardDescription>
            英単語とその詳細情報を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* English Word */}
          <div className="space-y-2">
            <Label htmlFor="english">英単語 *</Label>
            <div className="flex gap-2">
              <Input
                id="english"
                placeholder="例: aspiration"
                value={formData.english}
                onChange={(e) =>
                  setFormData({ ...formData, english: e.target.value })
                }
              />
              <Button
                variant="outline"
                onClick={playPronunciation}
                className="shrink-0"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            {errors.english && (
              <p className="text-sm text-destructive">{errors.english}</p>
            )}
          </div>

          {/* Japanese Meaning */}
          <div className="space-y-2">
            <Label htmlFor="japanese">日本語の意味 *</Label>
            <Input
              id="japanese"
              placeholder="例: 熱意、向上心"
              value={formData.japanese}
              onChange={(e) =>
                setFormData({ ...formData, japanese: e.target.value })
              }
            />
            {errors.japanese && (
              <p className="text-sm text-destructive">{errors.japanese}</p>
            )}
          </div>

          {/* Pronunciation */}
          <div className="space-y-2">
            <Label htmlFor="pronunciation">発音記号 (オプション)</Label>
            <Input
              id="pronunciation"
              placeholder="例: ˌæspəˈreɪʃən"
              value={formData.pronunciation}
              onChange={(e) =>
                setFormData({ ...formData, pronunciation: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              IPA (国際音声記号) 形式で入力してください
            </p>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label>難易度レベル</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {difficultyOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-colors ${
                    formData.difficulty === option.value
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-muted"
                  }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      difficulty: option.value as any,
                    })
                  }
                >
                  <CardContent className="p-4 text-center">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">カテゴリー *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="カテゴリーを選択してください" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">メモ・使用例 (オプション)</Label>
            <Textarea
              id="notes"
              placeholder="例: ビジネスシーンでよく使われる。類義語 aspiration, goal"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Example Sentence Preview */}
          {formData.english && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      例文プレビュー
                    </h4>
                    <p className="text-blue-800 italic">
                      {getExampleSentence()}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      ※ 実際の楽曲では、より自然な歌詞に組み込まれます
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => onNavigate("words")}>
              キャンセル
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? "保存中..." : "単語を保存"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>学習のコツ</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-foreground">
            <li>• 日常生活で使う単語から始めましょう</li>
            <li>• カテゴリーを統一すると、関連語彙を効率的に学べます</li>
            <li>• 発音記号を入力すると、より正確な発音練習ができます</li>
            <li>• メモ欄に類義語や反対語を記載すると理解が深まります</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
