import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-RtI2bli7.js
var import_jsx_runtime = require_jsx_runtime();
function TermsPage() {
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
				children: "شروط الاستخدام"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "prose prose-slate dark:prose-invert",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg leading-relaxed mb-4",
					children: "باستخدامك لمنصة لغوي، فإنك توافق على الشروط الآتية:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-disc ps-5 space-y-2 text-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الاستخدام الأكاديمي:" }), " المنصة مخصصة للترجمة السياقية المتخصصة. يُمنع استخدامها في إغراق الخوادم بطلبات عشوائية (Spam)."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "المسؤولية الطبية والقانونية:" }), " رغم اعتمادنا على معاجم رصينة، الترجمات الطبية والقانونية مُقدمة بغرض الإرشاد ولا تغني عن الاستشارة التخصصية الرسمية."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "حدود الاستخدام:" }), " نحتفظ بالحق في تقييد الوصول مؤقتاً في حال استنفاد الحصص المخصصة لـ API بغرض الحفاظ على جودة الخدمة لجميع المستخدمين."] })
					]
				})]
			})]
		})]
	});
}
//#endregion
export { TermsPage as component };
