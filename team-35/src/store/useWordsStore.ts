import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Word } from '../types';
import * as wordsService from '../lib/wordsService';

interface WordsState {
  words: Word[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadUserWords: (userId: string) => Promise<void>;
  addWord: (userId: string, word: Omit<Word, 'id' | 'userId' | 'createdAt'>) => Promise<boolean>;
  updateWord: (id: string, updates: Partial<Word>) => Promise<boolean>;
  deleteWord: (id: string) => Promise<boolean>;
  updateMasteryLevel: (id: string, level: number) => Promise<boolean>;
  subscribeToWords: (userId: string) => () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Backward compatibility
  initializeWithMockData: (mockWords: Word[]) => void;
}

export const useWordsStore = create<WordsState>()(
  persist(
    (set, get) => ({
      words: [],
      loading: false,
      error: null,
      
      // Firestore連携のユーザー単語読み込み
      loadUserWords: async (userId: string) => {
        set({ loading: true, error: null });
        const result = await wordsService.getUserWords(userId);
        
        if (result.success && result.words) {
          set({ words: result.words, loading: false });
        } else {
          set({ 
            error: result.error || '単語の読み込みに失敗しました。',
            loading: false 
          });
        }
      },
      
      // Firestoreに単語追加
      addWord: async (userId: string, wordData) => {
        set({ loading: true, error: null });
        const result = await wordsService.addWord(userId, {
          ...wordData,
          userId,
          createdAt: new Date(),
        });
        
        if (result.success && result.word) {
          set((state) => ({
            words: [result.word!, ...state.words],
            loading: false
          }));
          return true;
        } else {
          set({ 
            error: result.error || '単語の追加に失敗しました。',
            loading: false 
          });
          return false;
        }
      },
      
      // Firestore単語更新
      updateWord: async (id: string, updates: Partial<Word>) => {
        const result = await wordsService.updateWord(id, updates);
        
        if (result.success) {
          set((state) => ({
            words: state.words.map((word) =>
              word.id === id ? { ...word, ...updates } : word
            ),
            error: null
          }));
          return true;
        } else {
          set({ error: result.error || '単語の更新に失敗しました。' });
          return false;
        }
      },
      
      // Firestore単語削除
      deleteWord: async (id: string) => {
        const result = await wordsService.deleteWord(id);
        
        if (result.success) {
          set((state) => ({
            words: state.words.filter((word) => word.id !== id),
            error: null
          }));
          return true;
        } else {
          set({ error: result.error || '単語の削除に失敗しました。' });
          return false;
        }
      },
      
      // 習得度更新
      updateMasteryLevel: async (id: string, level: number) => {
        const result = await wordsService.updateMasteryLevel(id, level);
        
        if (result.success) {
          set((state) => ({
            words: state.words.map((word) =>
              word.id === id 
                ? { ...word, masteryLevel: level, lastReviewed: new Date() }
                : word
            ),
            error: null
          }));
          return true;
        } else {
          set({ error: result.error || '習得度の更新に失敗しました。' });
          return false;
        }
      },
      
      // リアルタイム監視
      subscribeToWords: (userId: string) => {
        return wordsService.subscribeToUserWords(
          userId,
          (words) => {
            set({ words, error: null });
          },
          (error) => {
            set({ error });
          }
        );
      },
      
      // エラー・ローディング状態管理
      setError: (error: string | null) => set({ error }),
      setLoading: (loading: boolean) => set({ loading }),
      
      // 後方互換性のためのモックデータ初期化
      initializeWithMockData: (mockWords) => {
        const { words } = get();
        if (words.length === 0) {
          set({ words: mockWords });
        }
      },
    }),
    {
      name: 'words-storage',
      partialize: (state) => ({ words: state.words }),
    }
  )
);