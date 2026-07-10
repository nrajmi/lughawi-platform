import React, { useState, useCallback } from 'react';
import { translateText } from '@/lib/translate.functions';
import { type DictionaryDomain } from '@/lib/dictionaries';
import { sanitizeInput } from '@/lib/security';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, Info, Languages } from 'lucide-react';

interface TranslationBenchmarkProps {
  isRTL: boolean;
}

// Simple client-side Google Translate API (unofficial, free endpoint)
async function googleTranslate(text: string, target: string): Promise<string> {
  try {
    const sl = 'auto';
    const tl = target === 'ar' ? 'ar' : target === 'es' ? 'es' : 'en';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Google Translate API failed');
    const data = await res.json();
    // Response is [[["translated","original",null,null,1],...],...]
    const translated = data[0]
      .filter((chunk: any) => chunk[0])
      .map((chunk: any) => chunk[0])
      .join('');
    return translated;
  } catch {
    return '[تعذّر الاتصال بـ Google Translate]';
  }
}

const DOMAINS_BENCH: { value: DictionaryDomain; label: string; icon: string }[] = [
  { value: 'general', label: 'عام', icon: '✦' },
  { value: 'medical', label: 'طبي', icon: '⚕' },
  { value: 'legal', label: 'قانوني', icon: '⚖' },
  { value: 'tech', label: 'تقني', icon: '⌨' },
  { value: 'religious', label: 'ديني', icon: '☽' },
];

export function TranslationBenchmark({ isRTL }: TranslationBenchmarkProps) {
  const [input, setInput] = useState('');
  const [domain, setDomain] = useState<DictionaryDomain>('general');
  const [target, setTarget] = useState<'ar' | 'en'>('ar');
  const [lughawiResult, setLughawiResult] = useState('');
  const [googleResult, setGoogleResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runBenchmark = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setHasRun(true);
    setLughawiResult('');
    setGoogleResult('');

    const clean = sanitizeInput(input);

    // Run both in parallel
    const [lughawiRes, googleRes] = await Promise.allSettled([
      translateText({ data: { text: clean, source: 'auto', target, tone: 'academic', domain } }),
      googleTranslate(clean, target),
    ]);

    setLughawiResult(
      lughawiRes.status === 'fulfilled' ? lughawiRes.value.translated : '[خطأ في الترجمة]'
    );
    setGoogleResult(
      googleRes.status === 'fulfilled' ? googleRes.value : '[خطأ في الترجمة]'
    );

    setLoading(false);
  }, [input, domain, target]);

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5 text-[11px] text-muted-foreground">
        <Info className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
        <span>
          {isRTL
            ? 'تُقارن هذه الأداة ترجمة منصة لغوي السياقية المتخصصة مباشرةً مع مخرجات Google Translate القياسية، لإبراز الفروق الجوهرية ودقة السياق.'
            : 'This tool compares Lughawi\'s specialized contextual translation directly against Google Translate\'s standard output, highlighting key differences and contextual accuracy.'}
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Domain */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5">
            {isRTL ? 'المجال' : 'Domain'}
          </label>
          <div className="flex flex-wrap gap-1">
            {DOMAINS_BENCH.map(d => (
              <button
                key={d.value}
                onClick={() => setDomain(d.value)}
                className={cn(
                  'px-2.5 py-1 text-[11px] rounded border font-medium transition-colors',
                  domain === d.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                )}
              >
                {d.icon} {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target language */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5">
            {isRTL ? 'لغة الترجمة' : 'Translate to'}
          </label>
          <div className="flex gap-1">
            {([{ code: 'ar', label: 'العربية' }, { code: 'en', label: 'English' }] as const).map(l => (
              <button
                key={l.code}
                onClick={() => setTarget(l.code)}
                className={cn(
                  'px-3 py-1 text-[11px] rounded border font-medium transition-colors',
                  target === l.code
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Text input */}
      <div>
        <label className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5">
          {isRTL ? 'النص المدخل' : 'Input Text'}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={isRTL ? 'أدخل نصاً للمقارنة بين منصة لغوي وGoogle Translate…' : 'Enter text to compare Lughawi vs Google Translate…'}
          dir="auto"
          rows={3}
          className="w-full resize-none bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all leading-relaxed"
        />
      </div>

      {/* Run button */}
      <button
        onClick={runBenchmark}
        disabled={!input.trim() || loading}
        className={cn(
          'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg border transition-all',
          input.trim() && !loading
            ? 'bg-primary text-primary-foreground border-primary hover:opacity-90 shadow-sm'
            : 'bg-secondary border-border text-muted-foreground opacity-50 cursor-not-allowed'
        )}
      >
        <ArrowLeftRight className="h-4 w-4" />
        {loading
          ? (isRTL ? 'جارٍ المقارنة…' : 'Comparing…')
          : (isRTL ? 'تشغيل المقارنة' : 'Run Benchmark')}
      </button>

      {/* Results */}
      {hasRun && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Lughawi result */}
          <div className="classic-panel rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-primary/5 flex items-center gap-2">
              <Languages className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {isRTL ? 'منصة لغوي — سياقي متخصص' : 'Lughawi — Contextual & Specialized'}
              </span>
            </div>
            <div className="p-4 min-h-[100px]">
              {loading ? (
                <div className="loading-shimmer text-muted-foreground text-sm italic">
                  {isRTL ? 'جاري الترجمة…' : 'Translating…'}
                </div>
              ) : (
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap" dir="auto">
                  {lughawiResult || '—'}
                </p>
              )}
            </div>
            <div className="px-4 py-2 border-t border-border bg-secondary/20 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span>✓</span>
              <span>{isRTL ? 'ترجمة سياقية أكاديمية محكمة بالمعاجم المتخصصة' : 'Academically controlled, domain-specific contextual translation'}</span>
            </div>
          </div>

          {/* Google Translate result */}
          <div className="classic-panel rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-secondary/40 flex items-center gap-2">
              <span className="text-base leading-none">G</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Google Translate — {isRTL ? 'آلي قياسي' : 'Standard Machine'}
              </span>
            </div>
            <div className="p-4 min-h-[100px]">
              {loading ? (
                <div className="loading-shimmer text-muted-foreground text-sm italic">
                  {isRTL ? 'جاري الترجمة…' : 'Translating…'}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap" dir="auto">
                  {googleResult || '—'}
                </p>
              )}
            </div>
            <div className="px-4 py-2 border-t border-border bg-secondary/20 text-[10px] text-muted-foreground font-medium flex items-center gap-1">
              <span>≈</span>
              <span>{isRTL ? 'ترجمة آلية عامة بدون سياق متخصص' : 'General machine translation without domain context'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Diff note */}
      {hasRun && !loading && lughawiResult && googleResult && lughawiResult !== googleResult && (
        <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <span className="text-base leading-none mt-0.5">⚠</span>
          <span>
            {isRTL
              ? 'النتيجتان مختلفتان — لغوي يُقيّد الترجمة بالسياق الأكاديمي والمعاجم المتخصصة بينما Google Translate يُقدّم ترجمة آلية حرفية عامة.'
              : 'Results differ — Lughawi constrains translation through academic context and specialized glossaries, while Google Translate provides a general literal machine output.'}
          </span>
        </div>
      )}
    </div>
  );
}
