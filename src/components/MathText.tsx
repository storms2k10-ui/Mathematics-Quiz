import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
  displayMode?: boolean;
}

/**
 * Sanitizes LaTeX strings to fix common escaping artifacts, primes, and degree symbols
 */
function sanitizeLatex(str: string): string {
  if (!str) return '';
  let s = str.trim();
  // Fix escaped single quotes used for primes (e.g. f\'(x) -> f'(x), y\'\' -> y'')
  s = s.replace(/\\+'/g, "'");
  // Fix double backslashes before common LaTeX keywords
  s = s.replace(/\\\\([a-zA-Z]+)/g, '\\$1');
  // Normalize degree symbols
  s = s.replace(/(\d+)\^\\circ/g, '$1^{\\circ}');
  s = s.replace(/(\d+)\^\{\\circ\}/g, '$1^{\\circ}');
  // Fix trailing % or \%
  s = s.replace(/\\%$/, '\\%');
  return s;
}

/**
 * MathText Component
 * Renders mathematical expressions, LaTeX scripts, formulas, fractions, powers,
 * integrals, matrices, square roots, and symbols with crystal-clear KaTeX typography.
 */
export const MathText: React.FC<MathTextProps> = ({
  text,
  className = '',
  displayMode = false,
}) => {
  const renderedHtml = useMemo(() => {
    if (!text) return '';

    const trimmed = text.trim();

    // 1. If explicit displayMode is requested (like formula highlight boxes)
    if (displayMode) {
      let cleanMath = trimmed;
      if (cleanMath.startsWith('$$') && cleanMath.endsWith('$$')) {
        cleanMath = cleanMath.slice(2, -2).trim();
      } else if (cleanMath.startsWith('$') && cleanMath.endsWith('$')) {
        cleanMath = cleanMath.slice(1, -1).trim();
      }
      try {
        return katex.renderToString(sanitizeLatex(cleanMath), {
          displayMode: true,
          throwOnError: false,
          strict: 'ignore',
        });
      } catch {
        // Fall back to token parser
      }
    }

    // 2. Check if the string is wrapped entirely in $$ or $
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      try {
        return katex.renderToString(sanitizeLatex(trimmed.slice(2, -2).trim()), {
          displayMode: true,
          throwOnError: false,
          strict: 'ignore',
        });
      } catch {
        // fallback
      }
    }

    if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2 && !trimmed.slice(1, -1).includes('$')) {
      try {
        return katex.renderToString(sanitizeLatex(trimmed.slice(1, -1).trim()), {
          displayMode: false,
          throwOnError: false,
          strict: 'ignore',
        });
      } catch {
        // fallback
      }
    }

    // 3. Check if it's a standalone pure LaTeX formula (even without $ delimiters)
    const hasLatexCommands = /\\(frac|sqrt|int|sum|prod|log|ln|sin|cos|tan|cot|sec|csc|alpha|beta|gamma|delta|theta|lambda|pi|mu|sigma|omega|Delta|Sigma|partial|infty|pm|neq|le|ge|approx|times|cdot|in|notin|subset|cap|cup|forall|exists|mathbb|mathbf|mathcal|text|quad|qquad|left|right|begin|end|vec|overline|hat)/.test(trimmed);
    const hasMathOperators = /[\^_=+\-*/<>]/.test(trimmed);
    const isLikelyPureMath = hasLatexCommands || (hasMathOperators && !/[a-zA-Z]{5,}/.test(trimmed) && trimmed.length < 80);

    if (isLikelyPureMath && !trimmed.includes('$') && !trimmed.includes('Which') && !trimmed.includes('What') && !trimmed.includes('Find') && !trimmed.includes('Determine') && !trimmed.includes('According')) {
      try {
        return katex.renderToString(sanitizeLatex(trimmed), {
          displayMode: false,
          throwOnError: false,
          strict: 'ignore',
        });
      } catch {
        // fallback
      }
    }

    // 4. Tokenize mixed text with math delimiters $...$, $$...$$, \(...\), \[...\]
    try {
      let processed = text;
      const tokens: { type: 'text' | 'inline-math' | 'display-math'; content: string }[] = [];
      let cursor = 0;

      // Regex matching $$...$$, $...$, \[...\], \(...\)
      const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;
      let match: RegExpExecArray | null;

      while ((match = mathRegex.exec(processed)) !== null) {
        if (match.index > cursor) {
          tokens.push({
            type: 'text',
            content: processed.slice(cursor, match.index),
          });
        }

        const raw = match[0];
        if (raw.startsWith('$$') && raw.endsWith('$$')) {
          tokens.push({
            type: 'display-math',
            content: raw.slice(2, -2).trim(),
          });
        } else if (raw.startsWith('\\[') && raw.endsWith('\\]')) {
          tokens.push({
            type: 'display-math',
            content: raw.slice(2, -2).trim(),
          });
        } else if (raw.startsWith('\\(') && raw.endsWith('\\)')) {
          tokens.push({
            type: 'inline-math',
            content: raw.slice(2, -2).trim(),
          });
        } else if (raw.startsWith('$') && raw.endsWith('$')) {
          tokens.push({
            type: 'inline-math',
            content: raw.slice(1, -1).trim(),
          });
        }

        cursor = match.index + raw.length;
      }

      if (cursor < processed.length) {
        tokens.push({
          type: 'text',
          content: processed.slice(cursor),
        });
      }

      if (tokens.length > 0) {
        return tokens
          .map((token) => {
            if (token.type === 'text') {
              // Escape basic HTML
              return token.content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            }
            try {
              return katex.renderToString(sanitizeLatex(token.content), {
                displayMode: token.type === 'display-math',
                throwOnError: false,
                strict: 'ignore',
              });
            } catch {
              return token.content;
            }
          })
          .join('');
      }

      // If no delimiters found, escape basic HTML
      return processed
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    } catch {
      return text;
    }
  }, [text, displayMode]);

  return (
    <span
      className={`math-rendered font-normal leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
