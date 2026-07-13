import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as diagnosticService, t as cn } from "./utils-C2plKBZU.mjs";
import { A as ChartNoAxesColumn, C as History, D as ChevronLeft, E as ChevronRight, M as BookOpen, N as BookCopy, O as ChevronDown, P as ArrowLeftRight, S as Info, T as ChevronUp, _ as Mic, b as Lock, c as Sun, f as RotateCcw, g as Microscope, h as Moon, i as Volume2, k as Check, l as Sparkles, m as PenLine, n as ZoomIn, r as Wrench, s as Trash2, t as ZoomOut, u as Shuffle, v as MicOff, w as Copy, x as Languages, y as Mail } from "../_libs/lucide-react.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-t5xYbcJQ.mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { a as decryptData, c as sanitizeInput, i as TECH_GLOSSARY, n as MEDICAL_GLOSSARY, o as encryptData, r as RELIGIOUS_GLOSSARY, s as findDictionaryMatches, t as LEGAL_GLOSSARY } from "./dictionary-DBUIZZWv.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
import { t as three_default } from "../_libs/compromise+[...].mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DkGNkNEt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TONES = [
	{
		value: "general",
		label: "عامة",
		hint: "ترجمة يومية طبيعية"
	},
	{
		value: "academic",
		label: "أكاديمية",
		hint: "دقيقة، بحثية، رسمية"
	},
	{
		value: "technical",
		label: "تقنية",
		hint: "برمجية وهندسية"
	},
	{
		value: "creative",
		label: "إبداعية",
		hint: "أدبية وبلاغية"
	}
];
var LANGUAGES = [
	{
		code: "auto",
		name: "كشف تلقائي",
		en: "Auto-detect",
		es: "Auto-detectar"
	},
	{
		code: "ar",
		name: "العربية",
		en: "Arabic",
		es: "Árabe"
	},
	{
		code: "en",
		name: "الإنجليزية",
		en: "English",
		es: "Inglés"
	},
	{
		code: "es",
		name: "الإسبانية",
		en: "Spanish",
		es: "Español"
	}
];
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var InputSchema = objectType({
	text: stringType().min(1).max(5e3),
	source: enumType([
		"auto",
		"ar",
		"en",
		"es"
	]),
	target: enumType([
		"ar",
		"en",
		"es"
	]),
	tone: enumType([
		"general",
		"academic",
		"technical",
		"creative"
	]),
	domain: enumType([
		"all",
		"linguistics",
		"tech",
		"medical",
		"legal",
		"general",
		"religious",
		"academic"
	]).default("all")
});
var RephraseSchema = objectType({ text: stringType().min(1).max(5e3) });
var translateText = createServerFn({ method: "POST" }).validator((data) => {
	try {
		return InputSchema.parse(data);
	} catch (e) {
		throw new Error("Invalid request data format");
	}
}).handler(createSsrRpc("923a5261ae4ef344d627d5738bf40c7cf9d0d2df09dff176b88978a9a856c370"));
var rephraseText = createServerFn({ method: "POST" }).validator((data) => {
	try {
		return RephraseSchema.parse(data);
	} catch (e) {
		throw new Error("Invalid request data format");
	}
}).handler(createSsrRpc("c9223e788378c4da8b3382ca5a7173aff91e27f045625ad9151d854469abed7a"));
function initTheme() {
	if (typeof window === "undefined") return;
	const stored = localStorage.getItem("theme");
	const isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
	document.documentElement.classList.toggle("dark", isDark);
}
function toggleTheme() {
	const isDark = document.documentElement.classList.toggle("dark");
	localStorage.setItem("theme", isDark ? "dark" : "light");
	return isDark;
}
function getTheme() {
	if (typeof document === "undefined") return "light";
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
var UI_TRANSLATIONS = {
	ar: {
		brand: "لُغَوي",
		brandSubtitle: "ترجمة نصوص بسياق ذكي",
		beta: "نسخة تجريبية",
		textTab: "ترجمة النصوص",
		filesTab: "ترجمة الملفات",
		soon: "قريباً",
		originalText: "النص الأصلي",
		translation: "الترجمة",
		textareaPlaceholder: "اكتب أو ألصق النص هنا للترجمة الفورية…",
		outputPlaceholder: "ستظهر الترجمة هنا فور كتابتك.",
		translating: "جاري الترجمة…",
		sidebarTitle: "المصطلحات والفروق اللغوية",
		sidebarPlaceholder: "عند الترجمة، ستظهر هنا أبرز المصطلحات في النص مع شرح مختصر يتناسب مع النبرة المختارة.",
		historyTitle: "سجل الترجمة",
		clearHistory: "مسح السجل",
		emptyHistory: "لا توجد ترجمات محفوظة بعد. تُحفَظ ترجماتك تلقائياً في متصفحك بشكل آمن ومشفّر.",
		detectedLang: "اللغة المكتشفة",
		words: "كلمة",
		chars: "حرف",
		toneLabel: "نبرة",
		listen: "استماع",
		copy: "نسخ",
		copied: "تم النسخ!",
		filesComingSoonTitle: "ترجمة الملفات — PDF و DOCX",
		filesComingSoonBadge: "ميزة قادمة قريباً",
		filesComingSoonDesc: "ارفع مستنداتك واحصل على ترجمة كاملة مع الحفاظ على التنسيق الأصلي قدر الإمكان. الميزة قيد التطوير، ويمكنك تجربة رفع الملفات الآن استعداداً للإطلاق.",
		dragDrop: "اسحب وأفلت ملفاتك هنا",
		or: "أو",
		chooseFiles: "اختر ملفات",
		supportedFormats: "الصيغ المدعومة: PDF · DOCX · DOC — حتى 20MB لكل ملف",
		pendingFilesHeader: "سيتم إرسال هذه الملفات إلى محرك الترجمة فور إطلاق الميزة:",
		footerText: "جميع الحقوق محفوظة © 2026 nrajmi | منصة لغوي للترجمة الذكية المشفرة محلياً.",
		historyLimitAlert: "يتم تخزين آخر 30 ترجمة بشكل آمن ومحمي بـ AES-GCM.",
		generalTone: "عامة",
		academicTone: "أكاديمية",
		technicalTone: "تقنية",
		creativeTone: "إبداعية",
		generalToneHint: "ترجمة يومية طبيعية",
		academicToneHint: "دقيقة، بحثية، رسمية",
		technicalToneHint: "برمجية وهندسية",
		creativeToneHint: "أدبية وبلاغية",
		testMissingKeyDaemon: "أنا أحب برمجة شياطين الشفاء الذاتي"
	},
	en: {
		brand: "Lughawi",
		brandSubtitle: "Smart contextual translation",
		beta: "Beta",
		textTab: "Text Translation",
		filesTab: "File Translation",
		soon: "Soon",
		originalText: "Source Text",
		translation: "Translation",
		textareaPlaceholder: "Type or paste text here for instant translation...",
		outputPlaceholder: "Translation will appear here as you type.",
		translating: "Translating...",
		sidebarTitle: "Linguistic Auxiliary Tools",
		sidebarPlaceholder: "Key terms from your text will appear here with register explanations matching the selected tone.",
		historyTitle: "Translation Protocol Archive",
		clearHistory: "Purge Archive",
		emptyHistory: "No encrypted translation records found in the current session.",
		testMissingKeyDaemon: "I love coding self-healing daemons",
		detectedLang: "Detected language",
		words: "words",
		chars: "chars",
		toneLabel: "Tone",
		listen: "Listen",
		copy: "Copy",
		copied: "Copied!",
		filesComingSoonTitle: "File Translation — PDF & DOCX",
		filesComingSoonBadge: "Coming Soon",
		filesComingSoonDesc: "Upload documents and translate them while maintaining formatting. This feature is in active development. Try uploading dummy files now.",
		dragDrop: "Drag and drop your files here",
		or: "or",
		chooseFiles: "Choose Files",
		supportedFormats: "Formats: PDF · DOCX · DOC — up to 20MB per file",
		pendingFilesHeader: "These files will be processed as soon as this feature is live:",
		footerText: "All Rights Reserved © 2026 nrajmi | Lughawi Secure & Encrypted Smart Translation Platform.",
		historyLimitAlert: "Your last 30 translations are saved securely in your browser using AES-GCM.",
		generalTone: "General",
		academicTone: "Academic",
		technicalTone: "Technical",
		creativeTone: "Creative",
		generalToneHint: "Natural everyday communication",
		academicToneHint: "Precise, formal, research-ready",
		technicalToneHint: "Accurate software and engineering terms",
		creativeToneHint: "Rhetorical, fluid, and literary"
	}
};
function LinguisticAnalyzer({ text, lang, standalone = false }) {
	const { annotated, stats, keyTerms } = (0, import_react.useMemo)(() => {
		if (!text) return {
			annotated: null,
			stats: null,
			keyTerms: []
		};
		try {
			const json = three_default(text).json();
			const tagStats = {
				nouns: 0,
				verbs: 0,
				adjectives: 0,
				adverbs: 0,
				prepositions: 0,
				conjunctions: 0,
				pronouns: 0,
				total: 0
			};
			const nounList = [];
			const verbList = [];
			return {
				annotated: json.map((sentence, sIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mr-1",
					children: sentence.terms.map((term, tIdx) => {
						const tags = term.tags || [];
						tagStats.total++;
						let colorClass = "";
						let tooltip = "";
						if (tags.includes("Verb")) {
							colorClass = "ling-tag ling-verb";
							tooltip = "Verb (فعل)";
							tagStats.verbs++;
							if (term.text.length > 2) verbList.push(term.text);
						} else if (tags.includes("Noun") || tags.includes("ProperNoun")) {
							colorClass = "ling-tag ling-noun";
							tooltip = tags.includes("ProperNoun") ? "Proper Noun (اسم علم)" : "Noun (اسم)";
							tagStats.nouns++;
							if (term.text.length > 2) nounList.push(term.text);
						} else if (tags.includes("Adjective")) {
							colorClass = "ling-tag ling-adj";
							tooltip = "Adjective (صفة)";
							tagStats.adjectives++;
						} else if (tags.includes("Adverb")) {
							colorClass = "ling-tag ling-adv";
							tooltip = "Adverb (ظرف)";
							tagStats.adverbs++;
						} else if (tags.includes("Preposition")) {
							colorClass = "ling-tag ling-prep";
							tooltip = "Preposition (حرف جر)";
							tagStats.prepositions++;
						} else if (tags.includes("Conjunction")) {
							colorClass = "ling-tag ling-conj";
							tooltip = "Conjunction (حرف عطف)";
							tagStats.conjunctions++;
						} else if (tags.includes("Pronoun")) {
							colorClass = "ling-tag ling-pronoun";
							tooltip = "Pronoun (ضمير)";
							tagStats.pronouns++;
						}
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: colorClass,
							title: tooltip ? `${term.text} — ${tooltip}` : "",
							style: { cursor: tooltip ? "help" : "auto" },
							children: term.text
						}), term.post] }, tIdx);
					})
				}, sIdx)),
				stats: tagStats,
				keyTerms: [.../* @__PURE__ */ new Set([...nounList.slice(0, 4), ...verbList.slice(0, 3)])].slice(0, 6)
			};
		} catch (e) {
			return {
				annotated: text,
				stats: null,
				keyTerms: []
			};
		}
	}, [text, lang]);
	if (lang !== "en" && lang !== "auto") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "leading-relaxed whitespace-pre-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 p-2.5 rounded border border-border bg-secondary/50 text-[11px] text-muted-foreground flex items-start gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary text-sm leading-none mt-0.5",
				children: "ℹ"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ar" ? "محرك التحليل النحوي محسَّن للإنجليزية. النص العربي يُعرض كما هو." : "Syntax analysis is optimized for English text." })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "leading-relaxed whitespace-pre-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4",
				children: annotated
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-3 border-t border-border/40 flex flex-wrap gap-1.5 text-[10px] mb-3",
				children: [
					{
						cls: "ling-tag ling-noun",
						label: "Noun / اسم"
					},
					{
						cls: "ling-tag ling-verb",
						label: "Verb / فعل"
					},
					{
						cls: "ling-tag ling-adj",
						label: "Adjective / صفة"
					},
					{
						cls: "ling-tag ling-adv",
						label: "Adverb / ظرف"
					},
					{
						cls: "ling-tag ling-prep",
						label: "Preposition / حرف جر"
					},
					{
						cls: "ling-tag ling-conj",
						label: "Conjunction / عطف"
					},
					{
						cls: "ling-tag ling-pronoun",
						label: "Pronoun / ضمير"
					}
				].map(({ cls, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `${cls} text-[10px] font-medium`,
					children: label
				}, label))
			}),
			stats && standalone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 pt-3 border-t border-border/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2",
						children: "إحصائيات البنية النحوية"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-1.5 text-[11px]",
						children: [
							{
								label: "أسماء",
								count: stats.nouns,
								color: "text-emerald-600 dark:text-emerald-400"
							},
							{
								label: "أفعال",
								count: stats.verbs,
								color: "text-blue-600 dark:text-blue-400"
							},
							{
								label: "صفات",
								count: stats.adjectives,
								color: "text-amber-600 dark:text-amber-400"
							},
							{
								label: "ظروف",
								count: stats.adverbs,
								color: "text-purple-600 dark:text-purple-400"
							},
							{
								label: "حروف جر",
								count: stats.prepositions,
								color: "text-pink-600 dark:text-pink-400"
							},
							{
								label: "أحرف عطف",
								count: stats.conjunctions,
								color: "text-orange-600 dark:text-orange-400"
							},
							{
								label: "ضمائر",
								count: stats.pronouns,
								color: "text-indigo-600 dark:text-indigo-400"
							},
							{
								label: "إجمالي",
								count: stats.total,
								color: "text-foreground font-bold"
							}
						].map(({ label, count, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center p-2 rounded border border-border bg-secondary/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-lg font-bold ${color}`,
								children: count
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-[10px]",
								children: label
							})]
						}, label))
					}),
					keyTerms.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5",
							children: "المصطلحات المفتاحية المستخرجة"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: keyTerms.map((term, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 text-[11px] rounded border border-primary/20 bg-primary/5 text-primary font-medium",
								children: term
							}, i))
						})]
					})
				]
			}),
			stats && !standalone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1.5 text-[10px]",
				children: [
					stats.nouns > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-500/20",
						children: [stats.nouns, " أسماء"]
					}),
					stats.verbs > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded border border-blue-500/20",
						children: [stats.verbs, " أفعال"]
					}),
					stats.adjectives > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border border-amber-500/20",
						children: [stats.adjectives, " صفات"]
					}),
					stats.adverbs > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded border border-purple-500/20",
						children: [stats.adverbs, " ظروف"]
					})
				]
			})
		]
	});
}
async function googleTranslate(text, target) {
	try {
		const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target === "ar" ? "ar" : target === "es" ? "es" : "en"}&dt=t&q=${encodeURIComponent(text)}`;
		const res = await fetch(url);
		if (!res.ok) throw new Error("Google Translate API failed");
		return (await res.json())[0].filter((chunk) => chunk[0]).map((chunk) => chunk[0]).join("");
	} catch {
		return "[تعذّر الاتصال بـ Google Translate]";
	}
}
var DOMAINS_BENCH = [
	{
		value: "general",
		label: {
			ar: "عام",
			en: "General"
		},
		icon: "✦"
	},
	{
		value: "medical",
		label: {
			ar: "طبي",
			en: "Medical"
		},
		icon: "⚕"
	},
	{
		value: "legal",
		label: {
			ar: "قانوني",
			en: "Legal"
		},
		icon: "⚖"
	},
	{
		value: "tech",
		label: {
			ar: "تقني",
			en: "Technical"
		},
		icon: "⌨"
	},
	{
		value: "religious",
		label: {
			ar: "ديني",
			en: "Religious"
		},
		icon: "☽"
	}
];
function TranslationBenchmark({ isRTL }) {
	const [input, setInput] = (0, import_react.useState)("");
	const [domain, setDomain] = (0, import_react.useState)("general");
	const [target, setTarget] = (0, import_react.useState)("ar");
	const [lughawiResult, setLughawiResult] = (0, import_react.useState)("");
	const [googleResult, setGoogleResult] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [hasRun, setHasRun] = (0, import_react.useState)(false);
	const runBenchmark = (0, import_react.useCallback)(async () => {
		if (!input.trim()) return;
		setLoading(true);
		setHasRun(true);
		setLughawiResult("");
		setGoogleResult("");
		const clean = sanitizeInput(input);
		const [lughawiRes, googleRes] = await Promise.allSettled([translateText({ data: {
			text: clean,
			source: "auto",
			target,
			tone: "academic",
			domain
		} }), googleTranslate(clean, target)]);
		setLughawiResult(lughawiRes.status === "fulfilled" ? lughawiRes.value.translated : "[خطأ في الترجمة]");
		setGoogleResult(googleRes.status === "fulfilled" ? googleRes.value : "[خطأ في الترجمة]");
		setLoading(false);
	}, [
		input,
		domain,
		target
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5 text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRTL ? "تُقارن هذه الأداة ترجمة منصة لغوي السياقية المتخصصة مباشرةً مع مخرجات Google Translate القياسية، لإبراز الفروق الجوهرية ودقة السياق." : "This tool compares Lughawi's specialized contextual translation directly against Google Translate's standard output, highlighting key differences and contextual accuracy." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5",
					children: isRTL ? "المجال" : "Domain"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: DOMAINS_BENCH.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setDomain(d.value),
						className: cn("px-2.5 py-1 text-[11px] rounded border font-medium transition-colors", domain === d.value ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30"),
						children: [
							d.icon,
							" ",
							isRTL ? d.label.ar : d.label.en
						]
					}, d.value))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5",
					children: isRTL ? "لغة الترجمة" : "Translate to"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1",
					children: [{
						code: "ar",
						label: "العربية"
					}, {
						code: "en",
						label: "English"
					}].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTarget(l.code),
						className: cn("px-3 py-1 text-[11px] rounded border font-medium transition-colors", target === l.code ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30"),
						children: l.label
					}, l.code))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5",
				children: isRTL ? "النص المدخل" : "Input Text"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: input,
				onChange: (e) => setInput(e.target.value),
				placeholder: isRTL ? "أدخل نصاً للمقارنة بين منصة لغوي وGoogle Translate…" : "Enter text to compare Lughawi vs Google Translate…",
				dir: "auto",
				rows: 3,
				className: "w-full resize-none bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all leading-relaxed"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: runBenchmark,
				disabled: !input.trim() || loading,
				className: cn("flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg border transition-all", input.trim() && !loading ? "bg-primary text-primary-foreground border-primary hover:opacity-90 shadow-sm" : "bg-secondary border-border text-muted-foreground opacity-50 cursor-not-allowed"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "h-4 w-4" }), loading ? isRTL ? "جارٍ المقارنة…" : "Comparing…" : isRTL ? "تشغيل المقارنة" : "Run Benchmark"]
			}),
			hasRun && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "classic-panel rounded-lg overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-2.5 border-b border-border bg-primary/5 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-primary uppercase tracking-wider",
								children: isRTL ? "منصة لغوي — سياقي متخصص" : "Lughawi — Contextual & Specialized"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 min-h-[100px]",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "loading-shimmer text-muted-foreground text-sm italic",
								children: isRTL ? "جاري الترجمة…" : "Translating…"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap",
								dir: "auto",
								children: lughawiResult || "—"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-2 border-t border-border bg-secondary/20 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRTL ? "ترجمة سياقية أكاديمية محكمة بالمعاجم المتخصصة" : "Academically controlled, domain-specific contextual translation" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "classic-panel rounded-lg overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-2.5 border-b border-border bg-secondary/40 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base leading-none",
								children: "G"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
								children: ["Google Translate — ", isRTL ? "آلي قياسي" : "Standard Machine"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 min-h-[100px]",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "loading-shimmer text-muted-foreground text-sm italic",
								children: isRTL ? "جاري الترجمة…" : "Translating…"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap",
								dir: "auto",
								children: googleResult || "—"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-2 border-t border-border bg-secondary/20 text-[10px] text-muted-foreground font-medium flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "≈" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRTL ? "ترجمة آلية عامة بدون سياق متخصص" : "General machine translation without domain context" })]
						})
					]
				})]
			}),
			hasRun && !loading && lughawiResult && googleResult && lughawiResult !== googleResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-base leading-none mt-0.5",
					children: "⚠"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRTL ? "النتيجتان مختلفتان — لغوي يُقيّد الترجمة بالسياق الأكاديمي والمعاجم المتخصصة بينما Google Translate يُقدّم ترجمة آلية حرفية عامة." : "Results differ — Lughawi constrains translation through academic context and specialized glossaries, while Google Translate provides a general literal machine output." })]
			})
		]
	});
}
function shuffleArray(arr) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function AcademicFlashcards({ isRTL }) {
	const [activeDomain, setActiveDomain] = (0, import_react.useState)("religious");
	const [currentIndex, setCurrentIndex] = (0, import_react.useState)(0);
	const [flipped, setFlipped] = (0, import_react.useState)(false);
	const [deck, setDeck] = (0, import_react.useState)(null);
	const allCards = (0, import_react.useMemo)(() => {
		return {
			religious: RELIGIOUS_GLOSSARY.slice(0, 40).map((g) => ({
				id: `rel-${g.arabic}`,
				front: g.arabic,
				back: g.preferred_en,
				pronunciation: g.transliteration,
				source: g.scholarly_source,
				domain: "religious",
				domainIcon: "☽"
			})),
			tech: TECH_GLOSSARY.slice(0, 40).map((g) => ({
				id: `tech-${g.english}`,
				front: g.arabic,
				back: g.english,
				source: g.industry_standard,
				domain: "tech",
				domainIcon: "⌨"
			})),
			medical: MEDICAL_GLOSSARY.slice(0, 40).map((g) => ({
				id: `med-${g.english}`,
				front: g.arabic,
				back: g.english,
				source: g.who_standard,
				domain: "medical",
				domainIcon: "⚕"
			})),
			legal: LEGAL_GLOSSARY.slice(0, 40).map((g) => ({
				id: `leg-${g.english}`,
				front: g.arabic,
				back: g.english,
				source: g.legal_source,
				domain: "legal",
				domainIcon: "⚖"
			}))
		};
	}, []);
	const currentDeck = (0, import_react.useMemo)(() => {
		return deck ?? allCards[activeDomain];
	}, [
		deck,
		allCards,
		activeDomain
	]);
	const currentCard = currentDeck[currentIndex];
	const handleDomainChange = (d) => {
		setActiveDomain(d);
		setDeck(null);
		setCurrentIndex(0);
		setFlipped(false);
	};
	const next = () => {
		setFlipped(false);
		setTimeout(() => setCurrentIndex((i) => (i + 1) % currentDeck.length), 150);
	};
	const prev = () => {
		setFlipped(false);
		setTimeout(() => setCurrentIndex((i) => (i - 1 + currentDeck.length) % currentDeck.length), 150);
	};
	const handleShuffle = () => {
		setDeck(shuffleArray(allCards[activeDomain]));
		setCurrentIndex(0);
		setFlipped(false);
	};
	const handleReset = () => {
		setDeck(null);
		setCurrentIndex(0);
		setFlipped(false);
	};
	const domainConfig = {
		religious: {
			label: isRTL ? "ديني" : "Religious",
			color: "text-amber-700 dark:text-amber-400",
			borderColor: "border-amber-300 dark:border-amber-700",
			bgFront: "bg-amber-50 dark:bg-amber-900/20",
			bgBack: "bg-amber-100/80 dark:bg-amber-900/40"
		},
		tech: {
			label: isRTL ? "تقني" : "Technical",
			color: "text-cyan-700 dark:text-cyan-400",
			borderColor: "border-cyan-300 dark:border-cyan-700",
			bgFront: "bg-cyan-50 dark:bg-cyan-900/20",
			bgBack: "bg-cyan-100/80 dark:bg-cyan-900/40"
		},
		medical: {
			label: isRTL ? "طبي" : "Medical",
			color: "text-emerald-700 dark:text-emerald-400",
			borderColor: "border-emerald-300 dark:border-emerald-700",
			bgFront: "bg-emerald-50 dark:bg-emerald-900/20",
			bgBack: "bg-emerald-100/80 dark:bg-emerald-900/40"
		},
		legal: {
			label: isRTL ? "قانوني" : "Legal",
			color: "text-stone-700 dark:text-stone-400",
			borderColor: "border-stone-400 dark:border-stone-600",
			bgFront: "bg-stone-50 dark:bg-stone-900/20",
			bgBack: "bg-stone-100/80 dark:bg-stone-900/40"
		}
	};
	const cfg = domainConfig[activeDomain];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: Object.keys(domainConfig).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleDomainChange(d),
					className: cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded border text-[12px] font-semibold transition-all", activeDomain === d ? `bg-primary text-primary-foreground border-primary shadow-sm` : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: {
							religious: "☽",
							tech: "⌨",
							medical: "⚕",
							legal: "⚖"
						}[d] }),
						domainConfig[d].label,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] opacity-70",
							children: [
								"(",
								allCards[d].length,
								")"
							]
						})
					]
				}, d))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 h-1.5 bg-border rounded-full overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-primary rounded-full transition-all duration-300",
						style: { width: `${(currentIndex + 1) / currentDeck.length * 100}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] text-muted-foreground font-mono",
					children: [
						currentIndex + 1,
						" / ",
						currentDeck.length
					]
				})]
			}),
			currentCard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flashcard-container cursor-pointer select-none",
					onClick: () => setFlipped((f) => !f),
					role: "button",
					"aria-label": isRTL ? "اضغط لقلب البطاقة" : "Click to flip card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flashcard-inner", flipped && "flashcard-flipped"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flashcard-face flashcard-front", cfg.bgFront, cfg.borderColor),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("text-2xl mb-3 leading-none", cfg.color),
									children: currentCard.domainIcon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-medium",
									children: [
										cfg.label,
										" · ",
										isRTL ? "عربي" : "Arabic"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-arabic text-3xl font-bold text-foreground text-center leading-relaxed mb-2",
									dir: "rtl",
									children: currentCard.front
								}),
								currentCard.pronunciation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground font-mono italic mt-2",
									children: [
										"[",
										currentCard.pronunciation,
										"]"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground/50 mt-4 absolute bottom-4",
									children: isRTL ? "← انقر للكشف" : "Click to reveal →"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flashcard-face flashcard-back", cfg.bgBack, cfg.borderColor),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("text-2xl mb-3 leading-none", cfg.color),
									children: currentCard.domainIcon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-medium",
									children: [cfg.label, " · English"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-foreground text-center leading-snug mb-2",
									children: currentCard.back
								}),
								currentCard.source && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 px-3 py-1.5 rounded border border-border bg-card/80 text-[10px] text-muted-foreground text-center max-w-[280px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: isRTL ? "المصدر:" : "Source:"
										}),
										" ",
										currentCard.source
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground/50 mt-4 absolute bottom-4",
									children: isRTL ? "← انقر للعودة" : "Click to flip back →"
								})
							]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: prev,
						className: "flex items-center gap-1 px-3 py-2 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }), isRTL ? "السابق" : "Prev"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleShuffle,
						className: "flex items-center gap-1.5 px-3 py-2 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-[12px]",
						title: isRTL ? "خلط البطاقات" : "Shuffle cards",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "h-3.5 w-3.5" }), isRTL ? "خلط" : "Shuffle"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleReset,
						className: "flex items-center gap-1.5 px-3 py-2 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-[12px]",
						title: isRTL ? "إعادة التشغيل" : "Reset",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), isRTL ? "إعادة" : "Reset"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: next,
						className: "flex items-center gap-1 px-3 py-2 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm",
						children: [isRTL ? "التالي" : "Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-[10px] text-muted-foreground/50",
				children: isRTL ? "اضغط على البطاقة للكشف عن الإجابة" : "Click the card to reveal the answer"
			})
		]
	});
}
function AcademicRephraser({ isRTL }) {
	const [input, setInput] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [hasRun, setHasRun] = (0, import_react.useState)(false);
	const handleRephrase = (0, import_react.useCallback)(async () => {
		if (!input.trim()) return;
		setLoading(true);
		setHasRun(true);
		setResults([]);
		const rephrased = await rephraseText({ data: { text: input.trim() } });
		setResults(rephrased);
		setLoading(false);
	}, [input]);
	const handleCopy = async (text, idx) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(idx);
			setTimeout(() => setCopied(null), 1500);
		} catch {}
	};
	const handleClear = () => {
		setInput("");
		setResults([]);
		setHasRun(false);
	};
	const styleColors = [
		{
			badge: "bg-primary/10 text-primary border-primary/20",
			accent: "border-primary/30 bg-primary/5"
		},
		{
			badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
			accent: "border-amber-300/50 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/10"
		},
		{
			badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
			accent: "border-emerald-300/50 dark:border-emerald-700/50 bg-emerald-50/50 dark:bg-emerald-900/10"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2",
					children: isRTL ? "النص الأصلي للإعادة الصياغة" : "Original Text for Rephrasing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: isRTL ? "أدخل نصاً عادياً وسيتم إعادة صياغته بثلاثة أساليب أكاديمية بروتوكولية فصيحة…" : "Enter plain text and it will be rephrased into three formal academic styles…",
					dir: "auto",
					rows: 4,
					className: "w-full resize-none bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all leading-relaxed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] text-muted-foreground",
						children: [
							input.trim().split(/\s+/).filter(Boolean).length,
							" ",
							isRTL ? "كلمة" : "words"
						]
					}), input && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleClear,
						className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), isRTL ? "مسح" : "Clear"]
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleRephrase,
				disabled: !input.trim() || loading,
				className: cn("w-full py-2.5 text-sm font-semibold rounded-lg border transition-all", input.trim() && !loading ? "bg-primary text-primary-foreground border-primary hover:opacity-90 shadow-sm" : "bg-secondary border-border text-muted-foreground opacity-50 cursor-not-allowed"),
				children: loading ? isRTL ? "جارٍ إعادة الصياغة الأكاديمية…" : "Rephrasing academically…" : isRTL ? "إعادة الصياغة الأكاديمية — ٣ خيارات" : "Academic Rephrasing — 3 Options"
			}),
			hasRun && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: loading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "classic-panel rounded-lg p-4 loading-shimmer min-h-[80px]" }, i)) : results.map((opt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-lg border p-4 transition-all", styleColors[idx]?.accent ?? "border-border bg-secondary/20"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold font-mono text-muted-foreground",
									children: String(idx + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider", styleColors[idx]?.badge ?? ""),
									children: isRTL ? opt.styleAr : opt.style
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground italic",
									children: isRTL ? opt.descriptionAr : opt.description
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleCopy(opt.text, idx),
							className: "flex items-center gap-1 px-2 py-1 text-[10px] rounded border border-border bg-card text-muted-foreground hover:text-foreground transition-colors flex-shrink-0",
							title: isRTL ? "نسخ" : "Copy",
							children: copied === idx ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-green-600" }),
								" ",
								isRTL ? "تم!" : "Done!"
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }),
								" ",
								isRTL ? "نسخ" : "Copy"
							] })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground leading-relaxed",
						dir: "auto",
						children: opt.text
					})]
				}, idx))
			})
		]
	});
}
async function fetchWordDetails(word, lang = "en") {
	if (!word || lang !== "en") return null;
	try {
		const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
		if (!response.ok) return null;
		const data = await response.json();
		return data && data.length > 0 ? data[0] : null;
	} catch (error) {
		console.error("Dictionary API Error:", error);
		return null;
	}
}
var PREDICTIONS = [
	{
		text: "صباح الخير",
		lang: "ar"
	},
	{
		text: "كيف حالك اليوم؟",
		lang: "ar"
	},
	{
		text: "أين يمكنني العثور على",
		lang: "ar"
	},
	{
		text: "شكراً جزيلاً لك",
		lang: "ar"
	},
	{
		text: "أحتاج إلى مساعدة في",
		lang: "ar"
	},
	{
		text: "متى سوف نلتقي؟",
		lang: "ar"
	},
	{
		text: "أنا ذاهب إلى",
		lang: "ar"
	},
	{
		text: "هل يمكنك ترجمة هذا؟",
		lang: "ar"
	},
	{
		text: "أطيب التحيات",
		lang: "ar"
	},
	{
		text: "كم سعر هذا؟",
		lang: "ar"
	},
	{
		text: "Good morning",
		lang: "en"
	},
	{
		text: "How are you today?",
		lang: "en"
	},
	{
		text: "Where can I find",
		lang: "en"
	},
	{
		text: "Thank you very much",
		lang: "en"
	},
	{
		text: "I need help with",
		lang: "en"
	},
	{
		text: "When will we meet?",
		lang: "en"
	},
	{
		text: "I am going to",
		lang: "en"
	},
	{
		text: "Can you translate this?",
		lang: "en"
	},
	{
		text: "Best regards",
		lang: "en"
	},
	{
		text: "How much is this?",
		lang: "en"
	},
	{
		text: "Buenos días",
		lang: "es"
	},
	{
		text: "¿Cómo estás hoy?",
		lang: "es"
	},
	{
		text: "¿Dónde puedo encontrar",
		lang: "es"
	},
	{
		text: "Muchas gracias",
		lang: "es"
	},
	{
		text: "Necesito ayuda con",
		lang: "es"
	},
	{
		text: "¿Cuándo nos encontraremos?",
		lang: "es"
	},
	{
		text: "Voy a",
		lang: "es"
	},
	{
		text: "¿Puedes traducir esto?",
		lang: "es"
	},
	{
		text: "Saludos cordiales",
		lang: "es"
	},
	{
		text: "¿Cuánto cuesta esto?",
		lang: "es"
	}
];
function getPredictions(input, lang) {
	if (!input.trim()) return [];
	const query = input.trim().toLowerCase();
	const tokens = query.split(/\s+/);
	const lastWord = tokens[tokens.length - 1];
	const matches = PREDICTIONS.filter((p) => {
		if (lang !== "auto" && p.lang !== lang) return false;
		const pText = p.text.toLowerCase();
		if (pText.startsWith(query)) return true;
		if (lastWord.length > 1 && pText.includes(lastWord)) return true;
		return false;
	});
	return Array.from(new Set(matches.map((m) => m.text))).slice(0, 3);
}
var HISTORY_KEY = "lughawi.history.v1";
var UI_LANG_KEY = "lughawi.ui.lang";
var DOMAINS = [
	{
		value: "general",
		label: {
			ar: "عام",
			en: "General",
			es: "General"
		},
		icon: "✦"
	},
	{
		value: "medical",
		label: {
			ar: "طبي",
			en: "Medical",
			es: "Médico"
		},
		icon: "⚕"
	},
	{
		value: "legal",
		label: {
			ar: "قانوني",
			en: "Legal",
			es: "Legal"
		},
		icon: "⚖"
	},
	{
		value: "tech",
		label: {
			ar: "تقني",
			en: "Technical",
			es: "Técnico"
		},
		icon: "⌨"
	},
	{
		value: "religious",
		label: {
			ar: "ديني",
			en: "Religious",
			es: "Religioso"
		},
		icon: "☽"
	}
];
function TranslatorPage() {
	const [source, setSource] = (0, import_react.useState)("auto");
	const [target, setTarget] = (0, import_react.useState)("en");
	const [tone, setTone] = (0, import_react.useState)("general");
	const [domain, setDomain] = (0, import_react.useState)("general");
	const [input, setInput] = (0, import_react.useState)("");
	const [output, setOutput] = (0, import_react.useState)("");
	const [detected, setDetected] = (0, import_react.useState)(null);
	const [terms, setTerms] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [isDark, setIsDark] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [uiLanguage, setUiLanguage] = (0, import_react.useState)("ar");
	const [diagnosticAlert, setDiagnosticAlert] = (0, import_react.useState)(null);
	const [dictQuery, setDictQuery] = (0, import_react.useState)("");
	const [dictResult, setDictResult] = (0, import_react.useState)(null);
	const [isDictLoading, setIsDictLoading] = (0, import_react.useState)(false);
	const [isRecording, setIsRecording] = (0, import_react.useState)(false);
	const [predictions, setPredictions] = (0, import_react.useState)([]);
	const [fontSize, setFontSize] = (0, import_react.useState)(16);
	const [showAlternatives, setShowAlternatives] = (0, import_react.useState)(false);
	const [showLexicon, setShowLexicon] = (0, import_react.useState)(false);
	const [showHistory, setShowHistory] = (0, import_react.useState)(false);
	const [showAnalysis, setShowAnalysis] = (0, import_react.useState)(false);
	const [hoveredGlossary, setHoveredGlossary] = (0, import_react.useState)(null);
	const [hoveredTechGlossary, setHoveredTechGlossary] = (0, import_react.useState)(null);
	const [hoveredMedGlossary, setHoveredMedGlossary] = (0, import_react.useState)(null);
	const [hoveredLegalGlossary, setHoveredLegalGlossary] = (0, import_react.useState)(null);
	const [mainTab, setMainTab] = (0, import_react.useState)("translator");
	const [activeTool, setActiveTool] = (0, import_react.useState)("analyzer");
	const [analyzerText, setAnalyzerText] = (0, import_react.useState)("");
	const debounceRef = (0, import_react.useRef)(null);
	const t = (0, import_react.useMemo)(() => UI_TRANSLATIONS[uiLanguage], [uiLanguage]);
	const isRTL = uiLanguage === "ar";
	(0, import_react.useEffect)(() => {
		document.documentElement.dir = isRTL ? "rtl" : "ltr";
		document.documentElement.lang = uiLanguage;
	}, [uiLanguage, isRTL]);
	(0, import_react.useEffect)(() => {
		initTheme();
		setIsDark(getTheme() === "dark");
		const savedUiLang = localStorage.getItem(UI_LANG_KEY);
		if (savedUiLang && [
			"ar",
			"en",
			"es"
		].includes(savedUiLang)) setUiLanguage(savedUiLang);
		const loadHistory = async () => {
			try {
				const raw = localStorage.getItem(HISTORY_KEY);
				if (raw) setHistory(JSON.parse(await decryptData(raw)));
			} catch {
				localStorage.removeItem(HISTORY_KEY);
			}
		};
		loadHistory();
	}, []);
	const saveHistory = async (list) => {
		try {
			localStorage.setItem(HISTORY_KEY, await encryptData(JSON.stringify(list)));
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		if (!input.trim()) {
			setOutput("");
			setDetected(null);
			setTerms([]);
			setDiagnosticAlert(null);
			return;
		}
		if (debounceRef.current) window.clearTimeout(debounceRef.current);
		debounceRef.current = window.setTimeout(async () => {
			setLoading(true);
			setDiagnosticAlert(null);
			try {
				const clean = sanitizeInput(input);
				const res = await translateText({ data: {
					text: clean,
					source,
					target,
					tone,
					domain
				} });
				setOutput(res.translated);
				setDetected(res.detected);
				setTerms(res.terms);
				const item = {
					id: crypto.randomUUID(),
					source: res.detected,
					target,
					sourceText: clean,
					translated: res.translated,
					tone,
					domain,
					at: Date.now()
				};
				setHistory((prev) => {
					const next = [item, ...prev.filter((p) => p.sourceText !== clean)].slice(0, 30);
					saveHistory(next);
					return next;
				});
			} catch (err) {
				console.error("Translation failed:", err);
				if ((err instanceof Error ? err.message : "").includes("CLIENT_FALLBACK_REQUIRED")) try {
					const clean = sanitizeInput(input);
					const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source === "auto" ? "auto" : source}&tl=${target}&dt=t&q=${encodeURIComponent(clean)}`;
					const resFallback = await fetch(url);
					if (!resFallback.ok) throw new Error("Browser fallback failed");
					const json = await resFallback.json();
					const translatedFallback = json[0].map((item) => item[0]).join("");
					const detectedFallback = source === "auto" ? json[2] || source : source;
					const localMatches = findDictionaryMatches(clean, tone, domain);
					const fallbackTerms = [];
					localMatches.forEach((localItem) => {
						const detectedKey = detectedFallback === "ar" || detectedFallback === "en" || detectedFallback === "es" ? detectedFallback : "en";
						const srcVal = localItem.translations[detectedKey] || localItem.term;
						const targetTranslation = localItem.translations[target];
						const nuanceNote = localItem.nuances[tone]?.[target];
						if (targetTranslation && nuanceNote && !fallbackTerms.some((t) => t.term.toLowerCase() === srcVal.toLowerCase())) fallbackTerms.push({
							term: srcVal,
							note: `-> ${targetTranslation}: ${nuanceNote}`
						});
					});
					setOutput(translatedFallback);
					setDetected(detectedFallback);
					setTerms(fallbackTerms);
					const item = {
						id: crypto.randomUUID(),
						source: detectedFallback,
						target,
						sourceText: clean,
						translated: translatedFallback,
						tone,
						domain,
						at: Date.now()
					};
					setHistory((prev) => {
						const next = [item, ...prev.filter((p) => p.sourceText !== clean)].slice(0, 30);
						saveHistory(next);
						return next;
					});
				} catch (fallbackErr) {
					setDiagnosticAlert(diagnosticService.analyzeError(fallbackErr));
					setOutput("");
					setTerms([]);
				}
				else {
					setDiagnosticAlert(diagnosticService.analyzeError(err));
					setOutput("");
					setTerms([]);
				}
			} finally {
				setLoading(false);
			}
		}, 700);
		return () => {
			if (debounceRef.current) window.clearTimeout(debounceRef.current);
		};
	}, [
		input,
		source,
		target,
		tone,
		domain
	]);
	(0, import_react.useEffect)(() => {
		if (!dictQuery.trim()) {
			setDictResult(null);
			return;
		}
		const d = setTimeout(async () => {
			setIsDictLoading(true);
			setDictResult(await fetchWordDetails(dictQuery.trim()));
			setIsDictLoading(false);
		}, 800);
		return () => clearTimeout(d);
	}, [dictQuery]);
	const stats = (0, import_react.useMemo)(() => ({
		words: input.trim() ? input.trim().split(/\s+/).length : 0,
		chars: input.length
	}), [input]);
	const swap = () => {
		if (source === "auto") return;
		const prevSrc = source, prevOut = output;
		setSource(target);
		setTarget(prevSrc);
		setInput(prevOut);
		setOutput(input);
	};
	const copy = async (text, which) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(which);
			setTimeout(() => setCopied(null), 1400);
		} catch {}
	};
	const speak = (text, lang) => {
		if (!text || !("speechSynthesis" in window)) return;
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.lang = lang === "ar" ? "ar-SA" : lang === "en" ? "en-US" : "es-ES";
		u.rate = .95;
		window.speechSynthesis.speak(u);
	};
	const startRecording = () => {
		if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
		const r = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
		r.lang = source === "ar" ? "ar-SA" : source === "es" ? "es-ES" : "en-US";
		r.onstart = () => setIsRecording(true);
		r.onresult = (e) => setInput((p) => p ? p + " " + e.results[0][0].transcript : e.results[0][0].transcript);
		r.onerror = r.onend = () => setIsRecording(false);
		r.start();
	};
	const changeUiLanguage = (lang) => {
		setUiLanguage(lang);
		localStorage.setItem(UI_LANG_KEY, lang);
	};
	const localDictMatches = (0, import_react.useMemo)(() => findDictionaryMatches(input, tone, domain), [
		input,
		tone,
		domain
	]);
	const alternatives = (0, import_react.useMemo)(() => {
		if (!output || !localDictMatches.length) return [];
		return localDictMatches.slice(0, 3).map((m) => ({
			original: m.translations[detected] || m.term,
			alt: m.translations[target],
			nuance: m.nuances[tone]?.[target] || ""
		})).filter((a) => a.alt && a.alt !== output.trim());
	}, [
		output,
		localDictMatches,
		detected,
		target,
		tone
	]);
	const religiousMatches = (0, import_react.useMemo)(() => {
		if (domain !== "religious" || !input) return [];
		const norm = input.toLowerCase();
		return RELIGIOUS_GLOSSARY.filter((g) => norm.includes(g.arabic) || norm.includes(g.transliteration.toLowerCase()) || norm.includes(g.preferred_en.toLowerCase()));
	}, [domain, input]);
	const techMatches = (0, import_react.useMemo)(() => {
		if (domain !== "tech" || !input) return [];
		const norm = input.toLowerCase();
		return TECH_GLOSSARY.filter((g) => norm.includes(g.english.toLowerCase()) || norm.includes(g.arabic) || g.alternate_ar && g.alternate_ar.some((a) => norm.includes(a)));
	}, [domain, input]);
	const medMatches = (0, import_react.useMemo)(() => {
		if (domain !== "medical" || !input) return [];
		const norm = input.toLowerCase();
		return MEDICAL_GLOSSARY.filter((g) => norm.includes(g.english.toLowerCase()) || norm.includes(g.arabic) || g.alternate_ar && g.alternate_ar.some((a) => norm.toLowerCase().includes(a.toLowerCase())));
	}, [domain, input]);
	const legalMatches = (0, import_react.useMemo)(() => {
		if (domain !== "legal" || !input) return [];
		const norm = input.toLowerCase();
		return LEGAL_GLOSSARY.filter((g) => norm.includes(g.english.toLowerCase()) || norm.includes(g.arabic) || g.alternate_ar && g.alternate_ar.some((a) => norm.toLowerCase().includes(a.toLowerCase())));
	}, [domain, input]);
	const domainLabel = (d) => DOMAINS.find((x) => x.value === d)?.label[uiLanguage] ?? d;
	const targetIsRTL = target === "ar";
	const isReligious = domain === "religious";
	const isTech = domain === "tech";
	const isMedical = domain === "medical";
	const isLegal = domain === "legal";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("min-h-screen flex flex-col", isDark ? "dark" : ""),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "classic-navbar sticky top-0 z-30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-5 h-[60px] flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-center w-10 h-10 rounded-lg bg-primary shadow-md",
							style: { boxShadow: "0 2px 12px hsla(var(--primary), 0.35)" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "h-5 w-5 text-primary-foreground" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-2 leading-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display font-bold tracking-tight text-foreground leading-none",
									style: {
										fontSize: "1.15rem",
										fontFamily: "'Amiri', 'Cairo', serif",
										letterSpacing: "0.01em"
									},
									children: "منصة لغوي"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium",
									style: {
										fontSize: "0.68rem",
										fontFamily: "'Libre Baskerville', Georgia, serif",
										letterSpacing: "0.04em",
										opacity: .65
									},
									children: "Lughawi Platform"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground leading-none mt-0.5",
								style: {
									fontSize: "0.62rem",
									letterSpacing: "0.03em",
									opacity: .55
								},
								children: isRTL ? "للترجمة السياقية المتخصصة" : "Contextual Specialized Translation"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center rounded border border-border overflow-hidden text-[11px] font-medium",
							children: ["ar", "en"].map((lang, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => changeUiLanguage(lang),
								className: cn("px-2.5 py-1.5 uppercase transition-colors", i > 0 && "border-s border-border", uiLanguage === lang ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"),
								children: lang
							}, lang))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsDark(toggleTheme()),
							className: "w-8 h-8 flex items-center justify-center rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
							children: isDark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-3.5 w-3.5" })
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 mx-auto w-full max-w-7xl px-5 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border mb-5 flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							id: "main-tab-translator",
							onClick: () => setMainTab("translator"),
							className: cn("main-tab gap-2", mainTab === "translator" && "main-tab-active"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "h-3.5 w-3.5" }), isRTL ? "الترجمة" : "Translation"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							id: "main-tab-tools",
							onClick: () => setMainTab("tools"),
							className: cn("main-tab gap-2 relative", mainTab === "tools" && "main-tab-active"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-3.5 w-3.5" }),
								isRTL ? "الأدوات اللغوية المساعدة" : "Linguistic Tools",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wide",
									children: isRTL ? "جديد" : "New"
								})
							]
						})]
					}),
					mainTab === "translator" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border mb-5 flex items-center overflow-x-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center flex-1 min-w-0",
								children: DOMAINS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setDomain(d.value),
									className: cn("domain-tab gap-1.5 flex-shrink-0", domain === d.value ? "text-primary border-b-2 border-primary font-semibold" : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs opacity-70",
											children: d.icon
										}),
										d.label[uiLanguage],
										d.value === "general" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wide",
											children: isRTL ? "تنبؤ" : "AI"
										}),
										d.value === "religious" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide",
											children: isRTL ? "جديد" : "New"
										})
									]
								}, d.value))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center border-s border-border flex-shrink-0",
								children: TONES.map((tn) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setTone(tn.value),
									title: tn.value === "general" ? t.generalToneHint : tn.value === "academic" ? t.academicToneHint : tn.value === "technical" ? t.technicalToneHint : t.creativeToneHint,
									className: cn("domain-tab text-[11px]", tone === tn.value ? "text-primary border-b-2 border-primary font-semibold" : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"),
									children: tn.value === "general" ? t.generalTone : tn.value === "academic" ? t.academicTone : tn.value === "technical" ? t.technicalTone : t.creativeTone
								}, tn.value))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-4 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSelect, {
									value: source,
									onChange: (v) => setSource(v),
									includeAuto: true,
									uiLang: uiLanguage
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: swap,
									disabled: source === "auto",
									className: cn("swap-btn flex-shrink-0", source === "auto" ? "opacity-30 cursor-not-allowed" : "hover:bg-secondary hover:border-primary/40 hover:text-primary"),
									title: isRTL ? "تبديل اللغتين" : "Swap languages",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSelect, {
									value: target,
									onChange: (v) => setTarget(v),
									uiLang: uiLanguage
								}),
								detected && source === "auto" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground border border-border rounded px-2 py-1 bg-secondary",
									children: [
										isRTL ? "اللغة المكتشفة:" : "Detected:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: LANGUAGES.find((l) => l.code === detected)?.name ?? detected
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center ms-auto border border-border rounded overflow-hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setFontSize((s) => Math.max(12, s - 2)),
											className: "px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
											title: isRTL ? "تصغير" : "Smaller",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "h-3.5 w-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2 py-1 text-[11px] text-muted-foreground font-mono border-x border-border bg-muted",
											children: [fontSize, "px"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setFontSize((s) => Math.min(28, s + 2)),
											className: "px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
											title: isRTL ? "تكبير" : "Larger",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-3.5 w-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setFontSize(16),
											className: "px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border-s border-border",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" })
										})
									]
								})
							]
						}),
						isReligious && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: -8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "mb-4 p-3 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-amber-600 dark:text-amber-400 text-lg leading-none mt-0.5",
								children: "☽"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-amber-800 dark:text-amber-300 mb-0.5",
								children: isRTL ? "وضع الترجمة الدينية الحذرة — المعجم المقيد نشط" : "Controlled Religious Translation Mode — Strict Glossary Active"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-amber-700 dark:text-amber-400/80 leading-relaxed",
								children: isRTL ? "تُطابَق المصطلحات الإسلامية والفقهية تلقائياً مع المعجم الأكاديمي المُحكَم المستند إلى مصادر علمية موثوقة (ابن منظور، هانز فير، عبد الحليم، وغيرهم) لضمان دقة الترجمة الدينية." : "Islamic and jurisprudential terms are automatically matched against a strict academic glossary grounded in authoritative scholarly sources (Lane's Lexicon, Hans Wehr, Abdel Haleem, et al.) to ensure precise religious translation."
							})] })]
						}),
						isTech && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: -8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "mb-4 p-3 rounded-lg border border-cyan-200 dark:border-cyan-800/50 bg-cyan-50 dark:bg-cyan-900/10 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-cyan-600 dark:text-cyan-400 text-lg leading-none mt-0.5",
								children: "⌨"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-cyan-800 dark:text-cyan-300 mb-0.5",
								children: isRTL ? "وضع الترجمة التقنية الدقيقة — المعجم السيبراني نشط" : "Precision Tech Translation Mode — Cyber Glossary Active"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-cyan-700 dark:text-cyan-400/80 leading-relaxed",
								children: isRTL ? "تُطابَق المصطلحات التقنية تلقائياً مع المعجم المعتمد (هندسة البرمجيات، الذكاء الاصطناعي، الأمن السيبراني) لضمان تعريب دقيق وتجنب الترجمة الحرفية." : "Technical terms are automatically matched against an authoritative IT glossary to ensure accurate Arabization and avoid literal translation."
							})] })]
						}),
						isMedical && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: -8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "mb-4 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-600 dark:text-emerald-400 text-lg leading-none mt-0.5",
								children: "⚕"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-0.5",
								children: isRTL ? "وضع الترجمة الطبية الدقيقة — المعجم السريري نشط" : "Clinical Translation Mode — WHO/ICD-11 Glossary Active"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-emerald-700 dark:text-emerald-400/80 leading-relaxed",
								children: isRTL ? "تُطابَق المصطلحات الطبية تلقائياً مع المعجم السريري المعتمد (منظمة الصحة العالمية ICD-11، MeSH) لضمان دقة المصطلح الطبي." : "Medical terms are automatically matched against WHO/ICD-11 and MeSH to ensure clinical accuracy and avoid colloquial translations."
							})] })]
						}),
						isLegal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: -8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "mb-4 p-3 rounded-lg border border-stone-300 dark:border-stone-700/50 bg-stone-50 dark:bg-stone-900/10 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-stone-600 dark:text-stone-400 text-lg leading-none mt-0.5",
								children: "⚖"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-stone-800 dark:text-stone-300 mb-0.5",
								children: isRTL ? "وضع الترجمة القانونية الدقيقة — المعجم التشريعي نشط" : "Legal Translation Mode — UNTERM/Black's Law Glossary Active"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-stone-700 dark:text-stone-400/80 leading-relaxed",
								children: isRTL ? "تُطابَق المصطلحات القانونية تلقائياً مع معجم جامعة الدول العربية وقاموس بلاك القانوني وقاعدة UNTERM لضمان الدقة التشريعية." : "Legal terms are automatically matched against UNTERM, Black's Law Dictionary, and Arab League Terminology for legislative precision."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "classic-panel rounded-lg overflow-hidden mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col min-h-[320px]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
													children: t.originalText
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: startRecording,
															className: cn("text-action-btn", isRecording ? "text-red-500 border-red-200" : ""),
															title: isRTL ? "تسجيل صوتي" : "Voice input",
															children: isRecording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => speak(input, detected ?? source),
															className: "text-action-btn",
															title: t.listen,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => copy(input, "in"),
															className: "text-action-btn",
															title: t.copy,
															children: copied === "in" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-green-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative flex-1 p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													value: input,
													onChange: (e) => {
														const val = e.target.value;
														setInput(val);
														setPredictions(domain === "general" ? getPredictions(val, source) : []);
													},
													placeholder: isReligious ? isRTL ? "اكتب مصطلحاً إسلامياً أو فقهياً (مثل: التقوى، الغيب، فتوى)…" : "Enter an Islamic or jurisprudential term (e.g., التقوى, الغيب, فتوى)…" : t.textareaPlaceholder,
													dir: "auto",
													style: { fontSize: `${fontSize}px` },
													className: "w-full h-full min-h-[260px] resize-none bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/40 leading-relaxed font-sans"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: domain === "general" && predictions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
													initial: {
														opacity: 0,
														y: 4
													},
													animate: {
														opacity: 1,
														y: 0
													},
													exit: {
														opacity: 0,
														y: 4
													},
													className: "absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5",
													children: predictions.map((pred, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => {
															setInput(pred);
															setPredictions([]);
														},
														className: "predict-chip hover:bg-accent/10 hover:border-accent/30",
														children: pred
													}, i))
												}) })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "px-4 py-2 border-t border-border bg-secondary/20 flex items-center gap-2 text-[11px] text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														stats.words,
														" ",
														t.words
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														stats.chars,
														" ",
														t.chars
													] })
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "translate-divider hidden lg:block" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block lg:hidden border-t border-dashed border-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col min-h-[320px]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
													children: t.translation
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															onClick: () => setShowAnalysis((v) => !v),
															className: cn("text-action-btn gap-1", showAnalysis ? "bg-primary/10 border-primary/30 text-primary" : ""),
															title: isRTL ? "التحليل اللغوي" : "Linguistic Analysis",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Microscope, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "hidden sm:inline",
																children: isRTL ? "تحليل" : "Syntax"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => speak(output, target),
															className: "text-action-btn",
															title: t.listen,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => output && copy(output, "out"),
															className: "text-action-btn",
															title: t.copy,
															children: copied === "out" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-green-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: cn("flex-1 p-4 leading-relaxed font-sans relative overflow-hidden", loading && "opacity-80 transition-opacity", !output && "italic text-muted-foreground/40"),
												dir: targetIsRTL ? "rtl" : "ltr",
												style: { fontSize: `${fontSize}px` },
												children: [
													loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] z-10",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex flex-col items-center gap-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-xs font-bold text-primary tracking-widest",
																children: t.translating
															})]
														})
													}),
													diagnosticAlert && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "absolute inset-0 z-20 flex flex-col items-center justify-center bg-background p-6",
														dir: "auto",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: cn("p-5 rounded-xl border w-full max-w-sm text-center shadow-sm animate-in zoom-in-95 duration-200", diagnosticAlert.type === "API_TIMEOUT" ? "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400" : diagnosticAlert.type === "ZOD_SCHEMA_MISMATCH" ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400" : diagnosticAlert.type === "NETWORK_DISCONNECT" ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400" : diagnosticAlert.type === "LLM_HALLUCINATION" ? "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400" : "bg-destructive/10 border-destructive/30 text-destructive"),
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
																	className: "font-bold text-[15px] mb-2",
																	children: diagnosticAlert.title
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "text-xs opacity-90 leading-relaxed font-medium",
																	children: diagnosticAlert.message
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "mt-4 pt-3 border-t border-current/20 text-[10px] opacity-70 font-mono",
																	children: diagnosticAlert.type
																})
															]
														})
													}),
													!output && !loading && !diagnosticAlert && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: t.outputPlaceholder }),
													output && !diagnosticAlert && showAnalysis && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinguisticAnalyzer, {
														text: output,
														lang: target
													}),
													output && !diagnosticAlert && !showAnalysis && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "whitespace-pre-wrap relative z-0",
														children: output
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "px-4 py-2 border-t border-border bg-secondary/20 flex items-center justify-between text-[11px] text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5",
													children: [
														isReligious && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-amber-600 dark:text-amber-400",
															children: "☽"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: domainLabel(domain) }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tone === "general" ? t.generalTone : tone === "academic" ? t.academicTone : tone === "technical" ? t.technicalTone : t.creativeTone })
													]
												}), showAnalysis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1 text-primary text-[10px]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Microscope, { className: "h-3 w-3" }), isRTL ? "وضع التحليل اللغوي" : "Linguistic Analysis Mode"]
												})]
											})
										]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end gap-2 mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => output && copy(output, "out"),
								disabled: !output,
								className: cn("flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border shadow-sm", !output ? "opacity-50 cursor-not-allowed bg-secondary/50 border-border text-muted-foreground" : "bg-card hover:bg-secondary border-border text-foreground hover:text-primary"),
								children: [copied === "out" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), copied === "out" ? isRTL ? "تم النسخ!" : "Copied!" : isRTL ? "نسخ النص المترجم" : "Copy Translation"]
							})
						}),
						isReligious && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "classic-panel rounded-lg mb-4 overflow-hidden border-amber-200/60 dark:border-amber-800/40",
							style: { borderColor: "var(--border)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-5 py-4 bg-gradient-to-r from-amber-100/80 to-amber-50/40 dark:from-amber-900/40 dark:to-amber-950/20 border-b border-amber-200/60 dark:border-amber-800/40 flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 bg-amber-200/50 dark:bg-amber-800/50 rounded-md shadow-sm border border-amber-300/50 dark:border-amber-700/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-amber-700 dark:text-amber-300 text-xl font-serif leading-none",
										children: "☽"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-serif font-bold text-amber-950 dark:text-amber-100",
										children: isRTL ? "معجم المصطلحات الإسلامية المعتمدة" : "Verified Islamic Glossary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-amber-800/80 dark:text-amber-200/70 mt-1 leading-relaxed max-w-lg",
										children: isRTL ? "قاعدة بيانات لغوية دقيقة تجمع الترجمات الأكاديمية والشرعية المعتمدة للمصطلحات الدينية، لضمان أعلى درجات الموثوقية في نقل المعنى." : "A precision linguistic database aggregating academically and jurisprudentially vetted translations for religious terms, ensuring the highest reliability."
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2 mb-4",
										children: RELIGIOUS_GLOSSARY.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setHoveredGlossary(hoveredGlossary?.arabic === g.arabic ? null : g),
											className: cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all", hoveredGlossary?.arabic === g.arabic ? "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300" : "bg-secondary border-border text-foreground hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-arabic text-sm font-bold",
													children: g.arabic
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "→"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px]",
													children: g.preferred_en
												})
											]
										}, g.arabic))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: hoveredGlossary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: {
											opacity: 0,
											height: 0
										},
										animate: {
											opacity: 1,
											height: "auto"
										},
										exit: {
											opacity: 0,
											height: 0
										},
										className: "overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 bg-amber-50/40 dark:bg-amber-900/10",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-start justify-between gap-4 mb-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-baseline gap-3 flex-wrap",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-arabic font-bold text-xl text-foreground",
															children: hoveredGlossary.arabic
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs text-muted-foreground font-mono italic",
															children: hoveredGlossary.transliteration
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 mt-1 flex-wrap",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-sm font-semibold text-amber-800 dark:text-amber-300",
															children: hoveredGlossary.preferred_en
														}), hoveredGlossary.alternate_en.slice(0, 2).map((alt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary",
															children: alt
														}, i))]
													})] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-3 p-3 bg-white/60 dark:bg-card/60 rounded border border-amber-100 dark:border-amber-800/30",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1",
														children: isRTL ? "مسوّغ الاختيار الاصطلاحي" : "Terminological Rationale"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-foreground leading-relaxed",
														children: hoveredGlossary.rationale
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 text-[11px] text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-foreground",
															children: isRTL ? "المصادر العلمية:" : "Scholarly Sources:"
														}),
														" ",
														hoveredGlossary.scholarly_source
													] })]
												}),
												hoveredGlossary.caution && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-red-700 dark:text-red-400",
														children: hoveredGlossary.caution
													})]
												}),
												hoveredGlossary.alternate_en.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-4 pt-4 border-t border-amber-200/40 dark:border-amber-800/30",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[10px] uppercase font-bold text-amber-700/70 dark:text-amber-400/70 tracking-wider mb-2.5 flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1 h-1 rounded-full bg-amber-500" }), isRTL ? "ترجمات بديلة مقبولة أكاديمياً" : "Academically Accepted Alternatives"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex flex-wrap gap-1.5",
														children: hoveredGlossary.alternate_en.map((alt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => {
																setInput(alt);
																setDictQuery(alt);
															},
															className: "alt-chip text-[11px] hover:bg-primary/10 hover:border-primary/30",
															children: alt
														}, i))
													})]
												})
											]
										})
									}, hoveredGlossary.arabic) }),
									religiousMatches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 pt-3 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider mb-2 flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), isRTL ? "مصطلحات مكتشفة في النص" : "Terms Detected in Your Text"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: religiousMatches.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-arabic font-bold text-foreground",
														children: g.arabic
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground/50",
														children: "→"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-amber-700 dark:text-amber-400",
														children: g.preferred_en
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setHoveredGlossary(g),
														className: "text-[10px] text-primary hover:underline ms-auto",
														children: isRTL ? "تفاصيل" : "Details"
													})
												]
											}, g.arabic))
										})]
									})
								]
							})]
						}),
						isTech && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "classic-panel rounded-lg mb-4 overflow-hidden border-cyan-200/60 dark:border-cyan-800/40",
							style: { borderColor: "var(--border)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-5 py-4 bg-gradient-to-r from-cyan-100/80 to-cyan-50/40 dark:from-cyan-900/40 dark:to-cyan-950/20 border-b border-cyan-200/60 dark:border-cyan-800/40 flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 bg-cyan-200/50 dark:bg-cyan-800/50 rounded-md shadow-sm border border-cyan-300/50 dark:border-cyan-700/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-cyan-700 dark:text-cyan-300 text-xl font-serif leading-none",
										children: "⌨"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-serif font-bold text-cyan-950 dark:text-cyan-100",
										children: isRTL ? "المعجم التقني المعتمد" : "Authoritative Tech Glossary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-cyan-800/80 dark:text-cyan-200/70 mt-1 leading-relaxed max-w-lg",
										children: isRTL ? "قاعدة بيانات لغوية دقيقة تجمع التعريب المعتمد لمصطلحات الذكاء الاصطناعي التوليدي، وهندسة البرمجيات، والأمن السيبراني." : "A precision linguistic database aggregating vetted Arabization for Generative AI, Software Engineering, and Cyber Security terms."
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2 mb-4",
										children: TECH_GLOSSARY.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setHoveredTechGlossary(hoveredTechGlossary?.english === g.english ? null : g),
											className: cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all", hoveredTechGlossary?.english === g.english ? "bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700 text-cyan-800 dark:text-cyan-300" : "bg-secondary border-border text-foreground hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-sans text-sm font-bold",
													children: g.english
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "→"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-arabic text-[11px]",
													children: g.arabic
												})
											]
										}, g.english))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: hoveredTechGlossary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: {
											opacity: 0,
											height: 0
										},
										animate: {
											opacity: 1,
											height: "auto"
										},
										exit: {
											opacity: 0,
											height: 0
										},
										className: "overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border border-cyan-200 dark:border-cyan-800/50 rounded-lg p-4 bg-cyan-50/40 dark:bg-cyan-900/10",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-start justify-between gap-4 mb-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex items-baseline gap-3 flex-wrap",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-sans font-bold text-xl text-foreground",
															children: hoveredTechGlossary.english
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 mt-1 flex-wrap",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-arabic text-sm font-semibold text-cyan-800 dark:text-cyan-300",
															children: hoveredTechGlossary.arabic
														}), hoveredTechGlossary.alternate_ar.slice(0, 2).map((alt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-arabic text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary",
															children: alt
														}, i))]
													})] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-3 p-3 bg-white/60 dark:bg-card/60 rounded border border-cyan-100 dark:border-cyan-800/30",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1",
														children: isRTL ? "مسوّغ التعريب" : "Arabization Rationale"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-foreground leading-relaxed",
														children: hoveredTechGlossary.rationale
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 text-[11px] text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-foreground",
															children: isRTL ? "المعيار التقني:" : "Industry Standard:"
														}),
														" ",
														hoveredTechGlossary.industry_standard
													] })]
												}),
												hoveredTechGlossary.caution && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-red-700 dark:text-red-400",
														children: hoveredTechGlossary.caution
													})]
												})
											]
										})
									}, hoveredTechGlossary.english) }),
									techMatches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 pt-3 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-400 tracking-wider mb-2 flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), isRTL ? "مصطلحات تقنية في النص" : "Tech Terms Detected"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: techMatches.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-sans font-bold text-foreground",
														children: g.english
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground/50",
														children: "→"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-arabic font-semibold text-cyan-700 dark:text-cyan-400",
														children: g.arabic
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setHoveredTechGlossary(g),
														className: "text-[10px] text-primary hover:underline ms-auto",
														children: isRTL ? "تفاصيل" : "Details"
													})
												]
											}, g.english))
										})]
									})
								]
							})]
						}),
						isMedical && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "classic-panel rounded-lg mb-4 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-5 py-4 bg-gradient-to-r from-emerald-100/80 to-emerald-50/40 dark:from-emerald-900/40 dark:to-emerald-950/20 border-b border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 bg-emerald-200/50 dark:bg-emerald-800/50 rounded-md shadow-sm border border-emerald-300/50 dark:border-emerald-700/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-emerald-700 dark:text-emerald-300 text-xl leading-none",
										children: "⚕"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-serif font-bold text-emerald-950 dark:text-emerald-100",
										children: isRTL ? "المعجم الطبي السريري المعتمد" : "WHO / ICD-11 Clinical Glossary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-emerald-800/80 dark:text-emerald-200/70 mt-1 leading-relaxed max-w-lg",
										children: isRTL ? "قاعدة بيانات طبية دقيقة مستندة إلى منظمة الصحة العالمية (ICD-11)، MeSH، ومراجع هاريسون ودورلاند الطبية." : "A precision medical database grounded in WHO ICD-11, MeSH, Harrison's Internal Medicine, and Dorland's Medical Dictionary."
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2 mb-4",
										children: MEDICAL_GLOSSARY.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setHoveredMedGlossary(hoveredMedGlossary?.english === g.english ? null : g),
											className: cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all", hoveredMedGlossary?.english === g.english ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300" : "bg-secondary border-border text-foreground hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-sans text-sm font-bold",
													children: g.english
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "→"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-arabic text-[11px]",
													children: g.arabic
												}),
												g.icd11_code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1 rounded",
													children: g.icd11_code
												})
											]
										}, g.english))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: hoveredMedGlossary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: {
											opacity: 0,
											height: 0
										},
										animate: {
											opacity: 1,
											height: "auto"
										},
										exit: {
											opacity: 0,
											height: 0
										},
										className: "overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-4 bg-emerald-50/40 dark:bg-emerald-900/10",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-start justify-between gap-4 mb-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-baseline gap-3 flex-wrap",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-sans font-bold text-xl text-foreground",
															children: hoveredMedGlossary.english
														}), hoveredMedGlossary.icd11_code && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded",
															children: ["ICD-11: ", hoveredMedGlossary.icd11_code]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 mt-1 flex-wrap",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-arabic text-sm font-semibold text-emerald-800 dark:text-emerald-300",
															children: hoveredMedGlossary.arabic
														}), hoveredMedGlossary.alternate_ar.slice(0, 2).map((alt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-arabic text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary",
															children: alt
														}, i))]
													})] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-3 p-3 bg-white/60 dark:bg-card/60 rounded border border-emerald-100 dark:border-emerald-800/30",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1",
														children: isRTL ? "مسوّغ الترجمة الطبية" : "Clinical Rationale"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-foreground leading-relaxed",
														children: hoveredMedGlossary.rationale
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 text-[11px] text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-foreground",
															children: isRTL ? "المرجع الطبي:" : "WHO Standard:"
														}),
														" ",
														hoveredMedGlossary.who_standard
													] })]
												}),
												hoveredMedGlossary.caution && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-red-700 dark:text-red-400",
														children: hoveredMedGlossary.caution
													})]
												})
											]
										})
									}, hoveredMedGlossary.english) }),
									medMatches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 pt-3 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider mb-2 flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), isRTL ? "مصطلحات طبية في النص" : "Medical Terms Detected"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: medMatches.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-sans font-bold text-foreground",
														children: g.english
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground/50",
														children: "→"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-arabic font-semibold text-emerald-700 dark:text-emerald-400",
														children: g.arabic
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setHoveredMedGlossary(g),
														className: "text-[10px] text-primary hover:underline ms-auto",
														children: isRTL ? "تفاصيل" : "Details"
													})
												]
											}, g.english))
										})]
									})
								]
							})]
						}),
						isLegal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 6
							},
							animate: {
								opacity: 1,
								y: 0
							},
							className: "classic-panel rounded-lg mb-4 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-5 py-4 bg-gradient-to-r from-stone-100/80 to-stone-50/40 dark:from-stone-900/40 dark:to-stone-950/20 border-b border-stone-200/60 dark:border-stone-800/40 flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 bg-stone-200/50 dark:bg-stone-800/50 rounded-md shadow-sm border border-stone-300/50 dark:border-stone-700/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-stone-700 dark:text-stone-300 text-xl leading-none",
										children: "⚖"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-serif font-bold text-stone-950 dark:text-stone-100",
										children: isRTL ? "المعجم القانوني المعتمد" : "UNTERM / Black's Law Controlled Glossary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-stone-800/80 dark:text-stone-200/70 mt-1 leading-relaxed max-w-lg",
										children: isRTL ? "قاعدة مصطلحات قانونية مقيدة مستندة إلى قاموس بلاك، UNTERM، ومعجم جامعة الدول العربية لضمان الدقة التشريعية." : "Controlled legal terminology grounded in Black's Law Dictionary, UNTERM, and Arab League Unified Legal Terminology."
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2 mb-4",
										children: LEGAL_GLOSSARY.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setHoveredLegalGlossary(hoveredLegalGlossary?.english === g.english ? null : g),
											className: cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all", hoveredLegalGlossary?.english === g.english ? "bg-stone-100 dark:bg-stone-900/30 border-stone-400 dark:border-stone-600 text-stone-800 dark:text-stone-300" : "bg-secondary border-border text-foreground hover:border-stone-400 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-900/20"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-sans text-sm font-bold",
													children: g.english
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "→"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-arabic text-[11px]",
													children: g.arabic
												})
											]
										}, g.english))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: hoveredLegalGlossary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: {
											opacity: 0,
											height: 0
										},
										animate: {
											opacity: 1,
											height: "auto"
										},
										exit: {
											opacity: 0,
											height: 0
										},
										className: "overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border border-stone-200 dark:border-stone-700/50 rounded-lg p-4 bg-stone-50/40 dark:bg-stone-900/10",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-start justify-between gap-4 mb-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-sans font-bold text-xl text-foreground",
														children: hoveredLegalGlossary.english
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 mt-1 flex-wrap",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-arabic text-sm font-semibold text-stone-800 dark:text-stone-300",
															children: hoveredLegalGlossary.arabic
														}), hoveredLegalGlossary.alternate_ar.slice(0, 2).map((alt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-arabic text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary",
															children: alt
														}, i))]
													})] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-3 p-3 bg-white/60 dark:bg-card/60 rounded border border-stone-100 dark:border-stone-800/30",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1",
														children: isRTL ? "مسوّغ الترجمة القانونية" : "Legal Translation Rationale"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-foreground leading-relaxed",
														children: hoveredLegalGlossary.rationale
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 text-[11px] text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5 text-stone-600 dark:text-stone-400 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-foreground",
															children: isRTL ? "المصدر القانوني:" : "Legal Source:"
														}),
														" ",
														hoveredLegalGlossary.legal_source
													] })]
												}),
												hoveredLegalGlossary.caution && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 flex items-start gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-red-700 dark:text-red-400",
														children: hoveredLegalGlossary.caution
													})]
												})
											]
										})
									}, hoveredLegalGlossary.english) }),
									legalMatches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 pt-3 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] uppercase font-bold text-stone-700 dark:text-stone-400 tracking-wider mb-2 flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), isRTL ? "مصطلحات قانونية في النص" : "Legal Terms Detected"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: legalMatches.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-sans font-bold text-foreground",
														children: g.english
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground/50",
														children: "→"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-arabic font-semibold text-stone-700 dark:text-stone-400",
														children: g.arabic
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setHoveredLegalGlossary(g),
														className: "text-[10px] text-primary hover:underline ms-auto",
														children: isRTL ? "تفاصيل" : "Details"
													})
												]
											}, g.english))
										})]
									})
								]
							})]
						}),
						alternatives.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "classic-panel rounded-lg mb-4 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowAlternatives((v) => !v),
								className: "w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4 text-primary" }),
										isRTL ? "ترجمات بديلة" : "Alternative Translations",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded font-mono",
											children: alternatives.length
										})
									]
								}), showAlternatives ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showAlternatives && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									height: 0,
									opacity: 0
								},
								animate: {
									height: "auto",
									opacity: 1
								},
								exit: {
									height: 0,
									opacity: 0
								},
								transition: { duration: .2 },
								className: "overflow-hidden border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-4 py-3 space-y-3",
									children: alternatives.map((alt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] font-mono text-muted-foreground w-5 text-center mt-0.5",
											children: [i + 1, "."]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setOutput(alt.alt),
												className: "alt-chip hover:bg-primary/10 hover:border-primary/30 font-medium",
												children: alt.alt
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-muted-foreground",
												children: ["← ", alt.original]
											})]
										}), alt.nuance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground italic leading-relaxed",
											children: alt.nuance
										})] })]
									}, i))
								})
							}) })]
						}),
						!isReligious && (localDictMatches.length > 0 || dictResult || terms.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "classic-panel rounded-lg mb-4 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowLexicon((v) => !v),
								className: "w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-primary" }), t.sidebarTitle]
								}), showLexicon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showLexicon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									height: 0,
									opacity: 0
								},
								animate: {
									height: "auto",
									opacity: 1
								},
								exit: {
									height: 0,
									opacity: 0
								},
								transition: { duration: .2 },
								className: "overflow-hidden border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											placeholder: uiLanguage === "ar" ? "ابحث في القاموس الإنجليزي..." : "Search English dictionary...",
											value: dictQuery,
											onChange: (e) => setDictQuery(e.target.value),
											className: "w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
										}),
										isDictLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground loading-shimmer",
											children: isRTL ? "جاري البحث..." : "Searching..."
										}),
										!isDictLoading && dictResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border border-border rounded p-3 bg-secondary/30",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-baseline gap-2 mb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-serif font-bold text-base text-foreground",
													children: dictResult.word
												}), dictResult.phonetics?.find((p) => p.text) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground font-mono",
													children: dictResult.phonetics.find((p) => p.text)?.text
												})]
											}), dictResult.meanings.slice(0, 2).map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] uppercase font-bold text-primary tracking-wider",
													children: m.partOfSpeech
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
													className: "mt-1 space-y-1",
													children: m.definitions.slice(0, 2).map((d, di) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
														className: "text-xs text-foreground/80 leading-relaxed",
														children: [
															"· ",
															d.definition,
															d.example && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-muted-foreground italic block ms-3",
																children: [
																	"\"",
																	d.example,
																	"\""
																]
															})
														]
													}, di))
												})]
											}, idx))]
										}),
										localDictMatches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider border-b border-border pb-1",
												children: isRTL ? "مصطلحات المعجم الأكاديمي" : "Academic Lexicon Terms"
											}), localDictMatches.map((entry) => {
												const srcVal = entry.translations[detected] || entry.translations[source] || entry.term;
												const tgtVal = entry.translations[target];
												const def = entry.definitions[uiLanguage];
												const nuance = entry.nuances[tone]?.[uiLanguage];
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "border border-border rounded p-3 bg-secondary/20 hover:border-primary/20 transition-colors",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2 mb-1.5 flex-wrap",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	onClick: () => setDictQuery(srcVal),
																	className: "font-serif font-bold text-sm text-foreground hover:text-primary transition-colors",
																	children: srcVal
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground/50",
																	children: "→"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-semibold text-sm text-primary",
																	children: tgtVal
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] text-muted-foreground font-mono bg-muted px-1 rounded",
																	children: entry.pos
																})
															]
														}),
														def && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs text-muted-foreground leading-relaxed mb-2 italic",
															children: def
														}),
														nuance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[11px] text-foreground/70 border-s-2 border-primary/30 ps-2",
															children: nuance
														})
													]
												}, entry.term);
											})]
										}),
										terms.filter((ti) => !localDictMatches.some((lm) => lm.term.toLowerCase() === ti.term.toLowerCase())).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider border-b border-border pb-1",
												children: isRTL ? "مصطلحات مستخرجة" : "Extracted Terms"
											}), terms.filter((ti) => !localDictMatches.some((lm) => lm.term.toLowerCase() === ti.term.toLowerCase())).map((ti) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-2 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setDictQuery(ti.term),
													className: "font-semibold text-foreground hover:text-primary transition-colors",
													children: ti.term
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground leading-relaxed",
													children: ti.note
												})]
											}, ti.term))]
										})
									]
								})
							}) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "classic-panel rounded-lg overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowHistory((v) => !v),
								className: "w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-primary" }),
										t.historyTitle,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-mono",
											children: history.length
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] flex items-center gap-1 text-emerald-600 dark:text-emerald-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), " AES-GCM"]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: (e) => {
											e.stopPropagation();
											setHistory([]);
											try {
												localStorage.removeItem(HISTORY_KEY);
											} catch {}
										},
										className: "text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 px-2 py-1 rounded hover:bg-destructive/10 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), t.clearHistory]
									}), showHistory ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showHistory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									height: 0,
									opacity: 0
								},
								animate: {
									height: "auto",
									opacity: 1
								},
								exit: {
									height: 0,
									opacity: 0
								},
								transition: { duration: .2 },
								className: "overflow-hidden border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4",
									children: history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: t.emptyHistory
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3",
										children: history.slice(0, 9).map((h) => {
											const srcLabel = LANGUAGES.find((l) => l.code === h.source)?.name ?? h.source;
											const dstLabel = LANGUAGES.find((l) => l.code === h.target)?.name ?? h.target;
											const domainItem = DOMAINS.find((d) => d.value === h.domain);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setSource(h.source);
													setTarget(h.target);
													setTone(h.tone);
													if (h.domain) setDomain(h.domain);
													setInput(h.sourceText);
												},
												className: "text-start border border-border rounded p-3 hover:border-primary/30 hover:bg-secondary/50 transition-all animate-slide-up",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 text-[10px] text-muted-foreground mb-1.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold text-foreground",
																children: srcLabel
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "h-2.5 w-2.5" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold text-foreground",
																children: dstLabel
															}),
															domainItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "ms-auto text-[9px] border border-border rounded px-1.5 py-0.5",
																children: [
																	domainItem.icon,
																	" ",
																	domainItem.label[uiLanguage]
																]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-semibold line-clamp-1 text-foreground mb-0.5",
														dir: "auto",
														children: h.sourceText
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground line-clamp-1",
														dir: "auto",
														children: h.translated
													})
												]
											}, h.id);
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-muted-foreground mt-3 flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3 w-3" }),
											" ",
											t.historyLimitAlert
										]
									})] })
								})
							}) })]
						})
					] }),
					mainTab === "tools" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "classic-panel rounded-lg overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-5 py-4 bg-gradient-to-r from-primary/8 to-primary/3 dark:from-primary/12 dark:to-primary/5 border-b border-border flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2.5 bg-primary/10 rounded-lg border border-primary/20 flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-5 w-5 text-primary" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-base font-serif font-bold text-foreground",
										children: isRTL ? "الأدوات اللغوية المساعدة" : "Linguistic Auxiliary Tools"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1 leading-relaxed max-w-xl",
										children: isRTL ? "مجموعة أدوات أكاديمية متكاملة مصممة لمساعدة الطلاب والباحثين في فهم البنية اللغوية، ومقارنة محركات الترجمة، واستذكار المصطلحات، وإعادة الصياغة الأكاديمية." : "An integrated suite of academic tools designed to help students and researchers understand linguistic structure, compare translation engines, memorize terminology, and produce academic rephrasing."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-4 py-3 flex flex-wrap gap-2 border-b border-border bg-secondary/20",
									children: [
										{
											id: "analyzer",
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Microscope, { className: "h-3.5 w-3.5" }),
											label: isRTL ? "المحلل اللغوي" : "Linguistic Analyzer"
										},
										{
											id: "benchmark",
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "h-3.5 w-3.5" }),
											label: isRTL ? "مقارنة المحركات" : "Translation Benchmark"
										},
										{
											id: "flashcards",
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCopy, { className: "h-3.5 w-3.5" }),
											label: isRTL ? "بطاقات الاستذكار" : "Academic Flashcards"
										},
										{
											id: "rephraser",
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5" }),
											label: isRTL ? "معيد الصياغة" : "Academic Rephraser"
										}
									].map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										id: `tool-tab-${tool.id}`,
										onClick: () => setActiveTool(tool.id),
										className: cn("tool-tab", activeTool === tool.id ? "tool-tab-active" : "hover:text-foreground hover:bg-secondary hover:border-border"),
										children: [tool.icon, tool.label]
									}, tool.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
										mode: "wait",
										children: [
											activeTool === "analyzer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												initial: {
													opacity: 0,
													y: 6
												},
												animate: {
													opacity: 1,
													y: 0
												},
												exit: {
													opacity: 0,
													y: -6
												},
												transition: { duration: .2 },
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mb-4",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
															className: "text-sm font-semibold text-foreground flex items-center gap-2 mb-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Microscope, { className: "h-4 w-4 text-primary" }), isRTL ? "🛠️ محرك التحليل اللغوي" : "🛠️ Linguistic Analyzer Engine"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[11px] text-muted-foreground",
															children: isRTL ? "أدخل نصاً لتحليل بنيته النحوية والدلالية — يُلوّن العناصر اللغوية (أفعال، أسماء، صفات…) ويستخرج المصطلحات المفتاحية والإحصائيات التفصيلية." : "Enter text to analyze its syntactic and semantic structure — highlights linguistic elements (verbs, nouns, adjectives…) and extracts key terms with detailed statistics."
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mb-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5",
															children: isRTL ? "النص المراد تحليله" : "Text to Analyze"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
															value: analyzerText,
															onChange: (e) => setAnalyzerText(e.target.value),
															placeholder: isRTL ? "أدخل نصاً بالإنجليزية للتحليل النحوي التفصيلي…" : "Enter English text for detailed syntactic analysis…",
															dir: "auto",
															rows: 4,
															className: "w-full resize-none bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all leading-relaxed"
														})]
													}),
													analyzerText.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "classic-panel rounded-lg p-4",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinguisticAnalyzer, {
															text: analyzerText,
															lang: "en",
															standalone: true
														})
													}),
													!analyzerText.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-center py-8 text-muted-foreground/50 text-sm italic",
														children: isRTL ? "أدخل نصاً أعلاه لبدء التحليل…" : "Enter text above to start analysis…"
													})
												]
											}, "analyzer"),
											activeTool === "benchmark" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												initial: {
													opacity: 0,
													y: 6
												},
												animate: {
													opacity: 1,
													y: 0
												},
												exit: {
													opacity: 0,
													y: -6
												},
												transition: { duration: .2 },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
														className: "text-sm font-semibold text-foreground flex items-center gap-2 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "h-4 w-4 text-primary" }), isRTL ? "📊 لوحة مقارنة محركات الترجمة" : "📊 Translation Benchmark Dashboard"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-muted-foreground",
														children: isRTL ? "قارن ترجمة لغوي السياقية المتخصصة مباشرةً مع Google Translate في صناديق متجاورة لرؤية الفروق الجوهرية." : "Compare Lughawi's specialized contextual translation directly with Google Translate in side-by-side panels to see the key differences."
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TranslationBenchmark, { isRTL })]
											}, "benchmark"),
											activeTool === "flashcards" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												initial: {
													opacity: 0,
													y: 6
												},
												animate: {
													opacity: 1,
													y: 0
												},
												exit: {
													opacity: 0,
													y: -6
												},
												transition: { duration: .2 },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
														className: "text-sm font-semibold text-foreground flex items-center gap-2 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCopy, { className: "h-4 w-4 text-primary" }), isRTL ? "🎴 بطاقات الاستذكار الأكاديمية" : "🎴 Academic Terminology Flashcards"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-muted-foreground",
														children: isRTL ? "اختبر نفسك في حفظ مصطلحات المعاجم المتخصصة (ديني، تقني، طبي، قانوني) وتعلّم نطقها الإنجليزي المعتمد." : "Test yourself on specialized glossary terminology (religious, technical, medical, legal) and learn their authoritative English equivalents."
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcademicFlashcards, { isRTL })]
											}, "flashcards"),
											activeTool === "rephraser" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												initial: {
													opacity: 0,
													y: 6
												},
												animate: {
													opacity: 1,
													y: 0
												},
												exit: {
													opacity: 0,
													y: -6
												},
												transition: { duration: .2 },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
														className: "text-sm font-semibold text-foreground flex items-center gap-2 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4 text-primary" }), isRTL ? "✍️ معيد الصياغة الأكاديمي" : "✍️ Academic Rephraser"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-muted-foreground",
														children: isRTL ? "أدخل نصاً عادياً، وسيعيد النظام صياغته فوراً بثلاثة أساليب بروتوكولية فصيحة تناسب الأبحاث والرسائل الأكاديمية." : "Enter plain text and the system instantly rephrases it into three elevated protocol styles suitable for academic research and dissertations."
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcademicRephraser, { isRTL })]
											}, "rephraser")
										]
									})
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border py-5",
				style: { background: "var(--card)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-5 text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center sm:items-start gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-foreground/90 hover:text-foreground transition-colors cursor-default",
										style: {
											fontFamily: "'Amiri', 'Cairo', serif",
											fontSize: "0.9rem"
										},
										children: "منصة لغوي"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "opacity-30",
										children: "|"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground/60 hover:text-foreground/90 transition-colors cursor-default",
										style: {
											fontFamily: "'Libre Baskerville', Georgia, serif",
											fontSize: "0.68rem",
											letterSpacing: "0.04em"
										},
										children: "Lughawi Platform"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground/70",
								dir: isRTL ? "rtl" : "ltr",
								children: [isRTL ? "جميع الحقوق محفوظة © لمنصة لغوي 2026 | تم التطوير بواسطة " : "All Rights Reserved © Lughawi Platform 2026 | Developed by ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground/60 hover:text-foreground transition-colors cursor-default",
									title: "Platform Developer & Intellectual Property Owner",
									children: "nrajmi"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "mailto:lughawi.platform@gmail.com",
								className: "flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-primary transition-colors group",
								title: isRTL ? "التواصل والشكاوي والمقترحات" : "Contact & Support",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3 group-hover:text-primary transition-colors" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "group-hover:underline underline-offset-2",
									children: "lughawi.platform@gmail.com"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 mt-0.5 text-[10px] font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/about",
										className: "text-muted-foreground hover:text-foreground transition-colors",
										children: isRTL ? "عن المنصة" : "About"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/privacy",
										className: "text-muted-foreground hover:text-foreground transition-colors",
										children: isRTL ? "سياسة الخصوصية" : "Privacy Policy"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/terms",
										className: "text-muted-foreground hover:text-foreground transition-colors",
										children: isRTL ? "شروط الاستخدام" : "Terms of Use"
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center sm:items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 flex-wrap justify-center sm:justify-end",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 text-emerald-600 dark:text-emerald-400" }), isRTL ? "مشفّر محلياً" : "Locally Encrypted"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "h-3 w-3 text-primary" }), "AR · EN · ES"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: ["☽ ", isRTL ? "معجم ديني" : "Religious Glossary"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 text-[10px] text-muted-foreground/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRTL ? "أدوات لغوية مساعدة" : "Linguistic Auxiliary Tools" })]
						})]
					})]
				})
			})
		]
	});
}
function LanguageSelect({ value, onChange, includeAuto, uiLang }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		value,
		onChange: (e) => onChange(e.target.value),
		className: "h-9 px-3 py-1.5 text-sm font-medium bg-card border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 hover:border-primary/30 transition-colors cursor-pointer min-w-[160px]",
		children: LANGUAGES.filter((l) => includeAuto || l.code !== "auto").map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: l.code,
			children: uiLang === "ar" ? l.name : l.en
		}, l.code))
	});
}
//#endregion
export { TranslatorPage as component };
