import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Home, 
  Share2, 
  Clock, 
  Target, 
  Award, 
  ChevronDown, 
  ChevronUp,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { Question, ClassLevel } from '../types';

interface ResultsViewProps {
  classLevel: ClassLevel;
  chapterTitle: string;
  questions: Question[];
  userAnswers: Record<number, {
    questionId: string;
    selectedOption: 'A' | 'B' | 'C' | 'D';
    isCorrect: boolean;
    timeSpentSeconds: number;
  }>;
  totalTimeSeconds: number;
  onTryAgain: () => void;
  onPracticeAnotherChapter: () => void;
  onBackToHome: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  classLevel,
  chapterTitle,
  questions,
  userAnswers,
  totalTimeSeconds,
  onTryAgain,
  onPracticeAnotherChapter,
  onBackToHome,
}) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const totalQuestions = questions.length;
  const correctCount = Object.values(userAnswers).filter(
    (a): a is { questionId: string; selectedOption: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean; timeSpentSeconds: number } =>
      Boolean(a && typeof a === 'object' && 'isCorrect' in a && a.isCorrect)
  ).length;
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Trigger confetti for high score
  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [percentage]);

  const getPerformanceData = () => {
    if (percentage === 100) {
      return {
        badge: 'Perfect Score! 🌟',
        title: 'Outstanding Mathematical Mastery!',
        message: 'You answered all questions correctly! Your conceptual clarity and mathematical problem-solving skills are top-notch.',
        color: 'text-amber-500 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
      };
    } else if (percentage >= 80) {
      return {
        badge: 'Distinction 🏆',
        title: 'Excellent Performance!',
        message: 'Great command over this chapter! Review the minor mistakes below to reach 100% accuracy.',
        color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800',
      };
    } else if (percentage >= 50) {
      return {
        badge: 'Good Effort 👍',
        title: 'Solid Foundation, Keep Practicing!',
        message: 'You have good grasp on key concepts. Revisit the step-by-step explanations below to strengthen your problem solving.',
        color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
      };
    } else {
      return {
        badge: 'Practice Needed 📚',
        title: 'Review Chapter Concepts',
        message: 'Take time to study the formulas and step-by-step solutions below. Try practicing again to solidify your fundamentals.',
        color: 'text-rose-600 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800',
      };
    }
  };

  const performance = getPerformanceData();

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div id="results-view-container" className="py-8 md:py-12 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-120px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Score Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl mb-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border mb-4 shadow-xs" style={{}} >
            <span className={performance.color + ' px-3 py-1 rounded-full font-bold'}>
              {performance.badge}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {performance.title}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-6">
            Class {classLevel} Mathematics • <strong>{chapterTitle}</strong>
            <br />
            {performance.message}
          </p>

          {/* Big Score Visual */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-indigo-100 dark:border-slate-800 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {percentage}%
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Accuracy
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">Total Score</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {correctCount} / {totalQuestions}
              </span>
            </div>

            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 block mb-1">Correct</span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {correctCount}
              </span>
            </div>

            <div className="bg-rose-50/70 dark:bg-rose-950/40 p-3.5 rounded-2xl border border-rose-200 dark:border-rose-800">
              <span className="text-[11px] font-medium text-rose-700 dark:text-rose-400 block mb-1">Incorrect</span>
              <span className="text-lg sm:text-xl font-extrabold text-rose-700 dark:text-rose-300">
                {incorrectCount}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">Time Taken</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {formatTime(totalTimeSeconds)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              id="try-again-quiz-btn"
              onClick={onTryAgain}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again (Restart Quiz)</span>
            </button>

            <button
              id="practice-another-chapter-btn"
              onClick={onPracticeAnotherChapter}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Practice Another Chapter</span>
            </button>

            <button
              id="back-to-home-from-results-btn"
              onClick={onBackToHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Detailed Question by Question Review Accordion */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Detailed Solutions &amp; Question Review
              </h3>
              <p className="text-xs text-slate-500">
                Review your answers, correct options, and step-by-step mathematical reasoning.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800">
              {questions.length} Questions
            </span>
          </div>

          <div className="space-y-4">
            {questions.map((question, idx) => {
              const answer = userAnswers[idx];
              const isCorrect = answer?.isCorrect ?? false;
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={question.id}
                  id={`review-question-${idx + 1}`}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all"
                >
                  {/* Header row */}
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="w-full text-left p-4 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Correct</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                              <XCircle className="w-4 h-4" />
                              <span>Incorrect</span>
                            </span>
                          )}
                          <span className="text-xs text-slate-400">• Level: {question.difficulty}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {question.question}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      {/* Full Question */}
                      <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-pre-line">
                        {question.question}
                      </p>

                      {/* Options breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                          const isCorrectOpt = question.correct_answer === opt;
                          const isUserSelected = answer?.selectedOption === opt;

                          let style = 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                          if (isCorrectOpt) {
                            style = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isUserSelected && !isCorrectOpt) {
                            style = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200 font-bold';
                          }

                          let optText = question.options?.[opt] || '';
                          if (!optText) {
                            if (opt === 'A') optText = question.option_a || '';
                            if (opt === 'B') optText = question.option_b || '';
                            if (opt === 'C') optText = question.option_c || '';
                            if (opt === 'D') optText = question.option_d || '';
                          }

                          return (
                            <div
                              key={opt}
                              className={`p-2.5 rounded-lg border flex items-center justify-between ${style}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-[10px]">
                                  {opt}
                                </span>
                                <span>{optText}</span>
                              </div>

                              {isCorrectOpt && (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                  ✓ Correct Answer
                                </span>
                              )}
                              {isUserSelected && !isCorrectOpt && (
                                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                                  ✕ Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <p className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            Explanation &amp; Mathematical Steps:
                          </p>
                          <p className="leading-relaxed whitespace-pre-line">
                            {question.explanation}
                          </p>
                          {question.formula && (
                            <div className="mt-2 pt-2 border-t border-indigo-200/50 dark:border-indigo-900/50">
                              <span className="font-mono text-xs bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
                                Formula: {question.formula}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
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
