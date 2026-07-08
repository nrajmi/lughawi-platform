/**
 * Lughawi — Legal Dictionary & Controlled Glossary
 * English / Arabic / Spanish Legal Translation Pipeline
 *
 * References:
 * - Black's Law Dictionary (11th Ed.) — Bryan A. Garner
 * - UNTERM (United Nations Multilingual Terminology Database)
 * - ICC (International Chamber of Commerce) Arabic Legal Glossary
 * - Arab League Unified Legal Terminology
 * - Wael Hallaq — An Introduction to Islamic Law
 * - Oxford Dictionary of Law (9th Ed.)
 *
 * by nrajmi | Lughawi Platform 2026
 */

import { DictionaryEntry } from "./types";

export const LEGAL_DICT: DictionaryEntry[] = [
  {
    term: "jurisdiction",
    pos: "noun",
    domain: ["legal", "academic"],
    translations: { ar: "الاختصاص القضائي", en: "jurisdiction", es: "jurisdicción" },
    definitions: {
      ar: "السلطة الرسمية الممنوحة لجهة قضائية لاتخاذ القرارات والأحكام القانونية في نزاع محدد.",
      en: "The official power or authority granted to a legal body to hear and decide cases within a defined scope.",
      es: "El poder oficial o autoridad otorgada a un órgano legal para escuchar y decidir casos dentro de un ámbito definido."
    },
    nuances: {
      general: { ar: "المكان أو السلطة التي يُطبق فيها القانون.", en: "The place or authority where the law applies.", es: "El lugar o autoridad donde se aplica la ley." },
      academic: { ar: "نطاق السلطة القضائية والسيادة القانونية للدولة — يُميَّز بين الاختصاص الموضوعي والمكاني والشخصي.", en: "The scope of judicial authority and state sovereignty — distinguishing between subject-matter, territorial, and personal jurisdiction.", es: "El ámbito de autoridad judicial — distinguiendo jurisdicción por materia, territorial y personal." },
      technical: { ar: "الصلاحية القانونية الممنوحة للمحكمة للنظر في القضية وإصدار حكم ملزم.", en: "Legal authority granted to a court to hear a case and issue a binding judgment.", es: "Autoridad legal otorgada a un tribunal para escuchar un caso y emitir sentencia vinculante." },
      creative: { ar: "دائرة العدل التي ينبسط فيها ميزان الحق — خارجها لا حكم ولا رقابة.", en: "The circle of justice where the scales of right unfold — beyond it, there is no ruling, no oversight.", es: "El círculo de la justicia donde se despliegan las escalas del derecho." }
    }
  },
  {
    term: "plaintiff",
    pos: "noun",
    domain: ["legal"],
    translations: { ar: "المدّعي", en: "plaintiff", es: "demandante" },
    definitions: {
      ar: "الطرف الذي يُبادر برفع الدعوى القضائية أمام المحكمة مطالباً بحق أو تعويض أو إنصاف قضائي.",
      en: "The party who initiates a lawsuit in a court of law, seeking a right, remedy, or judicial relief against the defendant.",
      es: "La parte que inicia una demanda en un tribunal, buscando un derecho, remedio o alivio judicial contra el demandado."
    },
    nuances: {
      general: { ar: "الشخص الذي يرفع شكوى قضائية.", en: "The person who files a legal complaint.", es: "La persona que presenta una queja legal." },
      academic: { ar: "الطرف المُبتدر للإجراءات القضائية في الدعوى المدنية — مقابل المدّعى عليه (Defendant).", en: "The party initiating legal proceedings in a civil lawsuit — as opposed to the defendant.", es: "La parte que inicia el proceso legal en una demanda civil — en contraposición al demandado." },
      technical: { ar: "الطرف الأول في الدعوى المدنية الذي يتحمل عبء الإثبات (Burden of Proof) ابتداءً.", en: "The first party in a civil lawsuit who bears the initial burden of proof.", es: "La primera parte en una demanda civil que carga inicialmente con la prueba." },
      creative: { ar: "طالب الحق الذي يطرق أبواب العدالة بثقة ويقين.", en: "The seeker of right knocking on the doors of justice with confidence and conviction.", es: "El buscador de justicia llamando a las puertas de la justicia con confianza." }
    }
  },
  {
    term: "affidavit",
    pos: "noun",
    domain: ["legal"],
    translations: { ar: "إقرار خطي مشفوع بالقسم", en: "affidavit", es: "declaración jurada" },
    definitions: {
      ar: "تصريح مكتوب مؤكَّد بالقسم يُقدَّم أمام موظف مختص (كاتب العدل) ويُستخدم دليلاً في الإجراءات القانونية.",
      en: "A written statement made under oath before an authorized officer (notary public) and used as evidence in legal proceedings.",
      es: "Declaración escrita bajo juramento ante un funcionario autorizado (notario) y usada como evidencia en procedimientos legales."
    },
    nuances: {
      general: { ar: "وثيقة مكتوبة وموقعة بقسم رسمي.", en: "A written document signed under formal oath.", es: "Un documento escrito firmado bajo juramento formal." },
      academic: { ar: "شهادة موثقة رسمياً قابلة للقبول كبينة قانونية في غياب الشهادة الشفهية أو لتعزيزها.", en: "Formally notarized testimony admissible as legal evidence in lieu of or in addition to oral testimony.", es: "Testimonio formalmente notariado admisible como evidencia legal." },
      technical: { ar: "صك إقراري يُعتمد في غياب الشهادة الشفهية — يُلزم صاحبه قانونياً ويترتب على الكذب فيه عقوبة الحنث باليمين (Perjury).", en: "Declaratory instrument used in lieu of oral testimony — legally binding, with false statements constituting perjury.", es: "Instrumento declaratorio cuyas falsedades constituyen perjurio." },
      creative: { ar: "الكلمات الموثقة التي تنوب عن صاحبها في قاعة المحكمة حين يغيب.", en: "The certified words that stand in for their owner in the courtroom when they are absent.", es: "Las palabras certificadas que representan a su dueño en el tribunal cuando está ausente." }
    }
  },
  {
    term: "litigation",
    pos: "noun",
    domain: ["legal"],
    translations: { ar: "التقاضي", en: "litigation", es: "litigio" },
    definitions: {
      ar: "المسار الإجرائي القانوني لحل النزاعات عبر المحاكم بما يشمل رفع الدعوى والمرافعة وإصدار الحكم.",
      en: "The legal process of resolving disputes through courts, encompassing filing, pleading, trial, and judgment.",
      es: "El proceso legal de resolver disputas mediante los tribunales, abarcando presentación, alegatos, juicio y sentencia."
    },
    nuances: {
      general: { ar: "رفع دعوى قضائية وإجراءاتها أمام المحكمة.", en: "Filing and pursuing a lawsuit in court.", es: "Presentar y tramitar una demanda en el tribunal." },
      academic: { ar: "المسار الإجرائي الرسمي لتسوية المنازعات عبر السلطة القضائية — مقابل التحكيم (Arbitration) والوساطة (Mediation).", en: "Formal procedural pathway for dispute resolution via judicial authority — as opposed to arbitration and mediation.", es: "Vía procesal formal para resolución de disputas — en contraste con arbitraje y mediación." },
      technical: { ar: "إدارة ملف الدعوى من رفعها إلى التقاضي عبر الدرجات (ابتدائي، استئناف، تمييز) وتجهيز المرافعات والبينات.", en: "Managing the case file from filing through all judicial levels (trial, appeal, cassation) and preparing pleadings and evidence.", es: "Gestión del expediente desde la presentación hasta todos los niveles judiciales, preparando alegatos y evidencia." },
      creative: { ar: "ساحة المعركة القانونية حيث تتصادم الحجج وتُختبر الحقائق بنار الإجراء.", en: "The legal battlefield where arguments clash and truths are tested in the fire of procedure.", es: "El campo de batalla legal donde los argumentos chocan y las verdades se prueban." }
    }
  },
  {
    term: "subpoena",
    pos: "noun",
    domain: ["legal"],
    translations: { ar: "مذكرة الإحضار", en: "subpoena", es: "citación judicial" },
    definitions: {
      ar: "أمر قضائي رسمي يُلزم شخصاً بالمثول أمام المحكمة أو تقديم وثائق، ويترتب على مخالفته عقوبة ازدراء المحكمة.",
      en: "A formal judicial order requiring a person to appear before a court or produce documents, with non-compliance constituting contempt of court.",
      es: "Orden judicial formal que requiere a una persona comparecer ante el tribunal o producir documentos, con incumplimiento constituyendo desacato."
    },
    nuances: {
      general: { ar: "طلب رسمي للمثول أمام المحكمة.", en: "Official request to appear in court.", es: "Solicitud oficial para comparecer ante el tribunal." },
      academic: { ar: "أمر قضائي إلزامي للإدلاء بالشهادة أو تقديم الوثائق — يُميَّز بين استدعاء الشاهد (Subpoena ad testificandum) وطلب المستندات (Subpoena duces tecum).", en: "Mandatory judicial order to testify or produce documents — distinguishing between witness subpoena (ad testificandum) and document subpoena (duces tecum).", es: "Orden judicial para testificar (ad testificandum) o producir documentos (duces tecum)." },
      technical: { ar: "إعلان قانوني إلزامي يترتب على مخالفته الوقوع في ازدراء المحكمة (Contempt of Court) مما قد يُفضي لغرامة أو حبس.", en: "Binding legal summons whose violation results in contempt of court, potentially incurring fines or imprisonment.", es: "Citación legal vinculante cuya violación resulta en desacato al tribunal." },
      creative: { ar: "نداء العدالة الذي لا يُرد — صوت القانون حين يطلب شاهداً على الحق.", en: "The call of justice that cannot be refused — the voice of law when it summons a witness to truth.", es: "El llamado de la justicia que no puede rechazarse." }
    }
  },
  {
    term: "habeas corpus",
    pos: "noun",
    domain: ["legal", "academic"],
    translations: { ar: "مبدأ المثول أمام القضاء", en: "habeas corpus", es: "hábeas corpus" },
    definitions: {
      ar: "مبدأ قانوني أساسي يكفل حق الشخص المحتجز في المطالبة بمراجعة قانونية لصحة احتجازه أمام القضاء.",
      en: "A fundamental legal principle guaranteeing a detained person the right to judicial review of the lawfulness of their detention.",
      es: "Principio legal fundamental que garantiza el derecho de una persona detenida a revisión judicial de la legalidad de su detención."
    },
    nuances: {
      general: { ar: "حق المحتجز في محاكمة عادلة وسرعة مراجعة احتجازه قضائياً.", en: "The detained person's right to a fair hearing and prompt judicial review of their detention.", es: "El derecho del detenido a audiencia justa y revisión judicial rápida." },
      academic: { ar: "مبدأ دستوري لحرية الشخص — أصله في القانون الإنجليزي (Magna Carta 1215) وهو ضمانة ضد الاحتجاز التعسفي.", en: "Constitutional principle of personal liberty — originating in English law (Magna Carta 1215), a safeguard against arbitrary detention.", es: "Principio constitucional de libertad personal — originado en el derecho inglés (Magna Carta 1215)." },
      technical: { ar: "تُقدَّم العريضة (Petition for Writ of Habeas Corpus) أمام محكمة مختصة لتُلزم الجهة المحتجِزة ببيان مسوّغ الاحتجاز.", en: "A Petition for Writ of Habeas Corpus is filed before a competent court to compel the detaining authority to justify the detention.", es: "La Petición de Habeas Corpus se presenta ante tribunal competente para obligar justificar la detención." },
      creative: { ar: "الدرع القانوني الأقدم ضد ظلم السجن دون حق — حماية جسد الحر من قبضة الطغيان.", en: "The oldest legal shield against unjust imprisonment — protecting the free person's body from the grip of tyranny.", es: "El escudo legal más antiguo contra el encarcelamiento injusto." }
    }
  },
  {
    term: "due process",
    pos: "noun",
    domain: ["legal", "academic"],
    translations: { ar: "ضمانات المحاكمة العادلة", en: "due process", es: "debido proceso" },
    definitions: {
      ar: "الحق الدستوري الذي يكفل للأفراد معاملتهم وفق الإجراءات القانونية المعمول بها قبل الحرمان من الحرية أو الحقوق.",
      en: "The constitutional right ensuring individuals are treated according to established legal procedures before being deprived of life, liberty, or property.",
      es: "El derecho constitucional que garantiza que las personas sean tratadas según procedimientos legales establecidos antes de ser privadas de vida, libertad o propiedad."
    },
    nuances: {
      general: { ar: "حق المتهم في محاكمة عادلة وفق إجراءات قانونية سليمة.", en: "The accused's right to a fair trial following proper legal procedures.", es: "El derecho del acusado a juicio justo siguiendo procedimientos legales adecuados." },
      academic: { ar: "يُميَّز بين الإجراءات الشكلية (Procedural Due Process) وضمانات الموضوع (Substantive Due Process) في القانون الدستوري الأمريكي.", en: "Distinguished between procedural due process (procedural fairness) and substantive due process (protection of fundamental rights) in U.S. constitutional law.", es: "Distinguido entre debido proceso procesal (equidad procesal) y sustantivo (protección de derechos fundamentales)." },
      technical: { ar: "يستلزم: الإخطار الكافي (Notice)، وفرصة الدفاع (Opportunity to be Heard)، وقاضٍ محايد (Impartial Tribunal).", en: "Requires: adequate notice, opportunity to be heard, and an impartial tribunal.", es: "Requiere: notificación adecuada, oportunidad de ser escuchado y tribunal imparcial." },
      creative: { ar: "الطريق المضيء نحو العدل — شرط الإنصاف قبل أن يُسلب حق أو تُقيَّد حرية.", en: "The illuminated path toward justice — the requirement of fairness before any right is taken or freedom constrained.", es: "El camino iluminado hacia la justicia — el requisito de equidad antes de privar de derechos o libertad." }
    }
  },
  {
    term: "tort",
    pos: "noun",
    domain: ["legal", "academic"],
    translations: { ar: "الفعل الضار", en: "tort", es: "agravio / responsabilidad civil" },
    definitions: {
      ar: "فعل أو إهمال غير مشروع يسبب ضرراً للآخرين ويُتيح للمتضرر المطالبة بتعويض مدني.",
      en: "A wrongful act or omission, other than breach of contract, that causes harm to another and gives rise to a civil claim for damages.",
      es: "Un acto u omisión ilícita, distinto del incumplimiento de contrato, que causa daño y da lugar a reclamación civil de indemnización."
    },
    nuances: {
      general: { ar: "تصرف خاطئ يسبب ضرراً لشخص آخر ويستوجب التعويض.", en: "A wrongful act causing harm to someone else, requiring compensation.", es: "Un acto ilícito que causa daño a otra persona y requiere compensación." },
      academic: { ar: "فرع مستقل من القانون المدني يتناول المسؤولية التقصيرية — يختلف عن المسؤولية التعاقدية (Contract) والجنائية (Criminal).", en: "Independent branch of civil law dealing with tortious liability — distinct from contractual and criminal liability.", es: "Rama independiente del derecho civil que trata la responsabilidad extracontractual." },
      technical: { ar: "يستلزم إثبات أربعة عناصر: الواجب (Duty)، الإخلال به (Breach)، السببية (Causation)، الضرر (Damages).", en: "Requires proving four elements: duty, breach, causation, and damages.", es: "Requiere probar cuatro elementos: deber, incumplimiento, causalidad y daños." },
      creative: { ar: "الجرح غير المقصود أو المقصود الذي يتركه الإنسان في حق غيره — القانون يلتقطه ويُنصف المتضرر.", en: "The unintentional or intentional wound left on another's rights — the law catches it and makes the injured whole.", es: "La herida dejada en los derechos de otro — la ley la capta y repara al perjudicado." }
    }
  }
];

// ══════════════════════════════════════════════════════════
// LEGAL GLOSSARY — Strict Controlled Entries
// Based on Black's Law Dictionary / UNTERM / ICC Glossary
// ══════════════════════════════════════════════════════════

export interface LegalGlossaryEntry {
  english: string;
  arabic: string;
  preferred_es: string;
  alternate_ar: string[];
  rationale: string;
  legal_source: string;
  caution?: string;
}

export const LEGAL_GLOSSARY: LegalGlossaryEntry[] = [
  {
    english: "Jurisdiction",
    arabic: "الاختصاص القضائي",
    preferred_es: "Jurisdicción",
    alternate_ar: ["الولاية القضائية", "النطاق القانوني"],
    rationale: "'الاختصاص القضائي' هو المصطلح المعتمد في التشريعات العربية والمراجع القانونية الدولية. 'الولاية' مقبولة في السياق الفقهي الإسلامي ولكن أقل دقة في القانون الوضعي.",
    legal_source: "Black's Law Dictionary 11th Ed. | UNTERM | ICC Arabic Glossary"
  },
  {
    english: "Due Process",
    arabic: "ضمانات المحاكمة العادلة",
    preferred_es: "Debido Proceso",
    alternate_ar: ["الإجراءات القانونية الواجبة", "أصول المحاكمات"],
    rationale: "'ضمانات المحاكمة العادلة' تعكس المعنى الدستوري الكامل لـ Due Process بشقيه الإجرائي والموضوعي — وهي الترجمة المعتمدة في الترجمات الرسمية للاتفاقيات الدولية.",
    legal_source: "ICCPR (International Covenant on Civil and Political Rights) — Arabic | UNTERM",
    caution: "لا تُترجم بـ 'الإجراءات المناسبة' فقط — المصطلح أشمل ويتضمن الحقوق الجوهرية."
  },
  {
    english: "Tort",
    arabic: "الفعل الضار",
    preferred_es: "Agravio / Responsabilidad Civil Extracontractual",
    alternate_ar: ["المسؤولية التقصيرية", "الضرر المدني"],
    rationale: "'الفعل الضار' أو 'المسؤولية التقصيرية' — كلاهما مقبول في الفقه القانوني العربي. 'التقصيري' يُبرز عنصر الإهمال أو التقصير في الفعل الضار.",
    legal_source: "Black's Law Dictionary 11th Ed. | Arab League Legal Terminology"
  },
  {
    english: "Habeas Corpus",
    arabic: "مبدأ المثول أمام القضاء",
    preferred_es: "Hábeas Corpus",
    alternate_ar: ["أمر الإحضار", "ضمانة الحرية الشخصية"],
    rationale: "يُحتفظ بالمصطلح اللاتيني في السياقات الأكاديمية عادةً، ويُرفق بترجمته 'مبدأ المثول أمام القضاء' أو 'ضمانة الحرية الشخصية'.",
    legal_source: "UNTERM | Oxford Dictionary of Law 9th Ed. | ICCPR",
    caution: "Habeas Corpus مصطلح لاتيني لا يُترجم في النصوص الأكاديمية — يُشرح ولا يُستبدل."
  },
  {
    english: "Affidavit",
    arabic: "الإقرار الخطي المشفوع بالقسم",
    preferred_es: "Declaración Jurada",
    alternate_ar: ["التصريح المكتوب تحت القسم", "الإفادة الخطية"],
    rationale: "المصطلح الموسّع 'الإقرار الخطي المشفوع بالقسم' أدق من 'إفادة خطية' لأنه يُبرز عنصري الكتابة والقسم الرسمي المميزَين للـ Affidavit.",
    legal_source: "Black's Law Dictionary 11th Ed. | ICC Arabic Legal Glossary"
  },
  {
    english: "Litigation",
    arabic: "التقاضي",
    preferred_es: "Litigio",
    alternate_ar: ["المنازعات القضائية", "الدعوى القضائية"],
    rationale: "'التقاضي' المصطلح الأدق لأنه يشمل كامل العملية الإجرائية (من رفع الدعوى إلى صدور الحكم) وليس مجرد 'الدعوى' التي تصف فعلاً واحداً.",
    legal_source: "Arab League Unified Legal Terminology | Black's Law Dictionary"
  }
];

