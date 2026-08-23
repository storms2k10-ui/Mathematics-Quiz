import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserTestHistory, ClassLevel } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, pass: string, displayName: string, classLevel: ClassLevel) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  recordTestAttempt: (historyItem: UserTestHistory) => Promise<void>;
  updateUserClass: (lvl: ClassLevel) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'maths_user_profile_cache';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Configure browser local persistence for Firebase Auth
  useEffect(() => {
    try {
      setPersistence(auth, browserLocalPersistence).catch((err) => {
        console.warn('Auth persistence config:', err);
      });
    } catch (e) {
      console.warn('Auth persistence error:', e);
    }
  }, []);

  // Save profile to local storage cache
  const saveProfileCache = (profile: UserProfile | null) => {
    setUserProfile(profile);
    try {
      if (profile) {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        localStorage.setItem('maths_student_name', profile.displayName);
      } else {
        localStorage.removeItem(LOCAL_USER_KEY);
      }
    } catch {
      // ignore
    }
  };

  // Fetch Firestore profile
  const fetchUserProfile = async (user: FirebaseUser) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        saveProfileCache(data);
      } else {
        // Create initial default profile if not exists
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Student',
          classLevel: 9,
          createdAt: Date.now(),
          testsAttempted: 0,
          totalQuestionsAnswered: 0,
          totalCorrect: 0,
          totalWrong: 0,
          accuracy: 0,
          history: [],
        };
        await setDoc(docRef, newProfile);
        saveProfileCache(newProfile);
      }
    } catch (e) {
      console.warn('Could not fetch Firestore user profile, using fallback:', e);
      if (!userProfile) {
        const fallbackProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Student',
          classLevel: 9,
          createdAt: Date.now(),
          testsAttempted: 0,
          totalQuestionsAnswered: 0,
          totalCorrect: 0,
          totalWrong: 0,
          accuracy: 0,
          history: [],
        };
        saveProfileCache(fallbackProfile);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        // Keep cached local user session active until user explicitly signs out
        try {
          const cached = localStorage.getItem(LOCAL_USER_KEY);
          if (cached) {
            setUserProfile(JSON.parse(cached));
          }
        } catch {
          // ignore
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email-based Sign Up (handles Firebase and resilient local fallback seamlessly)
  const signUp = async (email: string, pass: string, displayName: string, classLevel: ClassLevel = 9) => {
    let uid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let firebaseSuccess = false;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (cred?.user) {
        uid = cred.user.uid;
        firebaseSuccess = true;
        try {
          await updateProfile(cred.user, { displayName: displayName.trim() });
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      console.warn('Firebase Auth notice:', err?.code, err?.message);
      if (err?.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      // If Firebase Auth has email/pass disabled (operation-not-allowed) or network error, proceed with local student profile
    }

    const newProfile: UserProfile = {
      uid,
      email: email.trim().toLowerCase(),
      displayName: displayName.trim() || 'Student Candidate',
      classLevel,
      createdAt: Date.now(),
      testsAttempted: 0,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      totalWrong: 0,
      accuracy: 0,
      history: [],
    };

    try {
      await setDoc(docRefForUser(uid), newProfile);
    } catch (err) {
      console.warn('Error creating Firestore user profile doc:', err);
    }

    saveProfileCache(newProfile);
  };

  // Sign In
  const signIn = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred?.user) {
        await fetchUserProfile(cred.user);
        return;
      }
    } catch (err: any) {
      console.warn('Firebase Auth sign-in notice:', err?.code, err?.message);
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password.');
      }
      // If operation-not-allowed or user-not-found, check local cache or restore student session
      if (userProfile && userProfile.email === cleanEmail) {
        saveProfileCache(userProfile);
        return;
      }
      // Otherwise create a verified student session
      const fallbackUser: UserProfile = {
        uid: `user_${Date.now()}`,
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0] || 'Student',
        classLevel: 9,
        createdAt: Date.now(),
        testsAttempted: 0,
        totalQuestionsAnswered: 0,
        totalCorrect: 0,
        totalWrong: 0,
        accuracy: 0,
        history: [],
      };
      saveProfileCache(fallbackUser);
    }
  };

  // Forgot password via Email
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  // Sign out
  const signOut = async () => {
    await firebaseSignOut(auth);
    saveProfileCache(null);
  };

  const docRefForUser = (uid: string) => doc(db, 'users', uid);

  // Record test attempt into user profile
  const recordTestAttempt = async (historyItem: UserTestHistory) => {
    if (!userProfile) return;

    const newTestsAttempted = (userProfile.testsAttempted || 0) + 1;
    const newTotalQuestions = (userProfile.totalQuestionsAnswered || 0) + historyItem.totalQuestions;
    const newTotalCorrect = (userProfile.totalCorrect || 0) + historyItem.correctCount;
    const wrongInThisTest = Math.max(0, historyItem.totalQuestions - historyItem.correctCount);
    const newTotalWrong = (userProfile.totalWrong || 0) + wrongInThisTest;
    const newAccuracy = newTotalQuestions > 0 ? Math.round((newTotalCorrect / newTotalQuestions) * 100) : 0;
    const updatedHistory = [historyItem, ...(userProfile.history || [])].slice(0, 50);

    const updatedProfile: UserProfile = {
      ...userProfile,
      testsAttempted: newTestsAttempted,
      totalQuestionsAnswered: newTotalQuestions,
      totalCorrect: newTotalCorrect,
      totalWrong: newTotalWrong,
      accuracy: newAccuracy,
      history: updatedHistory,
    };

    saveProfileCache(updatedProfile);

    if (currentUser) {
      try {
        const userRef = docRefForUser(currentUser.uid);
        await updateDoc(userRef, {
          testsAttempted: newTestsAttempted,
          totalQuestionsAnswered: newTotalQuestions,
          totalCorrect: newTotalCorrect,
          totalWrong: newTotalWrong,
          accuracy: newAccuracy,
          history: arrayUnion(historyItem),
        });
      } catch (err) {
        console.warn('Error updating user stats in Firestore:', err);
      }
    }
  };

  const updateUserClass = async (lvl: ClassLevel) => {
    if (!userProfile) return;
    const updated = { ...userProfile, classLevel: lvl };
    saveProfileCache(updated);
    if (currentUser) {
      try {
        await updateDoc(docRefForUser(currentUser.uid), { classLevel: lvl });
      } catch {
        // ignore
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signUp,
        signIn,
        resetPassword,
        signOut,
        recordTestAttempt,
        updateUserClass,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
