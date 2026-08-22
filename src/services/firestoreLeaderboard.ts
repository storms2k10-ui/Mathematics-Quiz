import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LeaderboardEntry, ClassLevel } from '../types';

const LEADERBOARD_COLLECTION = 'leaderboard';

export class FirestoreLeaderboardService {
  /**
   * Saves a practice or exam score directly to Firestore cloud database.
   * This guarantees persistence across devices, cache wipes, and all users.
   */
  static async saveEntry(entry: LeaderboardEntry): Promise<void> {
    try {
      const docRef = doc(db, LEADERBOARD_COLLECTION, entry.id);
      await setDoc(docRef, {
        ...entry,
        savedAt: Date.now()
      }, { merge: true });
    } catch (error) {
      console.warn('Firestore saveEntry error (falling back):', error);
      throw error;
    }
  }

  /**
   * Fetches the ranked leaderboard from Firestore cloud database.
   */
  static async fetchRanked(
    classLevel?: ClassLevel | 'all',
    mode: 'all' | 'practice' | 'exam' = 'practice'
  ): Promise<LeaderboardEntry[]> {
    try {
      const colRef = collection(db, LEADERBOARD_COLLECTION);
      let q = query(colRef);

      if (classLevel && classLevel !== 'all') {
        q = query(colRef, where('classLevel', '==', Number(classLevel)));
      }

      const snap = await getDocs(q);
      const entries: LeaderboardEntry[] = [];
      
      snap.forEach((d) => {
        const data = d.data() as LeaderboardEntry;
        if (mode === 'all' || !data.mode || data.mode === mode) {
          entries.push(data);
        }
      });

      // Sort client-side by accuracy -> correct count -> fastest time -> newest
      entries.sort((a, b) => {
        if (b.scorePercentage !== a.scorePercentage) {
          return b.scorePercentage - a.scorePercentage;
        }
        if (b.correctCount !== a.correctCount) {
          return b.correctCount - a.correctCount;
        }
        if (a.timeSpentSeconds !== b.timeSpentSeconds) {
          return a.timeSpentSeconds - b.timeSpentSeconds;
        }
        return b.timestamp - a.timestamp;
      });

      return entries;
    } catch (error) {
      console.warn('Firestore fetchRanked error:', error);
      return [];
    }
  }

  /**
   * Listens to real-time updates from Firestore cloud leaderboard
   */
  static subscribeToLeaderboard(
    classLevel: ClassLevel | 'all',
    onUpdate: (entries: LeaderboardEntry[]) => void
  ): Unsubscribe {
    const colRef = collection(db, LEADERBOARD_COLLECTION);
    const q = classLevel && classLevel !== 'all'
      ? query(colRef, where('classLevel', '==', Number(classLevel)), limit(100))
      : query(colRef, limit(100));

    return onSnapshot(q, (snap) => {
      const entries: LeaderboardEntry[] = [];
      snap.forEach((d) => {
        entries.push(d.data() as LeaderboardEntry);
      });

      entries.sort((a, b) => {
        if (b.scorePercentage !== a.scorePercentage) {
          return b.scorePercentage - a.scorePercentage;
        }
        if (b.correctCount !== a.correctCount) {
          return b.correctCount - a.correctCount;
        }
        if (a.timeSpentSeconds !== b.timeSpentSeconds) {
          return a.timeSpentSeconds - b.timeSpentSeconds;
        }
        return b.timestamp - a.timestamp;
      });

      onUpdate(entries);
    }, (error) => {
      console.warn('Firestore realtime subscription error:', error);
    });
  }
}
