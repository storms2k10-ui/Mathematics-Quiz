import React, { useState, useEffect } from 'react';
import { 
  User, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  X, 
  CheckCircle, 
  Clock, 
  BookOpen
} from 'lucide-react';
import { ClassLevel, TestSessionConfig } from '../types';

interface StudentEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClass: ClassLevel;
  chapterTitle?: string;
  onStartTest: (config: TestSessionConfig) => void;
}

export const StudentEntryModal: React.FC<StudentEntryModalProps> = ({
  isOpen,
  onClose,
  defaultClass,
  chapterTitle,
  onStartTest,
}) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(defaultClass);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);

  // Load saved student profile from localStorage if present
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('maths_student_name');
      if (savedName) setName(savedName);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setSelectedClass(defaultClass);
  }, [defaultClass]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to begin practice.');
      return;
    }

    try {
      localStorage.setItem('maths_student_name', name.trim());
    } catch {
      // ignore
    }

    onStartTest({
      student: {
        name: name.trim(),
        classLevel: selectedClass,
      },
      mode: 'practice',
      questionCount,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-indigo-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/20 text-indigo-100">
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Student Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Student Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your name (e.g., Mahtab Ahmed)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Class Level Selector: Class 9, 10, 11, and 12 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Your Class
            </label>
            <div className="grid grid-cols-4 gap-2">
              {([9, 10, 11, 12] as ClassLevel[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSelectedClass(lvl)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    selectedClass === lvl
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <span className="text-[9px] opacity-85">Maths</span>
                  <span className="text-xs sm:text-sm font-extrabold">Class {lvl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selector: 10, 20, 30, 50 MCQs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Questions to Attempt
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { count: 10, label: '10 MCQs' },
                { count: 20, label: '20 MCQs' },
                { count: 30, label: '30 MCQs' },
                { count: 50, label: '50 MCQs' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.count}
                  onClick={() => setQuestionCount(item.count)}
                  className={`py-2.5 px-1 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    questionCount === item.count
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Practice Mode Info Card */}
          <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Interactive Practice Mode
              </span>
              <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-1 leading-relaxed">
              Provides immediate KaTeX mathematical proofs, step-by-step verified explanations, and instant feedback for every question.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Mathematics Practice ({questionCount} MCQs)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
