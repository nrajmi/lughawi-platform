import { DictionaryEntry } from "./types";

export const LINGUISTICS_DICT: DictionaryEntry[] = [
  {
    term: "universal grammar",
    pos: "noun phrase",
    domain: ["linguistics", "academic"],
    translations: { ar: "النحو الكلي", en: "universal grammar", es: "gramática universal" },
    definitions: {
      ar: "نظرية لغوية تفترض وجود قواعد فطرية مشتركة بين جميع اللغات البشرية.",
      en: "A linguistic theory arguing that the ability to learn grammar is hard-wired into the brain.",
      es: "Teoría lingüística que postula que la capacidad de aprender gramática es innata."
    },
    nuances: {
      general: { ar: "القواعد الأساسية لكل اللغات.", en: "The basic rules of all languages.", es: "Reglas básicas de todos los idiomas." },
      academic: { ar: "نموذج تشومسكي التوليدي الفطري لتفسير اكتساب اللغة.", en: "Chomskyan generative innate model explaining language acquisition.", es: "Modelo generativo innato chomskyano." },
      technical: { ar: "البارامترات والمبادئ (P&P) الحاكمة للغات.", en: "Principles and Parameters (P&P) governing human languages.", es: "Principios y parámetros (P&P) que rigen." },
      creative: { ar: "البذرة الفطرية التي نبتت منها شجرة اللغات البشرية.", en: "The innate seed from which the tree of human languages grew.", es: "La semilla innata de los idiomas." }
    }
  },
  {
    term: "syntax",
    pos: "noun",
    domain: ["linguistics", "tech", "academic"],
    translations: { ar: "علم النحو", en: "syntax", es: "sintaxis" },
    definitions: {
      ar: "دراسة القواعد التي تتحكم في بنية الجملة وترتيب الكلمات.",
      en: "The arrangement of words and phrases to create well-formed sentences in a language.",
      es: "La disposición de palabras y frases para crear oraciones bien formadas en un idioma."
    },
    nuances: {
      general: { ar: "ترتيب الكلمات في الجملة.", en: "Word order in a sentence.", es: "Orden de las palabras." },
      academic: { ar: "التحليل البنيوي لتسلسل المكونات الجملية وتفرعاتها (Tree structure).", en: "Structural analysis of constituent sequences and tree hierarchies.", es: "Análisis estructural de secuencias constituyentes." },
      technical: { ar: "قواعد بناء الجملة البرمجية (Code Syntax).", en: "Rules governing the structure of programming language statements.", es: "Reglas que rigen la estructura de sentencias de código." },
      creative: { ar: "الهندسة الخفية التي تبني جسور المعنى بين الكلمات المتناثرة.", en: "The hidden architecture building bridges of meaning between scattered words.", es: "La arquitectura oculta que construye puentes de significado." }
    }
  },
  {
    term: "morphology",
    pos: "noun",
    domain: ["linguistics", "academic"],
    translations: { ar: "علم الصرف", en: "morphology", es: "morfología" },
    definitions: {
      ar: "دراسة البنية الداخلية للكلمات وكيفية تكوينها.",
      en: "The study of the internal structure of words and their formation.",
      es: "El estudio de la estructura interna de las palabras y su formación."
    },
    nuances: {
      general: { ar: "كيفية تركيب الكلمات.", en: "How words are put together.", es: "Cómo se arman las palabras." },
      academic: { ar: "تحليل المورفيمات (Morphemes) الحرة والمقيدة في بناء المفردة.", en: "Analysis of free and bound morphemes in word formation.", es: "Análisis de morfemas libres y ligados." },
      technical: { ar: "تحليل البنية الصرفية في معالجة اللغات الطبيعية (NLP Stemming).", en: "Morphological analysis in NLP (stemming/lemmatization).", es: "Análisis morfológico en PNL." },
      creative: { ar: "فن النحت اللغوي، حيث تُشكل الحروف قوالب معانٍ جديدة.", en: "The art of linguistic sculpting, where letters shape new molds of meaning.", es: "El arte de la escultura lingüística." }
    }
  },
  {
    term: "semantics",
    pos: "noun",
    domain: ["linguistics", "tech", "academic"],
    translations: { ar: "علم الدلالة", en: "semantics", es: "semántica" },
    definitions: {
      ar: "فرع من اللغويات يدرس المعنى في اللغة.",
      en: "The branch of linguistics and logic concerned with meaning.",
      es: "La rama de la lingüística y la lógica que se ocupa del significado."
    },
    nuances: {
      general: { ar: "دراسة معاني الكلمات.", en: "Study of word meanings.", es: "Estudio del significado." },
      academic: { ar: "دراسة العلاقات الدلالية بين الدوال والمدلولات.", en: "Study of semantic relationships between signifiers and signifieds.", es: "Estudio de relaciones semánticas." },
      technical: { ar: "القواعد التي تحدد معنى البيانات بعيداً عن بنيتها النحوية.", en: "Rules determining the meaning of data, distinct from its syntax.", es: "Reglas que determinan el significado de los datos." },
      creative: { ar: "البحث في روح الكلمة خلف قناع الحروف.", en: "Searching the soul of the word behind the mask of letters.", es: "Buscar el alma de la palabra." }
    }
  },
  {
    term: "pragmatics",
    pos: "noun",
    domain: ["linguistics", "academic"],
    translations: { ar: "علم التداولية", en: "pragmatics", es: "pragmática" },
    definitions: {
      ar: "دراسة كيفية تأثير السياق على المعنى اللغوي.",
      en: "The branch of linguistics dealing with language in use and context.",
      es: "Rama de la lingüística que trata del uso del lenguaje en contexto."
    },
    nuances: {
      general: { ar: "فهم المعنى من السياق.", en: "Understanding meaning from context.", es: "Comprender el significado del contexto." },
      academic: { ar: "تحليل أفعال الكلام (Speech acts) والاستلزام الحواري.", en: "Analysis of speech acts and conversational implicature.", es: "Análisis de actos de habla." },
      technical: { ar: "استنتاج النوايا الضمنية في واجهات المحادثة (Intent parsing).", en: "Inferring implicit intents in conversational AI.", es: "Inferir intenciones implícitas en IA." },
      creative: { ar: "فن قراءة ما بين السطور.", en: "The art of reading between the lines.", es: "El arte de leer entre líneas." }
    }
  },
  {
    term: "discourse analysis",
    pos: "noun phrase",
    domain: ["linguistics", "academic"],
    translations: { ar: "تحليل الخطاب", en: "discourse analysis", es: "análisis del discurso" },
    definitions: {
      ar: "منهج لدراسة اللغة في استخدامها الفعلي عبر النصوص الطويلة.",
      en: "An approach to studying language in actual use across extended texts.",
      es: "Un enfoque para estudiar el lenguaje en uso real a través de textos extensos."
    },
    nuances: {
      general: { ar: "دراسة النصوص الطويلة والمحادثات.", en: "Studying long texts and conversations.", es: "Estudiar textos largos y conversaciones." },
      academic: { ar: "الفحص النقدي للسلطة والأيديولوجيا المتضمنة في الهياكل النصية.", en: "Critical examination of power and ideology embedded in textual structures.", es: "Examen crítico de poder e ideología." },
      technical: { ar: "معالجة التماسك النصي وحل المراجع الضميرية آلياً.", en: "Automated coreference resolution and textual cohesion parsing.", es: "Resolución de correferencia y análisis de cohesión." },
      creative: { ar: "تفكيك نسيج الكلمات لكشف الأرواح التي نسجتها.", en: "Unraveling the fabric of words to reveal the souls that wove it.", es: "Desentrañar el tejido de las palabras." }
    }
  },
  {
    term: "phonology",
    pos: "noun",
    domain: ["linguistics", "academic"],
    translations: { ar: "علم الأصوات الوظيفي", en: "phonology", es: "fonología" },
    definitions: {
      ar: "دراسة النظام الصوتي والوظائف الصوتية في اللغة.",
      en: "The system of contrastive relationships among the speech sounds that constitute the fundamental components of a language.",
      es: "El sistema de relaciones contrastivas entre los sonidos del habla."
    },
    nuances: {
      general: { ar: "كيف تعمل الأصوات في لغة ما.", en: "How sounds work in a specific language.", es: "Cómo funcionan los sonidos en un idioma." },
      academic: { ar: "التنظيم المعرفي والتجريدي للأنظمة الصوتية (الفونيمات).", en: "The cognitive and abstract organization of sound systems (phonemes).", es: "La organización cognitiva y abstracta de los sistemas de sonido." },
      technical: { ar: "نمذجة النطق في أنظمة تحويل النص إلى كلام (TTS).", en: "Pronunciation modeling in Text-to-Speech (TTS) systems.", es: "Modelado de pronunciación en sistemas TTS." },
      creative: { ar: "الموسيقى الخفية التي تنظم إيقاع لغتنا اليومية.", en: "The hidden music organizing the rhythm of our daily speech.", es: "La música oculta que organiza el ritmo del habla." }
    }
  },
  {
    term: "idiom",
    pos: "noun",
    domain: ["linguistics", "general"],
    translations: { ar: "تعبير اصطلاحي", en: "idiom", es: "modismo" },
    definitions: {
      ar: "مجموعة كلمات مجتمعة تعطي معنى لا يمكن استنتاجه من معاني كلماتها الفردية.",
      en: "A group of words established by usage as having a meaning not deducible from those of the individual words.",
      es: "Grupo de palabras con un significado que no se puede deducir de las palabras individuales."
    },
    nuances: {
      general: { ar: "مثل شعبي أو تعبير مجازي.", en: "A common saying or figurative expression.", es: "Un dicho común o expresión figurada." },
      academic: { ar: "وحدة معجمية مركبة تتميز بالتحجر الدلالي (Semantic opacity).", en: "A complex lexical unit characterized by semantic opacity.", es: "Una unidad léxica compleja caracterizada por la opacidad semántica." },
      technical: { ar: "عبارات تتطلب معالجة استثنائية في محركات الترجمة الآلية.", en: "Phrases requiring exception handling in MT engines.", es: "Frases que requieren manejo de excepciones en MT." },
      creative: { ar: "سر لغوي متوارث، يعكس روح ثقافة شعب بأكمله في كلمات معدودة.", en: "An inherited linguistic secret, reflecting a culture's soul in a few words.", es: "Un secreto lingüístico heredado." }
    }
  },
  {
    term: "lexicon",
    pos: "noun",
    domain: ["linguistics", "tech", "academic"],
    translations: { ar: "المعجم", en: "lexicon", es: "léxico" },
    definitions: {
      ar: "مفردات شخص ما، أو لغة معينة، أو فرع من المعرفة.",
      en: "The vocabulary of a person, language, or branch of knowledge.",
      es: "El vocabulario de una persona, idioma o rama del conocimiento."
    },
    nuances: {
      general: { ar: "مجموعة الكلمات التي يعرفها الشخص.", en: "The set of words someone knows.", es: "El conjunto de palabras que alguien conoce." },
      academic: { ar: "المخزون الذهني للمفردات الذي يعكس الخصائص الصرفية والدلالية للمتحدث.", en: "The mental repository of vocabulary reflecting morphological and semantic traits.", es: "El repositorio mental de vocabulario." },
      technical: { ar: "قاعدة بيانات الكلمات والكيانات المسماة (Named Entities) المستخدمة في نماذج الذكاء الاصطناعي.", en: "A database of words and named entities used in AI models.", es: "Una base de datos de palabras y entidades." },
      creative: { ar: "خزانة كنوز العقل، حيث ترقد الكلمات بانتظار من يوقظها لتصنع المعجزات.", en: "The mind's treasure chest, where words await to awaken and create miracles.", es: "El cofre del tesoro de la mente." }
    }
  }
];
