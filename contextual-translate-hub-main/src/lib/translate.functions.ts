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

const RephraseSchema = z.object({
  text: z.string().min(1).max(5000),
});

const LANG_NAMES: Record<string, string> = {
  auto: "auto-detected",
  ar: "Arabic",
  en: "English",
  es: "Spanish",
};

export const translateText = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    try {
      return InputSchema.parse(data);
    } catch (e) {
      // Graceful catch of validation error
      throw new Error("Invalid request data format");
    }
  })
  .handler(async ({ data }) => {
    // 1. Sanitize input to mitigate script injection and CSRF threats
    const sanitizedText = sanitizeInput(data.text);
    
    // 2. Identify local glossary terms to serve as Guidelines/Gold Standard
    const localMatches = findDictionaryMatches(sanitizedText, data.tone, data.domain);
    let glossaryContext = "";
    if (localMatches.length > 0) {
      glossaryContext = `\n\nGOLD STANDARD TERMINOLOGY / GUIDELINES:\nIf any of the following concepts appear, you MUST use these exact translations:\n` +
        localMatches.map(m => `- Source term: "${m.translations.ar || m.term}" <-> Target term: "${m.translations[data.target as 'ar'|'en'|'es'] || m.term}" (Nuance: ${m.nuances[data.tone]?.[data.target as 'ar'|'en'|'es'] || m.definitions[data.target as 'ar'|'en'|'es']})`).join("\n");
    }
    
    try {
      let translated = "";
      let detected = data.source;
      const targetLang = LANG_NAMES[data.target] || data.target;

      // Try Gemini API first if available
      const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (geminiApiKey) {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        
        const domainPersonas: Record<string, string> = {
          general: `You are a senior bilingual translator with 20+ years of experience, fluent in ${targetLang} and Arabic. Your translations are natural, idiomatic, and precisely adapted to the register of the source text. You never translate word-for-word; instead you re-express ideas with the fluency of a native speaker. Provide an output that functions as responsive text-prediction/autocomplete mechanism for daily vocabulary if the text is short.`,

          religious: `You are a scholar of Islamic studies and a certified Arabic-English translator specializing in Islamic religious texts, fiqh, tafsīr, and theological discourse. You have a deep command of classical Arabic and its English equivalents as used in peer-reviewed Islamic scholarship.

Your linguistic doctrine:
- تقوى → "God-consciousness" (NOT "fear of God")
- الغيب → "the Unseen" (NOT "the unknown")
- شريعة → "Islamic law" (NOT simply "law")
- الفطرة → "innate human nature" or "primordial nature"
- إعجاز → "inimitability" (of the Quran)
- For Quranic verses, use Abdel Haleem or Sahih International translations as the default unless context demands otherwise.
- Always add transliterations in parentheses for untranslatable Arabic Islamic terms: (taqwā), (dhikr), (fatwā), (ḥadīth).
- Divine names and attributes are always capitalized: the Almighty, the Most Merciful, the All-Knowing.
- Prophet Muhammad is always referenced with "peace be upon him" or (ﷺ).
- Never secularize, modernize, or simplify Islamic concepts. Maintain the theological depth and gravity of the original.`,

          medical: `You are a clinical medical translator certified by the World Health Organization, with expertise in translating medical literature, clinical trials, patient records, and pharmaceutical documentation between Arabic and English.

Your linguistic doctrine:
- Always use WHO-standard ICD-11 and MeSH terminology. Match professional nomenclature of clinical coding.
- 'Sepsis' → 'الإنتان' (NEVER 'تعفن الدم' in clinical contexts)
- 'Myocardial Infarction' → 'احتشاء عضلة القلب' (NEVER 'هجوم القلب')
- 'Prognosis' → 'الإنذار المرضي'
- 'Contraindication' → 'موانع الاستعمال'
- 'Auscultation' → 'التسمع'
- Retain standard medical abbreviations unchanged: ECG, MRI, ICU, SOFA, APACHE II, PCI, eGFR.
- Maintain clinical precision and formal register. No dramatic or colloquial language.
- Numbers, dosages, units, and lab values are never altered.`,

          legal: `You are a legal translator certified by the United Nations, the Arab League, and the International Court of Justice, specializing in contract law, international treaties, and judicial proceedings in both Arabic and English.

Your linguistic doctrine:
- Use Black's Law Dictionary for English terms and the Arab League Legal Glossary for Arabic. Match contract syntax precisely.
- 'Jurisdiction' → 'الاختصاص القضائي'
- 'Due Process' → 'ضمانات المحاكمة العادلة'
- 'Tort' → 'الفعل الضار' or 'المسؤولية التقصيرية' depending on context
- 'Habeas Corpus' → retain Latin term and add: (أمر المثول أمام القضاء)
- 'Mens Rea' → retain Latin term and add: (القصد الجنائي)
- 'Actus Reus' → retain Latin term and add: (الركن المادي للجريمة)
- 'Estoppel' → 'مبدأ المنع من الإنكار'
- Legal precision is non-negotiable. Never paraphrase, simplify, or re-interpret legal language.
- Passive voice, formal subjunctive, and legal conditionals must be preserved exactly as in the source.`,

          tech: `You are a senior software engineer and technical documentation specialist, fluent in both Arabic and English, with a deep command of computer science, software architecture, cybersecurity, AI/ML, and modern development terminology.

Your linguistic doctrine:
- Optimize the contextual prompt for AI, Prompt Engineering, Hardware/RAM Optimization, and Cyber Security terms.
- Use standardized Arabized technical terms as established by ALECSO and KACST: 'Cloud Computing' → 'الحوسبة السحابية', 'Machine Learning' → 'تعلم الآلة', 'Prompt Engineering' → 'هندسة الأوامر', 'Containerization' → 'الحاوية / الحوسبة الحاوية'.
- Keep all technical abbreviations and identifiers unchanged: API, RAM, CPU, UI/UX, REST, JWT, OAuth, CI/CD, DevOps, LLM.
- Code snippets, variable names, function names, and file paths are NEVER translated.
- Version numbers, technical IDs, and protocol names remain in English.
- Maintain the technical precision and industry-standard phrasing of the original.`,

          academic: `You are an academic editor and scholarly translator affiliated with leading research institutions, specializing in translating peer-reviewed research papers, academic theses, and scholarly monographs between Arabic and English.

Your linguistic doctrine:
- Use formal academic register: passive constructions, hedging language ("it can be argued that...", "evidence suggests..."), citation-ready phrasing.
- Technical academic terminology must match that used in ISI-indexed journals in the relevant field.
- Preserve the argumentative structure, logical connectors, and citation formatting of the original.
- Avoid contractions, colloquialisms, and informal phrasing.`,

          linguistics: `You are a computational linguist and language scholar specializing in Arabic linguistics, translation theory, and contrastive analysis between Semitic and Indo-European languages. You translate linguistic content with full awareness of phonology, morphology, syntax, and pragmatics in both source and target languages.`,

          all: `You are a master translator with expertise spanning multiple specialized domains: religious/Islamic texts, legal documents, medical literature, and technical documentation. Analyze the domain and register of the source text first, then apply the appropriate specialized translation doctrine accordingly.`,
        };

        const domainPersona = domainPersonas[data.domain] ?? domainPersonas["general"];

        const toneRefinements = {
          general: "Adapt the register and style to match exactly what a native speaker would write naturally in this context.",
          academic: "Use formal, scholarly, peer-reviewed academic register throughout. Prefer established academic terminology.",
          technical: "Prioritize technical precision and domain-standard phrasing above all else.",
          creative: "Translate with literary creativity. Convey the emotional tone, rhythm, and imagery of the source. Prioritize beauty and resonance over literalism.",
        };

        const systemInstruction = `${domainPersona}\n\nTRANSLATION STYLE: ${toneRefinements[data.tone]}\n${glossaryContext}\n\nCRITICAL OUTPUT RULE: Output ONLY the translated text. No explanations, no notes, no markdown, no quotation marks, no preambles. Just the translation.`;

        const prompt = `Translate the following ${data.source !== "auto" ? data.source.toUpperCase() : ""} text to ${targetLang}:\n\n${sanitizedText}`;

        let temp = 0.35;
        if (data.domain === "legal" || data.domain === "medical") {
          temp = 0.1; 
        } else if (data.domain === "religious") {
          temp = 0.2; 
        } else if (data.domain === "tech") {
          temp = 0.15; 
        } else if (data.tone === "creative") {
          temp = 0.75; 
        } else if (data.tone === "academic") {
          temp = 0.25;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: temp,
          }
        });
        
        translated = response.text || "";
        detected = data.source === "auto" ? (sanitizedText.match(/[\u0600-\u06FF]/g)?.length ? "ar" : "en") : data.source;
      } else {
        const encodedText = encodeURIComponent(sanitizedText);
        const sl = data.source === "auto" ? "auto" : data.source;
        const tl = data.target;
        
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodedText}`;
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
        if (!res.ok) throw new Error(`CLIENT_FALLBACK_REQUIRED`);
        const json = await res.json();
        
        if (Array.isArray(json) && Array.isArray(json[0])) {
          translated = json[0].map((item: any) => item[0]).join("");
        } else {
          throw new Error("Invalid response format from translation API");
        }
        detected = data.source === "auto" ? (json[2] || data.source) : data.source;
      }

      const terms: { term: string; note: string }[] = [];
      
      localMatches.forEach((localItem) => {
        const detectedKey = (detected === "ar" || detected === "en" || detected === "es") ? detected : "en";
        const srcVal = localItem.translations[detectedKey as keyof typeof localItem.translations] || localItem.term;
        const exists = terms.some((t) => t.term.toLowerCase() === srcVal.toLowerCase());
        
        if (!exists) {
          const targetTranslation = localItem.translations[data.target as keyof typeof localItem.translations];
          const nuanceNote = localItem.nuances[data.tone]?.[data.target as keyof typeof localItem.nuances["general"]];
          if (targetTranslation && nuanceNote) {
            terms.push({
              term: srcVal,
              note: `-> ${targetTranslation}: ${nuanceNote}`
            });
          }
        }
      });

      return { translated, detected: detected || data.source, terms };
    } catch (error) {
      console.error("Translation error:", error);
      if (error instanceof Error && error.message.includes("CLIENT_FALLBACK_REQUIRED")) {
        throw error; // Let the frontend catch this and handle browser fetch
      }
      // If it's another error, also throw to trigger frontend fallback
      throw new Error("CLIENT_FALLBACK_REQUIRED");
    }
  });


export const rephraseText = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    try {
      return RephraseSchema.parse(data);
    } catch (e) {
      throw new Error("Invalid request data format");
    }
  })
  .handler(async ({ data }) => {
    const sanitizedText = sanitizeInput(data.text);
    
    try {
      const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (!geminiApiKey) {
        throw new Error("API key not configured");
      }
      
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      
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

Text to rephrase: "${sanitizedText.replace(/"/g, '\\"')}"

Rules:
- Use elevated, formal academic vocabulary
- Avoid colloquial or informal phrasing  
- Maintain the core meaning precisely
- Each version must be distinctly different in style
- If the text is in Arabic, produce Arabic academic rephrasing
- If the text is in English, produce English academic rephrasing`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });
      
      const raw = response.text || "";
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
      console.error("Rephrase API error, using fallback:", e);
      const isArabic = /[\u0600-\u06FF]/.test(sanitizedText);
      if (isArabic) {
        return [
          {
            style: 'Formal Academic',
            styleAr: 'أكاديمي رسمي',
            text: `يُستدل من المعطيات المتاحة أن: ${sanitizedText}`,
            description: 'Suitable for scholarly journals and dissertations',
            descriptionAr: 'مناسب للمجلات العلمية والرسائل الجامعية',
          },
          {
            style: 'Analytical Protocol',
            styleAr: 'بروتوكول تحليلي',
            text: `وفقاً للمنهجية التحليلية المعتمدة، يتبيّن ما يلي: ${sanitizedText}`,
            description: 'Precise analytical language for research methodology',
            descriptionAr: 'لغة تحليلية دقيقة لمنهجية البحث العلمي',
          },
          {
            style: 'Concise Academic',
            styleAr: 'مختصر أكاديمي',
            text: `خلاصة القول: ${sanitizedText}`,
            description: 'Condensed formal academic expression',
            descriptionAr: 'تعبير أكاديمي رسمي موجز',
          },
        ];
      }
      return [
        {
          style: 'Formal Academic',
          styleAr: 'أكاديمي رسمي',
          text: `It is evident from the available evidence that: ${sanitizedText}`,
          description: 'Suitable for scholarly journals and dissertations',
          descriptionAr: 'مناسب للمجلات العلمية والرسائل الجامعية',
        },
        {
          style: 'Analytical Protocol',
          styleAr: 'بروتوكول تحليلي',
          text: `Based on rigorous analytical methodology, the following is ascertained: ${sanitizedText}`,
          description: 'Precise analytical language for research methodology',
          descriptionAr: 'لغة تحليلية دقيقة لمنهجية البحث',
        },
        {
          style: 'Concise Academic',
          styleAr: 'مختصر أكاديمي',
          text: `In summation: ${sanitizedText}`,
          description: 'Condensed formal academic expression',
          descriptionAr: 'تعبير أكاديمي رسمي موجز',
        },
      ];
    }
  });
