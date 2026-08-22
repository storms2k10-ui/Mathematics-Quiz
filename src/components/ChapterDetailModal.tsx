import React from 'react';
import { 
  X, 
  Play, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Calculator
} from 'lucide-react';
import { Chapter } from '../types';
import { ChapterArtwork } from './ChapterArtwork';
import { MathText } from './MathText';

interface ChapterDetailModalProps {
  chapter: Chapter | null;
  isOpen: boolean;
  onClose: () => void;
  onStartTest: (chapter: Chapter) => void;
}

export const ChapterDetailModal: React.FC<ChapterDetailModalProps> = ({
  chapter,
  isOpen,
  onClose,
  onStartTest,
}) => {
  if (!isOpen || !chapter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Attractive Background Picture & Artwork Banner */}
        <div className="relative">
          <ChapterArtwork
            theme={chapter.artTheme}
            title={chapter.name}
            category={chapter.category}
            size="modal"
            className="rounded-b-none border-x-0 border-t-0"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Chapter Overview
            </h4>
            <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              <MathText text={chapter.description} />
            </div>
          </div>

          {/* Question Bank Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Chapter Assessment
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Step-by-step mathematical solutions and verified proofs
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Practice Mode
            </span>
          </div>

          {/* Key Topics Covered */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Syllabus Topics Included in this Chapter:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {chapter.keyTopics.map((topic, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <MathText text={topic} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onStartTest(chapter);
              }}
              className="flex-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Attempt Chapter MCQs</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
