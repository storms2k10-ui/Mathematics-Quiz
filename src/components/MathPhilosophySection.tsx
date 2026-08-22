import React, { useState, useMemo } from 'react';
import { 
  Quote, 
  Sparkles, 
  Search, 
  ChevronRight, 
  BookOpen, 
  Lightbulb, 
  Compass, 
  X, 
  Award, 
  Globe, 
  ExternalLink,
  Flame,
  Atom,
  Brain
} from 'lucide-react';
import { MATHEMATICIANS, Mathematician } from '../data/mathematiciansData';
import { MathText } from './MathText';

interface MathPhilosophySectionProps {
  onExploreMathematician?: (mathematician: Mathematician) => void;
}

const FIELD_THEMES: Record<string, {
  badge: string;
  glow: string;
  borderHover: string;
  accent: string;
  lightGlow: string;
  btnGrad: string;
  formulaBg: string;
}> = {
  'Theoretical Physics': {
    badge: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40',
    glow: 'from-cyan-500/20 via-blue-500/10 to-indigo-500/20',
    borderHover: 'hover:border-cyan-400/80 hover:shadow-cyan-950/80',
    accent: 'text-cyan-400',
    lightGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    btnGrad: 'from-cyan-600 to-blue-600',
    formulaBg: 'bg-cyan-950/70 border-cyan-800/60 text-cyan-200',
  },
  'Calculus & Analysis': {
    badge: 'bg-blue-950/90 text-blue-300 border-blue-500/40',
    glow: 'from-blue-500/20 via-indigo-500/10 to-cyan-500/20',
    borderHover: 'hover:border-blue-400/80 hover:shadow-blue-950/80',
    accent: 'text-blue-400',
    lightGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.35)]',
    btnGrad: 'from-blue-600 to-indigo-600',
    formulaBg: 'bg-blue-950/70 border-blue-800/60 text-blue-200',
  },
  'Algebra & Number Theory': {
    badge: 'bg-amber-950/90 text-amber-300 border-amber-500/40',
    glow: 'from-amber-500/20 via-orange-500/10 to-yellow-500/20',
    borderHover: 'hover:border-amber-400/80 hover:shadow-amber-950/80',
    accent: 'text-amber-400',
    lightGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    btnGrad: 'from-amber-600 to-orange-600',
    formulaBg: 'bg-amber-950/70 border-amber-800/60 text-amber-200',
  },
  'Geometry & Topology': {
    badge: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
    glow: 'from-emerald-500/20 via-teal-500/10 to-green-500/20',
    borderHover: 'hover:border-emerald-400/80 hover:shadow-emerald-950/80',
    accent: 'text-emerald-400',
    lightGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    btnGrad: 'from-emerald-600 to-teal-600',
    formulaBg: 'bg-emerald-950/70 border-emerald-800/60 text-emerald-200',
  },
  'Pure Mathematics': {
    badge: 'bg-rose-950/90 text-rose-300 border-rose-500/40',
    glow: 'from-rose-500/20 via-pink-500/10 to-purple-500/20',
    borderHover: 'hover:border-rose-400/80 hover:shadow-rose-950/80',
    accent: 'text-rose-400',
    lightGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.35)]',
    btnGrad: 'from-rose-600 to-pink-600',
    formulaBg: 'bg-rose-950/70 border-rose-800/60 text-rose-200',
  },
  'Ancient Pioneers': {
    badge: 'bg-yellow-950/90 text-yellow-300 border-yellow-500/40',
    glow: 'from-yellow-500/20 via-amber-500/10 to-orange-500/20',
    borderHover: 'hover:border-yellow-400/80 hover:shadow-yellow-950/80',
    accent: 'text-yellow-400',
    lightGlow: 'shadow-[0_0_15px_rgba(234,179,8,0.35)]',
    btnGrad: 'from-yellow-600 to-amber-600',
    formulaBg: 'bg-yellow-950/70 border-yellow-800/60 text-yellow-200',
  },
};

export const MathPhilosophySection: React.FC<MathPhilosophySectionProps> = () => {
  const [selectedMathematician, setSelectedMathematician] = useState<Mathematician | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Thinkers' },
      { id: 'Theoretical Physics', label: 'Theoretical Physics' },
      { id: 'Calculus & Analysis', label: 'Calculus & Analysis' },
      { id: 'Algebra & Number Theory', label: 'Algebra & Number Theory' },
      { id: 'Geometry & Topology', label: 'Geometry & Topology' },
      { id: 'Pure Mathematics', label: 'Pure Mathematics' },
      { id: 'Ancient Pioneers', label: 'Ancient Pioneers' },
    ];
  }, []);

  const filteredThinkers = useMemo(() => {
    return MATHEMATICIANS.filter((m) => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.philosophicalView.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.famousQuote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.majorBreakthroughs.some(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = activeCategory === 'all' || m.field === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section id="math-philosophy-section" className="py-16 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden border-t border-b border-indigo-900/50 shadow-2xl">
      
      {/* Background Sacred Geometry & Deep Space Cosmic Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f120_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />
      <div className="absolute -top-48 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-48 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/10">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Philosophy of Mathematics &amp; Theoretical Physics</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            The Great Minds &amp; Mathematical Philosophers
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
            Explore the foundational inquiries, epistemological breakthroughs, and universal equations of the thinkers who decoded the mathematical language of reality.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md">
          
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mathematician, quote, theorem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Minimalist Cards Grid with Staggered Transition & Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredThinkers.map((thinker, idx) => {
            const isSelected = selectedMathematician?.id === thinker.id;
            const theme = FIELD_THEMES[thinker.field] || FIELD_THEMES['Calculus & Analysis'];

            return (
              <div
                key={thinker.id}
                id={`mathematician-card-${thinker.id}`}
                onClick={() => setSelectedMathematician(thinker)}
                className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer border flex flex-col justify-between overflow-hidden hover:-translate-y-2 hover:shadow-2xl ${
                  isSelected
                    ? 'bg-slate-900/95 border-indigo-400 ring-2 ring-indigo-400/70 shadow-2xl shadow-indigo-500/40'
                    : `bg-slate-900/90 hover:bg-slate-850/95 border-slate-800/90 ${theme.borderHover}`
                }`}
                style={{
                  animationDelay: `${(idx % 8) * 0.05}s`
                }}
              >
                {/* Dynamic Ambient Backlight Glow on Card Hover */}
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${theme.glow} opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none`} />

                {/* Background formula watermark rendered using MathText */}
                <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:opacity-25 transition-opacity text-2xl sm:text-3xl select-none pointer-events-none text-indigo-300">
                  <MathText text={`$${thinker.symbol}$`} />
                </div>

                <div className="space-y-4 relative z-10">
                  
                  {/* Top Row: Field badge & Era */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border shadow-xs transition-all ${theme.badge}`}>
                      {thinker.field}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-medium">
                      {thinker.era}
                    </span>
                  </div>

                  {/* Thinker Name & Title */}
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-white transition-colors flex items-center justify-between gap-1">
                      <span>{thinker.name}</span>
                    </h3>
                    <p className={`text-xs font-medium line-clamp-1 ${theme.accent}`}>
                      {thinker.title}
                    </p>
                  </div>

                  {/* Famous Quote Teaser (Italicized) */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/75 border border-slate-800/80 space-y-1.5 group-hover:border-slate-700 transition-colors shadow-inner">
                    <div className="flex items-start gap-2">
                      <Quote className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 fill-amber-400" />
                      <p className="text-xs font-serif italic text-slate-300 line-clamp-2 leading-relaxed">
                        &ldquo;{thinker.famousQuote}&rdquo;
                      </p>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Hint */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white relative z-10">
                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-200">
                    Click to explore details
                  </span>
                  <div className={`w-7 h-7 rounded-full bg-slate-800 group-hover:bg-gradient-to-r ${theme.btnGrad} group-hover:text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-xs`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Modal: Full Mathematical & Philosophical Details for Selected Thinker */}
        {selectedMathematician && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div 
              className="bg-slate-900 rounded-3xl border border-indigo-500/40 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-slide-fade text-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedMathematician(null)}
                className="absolute right-5 top-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              {(() => {
                const modalTheme = FIELD_THEMES[selectedMathematician.field] || FIELD_THEMES['Calculus & Analysis'];
                return (
                  <>
                    <div className="space-y-2 pr-10">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${modalTheme.badge}`}>
                          {selectedMathematician.field}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {selectedMathematician.era} • {selectedMathematician.nationality}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-white">
                        {selectedMathematician.name}
                      </h3>
                      
                      {selectedMathematician.latinName && (
                        <p className="text-xs text-slate-400 italic">
                          Historical / Latin name: {selectedMathematician.latinName}
                        </p>
                      )}

                      <p className={`text-sm font-semibold ${modalTheme.accent}`}>
                        {selectedMathematician.title}
                      </p>
                    </div>

                    {/* Quote Block */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-800 to-indigo-950/40 border border-amber-500/30 space-y-2">
                      <div className="flex items-start gap-3">
                        <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 fill-amber-400" />
                        <p className="text-sm sm:text-base font-serif italic text-amber-100 leading-relaxed">
                          &ldquo;{selectedMathematician.famousQuote}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Philosophical Perspective on Mathematics */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <span>Philosophical View &amp; Epistemology:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
                        {selectedMathematician.philosophicalView}
                      </p>
                    </div>

                    {/* Major Theorems & Breakthroughs (With KaTeX) */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Major Mathematical Discoveries &amp; Formulas:</span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {selectedMathematician.majorBreakthroughs.map((breakthrough, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-md bg-gradient-to-r ${modalTheme.btnGrad} text-white text-[10px] font-bold flex items-center justify-center`}>
                                  {idx + 1}
                                </span>
                                <span>{breakthrough.title}</span>
                              </h4>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              {breakthrough.description}
                            </p>

                            {breakthrough.formula && (
                              <div className={`p-2.5 rounded-xl border ${modalTheme.formulaBg} text-xs sm:text-sm font-mono overflow-x-auto text-center`}>
                                <MathText text={`$${breakthrough.formula}$`} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Philosophical Contribution & Modern Impact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5" />
                          Philosophical Contribution:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedMathematician.philosophicalContribution}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          Impact on Modern World &amp; Physics:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedMathematician.impactOnModernWorld}
                        </p>
                      </div>

                    </div>

                    {/* Footer Modal Action */}
                    <div className="pt-3 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => setSelectedMathematician(null)}
                        className={`px-6 py-2.5 rounded-xl bg-gradient-to-r ${modalTheme.btnGrad} text-white font-bold text-xs shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-95`}
                      >
                        Close Exploration
                      </button>
                    </div>
                  </>
                );
              })()}

            </div>
          </div>
        )}

      </div>

    </section>
  );
};
