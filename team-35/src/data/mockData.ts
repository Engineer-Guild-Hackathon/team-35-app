import { Word, VocabularySong } from '../types';

export const mockWords: Word[] = [
  {
    id: '1',
    userId: '1',
    english: 'ambition',
    japanese: '野心、大志',
    pronunciation: 'æmˈbɪʃən',
    difficulty: 'intermediate',
    category: 'ビジネス',
    createdAt: new Date('2024-01-15'),
    lastReviewed: new Date('2024-01-20'),
    masteryLevel: 75,
  },
  {
    id: '2',
    userId: '1',
    english: 'serendipity',
    japanese: '偶然の幸運',
    pronunciation: 'ˌserənˈdɪpəti',
    difficulty: 'advanced',
    category: '感情',
    createdAt: new Date('2024-01-16'),
    lastReviewed: new Date('2024-01-21'),
    masteryLevel: 45,
  },
  {
    id: '3',
    userId: '1',
    english: 'resilience',
    japanese: '回復力、復元力',
    pronunciation: 'rɪˈzɪljəns',
    difficulty: 'intermediate',
    category: '性格',
    createdAt: new Date('2024-01-17'),
    masteryLevel: 60,
  },
  {
    id: '4',
    userId: '1',
    english: 'wanderlust',
    japanese: '旅行熱、放浪癖',
    pronunciation: 'ˈwɑndɚlʌst',
    difficulty: 'advanced',
    category: '旅行',
    createdAt: new Date('2024-01-18'),
    masteryLevel: 30,
  },
  {
    id: '5',
    userId: '1',
    english: 'mindfulness',
    japanese: 'マインドフルネス、注意深さ',
    pronunciation: 'ˈmaɪndfəlnəs',
    difficulty: 'intermediate',
    category: '健康',
    createdAt: new Date('2024-01-19'),
    masteryLevel: 80,
  },
];

export const mockSongs: VocabularySong[] = [
  {
    id: '1',
    title: 'Dreams of Ambition',
    artist: 'Mimi Coach',
    genre: 'jpop',
    audioUrl: '/audio/dreams-of-ambition.mp3',
    lyrics: `夢を追いかけて ambition 燃やして
    新しい morning comes with hope
    昨日の failure は past になって
    今日の challenge で stronger になる
    
    Every step I take, every breath I make
    この道を歩いて行こう
    Ambition in my heart, 決して諦めない
    輝く future が待ってる`,
    words: ['1'], // ambition
    duration: 210,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Serendipity Moments',
    artist: 'Chill Vibes',
    genre: 'chill',
    lyrics: `偶然の出会い serendipity
    運命が微笑みかけて
    思いがけない happiness
    心が軽やかに踊る
    
    Like a gentle breeze in spring
    予期しない joy が来る
    Serendipity の魔法で
    世界が変わって見える`,
    audioUrl: '/audio/serendipity-moments.mp3',
    words: ['2'], // serendipity
    duration: 195,
    createdAt: new Date('2024-01-21'),
  },
  {
    id: '3',
    title: 'Resilient Soul',
    artist: 'Acoustic Hearts',
    genre: 'acoustic',
    lyrics: `嵐が過ぎても resilience
    折れない心で立ち上がる
    傷ついても stronger
    涙も明日への bridge
    
    Every fall makes me rise
    困難も growth の chance
    Resilience は my power
    未来への希望の光`,
    audioUrl: '/audio/resilient-soul.mp3',
    words: ['3'], // resilience
    duration: 230,
    createdAt: new Date('2024-01-22'),
  },
];