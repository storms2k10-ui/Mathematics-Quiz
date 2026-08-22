import React, { useState, useMemo } from 'react';
import { Sigma, Menu, X, BookOpen, Trophy, CheckCircle2, Info, ChevronDown, Sparkles, Library, Sun, Moon, Compass, Layers, Calculator, GraduationCap } from 'lucide-react';
import { ClassLevel } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ContentSection } from './ContentView';
import { ALL_CHAPTERS } from '../data/chaptersData';

interface NavbarProps {
  activeTab: 'home' | 'classes' | 'dictionary' | 'about';
  selectedClass: ClassLevel | null;
  activeContentSection?: ContentSection;
  onNavigate: (tab: 'home' | 'classes' | 'dictionary' | 'about', classLevel?: ClassLevel) => void;
  onNavigateContentSection?: (section: ContentSection) => void;
  onQuickPractice: (classLevel?: ClassLevel) => void;
  onOpenLeaderboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  selectedClass,
  activeContentSection = 'definitions',
  onNavigate,
  onNavigateContentSection,
  onQuickPractice,
  onOpenLeaderboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classesDropdownOpen, setClassesDropdownOpen] = useState(false);
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  // Dynamic Chapter Auto-Counting per Class
  const chapterCounts = useMemo(() => {
    return {
      9: ALL_CHAPTERS.filter((c) => c.class === 9).length,
      10: ALL_CHAPTERS.filter((c) => c.class === 10).length,
      11: ALL_CHAPTERS.filter((c) => c.class === 11).length,
      12: ALL_CHAPTERS.filter((c) => c.class === 12).length,
    };
  }, []);

  const handleClassSelect = (lvl: ClassLevel) => {
    onNavigate('classes', lvl);
    setClassesDropdownOpen(false);
    setContentDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleContentSectionSelect = (section: ContentSection) => {
    if (onNavigateContentSection) {
      onNavigateContentSection(section);
    } else {
      onNavigate('dictionary');
    }
    setContentDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav id="main-navbar" className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo: Clean Sigma Icon Brandmark */}
          <button
            id="nav-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center group focus:outline-none cursor-pointer shrink-0"
            title="MATHEMATICS & PHYSICS"
            aria-label="Home - Mathematics & Physics"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 group-hover:shadow-indigo-600/40 transition-all border border-indigo-400/30">
              <Sigma className="w-5 h-5 stroke-[2.5]" />
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              id="nav-link-home"
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            {/* Select Class Dropdown (9, 10, 11, 12) with Auto-counted Chapters & Hover Auto-show */}
            <div 
              className="relative"
              onMouseEnter={() => setClassesDropdownOpen(true)}
              onMouseLeave={() => setClassesDropdownOpen(false)}
            >
              <button
                id="nav-link-classes-dropdown"
                onClick={() => setClassesDropdownOpen(!classesDropdownOpen)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'classes'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Select Class</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {classesDropdownOpen && (
                <div
                  className="absolute left-0 mt-1 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto"
                >
                  <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>Select Class &amp; Curriculum</span>
                    <span>Classes 9 to 12</span>
                  </div>
                  
                  {/* Class 9 */}
                  <button
                    id="nav-class-option-9"
                    onClick={() => handleClassSelect(9)}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                      activeTab === 'classes' && selectedClass === 9
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-slate-800/80'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                        9
                      </span>
                      <div>
                        <span className="font-bold block">Class 9 Mathematics</span>
                        <span className="text-[11px] text-slate-400 font-normal">Real numbers, Logarithms, Algebra &amp; Geometry</span>
                      </div>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-bold shrink-0 ml-2">
                      {chapterCounts[9]} Chapters
                    </span>
                  </button>

                  {/* Class 10 */}
                  <button
                    id="nav-class-option-10"
                    onClick={() => handleClassSelect(10)}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between hover:bg-emerald-50/70 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                      activeTab === 'classes' && selectedClass === 10
                        ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-slate-800'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                        10
                      </span>
                      <div>
                        <span className="font-bold block">Class 10 Mathematics</span>
                        <span className="text-[11px] text-slate-400 font-normal">Sets, Quadratic Equations, Geometry &amp; Trig</span>
                      </div>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold shrink-0 ml-2">
                      {chapterCounts[10]} Chapters
                    </span>
                  </button>

                  {/* Class 11 */}
                  <button
                    id="nav-class-option-11"
                    onClick={() => handleClassSelect(11)}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                      activeTab === 'classes' && selectedClass === 11
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-slate-800/80'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                        11
                      </span>
                      <div>
                        <span className="font-bold block">Class 11 Mathematics</span>
                        <span className="text-[11px] text-slate-400 font-normal">Complex Numbers, Vectors, Series, Trig.</span>
                      </div>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-bold shrink-0 ml-2">
                      {chapterCounts[11]} Chapters
                    </span>
                  </button>

                  {/* Class 12 */}
                  <button
                    id="nav-class-option-12"
                    onClick={() => handleClassSelect(12)}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                      activeTab === 'classes' && selectedClass === 12
                        ? 'text-purple-600 dark:text-purple-400 font-bold bg-purple-50/80 dark:bg-slate-800/80'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">
                        12
                      </span>
                      <div>
                        <span className="font-bold block">Class 12 Mathematics</span>
                        <span className="text-[11px] text-slate-400 font-normal">Calculus, Limits, Integration &amp; Analytic Geometry</span>
                      </div>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 font-bold shrink-0 ml-2">
                      {chapterCounts[12]} Chapters
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Content Dropdown Menu with hover auto-show & click */}
            <div 
              className="relative"
              onMouseEnter={() => setContentDropdownOpen(true)}
              onMouseLeave={() => setContentDropdownOpen(false)}
            >
              <button
                id="nav-link-content"
                onClick={() => setContentDropdownOpen(!contentDropdownOpen)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'dictionary'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-expanded={contentDropdownOpen}
              >
                <Library className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Content</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${contentDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>

              {contentDropdownOpen && (
                <div 
                  id="nav-content-dropdown-menu"
                  className="absolute left-0 mt-1 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1"
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Mathematics Content Sections
                  </div>

                  {/* 1. Definitions */}
                  <button
                    id="nav-content-option-definitions"
                    onClick={() => handleContentSectionSelect('definitions')}
                    className="w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                      <BookOpen className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <span className="font-bold block">Definitions</span>
                      <span className="text-[10px] text-slate-400">A–Z Dictionary &amp; Geometric Diagrams</span>
                    </div>
                  </button>

                  {/* 2. Theorems */}
                  <button
                    id="nav-content-option-theorems"
                    onClick={() => handleContentSectionSelect('theorems')}
                    className="w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs">
                      <Compass className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <span className="font-bold block">Theorems</span>
                      <span className="text-[10px] text-slate-400">Formal Statements &amp; Mathematical Proofs</span>
                    </div>
                  </button>

                  {/* 3. Properties */}
                  <button
                    id="nav-content-option-properties"
                    onClick={() => handleContentSectionSelect('properties')}
                    className="w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs">
                      <Layers className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <span className="font-bold block">Properties</span>
                      <span className="text-[10px] text-slate-400">Mathematical Laws &amp; Axioms</span>
                    </div>
                  </button>

                  {/* 4. Formulas */}
                  <button
                    id="nav-content-option-formulas"
                    onClick={() => handleContentSectionSelect('formulas')}
                    className="w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs">
                      <Calculator className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <span className="font-bold block">Formulas</span>
                      <span className="text-[10px] text-slate-400">Cheat Sheets &amp; Identities</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {onOpenLeaderboard && (
              <button
                id="nav-link-leaderboard"
                onClick={onOpenLeaderboard}
                className="px-3 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all flex items-center gap-1.5 border border-amber-200/80 dark:border-amber-700/50 shadow-2xs cursor-pointer"
                title="View Class Rankings & High Scores"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span>Leaderboard</span>
              </button>
            )}
          </div>

          {/* Actions: Day/Night Mode Single Button & About Me */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Single Button Day / Night Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-2xs hover:scale-105 active:scale-95"
              title={isDarkMode ? 'Turn Off Night Mode (Switch to Day Mode)' : 'Turn On Night Mode (Switch to Dark Mode)'}
              aria-label={isDarkMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                  <span className="hidden sm:inline">Day Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
                  <span className="hidden sm:inline">Night Mode</span>
                </>
              )}
            </button>

            {/* About Me Button (Positioned After Night Mode) */}
            <button
              id="nav-link-about"
              onClick={() => onNavigate('about')}
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                activeTab === 'about'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 shadow-xs'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 shadow-2xs'
              }`}
              title="About Me"
            >
              <Info className="w-4 h-4 text-indigo-500" />
              <span>About Me</span>
            </button>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center">
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-menu-panel" className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-xs sm:text-sm text-left font-bold ${
                activeTab === 'home'
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                handleContentSectionSelect('definitions');
              }}
              className={`p-2.5 rounded-xl text-xs sm:text-sm text-left font-bold ${
                activeTab === 'dictionary'
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Content Hub
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-xs sm:text-sm text-left font-bold ${
                activeTab === 'about'
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              About Me
            </button>
            {onOpenLeaderboard && (
              <button
                onClick={() => {
                  onOpenLeaderboard();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-xs sm:text-sm text-left font-bold text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Leaderboard</span>
              </button>
            )}
          </div>

          {/* Quick Content Section Links in Mobile */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Content Sections:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleContentSectionSelect('definitions')}
                className="p-2 rounded-xl text-xs font-semibold text-left bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>Definitions</span>
              </button>
              <button
                onClick={() => handleContentSectionSelect('theorems')}
                className="p-2 rounded-xl text-xs font-semibold text-left bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>Theorems</span>
              </button>
              <button
                onClick={() => handleContentSectionSelect('properties')}
                className="p-2 rounded-xl text-xs font-semibold text-left bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                <span>Properties</span>
              </button>
              <button
                onClick={() => handleContentSectionSelect('formulas')}
                className="p-2 rounded-xl text-xs font-semibold text-left bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-500" />
                <span>Formulas</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Display Mode:
            </span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                  <span>Turn Off Night Mode (Day)</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/20" />
                  <span>Turn On Night Mode (Dark)</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Class:
            </p>
            <div className="grid grid-cols-4 gap-2">
              {([9, 10, 11, 12] as ClassLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleClassSelect(lvl)}
                  className={`p-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    activeTab === 'classes' && selectedClass === lvl
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>Class {lvl}</div>
                  <div className="text-[9px] text-slate-400 font-normal mt-0.5">{chapterCounts[lvl]} Ch.</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


