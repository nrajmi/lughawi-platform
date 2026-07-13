//#region node_modules/.nitro/vite/services/ssr/assets/dictionary-DBUIZZWv.js
/**
* Lughawi Security and Hardening Module
* Implements Input Sanitization (XSS mitigation) and Secure Storage (AES-GCM Encryption)
* designed in accordance with OWASP Top 10 guidelines.
*/
function sanitizeInput(text) {
	if (!text) return "";
	let cleaned = text;
	cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
	cleaned = cleaned.replace(/javascript\s*:/gi, "disabled-javascript:");
	cleaned = cleaned.replace(/data\s*:\s*text\/html/gi, "disabled-html-data:");
	cleaned = cleaned.replace(/\bon\w+\s*=/gi, (match) => `disabled-${match}`);
	return cleaned;
}
var KEY_NAME = "lughawi.sec.k1";
/**
* Retrieves the existing encryption key or generates a new cryptographically secure one.
*/
async function getOrCreateKey() {
	if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) throw new Error("Cryptography API is not supported in this environment");
	const storedKeyHex = localStorage.getItem(KEY_NAME);
	if (storedKeyHex) try {
		const rawKey = new Uint8Array(storedKeyHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
		return await window.crypto.subtle.importKey("raw", rawKey, {
			name: "AES-GCM",
			length: 256
		}, true, ["encrypt", "decrypt"]);
	} catch (e) {
		console.error("Failed to import security key, generating new fallback", e);
	}
	const key = await window.crypto.subtle.generateKey({
		name: "AES-GCM",
		length: 256
	}, true, ["encrypt", "decrypt"]);
	const exported = await window.crypto.subtle.exportKey("raw", key);
	const hex = Array.from(new Uint8Array(exported)).map((b) => b.toString(16).padStart(2, "0")).join("");
	localStorage.setItem(KEY_NAME, hex);
	return key;
}
/**
* Encrypts data using AES-GCM and returns a base64 encoded string containing the IV and Ciphertext.
*/
async function encryptData(data) {
	try {
		const key = await getOrCreateKey();
		const iv = window.crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(12));
		const encoded = new TextEncoder().encode(data);
		const ciphertext = await window.crypto.subtle.encrypt({
			name: "AES-GCM",
			iv
		}, key, encoded);
		const combined = new Uint8Array(iv.length + ciphertext.byteLength);
		combined.set(iv, 0);
		combined.set(new Uint8Array(ciphertext), iv.length);
		return btoa(String.fromCharCode(...combined));
	} catch (e) {
		console.error("AES Encryption failure:", e);
		throw new Error("فشلت عملية تشفير البيانات لحمايتها.");
	}
}
/**
* Decrypts a base64 encoded AES-GCM string.
*/
async function decryptData(encryptedBase64) {
	try {
		const key = await getOrCreateKey();
		const binaryString = atob(encryptedBase64);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
		const iv = bytes.slice(0, 12);
		const ciphertext = bytes.slice(12);
		const decrypted = await window.crypto.subtle.decrypt({
			name: "AES-GCM",
			iv
		}, key, ciphertext);
		return new TextDecoder().decode(decrypted);
	} catch (e) {
		console.error("AES Decryption failure (potential tampering or bad key):", e);
		throw new Error("تعذرت قراءة البيانات المشفرة أو تم التلاعب بها.");
	}
}
var LINGUISTICS_DICT = [
	{
		term: "universal grammar",
		pos: "noun phrase",
		domain: ["linguistics", "academic"],
		translations: {
			ar: "النحو الكلي",
			en: "universal grammar",
			es: "gramática universal"
		},
		definitions: {
			ar: "نظرية لغوية تفترض وجود قواعد فطرية مشتركة بين جميع اللغات البشرية.",
			en: "A linguistic theory arguing that the ability to learn grammar is hard-wired into the brain.",
			es: "Teoría lingüística que postula que la capacidad de aprender gramática es innata."
		},
		nuances: {
			general: {
				ar: "القواعد الأساسية لكل اللغات.",
				en: "The basic rules of all languages.",
				es: "Reglas básicas de todos los idiomas."
			},
			academic: {
				ar: "نموذج تشومسكي التوليدي الفطري لتفسير اكتساب اللغة.",
				en: "Chomskyan generative innate model explaining language acquisition.",
				es: "Modelo generativo innato chomskyano."
			},
			technical: {
				ar: "البارامترات والمبادئ (P&P) الحاكمة للغات.",
				en: "Principles and Parameters (P&P) governing human languages.",
				es: "Principios y parámetros (P&P) que rigen."
			},
			creative: {
				ar: "البذرة الفطرية التي نبتت منها شجرة اللغات البشرية.",
				en: "The innate seed from which the tree of human languages grew.",
				es: "La semilla innata de los idiomas."
			}
		}
	},
	{
		term: "syntax",
		pos: "noun",
		domain: [
			"linguistics",
			"tech",
			"academic"
		],
		translations: {
			ar: "علم النحو",
			en: "syntax",
			es: "sintaxis"
		},
		definitions: {
			ar: "دراسة القواعد التي تتحكم في بنية الجملة وترتيب الكلمات.",
			en: "The arrangement of words and phrases to create well-formed sentences in a language.",
			es: "La disposición de palabras y frases para crear oraciones bien formadas en un idioma."
		},
		nuances: {
			general: {
				ar: "ترتيب الكلمات في الجملة.",
				en: "Word order in a sentence.",
				es: "Orden de las palabras."
			},
			academic: {
				ar: "التحليل البنيوي لتسلسل المكونات الجملية وتفرعاتها (Tree structure).",
				en: "Structural analysis of constituent sequences and tree hierarchies.",
				es: "Análisis estructural de secuencias constituyentes."
			},
			technical: {
				ar: "قواعد بناء الجملة البرمجية (Code Syntax).",
				en: "Rules governing the structure of programming language statements.",
				es: "Reglas que rigen la estructura de sentencias de código."
			},
			creative: {
				ar: "الهندسة الخفية التي تبني جسور المعنى بين الكلمات المتناثرة.",
				en: "The hidden architecture building bridges of meaning between scattered words.",
				es: "La arquitectura oculta que construye puentes de significado."
			}
		}
	},
	{
		term: "morphology",
		pos: "noun",
		domain: ["linguistics", "academic"],
		translations: {
			ar: "علم الصرف",
			en: "morphology",
			es: "morfología"
		},
		definitions: {
			ar: "دراسة البنية الداخلية للكلمات وكيفية تكوينها.",
			en: "The study of the internal structure of words and their formation.",
			es: "El estudio de la estructura interna de las palabras y su formación."
		},
		nuances: {
			general: {
				ar: "كيفية تركيب الكلمات.",
				en: "How words are put together.",
				es: "Cómo se arman las palabras."
			},
			academic: {
				ar: "تحليل المورفيمات (Morphemes) الحرة والمقيدة في بناء المفردة.",
				en: "Analysis of free and bound morphemes in word formation.",
				es: "Análisis de morfemas libres y ligados."
			},
			technical: {
				ar: "تحليل البنية الصرفية في معالجة اللغات الطبيعية (NLP Stemming).",
				en: "Morphological analysis in NLP (stemming/lemmatization).",
				es: "Análisis morfológico en PNL."
			},
			creative: {
				ar: "فن النحت اللغوي، حيث تُشكل الحروف قوالب معانٍ جديدة.",
				en: "The art of linguistic sculpting, where letters shape new molds of meaning.",
				es: "El arte de la escultura lingüística."
			}
		}
	},
	{
		term: "semantics",
		pos: "noun",
		domain: [
			"linguistics",
			"tech",
			"academic"
		],
		translations: {
			ar: "علم الدلالة",
			en: "semantics",
			es: "semántica"
		},
		definitions: {
			ar: "فرع من اللغويات يدرس المعنى في اللغة.",
			en: "The branch of linguistics and logic concerned with meaning.",
			es: "La rama de la lingüística y la lógica que se ocupa del significado."
		},
		nuances: {
			general: {
				ar: "دراسة معاني الكلمات.",
				en: "Study of word meanings.",
				es: "Estudio del significado."
			},
			academic: {
				ar: "دراسة العلاقات الدلالية بين الدوال والمدلولات.",
				en: "Study of semantic relationships between signifiers and signifieds.",
				es: "Estudio de relaciones semánticas."
			},
			technical: {
				ar: "القواعد التي تحدد معنى البيانات بعيداً عن بنيتها النحوية.",
				en: "Rules determining the meaning of data, distinct from its syntax.",
				es: "Reglas que determinan el significado de los datos."
			},
			creative: {
				ar: "البحث في روح الكلمة خلف قناع الحروف.",
				en: "Searching the soul of the word behind the mask of letters.",
				es: "Buscar el alma de la palabra."
			}
		}
	},
	{
		term: "pragmatics",
		pos: "noun",
		domain: ["linguistics", "academic"],
		translations: {
			ar: "علم التداولية",
			en: "pragmatics",
			es: "pragmática"
		},
		definitions: {
			ar: "دراسة كيفية تأثير السياق على المعنى اللغوي.",
			en: "The branch of linguistics dealing with language in use and context.",
			es: "Rama de la lingüística que trata del uso del lenguaje en contexto."
		},
		nuances: {
			general: {
				ar: "فهم المعنى من السياق.",
				en: "Understanding meaning from context.",
				es: "Comprender el significado del contexto."
			},
			academic: {
				ar: "تحليل أفعال الكلام (Speech acts) والاستلزام الحواري.",
				en: "Analysis of speech acts and conversational implicature.",
				es: "Análisis de actos de habla."
			},
			technical: {
				ar: "استنتاج النوايا الضمنية في واجهات المحادثة (Intent parsing).",
				en: "Inferring implicit intents in conversational AI.",
				es: "Inferir intenciones implícitas en IA."
			},
			creative: {
				ar: "فن قراءة ما بين السطور.",
				en: "The art of reading between the lines.",
				es: "El arte de leer entre líneas."
			}
		}
	},
	{
		term: "discourse analysis",
		pos: "noun phrase",
		domain: ["linguistics", "academic"],
		translations: {
			ar: "تحليل الخطاب",
			en: "discourse analysis",
			es: "análisis del discurso"
		},
		definitions: {
			ar: "منهج لدراسة اللغة في استخدامها الفعلي عبر النصوص الطويلة.",
			en: "An approach to studying language in actual use across extended texts.",
			es: "Un enfoque para estudiar el lenguaje en uso real a través de textos extensos."
		},
		nuances: {
			general: {
				ar: "دراسة النصوص الطويلة والمحادثات.",
				en: "Studying long texts and conversations.",
				es: "Estudiar textos largos y conversaciones."
			},
			academic: {
				ar: "الفحص النقدي للسلطة والأيديولوجيا المتضمنة في الهياكل النصية.",
				en: "Critical examination of power and ideology embedded in textual structures.",
				es: "Examen crítico de poder e ideología."
			},
			technical: {
				ar: "معالجة التماسك النصي وحل المراجع الضميرية آلياً.",
				en: "Automated coreference resolution and textual cohesion parsing.",
				es: "Resolución de correferencia y análisis de cohesión."
			},
			creative: {
				ar: "تفكيك نسيج الكلمات لكشف الأرواح التي نسجتها.",
				en: "Unraveling the fabric of words to reveal the souls that wove it.",
				es: "Desentrañar el tejido de las palabras."
			}
		}
	},
	{
		term: "phonology",
		pos: "noun",
		domain: ["linguistics", "academic"],
		translations: {
			ar: "علم الأصوات الوظيفي",
			en: "phonology",
			es: "fonología"
		},
		definitions: {
			ar: "دراسة النظام الصوتي والوظائف الصوتية في اللغة.",
			en: "The system of contrastive relationships among the speech sounds that constitute the fundamental components of a language.",
			es: "El sistema de relaciones contrastivas entre los sonidos del habla."
		},
		nuances: {
			general: {
				ar: "كيف تعمل الأصوات في لغة ما.",
				en: "How sounds work in a specific language.",
				es: "Cómo funcionan los sonidos en un idioma."
			},
			academic: {
				ar: "التنظيم المعرفي والتجريدي للأنظمة الصوتية (الفونيمات).",
				en: "The cognitive and abstract organization of sound systems (phonemes).",
				es: "La organización cognitiva y abstracta de los sistemas de sonido."
			},
			technical: {
				ar: "نمذجة النطق في أنظمة تحويل النص إلى كلام (TTS).",
				en: "Pronunciation modeling in Text-to-Speech (TTS) systems.",
				es: "Modelado de pronunciación en sistemas TTS."
			},
			creative: {
				ar: "الموسيقى الخفية التي تنظم إيقاع لغتنا اليومية.",
				en: "The hidden music organizing the rhythm of our daily speech.",
				es: "La música oculta que organiza el ritmo del habla."
			}
		}
	},
	{
		term: "idiom",
		pos: "noun",
		domain: ["linguistics", "general"],
		translations: {
			ar: "تعبير اصطلاحي",
			en: "idiom",
			es: "modismo"
		},
		definitions: {
			ar: "مجموعة كلمات مجتمعة تعطي معنى لا يمكن استنتاجه من معاني كلماتها الفردية.",
			en: "A group of words established by usage as having a meaning not deducible from those of the individual words.",
			es: "Grupo de palabras con un significado que no se puede deducir de las palabras individuales."
		},
		nuances: {
			general: {
				ar: "مثل شعبي أو تعبير مجازي.",
				en: "A common saying or figurative expression.",
				es: "Un dicho común o expresión figurada."
			},
			academic: {
				ar: "وحدة معجمية مركبة تتميز بالتحجر الدلالي (Semantic opacity).",
				en: "A complex lexical unit characterized by semantic opacity.",
				es: "Una unidad léxica compleja caracterizada por la opacidad semántica."
			},
			technical: {
				ar: "عبارات تتطلب معالجة استثنائية في محركات الترجمة الآلية.",
				en: "Phrases requiring exception handling in MT engines.",
				es: "Frases que requieren manejo de excepciones en MT."
			},
			creative: {
				ar: "سر لغوي متوارث، يعكس روح ثقافة شعب بأكمله في كلمات معدودة.",
				en: "An inherited linguistic secret, reflecting a culture's soul in a few words.",
				es: "Un secreto lingüístico heredado."
			}
		}
	},
	{
		term: "lexicon",
		pos: "noun",
		domain: [
			"linguistics",
			"tech",
			"academic"
		],
		translations: {
			ar: "المعجم",
			en: "lexicon",
			es: "léxico"
		},
		definitions: {
			ar: "مفردات شخص ما، أو لغة معينة، أو فرع من المعرفة.",
			en: "The vocabulary of a person, language, or branch of knowledge.",
			es: "El vocabulario de una persona, idioma o rama del conocimiento."
		},
		nuances: {
			general: {
				ar: "مجموعة الكلمات التي يعرفها الشخص.",
				en: "The set of words someone knows.",
				es: "El conjunto de palabras que alguien conoce."
			},
			academic: {
				ar: "المخزون الذهني للمفردات الذي يعكس الخصائص الصرفية والدلالية للمتحدث.",
				en: "The mental repository of vocabulary reflecting morphological and semantic traits.",
				es: "El repositorio mental de vocabulario."
			},
			technical: {
				ar: "قاعدة بيانات الكلمات والكيانات المسماة (Named Entities) المستخدمة في نماذج الذكاء الاصطناعي.",
				en: "A database of words and named entities used in AI models.",
				es: "Una base de datos de palabras y entidades."
			},
			creative: {
				ar: "خزانة كنوز العقل، حيث ترقد الكلمات بانتظار من يوقظها لتصنع المعجزات.",
				en: "The mind's treasure chest, where words await to awaken and create miracles.",
				es: "El cofre del tesoro de la mente."
			}
		}
	}
];
var TECH_DICT = [
	{
		term: "algorithm",
		pos: "noun",
		domain: ["tech", "academic"],
		translations: {
			ar: "خوارزمية",
			en: "algorithm",
			es: "algoritmo"
		},
		definitions: {
			ar: "سلسلة من الخطوات الرياضية والمنطقية المحددة لحل مشكلة ما.",
			en: "A set of rules to be followed in calculations or problem-solving.",
			es: "Un conjunto de reglas a seguir en cálculos o resolución de problemas."
		},
		nuances: {
			general: {
				ar: "طريقة مرتبة لحل مشكلة.",
				en: "An ordered way to solve a problem.",
				es: "Forma ordenada de resolver un problema."
			},
			academic: {
				ar: "نموذج رياضي مجرد يخضع لتحليل التعقيد الزمني.",
				en: "An abstract mathematical model subjected to time complexity analysis.",
				es: "Modelo matemático abstracto."
			},
			technical: {
				ar: "شفرة برمجية تنفيذية تطبق هياكل البيانات الفعالة.",
				en: "Executable code implementing efficient data structures.",
				es: "Código ejecutable que implementa estructuras."
			},
			creative: {
				ar: "رقصة منطقية متناغمة تنظم فوضى البيانات.",
				en: "A harmonious logical dance organizing data chaos.",
				es: "Danza lógica armoniosa."
			}
		}
	},
	{
		term: "cache",
		pos: "noun",
		domain: ["tech"],
		translations: {
			ar: "ذاكرة التخزين المؤقت",
			en: "cache",
			es: "caché"
		},
		definitions: {
			ar: "مكون أجهزة أو برامج يخزن البيانات بحيث يمكن تلبية الطلبات المستقبلية لتلك البيانات بشكل أسرع.",
			en: "A hardware or software component that stores data so that future requests for that data can be served faster.",
			es: "Un componente de hardware o software que almacena datos para que las solicitudes futuras de esos datos se puedan atender más rápido."
		},
		nuances: {
			general: {
				ar: "مكان لتخزين الأشياء للوصول السريع.",
				en: "A place to store things for quick access.",
				es: "Un lugar para guardar cosas para un acceso rápido."
			},
			academic: {
				ar: "آلية لتقليل أوقات الوصول للبيانات في المعماريات الحاسوبية.",
				en: "Mechanism to reduce data access times in computer architectures.",
				es: "Mecanismo para reducir los tiempos de acceso a los datos."
			},
			technical: {
				ar: "طبقة تخزين عالية السرعة للبيانات المتكررة الوصول.",
				en: "High-speed storage layer for frequently accessed data.",
				es: "Capa de almacenamiento de alta velocidad."
			},
			creative: {
				ar: "الذاكرة السريعة التي تحتفظ بالذكريات القريبة لتستدعيها بلمح البصر.",
				en: "The swift memory that keeps recent memories to recall in the blink of an eye.",
				es: "La memoria rápida que guarda recuerdos recientes."
			}
		}
	},
	{
		term: "deployment",
		pos: "noun",
		domain: ["tech"],
		translations: {
			ar: "نشر",
			en: "deployment",
			es: "despliegue"
		},
		definitions: {
			ar: "عملية جعل النظام البرمجي متاحًا للاستخدام.",
			en: "The action of bringing resources into effective action; putting software into a live environment.",
			es: "La acción de poner los recursos en acción efectiva; poner el software en un entorno en vivo."
		},
		nuances: {
			general: {
				ar: "تجهيز شيء للاستخدام.",
				en: "Making something ready for use.",
				es: "Preparar algo para su uso."
			},
			academic: {
				ar: "المرحلة النهائية في دورة حياة تطوير البرمجيات.",
				en: "The final phase in the software development life cycle.",
				es: "La fase final del ciclo de vida del desarrollo de software."
			},
			technical: {
				ar: "دفع التعليمات البرمجية وتكوين البنية التحتية لبيئة الإنتاج.",
				en: "Pushing code and configuring infrastructure for production.",
				es: "Impulsar código y configurar la infraestructura."
			},
			creative: {
				ar: "إطلاق السفينة البرمجية نحو محيط المستخدمين.",
				en: "Launching the software ship into the ocean of users.",
				es: "Lanzar el barco de software al océano de usuarios."
			}
		}
	},
	{
		term: "latency",
		pos: "noun",
		domain: ["tech", "academic"],
		translations: {
			ar: "كمون",
			en: "latency",
			es: "latencia"
		},
		definitions: {
			ar: "التأخير الزمني بين سبب وتأثير لتغير مادي ما في النظام الملاحظ.",
			en: "The delay before a transfer of data begins following an instruction for its transfer.",
			es: "El tiempo que tarda en transmitirse un paquete dentro de la red."
		},
		nuances: {
			general: {
				ar: "تأخير بسيط قبل حدوث استجابة.",
				en: "A slight delay before a response.",
				es: "Un ligero retraso antes de una respuesta."
			},
			academic: {
				ar: "قياس الفاصل الزمني لانتقال الإشارة بين العقد الشبكية.",
				en: "Measurement of the time interval for signal transmission between network nodes.",
				es: "Medida del intervalo de tiempo."
			},
			technical: {
				ar: "الزمن المستغرق لعودة حزمة البيانات في الشبكات.",
				en: "Round-trip time for a data packet in networks.",
				es: "Tiempo de ida y vuelta para un paquete de datos."
			},
			creative: {
				ar: "الصمت القصير بين صدى النداء والاستجابة.",
				en: "The brief silence between the echo of a call and the response.",
				es: "El breve silencio entre el eco de una llamada."
			}
		}
	},
	{
		term: "repository",
		pos: "noun",
		domain: ["tech"],
		translations: {
			ar: "مستودع",
			en: "repository",
			es: "repositorio"
		},
		definitions: {
			ar: "مكان أو وعاء توضع فيه الأشياء لتخزينها أو العثور عليها بأمان.",
			en: "A central location in which data is stored and managed.",
			es: "Un lugar central donde se almacenan y gestionan los datos."
		},
		nuances: {
			general: {
				ar: "مكان لتخزين وحفظ الأشياء.",
				en: "A place to store and keep things.",
				es: "Un lugar para guardar y mantener cosas."
			},
			academic: {
				ar: "قاعدة أرشيفية مركزية لإدارة الإصدارات والمصادر.",
				en: "Central archival database for version and resource management.",
				es: "Base de datos de archivo central."
			},
			technical: {
				ar: "بيئة استضافة الكود المصدري كـ Git.",
				en: "Source code hosting environment like Git.",
				es: "Entorno de alojamiento de código fuente."
			},
			creative: {
				ar: "خزانة الأسرار البرمجية التي تحفظ تاريخ إبداعاتنا.",
				en: "The cabinet of software secrets preserving the history of our creations.",
				es: "El gabinete de secretos de software."
			}
		}
	}
];
var TECH_GLOSSARY = [
	{
		english: "Generative AI",
		arabic: "الذكاء الاصطناعي التوليدي",
		preferred_es: "IA Generativa",
		alternate_ar: ["الذكاء التوليدي"],
		rationale: "ترجمة دقيقة تعكس قدرة النماذج على 'توليد' محتوى جديد (نصوص، صور، أكواد) بناءً على الأنماط المتعلمة، وتُفضل على الترجمات الحرفية.",
		industry_standard: "IEEE / ACM / ISO/IEC JTC 1/SC 42"
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
		industry_standard: "NIST / AWS Arabic Glossary"
	},
	{
		english: "Cyber Security",
		arabic: "الأمن السيبراني",
		preferred_es: "Ciberseguridad",
		alternate_ar: ["أمن المعلومات", "الأمن الإلكتروني"],
		rationale: "استخدام 'السيبراني' أصبح المعيار الرسمي في المؤسسات الحكومية والأكاديمية العربية للإشارة إلى حماية الأنظمة والشبكات، وهو أشمل من مجرد أمن المعلومات.",
		industry_standard: "NCA (National Cybersecurity Authority) / ITU"
	},
	{
		english: "RAM Optimization",
		arabic: "تحسين استهلاك الذاكرة",
		preferred_es: "Optimización de RAM",
		alternate_ar: ["تحسين أداء الذاكرة العشوائية", "ترشيد استهلاك الرام"],
		rationale: "ترجمة المعنى السياقي لـ Optimization بـ 'تحسين استهلاك' أو 'رفع كفاءة' أدق من الترجمة الحرفية 'تحسين الرام'.",
		industry_standard: "CompTIA / CISCO Arabic Resources"
	},
	{
		english: "Machine Learning",
		arabic: "تعلم الآلة",
		preferred_es: "Aprendizaje Automático",
		alternate_ar: ["التعلم الآلي"],
		rationale: "الترجمة الأكاديمية القياسية لمجال تدريب الخوارزميات للتعلم من البيانات دون برمجة صريحة.",
		industry_standard: "Stanford CS Arabic / Google Developers"
	},
	{
		english: "Deep Learning",
		arabic: "التعلم العميق",
		preferred_es: "Aprendizaje Profundo",
		alternate_ar: [],
		rationale: "المصطلح المستقر عربياً للدلالة على الشبكات العصبية ذات الطبقات المتعددة (Deep Neural Networks).",
		industry_standard: "DeepLearning.AI Arabic"
	}
];
var MEDICAL_DICT = [
	{
		term: "diagnosis",
		pos: "noun",
		domain: ["medical", "academic"],
		translations: {
			ar: "تشخيص",
			en: "diagnosis",
			es: "diagnóstico"
		},
		definitions: {
			ar: "التعرف على طبيعة المرض أو الحالة من خلال الأعراض والفحوصات السريرية والمخبرية.",
			en: "The identification of the nature of an illness by examination of the symptoms, clinical signs, and laboratory findings.",
			es: "La identificación de la naturaleza de una enfermedad mediante el examen de síntomas, signos clínicos y hallazgos de laboratorio."
		},
		nuances: {
			general: {
				ar: "معرفة ما هو المرض من أعراضه.",
				en: "Finding out what the illness is from its symptoms.",
				es: "Averiguar cuál es la enfermedad por sus síntomas."
			},
			academic: {
				ar: "التقييم السريري الشامل لتحديد الحالة المرضية وفق المعايير التشخيصية المعتمدة (ICD-11).",
				en: "Comprehensive clinical evaluation to accurately identify the pathological state according to ICD-11 criteria.",
				es: "Evaluación clínica integral según criterios diagnósticos ICD-11."
			},
			technical: {
				ar: "تحليل نتائج الاختبارات المعملية والصور الطبية وفق مسار التشخيص التفريقي (Differential Diagnosis).",
				en: "Analysis of lab tests and medical imaging following a differential diagnosis pathway.",
				es: "Análisis de pruebas de laboratorio e imágenes médicas siguiendo diagnóstico diferencial."
			},
			creative: {
				ar: "فك طلاسم جسد المريض وقراءة رسائله الخفية بعين العلم.",
				en: "Deciphering the patient's body and reading its hidden messages with the eye of science.",
				es: "Descifrar el cuerpo del paciente y leer sus mensajes ocultos."
			}
		}
	},
	{
		term: "prognosis",
		pos: "noun",
		domain: ["medical", "academic"],
		translations: {
			ar: "الإنذار المرضي",
			en: "prognosis",
			es: "pronóstico"
		},
		definitions: {
			ar: "التقدير الطبي لاحتمال مسار المرض ومآله — سواء بالشفاء أو تطور المضاعفات أو الوفاة.",
			en: "The likely course and outcome of a disease, including the probability of recovery, complications, or death.",
			es: "El curso probable y resultado de una enfermedad, incluyendo la probabilidad de recuperación, complicaciones o muerte."
		},
		nuances: {
			general: {
				ar: "ما الذي سيحدث للمريض بناءً على حالته الراهنة.",
				en: "What will happen to the patient based on their current condition.",
				es: "Qué le pasará al paciente según su estado actual."
			},
			academic: {
				ar: "التنبؤ العلمي المبني على معطيات إحصائية سريرية بمسار المرض ومآله الطبي.",
				en: "Scientific prediction based on clinical statistical data regarding the course and medical outcome of a disease.",
				es: "Predicción científica basada en datos estadísticos clínicos sobre el curso de la enfermedad."
			},
			technical: {
				ar: "تقدير معدل البقاء (Survival Rate) والتوقعات السريرية وفق معطيات الحالة ومرجعيات طب القرائن.",
				en: "Estimating survival rate and clinical outlook based on case data and evidence-based medicine.",
				es: "Estimación de tasa de supervivencia y perspectiva clínica basada en medicina basada en evidencia."
			},
			creative: {
				ar: "استشراف الأمل في سماء التعافي، أو الاستعداد لمواجهة الغيوم.",
				en: "Foreseeing hope in the sky of recovery, or preparing to face the clouds ahead.",
				es: "Prever la esperanza en el cielo de la recuperación."
			}
		}
	},
	{
		term: "anesthesia",
		pos: "noun",
		domain: ["medical"],
		translations: {
			ar: "التخدير",
			en: "anesthesia",
			es: "anestesia"
		},
		definitions: {
			ar: "الحالة المُحدَثة طبياً التي تمنع الإحساس بالألم مؤقتاً لأغراض جراحية أو تشخيصية، وتشمل التخدير العام والنصفي والموضعي.",
			en: "A medically induced state preventing pain sensation, used for surgical or diagnostic purposes — encompassing general, regional, and local anesthesia.",
			es: "Estado inducido médicamente que previene la sensación de dolor para propósitos quirúrgicos o diagnósticos."
		},
		nuances: {
			general: {
				ar: "دواء يمنع الشعور بالألم أثناء الجراحة.",
				en: "Medicine that prevents the feeling of pain during surgery.",
				es: "Medicina que previene el dolor durante la cirugía."
			},
			academic: {
				ar: "التعديل الدوائي الفسيولوجي المانع لاستقبال إشارات الألم (Nociception) عبر استهداف الجهاز العصبي.",
				en: "Pharmacological modulation preventing nociception by targeting the central or peripheral nervous system.",
				es: "Modulación farmacológica que previene la nocicepción al actuar sobre el sistema nervioso."
			},
			technical: {
				ar: "تثبيط الجهاز العصبي المركزي أو المحيطي بعوامل دوائية محددة (Volatile agents, IV agents, Local anesthetics).",
				en: "CNS/PNS depression using specific pharmacological agents (volatile agents, IV agents, local anesthetics).",
				es: "Depresión del SNC/SNP usando agentes farmacológicos específicos."
			},
			creative: {
				ar: "نوم عميق مؤقت يعلق الإحساس ريثما يداوي المشرط ما صنعه الداء.",
				en: "A temporary deep sleep suspending sensation while the scalpel heals what the disease created.",
				es: "Un sueño profundo temporal que suspende la sensación mientras el bisturí sana."
			}
		}
	},
	{
		term: "biopsy",
		pos: "noun",
		domain: ["medical"],
		translations: {
			ar: "خزعة نسيجية",
			en: "biopsy",
			es: "biopsia"
		},
		definitions: {
			ar: "أخذ عينة من أنسجة الجسم الحية وفحصها مجهرياً لتحديد التشخيص، لا سيما في حالات الأورام.",
			en: "The removal and microscopic examination of tissue from the living body to determine diagnosis, especially in tumor cases.",
			es: "La extracción y examen microscópico de tejido del cuerpo vivo para determinar el diagnóstico."
		},
		nuances: {
			general: {
				ar: "أخذ عينة صغيرة من الجسم لفحصها في المختبر.",
				en: "Taking a small tissue sample for laboratory examination.",
				es: "Tomar una pequeña muestra del cuerpo para examen de laboratorio."
			},
			academic: {
				ar: "الاستئصال النسيجي الباثولوجي للتشخيص الهستولوجي بتحديد درجة ورداءة الخلايا.",
				en: "Pathological tissue excision for histological diagnosis, determining cell grade and malignancy.",
				es: "Escisión de tejido patológico para diagnóstico histológico."
			},
			technical: {
				ar: "تحليل الأنسجة باستخدام تقنيات الهستوباثولوجيا للتمييز بين الخلايا الحميدة (Benign) والخبيثة (Malignant).",
				en: "Tissue analysis using histopathology techniques to differentiate benign from malignant cells.",
				es: "Análisis de tejidos con histopatología para diferenciar células benignas de malignas."
			},
			creative: {
				ar: "قطعة صغيرة من الجسم تحمل القصة الكاملة للمرض — كتاب مختصر في ورقة واحدة.",
				en: "A tiny fragment carrying the full story of the disease — a condensed book in a single page.",
				es: "Un pequeño fragmento que lleva la historia completa de la enfermedad."
			}
		}
	},
	{
		term: "hypertension",
		pos: "noun",
		domain: ["medical"],
		translations: {
			ar: "ارتفاع ضغط الدم",
			en: "hypertension",
			es: "hipertensión"
		},
		definitions: {
			ar: "حالة مزمنة يكون فيها ضغط الدم في الشرايين مرتفعاً باستمرار (≥130/80 ملم زئبقي) مما يزيد من خطر أمراض القلب والسكتة الدماغية.",
			en: "A chronic condition of persistently elevated blood pressure in the arteries (≥130/80 mmHg), increasing the risk of heart disease and stroke.",
			es: "Condición crónica de presión arterial persistentemente elevada (≥130/80 mmHg), con mayor riesgo de enfermedad cardíaca y accidente cerebrovascular."
		},
		nuances: {
			general: {
				ar: "ضغط الدم المرتفع.",
				en: "High blood pressure.",
				es: "Presión arterial alta."
			},
			academic: {
				ar: "فرط التوتر الشرياني المستدام — يُصنَّف إلى أولي (Essential) بلا سبب محدد، وثانوي (Secondary) ناتج عن مرض آخر.",
				en: "Sustained arterial hypertonia — classified as primary (essential, no specific cause) and secondary (due to underlying disease).",
				es: "Hipertonía arterial sostenida — clasificada como primaria (esencial) y secundaria (por enfermedad subyacente)."
			},
			technical: {
				ar: "ارتفاع الضغط الانقباضي (≥130) أو الانبساطي (≥80) وفق معايير ACC/AHA 2017 — يتطلب قياسات متكررة للتأكيد.",
				en: "Elevation of systolic (≥130) or diastolic (≥80) per ACC/AHA 2017 criteria — confirmed by repeated measurements.",
				es: "Elevación sistólica (≥130) o diastólica (≥80) según criterios ACC/AHA 2017."
			},
			creative: {
				ar: "القاتل الصامت يتسلل في الأوردة دون ضجيج — يبني خطره ببطء حتى يداهم القلب.",
				en: "The silent killer creeping through the veins — building its danger slowly until it ambushes the heart.",
				es: "El asesino silencioso que se infiltra por las venas, construyendo su peligro lentamente."
			}
		}
	},
	{
		term: "myocardial infarction",
		pos: "noun",
		domain: ["medical", "academic"],
		translations: {
			ar: "احتشاء عضلة القلب",
			en: "myocardial infarction",
			es: "infarto de miocardio"
		},
		definitions: {
			ar: "موت جزء من عضلة القلب بسبب انسداد الشريان التاجي وانقطاع الأكسجين عنه — المعروف شعبياً بـ'النوبة القلبية'.",
			en: "Death of heart muscle tissue due to coronary artery occlusion and oxygen deprivation — commonly known as a 'heart attack'.",
			es: "Muerte de tejido muscular cardíaco por oclusión coronaria y privación de oxígeno — conocido como 'ataque cardíaco'."
		},
		nuances: {
			general: {
				ar: "النوبة القلبية — توقف جزء من القلب عن العمل بسبب انسداد شرياني.",
				en: "Heart attack — part of the heart stops working due to a blocked artery.",
				es: "Ataque cardíaco — parte del corazón deja de funcionar por arteria bloqueada."
			},
			academic: {
				ar: "نخر إقفاري في عضلة القلب ناتج عن انسداد الشريان التاجي — يُشخَّص بتغيرات في رسم القلب (ECG) وارتفاع التروبونين.",
				en: "Ischemic necrosis of cardiac muscle from coronary occlusion — diagnosed by ECG changes and elevated Troponin.",
				es: "Necrosis isquémica cardíaca por oclusión coronaria — diagnosticada por ECG y elevación de Troponina."
			},
			technical: {
				ar: "يُصنَّف إلى STEMI وNSTEMI وفق ESC/ACC — إعادة التروية بـPCI خلال 90 دقيقة هي الخيار الأمثل.",
				en: "Classified as STEMI and NSTEMI per ESC/ACC — reperfusion via PCI within 90 minutes is optimal.",
				es: "Clasificado en STEMI y NSTEMI según ESC/ACC — reperfusión mediante PCI en 90 minutos es óptima."
			},
			creative: {
				ar: "لحظة يتوقف فيها جزء من الجسر الحيوي — والوقت هنا هو عضلة القلب نفسها.",
				en: "A moment when part of the vital bridge pauses — here, time itself is the heart muscle.",
				es: "Un momento en que parte del puente vital se detiene — aquí, el tiempo mismo es el músculo cardíaco."
			}
		}
	},
	{
		term: "sepsis",
		pos: "noun",
		domain: ["medical", "academic"],
		translations: {
			ar: "الإنتان",
			en: "sepsis",
			es: "sepsis"
		},
		definitions: {
			ar: "استجابة التهابية خطيرة ومفرطة للجهاز المناعي لمواجهة عدوى ما، تؤدي إلى تلف الأعضاء والوفاة إن لم تُعالج.",
			en: "A life-threatening condition caused by a dysregulated immune response to infection, leading to organ dysfunction and potentially death.",
			es: "Condición potencialmente mortal causada por respuesta inmune desregulada a infección, que lleva a disfunción orgánica."
		},
		nuances: {
			general: {
				ar: "انتشار العدوى في الدم وتأثيرها الخطير على الجسم كله.",
				en: "The spread of infection and its dangerous systemic effects on the entire body.",
				es: "La propagación de la infección y sus efectos sistémicos peligrosos."
			},
			academic: {
				ar: "استجابة الجهاز المناعي المفرطة لعدوى تؤدي إلى خلل وظيفي لأعضاء متعددة (MODS) — حالة طوارئ طبية قصوى.",
				en: "Dysregulated immune response to infection leading to multiple organ dysfunction syndrome (MODS) — a medical emergency.",
				es: "Respuesta inmune desregulada que lleva al síndrome de disfunción multiorgánica (MODS)."
			},
			technical: {
				ar: "يُشخَّص وفق تعريف Sepsis-3 (2016) بارتفاع SOFA ≥ 2 — يُميَّز عن الصدمة الإنتانية (Septic Shock) بانخفاض الضغط رغم الإنعاش بالسوائل.",
				en: "Diagnosed per Sepsis-3 (2016) with SOFA ≥ 2 — distinguished from septic shock by persistent hypotension despite fluid resuscitation.",
				es: "Diagnosticado según Sepsis-3 (2016) con SOFA ≥ 2 — distinguido del shock séptico por hipotensión persistente."
			},
			creative: {
				ar: "ثورة مناعية تهدف لقمع المحتل لكنها تحرق المدينة نفسها في المعركة.",
				en: "An immune uprising aiming to crush the invader — but burning the city itself in the battle.",
				es: "Una revuelta inmunológica para aplastar al invasor, pero quemando la ciudad en el proceso."
			}
		}
	},
	{
		term: "contraindication",
		pos: "noun",
		domain: ["medical", "academic"],
		translations: {
			ar: "موانع الاستعمال",
			en: "contraindication",
			es: "contraindicación"
		},
		definitions: {
			ar: "حالة طبية أو عامل يجعل استخدام علاج أو دواء أو إجراء طبي معين غير آمن أو محظوراً.",
			en: "A condition or factor that makes a particular medical treatment or procedure unsafe or inadvisable.",
			es: "Condición o factor que hace que un tratamiento médico o procedimiento sea inseguro o no recomendable."
		},
		nuances: {
			general: {
				ar: "أسباب طبية تمنع استعمال دواء أو إجراء علاجي معين.",
				en: "Medical reasons that prevent the use of a certain drug or treatment.",
				es: "Razones médicas que impiden usar cierto medicamento o tratamiento."
			},
			academic: {
				ar: "تُصنَّف إلى مطلقة (Absolute) تمنع الدواء كلياً، ونسبية (Relative) تستوجب الحذر وتقييم المخاطر.",
				en: "Classified as absolute (completely prohibiting the treatment) and relative (requiring risk-benefit assessment).",
				es: "Clasificadas en absolutas (prohíben el tratamiento) y relativas (requieren evaluación riesgo-beneficio)."
			},
			technical: {
				ar: "نشرة الدواء (PIL) تُفصّل موانع الاستعمال وفق البيانات الفارماكوكينيتيكية والتفاعلات الدوائية.",
				en: "Patient information leaflet (PIL) details contraindications based on pharmacokinetic data and drug interactions.",
				es: "El prospecto detalla contraindicaciones según datos farmacocinéticos e interacciones farmacológicas."
			},
			creative: {
				ar: "خط أحمر علمي يرسمه الطبيب قبل كل علاج — حماية المريض قبل علاجه.",
				en: "A scientific red line drawn by the physician before every treatment — protecting the patient before healing them.",
				es: "Una línea roja científica trazada por el médico antes de cada tratamiento."
			}
		}
	}
];
var MEDICAL_GLOSSARY = [
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
var LEGAL_DICT = [
	{
		term: "jurisdiction",
		pos: "noun",
		domain: ["legal", "academic"],
		translations: {
			ar: "الاختصاص القضائي",
			en: "jurisdiction",
			es: "jurisdicción"
		},
		definitions: {
			ar: "السلطة الرسمية الممنوحة لجهة قضائية لاتخاذ القرارات والأحكام القانونية في نزاع محدد.",
			en: "The official power or authority granted to a legal body to hear and decide cases within a defined scope.",
			es: "El poder oficial o autoridad otorgada a un órgano legal para escuchar y decidir casos dentro de un ámbito definido."
		},
		nuances: {
			general: {
				ar: "المكان أو السلطة التي يُطبق فيها القانون.",
				en: "The place or authority where the law applies.",
				es: "El lugar o autoridad donde se aplica la ley."
			},
			academic: {
				ar: "نطاق السلطة القضائية والسيادة القانونية للدولة — يُميَّز بين الاختصاص الموضوعي والمكاني والشخصي.",
				en: "The scope of judicial authority and state sovereignty — distinguishing between subject-matter, territorial, and personal jurisdiction.",
				es: "El ámbito de autoridad judicial — distinguiendo jurisdicción por materia, territorial y personal."
			},
			technical: {
				ar: "الصلاحية القانونية الممنوحة للمحكمة للنظر في القضية وإصدار حكم ملزم.",
				en: "Legal authority granted to a court to hear a case and issue a binding judgment.",
				es: "Autoridad legal otorgada a un tribunal para escuchar un caso y emitir sentencia vinculante."
			},
			creative: {
				ar: "دائرة العدل التي ينبسط فيها ميزان الحق — خارجها لا حكم ولا رقابة.",
				en: "The circle of justice where the scales of right unfold — beyond it, there is no ruling, no oversight.",
				es: "El círculo de la justicia donde se despliegan las escalas del derecho."
			}
		}
	},
	{
		term: "plaintiff",
		pos: "noun",
		domain: ["legal"],
		translations: {
			ar: "المدّعي",
			en: "plaintiff",
			es: "demandante"
		},
		definitions: {
			ar: "الطرف الذي يُبادر برفع الدعوى القضائية أمام المحكمة مطالباً بحق أو تعويض أو إنصاف قضائي.",
			en: "The party who initiates a lawsuit in a court of law, seeking a right, remedy, or judicial relief against the defendant.",
			es: "La parte que inicia una demanda en un tribunal, buscando un derecho, remedio o alivio judicial contra el demandado."
		},
		nuances: {
			general: {
				ar: "الشخص الذي يرفع شكوى قضائية.",
				en: "The person who files a legal complaint.",
				es: "La persona que presenta una queja legal."
			},
			academic: {
				ar: "الطرف المُبتدر للإجراءات القضائية في الدعوى المدنية — مقابل المدّعى عليه (Defendant).",
				en: "The party initiating legal proceedings in a civil lawsuit — as opposed to the defendant.",
				es: "La parte que inicia el proceso legal en una demanda civil — en contraposición al demandado."
			},
			technical: {
				ar: "الطرف الأول في الدعوى المدنية الذي يتحمل عبء الإثبات (Burden of Proof) ابتداءً.",
				en: "The first party in a civil lawsuit who bears the initial burden of proof.",
				es: "La primera parte en una demanda civil que carga inicialmente con la prueba."
			},
			creative: {
				ar: "طالب الحق الذي يطرق أبواب العدالة بثقة ويقين.",
				en: "The seeker of right knocking on the doors of justice with confidence and conviction.",
				es: "El buscador de justicia llamando a las puertas de la justicia con confianza."
			}
		}
	},
	{
		term: "affidavit",
		pos: "noun",
		domain: ["legal"],
		translations: {
			ar: "إقرار خطي مشفوع بالقسم",
			en: "affidavit",
			es: "declaración jurada"
		},
		definitions: {
			ar: "تصريح مكتوب مؤكَّد بالقسم يُقدَّم أمام موظف مختص (كاتب العدل) ويُستخدم دليلاً في الإجراءات القانونية.",
			en: "A written statement made under oath before an authorized officer (notary public) and used as evidence in legal proceedings.",
			es: "Declaración escrita bajo juramento ante un funcionario autorizado (notario) y usada como evidencia en procedimientos legales."
		},
		nuances: {
			general: {
				ar: "وثيقة مكتوبة وموقعة بقسم رسمي.",
				en: "A written document signed under formal oath.",
				es: "Un documento escrito firmado bajo juramento formal."
			},
			academic: {
				ar: "شهادة موثقة رسمياً قابلة للقبول كبينة قانونية في غياب الشهادة الشفهية أو لتعزيزها.",
				en: "Formally notarized testimony admissible as legal evidence in lieu of or in addition to oral testimony.",
				es: "Testimonio formalmente notariado admisible como evidencia legal."
			},
			technical: {
				ar: "صك إقراري يُعتمد في غياب الشهادة الشفهية — يُلزم صاحبه قانونياً ويترتب على الكذب فيه عقوبة الحنث باليمين (Perjury).",
				en: "Declaratory instrument used in lieu of oral testimony — legally binding, with false statements constituting perjury.",
				es: "Instrumento declaratorio cuyas falsedades constituyen perjurio."
			},
			creative: {
				ar: "الكلمات الموثقة التي تنوب عن صاحبها في قاعة المحكمة حين يغيب.",
				en: "The certified words that stand in for their owner in the courtroom when they are absent.",
				es: "Las palabras certificadas que representan a su dueño en el tribunal cuando está ausente."
			}
		}
	},
	{
		term: "litigation",
		pos: "noun",
		domain: ["legal"],
		translations: {
			ar: "التقاضي",
			en: "litigation",
			es: "litigio"
		},
		definitions: {
			ar: "المسار الإجرائي القانوني لحل النزاعات عبر المحاكم بما يشمل رفع الدعوى والمرافعة وإصدار الحكم.",
			en: "The legal process of resolving disputes through courts, encompassing filing, pleading, trial, and judgment.",
			es: "El proceso legal de resolver disputas mediante los tribunales, abarcando presentación, alegatos, juicio y sentencia."
		},
		nuances: {
			general: {
				ar: "رفع دعوى قضائية وإجراءاتها أمام المحكمة.",
				en: "Filing and pursuing a lawsuit in court.",
				es: "Presentar y tramitar una demanda en el tribunal."
			},
			academic: {
				ar: "المسار الإجرائي الرسمي لتسوية المنازعات عبر السلطة القضائية — مقابل التحكيم (Arbitration) والوساطة (Mediation).",
				en: "Formal procedural pathway for dispute resolution via judicial authority — as opposed to arbitration and mediation.",
				es: "Vía procesal formal para resolución de disputas — en contraste con arbitraje y mediación."
			},
			technical: {
				ar: "إدارة ملف الدعوى من رفعها إلى التقاضي عبر الدرجات (ابتدائي، استئناف، تمييز) وتجهيز المرافعات والبينات.",
				en: "Managing the case file from filing through all judicial levels (trial, appeal, cassation) and preparing pleadings and evidence.",
				es: "Gestión del expediente desde la presentación hasta todos los niveles judiciales, preparando alegatos y evidencia."
			},
			creative: {
				ar: "ساحة المعركة القانونية حيث تتصادم الحجج وتُختبر الحقائق بنار الإجراء.",
				en: "The legal battlefield where arguments clash and truths are tested in the fire of procedure.",
				es: "El campo de batalla legal donde los argumentos chocan y las verdades se prueban."
			}
		}
	},
	{
		term: "subpoena",
		pos: "noun",
		domain: ["legal"],
		translations: {
			ar: "مذكرة الإحضار",
			en: "subpoena",
			es: "citación judicial"
		},
		definitions: {
			ar: "أمر قضائي رسمي يُلزم شخصاً بالمثول أمام المحكمة أو تقديم وثائق، ويترتب على مخالفته عقوبة ازدراء المحكمة.",
			en: "A formal judicial order requiring a person to appear before a court or produce documents, with non-compliance constituting contempt of court.",
			es: "Orden judicial formal que requiere a una persona comparecer ante el tribunal o producir documentos, con incumplimiento constituyendo desacato."
		},
		nuances: {
			general: {
				ar: "طلب رسمي للمثول أمام المحكمة.",
				en: "Official request to appear in court.",
				es: "Solicitud oficial para comparecer ante el tribunal."
			},
			academic: {
				ar: "أمر قضائي إلزامي للإدلاء بالشهادة أو تقديم الوثائق — يُميَّز بين استدعاء الشاهد (Subpoena ad testificandum) وطلب المستندات (Subpoena duces tecum).",
				en: "Mandatory judicial order to testify or produce documents — distinguishing between witness subpoena (ad testificandum) and document subpoena (duces tecum).",
				es: "Orden judicial para testificar (ad testificandum) o producir documentos (duces tecum)."
			},
			technical: {
				ar: "إعلان قانوني إلزامي يترتب على مخالفته الوقوع في ازدراء المحكمة (Contempt of Court) مما قد يُفضي لغرامة أو حبس.",
				en: "Binding legal summons whose violation results in contempt of court, potentially incurring fines or imprisonment.",
				es: "Citación legal vinculante cuya violación resulta en desacato al tribunal."
			},
			creative: {
				ar: "نداء العدالة الذي لا يُرد — صوت القانون حين يطلب شاهداً على الحق.",
				en: "The call of justice that cannot be refused — the voice of law when it summons a witness to truth.",
				es: "El llamado de la justicia que no puede rechazarse."
			}
		}
	},
	{
		term: "habeas corpus",
		pos: "noun",
		domain: ["legal", "academic"],
		translations: {
			ar: "مبدأ المثول أمام القضاء",
			en: "habeas corpus",
			es: "hábeas corpus"
		},
		definitions: {
			ar: "مبدأ قانوني أساسي يكفل حق الشخص المحتجز في المطالبة بمراجعة قانونية لصحة احتجازه أمام القضاء.",
			en: "A fundamental legal principle guaranteeing a detained person the right to judicial review of the lawfulness of their detention.",
			es: "Principio legal fundamental que garantiza el derecho de una persona detenida a revisión judicial de la legalidad de su detención."
		},
		nuances: {
			general: {
				ar: "حق المحتجز في محاكمة عادلة وسرعة مراجعة احتجازه قضائياً.",
				en: "The detained person's right to a fair hearing and prompt judicial review of their detention.",
				es: "El derecho del detenido a audiencia justa y revisión judicial rápida."
			},
			academic: {
				ar: "مبدأ دستوري لحرية الشخص — أصله في القانون الإنجليزي (Magna Carta 1215) وهو ضمانة ضد الاحتجاز التعسفي.",
				en: "Constitutional principle of personal liberty — originating in English law (Magna Carta 1215), a safeguard against arbitrary detention.",
				es: "Principio constitucional de libertad personal — originado en el derecho inglés (Magna Carta 1215)."
			},
			technical: {
				ar: "تُقدَّم العريضة (Petition for Writ of Habeas Corpus) أمام محكمة مختصة لتُلزم الجهة المحتجِزة ببيان مسوّغ الاحتجاز.",
				en: "A Petition for Writ of Habeas Corpus is filed before a competent court to compel the detaining authority to justify the detention.",
				es: "La Petición de Habeas Corpus se presenta ante tribunal competente para obligar justificar la detención."
			},
			creative: {
				ar: "الدرع القانوني الأقدم ضد ظلم السجن دون حق — حماية جسد الحر من قبضة الطغيان.",
				en: "The oldest legal shield against unjust imprisonment — protecting the free person's body from the grip of tyranny.",
				es: "El escudo legal más antiguo contra el encarcelamiento injusto."
			}
		}
	},
	{
		term: "due process",
		pos: "noun",
		domain: ["legal", "academic"],
		translations: {
			ar: "ضمانات المحاكمة العادلة",
			en: "due process",
			es: "debido proceso"
		},
		definitions: {
			ar: "الحق الدستوري الذي يكفل للأفراد معاملتهم وفق الإجراءات القانونية المعمول بها قبل الحرمان من الحرية أو الحقوق.",
			en: "The constitutional right ensuring individuals are treated according to established legal procedures before being deprived of life, liberty, or property.",
			es: "El derecho constitucional que garantiza que las personas sean tratadas según procedimientos legales establecidos antes de ser privadas de vida, libertad o propiedad."
		},
		nuances: {
			general: {
				ar: "حق المتهم في محاكمة عادلة وفق إجراءات قانونية سليمة.",
				en: "The accused's right to a fair trial following proper legal procedures.",
				es: "El derecho del acusado a juicio justo siguiendo procedimientos legales adecuados."
			},
			academic: {
				ar: "يُميَّز بين الإجراءات الشكلية (Procedural Due Process) وضمانات الموضوع (Substantive Due Process) في القانون الدستوري الأمريكي.",
				en: "Distinguished between procedural due process (procedural fairness) and substantive due process (protection of fundamental rights) in U.S. constitutional law.",
				es: "Distinguido entre debido proceso procesal (equidad procesal) y sustantivo (protección de derechos fundamentales)."
			},
			technical: {
				ar: "يستلزم: الإخطار الكافي (Notice)، وفرصة الدفاع (Opportunity to be Heard)، وقاضٍ محايد (Impartial Tribunal).",
				en: "Requires: adequate notice, opportunity to be heard, and an impartial tribunal.",
				es: "Requiere: notificación adecuada, oportunidad de ser escuchado y tribunal imparcial."
			},
			creative: {
				ar: "الطريق المضيء نحو العدل — شرط الإنصاف قبل أن يُسلب حق أو تُقيَّد حرية.",
				en: "The illuminated path toward justice — the requirement of fairness before any right is taken or freedom constrained.",
				es: "El camino iluminado hacia la justicia — el requisito de equidad antes de privar de derechos o libertad."
			}
		}
	},
	{
		term: "tort",
		pos: "noun",
		domain: ["legal", "academic"],
		translations: {
			ar: "الفعل الضار",
			en: "tort",
			es: "agravio / responsabilidad civil"
		},
		definitions: {
			ar: "فعل أو إهمال غير مشروع يسبب ضرراً للآخرين ويُتيح للمتضرر المطالبة بتعويض مدني.",
			en: "A wrongful act or omission, other than breach of contract, that causes harm to another and gives rise to a civil claim for damages.",
			es: "Un acto u omisión ilícita, distinto del incumplimiento de contrato, que causa daño y da lugar a reclamación civil de indemnización."
		},
		nuances: {
			general: {
				ar: "تصرف خاطئ يسبب ضرراً لشخص آخر ويستوجب التعويض.",
				en: "A wrongful act causing harm to someone else, requiring compensation.",
				es: "Un acto ilícito que causa daño a otra persona y requiere compensación."
			},
			academic: {
				ar: "فرع مستقل من القانون المدني يتناول المسؤولية التقصيرية — يختلف عن المسؤولية التعاقدية (Contract) والجنائية (Criminal).",
				en: "Independent branch of civil law dealing with tortious liability — distinct from contractual and criminal liability.",
				es: "Rama independiente del derecho civil que trata la responsabilidad extracontractual."
			},
			technical: {
				ar: "يستلزم إثبات أربعة عناصر: الواجب (Duty)، الإخلال به (Breach)، السببية (Causation)، الضرر (Damages).",
				en: "Requires proving four elements: duty, breach, causation, and damages.",
				es: "Requiere probar cuatro elementos: deber, incumplimiento, causalidad y daños."
			},
			creative: {
				ar: "الجرح غير المقصود أو المقصود الذي يتركه الإنسان في حق غيره — القانون يلتقطه ويُنصف المتضرر.",
				en: "The unintentional or intentional wound left on another's rights — the law catches it and makes the injured whole.",
				es: "La herida dejada en los derechos de otro — la ley la capta y repara al perjudicado."
			}
		}
	}
];
var LEGAL_GLOSSARY = [
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
var GENERAL_DICT = [
	{
		term: "resilience",
		pos: "noun",
		domain: ["general"],
		translations: {
			ar: "مرونة",
			en: "resilience",
			es: "resiliencia"
		},
		definitions: {
			ar: "القدرة على التعافي السريع من الصعوبات أو التكيف مع التغييرات.",
			en: "The capacity to recover quickly from difficulties; toughness.",
			es: "La capacidad de recuperarse rápidamente de las dificultades."
		},
		nuances: {
			general: {
				ar: "القدرة على النهوض بعد السقوط.",
				en: "Ability to bounce back.",
				es: "Capacidad de recuperarse."
			},
			academic: {
				ar: "القدرة النظامية على امتصاص الصدمات واستعادة التوازن.",
				en: "Systemic ability to absorb shocks and restore equilibrium.",
				es: "Capacidad sistémica para absorber impactos."
			},
			technical: {
				ar: "قدرة النظام على الاستمرار في العمل رغم الأعطال.",
				en: "System's ability to continue operating despite failures.",
				es: "Capacidad del sistema para seguir operando."
			},
			creative: {
				ar: "انحناء السنديان أمام العاصفة دون أن ينكسر.",
				en: "The oak bending to the storm without breaking.",
				es: "El roble que se dobla ante la tormenta sin romperse."
			}
		}
	},
	{
		term: "ephemeral",
		pos: "adj",
		domain: ["general"],
		translations: {
			ar: "عابر",
			en: "ephemeral",
			es: "efímero"
		},
		definitions: {
			ar: "شيء يدوم لفترة قصيرة جداً.",
			en: "Lasting for a very short time.",
			es: "Que dura por muy poco tiempo."
		},
		nuances: {
			general: {
				ar: "مؤقت وقصير الأجل.",
				en: "Short-lived and temporary.",
				es: "De corta duración y temporal."
			},
			academic: {
				ar: "ظاهرة ذات مدة زمنية محدودة جداً.",
				en: "A phenomenon of very limited temporal duration.",
				es: "Fenómeno de duración temporal muy limitada."
			},
			technical: {
				ar: "بيانات متطايرة لا يتم تخزينها بشكل دائم.",
				en: "Volatile data not stored persistently.",
				es: "Datos volátiles no almacenados persistentemente."
			},
			creative: {
				ar: "كلحظة فجر تتلاشى مع أول خيوط الشمس.",
				en: "Like a dawn moment fading with the first sunrays.",
				es: "Como un momento del amanecer que se desvanece."
			}
		}
	},
	{
		term: "serendipity",
		pos: "noun",
		domain: ["general"],
		translations: {
			ar: "صدفة حسنة",
			en: "serendipity",
			es: "serendipia"
		},
		definitions: {
			ar: "وقوع أحداث سعيدة أو مفيدة بالصدفة.",
			en: "The occurrence and development of events by chance in a happy or beneficial way.",
			es: "Hallazgo valioso que se produce de manera accidental o casual."
		},
		nuances: {
			general: {
				ar: "اكتشاف شيء رائع بالصدفة.",
				en: "Finding something great by chance.",
				es: "Encontrar algo grandioso por casualidad."
			},
			academic: {
				ar: "الاكتشاف العرضي غير المخطط له لنتائج إيجابية.",
				en: "The unplanned incidental discovery of positive outcomes.",
				es: "El descubrimiento incidental."
			},
			technical: {
				ar: "اكتشاف ميزة غير مقصودة أثناء التطوير.",
				en: "Discovering an unintended feature during development.",
				es: "Descubrimiento de una característica no intencionada."
			},
			creative: {
				ar: "هدية غير متوقعة من القدر في طريق لم تقصده.",
				en: "An unexpected gift from destiny on an unintended path.",
				es: "Un regalo inesperado del destino."
			}
		}
	},
	{
		term: "ubiquitous",
		pos: "adj",
		domain: ["general"],
		translations: {
			ar: "موجود في كل مكان",
			en: "ubiquitous",
			es: "ubicuo"
		},
		definitions: {
			ar: "حاضر أو يظهر في كل مكان في نفس الوقت.",
			en: "Present, appearing, or found everywhere.",
			es: "Presente, apareciendo o encontrándose en todas partes."
		},
		nuances: {
			general: {
				ar: "شائع جداً وموجود حولنا.",
				en: "Very common and all around us.",
				es: "Muy común y a nuestro alrededor."
			},
			academic: {
				ar: "منتشر بشكل كلي في نطاق محدد.",
				en: "Omnipresent within a specific domain.",
				es: "Omnipresente en un dominio específico."
			},
			technical: {
				ar: "أنظمة حوسبة مدمجة في كل مكان محيط.",
				en: "Computing systems embedded in all surroundings.",
				es: "Sistemas informáticos integrados en todas partes."
			},
			creative: {
				ar: "كالهواء الذي نتنفسه، يحيط بنا دون أن نراه.",
				en: "Like the air we breathe, surrounding us unseen.",
				es: "Como el aire que respiramos."
			}
		}
	},
	{
		term: "paradigm",
		pos: "noun",
		domain: ["general"],
		translations: {
			ar: "نموذج فكري",
			en: "paradigm",
			es: "paradigma"
		},
		definitions: {
			ar: "مثال نموذجي أو نمط لشيء ما؛ إطار فكري.",
			en: "A typical example or pattern of something; a model.",
			es: "Un ejemplo típico o patrón de algo; un modelo."
		},
		nuances: {
			general: {
				ar: "طريقة تفكير أو نموذج.",
				en: "A way of thinking or a model.",
				es: "Una forma de pensar o un modelo."
			},
			academic: {
				ar: "إطار نظري منهجي يوجه البحث العلمي.",
				en: "A systematic theoretical framework guiding scientific research.",
				es: "Un marco teórico sistemático."
			},
			technical: {
				ar: "نمط برمجي يحدد هيكلة الكود (مثل البرمجة الكائنية).",
				en: "Programming pattern defining code structure.",
				es: "Patrón de programación que define la estructura."
			},
			creative: {
				ar: "العدسة التي نرى من خلالها تشكل العالم.",
				en: "The lens through which we perceive the shaping of the world.",
				es: "La lente a través de la cual percibimos el mundo."
			}
		}
	}
];
var RELIGIOUS_DICT = [
	{
		term: "God-consciousness",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "التقوى",
			en: "God-consciousness",
			es: "Conciencia de Dios"
		},
		definitions: {
			ar: "حالة من الوعي الروحي الدائم بحضور الله ومراقبته، والامتثال لأوامره واجتناب نواهيه في جميع الأحوال.",
			en: "A state of perpetual spiritual awareness of God's presence, manifested in wholehearted compliance with divine commandments and abstention from prohibitions.",
			es: "Estado de conciencia espiritual perpetua de la presencia de Dios."
		},
		nuances: {
			general: {
				ar: "خوف الله ومراقبته في السر والعلن.",
				en: "Fear and mindful awareness of God in all circumstances.",
				es: "Temor consciente de Dios en toda circunstancia."
			},
			academic: {
				ar: "مصطلح قرآني محوري يجمع بين الخشية والالتزام والتزكية الروحية.",
				en: "Pivotal Quranic concept (taqwā) integrating reverential fear, moral restraint, and spiritual purification — untranslatable by a single English word.",
				es: "Concepto coránico central (taqwā) que integra temor reverencial, restricción moral y purificación espiritual."
			},
			technical: {
				ar: "مصطلح مركب يشمل الخشية والورع والمراقبة — يُترجم بـ «God-consciousness» أو «piety» بحسب السياق.",
				en: "Composite term encompassing khashy (awe), wara' (scrupulousness), and muraqaba (watchfulness). Scholarly standard: 'God-consciousness' (Abdel Haleem).",
				es: "Término compuesto que abarca temor reverencial, escrúpulo y vigilancia espiritual."
			},
			creative: {
				ar: "درع الروح التي تقيها من الضلال، ونور القلب في عتمة الشهوات.",
				en: "The soul's shield against moral drift — the inner compass that orients every human act toward the divine.",
				es: "El escudo del alma contra la deriva moral — la brújula interior."
			}
		}
	},
	{
		term: "The Unseen",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الغيب",
			en: "The Unseen",
			es: "Lo Oculto / Lo Invisible"
		},
		definitions: {
			ar: "كل ما غاب عن إدراك الإنسان وحواسه من الحقائق الكونية والروحية، كعلم الله الأزلي، والروح، والملائكة، والقيامة، والجنة والنار.",
			en: "The entirety of realities beyond human perception — encompassing God's eternal knowledge, the soul, angels, the Day of Resurrection, Paradise, and Hellfire.",
			es: "Todo lo que está más allá de la percepción humana — el conocimiento eterno de Dios, el alma, los ángeles."
		},
		nuances: {
			general: {
				ar: "ما لا يراه الإنسان ولا يعلمه من أمور الله والآخرة.",
				en: "What humans cannot see or know — matters of God and the Hereafter.",
				es: "Lo que los humanos no pueden ver ni conocer."
			},
			academic: {
				ar: "مصطلح قرآني متكرر (غ ي ب) يعني ما وراء حد الإدراك البشري المباشر؛ مقابل «الشهادة».",
				en: "Recurring Quranic term (root: gh-y-b) denoting all realities transcending direct human perception; antonym of al-shahāda. Standard: 'the Unseen' or 'the Imperceivable'.",
				es: "Término coránico recurrente (raíz: gh-y-b) que denota realidades que trascienden la percepción humana."
			},
			technical: {
				ar: "يُترجم دائماً بـ «the Unseen» بحرف كبير للتمييز عن المعنى العام.",
				en: "Always rendered with capital 'U' — 'the Unseen'. Alternates: 'the Imperceivable' (Pickthall), 'things beyond the reach of perception' (Asad).",
				es: "Siempre con 'U' mayúscula para distinguir el concepto teológico."
			},
			creative: {
				ar: "ما يقع خلف ستار الإدراك البشري، حيث تسكن حقائق الوجود الكبرى.",
				en: "What lies behind the veil of human perception — where the grand truths of existence dwell, known only to God.",
				es: "Lo que yace detrás del velo de la percepción humana."
			}
		}
	},
	{
		term: "Spiritual Excellence",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الإحسان",
			en: "Spiritual Excellence",
			es: "Excelencia Espiritual"
		},
		definitions: {
			ar: "أعلى مراتب الدين الإسلامي — أن يعبد المسلم ربه كأنه يراه، فإن لم يكن يراه فإن الله يراه.",
			en: "The highest station in Islam: to worship God as though you see Him, and if you cannot, with the certain awareness that He sees you — as defined in the Hadith of Gabriel.",
			es: "La estación más alta en el Islam: adorar a Dios como si Le vieras, y si no puedes, con la certeza de que Él te ve."
		},
		nuances: {
			general: {
				ar: "أن يُتقن المسلم عبادته ومعاملاته وكأنه في حضرة الله.",
				en: "Excellence in worship and conduct — acting as though in the direct presence of God.",
				es: "Excelencia en la adoración y la conducta."
			},
			academic: {
				ar: "الإحسان مصطلح ثلاثي الجذر (ح س ن) يعني الإتقان والجمال والكمال في الاصطلاح الديني.",
				en: "Triliteral root (ḥ-s-n). In theological usage, iḥsān denotes the summit of spiritual attainment — perpetual divine awareness. Academic renderings: 'spiritual excellence' (Abdel Haleem).",
				es: "Raíz trilíteral (ḥ-s-n): belleza, excelencia, perfección en uso teológico."
			},
			technical: {
				ar: "يُترجم بـ «spiritual excellence» أو «perfection of faith».",
				en: "Standard translations: 'spiritual excellence' (most common), 'benevolence' (social conduct), 'virtue' (ethics). Retain 'iḥsān' in academic texts.",
				es: "Traducciones: 'excelencia espiritual', 'benevolencia' (conducta social)."
			},
			creative: {
				ar: "ليس مجرد الإتقان — بل أن تجعل من كل لحظة مرآة تعكس جمال الله وعظمته.",
				en: "Not mere excellence — the art of making every moment a mirror reflecting divine beauty and majesty.",
				es: "No solo excelencia — el arte de hacer de cada momento un espejo de la belleza divina."
			}
		}
	},
	{
		term: "The Remembrance of God",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الذكر",
			en: "The Remembrance of God",
			es: "La Remembranza de Dios"
		},
		definitions: {
			ar: "ذكر الله بالقلب واللسان والجوارح — يشمل التسبيح والتهليل والتحميد والتكبير والدعاء وقراءة القرآن.",
			en: "The mindful invocation and recollection of God through heart, tongue, and action — encompassing glorification (tasbīḥ), praise (taḥmīd), affirmation of divine unity (tahlīl), and Quran recitation.",
			es: "La invocación y remembranza de Dios a través del corazón, la lengua y la acción."
		},
		nuances: {
			general: {
				ar: "تذكر الله وترديد أسمائه وصفاته بالقلب واللسان.",
				en: "Remembering God and repeating His names and praises in heart and speech.",
				es: "Recordar a Dios y repetir Sus nombres y alabanzas."
			},
			academic: {
				ar: "الذكر في القرآن ثلاثة أبعاد: ذكر الله للعبد، وذكر العبد لله، وذكر النعمة.",
				en: "Quranic dhikr operates on three planes: God's remembrance of the servant (mercy), the servant's remembrance of God (worship), and remembrance of divine bounties (gratitude).",
				es: "El dhikr coránico opera en tres planos: remembranza de Dios al siervo, del siervo a Dios, y de las mercedes."
			},
			technical: {
				ar: "الفرق بين الذكر الخاص (جلسات منظمة) والذكر العام (التذكر في كل حال).",
				en: "Distinction: dhikr as specific formal practice (invocation sessions) vs. general mindful remembrance throughout all states. Context determines: 'invocation', 'remembrance', or 'litany'.",
				es: "Distinción: dhikr como práctica formal vs. remembranza mindful general."
			},
			creative: {
				ar: "حياة القلب ودواؤه — كما أن الجسد لا يحيا بلا ماء، لا يحيا القلب بلا ذكر الله.",
				en: "The soul's life-force and medicine — as the body cannot live without water, the heart cannot truly live without the remembrance of God.",
				es: "La fuerza vital del alma — como el cuerpo no puede vivir sin agua, el corazón sin la remembranza de Dios."
			}
		}
	},
	{
		term: "Declaration of Faith",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الشهادتان",
			en: "The Declaration of Faith",
			es: "La Declaración de Fe"
		},
		definitions: {
			ar: "شهادة أن لا إله إلا الله وأن محمداً رسول الله — الركن الأول من أركان الإسلام وأساس الدخول في الإسلام.",
			en: "The testimony that there is no god but God and that Muhammad is His Messenger — the First Pillar of Islam and the gateway to the faith.",
			es: "El testimonio de que no hay dios sino Dios y que Muhammad es Su Mensajero — el Primer Pilar del Islam."
		},
		nuances: {
			general: {
				ar: "أساس الإيمان الإسلامي ومفتاح الدخول في الإسلام.",
				en: "The foundational creed of Islam — its utterance with sincere conviction constitutes entry into the faith.",
				es: "La fe fundamental del Islam — su pronunciación sincera constituye la entrada a la fe."
			},
			academic: {
				ar: "الشهادتان: شهادة التوحيد + شهادة الرسالة. الجمع بينهما ضروري في الإسلام السني.",
				en: "The shahādatān comprises two testimonies: tawhīd (divine oneness) and risāla (prophethood). Scholarly rendering: 'the Two Testimonies', 'the Profession of Faith', or 'the Shahāda'.",
				es: "Las dos testimonias: tawhīd (unicidad) y risāla (profetismo). Rendering académico: 'las Dos Testimonias'."
			},
			technical: {
				ar: "يُترجم بـ «shahāda» (transliteration) في السياق الأكاديمي أو «profession of faith» في الشرح العام.",
				en: "Academic standard: retain 'shahāda' (transliterated) in Islamic studies contexts. General use: 'profession of faith' or 'declaration of faith'.",
				es: "Estándar académico: retener 'shahāda' transliterado. Uso general: 'declaración de fe'."
			},
			creative: {
				ar: "الكلمتان اللتان تُحوّلان إنساناً إلى مسلم — بوابة بين عالمَين.",
				en: "Two words that transform a human being — the threshold between two worlds, uttered in the breath of conviction.",
				es: "Dos palabras que transforman un ser humano — el umbral entre dos mundos."
			}
		}
	},
	{
		term: "Prayer",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الصلاة",
			en: "Ritual Prayer",
			es: "Oración Ritual"
		},
		definitions: {
			ar: "الركن الثاني من أركان الإسلام، وهي عبادة بدنية وقولية مفروضة خمس مرات يومياً، تشمل القيام والركوع والسجود والتشهد مستقبلاً القبلة.",
			en: "The Second Pillar of Islam — the five daily ritual prayers performed in a specific sequence of standing, bowing, prostration, and supplication, directed toward the Kaaba in Mecca.",
			es: "El Segundo Pilar del Islam — las cinco oraciones rituales diarias con una secuencia específica de posiciones, dirigidas hacia la Kaaba en La Meca."
		},
		nuances: {
			general: {
				ar: "الصلوات الخمس المفروضة على كل مسلم بالغ عاقل.",
				en: "The five obligatory daily prayers for every adult Muslim of sound mind.",
				es: "Las cinco oraciones diarias obligatorias para todo musulmán adulto."
			},
			academic: {
				ar: "الصلاة في القرآن تعني الدعاء أيضاً — والاستخدام الاصطلاحي خاص بالعبادة المقننة بأركانها وشروطها.",
				en: "ṣalāh in Quranic Arabic also denotes supplication/prayer generally (cf. Q. 33:56). The specific ritual prayer (canonical worship) is distinguished by its prescribed conditions. Academic: 'ritual prayer' or 'salāt' (transliterated).",
				es: "Ṣalāh en el Corán también denota súplica general. La oración ritual específica se distingue por sus condiciones prescritas."
			},
			technical: {
				ar: "الصلاة تختلف عن «الدعاء» (الدعاء الحر) — الأولى مقننة بأركان وشروط، والثانية حرة غير مقيدة.",
				en: "Critical distinction: ṣalāt (ritual prayer with fixed rites and conditions) ≠ du'ā' (spontaneous supplication). Avoid rendering both as 'prayer' without qualification.",
				es: "Distinción crítica: ṣalāt (oración ritual fija) ≠ du'ā' (súplica espontánea)."
			},
			creative: {
				ar: "خمس لحظات يومية يقف فيها الإنسان أمام بارئه مباشرة — بلا وسيط ولا حاجب.",
				en: "Five daily moments when the human soul stands directly before its Creator — no intermediary, no barrier, only the breath of surrender.",
				es: "Cinco momentos diarios en que el alma humana se para directamente ante su Creador."
			}
		}
	},
	{
		term: "Obligatory Almsgiving",
		pos: "noun",
		domain: [
			"religious",
			"legal",
			"academic"
		],
		translations: {
			ar: "الزكاة",
			en: "Obligatory Almsgiving",
			es: "Limosna Obligatoria"
		},
		definitions: {
			ar: "الركن الثالث من أركان الإسلام، وهي نسبة مالية مفروضة شرعاً على ما بلغ النصاب من المال والتجارة والزراعة والماشية، تُصرف في مصارف محددة شرعاً.",
			en: "The Third Pillar of Islam — a legally prescribed portion of wealth due annually on assets that reach the minimum threshold (niṣāb), distributed to eight categories of recipients defined in the Quran (Q. 9:60).",
			es: "El Tercer Pilar del Islam — una porción legalmente prescrita de la riqueza debida anualmente sobre activos que alcanzan el umbral mínimo (niṣāb)."
		},
		nuances: {
			general: {
				ar: "حق مالي واجب في أموال الأغنياء لصالح الفقراء والمستحقين.",
				en: "A obligatory financial right on the wealth of the affluent, distributed to those in need.",
				es: "Un derecho financiero obligatorio sobre la riqueza de los ricos, distribuido a los necesitados."
			},
			academic: {
				ar: "الزكاة أداة توزيعية وليست صدقة طوعية — لها نصاب وحول وأنصبة محددة فقهياً.",
				en: "Zakāt is a redistributive obligation (not voluntary charity — that is ṣadaqa). It has a minimum threshold (niṣāb), a minimum timeframe (ḥawl = one lunar year), and prescribed beneficiaries. Academic: 'obligatory alms', 'zakāt' (transliterated).",
				es: "El zakāt es una obligación redistributiva (no caridad voluntaria — eso es ṣadaqa). Tiene umbral mínimo y beneficiarios prescritos."
			},
			technical: {
				ar: "الزكاة ≠ الصدقة: الزكاة واجبة وتعريفها فقهي دقيق — الصدقة طوعية.",
				en: "Zakāt ≠ ṣadaqa: Zakāt is obligatory with precise jurisprudential definition; ṣadaqa is voluntary charity. Avoid rendering zakāt as mere 'charity'.",
				es: "Zakāt ≠ ṣadaqa: el zakāt es obligatorio; la ṣadaqa es caridad voluntaria."
			},
			creative: {
				ar: "تطهير المال من الشح وإحياء للأخوة الإنسانية بين الغني والفقير.",
				en: "The purification of wealth from miserliness — a living bridge of brotherhood between the affluent and the destitute.",
				es: "La purificación de la riqueza de la avaricia — un puente vivo de hermandad entre opulentos y desamparados."
			}
		}
	},
	{
		term: "Fasting",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الصيام",
			en: "Fasting",
			es: "Ayuno"
		},
		definitions: {
			ar: "الركن الرابع من أركان الإسلام، وهو الإمساك عن المفطرات من طلوع الفجر إلى غروب الشمس في شهر رمضان المبارك بنية التقرب إلى الله.",
			en: "The Fourth Pillar of Islam — the complete abstention from food, drink, and sexual relations from dawn to sunset throughout Ramadan, with the intention of spiritual devotion to God.",
			es: "El Cuarto Pilar del Islam — la abstención completa de comida, bebida y relaciones sexuales del amanecer al atardecer durante el Ramadán."
		},
		nuances: {
			general: {
				ar: "صيام شهر رمضان بالإمساك عن الطعام والشراب من الفجر إلى المغرب.",
				en: "Fasting during Ramadan — abstaining from food and drink from dawn to sunset.",
				es: "Ayuno durante el Ramadán — abstenerse de comida y bebida del amanecer al atardecer."
			},
			academic: {
				ar: "الصيام في الإسلام له أبعاد جسدية وروحية — والقرآن يربطه بتحقيق التقوى (البقرة 183).",
				en: "Islamic fasting (ṣiyām/ṣawm) has both physical and spiritual dimensions. The Quran links it explicitly to the attainment of taqwā (Q. 2:183). Academic: 'ṣawm', 'ṣiyām', or 'Ramadan fasting'.",
				es: "El ayuno islámico tiene dimensiones físicas y espirituales. El Corán lo vincula al logro de taqwā (C. 2:183)."
			},
			technical: {
				ar: "«الصيام» الاسم المصدري لـ «صام» — و«الصوم» صيغة مفردة للفعل الواحد.",
				en: "ṣiyām is the verbal noun (maṣdar) of ṣāma (to fast); ṣawm is also used. Both are standard. Distinguish from imsāk (the specific act of abstention onset).",
				es: "Ṣiyām es el nombre verbal de ṣāma (ayunar); ṣawm también se usa. Ambos son estándar."
			},
			creative: {
				ar: "شهر تنكسر فيه طغيان الشهوة وتُحرَّر الإرادة من أسر الجسد.",
				en: "A month in which the tyranny of appetite is broken — the will liberated from the prison of the body, ascending toward the light.",
				es: "Un mes en que se rompe la tiranía del apetito — la voluntad liberada de la prisión del cuerpo."
			}
		}
	},
	{
		term: "Pilgrimage to Mecca",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الحج",
			en: "Pilgrimage to Mecca",
			es: "Peregrinación a La Meca"
		},
		definitions: {
			ar: "الركن الخامس من أركان الإسلام، وهو زيارة المسجد الحرام بمكة المكرمة وأداء مناسكه المحددة شرعاً في شهر ذي الحجة، وهو فرض على كل مسلم مستطيع مرة في العمر.",
			en: "The Fifth Pillar of Islam — the annual pilgrimage to Mecca performed during Dhū al-Ḥijja, obligatory once in a lifetime for every Muslim who is financially and physically able.",
			es: "El Quinto Pilar del Islam — la peregrinación anual a La Meca durante Dhū al-Ḥijja, obligatoria una vez en la vida para todo musulmán capaz."
		},
		nuances: {
			general: {
				ar: "فريضة الحج إلى مكة مرة في العمر لمن استطاع.",
				en: "The obligatory once-in-a-lifetime pilgrimage to Mecca for those who are able.",
				es: "La peregrinación obligatoria una vez en la vida a La Meca para quienes puedan."
			},
			academic: {
				ar: "الحج يختلف عن العمرة — الحج بمواقيت محددة والعمرة في أي وقت.",
				en: "Ḥajj ≠ ʿumra: Ḥajj is the major pilgrimage with specific temporal requirements (Dhū al-Ḥijja); ʿumra is the minor pilgrimage performable at any time. Both involve tawāf (circumambulation) and saʿy (walking between Ṣafā and Marwa).",
				es: "Ḥajj ≠ ʿumra: el ḥajj tiene requisitos temporales específicos; la ʿumra se puede realizar en cualquier momento."
			},
			technical: {
				ar: "مناسك الحج: الإحرام، الطواف، السعي، الوقوف بعرفة، رمي الجمرات، الحلق، طواف الإفاضة.",
				en: "Ḥajj rites: iḥrām (sacred state), ṭawāf (circumambulation), saʿy (Ṣafā-Marwa walk), wuqūf at ʿArafāt (standing), ramy al-jamarāt (stoning), ḥalq/taqṣīr (hair removal), ṭawāf al-ifāḍa.",
				es: "Ritos del ḥajj: iḥrām, ṭawāf, saʿy, wuqūf en ʿArafāt, ramy al-jamarāt, ḥalq, ṭawāf al-ifāḍa."
			},
			creative: {
				ar: "ملتقى المسلمين الأعظم — يُذوَّب فيه الفارق بين الملك والفقير تحت ثوب بياض واحد.",
				en: "The greatest gathering of Muslims — where the distance between king and pauper dissolves beneath a single white garment, all equal before God.",
				es: "El mayor encuentro de musulmanes — donde la distancia entre rey y mendigo se disuelve bajo una única vestidura blanca."
			}
		}
	},
	{
		term: "Formal Islamic Legal Opinion",
		pos: "noun",
		domain: [
			"religious",
			"legal",
			"academic"
		],
		translations: {
			ar: "فتوى",
			en: "Formal Islamic Legal Opinion",
			es: "Opinión Jurídica Islámica Formal"
		},
		definitions: {
			ar: "حكم شرعي يصدره مجتهد أو عالم متخصص في الفقه الإسلامي، بناءً على أدلة الكتاب والسنة والإجماع والقياس، رداً على سؤال محدد.",
			en: "A formal jurisprudential ruling issued by a qualified Islamic scholar (mufti) based on the Quran, Sunnah, scholarly consensus (ijmāʿ), and analogical reasoning (qiyās).",
			es: "Una resolución jurídica formal emitida por un erudito islámico calificado (muftī)."
		},
		nuances: {
			general: {
				ar: "رأي ديني رسمي يصدره عالم متخصص في الشريعة الإسلامية.",
				en: "A formal religious ruling by a qualified Islamic scholar on a specific legal question.",
				es: "Una resolución religiosa formal de un erudito islámico calificado."
			},
			academic: {
				ar: "الفتوى في الفقه الإسلامي رأي استشاري غير ملزم في الغالب، يختلف جوهرياً عن القضاء (الحكم الملزم).",
				en: "In Islamic jurisprudence, a fatwā is typically a non-binding advisory opinion (distinct from a qadā, a binding judicial decree). Scholarly standard: 'legal opinion' (Hallaq), 'religious edict' (popular).",
				es: "En la jurisprudencia islámica, una fatwā es típicamente una opinión consultiva no vinculante."
			},
			technical: {
				ar: "لا يجب ترجمتها بـ «edict» وحدها لأنها لا تحمل صلاحية الإلزام القانوني في معظم السياقات.",
				en: "Caution: rendering solely as 'edict' (implying binding authority) is technically imprecise. Preferred: 'legal opinion' or 'juristic ruling' with 'fatwā' retained in parentheses.",
				es: "Precaución: solo 'edicto' (implicando autoridad vinculante) es técnicamente impreciso."
			},
			creative: {
				ar: "خارطة الطريق الشرعية التي يضعها العالم الفقيه لمن يبحث عن الحق في مسألة دينية معقدة.",
				en: "The scholar's roadmap for those navigating a complex religious question — a lantern held up by juristic knowledge.",
				es: "La hoja de ruta del erudito para quienes navegan una pregunta religiosa compleja."
			}
		}
	},
	{
		term: "The Islamic Legal Path",
		pos: "noun",
		domain: [
			"religious",
			"legal",
			"academic"
		],
		translations: {
			ar: "الشريعة",
			en: "The Islamic Legal Path / Divine Law",
			es: "La Ley Islámica / La Ley Divina"
		},
		definitions: {
			ar: "المنهج الإلهي الشامل للحياة الإسلامية المستمد من القرآن الكريم والسنة النبوية، يشمل العبادات والمعاملات والأخلاق والقانون.",
			en: "The comprehensive divine guidance for Islamic life, derived from the Quran and Prophetic Sunnah, encompassing acts of worship, social transactions, ethics, and legal norms.",
			es: "La guía divina integral para la vida islámica, derivada del Corán y la Sunnah profética."
		},
		nuances: {
			general: {
				ar: "قوانين الإسلام وأحكامه الشاملة.",
				en: "The laws and comprehensive principles of Islam.",
				es: "Las leyes y principios integrales del Islam."
			},
			academic: {
				ar: "الشريعة تعني لغةً «الطريق المؤدي إلى الماء» — مستعار للمنهج الإلهي المؤدي إلى الحياة الكريمة.",
				en: "Literally: 'the path leading to water' — metaphorically: the divine path leading to a righteous life. Distinct from fiqh (human scholarly interpretation of sharīʿa).",
				es: "Literalmente: 'el camino que lleva al agua' — metafóricamente: el camino divino hacia una vida justa."
			},
			technical: {
				ar: "لا تعني «القانون» بمعناه الضيق — بل تشمل الأخلاق والروحانيات والعبادات والمعاملات الاجتماعية.",
				en: "Caution: not a synonym for 'law' in the narrow Western legal sense. Sharīʿa encompasses ethics, spirituality, worship, and social norms.",
				es: "No es sinónimo de 'ley' en el sentido legal occidental estrecho. La Sharī'a abarca ética, espiritualidad y normas sociales."
			},
			creative: {
				ar: "ليست قيوداً — بل خارطة العيش الكريم، رسمها الخالق لخلقه.",
				en: "Not restrictions — but a map of dignified living, drawn by the Creator for His creation to attain worldly flourishing and eternal salvation.",
				es: "No restricciones — sino un mapa del vivir con dignidad, trazado por el Creador."
			}
		}
	},
	{
		term: "Scholarly Consensus",
		pos: "noun",
		domain: [
			"religious",
			"legal",
			"academic"
		],
		translations: {
			ar: "الإجماع",
			en: "Scholarly Consensus",
			es: "Consenso de los Eruditos Islámicos"
		},
		definitions: {
			ar: "اتفاق مجتهدي الأمة الإسلامية في عصر من العصور على حكم شرعي، وهو المصدر الثالث من مصادر التشريع الإسلامي.",
			en: "The unanimous agreement of qualified Islamic scholars of a given era on a legal ruling — constituting the third source of Islamic jurisprudence after the Quran and the Sunnah.",
			es: "El acuerdo unánime de los eruditos islámicos calificados de una época sobre una resolución legal."
		},
		nuances: {
			general: {
				ar: "اتفاق العلماء المسلمين على حكم شرعي.",
				en: "The agreement of Muslim scholars on an Islamic ruling.",
				es: "El acuerdo de los eruditos musulmanes sobre una resolución islámica."
			},
			academic: {
				ar: "الإجماع ثالث مصادر الفقه بعد القرآن والسنة — ومحل خلاف بين الأصوليين في ضوابطه وانعقاده.",
				en: "Third source of Islamic jurisprudence after Quran and Sunnah. Contested: classical scholars disagree on its precise conditions. Scholarly rendering: 'scholarly consensus' (Hallaq).",
				es: "Tercera fuente de la jurisprudencia islámica. Rendering académico: 'consenso de los eruditos'."
			},
			technical: {
				ar: "يُستخدم «scholarly consensus» وليس «unanimous consensus» لأن درجة الاتفاق المطلوبة محل خلاف فقهي.",
				en: "Use 'scholarly consensus' rather than 'unanimous consensus' as the precise threshold is jurisprudentially disputed. 'Ijmāʿ' preferred in academic Islamic law texts.",
				es: "Use 'consenso de eruditos' en lugar de 'consenso unánime' ya que el umbral exacto es disputado."
			},
			creative: {
				ar: "صوت الأمة الجماعي الذي تشكّل عبر قرون من الاجتهاد العلمي الرصين.",
				en: "The collective voice of the community, shaped across centuries of rigorous scholarly effort.",
				es: "La voz colectiva de la comunidad, formada a través de siglos de esfuerzo erudito riguroso."
			}
		}
	},
	{
		term: "Independent Legal Reasoning",
		pos: "noun",
		domain: [
			"religious",
			"legal",
			"academic"
		],
		translations: {
			ar: "الاجتهاد",
			en: "Independent Legal Reasoning",
			es: "Razonamiento Jurídico Independiente"
		},
		definitions: {
			ar: "بذل الفقيه المؤهل جهده الكامل في استنباط الأحكام الشرعية من الأدلة التفصيلية عند غياب نص صريح.",
			en: "The maximum effort of a qualified Islamic jurist in deriving legal rulings from detailed textual evidence where no explicit text exists.",
			es: "El máximo esfuerzo de un jurista islámico calificado para derivar resoluciones legales de evidencias textuales."
		},
		nuances: {
			general: {
				ar: "اجتهاد العلماء في إيجاد الحكم الشرعي من الأدلة.",
				en: "Scholarly effort to derive Islamic rulings from textual evidence.",
				es: "Esfuerzo erudito para derivar resoluciones islámicas de la evidencia textual."
			},
			academic: {
				ar: "الاجتهاد مقابل التقليد — من أكثر الموضوعات خلافاً في أصول الفقه الإسلامي الكلاسيكي والحديث.",
				en: "Opposite of taqlīd (following a school without independent derivation). Central debate: is the 'gate of ijtihād' open or closed? Academic rendering: 'independent legal reasoning'.",
				es: "Opuesto a taqlīd (seguimiento sin derivación independiente). Rendering académico: 'razonamiento jurídico independiente'."
			},
			technical: {
				ar: "الترجمة الأدق هي «independent legal reasoning» — يُجتنب «interpretation» لأنها أوسع وأشمل من مجرد التأويل النصي.",
				en: "Avoid rendering as mere 'interpretation' — ijtihād specifically denotes independent derivation of new rulings, not just textual interpretation.",
				es: "Evite solo 'interpretación' — el ijtihād denota específicamente la derivación independiente de nuevas resoluciones."
			},
			creative: {
				ar: "العقل الفقهي في مواجهة الواقع المتجدد — محاولة لإضاءة الطريق الشرعي في حيث لم يصل ضوء النص.",
				en: "The juristic mind meeting an ever-changing reality — a courageous attempt to illuminate the legal path where the direct light of scripture has not yet reached.",
				es: "La mente jurídica encontrando una realidad en constante cambio — un intento valiente de iluminar el camino legal."
			}
		}
	},
	{
		term: "Analogical Reasoning",
		pos: "noun",
		domain: [
			"religious",
			"legal",
			"academic"
		],
		translations: {
			ar: "القياس",
			en: "Analogical Reasoning",
			es: "Razonamiento Analógico"
		},
		definitions: {
			ar: "إلحاق مسألة لم يرد فيها نص شرعي صريح بمسألة ورد فيها نص لاشتراكهما في العلة.",
			en: "The extension of a Quranic or Sunnah ruling to a new case not explicitly addressed in scripture, on the basis of a shared effective cause (ʿilla).",
			es: "La extensión de una resolución coránica o de la Sunnah a un nuevo caso no abordado explícitamente, sobre la base de una causa efectiva compartida (ʿilla)."
		},
		nuances: {
			general: {
				ar: "استنباط حكم جديد بالقياس على حكم مشابه له في القرآن أو السنة.",
				en: "Deriving a new ruling by analogy with an existing Quranic or Sunnah ruling based on shared cause.",
				es: "Derivar una nueva resolución por analogía con una existente basada en causa compartida."
			},
			academic: {
				ar: "القياس المصدر الرابع من مصادر الفقه — وله أركان أربعة: الأصل، الفرع، الحكم، العلة.",
				en: "Qiyās is the fourth source of Islamic jurisprudence. Its four pillars: al-aṣl (original case), al-farʿ (new case), al-ḥukm (ruling), al-ʿilla (effective cause). Academic: 'analogical reasoning' or 'qiyās'.",
				es: "El qiyās es la cuarta fuente de la jurisprudencia islámica. Sus cuatro pilares: aṣl, farʿ, ḥukm, ʿilla."
			},
			technical: {
				ar: "القياس يشترط صراحة العلة المشتركة — وليس كل قياس مقبول في مذاهب الفقه الأربعة.",
				en: "Qiyās requires an explicit shared ʿilla; not all analogies are accepted. The Ẓāhirī school rejects qiyās entirely. Scholarly: 'analogical reasoning' (Hallaq, Kamali).",
				es: "El qiyās requiere una ʿilla explícita compartida; no todas las analogías son aceptadas."
			},
			creative: {
				ar: "جسر العقل بين الماضي والحاضر — يُعبر به الفقيه مما سبق نزوله من الوحي إلى ما لم يُنزل فيه نص.",
				en: "The bridge of reason between past and present — carrying the jurist from revealed scripture to uncharted legal terrain.",
				es: "El puente de la razón entre el pasado y el presente — llevando al jurista desde la escritura revelada al terreno legal inexplorado."
			}
		}
	},
	{
		term: "Jurisprudential Preference",
		pos: "noun",
		domain: [
			"religious",
			"legal",
			"academic"
		],
		translations: {
			ar: "الاستحسان",
			en: "Jurisprudential Preference",
			es: "Preferencia Jurisprudencial"
		},
		definitions: {
			ar: "عدول الفقيه عن الحكم الذي تقتضيه القواعد العامة إلى حكم آخر أنسب للمصلحة أو أقرب للعدل في سياق معين.",
			en: "The jurist's departure from a strict application of general rules in favour of a ruling that better serves the public interest or achieves justice in a specific context.",
			es: "La desviación del jurista de la aplicación estricta de reglas generales en favor de una resolución que mejor sirve al interés público."
		},
		nuances: {
			general: {
				ar: "اختيار الفقيه لحكم أنسب من الحكم الذي تقتضيه القاعدة العامة لمصلحة أو ضرورة.",
				en: "The jurist's choice of a more suitable ruling over the one indicated by general rules, for necessity or public welfare.",
				es: "La elección del jurista de una resolución más adecuada por necesidad o bienestar público."
			},
			academic: {
				ar: "الاستحسان مستخدم أساساً في الفقه الحنفي — وهو محل انتقاد من الشافعي الذي رأى فيه قولاً بالهوى.",
				en: "Istiḥsān is primarily a Ḥanafī doctrine. Al-Shāfiʿī famously criticized it as 'legislating by caprice'. Modern scholars rehabilitate it as equity-based reasoning. Academic: 'juristic preference' or 'equity' (istihsān).",
				es: "Istiḥsān es principalmente una doctrina ḥanafī. Al-Shāfiʿī lo criticó. Los eruditos modernos lo rehabilitan como razonamiento basado en equidad."
			},
			technical: {
				ar: "لا يُترجم بـ «preference» وحدها — بل «jurisprudential preference» أو «equity in Islamic law» أو «istiḥsān».",
				en: "Avoid bare 'preference'. Use 'jurisprudential preference', 'Islamic equity', or 'istiḥsān' (transliterated) for precision.",
				es: "Evite solo 'preferencia'. Use 'preferencia jurisprudencial' o 'istiḥsān' transliterado."
			},
			creative: {
				ar: "رحمة الفقه في مواجهة جمود القاعدة — حيث يُحكَّم العدل فوق النظرية.",
				en: "The mercy of jurisprudence meeting the rigidity of the rule — where justice is elevated above theory.",
				es: "La misericordia de la jurisprudencia encontrando la rigidez de la regla — donde la justicia se eleva sobre la teoría."
			}
		}
	},
	{
		term: "Prophetic Tradition",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الحديث النبوي",
			en: "Prophetic Tradition",
			es: "Tradición Profética"
		},
		definitions: {
			ar: "رواية ما صدر عن النبي محمد ﷺ من قول أو فعل أو تقرير أو صفة — وهو المصدر الثاني من مصادر التشريع الإسلامي بعد القرآن الكريم.",
			en: "A reported saying, action, tacit approval, or description attributed to the Prophet Muhammad ﷺ — the second source of Islamic jurisprudence after the Quran.",
			es: "Un dicho, acción, aprobación tácita o descripción atribuida al Profeta Muhammad ﷺ — la segunda fuente de la jurisprudencia islámica."
		},
		nuances: {
			general: {
				ar: "ما روي عن النبي ﷺ من أقوال وأفعال وتقريرات.",
				en: "What was narrated from the Prophet ﷺ — his sayings, actions, and tacit approvals.",
				es: "Lo narrado del Profeta ﷺ — sus dichos, acciones y aprobaciones tácitas."
			},
			academic: {
				ar: "الحديث يشمل القولي والفعلي والتقريري والوصفي — ويختلف عن السنة (التطبيق العملي) من حيث الاصطلاح الأصولي.",
				en: "Ḥadīth encompasses: qawlī (verbal), fiʿlī (action-based), taqrīrī (tacit approval), and waṣfī (descriptive). Distinct from Sunna (the normative practice derived from ḥadīth). Academic: 'Prophetic tradition' or 'ḥadīth'.",
				es: "El ḥadīth abarca: qawlī (verbal), fiʿlī (basado en acción), taqrīrī (aprobación tácita) y waṣfī (descriptivo)."
			},
			technical: {
				ar: "سند الحديث (سلسلة الرواة) + متن الحديث (النص) — وعلم درجاته: الصحيح، الحسن، الضعيف، الموضوع.",
				en: "ḥadīth structure: isnād (chain of transmitters) + matn (text). Classification by reliability: ṣaḥīḥ (sound), ḥasan (good), ḍaʿīf (weak), mawḍūʿ (fabricated).",
				es: "Estructura del ḥadīth: isnād (cadena de transmisores) + matn (texto). Clasificación: ṣaḥīḥ, ḥasan, ḍaʿīf, mawḍūʿ."
			},
			creative: {
				ar: "صوت النبي ﷺ عبر الزمان — مُتناقَل بالأمانة من صاحب لصاحب حتى وصل إلينا.",
				en: "The Prophet's ﷺ voice across time — passed with fidelity from companion to companion until it reached us.",
				es: "La voz del Profeta ﷺ a través del tiempo — transmitida con fidelidad de compañero en compañero hasta nosotros."
			}
		}
	},
	{
		term: "Authentic Hadith",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الحديث الصحيح",
			en: "Authenticated / Sound Hadith",
			es: "Hadith Auténtico / Sano"
		},
		definitions: {
			ar: "الحديث الذي اتصل سنده بنقل عدل ضابط عن مثله إلى منتهاه دون شذوذ ولا علة.",
			en: "A ḥadīth whose chain of transmission is unbroken, narrated by trustworthy and precise transmitters (ʿadl + ḍābiṭ) without irregularity (shādhdh) or hidden defect (ʿilla).",
			es: "Un ḥadīth cuya cadena de transmisión es ininterrumpida, narrado por transmisores dignos de confianza y precisos, sin irregularidad ni defecto oculto."
		},
		nuances: {
			general: {
				ar: "الحديث الموثوق سنداً ومتناً الذي يُحتج به في الفقه.",
				en: "A reliably transmitted ḥadīth considered authoritative in Islamic jurisprudence.",
				es: "Un ḥadīth transmitido de forma fiable, considerado autoritativo en la jurisprudencia islámica."
			},
			academic: {
				ar: "شروط الحديث الصحيح خمسة: اتصال السند، عدالة الرواة، ضبط الرواة، السلامة من الشذوذ، السلامة من العلة.",
				en: "Five conditions for ṣaḥīḥ: (1) continuous isnād, (2) narrator uprightness (ʿadāla), (3) narrator precision (ḍabṭ), (4) absence of irregularity (shādhdh), (5) absence of hidden defect (ʿilla). Academic: 'sound ḥadīth' or 'authenticated tradition'.",
				es: "Cinco condiciones para ṣaḥīḥ: isnād continua, integridad, precisión del narrador, ausencia de irregularidad y defecto oculto."
			},
			technical: {
				ar: "الصحيح أعلى درجات الحديث — ثم الحسن ثم الضعيف ثم الموضوع.",
				en: "Ṣaḥīḥ is the highest ḥadīth grade, followed by ḥasan (good), ḍaʿīf (weak), and mawḍūʿ (fabricated). Use 'sound' not 'true' (all traditions are ideally transmitted truthfully but vary in reliability).",
				es: "Ṣaḥīḥ es el grado más alto de ḥadīth, seguido de ḥasan, ḍaʿīf y mawḍūʿ."
			},
			creative: {
				ar: "الذهب المُصفَّى من معدن الرواية — ما اجتاز نار النقد ليخرج نقياً.",
				en: "Refined gold from the ore of narration — what has passed through the fire of criticism and emerged pure.",
				es: "Oro refinado del mineral de la narración — lo que ha pasado por el fuego de la crítica y ha emergido puro."
			}
		}
	},
	{
		term: "Chain of Transmission",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "السند",
			en: "Chain of Transmission",
			es: "Cadena de Transmisión"
		},
		definitions: {
			ar: "سلسلة الرواة الذين نقلوا الحديث النبوي من صاحبه إلى المُدوِّن، ويُعدّ علم الإسناد من أدق العلوم الإسلامية وأكثرها تخصصاً.",
			en: "The chain of narrators who transmitted a ḥadīth from its source (the Prophet or Companion) to the compiler — Islamic isnād criticism is regarded as one of the most rigorous systems of source-authentication in world historiography.",
			es: "La cadena de narradores que transmitieron un ḥadīth desde su fuente al compilador — la crítica del isnād es uno de los sistemas más rigurosos de autenticación de fuentes en la historiografía mundial."
		},
		nuances: {
			general: {
				ar: "سلسلة الرواة من النبي ﷺ إلى الكتاب — تضمن صحة النسبة.",
				en: "The chain of narrators from the Prophet ﷺ to the book — guaranteeing authenticity of attribution.",
				es: "La cadena de narradores del Profeta ﷺ al libro — garantizando la autenticidad de la atribución."
			},
			academic: {
				ar: "الإسناد في الحديث أكثر منهجية من معيار إسناد المصادر التاريخية الغربية — يُراعي العدالة والضبط والاتصال.",
				en: "The Islamic isnād system is arguably the most systematic source-citation method in premodern historiography, evaluating narrator reliability (ʿadāla + ḍabṭ), continuity, and textual integrity. Academic: 'isnād', 'chain of transmission', 'chain of authorities'.",
				es: "El sistema isnād islámico es argumentablemente el método más sistemático de cita de fuentes en la historiografía premoderna."
			},
			technical: {
				ar: "السند هو الشكل الرسمي من الرواة — ويُقابله المتن (النص المروي) — والكلاهما يُنتقدان في علم الحديث.",
				en: "Isnād (chain) + matn (text) = the two components of a complete ḥadīth report. Both are subject to ḥadīth criticism (naqd al-ḥadīth). Academic: retain 'isnād' in technical texts.",
				es: "Isnād (cadena) + matn (texto) = los dos componentes de un informe ḥadīth completo. Ambos sujetos a crítica."
			},
			creative: {
				ar: "خيط من الثقة يمتد من فم النبي ﷺ عبر الأجيال حتى يصل إلى يدك — أقوى من أي توثيق كتابي.",
				en: "A thread of trust stretching from the Prophet's ﷺ lips across generations to your hands — more rigorous than any written documentation.",
				es: "Un hilo de confianza que se extiende de los labios del Profeta ﷺ a través de generaciones hasta tus manos."
			}
		}
	},
	{
		term: "Quranic Exegesis",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "التفسير",
			en: "Quranic Exegesis",
			es: "Exégesis Coránica"
		},
		definitions: {
			ar: "علم يُبحث فيه عن أحوال القرآن الكريم من حيث دلالاته، وأسباب نزوله، وناسخه ومنسوخه، وسائر ما يتعلق به.",
			en: "The scholarly discipline of explaining and interpreting the meanings, contexts, occasions of revelation (asbāb al-nuzūl), and intertextual relations of the Quranic text.",
			es: "La disciplina académica de explicar e interpretar los significados, contextos, ocasiones de revelación y relaciones intertextuales del texto coránico."
		},
		nuances: {
			general: {
				ar: "شرح وتفسير معاني القرآن الكريم.",
				en: "The explanation and interpretation of the meanings of the Quran.",
				es: "La explicación e interpretación de los significados del Corán."
			},
			academic: {
				ar: "التفسير يختلف عن التأويل — التفسير يُحدد المعنى بالرواية والسياق، والتأويل يُرجّح معنى مقبولاً بدلاً من آخر.",
				en: "Tafsīr ≠ taʾwīl: Tafsīr establishes meaning through narration and context (riwāya-based); taʾwīl involves preferring one plausible meaning over another (dirāya-based). Academic: 'exegesis', 'Quranic commentary', or 'tafsīr'.",
				es: "Tafsīr ≠ taʾwīl: el tafsīr establece el significado por narración y contexto; el taʾwīl implica preferir un significado plausible sobre otro."
			},
			technical: {
				ar: "الطبقات الكبرى للتفسير: بالمأثور (الطبري)، بالرأي، الصوفي، الفقهي، العلمي، الأدبي.",
				en: "Major tafsīr types: bil-maʾthūr (tradition-based, e.g., al-Ṭabarī), bil-raʾy (reason-based), ṣūfī, fiqhī (legal), ʿilmī (scientific), adabī (literary). Context determines which register applies.",
				es: "Tipos principales de tafsīr: bil-maʾthūr (basado en tradición), bil-raʾy (basado en razón), ṣūfī, fiqhī, ʿilmī, adabī."
			},
			creative: {
				ar: "مصباح يُضاء ليكشف كنوز القرآن المدفونة في طيات ألفاظه.",
				en: "A lantern lit to unearth the treasures of the Quran buried within the folds of its words.",
				es: "Una linterna encendida para desenterrar los tesoros del Corán enterrados en los pliegues de sus palabras."
			}
		}
	},
	{
		term: "Miraculous Inimitability of the Quran",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الإعجاز القرآني",
			en: "Miraculous Inimitability of the Quran",
			es: "Inimitabilidad Milagrosa del Corán"
		},
		definitions: {
			ar: "عجز البشر جميعاً عن الإتيان بمثل القرآن الكريم في بيانه وفصاحته وبلاغته وتشريعاته وإخباره بالغيب، وهو الدليل الكبرى على صدق النبوة المحمدية.",
			en: "The absolute inability of humanity to produce anything matching the Quran in its eloquence, rhetoric, legislative wisdom, and unseen knowledge — the primary evidence of the prophethood of Muhammad ﷺ.",
			es: "La incapacidad absoluta de la humanidad de producir algo igual al Corán en elocuencia, retórica, sabiduría legislativa y conocimiento del misterio."
		},
		nuances: {
			general: {
				ar: "معجزة القرآن في بلاغته وعجز البشر عن مثله.",
				en: "The miracle of the Quran in its eloquence — humanity's inability to match it.",
				es: "El milagro del Corán en su elocuencia — la incapacidad humana de igualarlo."
			},
			academic: {
				ar: "الإعجاز له وجوه متعددة: البياني، التشريعي، العلمي، العددي — وأبرزها البياني (التحدي بعشر سور أو سورة).",
				en: "Quranic iʿjāz has multiple dimensions: bayānī (rhetorical), tashrīʿī (legislative), ʿilmī (scientific), ʿadadī (numerical). The rhetorical is primary (Q. 2:23, 10:38, 11:13). Academic: 'inimitability', 'iʿjāz al-Qurʾān'.",
				es: "El iʿjāz coránico tiene múltiples dimensiones: bayānī (retórico), tashrīʿī (legislativo), ʿilmī (científico), ʿadadī (numérico)."
			},
			technical: {
				ar: "الإعجاز القرآني = التحدي (Q2:23) + العجز = دليل النبوة.",
				en: "Technical formula: iʿjāz = taḥaddī (challenge, Q. 2:23) + ʿajz (inability to match) = proof of prophethood. Render as 'inimitability' (scholarly standard) not just 'miracle'.",
				es: "Fórmula técnica: iʿjāz = taḥaddī (desafío) + ʿajz (incapacidad) = prueba de profetismo."
			},
			creative: {
				ar: "كتاب تعجز الإنسانية جمعاء عن صنع مثله — منذ أربعة عشر قرناً والتحدي قائم.",
				en: "A book that all of humanity has failed to match — fourteen centuries of challenge, and still unanswered.",
				es: "Un libro que toda la humanidad ha fallado en igualar — catorce siglos de desafío, y aún sin respuesta."
			}
		}
	},
	{
		term: "Reliance on God",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "التوكل",
			en: "Reliance on God",
			es: "Confianza en Dios"
		},
		definitions: {
			ar: "الاعتماد الكلي على الله والثقة التامة به في جلب المنافع ودفع المضار، مع استيفاء الأسباب والتعامل بالعقل.",
			en: "Complete reliance on and trust in God for benefit and protection, combined — critically — with the utilization of all available legitimate means (asbāb).",
			es: "Confianza total en Dios para el beneficio y la protección, combinada — críticamente — con la utilización de todos los medios legítimos disponibles."
		},
		nuances: {
			general: {
				ar: "الثقة الكاملة بالله مع الأخذ بالأسباب.",
				en: "Complete trust in God while taking all necessary means.",
				es: "Confianza total en Dios mientras se toman todos los medios necesarios."
			},
			academic: {
				ar: "التوكل ليس الكسل أو ترك الأسباب — وهو خلاف ما يظنه بعضهم — بل اليقين بأن الله هو المسبَّب الأول.",
				en: "Tawakkul does NOT mean abandoning effort or means (tark al-asbāb) — a critical misunderstanding. It means acting diligently then entrusting the outcome entirely to God. Academic: 'reliance on God' (standard), 'trust in God', 'tawakkul'.",
				es: "El tawakkul NO significa abandonar el esfuerzo — significa actuar diligentemente y luego encomendar el resultado a Dios."
			},
			technical: {
				ar: "الفرق بين التوكل (فضيلة) والتواكل (ذم) — الثاني هو ترك الأسباب بدعوى التوكل.",
				en: "Critical distinction: tawakkul (praiseworthy reliance with asbāb) ≠ tawākul (blameworthy passivity under pretence of reliance). The latter is considered a religious deficiency.",
				es: "Distinción crítica: tawakkul (dependencia loable con asbāb) ≠ tawākul (pasividad reprobable bajo pretexto de dependencia)."
			},
			creative: {
				ar: "أن تبذل جهدك كله ثم تُلقي بنتيجتك في بحر القدر بعين راضية — تلك هي حرية الروح الكاملة.",
				en: "To give your utmost effort, then cast the outcome into the sea of divine decree with a contented eye — that is the soul's complete freedom.",
				es: "Dar tu máximo esfuerzo, luego arrojar el resultado al mar del destino divino con un ojo complacido."
			}
		}
	},
	{
		term: "Asceticism",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الزهد",
			en: "Asceticism / Detachment from the World",
			es: "Ascetismo / Desapego del Mundo"
		},
		definitions: {
			ar: "الإعراض عن التعلق بالدنيا وزخرفها مع أخذ الكفاف منها، لا للحرمان بل لتحرير القلب من سلطة الدنيا وتوجيهه نحو الله.",
			en: "Voluntary detachment from worldly attractions and excess — not ascetic deprivation, but the deliberate liberation of the heart from the dominion of material life, orienting it entirely toward God.",
			es: "Desapego voluntario de las atracciones y excesos mundanos — no privación ascética, sino la liberación deliberada del corazón del dominio de la vida material."
		},
		nuances: {
			general: {
				ar: "الزهد في الدنيا والتقليل من التعلق بها.",
				en: "Detachment from worldly life and minimizing attachment to it.",
				es: "Desapego de la vida mundana y minimización del apego a ella."
			},
			academic: {
				ar: "الزهد في الإسلام لا يعني رهبانية — فلا رهبانية في الإسلام (الحديث) — بل إعراض القلب عن الوثوق بالدنيا.",
				en: "Islamic zuhd ≠ monasticism — the Prophet ﷺ explicitly rejected total worldly renunciation. It denotes the heart's non-attachment to wealth/power while legitimately engaging with the world. Academic: 'asceticism', 'renunciation', 'zuhd'.",
				es: "El zuhd islámico ≠ monacato — el Profeta ﷺ rechazó explícitamente la renuncia total mundana."
			},
			technical: {
				ar: "التمييز بين الزهد الخاطئ (ترك العمل والكسب) والزهد الصحيح (عدم التعلق مع الأخذ بالكفاف).",
				en: "Distinguish: false zuhd (abandoning earning/livelihood) vs. correct zuhd (not being controlled by possessions while meeting legitimate needs). The former is criticized in Islamic tradition.",
				es: "Distinción: zuhd falso (abandonar el sustento) vs. zuhd correcto (no ser controlado por las posesiones)."
			},
			creative: {
				ar: "أن تمسك الدنيا بيدك لا بقلبك — فإن فقدتها لم تفقد شيئاً.",
				en: "To hold the world in your hand, not in your heart — so that if you lose it, you lose nothing.",
				es: "Tener el mundo en tu mano, no en tu corazón — para que si lo pierdes, no pierdas nada."
			}
		}
	},
	{
		term: "Spiritual Station of Humility",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الخشوع",
			en: "Reverential Humility / Spiritual Submission",
			es: "Humildad Reverencial / Sumisión Espiritual"
		},
		definitions: {
			ar: "حالة من الخضوع الداخلي والانكسار الروحي أمام الله، تظهر في حضور القلب في العبادة وتجلّيها على الجوارح بالسكينة والوقار.",
			en: "A state of inner submissiveness and spiritual brokenness before God — manifested in the heart's full presence during worship, expressed outwardly in stillness and reverence of the limbs.",
			es: "Un estado de sumisión interior y quebrantamiento espiritual ante Dios — manifestado en la presencia plena del corazón durante la adoración."
		},
		nuances: {
			general: {
				ar: "الخشوع في الصلاة: حضور القلب والتأثر بمعاني العبادة.",
				en: "Khushūʿ in prayer: the heart's presence and being moved by the meanings of worship.",
				es: "Khushūʿ en la oración: la presencia del corazón y ser conmovido por los significados de la adoración."
			},
			academic: {
				ar: "الخشوع مرتبة روحية في القلب تتجلى على الجوارح — ذكر القرآن أهل الخشوع في سياق المؤمنين الكاملين (المؤمنون 2).",
				en: "Khushūʿ is a spiritual station (maqām) of the heart manifested outwardly. The Quran specifically mentions it as a quality of successful believers (Q. 23:2). Academic: 'reverential humility', 'spiritual submission', 'khushūʿ'.",
				es: "Khushūʿ es una estación espiritual del corazón manifestada exteriormente. El Corán lo menciona como cualidad de los creyentes exitosos (C. 23:2)."
			},
			technical: {
				ar: "الفرق بين الخشوع (القلب والجوارح معاً) والخضوع (الجوارح دون القلب بالضرورة).",
				en: "Distinction: khushūʿ = heart + limbs in submission; khudūʿ = limbs only (physical submission without necessarily the inner state). The Quran criticizes khudūʿ without khushūʿ.",
				es: "Distinción: khushūʿ = corazón + miembros en sumisión; khudūʿ = solo miembros (sumisión física sin el estado interior)."
			},
			creative: {
				ar: "اللحظة التي يسقط فيها القناع أمام الله ويُفضي القلب بكل ما فيه من ضعف ورجاء.",
				en: "The moment the mask falls before God, and the heart pours out all its weakness and hope without restraint.",
				es: "El momento en que la máscara cae ante Dios, y el corazón vierte toda su debilidad y esperanza sin restricción."
			}
		}
	},
	{
		term: "Day of Resurrection",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "يوم القيامة",
			en: "The Day of Resurrection",
			es: "El Día de la Resurrección"
		},
		definitions: {
			ar: "اليوم الذي يبعث الله فيه الخلائق من قبورهم ليحاسبهم على أعمالهم ويجزيهم الجنة أو النار، وهو ركن من أركان الإيمان الستة.",
			en: "The Day when God resurrects all creation from their graves for final reckoning of deeds, leading to eternal reward (Paradise) or punishment (Hellfire) — a pillar of Islamic faith.",
			es: "El Día en que Dios resucita a toda la creación de sus tumbas para el ajuste de cuentas final de los hechos, llevando a la recompensa eterna (Paraíso) o al castigo (Infierno)."
		},
		nuances: {
			general: {
				ar: "يوم البعث والحساب الأخير — ركن من أركان الإيمان الستة.",
				en: "The Day of Resurrection and Final Reckoning — one of the Six Pillars of Islamic Faith.",
				es: "El Día de la Resurrección y el Juicio Final — uno de los Seis Pilares de la Fe Islámica."
			},
			academic: {
				ar: "يوم القيامة له أسماء قرآنية متعددة: يوم الدين، يوم الحساب، الساعة، يوم الفصل، يوم الحشر.",
				en: "Yawm al-qiyāma has multiple Quranic names: yawm al-dīn (Day of Judgment), yawm al-ḥisāb (Day of Reckoning), al-sāʿa (The Hour), yawm al-faṣl (Day of Separation), yawm al-ḥashr (Day of Gathering). Academic: 'Day of Resurrection' (standard).",
				es: "Yawm al-qiyāma tiene múltiples nombres coránicos: yawm al-dīn, yawm al-ḥisāb, al-sāʿa, yawm al-faṣl, yawm al-ḥashr."
			},
			technical: {
				ar: "الترجمة الأدق هي «Day of Resurrection» لا «Judgment Day» — لأن «Judgment Day» المسيحي لا يتطابق تماماً مع المفهوم الإسلامي.",
				en: "Prefer 'Day of Resurrection' over 'Judgment Day' (the latter carries specific Christian eschatological connotations). The Islamic concept emphasizes physical resurrection (baʿth), not just judgment.",
				es: "Prefiera 'Día de la Resurrección' sobre 'Día del Juicio' (el último tiene connotaciones escatológicas cristianas específicas)."
			},
			creative: {
				ar: "اليوم الذي يُكشف فيه الغطاء ويُوزن كل شيء — لا ملك ولا جاه، فقط ما قدّمت يداك.",
				en: "The Day the veil is lifted and everything is weighed — no kingdom, no status, only what your hands have offered.",
				es: "El Día en que se levanta el velo y todo se pesa — sin reino, sin estatus, solo lo que tus manos han ofrecido."
			}
		}
	},
	{
		term: "The Intermediate Realm",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "البرزخ",
			en: "The Intermediate Realm",
			es: "El Mundo Intermedio"
		},
		definitions: {
			ar: "العالم الذي تنتقل إليه الأرواح بعد الموت وقبل البعث يوم القيامة، ويختلف فيه حال الأرواح بحسب أعمالها في الدنيا.",
			en: "The intermediate realm between death and resurrection — an intermediate state where souls reside and experience reward or punishment according to their worldly deeds, until the Day of Judgment.",
			es: "El reino intermedio entre la muerte y la resurrección — un estado intermedio donde las almas residen y experimentan recompensa o castigo según sus obras mundanas."
		},
		nuances: {
			general: {
				ar: "الحياة بعد الموت وقبل يوم القيامة — المرحلة الانتقالية.",
				en: "Life after death and before the Day of Resurrection — the transitional stage.",
				es: "La vida después de la muerte y antes del Día de la Resurrección — la etapa de transición."
			},
			academic: {
				ar: "البرزخ ذكر في القرآن (المؤمنون 100) كحاجز بين عالم الموتى والبعث — والعلماء اختلفوا في طبيعة أحواله.",
				en: "Al-barzakh is mentioned in the Quran (Q. 23:100) as a barrier between the realm of the dead and the resurrection. Scholars debate the precise nature of its experiences. Academic: 'intermediate realm', 'isthmus', or 'barzakh' (transliterated).",
				es: "Al-barzakh se menciona en el Corán (C. 23:100) como barrera entre el reino de los muertos y la resurrección."
			},
			technical: {
				ar: "البرزخ يختلف عن «المطهر» (Purgatory) في المسيحية — البرزخ في الإسلام حالة انتظار لا تطهير.",
				en: "Barzakh ≠ Purgatory (Christian concept of purification post-death). In Islamic theology, barzakh is a waiting state, not a purification process. Render as 'intermediate realm' or 'barzakh', not 'purgatory'.",
				es: "Barzakh ≠ Purgatorio (concepto cristiano de purificación post-muerte). En la teología islámica, barzakh es un estado de espera, no un proceso de purificación."
			},
			creative: {
				ar: "العتبة بين الدار الفانية والدار الباقية — عالم آخر يبدأ بأول خطوة خلف باب الموت.",
				en: "The threshold between the perishing abode and the eternal — another world beginning with the first step beyond death's door.",
				es: "El umbral entre la morada perecedera y la eterna — otro mundo que comienza con el primer paso más allá de la puerta de la muerte."
			}
		}
	},
	{
		term: "Ritual Purification",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الطهارة",
			en: "Ritual Purification",
			es: "Purificación Ritual"
		},
		definitions: {
			ar: "رفع الحدث وإزالة النجاسة شرطاً لصحة الصلاة وسائر العبادات التي يُشترط لها الطهارة، وتشمل الوضوء والغسل والتيمم.",
			en: "The state of ritual purity required for prayer and other acts of worship — achieved through wuḍūʾ (partial ablution), ghusl (full-body ritual wash), or tayammum (dry purification with clean earth when water is unavailable).",
			es: "El estado de pureza ritual requerido para la oración y otros actos de adoración — logrado a través de wuḍūʾ, ghusl o tayammum."
		},
		nuances: {
			general: {
				ar: "شرط صحة الصلاة — الوضوء أو الغسل حسب نوع الحدث.",
				en: "A condition for valid prayer — ablution (wuḍūʾ) or full wash (ghusl) depending on the type of ritual impurity.",
				es: "Una condición para la oración válida — ablución (wuḍūʾ) o lavado completo (ghusl)."
			},
			academic: {
				ar: "الطهارة في الفقه الإسلامي نوعان: طهارة حدث (الوضوء والغسل) وطهارة خبث (إزالة النجاسة العينية).",
				en: "Islamic ṭahāra has two categories: ṭahārat al-ḥadath (removing ritual impurity via wuḍūʾ/ghusl) and ṭahārat al-khabath (removing physical impurity/najāsa). Academic: 'ritual purification', 'ritual purity', or 'ṭahāra'.",
				es: "La ṭahāra islámica tiene dos categorías: ṭahārat al-ḥadath (eliminar impureza ritual) y ṭahārat al-khabath (eliminar impureza física)."
			},
			technical: {
				ar: "الوضوء يرفع الحدث الأصغر — والغسل يرفع الحدث الأكبر — والتيمم يقوم مقامهما عند تعذر الماء.",
				en: "Wuḍūʾ removes ḥadath aṣghar (minor ritual impurity); ghusl removes ḥadath akbar (major ritual impurity, e.g., after sexual intercourse, menstruation). Tayammum substitutes both when water is unavailable or harmful.",
				es: "Wuḍūʾ elimina ḥadath aṣghar; ghusl elimina ḥadath akbar. Tayammum sustituye a ambos cuando el agua no está disponible."
			},
			creative: {
				ar: "المسلم يبدأ كل لقاء مع الله بتهيئة الجسد — كإشارة إلى أن الحضور بين يديه يستدعي كمال الاستعداد.",
				en: "The Muslim begins every encounter with God by preparing the body — a signal that standing in divine presence demands utmost readiness.",
				es: "El musulmán comienza cada encuentro con Dios preparando el cuerpo — una señal de que estar en presencia divina exige la máxima disposición."
			}
		}
	},
	{
		term: "Call to Prayer",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الأذان",
			en: "The Call to Prayer",
			es: "El Llamado a la Oración"
		},
		definitions: {
			ar: "النداء الذي يُعلَن به دخول وقت الصلاة بألفاظ محددة شرعاً يُؤذَّن بها للصلوات الخمس المفروضة وصلاة الجمعة.",
			en: "The ritual call to prayer announcing the onset of each of the five daily prayers — performed in prescribed Arabic phrases from a mosque minaret or other elevated position.",
			es: "El llamado ritual a la oración que anuncia el inicio de cada una de las cinco oraciones diarias — realizado en frases árabes prescritas desde un minarete de mezquita."
		},
		nuances: {
			general: {
				ar: "النداء بدخول وقت الصلاة.",
				en: "The call announcing the time for prayer has begun.",
				es: "El llamado que anuncia que ha comenzado el tiempo de oración."
			},
			academic: {
				ar: "الأذان يتضمن 15 جملة مُكررة بالترتيب — والإقامة تُقال عند الشروع في الصلاة وهي أقصر.",
				en: "The adhān comprises 15 prescribed phrases (with repetitions) announcing prayer time; the iqāma (15 phrases) is the inner call announcing prayer commencement. Academic: 'call to prayer', 'adhān' (transliterated).",
				es: "El adhān comprende 15 frases prescritas anunciando la hora de oración; la iqāma es el llamado interior que anuncia el inicio de la oración."
			},
			technical: {
				ar: "الأذان ≠ الإقامة: الأذان إعلام للعموم، والإقامة إعلام بالشروع في الصلاة.",
				en: "Adhān (public announcement) ≠ iqāma (commencement announcement). The first calls worshippers to the mosque; the second signals the prayer is about to begin for those already present.",
				es: "Adhān (anuncio público) ≠ iqāma (anuncio de inicio). El primero llama a los adoradores a la mezquita; el segundo señala que la oración está por comenzar."
			},
			creative: {
				ar: "خمس مرات في اليوم يُشق صمت العالم بصوت «الله أكبر» — دعوة الخالق لخلقه أن يعودوا إليه.",
				en: "Five times a day the silence of the world is split by 'Allāhu Akbar' — the Creator's invitation for His creation to return.",
				es: "Cinco veces al día el silencio del mundo es roto por 'Allāhu Akbar' — la invitación del Creador a Su creación para que regrese."
			}
		}
	},
	{
		term: "The Most Gracious",
		pos: "proper noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الرحمن",
			en: "The Most Gracious / The Most Merciful",
			es: "El Misericordioso / El Compasivo"
		},
		definitions: {
			ar: "اسم من أسماء الله الحسنى يدل على سعة رحمته الشاملة لجميع الخلق في الدنيا — وهو مقترن دائماً بـ «الرحيم» في البسملة.",
			en: "One of God's Most Beautiful Names — denoting His encompassing mercy extending to all creation in this world, paired always with al-Raḥīm in the Basmala.",
			es: "Uno de los Nombres Más Bellos de Dios — que denota Su misericordia abarcadora que se extiende a toda la creación en este mundo."
		},
		nuances: {
			general: {
				ar: "اسم من أسماء الله يدل على الرحمة الواسعة الشاملة.",
				en: "One of God's names denoting His expansive, all-encompassing mercy.",
				es: "Uno de los nombres de Dios que denota Su misericordia amplia y abarcadora."
			},
			academic: {
				ar: "الرحمن رحمة واسعة عامة في الدنيا للمؤمن والكافر — والرحيم رحمة خاصة للمؤمنين في الآخرة.",
				en: "Al-Raḥmān (intensive form of raḥma) denotes the expansive mercy encompassing all creation in this life — Muslim and non-Muslim alike. Al-Raḥīm denotes the specific mercy reserved for believers in the Hereafter. Academic: 'the Most Gracious' or 'the Compassionate'.",
				es: "Al-Raḥmān denota la misericordia expansiva que abarca a toda la creación en esta vida. Al-Raḥīm denota la misericordia específica reservada para los creyentes en el Más Allá."
			},
			technical: {
				ar: "الرحمن لا يُستخدم كوصف للبشر في الاصطلاح الإسلامي — بخلاف الرحيم.",
				en: "Al-Raḥmān is exclusively a divine name in Islamic usage — it is not applied to humans (unlike raḥīm which can describe a person). Render as 'the Most Gracious' or 'the All-Compassionate'.",
				es: "Al-Raḥmān es exclusivamente un nombre divino en el uso islámico — no se aplica a los seres humanos (a diferencia de raḥīm)."
			},
			creative: {
				ar: "الاسم الذي يُصف بحر رحمة الله التي لا ساحل لها والتي يسبح فيها كل المخلوقات.",
				en: "The name describing God's ocean of mercy without shore — in which all creation swims, believer and disbeliever alike.",
				es: "El nombre que describe el océano de misericordia de Dios sin orilla — en el que toda la creación nada."
			}
		}
	},
	{
		term: "Supplication",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الدعاء",
			en: "Supplication / Personal Prayer",
			es: "Súplica / Oración Personal"
		},
		definitions: {
			ar: "مناجاة العبد ربه وطلبه منه ما يحتاجه من خير ودفع شر — وهو عبادة قلبية ولسانية، ووصفه النبي ﷺ بأنه «مخ العبادة».",
			en: "The servant's direct conversation and petition to God — asking for good and protection from harm. The Prophet ﷺ described it as 'the marrow of worship', making it one of the most intimate forms of Islamic devotion.",
			es: "La conversación y petición directa del siervo a Dios — pidiendo bien y protección del daño. El Profeta ﷺ lo describió como 'la médula de la adoración'."
		},
		nuances: {
			general: {
				ar: "طلب العبد من الله ما يحتاجه بقلب صادق.",
				en: "The servant's petition to God for what is needed, with a sincere heart.",
				es: "La petición del siervo a Dios por lo que necesita, con corazón sincero."
			},
			academic: {
				ar: "الدعاء يختلف عن الصلاة (العبادة المقننة) — هو تواصل قلبي حر مباشر مع الله بلا صيغة مقررة.",
				en: "Duʿāʾ ≠ ṣalāt: Duʿāʾ is free, spontaneous personal prayer/supplication without fixed form; ṣalāt is the prescribed ritual prayer. Academic: 'supplication', 'invocation', 'personal prayer', or 'duʿāʾ'.",
				es: "Duʿāʾ ≠ ṣalāt: el duʿāʾ es oración/súplica personal libre y espontánea sin forma fija; el ṣalāt es la oración ritual prescrita."
			},
			technical: {
				ar: "يجب التمييز دائماً بين الدعاء والصلاة في الترجمة — فـ«prayer» في الإنجليزية يعني كلاهما، وهذا مُلتبس.",
				en: "English 'prayer' ambiguously covers both ṣalāt (ritual) and duʿāʾ (personal supplication). Always clarify: use 'ritual prayer' for ṣalāt and 'supplication' or 'personal prayer' for duʿāʾ.",
				es: "La 'oración' en inglés cubre ambiguamente tanto ṣalāt (ritual) como duʿāʾ (súplica personal). Siempre clarificar."
			},
			creative: {
				ar: "لحظة الصدق المطلق — حين تتكلم الروح مع خالقها بكل ما تخفيه ولا تجرؤ على البوح به لأحد.",
				en: "The moment of absolute honesty — when the soul speaks to its Creator with everything it hides and dares not tell anyone else.",
				es: "El momento de honestidad absoluta — cuando el alma habla a su Creador con todo lo que esconde y no se atreve a decir a nadie más."
			}
		}
	},
	{
		term: "The Companions of the Prophet",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الصحابة",
			en: "The Companions of the Prophet",
			es: "Los Compañeros del Profeta"
		},
		definitions: {
			ar: "كل من لقي النبي محمد ﷺ مؤمناً به ومات على الإسلام — وهم النموذج الأول للتطبيق الإسلامي ومصدر كبير من مصادر السنة.",
			en: "Every person who met the Prophet Muhammad ﷺ as a believer and died as a Muslim — the primary living models of Islamic practice and the primary transmitters of the Prophetic Sunnah.",
			es: "Toda persona que conoció al Profeta Muhammad ﷺ como creyente y murió como musulmán — los primeros modelos vivos de la práctica islámica."
		},
		nuances: {
			general: {
				ar: "أصحاب النبي ﷺ الذين صحبوه ونقلوا عنه السنة.",
				en: "The Prophet's ﷺ companions who transmitted the Sunnah.",
				es: "Los compañeros del Profeta ﷺ que transmitieron la Sunnah."
			},
			academic: {
				ar: "تعريف الصحابي: لقاء النبي ﷺ مؤمناً ومات على الإسلام — ولو طالت الصحبة أو قصرت.",
				en: "Juristic definition of ṣaḥābī: one who met the Prophet ﷺ as a believer (even briefly) and died as a Muslim. Their number is estimated at 100,000+. Academic: 'Companions', 'ṣaḥāba' (transliterated).",
				es: "Definición jurística de ṣaḥābī: quien conoció al Profeta ﷺ como creyente y murió como musulmán. Su número se estima en más de 100,000."
			},
			technical: {
				ar: "الصحابة ≠ التابعون: الصحابة لقوا النبي ﷺ — والتابعون لقوا الصحابة.",
				en: "Ṣaḥāba (Companions) ≠ Tābiʿūn (Successors): Companions met the Prophet ﷺ; Successors met the Companions. The third generation are the Atbāʿ al-Tābiʿīn. These three generations are the salaf al-ṣāliḥ.",
				es: "Ṣaḥāba (Compañeros) ≠ Tābiʿūn (Sucesores): los Compañeros conocieron al Profeta; los Sucesores conocieron a los Compañeros."
			},
			creative: {
				ar: "جيل لم يُشبَه بمثله — عاشوا مع النبي ﷺ وحملوا الإسلام إلى أصقاع الأرض بأرواحهم ودمائهم.",
				en: "A generation without parallel — who lived alongside the Prophet ﷺ and carried Islam to the ends of the earth with their very souls and blood.",
				es: "Una generación sin paralelo — que vivió junto al Profeta ﷺ y llevó el Islam a los confines de la tierra con sus almas y sangre."
			}
		}
	},
	{
		term: "The Migration to Medina",
		pos: "noun",
		domain: ["religious", "academic"],
		translations: {
			ar: "الهجرة",
			en: "The Migration to Medina",
			es: "La Migración a Medina"
		},
		definitions: {
			ar: "هجرة النبي محمد ﷺ ومن معه من مكة المكرمة إلى المدينة المنورة عام 622م — وهي حدث محوري في التاريخ الإسلامي وبداية التقويم الهجري.",
			en: "The Prophet Muhammad's ﷺ migration from Mecca to Medina in 622 CE — the pivotal event that marked the beginning of the Islamic community (umma) as a political entity and the start of the Islamic Hijri calendar.",
			es: "La migración del Profeta Muhammad ﷺ de La Meca a Medina en 622 d.C. — el evento crucial que marcó el inicio de la comunidad islámica (umma) como entidad política."
		},
		nuances: {
			general: {
				ar: "سفر النبي ﷺ من مكة إلى المدينة وبداية التاريخ الهجري.",
				en: "The Prophet's ﷺ journey from Mecca to Medina, marking the start of the Islamic Hijri calendar.",
				es: "El viaje del Profeta ﷺ de La Meca a Medina, marcando el inicio del calendario islámico Hijri."
			},
			academic: {
				ar: "الهجرة نقطة التحول من الدعوة السرية والعلنية إلى قيام الدولة والمجتمع الإسلامي بمفهومه الشامل.",
				en: "The hijra marks the transition from the Meccan period (prophetic proclamation) to the Medinan period (community formation and Islamic polity). The Hijri calendar begins from this event (1 AH = 622 CE). Academic: 'the Hijra' or 'the Migration'.",
				es: "La hijra marca la transición del período mequí (proclamación profética) al período medinés (formación comunitaria y política islámica)."
			},
			technical: {
				ar: "«هجرة» (الاسم) من «هجر» (الفعل) = المفارقة والانتقال. في الاصطلاح الديني خاصة بهجرة النبي ﷺ.",
				en: "Root: h-j-r (to leave, abandon). In Islamic usage, hijra specifically refers to the Prophetic migration of 622 CE. Academic: 'the Hijra' (capitalized) for this specific event; 'hijra' (lowercase) for the general concept of migration for religious reasons.",
				es: "Raíz: h-j-r (dejar, abandonar). En el uso islámico, hijra se refiere específicamente a la migración profética del 622 d.C."
			},
			creative: {
				ar: "الخطوة التي حولت دعوة إلى دولة، وجماعة مضطهدة إلى أمة، وحلماً إلى حضارة.",
				en: "The step that turned a call into a nation, a persecuted community into an umma, a dream into a civilization.",
				es: "El paso que convirtió una llamada en una nación, una comunidad perseguida en una umma, un sueño en una civilización."
			}
		}
	}
];
var RELIGIOUS_GLOSSARY = [
	{
		arabic: "التقوى",
		transliteration: "taqwā",
		preferred_en: "God-consciousness",
		alternate_en: [
			"piety",
			"mindfulness of God",
			"fear of God",
			"devoutness"
		],
		rationale: "التقوى تجمع أبعاداً متعددة: الخشية والالتزام والمراقبة والتزكية. لا توجد ترجمة مفردة تستوعبها كاملاً.",
		scholarly_source: "Abdel Haleem (Oxford), Sahih International, Hans Wehr",
		caution: "تجنب «fear» وحدها — فهي لا تعكس بُعد الرجاء والحب في التقوى.",
		category: "core-theology"
	},
	{
		arabic: "الغيب",
		transliteration: "al-ghayb",
		preferred_en: "the Unseen",
		alternate_en: [
			"the Imperceivable",
			"things beyond the reach of perception",
			"the hidden reality"
		],
		rationale: "الغيب في القرآن مصطلح تقني محدد لكل ما يتجاوز حدود الإدراك البشري المباشر.",
		scholarly_source: "Pickthall, Muhammad Asad (The Message of the Quran), Abdel Haleem",
		category: "core-theology"
	},
	{
		arabic: "الإحسان",
		transliteration: "iḥsān",
		preferred_en: "spiritual excellence",
		alternate_en: [
			"perfection of worship",
			"beautiful conduct",
			"benevolence",
			"virtue"
		],
		rationale: "الإحسان يجمع أعلى مراتب الدين — والترجمة تعتمد على السياق: روحي أم اجتماعي.",
		scholarly_source: "Fethullah Gülen, Seyyed Hossein Nasr, Abdel Haleem",
		category: "core-theology"
	},
	{
		arabic: "الذكر",
		transliteration: "dhikr",
		preferred_en: "remembrance of God",
		alternate_en: [
			"invocation",
			"litany",
			"divine remembrance"
		],
		rationale: "الذكر يشمل القولي والقلبي والعملي — والسياق يحدد الترجمة المناسبة.",
		scholarly_source: "Louis Massignon, Annemarie Schimmel, Ibn ʿAṭāʾ Allāh al-Iskandarī",
		category: "core-theology"
	},
	{
		arabic: "الشهادتان",
		transliteration: "al-shahādatān",
		preferred_en: "the Two Testimonies",
		alternate_en: [
			"the Profession of Faith",
			"the Declaration of Faith",
			"the Shahāda"
		],
		rationale: "الشهادتان معاً هما مفتاح الإسلام — الأولى للتوحيد والثانية للرسالة.",
		scholarly_source: "Sahih International, Oxford Dictionary of Islam",
		category: "pillars"
	},
	{
		arabic: "الصلاة",
		transliteration: "ṣalāt",
		preferred_en: "ritual prayer",
		alternate_en: [
			"canonical prayer",
			"prayer",
			"the prayer"
		],
		rationale: "«الصلاة» مصطلح تقني للعبادة المقننة — يختلف عن «الدعاء» (الدعاء الحر).",
		scholarly_source: "Abdel Haleem, Sahih International, Yusuf Ali",
		caution: "تجنب «prayer» وحدها دون توصيف — فهي تعني الدعاء أيضاً بالإنجليزية.",
		category: "pillars"
	},
	{
		arabic: "الزكاة",
		transliteration: "zakāt",
		preferred_en: "obligatory almsgiving",
		alternate_en: [
			"obligatory alms",
			"almsgiving",
			"zakāt"
		],
		rationale: "الزكاة ليست صدقة طوعية بل واجب ديني مالي بنسبة وشروط محددة.",
		scholarly_source: "Kamali (Islamic Finance), Yusuf al-Qaradawi",
		caution: "تجنب «charity» وحدها — الزكاة واجبة وليست تطوعاً.",
		category: "pillars"
	},
	{
		arabic: "الصيام",
		transliteration: "ṣiyām",
		preferred_en: "fasting",
		alternate_en: ["Ramadan fasting", "ṣawm"],
		rationale: "الصيام الإسلامي عبادة ذات أبعاد جسدية وروحية لا تُختزل في الامتناع عن الطعام فقط.",
		scholarly_source: "Abdel Haleem, Sahih International",
		category: "pillars"
	},
	{
		arabic: "الحج",
		transliteration: "ḥajj",
		preferred_en: "pilgrimage to Mecca",
		alternate_en: [
			"the pilgrimage",
			"the Hajj",
			"major pilgrimage"
		],
		rationale: "الحج له مناسك دقيقة محددة — يختلف عن العمرة (الحج الأصغر).",
		scholarly_source: "Oxford Dictionary of Islam, F.E. Peters (The Hajj)",
		caution: "الحج ≠ العمرة: الحج بمواقيت، العمرة في أي وقت.",
		category: "pillars"
	},
	{
		arabic: "فتوى",
		transliteration: "fatwā",
		preferred_en: "legal opinion",
		alternate_en: [
			"juristic ruling",
			"religious decree",
			"religious edict",
			"formal legal opinion"
		],
		rationale: "الفتوى رأي استشاري في الغالب وليست حكماً ملزماً — ويختلف ذلك عن القضاء.",
		scholarly_source: "Wael Hallaq (History of Islamic Legal Theories), Norman Calder",
		caution: "تجنب «edict» وحدها — تحمل إيحاء الإلزام الذي لا ينطبق على معظم الفتاوى.",
		category: "jurisprudence"
	},
	{
		arabic: "الشريعة",
		transliteration: "sharīʿa",
		preferred_en: "Islamic law",
		alternate_en: [
			"divine law",
			"Islamic legal path",
			"the Way"
		],
		rationale: "الشريعة أشمل من «القانون» — تضم العبادات والأخلاق والمعاملات الاجتماعية.",
		scholarly_source: "Joseph Schacht, Wael Hallaq, John Esposito",
		caution: "لا تُساوَى بـ «criminal law» أو «penal code» — هذا تبسيط مُضلل.",
		category: "jurisprudence"
	},
	{
		arabic: "الاجتهاد",
		transliteration: "ijtihād",
		preferred_en: "independent legal reasoning",
		alternate_en: ["independent juristic reasoning", "independent judgment"],
		rationale: "الاجتهاد عملية استنباطية لأحكام جديدة — وليس مجرد تأويل للنصوص.",
		scholarly_source: "Wael Hallaq (Was the Gate of Ijtihad Closed?), Mohammad Hashim Kamali",
		category: "jurisprudence"
	},
	{
		arabic: "الإجماع",
		transliteration: "ijmāʿ",
		preferred_en: "scholarly consensus",
		alternate_en: ["juristic agreement", "consensus of jurists"],
		rationale: "درجة الاتفاق المطلوبة في الإجماع محل خلاف — لذا «scholarly» أدق من «unanimous».",
		scholarly_source: "Mohammad Hashim Kamali (Principles of Islamic Jurisprudence)",
		category: "jurisprudence"
	},
	{
		arabic: "القياس",
		transliteration: "qiyās",
		preferred_en: "analogical reasoning",
		alternate_en: ["legal analogy", "analogical deduction"],
		rationale: "القياس يقوم على علة مشتركة بين الأصل والفرع — وهو المصدر الرابع للفقه.",
		scholarly_source: "Kamali, Hallaq, Schacht",
		category: "jurisprudence"
	},
	{
		arabic: "الحديث النبوي",
		transliteration: "ḥadīth nabawī",
		preferred_en: "Prophetic tradition",
		alternate_en: ["Prophetic narration", "ḥadīth"],
		rationale: "الحديث النبوي المصدر الثاني للتشريع — يشمل القول والفعل والتقرير والصفة.",
		scholarly_source: "Ignaz Goldziher, G.H.A. Juynboll, Jonathan Brown",
		category: "hadith-sciences"
	},
	{
		arabic: "السند",
		transliteration: "isnād",
		preferred_en: "chain of transmission",
		alternate_en: [
			"chain of authorities",
			"chain of narrators",
			"isnād"
		],
		rationale: "علم الإسناد من أدق علوم الإسلام — يُقيّم موثوقية الرواة عبر الأجيال.",
		scholarly_source: "Harald Motzki, G.H.A. Juynboll, Jonathan Brown",
		category: "hadith-sciences"
	},
	{
		arabic: "التفسير",
		transliteration: "tafsīr",
		preferred_en: "Quranic exegesis",
		alternate_en: [
			"Quranic commentary",
			"Quranic interpretation",
			"tafsīr"
		],
		rationale: "التفسير ≠ التأويل: التفسير يُحدد المعنى بالرواية، التأويل يُرجّح بين المعاني.",
		scholarly_source: "Jane McAuliffe (Encyclopaedia of the Quran), Nasr (The Study Quran)",
		category: "quran-sciences"
	},
	{
		arabic: "الإعجاز القرآني",
		transliteration: "iʿjāz al-Qurʾān",
		preferred_en: "Quranic inimitability",
		alternate_en: ["miraculous inimitability", "the challenge of the Quran"],
		rationale: "الإعجاز دليل النبوة من خلال عجز البشر الكلي عن الإتيان بمثل القرآن.",
		scholarly_source: "Mustafa Sadiq al-Rafii, Sayyid Qutb, Suyuti",
		category: "quran-sciences"
	},
	{
		arabic: "التوكل",
		transliteration: "tawakkul",
		preferred_en: "reliance on God",
		alternate_en: [
			"trust in God",
			"complete trust",
			"tawakkul"
		],
		rationale: "التوكل لا يعني ترك الأسباب — بل الجمع بين الأخذ بالأسباب والثقة بالله.",
		scholarly_source: "Ibn al-Qayyim (Madarij al-Salikin), Al-Ghazali (Ihya Ulum al-Din)",
		caution: "تجنب الترجمة الخاطئة كـ«fatalism» — التوكل لا يعني القدرية أو الكسل.",
		category: "sufism"
	},
	{
		arabic: "الزهد",
		transliteration: "zuhd",
		preferred_en: "asceticism",
		alternate_en: [
			"detachment from the world",
			"renunciation",
			"zuhd"
		],
		rationale: "الزهد الإسلامي ليس رهبانية — بل عدم تعلق القلب بالدنيا مع المشاركة الطبيعية بها.",
		scholarly_source: "Ibn al-Qayyim, Al-Ghazali, Schimmel (Mystical Dimensions of Islam)",
		caution: "لا تُترجم بـ«monasticism» — الإسلام رفض الرهبانية صراحةً.",
		category: "sufism"
	},
	{
		arabic: "الخشوع",
		transliteration: "khushūʿ",
		preferred_en: "reverential humility",
		alternate_en: [
			"spiritual submission",
			"inner reverence",
			"devout concentration"
		],
		rationale: "الخشوع جمع بين حال القلب والجوارح — فريد في دلالته ولا يكافئه مصطلح مفرد.",
		scholarly_source: "Ibn al-Qayyim (Al-Wabil al-Sayyib), Seyyed Hossein Nasr",
		category: "sufism"
	},
	{
		arabic: "يوم القيامة",
		transliteration: "yawm al-qiyāma",
		preferred_en: "the Day of Resurrection",
		alternate_en: [
			"the Day of Judgment",
			"the Last Day",
			"the Day of Reckoning"
		],
		rationale: "«يوم القيامة» أشمل من «Judgment Day» — يشمل البعث والحشر والحساب والجزاء.",
		scholarly_source: "Abdel Haleem, Sahih International, Muhammad Asad",
		caution: "«Judgment Day» وحدها قد تحمل دلالات مسيحية لا تنطبق على المفهوم الإسلامي.",
		category: "eschatology"
	},
	{
		arabic: "البرزخ",
		transliteration: "al-barzakh",
		preferred_en: "the intermediate realm",
		alternate_en: [
			"the isthmus",
			"the barrier",
			"the realm between death and resurrection"
		],
		rationale: "البرزخ حالة انتظار روحية لا تطهير — يختلف عن «Purgatory» المسيحي.",
		scholarly_source: "Ibn al-Qayyim (Kitab al-Ruh), Suyuti",
		caution: "لا يُترجم بـ«Purgatory» — ذلك مصطلح مسيحي له مفهوم مختلف تماماً.",
		category: "eschatology"
	},
	{
		arabic: "الطهارة",
		transliteration: "ṭahāra",
		preferred_en: "ritual purification",
		alternate_en: [
			"ritual purity",
			"ablution",
			"ṭahāra"
		],
		rationale: "الطهارة شرط صحة الصلاة — وتشمل الوضوء والغسل والتيمم.",
		scholarly_source: "Ibn Qudama (Al-Mughni), Al-Nawawi (Rawdat al-Talibin)",
		category: "ritual"
	},
	{
		arabic: "الأذان",
		transliteration: "adhān",
		preferred_en: "call to prayer",
		alternate_en: [
			"the adhān",
			"the call",
			"Islamic call to prayer"
		],
		rationale: "الأذان يُعلن دخول وقت الصلاة — ويختلف عن الإقامة (إعلان الشروع).",
		scholarly_source: "Bukhari, Muslim (في باب الأذان), Ibn Hajar Al-Asqalani",
		category: "ritual"
	},
	{
		arabic: "الدعاء",
		transliteration: "duʿāʾ",
		preferred_en: "supplication",
		alternate_en: [
			"personal prayer",
			"invocation",
			"petition to God"
		],
		rationale: "الدعاء مناجاة حرة وشخصية — يختلف عن الصلاة (العبادة المقننة).",
		scholarly_source: "Ibn al-Qayyim (Al-Jawab al-Kafi), Al-Nawawi (Al-Adhkar)",
		caution: "لا تُترجم بـ«prayer» وحدها — التمييز بين الصلاة والدعاء ضروري.",
		category: "ritual"
	}
];
var ALL_DICTIONARIES = [
	...LINGUISTICS_DICT,
	...TECH_DICT,
	...MEDICAL_DICT,
	...LEGAL_DICT,
	...GENERAL_DICT,
	...RELIGIOUS_DICT
];
function getDictionaryByDomain(domain) {
	if (domain === "all") return ALL_DICTIONARIES;
	return ALL_DICTIONARIES.filter((entry) => entry.domain.includes(domain));
}
/**
* Searches input text for dictionary terms (supports N-Grams and phrase matching).
* It sorts matches by length so multi-word terms take precedence over single words.
*/
function findDictionaryMatches(text, tone, domain = "all") {
	if (!text) return [];
	const normalizedText = text.toLowerCase();
	return [...getDictionaryByDomain(domain)].sort((a, b) => b.term.length - a.term.length).filter((entry) => {
		const arTerm = entry.translations.ar;
		const enTerm = entry.translations.en.toLowerCase();
		const esTerm = entry.translations.es.toLowerCase();
		const enRegex = new RegExp(`\\b${enTerm}\\b`, "i");
		const esRegex = new RegExp(`\\b${esTerm}\\b`, "i");
		const matchesEn = enRegex.test(normalizedText);
		const matchesEs = esRegex.test(normalizedText);
		const matchesAr = normalizedText.includes(arTerm);
		return matchesEn || matchesEs || matchesAr;
	});
}
//#endregion
export { decryptData as a, sanitizeInput as c, TECH_GLOSSARY as i, MEDICAL_GLOSSARY as n, encryptData as o, RELIGIOUS_GLOSSARY as r, findDictionaryMatches as s, LEGAL_GLOSSARY as t };
