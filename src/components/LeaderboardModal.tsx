import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Trophy, 
  Search, 
  Zap, 
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Clock,
  User,
  GraduationCap
} from 'lucide-react';
import { LeaderboardEntry, ClassLevel } from '../types';
import { MathService } from '../services/mathService';
import { FirestoreLeaderboardService } from '../services/firestoreLeaderboard';

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
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassLevel | 'all'>(initialClass);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [syncSource, setSyncSource] = useState<'cloud' | 'server' | 'local'>('cloud');

  const loadLeaderboard = useCallback(async (showLoading = true) => {
    if (showLoading) setIsSyncing(true);
    try {
      // 1. Try Firebase Firestore Cloud Database first (Global Realtime Persistence)
      const firestoreData = await FirestoreLeaderboardService.fetchRanked(selectedClass, 'practice');
      if (firestoreData && firestoreData.length > 0) {
        setEntries(firestoreData);
        setSyncSource('cloud');
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        if (showLoading) setIsSyncing(false);
        return;
      }

      // 2. Fallback to Node.js Server API
      const serverEntries = await MathService.fetchServerLeaderboard(selectedClass, 'practice');
      if (serverEntries && serverEntries.length > 0) {
        setEntries(serverEntries);
        setSyncSource('server');
      } else {
        const local = MathService.getRankedLeaderboard(selectedClass, 'practice');
        setEntries(local);
        setSyncSource('local');
      }
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      const local = MathService.getRankedLeaderboard(selectedClass, 'practice');
      setEntries(local);
      setSyncSource('local');
    } finally {
      if (showLoading) setIsSyncing(false);
    }
  }, [selectedClass]);

  // Initial load and Real-time Firestore Cloud listener
  useEffect(() => {
    if (!isOpen) return;

    loadLeaderboard(true);

    // Subscribe to real-time Firestore updates
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = FirestoreLeaderboardService.subscribeToLeaderboard(selectedClass, (cloudEntries) => {
        if (cloudEntries && cloudEntries.length > 0) {
          setEntries(cloudEntries);
          setSyncSource('cloud');
          setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      });
    } catch (e) {
      console.warn('Firestore subscription fallback:', e);
    }

    // Polling backup interval every 5 seconds
    const interval = setInterval(() => {
      loadLeaderboard(false);
    }, 5000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(interval);
    };
  }, [isOpen, selectedClass, loadLeaderboard]);

  if (!isOpen) return null;

  const filteredEntries = entries.filter((e) => {
    // Exclude any legacy sample seed IDs
    if (e.id && e.id.startsWith('lead-seed-')) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      e.studentName.toLowerCase().includes(query) ||
      e.chapterName.toLowerCase().includes(query) ||
      (e.section && e.section.toLowerCase().includes(query))
    );
  });

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
                  Live Synced Rankings ⚡
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Mathematics Leaderboard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadLeaderboard(true)}
              disabled={isSyncing}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Refresh Live Leaderboard"
              aria-label="Refresh Leaderboard"
            >
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Controls Bar: Class Switcher & Search */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Class Switcher Tabs */}
            <div className="flex flex-wrap items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 w-full sm:w-auto gap-1">
              <button
                onClick={() => setSelectedClass('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedClass === 'all'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Classes
              </button>
              <button
                onClick={() => setSelectedClass(9)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedClass === 9
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Class 9
              </button>
              <button
                onClick={() => setSelectedClass(10)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedClass === 10
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Class 10
              </button>
              <button
                onClick={() => setSelectedClass(11)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedClass === 11
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Class 11
              </button>
              <button
                onClick={() => setSelectedClass(12)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedClass === 12
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Class 12
              </button>
            </div>

            {/* Real-time Cloud Sync Badge */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold">
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                <span>
                  {isSyncing 
                    ? 'Syncing...' 
                    : syncSource === 'cloud' 
                    ? `Live Cloud Synced (${lastSyncedTime})` 
                    : `Server Synced (${lastSyncedTime})`}
                </span>
              </div>
            </div>

          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate by name, section, or chapter..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Leaderboard List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {filteredEntries.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center mx-auto text-indigo-500">
                <Trophy className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Candidate Scores Recorded Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Complete a practice quiz or exam to be the first candidate ranked on the live leaderboard!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              
              {/* List Header */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-5">Candidate &amp; Chapter</div>
                <div className="col-span-2 text-center">Score</div>
                <div className="col-span-2 text-center">Time</div>
                <div className="col-span-2 text-right">Mode / Date</div>
              </div>

              {/* Candidates List Items */}
              {filteredEntries.map((entry, index) => {
                const rank = index + 1;
                const isFirst = rank === 1;
                const isSecond = rank === 2;
                const isThird = rank === 3;
                
                return (
                  <div
                    key={entry.id}
                    className={`p-3.5 sm:px-4 sm:py-3 rounded-2xl border transition-all flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-2 sm:gap-3 ${
                      isFirst
                        ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-600/50 shadow-xs ring-1 ring-amber-400/30'
                        : isSecond
                        ? 'bg-slate-100/90 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 shadow-xs'
                        : isThird
                        ? 'bg-orange-50/90 dark:bg-orange-950/30 border-orange-300 dark:border-orange-700/50 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700/60'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-1 flex items-center gap-2 sm:justify-center">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isFirst
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/20'
                          : isSecond
                          ? 'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-xs'
                          : isThird
                          ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold'
                      }`}>
                        {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `#${rank}`}
                      </div>
                      <span className="sm:hidden text-xs font-bold text-slate-500">
                        Rank #{rank}
                      </span>
                    </div>

                    {/* Candidate Name & Chapter Info */}
                    <div className="col-span-5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          {entry.studentName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          Class {entry.classLevel}
                        </span>
                        {entry.section && entry.section !== 'Standard' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {entry.section}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                        {entry.chapterName}
                      </p>
                    </div>

                    {/* Score / Accuracy */}
                    <div className="col-span-2 flex items-center justify-between sm:justify-center">
                      <span className="sm:hidden text-xs text-slate-500 font-bold">Accuracy:</span>
                      <div className="text-right sm:text-center">
                        <div className={`text-sm font-black ${
                          entry.scorePercentage >= 90
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : entry.scorePercentage >= 70
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {entry.scorePercentage}%
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold">
                          {entry.correctCount}/{entry.totalQuestions} Correct
                        </div>
                      </div>
                    </div>

                    {/* Completion Time */}
                    <div className="col-span-2 flex items-center justify-between sm:justify-center">
                      <span className="sm:hidden text-xs text-slate-500 font-bold">Time Taken:</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-mono font-black" title="Time taken">
                        <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                        <span>{entry.formattedTime}</span>
                      </div>
                    </div>

                    {/* Mode & Date Timestamp */}
                    <div className="col-span-2 flex items-center justify-between sm:justify-end gap-2 text-right">
                      <span className="sm:hidden text-xs text-slate-500 font-bold">Details:</span>
                      <div className="flex flex-col sm:items-end">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          entry.mode === 'exam'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}>
                          {entry.mode || 'practice'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {entry.formattedDate || 'Recent'}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Ranked by highest accuracy percentage, then fastest completion speed.</span>
            <span className="sm:hidden">Ranked by accuracy &amp; speed.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
