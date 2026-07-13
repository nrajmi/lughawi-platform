import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as diagnosticService, t as cn } from "./utils-C2plKBZU.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as Unplug, d as ServerCrash, j as BrainCircuit, o as TriangleAlert, p as RefreshCw } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CZU2Xxh9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GlobalErrorBoundary = class extends import_react.Component {
	state = {
		hasError: false,
		alert: null
	};
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			alert: diagnosticService.analyzeError(error)
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error("Uncaught exception intercepted by GlobalErrorBoundary:", error, errorInfo);
	}
	handleReload = () => {
		window.location.reload();
	};
	render() {
		if (this.state.hasError && this.state.alert) {
			const { alert } = this.state;
			const getIcon = () => {
				switch (alert.type) {
					case "API_TIMEOUT": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServerCrash, { className: "h-10 w-10 text-orange-500" });
					case "NETWORK_DISCONNECT": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unplug, { className: "h-10 w-10 text-red-500" });
					case "LLM_HALLUCINATION": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrainCircuit, { className: "h-10 w-10 text-purple-500" });
					default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-10 w-10 text-destructive" });
				}
			};
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-screen flex items-center justify-center bg-background p-4 font-sans",
				dir: "auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("p-6 border-b border-border flex flex-col items-center text-center gap-4", alert.type === "API_TIMEOUT" ? "bg-orange-500/10" : alert.type === "NETWORK_DISCONNECT" ? "bg-red-500/10" : alert.type === "LLM_HALLUCINATION" ? "bg-purple-500/10" : "bg-destructive/10"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 bg-background rounded-full shadow-sm",
							children: getIcon()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold tracking-tight text-foreground",
							children: alert.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: alert.message
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 bg-secondary/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2",
								children: "Diagnostic Details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-background border border-border rounded p-3 text-xs font-mono text-muted-foreground overflow-x-auto max-h-[150px] overflow-y-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: "Error Code:"
										}),
										" ",
										alert.type
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "Timestamp:"
											}),
											" ",
											new Date(alert.timestamp).toISOString()
										]
									}),
									alert.details && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 pt-2 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: "Raw Output:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "mt-1 whitespace-pre-wrap",
											children: typeof alert.details === "string" ? alert.details : JSON.stringify(alert.details, null, 2)
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: this.handleReload,
							className: "w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-4 py-2.5 rounded-md transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), "Reload Application"]
						})]
					})]
				})
			});
		}
		return this.props.children;
	}
};
var styles_default = "/assets/styles-CS7IA_ic.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "منصة لغوي | Lughawi Platform - للترجمة السياقية المتخصصة" },
			{
				name: "description",
				content: "منصة لغوي (Lughawi Platform) — ترجمة سياقية متخصصة في المجالات الطبية، القانونية، التقنية، الدينية، والعامة. ثلاث لغات: العربية، الإنجليزية، الإسبانية."
			},
			{
				name: "author",
				content: "nrajmi"
			},
			{
				name: "creator",
				content: "nrajmi"
			},
			{
				name: "copyright",
				content: "منصة لغوي 2026 — nrajmi"
			},
			{
				name: "keywords",
				content: "منصة لغوي, Lughawi Platform, لغوي, ترجمة سياقية, ترجمة متخصصة, طبي, قانوني, تقني, ديني, عام, translation, arabic, english, spanish, islamic, religious, academic, legal, medical, technical, contextual"
			},
			{
				property: "og:title",
				content: "منصة لغوي | Lughawi Platform - للترجمة السياقية المتخصصة"
			},
			{
				property: "og:site_name",
				content: "منصة لغوي — Lughawi Platform"
			},
			{
				property: "og:description",
				content: "منصة لغوي (Lughawi Platform) — ترجمة سياقية متخصصة في المجالات الطبية، القانونية، التقنية، الدينية، والعامة."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "منصة لغوي | Lughawi Platform"
			},
			{
				name: "twitter:description",
				content: "ترجمة سياقية متخصصة — Contextual Specialized Translation"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@400;500;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$3 = () => import("./terms-RtI2bli7.mjs");
var Route$3 = createFileRoute("/terms")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "شروط الاستخدام | Terms of Use" }] })
});
var $$splitComponentImporter$2 = () => import("./privacy-BV9JjTjT.mjs");
var Route$2 = createFileRoute("/privacy")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "سياسة الخصوصية | Privacy Policy" }] })
});
var $$splitComponentImporter$1 = () => import("./about-CMMhGy0g.mjs");
var Route$1 = createFileRoute("/about")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "عن لغوي | About Lughawi" }] })
});
var $$splitComponentImporter = () => import("./routes-DkGNkNEt.mjs");
var Route = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [
		{ title: "لغوي — منصة الترجمة السياقية المتخصصة | Lughawi" },
		{
			name: "description",
			content: "لغوي (Lughawi) — منصة ترجمة احترافية بالذكاء الاصطناعي مع معاجم متخصصة في القانون، الطب، التقنية، والدين. ترجمة دقيقة بثلاث لغات: العربية، الإنجليزية، والإسبانية."
		},
		{
			name: "author",
			content: "nrajmi"
		},
		{
			name: "creator",
			content: "nrajmi"
		},
		{
			name: "robots",
			content: "index, follow"
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1.0"
		},
		{
			httpEquiv: "content-language",
			content: "ar, en, es"
		},
		{
			name: "keywords",
			content: "لغوي, Lughawi, ترجمة سياقية, ترجمة متخصصة, معجم طبي, معجم قانوني, معجم تقني, ترجمة دينية, WHO ICD-11, Black's Law, AI Translation, Arabic English Spanish, Generative AI translation"
		},
		{
			property: "og:title",
			content: "لغوي — منصة الترجمة السياقية المتخصصة | Lughawi"
		},
		{
			property: "og:site_name",
			content: "لغوي — Lughawi"
		},
		{
			property: "og:description",
			content: "منصة ترجمة احترافية بالذكاء الاصطناعي مع معاجم متخصصة مستندة إلى WHO ICD-11 وBlack's Law وIEEE."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			property: "og:locale",
			content: "ar_SA"
		},
		{
			property: "og:locale:alternate",
			content: "en_US"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: "لغوي — Lughawi | منصة الترجمة السياقية"
		},
		{
			name: "twitter:description",
			content: "ترجمة سياقية متخصصة في القانون، الطب، التقنية، والدين — مدعومة بالذكاء الاصطناعي"
		},
		{
			name: "application-name",
			content: "لغوي"
		},
		{
			name: "apple-mobile-web-app-title",
			content: "لغوي"
		},
		{
			name: "apple-mobile-web-app-capable",
			content: "yes"
		},
		{
			name: "apple-mobile-web-app-status-bar-style",
			content: "black-translucent"
		},
		{
			name: "theme-color",
			content: "#1E3A5F"
		}
	] })
});
var TermsRoute = Route$3.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$4
});
var PrivacyRoute = Route$2.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$4
});
var AboutRoute = Route$1.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$4
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	AboutRoute,
	PrivacyRoute,
	TermsRoute
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
