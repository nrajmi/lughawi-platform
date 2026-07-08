import { localTranslateFallback } from "./dictionary";

export type Tone = "general" | "academic" | "technical" | "creative";

export const TONES: { value: Tone; label: string; hint: string }[] = [
  { value: "general", label: "عامة", hint: "ترجمة يومية طبيعية" },
  { value: "academic", label: "أكاديمية", hint: "دقيقة، بحثية، رسمية" },
  { value: "technical", label: "تقنية", hint: "برمجية وهندسية" },
  { value: "creative", label: "إبداعية", hint: "أدبية وبلاغية" },
];

export const LANGUAGES = [
  { code: "auto", name: "كشف تلقائي", en: "Auto-detect", es: "Auto-detectar" },
  { code: "ar", name: "العربية", en: "Arabic", es: "Árabe" },
  { code: "en", name: "الإنجليزية", en: "English", es: "Inglés" },
  { code: "es", name: "الإسبانية", en: "Spanish", es: "Español" },
];

// Detect if text is mostly Arabic
export function detectLang(text: string): "ar" | "en" | "es" {
  const ar = (text.match(/[\u0600-\u06FF]/g) || []).length;
  if (ar > text.length * 0.15) return "ar";
  
  // Basic heuristic for Spanish specific marks
  const esMatch = (text.match(/[áéíóúüñ¿¡]/gi) || []).length;
  if (esMatch > 0) return "es";
  
  return "en";
}

export async function mockTranslate(opts: {
  text: string;
  source: string;
  target: string;
  tone: Tone;
}): Promise<{ translated: string; detected: string; terms: { term: string; note: string }[] }> {
  await new Promise((r) => setTimeout(r, 600));
  return localTranslateFallback(opts.text, opts.source, opts.target, opts.tone);
}
