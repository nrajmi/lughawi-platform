export interface Prediction {
  text: string;
  lang: "ar" | "en" | "es";
}

const PREDICTIONS: Prediction[] = [
  // Arabic
  { text: "صباح الخير", lang: "ar" },
  { text: "كيف حالك اليوم؟", lang: "ar" },
  { text: "أين يمكنني العثور على", lang: "ar" },
  { text: "شكراً جزيلاً لك", lang: "ar" },
  { text: "أحتاج إلى مساعدة في", lang: "ar" },
  { text: "متى سوف نلتقي؟", lang: "ar" },
  { text: "أنا ذاهب إلى", lang: "ar" },
  { text: "هل يمكنك ترجمة هذا؟", lang: "ar" },
  { text: "أطيب التحيات", lang: "ar" },
  { text: "كم سعر هذا؟", lang: "ar" },
  
  // English
  { text: "Good morning", lang: "en" },
  { text: "How are you today?", lang: "en" },
  { text: "Where can I find", lang: "en" },
  { text: "Thank you very much", lang: "en" },
  { text: "I need help with", lang: "en" },
  { text: "When will we meet?", lang: "en" },
  { text: "I am going to", lang: "en" },
  { text: "Can you translate this?", lang: "en" },
  { text: "Best regards", lang: "en" },
  { text: "How much is this?", lang: "en" },

  // Spanish
  { text: "Buenos días", lang: "es" },
  { text: "¿Cómo estás hoy?", lang: "es" },
  { text: "¿Dónde puedo encontrar", lang: "es" },
  { text: "Muchas gracias", lang: "es" },
  { text: "Necesito ayuda con", lang: "es" },
  { text: "¿Cuándo nos encontraremos?", lang: "es" },
  { text: "Voy a", lang: "es" },
  { text: "¿Puedes traducir esto?", lang: "es" },
  { text: "Saludos cordiales", lang: "es" },
  { text: "¿Cuánto cuesta esto?", lang: "es" }
];

export function getPredictions(input: string, lang: string): string[] {
  if (!input.trim()) return [];
  
  const query = input.trim().toLowerCase();
  const tokens = query.split(/\s+/);
  const lastWord = tokens[tokens.length - 1];

  // Match predictions that start with or contain the query
  const matches = PREDICTIONS.filter(p => {
    // Basic language filter. If lang is auto, try to match anyway.
    if (lang !== "auto" && p.lang !== lang) return false;
    
    const pText = p.text.toLowerCase();
    
    // Match if the prediction starts with the entire query
    if (pText.startsWith(query)) return true;
    
    // Match if the prediction contains the last word typed, giving the user a reasonable completion
    if (lastWord.length > 1 && pText.includes(lastWord)) return true;

    return false;
  });

  // Deduplicate and limit
  const uniqueMatches = Array.from(new Set(matches.map(m => m.text)));
  return uniqueMatches.slice(0, 3);
}
