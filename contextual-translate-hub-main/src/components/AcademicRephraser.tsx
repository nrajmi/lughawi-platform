import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface AcademicRephraserProps {
  isRTL: boolean;
}

interface RephrasedOption {
  style: string;
  styleAr: string;
  text: string;
  description: string;
  descriptionAr: string;
}

// Client-side rephrasing using Gemini API (same key used for translation)
async function rephrase(text: string): Promise<RephrasedOption[]> {
  try {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    if (!apiKey) throw new Error('No API key');

    const prompt = `You are an expert academic writing assistant. Rephrase the following text into exactly 3 different academic styles. Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
[
  {
    "style": "Formal Academic",
    "text": "...",
    "description": "Suitable for scholarly journals and dissertations"
  },
  {
    "style": "Analytical Protocol",
    "text": "...",
    "description": "Precise analytical language for research methodology"
  },
  {
    "style": "Concise Academic",
    "text": "...",
    "description": "Condensed formal academic expression"
  }
]

Text to rephrase: "${text.replace(/"/g, '\\"')}"

Rules:
- Use elevated, formal academic vocabulary
- Avoid colloquial or informal phrasing  
- Maintain the core meaning precisely
- Each version must be distinctly different in style
- If the text is in Arabic, produce Arabic academic rephrasing
- If the text is in English, produce English academic rephrasing`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    
    // Strip any markdown code blocks if present
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return parsed.map((item: any) => ({
      style: item.style,
      styleAr: item.style,
      text: item.text,
      description: item.description,
      descriptionAr: item.description,
    }));
  } catch (e) {
    // Fallback: simple rule-based transformations for demo
    const isArabic = /[\u0600-\u06FF]/.test(text);
    if (isArabic) {
      return [
        {
          style: 'Formal Academic',
          styleAr: 'أكاديمي رسمي',
          text: `يُستدل من المعطيات المتاحة أن: ${text}`,
          description: 'Suitable for scholarly journals and dissertations',
          descriptionAr: 'مناسب للمجلات العلمية والرسائل الجامعية',
        },
        {
          style: 'Analytical Protocol',
          styleAr: 'بروتوكول تحليلي',
          text: `وفقاً للمنهجية التحليلية المعتمدة، يتبيّن ما يلي: ${text}`,
          description: 'Precise analytical language for research methodology',
          descriptionAr: 'لغة تحليلية دقيقة لمنهجية البحث العلمي',
        },
        {
          style: 'Concise Academic',
          styleAr: 'مختصر أكاديمي',
          text: `خلاصة القول: ${text}`,
          description: 'Condensed formal academic expression',
          descriptionAr: 'تعبير أكاديمي رسمي موجز',
        },
      ];
    }
    return [
      {
        style: 'Formal Academic',
        styleAr: 'أكاديمي رسمي',
        text: `It is evident from the available evidence that: ${text}`,
        description: 'Suitable for scholarly journals and dissertations',
        descriptionAr: 'مناسب للمجلات العلمية والرسائل الجامعية',
      },
      {
        style: 'Analytical Protocol',
        styleAr: 'بروتوكول تحليلي',
        text: `Based on rigorous analytical methodology, the following is ascertained: ${text}`,
        description: 'Precise analytical language for research methodology',
        descriptionAr: 'لغة تحليلية دقيقة لمنهجية البحث',
      },
      {
        style: 'Concise Academic',
        styleAr: 'مختصر أكاديمي',
        text: `In summation: ${text}`,
        description: 'Condensed formal academic expression',
        descriptionAr: 'تعبير أكاديمي رسمي موجز',
      },
    ];
  }
}

export function AcademicRephraser({ isRTL }: AcademicRephraserProps) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<RephrasedOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const handleRephrase = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setHasRun(true);
    setResults([]);

    const rephrased = await rephrase(input.trim());
    setResults(rephrased);
    setLoading(false);
  }, [input]);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(idx);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const handleClear = () => {
    setInput('');
    setResults([]);
    setHasRun(false);
  };

  const styleColors = [
    { badge: 'bg-primary/10 text-primary border-primary/20', accent: 'border-primary/30 bg-primary/5' },
    { badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800', accent: 'border-amber-300/50 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/10' },
    { badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', accent: 'border-emerald-300/50 dark:border-emerald-700/50 bg-emerald-50/50 dark:bg-emerald-900/10' },
  ];

  return (
    <div className="space-y-4">
      {/* Input box */}
      <div>
        <label className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
          {isRTL ? 'النص الأصلي للإعادة الصياغة' : 'Original Text for Rephrasing'}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={
            isRTL
              ? 'أدخل نصاً عادياً وسيتم إعادة صياغته بثلاثة أساليب أكاديمية بروتوكولية فصيحة…'
              : 'Enter plain text and it will be rephrased into three formal academic styles…'
          }
          dir="auto"
          rows={4}
          className="w-full resize-none bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all leading-relaxed"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">
            {input.trim().split(/\s+/).filter(Boolean).length}{' '}
            {isRTL ? 'كلمة' : 'words'}
          </span>
          {input && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              {isRTL ? 'مسح' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* Rephrase button */}
      <button
        onClick={handleRephrase}
        disabled={!input.trim() || loading}
        className={cn(
          'w-full py-2.5 text-sm font-semibold rounded-lg border transition-all',
          input.trim() && !loading
            ? 'bg-primary text-primary-foreground border-primary hover:opacity-90 shadow-sm'
            : 'bg-secondary border-border text-muted-foreground opacity-50 cursor-not-allowed'
        )}
      >
        {loading
          ? (isRTL ? 'جارٍ إعادة الصياغة الأكاديمية…' : 'Rephrasing academically…')
          : (isRTL ? 'إعادة الصياغة الأكاديمية — ٣ خيارات' : 'Academic Rephrasing — 3 Options')}
      </button>

      {/* Results */}
      {hasRun && (
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="classic-panel rounded-lg p-4 loading-shimmer min-h-[80px]" />
            ))
          ) : (
            results.map((opt, idx) => (
              <div
                key={idx}
                className={cn('rounded-lg border p-4 transition-all', styleColors[idx]?.accent ?? 'border-border bg-secondary/20')}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold font-mono text-muted-foreground">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider', styleColors[idx]?.badge ?? '')}>
                      {isRTL ? opt.styleAr : opt.style}
                    </span>
                    <span className="text-[10px] text-muted-foreground italic">
                      {isRTL ? opt.descriptionAr : opt.description}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(opt.text, idx)}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] rounded border border-border bg-card text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                    title={isRTL ? 'نسخ' : 'Copy'}
                  >
                    {copied === idx
                      ? <><Check className="h-3 w-3 text-green-600" /> {isRTL ? 'تم!' : 'Done!'}</>
                      : <><Copy className="h-3 w-3" /> {isRTL ? 'نسخ' : 'Copy'}</>
                    }
                  </button>
                </div>
                <p className="text-sm text-foreground leading-relaxed" dir="auto">
                  {opt.text}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
