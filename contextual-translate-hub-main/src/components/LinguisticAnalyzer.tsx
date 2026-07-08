import React, { useMemo } from 'react';
import nlp from 'compromise';

interface LinguisticAnalyzerProps {
  text: string;
  lang: string;
}

export function LinguisticAnalyzer({ text, lang }: LinguisticAnalyzerProps) {
  const analyzedText = useMemo(() => {
    if (!text) return null;
    
    // Compromise is mainly for English. We'll run it and try to extract tags.
    try {
      const doc = nlp(text);
      const json = doc.json();
      
      return json.map((sentence: any, sIdx: number) => (
        <span key={sIdx} className="mr-1">
          {sentence.terms.map((term: any, tIdx: number) => {
            const tags = term.tags || [];
            
            // Determine highlight color based on part of speech
            let colorClass = "";
            let tooltip = "";
            
            if (tags.includes("Verb")) {
              colorClass = "text-blue-500 font-bold bg-blue-500/10 rounded px-0.5";
              tooltip = "Verb (فعل)";
            } else if (tags.includes("Noun")) {
              colorClass = "text-emerald-500 font-bold bg-emerald-500/10 rounded px-0.5";
              tooltip = "Noun (اسم)";
            } else if (tags.includes("Adjective")) {
              colorClass = "text-amber-500 font-bold bg-amber-500/10 rounded px-0.5";
              tooltip = "Adjective (صفة)";
            } else if (tags.includes("Adverb")) {
              colorClass = "text-purple-500 font-bold bg-purple-500/10 rounded px-0.5";
              tooltip = "Adverb (ظرف)";
            } else if (tags.includes("Preposition")) {
              colorClass = "text-pink-500 font-semibold bg-pink-500/10 rounded px-0.5";
              tooltip = "Preposition (حرف جر)";
            } else if (tags.includes("Conjunction")) {
              colorClass = "text-orange-500 font-semibold bg-orange-500/10 rounded px-0.5";
              tooltip = "Conjunction (حرف عطف)";
            }

            return (
              <span key={tIdx}>
                <span 
                  className={colorClass} 
                  title={tooltip ? `${term.text} - ${tooltip}` : ""}
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
    } catch (e) {
      return text;
    }
  }, [text, lang]);

  if (lang !== "en" && lang !== "auto") {
    // Note: compromise works best on English.
    return (
      <div className="leading-relaxed whitespace-pre-wrap">
        <div className="text-muted-foreground/60 italic text-[10px] mb-2 font-mono uppercase tracking-wider">
          (Syntax highlighting is optimized for English)
        </div>
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div className="leading-relaxed whitespace-pre-wrap">
      {analyzedText}
      <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap gap-2 text-[10px]">
        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded font-bold border border-emerald-500/20">Nouns</span>
        <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded font-bold border border-blue-500/20">Verbs</span>
        <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded font-bold border border-amber-500/20">Adjectives</span>
        <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded font-bold border border-purple-500/20">Adverbs</span>
        <span className="px-2 py-1 bg-pink-500/10 text-pink-500 rounded font-bold border border-pink-500/20">Prepositions</span>
      </div>
    </div>
  );
}
