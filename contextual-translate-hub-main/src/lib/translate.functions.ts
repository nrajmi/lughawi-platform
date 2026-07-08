import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sanitizeInput } from "./security";
import { localTranslateFallback, findDictionaryMatches } from "./dictionary";

const InputSchema = z.object({
  text: z.string().min(1).max(5000),
  source: z.enum(["auto", "ar", "en", "es"]),
  target: z.enum(["ar", "en", "es"]),
  tone: z.enum(["general", "academic", "technical", "creative"]),
  domain: z.enum(["all", "linguistics", "tech", "medical", "legal", "general", "religious", "academic"]).default("all"),
});

const LANG_NAMES: Record<string, string> = {
  auto: "auto-detected",
  ar: "Arabic",
  en: "English",
  es: "Spanish",
};

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    // 1. Sanitize input to mitigate script injection and CSRF threats
    const sanitizedText = sanitizeInput(data.text);
    
    try {
      let translated = "";
      let detected = data.source;

      // 2. Try Gemini API first if available
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (geminiApiKey) {
        // Dynamic import to avoid issues if genai is not installed yet
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        
        // Domain-specific prompt instructions
        const domainInstructions: Record<string, string> = {
          general: "",
          religious: `
IMPORTANT — This is a RELIGIOUS/ISLAMIC translation. Follow these strict rules:
- Use academically established translations for Islamic terms (e.g., تقوى → "God-consciousness" not "fear", الغيب → "the Unseen" not "unknown", شريعة → "Islamic law" not just "law").
- Preserve Arabic transliterations in parentheses for untranslatable terms (e.g., taqwā, dhikr, fatwā).
- Use capital letters for divine titles (God, the Almighty, the Most Merciful).
- Never simplify or secularize Islamic concepts. Maintain theological precision.
- Refer to Prophet Muhammad with the honorific (peace be upon him) / (ﷺ) where appropriate.
- For Quranic verses, use established scholarly translations (Abdel Haleem, Sahih International).
`,
          medical: `
IMPORTANT — This is a MEDICAL/CLINICAL translation. Follow these strict rules:
- Use WHO-approved Arabic medical terminology (ICD-11, MeSH). Do NOT use colloquial or literal translations.
- Key terms: 'Sepsis' → 'الإنتان' (NOT 'تعفن الدم' except for general audiences), 'Myocardial Infarction' → 'احتشاء عضلة القلب' (NOT 'هجوم القلب'), 'Prognosis' → 'الإنذار المرضي', 'Contraindication' → 'موانع الاستعمال'.
- Retain medical acronyms (ECG, MRI, ICU, SOFA, PCI) unless there is a widely adopted Arabic equivalent.
- Maintain clinical register and avoid dramatization. Precision is paramount.
`,
          legal: `
IMPORTANT — This is a LEGAL translation. Follow these strict rules:
- Use established legal terminology from Black's Law Dictionary, UNTERM, and Arab League Legal Glossary.
- Key terms: 'Jurisdiction' → 'الاختصاص القضائي', 'Due Process' → 'ضمانات المحاكمة العادلة', 'Tort' → 'الفعل الضار / المسؤولية التقصيرية', 'Habeas Corpus' → retain Latin term with Arabic explanation.
- Retain Latin legal phrases (habeas corpus, mens rea, actus reus) in academic contexts.
- Do NOT simplify or paraphrase legal concepts — legal precision is non-negotiable.
`,
          tech: `
IMPORTANT — This is a TECHNICAL translation. Follow these strict rules:
- Do NOT translate technical terms literally. Use established Arabized terminology (e.g., "Prompt Engineering" → "هندسة الأوامر", "Cloud Computing" → "الحوسبة السحابية").
- Keep abbreviations and standard technical identifiers unchanged (e.g., API, RAM, UI/UX) unless there is a widely adopted Arabic acronym.
- Maintain a professional, cyber/tech-focused register. Ensure technical accuracy and industry-standard phrasing.
`,
          academic: `
Translate at academic register. Use formal scholarly language. Prefer established academic terminology in the target language.
`,
        };
        const domainNote = domainInstructions[data.domain] ?? "";

        const toneDescriptions = {
          general: "Natural, everyday translation — clear and accessible.",
          academic: "Precise, formal, scholarly — use peer-reviewed academic terminology.",
          technical: "Technically precise — use domain-specific professional terminology.",
          creative: "Literary and rhetorical — convey meaning with stylistic elegance."
        };
        
        const targetNames = { ar: "Arabic", en: "English", es: "Spanish" };
        const targetLang = targetNames[data.target as keyof typeof targetNames];
        
        const prompt = `Translate the following text to ${targetLang}.
Tone/Style: ${toneDescriptions[data.tone]}
${domainNote}
Output ONLY the translated text without any quotes, markdown, or extra explanations.
Text to translate:
${sanitizedText}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        translated = response.text || "";
        // If source was auto, we might not get detected lang easily from gemini, 
        // we'll rely on our dictionary fallback for detected lang or just keep it as auto.
        detected = data.source === "auto" ? (sanitizedText.match(/[\u0600-\u06FF]/g)?.length ? "ar" : "en") : data.source;
      } else {
        // Fallback to Free Google Translate API
        const encodedText = encodeURIComponent(sanitizedText);
        const sl = data.source === "auto" ? "auto" : data.source;
        const tl = data.target;
        
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodedText}`;
        
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`Google Translate API error: ${res.status}`);
        }

        const json = await res.json();
        
        if (Array.isArray(json) && Array.isArray(json[0])) {
          translated = json[0].map((item: any) => item[0]).join("");
        } else {
          throw new Error("Invalid response format from translation API");
        }
        
        detected = data.source === "auto" ? (json[2] || data.source) : data.source;
      }

      // 3. Hybrid Tone-Aware Post-Processing for terms
      const localMatches = findDictionaryMatches(sanitizedText, data.tone, data.domain);
      
      if (!geminiApiKey && data.tone !== "general") {
        // Only apply regex overrides if we didn't use Gemini (Gemini handles tone natively)
        localMatches.forEach((m) => {
          const genericTarget = m.translations[data.target as keyof typeof m.translations];
          if (data.target === "ar") {
            const googleLiteral = "بناء الجملة"; 
            translated = translated.replace(new RegExp(googleLiteral, "g"), genericTarget);
            translated = translated.replace(new RegExp("قواعد عالمية", "g"), "النحو الكلي");
            translated = translated.replace(new RegExp("دلالات", "g"), "علم الدلالة");
          }
        });
      }

      // 4. Enrich terms using our rich local dictionary nuances
      const terms: { term: string; note: string }[] = [];
      
      localMatches.forEach((localItem) => {
        const detectedKey = (detected === "ar" || detected === "en" || detected === "es") ? detected : "en";
        const srcVal = localItem.translations[detectedKey as keyof typeof localItem.translations] || localItem.term;
        const exists = terms.some((t) => t.term.toLowerCase() === srcVal.toLowerCase());
        
        if (!exists) {
          const targetTranslation = localItem.translations[data.target as keyof typeof localItem.translations];
          const nuanceNote = localItem.nuances[data.tone][data.target as keyof typeof localItem.nuances["general"]];
          terms.push({
            term: srcVal,
            note: `-> ${targetTranslation}: ${nuanceNote}`
          });
        }
      });

      return { translated, detected: detected || data.source, terms };
    } catch (error) {
      console.error("Translation error, falling back to local:", error);
      return localTranslateFallback(sanitizedText, data.source, data.target, data.tone, data.domain);
    }
  });
