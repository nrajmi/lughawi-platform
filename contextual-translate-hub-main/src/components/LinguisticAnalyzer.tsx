import React, { useEffect, useState, useCallback, useRef } from "react";
import { analyzeMorphology, type MorphToken, type MorphResult } from "@/lib/translate.functions";
import { Loader2, AlertCircle, BookOpen } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// POS Color Palette — Academic & Comfortable
// ─────────────────────────────────────────────────────────────────────────────
const POS_CONFIG: Record<
  string,
  { label: string; labelAr: string; bg: string; text: string; border: string }
> = {
  noun: {
    label: "Noun",
    labelAr: "اسم",
    bg: "bg-emerald-500/12 dark:bg-emerald-400/10",
    text: "text-emerald-800 dark:text-emerald-300",
    border: "border-emerald-400/40 dark:border-emerald-500/30",
  },
  proper_noun: {
    label: "Proper Noun",
    labelAr: "اسم علَم",
    bg: "bg-teal-500/12 dark:bg-teal-400/10",
    text: "text-teal-800 dark:text-teal-300",
    border: "border-teal-400/40 dark:border-teal-500/30",
  },
  verb: {
    label: "Verb",
    labelAr: "فعل",
    bg: "bg-blue-500/12 dark:bg-blue-400/10",
    text: "text-blue-800 dark:text-blue-300",
    border: "border-blue-400/40 dark:border-blue-500/30",
  },
  adjective: {
    label: "Adjective",
    labelAr: "صفة",
    bg: "bg-amber-500/12 dark:bg-amber-400/10",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-400/40 dark:border-amber-500/30",
  },
  adverb: {
    label: "Adverb",
    labelAr: "ظرف",
    bg: "bg-purple-500/12 dark:bg-purple-400/10",
    text: "text-purple-800 dark:text-purple-300",
    border: "border-purple-400/40 dark:border-purple-500/30",
  },
  preposition: {
    label: "Preposition",
    labelAr: "حرف جر",
    bg: "bg-rose-500/12 dark:bg-rose-400/10",
    text: "text-rose-800 dark:text-rose-300",
    border: "border-rose-400/40 dark:border-rose-500/30",
  },
  conjunction: {
    label: "Conjunction",
    labelAr: "حرف عطف",
    bg: "bg-orange-500/12 dark:bg-orange-400/10",
    text: "text-orange-800 dark:text-orange-300",
    border: "border-orange-400/40 dark:border-orange-500/30",
  },
  pronoun: {
    label: "Pronoun",
    labelAr: "ضمير",
    bg: "bg-indigo-500/12 dark:bg-indigo-400/10",
    text: "text-indigo-800 dark:text-indigo-300",
    border: "border-indigo-400/40 dark:border-indigo-500/30",
  },
  article: {
    label: "Article",
    labelAr: "أداة تعريف",
    bg: "bg-slate-500/10 dark:bg-slate-400/8",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-400/30",
  },
  particle: {
    label: "Particle",
    labelAr: "حرف",
    bg: "bg-fuchsia-500/10 dark:bg-fuchsia-400/8",
    text: "text-fuchsia-700 dark:text-fuchsia-300",
    border: "border-fuchsia-400/30",
  },
  numeral: {
    label: "Numeral",
    labelAr: "عدد",
    bg: "bg-cyan-500/12 dark:bg-cyan-400/10",
    text: "text-cyan-800 dark:text-cyan-300",
    border: "border-cyan-400/40",
  },
  other: {
    label: "",
    labelAr: "",
    bg: "",
    text: "text-foreground",
    border: "",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Token Component
// ─────────────────────────────────────────────────────────────────────────────
function AnnotatedToken({ token, isRTL }: { token: MorphToken; isRTL: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const cfg = POS_CONFIG[token.pos] || POS_CONFIG.other;
  const hasAnnotation = token.pos !== "other" && cfg.label;

  const label = isRTL ? cfg.labelAr : cfg.label;
  const tooltipText = token.gloss
    ? `${label}${token.lemma ? ` · ${token.lemma}` : ""} — ${token.gloss}`
    : label
      ? `${label}${token.lemma ? ` · ${token.lemma}` : ""}`
      : "";

  if (!hasAnnotation) {
    return <span className="text-foreground">{token.text} </span>;
  }

  return (
    <span className="relative inline-block" style={{ margin: "0 1px" }}>
      <span
        className={[
          "inline rounded px-1 py-0.5 font-medium border cursor-help transition-all duration-150",
          cfg.bg,
          cfg.text,
          cfg.border,
          "hover:brightness-110 hover:shadow-sm",
        ].join(" ")}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={tooltipText}
      >
        {token.text}
      </span>
      {/* Tooltip */}
      {showTooltip && tooltipText && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 whitespace-nowrap bg-popover border border-border text-popover-foreground text-[10px] font-medium px-2 py-1 rounded shadow-lg pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150"
          dir="ltr"
        >
          {tooltipText}
        </span>
      )}
      {" "}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
interface LinguisticAnalyzerProps {
  text: string;
  lang: string;
  standalone?: boolean;
}

export function LinguisticAnalyzer({ text, lang, standalone = false }: LinguisticAnalyzerProps) {
  const [result, setResult] = useState<MorphResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTextRef = useRef<string>("");

  const isRTL = lang === "ar";

  const runAnalysis = useCallback(async (textToAnalyze: string, langCode: string) => {
    if (!textToAnalyze.trim()) {
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await analyzeMorphology({ data: { text: textToAnalyze, lang: langCode } });
      setResult(res);
    } catch (e) {
      console.error("Morphological analysis failed:", e);
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!text?.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    // Avoid re-analyzing the same text
    if (text === lastTextRef.current) return;
    lastTextRef.current = text;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Debounce: wait 1.2s after user stops typing to avoid unnecessary API calls
    debounceRef.current = setTimeout(() => {
      runAnalysis(text, lang);
    }, 1200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, lang, runAnalysis]);

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-3">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
          <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-primary/20 animate-ping" />
        </div>
        <p className="text-xs text-muted-foreground font-medium animate-pulse">
          {isRTL ? "جارٍ تحليل البنية الصرفية…" : "Analyzing morphological structure…"}
        </p>
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/30 bg-destructive/5">
        <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-destructive">
            {isRTL ? "فشل التحليل اللغوي" : "Analysis Failed"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  // ── Empty State ──
  if (!text?.trim() || !result) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground/50">
        <BookOpen className="h-7 w-7 opacity-30" />
        <p className="text-xs text-center">
          {isRTL
            ? "أدخل نصاً في خانة الترجمة لبدء التحليل الصرفي"
            : "Enter text above to begin morphological analysis"}
        </p>
      </div>
    );
  }

  // ── Legend Items ──
  const legendItems = (
    Object.entries(POS_CONFIG)
      .filter(([key, cfg]) => key !== "other" && cfg.label && result.stats[key] > 0)
  );

  return (
    <div className="leading-loose" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Annotated Text ── */}
      <div className="mb-4 text-sm leading-[2.2] tracking-wide">
        {result.tokens.map((token, idx) => (
          <AnnotatedToken key={idx} token={token} isRTL={isRTL} />
        ))}
      </div>

      {/* ── Legend ── */}
      {legendItems.length > 0 && (
        <div className="pt-3 border-t border-border/40 flex flex-wrap gap-1.5 text-[10px] mb-3">
          {legendItems.map(([key, cfg]) => (
            <span
              key={key}
              className={[
                "inline-flex items-center px-2 py-0.5 rounded border font-medium",
                cfg.bg, cfg.text, cfg.border,
              ].join(" ")}
            >
              {isRTL ? cfg.labelAr : cfg.label}
            </span>
          ))}
        </div>
      )}

      {/* ── Stats Grid (standalone mode) ── */}
      {standalone && Object.keys(result.stats).length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/40">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
            {isRTL ? "إحصائيات البنية الصرفية" : "Morphological Statistics"}
          </p>
          <div className="grid grid-cols-4 gap-1.5 text-[11px]">
            {Object.entries(result.stats).map(([pos, count]) => {
              const cfg = POS_CONFIG[pos];
              if (!cfg || !cfg.label) return null;
              return (
                <div
                  key={pos}
                  className={[
                    "flex flex-col items-center p-2 rounded border",
                    cfg.bg, cfg.border,
                  ].join(" ")}
                >
                  <span className={`text-lg font-bold ${cfg.text}`}>{count}</span>
                  <span className="text-muted-foreground text-[10px] text-center">
                    {isRTL ? cfg.labelAr : cfg.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Key Terms */}
          {result.keyTerms.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5">
                {isRTL ? "المصطلحات المفتاحية المستخرجة" : "Extracted Key Terms"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.keyTerms.map((term, i) => (
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

      {/* ── Compact Stats (inline mode) ── */}
      {!standalone && Object.keys(result.stats).length > 0 && (
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          {Object.entries(result.stats).map(([pos, count]) => {
            const cfg = POS_CONFIG[pos];
            if (!cfg?.label) return null;
            return (
              <span
                key={pos}
                className={[
                  "px-2 py-1 rounded border font-medium",
                  cfg.bg, cfg.text, cfg.border,
                ].join(" ")}
              >
                {count} {isRTL ? cfg.labelAr : cfg.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
