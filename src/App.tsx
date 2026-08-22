/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderQuote } from './components/HeaderQuote';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ClassPageView } from './components/ClassPageView';
import { ContentView, ContentSection } from './components/ContentView';
import { QuizView } from './components/QuizView';
import { ScoreView } from './components/ScoreView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { MahtabQuoteSection } from './components/MahtabQuoteSection';
import { MathPhilosophySection } from './components/MathPhilosophySection';
import { StudentEntryModal } from './components/StudentEntryModal';
import { ChapterDetailModal } from './components/ChapterDetailModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { MathService, shuffleArray } from './services/mathService';
import { Chapter, ClassInfo, ClassLevel, Question, StudentProfile, LeaderboardEntry, TestSessionConfig } from './types';


export default function App() {
  // Navigation / View state
  const [activeTab, setActiveTab] = useState<'home' | 'classes' | 'dictionary' | 'about'>('home');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(9);
  const [activeContentSection, setActiveContentSection] = useState<ContentSection>('definitions');
  const [currentView, setCurrentView] = useState<'main' | 'class-page' | 'quiz' | 'results'>('main');

  // Loaded data
  const [classesInfo, setClassesInfo] = useState<ClassInfo[]>([]);
  const [currentChapters, setCurrentChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
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
  const handleNavigate = (tab: 'home' | 'classes' | 'dictionary' | 'about', classLevel?: ClassLevel) => {
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

  // Handler to navigate specifically to a content section (Definitions, Theorems, Properties, Formulas, Select Class)
  const handleNavigateContentSection = (section: ContentSection) => {
    setActiveContentSection(section);
    setActiveTab('dictionary');
    setCurrentView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to select a class from homepage or hero
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

  // Trigger test for a specific chapter (prompts student identification modal)
  const handlePrepareChapterTest = async (chapter: Chapter) => {
    setTargetChapter(chapter);
    setPendingQuizTitle(chapter.name);
    setPendingQuizClass(chapter.class);
    setPendingQuizQuestions(null);
    setIsStudentModalOpen(true);
  };

  // Trigger full class mock test (prompts student modal)
  const handlePrepareFullClassMock = async (lvl: ClassLevel) => {
    setTargetChapter(null);
    setPendingQuizTitle(`Class ${lvl} Full Mock Test`);
    setPendingQuizClass(lvl);
    setPendingQuizQuestions(null);
    setIsStudentModalOpen(true);
  };

  // Start custom quiz from practice page
  const handlePrepareCustomQuiz = (questions: Question[], title: string, classLevel: ClassLevel) => {
    setTargetChapter(null);
    setPendingQuizTitle(title);
    setPendingQuizClass(classLevel);
    setPendingQuizQuestions(questions);
    setIsStudentModalOpen(true);
  };

  // Executes when student enters name, selects class, and clicks "Begin Test"
  const handleStartConfirmedTest = async (config: TestSessionConfig) => {
    setIsStudentModalOpen(false);
    setIsChapterModalOpen(false);
    setLoading(true);

    let rawQuestions: Question[] = [];

    if (pendingQuizQuestions && pendingQuizQuestions.length > 0) {
      rawQuestions = pendingQuizQuestions;
    } else if (targetChapter) {
      rawQuestions = await MathService.getQuestionsByChapter(targetChapter.id);
    } else {
      rawQuestions = await MathService.getQuickPracticeSet(config.student.classLevel, config.questionCount || 20);
    }

    // Always randomize and select questions dynamically so every attempt is different
    const count = config.questionCount || 20;
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

  // Handler when quiz is completed (persists student attempt record for data collection)
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

    // Save to Leaderboard (ranked by score %, correct answers count, and time spent)
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

  // Handler to return to home
  const handleBackToHome = () => {
    setActiveTab('home');
    setCurrentView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Current class info object
  const currentClassInfo = classesInfo.find((c) => c.level === selectedClass) || {
    level: selectedClass,
    title: `Class ${selectedClass} Mathematics`,
    subtitle: 'Standard Curriculum & MCQs',
    description: 'Comprehensive practice for school and board examinations.',
    totalChapters: currentChapters.length,
    totalQuestions: currentChapters.reduce((acc, c) => acc + c.questionCount, 0),
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentColor: 'indigo',
    focusAreas: ['Core Concepts', 'Formulas', 'Theorems', 'Calculations'],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Quote (Ramanujan Tribute) - Hidden in Quiz and Results/Score Views */}
      {!['quiz', 'results'].includes(currentView) && <HeaderQuote />}

      {/* Main Navbar - Hidden in Quiz and Results/Score Views for distraction-free experience */}
      {!['quiz', 'results'].includes(currentView) && (
        <Navbar
          activeTab={activeTab}
          selectedClass={selectedClass}
          activeContentSection={activeContentSection}
          onNavigate={handleNavigate}
          onNavigateContentSection={handleNavigateContentSection}
          onQuickPractice={(lvl) => handlePrepareFullClassMock(lvl || 9)}
          onOpenLeaderboard={() => setIsLeaderboardModalOpen(true)}
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
            onStartFullClassMock={handlePrepareFullClassMock}
            onBackToHome={handleBackToHome}
          />
        )}

        {/* MAIN TAB VIEWS */}
        {currentView === 'main' && (
          <>
            {activeTab === 'home' && (
              <>
                <HeroSection
                  onSelectClass={handleSelectClass}
                  onStartPracticing={() => handleSelectClass(9)}
                />
                <FeaturesSection />
                <MathPhilosophySection />
                <MahtabQuoteSection onExploreChapters={() => handleSelectClass(9)} />
              </>
            )}

            {activeTab === 'dictionary' && (
              <ContentView
                initialSection={activeContentSection}
                onSelectClass={handleSelectClass}
              />
            )}

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
      />

      {/* Class Leaderboard & Performance Ranking Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
        initialClass={selectedClass}
      />

      {/* Footer - Hidden in Quiz and Results/Score Views */}
      {!['quiz', 'results'].includes(currentView) && <Footer onNavigate={handleNavigate} />}

    </div>
  );

}
