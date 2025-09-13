import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  FirestoreError,
} from 'firebase/firestore';
import { db } from './firebase';
import { Word } from '../types';

// Firestore用のWord型（Date型をTimestamp型に対応）
export interface FirestoreWord extends Omit<Word, 'createdAt' | 'lastReviewed'> {
  createdAt: any; // Firestore Timestamp
  lastReviewed?: any; // Firestore Timestamp
}

// コレクション名
const WORDS_COLLECTION = 'words';

// Firestoreエラーを日本語メッセージに変換
export const getFirestoreErrorMessage = (error: FirestoreError): string => {
  switch (error.code) {
    case 'permission-denied':
      return 'データへのアクセス権限がありません。';
    case 'not-found':
      return '指定された単語が見つかりません。';
    case 'already-exists':
      return 'この単語は既に存在しています。';
    case 'resource-exhausted':
      return 'リクエストの制限に達しました。しばらく時間をおいてから再度お試しください。';
    case 'deadline-exceeded':
      return '処理がタイムアウトしました。';
    case 'unavailable':
      return 'サービスが一時的に利用できません。';
    case 'unauthenticated':
      return '認証が必要です。ログインしてください。';
    default:
      return 'データの処理中にエラーが発生しました。';
  }
};

// FirestoreWordをWord型に変換
const mapFirestoreWordToWord = (firestoreWord: FirestoreWord, id: string): Word => {
  return {
    ...firestoreWord,
    id,
    createdAt: firestoreWord.createdAt?.toDate() || new Date(),
    lastReviewed: firestoreWord.lastReviewed?.toDate(),
  };
};

// 単語を追加
export const addWord = async (userId: string, wordData: Omit<Word, 'id' | 'createdAt'>): Promise<{ success: boolean; word?: Word; error?: string }> => {
  try {
    const wordToAdd = {
      ...wordData,
      userId,
      createdAt: serverTimestamp(),
      lastReviewed: wordData.lastReviewed ? serverTimestamp() : null,
    };

    const docRef = await addDoc(collection(db, WORDS_COLLECTION), wordToAdd);
    
    // 追加された単語を取得
    const addedDoc = await getDoc(docRef);
    if (addedDoc.exists()) {
      const word = mapFirestoreWordToWord(addedDoc.data() as FirestoreWord, addedDoc.id);
      return { success: true, word };
    }
    
    return { success: false, error: '単語の追加に失敗しました。' };
  } catch (error) {
    const firestoreError = error as FirestoreError;
    return {
      success: false,
      error: getFirestoreErrorMessage(firestoreError),
    };
  }
};

// ユーザーの単語一覧を取得
export const getUserWords = async (userId: string): Promise<{ success: boolean; words?: Word[]; error?: string }> => {
  try {
    const q = query(
      collection(db, WORDS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const words: Word[] = [];
    
    querySnapshot.forEach((doc) => {
      const firestoreWord = doc.data() as FirestoreWord;
      words.push(mapFirestoreWordToWord(firestoreWord, doc.id));
    });
    
    return { success: true, words };
  } catch (error) {
    const firestoreError = error as FirestoreError;
    return {
      success: false,
      error: getFirestoreErrorMessage(firestoreError),
    };
  }
};

// 単語を更新
export const updateWord = async (wordId: string, updates: Partial<Word>): Promise<{ success: boolean; error?: string }> => {
  try {
    const wordRef = doc(db, WORDS_COLLECTION, wordId);
    
    // Dateオブジェクトをサーバータイムスタンプに変換
    const updateData: any = { ...updates };
    if (updates.lastReviewed) {
      updateData.lastReviewed = serverTimestamp();
    }
    if (updates.createdAt) {
      delete updateData.createdAt; // createdAtは更新しない
    }
    delete updateData.id; // IDは更新しない
    
    await updateDoc(wordRef, updateData);
    return { success: true };
  } catch (error) {
    const firestoreError = error as FirestoreError;
    return {
      success: false,
      error: getFirestoreErrorMessage(firestoreError),
    };
  }
};

// 単語を削除
export const deleteWord = async (wordId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await deleteDoc(doc(db, WORDS_COLLECTION, wordId));
    return { success: true };
  } catch (error) {
    const firestoreError = error as FirestoreError;
    return {
      success: false,
      error: getFirestoreErrorMessage(firestoreError),
    };
  }
};

// 習得度を更新
export const updateMasteryLevel = async (wordId: string, masteryLevel: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const wordRef = doc(db, WORDS_COLLECTION, wordId);
    await updateDoc(wordRef, {
      masteryLevel: Math.max(0, Math.min(100, masteryLevel)),
      lastReviewed: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    const firestoreError = error as FirestoreError;
    return {
      success: false,
      error: getFirestoreErrorMessage(firestoreError),
    };
  }
};

// リアルタイム単語一覧の監視
export const subscribeToUserWords = (
  userId: string,
  callback: (words: Word[]) => void,
  errorCallback?: (error: string) => void
) => {
  try {
    const q = query(
      collection(db, WORDS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const words: Word[] = [];
        querySnapshot.forEach((doc) => {
          const firestoreWord = doc.data() as FirestoreWord;
          words.push(mapFirestoreWordToWord(firestoreWord, doc.id));
        });
        callback(words);
      },
      (error) => {
        const firestoreError = error as FirestoreError;
        errorCallback?.(getFirestoreErrorMessage(firestoreError));
      }
    );
  } catch (error) {
    const firestoreError = error as FirestoreError;
    errorCallback?.(getFirestoreErrorMessage(firestoreError));
    return () => {}; // 空のunsubscribe関数を返す
  }
};