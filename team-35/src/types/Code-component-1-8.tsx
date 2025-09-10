export interface User {
  id: string;
  email: string;
  name: string;
  homeLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface Word {
  id: string;
  userId: string;
  english: string;
  japanese: string;
  pronunciation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  createdAt: Date;
  lastReviewed?: Date;
  masteryLevel: number; // 0-100
}

export interface VocabularySong {
  id: string;
  title: string;
  artist: string;
  genre: 'jpop' | 'chill' | 'acoustic';
  audioUrl: string;
  lyrics: string;
  words: string[]; // word IDs included in this song
  duration: number; // in seconds
  createdAt: Date;
}

export interface LearningSession {
  id: string;
  userId: string;
  words: string[];
  songsPlayed: string[];
  startTime: Date;
  endTime?: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
  triggeredByGeofence: boolean;
}

export type Screen = 'login' | 'dashboard' | 'words' | 'add-word' | 'songs' | 'settings';