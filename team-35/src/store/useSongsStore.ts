import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VocabularySong } from '../types';

interface SongsState {
  songs: VocabularySong[];
  currentSong: VocabularySong | null;
  addSong: (song: Omit<VocabularySong, 'id'>) => void;
  updateSong: (id: string, updates: Partial<VocabularySong>) => void;
  deleteSong: (id: string) => void;
  setCurrentSong: (song: VocabularySong | null) => void;
  initializeWithMockData: (mockSongs: VocabularySong[]) => void;
}

export const useSongsStore = create<SongsState>()(
  persist(
    (set, get) => ({
      songs: [],
      currentSong: null,
      
      addSong: (song) => {
        const newSong: VocabularySong = {
          ...song,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set((state) => ({
          songs: [...state.songs, newSong]
        }));
      },
      
      updateSong: (id, updates) => {
        set((state) => ({
          songs: state.songs.map((song) =>
            song.id === id ? { ...song, ...updates } : song
          )
        }));
      },
      
      deleteSong: (id) => {
        set((state) => ({
          songs: state.songs.filter((song) => song.id !== id)
        }));
      },
      
      setCurrentSong: (song) => {
        set({ currentSong: song });
      },
      
      initializeWithMockData: (mockSongs) => {
        const { songs } = get();
        if (songs.length === 0) {
          set({ songs: mockSongs });
        }
      },
    }),
    {
      name: 'songs-storage',
      partialize: (state) => ({ songs: state.songs, currentSong: state.currentSong }),
    }
  )
);