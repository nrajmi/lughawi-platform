import React, { useMemo } from 'react';
import nlp from 'compromise';

interface LinguisticAnalyzerProps {
  text: string;
  lang: string;
  standalone?: boolean;
}

interface TagStats {
  nouns: number;
  verbs: number;
  adjectives: number;
  adverbs: number;
  prepositions: number;
  conjunctions: number;
  pronouns: number;
  total: number;
}

export function LinguisticAnalyzer({ text, lang, standalone = false }: LinguisticAnalyzerProps) {
  const { annotated, stats, keyTerms } = useMemo(() => {
    if (!text) return { annotated: null, stats: null, keyTerms: [] };

    try {
      const doc = nlp(text);
      const json = doc.json();

      const tagStats: TagStats = {
        nouns: 0, verbs: 0, adjectives: 0, adverbs: 0,
        prepositions: 0, conjunctions: 0, pronouns: 0, total: 0,
      };

      const nounList: string[] = [];
      const verbList: string[] = [];

      const annotatedOutput = json.map((sentence: any, sIdx: number) => (
        <span key={sIdx} className="mr-1">
          {sentence.terms.map((term: any, tIdx: number) => {
            const tags = term.tags || [];
            tagStats.total++;

            let colorClass = '';
            let tooltip = '';

            if (tags.includes('Verb')) {
              colorClass = 'ling-tag ling-verb';
              tooltip = 'Verb (فعل)';
              tagStats.verbs++;
              if (term.text.length > 2) verbList.push(term.text);
            } else if (tags.includes('Noun') || tags.includes('ProperNoun')) {
              colorClass = 'ling-tag ling-noun';
              tooltip = tags.includes('ProperNoun') ? 'Proper Noun (اسم علم)' : 'Noun (اسم)';
              tagStats.nouns++;
              if (term.text.length > 2) nounList.push(term.text);
            } else if (tags.includes('Adjective')) {
              colorClass = 'ling-tag ling-adj';
              tooltip = 'Adjective (صفة)';
              tagStats.adjectives++;
            } else if (tags.includes('Adverb')) {
              colorClass = 'ling-tag ling-adv';
              tooltip = 'Adverb (ظرف)';
              tagStats.adverbs++;
            } else if (tags.includes('Preposition')) {
              colorClass = 'ling-tag ling-prep';
              tooltip = 'Preposition (حرف جر)';
              tagStats.prepositions++;
            } else if (tags.includes('Conjunction')) {
              colorClass = 'ling-tag ling-conj';
              tooltip = 'Conjunction (حرف عطف)';
              tagStats.conjunctions++;
            } else if (tags.includes('Pronoun')) {
              colorClass = 'ling-tag ling-pronoun';
              tooltip = 'Pronoun (ضمير)';
              tagStats.pronouns++;
            }

            return (
              <span key={tIdx}>
                <span
                  className={colorClass}
                  title={tooltip ? `${term.text} — ${tooltip}` : ''}
                  style={{ cursor: tooltip ? 'help' : 'auto' }}
                >
                  {term.text}
                </span>
                {term.post}
              </span>
            );
          })}
        </span>
      ));

      // Build key terms list (nouns + verbs deduplicated)
      const combined = [...new Set([...nounList.slice(0, 4), ...verbList.slice(0, 3)])].slice(0, 6);

      return { annotated: annotatedOutput, stats: tagStats, keyTerms: combined };
    } catch (e) {
      return { annotated: text, stats: null, keyTerms: [] };
    }
  }, [text, lang]);

  // Arabic / non-English notice
  if (lang !== 'en' && lang !== 'auto') {
    return (
      <div className="leading-relaxed whitespace-pre-wrap">
        <div className="mb-3 p-2.5 rounded border border-border bg-secondary/50 text-[11px] text-muted-foreground flex items-start gap-2">
          <span className="text-primary text-sm leading-none mt-0.5">ℹ</span>
          <span>
            {lang === 'ar'
              ? 'محرك التحليل النحوي محسَّن للإنجليزية. النص العربي يُعرض كما هو.'
              : 'Syntax analysis is optimized for English text.'}
          </span>
        </div>
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div className="leading-relaxed whitespace-pre-wrap">
      {/* Annotated text */}
      <div className="mb-4">{annotated}</div>

      {/* Legend */}
      <div className="pt-3 border-t border-border/40 flex flex-wrap gap-1.5 text-[10px] mb-3">
        {[
          { cls: 'ling-tag ling-noun', label: 'Noun / اسم' },
          { cls: 'ling-tag ling-verb', label: 'Verb / فعل' },
          { cls: 'ling-tag ling-adj', label: 'Adjective / صفة' },
          { cls: 'ling-tag ling-adv', label: 'Adverb / ظرف' },
          { cls: 'ling-tag ling-prep', label: 'Preposition / حرف جر' },
          { cls: 'ling-tag ling-conj', label: 'Conjunction / عطف' },
          { cls: 'ling-tag ling-pronoun', label: 'Pronoun / ضمير' },
        ].map(({ cls, label }) => (
          <span key={label} className={`${cls} text-[10px] font-medium`}>{label}</span>
        ))}
      </div>

      {/* Stats table — only in standalone mode or when stats exist */}
      {stats && standalone && (
        <div className="mt-3 pt-3 border-t border-border/40">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
            إحصائيات البنية النحوية
          </p>
          <div className="grid grid-cols-4 gap-1.5 text-[11px]">
            {[
              { label: 'أسماء', count: stats.nouns, color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'أفعال', count: stats.verbs, color: 'text-blue-600 dark:text-blue-400' },
              { label: 'صفات', count: stats.adjectives, color: 'text-amber-600 dark:text-amber-400' },
              { label: 'ظروف', count: stats.adverbs, color: 'text-purple-600 dark:text-purple-400' },
              { label: 'حروف جر', count: stats.prepositions, color: 'text-pink-600 dark:text-pink-400' },
              { label: 'أحرف عطف', count: stats.conjunctions, color: 'text-orange-600 dark:text-orange-400' },
              { label: 'ضمائر', count: stats.pronouns, color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'إجمالي', count: stats.total, color: 'text-foreground font-bold' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex flex-col items-center p-2 rounded border border-border bg-secondary/30">
                <span className={`text-lg font-bold ${color}`}>{count}</span>
                <span className="text-muted-foreground text-[10px]">{label}</span>
              </div>
            ))}
          </div>

          {/* Key terms */}
          {keyTerms.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5">
                المصطلحات المفتاحية المستخرجة
              </p>
              <div className="flex flex-wrap gap-1.5">
                {keyTerms.map((term, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[11px] rounded border border-primary/20 bg-primary/5 text-primary font-medium"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compact stats — inline mode */}
      {stats && !standalone && (
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          {stats.nouns > 0 && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-500/20">{stats.nouns} أسماء</span>}
          {stats.verbs > 0 && <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded border border-blue-500/20">{stats.verbs} أفعال</span>}
          {stats.adjectives > 0 && <span className="px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border border-amber-500/20">{stats.adjectives} صفات</span>}
          {stats.adverbs > 0 && <span className="px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded border border-purple-500/20">{stats.adverbs} ظروف</span>}
        </div>
      )}
    </div>
  );
}
