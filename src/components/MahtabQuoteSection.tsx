import React from 'react';
import { Quote, Sparkles, Sigma, Star, Compass, Globe } from 'lucide-react';
import { MathText } from './MathText';

interface MahtabQuoteSectionProps {
  onExploreChapters?: () => void;
}

/**
 * Homepage Bottom Quotes & Philosophy Section:
 * 1. Leonhard Euler Quote ($e^{i\pi} + 1 = 0$)
 * 2. Albert Einstein Quote ("Mathematics is the poetry of logical ideas", $E = mc^2$)
 * 3. Srinivasa Ramanujan Quote ("An equation has no meaning to me unless it expresses a thought of God.")
 * 4. Galileo Galilei Quote ("The book of nature is written in the language of mathematics.")
 */
export const MahtabQuoteSection: React.FC<MahtabQuoteSectionProps> = ({
  onExploreChapters,
}) => {
  return (
    <section
      id="homepage-quotes-section"
      className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800"
    >
      {/* Background Animated Gradient */}
      <div className="absolute inset-0 bg-radial from-indigo-950/30 via-slate-950 to-slate-950 pointer-events-none" />
      
      {/* Floating Mathematical Constants in Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex justify-between items-center text-indigo-200 text-sm font-serif px-8 sm:px-16">
        <span className="hidden sm:inline">
          <MathText text="e^{i\pi} + 1 = 0" displayMode={false} />
        </span>
        <span className="hidden md:inline">
          <MathText text="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}" displayMode={false} />
        </span>
        <span className="hidden lg:inline">
          <MathText text="z = r(\cos\theta + i\sin\theta)" displayMode={false} />
        </span>
        <span>
          <MathText text="\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}" displayMode={false} />
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mathematical Philosophy &amp; Eternal Truths</span>
          </div>
        </div>

        {/* 1 & 2: TOP ROW — LEONHARD EULER (Left) & ALBERT EINSTEIN (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEONHARD EULER QUOTE CARD (Golden Amber Glow) */}
          <div className="p-8 sm:p-9 rounded-3xl bg-gradient-to-br from-slate-900/95 via-amber-950/20 to-slate-900/95 border border-amber-500/40 shadow-2xl shadow-amber-950/40 flex flex-col justify-between text-center relative overflow-hidden space-y-5">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-950/60 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>The Beauty of Pure Mathematics</span>
              </div>

              <div className="py-1">
                <span className="inline-block px-4 py-1.5 rounded-2xl bg-amber-950/70 border border-amber-400/30 text-amber-200 text-lg sm:text-2xl font-serif tracking-widest shadow-inner">
                  <MathText text="e^{i\pi} + 1 = 0" displayMode={false} />
                </span>
              </div>

              <blockquote className="text-lg sm:text-xl font-serif font-medium tracking-wide leading-snug sm:leading-relaxed bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent drop-shadow-md italic">
                &ldquo;The enjoyment of seeing and discovering the truth is the most excellent and most precious thing in life.&rdquo;
              </blockquote>
            </div>

            <div className="pt-3 flex items-center justify-center gap-2 text-xs border-t border-amber-900/40">
              <Quote className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-amber-300 tracking-wide uppercase">
                Leonhard Euler (1707–1783)
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                Master of Mathematical Analysis
              </span>
            </div>
          </div>

          {/* GEORGES LEMAÎTRE QUOTE CARD (Luminous Cosmic Cyan/Teal Glow) */}
          <div className="p-8 sm:p-9 rounded-3xl bg-gradient-to-br from-slate-900/95 via-cyan-950/25 to-slate-900/95 border border-cyan-500/40 shadow-2xl shadow-cyan-950/40 flex flex-col justify-between text-center relative overflow-hidden space-y-5">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Cosmology &amp; Theoretical Physics</span>
              </div>

              <div className="py-1">
                <span className="inline-block px-4 py-1.5 rounded-2xl bg-cyan-950/70 border border-cyan-400/30 text-cyan-200 text-lg sm:text-2xl font-serif tracking-widest shadow-inner">
                  <MathText text="v = H_0 \cdot d" displayMode={false} />
                </span>
              </div>

              <blockquote className="text-lg sm:text-xl font-serif font-medium tracking-wide leading-snug sm:leading-relaxed bg-gradient-to-r from-cyan-200 via-sky-100 to-teal-300 bg-clip-text text-transparent drop-shadow-md italic">
                &ldquo;There are two ways to reach the truth, I choose both of them.&rdquo;
              </blockquote>
            </div>

            <div className="pt-3 flex items-center justify-center gap-2 text-xs border-t border-cyan-900/40">
              <Quote className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span className="font-bold text-cyan-300 tracking-wide uppercase">
                Georges Lemaître (1894–1966)
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                Father of the Big Bang Theory
              </span>
            </div>
          </div>

        </div>

        {/* 3 & 4: BOTTOM ROW — SRINIVASA RAMANUJAN (Left) & GALILEO GALILEI (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SRINIVASA RAMANUJAN - HARDY-RAMANUJAN TAXICAB NUMBER 1729 (Luminous Purple/Indigo Glow) */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/95 via-purple-950/20 to-slate-900/95 border border-purple-500/40 shadow-xl shadow-purple-950/40 space-y-4 flex flex-col justify-between text-center md:text-left">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/40 text-purple-300 text-[10px] font-black uppercase tracking-wider">
                  <Sigma className="w-3 h-3 text-purple-400" />
                  <span>Hardy–Ramanujan Number &bull; 1729</span>
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-purple-950/90 border border-purple-400/30 text-purple-200 text-xs font-mono">
                  <MathText text="1729 = 1^3 + 12^3 = 9^3 + 10^3" displayMode={false} />
                </span>
              </div>

              <blockquote className="text-base sm:text-lg font-serif italic tracking-wide text-purple-100 leading-relaxed">
                &ldquo;It is a very interesting number; it is the smallest number expressible as the sum of two cubes in two different ways.&rdquo;
              </blockquote>
            </div>

            <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Quote className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                <span className="font-bold text-purple-300 tracking-wide">
                  Srinivasa Ramanujan
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                (1887–1920)
              </span>
            </div>
          </div>

          {/* GALILEO GALILEI - LANGUAGE OF NATURE QUOTE (Luminous Emerald Glow) */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/95 via-emerald-950/20 to-slate-900/95 border border-emerald-500/40 shadow-xl shadow-emerald-950/40 space-y-4 flex flex-col justify-between text-center md:text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Language of the Universe</span>
              </div>

              <blockquote className="text-lg sm:text-xl font-serif italic tracking-wide text-emerald-100 leading-relaxed">
                &ldquo;The book of nature is written in the language of mathematics.&rdquo;
              </blockquote>
            </div>

            <div className="pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Quote className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span className="font-bold text-emerald-300 tracking-wide">
                  Galileo Galilei
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                (1564–1642)
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};


