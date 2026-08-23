import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  GraduationCap, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  LogOut, 
  Calendar, 
  Sparkles, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ClassLevel } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClass?: (lvl: ClassLevel) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSelectClass,
}) => {
  const { userProfile, signOut, updateUserClass } = useAuth();

  if (!isOpen || !userProfile) return null;

  const totalQuestions = userProfile.totalQuestionsAnswered || 0;
  const totalCorrect = userProfile.totalCorrect || 0;
  const totalWrong = userProfile.totalWrong || 0;
  const correctPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const wrongPct = totalQuestions > 0 ? Math.round((totalWrong / totalQuestions) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-6 text-white relative flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shadow-inner font-black text-lg">
              {userProfile.displayName?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-white/20 text-indigo-100">
                  Student Profile
                </span>
                <span className="text-[11px] text-indigo-200 font-medium">
                  Class {userProfile.classLevel} Candidate
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {userProfile.displayName}
              </h2>
              <p className="text-xs text-indigo-100/80 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{userProfile.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Accuracy & Error Rates Section: Light Green for Correct & Light Red for Wrong */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Overall Performance Analytics
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Light Green Circle: Accuracy of Correct Questions */}
              <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-400 dark:border-emerald-500 bg-white dark:bg-emerald-900/40 flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-300">
                    {correctPct}%
                  </span>
                  <span className="text-[9px] font-extrabold uppercase text-emerald-700/80 dark:text-emerald-400 tracking-tight">
                    Accuracy
                  </span>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Correct Questions</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
                    {totalCorrect}{' '}
                    <span className="text-xs font-normal text-emerald-700/80 dark:text-emerald-400">
                      / {totalQuestions} answered
                    </span>
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Validated step-by-step mathematical answers
                  </p>
                </div>
              </div>

              {/* Light Red Circle: Percentage of Wrong Questions */}
              <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-4 border-rose-400 dark:border-rose-500 bg-white dark:bg-rose-900/40 flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span className="text-xl font-black text-rose-600 dark:text-rose-300">
                    {wrongPct}%
                  </span>
                  <span className="text-[9px] font-extrabold uppercase text-rose-700/80 dark:text-rose-400 tracking-tight">
                    Mistakes
                  </span>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 text-xs font-bold">
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Wrong Questions</span>
                  </div>
                  <p className="text-2xl font-black text-rose-900 dark:text-rose-100">
                    {totalWrong}{' '}
                    <span className="text-xs font-normal text-rose-700/80 dark:text-rose-400">
                      errors to review
                    </span>
                  </p>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400">
                    Targeted practice recommended for missed topics
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                Tests Attempted
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {userProfile.testsAttempted || 0}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                Total MCQs
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {totalQuestions}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                Registered Class
              </span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                Class {userProfile.classLevel}
              </span>
            </div>
          </div>

          {/* Class Switching in Profile */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Change Active Mathematics Class
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {([9, 10, 11, 12] as ClassLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    updateUserClass(lvl);
                    if (onSelectClass) onSelectClass(lvl);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    userProfile.classLevel === lvl
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  Class {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Test Attempt History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Recent Practice History</span>
              </h4>
              <span className="text-xs text-slate-400 font-medium">
                {userProfile.history?.length || 0} attempts
              </span>
            </div>

            {(!userProfile.history || userProfile.history.length === 0) ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No practice test attempts recorded yet.
                </p>
                <p className="text-[11px] text-slate-500">
                  Start an Elementary Mathematics or Advance Mathematics session to see your test logs here.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {userProfile.history.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {item.chapterName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                          Class {item.classLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span>{item.track || 'Elementary Mathematics'}</span>
                        <span>•</span>
                        <span>{item.formattedTime || `${item.timeSpentSeconds}s`}</span>
                        <span>•</span>
                        <span>{item.formattedDate || 'Recent'}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-sm font-black ${
                        item.scorePercentage >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                        item.scorePercentage >= 50 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {item.scorePercentage}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {item.correctCount}/{item.totalQuestions} Correct
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
