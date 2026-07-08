export type DictionaryDomain = "linguistics" | "tech" | "medical" | "legal" | "general" | "academic" | "religious" | "all";

export interface DictionaryEntry {
  term: string; // Base English term
  pos: string; // Part of speech
  domain: DictionaryDomain[]; // Which domains this term belongs to
  translations: {
    ar: string;
    en: string;
    es: string;
  };
  definitions: {
    ar: string;
    en: string;
    es: string;
  };
  nuances: {
    general: { ar: string; en: string; es: string };
    academic: { ar: string; en: string; es: string };
    technical: { ar: string; en: string; es: string };
    creative: { ar: string; en: string; es: string };
  };
}
