import { DictionaryEntry } from "./types";

export const TECH_DICT: DictionaryEntry[] = [
  {
    term: "algorithm",
    pos: "noun",
    domain: ["tech", "academic"],
    translations: { ar: "خوارزمية", en: "algorithm", es: "algoritmo" },
    definitions: {
      ar: "سلسلة من الخطوات الرياضية والمنطقية المحددة لحل مشكلة ما.",
      en: "A set of rules to be followed in calculations or problem-solving.",
      es: "Un conjunto de reglas a seguir en cálculos o resolución de problemas."
    },
    nuances: {
      general: { ar: "طريقة مرتبة لحل مشكلة.", en: "An ordered way to solve a problem.", es: "Forma ordenada de resolver un problema." },
      academic: { ar: "نموذج رياضي مجرد يخضع لتحليل التعقيد الزمني.", en: "An abstract mathematical model subjected to time complexity analysis.", es: "Modelo matemático abstracto." },
      technical: { ar: "شفرة برمجية تنفيذية تطبق هياكل البيانات الفعالة.", en: "Executable code implementing efficient data structures.", es: "Código ejecutable que implementa estructuras." },
      creative: { ar: "رقصة منطقية متناغمة تنظم فوضى البيانات.", en: "A harmonious logical dance organizing data chaos.", es: "Danza lógica armoniosa." }
    }
  },
  {
    term: "cache",
    pos: "noun",
    domain: ["tech"],
    translations: { ar: "ذاكرة التخزين المؤقت", en: "cache", es: "caché" },
    definitions: {
      ar: "مكون أجهزة أو برامج يخزن البيانات بحيث يمكن تلبية الطلبات المستقبلية لتلك البيانات بشكل أسرع.",
      en: "A hardware or software component that stores data so that future requests for that data can be served faster.",
      es: "Un componente de hardware o software que almacena datos para que las solicitudes futuras de esos datos se puedan atender más rápido."
    },
    nuances: {
      general: { ar: "مكان لتخزين الأشياء للوصول السريع.", en: "A place to store things for quick access.", es: "Un lugar para guardar cosas para un acceso rápido." },
      academic: { ar: "آلية لتقليل أوقات الوصول للبيانات في المعماريات الحاسوبية.", en: "Mechanism to reduce data access times in computer architectures.", es: "Mecanismo para reducir los tiempos de acceso a los datos." },
      technical: { ar: "طبقة تخزين عالية السرعة للبيانات المتكررة الوصول.", en: "High-speed storage layer for frequently accessed data.", es: "Capa de almacenamiento de alta velocidad." },
      creative: { ar: "الذاكرة السريعة التي تحتفظ بالذكريات القريبة لتستدعيها بلمح البصر.", en: "The swift memory that keeps recent memories to recall in the blink of an eye.", es: "La memoria rápida que guarda recuerdos recientes." }
    }
  },
  {
    term: "deployment",
    pos: "noun",
    domain: ["tech"],
    translations: { ar: "نشر", en: "deployment", es: "despliegue" },
    definitions: {
      ar: "عملية جعل النظام البرمجي متاحًا للاستخدام.",
      en: "The action of bringing resources into effective action; putting software into a live environment.",
      es: "La acción de poner los recursos en acción efectiva; poner el software en un entorno en vivo."
    },
    nuances: {
      general: { ar: "تجهيز شيء للاستخدام.", en: "Making something ready for use.", es: "Preparar algo para su uso." },
      academic: { ar: "المرحلة النهائية في دورة حياة تطوير البرمجيات.", en: "The final phase in the software development life cycle.", es: "La fase final del ciclo de vida del desarrollo de software." },
      technical: { ar: "دفع التعليمات البرمجية وتكوين البنية التحتية لبيئة الإنتاج.", en: "Pushing code and configuring infrastructure for production.", es: "Impulsar código y configurar la infraestructura." },
      creative: { ar: "إطلاق السفينة البرمجية نحو محيط المستخدمين.", en: "Launching the software ship into the ocean of users.", es: "Lanzar el barco de software al océano de usuarios." }
    }
  },
  {
    term: "latency",
    pos: "noun",
    domain: ["tech", "academic"],
    translations: { ar: "كمون", en: "latency", es: "latencia" },
    definitions: {
      ar: "التأخير الزمني بين سبب وتأثير لتغير مادي ما في النظام الملاحظ.",
      en: "The delay before a transfer of data begins following an instruction for its transfer.",
      es: "El tiempo que tarda en transmitirse un paquete dentro de la red."
    },
    nuances: {
      general: { ar: "تأخير بسيط قبل حدوث استجابة.", en: "A slight delay before a response.", es: "Un ligero retraso antes de una respuesta." },
      academic: { ar: "قياس الفاصل الزمني لانتقال الإشارة بين العقد الشبكية.", en: "Measurement of the time interval for signal transmission between network nodes.", es: "Medida del intervalo de tiempo." },
      technical: { ar: "الزمن المستغرق لعودة حزمة البيانات في الشبكات.", en: "Round-trip time for a data packet in networks.", es: "Tiempo de ida y vuelta para un paquete de datos." },
      creative: { ar: "الصمت القصير بين صدى النداء والاستجابة.", en: "The brief silence between the echo of a call and the response.", es: "El breve silencio entre el eco de una llamada." }
    }
  },
  {
    term: "repository",
    pos: "noun",
    domain: ["tech"],
    translations: { ar: "مستودع", en: "repository", es: "repositorio" },
    definitions: {
      ar: "مكان أو وعاء توضع فيه الأشياء لتخزينها أو العثور عليها بأمان.",
      en: "A central location in which data is stored and managed.",
      es: "Un lugar central donde se almacenan y gestionan los datos."
    },
    nuances: {
      general: { ar: "مكان لتخزين وحفظ الأشياء.", en: "A place to store and keep things.", es: "Un lugar para guardar y mantener cosas." },
      academic: { ar: "قاعدة أرشيفية مركزية لإدارة الإصدارات والمصادر.", en: "Central archival database for version and resource management.", es: "Base de datos de archivo central." },
      technical: { ar: "بيئة استضافة الكود المصدري كـ Git.", en: "Source code hosting environment like Git.", es: "Entorno de alojamiento de código fuente." },
      creative: { ar: "خزانة الأسرار البرمجية التي تحفظ تاريخ إبداعاتنا.", en: "The cabinet of software secrets preserving the history of our creations.", es: "El gabinete de secretos de software." }
    }
  }
];

export interface TechGlossaryEntry {
  english: string;
  arabic: string;
  preferred_es: string;
  alternate_ar: string[];
  rationale: string;
  industry_standard: string;
  caution?: string;
}

export const TECH_GLOSSARY: TechGlossaryEntry[] = [
  {
    english: "Generative AI",
    arabic: "الذكاء الاصطناعي التوليدي",
    preferred_es: "IA Generativa",
    alternate_ar: ["الذكاء التوليدي"],
    rationale: "ترجمة دقيقة تعكس قدرة النماذج على 'توليد' محتوى جديد (نصوص، صور، أكواد) بناءً على الأنماط المتعلمة، وتُفضل على الترجمات الحرفية.",
    industry_standard: "IEEE / ACM / ISO/IEC JTC 1/SC 42",
  },
  {
    english: "Prompt Engineering",
    arabic: "هندسة الأوامر",
    preferred_es: "Ingeniería de Prompts",
    alternate_ar: ["هندسة التلقين", "صياغة الموجهات"],
    rationale: "استقر المجمع التقني العربي على 'هندسة الأوامر' أو 'هندسة التلقين' للتعبير عن الصياغة الدقيقة للمدخلات للحصول على أفضل المخرجات من نماذج الذكاء الاصطناعي.",
    industry_standard: "AI Arabization Council / Microsoft Arabic Localization",
    caution: "تجنب الترجمة الحرفية مثل 'هندسة الموجهات' في السياقات الأكاديمية الصارمة."
  },
  {
    english: "Cloud Computing",
    arabic: "الحوسبة السحابية",
    preferred_es: "Computación en la Nube",
    alternate_ar: ["المعالجة السحابية"],
    rationale: "المصطلح المعتمد تقنياً وأكاديمياً في كافة أدبيات علوم الحاسب العربية للإشارة إلى توفير موارد تقنية المعلومات حسب الطلب عبر الإنترنت.",
    industry_standard: "NIST / AWS Arabic Glossary",
  },
  {
    english: "Cyber Security",
    arabic: "الأمن السيبراني",
    preferred_es: "Ciberseguridad",
    alternate_ar: ["أمن المعلومات", "الأمن الإلكتروني"],
    rationale: "استخدام 'السيبراني' أصبح المعيار الرسمي في المؤسسات الحكومية والأكاديمية العربية للإشارة إلى حماية الأنظمة والشبكات، وهو أشمل من مجرد أمن المعلومات.",
    industry_standard: "NCA (National Cybersecurity Authority) / ITU",
  },
  {
    english: "RAM Optimization",
    arabic: "تحسين استهلاك الذاكرة",
    preferred_es: "Optimización de RAM",
    alternate_ar: ["تحسين أداء الذاكرة العشوائية", "ترشيد استهلاك الرام"],
    rationale: "ترجمة المعنى السياقي لـ Optimization بـ 'تحسين استهلاك' أو 'رفع كفاءة' أدق من الترجمة الحرفية 'تحسين الرام'.",
    industry_standard: "CompTIA / CISCO Arabic Resources",
  },
  {
    english: "Machine Learning",
    arabic: "تعلم الآلة",
    preferred_es: "Aprendizaje Automático",
    alternate_ar: ["التعلم الآلي"],
    rationale: "الترجمة الأكاديمية القياسية لمجال تدريب الخوارزميات للتعلم من البيانات دون برمجة صريحة.",
    industry_standard: "Stanford CS Arabic / Google Developers",
  },
  {
    english: "Deep Learning",
    arabic: "التعلم العميق",
    preferred_es: "Aprendizaje Profundo",
    alternate_ar: [],
    rationale: "المصطلح المستقر عربياً للدلالة على الشبكات العصبية ذات الطبقات المتعددة (Deep Neural Networks).",
    industry_standard: "DeepLearning.AI Arabic",
  }
];
