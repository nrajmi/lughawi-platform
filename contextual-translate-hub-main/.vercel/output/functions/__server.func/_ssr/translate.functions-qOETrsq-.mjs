import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { c as sanitizeInput, s as findDictionaryMatches } from "./dictionary-DBUIZZWv.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/translate.functions-qOETrsq-.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
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
var LANG_NAMES = {
	auto: "auto-detected",
	ar: "Arabic",
	en: "English",
	es: "Spanish"
};
var translateText_createServerFn_handler = createServerRpc({
	id: "923a5261ae4ef344d627d5738bf40c7cf9d0d2df09dff176b88978a9a856c370",
	name: "translateText",
	filename: "src/lib/translate.functions.ts"
}, (opts) => translateText.__executeServer(opts));
var translateText = createServerFn({ method: "POST" }).validator((data) => {
	try {
		return InputSchema.parse(data);
	} catch (e) {
		throw new Error("Invalid request data format");
	}
}).handler(translateText_createServerFn_handler, async ({ data }) => {
	const sanitizedText = sanitizeInput(data.text);
	const localMatches = findDictionaryMatches(sanitizedText, data.tone, data.domain);
	if (localMatches.length > 0) "" + localMatches.map((m) => `- Source term: "${m.translations.ar || m.term}" <-> Target term: "${m.translations[data.target] || m.term}" (Nuance: ${m.nuances[data.tone]?.[data.target] || m.definitions[data.target]})`).join("\n");
	try {
		let translated = "";
		let detected = data.source;
		LANG_NAMES[data.target] || data.target;
		{
			const encodedText = encodeURIComponent(sanitizedText);
			const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${data.source === "auto" ? "auto" : data.source}&tl=${data.target}&dt=t&q=${encodedText}`;
			const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
			if (!res.ok) throw new Error(`CLIENT_FALLBACK_REQUIRED`);
			const json = await res.json();
			if (Array.isArray(json) && Array.isArray(json[0])) translated = json[0].map((item) => item[0]).join("");
			else throw new Error("Invalid response format from translation API");
			detected = data.source === "auto" ? json[2] || data.source : data.source;
		}
		const terms = [];
		localMatches.forEach((localItem) => {
			const detectedKey = detected === "ar" || detected === "en" || detected === "es" ? detected : "en";
			const srcVal = localItem.translations[detectedKey] || localItem.term;
			if (!terms.some((t) => t.term.toLowerCase() === srcVal.toLowerCase())) {
				const targetTranslation = localItem.translations[data.target];
				const nuanceNote = localItem.nuances[data.tone]?.[data.target];
				if (targetTranslation && nuanceNote) terms.push({
					term: srcVal,
					note: `-> ${targetTranslation}: ${nuanceNote}`
				});
			}
		});
		return {
			translated,
			detected: detected || data.source,
			terms
		};
	} catch (error) {
		console.error("Translation error:", error);
		if (error instanceof Error && error.message.includes("CLIENT_FALLBACK_REQUIRED")) throw error;
		throw new Error("CLIENT_FALLBACK_REQUIRED");
	}
});
var rephraseText_createServerFn_handler = createServerRpc({
	id: "c9223e788378c4da8b3382ca5a7173aff91e27f045625ad9151d854469abed7a",
	name: "rephraseText",
	filename: "src/lib/translate.functions.ts"
}, (opts) => rephraseText.__executeServer(opts));
var rephraseText = createServerFn({ method: "POST" }).validator((data) => {
	try {
		return RephraseSchema.parse(data);
	} catch (e) {
		throw new Error("Invalid request data format");
	}
}).handler(rephraseText_createServerFn_handler, async ({ data }) => {
	const sanitizedText = sanitizeInput(data.text);
	try {
		throw new Error("API key not configured");
	} catch (e) {
		console.error("Rephrase API error, using fallback:", e);
		if (/[\u0600-\u06FF]/.test(sanitizedText)) return [
			{
				style: "Formal Academic",
				styleAr: "أكاديمي رسمي",
				text: `يُستدل من المعطيات المتاحة أن: ${sanitizedText}`,
				description: "Suitable for scholarly journals and dissertations",
				descriptionAr: "مناسب للمجلات العلمية والرسائل الجامعية"
			},
			{
				style: "Analytical Protocol",
				styleAr: "بروتوكول تحليلي",
				text: `وفقاً للمنهجية التحليلية المعتمدة، يتبيّن ما يلي: ${sanitizedText}`,
				description: "Precise analytical language for research methodology",
				descriptionAr: "لغة تحليلية دقيقة لمنهجية البحث العلمي"
			},
			{
				style: "Concise Academic",
				styleAr: "مختصر أكاديمي",
				text: `خلاصة القول: ${sanitizedText}`,
				description: "Condensed formal academic expression",
				descriptionAr: "تعبير أكاديمي رسمي موجز"
			}
		];
		return [
			{
				style: "Formal Academic",
				styleAr: "أكاديمي رسمي",
				text: `It is evident from the available evidence that: ${sanitizedText}`,
				description: "Suitable for scholarly journals and dissertations",
				descriptionAr: "مناسب للمجلات العلمية والرسائل الجامعية"
			},
			{
				style: "Analytical Protocol",
				styleAr: "بروتوكول تحليلي",
				text: `Based on rigorous analytical methodology, the following is ascertained: ${sanitizedText}`,
				description: "Precise analytical language for research methodology",
				descriptionAr: "لغة تحليلية دقيقة لمنهجية البحث"
			},
			{
				style: "Concise Academic",
				styleAr: "مختصر أكاديمي",
				text: `In summation: ${sanitizedText}`,
				description: "Condensed formal academic expression",
				descriptionAr: "تعبير أكاديمي رسمي موجز"
			}
		];
	}
});
//#endregion
export { rephraseText_createServerFn_handler, translateText_createServerFn_handler };
