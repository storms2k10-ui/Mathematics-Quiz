import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  X, 
  Trophy, 
  Sparkles,
  Clock, 
  Atom,
  Sigma,
  Zap,
  Star,
  CheckCircle2,
  XCircle,
  Award
} from 'lucide-react';
import { LeaderboardEntry, ClassLevel } from '../types';
import { MathService } from '../services/mathService';
import { FirestoreLeaderboardService } from '../services/firestoreLeaderboard';

export type LeaderboardTrack = 
  | 'Elementary Mathematics' 
  | 'Advanced Mathematics' 
  | 'Elementary Physics' 
  | 'Advanced Physics';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClass?: ClassLevel | 'all';
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  initialClass = 'all',
}) => {
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassLevel | 'all'>('all');
  const [selectedTrack, setSelectedTrack] = useState<LeaderboardTrack>('Elementary Mathematics');

  const loadLeaderboardData = useCallback(async () => {
    try {
      // 1. Try Firebase Firestore Cloud Database first
      const firestoreData = await FirestoreLeaderboardService.fetchRanked('all', 'practice', selectedTrack);
      if (firestoreData && firestoreData.length > 0) {
        setAllEntries(firestoreData);
        return;
      }

      // 2. Fallback to Node.js Server API
      const serverEntries = await MathService.fetchServerLeaderboard('all', 'practice');
      if (serverEntries && serverEntries.length > 0) {
        setAllEntries(serverEntries);
      } else {
        const local = MathService.getRankedLeaderboard('all', 'practice');
        setAllEntries(local);
      }
    } catch {
      const local = MathService.getRankedLeaderboard('all', 'practice');
      setAllEntries(local);
    }
  }, [selectedTrack]);

  // Initial load and Real-time Firestore Cloud listener
  useEffect(() => {
    if (!isOpen) return;

    loadLeaderboardData();

    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = FirestoreLeaderboardService.subscribeToLeaderboard('all', (cloudEntries) => {
        if (cloudEntries && cloudEntries.length > 0) {
          setAllEntries(cloudEntries);
        }
      }, selectedTrack);
    } catch (e) {
      console.warn('Firestore subscription fallback:', e);
    }

    const interval = setInterval(() => {
      loadLeaderboardData();
    }, 5000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(interval);
    };
  }, [isOpen, selectedTrack, loadLeaderboardData]);

  // Synchronously filter and rank entries based on selectedClass and selectedTrack
  const filteredEntries = useMemo(() => {
    return allEntries.filter((e) => {
      if (!e) return false;
      // Exclude mock test entries
      if (e.mode === 'exam' || (e.chapterName && e.chapterName.toLowerCase().includes('mock'))) return false;
      // Exclude legacy seed entries
      if (e.id && e.id.startsWith('lead-seed-')) return false;

      // Track / Subject Isolation
      if (selectedTrack.includes('Physics')) {
        if (!e.track || !e.track.includes('Physics')) return false;
      } else {
        if (e.track && e.track.includes('Physics')) return false;
      }
      if (e.track && e.track !== selectedTrack) return false;

      // Class Isolation
      if (selectedClass !== 'all') {
        if (Number(e.classLevel) !== Number(selectedClass)) return false;
      }

      return true;
    }).sort((a, b) => {
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
  }, [allEntries, selectedClass, selectedTrack]);

  if (!isOpen) return null;

  const calculateRating = (entry: LeaderboardEntry) => {
    const accuracy = entry.scorePercentage || 0;
    const correct = entry.correctCount || 0;
    const ratingScore = Math.round((accuracy * 20) + (correct * 12));

    if (ratingScore >= 2200) {
      return { score: ratingScore, title: 'Grandmaster', stars: 5, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700' };
    }
    if (ratingScore >= 1800) {
      return { score: ratingScore, title: 'Master', stars: 4, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700' };
    }
    if (ratingScore >= 1400) {
      return { score: ratingScore, title: 'Expert', stars: 3, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700' };
    }
    if (ratingScore >= 1000) {
      return { score: ratingScore, title: 'Scholar', stars: 2, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-700' };
    }
    return { score: ratingScore, title: 'Apprentice', stars: 1, color: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700' };
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 font-black text-sm flex items-center justify-center border border-amber-300 dark:border-amber-700 shadow-sm shrink-0">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-sm flex items-center justify-center border border-slate-300 dark:border-slate-600 shadow-sm shrink-0">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-black text-sm flex items-center justify-center border border-amber-300/60 dark:border-amber-800 shadow-sm shrink-0">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-black text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-5 sm:p-6 text-white relative flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Trophy className="w-6 h-6 text-amber-300 fill-amber-300 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-400/30 text-amber-200 border border-amber-300/30">
                  Global Hall of Fame
                </span>
                <span className="text-[11px] text-white/80 font-medium hidden sm:inline">
                  Accuracy &amp; Skill Rating Engine ⚡
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Academic Leaderboard &amp; Ratings
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Controls Bar: Track Selector + Class Switcher */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 space-y-3">
          
          {/* 4 Track Options */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl">
            {([
              { id: 'Elementary Mathematics', label: 'Elementary Mathematics', icon: Sigma },
              { id: 'Advanced Mathematics', label: 'Advanced Mathematics', icon: Sparkles },
              { id: 'Elementary Physics', label: 'Elementary Physics', icon: Atom },
              { id: 'Advanced Physics', label: 'Advanced Physics', icon: Zap },
            ] as { id: LeaderboardTrack; label: string; icon: any }[]).map((tr) => {
              const Icon = tr.icon;
              return (
                <button
                  key={tr.id}
                  onClick={() => setSelectedTrack(tr.id)}
                  className={`flex-1 min-w-[140px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedTrack === tr.id
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tr.label}</span>
                </button>
              );
            })}
          </div>

          {/* Class Switcher Tabs (Click filters instantly) */}
          <div className="flex flex-wrap items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 w-full gap-1">
            <button
              onClick={() => setSelectedClass('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedClass === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Classes ({allEntries.filter(e => e.track === selectedTrack).length})
            </button>
            {([9, 10, 11, 12] as ClassLevel[]).map((lvl) => {
              const classCount = allEntries.filter(e => e.track === selectedTrack && Number(e.classLevel) === lvl).length;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedClass(lvl)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedClass === lvl
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>Class {lvl}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${selectedClass === lvl ? 'bg-indigo-700 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {classCount}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Leaderboard List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Rankings for {selectedTrack} {selectedClass !== 'all' ? `(Class ${selectedClass})` : ''}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {selectedTrack.includes('Physics')
                  ? 'Physics chapter practice records will appear here as candidates complete practice sessions.'
                  : 'Be the first candidate to complete an Elementary or Advanced Mathematics session and claim the top ranking!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry, index) => {
                const rating = calculateRating(entry);
                const wrongCount = Math.max(0, entry.totalQuestions - entry.correctCount);

                return (
                  <div
                    key={entry.id || index}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      index === 0
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80 shadow-xs'
                        : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {getRankBadge(index + 1)}

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {entry.studentName}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                            Class {entry.classLevel}
                          </span>

                          {/* Skill Rating Badge */}
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${rating.color}`}>
                            <Award className="w-3 h-3" />
                            <span>{rating.title} ({rating.score})</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="truncate max-w-[180px] sm:max-w-xs">{entry.chapterName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {entry.formattedTime || `${entry.timeSpentSeconds}s`}
                          </span>
                          <span>•</span>
                          <span>{entry.formattedDate || 'Recent'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Profile Accuracy & Breakdown */}
                    <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                      
                      {/* Correct vs Incorrect Breakdown visible to everyone */}
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{entry.correctCount} Correct</span>
                        </div>
                        {wrongCount > 0 && (
                          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-800/60">
                            <XCircle className="w-3 h-3" />
                            <span>{wrongCount} Wrong</span>
                          </div>
                        )}
                      </div>

                      {/* Accuracy Score */}
                      <div className="text-right pl-2 border-l border-slate-200 dark:border-slate-800">
                        <div className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
                          {entry.scorePercentage}%
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">
                          Accuracy
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
