import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  Play, 
  Eye,
  Sigma
} from 'lucide-react';
import { Chapter, ClassInfo, ClassLevel } from '../types';
import { ChapterArtwork } from './ChapterArtwork';
import { MathText } from './MathText';

interface ClassPageViewProps {
  currentClass: ClassLevel;
  classInfo: ClassInfo;
  chapters: Chapter[];
  onSelectChapter: (chapter: Chapter) => void;
  onOpenChapterDetails: (chapter: Chapter) => void;
  onClassChange: (lvl: ClassLevel) => void;
  onStartFullClassMock?: (lvl: ClassLevel) => void;
  onBackToHome: () => void;
}

export const ClassPageView: React.FC<ClassPageViewProps> = ({
  currentClass,
  classInfo,
  chapters,
  onSelectChapter,
  onOpenChapterDetails,
  onClassChange,
  onBackToHome,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Extract unique categories for filter pills
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    chapters.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [chapters]);

  const filteredChapters = useMemo(() => {
    return chapters.filter((ch) => {
      return categoryFilter === 'all' || ch.category === categoryFilter;
    });
  }, [chapters, categoryFilter]);

  return (
    <div id="class-page-view" className="py-6 sm:py-8 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-100px)] animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Breadcrumb & Class Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-fit cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          {/* Quick Class Switcher Pill Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            {([9, 10, 11, 12] as ClassLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  onClassChange(lvl);
                  setCategoryFilter('all');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentClass === lvl
                    ? 'bg-indigo-600 text-white shadow-xs scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Class {lvl} Mathematics
              </button>
            ))}
          </div>
        </div>

        {/* Section Header: Practice Elementary Mathematics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Class {currentClass} Chapters
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {filteredChapters.length} Chapters
            </span>
          </div>

          {/* Category Filter Chips */}
          {availableCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                All Topics ({chapters.length})
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chapters Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter, idx) => (
            <div
              key={chapter.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Background Artwork Banner */}
              <div 
                onClick={() => onOpenChapterDetails(chapter)}
                className="cursor-pointer relative group-hover:scale-[1.01] transition-transform duration-300"
              >
                <ChapterArtwork
                  theme={chapter.artTheme}
                  title={chapter.name}
                  category={chapter.category}
                  size="card"
                  className="rounded-b-none border-x-0 border-t-0"
                />

                <div className="absolute top-3 left-3 z-20">
                  <span className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-md text-white font-mono font-bold text-[11px] flex items-center justify-center border border-white/20">
                    {idx + 1}
                  </span>
                </div>
              </div>

              {/* Card Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2.5">
                  <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    <MathText text={chapter.description} />
                  </div>

                  {/* Key Topics Tag Clouds */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {chapter.keyTopics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                      >
                        <MathText text={topic} />
                      </span>
                    ))}
                    {chapter.keyTopics.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-medium">
                        +{chapter.keyTopics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onOpenChapterDetails(chapter)}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Overview</span>
                  </button>

                  <button
                    onClick={() => onSelectChapter(chapter)}
                    className="flex-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Practice Chapter</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
