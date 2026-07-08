/**
 * Lughawi — Medical Dictionary & Controlled Glossary
 * Arabic / English / Spanish Clinical Translation Pipeline
 *
 * References:
 * - ICD-11 (WHO International Classification of Diseases, 11th Revision)
 * - MeSH (Medical Subject Headings) — U.S. National Library of Medicine
 * - Dorland's Illustrated Medical Dictionary (33rd Ed.)
 * - Harrison's Principles of Internal Medicine (21st Ed.)
 * - WHO Arabic Health Terminology Glossary
 *
 * by nrajmi | Lughawi Platform 2026
 */

import { DictionaryEntry } from "./types";

export const MEDICAL_DICT: DictionaryEntry[] = [
  {
    term: "diagnosis",
    pos: "noun",
    domain: ["medical", "academic"],
    translations: { ar: "تشخيص", en: "diagnosis", es: "diagnóstico" },
    definitions: {
      ar: "التعرف على طبيعة المرض أو الحالة من خلال الأعراض والفحوصات السريرية والمخبرية.",
      en: "The identification of the nature of an illness by examination of the symptoms, clinical signs, and laboratory findings.",
      es: "La identificación de la naturaleza de una enfermedad mediante el examen de síntomas, signos clínicos y hallazgos de laboratorio."
    },
    nuances: {
      general: { ar: "معرفة ما هو المرض من أعراضه.", en: "Finding out what the illness is from its symptoms.", es: "Averiguar cuál es la enfermedad por sus síntomas." },
      academic: { ar: "التقييم السريري الشامل لتحديد الحالة المرضية وفق المعايير التشخيصية المعتمدة (ICD-11).", en: "Comprehensive clinical evaluation to accurately identify the pathological state according to ICD-11 criteria.", es: "Evaluación clínica integral según criterios diagnósticos ICD-11." },
      technical: { ar: "تحليل نتائج الاختبارات المعملية والصور الطبية وفق مسار التشخيص التفريقي (Differential Diagnosis).", en: "Analysis of lab tests and medical imaging following a differential diagnosis pathway.", es: "Análisis de pruebas de laboratorio e imágenes médicas siguiendo diagnóstico diferencial." },
      creative: { ar: "فك طلاسم جسد المريض وقراءة رسائله الخفية بعين العلم.", en: "Deciphering the patient's body and reading its hidden messages with the eye of science.", es: "Descifrar el cuerpo del paciente y leer sus mensajes ocultos." }
    }
  },
  {
    term: "prognosis",
    pos: "noun",
    domain: ["medical", "academic"],
    translations: { ar: "الإنذار المرضي", en: "prognosis", es: "pronóstico" },
    definitions: {
      ar: "التقدير الطبي لاحتمال مسار المرض ومآله — سواء بالشفاء أو تطور المضاعفات أو الوفاة.",
      en: "The likely course and outcome of a disease, including the probability of recovery, complications, or death.",
      es: "El curso probable y resultado de una enfermedad, incluyendo la probabilidad de recuperación, complicaciones o muerte."
    },
    nuances: {
      general: { ar: "ما الذي سيحدث للمريض بناءً على حالته الراهنة.", en: "What will happen to the patient based on their current condition.", es: "Qué le pasará al paciente según su estado actual." },
      academic: { ar: "التنبؤ العلمي المبني على معطيات إحصائية سريرية بمسار المرض ومآله الطبي.", en: "Scientific prediction based on clinical statistical data regarding the course and medical outcome of a disease.", es: "Predicción científica basada en datos estadísticos clínicos sobre el curso de la enfermedad." },
      technical: { ar: "تقدير معدل البقاء (Survival Rate) والتوقعات السريرية وفق معطيات الحالة ومرجعيات طب القرائن.", en: "Estimating survival rate and clinical outlook based on case data and evidence-based medicine.", es: "Estimación de tasa de supervivencia y perspectiva clínica basada en medicina basada en evidencia." },
      creative: { ar: "استشراف الأمل في سماء التعافي، أو الاستعداد لمواجهة الغيوم.", en: "Foreseeing hope in the sky of recovery, or preparing to face the clouds ahead.", es: "Prever la esperanza en el cielo de la recuperación." }
    }
  },
  {
    term: "anesthesia",
    pos: "noun",
    domain: ["medical"],
    translations: { ar: "التخدير", en: "anesthesia", es: "anestesia" },
    definitions: {
      ar: "الحالة المُحدَثة طبياً التي تمنع الإحساس بالألم مؤقتاً لأغراض جراحية أو تشخيصية، وتشمل التخدير العام والنصفي والموضعي.",
      en: "A medically induced state preventing pain sensation, used for surgical or diagnostic purposes — encompassing general, regional, and local anesthesia.",
      es: "Estado inducido médicamente que previene la sensación de dolor para propósitos quirúrgicos o diagnósticos."
    },
    nuances: {
      general: { ar: "دواء يمنع الشعور بالألم أثناء الجراحة.", en: "Medicine that prevents the feeling of pain during surgery.", es: "Medicina que previene el dolor durante la cirugía." },
      academic: { ar: "التعديل الدوائي الفسيولوجي المانع لاستقبال إشارات الألم (Nociception) عبر استهداف الجهاز العصبي.", en: "Pharmacological modulation preventing nociception by targeting the central or peripheral nervous system.", es: "Modulación farmacológica que previene la nocicepción al actuar sobre el sistema nervioso." },
      technical: { ar: "تثبيط الجهاز العصبي المركزي أو المحيطي بعوامل دوائية محددة (Volatile agents, IV agents, Local anesthetics).", en: "CNS/PNS depression using specific pharmacological agents (volatile agents, IV agents, local anesthetics).", es: "Depresión del SNC/SNP usando agentes farmacológicos específicos." },
      creative: { ar: "نوم عميق مؤقت يعلق الإحساس ريثما يداوي المشرط ما صنعه الداء.", en: "A temporary deep sleep suspending sensation while the scalpel heals what the disease created.", es: "Un sueño profundo temporal que suspende la sensación mientras el bisturí sana." }
    }
  },
  {
    term: "biopsy",
    pos: "noun",
    domain: ["medical"],
    translations: { ar: "خزعة نسيجية", en: "biopsy", es: "biopsia" },
    definitions: {
      ar: "أخذ عينة من أنسجة الجسم الحية وفحصها مجهرياً لتحديد التشخيص، لا سيما في حالات الأورام.",
      en: "The removal and microscopic examination of tissue from the living body to determine diagnosis, especially in tumor cases.",
      es: "La extracción y examen microscópico de tejido del cuerpo vivo para determinar el diagnóstico."
    },
    nuances: {
      general: { ar: "أخذ عينة صغيرة من الجسم لفحصها في المختبر.", en: "Taking a small tissue sample for laboratory examination.", es: "Tomar una pequeña muestra del cuerpo para examen de laboratorio." },
      academic: { ar: "الاستئصال النسيجي الباثولوجي للتشخيص الهستولوجي بتحديد درجة ورداءة الخلايا.", en: "Pathological tissue excision for histological diagnosis, determining cell grade and malignancy.", es: "Escisión de tejido patológico para diagnóstico histológico." },
      technical: { ar: "تحليل الأنسجة باستخدام تقنيات الهستوباثولوجيا للتمييز بين الخلايا الحميدة (Benign) والخبيثة (Malignant).", en: "Tissue analysis using histopathology techniques to differentiate benign from malignant cells.", es: "Análisis de tejidos con histopatología para diferenciar células benignas de malignas." },
      creative: { ar: "قطعة صغيرة من الجسم تحمل القصة الكاملة للمرض — كتاب مختصر في ورقة واحدة.", en: "A tiny fragment carrying the full story of the disease — a condensed book in a single page.", es: "Un pequeño fragmento que lleva la historia completa de la enfermedad." }
    }
  },
  {
    term: "hypertension",
    pos: "noun",
    domain: ["medical"],
    translations: { ar: "ارتفاع ضغط الدم", en: "hypertension", es: "hipertensión" },
    definitions: {
      ar: "حالة مزمنة يكون فيها ضغط الدم في الشرايين مرتفعاً باستمرار (≥130/80 ملم زئبقي) مما يزيد من خطر أمراض القلب والسكتة الدماغية.",
      en: "A chronic condition of persistently elevated blood pressure in the arteries (≥130/80 mmHg), increasing the risk of heart disease and stroke.",
      es: "Condición crónica de presión arterial persistentemente elevada (≥130/80 mmHg), con mayor riesgo de enfermedad cardíaca y accidente cerebrovascular."
    },
    nuances: {
      general: { ar: "ضغط الدم المرتفع.", en: "High blood pressure.", es: "Presión arterial alta." },
      academic: { ar: "فرط التوتر الشرياني المستدام — يُصنَّف إلى أولي (Essential) بلا سبب محدد، وثانوي (Secondary) ناتج عن مرض آخر.", en: "Sustained arterial hypertonia — classified as primary (essential, no specific cause) and secondary (due to underlying disease).", es: "Hipertonía arterial sostenida — clasificada como primaria (esencial) y secundaria (por enfermedad subyacente)." },
      technical: { ar: "ارتفاع الضغط الانقباضي (≥130) أو الانبساطي (≥80) وفق معايير ACC/AHA 2017 — يتطلب قياسات متكررة للتأكيد.", en: "Elevation of systolic (≥130) or diastolic (≥80) per ACC/AHA 2017 criteria — confirmed by repeated measurements.", es: "Elevación sistólica (≥130) o diastólica (≥80) según criterios ACC/AHA 2017." },
      creative: { ar: "القاتل الصامت يتسلل في الأوردة دون ضجيج — يبني خطره ببطء حتى يداهم القلب.", en: "The silent killer creeping through the veins — building its danger slowly until it ambushes the heart.", es: "El asesino silencioso que se infiltra por las venas, construyendo su peligro lentamente." }
    }
  },
  {
    term: "myocardial infarction",
    pos: "noun",
    domain: ["medical", "academic"],
    translations: { ar: "احتشاء عضلة القلب", en: "myocardial infarction", es: "infarto de miocardio" },
    definitions: {
      ar: "موت جزء من عضلة القلب بسبب انسداد الشريان التاجي وانقطاع الأكسجين عنه — المعروف شعبياً بـ'النوبة القلبية'.",
      en: "Death of heart muscle tissue due to coronary artery occlusion and oxygen deprivation — commonly known as a 'heart attack'.",
      es: "Muerte de tejido muscular cardíaco por oclusión coronaria y privación de oxígeno — conocido como 'ataque cardíaco'."
    },
    nuances: {
      general: { ar: "النوبة القلبية — توقف جزء من القلب عن العمل بسبب انسداد شرياني.", en: "Heart attack — part of the heart stops working due to a blocked artery.", es: "Ataque cardíaco — parte del corazón deja de funcionar por arteria bloqueada." },
      academic: { ar: "نخر إقفاري في عضلة القلب ناتج عن انسداد الشريان التاجي — يُشخَّص بتغيرات في رسم القلب (ECG) وارتفاع التروبونين.", en: "Ischemic necrosis of cardiac muscle from coronary occlusion — diagnosed by ECG changes and elevated Troponin.", es: "Necrosis isquémica cardíaca por oclusión coronaria — diagnosticada por ECG y elevación de Troponina." },
      technical: { ar: "يُصنَّف إلى STEMI وNSTEMI وفق ESC/ACC — إعادة التروية بـPCI خلال 90 دقيقة هي الخيار الأمثل.", en: "Classified as STEMI and NSTEMI per ESC/ACC — reperfusion via PCI within 90 minutes is optimal.", es: "Clasificado en STEMI y NSTEMI según ESC/ACC — reperfusión mediante PCI en 90 minutos es óptima." },
      creative: { ar: "لحظة يتوقف فيها جزء من الجسر الحيوي — والوقت هنا هو عضلة القلب نفسها.", en: "A moment when part of the vital bridge pauses — here, time itself is the heart muscle.", es: "Un momento en que parte del puente vital se detiene — aquí, el tiempo mismo es el músculo cardíaco." }
    }
  },
  {
    term: "sepsis",
    pos: "noun",
    domain: ["medical", "academic"],
    translations: { ar: "الإنتان", en: "sepsis", es: "sepsis" },
    definitions: {
      ar: "استجابة التهابية خطيرة ومفرطة للجهاز المناعي لمواجهة عدوى ما، تؤدي إلى تلف الأعضاء والوفاة إن لم تُعالج.",
      en: "A life-threatening condition caused by a dysregulated immune response to infection, leading to organ dysfunction and potentially death.",
      es: "Condición potencialmente mortal causada por respuesta inmune desregulada a infección, que lleva a disfunción orgánica."
    },
    nuances: {
      general: { ar: "انتشار العدوى في الدم وتأثيرها الخطير على الجسم كله.", en: "The spread of infection and its dangerous systemic effects on the entire body.", es: "La propagación de la infección y sus efectos sistémicos peligrosos." },
      academic: { ar: "استجابة الجهاز المناعي المفرطة لعدوى تؤدي إلى خلل وظيفي لأعضاء متعددة (MODS) — حالة طوارئ طبية قصوى.", en: "Dysregulated immune response to infection leading to multiple organ dysfunction syndrome (MODS) — a medical emergency.", es: "Respuesta inmune desregulada que lleva al síndrome de disfunción multiorgánica (MODS)." },
      technical: { ar: "يُشخَّص وفق تعريف Sepsis-3 (2016) بارتفاع SOFA ≥ 2 — يُميَّز عن الصدمة الإنتانية (Septic Shock) بانخفاض الضغط رغم الإنعاش بالسوائل.", en: "Diagnosed per Sepsis-3 (2016) with SOFA ≥ 2 — distinguished from septic shock by persistent hypotension despite fluid resuscitation.", es: "Diagnosticado según Sepsis-3 (2016) con SOFA ≥ 2 — distinguido del shock séptico por hipotensión persistente." },
      creative: { ar: "ثورة مناعية تهدف لقمع المحتل لكنها تحرق المدينة نفسها في المعركة.", en: "An immune uprising aiming to crush the invader — but burning the city itself in the battle.", es: "Una revuelta inmunológica para aplastar al invasor, pero quemando la ciudad en el proceso." }
    }
  },
  {
    term: "contraindication",
    pos: "noun",
    domain: ["medical", "academic"],
    translations: { ar: "موانع الاستعمال", en: "contraindication", es: "contraindicación" },
    definitions: {
      ar: "حالة طبية أو عامل يجعل استخدام علاج أو دواء أو إجراء طبي معين غير آمن أو محظوراً.",
      en: "A condition or factor that makes a particular medical treatment or procedure unsafe or inadvisable.",
      es: "Condición o factor que hace que un tratamiento médico o procedimiento sea inseguro o no recomendable."
    },
    nuances: {
      general: { ar: "أسباب طبية تمنع استعمال دواء أو إجراء علاجي معين.", en: "Medical reasons that prevent the use of a certain drug or treatment.", es: "Razones médicas que impiden usar cierto medicamento o tratamiento." },
      academic: { ar: "تُصنَّف إلى مطلقة (Absolute) تمنع الدواء كلياً، ونسبية (Relative) تستوجب الحذر وتقييم المخاطر.", en: "Classified as absolute (completely prohibiting the treatment) and relative (requiring risk-benefit assessment).", es: "Clasificadas en absolutas (prohíben el tratamiento) y relativas (requieren evaluación riesgo-beneficio)." },
      technical: { ar: "نشرة الدواء (PIL) تُفصّل موانع الاستعمال وفق البيانات الفارماكوكينيتيكية والتفاعلات الدوائية.", en: "Patient information leaflet (PIL) details contraindications based on pharmacokinetic data and drug interactions.", es: "El prospecto detalla contraindicaciones según datos farmacocinéticos e interacciones farmacológicas." },
      creative: { ar: "خط أحمر علمي يرسمه الطبيب قبل كل علاج — حماية المريض قبل علاجه.", en: "A scientific red line drawn by the physician before every treatment — protecting the patient before healing them.", es: "Una línea roja científica trazada por el médico antes de cada tratamiento." }
    }
  }
];

// ══════════════════════════════════════════════════════════
// MEDICAL GLOSSARY — Strict Controlled Entries (WHO / ICD-11)
// ══════════════════════════════════════════════════════════

export interface MedicalGlossaryEntry {
  english: string;
  arabic: string;
  icd11_code?: string;
  preferred_es: string;
  alternate_ar: string[];
  rationale: string;
  who_standard: string;
  caution?: string;
}

export const MEDICAL_GLOSSARY: MedicalGlossaryEntry[] = [
  {
    english: "Myocardial Infarction",
    arabic: "احتشاء عضلة القلب",
    icd11_code: "BA41",
    preferred_es: "Infarto de Miocardio",
    alternate_ar: ["النوبة القلبية (عامية)"],
    rationale: "المصطلح الطبي الدقيق هو 'احتشاء عضلة القلب' — الاحتشاء يعني النخر الإقفاري وهو أدق من 'نوبة قلبية' الذي مصطلح شعبي. في السياقات العلمية يُستخدم الاحتشاء حصراً.",
    who_standard: "ICD-11: BA41 | WHO Arabic Medical Terminology | Harrison's 21st Ed.",
    caution: "تجنب 'هجوم القلب' — الترجمة الحرفية غير مقبولة طبياً. للعموم: نوبة قلبية. للأطباء: احتشاء عضلة القلب."
  },
  {
    english: "Sepsis",
    arabic: "الإنتان",
    icd11_code: "1G41",
    preferred_es: "Sepsis",
    alternate_ar: ["تعفن الدم (شعبي)", "التسمم الدموي"],
    rationale: "الترجمة الطبية الأكاديمية الأدق هي 'الإنتان' — مشتقة من الجذر العربي (ن-ت-ن) وهي المعتمدة في مراجع طب الطوارئ والرعاية المركزة. 'تعفن الدم' مقبول للجمهور العام.",
    who_standard: "ICD-11: 1G41 | Sepsis-3 Definition (2016) | ESC/ESICM Guidelines",
    caution: "لا تُترجم Septic Shock بـ'صدمة التعفن' — الصحيح 'الصدمة الإنتانية'. والفرق بينهما: الإنتان ≠ صدمة إنتانية."
  },
  {
    english: "Hypertension",
    arabic: "ارتفاع ضغط الدم",
    icd11_code: "BA00",
    preferred_es: "Hipertensión",
    alternate_ar: ["فرط التوتر الشرياني (أكاديمي)"],
    rationale: "'ارتفاع ضغط الدم' هو المصطلح المعتمد في كافة مناهج كليات الطب العربية وتوصيات منظمة الصحة العالمية للجمهور العام. 'فرط التوتر الشرياني' للنصوص العلمية البحتة.",
    who_standard: "ICD-11: BA00 | ACC/AHA Guidelines 2017 | WHO HEARTS Package"
  },
  {
    english: "Contraindication",
    arabic: "موانع الاستعمال",
    preferred_es: "Contraindicación",
    alternate_ar: ["الحظر العلاجي", "المحاذير الدوائية"],
    rationale: "المصطلح المعتمد في نشرات الأدوية العربية (SFDA, EMA Arabic) هو 'موانع الاستعمال' — يُستخدم دائماً في صيغة الجمع.",
    who_standard: "WHO Model Formulary | SFDA Drug Database | Dorland's 33rd Ed."
  },
  {
    english: "Biopsy",
    arabic: "الخزعة",
    icd11_code: "QA20",
    preferred_es: "Biopsia",
    alternate_ar: ["عينة نسيجية"],
    rationale: "'الخزعة' المصطلح الأكاديمي العربي الراسخ المشتق من 'خزع' (قطع) — المعتمد في مناهج أمراض الأنسجة وعلم الأورام. 'عينة نسيجية' وصفية مقبولة لكن أقل دقة.",
    who_standard: "ICD-11: QA20 | MeSH D001707 | Dorland's 33rd Ed."
  },
  {
    english: "Anesthesia",
    arabic: "التخدير",
    preferred_es: "Anestesia",
    alternate_ar: ["التبنيج (قديم)"],
    rationale: "'التخدير' هو المصطلح الأكاديمي المعتمد في كليات الطب العربية والمراجع الحديثة. 'التبنيج' مصطلح قديم متروك.",
    who_standard: "MeSH D000758 | Harrison's 21st Ed. | WHO Arabic Health Terms",
    caution: "ميّز بين: التخدير العام (General) — التخدير الموضعي (Local) — التخدير الناحي/النصفي (Regional)."
  },
  {
    english: "Diagnosis",
    arabic: "التشخيص",
    icd11_code: "QA00",
    preferred_es: "Diagnóstico",
    alternate_ar: ["الاستنتاج الطبي"],
    rationale: "'التشخيص' مصطلح معتمد عالمياً في الطب العربي — مشتق من 'شخّص' بمعنى عرّف وحدد. يُستخدم في جميع السياقات الطبية دون استثناء.",
    who_standard: "ICD-11 Classification System | MeSH D003933 | WHO"
  }
];

