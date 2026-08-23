import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  User, 
  GraduationCap, 
  Calculator,
  Lightbulb,
  Sparkles,
  Flame,
  Zap,
  Trophy,
  Edit3,
  Check,
  X,
  Home,
  Sun,
  Moon
} from 'lucide-react';
import { Question, ClassLevel, StudentProfile } from '../types';
import { MathService } from '../services/mathService';
import { MathText } from './MathText';
import { useTheme } from '../context/ThemeContext';

interface ScoreViewProps {
  classLevel: ClassLevel;
  chapterTitle: string;
  questions: Question[];
  userAnswers: Record<number, {
    questionId: string;
    selectedOption: 'A' | 'B' | 'C' | 'D' | null;
    isCorrect: boolean;
    timeSpentSeconds: number;
    timedOut?: boolean;
  }>;
  totalTimeSeconds: number;
  studentProfile?: StudentProfile;
  mode?: 'practice' | 'exam';
  leaderboardEntryId?: string;
  onRestartQuiz: () => void;
  onSelectAnotherChapter: () => void;
  onBackToClass: (classLevel: ClassLevel) => void;
  onBackToHome?: () => void;
  onOpenLeaderboard?: () => void;
}

export const ScoreView: React.FC<ScoreViewProps> = ({
  classLevel,
  chapterTitle,
  questions,
  userAnswers,
  totalTimeSeconds,
  studentProfile,
  mode = 'practice',
  leaderboardEntryId,
  onRestartQuiz,
  onSelectAnotherChapter,
  onBackToClass,
  onBackToHome,
  onOpenLeaderboard,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Maintain consistent entry ID for server updates
  const [attemptEntryId] = useState<string>(() => {
    return leaderboardEntryId || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  });

  // Student name adjustment & live server sync state
  const [studentName, setStudentName] = useState<string>(() => {
    return studentProfile?.name || localStorage.getItem('maths_student_name') || 'Student Candidate';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(studentName);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('Saved & Synced to Cloud Leaderboard');

  const totalQuestions = questions.length;
  const correctCount = Object.keys(userAnswers).reduce((acc, key) => {
    const ans = userAnswers[Number(key)];
    return ans && ans.isCorrect ? acc + 1 : acc;
  }, 0);
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const isPerfectScore = percentage === 100;

  // Auto-sync score to Firestore cloud and server on mount
  useEffect(() => {
    const syncCurrentAttempt = async () => {
      try {
        const mins = Math.floor(totalTimeSeconds / 60);
        const secs = totalTimeSeconds % 60;
        const formattedTime = `${mins}m ${secs.toString().padStart(2, '0')}s`;

        await MathService.saveLeaderboardEntry({
          id: attemptEntryId,
          studentName: studentName,
          classLevel: classLevel,
          section: studentProfile?.section || 'Standard',
          chapterId: questions[0]?.chapter_id || 'general_quiz',
          chapterName: chapterTitle,
          mode: mode === 'exam' ? 'exam' : 'practice',
          correctCount,
          totalQuestions,
          scorePercentage: percentage,
          timeSpentSeconds: totalTimeSeconds,
          formattedTime,
          timestamp: Date.now(),
          formattedDate: 'Just now',
        });
      } catch (err) {
        console.warn('Auto-sync score attempt note:', err);
      }
    };
    syncCurrentAttempt();
  }, [attemptEntryId, studentName, classLevel, studentProfile, chapterTitle, questions, mode, correctCount, totalQuestions, percentage, totalTimeSeconds]);

  // Handle name change and instant sync to server leaderboard
  const handleSaveStudentName = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tempName.trim()) return;
    const newName = tempName.trim();
    setStudentName(newName);
    setIsEditingName(false);
    setIsSyncing(true);
    setSyncStatus('Syncing to Cloud Database...');

    try {
      localStorage.setItem('maths_student_name', newName);

      const mins = Math.floor(totalTimeSeconds / 60);
      const secs = totalTimeSeconds % 60;
      const formattedTime = `${mins}m ${secs.toString().padStart(2, '0')}s`;

      await MathService.saveLeaderboardEntry({
        id: attemptEntryId,
        studentName: newName,
        classLevel: classLevel,
        section: studentProfile?.section || 'Standard',
        chapterId: questions[0]?.chapter_id || 'general_quiz',
        chapterName: chapterTitle,
        mode: mode === 'exam' ? 'exam' : 'practice',
        correctCount,
        totalQuestions,
        scorePercentage: percentage,
        timeSpentSeconds: totalTimeSeconds,
        formattedTime,
        timestamp: Date.now(),
        formattedDate: 'Just now',
      });
      setSyncStatus(`Live Synced as "${newName}"`);
    } catch {
      setSyncStatus('Cached locally');
    } finally {
      setIsSyncing(false);
    }
  };

  // Multi-stage firework celebration launcher
  const launchFireworks = () => {
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    // Stage 1: Left & Right fireworks cannons
    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      // Fireworks from left corner
      confetti({
        startVelocity: 45,
        spread: 360,
        ticks: 90,
        origin: { x: Math.random() * 0.3, y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#ec4899', '#6366f1', '#10b981', '#38bdf8', '#fbbf24'],
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });

      // Fireworks from right corner
      confetti({
        startVelocity: 45,
        spread: 360,
        ticks: 90,
        origin: { x: 0.7 + Math.random() * 0.3, y: Math.random() - 0.2 },
        colors: ['#e11d48', '#8b5cf6', '#14b8a6', '#facc15', '#f43f5e', '#a855f7'],
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });

      // High altitude center starburst
      confetti({
        particleCount: 50,
        startVelocity: 35,
        spread: 120,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#ffd700', '#ffae00', '#ffffff', '#ff4500'],
      });
    }, 350);
  };

  useEffect(() => {
    if (isPerfectScore) {
      launchFireworks();
    } else if (percentage >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    }
  }, [percentage, isPerfectScore]);

  // Performance Assessment
  const getPerformanceFeedback = () => {
    if (percentage === 100) {
      return {
        title: '100% Flawless Mathematical Accuracy!',
        subtitle: 'Incredible achievement! Every single mathematical question was solved with 100% precision and flawless mastery.',
        badge: '🏆 Perfect 100% Score / Gold Distinction',
        badgeColor: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/30',
        borderGlow: 'border-amber-400 dark:border-amber-500 animate-firework-glow',
      };
    }
    if (percentage >= 90) {
      return {
        title: 'Outstanding Mathematical Mastery!',
        subtitle: 'You demonstrated an exceptional command of concepts, formulae, and problem-solving techniques.',
        badge: 'Distinction / Grade A+',
        badgeColor: 'bg-emerald-500 text-white',
        borderGlow: 'border-emerald-500/50',
      };
    }
    if (percentage >= 70) {
      return {
        title: 'Great Problem Solving!',
        subtitle: 'Solid conceptual understanding. Review the step-by-step mathematical explanations below to refine minor errors.',
        badge: 'Proficient / Grade A',
        badgeColor: 'bg-indigo-600 text-white',
        borderGlow: 'border-indigo-500/50',
      };
    }
    if (percentage >= 50) {
      return {
        title: 'Good Attempt!',
        subtitle: 'You have a fair foundation, but further review of fundamental formulae and identities is advised.',
        badge: 'Developing / Grade B',
        badgeColor: 'bg-amber-500 text-white',
        borderGlow: 'border-amber-500/50',
      };
    }
    return {
      title: 'Practice Needed',
      subtitle: 'Review the step-by-step mathematical explanations below and attempt this chapter again.',
      badge: 'Review Required / Grade C',
      badgeColor: 'bg-rose-500 text-white',
      borderGlow: 'border-rose-500/50',
    };
  };

  const feedback = getPerformanceFeedback();

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const filteredQuestions = questions.map((q, idx) => ({ q, idx })).filter(({ idx }) => {
    const ans = userAnswers[idx];
    if (filterType === 'correct') return ans?.isCorrect;
    if (filterType === 'incorrect') return !ans?.isCorrect;
    return true;
  });

  return (
    <div id="score-summary-view" className="py-6 sm:py-8 bg-slate-50 dark:bg-slate-950 min-h-screen animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Distraction-free Scorecard Top Navigation Bar */}
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Home className="w-3.5 h-3.5 text-indigo-500" />
                <span>Return to Home</span>
              </button>
            )}
            <button
              onClick={onSelectAnotherChapter}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Other Chapters</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs font-semibold text-slate-500 dark:text-slate-400">
              Class {classLevel} Performance Scorecard
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Toggle Day/Night theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>
        </div>

        {/* 100% Perfect Score Fireworks Celebration Hero Banner */}
        {isPerfectScore && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white shadow-2xl space-y-4 animate-slide-fade relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg text-3xl">
                  🎆
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black uppercase tracking-wider text-amber-200">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Flawless 100% Accuracy Masterclass</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
                    Fireworks Celebration Unlocked!
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 font-medium">
                    You answered all {totalQuestions} questions with 100% mathematical precision!
                  </p>
                </div>
              </div>

              <button
                onClick={launchFireworks}
                className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-amber-100 font-extrabold text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 hover:scale-105 active:scale-95"
              >
                <span>🎆 Launch Fireworks Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Scorecard Header */}
        <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border ${feedback.borderGlow} shadow-xl space-y-6 relative overflow-hidden`}>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Candidate & Chapter Info */}
            <div className="space-y-3 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${feedback.badgeColor} shadow-xs`}>
                  {feedback.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Class {classLevel} • {chapterTitle}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {feedback.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                {feedback.subtitle}
              </p>

              {/* Candidate Info with Name Adjustment & Server Leaderboard Auto-Sync */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    {isEditingName ? (
                      <form onSubmit={handleSaveStudentName} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          placeholder="Enter your name"
                          autoFocus
                          className="px-2.5 py-1 text-xs rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="submit"
                          disabled={isSyncing}
                          className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                          title="Save and sync name to leaderboard"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTempName(studentName);
                            setIsEditingName(false);
                          }}
                          className="p-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-300">
                          Candidate: <strong className="text-slate-900 dark:text-white text-sm font-black">{studentName}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setTempName(studentName);
                            setIsEditingName(true);
                          }}
                          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                          title="Adjust Candidate Name"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Leaderboard Auto-Sync Status Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                    <span>{isSyncing ? 'Syncing...' : syncStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Twin Circles (Light Green for Accuracy of Correct Questions & Light Red for Percentage of Wrong Questions) */}
            <div className="shrink-0 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Light Green Circle: Accuracy of Correct Questions */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <div className="w-28 h-28 rounded-full border-4 border-emerald-400 dark:border-emerald-500 flex flex-col items-center justify-center bg-white dark:bg-emerald-900/30 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-300">
                    {percentage}%
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Correct Accuracy
                  </span>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-200">
                    {correctCount} / {totalQuestions} Correct
                  </span>
                </div>
              </div>

              {/* Light Red Circle: Percentage of Wrong Questions */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60">
                <div className="w-28 h-28 rounded-full border-4 border-rose-400 dark:border-rose-500 flex flex-col items-center justify-center bg-white dark:bg-rose-900/30 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-300">
                    {totalQuestions > 0 ? Math.round((incorrectCount / totalQuestions) * 100) : 0}%
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    Wrong Questions
                  </span>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs font-extrabold text-rose-800 dark:text-rose-200">
                    {incorrectCount} / {totalQuestions} Mistakes
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
            <button
              onClick={onRestartQuiz}
              className="flex-1 min-w-[160px] py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>

            {onOpenLeaderboard && (
              <button
                onClick={onOpenLeaderboard}
                className="flex-1 min-w-[160px] py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-200" />
                <span>View Leaderboard</span>
              </button>
            )}

            <button
              onClick={onSelectAnotherChapter}
              className="flex-1 min-w-[160px] py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Other Chapters</span>
            </button>

            <button
              onClick={() => onBackToClass(classLevel)}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Class {classLevel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Detailed Solutions & Step-by-Step Explanations Section with KaTeX */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Detailed Solutions &amp; Question Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Step-by-step mathematical derivations and KaTeX proofs for each question.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({totalQuestions})
              </button>
              <button
                onClick={() => setFilterType('correct')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'correct'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Correct ({correctCount})
              </button>
              <button
                onClick={() => setFilterType('incorrect')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'incorrect'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Incorrect ({incorrectCount})
              </button>
            </div>
          </div>

          {/* Question Review List */}
          <div className="space-y-4">
            {filteredQuestions.map(({ q, idx }) => {
              const ans = userAnswers[idx];
              const isCorrect = ans?.isCorrect;
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                  }`}
                >
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Question {idx + 1}
                          </span>
                          {ans?.timedOut && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                              ⏱️ 1-Min Timed Out (Marked Wrong)
                            </span>
                          )}
                          {!ans?.selectedOption && !ans?.timedOut && !isCorrect && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              Unattempted (Marked Wrong)
                            </span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                          <MathText text={q.question} />
                        </div>
                      </div>
                    </div>

                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 cursor-pointer">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Solution View */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-0 border-t border-slate-200/50 dark:border-slate-800 space-y-4">
                      
                      {/* Options Review Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                          const isUserChoice = ans?.selectedOption === opt;
                          const isAnswer = q.correct_answer === opt;
                          const optText = q.options?.[opt] || q[`option_${opt.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`] || '';

                          let itemStyle = 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                          let badgeStyle = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                          if (isAnswer) {
                            itemStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-400/50';
                            badgeStyle = 'bg-emerald-600 text-white font-bold';
                          } else if (isUserChoice && !isAnswer) {
                            itemStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-500 text-rose-950 dark:text-rose-200 font-semibold ring-1 ring-rose-400/50';
                            badgeStyle = 'bg-rose-600 text-white font-bold';
                          }

                          return (
                            <div
                              key={opt}
                              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${itemStyle}`}
                            >
                              <span className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-[11px] ${badgeStyle}`}>
                                {opt}
                              </span>
                              <div className="flex-1">
                                <MathText text={optText} />
                              </div>
                              {isAnswer && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span className="hidden sm:inline">Correct</span>
                                </span>
                              )}
                              {isUserChoice && !isAnswer && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0">
                                  <XCircle className="w-4 h-4" />
                                  <span className="hidden sm:inline">Your Pick</span>
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box with KaTeX */}
                      <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-indigo-500/30 space-y-2">
                        <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5" />
                          Complete Step-by-Step Mathematical Derivation:
                        </span>
                        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                          <MathText text={q.explanation} />
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
