import { DictionaryEntry, DictionaryDomain, getDictionaryByDomain } from "./dictionaries";

export type { DictionaryEntry, DictionaryDomain };

/**
 * Searches input text for dictionary terms (supports N-Grams and phrase matching).
 * It sorts matches by length so multi-word terms take precedence over single words.
 */
export function findDictionaryMatches(text: string, tone: string, domain: DictionaryDomain = "all"): DictionaryEntry[] {
  if (!text) return [];
  const normalizedText = text.toLowerCase();

  const dictionaryToUse = getDictionaryByDomain(domain);

  // Sort dictionary by term length descending, so "universal grammar" matches before "grammar"
  const sortedDict = [...dictionaryToUse].sort((a, b) => b.term.length - a.term.length);

  const matched = sortedDict.filter((entry) => {
    const arTerm = entry.translations.ar;
    const enTerm = entry.translations.en.toLowerCase();
    const esTerm = entry.translations.es.toLowerCase();

    // Check boundary matches for English and Spanish (to prevent matching 'syntax' in 'syntaxis')
    const enRegex = new RegExp(`\\b${enTerm}\\b`, "i");
    const esRegex = new RegExp(`\\b${esTerm}\\b`, "i");

    const matchesEn = enRegex.test(normalizedText);
    const matchesEs = esRegex.test(normalizedText);
    const matchesAr = normalizedText.includes(arTerm);

    return matchesEn || matchesEs || matchesAr;
  });

  return matched;
}

/**
 * A highly robust offline/local translator fallback when the API is not available.
 */
export function localTranslateFallback(
  text: string,
  source: string,
  target: string,
  tone: "general" | "academic" | "technical" | "creative",
  domain: DictionaryDomain = "all"
): { translated: string; detected: string; terms: { term: string; note: string }[] } {
  const detected = source === "auto" ? (text.match(/[\u0600-\u06FF]/g)?.length ? "ar" : "en") : source;
  
  if (!text.trim()) {
    return { translated: "", detected, terms: [] };
  }

  const matches = findDictionaryMatches(text, tone, domain);
  let resultText = text;

  // Replace case-insensitively, larger phrases first (because findDictionaryMatches sorts by length)
  matches.forEach((entry) => {
    const srcTerm = entry.translations[detected as keyof typeof entry.translations] || entry.term;
    const destTerm = entry.translations[target as keyof typeof entry.translations] || entry.term;
    
    if (detected === "ar") {
      resultText = resultText.replace(new RegExp(srcTerm, "g"), destTerm);
    } else {
      resultText = resultText.replace(new RegExp(`\\b${srcTerm}\\b`, "gi"), destTerm);
    }
  });

  const prefixes = {
    general: { ar: "[ترجمة بديلة] ", en: "[Fallback] ", es: "[Respaldo] " },
    academic: { ar: "[صياغة أكاديمية بديلة] ", en: "[Academic Fallback] ", es: "[Respaldo Académico] " },
    technical: { ar: "[صياغة تقنية بديلة] ", en: "[Technical Fallback] ", es: "[Respaldo Técnico] " },
    creative: { ar: "[صياغة بلاغية بديلة] ", en: "[Creative Fallback] ", es: "[Respaldo Creativo] " }
  };
  const currentPrefix = prefixes[tone][target as keyof typeof prefixes["general"]] || "";

  let translated = resultText === text ? resultText : `${currentPrefix}${resultText}`;

  const terms = matches.map((m) => {
    const matchedTerm = m.translations[target as keyof typeof m.translations];
    const explanation = m.nuances[tone][target as keyof typeof m.nuances["general"]] || m.definitions[target as keyof typeof m.definitions];
    
    return {
      term: m.translations[detected as keyof typeof m.translations] || m.term,
      note: `-> ${matchedTerm}: ${explanation}`
    };
  });

  return { translated, detected, terms };
}
