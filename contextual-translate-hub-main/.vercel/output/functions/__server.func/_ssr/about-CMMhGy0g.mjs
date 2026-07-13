import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-CMMhGy0g.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "classic-navbar sticky top-0 z-30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-7xl px-5 h-[60px] flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-display font-bold tracking-tight hover:opacity-80 transition-opacity",
					children: "العودة للمترجم"
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 mx-auto max-w-3xl px-5 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold mb-6 text-primary",
				children: "عن منصة لغوي"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "prose prose-slate dark:prose-invert",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg leading-relaxed mb-4",
						children: "لغوي (Lughawi) هي منصة ترجمة أكاديمية متخصصة تهدف إلى كسر حواجز اللغة في المجالات الدقيقة (LSP) كالقانون، الطب، التقنية، والدين."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg leading-relaxed mb-4",
						children: "نحن نؤمن بأن الترجمة ليست مجرد استبدال كلمات، بل هي نقل دقيق للمعاني والسياقات. لذلك، تعتمد المنصة على معاجم موثقة عالمياً (مثل ICD-11 و Black's Law) مقترنة بأحدث تقنيات الذكاء الاصطناعي التوليدي."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-bold mt-8 mb-4 text-primary",
						children: "تواصل معنا"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg leading-relaxed",
						children: ["للاستفسارات والمقترحات، يرجى التواصل مع مطور المنصة: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: "nrajmi"
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { AboutPage as component };
