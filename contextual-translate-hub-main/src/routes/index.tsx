import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Copy,
  Volume2,
  History,
  Languages,
  Trash2,
  Sun,
  Moon,
  BookOpen,
  Check,
  Lock,
  ChevronDown,
  ChevronUp,
  Info,
  Mic,
  MicOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Microscope,
  Sparkles,
  Mail,
  Wrench,
  BarChart2,
  BookCopy,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGES, TONES, type Tone } from "@/lib/translate";
import { translateText, analyzeMorphology } from "@/lib/translate.functions";
import { initTheme, toggleTheme, getTheme } from "@/lib/theme";
import { sanitizeInput, encryptData, decryptData } from "@/lib/security";
import { UI_TRANSLATIONS, type UILang } from "@/lib/uiTranslations";
import { findDictionaryMatches } from "@/lib/dictionary";
import { type DictionaryDomain, RELIGIOUS_GLOSSARY, type ReligiousGlossaryEntry, TECH_GLOSSARY, type TechGlossaryEntry, MEDICAL_GLOSSARY, type MedicalGlossaryEntry, LEGAL_GLOSSARY, type LegalGlossaryEntry } from "@/lib/dictionaries";
import { LinguisticAnalyzer } from "@/components/LinguisticAnalyzer";
import { TranslationBenchmark } from "@/components/TranslationBenchmark";
import { AcademicFlashcards } from "@/components/AcademicFlashcards";
import { AcademicRephraser } from "@/components/AcademicRephraser";
import { fetchWordDetails, type DictionaryApiResponse } from "@/lib/dictionary-api";
import { getPredictions } from "@/lib/predictive-text";
import { motion, AnimatePresence } from "framer-motion";
import { diagnosticService, type DiagnosticAlert } from "@/lib/SelfDiagnosticService";
import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// LEXICOGRAPHER MODE — وضع المعجمي — Phonetic Card
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Strict single-word detection: returns true ONLY if input is one token
 * (no spaces/newlines) with at least 2 characters.
 */
function isSingleWord(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 2) return false;
  return !/\s/.test(trimmed);
}

type PhoneticInfo = {
  ipa: string;
  pronunciation_guide: string;
} | null;

function PhoneticCard({
  word,
  lang,
  isRTL,
}: {
  word: string;
  lang: string;
  isRTL: boolean;
}) {
  const [phonetic, setPhonetic] = React.useState<PhoneticInfo>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const prevWordRef = React.useRef("");

  // Only fetch phonetics for English words — other languages just get TTS
  const isEnglish = lang === "en" || lang === "auto" || !lang;

  React.useEffect(() => {
    if (!word || prevWordRef.current === word) return;
    prevWordRef.current = word;

    // For non-English: skip API call, just show the word
    if (!isEnglish) {
      setPhonetic({ ipa: `/${word}/`, pronunciation_guide: "" });
      return;
    }

    setIsLoading(true);
    setPhonetic(null);

    (async () => {
      try {
        const result = await analyzeMorphology({ data: { text: word, lang: "en" } });
        const firstToken = result.tokens[0];
        // Use the lemma as the canonical form, and gloss as pronunciation guide
        setPhonetic({
          ipa: firstToken?.lemma ? `/${firstToken.lemma}/` : `/${word}/`,
          pronunciation_guide: firstToken?.gloss || "",
        });
      } catch {
        // Graceful fallback — just show the word
        setPhonetic({ ipa: `/${word}/`, pronunciation_guide: "" });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [word, lang, isEnglish]);

  const handleSpeak = () => {
    if (!(typeof window !== "undefined" && "speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = lang === "ar" ? "ar-SA" : lang === "es" ? "es-ES" : "en-US";
    u.rate = 0.82;
    u.pitch = 1.0;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const hasSpeech = typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <motion.div
      key={word}
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="classic-panel rounded-lg mb-4 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-primary/8 to-primary/3 dark:from-primary/12 dark:to-primary/4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary/15 flex items-center justify-center">
            <span className="text-primary text-[10px] font-bold font-serif">𝛼</span>
          </div>
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
            {isRTL ? "وضع المعجمي — النظام الصوتي" : "Lexicographer Mode — Phonetics"}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground/50 font-mono italic">
          {isRTL ? "كلمة مفردة" : "single word"}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex items-center gap-5" dir="ltr">
        {/* Word + IPA */}
        <div className="flex-1">
          <div className="text-2xl font-bold text-foreground tracking-tight mb-1" dir="auto">
            {word}
          </div>
          {isLoading ? (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              {isRTL ? "جارٍ توليد النظام الصوتي…" : "Generating phonetics…"}
            </div>
          ) : phonetic ? (
            <>
              <div className="font-mono text-sm text-primary/80 mb-0.5 tracking-widest">
                {phonetic.ipa}
              </div>
              {phonetic.pronunciation_guide && (
                <div className="text-[11px] text-muted-foreground italic">
                  {phonetic.pronunciation_guide}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Listen Button */}
        {hasSpeech && (
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className={[
              "flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 group",
              isSpeaking
                ? "border-primary bg-primary/10 text-primary scale-95"
                : "border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary text-muted-foreground",
            ].join(" ")}
            title={isRTL ? "استماع للنطق الصحيح" : "Listen to pronunciation"}
          >
            <div className={[
              "w-9 h-9 rounded-full flex items-center justify-center transition-all",
              isSpeaking ? "bg-primary/20" : "bg-secondary group-hover:bg-primary/10",
            ].join(" ")}>
              <Volume2 className={`h-4 w-4 transition-transform ${isSpeaking ? "scale-125" : ""}`} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              {isSpeaking
                ? (isRTL ? "يُنطق…" : "Playing…")
                : (isRTL ? "استماع" : "Listen")}
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export const Route = createFileRoute("/")({
  component: TranslatorPage,
  head: () => ({
    meta: [
      { title: "لغوي — منصة الترجمة السياقية المتخصصة | Lughawi" },
      { name: "description", content: "لغوي (Lughawi) — منصة ترجمة احترافية بالذكاء الاصطناعي مع معاجم متخصصة في القانون، الطب، التقنية، والدين. ترجمة دقيقة بثلاث لغات: العربية، الإنجليزية، والإسبانية." },
      { name: "author", content: "nrajmi" },
      { name: "creator", content: "nrajmi" },
      { name: "robots", content: "index, follow" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { httpEquiv: "content-language", content: "ar, en, es" },
      { name: "keywords", content: "لغوي, Lughawi, ترجمة سياقية, ترجمة متخصصة, معجم طبي, معجم قانوني, معجم تقني, ترجمة دينية, WHO ICD-11, Black's Law, AI Translation, Arabic English Spanish, Generative AI translation" },
      { property: "og:title", content: "لغوي — منصة الترجمة السياقية المتخصصة | Lughawi" },
      { property: "og:site_name", content: "لغوي — Lughawi" },
      { property: "og:description", content: "منصة ترجمة احترافية بالذكاء الاصطناعي مع معاجم متخصصة مستندة إلى WHO ICD-11 وBlack's Law وIEEE." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_SA" },
      { property: "og:locale:alternate", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "لغوي — Lughawi | منصة الترجمة السياقية" },
      { name: "twitter:description", content: "ترجمة سياقية متخصصة في القانون، الطب، التقنية، والدين — مدعومة بالذكاء الاصطناعي" },
      { name: "application-name", content: "لغوي" },
      { name: "apple-mobile-web-app-title", content: "لغوي" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "theme-color", content: "#1E3A5F" },
    ],
  }),
});

type HistoryItem = {
  id: string;
  source: string;
  target: string;
  sourceText: string;
  translated: string;
  tone: Tone;
  domain?: DictionaryDomain;
  at: number;
};

const HISTORY_KEY = "lughawi.history.v1";
const UI_LANG_KEY = "lughawi.ui.lang";

const DOMAINS: { value: DictionaryDomain; label: { ar: string; en: string; es: string }; icon: string }[] = [
  { value: "general", label: { ar: "عام", en: "General", es: "General" }, icon: "✦" },
  { value: "medical", label: { ar: "طبي", en: "Medical", es: "Médico" }, icon: "⚕" },
  { value: "legal", label: { ar: "قانوني", en: "Legal", es: "Legal" }, icon: "⚖" },
  { value: "tech", label: { ar: "تقني", en: "Technical", es: "Técnico" }, icon: "⌨" },
  { value: "religious", label: { ar: "ديني", en: "Religious", es: "Religioso" }, icon: "☽" },
];

function TranslatorPage() {
  const [source, setSource] = useState<"auto" | "ar" | "en" | "es">("auto");
  const [target, setTarget] = useState<"ar" | "en" | "es">("ar");
  const [tone, setTone] = useState<Tone>("general");
  const [domain, setDomain] = useState<DictionaryDomain>("general");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [detected, setDetected] = useState<string | null>(null);
  const [terms, setTerms] = useState<{ term: string; note: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState<"in" | "out" | null>(null);
  const [uiLanguage, setUiLanguage] = useState<UILang>("ar");
  const [diagnosticAlert, setDiagnosticAlert] = useState<DiagnosticAlert | null>(null);
  const [dictQuery, setDictQuery] = useState("");
  const [dictResult, setDictResult] = useState<DictionaryApiResponse | null>(null);
  const [isDictLoading, setIsDictLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showLexicon, setShowLexicon] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [hoveredGlossary, setHoveredGlossary] = useState<ReligiousGlossaryEntry | null>(null);
  const [hoveredTechGlossary, setHoveredTechGlossary] = useState<TechGlossaryEntry | null>(null);
  const [hoveredMedGlossary, setHoveredMedGlossary] = useState<MedicalGlossaryEntry | null>(null);
  const [hoveredLegalGlossary, setHoveredLegalGlossary] = useState<LegalGlossaryEntry | null>(null);
  // Main page mode: translator or linguistic tools hub
  const [mainTab, setMainTab] = useState<"translator" | "tools">("translator");
  // Active tool inside the tools hub
  const [activeTool, setActiveTool] = useState<"analyzer" | "benchmark" | "flashcards" | "rephraser">("analyzer");
  const [analyzerText, setAnalyzerText] = useState("");
  const debounceRef = useRef<number | null>(null);

  const t = useMemo(() => UI_TRANSLATIONS[uiLanguage], [uiLanguage]);
  const isRTL = uiLanguage === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = uiLanguage;
  }, [uiLanguage, isRTL]);

  useEffect(() => {
    initTheme();
    setIsDark(getTheme() === "dark");
    const savedUiLang = localStorage.getItem(UI_LANG_KEY) as UILang;
    if (savedUiLang && ["ar", "en", "es"].includes(savedUiLang)) setUiLanguage(savedUiLang);
    const loadHistory = async () => {
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (raw) setHistory(JSON.parse(await decryptData(raw)));
      } catch { localStorage.removeItem(HISTORY_KEY); }
    };
    loadHistory();
  }, []);

  const saveHistory = async (list: HistoryItem[]) => {
    try { localStorage.setItem(HISTORY_KEY, await encryptData(JSON.stringify(list))); } catch {}
  };

  useEffect(() => {
    if (!input.trim()) { setOutput(""); setDetected(null); setTerms([]); setDiagnosticAlert(null); return; }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      setDiagnosticAlert(null);
      try {
        const clean = sanitizeInput(input);
        const res = await translateText({ data: { text: clean, source, target, tone, domain } });
        setOutput(res.translated);
        setDetected(res.detected);
        setTerms(res.terms);
        const item: HistoryItem = { id: crypto.randomUUID(), source: res.detected, target, sourceText: clean, translated: res.translated, tone, domain, at: Date.now() };
        setHistory(prev => { const next = [item, ...prev.filter(p => p.sourceText !== clean)].slice(0, 30); saveHistory(next); return next; });
      } catch (err) {
        console.error("Translation failed:", err);
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("CLIENT_FALLBACK_REQUIRED")) {
          try {
            const clean = sanitizeInput(input);
            const sl = source === 'auto' ? 'auto' : source;
            const tl = target;
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(clean)}`;
            const resFallback = await fetch(url);
            if (!resFallback.ok) throw new Error("Browser fallback failed");
            const json = await resFallback.json();
            const translatedFallback = json[0].map((item: any) => item[0]).join('');
            const detectedFallback = source === "auto" ? (json[2] || source) : source;
            
            const localMatches = findDictionaryMatches(clean, tone, domain);
            const fallbackTerms: {term: string, note: string}[] = [];
            localMatches.forEach((localItem) => {
              const detectedKey = (detectedFallback === "ar" || detectedFallback === "en" || detectedFallback === "es") ? detectedFallback : "en";
              const srcVal = localItem.translations[detectedKey as keyof typeof localItem.translations] || localItem.term;
              const targetTranslation = localItem.translations[target as keyof typeof localItem.translations];
              const nuanceNote = localItem.nuances[tone]?.[target as keyof typeof localItem.nuances["general"]];
              if (targetTranslation && nuanceNote && !fallbackTerms.some(t => t.term.toLowerCase() === srcVal.toLowerCase())) {
                fallbackTerms.push({ term: srcVal, note: `-> ${targetTranslation}: ${nuanceNote}` });
              }
            });
            
            setOutput(translatedFallback);
            setDetected(detectedFallback);
            setTerms(fallbackTerms);
            const item: HistoryItem = { id: crypto.randomUUID(), source: detectedFallback, target, sourceText: clean, translated: translatedFallback, tone, domain, at: Date.now() };
            setHistory(prev => { const next = [item, ...prev.filter(p => p.sourceText !== clean)].slice(0, 30); saveHistory(next); return next; });
          } catch (fallbackErr) {
            setDiagnosticAlert(diagnosticService.analyzeError(fallbackErr));
            setOutput("");
            setTerms([]);
          }
        } else {
          setDiagnosticAlert(diagnosticService.analyzeError(err));
          setOutput("");
          setTerms([]);
        }
      }
      finally { setLoading(false); }
    }, 700);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [input, source, target, tone, domain]);

  useEffect(() => {
    if (!dictQuery.trim()) { setDictResult(null); return; }
    const d = setTimeout(async () => { setIsDictLoading(true); setDictResult(await fetchWordDetails(dictQuery.trim())); setIsDictLoading(false); }, 800);
    return () => clearTimeout(d);
  }, [dictQuery]);

  const stats = useMemo(() => ({ words: input.trim() ? input.trim().split(/\s+/).length : 0, chars: input.length }), [input]);

  const swap = () => {
    if (source === "auto") return;
    const prevSrc = source, prevOut = output;
    setSource(target); setTarget(prevSrc as "ar" | "en" | "es");
    setInput(prevOut); setOutput(input);
  };

  const copy = async (text: string, which: "in" | "out") => {
    try { await navigator.clipboard.writeText(text); setCopied(which); setTimeout(() => setCopied(null), 1400); } catch {}
  };

  const speak = (text: string, lang: string) => {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "ar" ? "ar-SA" : lang === "en" ? "en-US" : "es-ES";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r = new SR();
    r.lang = source === "ar" ? "ar-SA" : source === "es" ? "es-ES" : "en-US";
    r.onstart = () => setIsRecording(true);
    r.onresult = (e: any) => setInput(p => p ? p + " " + e.results[0][0].transcript : e.results[0][0].transcript);
    r.onerror = r.onend = () => setIsRecording(false);
    r.start();
  };

  const changeUiLanguage = (lang: UILang) => { setUiLanguage(lang); localStorage.setItem(UI_LANG_KEY, lang); };

  const localDictMatches = useMemo(() => findDictionaryMatches(input, tone, domain), [input, tone, domain]);

  // Alternatives panel data
  const alternatives = useMemo(() => {
    if (!output || !localDictMatches.length) return [];
    return localDictMatches.slice(0, 3).map(m => ({
      original: m.translations[detected as keyof typeof m.translations] || m.term,
      alt: m.translations[target as keyof typeof m.translations],
      nuance: m.nuances[tone]?.[target as keyof typeof m.nuances["general"]] || "",
    })).filter(a => a.alt && a.alt !== output.trim());
  }, [output, localDictMatches, detected, target, tone]);

  // Religious glossary matches in input
  const religiousMatches = useMemo(() => {
    if (domain !== "religious" || !input) return [];
    const norm = input.toLowerCase();
    return RELIGIOUS_GLOSSARY.filter(g =>
      norm.includes(g.arabic) || norm.includes(g.transliteration.toLowerCase()) || norm.includes(g.preferred_en.toLowerCase())
    );
  }, [domain, input]);

  // Tech glossary matches in input
  const techMatches = useMemo(() => {
    if (domain !== "tech" || !input) return [];
    const norm = input.toLowerCase();
    return TECH_GLOSSARY.filter(g =>
      norm.includes(g.english.toLowerCase()) || norm.includes(g.arabic) || (g.alternate_ar && g.alternate_ar.some(a => norm.includes(a)))
    );
  }, [domain, input]);

  // Medical glossary matches in input
  const medMatches = useMemo(() => {
    if (domain !== "medical" || !input) return [];
    const norm = input.toLowerCase();
    return MEDICAL_GLOSSARY.filter(g =>
      norm.includes(g.english.toLowerCase()) || norm.includes(g.arabic) || (g.alternate_ar && g.alternate_ar.some(a => norm.toLowerCase().includes(a.toLowerCase())))
    );
  }, [domain, input]);

  // Legal glossary matches in input
  const legalMatches = useMemo(() => {
    if (domain !== "legal" || !input) return [];
    const norm = input.toLowerCase();
    return LEGAL_GLOSSARY.filter(g =>
      norm.includes(g.english.toLowerCase()) || norm.includes(g.arabic) || (g.alternate_ar && g.alternate_ar.some(a => norm.toLowerCase().includes(a.toLowerCase())))
    );
  }, [domain, input]);

  const domainLabel = (d: DictionaryDomain) => DOMAINS.find(x => x.value === d)?.label[uiLanguage] ?? d;
  const targetIsRTL = target === "ar";

  const isReligious = domain === "religious";
  const isTech = domain === "tech";
  const isMedical = domain === "medical";
  const isLegal = domain === "legal";

  return (
    <div className={cn("min-h-screen flex flex-col", isDark ? "dark" : "")}>

      {/* ═══════════ NAVBAR ═══════════ */}
      <header className="classic-navbar sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-5 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary shadow-md" style={{ boxShadow: "0 2px 12px hsla(var(--primary), 0.35)" }}>
              <Languages className="h-5 w-5 text-primary-foreground" />
            </div>
            {/* Brand Name */}
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-2 leading-none">
                <span
                  className="font-display font-bold tracking-tight text-foreground leading-none"
                  style={{ fontSize: "1.15rem", fontFamily: "'Amiri', 'Cairo', serif", letterSpacing: "0.01em" }}
                >
                  منصة لغوي
                </span>
                <span
                  className="text-muted-foreground font-medium"
                  style={{ fontSize: "0.68rem", fontFamily: "'Libre Baskerville', Georgia, serif", letterSpacing: "0.04em", opacity: 0.65 }}
                >
                  Lughawi Platform
                </span>
              </div>
              <p
                className="text-muted-foreground leading-none mt-0.5"
                style={{ fontSize: "0.62rem", letterSpacing: "0.03em", opacity: 0.55 }}
              >
                {isRTL ? "للترجمة السياقية المتخصصة" : "Contextual Specialized Translation"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded border border-border overflow-hidden text-[11px] font-medium">
              {(["ar", "en"] as UILang[]).map((lang, i) => (
                <button
                  key={lang}
                  onClick={() => changeUiLanguage(lang)}
                  className={cn(
                    "px-2.5 py-1.5 uppercase transition-colors",
                    i > 0 && "border-s border-border",
                    uiLanguage === lang ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsDark(toggleTheme())}
              className="w-8 h-8 flex items-center justify-center rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════ MAIN ═══════════ */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-5 py-6">

        {/* ══ MAIN PAGE TAB SWITCHER — Translator / Linguistic Tools ══ */}
        <div className="border-b border-border mb-5 flex items-center">
          <button
            id="main-tab-translator"
            onClick={() => setMainTab("translator")}
            className={cn("main-tab gap-2", mainTab === "translator" && "main-tab-active")}
          >
            <Languages className="h-3.5 w-3.5" />
            {isRTL ? "الترجمة" : "Translation"}
          </button>
          <button
            id="main-tab-tools"
            onClick={() => setMainTab("tools")}
            className={cn("main-tab gap-2 relative", mainTab === "tools" && "main-tab-active")}
          >
            <Wrench className="h-3.5 w-3.5" />
            {isRTL ? "الأدوات اللغوية المساعدة" : "Linguistic Tools"}
            <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
              {isRTL ? "جديد" : "New"}
            </span>
          </button>
        </div>

        {/* ══════════ TRANSLATOR MODE ══════════ */}
        {mainTab === "translator" && (<>

        {/* ── Domain Tabs ── */}
        <div className="border-b border-border mb-5 flex items-center overflow-x-auto">
          <div className="flex items-center flex-1 min-w-0">
            {DOMAINS.map(d => (
              <button
                key={d.value}
                onClick={() => setDomain(d.value)}
                className={cn(
                  "domain-tab gap-1.5 flex-shrink-0",
                  domain === d.value
                    ? "text-primary border-b-2 border-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                )}
              >
                <span className="text-xs opacity-70">{d.icon}</span>
                {d.label[uiLanguage]}
                {d.value === "general" && (
                  <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                    {isRTL ? "تنبؤ" : "AI"}
                  </span>
                )}
                {d.value === "religious" && (
                  <span className="text-[9px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                    {isRTL ? "جديد" : "New"}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tone selector — affects translation style/register */}
          <div className="flex items-center border-s border-border flex-shrink-0 gap-0.5 px-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-wider px-1 hidden sm:inline">
              {isRTL ? "نغمة" : "style"}
            </span>
            {TONES.map(tn => {
              const toneColors: Record<string, string> = {
                general: "text-foreground border-foreground/50",
                academic: "text-blue-600 dark:text-blue-400 border-blue-500",
                technical: "text-cyan-600 dark:text-cyan-400 border-cyan-500",
                creative: "text-purple-600 dark:text-purple-400 border-purple-500",
              };
              const isActive = tone === tn.value;
              return (
                <button
                  key={tn.value}
                  onClick={() => setTone(tn.value)}
                  title={tn.value === "general" ? t.generalToneHint : tn.value === "academic" ? t.academicToneHint : tn.value === "technical" ? t.technicalToneHint : t.creativeToneHint}
                  className={cn(
                    "domain-tab text-[11px] transition-all duration-150 rounded-md px-2",
                    isActive
                      ? cn("font-bold border-b-2", toneColors[tn.value])
                      : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                  )}
                >
                  {tn.value === "general" ? t.generalTone : tn.value === "academic" ? t.academicTone : tn.value === "technical" ? t.technicalTone : t.creativeTone}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Language Bar ── */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <LanguageSelect value={source} onChange={v => setSource(v as any)} includeAuto uiLang={uiLanguage} />

          <button
            onClick={swap}
            disabled={source === "auto"}
            className={cn(
              "swap-btn flex-shrink-0",
              source === "auto" ? "opacity-30 cursor-not-allowed" : "hover:bg-secondary hover:border-primary/40 hover:text-primary"
            )}
            title={isRTL ? "تبديل اللغتين" : "Swap languages"}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
          </button>

          <LanguageSelect value={target} onChange={v => setTarget(v as any)} uiLang={uiLanguage} />

          {detected && source === "auto" && (
            <span className="text-[11px] text-muted-foreground border border-border rounded px-2 py-1 bg-secondary">
              {isRTL ? "اللغة المكتشفة:" : "Detected:"}{" "}
              <strong className="text-foreground">{LANGUAGES.find(l => l.code === detected)?.name ?? detected}</strong>
            </span>
          )}

          {/* Font size controls */}
          <div className="flex items-center ms-auto border border-border rounded overflow-hidden">
            <button onClick={() => setFontSize(s => Math.max(12, s - 2))} className="px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title={isRTL ? "تصغير" : "Smaller"}>
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 py-1 text-[11px] text-muted-foreground font-mono border-x border-border bg-muted">{fontSize}px</span>
            <button onClick={() => setFontSize(s => Math.min(28, s + 2))} className="px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title={isRTL ? "تكبير" : "Larger"}>
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setFontSize(16)} className="px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border-s border-border">
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* ── Religious Mode Notice ── */}
        {isReligious && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 flex items-start gap-3"
          >
            <span className="text-amber-600 dark:text-amber-400 text-lg leading-none mt-0.5">☽</span>
            <div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-0.5">
                {isRTL ? "وضع الترجمة الدينية الحذرة — المعجم المقيد نشط" : "Controlled Religious Translation Mode — Strict Glossary Active"}
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400/80 leading-relaxed">
                {isRTL
                  ? "تُطابَق المصطلحات الإسلامية والفقهية تلقائياً مع المعجم الأكاديمي المُحكَم المستند إلى مصادر علمية موثوقة (ابن منظور، هانز فير، عبد الحليم، وغيرهم) لضمان دقة الترجمة الدينية."
                  : "Islamic and jurisprudential terms are automatically matched against a strict academic glossary grounded in authoritative scholarly sources (Lane's Lexicon, Hans Wehr, Abdel Haleem, et al.) to ensure precise religious translation."}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Tech Mode Notice ── */}
        {isTech && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg border border-cyan-200 dark:border-cyan-800/50 bg-cyan-50 dark:bg-cyan-900/10 flex items-start gap-3"
          >
            <span className="text-cyan-600 dark:text-cyan-400 text-lg leading-none mt-0.5">⌨</span>
            <div>
              <p className="text-xs font-semibold text-cyan-800 dark:text-cyan-300 mb-0.5">
                {isRTL ? "وضع الترجمة التقنية الدقيقة — المعجم السيبراني نشط" : "Precision Tech Translation Mode — Cyber Glossary Active"}
              </p>
              <p className="text-[11px] text-cyan-700 dark:text-cyan-400/80 leading-relaxed">
                {isRTL
                  ? "تُطابَق المصطلحات التقنية تلقائياً مع المعجم المعتمد (هندسة البرمجيات، الذكاء الاصطناعي، الأمن السيبراني) لضمان تعريب دقيق وتجنب الترجمة الحرفية."
                  : "Technical terms are automatically matched against an authoritative IT glossary to ensure accurate Arabization and avoid literal translation."}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Medical Mode Notice ── */}
        {isMedical && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10 flex items-start gap-3"
          >
            <span className="text-emerald-600 dark:text-emerald-400 text-lg leading-none mt-0.5">⚕</span>
            <div>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-0.5">
                {isRTL ? "وضع الترجمة الطبية الدقيقة — المعجم السريري نشط" : "Clinical Translation Mode — WHO/ICD-11 Glossary Active"}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400/80 leading-relaxed">
                {isRTL
                  ? "تُطابَق المصطلحات الطبية تلقائياً مع المعجم السريري المعتمد (منظمة الصحة العالمية ICD-11، MeSH) لضمان دقة المصطلح الطبي."
                  : "Medical terms are automatically matched against WHO/ICD-11 and MeSH to ensure clinical accuracy and avoid colloquial translations."}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Legal Mode Notice ── */}
        {isLegal && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg border border-stone-300 dark:border-stone-700/50 bg-stone-50 dark:bg-stone-900/10 flex items-start gap-3"
          >
            <span className="text-stone-600 dark:text-stone-400 text-lg leading-none mt-0.5">⚖</span>
            <div>
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-300 mb-0.5">
                {isRTL ? "وضع الترجمة القانونية الدقيقة — المعجم التشريعي نشط" : "Legal Translation Mode — UNTERM/Black's Law Glossary Active"}
              </p>
              <p className="text-[11px] text-stone-700 dark:text-stone-400/80 leading-relaxed">
                {isRTL
                  ? "تُطابَق المصطلحات القانونية تلقائياً مع معجم جامعة الدول العربية وقاموس بلاك القانوني وقاعدة UNTERM لضمان الدقة التشريعية."
                  : "Legal terms are automatically matched against UNTERM, Black's Law Dictionary, and Arab League Terminology for legislative precision."}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Main Split-Pane ── */}
        <div className="classic-panel rounded-lg overflow-hidden mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr]">

            {/* INPUT PANEL */}
            <div className="flex flex-col min-h-[320px]">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.originalText}</span>
                <div className="flex items-center gap-1">
                  <button onClick={startRecording} className={cn("text-action-btn", isRecording ? "text-red-500 border-red-200" : "")} title={isRTL ? "تسجيل صوتي" : "Voice input"}>
                    {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => speak(input, detected ?? source)} className="text-action-btn" title={t.listen}><Volume2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => copy(input, "in")} className="text-action-btn" title={t.copy}>
                    {copied === "in" ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="relative flex-1 p-4">
                <textarea
                  value={input}
                  onChange={e => {
                    const val = e.target.value;
                    setInput(val);
                    setPredictions(domain === "general" ? getPredictions(val, source) : []);
                  }}
                  placeholder={isReligious
                    ? (isRTL ? "اكتب مصطلحاً إسلامياً أو فقهياً (مثل: التقوى، الغيب، فتوى)…" : "Enter an Islamic or jurisprudential term (e.g., التقوى, الغيب, فتوى)…")
                    : t.textareaPlaceholder
                  }
                  dir="auto"
                  style={{ fontSize: `${fontSize}px` }}
                  className="w-full h-full min-h-[260px] resize-none bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/40 leading-relaxed font-sans"
                />
                <AnimatePresence>
                  {domain === "general" && predictions.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                      {predictions.map((pred, i) => (
                        <button key={i} onClick={() => { setInput(pred); setPredictions([]); }} className="predict-chip hover:bg-accent/10 hover:border-accent/30">{pred}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="px-4 py-2 border-t border-border bg-secondary/20 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{stats.words} {t.words}</span>
                <span>·</span>
                <span>{stats.chars} {t.chars}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="translate-divider hidden lg:block" />
            <div className="block lg:hidden border-t border-dashed border-border" />

            {/* OUTPUT PANEL */}
            <div className="flex flex-col min-h-[320px]">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.translation}</span>
                <div className="flex items-center gap-1">
                  {/* Linguistic analysis toggle */}
                  <button
                    onClick={() => setShowAnalysis(v => !v)}
                    className={cn("text-action-btn gap-1", showAnalysis ? "bg-primary/10 border-primary/30 text-primary" : "")}
                    title={isRTL ? "التحليل اللغوي" : "Linguistic Analysis"}
                  >
                    <Microscope className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{isRTL ? "تحليل" : "Syntax"}</span>
                  </button>
                  <button onClick={() => speak(output, target)} className="text-action-btn" title={t.listen}><Volume2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => output && copy(output, "out")} className="text-action-btn" title={t.copy}>
                    {copied === "out" ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div
                className={cn("flex-1 p-4 leading-relaxed font-sans relative overflow-hidden", loading && "opacity-80 transition-opacity", !output && "italic text-muted-foreground/40")}
                dir={targetIsRTL ? "rtl" : "ltr"}
                style={{ fontSize: `${fontSize}px` }}
              >
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] z-10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-primary tracking-widest">{t.translating}</span>
                    </div>
                  </div>
                )}
                
                {diagnosticAlert && !loading && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background p-6" dir="auto">
                    <div className={cn(
                      "p-5 rounded-xl border w-full max-w-sm text-center shadow-sm animate-in zoom-in-95 duration-200",
                      diagnosticAlert.type === "API_TIMEOUT" ? "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400" :
                      diagnosticAlert.type === "ZOD_SCHEMA_MISMATCH" ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400" :
                      diagnosticAlert.type === "NETWORK_DISCONNECT" ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400" :
                      diagnosticAlert.type === "LLM_HALLUCINATION" ? "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400" :
                      "bg-destructive/10 border-destructive/30 text-destructive"
                    )}>
                      <h3 className="font-bold text-[15px] mb-2">{diagnosticAlert.title}</h3>
                      <p className="text-xs opacity-90 leading-relaxed font-medium">{diagnosticAlert.message}</p>
                      <div className="mt-4 pt-3 border-t border-current/20 text-[10px] opacity-70 font-mono">
                        {diagnosticAlert.type}
                      </div>
                    </div>
                  </div>
                )}

                {!output && !loading && !diagnosticAlert && (
                  <>{t.outputPlaceholder}</>
                )}
                {output && !diagnosticAlert && showAnalysis && <LinguisticAnalyzer text={output} lang={target} />}
                {output && !diagnosticAlert && !showAnalysis && <div className="whitespace-pre-wrap relative z-0">{output}</div>}
              </div>

              <div className="px-4 py-2 border-t border-border bg-secondary/20 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  {isReligious && <span className="text-amber-600 dark:text-amber-400">☽</span>}
                  <span>{domainLabel(domain)}</span>
                  <span>·</span>
                  <span>{tone === "general" ? t.generalTone : tone === "academic" ? t.academicTone : tone === "technical" ? t.technicalTone : t.creativeTone}</span>
                </span>
                {showAnalysis && (
                  <span className="flex items-center gap-1 text-primary text-[10px]">
                    <Microscope className="h-3 w-3" />
                    {isRTL ? "وضع التحليل اللغوي" : "Linguistic Analysis Mode"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Action Buttons Below Boxes ── */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => output && copy(output, "out")}
            disabled={!output}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border shadow-sm",
              !output 
                ? "opacity-50 cursor-not-allowed bg-secondary/50 border-border text-muted-foreground" 
                : "bg-card hover:bg-secondary border-border text-foreground hover:text-primary"
            )}
          >
            {copied === "out" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied === "out" ? (isRTL ? "تم النسخ!" : "Copied!") : (isRTL ? "نسخ النص المترجم" : "Copy Translation")}
          </button>
        </div>

        {/* ══════════ LEXICOGRAPHER MODE — PHONETIC CARD ══════════ */}
        {/* Appears ONLY when input is a single word — disappears for sentences */}
        <AnimatePresence>
          {isSingleWord(input) && (
            <PhoneticCard
              word={input.trim()}
              lang={detected ?? source}
              isRTL={isRTL}
            />
          )}
        </AnimatePresence>

        {/* ═══════════ RELIGIOUS THEOLOGICAL NUANCES ═══════════ */}
        {isReligious && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="classic-panel rounded-lg mb-4 overflow-hidden border-amber-200/60 dark:border-amber-800/40"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-amber-100/80 to-amber-50/40 dark:from-amber-900/40 dark:to-amber-950/20 border-b border-amber-200/60 dark:border-amber-800/40 flex items-start gap-4">
              <div className="p-2 bg-amber-200/50 dark:bg-amber-800/50 rounded-md shadow-sm border border-amber-300/50 dark:border-amber-700/50">
                <span className="text-amber-700 dark:text-amber-300 text-xl font-serif leading-none">☽</span>
              </div>
              <div className="pt-0.5">
                <h3 className="text-base font-serif font-bold text-amber-950 dark:text-amber-100">
                  {isRTL ? "معجم المصطلحات الإسلامية المعتمدة" : "Verified Islamic Glossary"}
                </h3>
                <p className="text-xs text-amber-800/80 dark:text-amber-200/70 mt-1 leading-relaxed max-w-lg">
                  {isRTL
                    ? "قاعدة بيانات لغوية دقيقة تجمع الترجمات الأكاديمية والشرعية المعتمدة للمصطلحات الدينية، لضمان أعلى درجات الموثوقية في نقل المعنى."
                    : "A precision linguistic database aggregating academically and jurisprudentially vetted translations for religious terms, ensuring the highest reliability."}
                </p>
              </div>
            </div>

            <div className="p-4">
              {/* Glossary quick-access chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {RELIGIOUS_GLOSSARY.map(g => (
                  <button
                    key={g.arabic}
                    onClick={() => setHoveredGlossary(hoveredGlossary?.arabic === g.arabic ? null : g)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all",
                      hoveredGlossary?.arabic === g.arabic
                        ? "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300"
                        : "bg-secondary border-border text-foreground hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    )}
                  >
                    <span className="font-arabic text-sm font-bold">{g.arabic}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-[11px]">{g.preferred_en}</span>
                  </button>
                ))}
              </div>

              {/* Expanded glossary entry */}
              <AnimatePresence>
                {hoveredGlossary && (
                  <motion.div
                    key={hoveredGlossary.arabic}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 bg-amber-50/40 dark:bg-amber-900/10">
                      {/* Term header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="font-arabic font-bold text-xl text-foreground">{hoveredGlossary.arabic}</span>
                            <span className="text-xs text-muted-foreground font-mono italic">{hoveredGlossary.transliteration}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">{hoveredGlossary.preferred_en}</span>
                            {hoveredGlossary.alternate_en.slice(0, 2).map((alt, i) => (
                              <span key={i} className="text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary">{alt}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Rationale */}
                      <div className="mb-3 p-3 bg-white/60 dark:bg-card/60 rounded border border-amber-100 dark:border-amber-800/30">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          {isRTL ? "مسوّغ الاختيار الاصطلاحي" : "Terminological Rationale"}
                        </p>
                        <p className="text-xs text-foreground leading-relaxed">{hoveredGlossary.rationale}</p>
                      </div>

                      {/* Scholarly source */}
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <span>
                          <strong className="text-foreground">{isRTL ? "المصادر العلمية:" : "Scholarly Sources:"}</strong>{" "}
                          {hoveredGlossary.scholarly_source}
                        </span>
                      </div>

                      {/* Caution if exists */}
                      {hoveredGlossary.caution && (
                        <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] text-red-700 dark:text-red-400">{hoveredGlossary.caution}</p>
                        </div>
                      )}

                      {/* Alternate translations */}
                      {hoveredGlossary.alternate_en.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-amber-200/40 dark:border-amber-800/30">
                          <p className="text-[10px] uppercase font-bold text-amber-700/70 dark:text-amber-400/70 tracking-wider mb-2.5 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                            {isRTL ? "ترجمات بديلة مقبولة أكاديمياً" : "Academically Accepted Alternatives"}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {hoveredGlossary.alternate_en.map((alt, i) => (
                              <button
                                key={i}
                                onClick={() => { setInput(alt); setDictQuery(alt); }}
                                className="alt-chip text-[11px] hover:bg-primary/10 hover:border-primary/30"
                              >
                                {alt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Matched glossary terms from input */}
              {religiousMatches.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    {isRTL ? "مصطلحات مكتشفة في النص" : "Terms Detected in Your Text"}
                  </p>
                  <div className="space-y-2">
                    {religiousMatches.map(g => (
                      <div key={g.arabic} className="flex items-center gap-3 text-xs">
                        <span className="font-arabic font-bold text-foreground">{g.arabic}</span>
                        <span className="text-muted-foreground/50">→</span>
                        <span className="font-semibold text-amber-700 dark:text-amber-400">{g.preferred_en}</span>
                        <button onClick={() => setHoveredGlossary(g)} className="text-[10px] text-primary hover:underline ms-auto">
                          {isRTL ? "تفاصيل" : "Details"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════ TECH CYBER NUANCES ═══════════ */}
        {isTech && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="classic-panel rounded-lg mb-4 overflow-hidden border-cyan-200/60 dark:border-cyan-800/40"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-cyan-100/80 to-cyan-50/40 dark:from-cyan-900/40 dark:to-cyan-950/20 border-b border-cyan-200/60 dark:border-cyan-800/40 flex items-start gap-4">
              <div className="p-2 bg-cyan-200/50 dark:bg-cyan-800/50 rounded-md shadow-sm border border-cyan-300/50 dark:border-cyan-700/50">
                <span className="text-cyan-700 dark:text-cyan-300 text-xl font-serif leading-none">⌨</span>
              </div>
              <div className="pt-0.5">
                <h3 className="text-base font-serif font-bold text-cyan-950 dark:text-cyan-100">
                  {isRTL ? "المعجم التقني المعتمد" : "Authoritative Tech Glossary"}
                </h3>
                <p className="text-xs text-cyan-800/80 dark:text-cyan-200/70 mt-1 leading-relaxed max-w-lg">
                  {isRTL
                    ? "قاعدة بيانات لغوية دقيقة تجمع التعريب المعتمد لمصطلحات الذكاء الاصطناعي التوليدي، وهندسة البرمجيات، والأمن السيبراني."
                    : "A precision linguistic database aggregating vetted Arabization for Generative AI, Software Engineering, and Cyber Security terms."}
                </p>
              </div>
            </div>

            <div className="p-4">
              {/* Glossary quick-access chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {TECH_GLOSSARY.map(g => (
                  <button
                    key={g.english}
                    onClick={() => setHoveredTechGlossary(hoveredTechGlossary?.english === g.english ? null : g)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all",
                      hoveredTechGlossary?.english === g.english
                        ? "bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700 text-cyan-800 dark:text-cyan-300"
                        : "bg-secondary border-border text-foreground hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                    )}
                  >
                    <span className="font-sans text-sm font-bold">{g.english}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-arabic text-[11px]">{g.arabic}</span>
                  </button>
                ))}
              </div>

              {/* Expanded glossary entry */}
              <AnimatePresence>
                {hoveredTechGlossary && (
                  <motion.div
                    key={hoveredTechGlossary.english}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-cyan-200 dark:border-cyan-800/50 rounded-lg p-4 bg-cyan-50/40 dark:bg-cyan-900/10">
                      {/* Term header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="font-sans font-bold text-xl text-foreground">{hoveredTechGlossary.english}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="font-arabic text-sm font-semibold text-cyan-800 dark:text-cyan-300">{hoveredTechGlossary.arabic}</span>
                            {hoveredTechGlossary.alternate_ar.slice(0, 2).map((alt, i) => (
                              <span key={i} className="font-arabic text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary">{alt}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Rationale */}
                      <div className="mb-3 p-3 bg-white/60 dark:bg-card/60 rounded border border-cyan-100 dark:border-cyan-800/30">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          {isRTL ? "مسوّغ التعريب" : "Arabization Rationale"}
                        </p>
                        <p className="text-xs text-foreground leading-relaxed">{hoveredTechGlossary.rationale}</p>
                      </div>

                      {/* Industry standard source */}
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                        <span>
                          <strong className="text-foreground">{isRTL ? "المعيار التقني:" : "Industry Standard:"}</strong>{" "}
                          {hoveredTechGlossary.industry_standard}
                        </span>
                      </div>

                      {/* Caution if exists */}
                      {hoveredTechGlossary.caution && (
                        <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] text-red-700 dark:text-red-400">{hoveredTechGlossary.caution}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Matched tech terms from input */}
              {techMatches.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    {isRTL ? "مصطلحات تقنية في النص" : "Tech Terms Detected"}
                  </p>
                  <div className="space-y-2">
                    {techMatches.map(g => (
                      <div key={g.english} className="flex items-center gap-3 text-xs">
                        <span className="font-sans font-bold text-foreground">{g.english}</span>
                        <span className="text-muted-foreground/50">→</span>
                        <span className="font-arabic font-semibold text-cyan-700 dark:text-cyan-400">{g.arabic}</span>
                        <button onClick={() => setHoveredTechGlossary(g)} className="text-[10px] text-primary hover:underline ms-auto">
                          {isRTL ? "تفاصيل" : "Details"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════ MEDICAL CLINICAL GLOSSARY ═══════════ */}
        {isMedical && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="classic-panel rounded-lg mb-4 overflow-hidden"
          >
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-100/80 to-emerald-50/40 dark:from-emerald-900/40 dark:to-emerald-950/20 border-b border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-4">
              <div className="p-2 bg-emerald-200/50 dark:bg-emerald-800/50 rounded-md shadow-sm border border-emerald-300/50 dark:border-emerald-700/50">
                <span className="text-emerald-700 dark:text-emerald-300 text-xl leading-none">⚕</span>
              </div>
              <div className="pt-0.5">
                <h3 className="text-base font-serif font-bold text-emerald-950 dark:text-emerald-100">
                  {isRTL ? "المعجم الطبي السريري المعتمد" : "WHO / ICD-11 Clinical Glossary"}
                </h3>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-200/70 mt-1 leading-relaxed max-w-lg">
                  {isRTL
                    ? "قاعدة بيانات طبية دقيقة مستندة إلى منظمة الصحة العالمية (ICD-11)، MeSH، ومراجع هاريسون ودورلاند الطبية."
                    : "A precision medical database grounded in WHO ICD-11, MeSH, Harrison's Internal Medicine, and Dorland's Medical Dictionary."}
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {MEDICAL_GLOSSARY.map(g => (
                  <button
                    key={g.english}
                    onClick={() => setHoveredMedGlossary(hoveredMedGlossary?.english === g.english ? null : g)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all",
                      hoveredMedGlossary?.english === g.english
                        ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300"
                        : "bg-secondary border-border text-foreground hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    )}
                  >
                    <span className="font-sans text-sm font-bold">{g.english}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-arabic text-[11px]">{g.arabic}</span>
                    {g.icd11_code && <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1 rounded">{g.icd11_code}</span>}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {hoveredMedGlossary && (
                  <motion.div
                    key={hoveredMedGlossary.english}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-4 bg-emerald-50/40 dark:bg-emerald-900/10">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="font-sans font-bold text-xl text-foreground">{hoveredMedGlossary.english}</span>
                            {hoveredMedGlossary.icd11_code && <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">ICD-11: {hoveredMedGlossary.icd11_code}</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="font-arabic text-sm font-semibold text-emerald-800 dark:text-emerald-300">{hoveredMedGlossary.arabic}</span>
                            {hoveredMedGlossary.alternate_ar.slice(0, 2).map((alt, i) => (
                              <span key={i} className="font-arabic text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary">{alt}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 p-3 bg-white/60 dark:bg-card/60 rounded border border-emerald-100 dark:border-emerald-800/30">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{isRTL ? "مسوّغ الترجمة الطبية" : "Clinical Rationale"}</p>
                        <p className="text-xs text-foreground leading-relaxed">{hoveredMedGlossary.rationale}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span><strong className="text-foreground">{isRTL ? "المرجع الطبي:" : "WHO Standard:"}</strong> {hoveredMedGlossary.who_standard}</span>
                      </div>
                      {hoveredMedGlossary.caution && (
                        <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] text-red-700 dark:text-red-400">{hoveredMedGlossary.caution}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {medMatches.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />{isRTL ? "مصطلحات طبية في النص" : "Medical Terms Detected"}
                  </p>
                  <div className="space-y-2">
                    {medMatches.map(g => (
                      <div key={g.english} className="flex items-center gap-3 text-xs">
                        <span className="font-sans font-bold text-foreground">{g.english}</span>
                        <span className="text-muted-foreground/50">→</span>
                        <span className="font-arabic font-semibold text-emerald-700 dark:text-emerald-400">{g.arabic}</span>
                        <button onClick={() => setHoveredMedGlossary(g)} className="text-[10px] text-primary hover:underline ms-auto">{isRTL ? "تفاصيل" : "Details"}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════ LEGAL GLOSSARY PANEL ═══════════ */}
        {isLegal && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="classic-panel rounded-lg mb-4 overflow-hidden"
          >
            <div className="px-5 py-4 bg-gradient-to-r from-stone-100/80 to-stone-50/40 dark:from-stone-900/40 dark:to-stone-950/20 border-b border-stone-200/60 dark:border-stone-800/40 flex items-start gap-4">
              <div className="p-2 bg-stone-200/50 dark:bg-stone-800/50 rounded-md shadow-sm border border-stone-300/50 dark:border-stone-700/50">
                <span className="text-stone-700 dark:text-stone-300 text-xl leading-none">⚖</span>
              </div>
              <div className="pt-0.5">
                <h3 className="text-base font-serif font-bold text-stone-950 dark:text-stone-100">
                  {isRTL ? "المعجم القانوني المعتمد" : "UNTERM / Black's Law Controlled Glossary"}
                </h3>
                <p className="text-xs text-stone-800/80 dark:text-stone-200/70 mt-1 leading-relaxed max-w-lg">
                  {isRTL
                    ? "قاعدة مصطلحات قانونية مقيدة مستندة إلى قاموس بلاك، UNTERM، ومعجم جامعة الدول العربية لضمان الدقة التشريعية."
                    : "Controlled legal terminology grounded in Black's Law Dictionary, UNTERM, and Arab League Unified Legal Terminology."}
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {LEGAL_GLOSSARY.map(g => (
                  <button
                    key={g.english}
                    onClick={() => setHoveredLegalGlossary(hoveredLegalGlossary?.english === g.english ? null : g)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all",
                      hoveredLegalGlossary?.english === g.english
                        ? "bg-stone-100 dark:bg-stone-900/30 border-stone-400 dark:border-stone-600 text-stone-800 dark:text-stone-300"
                        : "bg-secondary border-border text-foreground hover:border-stone-400 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-900/20"
                    )}
                  >
                    <span className="font-sans text-sm font-bold">{g.english}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-arabic text-[11px]">{g.arabic}</span>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {hoveredLegalGlossary && (
                  <motion.div
                    key={hoveredLegalGlossary.english}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-stone-200 dark:border-stone-700/50 rounded-lg p-4 bg-stone-50/40 dark:bg-stone-900/10">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <span className="font-sans font-bold text-xl text-foreground">{hoveredLegalGlossary.english}</span>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="font-arabic text-sm font-semibold text-stone-800 dark:text-stone-300">{hoveredLegalGlossary.arabic}</span>
                            {hoveredLegalGlossary.alternate_ar.slice(0, 2).map((alt, i) => (
                              <span key={i} className="font-arabic text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary">{alt}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 p-3 bg-white/60 dark:bg-card/60 rounded border border-stone-100 dark:border-stone-800/30">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{isRTL ? "مسوّغ الترجمة القانونية" : "Legal Translation Rationale"}</p>
                        <p className="text-xs text-foreground leading-relaxed">{hoveredLegalGlossary.rationale}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5 text-stone-600 dark:text-stone-400 flex-shrink-0" />
                        <span><strong className="text-foreground">{isRTL ? "المصدر القانوني:" : "Legal Source:"}</strong> {hoveredLegalGlossary.legal_source}</span>
                      </div>
                      {hoveredLegalGlossary.caution && (
                        <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] text-red-700 dark:text-red-400">{hoveredLegalGlossary.caution}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {legalMatches.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-[10px] uppercase font-bold text-stone-700 dark:text-stone-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />{isRTL ? "مصطلحات قانونية في النص" : "Legal Terms Detected"}
                  </p>
                  <div className="space-y-2">
                    {legalMatches.map(g => (
                      <div key={g.english} className="flex items-center gap-3 text-xs">
                        <span className="font-sans font-bold text-foreground">{g.english}</span>
                        <span className="text-muted-foreground/50">→</span>
                        <span className="font-arabic font-semibold text-stone-700 dark:text-stone-400">{g.arabic}</span>
                        <button onClick={() => setHoveredLegalGlossary(g)} className="text-[10px] text-primary hover:underline ms-auto">{isRTL ? "تفاصيل" : "Details"}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Alternative Translations ── */}
        {alternatives.length > 0 && (
          <div className="classic-panel rounded-lg mb-4 overflow-hidden">
            <button onClick={() => setShowAlternatives(v => !v)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                {isRTL ? "ترجمات بديلة" : "Alternative Translations"}
                <span className="text-[11px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded font-mono">{alternatives.length}</span>
              </span>
              {showAlternatives ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {showAlternatives && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-border">
                  <div className="px-4 py-3 space-y-3">
                    {alternatives.map((alt, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-[11px] font-mono text-muted-foreground w-5 text-center mt-0.5">{i + 1}.</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <button onClick={() => setOutput(alt.alt)} className="alt-chip hover:bg-primary/10 hover:border-primary/30 font-medium">{alt.alt}</button>
                            <span className="text-[10px] text-muted-foreground">← {alt.original}</span>
                          </div>
                          {alt.nuance && <p className="text-[11px] text-muted-foreground italic leading-relaxed">{alt.nuance}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Lexical Nuances ── */}
        {!isReligious && (localDictMatches.length > 0 || dictResult || terms.length > 0) && (
          <div className="classic-panel rounded-lg mb-4 overflow-hidden">
            <button onClick={() => setShowLexicon(v => !v)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors">
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                {t.sidebarTitle}
              </span>
              {showLexicon ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {showLexicon && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-border">
                  <div className="p-4 space-y-4">
                    <input
                      type="text"
                      placeholder={uiLanguage === "ar" ? "ابحث في القاموس الإنجليزي..." : "Search English dictionary..."}
                      value={dictQuery}
                      onChange={e => setDictQuery(e.target.value)}
                      className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                    {isDictLoading && <p className="text-xs text-muted-foreground loading-shimmer">{isRTL ? "جاري البحث..." : "Searching..."}</p>}
                    {!isDictLoading && dictResult && (
                      <div className="border border-border rounded p-3 bg-secondary/30">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="font-serif font-bold text-base text-foreground">{dictResult.word}</span>
                          {dictResult.phonetics?.find(p => p.text) && <span className="text-xs text-muted-foreground font-mono">{dictResult.phonetics.find(p => p.text)?.text}</span>}
                        </div>
                        {dictResult.meanings.slice(0, 2).map((m, idx) => (
                          <div key={idx} className="mb-2">
                            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{m.partOfSpeech}</span>
                            <ul className="mt-1 space-y-1">
                              {m.definitions.slice(0, 2).map((d, di) => (
                                <li key={di} className="text-xs text-foreground/80 leading-relaxed">
                                  · {d.definition}
                                  {d.example && <span className="text-muted-foreground italic block ms-3">"{d.example}"</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    {localDictMatches.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider border-b border-border pb-1">{isRTL ? "مصطلحات المعجم الأكاديمي" : "Academic Lexicon Terms"}</p>
                        {localDictMatches.map(entry => {
                          const srcVal = entry.translations[detected as keyof typeof entry.translations] || entry.translations[source as keyof typeof entry.translations] || entry.term;
                          const tgtVal = entry.translations[target as keyof typeof entry.translations];
                          const def = entry.definitions[uiLanguage];
                          const nuance = entry.nuances[tone]?.[uiLanguage];
                          return (
                            <div key={entry.term} className="border border-border rounded p-3 bg-secondary/20 hover:border-primary/20 transition-colors">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <button onClick={() => setDictQuery(srcVal)} className="font-serif font-bold text-sm text-foreground hover:text-primary transition-colors">{srcVal}</button>
                                <span className="text-muted-foreground/50">→</span>
                                <span className="font-semibold text-sm text-primary">{tgtVal}</span>
                                <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1 rounded">{entry.pos}</span>
                              </div>
                              {def && <p className="text-xs text-muted-foreground leading-relaxed mb-2 italic">{def}</p>}
                              {nuance && <p className="text-[11px] text-foreground/70 border-s-2 border-primary/30 ps-2">{nuance}</p>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {terms.filter(ti => !localDictMatches.some(lm => lm.term.toLowerCase() === ti.term.toLowerCase())).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider border-b border-border pb-1">{isRTL ? "مصطلحات مستخرجة" : "Extracted Terms"}</p>
                        {terms.filter(ti => !localDictMatches.some(lm => lm.term.toLowerCase() === ti.term.toLowerCase())).map(ti => (
                          <div key={ti.term} className="flex items-start gap-2 text-xs">
                            <button onClick={() => setDictQuery(ti.term)} className="font-semibold text-foreground hover:text-primary transition-colors">{ti.term}</button>
                            <span className="text-muted-foreground leading-relaxed">{ti.note}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── History ── */}
        <div className="classic-panel rounded-lg overflow-hidden">
          <div role="button" tabIndex={0} onClick={() => setShowHistory(v => !v)} onKeyDown={e => e.key === 'Enter' && setShowHistory(v => !v)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors cursor-pointer select-none">
            <span className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              {t.historyTitle}
              <span className="text-[11px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-mono">{history.length}</span>
              <span className="text-[10px] flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Lock className="h-3 w-3" /> AES-GCM</span>
            </span>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button onClick={e => { e.stopPropagation(); setHistory([]); try { localStorage.removeItem(HISTORY_KEY); } catch {} }} className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 px-2 py-1 rounded hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-3 w-3" />{t.clearHistory}
                </button>
              )}
              {showHistory ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </div>
          <AnimatePresence>
            {showHistory && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-border">
                <div className="p-4">
                  {history.length === 0 ? (
                    <p className="text-xs text-muted-foreground">{t.emptyHistory}</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {history.slice(0, 9).map(h => {
                          const srcLabel = LANGUAGES.find(l => l.code === h.source)?.name ?? h.source;
                          const dstLabel = LANGUAGES.find(l => l.code === h.target)?.name ?? h.target;
                          const domainItem = DOMAINS.find(d => d.value === h.domain);
                          return (
                            <button key={h.id} onClick={() => { setSource(h.source as any); setTarget(h.target as any); setTone(h.tone); if (h.domain) setDomain(h.domain); setInput(h.sourceText); }} className="text-start border border-border rounded p-3 hover:border-primary/30 hover:bg-secondary/50 transition-all animate-slide-up">
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1.5">
                                <span className="font-semibold text-foreground">{srcLabel}</span>
                                <ArrowLeftRight className="h-2.5 w-2.5" />
                                <span className="font-semibold text-foreground">{dstLabel}</span>
                                {domainItem && <span className="ms-auto text-[9px] border border-border rounded px-1.5 py-0.5">{domainItem.icon} {domainItem.label[uiLanguage]}</span>}
                              </div>
                              <p className="text-xs font-semibold line-clamp-1 text-foreground mb-0.5" dir="auto">{h.sourceText}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1" dir="auto">{h.translated}</p>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1"><Info className="h-3 w-3" /> {t.historyLimitAlert}</p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close translator conditional */}
        </>)}

        {/* ══════════ LINGUISTIC TOOLS HUB MODE ══════════ */}
        {mainTab === "tools" && (
          <div className="space-y-5">
            {/* Tools Hub Header */}
            <div className="classic-panel rounded-lg overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-primary/8 to-primary/3 dark:from-primary/12 dark:to-primary/5 border-b border-border flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20 flex-shrink-0">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-foreground">
                    {isRTL ? "الأدوات اللغوية المساعدة" : "Linguistic Auxiliary Tools"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xl">
                    {isRTL
                      ? "مجموعة أدوات أكاديمية متكاملة مصممة لمساعدة الطلاب والباحثين في فهم البنية اللغوية، ومقارنة محركات الترجمة، واستذكار المصطلحات، وإعادة الصياغة الأكاديمية."
                      : "An integrated suite of academic tools designed to help students and researchers understand linguistic structure, compare translation engines, memorize terminology, and produce academic rephrasing."}
                  </p>
                </div>
              </div>

              {/* Tool selector tabs */}
              <div className="px-4 py-3 flex flex-wrap gap-2 border-b border-border bg-secondary/20">
                {([
                  { id: "analyzer" as const, icon: <Microscope className="h-3.5 w-3.5" />, label: isRTL ? "المحلل اللغوي" : "Linguistic Analyzer" },
                  { id: "benchmark" as const, icon: <BarChart2 className="h-3.5 w-3.5" />, label: isRTL ? "مقارنة المحركات" : "Translation Benchmark" },
                  { id: "flashcards" as const, icon: <BookCopy className="h-3.5 w-3.5" />, label: isRTL ? "بطاقات الاستذكار" : "Academic Flashcards" },
                  { id: "rephraser" as const, icon: <PenLine className="h-3.5 w-3.5" />, label: isRTL ? "معيد الصياغة" : "Academic Rephraser" },
                ] as const).map(tool => (
                  <button
                    key={tool.id}
                    id={`tool-tab-${tool.id}`}
                    onClick={() => setActiveTool(tool.id)}
                    className={cn(
                      "tool-tab",
                      activeTool === tool.id ? "tool-tab-active" : "hover:text-foreground hover:bg-secondary hover:border-border"
                    )}
                  >
                    {tool.icon}
                    {tool.label}
                  </button>
                ))}
              </div>

              {/* Tool content */}
              <div className="p-5">
                <AnimatePresence mode="wait">

                  {/* ── TOOL 1: Linguistic Analyzer ── */}
                  {activeTool === "analyzer" && (
                    <motion.div key="analyzer" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                          <Microscope className="h-4 w-4 text-primary" />
                          {isRTL ? "🛠️ محرك التحليل اللغوي" : "🛠️ Linguistic Analyzer Engine"}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          {isRTL
                            ? "أدخل نصاً لتحليل بنيته النحوية والدلالية — يُلوّن العناصر اللغوية (أفعال، أسماء، صفات…) ويستخرج المصطلحات المفتاحية والإحصائيات التفصيلية."
                            : "Enter text to analyze its syntactic and semantic structure — highlights linguistic elements (verbs, nouns, adjectives…) and extracts key terms with detailed statistics."}
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5">
                          {isRTL ? "النص المراد تحليله" : "Text to Analyze"}
                        </label>
                        <textarea
                          value={analyzerText}
                          onChange={e => setAnalyzerText(e.target.value)}
                          placeholder={isRTL ? "أدخل نصاً بالإنجليزية للتحليل النحوي التفصيلي…" : "Enter English text for detailed syntactic analysis…"}
                          dir="auto"
                          rows={4}
                          className="w-full resize-none bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all leading-relaxed"
                        />
                      </div>
                      {analyzerText.trim() && (
                        <div className="classic-panel rounded-lg p-4">
                          <LinguisticAnalyzer text={analyzerText} lang="en" standalone />
                        </div>
                      )}
                      {!analyzerText.trim() && (
                        <div className="text-center py-8 text-muted-foreground/50 text-sm italic">
                          {isRTL ? "أدخل نصاً أعلاه لبدء التحليل…" : "Enter text above to start analysis…"}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ── TOOL 2: Translation Benchmark ── */}
                  {activeTool === "benchmark" && (
                    <motion.div key="benchmark" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                          <BarChart2 className="h-4 w-4 text-primary" />
                          {isRTL ? "📊 لوحة مقارنة محركات الترجمة" : "📊 Translation Benchmark Dashboard"}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          {isRTL
                            ? "قارن ترجمة لغوي السياقية المتخصصة مباشرةً مع Google Translate في صناديق متجاورة لرؤية الفروق الجوهرية."
                            : "Compare Lughawi's specialized contextual translation directly with Google Translate in side-by-side panels to see the key differences."}
                        </p>
                      </div>
                      <TranslationBenchmark isRTL={isRTL} />
                    </motion.div>
                  )}

                  {/* ── TOOL 3: Academic Flashcards ── */}
                  {activeTool === "flashcards" && (
                    <motion.div key="flashcards" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                          <BookCopy className="h-4 w-4 text-primary" />
                          {isRTL ? "🎴 بطاقات الاستذكار الأكاديمية" : "🎴 Academic Terminology Flashcards"}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          {isRTL
                            ? "اختبر نفسك في حفظ مصطلحات المعاجم المتخصصة (ديني، تقني، طبي، قانوني) وتعلّم نطقها الإنجليزي المعتمد."
                            : "Test yourself on specialized glossary terminology (religious, technical, medical, legal) and learn their authoritative English equivalents."}
                        </p>
                      </div>
                      <AcademicFlashcards isRTL={isRTL} />
                    </motion.div>
                  )}

                  {/* ── TOOL 4: Academic Rephraser ── */}
                  {activeTool === "rephraser" && (
                    <motion.div key="rephraser" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                          <PenLine className="h-4 w-4 text-primary" />
                          {isRTL ? "✍️ معيد الصياغة الأكاديمي" : "✍️ Academic Rephraser"}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          {isRTL
                            ? "أدخل نصاً عادياً، وسيعيد النظام صياغته فوراً بثلاثة أساليب بروتوكولية فصيحة تناسب الأبحاث والرسائل الأكاديمية."
                            : "Enter plain text and the system instantly rephrases it into three elevated protocol styles suitable for academic research and dissertations."}
                        </p>
                      </div>
                      <AcademicRephraser isRTL={isRTL} />
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-border py-5" style={{ background: "var(--card)" }}>
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-5 text-[11px] text-muted-foreground">

          {/* Brand + Copyright + Links */}
          <div className="flex flex-col items-center sm:items-start gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className="font-bold text-foreground/90 hover:text-foreground transition-colors cursor-default"
                style={{ fontFamily: "'Amiri', 'Cairo', serif", fontSize: "0.9rem" }}
              >
                منصة لغوي
              </span>
              <span className="opacity-30">|</span>
              <span
                className="text-foreground/60 hover:text-foreground/90 transition-colors cursor-default"
                style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: "0.68rem", letterSpacing: "0.04em" }}
              >
                Lughawi Platform
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground/70" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? "جميع الحقوق محفوظة © لمنصة لغوي 2026 | تم التطوير بواسطة " : "All Rights Reserved © Lughawi Platform 2026 | Developed by "}
              <span className="font-semibold text-foreground/60 hover:text-foreground transition-colors cursor-default" title="Platform Developer & Intellectual Property Owner">nrajmi</span>
            </span>
            {/* Contact email */}
            <a
              href="mailto:lughawi.platform@gmail.com"
              className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-primary transition-colors group"
              title={isRTL ? "التواصل والشكاوي والمقترحات" : "Contact & Support"}
            >
              <Mail className="h-3 w-3 group-hover:text-primary transition-colors" />
              <span className="group-hover:underline underline-offset-2">lughawi.platform@gmail.com</span>
            </a>
            <div className="flex items-center gap-3 mt-0.5 text-[10px] font-medium">
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "عن المنصة" : "About"}</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "سياسة الخصوصية" : "Privacy Policy"}</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">{isRTL ? "شروط الاستخدام" : "Terms of Use"}</Link>
            </div>
          </div>

          {/* Feature badges */}
          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />{isRTL ? "مشفّر محلياً" : "Locally Encrypted"}</span>
              <span className="flex items-center gap-1"><Languages className="h-3 w-3 text-primary" />AR · EN · ES</span>
              <span className="flex items-center gap-1">☽ {isRTL ? "معجم ديني" : "Religious Glossary"}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
              <Wrench className="h-3 w-3" />
              <span>{isRTL ? "أدوات لغوية مساعدة" : "Linguistic Auxiliary Tools"}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LanguageSelect({ value, onChange, includeAuto, uiLang }: { value: string; onChange: (v: any) => void; includeAuto?: boolean; uiLang: UILang }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-9 px-3 py-1.5 text-sm font-medium bg-card border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 hover:border-primary/30 transition-colors cursor-pointer min-w-[160px]"
    >
      {LANGUAGES.filter(l => includeAuto || l.code !== "auto").map(l => (
        <option key={l.code} value={l.code}>{uiLang === "ar" ? l.name : l.en}</option>
      ))}
    </select>
  );
}
