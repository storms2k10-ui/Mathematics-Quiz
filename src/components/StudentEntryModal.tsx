import React, { useState, useEffect } from 'react';
import { 
  User, 
  GraduationCap, 
  ArrowRight, 
  X, 
  BookOpen
} from 'lucide-react';
import { ClassLevel, TestSessionConfig } from '../types';
import { useAuth } from '../context/AuthContext';

interface StudentEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClass: ClassLevel;
  chapterTitle?: string;
  onStartTest: (config: TestSessionConfig & { track?: string }) => void;
  onOpenAuth?: () => void;
}

export const StudentEntryModal: React.FC<StudentEntryModalProps> = ({
  isOpen,
  onClose,
  defaultClass,
  chapterTitle,
  onStartTest,
  onOpenAuth,
}) => {
  const { currentUser, userProfile } = useAuth();
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(defaultClass);
  const [selectedTrack, setSelectedTrack] = useState<'Elementary Mathematics' | 'Advanced Mathematics'>('Elementary Mathematics');
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [error, setError] = useState<string | null>(null);

  // Sync profile info
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.displayName || '');
      setSelectedClass(userProfile.classLevel || defaultClass);
    } else {
      try {
        const savedName = localStorage.getItem('maths_student_name');
        if (savedName) setName(savedName);
      } catch {
        // ignore
      }
    }
  }, [userProfile, defaultClass]);

  useEffect(() => {
    setSelectedClass(defaultClass);
  }, [defaultClass]);

  if (!isOpen) return null;

  const availableQuestionCounts = [15, 25, 35, 50];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Require authentication
    if (!currentUser && !userProfile) {
      if (onOpenAuth) {
        onClose();
        onOpenAuth();
        return;
      }
    }

    const finalName = name.trim() || userProfile?.displayName || 'Student Candidate';
    if (!finalName) {
      setError('Please enter your name to begin practice.');
      return;
    }

    try {
      localStorage.setItem('maths_student_name', finalName);
    } catch {
      // ignore
    }

    onStartTest({
      student: {
        name: finalName,
        classLevel: selectedClass,
      },
      mode: 'practice',
      questionCount,
      track: selectedTrack,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-indigo-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shadow-inner">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-white/20 text-indigo-100">
                Mathematics Practice
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Start Practice Session
              </h2>
            </div>
          </div>

          {chapterTitle && (
            <div className="mt-3 pt-3 border-t border-white/15 flex items-center gap-2 text-xs text-indigo-100">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chapter: <strong className="text-white">{chapterTitle}</strong></span>
            </div>
          )}
        </div>

        {/* Auth prompt banner if not logged in */}
        {!currentUser && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800/60 px-6 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <span className="font-medium">Sign in is required to track accuracy &amp; sync scores.</span>
            {onOpenAuth && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Student Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Candidate Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {/* Class Level Selector: Class 9, 10, 11, and 12 */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Class Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {([9, 10, 11, 12] as ClassLevel[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSelectedClass(lvl)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    selectedClass === lvl
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  Class {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Track Selector: Elementary Mathematics vs Advanced Mathematics */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Mathematics Track
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTrack('Elementary Mathematics')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                  selectedTrack === 'Elementary Mathematics'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="block font-bold">Elementary Mathematics</span>
                <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Core concepts &amp; formulas</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTrack('Advanced Mathematics')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                  selectedTrack === 'Advanced Mathematics'
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="block font-bold">Advanced Mathematics</span>
                <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Competitive &amp; proofs</span>
              </button>
            </div>
          </div>

          {/* Question Count Selector: 15, 25, 35, 50 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Number of MCQs
              </label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {availableQuestionCounts.map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    questionCount === count
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                  }`}
                >
                  {count} MCQs
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Practice {selectedTrack} ({questionCount} MCQs)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
