/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderQuote } from './components/HeaderQuote';
import { Navbar, NavTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ClassPageView } from './components/ClassPageView';
import { ContentView, ContentSection, ContentSubject } from './components/ContentView';
import { QuizView } from './components/QuizView';
import { ScoreView } from './components/ScoreView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { MathPhilosophySection } from './components/MathPhilosophySection';
import { StudentEntryModal } from './components/StudentEntryModal';
import { ChapterDetailModal } from './components/ChapterDetailModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { MathService, shuffleArray } from './services/mathService';
import { Chapter, ClassInfo, ClassLevel, Question, StudentProfile, LeaderboardEntry, TestSessionConfig } from './types';
import { Atom, ArrowLeft } from 'lucide-react';

export default function App() {
  // Navigation / View state
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(9);
  const [activeContentSection, setActiveContentSection] = useState<ContentSection>('definitions');
  const [activeContentSubject, setActiveContentSubject] = useState<ContentSubject>('mathematics');
  const [activePhilosopherType, setActivePhilosopherType] = useState<'mathematicians' | 'physicists'>('mathematicians');
  const [currentView, setCurrentView] = useState<'main' | 'class-page' | 'quiz' | 'results'>('main');

  // Loaded data
  const [classesInfo, setClassesInfo] = useState<ClassInfo[]>([]);
  const [currentChapters, setCurrentChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [targetChapter, setTargetChapter] = useState<Chapter | null>(null);
  const [pendingQuizQuestions, setPendingQuizQuestions] = useState<Question[] | null>(null);
  const [pendingQuizTitle, setPendingQuizTitle] = useState<string>('');
  const [pendingQuizClass, setPendingQuizClass] = useState<ClassLevel>(9);

  // Active Student & Quiz Session State
  const [activeStudent, setActiveStudent] = useState<StudentProfile | undefined>(undefined);
  const [activeTestMode, setActiveTestMode] = useState<'practice' | 'exam'>('practice');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);
  const [activeQuizTitle, setActiveQuizTitle] = useState<string>('');
  const [activeQuizClass, setActiveQuizClass] = useState<ClassLevel>(9);
  const [activeChapterId, setActiveChapterId] = useState<string | undefined>(undefined);

  // Quiz Results State
  const [quizResults, setQuizResults] = useState<{
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
  } | null>(null);

  // Load initial classes data & sync server/cloud leaderboard for all users
  useEffect(() => {
    const loadData = async () => {
      // Purge any legacy sample seed data from earlier sessions
      try {
        const stored = localStorage.getItem('mathematics_class_leaderboard_data');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter((e) => e && e.id && !e.id.startsWith('lead-seed-'));
            if (clean.length !== parsed.length) {
              localStorage.setItem('mathematics_class_leaderboard_data', JSON.stringify(clean));
            }
          }
        }
      } catch {
        // ignore
      }

      setLoading(true);
      const classes = await MathService.getClasses();
      setClassesInfo(classes);
      const chapters = await MathService.getChapters(selectedClass);
      setCurrentChapters(chapters);
      setLoading(false);

      // Preload global leaderboard from Firestore / server in background
      MathService.fetchServerLeaderboard('all', 'practice').catch(() => {});
    };
    loadData();
  }, []);

  // Update chapters when selectedClass changes
  useEffect(() => {
    const loadChapters = async () => {
      const chapters = await MathService.getChapters(selectedClass);
      setCurrentChapters(chapters);
    };
    loadChapters();
  }, [selectedClass]);

  // Handler to navigate between main tabs
  const handleNavigate = (tab: NavTab, classLevel?: ClassLevel) => {
    setActiveTab(tab);
    if (classLevel) {
      setSelectedClass(classLevel);
    }

    if (tab === 'classes') {
      setCurrentView('class-page');
    } else {
      setCurrentView('main');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to navigate specifically to a content section
  const handleNavigateContentSection = (section: ContentSection, subject: ContentSubject = 'mathematics') => {
    setActiveContentSection(section);
    setActiveContentSubject(subject);
    setActiveTab('dictionary');
    setCurrentView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for philosopher type selection
  const handleSelectPhilosopherType = (type: 'mathematicians' | 'physicists') => {
    setActivePhilosopherType(type);
    setActiveTab('philosophy');
    setCurrentView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to select a class from subject dropdown or hero
  const handleSelectClass = (lvl: ClassLevel) => {
    setSelectedClass(lvl);
    setActiveTab('classes');
    setCurrentView('class-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open chapter details modal
  const handleOpenChapterDetails = (chapter: Chapter) => {
    setTargetChapter(chapter);
    setIsChapterModalOpen(true);
  };

  // Trigger test for a specific chapter
  const handlePrepareChapterTest = async (chapter: Chapter) => {
    setTargetChapter(chapter);
    setPendingQuizTitle(chapter.name);
    setPendingQuizClass(chapter.class);
    setPendingQuizQuestions(null);
    setIsStudentModalOpen(true);
  };

  // Trigger practice for a class
  const handlePrepareClassPractice = async (lvl: ClassLevel) => {
    setTargetChapter(null);
    setPendingQuizTitle(`Class ${lvl} Mathematics Practice`);
    setPendingQuizClass(lvl);
    setPendingQuizQuestions(null);
    setIsStudentModalOpen(true);
  };

  // Executes when student enters name, selects class, and clicks "Begin Test"
  const handleStartConfirmedTest = async (config: TestSessionConfig & { track?: string }) => {
    setIsStudentModalOpen(false);
    setIsChapterModalOpen(false);
    setLoading(true);

    let rawQuestions: Question[] = [];

    if (pendingQuizQuestions && pendingQuizQuestions.length > 0) {
      rawQuestions = pendingQuizQuestions;
    } else if (targetChapter) {
      rawQuestions = await MathService.getQuestionsByChapter(targetChapter.id);
    } else {
      rawQuestions = await MathService.getQuickPracticeSet(config.student.classLevel, config.questionCount || 15);
    }

    const count = config.questionCount || 15;
    const shuffled = shuffleArray(rawQuestions);
    const questionsToUse = shuffled.slice(0, Math.min(count, shuffled.length));

    setActiveStudent(config.student);
    setActiveTestMode(config.mode);
    setActiveQuizQuestions(questionsToUse);
    setActiveQuizTitle(pendingQuizTitle || (targetChapter ? targetChapter.name : `Class ${config.student.classLevel} Mathematics Test`));
    setActiveQuizClass(config.student.classLevel);
    setActiveChapterId(targetChapter?.id);
    setCurrentView('quiz');
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler when quiz is completed
  const handleCompleteQuiz = (results: {
    questions: Question[];
    userAnswers: Record<number, {
      questionId: string;
      selectedOption: 'A' | 'B' | 'C' | 'D';
      isCorrect: boolean;
      timeSpentSeconds: number;
    }>;
    totalTimeSeconds: number;
    studentProfile?: StudentProfile;
    mode?: 'practice' | 'exam';
  }) => {
    setQuizResults(results);

    // Calculate scores & timing for the Leaderboard ranking engine
    const student = results.studentProfile || activeStudent;
    const totalQ = results.questions.length;
    const correctCount = Object.values(results.userAnswers).filter(a => a?.isCorrect).length;
    const scorePct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    // Save to Leaderboard
    const savedName = localStorage.getItem('maths_student_name');
    const studentName = student?.name || savedName || 'Student Candidate';
    const mins = Math.floor(results.totalTimeSeconds / 60);
    const secs = results.totalTimeSeconds % 60;
    const formattedTime = `${mins}m ${secs.toString().padStart(2, '0')}s`;
    const attemptId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const leaderboardEntry: LeaderboardEntry = {
      id: attemptId,
      studentName,
      classLevel: student?.classLevel || activeQuizClass || 9,
      section: student?.section || 'Standard',
      chapterId: activeChapterId || 'general_quiz',
      chapterName: activeQuizTitle || `Class ${activeQuizClass} Mathematics`,
      mode: results.mode || activeTestMode || 'practice',
      track: 'Elementary Mathematics',
      correctCount,
      totalQuestions: totalQ,
      scorePercentage: scorePct,
      timeSpentSeconds: results.totalTimeSeconds,
      formattedTime,
      timestamp: Date.now(),
      formattedDate: 'Just now',
    };

    setQuizResults({
      ...results,
      leaderboardEntryId: attemptId,
    });

    MathService.saveLeaderboardEntry(leaderboardEntry);

    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to retry the current quiz
  const handleRestartQuiz = () => {
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to practice another chapter
  const handleSelectAnotherChapter = () => {
    setActiveTab('classes');
    setCurrentView('class-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to return to home/philosophy
  const handleBackToHome = () => {
    setActiveTab('philosophy');
    setCurrentView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Current class info object
  const currentClassInfo = classesInfo.find((c) => c.level === selectedClass) || {
    level: selectedClass,
    title: `Class ${selectedClass} Mathematics`,
    subtitle: 'Elementary & Advanced Mathematics Curriculum',
    description: 'Comprehensive practice for school and board examinations.',
    totalChapters: currentChapters.length,
    totalQuestions: currentChapters.reduce((acc, c) => acc + c.questionCount, 0),
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentColor: 'indigo',
    focusAreas: ['Core Concepts', 'Formulas', 'Theorems', 'Calculations'],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Quote - Hidden in Quiz and Results/Score Views */}
      {!['quiz', 'results'].includes(currentView) && <HeaderQuote />}

      {/* Main Navbar - Hidden in Quiz and Results/Score Views */}
      {!['quiz', 'results'].includes(currentView) && (
        <Navbar
          activeTab={activeTab}
          selectedClass={selectedClass}
          activeContentSection={activeContentSection}
          activePhilosopherType={activePhilosopherType}
          onNavigate={handleNavigate}
          onNavigateContentSection={handleNavigateContentSection}
          onSelectPhilosopherType={handleSelectPhilosopherType}
          onOpenLeaderboard={() => setIsLeaderboardModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1">
        {/* QUIZ VIEW */}
        {currentView === 'quiz' && (
          <QuizView
            classLevel={activeQuizClass}
            chapterTitle={activeQuizTitle}
            questions={activeQuizQuestions}
            studentProfile={activeStudent}
            mode={activeTestMode}
            onCompleteQuiz={handleCompleteQuiz}
            onExitQuiz={() => {
              if (activeTab === 'classes') {
                setCurrentView('class-page');
              } else {
                setCurrentView('main');
              }
            }}
          />
        )}

        {/* RESULTS / SCORECARD VIEW */}
        {currentView === 'results' && quizResults && (
          <ScoreView
            classLevel={activeQuizClass}
            chapterTitle={activeQuizTitle}
            questions={quizResults.questions}
            userAnswers={quizResults.userAnswers}
            totalTimeSeconds={quizResults.totalTimeSeconds}
            studentProfile={quizResults.studentProfile || activeStudent}
            mode={quizResults.mode || activeTestMode}
            leaderboardEntryId={quizResults.leaderboardEntryId}
            onRestartQuiz={handleRestartQuiz}
            onSelectAnotherChapter={handleSelectAnotherChapter}
            onBackToClass={(lvl) => {
              setSelectedClass(lvl);
              setActiveTab('classes');
              setCurrentView('class-page');
            }}
            onBackToHome={handleBackToHome}
            onOpenLeaderboard={() => setIsLeaderboardModalOpen(true)}
          />
        )}

        {/* CLASS PAGE VIEW */}
        {currentView === 'class-page' && (
          <ClassPageView
            currentClass={selectedClass}
            classInfo={currentClassInfo}
            chapters={currentChapters}
            onSelectChapter={handlePrepareChapterTest}
            onOpenChapterDetails={handleOpenChapterDetails}
            onClassChange={(lvl) => setSelectedClass(lvl)}
            onStartFullClassMock={handlePrepareClassPractice}
            onBackToHome={handleBackToHome}
          />
        )}

        {/* MAIN TAB VIEWS */}
        {currentView === 'main' && (
          <>
            {/* HOME VIEW (Pure Home without Philosophy or Thinkers Section) */}
            {activeTab === 'home' && (
              <>
                <HeroSection
                  onSelectClass={handleSelectClass}
                  onStartPracticing={() => handleSelectClass(9)}
                />
                <FeaturesSection />
              </>
            )}

            {/* DEDICATED PHILOSOPHY VIEW (Standalone Thinkers & Pioneers) */}
            {activeTab === 'philosophy' && (
              <MathPhilosophySection initialTab={activePhilosopherType} />
            )}

            {/* PHYSICS PLACEHOLDER */}
            {activeTab === 'physics' && (
              <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center shadow-xl shadow-cyan-500/10">
                  <Atom className="w-10 h-10 animate-spin-slow" />
                </div>
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase tracking-wider">
                    Physics Subject
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Physics Curriculum &amp; Question Bank
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                    The theoretical physics question bank and lecture modules are currently in preparation. No questions or chapters added yet.
                  </p>
                </div>
                <button
                  onClick={() => handleSelectClass(9)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go to Mathematics Classes</span>
                </button>
              </div>
            )}

            {/* CONTENT DICTIONARY VIEW */}
            {activeTab === 'dictionary' && (
              <ContentView
                initialSection={activeContentSection}
                initialSubject={activeContentSubject}
                onSelectClass={handleSelectClass}
              />
            )}

            {/* ABOUT VIEW */}
            {activeTab === 'about' && (
              <AboutView
                onSelectClass={handleSelectClass}
                onStartPracticing={() => handleSelectClass(9)}
              />
            )}
          </>
        )}
      </main>

      {/* Chapter Overview Modal */}
      <ChapterDetailModal
        chapter={targetChapter}
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        onStartTest={(chapter) => {
          setIsChapterModalOpen(false);
          handlePrepareChapterTest(chapter);
        }}
      />

      {/* Student Candidate Identification Modal */}
      <StudentEntryModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        defaultClass={pendingQuizClass}
        chapterTitle={pendingQuizTitle}
        onStartTest={handleStartConfirmedTest}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Class Leaderboard & Performance Ranking Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
        initialClass={selectedClass}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User Profile & Accuracy Statistics Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSwitchClass={(lvl) => {
          setSelectedClass(lvl);
          setActiveTab('classes');
          setCurrentView('class-page');
        }}
      />

      {/* Footer - Hidden in Quiz and Results/Score Views */}
      {!['quiz', 'results'].includes(currentView) && <Footer onNavigate={handleNavigate} />}

    </div>
  );
}
