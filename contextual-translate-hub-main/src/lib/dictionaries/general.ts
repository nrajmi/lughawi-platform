import { DictionaryEntry } from "./types";

export const GENERAL_DICT: DictionaryEntry[] = [
  {
    term: "resilience",
    pos: "noun",
    domain: ["general"],
    translations: { ar: "مرونة", en: "resilience", es: "resiliencia" },
    definitions: {
      ar: "القدرة على التعافي السريع من الصعوبات أو التكيف مع التغييرات.",
      en: "The capacity to recover quickly from difficulties; toughness.",
      es: "La capacidad de recuperarse rápidamente de las dificultades."
    },
    nuances: {
      general: { ar: "القدرة على النهوض بعد السقوط.", en: "Ability to bounce back.", es: "Capacidad de recuperarse." },
      academic: { ar: "القدرة النظامية على امتصاص الصدمات واستعادة التوازن.", en: "Systemic ability to absorb shocks and restore equilibrium.", es: "Capacidad sistémica para absorber impactos." },
      technical: { ar: "قدرة النظام على الاستمرار في العمل رغم الأعطال.", en: "System's ability to continue operating despite failures.", es: "Capacidad del sistema para seguir operando." },
      creative: { ar: "انحناء السنديان أمام العاصفة دون أن ينكسر.", en: "The oak bending to the storm without breaking.", es: "El roble que se dobla ante la tormenta sin romperse." }
    }
  },
  {
    term: "ephemeral",
    pos: "adj",
    domain: ["general"],
    translations: { ar: "عابر", en: "ephemeral", es: "efímero" },
    definitions: {
      ar: "شيء يدوم لفترة قصيرة جداً.",
      en: "Lasting for a very short time.",
      es: "Que dura por muy poco tiempo."
    },
    nuances: {
      general: { ar: "مؤقت وقصير الأجل.", en: "Short-lived and temporary.", es: "De corta duración y temporal." },
      academic: { ar: "ظاهرة ذات مدة زمنية محدودة جداً.", en: "A phenomenon of very limited temporal duration.", es: "Fenómeno de duración temporal muy limitada." },
      technical: { ar: "بيانات متطايرة لا يتم تخزينها بشكل دائم.", en: "Volatile data not stored persistently.", es: "Datos volátiles no almacenados persistentemente." },
      creative: { ar: "كلحظة فجر تتلاشى مع أول خيوط الشمس.", en: "Like a dawn moment fading with the first sunrays.", es: "Como un momento del amanecer que se desvanece." }
    }
  },
  {
    term: "serendipity",
    pos: "noun",
    domain: ["general"],
    translations: { ar: "صدفة حسنة", en: "serendipity", es: "serendipia" },
    definitions: {
      ar: "وقوع أحداث سعيدة أو مفيدة بالصدفة.",
      en: "The occurrence and development of events by chance in a happy or beneficial way.",
      es: "Hallazgo valioso que se produce de manera accidental o casual."
    },
    nuances: {
      general: { ar: "اكتشاف شيء رائع بالصدفة.", en: "Finding something great by chance.", es: "Encontrar algo grandioso por casualidad." },
      academic: { ar: "الاكتشاف العرضي غير المخطط له لنتائج إيجابية.", en: "The unplanned incidental discovery of positive outcomes.", es: "El descubrimiento incidental." },
      technical: { ar: "اكتشاف ميزة غير مقصودة أثناء التطوير.", en: "Discovering an unintended feature during development.", es: "Descubrimiento de una característica no intencionada." },
      creative: { ar: "هدية غير متوقعة من القدر في طريق لم تقصده.", en: "An unexpected gift from destiny on an unintended path.", es: "Un regalo inesperado del destino." }
    }
  },
  {
    term: "ubiquitous",
    pos: "adj",
    domain: ["general"],
    translations: { ar: "موجود في كل مكان", en: "ubiquitous", es: "ubicuo" },
    definitions: {
      ar: "حاضر أو يظهر في كل مكان في نفس الوقت.",
      en: "Present, appearing, or found everywhere.",
      es: "Presente, apareciendo o encontrándose en todas partes."
    },
    nuances: {
      general: { ar: "شائع جداً وموجود حولنا.", en: "Very common and all around us.", es: "Muy común y a nuestro alrededor." },
      academic: { ar: "منتشر بشكل كلي في نطاق محدد.", en: "Omnipresent within a specific domain.", es: "Omnipresente en un dominio específico." },
      technical: { ar: "أنظمة حوسبة مدمجة في كل مكان محيط.", en: "Computing systems embedded in all surroundings.", es: "Sistemas informáticos integrados en todas partes." },
      creative: { ar: "كالهواء الذي نتنفسه، يحيط بنا دون أن نراه.", en: "Like the air we breathe, surrounding us unseen.", es: "Como el aire que respiramos." }
    }
  },
  {
    term: "paradigm",
    pos: "noun",
    domain: ["general"],
    translations: { ar: "نموذج فكري", en: "paradigm", es: "paradigma" },
    definitions: {
      ar: "مثال نموذجي أو نمط لشيء ما؛ إطار فكري.",
      en: "A typical example or pattern of something; a model.",
      es: "Un ejemplo típico o patrón de algo; un modelo."
    },
    nuances: {
      general: { ar: "طريقة تفكير أو نموذج.", en: "A way of thinking or a model.", es: "Una forma de pensar o un modelo." },
      academic: { ar: "إطار نظري منهجي يوجه البحث العلمي.", en: "A systematic theoretical framework guiding scientific research.", es: "Un marco teórico sistemático." },
      technical: { ar: "نمط برمجي يحدد هيكلة الكود (مثل البرمجة الكائنية).", en: "Programming pattern defining code structure.", es: "Patrón de programación que define la estructura." },
      creative: { ar: "العدسة التي نرى من خلالها تشكل العالم.", en: "The lens through which we perceive the shaping of the world.", es: "La lente a través de la cual percibimos el mundo." }
    }
  }
];
