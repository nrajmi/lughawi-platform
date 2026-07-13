var world_default = {
	methods: {
		one: {},
		two: {},
		three: {},
		four: {}
	},
	model: {
		one: {},
		two: {},
		three: {}
	},
	compute: {},
	hooks: []
};
//#endregion
//#region node_modules/compromise/src/API/methods/compute.js
var isArray$11 = (input) => Object.prototype.toString.call(input) === "[object Array]";
var fns$5 = { 
/** add metadata to term objects */
compute: function(input) {
	const { world } = this;
	const compute = world.compute;
	if (typeof input === "string" && compute.hasOwnProperty(input)) compute[input](this);
	else if (isArray$11(input)) input.forEach((name) => {
		if (world.compute.hasOwnProperty(name)) compute[name](this);
		else console.warn("no compute:", input);
	});
	else if (typeof input === "function") input(this);
	else console.warn("no compute:", input);
	return this;
} };
//#endregion
//#region node_modules/compromise/src/API/methods/loops.js
var forEach = function(cb) {
	this.fullPointer.forEach((ptr, i) => {
		cb(this.update([ptr]), i);
	});
	return this;
};
var map = function(cb, empty) {
	const res = this.fullPointer.map((ptr, i) => {
		const out = cb(this.update([ptr]), i);
		if (out === void 0) return this.none();
		return out;
	});
	if (res.length === 0) return empty || this.update([]);
	if (res[0] !== void 0) {
		if (typeof res[0] === "string") return res;
		if (typeof res[0] === "object" && (res[0] === null || !res[0].isView)) return res;
	}
	let all = [];
	res.forEach((ptr) => {
		all = all.concat(ptr.fullPointer);
	});
	return this.toView(all);
};
var filter = function(cb) {
	let ptrs = this.fullPointer;
	ptrs = ptrs.filter((ptr, i) => {
		return cb(this.update([ptr]), i);
	});
	return this.update(ptrs);
};
var find$6 = function(cb) {
	const found = this.fullPointer.find((ptr, i) => {
		return cb(this.update([ptr]), i);
	});
	return this.update([found]);
};
var some = function(cb) {
	return this.fullPointer.some((ptr, i) => {
		return cb(this.update([ptr]), i);
	});
};
var random = function(n = 1) {
	let ptrs = this.fullPointer;
	let r = Math.floor(Math.random() * ptrs.length);
	if (r + n > this.length) {
		r = this.length - n;
		r = r < 0 ? 0 : r;
	}
	ptrs = ptrs.slice(r, r + n);
	return this.update(ptrs);
};
var loops_default = {
	forEach,
	map,
	filter,
	find: find$6,
	some,
	random
};
//#endregion
//#region node_modules/compromise/src/API/methods/utils.js
var utils = {
	/** */
	termList: function() {
		return this.methods.one.termList(this.docs);
	},
	/** return individual terms*/
	terms: function(n) {
		const m = this.match(".");
		return typeof n === "number" ? m.eq(n) : m;
	},
	/** */
	groups: function(group) {
		if (group || group === 0) return this.update(this._groups[group] || []);
		const res = {};
		Object.keys(this._groups).forEach((k) => {
			res[k] = this.update(this._groups[k]);
		});
		return res;
	},
	/** */
	eq: function(n) {
		let ptr = this.pointer;
		if (!ptr) ptr = this.docs.map((_doc, i) => [i]);
		if (ptr[n]) return this.update([ptr[n]]);
		return this.none();
	},
	/** */
	first: function() {
		return this.eq(0);
	},
	/** */
	last: function() {
		const n = this.fullPointer.length - 1;
		return this.eq(n);
	},
	/** grab term[0] for every match */
	firstTerms: function() {
		return this.match("^.");
	},
	/** grab the last term for every match  */
	lastTerms: function() {
		return this.match(".$");
	},
	/** */
	slice: function(min, max) {
		let pntrs = this.pointer || this.docs.map((_o, n) => [n]);
		pntrs = pntrs.slice(min, max);
		return this.update(pntrs);
	},
	/** return a view of the entire document */
	all: function() {
		return this.update().toView();
	},
	/**  */
	fullSentences: function() {
		const ptrs = this.fullPointer.map((a) => [a[0]]);
		return this.update(ptrs).toView();
	},
	/** return a view of no parts of the document */
	none: function() {
		return this.update([]);
	},
	/** are these two views looking at the same words? */
	isDoc: function(b) {
		if (!b || !b.isView) return false;
		const aPtr = this.fullPointer;
		const bPtr = b.fullPointer;
		if (!aPtr.length === bPtr.length) return false;
		return aPtr.every((ptr, i) => {
			if (!bPtr[i]) return false;
			return ptr[0] === bPtr[i][0] && ptr[1] === bPtr[i][1] && ptr[2] === bPtr[i][2];
		});
	},
	/** how many seperate terms does the document have? */
	wordCount: function() {
		return this.docs.reduce((count, terms) => {
			count += terms.filter((t) => t.text !== "").length;
			return count;
		}, 0);
	},
	isFull: function() {
		const ptrs = this.pointer;
		if (!ptrs) return true;
		if (ptrs.length === 0 || ptrs[0][0] !== 0) return false;
		let wantTerms = 0;
		let haveTerms = 0;
		this.document.forEach((terms) => wantTerms += terms.length);
		this.docs.forEach((terms) => haveTerms += terms.length);
		return wantTerms === haveTerms;
	},
	getNth: function(n) {
		if (typeof n === "number") return this.eq(n);
		else if (typeof n === "string") return this.if(n);
		return this;
	}
};
utils.group = utils.groups;
utils.fullSentence = utils.fullSentences;
utils.sentence = utils.fullSentences;
utils.lastTerm = utils.lastTerms;
utils.firstTerm = utils.firstTerms;
//#endregion
//#region node_modules/compromise/src/API/methods/index.js
var methods$14 = Object.assign({}, utils, fns$5, loops_default);
methods$14.get = methods$14.eq;
//#endregion
//#region node_modules/compromise/src/API/View.js
var View = class View {
	constructor(document, pointer, groups = {}) {
		[
			["document", document],
			["world", world_default],
			["_groups", groups],
			["_cache", null],
			["viewType", "View"]
		].forEach((a) => {
			Object.defineProperty(this, a[0], {
				value: a[1],
				writable: true
			});
		});
		this.ptrs = pointer;
	}
	get docs() {
		let docs = this.document;
		if (this.ptrs) docs = world_default.methods.one.getDoc(this.ptrs, this.document);
		return docs;
	}
	get pointer() {
		return this.ptrs;
	}
	get methods() {
		return this.world.methods;
	}
	get model() {
		return this.world.model;
	}
	get hooks() {
		return this.world.hooks;
	}
	get isView() {
		return true;
	}
	get found() {
		return this.docs.length > 0;
	}
	get length() {
		return this.docs.length;
	}
	get fullPointer() {
		const { docs, ptrs, document } = this;
		return (ptrs || docs.map((_d, n) => [n])).map((a) => {
			let [n, start, end, id, endId] = a;
			start = start || 0;
			end = end || (document[n] || []).length;
			if (document[n] && document[n][start]) {
				id = id || document[n][start].id;
				if (document[n][end - 1]) endId = endId || document[n][end - 1].id;
			}
			return [
				n,
				start,
				end,
				id,
				endId
			];
		});
	}
	update(pointer) {
		const m = new View(this.document, pointer);
		if (this._cache && pointer && pointer.length > 0) {
			const cache = [];
			pointer.forEach((ptr, i) => {
				const [n, start, end] = ptr;
				if (ptr.length === 1) cache[i] = this._cache[n];
				else if (start === 0 && this.document[n].length === end) cache[i] = this._cache[n];
			});
			if (cache.length > 0) m._cache = cache;
		}
		m.world = this.world;
		return m;
	}
	toView(pointer) {
		return new View(this.document, pointer || this.pointer);
	}
	fromText(input) {
		const { methods } = this;
		const document = methods.one.tokenize.fromString(input, this.world);
		const doc = new View(document);
		doc.world = this.world;
		doc.compute([
			"normal",
			"freeze",
			"lexicon"
		]);
		if (this.world.compute.preTagger) doc.compute("preTagger");
		doc.compute("unfreeze");
		return doc;
	}
	clone() {
		let document = this.document.slice(0);
		document = document.map((terms) => {
			return terms.map((term) => {
				term = Object.assign({}, term);
				term.tags = new Set(term.tags);
				return term;
			});
		});
		const m = this.update(this.pointer);
		m.document = document;
		m._cache = this._cache;
		return m;
	}
};
Object.assign(View.prototype, methods$14);
//#endregion
//#region node_modules/compromise/src/_version.js
var _version_default = "14.15.1";
//#endregion
//#region node_modules/compromise/src/API/extend.js
var isObject$6 = function(item) {
	return item && typeof item === "object" && !Array.isArray(item);
};
var isArray$10 = function(arr) {
	return Object.prototype.toString.call(arr) === "[object Array]";
};
function mergeDeep(model, plugin) {
	if (isObject$6(plugin)) for (const key in plugin) if (isObject$6(plugin[key])) {
		if (!model[key]) Object.assign(model, { [key]: {} });
		mergeDeep(model[key], plugin[key]);
	} else Object.assign(model, { [key]: plugin[key] });
	return model;
}
function mergeQuick(model, plugin) {
	for (const key in plugin) {
		model[key] = model[key] || {};
		Object.assign(model[key], plugin[key]);
	}
	return model;
}
var addIrregulars = function(model, conj) {
	const m = model.two.models || {};
	Object.keys(conj).forEach((k) => {
		if (conj[k].pastTense) {
			if (m.toPast) m.toPast.ex[k] = conj[k].pastTense;
			if (m.fromPast) m.fromPast.ex[conj[k].pastTense] = k;
		}
		if (conj[k].presentTense) {
			if (m.toPresent) m.toPresent.ex[k] = conj[k].presentTense;
			if (m.fromPresent) m.fromPresent.ex[conj[k].presentTense] = k;
		}
		if (conj[k].gerund) {
			if (m.toGerund) m.toGerund.ex[k] = conj[k].gerund;
			if (m.fromGerund) m.fromGerund.ex[conj[k].gerund] = k;
		}
		if (conj[k].comparative) {
			if (m.toComparative) m.toComparative.ex[k] = conj[k].comparative;
			if (m.fromComparative) m.fromComparative.ex[conj[k].comparative] = k;
		}
		if (conj[k].superlative) {
			if (m.toSuperlative) m.toSuperlative.ex[k] = conj[k].superlative;
			if (m.fromSuperlative) m.fromSuperlative.ex[conj[k].superlative] = k;
		}
	});
};
var extend = function(plugin, world, View, nlp) {
	if (isArray$10(plugin)) {
		plugin.forEach((p) => extend(p, world, View, nlp));
		return;
	}
	const { methods, model, compute, hooks } = world;
	if (plugin.methods) mergeQuick(methods, plugin.methods);
	if (plugin.model) mergeDeep(model, plugin.model);
	if (plugin.irregulars) addIrregulars(model, plugin.irregulars);
	if (plugin.compute) Object.assign(compute, plugin.compute);
	if (hooks) world.hooks = hooks.concat(plugin.hooks || []);
	if (plugin.api) plugin.api(View);
	if (plugin.lib) Object.keys(plugin.lib).forEach((k) => nlp[k] = plugin.lib[k]);
	if (plugin.tags) nlp.addTags(plugin.tags);
	if (plugin.words) nlp.addWords(plugin.words);
	if (plugin.frozen) nlp.addWords(plugin.frozen, true);
	if (plugin.mutate) plugin.mutate(world, nlp);
};
//#endregion
//#region node_modules/compromise/src/API/_lib.js
/** log the decision-making to console */
var verbose = function(set) {
	const env = typeof process === "undefined" || !process.env ? self.env || {} : process.env;
	env.DEBUG_TAGS = set === "tagger" || set === true ? true : "";
	env.DEBUG_MATCH = set === "match" || set === true ? true : "";
	env.DEBUG_CHUNKS = set === "chunker" || set === true ? true : "";
	return this;
};
//#endregion
//#region node_modules/compromise/src/API/inputs.js
var isObject$5 = (val) => {
	return Object.prototype.toString.call(val) === "[object Object]";
};
var isArray$9 = function(arr) {
	return Object.prototype.toString.call(arr) === "[object Array]";
};
var fromJson = function(json) {
	return json.map((o) => {
		return o.terms.map((term) => {
			if (isArray$9(term.tags)) term.tags = new Set(term.tags);
			return term;
		});
	});
};
var preTokenized = function(arr) {
	return arr.map((a) => {
		return a.map((str) => {
			return {
				text: str,
				normal: str,
				pre: "",
				post: " ",
				tags: /* @__PURE__ */ new Set()
			};
		});
	});
};
var inputs = function(input, View, world) {
	const { methods } = world;
	const doc = new View([]);
	doc.world = world;
	if (typeof input === "number") input = String(input);
	if (!input) return doc;
	if (typeof input === "string") return new View(methods.one.tokenize.fromString(input, world));
	if (isObject$5(input) && input.isView) return new View(input.document, input.ptrs);
	if (isArray$9(input)) {
		if (isArray$9(input[0])) return new View(preTokenized(input));
		return new View(fromJson(input));
	}
	return doc;
};
//#endregion
//#region node_modules/compromise/src/nlp.js
var world = Object.assign({}, world_default);
var nlp = function(input, lex) {
	if (lex) nlp.addWords(lex);
	const doc = inputs(input, View, world);
	if (input) doc.compute(world.hooks);
	return doc;
};
Object.defineProperty(nlp, "_world", {
	value: world,
	writable: true
});
/** don't run the POS-tagger */
nlp.tokenize = function(input, lex) {
	const { compute } = this._world;
	if (lex) nlp.addWords(lex);
	const doc = inputs(input, View, world);
	if (compute.contractions) doc.compute([
		"alias",
		"normal",
		"machine",
		"contractions"
	]);
	return doc;
};
/** extend compromise functionality */
nlp.plugin = function(plugin) {
	extend(plugin, this._world, View, this);
	return this;
};
nlp.extend = nlp.plugin;
/** reach-into compromise internals */
nlp.world = function() {
	return this._world;
};
nlp.model = function() {
	return this._world.model;
};
nlp.methods = function() {
	return this._world.methods;
};
nlp.hooks = function() {
	return this._world.hooks;
};
/** log the decision-making to console */
nlp.verbose = verbose;
/** current library release version */
nlp.version = _version_default;
//#endregion
//#region node_modules/compromise/src/1-one/cache/methods/cacheDoc.js
var createCache = function(document) {
	return document.map((terms) => {
		const items = /* @__PURE__ */ new Set();
		terms.forEach((term) => {
			if (term.normal !== "") items.add(term.normal);
			if (term.switch) items.add(`%${term.switch}%`);
			if (term.implicit) items.add(term.implicit);
			if (term.machine) items.add(term.machine);
			if (term.root) items.add(term.root);
			if (term.alias) term.alias.forEach((str) => items.add(str));
			const tags = Array.from(term.tags);
			for (let t = 0; t < tags.length; t += 1) items.add("#" + tags[t]);
		});
		return items;
	});
};
//#endregion
//#region node_modules/compromise/src/1-one/cache/methods/index.js
var methods_default$7 = { one: { cacheDoc: createCache } };
//#endregion
//#region node_modules/compromise/src/1-one/cache/api.js
var methods$13 = {
	/** */
	cache: function() {
		this._cache = this.methods.one.cacheDoc(this.document);
		return this;
	},
	/** */
	uncache: function() {
		this._cache = null;
		return this;
	}
};
var addAPI$3 = function(View) {
	Object.assign(View.prototype, methods$13);
};
//#endregion
//#region node_modules/compromise/src/1-one/cache/plugin.js
var plugin_default$26 = {
	api: addAPI$3,
	compute: { cache: function(view) {
		view._cache = view.methods.one.cacheDoc(view.document);
	} },
	methods: methods_default$7
};
//#endregion
//#region node_modules/compromise/src/1-one/change/api/case.js
var case_default = {
	/** */
	toLowerCase: function() {
		this.termList().forEach((t) => {
			t.text = t.text.toLowerCase();
		});
		return this;
	},
	/** */
	toUpperCase: function() {
		this.termList().forEach((t) => {
			t.text = t.text.toUpperCase();
		});
		return this;
	},
	/** */
	toTitleCase: function() {
		this.termList().forEach((t) => {
			t.text = t.text.replace(/^ *[a-z\u00C0-\u00FF]/, (x) => x.toUpperCase());
		});
		return this;
	},
	/** */
	toCamelCase: function() {
		this.docs.forEach((terms) => {
			terms.forEach((t, i) => {
				if (i !== 0) t.text = t.text.replace(/^ *[a-z\u00C0-\u00FF]/, (x) => x.toUpperCase());
				if (i !== terms.length - 1) t.post = "";
			});
		});
		return this;
	}
};
//#endregion
//#region node_modules/compromise/src/1-one/change/api/lib/insert.js
var isTitleCase$4 = (str) => /^\p{Lu}[\p{Ll}'’]/u.test(str) || /^\p{Lu}$/u.test(str);
var toTitleCase$2 = (str) => str.replace(/^\p{Ll}/u, (x) => x.toUpperCase());
var toLowerCase$1 = (str) => str.replace(/^\p{Lu}/u, (x) => x.toLowerCase());
var spliceArr = (parent, index, child) => {
	child.forEach((term) => term.dirty = true);
	if (parent) {
		const args = [index, 0].concat(child);
		Array.prototype.splice.apply(parent, args);
	}
	return parent;
};
var endSpace = function(terms) {
	const hasSpace = / $/;
	const hasDash = /[-–—]/;
	const lastTerm = terms[terms.length - 1];
	if (lastTerm && !hasSpace.test(lastTerm.post) && !hasDash.test(lastTerm.post)) lastTerm.post += " ";
};
var movePunct = (source, end, needle) => {
	const juicy = /[-.?!,;:)–—'"]/g;
	const wasLast = source[end - 1];
	if (!wasLast) return;
	const post = wasLast.post;
	if (juicy.test(post)) {
		const punct = post.match(juicy).join("");
		const last = needle[needle.length - 1];
		last.post = punct + last.post;
		wasLast.post = wasLast.post.replace(juicy, "");
	}
};
var moveTitleCase = function(home, start, needle) {
	const from = home[start];
	if (start !== 0 || !isTitleCase$4(from.text)) return;
	needle[0].text = toTitleCase$2(needle[0].text);
	const old = home[start];
	if (old.tags.has("ProperNoun") || old.tags.has("Acronym")) return;
	if (isTitleCase$4(old.text) && old.text.length > 1) old.text = toLowerCase$1(old.text);
};
var cleanPrepend = function(home, ptr, needle, document) {
	const [n, start, end] = ptr;
	if (start === 0) endSpace(needle);
	else if (end === document[n].length) endSpace(needle);
	else {
		endSpace(needle);
		endSpace([home[ptr[1]]]);
	}
	moveTitleCase(home, start, needle);
	spliceArr(home, start, needle);
};
var cleanAppend = function(home, ptr, needle, document) {
	const [n, , end] = ptr;
	const total = (document[n] || []).length;
	if (end < total) {
		movePunct(home, end, needle);
		endSpace(needle);
	} else if (total === end) {
		endSpace(home);
		movePunct(home, end, needle);
		if (document[n + 1]) needle[needle.length - 1].post += " ";
	}
	spliceArr(home, ptr[2], needle);
	ptr[4] = needle[needle.length - 1].id;
};
//#endregion
//#region node_modules/compromise/src/1-one/change/compute/uuid.js
var index$1 = 0;
var pad3 = (str) => {
	str = str.length < 3 ? "0" + str : str;
	return str.length < 3 ? "0" + str : str;
};
var toId = function(term) {
	let [n, i] = term.index || [0, 0];
	index$1 += 1;
	index$1 = index$1 > 46655 ? 0 : index$1;
	n = n > 46655 ? 0 : n;
	i = i > 1294 ? 0 : i;
	let id = pad3(index$1.toString(36));
	id += pad3(n.toString(36));
	let tx = i.toString(36);
	tx = tx.length < 2 ? "0" + tx : tx;
	id += tx;
	const r = parseInt(Math.random() * 36, 10);
	id += r.toString(36);
	return term.normal + "|" + id.toUpperCase();
};
//#endregion
//#region node_modules/compromise/src/1-one/change/api/insert.js
var expand$3 = function(m) {
	if (m.has("@hasContraction") && typeof m.contractions === "function") m.grow("@hasContraction").contractions().expand();
};
var isArray$8 = (arr) => Object.prototype.toString.call(arr) === "[object Array]";
var addIds$2 = function(terms) {
	terms = terms.map((term) => {
		term.id = toId(term);
		return term;
	});
	return terms;
};
var getTerms = function(input, world) {
	const { methods } = world;
	if (typeof input === "string") return methods.one.tokenize.fromString(input, world)[0];
	if (typeof input === "object" && input.isView) return input.clone().docs[0] || [];
	if (isArray$8(input)) return isArray$8(input[0]) ? input[0] : input;
	return [];
};
var insert = function(input, view, prepend) {
	const { document, world } = view;
	view.uncache();
	const ptrs = view.fullPointer;
	const selfPtrs = view.fullPointer;
	view.forEach((m, i) => {
		const ptr = m.fullPointer[0];
		const [n] = ptr;
		const home = document[n];
		let terms = getTerms(input, world);
		if (terms.length === 0) return;
		terms = addIds$2(terms);
		if (prepend) {
			expand$3(view.update([ptr]).firstTerm());
			cleanPrepend(home, ptr, terms, document);
		} else {
			expand$3(view.update([ptr]).lastTerm());
			cleanAppend(home, ptr, terms, document);
		}
		if (document[n] && document[n][ptr[1]]) ptr[3] = document[n][ptr[1]].id;
		selfPtrs[i] = ptr;
		ptr[2] += terms.length;
		ptrs[i] = ptr;
	});
	const doc = view.toView(ptrs);
	view.ptrs = selfPtrs;
	doc.compute([
		"id",
		"index",
		"freeze",
		"lexicon"
	]);
	if (doc.world.compute.preTagger) doc.compute("preTagger");
	doc.compute("unfreeze");
	return doc;
};
var fns$4 = {
	insertAfter: function(input) {
		return insert(input, this, false);
	},
	insertBefore: function(input) {
		return insert(input, this, true);
	}
};
fns$4.append = fns$4.insertAfter;
fns$4.prepend = fns$4.insertBefore;
fns$4.insert = fns$4.insertAfter;
//#endregion
//#region node_modules/compromise/src/1-one/change/api/replace.js
var dollarStub = /\$[0-9a-z]+/g;
var fns$3 = {};
var isTitleCase$3 = (str) => /^\p{Lu}[\p{Ll}'’]/u.test(str) || /^\p{Lu}$/u.test(str);
var toTitleCase$1 = (str) => str.replace(/^\p{Ll}/u, (x) => x.toUpperCase());
var toLowerCase = (str) => str.replace(/^\p{Lu}/u, (x) => x.toLowerCase());
var replaceByFn = function(main, fn, keep) {
	main.forEach((m) => {
		const out = fn(m);
		m.replaceWith(out, keep);
	});
	return main;
};
var subDollarSign = function(input, main) {
	if (typeof input !== "string") return input;
	const groups = main.groups();
	input = input.replace(dollarStub, (a) => {
		const num = a.replace(/\$/, "");
		if (groups.hasOwnProperty(num)) return groups[num].text();
		return a;
	});
	return input;
};
fns$3.replaceWith = function(input, keep = {}) {
	let ptrs = this.fullPointer;
	const main = this;
	this.uncache();
	if (typeof input === "function") return replaceByFn(main, input, keep);
	const terms = main.docs[0];
	if (!terms) return main;
	const isOriginalPossessive = keep.possessives && terms[terms.length - 1].tags.has("Possessive");
	const isOriginalTitleCase = keep.case && isTitleCase$3(terms[0].text);
	input = subDollarSign(input, main);
	const original = this.update(ptrs);
	ptrs = ptrs.map((ptr) => ptr.slice(0, 3));
	const oldTags = (original.docs[0] || []).map((term) => Array.from(term.tags));
	const originalPre = original.docs[0][0].pre;
	const originalPost = original.docs[0][original.docs[0].length - 1].post;
	if (typeof input === "string") input = this.fromText(input).compute("id");
	main.insertAfter(input);
	if (original.has("@hasContraction") && main.contractions) main.grow("@hasContraction+").contractions().expand();
	main.delete(original);
	if (isOriginalPossessive) {
		const tmp = main.docs[0];
		const term = tmp[tmp.length - 1];
		if (!term.tags.has("Possessive")) {
			term.text += "'s";
			term.normal += "'s";
			term.tags.add("Possessive");
		}
	}
	if (originalPre && main.docs[0]) main.docs[0][0].pre = originalPre;
	if (originalPost && main.docs[0]) {
		const lastOne = main.docs[0][main.docs[0].length - 1];
		if (!lastOne.post.trim()) lastOne.post = originalPost;
	}
	const m = main.toView(ptrs).compute([
		"index",
		"freeze",
		"lexicon"
	]);
	if (m.world.compute.preTagger) m.compute("preTagger");
	m.compute("unfreeze");
	if (keep.tags) m.terms().forEach((term, i) => {
		term.tagSafe(oldTags[i]);
	});
	if (!m.docs[0] || !m.docs[0][0]) return m;
	if (keep.case) {
		const transformCase = isOriginalTitleCase ? toTitleCase$1 : toLowerCase;
		m.docs[0][0].text = transformCase(m.docs[0][0].text);
	}
	return m;
};
fns$3.replace = function(match, input, keep) {
	if (match && !input) return this.replaceWith(match, keep);
	const m = this.match(match);
	if (!m.found) return this;
	this.soften();
	return m.replaceWith(input, keep);
};
//#endregion
//#region node_modules/compromise/src/1-one/change/api/lib/remove.js
var repairPunct = function(terms, len) {
	const last = terms.length - 1;
	const from = terms[last];
	const to = terms[last - len];
	if (to && from) {
		to.post += from.post;
		to.post = to.post.replace(/ +([.?!,;:])/, "$1");
		to.post = to.post.replace(/[,;:]+([.?!])/, "$1");
	}
};
var pluckOut = function(document, nots) {
	nots.forEach((ptr) => {
		const [n, start, end] = ptr;
		const len = end - start;
		if (!document[n]) return;
		if (end === document[n].length && end > 1) repairPunct(document[n], len);
		document[n].splice(start, len);
	});
	for (let i = document.length - 1; i >= 0; i -= 1) if (document[i].length === 0) {
		document.splice(i, 1);
		if (i === document.length && document[i - 1]) {
			const terms = document[i - 1];
			const lastTerm = terms[terms.length - 1];
			if (lastTerm) lastTerm.post = lastTerm.post.trimEnd();
		}
	}
	return document;
};
//#endregion
//#region node_modules/compromise/src/1-one/change/api/remove.js
var fixPointers$1 = function(ptrs, gonePtrs) {
	ptrs = ptrs.map((ptr) => {
		const [n] = ptr;
		if (!gonePtrs[n]) return ptr;
		gonePtrs[n].forEach((no) => {
			const len = no[2] - no[1];
			if (ptr[1] <= no[1] && ptr[2] >= no[2]) ptr[2] -= len;
		});
		return ptr;
	});
	ptrs.forEach((ptr, i) => {
		if (ptr[1] === 0 && ptr[2] == 0) for (let n = i + 1; n < ptrs.length; n += 1) {
			ptrs[n][0] -= 1;
			if (ptrs[n][0] < 0) ptrs[n][0] = 0;
		}
	});
	ptrs = ptrs.filter((ptr) => ptr[2] - ptr[1] > 0);
	ptrs = ptrs.map((ptr) => {
		ptr[3] = null;
		ptr[4] = null;
		return ptr;
	});
	return ptrs;
};
var methods$12 = { 
/** */
remove: function(reg) {
	const { indexN } = this.methods.one.pointer;
	this.uncache();
	let self = this.all();
	let not = this;
	if (reg) {
		self = this;
		not = this.match(reg);
	}
	const isFull = !self.ptrs;
	if (not.has("@hasContraction") && not.contractions) not.grow("@hasContraction").contractions().expand();
	let ptrs = self.fullPointer;
	const nots = not.fullPointer.reverse();
	const document = pluckOut(this.document, nots);
	const gonePtrs = indexN(nots);
	ptrs = fixPointers$1(ptrs, gonePtrs);
	self.ptrs = ptrs;
	self.document = document;
	self.compute("index");
	if (isFull) self.ptrs = void 0;
	if (!reg) {
		this.ptrs = [];
		return self.none();
	}
	return self.toView(ptrs);
} };
methods$12.delete = methods$12.remove;
//#endregion
//#region node_modules/compromise/src/1-one/change/api/whitespace.js
var methods$11 = {
	/** add this punctuation or whitespace before each match: */
	pre: function(str, concat) {
		if (str === void 0 && this.found) return this.docs[0][0].pre;
		this.docs.forEach((terms) => {
			const term = terms[0];
			if (concat === true) term.pre += str;
			else term.pre = str;
		});
		return this;
	},
	/** add this punctuation or whitespace after each match: */
	post: function(str, concat) {
		if (str === void 0) {
			const last = this.docs[this.docs.length - 1];
			return last[last.length - 1].post;
		}
		this.docs.forEach((terms) => {
			const term = terms[terms.length - 1];
			if (concat === true) term.post += str;
			else term.post = str;
		});
		return this;
	},
	/** remove whitespace from start/end */
	trim: function() {
		if (!this.found) return this;
		const docs = this.docs;
		const start = docs[0][0];
		start.pre = start.pre.trimStart();
		const last = docs[docs.length - 1];
		const end = last[last.length - 1];
		end.post = end.post.trimEnd();
		return this;
	},
	/** connect words with hyphen, and remove whitespace */
	hyphenate: function() {
		this.docs.forEach((terms) => {
			terms.forEach((t, i) => {
				if (i !== 0) t.pre = "";
				if (terms[i + 1]) t.post = "-";
			});
		});
		return this;
	},
	/** remove hyphens between words, and set whitespace */
	dehyphenate: function() {
		const hasHyphen = /[-–—]/;
		this.docs.forEach((terms) => {
			terms.forEach((t) => {
				if (hasHyphen.test(t.post)) t.post = " ";
			});
		});
		return this;
	},
	/** add quotations around these matches */
	toQuotations: function(start, end) {
		start = start || `"`;
		end = end || `"`;
		this.docs.forEach((terms) => {
			terms[0].pre = start + terms[0].pre;
			const last = terms[terms.length - 1];
			last.post = end + last.post;
		});
		return this;
	},
	/** add brackets around these matches */
	toParentheses: function(start, end) {
		start = start || `(`;
		end = end || `)`;
		this.docs.forEach((terms) => {
			terms[0].pre = start + terms[0].pre;
			const last = terms[terms.length - 1];
			last.post = end + last.post;
		});
		return this;
	}
};
methods$11.deHyphenate = methods$11.dehyphenate;
methods$11.toQuotation = methods$11.toQuotations;
//#endregion
//#region node_modules/compromise/src/1-one/change/api/lib/_sort.js
/** alphabetical order */
var alpha = (a, b) => {
	if (a.normal < b.normal) return -1;
	if (a.normal > b.normal) return 1;
	return 0;
};
/** count the # of characters of each match */
var length = (a, b) => {
	const left = a.normal.trim().length;
	const right = b.normal.trim().length;
	if (left < right) return 1;
	if (left > right) return -1;
	return 0;
};
/** count the # of terms in each match */
var wordCount$1 = (a, b) => {
	if (a.words < b.words) return 1;
	if (a.words > b.words) return -1;
	return 0;
};
/** count the # of terms in each match */
var sequential = (a, b) => {
	if (a[0] < b[0]) return 1;
	if (a[0] > b[0]) return -1;
	return a[1] > b[1] ? 1 : -1;
};
/** sort by # of duplicates in the document*/
var byFreq = function(arr) {
	const counts = {};
	arr.forEach((o) => {
		counts[o.normal] = counts[o.normal] || 0;
		counts[o.normal] += 1;
	});
	arr.sort((a, b) => {
		const left = counts[a.normal];
		const right = counts[b.normal];
		if (left < right) return 1;
		if (left > right) return -1;
		return 0;
	});
	return arr;
};
var _sort_default = {
	alpha,
	length,
	wordCount: wordCount$1,
	sequential,
	byFreq
};
//#endregion
//#region node_modules/compromise/src/1-one/change/api/sort.js
var seqNames = /* @__PURE__ */ new Set([
	"index",
	"sequence",
	"seq",
	"sequential",
	"chron",
	"chronological"
]);
var freqNames = /* @__PURE__ */ new Set([
	"freq",
	"frequency",
	"topk",
	"repeats"
]);
var alphaNames = /* @__PURE__ */ new Set(["alpha", "alphabetical"]);
var customSort = function(view, fn) {
	let ptrs = view.fullPointer;
	ptrs = ptrs.sort((a, b) => {
		a = view.update([a]);
		b = view.update([b]);
		return fn(a, b);
	});
	view.ptrs = ptrs;
	return view;
};
/** re-arrange the order of the matches (in place) */
var sort = function(input) {
	const { docs, pointer } = this;
	this.uncache();
	if (typeof input === "function") return customSort(this, input);
	input = input || "alpha";
	const ptrs = pointer || docs.map((_d, n) => [n]);
	let arr = docs.map((terms, n) => {
		return {
			index: n,
			words: terms.length,
			normal: terms.map((t) => t.machine || t.normal || "").join(" "),
			pointer: ptrs[n]
		};
	});
	if (seqNames.has(input)) input = "sequential";
	if (alphaNames.has(input)) input = "alpha";
	if (freqNames.has(input)) {
		arr = _sort_default.byFreq(arr);
		return this.update(arr.map((o) => o.pointer));
	}
	if (typeof _sort_default[input] === "function") {
		arr = arr.sort(_sort_default[input]);
		return this.update(arr.map((o) => o.pointer));
	}
	return this;
};
/** reverse the order of the matches, but not the words or index */
var reverse$1 = function() {
	let ptrs = this.pointer || this.docs.map((_d, n) => [n]);
	ptrs = [].concat(ptrs);
	ptrs = ptrs.reverse();
	if (this._cache) this._cache = this._cache.reverse();
	return this.update(ptrs);
};
/** remove any duplicate matches */
var unique = function() {
	const already = /* @__PURE__ */ new Set();
	return this.filter((m) => {
		const txt = m.text("machine");
		if (already.has(txt)) return false;
		already.add(txt);
		return true;
	});
};
var sort_default = {
	unique,
	reverse: reverse$1,
	sort
};
//#endregion
//#region node_modules/compromise/src/1-one/change/api/concat.js
var isArray$7 = (arr) => Object.prototype.toString.call(arr) === "[object Array]";
var combineDocs = function(homeDocs, inputDocs) {
	if (homeDocs.length > 0) {
		const end = homeDocs[homeDocs.length - 1];
		const last = end[end.length - 1];
		if (/ /.test(last.post) === false) last.post += " ";
	}
	homeDocs = homeDocs.concat(inputDocs);
	return homeDocs;
};
var combineViews = function(home, input) {
	if (home.document === input.document) {
		const ptrs = home.fullPointer.concat(input.fullPointer);
		return home.toView(ptrs).compute("index");
	}
	input.fullPointer.forEach((a) => {
		a[0] += home.document.length;
	});
	home.document = combineDocs(home.document, input.docs);
	return home.all();
};
var concat_default = { concat: function(input) {
	if (typeof input === "string") {
		const more = this.fromText(input);
		if (!this.found || !this.ptrs) this.document = this.document.concat(more.document);
		else {
			const ptrs = this.fullPointer;
			const at = ptrs[ptrs.length - 1][0];
			this.document.splice(at, 0, ...more.document);
		}
		return this.all().compute("index");
	}
	if (typeof input === "object" && input.isView) return combineViews(this, input);
	if (isArray$7(input)) {
		const docs = combineDocs(this.document, input);
		this.document = docs;
		return this.all();
	}
	return this;
} };
//#endregion
//#region node_modules/compromise/src/1-one/change/api/harden.js
var harden = function() {
	this.ptrs = this.fullPointer;
	return this;
};
var soften = function() {
	let ptr = this.ptrs;
	if (!ptr || ptr.length < 1) return this;
	ptr = ptr.map((a) => a.slice(0, 3));
	this.ptrs = ptr;
	return this;
};
//#endregion
//#region node_modules/compromise/src/1-one/change/api/index.js
var methods$10 = Object.assign({}, case_default, fns$4, fns$3, methods$12, methods$11, sort_default, concat_default, {
	harden,
	soften
});
var addAPI$2 = function(View) {
	Object.assign(View.prototype, methods$10);
};
//#endregion
//#region node_modules/compromise/src/1-one/change/plugin.js
var plugin_default$25 = {
	api: addAPI$2,
	compute: { id: function(view) {
		const docs = view.docs;
		for (let n = 0; n < docs.length; n += 1) for (let i = 0; i < docs[n].length; i += 1) {
			const term = docs[n][i];
			term.id = term.id || toId(term);
		}
	} }
};
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/model/contractions.js
var contractions_default = [
	{
		word: "@",
		out: ["at"]
	},
	{
		word: "arent",
		out: ["are", "not"]
	},
	{
		word: "alot",
		out: ["a", "lot"]
	},
	{
		word: "brb",
		out: [
			"be",
			"right",
			"back"
		]
	},
	{
		word: "cannot",
		out: ["can", "not"]
	},
	{
		word: "dun",
		out: ["do", "not"]
	},
	{
		word: "can't",
		out: ["can", "not"]
	},
	{
		word: "shan't",
		out: ["should", "not"]
	},
	{
		word: "won't",
		out: ["will", "not"]
	},
	{
		word: "that's",
		out: ["that", "is"]
	},
	{
		word: "what's",
		out: ["what", "is"]
	},
	{
		word: "let's",
		out: ["let", "us"]
	},
	{
		word: "dunno",
		out: [
			"do",
			"not",
			"know"
		]
	},
	{
		word: "gonna",
		out: ["going", "to"]
	},
	{
		word: "gotta",
		out: [
			"have",
			"got",
			"to"
		]
	},
	{
		word: "gimme",
		out: ["give", "me"]
	},
	{
		word: "outta",
		out: ["out", "of"]
	},
	{
		word: "tryna",
		out: ["trying", "to"]
	},
	{
		word: "gtg",
		out: [
			"got",
			"to",
			"go"
		]
	},
	{
		word: "im",
		out: ["i", "am"]
	},
	{
		word: "imma",
		out: ["I", "will"]
	},
	{
		word: "imo",
		out: [
			"in",
			"my",
			"opinion"
		]
	},
	{
		word: "irl",
		out: [
			"in",
			"real",
			"life"
		]
	},
	{
		word: "ive",
		out: ["i", "have"]
	},
	{
		word: "rn",
		out: ["right", "now"]
	},
	{
		word: "tbh",
		out: [
			"to",
			"be",
			"honest"
		]
	},
	{
		word: "wanna",
		out: ["want", "to"]
	},
	{
		word: `c'mere`,
		out: ["come", "here"]
	},
	{
		word: `c'mon`,
		out: ["come", "on"]
	},
	{
		word: "shoulda",
		out: ["should", "have"]
	},
	{
		word: "coulda",
		out: ["coulda", "have"]
	},
	{
		word: "woulda",
		out: ["woulda", "have"]
	},
	{
		word: "musta",
		out: ["must", "have"]
	},
	{
		word: "tis",
		out: ["it", "is"]
	},
	{
		word: "twas",
		out: ["it", "was"]
	},
	{
		word: `y'know`,
		out: ["you", "know"]
	},
	{
		word: "ne'er",
		out: ["never"]
	},
	{
		word: "o'er",
		out: ["over"]
	},
	{
		after: "ll",
		out: ["will"]
	},
	{
		after: "ve",
		out: ["have"]
	},
	{
		after: "re",
		out: ["are"]
	},
	{
		after: "m",
		out: ["am"]
	},
	{
		before: "c",
		out: ["ce"]
	},
	{
		before: "m",
		out: ["me"]
	},
	{
		before: "n",
		out: ["ne"]
	},
	{
		before: "qu",
		out: ["que"]
	},
	{
		before: "s",
		out: ["se"]
	},
	{
		before: "t",
		out: ["tu"]
	},
	{
		word: "shouldnt",
		out: ["should", "not"]
	},
	{
		word: "couldnt",
		out: ["could", "not"]
	},
	{
		word: "wouldnt",
		out: ["would", "not"]
	},
	{
		word: "hasnt",
		out: ["has", "not"]
	},
	{
		word: "wasnt",
		out: ["was", "not"]
	},
	{
		word: "isnt",
		out: ["is", "not"]
	},
	{
		word: "cant",
		out: ["can", "not"]
	},
	{
		word: "dont",
		out: ["do", "not"]
	},
	{
		word: "wont",
		out: ["will", "not"]
	},
	{
		word: "howd",
		out: ["how", "did"]
	},
	{
		word: "whatd",
		out: ["what", "did"]
	},
	{
		word: "whend",
		out: ["when", "did"]
	},
	{
		word: "whered",
		out: ["where", "did"]
	}
];
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/model/number-suffix.js
var t$1 = true;
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/model/index.js
var model_default$3 = { one: {
	contractions: contractions_default,
	numberSuffixes: {
		"st": t$1,
		"nd": t$1,
		"rd": t$1,
		"th": t$1,
		"am": t$1,
		"pm": t$1,
		"max": t$1,
		"°": t$1,
		"s": t$1,
		"e": t$1,
		"er": t$1,
		"ère": t$1,
		"ème": t$1
	}
} };
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/compute/contractions/_splice.js
var insertContraction$1 = function(document, point, words) {
	const [n, w] = point;
	if (!words || words.length === 0) return;
	words = words.map((word, i) => {
		word.implicit = word.text;
		word.machine = word.text;
		word.pre = "";
		word.post = "";
		word.text = "";
		word.normal = "";
		word.index = [n, w + i];
		return word;
	});
	if (words[0]) {
		words[0].pre = document[n][w].pre;
		words[words.length - 1].post = document[n][w].post;
		words[0].text = document[n][w].text;
		words[0].normal = document[n][w].normal;
	}
	document[n].splice(w, 1, ...words);
};
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/compute/contractions/apostrophe-d.js
var hasContraction$3 = /'/;
var alwaysDid = /* @__PURE__ */ new Set([
	"what",
	"how",
	"when",
	"where",
	"why"
]);
var useWould = /* @__PURE__ */ new Set([
	"be",
	"go",
	"start",
	"think",
	"need"
]);
var useHad = /* @__PURE__ */ new Set(["been", "gone"]);
var _apostropheD$1 = function(terms, i) {
	const before = terms[i].normal.split(hasContraction$3)[0];
	if (alwaysDid.has(before)) return [before, "did"];
	if (terms[i + 1]) {
		if (useHad.has(terms[i + 1].normal)) return [before, "had"];
		if (useWould.has(terms[i + 1].normal)) return [before, "would"];
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/compute/contractions/apostrophe-t.js
var apostropheT$1 = function(terms, i) {
	if (terms[i].normal === "ain't" || terms[i].normal === "aint") return null;
	return [terms[i].normal.replace(/n't/, ""), "not"];
};
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/compute/contractions/french.js
var hasContraction$2 = /'/;
var isFeminine = /(e|é|aison|sion|tion)$/;
var isMasculine = /(age|isme|acle|ege|oire)$/;
var preL = (terms, i) => {
	const after = terms[i].normal.split(hasContraction$2)[1];
	if (after && after.endsWith("e")) return ["la", after];
	return ["le", after];
};
var preD = (terms, i) => {
	const after = terms[i].normal.split(hasContraction$2)[1];
	if (after && isFeminine.test(after) && !isMasculine.test(after)) return ["du", after];
	else if (after && after.endsWith("s")) return ["des", after];
	return ["de", after];
};
var preJ = (terms, i) => {
	return ["je", terms[i].normal.split(hasContraction$2)[1]];
};
var french_default = {
	preJ,
	preL,
	preD
};
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/compute/contractions/number-range.js
var isRange = /^([0-9.]{1,4}[a-z]{0,2}) ?[-–—] ?([0-9]{1,4}[a-z]{0,2})$/i;
var timeRange = /^([0-9]{1,2}(:[0-9][0-9])?(am|pm)?) ?[-–—] ?([0-9]{1,2}(:[0-9][0-9])?(am|pm)?)$/i;
var phoneNum = /^[0-9]{3}-[0-9]{4}$/;
var numberRange = function(terms, i) {
	const term = terms[i];
	let parts = term.text.match(isRange);
	if (parts !== null) {
		if (term.tags.has("PhoneNumber") === true || phoneNum.test(term.text)) return null;
		return [
			parts[1],
			"to",
			parts[2]
		];
	} else {
		parts = term.text.match(timeRange);
		if (parts !== null) return [
			parts[1],
			"to",
			parts[4]
		];
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/compute/contractions/number-unit.js
var numUnit = /^([+-]?[0-9][.,0-9]*)([a-z°²³µ/]+)$/;
var numberUnit = function(terms, i, world) {
	const notUnit = world.model.one.numberSuffixes || {};
	const parts = terms[i].text.match(numUnit);
	if (parts !== null) {
		const unit = parts[2].toLowerCase().trim();
		if (notUnit.hasOwnProperty(unit)) return null;
		return [parts[1], unit];
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/compute/contractions/index.js
var byApostrophe$1 = /'/;
var numDash = /^[0-9][^-–—]*[-–—].*?[0-9]/;
var reTag$1 = function(terms, view, start, len) {
	const tmp = view.update();
	tmp.document = [terms];
	let end = start + len;
	if (start > 0) start -= 1;
	if (terms[end]) end += 1;
	tmp.ptrs = [[
		0,
		start,
		end
	]];
};
var byEnd$1 = {
	t: (terms, i) => apostropheT$1(terms, i),
	d: (terms, i) => _apostropheD$1(terms, i)
};
var byStart = {
	j: (terms, i) => french_default.preJ(terms, i),
	l: (terms, i) => french_default.preL(terms, i),
	d: (terms, i) => french_default.preD(terms, i)
};
var knownOnes = function(list, term, before, after) {
	for (let i = 0; i < list.length; i += 1) {
		const o = list[i];
		if (o.word === term.normal) return o.out;
		else if (after !== null && after === o.after) return [before].concat(o.out);
		else if (before !== null && before === o.before && after && after.length > 2) return o.out.concat(after);
	}
	return null;
};
var toDocs$1 = function(words, view) {
	const doc = view.fromText(words.join(" "));
	doc.compute(["id", "alias"]);
	return doc.docs[0];
};
var thereHas = function(terms, i) {
	for (let k = i + 1; k < 5; k += 1) {
		if (!terms[k]) break;
		if (terms[k].normal === "been") return ["there", "has"];
	}
	return ["there", "is"];
};
var contractions = (view) => {
	const { world, document } = view;
	const { model, methods } = world;
	const list = model.one.contractions || [];
	document.forEach((terms, n) => {
		for (let i = terms.length - 1; i >= 0; i -= 1) {
			let before = null;
			let after = null;
			if (byApostrophe$1.test(terms[i].normal) === true) {
				const res = terms[i].normal.split(byApostrophe$1);
				before = res[0];
				after = res[1];
			}
			let words = knownOnes(list, terms[i], before, after);
			if (!words && byEnd$1.hasOwnProperty(after)) words = byEnd$1[after](terms, i, world);
			if (!words && byStart.hasOwnProperty(before)) words = byStart[before](terms, i);
			if (before === "there" && after === "s") words = thereHas(terms, i);
			if (words) {
				words = toDocs$1(words, view);
				insertContraction$1(document, [n, i], words);
				reTag$1(document[n], view, i, words.length);
				continue;
			}
			if (numDash.test(terms[i].normal)) {
				words = numberRange(terms, i);
				if (words) {
					words = toDocs$1(words, view);
					insertContraction$1(document, [n, i], words);
					methods.one.setTag(words, "NumberRange", world);
					if (words[2] && words[2].tags.has("Time")) methods.one.setTag([words[0]], "Time", world, null, "time-range");
					reTag$1(document[n], view, i, words.length);
				}
				continue;
			}
			words = numberUnit(terms, i, world);
			if (words) {
				words = toDocs$1(words, view);
				insertContraction$1(document, [n, i], words);
				methods.one.setTag([words[1]], "Unit", world, null, "contraction-unit");
			}
		}
	});
};
//#endregion
//#region node_modules/compromise/src/1-one/contraction-one/plugin.js
var plugin$3 = {
	model: model_default$3,
	compute: { contractions },
	hooks: ["contractions"]
};
//#endregion
//#region node_modules/compromise/src/1-one/freeze/compute.js
var freeze = function(view) {
	const world = view.world;
	const { model, methods } = view.world;
	const setTag = methods.one.setTag;
	const { frozenLex } = model.one;
	const multi = model.one._multiCache || {};
	view.docs.forEach((terms) => {
		for (let i = 0; i < terms.length; i += 1) {
			const t = terms[i];
			const word = t.machine || t.normal;
			if (multi[word] !== void 0 && terms[i + 1]) {
				const end = i + multi[word] - 1;
				for (let k = end; k > i; k -= 1) {
					const words = terms.slice(i, k + 1);
					const str = words.map((term) => term.machine || term.normal).join(" ");
					if (frozenLex.hasOwnProperty(str) === true) {
						setTag(words, frozenLex[str], world, false, "1-frozen-multi-lexicon");
						words.forEach((term) => term.frozen = true);
						continue;
					}
				}
			}
			if (frozenLex[word] !== void 0 && frozenLex.hasOwnProperty(word)) {
				setTag([t], frozenLex[word], world, false, "1-freeze-lexicon");
				t.frozen = true;
				continue;
			}
		}
	});
};
var unfreeze = function(view) {
	view.docs.forEach((ts) => {
		ts.forEach((term) => {
			delete term.frozen;
		});
	});
	return view;
};
var compute_default$6 = {
	frozen: freeze,
	freeze,
	unfreeze
};
//#endregion
//#region node_modules/compromise/src/1-one/freeze/debug.js
var blue = (str) => "\x1B[34m" + str + "\x1B[0m";
var dim = (str) => "\x1B[3m\x1B[2m" + str + "\x1B[0m";
var debug$2 = function(view) {
	view.docs.forEach((terms) => {
		console.log(blue("\n  ┌─────────"));
		terms.forEach((t) => {
			let str = `  ${dim("│")}  `;
			const txt = t.implicit || t.text || "-";
			if (t.frozen === true) str += `${blue(txt)} ❄️`;
			else str += dim(txt);
			console.log(str);
		});
	});
};
//#endregion
//#region node_modules/compromise/src/1-one/freeze/plugin.js
var plugin_default$24 = {
	compute: compute_default$6,
	mutate: (world) => {
		const methods = world.methods.one;
		methods.termMethods.isFrozen = (term) => term.frozen === true;
		methods.debug.freeze = debug$2;
		methods.debug.frozen = debug$2;
	},
	api: function(View) {
		View.prototype.freeze = function() {
			this.docs.forEach((ts) => {
				ts.forEach((term) => {
					term.frozen = true;
				});
			});
			return this;
		};
		View.prototype.unfreeze = function() {
			this.compute("unfreeze");
		};
		View.prototype.isFrozen = function() {
			return this.match("@isFrozen+");
		};
	},
	hooks: ["freeze"]
};
//#endregion
//#region node_modules/compromise/src/1-one/lexicon/compute/multi-word.js
var multiWord = function(terms, start_i, world) {
	const { model, methods } = world;
	const setTag = methods.one.setTag;
	const multi = model.one._multiCache || {};
	const { lexicon } = model.one || {};
	const t = terms[start_i];
	const word = t.machine || t.normal;
	if (multi[word] !== void 0 && terms[start_i + 1]) {
		const end = start_i + multi[word] - 1;
		for (let i = end; i > start_i; i -= 1) {
			const words = terms.slice(start_i, i + 1);
			if (words.length <= 1) return false;
			const str = words.map((term) => term.machine || term.normal).join(" ");
			if (lexicon.hasOwnProperty(str) === true) {
				const tag = lexicon[str];
				setTag(words, tag, world, false, "1-multi-lexicon");
				if (tag && tag.length === 2 && (tag[0] === "PhrasalVerb" || tag[1] === "PhrasalVerb")) setTag([words[1]], "Particle", world, false, "1-phrasal-particle");
				return true;
			}
		}
		return false;
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/1-one/lexicon/compute/single-word.js
var prefix$3 = /^(under|over|mis|re|un|dis|semi|pre|post)-?/;
var allowPrefix = /* @__PURE__ */ new Set([
	"Verb",
	"Infinitive",
	"PastTense",
	"Gerund",
	"PresentTense",
	"Adjective",
	"Participle"
]);
var checkLexicon = function(terms, i, world) {
	const { model, methods } = world;
	const setTag = methods.one.setTag;
	const { lexicon } = model.one;
	const t = terms[i];
	const word = t.machine || t.normal;
	if (lexicon[word] !== void 0 && lexicon.hasOwnProperty(word)) {
		setTag([t], lexicon[word], world, false, "1-lexicon");
		return true;
	}
	if (t.alias) {
		const found = t.alias.find((str) => lexicon.hasOwnProperty(str));
		if (found) {
			setTag([t], lexicon[found], world, false, "1-lexicon-alias");
			return true;
		}
	}
	if (prefix$3.test(word) === true) {
		const stem = word.replace(prefix$3, "");
		if (lexicon.hasOwnProperty(stem) && stem.length > 3) {
			if (allowPrefix.has(lexicon[stem])) {
				setTag([t], lexicon[stem], world, false, "1-lexicon-prefix");
				return true;
			}
		}
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/1-one/lexicon/compute/index.js
var lexicon$2 = function(view) {
	const world = view.world;
	view.docs.forEach((terms) => {
		for (let i = 0; i < terms.length; i += 1) if (terms[i].tags.size === 0) {
			let found = null;
			found = found || multiWord(terms, i, world);
			found = found || checkLexicon(terms, i, world);
		}
	});
};
var compute_default$5 = { lexicon: lexicon$2 };
//#endregion
//#region node_modules/compromise/src/1-one/lexicon/methods/expand.js
var expand$2 = function(words) {
	const lex = {};
	const _multi = {};
	Object.keys(words).forEach((word) => {
		const tag = words[word];
		word = word.toLowerCase().trim();
		word = word.replace(/'s\b/, "");
		const split = word.split(/ /);
		if (split.length > 1) {
			if (_multi[split[0]] === void 0 || split.length > _multi[split[0]]) _multi[split[0]] = split.length;
		}
		lex[word] = lex[word] || tag;
	});
	delete lex[""];
	delete lex[null];
	delete lex[" "];
	return {
		lex,
		_multi
	};
};
//#endregion
//#region node_modules/compromise/src/1-one/lexicon/methods/index.js
var methods_default$6 = { one: { expandLexicon: expand$2 } };
//#endregion
//#region node_modules/compromise/src/1-one/lexicon/lib.js
/** insert new words/phrases into the lexicon */
var addWords = function(words, isFrozen = false) {
	const world = this.world();
	const { methods, model } = world;
	if (!words) return;
	Object.keys(words).forEach((k) => {
		if (typeof words[k] === "string" && words[k].startsWith("#")) words[k] = words[k].replace(/^#/, "");
	});
	if (isFrozen === true) {
		const { lex, _multi } = methods.one.expandLexicon(words, world);
		Object.assign(model.one._multiCache, _multi);
		Object.assign(model.one.frozenLex, lex);
		return;
	}
	if (methods.two.expandLexicon) {
		const { lex, _multi } = methods.two.expandLexicon(words, world);
		Object.assign(model.one.lexicon, lex);
		Object.assign(model.one._multiCache, _multi);
	}
	const { lex, _multi } = methods.one.expandLexicon(words, world);
	Object.assign(model.one.lexicon, lex);
	Object.assign(model.one._multiCache, _multi);
};
var plugin_default$23 = {
	model: { one: {
		lexicon: {},
		_multiCache: {},
		frozenLex: {}
	} },
	methods: methods_default$6,
	compute: compute_default$5,
	lib: { addWords },
	hooks: ["lexicon"]
};
//#endregion
//#region node_modules/compromise/src/1-one/lookup/api/buildTrie/index.js
var tokenize = function(phrase, world) {
	const { methods, model } = world;
	return methods.one.tokenize.splitTerms(phrase, model).map((t) => methods.one.tokenize.splitWhitespace(t, model)).map((term) => term.text.toLowerCase());
};
var buildTrie = function(phrases, world) {
	const goNext = [{}];
	const endAs = [null];
	const failTo = [0];
	const xs = [];
	let n = 0;
	phrases.forEach(function(phrase) {
		let curr = 0;
		const words = tokenize(phrase, world);
		for (let i = 0; i < words.length; i++) {
			const word = words[i];
			if (goNext[curr] && goNext[curr].hasOwnProperty(word)) curr = goNext[curr][word];
			else {
				n++;
				goNext[curr][word] = n;
				goNext[n] = {};
				curr = n;
				endAs[n] = null;
			}
		}
		endAs[curr] = [words.length];
	});
	for (const word in goNext[0]) {
		n = goNext[0][word];
		failTo[n] = 0;
		xs.push(n);
	}
	while (xs.length) {
		const r = xs.shift();
		const keys = Object.keys(goNext[r]);
		for (let i = 0; i < keys.length; i += 1) {
			const word = keys[i];
			const s = goNext[r][word];
			xs.push(s);
			n = failTo[r];
			while (n > 0 && !goNext[n].hasOwnProperty(word)) n = failTo[n];
			if (goNext.hasOwnProperty(n)) {
				const fs = goNext[n][word];
				failTo[s] = fs;
				if (endAs[fs]) {
					endAs[s] = endAs[s] || [];
					endAs[s] = endAs[s].concat(endAs[fs]);
				}
			} else failTo[s] = 0;
		}
	}
	return {
		goNext,
		endAs,
		failTo
	};
};
//#endregion
//#region node_modules/compromise/src/1-one/lookup/api/scan.js
var scanWords = function(terms, trie, opts) {
	let n = 0;
	const results = [];
	for (let i = 0; i < terms.length; i++) {
		const word = terms[i][opts.form] || terms[i].normal;
		while (n > 0 && (trie.goNext[n] === void 0 || !trie.goNext[n].hasOwnProperty(word))) n = trie.failTo[n] || 0;
		if (!trie.goNext[n].hasOwnProperty(word)) continue;
		n = trie.goNext[n][word];
		if (trie.endAs[n]) {
			const arr = trie.endAs[n];
			for (let o = 0; o < arr.length; o++) {
				const len = arr[o];
				const term = terms[i - len + 1];
				const [no, start] = term.index;
				results.push([
					no,
					start,
					start + len,
					term.id
				]);
			}
		}
	}
	return results;
};
var cacheMiss = function(words, cache) {
	for (let i = 0; i < words.length; i += 1) if (cache.has(words[i]) === true) return false;
	return true;
};
var scan = function(view, trie, opts) {
	let results = [];
	opts.form = opts.form || "normal";
	const docs = view.docs;
	if (!trie.goNext || !trie.goNext[0]) {
		console.error("Compromise invalid lookup trie");
		return view.none();
	}
	const firstWords = Object.keys(trie.goNext[0]);
	for (let i = 0; i < docs.length; i++) {
		if (view._cache && view._cache[i] && cacheMiss(firstWords, view._cache[i]) === true) continue;
		const terms = docs[i];
		const found = scanWords(terms, trie, opts);
		if (found.length > 0) results = results.concat(found);
	}
	return view.update(results);
};
//#endregion
//#region node_modules/compromise/src/1-one/lookup/api/index.js
var isObject$4 = (val) => {
	return Object.prototype.toString.call(val) === "[object Object]";
};
function api_default$2(View) {
	/** find all matches in this document */
	View.prototype.lookup = function(input, opts = {}) {
		if (!input) return this.none();
		if (typeof input === "string") input = [input];
		const trie = isObject$4(input) ? input : buildTrie(input, this.world);
		let res = scan(this, trie, opts);
		res = res.settle();
		return res;
	};
}
//#endregion
//#region node_modules/compromise/src/1-one/lookup/api/buildTrie/compress.js
var truncate = (list, val) => {
	for (let i = list.length - 1; i >= 0; i -= 1) if (list[i] !== val) {
		list = list.slice(0, i + 1);
		return list;
	}
	return list;
};
var compress = function(trie) {
	trie.goNext = trie.goNext.map((o) => {
		if (Object.keys(o).length === 0) return;
		return o;
	});
	trie.goNext = truncate(trie.goNext, void 0);
	trie.failTo = truncate(trie.failTo, 0);
	trie.endAs = truncate(trie.endAs, null);
	return trie;
};
//#endregion
//#region node_modules/compromise/src/1-one/lookup/plugin.js
/** pre-compile a list of matches to lookup */
var lib = { 
/** turn an array or object into a compressed trie*/
buildTrie: function(input) {
	return compress(buildTrie(input, this.world()));
} };
lib.compile = lib.buildTrie;
var plugin_default$22 = {
	api: api_default$2,
	lib
};
//#endregion
//#region node_modules/compromise/src/1-one/match/api/_lib.js
var relPointer = function(ptrs, parent) {
	if (!parent) return ptrs;
	ptrs.forEach((ptr) => {
		const n = ptr[0];
		if (parent[n]) {
			ptr[0] = parent[n][0];
			ptr[1] += parent[n][1];
			ptr[2] += parent[n][1];
		}
	});
	return ptrs;
};
var fixPointers = function(res, parent) {
	let { ptrs } = res;
	const { byGroup } = res;
	ptrs = relPointer(ptrs, parent);
	Object.keys(byGroup).forEach((k) => {
		byGroup[k] = relPointer(byGroup[k], parent);
	});
	return {
		ptrs,
		byGroup
	};
};
var parseRegs = function(regs, opts, world) {
	const one = world.methods.one;
	if (typeof regs === "number") regs = String(regs);
	if (typeof regs === "string") {
		regs = one.killUnicode(regs, world);
		regs = one.parseMatch(regs, opts, world);
	}
	return regs;
};
var isObject$3 = (val) => {
	return Object.prototype.toString.call(val) === "[object Object]";
};
var isView = (val) => val && isObject$3(val) && val.isView === true;
var isNet = (val) => val && isObject$3(val) && val.isNet === true;
//#endregion
//#region node_modules/compromise/src/1-one/match/api/match.js
var match = function(regs, group, opts) {
	const one = this.methods.one;
	if (isView(regs)) return this.intersection(regs);
	if (isNet(regs)) return this.sweep(regs, { tagger: false }).view.settle();
	regs = parseRegs(regs, opts, this.world);
	const todo = {
		regs,
		group
	};
	const { ptrs, byGroup } = fixPointers(one.match(this.docs, todo, this._cache), this.fullPointer);
	const view = this.toView(ptrs);
	view._groups = byGroup;
	return view;
};
var matchOne = function(regs, group, opts) {
	const one = this.methods.one;
	if (isView(regs)) return this.intersection(regs).eq(0);
	if (isNet(regs)) return this.sweep(regs, {
		tagger: false,
		matchOne: true
	}).view;
	regs = parseRegs(regs, opts, this.world);
	const todo = {
		regs,
		group,
		justOne: true
	};
	const { ptrs, byGroup } = fixPointers(one.match(this.docs, todo, this._cache), this.fullPointer);
	const view = this.toView(ptrs);
	view._groups = byGroup;
	return view;
};
var has = function(regs, group, opts) {
	const one = this.methods.one;
	if (isView(regs)) return this.intersection(regs).fullPointer.length > 0;
	if (isNet(regs)) return this.sweep(regs, { tagger: false }).view.found;
	regs = parseRegs(regs, opts, this.world);
	const todo = {
		regs,
		group,
		justOne: true
	};
	return one.match(this.docs, todo, this._cache).ptrs.length > 0;
};
var ifFn = function(regs, group, opts) {
	const one = this.methods.one;
	if (isView(regs)) return this.filter((m) => m.intersection(regs).found);
	if (isNet(regs)) {
		const m = this.sweep(regs, { tagger: false }).view.settle();
		return this.if(m);
	}
	regs = parseRegs(regs, opts, this.world);
	const todo = {
		regs,
		group,
		justOne: true
	};
	let ptrs = this.fullPointer;
	const cache = this._cache || [];
	ptrs = ptrs.filter((ptr, i) => {
		const m = this.update([ptr]);
		return one.match(m.docs, todo, cache[i]).ptrs.length > 0;
	});
	const view = this.update(ptrs);
	if (this._cache) view._cache = ptrs.map((ptr) => cache[ptr[0]]);
	return view;
};
var ifNo = function(regs, group, opts) {
	const { methods } = this;
	const one = methods.one;
	if (isView(regs)) return this.filter((m) => !m.intersection(regs).found);
	if (isNet(regs)) {
		const m = this.sweep(regs, { tagger: false }).view.settle();
		return this.ifNo(m);
	}
	regs = parseRegs(regs, opts, this.world);
	const cache = this._cache || [];
	const view = this.filter((m, i) => {
		const todo = {
			regs,
			group,
			justOne: true
		};
		return one.match(m.docs, todo, cache[i]).ptrs.length === 0;
	});
	if (this._cache) view._cache = view.ptrs.map((ptr) => cache[ptr[0]]);
	return view;
};
var match_default = {
	matchOne,
	match,
	has,
	if: ifFn,
	ifNo
};
//#endregion
//#region node_modules/compromise/src/1-one/match/api/lookaround.js
var before = function(regs, group, opts) {
	const { indexN } = this.methods.one.pointer;
	const pre = [];
	const byN = indexN(this.fullPointer);
	Object.keys(byN).forEach((k) => {
		const first = byN[k].sort((a, b) => a[1] > b[1] ? 1 : -1)[0];
		if (first[1] > 0) pre.push([
			first[0],
			0,
			first[1]
		]);
	});
	const preWords = this.toView(pre);
	if (!regs) return preWords;
	return preWords.match(regs, group, opts);
};
var after = function(regs, group, opts) {
	const { indexN } = this.methods.one.pointer;
	const post = [];
	const byN = indexN(this.fullPointer);
	const document = this.document;
	Object.keys(byN).forEach((k) => {
		const [n, , end] = byN[k].sort((a, b) => a[1] > b[1] ? -1 : 1)[0];
		if (end < document[n].length) post.push([
			n,
			end,
			document[n].length
		]);
	});
	const postWords = this.toView(post);
	if (!regs) return postWords;
	return postWords.match(regs, group, opts);
};
var growLeft = function(regs, group, opts) {
	if (typeof regs === "string") regs = this.world.methods.one.parseMatch(regs, opts, this.world);
	regs[regs.length - 1].end = true;
	const ptrs = this.fullPointer;
	this.forEach((m, n) => {
		const more = m.before(regs, group);
		if (more.found) {
			const terms = more.terms();
			ptrs[n][1] -= terms.length;
			ptrs[n][3] = terms.docs[0][0].id;
		}
	});
	return this.update(ptrs);
};
var growRight = function(regs, group, opts) {
	if (typeof regs === "string") regs = this.world.methods.one.parseMatch(regs, opts, this.world);
	regs[0].start = true;
	const ptrs = this.fullPointer;
	this.forEach((m, n) => {
		const more = m.after(regs, group);
		if (more.found) {
			const terms = more.terms();
			ptrs[n][2] += terms.length;
			ptrs[n][4] = null;
		}
	});
	return this.update(ptrs);
};
var grow = function(regs, group, opts) {
	return this.growRight(regs, group, opts).growLeft(regs, group, opts);
};
var lookaround_default = {
	before,
	after,
	growLeft,
	growRight,
	grow
};
//#endregion
//#region node_modules/compromise/src/1-one/match/api/split.js
var combine = function(left, right) {
	return [
		left[0],
		left[1],
		right[2]
	];
};
var isArray$6 = function(arr) {
	return Object.prototype.toString.call(arr) === "[object Array]";
};
var getDoc$2 = (reg, view, group) => {
	if (typeof reg === "string" || isArray$6(reg)) return view.match(reg, group);
	if (!reg) return view.none();
	return reg;
};
var addIds$1 = function(ptr, view) {
	const [n, start, end] = ptr;
	if (view.document[n] && view.document[n][start]) {
		ptr[3] = ptr[3] || view.document[n][start].id;
		if (view.document[n][end - 1]) ptr[4] = ptr[4] || view.document[n][end - 1].id;
	}
	return ptr;
};
var methods$9 = {};
methods$9.splitOn = function(m, group) {
	const { splitAll } = this.methods.one.pointer;
	const splits = getDoc$2(m, this, group).fullPointer;
	const all = splitAll(this.fullPointer, splits);
	let res = [];
	all.forEach((o) => {
		res.push(o.passthrough);
		res.push(o.before);
		res.push(o.match);
		res.push(o.after);
	});
	res = res.filter((p) => p);
	res = res.map((p) => addIds$1(p, this));
	return this.update(res);
};
methods$9.splitBefore = function(m, group) {
	const { splitAll } = this.methods.one.pointer;
	const splits = getDoc$2(m, this, group).fullPointer;
	const all = splitAll(this.fullPointer, splits);
	for (let i = 0; i < all.length; i += 1) if (!all[i].after && all[i + 1] && all[i + 1].before) {
		if (all[i].match && all[i].match[0] === all[i + 1].before[0]) {
			all[i].after = all[i + 1].before;
			delete all[i + 1].before;
		}
	}
	let res = [];
	all.forEach((o) => {
		res.push(o.passthrough);
		res.push(o.before);
		if (o.match && o.after) res.push(combine(o.match, o.after));
		else res.push(o.match);
	});
	res = res.filter((p) => p);
	res = res.map((p) => addIds$1(p, this));
	return this.update(res);
};
methods$9.splitAfter = function(m, group) {
	const { splitAll } = this.methods.one.pointer;
	const splits = getDoc$2(m, this, group).fullPointer;
	const all = splitAll(this.fullPointer, splits);
	let res = [];
	all.forEach((o) => {
		res.push(o.passthrough);
		if (o.before && o.match) res.push(combine(o.before, o.match));
		else {
			res.push(o.before);
			res.push(o.match);
		}
		res.push(o.after);
	});
	res = res.filter((p) => p);
	res = res.map((p) => addIds$1(p, this));
	return this.update(res);
};
methods$9.split = methods$9.splitAfter;
//#endregion
//#region node_modules/compromise/src/1-one/match/api/join.js
var isNeighbour = function(ptrL, ptrR) {
	if (!ptrL || !ptrR) return false;
	if (ptrL[0] !== ptrR[0]) return false;
	return ptrL[2] === ptrR[1];
};
var mergeIf = function(doc, lMatch, rMatch) {
	const world = doc.world;
	const parseMatch = world.methods.one.parseMatch;
	lMatch = lMatch || ".$";
	rMatch = rMatch || "^.";
	const leftMatch = parseMatch(lMatch, {}, world);
	const rightMatch = parseMatch(rMatch, {}, world);
	leftMatch[leftMatch.length - 1].end = true;
	rightMatch[0].start = true;
	const ptrs = doc.fullPointer;
	const res = [ptrs[0]];
	for (let i = 1; i < ptrs.length; i += 1) {
		const ptrL = res[res.length - 1];
		const ptrR = ptrs[i];
		const left = doc.update([ptrL]);
		const right = doc.update([ptrR]);
		if (isNeighbour(ptrL, ptrR) && left.has(leftMatch) && right.has(rightMatch)) res[res.length - 1] = [
			ptrL[0],
			ptrL[1],
			ptrR[2],
			ptrL[3],
			ptrR[4]
		];
		else res.push(ptrR);
	}
	return doc.update(res);
};
//#endregion
//#region node_modules/compromise/src/1-one/match/api/index.js
var methods$7 = Object.assign({}, match_default, lookaround_default, methods$9, {
	joinIf: function(lMatch, rMatch) {
		return mergeIf(this, lMatch, rMatch);
	},
	join: function() {
		return mergeIf(this);
	}
});
methods$7.lookBehind = methods$7.before;
methods$7.lookBefore = methods$7.before;
methods$7.lookAhead = methods$7.after;
methods$7.lookAfter = methods$7.after;
methods$7.notIf = methods$7.ifNo;
var matchAPI = function(View) {
	Object.assign(View.prototype, methods$7);
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/parseMatch/01-parseBlocks.js
var bySlashes = /(?:^|\s)([![^]*(?:<[^<]*>)?\/.*?[^\\/]\/[?\]+*$~]*)(?:\s|$)/;
var byParentheses = /([!~[^]*(?:<[^<]*>)?\([^)]+[^\\)]\)[?\]+*$~]*)(?:\s|$)/;
var byWord$1 = / /g;
var isBlock = (str) => {
	return /^[![^]*(<[^<]*>)?\(/.test(str) && /\)[?\]+*$~]*$/.test(str);
};
var isReg = (str) => {
	return /^[![^]*(<[^<]*>)?\//.test(str) && /\/[?\]+*$~]*$/.test(str);
};
var cleanUp$1 = function(arr) {
	arr = arr.map((str) => str.trim());
	arr = arr.filter((str) => str);
	return arr;
};
var parseBlocks = function(txt) {
	const arr = txt.split(bySlashes);
	let res = [];
	arr.forEach((str) => {
		if (isReg(str)) {
			res.push(str);
			return;
		}
		res = res.concat(str.split(byParentheses));
	});
	res = cleanUp$1(res);
	let final = [];
	res.forEach((str) => {
		if (isBlock(str)) final.push(str);
		else if (isReg(str)) final.push(str);
		else final = final.concat(str.split(byWord$1));
	});
	final = cleanUp$1(final);
	return final;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/parseMatch/02-parseToken.js
var hasMinMax = /\{([0-9]+)?(, *[0-9]*)?\}/;
var andSign = /&&/;
var captureName = /* @__PURE__ */ new RegExp(/^<\s*(\S+)\s*>/);
var titleCase$2 = (str) => str.charAt(0).toUpperCase() + str.substring(1);
var end = (str) => str.charAt(str.length - 1);
var start = (str) => str.charAt(0);
var stripStart = (str) => str.substring(1);
var stripEnd = (str) => str.substring(0, str.length - 1);
var stripBoth = function(str) {
	str = stripStart(str);
	str = stripEnd(str);
	return str;
};
var parseToken = function(w, opts) {
	const obj = {};
	for (let i = 0; i < 2; i += 1) {
		if (end(w) === "$") {
			obj.end = true;
			w = stripEnd(w);
		}
		if (start(w) === "^") {
			obj.start = true;
			w = stripStart(w);
		}
		if (end(w) === "?") {
			obj.optional = true;
			w = stripEnd(w);
		}
		if (start(w) === "[" || end(w) === "]") {
			obj.group = null;
			if (start(w) === "[") obj.groupStart = true;
			if (end(w) === "]") obj.groupEnd = true;
			w = w.replace(/^\[/, "");
			w = w.replace(/\]$/, "");
			if (start(w) === "<") {
				const res = captureName.exec(w);
				if (res.length >= 2) {
					obj.group = res[1];
					w = w.replace(res[0], "");
				}
			}
		}
		if (end(w) === "+") {
			obj.greedy = true;
			w = stripEnd(w);
		}
		if (w !== "*" && end(w) === "*" && w !== "\\*") {
			obj.greedy = true;
			w = stripEnd(w);
		}
		if (start(w) === "!") {
			obj.negative = true;
			w = stripStart(w);
		}
		if (start(w) === "~" && end(w) === "~" && w.length > 2) {
			w = stripBoth(w);
			obj.fuzzy = true;
			obj.min = opts.fuzzy || .85;
			if (/\(/.test(w) === false) {
				obj.word = w;
				return obj;
			}
		}
		if (start(w) === "/" && end(w) === "/") {
			w = stripBoth(w);
			if (opts.caseSensitive) obj.use = "text";
			obj.regex = new RegExp(w);
			return obj;
		}
		if (hasMinMax.test(w) === true) w = w.replace(hasMinMax, (_a, b, c) => {
			if (c === void 0) {
				obj.min = Number(b);
				obj.max = Number(b);
			} else {
				c = c.replace(/, */, "");
				if (b === void 0) {
					obj.min = 0;
					obj.max = Number(c);
				} else {
					obj.min = Number(b);
					obj.max = Number(c || 999);
				}
			}
			obj.greedy = true;
			if (!obj.min) obj.optional = true;
			return "";
		});
		if (start(w) === "(" && end(w) === ")") {
			if (andSign.test(w)) {
				obj.choices = w.split(andSign);
				obj.operator = "and";
			} else {
				obj.choices = w.split("|");
				obj.operator = "or";
			}
			obj.choices[0] = stripStart(obj.choices[0]);
			const last = obj.choices.length - 1;
			obj.choices[last] = stripEnd(obj.choices[last]);
			obj.choices = obj.choices.map((s) => s.trim());
			obj.choices = obj.choices.filter((s) => s);
			obj.choices = obj.choices.map((str) => {
				return str.split(/ /g).map((s) => parseToken(s, opts));
			});
			w = "";
		}
		if (start(w) === "{" && end(w) === "}") {
			w = stripBoth(w);
			obj.root = w;
			if (/\//.test(w)) {
				const split = obj.root.split(/\//);
				obj.root = split[0];
				obj.pos = split[1];
				if (obj.pos === "adj") obj.pos = "Adjective";
				obj.pos = obj.pos.charAt(0).toUpperCase() + obj.pos.substr(1).toLowerCase();
				if (split[2] !== void 0) obj.sense = split[2];
			}
			return obj;
		}
		if (start(w) === "<" && end(w) === ">") {
			w = stripBoth(w);
			obj.chunk = titleCase$2(w);
			obj.greedy = true;
			return obj;
		}
		if (start(w) === "%" && end(w) === "%") {
			w = stripBoth(w);
			obj.switch = w;
			return obj;
		}
	}
	if (start(w) === "#") {
		obj.tag = stripStart(w);
		obj.tag = titleCase$2(obj.tag);
		return obj;
	}
	if (start(w) === "@") {
		obj.method = stripStart(w);
		return obj;
	}
	if (w === ".") {
		obj.anything = true;
		return obj;
	}
	if (w === "*") {
		obj.anything = true;
		obj.greedy = true;
		obj.optional = true;
		return obj;
	}
	if (w) {
		w = w.replace("\\*", "*");
		w = w.replace("\\.", ".");
		if (opts.caseSensitive) obj.use = "text";
		else w = w.toLowerCase();
		obj.word = w;
	}
	return obj;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/parseMatch/03-splitHyphens.js
var hasDash$2 = /[a-z0-9][-–—][a-z]/i;
var splitHyphens$1 = function(regs, world) {
	const prefixes = world.model.one.prefixes;
	for (let i = regs.length - 1; i >= 0; i -= 1) {
		const reg = regs[i];
		if (reg.word && hasDash$2.test(reg.word)) {
			let words = reg.word.split(/[-–—]/g);
			if (prefixes.hasOwnProperty(words[0])) continue;
			words = words.filter((w) => w).reverse();
			regs.splice(i, 1);
			words.forEach((w) => {
				const obj = Object.assign({}, reg);
				obj.word = w;
				regs.splice(i, 0, obj);
			});
		}
	}
	return regs;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/parseMatch/04-inflect-root.js
var addVerbs = function(token, world) {
	const { all } = world.methods.two.transform.verb || {};
	const str = token.root;
	if (!all) return [];
	return all(str, world.model);
};
var addNoun = function(token, world) {
	const { all } = world.methods.two.transform.noun || {};
	if (!all) return [token.root];
	return all(token.root, world.model);
};
var addAdjective = function(token, world) {
	const { all } = world.methods.two.transform.adjective || {};
	if (!all) return [token.root];
	return all(token.root, world.model);
};
var inflectRoot = function(regs, world) {
	regs = regs.map((token) => {
		if (token.root) if (world.methods.two && world.methods.two.transform) {
			let choices = [];
			if (token.pos) {
				if (token.pos === "Verb") choices = choices.concat(addVerbs(token, world));
				else if (token.pos === "Noun") choices = choices.concat(addNoun(token, world));
				else if (token.pos === "Adjective") choices = choices.concat(addAdjective(token, world));
			} else {
				choices = choices.concat(addVerbs(token, world));
				choices = choices.concat(addNoun(token, world));
				choices = choices.concat(addAdjective(token, world));
			}
			choices = choices.filter((str) => str);
			if (choices.length > 0) {
				token.operator = "or";
				token.fastOr = new Set(choices);
			}
		} else {
			token.machine = token.root;
			delete token.id;
			delete token.root;
		}
		return token;
	});
	return regs;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/parseMatch/05-postProcess.js
var nameGroups = function(regs) {
	let index = 0;
	let inGroup = null;
	for (let i = 0; i < regs.length; i++) {
		const token = regs[i];
		if (token.groupStart === true) {
			inGroup = token.group;
			if (inGroup === null) {
				inGroup = String(index);
				index += 1;
			}
		}
		if (inGroup !== null) token.group = inGroup;
		if (token.groupEnd === true) inGroup = null;
	}
	return regs;
};
var doFastOrMode = function(tokens) {
	return tokens.map((token) => {
		if (token.choices !== void 0) {
			if (token.operator !== "or") return token;
			if (token.fuzzy === true) return token;
			if (token.choices.every((block) => {
				if (block.length !== 1) return false;
				const reg = block[0];
				if (reg.fuzzy === true) return false;
				if (reg.start || reg.end) return false;
				if (reg.word !== void 0 && reg.negative !== true && reg.optional !== true && reg.method !== true) return true;
				return false;
			}) === true) {
				token.fastOr = /* @__PURE__ */ new Set();
				token.choices.forEach((block) => {
					token.fastOr.add(block[0].word);
				});
				delete token.choices;
			}
		}
		return token;
	});
};
var fuzzyOr = function(regs) {
	return regs.map((reg) => {
		if (reg.fuzzy && reg.choices) reg.choices.forEach((r) => {
			if (r.length === 1 && r[0].word) {
				r[0].fuzzy = true;
				r[0].min = reg.min;
			}
		});
		return reg;
	});
};
var postProcess = function(regs) {
	regs = nameGroups(regs);
	regs = doFastOrMode(regs);
	regs = fuzzyOr(regs);
	return regs;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/parseMatch/index.js
/** parse a match-syntax string into json */
var syntax = function(input, opts, world) {
	if (input === null || input === void 0 || input === "") return [];
	opts = opts || {};
	if (typeof input === "number") input = String(input);
	let tokens = parseBlocks(input);
	tokens = tokens.map((str) => parseToken(str, opts));
	tokens = splitHyphens$1(tokens, world);
	tokens = inflectRoot(tokens, world);
	tokens = postProcess(tokens, opts);
	return tokens;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/01-failFast.js
var anyIntersection = function(setA, setB) {
	for (const elem of setB) if (setA.has(elem)) return true;
	return false;
};
var failFast = function(regs, cache) {
	for (let i = 0; i < regs.length; i += 1) {
		const reg = regs[i];
		if (reg.optional === true || reg.negative === true || reg.fuzzy === true) continue;
		if (reg.word !== void 0 && cache.has(reg.word) === false) return true;
		if (reg.tag !== void 0 && cache.has("#" + reg.tag) === false) return true;
		if (reg.fastOr && anyIntersection(reg.fastOr, cache) === false) return false;
	}
	return false;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/term/_fuzzy.js
var editDistance = function(strA, strB) {
	const aLength = strA.length, bLength = strB.length;
	if (aLength === 0) return bLength;
	if (bLength === 0) return aLength;
	const limit = (bLength > aLength ? bLength : aLength) + 1;
	if (Math.abs(aLength - bLength) > (limit || 100)) return limit || 100;
	const matrix = [];
	for (let i = 0; i < limit; i++) {
		matrix[i] = [i];
		matrix[i].length = limit;
	}
	for (let i = 0; i < limit; i++) matrix[0][i] = i;
	let j, a_index, b_index, cost, min, t;
	for (let i = 1; i <= aLength; ++i) {
		a_index = strA[i - 1];
		for (j = 1; j <= bLength; ++j) {
			if (i === j && matrix[i][j] > 4) return aLength;
			b_index = strB[j - 1];
			cost = a_index === b_index ? 0 : 1;
			min = matrix[i - 1][j] + 1;
			if ((t = matrix[i][j - 1] + 1) < min) min = t;
			if ((t = matrix[i - 1][j - 1] + cost) < min) min = t;
			if (i > 1 && j > 1 && a_index === strB[j - 2] && strA[i - 2] === b_index && (t = matrix[i - 2][j - 2] + cost) < min) matrix[i][j] = t;
			else matrix[i][j] = min;
		}
	}
	return matrix[aLength][bLength];
};
var fuzzyMatch = function(strA, strB, minLength = 3) {
	if (strA === strB) return 1;
	if (strA.length < minLength || strB.length < minLength) return 0;
	const steps = editDistance(strA, strB);
	const length = Math.max(strA.length, strB.length);
	return 1 - (length === 0 ? 0 : steps / length);
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/termMethods.js
var startQuote = /([\u0022\uFF02\u0027\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F])/;
var endQuote = /([\u0022\uFF02\u0027\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4])/;
var hasHyphen$1 = /^[-–—]$/;
var hasDash$1 = / [-–—]{1,3} /;
/** search the term's 'post' punctuation  */
var hasPost = (term, punct) => term.post.indexOf(punct) !== -1;
/** search the term's 'pre' punctuation  */
var methods$6 = {
	/** does it have a quotation symbol?  */
	hasQuote: (term) => startQuote.test(term.pre) || endQuote.test(term.post),
	/** does it have a comma?  */
	hasComma: (term) => hasPost(term, ","),
	/** does it end in a period? */
	hasPeriod: (term) => hasPost(term, ".") === true && hasPost(term, "...") === false,
	/** does it end in an exclamation */
	hasExclamation: (term) => hasPost(term, "!"),
	/** does it end with a question mark? */
	hasQuestionMark: (term) => hasPost(term, "?") || hasPost(term, "¿"),
	/** is there a ... at the end? */
	hasEllipses: (term) => hasPost(term, "..") || hasPost(term, "…"),
	/** is there a semicolon after term word? */
	hasSemicolon: (term) => hasPost(term, ";"),
	/** is there a colon after term word? */
	hasColon: (term) => hasPost(term, ":"),
	/** is there a slash '/' in term word? */
	hasSlash: (term) => /\//.test(term.text),
	/** a hyphen connects two words like-term */
	hasHyphen: (term) => hasHyphen$1.test(term.post) || hasHyphen$1.test(term.pre),
	/** a dash separates words - like that */
	hasDash: (term) => hasDash$1.test(term.post) || hasDash$1.test(term.pre),
	/** is it multiple words combinded */
	hasContraction: (term) => Boolean(term.implicit),
	/** is it an acronym */
	isAcronym: (term) => term.tags.has("Acronym"),
	/** does it have any tags */
	isKnown: (term) => term.tags.size > 0,
	/** uppercase first letter, then a lowercase */
	isTitleCase: (term) => /^\p{Lu}[a-z'\u00C0-\u00FF]/u.test(term.text),
	/** uppercase all letters */
	isUpperCase: (term) => /^\p{Lu}+$/u.test(term.text)
};
methods$6.hasQuotation = methods$6.hasQuote;
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/term/doesMatch.js
var wrapMatch = function() {};
/** ignore optional/greedy logic, straight-up term match*/
var doesMatch$1 = function(term, reg, index, length) {
	if (reg.anything === true) return true;
	if (reg.start === true && index !== 0) return false;
	if (reg.end === true && index !== length - 1) return false;
	if (reg.id !== void 0 && reg.id === term.id) return true;
	if (reg.word !== void 0) {
		if (reg.use) return reg.word === term[reg.use];
		if (term.machine !== null && term.machine === reg.word) return true;
		if (term.alias !== void 0 && term.alias.hasOwnProperty(reg.word)) return true;
		if (reg.fuzzy === true) {
			if (reg.word === term.root) return true;
			if (fuzzyMatch(reg.word, term.normal) >= reg.min) return true;
		}
		if (term.alias && term.alias.some((str) => str === reg.word)) return true;
		return reg.word === term.text || reg.word === term.normal;
	}
	if (reg.tag !== void 0) return term.tags.has(reg.tag) === true;
	if (reg.method !== void 0) {
		if (typeof methods$6[reg.method] === "function" && methods$6[reg.method](term) === true) return true;
		return false;
	}
	if (reg.pre !== void 0) return term.pre && term.pre.includes(reg.pre);
	if (reg.post !== void 0) return term.post && term.post.includes(reg.post);
	if (reg.regex !== void 0) {
		let str = term.normal;
		if (reg.use) str = term[reg.use];
		return reg.regex.test(str);
	}
	if (reg.chunk !== void 0) return term.chunk === reg.chunk;
	if (reg.switch !== void 0) return term.switch === reg.switch;
	if (reg.machine !== void 0) return term.normal === reg.machine || term.machine === reg.machine || term.root === reg.machine;
	if (reg.sense !== void 0) return term.sense === reg.sense;
	if (reg.fastOr !== void 0) {
		if (reg.pos && !term.tags.has(reg.pos)) return null;
		const str = term.root || term.implicit || term.machine || term.normal;
		return reg.fastOr.has(str) || reg.fastOr.has(term.text);
	}
	if (reg.choices !== void 0) {
		if (reg.operator === "and") return reg.choices.every((r) => wrapMatch(term, r, index, length));
		return reg.choices.some((r) => wrapMatch(term, r, index, length));
	}
	return false;
};
wrapMatch = function(t, reg, index, length) {
	const result = doesMatch$1(t, reg, index, length);
	if (reg.negative === true) return !result;
	return result;
};
var doesMatch_default = wrapMatch;
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/logic/greedy.js
var getGreedy = function(state, endReg) {
	const reg = Object.assign({}, state.regs[state.r], {
		start: false,
		end: false
	});
	const start = state.t;
	for (; state.t < state.terms.length; state.t += 1) {
		if (endReg && doesMatch_default(state.terms[state.t], endReg, state.start_i + state.t, state.phrase_length)) return state.t;
		const count = state.t - start + 1;
		if (reg.max !== void 0 && count === reg.max) return state.t;
		if (doesMatch_default(state.terms[state.t], reg, state.start_i + state.t, state.phrase_length) === false) {
			if (reg.min !== void 0 && count < reg.min) return null;
			return state.t;
		}
	}
	return state.t;
};
var greedyTo = function(state, nextReg) {
	let t = state.t;
	if (!nextReg) return state.terms.length;
	for (; t < state.terms.length; t += 1) if (doesMatch_default(state.terms[t], nextReg, state.start_i + t, state.phrase_length) === true) return t;
	return null;
};
var isEndGreedy = function(reg, state) {
	if (reg.end === true && reg.greedy === true) {
		if (state.start_i + state.t < state.phrase_length - 1) {
			const tmpReg = Object.assign({}, reg, { end: false });
			if (doesMatch_default(state.terms[state.t], tmpReg, state.start_i + state.t, state.phrase_length) === true) return true;
		}
	}
	return false;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/_lib.js
var getGroup$1 = function(state, term_index) {
	if (state.groups[state.inGroup]) return state.groups[state.inGroup];
	state.groups[state.inGroup] = {
		start: term_index,
		length: 0
	};
	return state.groups[state.inGroup];
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/astrix.js
var doAstrix = function(state) {
	const { regs } = state;
	const reg = regs[state.r];
	const skipto = greedyTo(state, regs[state.r + 1]);
	if (skipto === null || skipto === 0) return null;
	if (reg.min !== void 0 && skipto - state.t < reg.min) return null;
	if (reg.max !== void 0 && skipto - state.t > reg.max) {
		state.t = state.t + reg.max;
		return true;
	}
	if (state.hasGroup === true) {
		const g = getGroup$1(state, state.t);
		g.length = skipto - state.t;
	}
	state.t = skipto;
	return true;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/logic/and-or.js
var isArray$5 = function(arr) {
	return Object.prototype.toString.call(arr) === "[object Array]";
};
var doOrBlock = function(state, skipN = 0) {
	const block = state.regs[state.r];
	let wasFound = false;
	for (let c = 0; c < block.choices.length; c += 1) {
		const regs = block.choices[c];
		if (!isArray$5(regs)) return false;
		wasFound = regs.every((cr, w_index) => {
			let extra = 0;
			const t = state.t + w_index + skipN + extra;
			if (state.terms[t] === void 0) return false;
			const foundBlock = doesMatch_default(state.terms[t], cr, t + state.start_i, state.phrase_length);
			if (foundBlock === true && cr.greedy === true) for (let i = 1; i < state.terms.length; i += 1) {
				const term = state.terms[t + i];
				if (term) if (doesMatch_default(term, cr, state.start_i + i, state.phrase_length) === true) extra += 1;
				else break;
			}
			skipN += extra;
			return foundBlock;
		});
		if (wasFound) {
			skipN += regs.length;
			break;
		}
	}
	if (wasFound && block.greedy === true) return doOrBlock(state, skipN);
	return skipN;
};
var doAndBlock = function(state) {
	let longest = 0;
	if (state.regs[state.r].choices.every((block) => {
		const allWords = block.every((cr, w_index) => {
			const tryTerm = state.t + w_index;
			if (state.terms[tryTerm] === void 0) return false;
			return doesMatch_default(state.terms[tryTerm], cr, tryTerm, state.phrase_length);
		});
		if (allWords === true && block.length > longest) longest = block.length;
		return allWords;
	}) === true) return longest;
	return false;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/or-block.js
var orBlock = function(state) {
	const { regs } = state;
	const reg = regs[state.r];
	const skipNum = doOrBlock(state);
	if (skipNum) {
		if (reg.negative === true) return null;
		if (state.hasGroup === true) {
			const g = getGroup$1(state, state.t);
			g.length += skipNum;
		}
		if (reg.end === true) {
			const end = state.phrase_length;
			if (state.t + state.start_i + skipNum !== end) return null;
		}
		state.t += skipNum;
		return true;
	} else if (!reg.optional) return null;
	return true;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/and-block.js
var andBlock = function(state) {
	const { regs } = state;
	const reg = regs[state.r];
	const skipNum = doAndBlock(state);
	if (skipNum) {
		if (reg.negative === true) return null;
		if (state.hasGroup === true) {
			const g = getGroup$1(state, state.t);
			g.length += skipNum;
		}
		if (reg.end === true) {
			const end = state.phrase_length - 1;
			if (state.t + state.start_i !== end) return null;
		}
		state.t += skipNum;
		return true;
	} else if (!reg.optional) return null;
	return true;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/logic/negative-greedy.js
var negGreedy = function(state, reg, nextReg) {
	let skip = 0;
	for (let t = state.t; t < state.terms.length; t += 1) {
		let found = doesMatch_default(state.terms[t], reg, state.start_i + state.t, state.phrase_length);
		if (found) break;
		if (nextReg) {
			found = doesMatch_default(state.terms[t], nextReg, state.start_i + state.t, state.phrase_length);
			if (found) break;
		}
		skip += 1;
		if (reg.max !== void 0 && skip === reg.max) break;
	}
	if (skip === 0) return false;
	if (reg.min && reg.min > skip) return false;
	state.t += skip;
	return true;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/negative.js
var doNegative = function(state) {
	const { regs } = state;
	const reg = regs[state.r];
	const tmpReg = Object.assign({}, reg);
	tmpReg.negative = false;
	if (doesMatch_default(state.terms[state.t], tmpReg, state.start_i + state.t, state.phrase_length)) return false;
	if (reg.optional) {
		const nextReg = regs[state.r + 1];
		if (nextReg) {
			if (doesMatch_default(state.terms[state.t], nextReg, state.start_i + state.t, state.phrase_length)) state.r += 1;
			else if (nextReg.optional && regs[state.r + 2]) {
				if (doesMatch_default(state.terms[state.t], regs[state.r + 2], state.start_i + state.t, state.phrase_length)) state.r += 2;
			}
		}
	}
	if (reg.greedy) return negGreedy(state, tmpReg, regs[state.r + 1]);
	state.t += 1;
	return true;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/optional-match.js
var foundOptional = function(state) {
	const { regs } = state;
	const reg = regs[state.r];
	const term = state.terms[state.t];
	const nextRegMatched = doesMatch_default(term, regs[state.r + 1], state.start_i + state.t, state.phrase_length);
	if (reg.negative || nextRegMatched) {
		const nextTerm = state.terms[state.t + 1];
		if (!nextTerm || !doesMatch_default(nextTerm, regs[state.r + 1], state.start_i + state.t, state.phrase_length)) state.r += 1;
	}
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/greedy-match.js
var greedyMatch = function(state) {
	const { regs, phrase_length } = state;
	const reg = regs[state.r];
	state.t = getGreedy(state, regs[state.r + 1]);
	if (state.t === null) return null;
	if (reg.min && reg.min > state.t) return null;
	if (reg.end === true && state.start_i + state.t !== phrase_length) return null;
	return true;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/contraction-skip.js
var contractionSkip = function(state) {
	const term = state.terms[state.t];
	const reg = state.regs[state.r];
	if (term.implicit && state.terms[state.t + 1]) {
		if (!state.terms[state.t + 1].implicit) return;
		if (reg.word === term.normal) state.t += 1;
		if (reg.method === "hasContraction") state.t += 1;
	}
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/steps/simple-match.js
var setGroup = function(state, startAt) {
	const reg = state.regs[state.r];
	const g = getGroup$1(state, startAt);
	if (state.t > 1 && reg.greedy) g.length += state.t - startAt;
	else g.length++;
};
var simpleMatch = function(state) {
	const { regs } = state;
	const reg = regs[state.r];
	const term = state.terms[state.t];
	const startAt = state.t;
	if (reg.optional && regs[state.r + 1] && reg.negative) return true;
	if (reg.optional && regs[state.r + 1]) foundOptional(state);
	if (term.implicit && state.terms[state.t + 1]) contractionSkip(state);
	state.t += 1;
	if (reg.end === true && state.t !== state.terms.length && reg.greedy !== true) return null;
	if (reg.greedy === true) {
		if (!greedyMatch(state)) return null;
	}
	if (state.hasGroup === true) setGroup(state, startAt);
	return true;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/02-from-here.js
/** 
* try a sequence of match tokens ('regs') 
* on a sequence of terms, 
* starting at this certain term.
*/
var tryHere = function(terms, regs, start_i, phrase_length) {
	if (terms.length === 0 || regs.length === 0) return null;
	const state = {
		t: 0,
		terms,
		r: 0,
		regs,
		groups: {},
		start_i,
		phrase_length,
		inGroup: null
	};
	for (; state.r < regs.length; state.r += 1) {
		const reg = regs[state.r];
		state.hasGroup = Boolean(reg.group);
		if (state.hasGroup === true) state.inGroup = reg.group;
		else state.inGroup = null;
		if (!state.terms[state.t]) {
			if (regs.slice(state.r).some((remain) => !remain.optional) === false) break;
			return null;
		}
		if (reg.anything === true && reg.greedy === true) {
			if (!doAstrix(state)) return null;
			continue;
		}
		if (reg.choices !== void 0 && reg.operator === "or") {
			if (!orBlock(state)) return null;
			continue;
		}
		if (reg.choices !== void 0 && reg.operator === "and") {
			if (!andBlock(state)) return null;
			continue;
		}
		if (reg.anything === true) {
			if (reg.negative && reg.anything) return null;
			if (!simpleMatch(state)) return null;
			continue;
		}
		if (isEndGreedy(reg, state) === true) {
			if (!simpleMatch(state)) return null;
			continue;
		}
		if (reg.negative) {
			if (!doNegative(state)) return null;
			continue;
		}
		if (doesMatch_default(state.terms[state.t], reg, state.start_i + state.t, state.phrase_length) === true) {
			if (!simpleMatch(state)) return null;
			continue;
		}
		if (reg.optional === true) continue;
		return null;
	}
	const pntr = [
		null,
		start_i,
		state.t + start_i
	];
	if (pntr[1] === pntr[2]) return null;
	const groups = {};
	Object.keys(state.groups).forEach((k) => {
		const o = state.groups[k];
		const start = start_i + o.start;
		groups[k] = [
			null,
			start,
			start + o.length
		];
	});
	return {
		pointer: pntr,
		groups
	};
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/03-getGroup.js
var getGroup = function(res, group) {
	const ptrs = [];
	const byGroup = {};
	if (res.length === 0) return {
		ptrs,
		byGroup
	};
	if (typeof group === "number") group = String(group);
	if (group) res.forEach((r) => {
		if (r.groups[group]) ptrs.push(r.groups[group]);
	});
	else res.forEach((r) => {
		ptrs.push(r.pointer);
		Object.keys(r.groups).forEach((k) => {
			byGroup[k] = byGroup[k] || [];
			byGroup[k].push(r.groups[k]);
		});
	});
	return {
		ptrs,
		byGroup
	};
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/03-notIf.js
var notIf$1 = function(results, not, docs) {
	results = results.filter((res) => {
		const [n, start, end] = res.pointer;
		const terms = docs[n].slice(start, end);
		for (let i = 0; i < terms.length; i += 1) if (tryHere(terms.slice(i), not, i, terms.length) !== null) return false;
		return true;
	});
	return results;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/methods/match/index.js
var addSentence = function(res, n) {
	res.pointer[0] = n;
	Object.keys(res.groups).forEach((k) => {
		res.groups[k][0] = n;
	});
	return res;
};
var handleStart = function(terms, regs, n) {
	let res = tryHere(terms, regs, 0, terms.length);
	if (res) {
		res = addSentence(res, n);
		return res;
	}
	return null;
};
var runMatch$1 = function(docs, todo, cache) {
	cache = cache || [];
	const { regs, group, justOne } = todo;
	let results = [];
	if (!regs || regs.length === 0) return {
		ptrs: [],
		byGroup: {}
	};
	const minLength = regs.filter((r) => r.optional !== true && r.negative !== true).length;
	docs: for (let n = 0; n < docs.length; n += 1) {
		const terms = docs[n];
		if (cache[n] && failFast(regs, cache[n])) continue;
		if (regs[0].start === true) {
			const foundStart = handleStart(terms, regs, n, group);
			if (foundStart) results.push(foundStart);
			continue;
		}
		for (let i = 0; i < terms.length; i += 1) {
			const slice = terms.slice(i);
			if (slice.length < minLength) break;
			let res = tryHere(slice, regs, i, terms.length);
			if (res) {
				res = addSentence(res, n);
				results.push(res);
				if (justOne === true) break docs;
				const end = res.pointer[2];
				if (Math.abs(end - 1) > i) i = Math.abs(end - 1);
			}
		}
	}
	if (regs[regs.length - 1].end === true) results = results.filter((res) => {
		return docs[res.pointer[0]].length === res.pointer[2];
	});
	if (todo.notIf) results = notIf$1(results, todo.notIf, docs);
	results = getGroup(results, group);
	results.ptrs.forEach((ptr) => {
		const [n, start, end] = ptr;
		ptr[3] = docs[n][start].id;
		ptr[4] = docs[n][end - 1].id;
	});
	return results;
};
//#endregion
//#region node_modules/compromise/src/1-one/match/plugin.js
var plugin_default$21 = {
	api: matchAPI,
	methods: { one: {
		termMethods: methods$6,
		parseMatch: syntax,
		match: runMatch$1
	} },
	lib: { 
	/** pre-parse any match statements */
parseMatch: function(str, opts) {
		const world = this.world();
		const killUnicode = world.methods.one.killUnicode;
		if (killUnicode) str = killUnicode(str, world);
		return world.methods.one.parseMatch(str, opts, world);
	} }
};
//#endregion
//#region node_modules/compromise/src/1-one/output/api/html.js
var isClass = /^\../;
var isId = /^#./;
var escapeXml = (str) => {
	str = str.replace(/&/g, "&amp;");
	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	str = str.replace(/"/g, "&quot;");
	str = str.replace(/'/g, "&apos;");
	return str;
};
var toTag = function(k) {
	let start = "";
	let end = "</span>";
	k = escapeXml(k);
	if (isClass.test(k)) start = `<span class="${k.replace(/^\./, "")}"`;
	else if (isId.test(k)) start = `<span id="${k.replace(/^#/, "")}"`;
	else {
		start = `<${k}`;
		end = `</${k}>`;
	}
	start += ">";
	return {
		start,
		end
	};
};
var getIndex = function(doc, obj) {
	const starts = {};
	const ends = {};
	Object.keys(obj).forEach((k) => {
		let res = obj[k];
		const tag = toTag(k);
		if (typeof res === "string") res = doc.match(res);
		res.docs.forEach((terms) => {
			if (terms.every((t) => t.implicit)) return;
			const a = terms[0].id;
			starts[a] = starts[a] || [];
			starts[a].push(tag.start);
			const b = terms[terms.length - 1].id;
			ends[b] = ends[b] || [];
			ends[b].push(tag.end);
		});
	});
	return {
		starts,
		ends
	};
};
var html = function(obj) {
	const { starts, ends } = getIndex(this, obj);
	let out = "";
	this.docs.forEach((terms) => {
		for (let i = 0; i < terms.length; i += 1) {
			const t = terms[i];
			if (starts.hasOwnProperty(t.id)) out += starts[t.id].join("");
			out += t.pre || "";
			out += t.text || "";
			if (ends.hasOwnProperty(t.id)) out += ends[t.id].join("");
			out += t.post || "";
		}
	});
	return out;
};
var html_default = { html };
//#endregion
//#region node_modules/compromise/src/1-one/output/api/_text.js
var trimEnd = /[,:;)\]*.?~!\u0022\uFF02\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4—-]+$/;
var trimStart = /^[(['"*~\uFF02\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F]+/;
var punctToKill = /[,:;)('"\u201D\]]/;
var isHyphen = /^[-–—]$/;
var hasSpace = / /;
var textFromTerms = function(terms, opts, keepSpace = true) {
	let txt = "";
	terms.forEach((t) => {
		let pre = t.pre || "";
		let post = t.post || "";
		if (opts.punctuation === "some") {
			pre = pre.replace(trimStart, "");
			if (isHyphen.test(post)) post = " ";
			post = post.replace(punctToKill, "");
			post = post.replace(/\?!+/, "?");
			post = post.replace(/!+/, "!");
			post = post.replace(/\?+/, "?");
			post = post.replace(/\.{2,}/, "");
			if (t.tags.has("Abbreviation")) post = post.replace(/\./, "");
		}
		if (opts.whitespace === "some") {
			pre = pre.replace(/\s/, "");
			post = post.replace(/\s+/, " ");
		}
		if (!opts.keepPunct) {
			pre = pre.replace(trimStart, "");
			if (post === "-") post = " ";
			else post = post.replace(trimEnd, "");
		}
		let word = t[opts.form || "text"] || t.normal || "";
		if (opts.form === "implicit") word = t.implicit || t.text;
		if (opts.form === "root" && t.implicit) word = t.root || t.implicit || t.normal;
		if ((opts.form === "machine" || opts.form === "implicit" || opts.form === "root") && t.implicit) {
			if (!post || !hasSpace.test(post)) post += " ";
		}
		txt += pre + word + post;
	});
	if (keepSpace === false) txt = txt.trim();
	if (opts.lowerCase === true) txt = txt.toLowerCase();
	return txt;
};
var textFromDoc = function(docs, opts) {
	let text = "";
	if (!docs || !docs[0] || !docs[0][0]) return text;
	for (let i = 0; i < docs.length; i += 1) text += textFromTerms(docs[i], opts, true);
	if (!opts.keepSpace) text = text.trim();
	if (opts.keepEndPunct === false) {
		if (!docs[0][0].tags.has("Emoticon")) text = text.replace(trimStart, "");
		const last = docs[docs.length - 1];
		if (!last[last.length - 1].tags.has("Emoticon")) text = text.replace(trimEnd, "");
		if (text.endsWith(`'`) && !text.endsWith(`s'`)) text = text.replace(/'/, "");
	}
	if (opts.cleanWhitespace === true) text = text.trim();
	return text;
};
//#endregion
//#region node_modules/compromise/src/1-one/output/api/_fmts.js
var fmts = {
	text: { form: "text" },
	normal: {
		whitespace: "some",
		punctuation: "some",
		case: "some",
		unicode: "some",
		form: "normal"
	},
	machine: {
		keepSpace: false,
		whitespace: "some",
		punctuation: "some",
		case: "none",
		unicode: "some",
		form: "machine"
	},
	root: {
		keepSpace: false,
		whitespace: "some",
		punctuation: "some",
		case: "some",
		unicode: "some",
		form: "root"
	},
	implicit: { form: "implicit" }
};
fmts.clean = fmts.normal;
fmts.reduced = fmts.root;
//#endregion
//#region node_modules/compromise/src/1-one/output/methods/hash.js
var k = [];
var i$1 = 0;
for (; i$1 < 64;) k[i$1] = 0 | Math.sin(++i$1 % Math.PI) * 4294967296;
var md5 = function(s) {
	let b, c, d, j = decodeURI(encodeURI(s)) + "", a = j.length;
	const h = [
		b = 1732584193,
		c = 4023233417,
		~b,
		~c
	], words = [];
	s = --a / 4 + 2 | 15;
	words[--s] = a * 8;
	for (; ~a;) words[a >> 2] |= j.charCodeAt(a) << 8 * a--;
	for (i$1 = j = 0; i$1 < s; i$1 += 16) {
		a = h;
		for (; j < 64; a = [
			d = a[3],
			b + ((d = a[0] + [
				b & c | ~b & d,
				d & b | ~d & c,
				b ^ c ^ d,
				c ^ (b | ~d)
			][a = j >> 4] + k[j] + ~~words[i$1 | [
				j,
				5 * j + 1,
				3 * j + 5,
				7 * j
			][a] & 15]) << (a = [
				7,
				12,
				17,
				22,
				5,
				9,
				14,
				20,
				4,
				11,
				16,
				23,
				6,
				10,
				15,
				21
			][4 * a + j++ % 4]) | d >>> -a),
			b,
			c
		]) {
			b = a[1] | 0;
			c = a[2];
		}
		for (j = 4; j;) h[--j] += a[j];
	}
	for (s = ""; j < 32;) s += (h[j >> 3] >> (1 ^ j++) * 4 & 15).toString(16);
	return s;
};
//#endregion
//#region node_modules/compromise/src/1-one/output/api/json.js
var defaults$2 = {
	text: true,
	terms: true
};
var opts = {
	case: "none",
	unicode: "some",
	form: "machine",
	punctuation: "some"
};
var merge = function(a, b) {
	return Object.assign({}, a, b);
};
var fns$2 = {
	text: (terms) => textFromTerms(terms, { keepPunct: true }, false),
	normal: (terms) => textFromTerms(terms, merge(fmts.normal, { keepPunct: true }), false),
	implicit: (terms) => textFromTerms(terms, merge(fmts.implicit, { keepPunct: true }), false),
	machine: (terms) => textFromTerms(terms, opts, false),
	root: (terms) => textFromTerms(terms, merge(opts, { form: "root" }), false),
	hash: (terms) => md5(textFromTerms(terms, { keepPunct: true }, false)),
	offset: (terms) => {
		const len = fns$2.text(terms).length;
		return {
			index: terms[0].offset.index,
			start: terms[0].offset.start,
			length: len
		};
	},
	terms: (terms) => {
		return terms.map((t) => {
			const term = Object.assign({}, t);
			term.tags = Array.from(t.tags);
			return term;
		});
	},
	confidence: (_terms, view, i) => view.eq(i).confidence(),
	syllables: (_terms, view, i) => view.eq(i).syllables(),
	sentence: (_terms, view, i) => view.eq(i).fullSentence().text(),
	dirty: (terms) => terms.some((t) => t.dirty === true)
};
fns$2.sentences = fns$2.sentence;
fns$2.clean = fns$2.normal;
fns$2.reduced = fns$2.root;
var toJSON$2 = function(view, option) {
	option = option || {};
	if (typeof option === "string") option = {};
	option = Object.assign({}, defaults$2, option);
	if (option.offset) view.compute("offset");
	return view.docs.map((terms, i) => {
		const res = {};
		Object.keys(option).forEach((k) => {
			if (option[k] && fns$2[k]) res[k] = fns$2[k](terms, view, i);
		});
		return res;
	});
};
var methods$4 = { 
/** return data */
json: function(n) {
	const res = toJSON$2(this, n);
	if (typeof n === "number") return res[n];
	return res;
} };
methods$4.data = methods$4.json;
//#endregion
//#region node_modules/compromise/src/1-one/output/api/debug.js
var isClientSide = () => typeof window !== "undefined" && window.document;
var debug$1 = function(fmt) {
	const debugMethods = this.methods.one.debug || {};
	if (fmt && debugMethods.hasOwnProperty(fmt)) {
		debugMethods[fmt](this);
		return this;
	}
	if (isClientSide()) {
		debugMethods.clientSide(this);
		return this;
	}
	debugMethods.tags(this);
	return this;
};
//#endregion
//#region node_modules/compromise/src/1-one/output/api/wrap.js
var toText$3 = function(term) {
	const pre = term.pre || "";
	const post = term.post || "";
	return pre + term.text + post;
};
var findStarts = function(doc, obj) {
	const starts = {};
	Object.keys(obj).forEach((reg) => {
		doc.match(reg).fullPointer.forEach((a) => {
			starts[a[3]] = {
				fn: obj[reg],
				end: a[2]
			};
		});
	});
	return starts;
};
var wrap = function(doc, obj) {
	const starts = findStarts(doc, obj);
	let text = "";
	doc.docs.forEach((terms, n) => {
		for (let i = 0; i < terms.length; i += 1) {
			const t = terms[i];
			if (starts.hasOwnProperty(t.id)) {
				const { fn, end } = starts[t.id];
				const m = doc.update([[
					n,
					i,
					end
				]]);
				text += terms[i].pre || "";
				text += fn(m);
				i = end - 1;
				text += terms[i].post || "";
			} else text += toText$3(t);
		}
	});
	return text;
};
//#endregion
//#region node_modules/compromise/src/1-one/output/api/out.js
var isObject$2 = (val) => {
	return Object.prototype.toString.call(val) === "[object Object]";
};
var topk = function(arr) {
	const obj = {};
	arr.forEach((a) => {
		obj[a] = obj[a] || 0;
		obj[a] += 1;
	});
	return Object.keys(obj).map((k) => {
		return {
			normal: k,
			count: obj[k]
		};
	}).sort((a, b) => a.count > b.count ? -1 : 0);
};
/** some named output formats */
var out = function(method) {
	if (isObject$2(method)) return wrap(this, method);
	if (method === "text") return this.text();
	if (method === "normal") return this.text("normal");
	if (method === "root") return this.text("root");
	if (method === "machine" || method === "reduced") return this.text("machine");
	if (method === "hash" || method === "md5") return md5(this.text());
	if (method === "json") return this.json();
	if (method === "offset" || method === "offsets") {
		this.compute("offset");
		return this.json({ offset: true });
	}
	if (method === "array") return this.docs.map((terms) => {
		return terms.reduce((str, t) => {
			return str + t.pre + t.text + t.post;
		}, "").trim();
	}).filter((str) => str);
	if (method === "freq" || method === "frequency" || method === "topk") return topk(this.json({ normal: true }).map((o) => o.normal));
	if (method === "terms") {
		let list = [];
		this.docs.forEach((terms) => {
			let words = terms.map((t) => t.text);
			words = words.filter((t) => t);
			list = list.concat(words);
		});
		return list;
	}
	if (method === "tags") return this.docs.map((terms) => {
		return terms.reduce((h, t) => {
			h[t.implicit || t.normal] = Array.from(t.tags);
			return h;
		}, {});
	});
	if (method === "debug") return this.debug();
	return this.text();
};
var methods$3 = {
	/** */
	debug: debug$1,
	/** */
	out,
	/** */
	wrap: function(obj) {
		return wrap(this, obj);
	}
};
//#endregion
//#region node_modules/compromise/src/1-one/output/api/text.js
var isObject$1 = (val) => {
	return Object.prototype.toString.call(val) === "[object Object]";
};
//#endregion
//#region node_modules/compromise/src/1-one/output/api/index.js
var methods$2 = Object.assign({}, methods$3, { 
/** */
text: function(fmt) {
	let opts = {};
	if (fmt && typeof fmt === "string" && fmts.hasOwnProperty(fmt)) opts = Object.assign({}, fmts[fmt]);
	else if (fmt && isObject$1(fmt)) opts = Object.assign({}, fmt);
	if (opts.keepSpace === void 0 && !this.isFull()) opts.keepSpace = false;
	if (opts.keepEndPunct === void 0 && this.pointer) {
		const ptr = this.pointer[0];
		if (ptr && ptr[1]) opts.keepEndPunct = false;
		else opts.keepEndPunct = true;
	}
	if (opts.keepPunct === void 0) opts.keepPunct = true;
	if (opts.keepSpace === void 0) opts.keepSpace = true;
	return textFromDoc(this.docs, opts);
} }, methods$4, html_default);
var addAPI$1 = function(View) {
	Object.assign(View.prototype, methods$2);
};
//#endregion
//#region node_modules/compromise/src/1-one/output/methods/debug/client-side.js
var logClientSide = function(view) {
	console.log("%c -=-=- ", "background-color:#6699cc;");
	view.forEach((m) => {
		console.groupCollapsed(m.text());
		const out = m.docs[0].map((t) => {
			let text = t.text || "-";
			if (t.implicit) text = "[" + t.implicit + "]";
			const tags = "[" + Array.from(t.tags).join(", ") + "]";
			return {
				text,
				tags
			};
		});
		console.table(out, ["text", "tags"]);
		console.groupEnd();
	});
};
//#endregion
//#region node_modules/compromise/src/1-one/output/methods/debug/_color.js
var reset = "\x1B[0m";
var cli = {
	green: (str) => "\x1B[32m" + str + reset,
	red: (str) => "\x1B[31m" + str + reset,
	blue: (str) => "\x1B[34m" + str + reset,
	magenta: (str) => "\x1B[35m" + str + reset,
	cyan: (str) => "\x1B[36m" + str + reset,
	yellow: (str) => "\x1B[33m" + str + reset,
	black: (str) => "\x1B[30m" + str + reset,
	dim: (str) => "\x1B[2m" + str + reset,
	i: (str) => "\x1B[3m" + str + reset
};
//#endregion
//#region node_modules/compromise/src/1-one/output/methods/debug/tags.js
var tagString = function(tags, model) {
	if (model.one.tagSet) tags = tags.map((tag) => {
		if (!model.one.tagSet.hasOwnProperty(tag)) return tag;
		return cli[model.one.tagSet[tag].color || "blue"](tag);
	});
	return tags.join(", ");
};
var showTags = function(view) {
	const { docs, model } = view;
	if (docs.length === 0) console.log(cli.blue("\n     ──────"));
	docs.forEach((terms) => {
		console.log(cli.blue("\n  ┌─────────"));
		terms.forEach((t) => {
			const tags = [...t.tags || []];
			let text = t.text || "-";
			if (t.sense) text = `{${t.normal}/${t.sense}}`;
			if (t.implicit) text = "[" + t.implicit + "]";
			text = cli.yellow(text);
			let word = "'" + text + "'";
			if (t.reference) {
				const str = view.update([t.reference]).text("normal");
				word += ` - ${cli.dim(cli.i("[" + str + "]"))}`;
			}
			word = word.padEnd(18);
			const str = cli.blue("  │ ") + cli.i(word) + "  - " + tagString(tags, model);
			console.log(str);
		});
	});
	console.log("\n");
};
//#endregion
//#region node_modules/compromise/src/1-one/output/methods/debug/chunks.js
var showChunks = function(view) {
	const { docs } = view;
	console.log("");
	docs.forEach((terms) => {
		const out = [];
		terms.forEach((term) => {
			if (term.chunk === "Noun") out.push(cli.blue(term.implicit || term.normal));
			else if (term.chunk === "Verb") out.push(cli.green(term.implicit || term.normal));
			else if (term.chunk === "Adjective") out.push(cli.yellow(term.implicit || term.normal));
			else if (term.chunk === "Pivot") out.push(cli.red(term.implicit || term.normal));
			else out.push(term.implicit || term.normal);
		});
		console.log(out.join(" "), "\n");
	});
	console.log("\n");
};
//#endregion
//#region node_modules/compromise/src/1-one/output/methods/debug/highlight.js
var split$1 = (txt, offset, index) => {
	const buff = index * 9;
	const start = offset.start + buff;
	const end = start + offset.length;
	return [
		txt.substring(0, start),
		txt.substring(start, end),
		txt.substring(end, txt.length)
	];
};
var spliceIn = function(txt, offset, index) {
	const parts = split$1(txt, offset, index);
	return `${parts[0]}${cli.blue(parts[1])}${parts[2]}`;
};
var showHighlight = function(doc) {
	if (!doc.found) return;
	const bySentence = {};
	doc.fullPointer.forEach((ptr) => {
		bySentence[ptr[0]] = bySentence[ptr[0]] || [];
		bySentence[ptr[0]].push(ptr);
	});
	Object.keys(bySentence).forEach((k) => {
		let txt = doc.update([[Number(k)]]).text();
		doc.update(bySentence[k]).json({ offset: true }).forEach((obj, i) => {
			txt = spliceIn(txt, obj.offset, i);
		});
		console.log(txt);
	});
	console.log("\n");
};
//#endregion
//#region node_modules/compromise/src/1-one/output/plugin.js
var plugin_default$20 = {
	api: addAPI$1,
	methods: { one: {
		hash: md5,
		debug: {
			tags: showTags,
			clientSide: logClientSide,
			chunks: showChunks,
			highlight: showHighlight
		}
	} }
};
//#endregion
//#region node_modules/compromise/src/1-one/pointers/api/lib/_lib.js
var doesOverlap = function(a, b) {
	if (a[0] !== b[0]) return false;
	const [, startA, endA] = a;
	const [, startB, endB] = b;
	if (startA <= startB && endA > startB) return true;
	if (startB <= startA && endB > startA) return true;
	return false;
};
var getExtent = function(ptrs) {
	let min = ptrs[0][1];
	let max = ptrs[0][2];
	ptrs.forEach((ptr) => {
		if (ptr[1] < min) min = ptr[1];
		if (ptr[2] > max) max = ptr[2];
	});
	return [
		ptrs[0][0],
		min,
		max
	];
};
var indexN = function(ptrs) {
	const byN = {};
	ptrs.forEach((ref) => {
		byN[ref[0]] = byN[ref[0]] || [];
		byN[ref[0]].push(ref);
	});
	return byN;
};
var uniquePtrs = function(arr) {
	const obj = {};
	for (let i = 0; i < arr.length; i += 1) obj[arr[i].join(",")] = arr[i];
	return Object.values(obj);
};
//#endregion
//#region node_modules/compromise/src/1-one/pointers/api/lib/split.js
var pivotBy = function(full, m) {
	const [n, start] = full;
	const mStart = m[1];
	const mEnd = m[2];
	const res = {};
	if (start < mStart) res.before = [
		n,
		start,
		mStart < full[2] ? mStart : full[2]
	];
	res.match = m;
	if (full[2] > mEnd) res.after = [
		n,
		mEnd,
		full[2]
	];
	return res;
};
var doesMatch = function(full, m) {
	return full[1] <= m[1] && m[2] <= full[2];
};
var splitAll = function(full, m) {
	const byN = indexN(m);
	const res = [];
	full.forEach((ptr) => {
		const [n] = ptr;
		let matches = byN[n] || [];
		matches = matches.filter((p) => doesMatch(ptr, p));
		if (matches.length === 0) {
			res.push({ passthrough: ptr });
			return;
		}
		matches = matches.sort((a, b) => a[1] - b[1]);
		let carry = ptr;
		matches.forEach((p, i) => {
			const found = pivotBy(carry, p);
			if (!matches[i + 1]) res.push(found);
			else {
				res.push({
					before: found.before,
					match: found.match
				});
				if (found.after) carry = found.after;
			}
		});
	});
	return res;
};
//#endregion
//#region node_modules/compromise/src/1-one/pointers/methods/getDoc.js
var max$1 = 20;
var blindSweep = function(id, doc, n) {
	for (let i = 0; i < max$1; i += 1) {
		if (doc[n - i]) {
			const index = doc[n - i].findIndex((term) => term.id === id);
			if (index !== -1) return [n - i, index];
		}
		if (doc[n + i]) {
			const index = doc[n + i].findIndex((term) => term.id === id);
			if (index !== -1) return [n + i, index];
		}
	}
	return null;
};
var repairEnding = function(ptr, document) {
	const [n, start, , , endId] = ptr;
	const terms = document[n];
	const newEnd = terms.findIndex((t) => t.id === endId);
	if (newEnd === -1) {
		ptr[2] = document[n].length;
		ptr[4] = terms.length ? terms[terms.length - 1].id : null;
	} else ptr[2] = newEnd;
	return document[n].slice(start, ptr[2] + 1);
};
/** return a subset of the document, from a pointer */
var getDoc$1 = function(ptrs, document) {
	let doc = [];
	ptrs.forEach((ptr, i) => {
		if (!ptr) return;
		let [n, start, end, id, endId] = ptr;
		let terms = document[n] || [];
		if (start === void 0) start = 0;
		if (end === void 0) end = terms.length;
		if (id && (!terms[start] || terms[start].id !== id)) {
			const wild = blindSweep(id, document, n);
			if (wild !== null) {
				const len = end - start;
				terms = document[wild[0]].slice(wild[1], wild[1] + len);
				const startId = terms[0] ? terms[0].id : null;
				ptrs[i] = [
					wild[0],
					wild[1],
					wild[1] + len,
					startId
				];
			}
		} else terms = terms.slice(start, end);
		if (terms.length === 0) return;
		if (start === end) return;
		if (endId && terms[terms.length - 1].id !== endId) terms = repairEnding(ptr, document);
		doc.push(terms);
	});
	doc = doc.filter((a) => a.length > 0);
	return doc;
};
//#endregion
//#region node_modules/compromise/src/1-one/pointers/methods/index.js
var termList = function(docs) {
	const arr = [];
	for (let i = 0; i < docs.length; i += 1) for (let t = 0; t < docs[i].length; t += 1) arr.push(docs[i][t]);
	return arr;
};
var methods_default$5 = { one: {
	termList,
	getDoc: getDoc$1,
	pointer: {
		indexN,
		splitAll
	}
} };
//#endregion
//#region node_modules/compromise/src/1-one/pointers/api/lib/union.js
var getUnion = function(a, b) {
	const both = a.concat(b);
	const byN = indexN(both);
	let res = [];
	both.forEach((ptr) => {
		const [n] = ptr;
		if (byN[n].length === 1) {
			res.push(ptr);
			return;
		}
		const hmm = byN[n].filter((m) => doesOverlap(ptr, m));
		hmm.push(ptr);
		const range = getExtent(hmm);
		res.push(range);
	});
	res = uniquePtrs(res);
	return res;
};
//#endregion
//#region node_modules/compromise/src/1-one/pointers/api/lib/difference.js
var subtract = function(refs, not) {
	const res = [];
	splitAll(refs, not).forEach((o) => {
		if (o.passthrough) res.push(o.passthrough);
		if (o.before) res.push(o.before);
		if (o.after) res.push(o.after);
	});
	return res;
};
//#endregion
//#region node_modules/compromise/src/1-one/pointers/api/lib/intersection.js
var intersection = function(a, b) {
	const start = a[1] < b[1] ? b[1] : a[1];
	const end = a[2] > b[2] ? b[2] : a[2];
	if (start < end) return [
		a[0],
		start,
		end
	];
	return null;
};
var getIntersection = function(a, b) {
	const byN = indexN(b);
	const res = [];
	a.forEach((ptr) => {
		let hmm = byN[ptr[0]] || [];
		hmm = hmm.filter((p) => doesOverlap(ptr, p));
		if (hmm.length === 0) return;
		hmm.forEach((h) => {
			const overlap = intersection(ptr, h);
			if (overlap) res.push(overlap);
		});
	});
	return res;
};
//#endregion
//#region node_modules/compromise/src/1-one/pointers/api/index.js
var isArray$4 = function(arr) {
	return Object.prototype.toString.call(arr) === "[object Array]";
};
var getDoc = (m, view) => {
	if (typeof m === "string" || isArray$4(m)) return view.match(m);
	if (!m) return view.none();
	return m;
};
var addIds = function(ptrs, docs) {
	return ptrs.map((ptr) => {
		const [n, start] = ptr;
		if (docs[n] && docs[n][start]) ptr[3] = docs[n][start].id;
		return ptr;
	});
};
var methods$1 = {};
methods$1.union = function(m) {
	m = getDoc(m, this);
	let ptrs = getUnion(this.fullPointer, m.fullPointer);
	ptrs = addIds(ptrs, this.document);
	return this.toView(ptrs);
};
methods$1.and = methods$1.union;
methods$1.intersection = function(m) {
	m = getDoc(m, this);
	let ptrs = getIntersection(this.fullPointer, m.fullPointer);
	ptrs = addIds(ptrs, this.document);
	return this.toView(ptrs);
};
methods$1.not = function(m) {
	m = getDoc(m, this);
	let ptrs = subtract(this.fullPointer, m.fullPointer);
	ptrs = addIds(ptrs, this.document);
	return this.toView(ptrs);
};
methods$1.difference = methods$1.not;
methods$1.complement = function() {
	let ptrs = subtract(this.all().fullPointer, this.fullPointer);
	ptrs = addIds(ptrs, this.document);
	return this.toView(ptrs);
};
methods$1.settle = function() {
	let ptrs = this.fullPointer;
	ptrs.forEach((ptr) => {
		ptrs = getUnion(ptrs, [ptr]);
	});
	ptrs = addIds(ptrs, this.document);
	return this.update(ptrs);
};
var addAPI = function(View) {
	Object.assign(View.prototype, methods$1);
};
//#endregion
//#region node_modules/compromise/src/1-one/pointers/plugin.js
var plugin_default$19 = {
	methods: methods_default$5,
	api: addAPI
};
//#endregion
//#region node_modules/compromise/src/1-one/sweep/lib.js
var lib_default$2 = { buildNet: function(matches) {
	const net = this.methods().one.buildNet(matches, this.world());
	net.isNet = true;
	return net;
} };
//#endregion
//#region node_modules/compromise/src/1-one/sweep/api.js
var api$19 = function(View) {
	/** speedy match a sequence of matches */
	View.prototype.sweep = function(net, opts = {}) {
		const { world, docs } = this;
		const { methods } = world;
		let found = methods.one.bulkMatch(docs, net, this.methods, opts);
		if (opts.tagger !== false) methods.one.bulkTagger(found, docs, this.world);
		found = found.map((o) => {
			const ptr = o.pointer;
			const term = docs[ptr[0]][ptr[1]];
			const len = ptr[2] - ptr[1];
			if (term.index) o.pointer = [
				term.index[0],
				term.index[1],
				ptr[1] + len
			];
			return o;
		});
		const ptrs = found.map((o) => o.pointer);
		found = found.map((obj) => {
			obj.view = this.update([obj.pointer]);
			delete obj.regs;
			delete obj.needs;
			delete obj.pointer;
			delete obj._expanded;
			return obj;
		});
		return {
			view: this.update(ptrs),
			found
		};
	};
};
//#endregion
//#region node_modules/compromise/src/1-one/sweep/methods/buildNet/01-parse.js
var getTokenNeeds = function(reg) {
	if (reg.optional === true || reg.negative === true) return null;
	if (reg.tag) return "#" + reg.tag;
	if (reg.word) return reg.word;
	if (reg.switch) return `%${reg.switch}%`;
	return null;
};
var getNeeds = function(regs) {
	const needs = [];
	regs.forEach((reg) => {
		needs.push(getTokenNeeds(reg));
		if (reg.operator === "and" && reg.choices) reg.choices.forEach((oneSide) => {
			oneSide.forEach((r) => {
				needs.push(getTokenNeeds(r));
			});
		});
	});
	return needs.filter((str) => str);
};
var getWants = function(regs) {
	const wants = [];
	let count = 0;
	regs.forEach((reg) => {
		if (reg.operator === "or" && !reg.optional && !reg.negative) {
			if (reg.fastOr) Array.from(reg.fastOr).forEach((w) => {
				wants.push(w);
			});
			if (reg.choices) reg.choices.forEach((rs) => {
				rs.forEach((r) => {
					const n = getTokenNeeds(r);
					if (n) wants.push(n);
				});
			});
			count += 1;
		}
	});
	return {
		wants,
		count
	};
};
var parse$5 = function(matches, world) {
	const parseMatch = world.methods.one.parseMatch;
	matches.forEach((obj) => {
		obj.regs = parseMatch(obj.match, {}, world);
		if (typeof obj.ifNo === "string") obj.ifNo = [obj.ifNo];
		if (obj.notIf) obj.notIf = parseMatch(obj.notIf, {}, world);
		obj.needs = getNeeds(obj.regs);
		const { wants, count } = getWants(obj.regs);
		obj.wants = wants;
		obj.minWant = count;
		obj.minWords = obj.regs.filter((o) => !o.optional).length;
	});
	return matches;
};
//#endregion
//#region node_modules/compromise/src/1-one/sweep/methods/buildNet/index.js
var buildNet = function(matches, world) {
	matches = parse$5(matches, world);
	const hooks = {};
	matches.forEach((obj) => {
		obj.needs.forEach((str) => {
			hooks[str] = Array.isArray(hooks[str]) ? hooks[str] : [];
			hooks[str].push(obj);
		});
		obj.wants.forEach((str) => {
			hooks[str] = Array.isArray(hooks[str]) ? hooks[str] : [];
			hooks[str].push(obj);
		});
	});
	Object.keys(hooks).forEach((k) => {
		const already = {};
		hooks[k] = hooks[k].filter((obj) => {
			if (typeof already[obj.match] === "boolean") return false;
			already[obj.match] = true;
			return true;
		});
	});
	return {
		hooks,
		always: matches.filter((o) => o.needs.length === 0 && o.wants.length === 0)
	};
};
//#endregion
//#region node_modules/compromise/src/1-one/sweep/methods/sweep/01-getHooks.js
var getHooks = function(docCaches, hooks) {
	return docCaches.map((set, i) => {
		let maybe = [];
		Object.keys(hooks).forEach((k) => {
			if (docCaches[i].has(k)) maybe = maybe.concat(hooks[k]);
		});
		const already = {};
		maybe = maybe.filter((m) => {
			if (typeof already[m.match] === "boolean") return false;
			already[m.match] = true;
			return true;
		});
		return maybe;
	});
};
//#endregion
//#region node_modules/compromise/src/1-one/sweep/methods/sweep/02-trim-down.js
var localTrim = function(maybeList, docCache) {
	return maybeList.map((list, n) => {
		const haves = docCache[n];
		list = list.filter((obj) => {
			return obj.needs.every((need) => haves.has(need));
		});
		list = list.filter((obj) => {
			if (obj.ifNo !== void 0 && obj.ifNo.some((no) => haves.has(no)) === true) return false;
			return true;
		});
		list = list.filter((obj) => {
			if (obj.wants.length === 0) return true;
			return obj.wants.filter((str) => haves.has(str)).length >= obj.minWant;
		});
		return list;
	});
};
//#endregion
//#region node_modules/compromise/src/1-one/sweep/methods/sweep/04-runMatch.js
var runMatch = function(maybeList, document, docCache, methods, opts) {
	const results = [];
	for (let n = 0; n < maybeList.length; n += 1) for (let i = 0; i < maybeList[n].length; i += 1) {
		const m = maybeList[n][i];
		const res = methods.one.match([document[n]], m);
		if (res.ptrs.length > 0) {
			res.ptrs.forEach((ptr) => {
				ptr[0] = n;
				const todo = Object.assign({}, m, { pointer: ptr });
				if (m.unTag !== void 0) todo.unTag = m.unTag;
				results.push(todo);
			});
			if (opts.matchOne === true) return [results[0]];
		}
	}
	return results;
};
//#endregion
//#region node_modules/compromise/src/1-one/sweep/methods/sweep/index.js
var tooSmall = function(maybeList, document) {
	return maybeList.map((arr, i) => {
		const termCount = document[i].length;
		arr = arr.filter((o) => {
			return termCount >= o.minWords;
		});
		return arr;
	});
};
var sweep = function(document, net, methods, opts = {}) {
	const docCache = methods.one.cacheDoc(document);
	let maybeList = getHooks(docCache, net.hooks);
	maybeList = localTrim(maybeList, docCache, document);
	if (net.always.length > 0) maybeList = maybeList.map((arr) => arr.concat(net.always));
	maybeList = tooSmall(maybeList, document);
	return runMatch(maybeList, document, docCache, methods, opts);
};
//#endregion
//#region node_modules/compromise/src/1-one/sweep/methods/tagger/canBe.js
var canBe$1 = function(terms, tag, model) {
	const tagSet = model.one.tagSet;
	if (!tagSet.hasOwnProperty(tag)) return true;
	const not = tagSet[tag].not || [];
	for (let i = 0; i < terms.length; i += 1) {
		const term = terms[i];
		for (let k = 0; k < not.length; k += 1) if (term.tags.has(not[k]) === true) return false;
	}
	return true;
};
//#endregion
//#region node_modules/compromise/src/1-one/sweep/methods/tagger/index.js
var tagger$1 = function(list, document, world) {
	const { model, methods } = world;
	const { getDoc, setTag, unTag } = methods.one;
	const looksPlural = methods.two.looksPlural;
	if (list.length === 0) return list;
	if ((typeof process === "undefined" || !process.env ? self.env || {} : process.env).DEBUG_TAGS) console.log(`\n\n  \x1b[32m→ ${list.length} post-tagger:\x1b[0m`);
	return list.map((todo) => {
		if (!todo.tag && !todo.chunk && !todo.unTag) return;
		const reason = todo.reason || todo.match;
		const terms = getDoc([todo.pointer], document)[0];
		if (todo.safe === true) {
			if (canBe$1(terms, todo.tag, model) === false) return;
			if (terms[terms.length - 1].post === "-") return;
		}
		if (todo.tag !== void 0) {
			setTag(terms, todo.tag, world, todo.safe, `[post] '${reason}'`);
			if (todo.tag === "Noun" && looksPlural) {
				const term = terms[terms.length - 1];
				if (looksPlural(term.text)) setTag([term], "Plural", world, todo.safe, "quick-plural");
				else setTag([term], "Singular", world, todo.safe, "quick-singular");
			}
			if (todo.freeze === true) terms.forEach((term) => term.frozen = true);
		}
		if (todo.unTag !== void 0) unTag(terms, todo.unTag, world, todo.safe, reason);
		if (todo.chunk) terms.forEach((t) => t.chunk = todo.chunk);
	});
};
//#endregion
//#region node_modules/compromise/src/1-one/sweep/plugin.js
var plugin_default$18 = {
	lib: lib_default$2,
	api: api$19,
	methods: { one: {
		buildNet,
		bulkMatch: sweep,
		bulkTagger: tagger$1
	} }
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/methods/setTag.js
var isMulti = / /;
var addChunk = function(term, tag) {
	if (tag === "Noun") term.chunk = tag;
	if (tag === "Verb") term.chunk = tag;
};
var tagTerm = function(term, tag, tagSet, isSafe) {
	if (term.tags.has(tag) === true) return null;
	if (tag === ".") return null;
	if (term.frozen === true) isSafe = true;
	const known = tagSet[tag];
	if (known) {
		if (known.not && known.not.length > 0) for (let o = 0; o < known.not.length; o += 1) {
			if (isSafe === true && term.tags.has(known.not[o])) return null;
			term.tags.delete(known.not[o]);
		}
		if (known.parents && known.parents.length > 0) for (let o = 0; o < known.parents.length; o += 1) {
			term.tags.add(known.parents[o]);
			addChunk(term, known.parents[o]);
		}
	}
	term.tags.add(tag);
	term.dirty = true;
	addChunk(term, tag);
	return true;
};
var multiTag = function(terms, tagString, tagSet, isSafe) {
	const tags = tagString.split(isMulti);
	terms.forEach((term, i) => {
		let tag = tags[i];
		if (tag) {
			tag = tag.replace(/^#/, "");
			tagTerm(term, tag, tagSet, isSafe);
		}
	});
};
var isArray$3 = function(arr) {
	return Object.prototype.toString.call(arr) === "[object Array]";
};
var log$1 = (terms, tag, reason = "") => {
	const yellow = (str) => "\x1B[33m\x1B[3m" + str + "\x1B[0m";
	const i = (str) => "\x1B[3m" + str + "\x1B[0m";
	const word = terms.map((t) => {
		return t.text || "[" + t.implicit + "]";
	}).join(" ");
	if (typeof tag !== "string" && tag.length > 2) tag = tag.slice(0, 2).join(", #") + " +";
	tag = typeof tag !== "string" ? tag.join(", #") : tag;
	console.log(` ${yellow(word).padEnd(24)} \x1b[32m→\x1b[0m #${tag.padEnd(22)}  ${i(reason)}`);
};
var setTag = function(terms, tag, world = {}, isSafe, reason) {
	const tagSet = world.model.one.tagSet || {};
	if (!tag) return;
	const env = typeof process === "undefined" || !process.env ? self.env || {} : process.env;
	if (env && env.DEBUG_TAGS) log$1(terms, tag, reason);
	if (isArray$3(tag) === true) {
		tag.forEach((tg) => setTag(terms, tg, world, isSafe));
		return;
	}
	if (typeof tag !== "string") {
		console.warn(`compromise: Invalid tag '${tag}'`);
		return;
	}
	tag = tag.trim();
	if (isMulti.test(tag)) {
		multiTag(terms, tag, tagSet, isSafe);
		return;
	}
	tag = tag.replace(/^#/, "");
	for (let i = 0; i < terms.length; i += 1) tagTerm(terms[i], tag, tagSet, isSafe);
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/methods/unTag.js
var unTag = function(terms, tag, tagSet) {
	tag = tag.trim().replace(/^#/, "");
	for (let i = 0; i < terms.length; i += 1) {
		const term = terms[i];
		if (term.frozen === true) continue;
		if (tag === "*") {
			term.tags.clear();
			continue;
		}
		const known = tagSet[tag];
		if (known && known.children.length > 0) for (let o = 0; o < known.children.length; o += 1) term.tags.delete(known.children[o]);
		term.tags.delete(tag);
	}
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/methods/canBe.js
var canBe = function(term, tag, tagSet) {
	if (!tagSet.hasOwnProperty(tag)) return true;
	const not = tagSet[tag].not || [];
	for (let i = 0; i < not.length; i += 1) if (term.tags.has(not[i])) return false;
	return true;
};
//#endregion
//#region node_modules/grad-school/builds/grad-school.mjs
var e = function(e) {
	return e.children = e.children || [], e._cache = e._cache || {}, e.props = e.props || {}, e._cache.parents = e._cache.parents || [], e._cache.children = e._cache.children || [], e;
}, t = /^ *(#|\/\/)/, n$1 = function(t) {
	let n = t.trim().split(/->/), r = [];
	n.forEach(((t) => {
		r = r.concat(function(t) {
			if (!(t = t.trim())) return null;
			if (/^\[/.test(t) && /\]$/.test(t)) {
				let n = (t = (t = t.replace(/^\[/, "")).replace(/\]$/, "")).split(/,/);
				return n = n.map(((e) => e.trim())).filter(((e) => e)), n = n.map(((t) => e({ id: t }))), n;
			}
			return [e({ id: t })];
		}(t));
	})), r = r.filter(((e) => e));
	let i = r[0];
	for (let e = 1; e < r.length; e += 1) i.children.push(r[e]), i = r[e];
	return r[0];
}, r = (e, t) => {
	let n = [], r = [e];
	for (; r.length > 0;) {
		let e = r.pop();
		n.push(e), e.children && e.children.forEach(((n) => {
			t && t(e, n), r.push(n);
		}));
	}
	return n;
}, i = (e) => "[object Array]" === Object.prototype.toString.call(e), c = (e) => (e = e || "").trim(), s = function(c = []) {
	return "string" == typeof c ? function(r) {
		let i = r.split(/\r?\n/), c = [];
		i.forEach(((e) => {
			if (!e.trim() || t.test(e)) return;
			let r = ((e) => {
				const t = /^( {2}|\t)/;
				let n = 0;
				for (; t.test(e);) e = e.replace(t, ""), n += 1;
				return n;
			})(e);
			c.push({
				indent: r,
				node: n$1(e)
			});
		}));
		let s = function(e) {
			let t = { children: [] };
			return e.forEach(((n, r) => {
				0 === n.indent ? t.children = t.children.concat(n.node) : e[r - 1] && function(e, t) {
					let n = e[t].indent;
					for (; t >= 0; t -= 1) if (e[t].indent < n) return e[t];
					return e[0];
				}(e, r).node.children.push(n.node);
			})), t;
		}(c);
		return s = e(s), s;
	}(c) : i(c) ? function(t) {
		let n = {};
		t.forEach(((e) => {
			n[e.id] = e;
		}));
		let r = e({});
		return t.forEach(((t) => {
			if ((t = e(t)).parent) if (n.hasOwnProperty(t.parent)) {
				let e = n[t.parent];
				delete t.parent, e.children.push(t);
			} else console.warn(`[Grad] - missing node '${t.parent}'`);
			else r.children.push(t);
		})), r;
	}(c) : (r(s = c).forEach(e), s);
	var s;
}, h = (e) => "\x1B[31m" + e + "\x1B[0m", o = (e) => "\x1B[2m" + e + "\x1B[0m", l = function(e, t) {
	let n = "-> ";
	t && (n = o("→ "));
	let i = "";
	return r(e).forEach(((e, r) => {
		let c = e.id || "";
		if (t && (c = h(c)), 0 === r && !e.id) return;
		let s = e._cache.parents.length;
		i += "    ".repeat(s) + n + c + "\n";
	})), i;
}, a = function(e) {
	let t = r(e);
	t.forEach(((e) => {
		delete (e = Object.assign({}, e)).children;
	}));
	let n = t[0];
	return n && !n.id && 0 === Object.keys(n.props).length && t.shift(), t;
}, p$2 = {
	text: l,
	txt: l,
	array: a,
	flat: a
}, d = function(e, t) {
	return "nested" === t || "json" === t ? e : "debug" === t ? (console.log(l(e, !0)), null) : p$2.hasOwnProperty(t) ? p$2[t](e) : e;
}, u = (e) => {
	r(e, ((e, t) => {
		e.id && (e._cache.parents = e._cache.parents || [], t._cache.parents = e._cache.parents.concat([e.id]));
	}));
}, f$1 = (e, t) => (Object.keys(t).forEach(((n) => {
	if (t[n] instanceof Set) {
		let r = e[n] || /* @__PURE__ */ new Set();
		e[n] = /* @__PURE__ */ new Set([...r, ...t[n]]);
	} else if (((e) => e && "object" == typeof e && !Array.isArray(e))(t[n])) {
		let r = e[n] || {};
		e[n] = Object.assign({}, t[n], r);
	} else i(t[n]) ? e[n] = t[n].concat(e[n] || []) : void 0 === e[n] && (e[n] = t[n]);
})), e), j = /\//;
var g$2 = class g$2 {
	constructor(e = {}) {
		Object.defineProperty(this, "json", {
			enumerable: !1,
			value: e,
			writable: !0
		});
	}
	get children() {
		return this.json.children;
	}
	get id() {
		return this.json.id;
	}
	get found() {
		return this.json.id || this.json.children.length > 0;
	}
	props(e = {}) {
		let t = this.json.props || {};
		return "string" == typeof e && (t[e] = !0), this.json.props = Object.assign(t, e), this;
	}
	get(t) {
		if (t = c(t), !j.test(t)) {
			let e = this.json.children.find(((e) => e.id === t));
			return new g$2(e);
		}
		let n = ((e, t) => {
			let n = ((e) => "string" != typeof e ? e : (e = e.replace(/^\//, "")).split(/\//))(t = t || "");
			for (let t = 0; t < n.length; t += 1) {
				let r = e.children.find(((e) => e.id === n[t]));
				if (!r) return null;
				e = r;
			}
			return e;
		})(this.json, t) || e({});
		return new g$2(n);
	}
	add(t, n = {}) {
		if (i(t)) return t.forEach(((e) => this.add(c(e), n))), this;
		t = c(t);
		let r = e({
			id: t,
			props: n
		});
		return this.json.children.push(r), new g$2(r);
	}
	remove(e) {
		return e = c(e), this.json.children = this.json.children.filter(((t) => t.id !== e)), this;
	}
	nodes() {
		return r(this.json).map(((e) => (delete (e = Object.assign({}, e)).children, e)));
	}
	cache() {
		return ((e) => {
			let t = r(e, ((e, t) => {
				e.id && (e._cache.parents = e._cache.parents || [], e._cache.children = e._cache.children || [], t._cache.parents = e._cache.parents.concat([e.id]));
			})), n = {};
			t.forEach(((e) => {
				e.id && (n[e.id] = e);
			})), t.forEach(((e) => {
				e._cache.parents.forEach(((t) => {
					n.hasOwnProperty(t) && n[t]._cache.children.push(e.id);
				}));
			})), e._cache.children = Object.keys(n);
		})(this.json), this;
	}
	list() {
		return r(this.json);
	}
	fillDown() {
		var e;
		return e = this.json, r(e, ((e, t) => {
			t.props = f$1(t.props, e.props);
		})), this;
	}
	depth() {
		u(this.json);
		let e = r(this.json), t = e.length > 1 ? 1 : 0;
		return e.forEach(((e) => {
			if (0 === e._cache.parents.length) return;
			let n = e._cache.parents.length + 1;
			n > t && (t = n);
		})), t;
	}
	out(e) {
		return u(this.json), d(this.json, e);
	}
	debug() {
		return u(this.json), d(this.json, "debug"), this;
	}
};
var _ = function(e) {
	return new g$2(s(e));
};
_.prototype.plugin = function(e) {
	e(this);
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/methods/addTags/_colors.js
var colors = {
	Noun: "blue",
	Verb: "green",
	Negative: "green",
	Date: "red",
	Value: "red",
	Adjective: "magenta",
	Preposition: "cyan",
	Conjunction: "cyan",
	Determiner: "cyan",
	Hyphenated: "cyan",
	Adverb: "cyan"
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/methods/addTags/02-fmt.js
var getColor = function(node) {
	if (colors.hasOwnProperty(node.id)) return colors[node.id];
	if (colors.hasOwnProperty(node.is)) return colors[node.is];
	return colors[node._cache.parents.find((c) => colors[c])];
};
var fmt = function(nodes) {
	const res = {};
	nodes.forEach((node) => {
		const { not, also, is, novel } = node.props;
		let parents = node._cache.parents;
		if (also) parents = parents.concat(also);
		res[node.id] = {
			is,
			not,
			novel,
			also,
			parents,
			children: node._cache.children,
			color: getColor(node)
		};
	});
	Object.keys(res).forEach((k) => {
		const nots = new Set(res[k].not);
		res[k].not.forEach((not) => {
			if (res[not]) res[not].children.forEach((tag) => nots.add(tag));
		});
		res[k].not = Array.from(nots);
	});
	return res;
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/methods/addTags/01-validate.js
var toArr = function(input) {
	if (!input) return [];
	if (typeof input === "string") return [input];
	return input;
};
var addImplied = function(tags, already) {
	Object.keys(tags).forEach((k) => {
		if (tags[k].isA) tags[k].is = tags[k].isA;
		if (tags[k].notA) tags[k].not = tags[k].notA;
		if (tags[k].is && typeof tags[k].is === "string") {
			if (!already.hasOwnProperty(tags[k].is) && !tags.hasOwnProperty(tags[k].is)) tags[tags[k].is] = {};
		}
		if (tags[k].not && typeof tags[k].not === "string" && !tags.hasOwnProperty(tags[k].not)) {
			if (!already.hasOwnProperty(tags[k].not) && !tags.hasOwnProperty(tags[k].not)) tags[tags[k].not] = {};
		}
	});
	return tags;
};
var validate = function(tags, already) {
	tags = addImplied(tags, already);
	Object.keys(tags).forEach((k) => {
		tags[k].children = toArr(tags[k].children);
		tags[k].not = toArr(tags[k].not);
	});
	Object.keys(tags).forEach((k) => {
		(tags[k].not || []).forEach((no) => {
			if (tags[no] && tags[no].not) tags[no].not.push(k);
		});
	});
	return tags;
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/methods/addTags/index.js
var compute = function(allTags) {
	return _(Object.keys(allTags).map((k) => {
		const o = allTags[k];
		const props = {
			not: new Set(o.not),
			also: o.also,
			is: o.is,
			novel: o.novel
		};
		return {
			id: k,
			parent: o.is,
			props,
			children: []
		};
	})).cache().fillDown().out("array");
};
var fromUser = function(tags) {
	Object.keys(tags).forEach((k) => {
		tags[k] = Object.assign({}, tags[k]);
		tags[k].novel = true;
	});
	return tags;
};
var addTags$1 = function(tags, already) {
	if (Object.keys(already).length > 0) tags = fromUser(tags);
	tags = validate(tags, already);
	return fmt(compute(Object.assign({}, already, tags)));
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/methods/index.js
var methods_default$3 = { one: {
	setTag,
	unTag,
	addTags: addTags$1,
	canBe
} };
//#endregion
//#region node_modules/compromise/src/1-one/tag/api/tag.js
var isArray$2 = function(arr) {
	return Object.prototype.toString.call(arr) === "[object Array]";
};
var fns$1 = {
	/** add a given tag, to all these terms */
	tag: function(input, reason = "", isSafe) {
		if (!this.found || !input) return this;
		const terms = this.termList();
		if (terms.length === 0) return this;
		const { methods, verbose, world } = this;
		if (verbose === true) console.log(" +  ", input, reason || "");
		if (isArray$2(input)) input.forEach((tag) => methods.one.setTag(terms, tag, world, isSafe, reason));
		else methods.one.setTag(terms, input, world, isSafe, reason);
		this.uncache();
		return this;
	},
	/** add a given tag, only if it is consistent */
	tagSafe: function(input, reason = "") {
		return this.tag(input, reason, true);
	},
	/** remove a given tag from all these terms */
	unTag: function(input, reason) {
		if (!this.found || !input) return this;
		const terms = this.termList();
		if (terms.length === 0) return this;
		const { methods, verbose, model } = this;
		if (verbose === true) console.log(" -  ", input, reason || "");
		const tagSet = model.one.tagSet;
		if (isArray$2(input)) input.forEach((tag) => methods.one.unTag(terms, tag, tagSet));
		else methods.one.unTag(terms, input, tagSet);
		this.uncache();
		return this;
	},
	/** return only the terms that can be this tag  */
	canBe: function(tag) {
		tag = tag.replace(/^#/, "");
		const tagSet = this.model.one.tagSet;
		const canBe = this.methods.one.canBe;
		const nope = [];
		this.document.forEach((terms, n) => {
			terms.forEach((term, i) => {
				if (!canBe(term, tag, tagSet)) nope.push([
					n,
					i,
					i + 1
				]);
			});
		});
		const noDoc = this.update(nope);
		return this.difference(noDoc);
	}
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/api/index.js
var tagAPI = function(View) {
	Object.assign(View.prototype, fns$1);
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/lib.js
var addTags = function(tags) {
	const { model, methods } = this.world();
	const tagSet = model.one.tagSet;
	const fn = methods.one.addTags;
	const res = fn(tags, tagSet);
	model.one.tagSet = res;
	return this;
};
var lib_default$1 = { addTags };
//#endregion
//#region node_modules/compromise/src/1-one/tag/compute/tagRank.js
var boringTags = /* @__PURE__ */ new Set(["Auxiliary", "Possessive"]);
var sortByKids = function(tags, tagSet) {
	tags = tags.sort((a, b) => {
		if (boringTags.has(a) || !tagSet.hasOwnProperty(b)) return 1;
		if (boringTags.has(b) || !tagSet.hasOwnProperty(a)) return -1;
		let kids = tagSet[a].children || [];
		const aKids = kids.length;
		kids = tagSet[b].children || [];
		return aKids - kids.length;
	});
	return tags;
};
var tagRank = function(view) {
	const { document, world } = view;
	const tagSet = world.model.one.tagSet;
	document.forEach((terms) => {
		terms.forEach((term) => {
			term.tagRank = sortByKids(Array.from(term.tags), tagSet);
		});
	});
};
//#endregion
//#region node_modules/compromise/src/1-one/tag/plugin.js
var plugin_default$17 = {
	model: { one: { tagSet: {} } },
	compute: { tagRank },
	methods: methods_default$3,
	api: tagAPI,
	lib: lib_default$1
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/01-sentences/01-simple-split.js
var initSplit = /([.!?\u203D\u2E18\u203C\u2047-\u2049\u3002]+\s)/g;
var splitsOnly = /^[.!?\u203D\u2E18\u203C\u2047-\u2049\u3002]+\s$/;
var newLine = /((?:\r?\n|\r)+)/;
var basicSplit = function(text) {
	const all = [];
	const lines = text.split(newLine);
	for (let i = 0; i < lines.length; i++) {
		const arr = lines[i].split(initSplit);
		for (let o = 0; o < arr.length; o++) {
			if (arr[o + 1] && splitsOnly.test(arr[o + 1]) === true) {
				arr[o] += arr[o + 1];
				arr[o + 1] = "";
			}
			if (arr[o] !== "") all.push(arr[o]);
		}
	}
	return all;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/01-sentences/02-simple-merge.js
var hasLetter$1 = /[a-z0-9\u00C0-\u00FF\u00a9\u00ae\u2000-\u3300\ud000-\udfff]/i;
var hasSomething$1 = /\S/;
var notEmpty = function(splits) {
	const chunks = [];
	for (let i = 0; i < splits.length; i++) {
		const s = splits[i];
		if (s === void 0 || s === "") continue;
		if (hasSomething$1.test(s) === false || hasLetter$1.test(s) === false) {
			if (chunks[chunks.length - 1]) {
				chunks[chunks.length - 1] += s;
				continue;
			} else if (splits[i + 1]) {
				splits[i + 1] = s + splits[i + 1];
				continue;
			}
		}
		chunks.push(s);
	}
	return chunks;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/01-sentences/03-smart-merge.js
var hasNewline = function(c) {
	return Boolean(c.match(/\n$/));
};
var smartMerge = function(chunks, world) {
	const isSentence = world.methods.one.tokenize.isSentence;
	const abbrevs = world.model.one.abbreviations || /* @__PURE__ */ new Set();
	const sentences = [];
	for (let i = 0; i < chunks.length; i++) {
		const c = chunks[i];
		if (chunks[i + 1] && !isSentence(c, abbrevs) && !hasNewline(c)) chunks[i + 1] = c + (chunks[i + 1] || "");
		else if (c && c.length > 0) {
			sentences.push(c);
			chunks[i] = "";
		}
	}
	return sentences;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/01-sentences/04-quote-merge.js
var MAX_QUOTE = 280;
var pairs$1 = {
	"\"": "\"",
	"＂": "＂",
	"“": "”",
	"‟": "”",
	"„": "”",
	"⹂": "”",
	"‚": "’",
	"«": "»",
	"‹": "›",
	"‵": "′",
	"‶": "″",
	"‷": "‴",
	"〝": "〞",
	"〟": "〞"
};
var openQuote = RegExp("[" + Object.keys(pairs$1).join("") + "]", "g");
var closeQuote = RegExp("[" + Object.values(pairs$1).join("") + "]", "g");
var closesQuote = function(str) {
	if (!str) return false;
	const m = str.match(closeQuote);
	if (m !== null && m.length === 1) return true;
	return false;
};
var quoteMerge = function(splits) {
	const arr = [];
	for (let i = 0; i < splits.length; i += 1) {
		const m = splits[i].match(openQuote);
		if (m !== null && m.length === 1) {
			if (closesQuote(splits[i + 1]) && splits[i + 1].length < MAX_QUOTE) {
				splits[i] += splits[i + 1];
				arr.push(splits[i]);
				splits[i + 1] = "";
				i += 1;
				continue;
			}
			if (closesQuote(splits[i + 2])) {
				const toAdd = splits[i + 1] + splits[i + 2];
				if (toAdd.length < MAX_QUOTE) {
					splits[i] += toAdd;
					arr.push(splits[i]);
					splits[i + 1] = "";
					splits[i + 2] = "";
					i += 2;
					continue;
				}
			}
		}
		arr.push(splits[i]);
	}
	return arr;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/01-sentences/05-parens-merge.js
var MAX_LEN = 250;
var hasOpen$2 = /\(/g;
var hasClosed$2 = /\)/g;
var mergeParens = function(splits) {
	const arr = [];
	for (let i = 0; i < splits.length; i += 1) {
		const m = splits[i].match(hasOpen$2);
		if (m !== null && m.length === 1) {
			if (splits[i + 1] && splits[i + 1].length < MAX_LEN) {
				if (splits[i + 1].match(hasClosed$2) !== null && m.length === 1 && !hasOpen$2.test(splits[i + 1])) {
					splits[i] += splits[i + 1];
					arr.push(splits[i]);
					splits[i + 1] = "";
					i += 1;
					continue;
				}
			}
		}
		arr.push(splits[i]);
	}
	return arr;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/01-sentences/index.js
var hasSomething = /\S/;
var startWhitespace = /^\s+/;
var splitSentences = function(text, world) {
	text = text || "";
	text = String(text);
	if (!text || typeof text !== "string" || hasSomething.test(text) === false) return [];
	text = text.replace("\xA0", " ");
	let sentences = notEmpty(basicSplit(text));
	sentences = smartMerge(sentences, world);
	sentences = quoteMerge(sentences);
	sentences = mergeParens(sentences);
	if (sentences.length === 0) return [text];
	for (let i = 1; i < sentences.length; i += 1) {
		const ws = sentences[i].match(startWhitespace);
		if (ws !== null) {
			sentences[i - 1] += ws[0];
			sentences[i] = sentences[i].replace(startWhitespace, "");
		}
	}
	return sentences;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/02-terms/01-hyphens.js
var hasHyphen = function(str, model) {
	const parts = str.split(/[-–—]/);
	if (parts.length <= 1) return false;
	const { prefixes, suffixes } = model.one;
	if (parts[0].length === 1 && /[a-z]/i.test(parts[0])) return false;
	if (prefixes.hasOwnProperty(parts[0])) return false;
	parts[1] = parts[1].trim().replace(/[.?!]$/, "");
	if (suffixes.hasOwnProperty(parts[1])) return false;
	if (/^([a-z\u00C0-\u00FF`"'/]+)[-–—]([a-z0-9\u00C0-\u00FF].*)/i.test(str) === true) return true;
	if (/^[('"]?([0-9]{1,4})[-–—]([a-z\u00C0-\u00FF`"'/-]+[)'"]?$)/i.test(str) === true) return true;
	return false;
};
var splitHyphens = function(word) {
	const arr = [];
	const hyphens = word.split(/[-–—]/);
	let whichDash = "-";
	const found = word.match(/[-–—]/);
	if (found && found[0]) whichDash = found;
	for (let o = 0; o < hyphens.length; o++) if (o === hyphens.length - 1) arr.push(hyphens[o]);
	else arr.push(hyphens[o] + whichDash);
	return arr;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/02-terms/03-ranges.js
var combineRanges = function(arr) {
	const startRange = /^[0-9]{1,4}(:[0-9][0-9])?([a-z]{1,2})? ?[-–—] ?$/;
	const endRange = /^[0-9]{1,4}([a-z]{1,2})? ?$/;
	for (let i = 0; i < arr.length - 1; i += 1) if (arr[i + 1] && startRange.test(arr[i]) && endRange.test(arr[i + 1])) {
		arr[i] = arr[i] + arr[i + 1];
		arr[i + 1] = null;
	}
	return arr;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/02-terms/02-slashes.js
var isSlash = /\p{L} ?\/ ?\p{L}+$/u;
var combineSlashes = function(arr) {
	for (let i = 1; i < arr.length - 1; i++) if (isSlash.test(arr[i])) {
		arr[i - 1] += arr[i] + arr[i + 1];
		arr[i] = null;
		arr[i + 1] = null;
	}
	return arr;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/02-terms/index.js
var wordlike = /\S/;
var isBoundary = /^[!?.]+$/;
var naiiveSplit = /(\S+)/;
var notWord = [
	".",
	"?",
	"!",
	":",
	";",
	"-",
	"–",
	"—",
	"--",
	"...",
	"(",
	")",
	"[",
	"]",
	"\"",
	"'",
	"`",
	"«",
	"»",
	"*",
	"•"
];
notWord = notWord.reduce((h, c) => {
	h[c] = true;
	return h;
}, {});
var isArray$1 = function(arr) {
	return Object.prototype.toString.call(arr) === "[object Array]";
};
var splitWords = function(str, model) {
	let result = [];
	let arr = [];
	str = str || "";
	if (typeof str === "number") str = String(str);
	if (isArray$1(str)) return str;
	const words = str.split(naiiveSplit);
	for (let i = 0; i < words.length; i++) {
		if (hasHyphen(words[i], model) === true) {
			arr = arr.concat(splitHyphens(words[i]));
			continue;
		}
		arr.push(words[i]);
	}
	let carry = "";
	for (let i = 0; i < arr.length; i++) {
		const word = arr[i];
		if (wordlike.test(word) === true && notWord.hasOwnProperty(word) === false && isBoundary.test(word) === false) {
			if (result.length > 0) {
				result[result.length - 1] += carry;
				result.push(word);
			} else result.push(carry + word);
			carry = "";
		} else carry += word;
	}
	if (carry) {
		if (result.length === 0) result[0] = "";
		result[result.length - 1] += carry;
	}
	result = combineSlashes(result);
	result = combineRanges(result);
	result = result.filter((s) => s);
	return result;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/03-whitespace/tokenize.js
var isLetter = /\p{Letter}/u;
var isNumber = /[\p{Number}\p{Currency_Symbol}]/u;
var hasAcronym = /^[a-z]\.([a-z]\.)+/i;
var chillin = /[sn]['’]$/;
var normalizePunctuation = function(str, model) {
	const { prePunctuation, postPunctuation, emoticons } = model.one;
	let original = str;
	let pre = "";
	let post = "";
	const chars = Array.from(str);
	if (emoticons.hasOwnProperty(str.trim())) return {
		str: str.trim(),
		pre,
		post: " "
	};
	let len = chars.length;
	for (let i = 0; i < len; i += 1) {
		const c = chars[0];
		if (prePunctuation[c] === true) continue;
		if ((c === "+" || c === "-") && isNumber.test(chars[1])) break;
		if (c === "'" && c.length === 3 && isNumber.test(chars[1])) break;
		if (isLetter.test(c) || isNumber.test(c)) break;
		pre += chars.shift();
	}
	len = chars.length;
	for (let i = 0; i < len; i += 1) {
		const c = chars[chars.length - 1];
		if (postPunctuation[c] === true) continue;
		if (isLetter.test(c) || isNumber.test(c)) break;
		if (c === "." && hasAcronym.test(original) === true) continue;
		if (c === "'" && chillin.test(original) === true) continue;
		post = chars.pop() + post;
	}
	str = chars.join("");
	if (str === "") {
		original = original.replace(/ *$/, (after) => {
			post = after || "";
			return "";
		});
		str = original;
		pre = "";
	}
	return {
		str,
		pre,
		post
	};
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/03-whitespace/index.js
var parseTerm = (txt, model) => {
	const { str, pre, post } = normalizePunctuation(txt, model);
	return {
		text: str,
		pre,
		post,
		tags: /* @__PURE__ */ new Set()
	};
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/unicode.js
var killUnicode = function(str, world) {
	const unicode = world.model.one.unicode || {};
	str = str || "";
	const chars = str.split("");
	chars.forEach((s, i) => {
		if (unicode[s]) chars[i] = unicode[s];
	});
	return chars.join("");
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/compute/normal/01-cleanup.js
/** some basic operations on a string to reduce noise */
var clean = function(str) {
	str = str || "";
	str = str.toLowerCase();
	str = str.trim();
	const original = str;
	str = str.replace(/[,;.!?]+$/, "");
	str = str.replace(/\u2026/g, "...");
	str = str.replace(/\u2013/g, "-");
	if (/^[:;]/.test(str) === false) {
		str = str.replace(/\.{3,}$/g, "");
		str = str.replace(/[",.!:;?)]+$/g, "");
		str = str.replace(/^['"(]+/g, "");
	}
	str = str.replace(/[\u200B-\u200D\uFEFF]/g, "");
	str = str.trim();
	if (str === "") str = original;
	str = str.replace(/([0-9]),([0-9])/g, "$1$2");
	return str;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/compute/normal/02-acronyms.js
var periodAcronym$1 = /([A-Z]\.)+[A-Z]?,?$/;
var oneLetterAcronym$1 = /^[A-Z]\.,?$/;
var noPeriodAcronym$1 = /[A-Z]{2,}('s|,)?$/;
var lowerCaseAcronym$1 = /([a-z]\.)+[a-z]\.?$/;
var isAcronym$2 = function(str) {
	if (periodAcronym$1.test(str) === true) return true;
	if (lowerCaseAcronym$1.test(str) === true) return true;
	if (oneLetterAcronym$1.test(str) === true) return true;
	if (noPeriodAcronym$1.test(str) === true) return true;
	return false;
};
var doAcronym = function(str) {
	if (isAcronym$2(str)) str = str.replace(/\./g, "");
	return str;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/compute/normal/index.js
var normalize = function(term, world) {
	const killUnicode = world.methods.one.killUnicode;
	let str = term.text || "";
	str = clean(str);
	str = killUnicode(str, world);
	str = doAcronym(str);
	term.normal = str;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/parse.js
var parse$4 = function(input, world) {
	const { methods, model } = world;
	const { splitSentences, splitTerms, splitWhitespace } = methods.one.tokenize;
	input = input || "";
	input = splitSentences(input, world).map((txt) => {
		let terms = splitTerms(txt, model);
		terms = terms.map((t) => splitWhitespace(t, model));
		terms.forEach((t) => {
			normalize(t, world);
		});
		return terms;
	});
	return input;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/01-sentences/is-sentence.js
var isAcronym$1 = /[ .][A-Z]\.? *$/i;
var hasEllipse = /(?:\u2026|\.{2,}) *$/;
var hasLetter = /\p{L}/u;
var hasPeriod$1 = /\. *$/;
var leadInit = /^[A-Z]\. $/;
/** does this look like a sentence? */
var isSentence = function(str, abbrevs) {
	if (hasLetter.test(str) === false) return false;
	if (isAcronym$1.test(str) === true) return false;
	if (str.length === 3 && leadInit.test(str)) return false;
	if (hasEllipse.test(str) === true) return false;
	const words = str.replace(/[.!?\u203D\u2E18\u203C\u2047-\u2049] *$/, "").split(" ");
	const lastWord = words[words.length - 1].toLowerCase();
	if (abbrevs.hasOwnProperty(lastWord) === true && hasPeriod$1.test(str) === true) return false;
	return true;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/methods/index.js
var methods_default$2 = { one: {
	killUnicode,
	tokenize: {
		splitSentences,
		isSentence,
		splitTerms: splitWords,
		splitWhitespace: parseTerm,
		fromString: parse$4
	}
} };
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/model/aliases.js
var aliases$1 = {
	"&": "and",
	"@": "at",
	"%": "percent",
	"plz": "please",
	"bein": "being"
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/model/lexicon.js
var list$2 = [
	[[
		"approx",
		"apt",
		"bc",
		"cyn",
		"eg",
		"esp",
		"est",
		"etc",
		"ex",
		"exp",
		"prob",
		"pron",
		"gal",
		"min",
		"pseud",
		"fig",
		"jd",
		"lat",
		"lng",
		"vol",
		"fm",
		"def",
		"misc",
		"plz",
		"ea",
		"ps",
		"sec",
		"pt",
		"pref",
		"pl",
		"pp",
		"qt",
		"fr",
		"sq",
		"nee",
		"ss",
		"tel",
		"temp",
		"vet",
		"ver",
		"fem",
		"masc",
		"eng",
		"adj",
		"vb",
		"rb",
		"inf",
		"situ",
		"vivo",
		"vitro",
		"wr"
	]],
	[[
		"dl",
		"ml",
		"gal",
		"qt",
		"pt",
		"tbl",
		"tsp",
		"tbsp",
		"km",
		"dm",
		"cm",
		"mm",
		"mi",
		"td",
		"hr",
		"hrs",
		"kg",
		"hg",
		"dg",
		"cg",
		"mg",
		"µg",
		"lb",
		"oz",
		"sq ft",
		"hz",
		"mps",
		"mph",
		"kmph",
		"kb",
		"mb",
		"tb",
		"lx",
		"lm",
		"fl oz",
		"yb"
	], "Unit"],
	[[
		"ad",
		"al",
		"arc",
		"ba",
		"bl",
		"ca",
		"cca",
		"col",
		"corp",
		"ft",
		"fy",
		"ie",
		"lit",
		"ma",
		"md",
		"pd",
		"tce"
	], "Noun"],
	[[
		"adj",
		"adm",
		"adv",
		"asst",
		"atty",
		"bldg",
		"brig",
		"capt",
		"cmdr",
		"comdr",
		"cpl",
		"det",
		"dr",
		"esq",
		"gen",
		"gov",
		"hon",
		"jr",
		"llb",
		"lt",
		"maj",
		"messrs",
		"mlle",
		"mme",
		"mr",
		"mrs",
		"ms",
		"mstr",
		"phd",
		"prof",
		"pvt",
		"rep",
		"reps",
		"res",
		"rev",
		"sen",
		"sens",
		"sfc",
		"sgt",
		"sir",
		"sr",
		"supt",
		"surg"
	], "Honorific"],
	[[
		"jan",
		"feb",
		"mar",
		"apr",
		"jun",
		"jul",
		"aug",
		"sep",
		"sept",
		"oct",
		"nov",
		"dec"
	], "Month"],
	[[
		"dept",
		"univ",
		"assn",
		"bros",
		"inc",
		"ltd",
		"co"
	], "Organization"],
	[[
		"rd",
		"st",
		"dist",
		"mt",
		"ave",
		"blvd",
		"cl",
		"cres",
		"hwy",
		"ariz",
		"cal",
		"calif",
		"colo",
		"conn",
		"fla",
		"fl",
		"ga",
		"ida",
		"ia",
		"kan",
		"kans",
		"minn",
		"neb",
		"nebr",
		"okla",
		"penna",
		"penn",
		"pa",
		"dak",
		"tenn",
		"tex",
		"ut",
		"vt",
		"va",
		"wis",
		"wisc",
		"wy",
		"wyo",
		"usafa",
		"alta",
		"ont",
		"que",
		"sask"
	], "Place"]
];
var abbreviations = {};
var lexicon$1 = {};
list$2.forEach((a) => {
	a[0].forEach((w) => {
		abbreviations[w] = true;
		lexicon$1[w] = "Abbreviation";
		if (a[1] !== void 0) lexicon$1[w] = [lexicon$1[w], a[1]];
	});
});
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/model/prefixes.js
var prefixes_default$1 = [
	"anti",
	"bi",
	"co",
	"contra",
	"de",
	"extra",
	"infra",
	"inter",
	"intra",
	"macro",
	"micro",
	"mis",
	"mono",
	"multi",
	"peri",
	"pre",
	"pro",
	"proto",
	"pseudo",
	"re",
	"sub",
	"supra",
	"trans",
	"tri",
	"un",
	"out",
	"ex"
].reduce((h, str) => {
	h[str] = true;
	return h;
}, {});
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/model/suffixes.js
var suffixes_default$1 = {
	"like": true,
	"ish": true,
	"less": true,
	"able": true,
	"elect": true,
	"type": true,
	"designate": true
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/model/unicode.js
var compact = {
	"!": "¡",
	"?": "¿Ɂ",
	"\"": "“”\"❝❞",
	"'": "‘‛❛❜’",
	"-": "—–",
	a: "ªÀÁÂÃÄÅàáâãäåĀāĂăĄąǍǎǞǟǠǡǺǻȀȁȂȃȦȧȺΆΑΔΛάαλАаѦѧӐӑӒӓƛæ",
	b: "ßþƀƁƂƃƄƅɃΒβϐϦБВЪЬвъьѢѣҌҍ",
	c: "¢©ÇçĆćĈĉĊċČčƆƇƈȻȼͻͼϲϹϽϾСсєҀҁҪҫ",
	d: "ÐĎďĐđƉƊȡƋƌ",
	e: "ÈÉÊËèéêëĒēĔĕĖėĘęĚěƐȄȅȆȇȨȩɆɇΈΕΞΣέεξϵЀЁЕеѐёҼҽҾҿӖӗễ",
	f: "ƑƒϜϝӺӻҒғſ",
	g: "ĜĝĞğĠġĢģƓǤǥǦǧǴǵ",
	h: "ĤĥĦħƕǶȞȟΉΗЂЊЋНнђћҢңҤҥҺһӉӊ",
	I: "ÌÍÎÏ",
	i: "ìíîïĨĩĪīĬĭĮįİıƖƗȈȉȊȋΊΐΪίιϊІЇіїi̇",
	j: "ĴĵǰȷɈɉϳЈј",
	k: "ĶķĸƘƙǨǩΚκЌЖКжкќҚқҜҝҞҟҠҡ",
	l: "ĹĺĻļĽľĿŀŁłƚƪǀǏǐȴȽΙӀӏ",
	m: "ΜϺϻМмӍӎ",
	n: "ÑñŃńŅņŇňŉŊŋƝƞǸǹȠȵΝΠήηϞЍИЙЛПийлпѝҊҋӅӆӢӣӤӥπ",
	o: "ÒÓÔÕÖØðòóôõöøŌōŎŏŐőƟƠơǑǒǪǫǬǭǾǿȌȍȎȏȪȫȬȭȮȯȰȱΌΘΟθοσόϕϘϙϬϴОФоѲѳӦӧӨөӪӫ",
	p: "ƤΡρϷϸϼРрҎҏÞ",
	q: "Ɋɋ",
	r: "ŔŕŖŗŘřƦȐȑȒȓɌɍЃГЯгяѓҐґ",
	s: "ŚśŜŝŞşŠšƧƨȘșȿЅѕ",
	t: "ŢţŤťŦŧƫƬƭƮȚțȶȾΓΤτϮТт",
	u: "ÙÚÛÜùúûüŨũŪūŬŭŮůŰűŲųƯưƱƲǓǔǕǖǗǘǙǚǛǜȔȕȖȗɄΰυϋύ",
	v: "νѴѵѶѷ",
	w: "ŴŵƜωώϖϢϣШЩшщѡѿ",
	x: "×ΧχϗϰХхҲҳӼӽӾӿ",
	y: "ÝýÿŶŷŸƳƴȲȳɎɏΎΥΫγψϒϓϔЎУучўѰѱҮүҰұӮӯӰӱӲӳ",
	z: "ŹźŻżŽžƵƶȤȥɀΖ"
};
var unicode = {};
Object.keys(compact).forEach(function(k) {
	compact[k].split("").forEach(function(s) {
		unicode[s] = k;
	});
});
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/model/index.js
var model_default$2 = { one: {
	aliases: aliases$1,
	abbreviations,
	prefixes: prefixes_default$1,
	suffixes: suffixes_default$1,
	prePunctuation: {
		"#": true,
		"@": true,
		"_": true,
		"°": true,
		"​": true,
		"‌": true,
		"‍": true,
		"﻿": true
	},
	postPunctuation: {
		"%": true,
		"_": true,
		"°": true,
		"​": true,
		"‌": true,
		"‍": true,
		"﻿": true
	},
	lexicon: lexicon$1,
	unicode,
	emoticons: {
		"<3": true,
		"</3": true,
		"<\\3": true,
		":^P": true,
		":^p": true,
		":^O": true,
		":^3": true
	}
} };
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/compute/alias.js
var hasSlash$1 = /\//;
var hasDomain = /[a-z]\.[a-z]/i;
var isMath = /[0-9]/;
var addAliases = function(term, world) {
	const str = term.normal || term.text || term.machine;
	const aliases = world.model.one.aliases;
	if (aliases.hasOwnProperty(str)) {
		term.alias = term.alias || [];
		term.alias.push(aliases[str]);
	}
	if (hasSlash$1.test(str) && !hasDomain.test(str) && !isMath.test(str)) {
		const arr = str.split(hasSlash$1);
		if (arr.length <= 3) arr.forEach((word) => {
			word = word.trim();
			if (word !== "") {
				term.alias = term.alias || [];
				term.alias.push(word);
			}
		});
	}
	return term;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/compute/machine.js
var hasDash = /^\p{Letter}+-\p{Letter}+$/u;
var doMachine = function(term) {
	let str = term.implicit || term.normal || term.text;
	str = str.replace(/['’]s$/, "");
	str = str.replace(/s['’]$/, "s");
	str = str.replace(/([aeiou][ktrp])in'$/, "$1ing");
	if (hasDash.test(str)) str = str.replace(/-/g, "");
	str = str.replace(/^[#@]/, "");
	if (str !== term.normal) term.machine = str;
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/compute/freq.js
var freq = function(view) {
	const docs = view.docs;
	const counts = {};
	for (let i = 0; i < docs.length; i += 1) for (let t = 0; t < docs[i].length; t += 1) {
		const term = docs[i][t];
		const word = term.machine || term.normal;
		counts[word] = counts[word] || 0;
		counts[word] += 1;
	}
	for (let i = 0; i < docs.length; i += 1) for (let t = 0; t < docs[i].length; t += 1) {
		const term = docs[i][t];
		term.freq = counts[term.machine || term.normal];
	}
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/compute/offset.js
var offset = function(view) {
	let elapsed = 0;
	let index = 0;
	const docs = view.document;
	for (let i = 0; i < docs.length; i += 1) for (let t = 0; t < docs[i].length; t += 1) {
		const term = docs[i][t];
		term.offset = {
			index,
			start: elapsed + term.pre.length,
			length: term.text.length
		};
		elapsed += term.pre.length + term.text.length + term.post.length;
		index += 1;
	}
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/compute/reindex.js
var index = function(view) {
	const document = view.document;
	for (let n = 0; n < document.length; n += 1) for (let i = 0; i < document[n].length; i += 1) document[n][i].index = [n, i];
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/compute/wordCount.js
var wordCount = function(view) {
	let n = 0;
	const docs = view.docs;
	for (let i = 0; i < docs.length; i += 1) for (let t = 0; t < docs[i].length; t += 1) {
		if (docs[i][t].normal === "") continue;
		n += 1;
		docs[i][t].wordCount = n;
	}
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/compute/index.js
var termLoop$1 = function(view, fn) {
	const docs = view.docs;
	for (let i = 0; i < docs.length; i += 1) for (let t = 0; t < docs[i].length; t += 1) fn(docs[i][t], view.world);
};
//#endregion
//#region node_modules/compromise/src/1-one/tokenize/plugin.js
var plugin_default$16 = {
	compute: {
		alias: (view) => termLoop$1(view, addAliases),
		machine: (view) => termLoop$1(view, doMachine),
		normal: (view) => termLoop$1(view, normalize),
		freq,
		offset,
		index,
		wordCount
	},
	methods: methods_default$2,
	model: model_default$2,
	hooks: [
		"alias",
		"machine",
		"index",
		"id"
	]
};
//#endregion
//#region node_modules/compromise/src/1-one/typeahead/compute.js
var typeahead = function(view) {
	const prefixes = view.model.one.typeahead;
	const docs = view.docs;
	if (docs.length === 0 || Object.keys(prefixes).length === 0) return;
	const lastPhrase = docs[docs.length - 1] || [];
	const lastTerm = lastPhrase[lastPhrase.length - 1];
	if (lastTerm.post) return;
	if (prefixes.hasOwnProperty(lastTerm.normal)) {
		const found = prefixes[lastTerm.normal];
		lastTerm.implicit = found;
		lastTerm.machine = found;
		lastTerm.typeahead = true;
		if (view.compute.preTagger) view.last().unTag("*").compute(["lexicon", "preTagger"]);
	}
};
var compute_default$4 = { typeahead };
//#endregion
//#region node_modules/compromise/src/1-one/typeahead/api.js
var autoFill = function() {
	const docs = this.docs;
	if (docs.length === 0) return this;
	const lastPhrase = docs[docs.length - 1] || [];
	const term = lastPhrase[lastPhrase.length - 1];
	if (term.typeahead === true && term.machine) {
		term.text = term.machine;
		term.normal = term.machine;
	}
	return this;
};
var api$18 = function(View) {
	View.prototype.autoFill = autoFill;
};
//#endregion
//#region node_modules/compromise/src/1-one/typeahead/lib/allPrefixes.js
var getPrefixes = function(arr, opts, world) {
	let index = {};
	const collisions = [];
	const existing = world.prefixes || {};
	arr.forEach((str) => {
		str = str.toLowerCase().trim();
		let max = str.length;
		if (opts.max && max > opts.max) max = opts.max;
		for (let size = opts.min; size < max; size += 1) {
			const prefix = str.substring(0, size);
			if (opts.safe && world.model.one.lexicon.hasOwnProperty(prefix)) continue;
			if (existing.hasOwnProperty(prefix) === true) {
				collisions.push(prefix);
				continue;
			}
			if (index.hasOwnProperty(prefix) === true) {
				collisions.push(prefix);
				continue;
			}
			index[prefix] = str;
		}
	});
	index = Object.assign({}, existing, index);
	collisions.forEach((str) => {
		delete index[str];
	});
	return index;
};
//#endregion
//#region node_modules/compromise/src/1-one/typeahead/lib/index.js
var isObject = (val) => {
	return Object.prototype.toString.call(val) === "[object Object]";
};
var defaults$1 = {
	safe: true,
	min: 3
};
var prepare = function(words = [], opts = {}) {
	const model = this.model();
	opts = Object.assign({}, defaults$1, opts);
	if (isObject(words)) {
		Object.assign(model.one.lexicon, words);
		words = Object.keys(words);
	}
	const prefixes = getPrefixes(words, opts, this.world());
	Object.keys(prefixes).forEach((str) => {
		if (model.one.typeahead.hasOwnProperty(str)) {
			delete model.one.typeahead[str];
			return;
		}
		model.one.typeahead[str] = prefixes[str];
	});
	return this;
};
var plugin_default$15 = {
	model: { one: { typeahead: {} } },
	api: api$18,
	lib: { typeahead: prepare },
	compute: compute_default$4,
	hooks: ["typeahead"]
};
//#endregion
//#region node_modules/compromise/src/one.js
nlp.extend(plugin_default$25);
nlp.extend(plugin_default$20);
nlp.extend(plugin_default$21);
nlp.extend(plugin_default$19);
nlp.extend(plugin_default$17);
nlp.plugin(plugin$3);
nlp.extend(plugin_default$16);
nlp.extend(plugin_default$24);
nlp.plugin(plugin_default$26);
nlp.extend(plugin_default$22);
nlp.extend(plugin_default$15);
nlp.extend(plugin_default$23);
nlp.extend(plugin_default$18);
var one_default = nlp;
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/irregulars/plurals.js
var plurals_default = {
	addendum: "addenda",
	corpus: "corpora",
	criterion: "criteria",
	curriculum: "curricula",
	genus: "genera",
	memorandum: "memoranda",
	opus: "opera",
	ovum: "ova",
	phenomenon: "phenomena",
	referendum: "referenda",
	alga: "algae",
	alumna: "alumnae",
	antenna: "antennae",
	formula: "formulae",
	larva: "larvae",
	nebula: "nebulae",
	vertebra: "vertebrae",
	analysis: "analyses",
	axis: "axes",
	diagnosis: "diagnoses",
	parenthesis: "parentheses",
	prognosis: "prognoses",
	synopsis: "synopses",
	thesis: "theses",
	neurosis: "neuroses",
	appendix: "appendices",
	index: "indices",
	matrix: "matrices",
	ox: "oxen",
	sex: "sexes",
	alumnus: "alumni",
	bacillus: "bacilli",
	cactus: "cacti",
	fungus: "fungi",
	hippopotamus: "hippopotami",
	libretto: "libretti",
	modulus: "moduli",
	nucleus: "nuclei",
	octopus: "octopi",
	radius: "radii",
	stimulus: "stimuli",
	syllabus: "syllabi",
	cookie: "cookies",
	calorie: "calories",
	auntie: "aunties",
	movie: "movies",
	pie: "pies",
	rookie: "rookies",
	tie: "ties",
	zombie: "zombies",
	leaf: "leaves",
	loaf: "loaves",
	thief: "thieves",
	foot: "feet",
	goose: "geese",
	tooth: "teeth",
	beau: "beaux",
	chateau: "chateaux",
	tableau: "tableaux",
	bus: "buses",
	gas: "gases",
	circus: "circuses",
	crisis: "crises",
	virus: "viruses",
	database: "databases",
	excuse: "excuses",
	abuse: "abuses",
	avocado: "avocados",
	barracks: "barracks",
	child: "children",
	clothes: "clothes",
	echo: "echoes",
	embargo: "embargoes",
	epoch: "epochs",
	deer: "deer",
	halo: "halos",
	man: "men",
	woman: "women",
	mosquito: "mosquitoes",
	mouse: "mice",
	person: "people",
	quiz: "quizzes",
	rodeo: "rodeos",
	shoe: "shoes",
	sombrero: "sombreros",
	stomach: "stomachs",
	tornado: "tornados",
	tuxedo: "tuxedos",
	volcano: "volcanoes"
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/lexicon/_data.js
var _data_default$1 = {
	"Comparative": "true¦bett1f0;arth0ew0in0;er",
	"Superlative": "true¦earlier",
	"PresentTense": "true¦bests,sounds",
	"Condition": "true¦lest,unless",
	"PastTense": "true¦began,came,d4had,kneel3l2m0sa4we1;ea0sg2;nt;eap0i0;ed;id",
	"Participle": "true¦0:09;a06b01cZdXeat0fSgQhPoJprov0rHs7t6u4w1;ak0ithdra02o2r1;i02uY;k0v0;nd1pr04;ergoJoJ;ak0hHo3;e9h7lain,o6p5t4un3w1;o1um;rn;g,k;ol0reS;iQok0;ught,wn;ak0o1runk;ne,wn;en,wn;ewriNi1uJ;dd0s0;ut3ver1;do4se0t1;ak0h2;do2g1;roG;ne;ast0i7;iv0o1;ne,tt0;all0loBor1;bi3g2s1;ak0e0;iv0o9;dd0;ove,r1;a5eamt,iv0;hos0lu1;ng;e4i3lo2ui1;lt;wn;tt0;at0en,gun;r2w1;ak0ok0;is0;en",
	"Gerund": "true¦accord0be0doin,go0result0stain0;ing",
	"Expression": "true¦a0Yb0Uc0Sd0Oe0Mfarew0Lg0FhZjeez,lWmVnToOpLsJtIuFvEw7y0;a5e3i1u0;ck,p;k04p0;ee,pee;a0p,s;!h;!a,h,y;a5h2o1t0;af,f;rd up,w;atsoever,e1o0;a,ops;e,w;hoo,t;ery w06oi0L;gh,h0;! 0h,m;huh,oh;here nPsk,ut tut;h0ic;eesh,hh,it,oo;ff,h1l0ow,sst;ease,s,z;ew,ooey;h1i,mg,o0uch,w,y;h,o,ps;! 0h;hTmy go0wT;d,sh;a7evertheless,o0;!pe;eh,mm;ah,eh,m1ol0;!s;ao,fao;aCeBi9o2u0;h,mph,rra0zzC;h,y;l1o0;r6y9;la,y0;! 0;c1moCsmok0;es;ow;!p hip hoor0;ay;ck,e,llo,y;ha1i,lleluj0;ah;!ha;ah,ee4o1r0;eat scott,r;l1od0sh; grief,bye;ly;! whiz;ell;e0h,t cetera,ureka,ww,xcuse me;k,p;'oh,a0rat,uh;m0ng;mit,n0;!it;mon,o0;ngratulations,wabunga;a2oo1r0tw,ye;avo,r;!ya;h,m; 1h0ka,las,men,rgh,ye;!a,em,h,oy;la",
	"Negative": "true¦n0;ever,o0;n,t",
	"QuestionWord": "true¦how3wh0;at,e1ich,o0y;!m,se;n,re; come,'s",
	"Reflexive": "true¦h4it5my5o1the0your2;ir1m1;ne3ur0;sel0;f,ves;er0im0;self",
	"Plural": "true¦dick0gre0ones,records;ens",
	"Unit|Noun": "true¦cEfDgChBinchAk9lb,m6newt5oz,p4qt,t1y0;ardEd;able1b0ea1sp;!l,sp;spo1;a,t,x;on9;!b,g,i1l,m,p0;h,s;!les;!b,elvin,g,m;!es;g,z;al,b;eet,oot,t;m,up0;!s",
	"Value": "true¦a few",
	"Imperative": "true¦bewa0come he0;re",
	"Plural|Verb": "true¦leaves",
	"Demonym": "true¦0:15;1:12;a0Vb0Oc0Dd0Ce08f07g04h02iYjVkTlPmLnIomHpEqatari,rCs7t5u4v3welAz2;am0Gimbabwe0;enezuel0ietnam0I;gAkrai1;aiwTex0hai,rinida0Ju2;ni0Prkmen;a5cotti4e3ingapoOlovak,oma0Spaniard,udRw2y0W;ede,iss;negal0Cr09;sh;mo0uT;o5us0Jw2;and0;a2eru0Fhilippi0Nortugu07uerto r0S;kist3lesti1na2raguay0;ma1;ani;ami00i2orweP;caragu0geri2;an,en;a3ex0Lo2;ngo0Drocc0;cedo1la2;gasy,y07;a4eb9i2;b2thua1;e0Cy0;o,t01;azakh,eny0o2uwaiI;re0;a2orda1;ma0Ap2;anO;celandic,nd4r2sraeli,ta01vo05;a2iB;ni0qi;i0oneU;aiAin2ondur0unO;di;amEe2hanai0reek,uatemal0;or2rm0;gi0;ilipino,ren8;cuadoVgyp4mira3ngli2sto1thiopi0urope0;shm0;ti;ti0;aPominUut3;a9h6o4roat3ub0ze2;ch;!i0;lom2ngol5;bi0;a6i2;le0n2;ese;lifor1m2na3;bo2eroo1;di0;angladeshi,el6o4r3ul2;gaE;azi9it;li2s1;vi0;aru2gi0;si0;fAl7merBngol0r5si0us2;sie,tr2;a2i0;li0;genti2me1;ne;ba1ge2;ri0;ni0;gh0r2;ic0;an",
	"Organization": "true¦0:4Q;a3Tb3Bc2Od2He2Df27g1Zh1Ti1Pj1Nk1Ll1Gm12n0Po0Mp0Cqu0Br02sTtHuCv9w3xiaomi,y1;amaha,m1Bou1w1B;gov,tu3C;a4e2iki1orld trade organizati33;leaRped0O;lls fargo,st1;fie2Hinghou2R;l1rner br3U;gree3Jl street journ2Im1E;an halOeriz2Xisa,o1;dafo2Yl1;kswagMvo;b4kip,n2ps,s1;a tod3Aps;es3Mi1;lev3Fted natio3C;er,s; mobi32aco beRd bOe9gi frida3Lh3im horto3Amz,o1witt3D;shi49y1;ota,s r 05;e 1in lizzy;b3carpen3Jdaily ma3Dguess w2holli0s1w2;mashing pumpki35uprem0;ho;ea1lack eyed pe3Xyr0Q;ch bo3Dtl0;l2n3Qs1xas instrumen1U;co,la m1F;efoni0Kus;a8cientology,e5ieme2Ymirnoff,np,o3pice gir6quare0Ata1ubaru;rbuc1to34;ks;ny,undgard1;en;a2x pisto1;ls;g1Wrs;few2Minsbur31lesfor03msu2E;adiohead,b8e4o1yana3C;man empi1Xyal 1;b1dutch she4;ank;a3d 1max,vl20;bu1c2Ahot chili peppe2Ylobst2N;ll;ders dige1Ll madrid;c,s;ant3Aizn2Q;a8bs,e5fiz2Ihilip4i3r1;emier 1udenti1D;leagTo2K;nk floyd,zza hut; morrBs;psi2tro1uge0E;br33chi0Tn33;!co;lant2Un1yp16; 2ason27da2P;ld navy,pec,range juli2xf1;am;us;aAb9e6fl,h5i4o1sa,vid3wa;k2tre dame,vart1;is;ia;ke,ntendo,ss0QvZ;l,s;c,st1Otflix,w1; 1sweek;kids on the block,york0D;a,c;nd22s2t1;ional aca2Po,we0U;a,c02d0S;aDcdonalCe9i6lb,o3tv,y1;spa1;ce;b1Tnsanto,ody blu0t1;ley cr1or0T;ue;c2t1;as,subisO;helin,rosoft;dica2rcedes benz,talli1;ca;id,re;ds;cs milk,tt19z24;a3e1g,ittle caesa1P; ore09novo,x1;is,mark,us; 1bour party;pres0Dz boy;atv,fc,kk,lm,m1od1O;art;iffy lu0Roy divisi0Jpmorgan1sa;! cha09;bm,hop,k3n1tv;g,te1;l,rpol;ea;a5ewlett pack1Vi3o1sbc,yundai;me dep1n1P;ot;tac1zbollah;hi;lliburt08sbro;eneral 6hq,ithub,l5mb,o2reen d0Ou1;cci,ns n ros0;ldman sachs,o1;dye1g0H;ar;axo smith kli04encoW;electr0Nm1;oto0Z;a5bi,c barcelo4da,edex,i2leetwood m03o1rito l0G;rd,xcY;at,fa,nancial1restoZ; tim0;na;cebook,nnie mae;b0Asa,u3xxon1; m1m1;ob0J;!rosceptics;aiml0De5isney,o4u1;nkin donu2po0Zran dur1;an;ts;j,w jon0;a,f lepp12ll,peche mode,r spieg02stiny's chi1;ld;aJbc,hFiDloudflaCnn,o3r1;aigsli5eedence clearwater reviv1ossra09;al;c7inba6l4m1o0Est09;ca2p1;aq;st;dplSg1;ate;se;a c1o chanQ;ola;re;a,sco1tigroup;! systems;ev2i1;ck fil a,na daily;r1y;on;d2pital o1rls jr;ne;bury,ill1;ac;aEbc,eBf9l5mw,ni,o1p,rexiteeU;ei3mbardiIston 1;glo1pizza;be;ng;o2ue c1;roV;ckbuster video,omingda1;le; g1g1;oodriL;cht2e ge0rkshire hathaw1;ay;el;cardi,idu,nana republ3s1xt5y5;f,kin robbi1;ns;ic;bYcTdidSerosmith,iRlKmEnheuser busDol,ppleAr6s4u3v2y1;er;is,on;di,todesk;hland o1sociated E;il;b3g2m1;co;os;ys; compu1be0;te1;rs;ch;c,d,erican3t1;!r1;ak; ex1;pre1;ss; 5catel2ta1;ir;! lu1;ce1;nt;jazeera,qae1;da;g,rbnb;as;/dc,a3er,tivision1;! blizz1;ard;demy of scienc0;es;ba",
	"Possessive": "true¦its,my,our0thy;!s",
	"Noun|Verb": "true¦0:9W;1:AA;2:96;3:A3;4:9R;5:A2;6:9K;7:8N;8:7L;9:A8;A:93;B:8D;C:8X;a9Ob8Qc7Id6Re6Gf5Sg5Hh55i4Xj4Uk4Rl4Em40n3Vo3Sp2Squ2Rr21s0Jt02u00vVwGyFzD;ip,oD;ne,om;awn,e6Fie68;aOeMhJiHoErD;ap,e9Oink2;nd0rDuC;kDry,sh5Hth;!shop;ck,nDpe,re,sh;!d,g;e86iD;p,sD;k,p0t2;aDed,lco8W;r,th0;it,lk,rEsDt4ve,x;h,te;!ehou1ra9;aGen5FiFoD;iDmAte,w;ce,d;be,ew,sA;cuum,l4B;pDr7;da5gra6Elo6A;aReQhrPiOoMrGuEwiDy5Z;n,st;nDrn;e,n7O;aGeFiEoDu6;t,ub2;bu5ck4Jgg0m,p;at,k,nd;ck,de,in,nsDp,v7J;f0i8R;ll,ne,p,r4Yss,t94uD;ch,r;ck,de,e,le,me,p,re;e5Wow,u6;ar,e,ll,mp0st,xt;g,lDng2rg7Ps5x;k,ly;a0Sc0Ne0Kh0Fi0Dk0Cl0Am08n06o05pXquaBtKuFwD;ea88iD;ng,pe,t4;bGit,m,ppErD;fa3ge,pri1v2U;lDo6S;e6Py;!je8;aMeLiKoHrEuDy2;dy,ff,mb2;a85eEiDo5Pugg2;ke,ng;am,ss,t4;ckEop,p,rD;e,m;ing,pi2;ck,nk,t4;er,m,p;ck,ff,ge,in,ke,lEmp,nd,p2rDte,y;!e,t;k,l;aJeIiHlGoFrDur,y;ay,e56inDu3;g,k2;ns8Bt;a5Qit;ll,n,r87te;ed,ll;m,n,rk;b,uC;aDee1Tow;ke,p;a5Je4FiDo53;le,rk;eep,iDou4;ce,p,t;ateboa7Ii;de,gnDl2Vnk,p,ze;!al;aGeFiEoDuff2;ck,p,re,w;ft,p,v0;d,i3Ylt0;ck,de,pe,re,ve;aEed,nDrv1It;se,t2N;l,r4t;aGhedu2oBrD;aEeDibb2o3Z;en,w;pe,t4;le,n,r2M;cDfegua72il,mp2;k,rifi3;aZeHhy6LiGoEuD;b,in,le,n,s5X;a6ck,ll,oDpe,u5;f,t;de,ng,ot,p,s1W;aTcSdo,el,fQgPje8lOmMnLo17pJque6sFturn,vDwa6V;eDi27;al,r1;er74oFpe8tEuD;lt,me;!a55;l71rt;air,eaDly,o53;l,t;dezvo2Zt;aDedy;ke,rk;ea1i4G;a6Iist0r5N;act6Yer1Vo71uD;nd,se;a38o6F;ch,s6G;c1Dge,iEke,lly,nDp1Wt1W;ge,k,t;n,se;es6Biv0;a04e00hYiXlToNrEsy4uD;mp,n4rcha1sh;aKeIiHoDu4O;be,ceFdu3fi2grDje8mi1p,te6;amDe6W;!me;ed,ss;ce,de,nt;sDy;er6Cs;cti3i1;iHlFoEp,re,sDuCw0;e,i5Yt;l,p;iDl;ce,sh;nt,s5V;aEce,e32uD;g,mp,n7;ce,nDy;!t;ck,le,n17pe,tNvot;a1oD;ne,tograph;ak,eFnErDt;fu55mA;!c32;!l,r;ckJiInHrFsEtDu1y;ch,e9;s,te;k,tD;!y;!ic;nt,r,se;!a7;bje8ff0il,oErDutli3Qver4B;bAd0ie9;ze;a4ReFoDur1;d,tD;e,i3;ed,gle8tD;!work;aMeKiIoEuD;rd0;ck,d3Rld,nEp,uDve;nt,th;it5EkD;ey;lk,n4Brr5CsDx;s,ta2B;asuBn4UrDss;ge,it;il,nFp,rk3WsEtD;ch,t0;h,k,t0;da5n0oeuvB;aLeJiHoEuD;mp,st;aEbby,ck,g,oDve;k,t;d,n;cDe,ft,mAnIst;en1k;aDc0Pe4vK;ch,d,k,p,se;bFcEnd,p,t4uD;gh,n4;e,k;el,o2U;eEiDno4E;ck,d,ll,ss;el,y;aEo1OuD;i3mp;m,zz;mpJnEr46ssD;ue;c1Rdex,fluGha2k,se2HteDvoi3;nt,rD;e6fa3viD;ew;en3;a8le2A;aJeHiGoEuD;g,nt;l3Ano2Dok,pDr1u1;!e;ghli1Fke,nt,re,t;aDd7lp;d,t;ck,mGndFrEsh,tDu9;ch,e;bo3Xm,ne4Eve6;!le;!m0;aMear,ift,lKossJrFuD;arDe4Alp,n;antee,d;aFiEoDumb2;uCwth;ll,nd,p;de,sp;ip;aBoDue;ss,w;g,in,me,ng,s,te,ze;aZeWiRlNoJrFuD;ck,el,nDss,zz;c38d;aEoDy;st,wn;cDgme,me,nchi1;tuB;cFg,il,ld,rD;ce,e29mDwa31;!at;us;aFe0Vip,oDy;at,ck,od,wD;!er;g,ke,me,re,sh,vo1E;eGgFlEnDre,sh,t,x;an3i0Q;e,m,t0;ht,uB;ld;aEeDn3;d,l;r,tuB;ce,il,ll,rm,vo2W;cho,d7ffe8nMsKxFyeD;!baD;ll;cGerci1hFpDtra8;eriDo0W;en3me9;au6ibA;el,han7u1;caDtima5;pe;count0d,vy;a01eSiMoJrEuDye;b,el,mp,pli2X;aGeFiEoD;ne,p;ft,ll,nk,p,ve;am,ss;ft,g,in;cEd7ubt,wnloD;ad;k,u0E;ge6p,sFt4vD;e,iDor3;de;char7gui1h,liEpD;at4lay,u5;ke;al,bKcJfeIlGmaCposAsEtaD;il;e07iD;gn,re;ay,ega5iD;ght;at,ct;li04rea1;a5ut;b,ma7n3rDte;e,t;a0Eent0Dh06irc2l03oKrFuD;be,e,rDt;b,e,l,ve;aGeFoEuDy;sh;p,ss,wd;dAep;ck,ft,sh;at,de,in,lTmMnFordina5py,re,st,uDv0;gh,nDp2rt;s01t;ceHdu8fli8glomeIsFtDveN;a8rD;a6ol;e9tru8;ct;ntDrn;ra5;bHfoGmFpD;leDouCromi1;me9;aCe9it,u5;rt;at,iD;ne;lap1oD;r,ur;aEiDoud,ub;ck,p;im,w;aEeDip;at,ck,er;iGllen7nErD;ge,m,t;ge,nD;el;n,r;er,re;ke,ll,mp,noe,pGrXsFtEuDve;se,ti0I;alog,ch;h,t;!tuB;re;a03eZiXlToPrHuEyD;pa11;bb2ck2dgEff0mp,rDst,zz;den,n;et;anJeHiFoadEuD;i1sh;ca6;be,d7;ge;aDed;ch,k;ch,d;aFg,mb,nEoDrd0tt2x,ycott;k,st,t;d,e;rd,st;aFeCiDoYur;nk,tz;nd;me;as,d,ke,nd,opsy,tD;!ch,e;aFef,lt,nDt;d,efA;it;r,t;ck,il,lan3nIrFsEtt2;le;e,h;!gDk;aDe;in;!d,g,k;bu1c05dZge,iYlVnTppQrLsIttGucEwaD;rd;tiD;on;aDempt;ck;k,sD;i6ocia5;st;chFmD;!oD;ur;!iD;ve;eEroa4;ch;al;chDg0sw0;or;aEt0;er;rm;d,m,r;dreHvD;an3oD;ca5;te;ce;ss;cDe,he,t;eFoD;rd,u9;nt;nt,ss;se",
	"Actor": "true¦0:7B;1:7G;2:6A;3:7F;4:7O;5:7K;a6Nb62c4Ud4Be41f3Sg3Bh30i2Uj2Qkin2Pl2Km26n1Zo1Sp0Vqu0Tr0JsQtJuHvEw8yo6;gi,ut6;h,ub0;aAe9i8o7r6;estl0it0;m2rk0;fe,nn0t2Bza2H;atherm2ld0;ge earn0it0nder0rri1;eter7i6oyF;ll5Qp,s3Z;an,ina2U;n6s0;c6Uder03;aoisea23e9herapi5iktok0o8r6ut1yco6S;a6endseLo43;d0mp,nscri0Bvel0;ddl0u1G;a0Qchn7en6na4st0;ag0;i3Oo0D;aiXcUeRhPiMki0mu26oJpGquaFtBu7wee6;p0theart;lt2per7r6;f0ge6Iviv1;h6inten0Ist5Ivis1;ero,um2;a8ep7r6;ang0eam0;bro2Nc2Ofa2Nmo2Nsi20;ff0tesm2;tt0;ec7ir2Do6;kesp59u0M;ia5Jt3;l7me6An,rcere6ul;r,ss;di0oi5;n7s6;sy,t0;g0n0;am2ephe1Iow6;girl,m2r2Q;cretInior cit3Fr6;gea4v6;a4it1;hol4Xi7reen6ulpt1;wr2C;e01on;l1nt;aEe9o8u6;l0nn6;er up,ingE;g40le mod3Zof0;a4Zc8fug2Ppo32searQv6;ere4Uolution6;ary;e6luYru22;ptio3T;bbi,dic5Vpp0;arter6e2Z;back;aYeWhSiRlOoKr8sycho7u6;nk,p31;logi5;aGeDiBo6;d9fess1g7ph47s6;pe2Ktitu51;en6ramm0;it1y;igy,uc0;est4Nme mini0Unce6s3E;!ss;a7si6;de4;ch0;ctiti39nk0P;dca0Oet,li6pula50rnst42;c2Itic6;al scie6i2;nti5;a6umb0;nn0y6;er,ma4Lwright;lgrim,one0;a8iloso7otogra7ra6ysi1V;se;ph0;ntom,rmaci5;r6ssi1T;form0s4O;i3El,nel3Yr8st1tr6wn;i6on;arWot;ent4Wi42tn0;ccupa4ffBp8r7ut6;ca5l0B;ac4Iganiz0ig2Fph2;er3t6;i1Jomet6;ri5;ic0spring;aBe9ie4Xo7u6;n,rser3J;b6mad,vi4V;le2Vo4D;i6mesis,phew;ce,ghb1;nny,rr3t1X;aEeDiAo7u6yst1Y;m8si16;der3gul,m7n6th0;arDk;!my;ni7s6;f02s0Jt0;on,st0;chan1Qnt1rcha4;gi9k0n8rtyr,t6y1;e,riar6;ch;ag0iac;ci2stra3I;a7e2Aieutena4o6;rd,s0v0;bor0d7ndlo6ss,urea3Fwy0ym2;rd;!y;!s28;e8o7u6;ggl0;gg0urna2U;st0;c3Hdol,llu3Ummigra4n6; l9c1Qfa4habi42nov3s7ve6;nt1stig3;pe0Nt6;a1Fig3ru0M;aw;airFeBistoAo8u6ygie1K;man6sba2H;!ita8;bo,st6usekN;age,e3P;ri2;ir,r6;m7o6;!ine;it;dress0sty2C;aLeIhostGirl26ladi3oCrand7u6;e5ru;c9daug0Jfa8m7pa6s2Y;!re4;a,o6;th0;hi1B;al7d6lf0;!de3A;ie,k6te26;eep0;!wr6;it0;isha,n6;i6tl04;us;mbl0rden0;aDella,iAo7r6;eela2Nie1P;e,re6ster pare4;be1Hm2r6st0;unn0;an2ZgZlmm17nanci0r6tt0;e6st la2H; marsh2OfigXm2;rm0th0;conoEdDlectriCm8n7x6;amin0cellency,i2A;emy,trepreneur,vironmenta1J;c8p6;er1loye6;e,r;ee;ci2;it1;mi5;aKeBi8ork,ri7u6we02;de,tche2H;ft0v0;ct3eti7plom2Hre6va;ct1;ci2ti2;aDcor3fencCi0InAput9s7tectLvel6;op0;ce1Ge6ign0;rt0;ee,y;iz6;en;em2;c1Ml0;d8nc0redev7ug6;ht0;il;!dy;a06e04fo,hXitizenWlToBr9u6;r3stomer6;! representat6;ive;e3it6;ic;lJmGnAord9rpor1Nu7w6;boy,ork0;n6ri0;ciTte1Q;in3;fidantAgressSs9t6;e0Kr6;ibut1o6;ll0;tab13ul1O;!e;edi2m6pos0rade;a0EeQissi6;on0;leag8on7um6;ni5;el;ue;e6own;an0r6;ic,k;!s;a9e7i6um;ld;erle6f;ad0;ir7nce6plFract0;ll1;m2wI;lebri6o;ty;dBptAr6shi0;e7pe6;nt0;r,t6;ak0;ain;et;aMeLiJlogg0oErBu6;dd0Fild0rgl9siness6;m2p7w6;om2;ers05;ar;i7o6;!k0th0;cklay0de,gadi0;hemi2oge8y6;!frie6;nd;ym2;an;cyc6sR;li5;atbox0ings;by,nk0r6;b0on7te6;nd0;!e07;c04dWge4nQpLrHsFtAu7yatull6;ah;nt7t6;h1oG;!ie;h8t6;e6orney;nda4;ie5le6;te;sis00tron6;aut,om0;chbis8isto7tis6;an,t;crU;hop;ost9p6;ari6rentiS;ti6;on;le;a9cest1im3nou8y6;bo6;dy;nc0;ly5rc6;hi5;mi8v6;entur0is1;er;ni7r6;al;str3;at1;or;counBquaintanArob9t6;ivi5or,re6;ss;st;at;ce;ta4;nt",
	"Adj|Noun": "true¦0:16;a1Db17c0Ud0Re0Mf0Dg0Ah08i06ju05l02mWnUoSpNrIsBt7u4v1watershed;a1ision0Z;gabo4nilla,ria1;b0Vnt;ndergr1pstairs;adua14ou1;nd;a3e1oken,ri0;en,r1;min0rori13;boo,n;age,e5ilv0Flack,o3quat,ta2u1well;bordina0Xper5;b0Lndard;ciali0Yl1vereign;e,ve16;cret,n1ri0;ior;a4e2ou1ubbiL;nd,tiY;ar,bBl0Wnt0p1side11;resent0Vublican;ci0Qsh;a4eriodic0last0Zotenti0r1;emi2incip0o1;!fession0;er,um;rall4st,tie0U;ff1pposi0Hv0;ens0Oi0C;agg01ov1uts;el;a5e3iniatJo1;bi01der07r1;al,t0;di1tr0N;an,um;le,riG;attOi2u1;sh;ber0ght,qC;stice,veniT;de0mpressioYn1;cumbe0Edividu0no0Dsta0Eterim;alf,o1umdrum;bby,melF;en2old,ra1;ph0Bve;er0ious;a7e5i4l3u1;git03t1;ure;uid;ne;llow,m1;aFiL;ir,t,vo1;riOuriO;l3p00x1;c1ecutUpeV;ess;d1iK;er;ar2e1;mographUrivO;k,l2;hiGlassSo2rude,unn1;ing;m5n1operK;creCstitueOte2vertab1;le;mpor1nt;ary;ic,m2p1;anion,lex;er2u1;ni8;ci0;al;e5lank,o4r1;i2u1;te;ef;ttom,urgeois;st;cadem9d6l2ntarct9r1;ab,ct8;e3tern1;at1;ive;rt;oles1ult;ce1;nt;ic",
	"Adj|Past": "true¦0:4Q;1:4C;2:4H;3:4E;a44b3Tc36d2Je29f20g1Wh1Si1Jj1Gkno1Fl1Am15n12o0Xp0Mqu0Kr08sLtEuAv9w4yellow0;a7ea6o4rinkl0;r4u3Y;n,ri0;k31th3;rp0sh0tZ;ari0e1O;n5p4s0;d1li1Rset;cov3derstood,i4;fi0t0;a8e3Rhr7i6ouTr4urn0wi4C;a4imm0ou2G;ck0in0pp0;ed,r0;eat2Qi37;m0nn0r4;get0ni2T;aOcKeIhGimFm0Hoak0pDt7u4;bsid3Ogge44s4;pe4ta2Y;ct0nd0;a8e7i2Eok0r5u4;ff0mp0nn0;ength2Hip4;ed,p0;am0reotyp0;in0t0;eci4ik0oH;al3Efi0;pRul1;a4ock0ut;d0r0;a4c1Jle2t31;l0s3Ut0;a6or5r4;at4e25;ch0;r0tt3;t4ut0;is2Mur1;aEe5o4;tt0;cAdJf2Bg9je2l8m0Knew0p7qu6s4;eTpe2t4;or0ri2;e3Dir0;e1lac0;at0e2Q;i0Rul1;eiv0o4ycl0;mme2Lrd0v3;in0lli0ti2A;a4ot0;li28;aCer30iBlAo9r5u4;mp0zzl0;e6i2Oo4;ce2Fd4lo1Anou30pos0te2v0;uc0;fe1CocCp0Iss0;i2Kli1L;ann0e2CuS;ck0erc0ss0;ck0i2Hr4st0;allLk0;bse7c6pp13rgan2Dver4;lo4whelm0;ok0;cupi0;rv0;aJe5o4;t0uri1A;ed0gle2;a6e5ix0o4ut0ys1N;di1Nt15u26;as0Clt0;n4rk0;ag0ufact0A;e6i5o4;ad0ck0st,v0;cens0m04st0;ft,v4;el0;tt0wn;a5o15u4;dg0s1B;gg0;llumSmpAn4sol1;br0cre1Ldebt0f8jZspir0t5v4;it0olv0;e4ox0Y;gr1n4re23;d0si15;e2l1o1Wuri1;li0o01r4;ov0;a6e1o4um03;ok0r4;ri0Z;mm3rm0;i6r5u4;a1Bid0;a0Ui0Rown;ft0;aAe9i8l6oc0Ir4;a4i0oz0Y;ctHg19m0;avo0Ju4;st3;ni08tt0x0;ar0;d0il0sc4;in1;dCl1mBn9quipp0s8x4;agger1c6p4te0T;a0Se4os0;ct0rie1D;it0;cap0tabliZ;cha0XgFha1As4;ur0;a0Zbarra0N;i0Buc1;aMeDi5r4;a01i0;gni08miniSre2s4;a9c6grun0Ft4;o4re0Hu17;rt0;iplWou4;nt0r4;ag0;bl0;cBdRf9l8p7ra6t5v4;elop0ot0;ail0ermQ;ng0;re07;ay0ight0;e4in0o0M;rr0;ay0enTor1;m5t0z4;ed,zl0;ag0p4;en0;aPeLhIlHo9r6u4;lt4r0stom03;iv1;a5owd0u4;sh0;ck0mp0;d0loAm7n4ok0v3;centr1f5s4troC;id3olid1;us0;b5pl4;ic1;in0;r0ur0;assi9os0utt3;ar5i4;ll0;g0m0;lebr1n6r4;ti4;fi0;tralJ;g0lcul1;aDewild3iCl9o7r5urn4;ed,t;ok4uis0;en;il0r0t4und;tl0;e5i4;nd0;ss0;as0;ffl0k0laMs0tt3;bPcNdKfIg0lFmaz0nDppBrm0ss9u5wa4;rd0;g5thor4;iz0;me4;nt0;o6u4;m0r0;li0re4;ci1;im1ticip1;at0;a5leg0t3;er0;rm0;fe2;ct0;ju5o7va4;nc0;st0;ce4knowledg0;pt0;and5so4;rb0;on0;ed",
	"Singular": "true¦0:5J;1:5H;2:4W;3:4S;4:52;5:57;6:5L;7:56;8:5B;a52b4Lc3Nd35e2Xf2Og2Jh28in24j23k22l1Um1Ln1Ho1Bp0Rqu0Qr0FsZtMuHvCw9x r58yo yo;a9ha3Po3Q;f3i4Rt0Gy9;! arou39;arCeAideo ga2Qo9;cabu4Jl5C;gOr9t;di4Zt1Y;iety,ni4P;nBp30rAs 9;do43s5E;bani1in0;coordinat3Ader9;estima1to24we41; rex,aKeJhHiFoErBuAv9;! show;m2On2rntLto1D;agedy,ib9o4E;e,u9;n0ta46;ni1p2rq3L;c,er,m9;etF;ing9ree26;!y;am,mp3F;ct2le6x return;aNcMeKhor4QiJkHoGpin off,tDuBy9;ll9ner7st4T;ab2X;b9i1n28per bowl,rro1X;st3Ltot0;atAipe2Go1Lrate7udent9;! lo0I;i39u1;ft ser4Lmeo1I;elet5i9;ll,r3V;b38gn2Tte;ab2Jc9min3B;t,urity gua2N;e6ho2Y;bbatic0la3Jndwi0Qpi5;av5eDhetor2iAo9;de6om,w;tAv9;erb2C;e,u0;bDcBf9publ2r10spi1;er9orm3;e6r0;i9ord label;p2Ht0;a1u46;estion mark,ot2F;aPeMhoLiIlGoErAu9yram1F;ddi3HpErpo1Js3J;eBo9;bl3Zs9;pe3Jta1;dic1Rmi1Fp1Qroga8ss relea1F;p9rt0;py;a9ebisci1;q2Dte;cn2eAg9;!gy;!r;ne call,tocoK;anut,dAr9t0yo1;cen3Jsp3K;al,est0;nop4rAt9;e,hog5;adi11i2V;atme0bj3FcBpia1rde0thers,utspok5ve9wn3;n,r9;ti0Pview;cuAe9;an;pi3;arBitAot9umb3;a2Fhi2R;e,ra1;cot2ra8;aFeCiAo9ur0;nopo4p18rni2Nsq1Rti36uld;c,li11n0As9tt5;chief,si34;dAnu,t9;al,i3;al,ic;gna1mm0nd15rsupi0te9yf4;ri0;aDegCiBu9;ddi1n9;ch;me,p09; Be0M;bor14y9; 9er;up;eyno1itt5;el4ourn0;cBdices,itia8ni25sAtel0Lvert9;eb1J;e28titu1;en8i2T;aIeEighDoAu9;man right,s22;me9rmoFsp1Ftb0K;! r9;un; scho0YriY;a9i1N;d9v5; start,pho9;ne;ndful,sh brown,v5ze;aBelat0Ilaci3r9ul4yp1S;an9enadi3id;a1Cd slam,ny;df4r9;l2ni1I;aGeti1HiFlu1oCrAun9;er0;ee market,i9onti3;ga1;l4ur9;so9;me;ePref4;br2mi4;conoFffi7gg,lecto0Rmbas1EnCpidem2s1Zth2venBxAyel9;id;ampZempl0Nte6;i19t;er7terp9;ri9;se;my;eLiEoBr9ump tru0U;agonf4i9;er,ve thru;cAg7i4or,ssi3wn9;side;to0EumenE;aEgniDnn3sAvide9;nd;conte6incen8p9tri11;osi9;ti0C;ta0H;le0X;athBcAf9ni0terre6;ault 05err0;al,im0;!b9;ed;aWeThMiLlJoDr9;edit caBuc9;ib9;le;rd;efficDke,lCmmuniqLnsApi3rr0t0Xus9yo1;in;erv9uI;ato02;ic,lQ;ie6;er7i9oth;e6n2;ty,vil wM;aDeqCick5ocoBr9;istmas car9ysanthemum;ol;la1;ue;ndeli3racteri9;st2;iAllEr9;e0tifica1;liZ;hi3nFpErCt9ucus;erpi9hedr0;ll9;ar;!bohyd9ri3;ra1;it0;aAe,nib0t9;on;l,ry;aMeLiop2leJoHrDu9;nny,r9tterf4;g9i0;la9;ry;eakAi9;ck;fa9throB;st;dy,ro9wl;ugh;mi9;sh;an,l4;nkiArri3;er;ng;cSdMlInFppeti1rDsBtt2utop9;sy;ic;ce6pe9;ct;r9sen0;ay;ecAoma4tiA;ly;do1;i5l9;er7y;gy;en; hominDjAvan9;tage;ec8;ti9;ve;em;cCeAqui9;tt0;ta1;te;iAru0;al;de6;nt",
	"Person|Noun": "true¦a0Eb07c03dWeUfQgOhLjHkiGlFmCnBolive,p7r4s3trini06v1wa0;ng,rd,tts;an,enus,iol0;a,et;ky,onPumm09;ay,e1o0uby;bin,d,se;ed,x;a2e1o0;l,tt04;aLnJ;dYge,tR;at,orm;a0eloW;t0x,ya;!s;a9eo,iH;ng,tP;a2e1o0;lGy;an,w3;de,smi4y;a0erb,iOolBuntR;ll,z0;el;ail,e0iLuy;ne;a1ern,i0lo;elds,nn;ith,n0;ny;a0dEmir,ula,ve;rl;a4e3i1j,ol0;ly;ck,x0;ie;an,ja;i0wn;sy;am,h0liff,rystal;a0in,ristian;mbers,ri0;ty;a4e3i2o,r0ud;an0ook;dy;ll;nedict,rg;k0nks;er;l0rt;fredo,ma",
	"Actor|Verb": "true¦aCb8c5doctor,engineAfool,g3host,judge,m2nerd,p1recruit,scout,ushAvolunteAwi0;mp,tneA;arent,ilot;an,ime;eek,oof,r0uide;adu8oom;ha1o0;ach,nscript,ok;mpion,uffeur;o2u0;lly,tch0;er;ss;ddi1ffili0rchite1;ate;ct",
	"MaleName": "true¦0:H6;1:FZ;2:DS;3:GQ;4:CZ;5:FV;6:GM;7:FP;8:GW;9:ET;A:C2;B:GD;aF8bE1cCQdBMeASfA1g8Yh88i7Uj6Sk6Bl5Mm48n3So3Ip33qu31r26s1Et0Ru0Ov0CwTxSyHzC;aCor0;cChC1karia,nAT;!hDkC;!aF6;!ar7CeF5;aJevgenBSoEuC;en,rFVsCu3FvEF;if,uf;nDs6OusC;ouf,s6N;aCg;s,tC;an,h0;hli,nCrosE1ss09;is,nC;!iBU;avi2ho5;aPeNiDoCyaEL;jcieBJlfgang,odrFutR;lFnC;f8TsC;lCt1;ow;bGey,frEhe4QlC;aE5iCy;am,e,s;ed8iC;d,ed;eAur;i,ndeD2rn2sC;!l9t1;lDyC;l1ne;lDtC;!er;aCHy;aKernDAiFladDoC;jteB0lodymyr;!iC;mFQsDB;cFha0ktBZnceDrgCOvC;a0ek;!nC;t,zo;!e4StBV;lCnC7sily;!entC;in9J;ghE2lCm70nax,ri,sm0;riCyss87;ch,k;aWeRhNiLoGrEuDyC;!l2roEDs1;n6r6E;avD0eCist0oy,um0;ntCRvBKy;bFdAWmCny;!asDmCoharu;aFFie,y;!z;iA6y;mCt4;!my,othy;adEeoDia0SomC;!as;!dor91;!de4;dFrC;enBKrC;anBJeCy;ll,nBI;!dy;dgh,ha,iCnn2req,tsu5V;cDAka;aYcotWeThPiMlobod0oKpenc2tEurDvenAEyCzym1;ed,lvest2;aj,e9V;anFeDuC;!aA;fan17phEQvCwaA;e77ie;!islaCl9;v,w;lom1rBuC;leymaDHta;dDgmu9UlCm1yabonga;as,v8B;!dhart8Yn9;aEeClo75;lCrm0;d1t1;h9Jne,qu1Jun,wn,yne;aDbastiEDk2Yl5Mpp,rgCth,ymoCU;e1Dio;m4n;!tC;!ie,y;eDPlFmEnCq67tosCMul;dCj2UtiA5;e01ro;!iATkeB6mC4u5;!ik,vato9K;aZeUheC8iRoGuDyC;an,ou;b99dDf4peAssC;!elEG;ol00y;an,bLc7MdJel,geIh0lHmGnEry,sDyC;!ce;ar7Ocoe,s;!aCnBU;ld,n;an,eo;a7Ef;l7Jr;e3Eg2n9olfo,riC;go;bBNeDH;cCl9;ar87c86h54kCo;!ey,ie,y;cFeA3gDid,ubByCza;an8Ln06;g85iC;naC6s;ep;ch8Kfa5hHin2je8HlGmFndEoHpha5sDul,wi36yC;an,mo8O;h9Im4;alDSol3O;iD0on;f,ph;ul;e9CinC;cy,t1;aOeLhilJiFrCyoG;aDeC;m,st1;ka85v2O;eDoC;tr;r8GtC;er,ro;!ipCl6H;!p6U;dCLrcy,tC;ar,e9JrC;!o7;b9Udra8So9UscAHtri62ulCv8I;!ie,o7;ctav6Ji2lImHndrBRrGsDtCum6wB;is,to;aDc6k6m0vCwaBE;al79;ma;i,vR;ar,er;aDeksandr,ivC;er,i2;f,v;aNeLguyBiFoCu3O;aDel,j4l0ma0rC;beAm0;h,m;cFels,g5i9EkDlC;es,s;!au,h96l78olaC;!i,y;hCkCol76;ol75;al,d,il,ls1vC;ilAF;hom,tC;e,hC;anCy;!a5i5;aYeViLoGuDyC;l4Nr1;hamDr84staC;fa,p6E;ed,mG;di10e,hamEis4JntDritz,sCussa;es,he;e,y;ad,ed,mC;ad,ed;cGgu5hai,kFlEnDtchC;!e8O;a9Pik;house,o7t1;ae73eC3ha8Iolaj;ah,hDkC;!ey,y;aDeC;al,l;el,l;hDlv3rC;le,ri8Ev4T;di,met;ay0c00gn4hWjd,ks2NlTmadZnSrKsXtDuric7VxC;imilBKwe8B;eHhEi69tCus,y69;!eo,hCia7;ew,i67;eDiC;as,eu,s;us,w;j,o;cHiGkFlEqu8Qsha83tCv3;iCy;!m,n;in,on;el,o7us;a6Yo7us;!elCin,o7us;!l8o;frAEi5Zny,u5;achDcoCik;lm;ai,y;amDdi,e5VmC;oud;adCm6W;ou;aulCi9P;ay;aWeOiMloyd,oJuDyC;le,nd1;cFdEiDkCth2uk;a7e;gi,s,z;ov7Cv6Hw6H;!as,iC;a6Een;g0nn52renDuCvA4we7D;!iS;!zo;am,n4oC;n5r;a9Yevi,la5KnHoFst2thaEvC;eCi;nte;bo;nCpo8V;!a82el,id;!nC;aAy;mEnd1rDsz73urenCwr6K;ce,t;ry,s;ar,beAont;aOeIhalHiFla4onr63rDu5SylC;e,s;istCzysztof;i0oph2;er0ngsl9p,rC;ilA9k,ollos;ed,id;en0iGnDrmCv4Z;it;!dDnCt1;e2Ny;ri4Z;r,th;cp2j4mEna8BrDsp6them,uC;ri;im,l;al,il;a03eXiVoFuC;an,lCst3;en,iC;an,en,o,us;aQeOhKkub4AnIrGsDzC;ef;eDhCi9Wue;!ua;!f,ph;dCge;i,on;!aCny;h,s,th6J;anDnC;!ath6Hie,n72;!nC;!es;!l,sCy;ph;o,qu3;an,mC;!i,m6V;d,ffFns,rCs4;a7JemDmai7QoCry;me,ni1H;i9Dy;!e73rC;ey,y;cKdBkImHrEsDvi2yC;dBs1;on,p2;ed,oDrCv67;e6Qod;d,s61;al,es5Wis1;a,e,oCub;b,v;ob,qu13;aTbNchiMgLke53lija,nuKonut,rIsEtCv0;ai,suC;ki;aDha0i8XmaCsac;el,il;ac,iaC;h,s;a,vinCw3;!g;k,nngu6X;nac1Xor;ka;ai,rahC;im;aReLoIuCyd6;beAgGmFsC;eyDsC;a3e3;in,n;ber5W;h,o;m2raDsse3wC;a5Pie;c49t1K;a0Qct3XiGnDrC;beAman08;dr7VrC;iCy2N;!k,q1R;n0Tt3S;bKlJmza,nIo,rEsDyC;a5KdB;an,s0;lEo67r2IuCv9;hi5Hki,tC;a,o;an,ey;k,s;!im;ib;a08e00iUlenToQrMuCyorgy;iHnFsC;!taC;f,vC;!e,o;n6tC;er,h2;do,lC;herDlC;auCerQ;me;aEegCov2;!g,orC;!io,y;dy,h7C;dfr9nza3XrDttfC;ri6C;an,d47;!n;acoGlEno,oCuseppe;rgiCvan6O;!o,s;be6Ies,lC;es;mo;oFrC;aDha4HrCt;it,y;ld,rd8;ffErgC;!e7iCy;!os;!r9;bElBrCv3;eCla1Nr4Hth,y;th;e,rC;e3YielC;!i4;aXeSiQlOorrest,rCyod2E;aHedFiC;edDtC;s,z;ri18;!d42eri11riC;ck,k;nCs2;cEkC;ie,lC;in,yn;esLisC;!co,z3M;etch2oC;ri0yd;d5lConn;ip;deriFliEng,rC;dinaCg4nan0B;nd8;pe,x;co;bCdi,hd;iEriC;ce,zC;io;an,en,o;benez2dZfrYit0lTmMnJo3rFsteb0th0ugenEvCymBzra;an,eCge4D;ns,re3K;!e;gi,iDnCrol,v3w3;est8ie,st;cCk;!h,k;o0DriCzo;co,qC;ue;aHerGiDmC;aGe3A;lCrh0;!iC;a10o,s;s1y;nu5;beAd1iEliDm2t1viCwood;n,s;ot28s;!as,j5Hot,sC;ha;a3en;!dGg6mFoDua2QwC;a2Pin;arC;do;oZuZ;ie;a04eTiOmitrNoFrag0uEwDylC;an,l0;ay3Hig4D;a3Gdl9nc0st3;minFnDri0ugCvydGy2S;!lF;!a36nCov0;e1Eie,y;go,iDykC;as;cCk;!k;i,y;armuFetDll1mitri7neCon,rk;sh;er,m6riC;ch;id;andLepak,j0lbeAmetri4nIon,rGsEvDwCxt2;ay30ey;en,in;hawn,moC;nd;ek,riC;ck;is,nC;is,y;rt;re;an,le,mKnIrEvC;e,iC;!d;en,iEne0PrCyl;eCin,yl;l45n;n,o,us;!iCny;el,lo;iCon;an,en,on;a0Fe0Ch03iar0lRoJrFuDyrC;il,us;rtC;!is;aEistC;iaCob12;no;ig;dy,lInErC;ey,neliCy;s,us;nEor,rDstaC;nt3;ad;or;by,e,in,l3t1;aHeEiCyde;fCnt,ve;fo0Xt1;menDt4;us;s,t;rFuDyC;!t1;dCs;e,io;enC;ce;aHeGrisC;!toC;phCs;!eC;!r;st2t;d,rCs;b5leC;s,y;cDdrCs6;ic;il;lHmFrC;ey,lDroCy;ll;!o7t1;er1iC;lo;!eb,v3;a09eZiVjorn,laUoSrEuCyr1;ddy,rtKst2;er;aKeFiEuDyC;an,ce,on;ce,no;an,ce;nDtC;!t;dDtC;!on;an,on;dFnC;dDisC;lav;en,on;!foOl9y;bby,gd0rCyd;is;i0Lke;bElDshC;al;al,lL;ek;nIrCshoi;at,nEtC;!raC;m,nd;aDhaCie;rd;rd8;!iDjam3nCs1;ie,y;to;kaMlazs,nHrC;n9rDtC;!holomew;eCy;tt;ey;dCeD;ar,iC;le;ar1Nb1Dd16fon15gust3hm12i0Zja0Yl0Bm07nTputsiSrGsaFugustEveDyCziz;a0kh0;ry;o,us;hi;aMchiKiJjun,mHnEon,tCy0;em,hCie,ur8;ur;aDoC;!ld;ud,v;aCin;an,nd8;!el,ki;baCe;ld;ta;aq;aMdHgel8tCw6;hoFoC;iDnC;!i8y;ne;ny;er7rCy;eDzC;ej;!as,i,j,s,w;!s;s,tolC;iCy;!y;ar,iEmaCos;nu5r;el;ne,r,t;aVbSdBeJfHiGl01onFphonsEt1vC;aPin;on;e,o;so,zo;!sR;!onZrC;ed;c,jaHksFssaHxC;!andC;er,rC;e,os,u;andCei;ar,er,r;ndC;ro;en;eDrecC;ht;rt8;dd3in,n,sC;taC;ir;ni;dDm6;ar;an,en;ad,eC;d,t;in;so;aGi,olErDvC;ik;ian8;f8ph;!o;mCn;!a;dGeFraDuC;!bakr,lfazl;hCm;am;!l;allFel,oulaye,ulC;!lDrahm0;an;ah,o;ah;av,on",
	"Uncountable": "true¦0:2E;1:2L;2:33;a2Ub2Lc29d22e1Rf1Ng1Eh16i11j0Yk0Wl0Rm0Hn0Do0Cp03rZsLt9uran2Jv7w3you gu0E;a5his17i4oo3;d,l;ldlife,ne;rm8t1;apor,ernacul29i3;neg28ol1Otae;eDhBiAo8r4un3yranny;a,gst1B;aff2Oea1Ko4ue nor3;th;o08u3;bleshoot2Ose1Tt;night,othpas1Vwn3;foEsfoE;me off,n;er3und1;e,mod2S;a,nnis;aDcCeBhAi9ki8o7p6t4u3weepstak0;g1Unshi2Hshi;ati08e3;am,el;ace2Keci0;ap,cc1meth2C;n,ttl0;lk;eep,ingl0or1C;lf,na1Gri0;ene1Kisso1C;d0Wfe2l4nd,t3;i0Iurn;m1Ut;abi0e4ic3;e,ke15;c3i01laxa11search;ogni10rea10;a9e8hys7luto,o5re3ut2;amble,mis0s3ten20;en1Zs0L;l3rk;i28l0EyH; 16i28;a24tr0F;nt3ti0M;i0s;bstetri24vercrowd1Qxyg09;a5e4owada3utella;ys;ptu1Ows;il poliZtional securi2;aAe8o5u3;m3s1H;ps;n3o1K;ey,o3;gamy;a3cha0Elancholy,rchandi1Htallurgy;sl0t;chine3g1Aj1Hrs,thema1Q; learn1Cry;aught1e6i5ogi4u3;ck,g12;c,s1M;ce,ghtn18nguis1LteratWv1;ath1isVss;ara0EindergartPn3;icke0Aowled0Y;e3upit1;a3llyfiGwel0G;ns;ce,gnor6mp5n3;forma00ter3;net,sta07;atiSort3rov;an18;a7e6isto09o3ung1;ckey,mework,ne4o3rseradi8spitali2use arrest;ky;s2y;adquarteXre;ir,libut,ppiHs3;hi3te;sh;ene8l6o5r3um,ymnas11;a3eZ;niUss;lf,re;ut3yce0F;en; 3ti0W;edit0Hpo3;ol;aNicFlour,o4urnit3;ure;od,rgive3uri1wl;ness;arCcono0LducaBlectr9n7quip8thi0Pvery6x3;ist4per3;ti0B;en0J;body,o08th07;joy3tertain3;ment;ici2o3;ni0H;tiS;nings,th;emi02i6o4raugh3ynas2;ts;pe,wnstai3;rs;abet0ce,s3;honZrepu3;te;aDelciChAivi07l8o3urrency;al,ld w6mmenta5n3ral,ttIuscoB;fusiHt 3;ed;ry;ar;assi01oth0;es;aos,e3;eMwK;us;d,rO;a8i6lood,owlHread5u3;ntGtt1;er;!th;lliarJs3;on;g3ss;ga3;ge;cKdviJeroGirFmBn6ppeal court,r4spi3thleL;rin;ithmet3sen3;ic;i6y3;o4th3;ing;ne;se;en5n3;es2;ty;ds;craft;bi8d3nau7;yna3;mi6;ce;id,ous3;ti3;cs",
	"Infinitive": "true¦0:9G;1:9T;2:AD;3:90;4:9Z;5:84;6:AH;7:A9;8:92;9:A0;A:AG;B:AI;C:9V;D:8R;E:8O;F:97;G:6H;H:7D;a94b8Hc7Jd68e4Zf4Mg4Gh4Ai3Qj3Nk3Kl3Bm34nou48o2Vp2Equ2Dr1Es0CtZuTvRwI;aOeNiLors5rI;eJiI;ng,te;ak,st3;d5e8TthI;draw,er;a2d,ep;i2ke,nIrn;d1t;aIie;liADniAry;nJpI;ho8Llift;cov1dJear8Hfound8DlIplug,rav82tie,ve94;eaAo3X;erIo;cut,go,staAFvalA3w2G;aSeQhNoMrIu73;aIe72;ffi3Smp3nsI;aBfo7CpI;i8oD;pp3ugh5;aJiJrIwaD;eat5i2;nk;aImA0;ch,se;ck3ilor,keImp1r8L;! paD;a0Ic0He0Fh0Bi0Al08mugg3n07o05p02qu01tUuLwI;aJeeIim;p,t5;ll7Wy;bNccMffLggeCmmKppJrI;mouFpa6Zvi2;o0re6Y;ari0on;er,i4;e7Numb;li9KmJsiIveD;de,st;er9it;aMe8MiKrI;ang3eIi2;ng27w;fIng;f5le;b,gg1rI;t3ve;a4AiA;a4UeJit,l7DoI;il,of;ak,nd;lIot7Kw;icEve;atGeak,i0O;aIi6;m,y;ft,ng,t;aKi6CoJriIun;nk,v6Q;ot,rt5;ke,rp5tt1;eIll,nd,que8Gv1w;!k,m;aven9ul8W;dd5tis1Iy;a0FeKiJoI;am,t,ut;d,p5;a0Ab08c06d05f01group,hea00iZjoi4lXmWnVpTq3MsOtMup,vI;amp,eJiIo3B;sEve;l,rI;e,t;i8rI;ie2ofE;eLiKpo8PtIurfa4;o24rI;aHiBuctu8;de,gn,st;mb3nt;el,hra0lIreseF;a4e71;d1ew,o07;aHe3Fo2;a7eFiIo6Jy;e2nq41ve;mbur0nf38;r0t;inKleBocus,rJuI;el,rbiA;aBeA;an4e;aBu4;ei2k8Bla43oIyc3;gni39nci3up,v1;oot,uI;ff;ct,d,liIp;se,ze;tt3viA;aAenGit,o7;aWerUinpoiFlumm1LoTrLuI;b47ke,niArIt;poDsuI;aFe;eMoI;cKd,fe4XhibEmo7noJpo0sp1tru6vI;e,i6o5L;un4;la3Nu8;aGclu6dJf1occupy,sup0JvI;a6BeF;etermi4TiB;aGllu7rtr5Ksse4Q;cei2fo4NiAmea7plex,sIva6;eve8iCua6;mp1rItrol,ve;a6It6E;bOccuNmEpMutLverIwe;l07sJtu6Yu0wI;helm;ee,h1F;gr5Cnu2Cpa4;era7i4Ipo0;py,r;ey,seItaH;r2ss;aMe0ViJoIultiply;leCu6Pw;micJnIspla4;ce,g3us;!k;iIke,na9;m,ntaH;aPeLiIo0u3N;ke,ng1quIv5;eIi6S;fy;aKnIss5;d,gI;th5;rn,ve;ng2Gu1N;eep,idnJnI;e4Cow;ap;oHuI;gg3xtaI;po0;gno8mVnIrk;cTdRfQgeChPitia7ju8q1CsNtKun6EvI;a6eIo11;nt,rt,st;erJimi6BoxiPrI;odu4u6;aBn,pr03ru6C;iCpi8tIu8;all,il,ruB;abEibE;eCo3Eu0;iIul9;ca7;i7lu6;b5Xmer0pI;aLer4Uin9ly,oJrI;e3Ais6Bo2;rt,se,veI;riA;le,rt;aLeKiIoiCuD;de,jaInd1;ck;ar,iT;mp1ng,pp5raIve;ng5Mss;ath1et,iMle27oLrI;aJeIow;et;b,pp3ze;!ve5A;gg3ve;aTer45i5RlSorMrJuI;lf4Cndrai0r48;eJiIolic;ght5;e0Qsh5;b3XeLfeEgJsI;a3Dee;eIi2;!t;clo0go,shIwa4Z;ad3F;att1ee,i36;lt1st5;a0OdEl0Mm0FnXquip,rWsVtGvTxI;aRcPeDhOiNpJtIu6;ing0Yol;eKi8lIo0un9;aHoI;it,re;ct,di7l;st,t;a3oDu3B;e30lI;a10u6;lt,mi28;alua7oI;ke,l2;chew,pou0tab19;a0u4U;aYcVdTfSgQhan4joy,lPqOrNsuMtKvI;e0YisI;a9i50;er,i4rI;aHenGuC;e,re;iGol0F;ui8;ar9iC;a9eIra2ulf;nd1;or4;ang1oIu8;r0w;irc3lo0ou0ErJuI;mb1;oaGy4D;b3ct;bKer9pI;hasiIow1;ze;aKody,rI;a4oiI;d1l;lm,rk;ap0eBuI;ci40de;rIt;ma0Rn;a0Re04iKo,rIwind3;aw,ed9oI;wn;agno0e,ff1g,mi2Kne,sLvI;eIul9;rIst;ge,t;aWbVcQlod9mant3pNru3TsMtI;iIoDu37;lJngI;uiA;!l;ol2ua6;eJlIo0ro2;a4ea0;n0r0;a2Xe36lKoIu0S;uIv1;ra9;aIo0;im;a3Kur0;b3rm;af5b01cVduBep5fUliTmQnOpMrLsiCtaGvI;eIol2;lop;ch;a20i2;aDiBloIoD;re,y;oIy;te,un4;eJoI;liA;an;mEv1;a4i0Ao06raud,y;ei2iMla8oKrI;ee,yI;!pt;de,mIup3;missi34po0;de,ma7ph1;aJrief,uI;g,nk;rk;mp5rk5uF;a0Dea0h0Ai09l08oKrIurta1G;a2ea7ipp3uI;mb3;ales4e04habEinci6ll03m00nIrro6;cXdUfQju8no7qu1sLtKvI;eIin4;ne,r9y;aHin2Bribu7;er2iLoli2Epi8tJuI;lt,me;itu7raH;in;d1st;eKiJoIroFu0;rm;de,gu8rm;ss;eJoI;ne;mn,n0;eIlu6ur;al,i2;buCe,men4pI;eIi3ly;l,te;eBi6u6;r4xiC;ean0iT;rcumveFte;eJirp,oI;o0p;riAw;ncIre5t1ulk;el;a02eSi6lQoPrKuI;iXrIy;st,y;aLeaKiJoad5;en;ng;stfeLtX;ke;il,l11mba0WrrMth1;eIow;ed;!coQfrie1LgPhMliLqueaKstJtrIwild1;ay;ow;th;e2tt3;a2eJoI;ld;ad;!in,ui3;me;bysEckfi8ff3tI;he;b15c0Rd0Iff0Ggree,l0Cm09n03ppZrXsQttOuMvJwaE;it;eDoI;id;rt;gIto0X;meF;aIeCraB;ch,in;pi8sJtoI;niA;aKeIi04u8;mb3rt,ss;le;il;re;g0Hi0ou0rI;an9i2;eaKly,oiFrI;ai0o2;nt;r,se;aMi0GnJtI;icipa7;eJoIul;un4y;al;ly0;aJu0;se;lga08ze;iKlI;e9oIu6;t,w;gn;ix,oI;rd;a03jNmiKoJsoI;rb;pt,rn;niIt;st1;er;ouJuC;st;rn;cLhie2knowled9quiItiva7;es4re;ce;ge;eQliOoKrJusI;e,tom;ue;mIst;moJpI;any,liA;da7;ma7;te;pt;andPduBet,i6oKsI;coKol2;ve;liArt,uI;nd;sh;de;ct;on",
	"Person": "true¦0:1Q;a29b1Zc1Md1Ee18f15g13h0Ri0Qj0Nk0Jl0Gm09n06o05p00rPsItCusain bolt,v9w4xzibit,y1;anni,oko on2uji,v1;an,es;en,o;a3ednesday adams,i2o1;lfram,o0Q;ll ferrell,z khalifa;lt disn1Qr1;hol,r0G;a2i1oltai06;n dies0Zrginia wo17;lentino rossi,n goG;a4h3i2ripp,u1yra banks;lZpac shakur;ger woods,mba07;eresa may,or;kashi,t1ylor;um,ya1B;a5carlett johanss0h4i3lobodan milosevic,no2ocr1Lpider1uperm0Fwami; m0Em0E;op dogg,w whi1H;egfried,nbad;akespeaTerlock holm1Sia labeouf;ddam hussa16nt1;a cla11ig9;aAe6i5o3u1za;mi,n dmc,paul,sh limbau1;gh;bin hood,d stew16nald1thko;in0Mo;han0Yngo starr,valdo;ese witherspo0i1mbrandt;ll2nh1;old;ey,y;chmaninoff,ffi,iJshid,y roma1H;a4e3i2la16o1uff daddy;cahont0Ie;lar,p19;le,rZ;lm17ris hilt0;leg,prah winfr0Sra;a2e1iles cra1Bostradam0J; yo,l5tt06wmQ;pole0s;a5e4i2o1ubar03;by,lie5net,rriss0N;randa ju1tt romn0M;ly;rl0GssiaB;cklemo1rkov,s0ta hari,ya angelou;re;ady gaga,e1ibera0Pu;bron jam0Xch wale1e;sa;anye west,e3i1obe bryant;d cudi,efer suther1;la0P;ats,sha;a2effers0fk,k rowling,rr tolki1;en;ck the ripp0Mwaharlal nehru,y z;liTnez,ron m7;a7e5i3u1;lk hog5mphrey1sa01;! bog05;l1tl0H;de; m1dwig,nry 4;an;ile selassFlle ber4m3rrison1;! 1;ford;id,mo09;ry;ast0iannis,o1;odwPtye;ergus0lorence nightinga08r1;an1ederic chopN;s,z;ff5m2nya,ustaXzeki1;el;eril lagasse,i1;le zatop1nem;ek;ie;a6e4i2octor w1rake;ho;ck w1ego maradoC;olf;g1mi lovaOnzel washingt0;as;l1nHrth vadR;ai lNt0;a8h5lint0o1thulhu;n1olio;an,fuci1;us;on;aucKop2ristian baMy1;na;in;millo,ptain beefhe4r1;dinal wols2son1;! palmF;ey;art;a8e5hatt,i3oHro1;ck,n1;te;ll g1ng crosby;atB;ck,nazir bhut2rtil,yon1;ce;to;nksy,rack ob1;ama;l 6r3shton kutch2vril lavig8yn ra1;nd;er;chimed2istot1;le;es;capo2paci1;no;ne",
	"Adjective": "true¦0:AI;1:BS;2:BI;3:BA;4:A8;5:84;6:AV;7:AN;8:AF;9:7H;A:BQ;B:AY;C:BC;D:BH;E:9Y;aA2b9Ec8Fd7We79f6Ng6Eh61i4Xj4Wk4Tl4Im41n3Po36p2Oquart7Pr2Ds1Dt14uSvOwFye29;aMeKhIiHoF;man5oFrth7G;dADzy;despreB1n w97s86;acked1UoleF;!sa6;ather1PeFll o70ste1D;!k5;nt1Ist6Ate4;aHeGiFola5T;bBUce versa,gi3Lle;ng67rsa5R;ca1gBSluAV;lt0PnLpHrGsFttermoBL;ef9Ku3;b96ge1; Hb32pGsFtiAH;ca6ide d4R;er,i85;f52to da2;a0Fbeco0Hc0Bd04e02f01gu1XheaBGiXkn4OmUnTopp06pRrNsJtHus0wF;aFiel3K;nt0rra0P;app0eXoF;ld,uS;eHi37o5ApGuF;perv06spec39;e1ok9O;en,ttl0;eFu5;cogn06gul2RlGqu84sF;erv0olv0;at0en33;aFrecede0E;id,rallel0;am0otic0;aFet;rri0tF;ch0;nFq26vers3;sur0terFv7U;eFrupt0;st0;air,inish0orese98;mploy0n7Ov97xpF;ect0lain0;eHisFocume01ue;clFput0;os0;cid0rF;!a8Scov9ha8Jlyi8nea8Gprivileg0sMwF;aFei9I;t9y;hGircumcFonvin2U;is0;aFeck0;lleng0rt0;b20ppea85ssuGttend0uthorF;iz0;mi8;i4Ara;aLeIhoHip 25oGrF;anspare1encha1i2;geth9leADp notch,rpB;rny,ugh6H;ena8DmpGrFs6U;r49tia4;eCo8P;leFst4M;nt0;a0Dc09e07h06i04ki03l01mug,nobbi4XoVpRqueami4XtKuFymb94;bHccinAi generis,pFr5;erFre7N;! dup9b,vi70;du0li7Lp6IsFurb7J;eq9Atanda9X;aKeJi16o2QrGubboFy4Q;rn;aightFin5GungS; fFfF;or7V;adfa9Pri6;lwa6Ftu82;arHeGir6NlendBot Fry;on;c3Qe1S;k5se; call0lImb9phistic16rHuFviV;ndFth1B;proof;dBry;dFub6; o2A;e60ipF;pe4shod;ll0n d7R;g2HnF;ceEg6ist9;am3Se9;co1Zem5lfFn6Are7; suf4Xi43;aGholFient3A;ar5;rlFt4A;et;cr0me,tisfac7F;aOeIheumatoBiGoF;bu8Ztt7Gy3;ghtFv3; 1Sf6X;cJdu8PlInown0pro69sGtF;ard0;is47oF;lu2na1;e1Suc45;alcit8Xe1ondi2;bBci3mpa1;aSePicayu7laOoNrGuF;bl7Tnjabi;eKiIoF;b7VfGmi49pFxi2M;er,ort81;a7uD;maFor,sti7va2;!ry;ciDexis0Ima2CpaB;in55puli8G;cBid;ac2Ynt 3IrFti2;ma40tFv7W;!i3Z;i2YrFss7R;anoBtF; 5XiF;al,s5V;bSffQkPld OnMrLth9utKverF;!aIbMdHhGni75seas,t,wF;ei74rou74;a63e7A;ue;ll;do1Ger,si6A;d3Qg2Aotu5Z; bFbFe on o7g3Uli7;oa80;fashion0school;!ay; gua7XbFha5Uli7;eat;eHligGsF;ce7er0So1C;at0;diFse;a1e1;aOeNiMoGuF;anc0de; moEnHrthFt6V;!eFwe7L;a7Krn;chaGdescri7Iprof30sF;top;la1;ght5;arby,cessa4ighbor5wlyw0xt;k0usiaFv3;ti8;aQeNiLoHuF;dIltiF;facet0p6;deHlGnFot,rbBst;ochro4Xth5;dy;rn,st;ddle ag0nF;dbloZi,or;ag9diocEga,naGrFtropolit4Q;e,ry;ci8;cIgenta,inHj0Fkeshift,mmGnFri4Oscu61ver18;da5Dy;ali4Lo4U;!stream;abEho;aOeLiIoFumberi8;ngFuti1R;stan3RtF;erm,i4H;ghtGteraF;l,ry,te;heart0wei5O;ft JgFss9th3;al,eFi0M;nda4;nguBps0te5;apGind5noF;wi8;ut;ad0itte4uniW;ce co0Hgno6Mll0Cm04nHpso 2UrF;a2releF;va1; ZaYcoWdReQfOgrNhibi4Ri05nMoLsHtFvalu5M;aAeF;nDrdepe2K;a7iGolFuboI;ub6ve1;de,gF;nifica1;rdi5N;a2er;own;eriIiLluenVrF;ar0eq5H;pt,rt;eHiGoFul1O;or;e,reA;fiFpe26termi5E;ni2;mpFnsideCrreA;le2;ccuCdeq5Ene,ppr4J;fFsitu,vitro;ro1;mJpF;arHeGl15oFrop9;li2r11;n2LrfeA;ti3;aGeFi18;d4BnD;tuE;egGiF;c0YteC;al,iF;tiF;ma2;ld;aOelNiLoFuma7;a4meInHrrGsFur5;ti6;if4E;e58o3U; ma3GsF;ick;ghfalut2HspF;an49;li00pf33;i4llow0ndGrdFtM; 05coEworki8;sy,y;aLener44iga3Blob3oKrGuF;il1Nng ho;aFea1Fizzl0;cGtF;ef2Vis;ef2U;ld3Aod;iFuc2D;nf2R;aVeSiQlOoJrF;aGeFil5ug3;q43tf2O;gFnt3S;i6ra1;lk13oHrF; keeps,eFge0Vm9tu41;g0Ei2Ds3R;liF;sh;ag4Mowe4uF;e1or45;e4nF;al,i2;d Gmini7rF;ti6ve1;up;bl0lDmIr Fst pac0ux;oGreacF;hi8;ff;ed,ili0R;aXfVlTmQnOqu3rMthere3veryday,xF;aApIquisi2traHuF;be48lF;ta1;!va2L;edRlF;icF;it;eAstF;whi6; Famor0ough,tiE;rou2sui2;erGiF;ne1;ge1;dFe2Aoq34;er5;ficF;ie1;g9sF;t,ygF;oi8;er;aWeMiHoGrFue;ea4owY;ci6mina1ne,r31ti8ubQ;dact2Jfficult,m,sGverF;ge1se;creGePjoi1paCtF;a1inA;et,te; Nadp0WceMfiLgeneCliJmuEpeIreliAsGvoF;id,ut;pFtitu2ul1L;eCoF;nde1;ca2ghF;tf13;a1ni2;as0;facto;i5ngero0I;ar0Ce09h07i06l05oOrIuF;rmudgeon5stoma4teF;sy;ly;aIeHu1EystalF; cleFli7;ar;epy;fFv17z0;ty;erUgTloSmPnGrpoCunterclVveFy;rt;cLdJgr21jIsHtrF;aFi2;dic0Yry;eq1Yta1;oi1ug3;escenFuN;di8;a1QeFiD;it0;atoDmensuCpF;ass1SulF;so4;ni3ss3;e1niza1;ci1J;ockwiD;rcumspeAvil;eFintzy;e4wy;leGrtaF;in;ba2;diac,ef00;a00ePiLliJoGrFuck nak0;and new,isk,on22;gGldface,naF; fi05fi05;us;nd,tF;he;gGpartisFzarE;an;tiF;me;autifOhiNlLnHsFyoN;iWtselF;li8;eGiFt;gn;aFfi03;th;at0oF;v0w;nd;ul;ckwards,rF;e,rT; priori,b13c0Zd0Tf0Ng0Ihe0Hl09mp6nt06pZrTsQttracti0MuLvIwF;aGkF;wa1B;ke,re;ant garGeraF;ge;de;diIsteEtF;heFoimmu7;nt07;re;to4;hGlFtu2;eep;en;bitIchiv3roHtF;ifiFsy;ci3;ga1;ra4;ry;pFt;aHetizi8rF;oprF;ia2;llFre1;ed,i8;ng;iquFsy;at0e;ed;cohKiJkaHl,oGriFterX;ght;ne,of;li7;ne;ke,ve;olF;ic;ad;ain07gressiIi6rF;eeF;ab6;le;ve;fGraB;id;ectGlF;ue1;ioF;na2; JaIeGvF;erD;pt,qF;ua2;ma1;hoc,infinitum;cuCquiGtu3u2;al;esce1;ra2;erSjeAlPoNrKsGuF;nda1;e1olu2trF;aAuD;se;te;eaGuF;pt;st;aFve;rd;aFe;ze;ct;ra1;nt",
	"Pronoun": "true¦elle,h3i2me,she,th0us,we,you;e0ou;e,m,y;!l,t;e,im",
	"Preposition": "true¦aPbMcLdKexcept,fIinGmid,notwithstandiWoDpXqua,sCt7u4v2w0;/o,hereSith0;! whHin,oW;ersus,i0;a,s a vis;n1p0;!on;like,til;h1ill,oward0;!s;an,ereby,r0;ough0u;!oM;ans,ince,o that,uch G;f1n0ut;!to;!f;! 0to;effect,part;or,r0;om;espite,own,u3;hez,irca;ar1e0oBy;sides,tween;ri7;bo8cross,ft7lo6m4propos,round,s1t0;!op;! 0;a whole,long 0;as;id0ong0;!st;ng;er;ut",
	"SportsTeam": "true¦0:18;1:1E;2:1D;3:14;a1Db15c0Sd0Kfc dallas,g0Ihouston 0Hindiana0Gjacksonville jagua0k0El0Am01new UoRpKqueens parkJreal salt lake,sBt6utah jazz,vancouver whitecaps,w4yW;ashington 4h10;natio1Mredski2wizar0W;ampa bay 7e6o4;ronto 4ttenham hotspur;blue ja0Mrapto0;nnessee tita2xasD;buccanee0ra0K;a8eattle 6porting kansas0Wt4; louis 4oke0V;c1Drams;marine0s4;eah13ounH;cramento Rn 4;antonio spu0diego 4francisco gJjose earthquak1;char08paB; ran07;a9h6ittsburgh 5ortland t4;imbe0rail blaze0;pirat1steele0;il4oenix su2;adelphia 4li1;eagl1philNunE;dr1;akland 4klahoma city thunder,rlando magic;athle0Lrai4;de0;england 8orleans 7york 4;g5je3knYme3red bul0Xy4;anke1;ian3;pelica2sain3;patrio3revolut4;ion;anchEeAi4ontreal impact;ami 8lwaukee b7nnesota 4;t5vi4;kings;imberwolv1wi2;rewe0uc0J;dolphi2heat,marli2;mphis grizz4ts;li1;a6eic5os angeles 4;clippe0dodFlaB;esterV; galaxy,ke0;ansas city 4nF;chiefs,roya0D; pace0polis col3;astr05dynamo,rocke3texa2;olden state warrio0reen bay pac4;ke0;allas 8e4i04od6;nver 6troit 4;lio2pisto2ti4;ge0;broncYnugge3;cowbo5maver4;icZ;ys;arEelLhAincinnati 8leveland 6ol4;orado r4umbus crew sc;api7ocki1;brow2cavalie0guar4in4;dia2;bengaVre4;ds;arlotte horAicago 4;b5cubs,fire,wh4;iteB;ea0ulQ;diff4olina panthe0; city;altimore Alackburn rove0oston 6rooklyn 4uffalo bilN;ne3;ts;cel5red4; sox;tics;rs;oriol1rave2;rizona Ast8tlanta 4;brav1falco2h4;awA;ns;es;on villa,r4;os;c6di4;amondbac4;ks;ardi4;na4;ls",
	"Unit": "true¦a07b04cXdWexVfTgRhePinYjoule0BkMlJmDnan08oCp9quart0Bsq ft,t7volts,w6y2ze3°1µ0;g,s;c,f,n;dVear1o0;ttR; 0s 0;old;att,b;erNon0;!ne02;ascals,e1i0;cXnt00;rcent,tJ;hms,unceY;/s,e4i0m²,²,³;/h,cro2l0;e0liK;!²;grLsR;gCtJ;it1u0;menQx;erPreP;b5elvins,ilo1m0notO;/h,ph,²;!byGgrEmCs;ct0rtzL;aJogrC;allonJb0ig3rB;ps;a0emtEl oz,t4;hrenheit,radG;aby9;eci3m1;aratDe1m0oulombD;²,³;lsius,nti0;gr2lit1m0;et0;er8;am7;b1y0;te5;l,ps;c2tt0;os0;econd1;re0;!s",
	"Noun|Gerund": "true¦0:3O;1:3M;2:3N;3:3D;4:32;5:2V;6:3E;7:3K;8:36;9:3J;A:3B;a3Pb37c2Jd27e23f1Vg1Sh1Mi1Ij1Gk1Dl18m13n11o0Wp0Pques0Sr0EsTtNunderMvKwFyDzB;eroi0oB;ni0o3P;aw2eB;ar2l3;aEed4hispe5i5oCrB;ap8est3i1;n0ErB;ki0r31;i1r2s9tc9;isualizi0oB;lunt1Vti0;stan4ta6;aFeDhin6iCraBy8;c6di0i2vel1M;mi0p8;aBs1;c9si0;l6n2s1;aUcReQhOiMkatKl2Wmo6nowJpeItFuCwB;ea5im37;b35f0FrB;fi0vB;e2Mi2J;aAoryt1KrCuB;d2KfS;etc9ugg3;l3n4;bCi0;ebBi0;oar4;gnBnAt1;a3i0;ip8oB;p8rte2u1;a1r27t1;hCo5reBulp1;a2Qe2;edu3oo3;i3yi0;aKeEi4oCuB;li0n2;oBwi0;fi0;aFcEhear7laxi0nDpor1sB;pon4tructB;r2Iu5;de5;or4yc3;di0so2;p8ti0;aFeacek20laEoCrBublis9;a1Teten4in1oces7;iso2siB;tio2;n2yi0;ckaAin1rB;ki0t1O;fEpeDrganiCvB;erco24ula1;si0zi0;ni0ra1;fe5;avi0QeBur7;gotia1twor6;aDeCi2oB;de3nito5;a2dita1e1ssaA;int0XnBrke1;ifUufactu5;aEeaDiBodAyi0;cen7f1mi1stB;e2i0;r2si0;n4ug9;iCnB;ea4it1;c6l3;ogAuB;dAgg3stif12;ci0llust0VmDnBro2;nova1sp0NterBven1;ac1vie02;agi2plo4;aDea1iCoBun1;l4w3;ki0ri0;nd3rB;roWvB;es1;aCene0Lli4rBui4;ee1ie0N;rde2the5;aHeGiDlCorBros1un4;e0Pmat1;ir1oo4;gh1lCnBs9;anZdi0;i0li0;e3nX;r0Zscina1;a1du01nCxB;erci7plo5;chan1di0ginB;ee5;aLeHiGoub1rCum8wB;el3;aDeCiB;bb3n6vi0;a0Qs7;wi0;rTscoDvi0;ba1coZlBvelo8;eCiB;ve5;ga1;nGti0;aVelebUhSlPoDrBur3yc3;aBos7yi0;f1w3;aLdi0lJmFnBo6pi0ve5;dDsCvinB;ci0;trBul1;uc1;muniDpB;lBo7;ai2;ca1;lBo5;ec1;c9ti0;ap8eaCimToBubT;ni0t9;ni0ri0;aBee5;n1t1;ra1;m8rCs1te5;ri0;vi0;aPeNitMlLoGrDuB;dge1il4llBr8;yi0;an4eat9oadB;cas1;di0;a1mEokB;i0kB;ee8;pi0;bi0;es7oa1;c9i0;gin2lonAt1;gi0;bysit1c6ki0tt3;li0;ki0;bando2cGdverti7gi0pproac9rgDssuCtB;trac1;mi0;ui0;hi0;si0;coun1ti0;ti0;ni0;ng",
	"PhrasalVerb": "true¦0:92;1:96;2:8H;3:8V;4:8A;5:83;6:85;7:98;8:90;9:8G;A:8X;B:8R;C:8U;D:8S;E:70;F:97;G:8Y;H:81;I:7H;J:79;a9Fb7Uc6Rd6Le6Jf5Ig50h4Biron0j47k40l3Em31n2Yo2Wp2Cquiet Hr1Xs0KtZuXvacuu6QwNyammerBzK;ero Dip LonK;e0k0;by,ov9up;aQeMhLiKor0Mrit19;mp0n3Fpe0r5s5;ackAeel Di0S;aLiKn33;gh 3Wrd0;n Dr K;do1in,oJ;it 79k5lk Lrm 69sh Kt83v60;aw3do1o7up;aw3in,oC;rgeBsK;e 2herE;a00eYhViRoQrMuKypP;ckErn K;do1in,oJup;aLiKot0y 30;ckl7Zp F;ck HdK;e 5Y;n7Wp 3Es5K;ck MdLe Kghten 6me0p o0Rre0;aw3ba4do1in,up;e Iy 2;by,oG;ink Lrow K;aw3ba4in,up;ba4ov9up;aKe 77ll62;m 2r 5M;ckBke Llk K;ov9shit,u47;aKba4do1in,leave,o4Dup;ba4ft9pa69w3;a0Vc0Te0Mh0Ii0Fl09m08n07o06p01quar5GtQuOwK;earMiK;ngLtch K;aw3ba4o8K; by;cKi6Bm 2ss0;k 64;aReQiPoNrKud35;aigh2Det75iK;ke 7Sng K;al6Yup;p Krm2F;by,in,oG;c3Ln3Lr 2tc4O;p F;c3Jmp0nd LrKveAy 2O;e Ht 2L;ba4do1up;ar3GeNiMlLrKurB;ead0ingBuc5;a49it 6H;c5ll o3Cn 2;ak Fe1Xll0;a3Bber 2rt0und like;ap 5Vow Duggl5;ash 6Noke0;eep NiKow 6;cLp K;o6Dup;e 68;in,oK;ff,v9;de19gn 4NnKt 6Gz5;gKkE; al6Ale0;aMoKu5W;ot Kut0w 7M;aw3ba4f48oC;c2WdeEk6EveA;e Pll1Nnd Orv5tK; Ktl5J;do1foLin,o7upK;!on;ot,r5Z;aw3ba4do1in,o33up;oCto;al66out0rK;ap65ew 6J;ilAv5;aXeUiSoOuK;b 5Yle0n Kstl5;aLba4do1inKo2Ith4Nu5P;!to;c2Xr8w3;ll Mot LpeAuK;g3Ind17;a2Wf3Po7;ar8in,o7up;ng 68p oKs5;ff,p18;aKelAinEnt0;c6Hd K;o4Dup;c27t0;aZeYiWlToQrOsyc35uK;ll Mn5Kt K;aKba4do1in,oJto47up;pa4Dw3;a3Jdo1in,o21to45up;attleBess KiNop 2;ah2Fon;iLp Kr4Zu1Gwer 6N;do1in,o6Nup;nt0;aLuK;gEmp 6;ce u20y 6D;ck Kg0le 4An 6p5B;oJup;el 5NncilE;c53ir 39n0ss MtLy K;ba4oG; Hc2R;aw3ba4in,oJ;pKw4Y;e4Xt D;aLerd0oK;dAt53;il Hrrow H;aTeQiPoLuK;ddl5ll I;c1FnkeyMp 6uthAve K;aKdo1in,o4Lup;l4Nw3; wi4K;ss0x 2;asur5e3SlLss K;a21up;t 6;ke Ln 6rKs2Ax0;k 6ryA;do,fun,oCsure,up;a02eViQoLuK;ck0st I;aNc4Fg MoKse0;k Kse4D;aft9ba4do1forw37in56o0Zu46;in,oJ;d 6;e NghtMnLsKve 00;ten F;e 2k 2; 2e46;ar8do1in;aMt LvelK; oC;do1go,in,o7up;nEve K;in,oK;pKut;en;c5p 2sh LtchBughAy K;do1o59;in4Po7;eMick Lnock K;do1oCup;oCup;eLy K;in,up;l Ip K;aw3ba4do1f04in,oJto,up;aMoLuK;ic5mpE;ke3St H;c43zz 2;a01eWiToPuK;nLrrKsh 6;y 2;keLt K;ar8do1;r H;lKneErse3K;d Ke 2;ba4dKfast,o0Cup;ear,o1;de Lt K;ba4on,up;aw3o7;aKlp0;d Ml Ir Kt 2;fKof;rom;f11in,o03uW;cPm 2nLsh0ve Kz2P;at,it,to;d Lg KkerP;do1in,o2Tup;do1in,oK;ut,v9;k 2;aZeTive Rloss IoMrLunK; f0S;ab hold,in43ow 2U; Kof 2I;aMb1Mit,oLr8th1IuK;nd9;ff,n,v9;bo7ft9hQw3;aw3bKdo1in,oJrise,up,w3;a4ir2H;ar 6ek0t K;aLb1Fdo1in,oKr8up;ff,n,ut,v9;cLhKl2Fr8t,w3;ead;ross;d aKng 2;bo7;a0Ee07iYlUoQrMuK;ck Ke2N;ar8up;eLighten KownBy 2;aw3oG;eKshe27; 2z5;g 2lMol Krk I;aKwi20;bo7r8;d 6low 2;aLeKip0;sh0;g 6ke0mKrKtten H;e F;gRlPnNrLsKzzle0;h F;e Km 2;aw3ba4up;d0isK;h 2;e Kl 1T;aw3fPin,o7;ht ba4ure0;ePnLsK;s 2;cMd K;fKoG;or;e D;d04l 2;cNll Krm0t1G;aLbKdo1in,o09sho0Eth08victim;a4ehi2O;pa0C;e K;do1oGup;at Kdge0nd 12y5;in,o7up;aOi1HoNrK;aLess 6op KuN;aw3b03in,oC;gBwB; Ile0ubl1B;m 2;a0Ah05l02oOrLut K;aw3ba4do1oCup;ackBeep LoKy0;ss Dwd0;by,do1in,o0Uup;me NoLuntK; o2A;k 6l K;do1oG;aRbQforOin,oNtKu0O;hLoKrue;geth9;rough;ff,ut,v9;th,wK;ard;a4y;paKr8w3;rt;eaLose K;in,oCup;n 6r F;aNeLiK;ll0pE;ck Der Kw F;on,up;t 2;lRncel0rOsMtch LveE; in;o1Nup;h Dt K;doubt,oG;ry LvK;e 08;aw3oJ;l Km H;aLba4do1oJup;ff,n,ut;r8w3;a0Ve0MiteAl0Fo04rQuK;bblNckl05il0Dlk 6ndl05rLsKtMy FzzA;t 00;n 0HsK;t D;e I;ov9;anWeaUiLush K;oGup;ghQng K;aNba4do1forMin,oLuK;nd9p;n,ut;th;bo7lKr8w3;ong;teK;n 2;k K;do1in,o7up;ch0;arTg 6iRn5oPrNssMttlLunce Kx D;aw3ba4;e 6; ar8;e H;do1;k Dt 2;e 2;l 6;do1up;d 2;aPeed0oKurt0;cMw K;aw3ba4do1o7up;ck;k K;in,oC;ck0nk0stA; oQaNef 2lt0nd K;do1ov9up;er;up;r Lt K;do1in,oCup;do1o7;ff,nK;to;ck Pil0nMrgLsK;h D;ainBe D;g DkB; on;in,o7;aw3do1in,oCup;ff,ut;ay;ct FdQir0sk MuctionA; oG;ff;ar8o7;ouK;nd; o7;d K;do1oKup;ff,n;wn;o7up;ut",
	"ProperNoun": "true¦aIbDc8dalhousHe7f5gosford,h4iron maiden,kirby,landsdowne,m2nis,r1s0wembF;herwood,paldiB;iel,othwe1;cgi0ercedes,issy;ll;intBudsB;airview,lorence,ra0;mpt9nco;lmo,uro;a1h0;arlt6es5risti;rl0talina;et4i0;ng;arb3e0;et1nt0rke0;ley;on;ie;bid,jax",
	"Person|Place": "true¦a8d6h4jordan,k3orlando,s1vi0;ctor9rgin9;a0ydney;lvador,mara,ntia4;ent,obe;amil0ous0;ton;arw2ie0;go;lexandr1ust0;in;ia",
	"LastName": "true¦0:BR;1:BF;2:B5;3:BH;4:AX;5:9Y;6:B6;7:BK;8:B0;9:AV;A:AL;B:8Q;C:8G;D:7K;E:BM;F:AH;aBDb9Zc8Wd88e81f7Kg6Wh64i60j5Lk4Vl4Dm39n2Wo2Op25quispe,r1Ls0Pt0Ev03wTxSyKzG;aIhGimmerm6A;aGou,u;ng,o;khar5ytsE;aKeun9BiHoGun;koya32shiBU;!lG;diGmaz;rim,z;maGng;da,g52mo83sGzaC;aChiBV;iao,u;aLeJiHoGright,u;jcA5lff,ng;lGmm0nkl0sniewsC;kiB1liams33s3;bGiss,lt0;b,er,st0;a6Vgn0lHtG;anabe,s3;k0sh,tG;e2Non;aLeKiHoGukD;gt,lk5roby5;dHllalGnogr3Kr1Css0val3S;ba,ob1W;al,ov4;lasHsel8W;lJn dIrgBEsHzG;qu7;ilyEqu7siljE;en b6Aijk,yk;enzueAIverde;aPeix1VhKi2j8ka43oJrIsui,uG;om5UrG;c2n0un1;an,emblA7ynisC;dorAMlst3Km4rrAth;atch0i8UoG;mHrG;are84laci79;ps3sG;en,on;hirDkah9Mnaka,te,varA;a06ch01eYhUiRmOoMtIuHvGzabo;en9Jobod3N;ar7bot4lliv2zuC;aIeHoG;i7Bj4AyanAB;ele,in2FpheBvens25;l8rm0;kol5lovy5re7Tsa,to,uG;ng,sa;iGy72;rn5tG;!h;l71mHnGrbu;at9cla9Egh;moBo7M;aIeGimizu;hu,vchG;en8Luk;la,r1G;gu9infe5YmGoh,pulveA7rra5P;jGyG;on5;evi6iltz,miHneid0roed0uGwarz;be3Elz;dHtG;!t,z;!t;ar4Th8ito,ka4OlJnGr4saCto,unde19v4;ch7dHtGz;a5Le,os;b53e16;as,ihDm4Po0Y;aVeSiPoJuHyG;a6oo,u;bio,iz,sG;so,u;bKc8Fdrigue67ge10j9YmJosevelt,sItHux,wG;e,li6;a9Ch;enb4Usi;a54e4L;erts15i93;bei4JcHes,vGzzo;as,e9;ci,hards12;ag2es,iHut0yG;es,nol5N;s,t0;dImHnGsmu97v6C;tan1;ir7os;ic,u;aUeOhMiJoHrGut8;asad,if6Zochazk27;lishc2GpGrti72u10we76;e3Aov51;cHe45nG;as,to;as70hl0;aGillips;k,m,n6I;a3Hde3Wete0Bna,rJtG;ersHrovGters54;!a,ic;!en,on;eGic,kiBss3;i9ra,tz,z;h86k,padopoulIrk0tHvG;ic,l4N;el,te39;os;bMconn2Ag2TlJnei6PrHsbor6XweBzG;dem7Rturk;ella4DtGwe6N;ega,iz;iGof7Hs8I;vGyn1R;ei9;aSri1;aPeNiJoGune50ym2;rHvGwak;ak4Qik5otn66;odahl,r4S;cholsZeHkolGls4Jx3;ic,ov84;ls1miG;!n1;ils3mG;co4Xec;gy,kaGray2sh,var38;jiGmu9shiG;ma;a07c04eZiWoMuHyeG;rs;lJnIrGssoli6S;atGp03r7C;i,ov4;oz,te58;d0l0;h2lOnNo0RrHsGza1A;er,s;aKeJiIoz5risHtG;e56on;!on;!n7K;au,i9no,t5J;!lA;r1Btgome59;i3El0;cracFhhail5kkeHlG;l0os64;ls1;hmeJiIj30lHn3Krci0ssiGyer2N;!er;n0Po;er,j0;dDti;cartHlG;aughl8e2;hy;dQe7Egnu68i0jer3TkPmNnMrItHyG;er,r;ei,ic,su21thews;iHkDquAroqu8tinG;ez,s;a5Xc,nG;!o;ci5Vn;a5UmG;ad5;ar5e6Kin1;rig77s1;aVeOiLoJuHyG;!nch;k4nGo;d,gu;mbarGpe3Fvr4we;di;!nGu,yana2B;coln,dG;b21holm,strom;bedEfeKhIitn0kaHn8rGw35;oy;!j;m11tG;in1on1;bvGvG;re;iGmmy,ng,rs2Qu,voie,ws3;ne,t1F;aZeYh2iWlUnez50oNrJuHvar2woG;k,n;cerGmar68znets5;a,o34;aHem0isGyeziu;h23t3O;m0sni4Fus3KvG;ch4O;bay57ch,rh0Usk16vaIwalGzl5;czGsC;yk;cIlG;!cGen4K;huk;!ev4ic,s;e8uiveG;rt;eff0kGl4mu9nnun1;ucF;ll0nnedy;hn,llKminsCne,pIrHstra3Qto,ur,yGzl5;a,s0;j0Rls22;l2oG;or;oe;aPenOha6im14oHuG;ng,r4;e32hInHrge32u6vG;anD;es,ss3;anHnsG;en,on,t3;nesGs1R;en,s1;kiBnings,s1;cJkob4EnGrv0E;kDsG;en,sG;en0Ion;ks3obs2A;brahimDglesi5Nke5Fl0Qno07oneIshikHto,vanoG;u,v54;awa;scu;aVeOiNjaltal8oIrist50uG;!aGb0ghAynh;m2ng;a6dz4fIjgaa3Hk,lHpUrGwe,x3X;ak1Gvat;mAt;er,fm3WmG;ann;ggiBtchcock;iJmingw4BnHrGss;nand7re9;deGriks1;rs3;kkiHnG;on1;la,n1;dz4g1lvoQmOns0ZqNrMsJuIwHyG;asFes;kiB;g1ng;anHhiG;mo14;i,ov0J;di6p0r10t;ue;alaG;in1;rs1;aVeorgUheorghe,iSjonRoLrJuGw3;errGnnar3Co,staf3Ctierr7zm2;a,eG;ro;ayli6ee2Lg4iffithGub0;!s;lIme0UnHodGrbachE;e,m2;calvAzale0S;dGubE;bGs0E;erg;aj,i;bs3l,mGordaO;en7;iev3U;gnMlJmaIndFo,rGsFuthi0;cGdn0za;ia;ge;eaHlG;agh0i,o;no;e,on;aVerQiLjeldsted,lKoIrHuG;chs,entAji41ll0;eem2iedm2;ntaGrt8urni0wl0;na;emi6orA;lipIsHtzgeraG;ld;ch0h0;ovG;!ic;hatDnanIrG;arGei9;a,i;deY;ov4;b0rre1D;dKinsJriksIsGvaB;cob3GpGtra3D;inoza,osiQ;en,s3;te8;er,is3warG;ds;aXePiNjurhuMoKrisco15uHvorakG;!oT;arte,boHmitru,nn,rGt3C;and,ic;is;g2he0Omingu7nErd1ItG;to;us;aGcki2Hmitr2Ossanayake,x3;s,z; JbnaIlHmirGrvisFvi,w2;!ov4;gado,ic;th;bo0groot,jo6lHsilGvriA;va;a cruz,e3uG;ca;hl,mcevsCnIt2WviG;dGes,s;ov,s3;ielsGku22;!en;ki;a0Be06hRiobQlarkPoIrGunningh1H;awfo0RivGuz;elli;h1lKntJoIrGs2Nx;byn,reG;a,ia;ke,p0;i,rer2K;em2liB;ns;!e;anu;aOeMiu,oIristGu6we;eGiaG;ns1;i,ng,p9uHwGy;!dH;dGng;huJ;!n,onGu6;!g;kJnIpm2ttHudhGv7;ry;erjee,o14;!d,g;ma,raboG;rty;bJl0Cng4rG;eghetHnG;a,y;ti;an,ota1C;cerAlder3mpbeLrIstGvadi0B;iGro;llo;doHl0Er,t0uGvalho;so;so,zo;ll;a0Fe01hYiXlUoNrKuIyG;rLtyG;qi;chan2rG;ke,ns;ank5iem,oGyant;oks,wG;ne;gdan5nIruya,su,uchaHyKziG;c,n5;rd;darGik;enG;ko;ov;aGond15;nco,zG;ev4;ancFshw16;a08oGuiy2;umGwmG;ik;ckRethov1gu,ktPnNrG;gJisInG;ascoGds1;ni;ha;er,mG;anG;!n;gtGit7nP;ss3;asF;hi;er,hG;am;b4ch,ez,hRiley,kk0ldw8nMrIshHtAu0;es;ir;bInHtlGua;ett;es,i0;ieYosa;dGik;a9yoG;padhyG;ay;ra;k,ng;ic;bb0Acos09d07g04kht05lZnPrLsl2tJyG;aHd8;in;la;chis3kiG;ns3;aImstro6sl2;an;ng;ujo,ya;dJgelHsaG;ri;ovG;!a;ersJov,reG;aGjEws;ss1;en;en,on,s3;on;eksejEiyEmeiIvG;ar7es;ez;da;ev;arwHuilG;ar;al;ams,l0;er;ta;as",
	"Ordinal": "true¦eBf7nin5s3t0zeroE;enDhir1we0;lfCn7;d,t3;e0ixt8;cond,vent7;et0th;e6ie7;i2o0;r0urt3;tie4;ft1rst;ight0lev1;e0h,ie1;en0;th",
	"Cardinal": "true¦bEeBf5mEnine7one,s4t0zero;en,h2rDw0;e0o;lve,n5;irt6ousands,ree;even2ix2;i3o0;r1ur0;!t2;ty;ft0ve;e2y;ight0lev1;!e0y;en;illions",
	"Multiple": "true¦b3hundred,m3qu2se1t0;housand,r2;pt1xt1;adr0int0;illion",
	"City": "true¦0:74;1:61;2:6G;3:6J;4:5S;a68b53c4Id48e44f3Wg3Hh39i31j2Wk2Fl23m1Mn1Co19p0Wq0Ur0Os05tRuQvLwDxiBy9z5;a7h5i4Muri4O;a5e5ongsh0;ng3H;greb,nzib5G;ang2e5okoha3Sunfu;katerin3Hrev0;a5n0Q;m5Hn;arsBeAi6roclBu5;h0xi,zh5P;c7n5;d5nipeg,terth4;hoek,s1L;hi5Zkl3A;l63xford;aw;a8e6i5ladivost5Molgogr6L;en3lni6S;ni22r5;o3saill4N;lenc4Wncouv3Sr3ughn;lan bat1Crumqi,trecht;aFbilisi,eEheDiBo9r7u5;l21n63r5;in,ku;i5ondh62;es51poli;kyo,m2Zron1Pulo5;n,uS;an5jua3l2Tmisoa6Bra3;j4Tshui; hag62ssaloni2H;gucigal26hr0l av1U;briz,i6llinn,mpe56ng5rtu,shk2R;i3Esh0;an,chu1n0p2Eyu0;aEeDh8kopje,owe1Gt7u5;ra5zh4X;ba0Ht;aten is55ockholm,rasbou67uttga2V;an8e6i5;jiazhua1llo1m5Xy0;f50n5;ya1zh4H;gh3Kt4Q;att45o1Vv44;cramen16int ClBn5o paulo,ppo3Rrajevo; 7aa,t5;a 5o domin3E;a3fe,m1M;antonio,die3Cfrancisco,j5ped3Nsalvad0J;o5u0;se;em,t lake ci5Fz25;lou58peters24;a9e8i6o5;me,t59;ga,o5yadh;! de janei3F;cife,ims,nn3Jykjavik;b4Sip4lei2Inc2Pwalpindi;ingdao,u5;ez2i0Q;aFeEhDiCo9r7u6yong5;ya1;eb59ya1;a5etor3M;g52to;rt5zn0; 5la4Co;au prin0Melizabe24sa03;ls3Prae5Atts26;iladelph3Gnom pe1Aoenix;ki1tah tik3E;dua,lerYnaji,r4Ot5;na,r32;ak44des0Km1Mr6s5ttawa;a3Vlo;an,d06;a7ew5ing2Fovosibir1Jyc; 5cast36;del24orlea44taip14;g8iro4Wn5pl2Wshv33v0;ch6ji1t5;es,o1;a1o1;a6o5p4;ya;no,sa0W;aEeCi9o6u5;mb2Ani26sc3Y;gadishu,nt6s5;c13ul;evideo,pelli1Rre2Z;ami,l6n14s5;kolc,sissauga;an,waukee;cca,d5lbour2Mmph41ndo1Cssi3;an,ell2Xi3;cau,drAkass2Sl9n8r5shh4A;aca6ib5rakesh,se2L;or;i1Sy;a4EchFdal0Zi47;mo;id;aDeAi8o6u5vSy2;anMckn0Odhia3;n5s angel26;d2g bea1N;brev2Be3Lma5nz,sb2verpo28;!ss27; ma39i5;c5pzig;est16; p6g5ho2Wn0Cusan24;os;az,la33;aHharFiClaipeBo9rak0Du7y5;iv,o5;to;ala lump4n5;mi1sh0;hi0Hlka2Xpavog4si5wlo2;ce;da;ev,n5rkuk;gst2sha5;sa;k5toum;iv;bHdu3llakuric0Qmpa3Fn6ohsiu1ra5un1Iwaguc0Q;c0Pj;d5o,p4;ah1Ty;a7e6i5ohannesV;l1Vn0;dd36rusalem;ip4k5;ar2H;bad0mph1OnArkutUs7taXz5;mir,tapala5;pa;fah0l6tanb5;ul;am2Zi2H;che2d5;ianap2Mo20;aAe7o5yder2W; chi mi5ms,nolulu;nh;f6lsin5rakli2;ki;ei;ifa,lifax,mCn5rb1Dva3;g8nov01oi;aFdanEenDhCiPlasgBo9raz,u5;a5jr23;dal6ng5yaquil;zh1J;aja2Oupe;ld coa1Bthen5;bu2S;ow;ent;e0Uoa;sk;lw7n5za;dhi5gt1E;nag0U;ay;aisal29es,o8r6ukuya5;ma;ankfu5esno;rt;rt5sh0; wor6ale5;za;th;d5indhov0Pl paso;in5mont2;bur5;gh;aBe8ha0Xisp4o7resd0Lu5;b5esseldorf,nkirk,rb0shanbe;ai,l0I;ha,nggu0rtmu13;hradSl6nv5troit;er;hi;donghIe6k09l5masc1Zr es sala1KugavpiY;i0lU;gu,je2;aJebu,hAleve0Vo5raio02uriti1Q;lo7n6penhag0Ar5;do1Ok;akKst0V;gUm5;bo;aBen8i6ongqi1ristchur5;ch;ang m7ca5ttago1;go;g6n5;ai;du,zho1;ng5ttogr14;ch8sha,zh07;gliari,i9lga8mayenJn6pe town,r5tanO;acCdiff;ber1Ac5;un;ry;ro;aWeNhKirmingh0WoJr9u5;chareTdapeTenos air7r5s0tu0;g5sa;as;es;a9is6usse5;ls;ba6t5;ol;ne;sil8tisla7zzav5;il5;le;va;ia;goZst2;op6ubaneshw5;ar;al;iCl9ng8r5;g6l5n;in;en;aluru,hazi;fa6grade,o horizon5;te;st;ji1rut;ghd0BkFn9ot8r7s6yan n4;ur;el,r07;celo3i,ranquil09;ou;du1g6ja lu5;ka;alo6k5;ok;re;ng;ers5u;field;a05b02cc01ddis aba00gartaZhmedXizawl,lSmPnHqa00rEsBt7uck5;la5;nd;he7l5;an5;ta;ns;h5unci2;dod,gab5;at;li5;ngt2;on;a8c5kaOtwerp;hora6o3;na;ge;h7p5;ol5;is;eim;aravati,m0s5;terd5;am; 7buquerq6eppo,giers,ma5;ty;ue;basrah al qadim5mawsil al jadid5;ah;ab5;ad;la;ba;ra;idj0u dha5;bi;an;lbo6rh5;us;rg",
	"Region": "true¦0:2O;1:2L;2:2U;3:2F;a2Sb2Fc21d1Wes1Vf1Tg1Oh1Ki1Fj1Bk16l13m0Sn09o07pYqVrSsJtEuBverAw6y4zacatec2W;akut0o0Fu4;cat1k09;a5est 4isconsin,yomi1O;bengal,virgin0;rwick3shington4;! dc;acruz,mont;dmurt0t4;ah,tar4; 2Pa12;a6e5laxca1Vripu21u4;scaEva;langa2nnessee,x2J;bas10m4smQtar29;aulip2Hil nadu;a9elang07i7o5taf16u4ylh1J;ff02rr09s1E;me1Gno1Uuth 4;cZdY;ber0c4kkim,naloa;hu1ily;n5rawak,skatchew1xo4;ny; luis potosi,ta catari2;a4hodeA;j4ngp0C;asth1shahi;ingh29u4;e4intana roo;bec,en6retaro;aAe6rince edward4unjab; i4;sl0G;i,n5r4;ak,nambu0F;a0Rnsylv4;an0;ha0Pra4;!na;axa0Zdisha,h4klaho21ntar4reg7ss0Dx0I;io;aLeEo6u4;evo le4nav0X;on;r4tt18va scot0;f9mandy,th4; 4ampton3;c6d5yo4;rk3;ako1O;aroli2;olk;bras1Nva0Dw4; 6foundland4;! and labrad4;or;brunswick,hamp3jers5mexiTyork4;! state;ey;galPyarit;aAeghala0Mi6o4;nta2r4;dov0elos;ch6dlanDn5ss4zor11;issippi,ouri;as geraPneso18;ig1oac1;dhy12harasht0Gine,lac07ni5r4ssachusetts;anhao,i el,ylG;p4toba;ur;anca3e4incoln3ouisI;e4iR;ds;a6e5h4omi;aka06ul2;dah,lant1ntucky,ra01;bardino,lmyk0ns0Qr4;achay,el0nata0X;alis6har4iangxi;kh4;and;co;daho,llino7n4owa;d5gush4;et0;ia2;is;a6ert5i4un1;dalFm0D;ford3;mp3rya2waii;ansu,eorg0lou7oa,u4;an4izhou,jarat;ajuato,gdo4;ng;cester3;lori4uji1;da;sex;ageUe7o5uran4;go;rs4;et;lawaMrby3;aFeaEh9o4rim08umbr0;ahui7l6nnectic5rsi4ventry;ca;ut;i03orado;la;e5hattisgarh,i4uvash0;apRhuahua;chn5rke4;ss0;ya;ra;lGm4;bridge3peche;a9ihar,r8u4;ck4ryat0;ingham3;shi4;re;emen,itish columb0;h0ja cal8lk7s4v7;hkorto4que;st1;an;ar0;iforn0;ia;dygHguascalientes,lBndhr9r5ss4;am;izo2kans5un4;achal 7;as;na;a 4;pradesh;a6ber5t4;ai;ta;ba5s4;ka;ma;ea",
	"Place": "true¦0:4T;1:4V;2:44;3:4B;4:3I;a4Eb3Gc2Td2Ge26f25g1Vh1Ji1Fk1Cl14m0Vn0No0Jp08r04sTtNuLvJw7y5;a5o0Syz;kut1Bngtze;aDeChitBi9o5upatki,ycom2P;ki26o5;d5l1B;b3Ps5;i4to3Y;c0SllowbroCn5;c2Qgh2;by,chur1P;ed0ntw3Gs22;ke6r3St5;erf1f1; is0Gf3V;auxha3Mirgin is0Jost5;ok;laanbaatar,pto5xb3E;n,wn;a9eotihuac43h7ive49o6ru2Nsarskoe selo,u5;l2Dzigo47;nto,rquay,tt2J;am3e 5orn3E;bronx,hamptons;hiti,j mah0Iu1N;aEcotts bluff,eCfo,herbroQoApring9t7u5yd2F;dbu1Wn5;der03set3B;aff1ock2Nr5;atf1oud;hi37w24;ho,uth5; 1Iam1Zwo3E;a5i2O;f2Tt0;int lawrence riv3Pkhal2D;ayleigh,ed7i5oc1Z;chmo1Eo gran4ver5;be1Dfr09si4; s39cliffe,hi2Y;aCe9h8i5ompeii,utn2;c6ne5tcai2T; 2Pc0G;keri13t0;l,x;k,lh2mbr6n5r2J;n1Hzance;oke;cif38pahanaumokuak30r5;k5then0;si4w1K;ak7r6x5;f1l2X;ange county,d,f1inoco;mTw1G;e8i1Uo5;r5tt2N;th5wi0E; 0Sam19;uschwanste1Pw5; eng6a5h2market,po36;rk;la0P;a8co,e6i5uc;dt1Yll0Z;adow5ko0H;lands;chu picchu,gad2Ridsto1Ql8n7ple6r5;kh2; g1Cw11;hatt2Osf2B;ibu,t0ve1Z;a8e7gw,hr,in5owlOynd02;coln memori5dl2C;al;asi4w3;kefr7mbe1On5s,x;ca2Ig5si05;f1l27t0;ont;azan kreml14e6itchen2Gosrae,rasnoyar5ul;sk;ns0Hs1U;ax,cn,lf1n6ps5st;wiN;d5glew0Lverness;ian27ochina;aDeBi6kg,nd,ov5unti2H;d,enweep;gh6llc5;reL;bu03l5;and5;!s;r5yw0C;ef1tf1;libu24mp6r5stings;f1lem,row;stead,t0;aDodavari,r5uelph;avenAe5imsS;at 8en5; 6f1Fwi5;ch;acr3vall1H;brita0Flak3;hur5;st;ng3y villa0W;airhavHco,ra;aAgli9nf17ppi8u7ver6x5;et1Lf1;glad3t0;rope,st0;ng;nt0;rls1Ls5;t 5;e5si4;nd;aCe9fw,ig8o7ryd6u5xb;mfri3nstab00rh2tt0;en;nca18rcKv19wnt0B;by;n6r5vonpo1D;ry;!h2;nu8r5;l6t5;f1moor;ingt0;be;aLdg,eIgk,hClBo5royd0;l6m5rnwa0B;pt0;c7lingw6osse5;um;ood;he0S;earwat0St;a8el6i5uuk;chen itza,mney ro07natSricahua;m0Zt5;enh2;mor5rlottetPth2;ro;dar 5ntervilA;breaks,faZg5;rove;ld9m8r5versh2;lis6rizo pla5;in;le;bLpbellf1;weQ;aZcn,eNingl01kk,lackLolt0r5uckV;aGiAo5;ckt0ok5wns cany0;lyn,s5;i4to5;ne;de;dge6gh5;am,t0;n6t5;own;or5;th;ceb6m5;lNpt0;rid5;ge;bu5pool,wa8;rn;aconsfEdf1lBr9verly7x5;hi5;ll; hi5;lls;wi5;ck; air,l5;ingh2;am;ie5;ld;ltimore,rnsl6tters5;ea;ey;bLct0driadic,frica,ginJlGmFn9rc8s7tl6yleOzor3;es;!ant8;hcroft,ia; de triomphe,t6;adyr,ca8dov9tarct5;ic5; oce5;an;st5;er;ericas,s;be6dersh5hambra,list0;ot;rt0;cou5;rt;bot7i5;ngd0;on;sf1;ord",
	"Country": "true¦0:38;1:2L;2:3B;a2Xb2Ec22d1Ye1Sf1Mg1Ch1Ai14j12k0Zl0Um0Gn05om2pZqat1KrXsKtCu7v5wal4yemTz3;a25imbabwe;es,lis and futu2Y;a3enezue32ietnam;nuatu,tican city;gTk6nited 4ruXs3zbeE; 2Ca,sr;arab emirat0Kkingdom,states3;! of am2Y;!raiV;a8haCimor les0Co7rinidad 5u3;nis0rk3valu;ey,me2Zs and caic1V;and t3t3;oba1L;go,kel10nga;iw2ji3nz2T;ki2V;aDcotl1eCi9lov8o6pa2Dri lanka,u5w3yr0;az3edAitzerl1;il1;d2riname;lomon1Xmal0uth 3;afr2KkMsud2;ak0en0;erra leoFn3;gapo1Yt maart3;en;negLrb0ychellZ;int 3moa,n marino,udi arab0;hele26luc0mart21;epublic of ir0Eom2Euss0w3;an27;a4eIhilippinUitcairn1Mo3uerto riN;l1rtugF;ki2Dl4nama,pua new0Vra3;gu7;au,esti3;ne;aBe9i7or3;folk1Ith4w3;ay; k3ern mariana1D;or0O;caragua,ger3ue;!ia;p3ther1Aw zeal1;al;mib0u3;ru;a7exi6icro0Bo3yanm06;ldova,n3roc5zambA;a4gol0t3;enegro,serrat;co;cAdagasc01l7r5urit4yot3;te;an0i16;shall0Xtin3;ique;a4div3i,ta;es;wi,ys0;ao,ed02;a6e5i3uxembourg;b3echtenste12thu1G;er0ya;ban0Isotho;os,tv0;azakh1Fe4iriba04o3uwait,yrgyz1F;rXsovo;eling0Knya;a3erG;ma16p2;c7nd6r4s3taly,vory coast;le of m2rael;a3el1;n,q;ia,oJ;el1;aiTon3ungary;dur0Ng kong;aBermany,ha0QibraltAre8u3;a6ern5inea3ya0P;! biss3;au;sey;deloupe,m,tema0Q;e3na0N;ce,nl1;ar;bUmb0;a7i6r3;ance,ench 3;guia0Epoly3;nes0;ji,nl1;lklandUroeU;ast tim7cu6gypt,l salv6ngl1quatorial4ritr5st3thiop0;on0; guin3;ea;ad3;or;enmark,jibou5ominica4r con3;go;!n C;ti;aBentral african Ah8o5roat0u4yprRzech3; 9ia;ba,racao;c4lo3morQngo brazzaville,okGsta r04te de ivoiL;mb0;osE;i3ristmasG;le,na;republic;m3naUpe verde,ymanA;bod0ero3;on;aGeDhut2o9r5u3;lgar0r3;kina faso,ma,undi;azil,itish 3unei;virgin3; is3;lands;liv0nai5snia and herzegoviHtswaHuvet3; isl1;and;re;l3n8rmuG;ar3gium,ize;us;h4ngladesh,rbad3;os;am4ra3;in;as;fghaGlDmBn6r4ustr3zerbaij2;al0ia;genti3men0uba;na;dorra,g5t3;arct7igua and barbu3;da;o3uil3;la;er3;ica;b3ger0;an0;ia;ni3;st2;an",
	"FirstName": "true¦aTblair,cQdOfrancoZgabMhinaLilya,jHkClBm6ni4quinn,re3s0;h0umit,yd;ay,e0iloh;a,lby;g9ne;co,ko0;!s;a1el0ina,org6;!okuhF;ds,naia,r1tt0xiB;i,y;ion,lo;ashawn,eif,uca;a3e1ir0rM;an;lsFn0rry;dall,yat5;i,sD;a0essIie,ude;i1m0;ie,mG;me;ta;rie0y;le;arcy,ev0;an,on;as1h0;arl8eyenne;ey,sidy;drien,kira,l4nd1ubr0vi;ey;i,r0;a,e0;a,y;ex2f1o0;is;ie;ei,is",
	"WeekDay": "true¦fri2mon2s1t0wednesd3;hurs1ues1;aturd1und1;!d0;ay0;!s",
	"Month": "true¦dec0february,july,nov0octo1sept0;em0;ber",
	"Date": "true¦ago,on4som4t1week0yesterd5; end,ends;mr1o0;d2morrow;!w;ed0;ay",
	"Duration": "true¦centurAd8h7m5q4se3w1y0;ear8r8;eek0k7;!end,s;ason,c5;tr,uarter;i0onth3;llisecond2nute2;our1r1;ay0ecade0;!s;ies,y",
	"FemaleName": "true¦0:J7;1:JB;2:IJ;3:IK;4:J1;5:IO;6:JS;7:JO;8:HB;9:JK;A:H4;B:I2;C:IT;D:JH;E:IX;F:BA;G:I4;aGTbFLcDRdD0eBMfB4gADh9Ti9Gj8Dk7Cl5Wm48n3Lo3Hp33qu32r29s15t0Eu0Cv02wVxiTyOzH;aLeIineb,oHsof3;e3Sf3la,ra;h2iKlIna,ynH;ab,ep;da,ma;da,h2iHra;nab;aKeJi0FolB7uIvH;et8onDP;i0na;le0sen3;el,gm3Hn,rGLs8W;aoHme0nyi;m5XyAD;aMendDZhiDGiH;dele9lJnH;if48niHo0;e,f47;a,helmi0lHma;a,ow;ka0nB;aNeKiHusa5;ck84kIl8oleAviH;anFenJ4;ky,toriBK;da,lA8rHs0;a,nHoniH9;a,iFR;leHnesH9;nILrH;i1y;g9rHs6xHA;su5te;aYeUhRiNoLrIuHy2;i,la;acJ3iHu0J;c3na,sH;hFta;nHr0F;iFya;aJffaEOnHs6;a,gtiH;ng;!nFSra;aIeHomasi0;a,l9Oo8Ares1;l3ndolwethu;g9Fo88rIssH;!a,ie;eHi,ri7;sa,za;bOlMmKnIrHs6tia0wa0;a60yn;iHya;a,ka,s6;arFe2iHm77ra;!ka;a,iH;a,t6;at6it6;a0Ecarlett,e0AhWiSkye,neza0oQri,tNuIyH;bIGlvi1;ha,mayIJniAsIzH;an3Net8ie,y;anHi7;!a,e,nH;aCe;aIeH;fan4l5Dphan6E;cI5r5;b3fiAAm0LnHphi1;d2ia,ja,ya;er2lJmon1nIobh8QtH;a,i;dy;lETv3;aMeIirHo0risFDy5;a,lDM;ba,e0i5lJrH;iHr6Jyl;!d8Ifa;ia,lDZ;hd,iMki2nJrIu0w0yH;la,ma,na;i,le9on,ron,yn;aIda,ia,nHon;a,on;!ya;k6mH;!aa;lJrItaye82vH;da,inj;e0ife;en1i0ma;anA9bLd5Oh1SiBkKlJmInd2rHs6vannaC;aCi0;ant6i2;lDOma,ome;ee0in8Tu2;in1ri0;a05eZhXiUoHuthDM;bScRghQl8LnPsJwIxH;anB3ie,y;an,e0;aIeHie,lD;ann7ll1marDGtA;!lHnn1;iHyn;e,nH;a,dF;da,i,na;ayy8G;hel67io;bDRerAyn;a,cIkHmas,nFta,ya;ki,o;h8Xki;ea,iannGMoH;da,n1P;an0bJemFgi0iInHta,y0;a8Bee;han86na;a,eH;cHkaC;a,ca;bi0chIe,i0mo0nHquETy0;di,ia;aERelHiB;!e,le;een4ia0;aPeOhMiLoJrHute6A;iHudenCV;scil3LyamvaB;lHrt3;i0ly;a,paluk;ilome0oebe,ylH;is,lis;ggy,nelope,r5t2;ige,m0VnKo5rvaDMtIulH;a,et8in1;ricHt4T;a,e,ia;do2i07;ctav3dIfD3is6ksa0lHphD3umC5yunbileg;a,ga,iv3;eHvAF;l3t8;aWeUiMoIurHy5;!ay,ul;a,eJor,rIuH;f,r;aCeEma;ll1mi;aNcLhariBQkKlaJna,sHta,vi;anHha;ur;!y;a,iDZki;hoGk9YolH;a,e4P;!mh;hir,lHna,risDEsreE;!a,iDDlBV;asuMdLh3i6Dl5nKomi7rgEVtH;aHhal4;lHs6;i1ya;cy,et8;e9iF0ya;nngu2X;a0Ackenz4e02iMoJrignayani,uriDJyH;a,rH;a,iOlNna,tG;bi0i2llBJnH;a,iH;ca,ka,qD9;a,cUdo4ZkaTlOmi,nMrItzi,yH;ar;aJiIlH;anET;am;!l,nB;dy,eHh,n4;nhGrva;aKdJe0iCUlH;iHy;cent,e;red;!gros;!e5;ae5hH;ae5el3Z;ag5DgNi,lKrH;edi7AiIjem,on,yH;em,l;em,sCG;an4iHliCF;nHsCJ;a,da;!an,han;b09cASd07e,g05ha,i04ja,l02n00rLsoum5YtKuIv84xBKyHz4;bell,ra,soBB;d7rH;a,eE;h8Gild1t4;a,cUgQiKjor4l7Un4s6tJwa,yH;!aHbe6Xja9lAE;m,nBL;a,ha,in1;!aJbCGeIja,lDna,sHt63;!a,ol,sa;!l1D;!h,mInH;!a,e,n1;!awit,i;arJeIie,oHr48ueri8;!t;!ry;et46i3B;el4Xi7Cy;dHon,ue5;akranAy;ak,en,iHlo3S;a,ka,nB;a,re,s4te;daHg4;!l3E;alDd4elHge,isDJon0;ei9in1yn;el,le;a0Ne0CiXoQuLyH;d3la,nH;!a,dIe2OnHsCT;!a,e2N;a,sCR;aD4cJel0Pis1lIna,pHz;e,iA;a,u,wa;iHy;a0Se,ja,l2NnB;is,l1UrItt1LuHvel4;el5is1;aKeIi7na,rH;aADi7;lHn1tA;ei;!in1;aTbb9HdSepa,lNnKsJvIzH;!a,be5Ret8z4;!ia;a,et8;!a,dH;a,sHy;ay,ey,i,y;a,iJja,lH;iHy;aA8e;!aH;!nF;ia,ya;!nH;!a,ne;aPda,e0iNjYla,nMoKsJtHx93y5;iHt4;c3t3;e2PlCO;la,nHra;a,ie,o2;a,or1;a,gh,laH;!ni;!h,nH;a,d2e,n5V;cOdon9DiNkes6mi9Gna,rMtJurIvHxmi,y5;ern1in3;a,e5Aie,yn;as6iIoH;nya,ya;fa,s6;a,isA9;a,la;ey,ie,y;a04eZhXiOlASoNrJyH;lHra;a,ee,ie;istHy6I;a,en,iIyH;!na;!e,n5F;nul,ri,urtnB8;aOerNlB7mJrHzzy;a,stH;en,in;!berlImernH;aq;eHi,y;e,y;a,stE;!na,ra;aHei2ongordzol;dij1w5;el7UiKjsi,lJnIrH;a,i,ri;d2na,za;ey,i,lBLs4y;ra,s6;biAcARdiat7MeBAiSlQmPnyakuma1DrNss6NtKviAyH;!e,lH;a,eH;e,i8T;!a6HeIhHi4TlDri0y;ar8Her8Hie,leErBAy;!lyn8Ori0;a,en,iHl5Xoli0yn;!ma,nFs95;a5il1;ei8Mi,lH;e,ie;a,tl6O;a0AeZiWoOuH;anMdLlHst88;es,iH;a8NeHs8X;!n9tH;!a,te;e5Mi3My;a,iA;!anNcelDdMelGhan7VleLni,sIva0yH;a,ce;eHie;fHlDph7Y;a,in1;en,n1;i7y;!a,e,n45;lHng;!i1DlH;!i1C;anNle0nKrJsH;i8JsH;!e,i8I;i,ri;!a,elGif2CnH;a,et8iHy;!e,f2A;a,eJiInH;a,eIiH;e,n1;!t8;cMda,mi,nIque4YsminFvie2y9zH;min7;a7eIiH;ce,e,n1s;!lHs82t0F;e,le;inIk6HlDquelH;in1yn;da,ta;da,lRmPnOo0rNsIvaHwo0zaro;!a0lu,na;aJiIlaHob89;!n9R;do2;belHdo2;!a,e,l3B;a7Ben1i0ma;di2es,gr72ji;a9elBogH;en1;a,e9iHo0se;a0na;aSeOiJoHus7Kyacin2C;da,ll4rten24snH;a,i9U;lImaH;ri;aIdHlaI;a,egard;ry;ath1BiJlInrietArmi9sH;sa,t1A;en2Uga,mi;di;bi2Fil8MlNnMrJsItHwa,yl8M;i5Tt4;n60ti;iHmo51ri53;etH;!te;aCnaC;a,ey,l4;a02eWiRlPoNrKunJwH;enHyne1R;!dolD;ay,el;acieIetHiselB;a,chE;!la;ld1CogooH;sh;adys,enHor3yn2K;a,da,na;aKgi,lIna,ov8EselHta;a,e,le;da,liH;an;!n0;mLnJorgIrH;ald5Si,m3Etrud7;et8i4X;a,eHna;s29vieve;ma;bIle,mHrnet,yG;al5Si5;iIrielH;a,l1;!ja;aTeQiPlorOoz3rH;anJeIiH;da,eB;da,ja;!cH;esIiHoi0P;n1s66;!ca;a,enc3;en,o0;lIn0rnH;anB;ec3ic3;jr,nArKtHy7;emIiHma,oumaA;ha,ma,n;eh;ah,iBrah,za0;cr4Rd0Re0Qi0Pk0Ol07mXn54rUsOtNuMvHwa;aKelIiH;!e,ta;inFyn;!a;!ngel4V;geni1ni47;h5Yien9ta;mLperanKtH;eIhHrel5;er;l31r7;za;a,eralB;iHma,ne4Lyn;cHka,n;a,ka;aPeNiKmH;aHe21ie,y;!li9nuH;elG;lHn1;e7iHy;a,e,ja;lHrald;da,y;!nue5;aWeUiNlMma,no2oKsJvH;a,iH;na,ra;a,ie;iHuiH;se;a,en,ie,y;a0c3da,e,f,nMsJzaH;!betHveA;e,h;aHe,ka;!beH;th;!a,or;anor,nH;!a,i;!in1na;ate1Rta;leEs6;vi;eIiHna,wi0;e,th;l,n;aYeMh3iLjeneKoH;lor5Vminiq4Ln3FrHtt4;a,eEis,la,othHthy;ea,y;ba;an09naCon9ya;anQbPde,eOiMlJmetr3nHsir5M;a,iH;ce,se;a,iIla,orHphi9;es,is;a,l6F;dHrdH;re;!d5Ena;!b2ForaCraC;a,d2nH;!a,e;hl3i0l0GmNnLphn1rIvi1WyH;le,na;a,by,cIia,lH;a,en1;ey,ie;a,et8iH;!ca,el1Aka,z;arHia;is;a0Re0Nh04i02lUoJristIynH;di,th3;al,i0;lPnMrIurH;tn1D;aJd2OiHn2Ori9;!nH;a,e,n1;!l4;cepci5Cn4sH;tanHuelo;ce,za;eHleE;en,t8;aJeoIotH;il54;!pat2;ir7rJudH;et8iH;a,ne;a,e,iH;ce,sZ;a2er2ndH;i,y;aReNloe,rH;isJyH;stH;al;sy,tH;a1Sen,iHy;an1e,n1;deJlseIrH;!i7yl;a,y;li9;nMrH;isKlImH;ai9;a,eHot8;n1t8;!sa;d2elGtH;al,elG;cIlH;es8i47;el3ilH;e,ia,y;itlYlXmilWndVrMsKtHy5;aIeIhHri0;er1IleErDy;ri0;a38sH;a37ie;a,iOlLmeJolIrH;ie,ol;!e,in1yn;lHn;!a,la;a,eIie,otHy;a,ta;ne,y;na,s1X;a0Ii0I;a,e,l1;isAl4;in,yn;a0Ke02iZlXoUrH;andi7eRiJoIyH;an0nn;nwDoke;an3HdgMgiLtH;n31tH;!aInH;ey,i,y;ny;d,t8;etH;!t7;an0e,nH;da,na;bbi7glarIlo07nH;iAn4;ka;ancHythe;a,he;an1Clja0nHsm3M;iAtH;ou;aWcVlinUniArPssOtJulaCvH;!erlH;ey,y;hJsy,tH;e,iHy7;e,na;!anH;ie,y;!ie;nItHyl;ha,ie;adIiH;ce;et8i9;ay,da;ca,ky;!triH;ce,z;rbJyaH;rmH;aa;a2o2ra;a2Ub2Od25g21i1Sj5l18m0Zn0Boi,r06sWtVuPvOwa,yIzH;ra,u0;aKes6gJlIn,seH;!l;in;un;!nH;a,na;a,i2K;drLguJrIsteH;ja;el3;stH;in1;a,ey,i,y;aahua,he0;hIi2Gja,miAs2DtrH;id;aMlIraqHt21;at;eIi7yH;!n;e,iHy;gh;!nH;ti;iJleIo6piA;ta;en,n1t8;aHelG;!n1J;a01dje5eZgViTjRnKohito,toHya;inet8nH;el5ia;te;!aKeIiHmJ;e,ka;!mHtt7;ar4;!belIliHmU;sa;!l1;a,eliH;ca;ka,sHta;a,sa;elHie;a,iH;a,ca,n1qH;ue;!tH;a,te;!bImHstasiMya;ar3;el;aLberKeliJiHy;e,l3naH;!ta;a,ja;!ly;hGiIl3nB;da;a,ra;le;aWba,ePiMlKthJyH;a,c3sH;a,on,sa;ea;iHys0N;e,s0M;a,cIn1sHza;a,e,ha,on,sa;e,ia,ja;c3is6jaKksaKna,sJxH;aHia;!nd2;ia,saH;nd2;ra;ia;i0nIyH;ah,na;a,is,naCoud;la;c6da,leEmNnLsH;haClH;inHyY;g,n;!h;a,o,slH;ey;ee;en;at6g4nIusH;ti0;es;ie;aWdiTelMrH;eJiH;anMenH;a,e,ne;an0;na;!aLeKiIyH;nn;a,n1;a,e;!ne;!iH;de;e,lDsH;on;yn;!lH;i9yn;ne;aKbIiHrL;!e,gaK;ey,i7y;!e;gaH;il;dKliyJradhIs6;ha;ya;ah;a,ya",
	"Honorific": "true¦director1field marsh2lieutenant1rear0sergeant major,vice0; admir1; gener0;al",
	"Adj|Gerund": "true¦0:3F;1:3H;2:31;3:2X;4:35;5:33;6:3C;7:2Z;8:36;9:29;a33b2Tc2Bd1Te1If19g12h0Zi0Rl0Nm0Gnu0Fo0Ap04rYsKtEuBvAw1Ayiel3;ar6e08;nBpA;l1Rs0B;fol3n1Zsett2;aEeDhrBi4ouc7rAwis0;e0Bif2oub2us0yi1;ea1SiA;l2vi1;l2mp0rr1J;nt1Vxi1;aMcreec7enten2NhLkyrocke0lo0Vmi2oJpHtDuBweA;e0Ul2;pp2ArA;gi1pri5roun3;aBea8iAri2Hun9;mula0r4;gge4rA;t2vi1;ark2eAraw2;e3llb2F;aAot7;ki1ri1;i9oc29;dYtisf6;aEeBive0oAus7;a4l2;assu4defi9fres7ig9juve07mai9s0vAwar3;ea2italiAol1G;si1zi1;gi1ll6mb2vi1;a6eDier23lun1VrAun2C;eBoA;mi5vo1Z;ce3s5vai2;n3rpleA;xi1;ffCpWutBverAwi1;arc7lap04p0Pri3whel8;goi1l6st1J;en3sA;et0;m2Jrtu4;aEeDiCoBuAyst0L;mb2;t1Jvi1;s5tiga0;an1Rl0n3smeri26;dAtu4;de9;aCeaBiAo0U;fesa0Tvi1;di1ni1;c1Fg19s0;llumiGmFnArri0R;cDfurHsCtBviA;go23ti1;e1Oimi21oxica0rig0V;pi4ul0;orpo20r0K;po5;na0;eaBorr02umilA;ia0;li1rtwar8;lFrA;atiDipCoBuelA;i1li1;undbrea10wi1;pi1;f6ng;a4ea8;a3etc7it0lEoCrBulfA;il2;ee1FighXust1L;rAun3;ebo3thco8;aCoA;a0wA;e4i1;mi1tte4;lectrJmHnExA;aCci0hBis0pA;an3lo3;aOila1B;c0spe1A;ab2coura0CdBergi13ga0Clive9ric7s02tA;hral2i0J;ea4u4;barras5er09pA;owe4;if6;aQeIiBrA;if0;sAzz6;aEgDhearCsen0tA;rAur11;ac0es5;te9;us0;ppoin0r8;biliGcDfi9gra3ligh0mBpres5sAvasG;erE;an3ea9orA;ali0L;a6eiBli9rA;ea5;vi1;ta0;maPri1s7un0zz2;aPhMlo5oAripp2ut0;mGnArrespon3;cer9fDspi4tA;inBrA;as0ibu0ol2;ui1;lic0u5;ni1;fDmCpA;eAromi5;l2ti1;an3;or0;aAil2;llenAnAr8;gi1;l8ptAri1;iva0;aff2eGin3lFoDrBuA;d3st2;eathtaAui5;ki1;gg2i2o8ri1unA;ci1;in3;co8wiA;lAtc7;de4;bsorVcOgonMlJmHnno6ppea2rFsA;pi4su4toA;nBun3;di1;is7;hi1;res0;li1;aFu5;si1;ar8lu4;ri1;mi1;iAzi1;zi1;cAhi1;eleDomA;moBpan6;yi1;da0;ra0;ti1;bi1;ng",
	"Comparable": "true¦0:3C;1:3Q;2:3F;a3Tb3Cc33d2Te2Mf2Ag1Wh1Li1Fj1Ek1Bl13m0Xn0So0Rp0Iqu0Gr07sHtCug0vAw4y3za0Q;el10ouN;ary,e6hi5i3ry;ck0Cde,l3n1ry,se;d,y;ny,te;a3i3R;k,ry;a3erda2ulgar;gue,in,st;a6en2Xhi5i4ouZr3;anqu2Cen1ue;dy,g36me0ny;ck,rs28;ll,me,rt,wd3I;aRcaPeOhMiLkin0BlImGoEpDt6u4w3;eet,ift;b3dd0Wperfi21rre28;sta26t21;a8e7iff,r4u3;pUr1;a4ict,o3;ng;ig2Vn0N;a1ep,rn;le,rk,te0;e1Si2Vright0;ci1Yft,l3on,re;emn,id;a3el0;ll,rt;e4i3y;g2Mm0Z;ek,nd2T;ck24l0mp1L;a3iRrill,y;dy,l01rp;ve0Jxy;n1Jr3;ce,y;d,fe,int0l1Hv0V;a8e6i5o3ude;mantic,o19sy,u3;gh;pe,t1P;a3d,mo0A;dy,l;gg4iFndom,p3re,w;id;ed;ai2i3;ck,et;hoAi1Fl9o8r5u3;ny,r3;e,p11;egna2ic4o3;fouSud;ey,k0;liXor;ain,easa2;ny;dd,i0ld,ranL;aive,e5i4o3u14;b0Sisy,rm0Ysy;bb0ce,mb0R;a3r1w;r,t;ad,e5ild,o4u3;nda12te;ist,o1;a4ek,l3;low;s0ty;a8e7i6o3ucky;f0Jn4o15u3ve0w10y0N;d,sy;e0g;ke0l,mp,tt0Eve0;e1Qwd;me,r3te;ge;e4i3;nd;en;ol0ui19;cy,ll,n3;secu6t3;e3ima4;llege2rmedia3;te;re;aAe7i6o5u3;ge,m3ng1C;bYid;me0t;gh,l0;a3fXsita2;dy,rWv3;en0y;nd13ppy,r3;d3sh;!y;aFenEhCiBlAoofy,r3;a8e6i5o3ue0Z;o3ss;vy;m,s0;at,e3y;dy,n;nd,y;ad,ib,ooD;a2d1;a3o3;st0;tDuiS;u1y;aCeebBi9l8o6r5u3;ll,n3r0N;!ny;aCesh,iend0;a3nd,rmD;my;at,ir7;erce,nan3;ci9;le;r,ul3;ty;a6erie,sse4v3xtre0B;il;nti3;al;r4s3;tern,y;ly,th0;appZe9i5ru4u3;mb;nk;r5vi4z3;zy;ne;e,ty;a3ep,n9;d3f,r;!ly;agey,h8l7o5r4u3;dd0r0te;isp,uel;ar3ld,mmon,st0ward0zy;se;evKou1;e3il0;ap,e3;sy;aHiFlCoAr5u3;ff,r0sy;ly;a6i3oad;g4llia2;nt;ht;sh,ve;ld,un3;cy;a4o3ue;nd,o1;ck,nd;g,tt3;er;d,ld,w1;dy;bsu6ng5we3;so3;me;ry;rd",
	"Adverb": "true¦a08b05d00eYfSheQinPjustOkinda,likewiZmMnJoEpCquite,r9s5t2u0very,well;ltima01p0; to,wards5;h1iny bit,o0wiO;o,t6;en,us;eldom,o0uch;!me1rt0; of;how,times,w0C;a1e0;alS;ndomRth05;ar excellenEer0oint blank; Lhaps;f3n0utright;ce0ly;! 0;ag05moX; courGten;ewJo0; longWt 0;onHwithstand9;aybe,eanwhiNore0;!ovT;! aboX;deed,steY;lla,n0;ce;or3u0;ck1l9rther0;!moK;ing; 0evK;exampCgood,suH;n mas0vI;se;e0irect2; 2fini0;te0;ly;juAtrop;ackward,y 0;far,no0; means,w; GbroFd nauseam,gEl7ny5part,s4t 2w0;ay,hi0;le;be7l0mo7wor7;arge,ea6; soon,i4;mo0way;re;l 3mo2ongsi1ready,so,togeth0ways;er;de;st;b1t0;hat;ut;ain;ad;lot,posteriori",
	"Conjunction": "true¦aXbTcReNhowMiEjust00noBo9p8supposing,t5wh0yet;e1il0o3;e,st;n1re0thN; if,by,vM;evL;h0il,o;erefOo0;!uU;lus,rovided th9;r0therwiM;! not; mattEr,w0;! 0;since,th4w7;f4n0; 0asmuch;as mIcaForder t0;h0o;at;! 0;only,t0w0;hen;!ev3;ith2ven0;! 0;if,tB;er;o0uz;s,z;e0ut,y the time;cau1f0;ore;se;lt3nd,s 0;far1if,m0soon1t2;uch0; as;hou0;gh",
	"Currency": "true¦$,aud,bQcOdJeurIfHgbp,hkd,iGjpy,kElDp8r7s3usd,x2y1z0¢,£,¥,ден,лв,руб,฿,₡,₨,€,₭,﷼;lotyQł;en,uanP;af,of;h0t5;e0il5;k0q0;elK;oubleJp,upeeJ;e2ound st0;er0;lingG;n0soF;ceEnies;empi7i7;n,r0wanzaCyatC;!onaBw;ls,nr;ori7ranc9;!os;en3i2kk,o0;b0ll2;ra5;me4n0rham4;ar3;e0ny;nt1;aht,itcoin0;!s",
	"Determiner": "true¦aBboth,d9e6few,le5mu8neiDplenty,s4th2various,wh0;at0ich0;evC;a0e4is,ose;!t;everal,ome;!ast,s;a1l0very;!se;ch;e0u;!s;!n0;!o0y;th0;er",
	"Adj|Present": "true¦a07b04cVdQeNfJhollIidRlEmCnarrIoBp9qua8r7s3t2uttFw0;aKet,ro0;ng,u08;endChin;e2hort,l1mooth,our,pa9tray,u0;re,speU;i2ow;cu6da02leSpaN;eplica01i02;ck;aHerfePr0;eseUime,omV;bscu1pen,wn;atu0e3odeH;re;a2e1ive,ow0;er;an;st,y;ow;a2i1oul,r0;ee,inge;rm;iIke,ncy,st;l1mpty,x0;emHpress;abo4ic7;amp,e2i1oub0ry,ull;le;ffu9re6;fu8libe0;raE;alm,l5o0;mpleCn3ol,rr1unterfe0;it;e0u7;ct;juga8sum7;ea1o0;se;n,r;ankru1lu0;nt;pt;li2pproxi0rticula1;ma0;te;ght",
	"Person|Adj": "true¦b3du2earnest,frank,mi2r0san1woo1;an0ich,u1;dy;sty;ella,rown",
	"Modal": "true¦c5lets,m4ought3sh1w0;ill,o5;a0o4;ll,nt;! to,a;ight,ust;an,o0;uld",
	"Verb": "true¦born,cannot,gonna,has,keep tabs,msg",
	"Person|Verb": "true¦b8ch7dr6foster,gra5ja9lan4ma2ni9ollie,p1rob,s0wade;kip,pike,t5ue;at,eg,ier2;ck,r0;k,shal;ce;ce,nt;ew;ase,u1;iff,l1ob,u0;ck;aze,ossom",
	"Person|Date": "true¦a2j0sep;an0une;!uary;p0ugust,v0;ril"
};
//#endregion
//#region node_modules/efrt/src/encoding.js
var BASE = 36;
var seq = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var cache = seq.split("").reduce(function(h, c, i) {
	h[c] = i;
	return h;
}, {});
var toAlphaCode = function(n) {
	if (seq[n] !== void 0) return seq[n];
	let places = 1;
	let range = BASE;
	let s = "";
	for (; n >= range; n -= range, places++, range *= BASE);
	while (places--) {
		const d = n % BASE;
		s = String.fromCharCode((d < 10 ? 48 : 55) + d) + s;
		n = (n - d) / BASE;
	}
	return s;
};
var fromAlphaCode = function(s) {
	if (cache[s] !== void 0) return cache[s];
	let n = 0;
	let places = 1;
	let range = BASE;
	let pow = 1;
	for (; places < s.length; n += range, places++, range *= BASE);
	for (let i = s.length - 1; i >= 0; i--, pow *= BASE) {
		let d = s.charCodeAt(i) - 48;
		if (d > 10) d -= 7;
		n += d * pow;
	}
	return n;
};
var encoding_default = {
	toAlphaCode,
	fromAlphaCode
};
//#endregion
//#region node_modules/efrt/src/unpack/symbols.js
var symbols = function(t) {
	const reSymbol = /* @__PURE__ */ new RegExp("([0-9A-Z]+):([0-9A-Z]+)");
	for (let i = 0; i < t.nodes.length; i++) {
		const m = reSymbol.exec(t.nodes[i]);
		if (!m) {
			t.symCount = i;
			break;
		}
		t.syms[encoding_default.fromAlphaCode(m[1])] = encoding_default.fromAlphaCode(m[2]);
	}
	t.nodes = t.nodes.slice(t.symCount, t.nodes.length);
};
//#endregion
//#region node_modules/efrt/src/unpack/traverse.js
var indexFromRef = function(trie, ref, index) {
	const dnode = encoding_default.fromAlphaCode(ref);
	if (dnode < trie.symCount) return trie.syms[dnode];
	return index + dnode + 1 - trie.symCount;
};
var toArray$2 = function(trie) {
	const all = [];
	const crawl = (index, pref) => {
		let node = trie.nodes[index];
		if (node[0] === "!") {
			all.push(pref);
			node = node.slice(1);
		}
		const matches = node.split(/([A-Z0-9,]+)/g);
		for (let i = 0; i < matches.length; i += 2) {
			const str = matches[i];
			const ref = matches[i + 1];
			if (!str) continue;
			const have = pref + str;
			if (ref === "," || ref === void 0) {
				all.push(have);
				continue;
			}
			const newIndex = indexFromRef(trie, ref, index);
			crawl(newIndex, have);
		}
	};
	crawl(0, "");
	return all;
};
var unpack$1 = function(str) {
	const trie = {
		nodes: str.split(";"),
		syms: [],
		symCount: 0
	};
	if (str.match(":")) symbols(trie);
	return toArray$2(trie);
};
//#endregion
//#region node_modules/efrt/src/unpack/index.js
var unpack = function(str) {
	if (!str) return {};
	const obj = str.split("|").reduce((h, s) => {
		const arr = s.split("¦");
		h[arr[0]] = arr[1];
		return h;
	}, {});
	const all = {};
	Object.keys(obj).forEach(function(cat) {
		const arr = unpack$1(obj[cat]);
		if (cat === "true") cat = true;
		for (let i = 0; i < arr.length; i++) {
			const k = arr[i];
			if (all.hasOwnProperty(k) === true) if (Array.isArray(all[k]) === false) all[k] = [all[k], cat];
			else all[k].push(cat);
			else all[k] = cat;
		}
	});
	return all;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/lexicon/misc.js
var prp = ["Possessive", "Pronoun"];
var misc$2 = {
	"20th century fox": "Organization",
	"7 eleven": "Organization",
	"motel 6": "Organization",
	g8: "Organization",
	vh1: "Organization",
	"76ers": "SportsTeam",
	"49ers": "SportsTeam",
	q1: "Date",
	q2: "Date",
	q3: "Date",
	q4: "Date",
	km2: "Unit",
	m2: "Unit",
	dm2: "Unit",
	cm2: "Unit",
	mm2: "Unit",
	mile2: "Unit",
	in2: "Unit",
	yd2: "Unit",
	ft2: "Unit",
	m3: "Unit",
	dm3: "Unit",
	cm3: "Unit",
	in3: "Unit",
	ft3: "Unit",
	yd3: "Unit",
	"at&t": "Organization",
	"black & decker": "Organization",
	"h & m": "Organization",
	"johnson & johnson": "Organization",
	"procter & gamble": "Organization",
	"ben & jerry's": "Organization",
	"&": "Conjunction",
	i: ["Pronoun", "Singular"],
	he: ["Pronoun", "Singular"],
	she: ["Pronoun", "Singular"],
	it: ["Pronoun", "Singular"],
	they: ["Pronoun", "Plural"],
	we: ["Pronoun", "Plural"],
	was: ["Copula", "PastTense"],
	is: ["Copula", "PresentTense"],
	are: ["Copula", "PresentTense"],
	am: ["Copula", "PresentTense"],
	were: ["Copula", "PastTense"],
	her: prp,
	his: prp,
	hers: prp,
	their: prp,
	theirs: prp,
	themselves: prp,
	your: prp,
	our: prp,
	ours: prp,
	my: prp,
	its: prp,
	vs: ["Conjunction", "Abbreviation"],
	if: ["Condition", "Preposition"],
	closer: "Comparative",
	closest: "Superlative",
	much: "Adverb",
	may: "Modal",
	babysat: "PastTense",
	blew: "PastTense",
	drank: "PastTense",
	drove: "PastTense",
	forgave: "PastTense",
	skiied: "PastTense",
	spilt: "PastTense",
	stung: "PastTense",
	swam: "PastTense",
	swung: "PastTense",
	guaranteed: "PastTense",
	shrunk: "PastTense",
	nears: "PresentTense",
	nearing: "Gerund",
	neared: "PastTense",
	no: ["Negative", "Expression"]
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/lexicon/frozenLex.js
var frozenLex_default = {
	"20th century fox": "Organization",
	"7 eleven": "Organization",
	"motel 6": "Organization",
	"excuse me": "Expression",
	"financial times": "Organization",
	"guns n roses": "Organization",
	"la z boy": "Organization",
	"labour party": "Organization",
	"new kids on the block": "Organization",
	"new york times": "Organization",
	"the guess who": "Organization",
	"thin lizzy": "Organization",
	"prime minister": "Actor",
	"free market": "Singular",
	"lay up": "Singular",
	"living room": "Singular",
	"living rooms": "Plural",
	"spin off": "Singular",
	"appeal court": "Uncountable",
	"cold war": "Uncountable",
	"gene pool": "Uncountable",
	"machine learning": "Uncountable",
	"nail polish": "Uncountable",
	"time off": "Uncountable",
	"take part": "Infinitive",
	"bill gates": "Person",
	"doctor who": "Person",
	"dr who": "Person",
	"he man": "Person",
	"iron man": "Person",
	"kid cudi": "Person",
	"run dmc": "Person",
	"rush limbaugh": "Person",
	"snow white": "Person",
	"tiger woods": "Person",
	"brand new": "Adjective",
	"en route": "Adjective",
	"left wing": "Adjective",
	"off guard": "Adjective",
	"on board": "Adjective",
	"part time": "Adjective",
	"right wing": "Adjective",
	"so called": "Adjective",
	"spot on": "Adjective",
	"straight forward": "Adjective",
	"super duper": "Adjective",
	"tip top": "Adjective",
	"top notch": "Adjective",
	"up to date": "Adjective",
	"win win": "Adjective",
	"brooklyn nets": "SportsTeam",
	"chicago bears": "SportsTeam",
	"houston astros": "SportsTeam",
	"houston dynamo": "SportsTeam",
	"houston rockets": "SportsTeam",
	"houston texans": "SportsTeam",
	"minnesota twins": "SportsTeam",
	"orlando magic": "SportsTeam",
	"san antonio spurs": "SportsTeam",
	"san diego chargers": "SportsTeam",
	"san diego padres": "SportsTeam",
	"iron maiden": "ProperNoun",
	"isle of man": "Country",
	"united states": "Country",
	"united states of america": "Country",
	"prince edward island": "Region",
	"cedar breaks": "Place",
	"cedar falls": "Place",
	"point blank": "Adverb",
	"tiny bit": "Adverb",
	"by the time": "Conjunction",
	"no matter": "Conjunction",
	"civil wars": "Plural",
	"credit cards": "Plural",
	"default rates": "Plural",
	"free markets": "Plural",
	"head starts": "Plural",
	"home runs": "Plural",
	"lay ups": "Plural",
	"phone calls": "Plural",
	"press releases": "Plural",
	"record labels": "Plural",
	"soft serves": "Plural",
	"student loans": "Plural",
	"tax returns": "Plural",
	"tv shows": "Plural",
	"video games": "Plural",
	"took part": "PastTense",
	"takes part": "PresentTense",
	"taking part": "Gerund",
	"taken part": "Participle",
	"light bulb": "Noun",
	"rush hour": "Noun",
	"fluid ounce": "Unit",
	"the rolling stones": "Organization"
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/lexicon/emoticons.js
var emoticons_default = [
	":(",
	":)",
	":P",
	":p",
	":O",
	";(",
	";)",
	";P",
	";p",
	";O",
	":3",
	":|",
	":/",
	":\\",
	":$",
	":*",
	":@",
	":-(",
	":-)",
	":-P",
	":-p",
	":-O",
	":-3",
	":-|",
	":-/",
	":-\\",
	":-$",
	":-*",
	":-@",
	":^(",
	":^)",
	":^P",
	":^p",
	":^O",
	":^3",
	":^|",
	":^/",
	":^\\",
	":^$",
	":^*",
	":^@",
	"):",
	"(:",
	"$:",
	"*:",
	")-:",
	"(-:",
	"$-:",
	"*-:",
	")^:",
	"(^:",
	"$^:",
	"*^:",
	"<3",
	"</3",
	"<\\3",
	"=("
];
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/nouns/toPlural/_rules.js
/** patterns for turning 'bus' to 'buses'*/
var suffixes$3 = {
	a: [[/(antenn|formul|nebul|vertebr|vit)a$/i, "$1ae"], [/ia$/i, "ia"]],
	e: [
		[/(kn|l|w)ife$/i, "$1ives"],
		[/(hive)$/i, "$1s"],
		[/([m|l])ouse$/i, "$1ice"],
		[/([m|l])ice$/i, "$1ice"]
	],
	f: [[/^(dwar|handkerchie|hoo|scar|whar)f$/i, "$1ves"], [/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i, "$1ves"]],
	i: [[/(octop|vir)i$/i, "$1i"]],
	m: [[/([ti])um$/i, "$1a"]],
	n: [[/^(oxen)$/i, "$1"]],
	o: [[/(al|ad|at|er|et|ed)o$/i, "$1oes"]],
	s: [
		[/(ax|test)is$/i, "$1es"],
		[/(alias|status)$/i, "$1es"],
		[/sis$/i, "ses"],
		[/(bu)s$/i, "$1ses"],
		[/(sis)$/i, "ses"],
		[/^(?!talis|.*hu)(.*)man$/i, "$1men"],
		[/(octop|vir|radi|nucle|fung|cact|stimul)us$/i, "$1i"]
	],
	x: [[/(matr|vert|ind|cort)(ix|ex)$/i, "$1ices"], [/^(ox)$/i, "$1en"]],
	y: [[/([^aeiouy]|qu)y$/i, "$1ies"]],
	z: [[/(quiz)$/i, "$1zes"]]
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/nouns/toPlural/index.js
var addE = /([xsz]|ch|sh)$/;
var trySuffix = function(str) {
	const c = str[str.length - 1];
	if (suffixes$3.hasOwnProperty(c) === true) for (let i = 0; i < suffixes$3[c].length; i += 1) {
		const reg = suffixes$3[c][i][0];
		if (reg.test(str) === true) return str.replace(reg, suffixes$3[c][i][1]);
	}
	return null;
};
/** Turn a singular noun into a plural
* assume the given string is singular
*/
var pluralize = function(str = "", model) {
	const { irregularPlurals, uncountable } = model.two;
	if (uncountable.hasOwnProperty(str)) return str;
	if (irregularPlurals.hasOwnProperty(str)) return irregularPlurals[str];
	const plural = trySuffix(str);
	if (plural !== null) return plural;
	if (addE.test(str)) return str + "es";
	return str + "s";
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/lexicon/index.js
var hasSwitch = /\|/;
var lexicon = misc$2;
var switches = {};
var tmpModel$1 = { two: {
	irregularPlurals: plurals_default,
	uncountable: {}
} };
Object.keys(_data_default$1).forEach((tag) => {
	const wordsObj = unpack(_data_default$1[tag]);
	if (!hasSwitch.test(tag)) {
		Object.keys(wordsObj).forEach((w) => {
			lexicon[w] = tag;
		});
		return;
	}
	Object.keys(wordsObj).forEach((w) => {
		switches[w] = tag;
		if (tag === "Noun|Verb") {
			const plural = pluralize(w, tmpModel$1);
			switches[plural] = "Plural|Verb";
		}
	});
});
emoticons_default.forEach((str) => lexicon[str] = "Emoticon");
delete lexicon[""];
delete lexicon[null];
delete lexicon[" "];
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/_noun.js
var n = "Singular";
var _noun_default = {
	beforeTags: {
		Determiner: n,
		Possessive: n,
		Acronym: n,
		Noun: n,
		Adjective: n,
		PresentTense: n,
		Gerund: n,
		PastTense: n,
		Infinitive: n,
		Date: n,
		Ordinal: n,
		Demonym: n
	},
	afterTags: {
		Value: n,
		Modal: n,
		Copula: n,
		PresentTense: n,
		PastTense: n,
		Demonym: n,
		Actor: n
	},
	beforeWords: {
		the: n,
		with: n,
		without: n,
		of: n,
		for: n,
		any: n,
		all: n,
		on: n,
		cut: n,
		cuts: n,
		increase: n,
		decrease: n,
		raise: n,
		drop: n,
		save: n,
		saved: n,
		saves: n,
		make: n,
		makes: n,
		made: n,
		minus: n,
		plus: n,
		than: n,
		another: n,
		versus: n,
		neither: n,
		about: n,
		favorite: n,
		best: n,
		daily: n,
		weekly: n,
		linear: n,
		binary: n,
		mobile: n,
		lexical: n,
		technical: n,
		computer: n,
		scientific: n,
		security: n,
		government: n,
		popular: n,
		formal: n,
		no: n,
		more: n,
		one: n,
		let: n,
		her: n,
		his: n,
		their: n,
		our: n,
		us: n,
		sheer: n,
		monthly: n,
		yearly: n,
		current: n,
		previous: n,
		upcoming: n,
		last: n,
		next: n,
		main: n,
		initial: n,
		final: n,
		beginning: n,
		end: n,
		top: n,
		bottom: n,
		future: n,
		past: n,
		major: n,
		minor: n,
		side: n,
		central: n,
		peripheral: n,
		public: n,
		private: n
	},
	afterWords: {
		of: n,
		system: n,
		aid: n,
		method: n,
		utility: n,
		tool: n,
		reform: n,
		therapy: n,
		philosophy: n,
		room: n,
		authority: n,
		says: n,
		said: n,
		wants: n,
		wanted: n,
		is: n,
		did: n,
		do: n,
		can: n,
		wise: n
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/_verb.js
var v = "Infinitive";
var _verb_default = {
	beforeTags: {
		Modal: v,
		Adverb: v,
		Negative: v,
		Plural: v
	},
	afterTags: {
		Determiner: v,
		Adverb: v,
		Possessive: v,
		Reflexive: v,
		Preposition: v,
		Cardinal: v,
		Comparative: v,
		Superlative: v
	},
	beforeWords: {
		i: v,
		we: v,
		you: v,
		they: v,
		to: v,
		please: v,
		will: v,
		have: v,
		had: v,
		would: v,
		could: v,
		should: v,
		do: v,
		did: v,
		does: v,
		can: v,
		must: v,
		us: v,
		me: v,
		let: v,
		even: v,
		when: v,
		help: v,
		he: v,
		she: v,
		it: v,
		being: v,
		bi: v,
		co: v,
		contra: v,
		de: v,
		inter: v,
		intra: v,
		mis: v,
		pre: v,
		out: v,
		counter: v,
		nobody: v,
		somebody: v,
		anybody: v,
		everybody: v
	},
	afterWords: {
		the: v,
		me: v,
		you: v,
		him: v,
		us: v,
		her: v,
		his: v,
		them: v,
		they: v,
		it: v,
		himself: v,
		herself: v,
		itself: v,
		myself: v,
		ourselves: v,
		themselves: v,
		something: v,
		anything: v,
		a: v,
		an: v,
		up: v,
		down: v,
		by: v,
		out: v,
		off: v,
		under: v,
		what: v,
		all: v,
		to: v,
		because: v,
		although: v,
		how: v,
		otherwise: v,
		together: v,
		though: v,
		into: v,
		yet: v,
		more: v,
		here: v,
		there: v,
		away: v
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/actor-verb.js
var clue$7 = {
	beforeTags: Object.assign({}, _verb_default.beforeTags, _noun_default.beforeTags, {}),
	afterTags: Object.assign({}, _verb_default.afterTags, _noun_default.afterTags, {}),
	beforeWords: Object.assign({}, _verb_default.beforeWords, _noun_default.beforeWords, {}),
	afterWords: Object.assign({}, _verb_default.afterWords, _noun_default.afterWords, {})
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/_adj.js
var jj$2 = "Adjective";
var _adj_default = {
	beforeTags: {
		Determiner: jj$2,
		Possessive: jj$2,
		Hyphenated: jj$2
	},
	afterTags: { Adjective: jj$2 },
	beforeWords: {
		seem: jj$2,
		seemed: jj$2,
		seems: jj$2,
		feel: jj$2,
		feels: jj$2,
		felt: jj$2,
		stay: jj$2,
		appear: jj$2,
		appears: jj$2,
		appeared: jj$2,
		also: jj$2,
		over: jj$2,
		under: jj$2,
		too: jj$2,
		it: jj$2,
		but: jj$2,
		still: jj$2,
		really: jj$2,
		quite: jj$2,
		well: jj$2,
		very: jj$2,
		truly: jj$2,
		how: jj$2,
		deeply: jj$2,
		hella: jj$2,
		profoundly: jj$2,
		extremely: jj$2,
		so: jj$2,
		badly: jj$2,
		mostly: jj$2,
		totally: jj$2,
		awfully: jj$2,
		rather: jj$2,
		nothing: jj$2,
		something: jj$2,
		anything: jj$2,
		not: jj$2,
		me: jj$2,
		is: jj$2,
		face: jj$2,
		faces: jj$2,
		faced: jj$2,
		look: jj$2,
		looks: jj$2,
		looked: jj$2,
		reveal: jj$2,
		reveals: jj$2,
		revealed: jj$2,
		sound: jj$2,
		sounded: jj$2,
		sounds: jj$2,
		remains: jj$2,
		remained: jj$2,
		prove: jj$2,
		proves: jj$2,
		proved: jj$2,
		becomes: jj$2,
		stays: jj$2,
		tastes: jj$2,
		taste: jj$2,
		smells: jj$2,
		smell: jj$2,
		gets: jj$2,
		grows: jj$2,
		as: jj$2,
		rings: jj$2,
		radiates: jj$2,
		conveys: jj$2,
		convey: jj$2,
		conveyed: jj$2,
		of: jj$2
	},
	afterWords: {
		too: jj$2,
		also: jj$2,
		or: jj$2,
		enough: jj$2,
		as: jj$2
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/_gerund.js
var g$1 = "Gerund";
var _gerund_default = {
	beforeTags: {
		Adverb: g$1,
		Preposition: g$1,
		Conjunction: g$1
	},
	afterTags: {
		Adverb: g$1,
		Possessive: g$1,
		Person: g$1,
		Pronoun: g$1,
		Determiner: g$1,
		Copula: g$1,
		Preposition: g$1,
		Conjunction: g$1,
		Comparative: g$1
	},
	beforeWords: {
		been: g$1,
		keep: g$1,
		continue: g$1,
		stop: g$1,
		am: g$1,
		be: g$1,
		me: g$1,
		began: g$1,
		start: g$1,
		starts: g$1,
		started: g$1,
		stops: g$1,
		stopped: g$1,
		help: g$1,
		helps: g$1,
		avoid: g$1,
		avoids: g$1,
		love: g$1,
		loves: g$1,
		loved: g$1,
		hate: g$1,
		hates: g$1,
		hated: g$1
	},
	afterWords: {
		you: g$1,
		me: g$1,
		her: g$1,
		him: g$1,
		his: g$1,
		them: g$1,
		their: g$1,
		it: g$1,
		this: g$1,
		there: g$1,
		on: g$1,
		about: g$1,
		for: g$1,
		up: g$1,
		down: g$1
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/adj-gerund.js
var g = "Gerund";
var jj$1 = "Adjective";
var clue$6 = {
	beforeTags: Object.assign({}, _adj_default.beforeTags, _gerund_default.beforeTags, {
		Imperative: g,
		Infinitive: jj$1,
		Plural: g
	}),
	afterTags: Object.assign({}, _adj_default.afterTags, _gerund_default.afterTags, { Noun: jj$1 }),
	beforeWords: Object.assign({}, _adj_default.beforeWords, _gerund_default.beforeWords, {
		is: jj$1,
		are: g,
		was: jj$1,
		of: jj$1,
		suggest: g,
		suggests: g,
		suggested: g,
		recommend: g,
		recommends: g,
		recommended: g,
		imagine: g,
		imagines: g,
		imagined: g,
		consider: g,
		considered: g,
		considering: g,
		resist: g,
		resists: g,
		resisted: g,
		avoid: g,
		avoided: g,
		avoiding: g,
		except: jj$1,
		accept: jj$1,
		assess: g,
		explore: g,
		fear: g,
		fears: g,
		appreciate: g,
		question: g,
		help: g,
		embrace: g,
		with: jj$1
	}),
	afterWords: Object.assign({}, _adj_default.afterWords, _gerund_default.afterWords, {
		to: g,
		not: g,
		the: g
	})
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/adj-noun.js
var misc$1 = {
	beforeTags: {
		Determiner: void 0,
		Cardinal: "Noun",
		PhrasalVerb: "Adjective"
	},
	afterTags: {}
};
var clue$5 = {
	beforeTags: Object.assign({}, _adj_default.beforeTags, _noun_default.beforeTags, misc$1.beforeTags),
	afterTags: Object.assign({}, _adj_default.afterTags, _noun_default.afterTags, misc$1.afterTags),
	beforeWords: Object.assign({}, _adj_default.beforeWords, _noun_default.beforeWords, {
		are: "Adjective",
		is: "Adjective",
		was: "Adjective",
		be: "Adjective",
		off: "Adjective",
		out: "Adjective"
	}),
	afterWords: Object.assign({}, _adj_default.afterWords, _noun_default.afterWords)
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/adj-past.js
var past$1 = "PastTense";
var jj = "Adjective";
var adjPast = {
	beforeTags: {
		Adverb: past$1,
		Pronoun: past$1,
		ProperNoun: past$1,
		Auxiliary: past$1,
		Noun: past$1
	},
	afterTags: {
		Possessive: past$1,
		Pronoun: past$1,
		Determiner: past$1,
		Adverb: past$1,
		Comparative: past$1,
		Date: past$1,
		Gerund: past$1
	},
	beforeWords: {
		be: past$1,
		who: past$1,
		get: jj,
		had: past$1,
		has: past$1,
		have: past$1,
		been: past$1,
		it: past$1,
		as: past$1,
		for: jj,
		more: jj,
		always: jj
	},
	afterWords: {
		by: past$1,
		back: past$1,
		out: past$1,
		in: past$1,
		up: past$1,
		down: past$1,
		before: past$1,
		after: past$1,
		for: past$1,
		the: past$1,
		with: past$1,
		as: past$1,
		on: past$1,
		at: past$1,
		between: past$1,
		to: past$1,
		into: past$1,
		us: past$1,
		them: past$1,
		his: past$1,
		her: past$1,
		their: past$1,
		our: past$1,
		me: past$1,
		about: jj
	}
};
var adj_past_default = {
	beforeTags: Object.assign({}, _adj_default.beforeTags, adjPast.beforeTags),
	afterTags: Object.assign({}, _adj_default.afterTags, adjPast.afterTags),
	beforeWords: Object.assign({}, _adj_default.beforeWords, adjPast.beforeWords),
	afterWords: Object.assign({}, _adj_default.afterWords, adjPast.afterWords)
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/adj-present.js
var clue$4 = {
	beforeTags: Object.assign({}, _adj_default.beforeTags, _verb_default.beforeTags, {
		Adverb: void 0,
		Negative: void 0
	}),
	afterTags: Object.assign({}, _adj_default.afterTags, _verb_default.afterTags, { afterTags: {
		Noun: "Adjective",
		Conjunction: void 0
	} }.afterTags),
	beforeWords: Object.assign({}, _adj_default.beforeWords, _verb_default.beforeWords, {
		have: void 0,
		had: void 0,
		not: void 0,
		went: "Adjective",
		goes: "Adjective",
		got: "Adjective",
		be: "Adjective"
	}),
	afterWords: Object.assign({}, _adj_default.afterWords, _verb_default.afterWords, {
		to: void 0,
		as: "Adjective"
	})
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/noun-gerund.js
var misc = {
	beforeTags: {
		Copula: "Gerund",
		PastTense: "Gerund",
		PresentTense: "Gerund",
		Infinitive: "Gerund"
	},
	afterTags: { Value: "Gerund" },
	beforeWords: {
		are: "Gerund",
		were: "Gerund",
		be: "Gerund",
		no: "Gerund",
		without: "Gerund",
		you: "Gerund",
		we: "Gerund",
		they: "Gerund",
		he: "Gerund",
		she: "Gerund",
		us: "Gerund",
		them: "Gerund"
	},
	afterWords: {
		the: "Gerund",
		this: "Gerund",
		that: "Gerund",
		me: "Gerund",
		us: "Gerund",
		them: "Gerund"
	}
};
var clue$3 = {
	beforeTags: Object.assign({}, _gerund_default.beforeTags, _noun_default.beforeTags, misc.beforeTags),
	afterTags: Object.assign({}, _gerund_default.afterTags, _noun_default.afterTags, misc.afterTags),
	beforeWords: Object.assign({}, _gerund_default.beforeWords, _noun_default.beforeWords, misc.beforeWords),
	afterWords: Object.assign({}, _gerund_default.afterWords, _noun_default.afterWords, misc.afterWords)
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/noun-verb.js
var nn$1 = "Singular";
var vb$1 = "Infinitive";
var clue$2 = {
	beforeTags: Object.assign({}, _verb_default.beforeTags, _noun_default.beforeTags, {
		Adjective: nn$1,
		Particle: nn$1
	}),
	afterTags: Object.assign({}, _verb_default.afterTags, _noun_default.afterTags, {
		ProperNoun: vb$1,
		Gerund: vb$1,
		Adjective: vb$1,
		Copula: nn$1
	}),
	beforeWords: Object.assign({}, _verb_default.beforeWords, _noun_default.beforeWords, {
		is: nn$1,
		was: nn$1,
		of: nn$1,
		have: null
	}),
	afterWords: Object.assign({}, _verb_default.afterWords, _noun_default.afterWords, {
		instead: vb$1,
		about: vb$1,
		his: vb$1,
		her: vb$1,
		to: null,
		by: null,
		in: null
	})
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/_person.js
var p$1 = "Person";
var _person_default = {
	beforeTags: {
		Honorific: p$1,
		Person: p$1
	},
	afterTags: {
		Person: p$1,
		ProperNoun: p$1,
		Verb: p$1
	},
	ownTags: { ProperNoun: p$1 },
	beforeWords: {
		hi: p$1,
		hey: p$1,
		yo: p$1,
		dear: p$1,
		hello: p$1
	},
	afterWords: {
		said: p$1,
		says: p$1,
		told: p$1,
		tells: p$1,
		feels: p$1,
		felt: p$1,
		seems: p$1,
		thinks: p$1,
		thought: p$1,
		spends: p$1,
		spendt: p$1,
		plays: p$1,
		played: p$1,
		sing: p$1,
		sang: p$1,
		learn: p$1,
		learned: p$1,
		wants: p$1,
		wanted: p$1
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/person-date.js
var m$1 = "Month";
var month = {
	beforeTags: {
		Date: m$1,
		Value: m$1
	},
	afterTags: {
		Date: m$1,
		Value: m$1
	},
	beforeWords: {
		by: m$1,
		in: m$1,
		on: m$1,
		during: m$1,
		after: m$1,
		before: m$1,
		between: m$1,
		until: m$1,
		til: m$1,
		sometime: m$1,
		of: m$1,
		this: m$1,
		next: m$1,
		last: m$1,
		previous: m$1,
		following: m$1,
		with: "Person"
	},
	afterWords: {
		sometime: m$1,
		in: m$1,
		of: m$1,
		until: m$1,
		the: m$1
	}
};
var person_date_default = {
	beforeTags: Object.assign({}, _person_default.beforeTags, month.beforeTags),
	afterTags: Object.assign({}, _person_default.afterTags, month.afterTags),
	beforeWords: Object.assign({}, _person_default.beforeWords, month.beforeWords),
	afterWords: Object.assign({}, _person_default.afterWords, month.afterWords)
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/person-noun.js
var clue$1 = {
	beforeTags: Object.assign({}, _noun_default.beforeTags, _person_default.beforeTags),
	afterTags: Object.assign({}, _noun_default.afterTags, _person_default.afterTags),
	beforeWords: Object.assign({}, _noun_default.beforeWords, _person_default.beforeWords, {
		i: "Infinitive",
		we: "Infinitive"
	}),
	afterWords: Object.assign({}, _noun_default.afterWords, _person_default.afterWords)
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/person-verb.js
var clues$3 = {
	beforeTags: Object.assign({}, _noun_default.beforeTags, _person_default.beforeTags, _verb_default.beforeTags),
	afterTags: Object.assign({}, _noun_default.afterTags, _person_default.afterTags, _verb_default.afterTags),
	beforeWords: Object.assign({}, _noun_default.beforeWords, _person_default.beforeWords, _verb_default.beforeWords),
	afterWords: Object.assign({}, _noun_default.afterWords, _person_default.afterWords, _verb_default.afterWords)
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/person-place.js
var p = "Place";
var place = {
	beforeTags: { Place: p },
	afterTags: {
		Place: p,
		Abbreviation: p
	},
	beforeWords: {
		in: p,
		by: p,
		near: p,
		from: p,
		to: p
	},
	afterWords: {
		in: p,
		by: p,
		near: p,
		from: p,
		to: p,
		government: p,
		council: p,
		region: p,
		city: p
	}
};
var clue = {
	beforeTags: Object.assign({}, place.beforeTags, _person_default.beforeTags),
	afterTags: Object.assign({}, place.afterTags, _person_default.afterTags),
	beforeWords: Object.assign({}, place.beforeWords, _person_default.beforeWords),
	afterWords: Object.assign({}, place.afterWords, _person_default.afterWords)
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/person-adj.js
var clues$2 = {
	beforeTags: Object.assign({}, _person_default.beforeTags, _adj_default.beforeTags),
	afterTags: Object.assign({}, _person_default.afterTags, _adj_default.afterTags),
	beforeWords: Object.assign({}, _person_default.beforeWords, _adj_default.beforeWords),
	afterWords: Object.assign({}, _person_default.afterWords, _adj_default.afterWords)
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/unit-noun.js
var un = "Unit";
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/clues/index.js
var clues = {
	"Actor|Verb": clue$7,
	"Adj|Gerund": clue$6,
	"Adj|Noun": clue$5,
	"Adj|Past": adj_past_default,
	"Adj|Present": clue$4,
	"Noun|Verb": clue$2,
	"Noun|Gerund": clue$3,
	"Person|Noun": clue$1,
	"Person|Date": person_date_default,
	"Person|Verb": clues$3,
	"Person|Place": clue,
	"Person|Adj": clues$2,
	"Unit|Noun": {
		beforeTags: { Value: un },
		afterTags: {},
		beforeWords: {
			per: un,
			every: un,
			each: un,
			square: un,
			cubic: un,
			sq: un,
			metric: un
		},
		afterWords: {
			per: un,
			squared: un,
			cubed: un,
			long: un
		}
	}
};
var copy = (obj, more) => {
	const res = Object.keys(obj).reduce((h, k) => {
		h[k] = obj[k] === "Infinitive" ? "PresentTense" : "Plural";
		return h;
	}, {});
	return Object.assign(res, more);
};
clues["Plural|Verb"] = {
	beforeWords: copy(clues["Noun|Verb"].beforeWords, {
		had: "Plural",
		have: "Plural"
	}),
	afterWords: copy(clues["Noun|Verb"].afterWords, {
		his: "PresentTense",
		her: "PresentTense",
		its: "PresentTense",
		in: null,
		to: null,
		is: "PresentTense",
		by: "PresentTense"
	}),
	beforeTags: copy(clues["Noun|Verb"].beforeTags, {
		Conjunction: "PresentTense",
		Noun: void 0,
		ProperNoun: "PresentTense"
	}),
	afterTags: copy(clues["Noun|Verb"].afterTags, {
		Gerund: "Plural",
		Noun: "PresentTense",
		Value: "PresentTense"
	})
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/patterns/suffixes.js
var Adj$2 = "Adjective";
var Inf$1 = "Infinitive";
var Pres$1 = "PresentTense";
var Sing$1 = "Singular";
var Past$1 = "PastTense";
var Avb = "Adverb";
var Plrl = "Plural";
var Actor$1 = "Actor";
var Vb = "Verb";
var Noun$2 = "Noun";
var Prop = "ProperNoun";
var Last$1 = "LastName";
var Modal = "Modal";
var Place = "Place";
var Prt = "Participle";
var suffixes_default = [
	null,
	null,
	{
		ea: Sing$1,
		ia: Noun$2,
		ic: Adj$2,
		ly: Avb,
		"'n": Vb,
		"'t": Vb
	},
	{
		oed: Past$1,
		ued: Past$1,
		xed: Past$1,
		" so": Avb,
		"'ll": Modal,
		"'re": "Copula",
		azy: Adj$2,
		eer: Noun$2,
		end: Vb,
		ped: Past$1,
		ffy: Adj$2,
		ify: Inf$1,
		ing: "Gerund",
		ize: Inf$1,
		ibe: Inf$1,
		lar: Adj$2,
		mum: Adj$2,
		nes: Pres$1,
		nny: Adj$2,
		ous: Adj$2,
		que: Adj$2,
		ger: Noun$2,
		ber: Noun$2,
		rol: Sing$1,
		sis: Sing$1,
		ogy: Sing$1,
		oid: Sing$1,
		ian: Sing$1,
		zes: Pres$1,
		eld: Past$1,
		ken: Prt,
		ven: Prt,
		ten: Prt,
		ect: Inf$1,
		ict: Inf$1,
		ign: Inf$1,
		oze: Inf$1,
		ful: Adj$2,
		bal: Adj$2,
		ton: Noun$2,
		pur: Place
	},
	{
		amed: Past$1,
		aped: Past$1,
		ched: Past$1,
		lked: Past$1,
		rked: Past$1,
		reed: Past$1,
		nded: Past$1,
		mned: Adj$2,
		cted: Past$1,
		dged: Past$1,
		ield: Sing$1,
		akis: Last$1,
		cede: Inf$1,
		chuk: Last$1,
		czyk: Last$1,
		ects: Pres$1,
		iend: Sing$1,
		ends: Vb,
		enko: Last$1,
		ette: Sing$1,
		iary: Sing$1,
		wner: Sing$1,
		fies: Pres$1,
		fore: Avb,
		gate: Inf$1,
		gone: Adj$2,
		ices: Plrl,
		ints: Plrl,
		ruct: Inf$1,
		ines: Plrl,
		ions: Plrl,
		ners: Plrl,
		pers: Plrl,
		lers: Plrl,
		less: Adj$2,
		llen: Adj$2,
		made: Adj$2,
		nsen: Last$1,
		oses: Pres$1,
		ould: Modal,
		some: Adj$2,
		sson: Last$1,
		ians: Plrl,
		tion: Sing$1,
		tage: Noun$2,
		ique: Sing$1,
		tive: Adj$2,
		tors: Noun$2,
		vice: Sing$1,
		lier: Sing$1,
		fier: Sing$1,
		wned: Past$1,
		gent: Sing$1,
		tist: Actor$1,
		pist: Actor$1,
		rist: Actor$1,
		mist: Actor$1,
		yist: Actor$1,
		vist: Actor$1,
		ists: Actor$1,
		lite: Sing$1,
		site: Sing$1,
		rite: Sing$1,
		mite: Sing$1,
		bite: Sing$1,
		mate: Sing$1,
		date: Sing$1,
		ndal: Sing$1,
		vent: Sing$1,
		uist: Actor$1,
		gist: Actor$1,
		note: Sing$1,
		cide: Sing$1,
		ence: Sing$1,
		wide: Adj$2,
		vide: Inf$1,
		ract: Inf$1,
		duce: Inf$1,
		pose: Inf$1,
		eive: Inf$1,
		lyze: Inf$1,
		lyse: Inf$1,
		iant: Adj$2,
		nary: Adj$2,
		ghty: Adj$2,
		uent: Adj$2,
		erer: Actor$1,
		bury: Place,
		dorf: Noun$2,
		esty: Noun$2,
		wych: Place,
		dale: Place,
		folk: Place,
		vale: Place,
		abad: Place,
		sham: Place,
		wick: Place,
		view: Place
	},
	{
		elist: Actor$1,
		holic: Sing$1,
		phite: Sing$1,
		tized: Past$1,
		urned: Past$1,
		eased: Past$1,
		ances: Plrl,
		bound: Adj$2,
		ettes: Plrl,
		fully: Avb,
		ishes: Pres$1,
		ities: Plrl,
		marek: Last$1,
		nssen: Last$1,
		ology: Noun$2,
		osome: Sing$1,
		tment: Sing$1,
		ports: Plrl,
		rough: Adj$2,
		tches: Pres$1,
		tieth: "Ordinal",
		tures: Plrl,
		wards: Avb,
		where: Avb,
		archy: Noun$2,
		pathy: Noun$2,
		opoly: Noun$2,
		embly: Noun$2,
		phate: Noun$2,
		ndent: Sing$1,
		scent: Sing$1,
		onist: Actor$1,
		anist: Actor$1,
		alist: Actor$1,
		olist: Actor$1,
		icist: Actor$1,
		ounce: Inf$1,
		iable: Adj$2,
		borne: Adj$2,
		gnant: Adj$2,
		inant: Adj$2,
		igent: Adj$2,
		atory: Adj$2,
		rient: Sing$1,
		dient: Sing$1,
		maker: Actor$1,
		burgh: Place,
		mouth: Place,
		ceter: Place,
		ville: Place,
		hurst: Place,
		stead: Place,
		endon: Place,
		brook: Place,
		shire: Place,
		worth: Noun$2,
		field: Prop,
		ridge: Place
	},
	{
		auskas: Last$1,
		parent: Sing$1,
		cedent: Sing$1,
		ionary: Sing$1,
		cklist: Sing$1,
		brooke: Place,
		keeper: Actor$1,
		logist: Actor$1,
		teenth: "Value",
		worker: Actor$1,
		master: Actor$1,
		writer: Actor$1,
		brough: Place,
		cester: Place,
		ington: Place,
		cliffe: Place,
		ingham: Place
	},
	{
		chester: Place,
		logists: Actor$1,
		opoulos: Last$1,
		borough: Place,
		sdottir: Last$1
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/patterns/prefixes.js
var Adj$1 = "Adjective";
var Noun$1 = "Noun";
var Verb$1 = "Verb";
var prefixes_default = [
	null,
	null,
	{},
	{
		neo: Noun$1,
		bio: Noun$1,
		"de-": Verb$1,
		"re-": Verb$1,
		"un-": Verb$1,
		"ex-": Noun$1
	},
	{
		anti: Noun$1,
		auto: Noun$1,
		faux: Adj$1,
		hexa: Noun$1,
		kilo: Noun$1,
		mono: Noun$1,
		nano: Noun$1,
		octa: Noun$1,
		poly: Noun$1,
		semi: Adj$1,
		tele: Noun$1,
		"pro-": Adj$1,
		"mis-": Verb$1,
		"dis-": Verb$1,
		"pre-": Adj$1
	},
	{
		anglo: Noun$1,
		centi: Noun$1,
		ethno: Noun$1,
		ferro: Noun$1,
		grand: Noun$1,
		hepta: Noun$1,
		hydro: Noun$1,
		intro: Noun$1,
		macro: Noun$1,
		micro: Noun$1,
		milli: Noun$1,
		nitro: Noun$1,
		penta: Noun$1,
		quasi: Adj$1,
		radio: Noun$1,
		tetra: Noun$1,
		"omni-": Adj$1,
		"post-": Adj$1
	},
	{
		pseudo: Adj$1,
		"extra-": Adj$1,
		"hyper-": Adj$1,
		"inter-": Adj$1,
		"intra-": Adj$1,
		"deca-": Adj$1
	},
	{ electro: Noun$1 }
];
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/patterns/endsWith.js
var Adj = "Adjective";
var Inf = "Infinitive";
var Pres = "PresentTense";
var Sing = "Singular";
var Past = "PastTense";
var Adverb = "Adverb";
var Exp = "Expression";
var Actor = "Actor";
var Verb = "Verb";
var Noun = "Noun";
var Last = "LastName";
var endsWith_default = {
	a: [
		[
			/.[aeiou]na$/,
			Noun,
			"tuna"
		],
		[/.[oau][wvl]ska$/, Last],
		[
			/.[^aeiou]ica$/,
			Sing,
			"harmonica"
		],
		[
			/^([hyj]a+)+$/,
			Exp,
			"haha"
		]
	],
	c: [[/.[^aeiou]ic$/, Adj]],
	d: [
		[
			/[aeiou](pp|ll|ss|ff|gg|tt|rr|bb|nn|mm)ed$/,
			Past,
			"popped"
		],
		[
			/.[aeo]{2}[bdgmnprvz]ed$/,
			Past,
			"rammed"
		],
		[
			/.[aeiou][sg]hed$/,
			Past,
			"gushed"
		],
		[
			/.[aeiou]red$/,
			Past,
			"hired"
		],
		[
			/.[aeiou]r?ried$/,
			Past,
			"hurried"
		],
		[
			/[^aeiou]ard$/,
			Sing,
			"steward"
		],
		[
			/[aeiou][^aeiou]id$/,
			Adj,
			""
		],
		[
			/.[vrl]id$/,
			Adj,
			"livid"
		],
		[
			/..led$/,
			Past,
			"hurled"
		],
		[
			/.[iao]sed$/,
			Past,
			""
		],
		[
			/[aeiou]n?[cs]ed$/,
			Past,
			""
		],
		[
			/[aeiou][rl]?[mnf]ed$/,
			Past,
			""
		],
		[
			/[aeiou][ns]?c?ked$/,
			Past,
			"bunked"
		],
		[/[aeiou]gned$/, Past],
		[/[aeiou][nl]?ged$/, Past],
		[/.[tdbwxyz]ed$/, Past],
		[/[^aeiou][aeiou][tvx]ed$/, Past],
		[
			/.[cdflmnprstv]ied$/,
			Past,
			"emptied"
		]
	],
	e: [
		[
			/.[lnr]ize$/,
			Inf,
			"antagonize"
		],
		[
			/.[^aeiou]ise$/,
			Inf,
			"antagonise"
		],
		[
			/.[aeiou]te$/,
			Inf,
			"bite"
		],
		[
			/.[^aeiou][ai]ble$/,
			Adj,
			"fixable"
		],
		[
			/.[^aeiou]eable$/,
			Adj,
			"maleable"
		],
		[
			/.[ts]ive$/,
			Adj,
			"festive"
		],
		[
			/[a-z]-like$/,
			Adj,
			"woman-like"
		]
	],
	h: [
		[
			/.[^aeiouf]ish$/,
			Adj,
			"cornish"
		],
		[
			/.v[iy]ch$/,
			Last,
			"..ovich"
		],
		[
			/^ug?h+$/,
			Exp,
			"ughh"
		],
		[
			/^uh[ -]?oh$/,
			Exp,
			"uhoh"
		],
		[
			/[a-z]-ish$/,
			Adj,
			"cartoon-ish"
		]
	],
	i: [[
		/.[oau][wvl]ski$/,
		Last,
		"polish-male"
	]],
	k: [[
		/^(k){2}$/,
		Exp,
		"kkkk"
	]],
	l: [
		[
			/.[gl]ial$/,
			Adj,
			"familial"
		],
		[
			/.[^aeiou]ful$/,
			Adj,
			"fitful"
		],
		[
			/.[nrtumcd]al$/,
			Adj,
			"natal"
		],
		[
			/.[^aeiou][ei]al$/,
			Adj,
			"familial"
		]
	],
	m: [
		[
			/.[^aeiou]ium$/,
			Sing,
			"magnesium"
		],
		[
			/[^aeiou]ism$/,
			Sing,
			"schism"
		],
		[
			/^[hu]m+$/,
			Exp,
			"hmm"
		],
		[
			/^\d+ ?[ap]m$/,
			"Date",
			"3am"
		]
	],
	n: [
		[
			/.[lsrnpb]ian$/,
			Adj,
			"republican"
		],
		[
			/[^aeiou]ician$/,
			Actor,
			"musician"
		],
		[
			/[aeiou][ktrp]in'$/,
			"Gerund",
			"cookin'"
		]
	],
	o: [
		[
			/^no+$/,
			Exp,
			"noooo"
		],
		[
			/^(yo)+$/,
			Exp,
			"yoo"
		],
		[
			/^wo{2,}[pt]?$/,
			Exp,
			"woop"
		]
	],
	r: [
		[/.[bdfklmst]ler$/, "Noun"],
		[/[aeiou][pns]er$/, Sing],
		[/[^i]fer$/, Inf],
		[/.[^aeiou][ao]pher$/, Actor],
		[/.[lk]er$/, "Noun"],
		[/.ier$/, "Comparative"]
	],
	t: [
		[/.[di]est$/, "Superlative"],
		[/.[icldtgrv]ent$/, Adj],
		[/[aeiou].*ist$/, Adj],
		[/^[a-z]et$/, Verb]
	],
	s: [
		[/.[^aeiou]ises$/, Pres],
		[/.[rln]ates$/, Pres],
		[/.[^z]ens$/, Verb],
		[/.[lstrn]us$/, Sing],
		[/.[aeiou]sks$/, Pres],
		[/.[aeiou]kes$/, Pres],
		[/[aeiou][^aeiou]is$/, Sing],
		[/[a-z]'s$/, Noun],
		[/^yes+$/, Exp]
	],
	v: [[/.[^aeiou][ai][kln]ov$/, Last]],
	y: [
		[/.[cts]hy$/, Adj],
		[/.[st]ty$/, Adj],
		[/.[tnl]ary$/, Adj],
		[/.[oe]ry$/, Sing],
		[/[rdntkbhs]ly$/, Adverb],
		[/.(gg|bb|zz)ly$/, Adj],
		[/...lly$/, Adverb],
		[/.[gk]y$/, Adj],
		[/[bszmp]{2}y$/, Adj],
		[/.[ai]my$/, Adj],
		[/[ea]{2}zy$/, Adj],
		[/.[^aeiou]ity$/, Sing]
	]
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/patterns/neighbours.js
var vb = "Verb";
var nn = "Noun";
var neighbours_default = {
	leftTags: [
		["Adjective", nn],
		["Possessive", nn],
		["Determiner", nn],
		["Adverb", vb],
		["Pronoun", vb],
		["Value", nn],
		["Ordinal", nn],
		["Modal", vb],
		["Superlative", nn],
		["Demonym", nn],
		["Honorific", "Person"]
	],
	leftWords: [
		["i", vb],
		["first", nn],
		["it", vb],
		["there", vb],
		["not", vb],
		["because", nn],
		["if", nn],
		["but", nn],
		["who", vb],
		["this", nn],
		["his", nn],
		["when", nn],
		["you", vb],
		["very", "Adjective"],
		["old", nn],
		["never", vb],
		["before", nn],
		["a", nn],
		["the", nn],
		["been", vb]
	],
	rightTags: [
		["Copula", nn],
		["PastTense", nn],
		["Conjunction", nn],
		["Modal", nn]
	],
	rightWords: [
		["there", vb],
		["me", vb],
		["man", "Adjective"],
		["him", vb],
		["it", vb],
		["were", nn],
		["took", nn],
		["himself", vb],
		["went", nn],
		["who", nn],
		["jr", "Person"]
	]
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/models/_data.js
var _data_default = {
	"Comparative": {
		"fwd": "3:ser,ier¦1er:h,t,f,l,n¦1r:e¦2er:ss,or,om",
		"both": "3er:ver,ear,alm¦3ner:hin¦3ter:lat¦2mer:im¦2er:ng,rm,mb¦2ber:ib¦2ger:ig¦1er:w,p,k,d¦ier:y",
		"rev": "1:tter,yer¦2:uer,ver,ffer,oner,eler,ller,iler,ster,cer,uler,sher,ener,gher,aner,adder,nter,eter,rter,hter,rner,fter¦3:oser,ooler,eafer,user,airer,bler,maler,tler,eater,uger,rger,ainer,urer,ealer,icher,pler,emner,icter,nser,iser¦4:arser,viner,ucher,rosser,somer,ndomer,moter,oother,uarer,hiter¦5:nuiner,esser,emier¦ar:urther",
		"ex": "worse:bad¦better:good¦4er:fair,gray,poor¦1urther:far¦3ter:fat,hot,wet¦3der:mad,sad¦3er:shy,fun¦4der:glad¦:¦4r:cute,dire,fake,fine,free,lame,late,pale,rare,ripe,rude,safe,sore,tame,wide¦5r:eerie,stale"
	},
	"Gerund": {
		"fwd": "1:nning,tting,rring,pping,eing,mming,gging,dding,bbing,kking¦2:eking,oling,eling,eming¦3:velling,siting,uiting,fiting,loting,geting,ialing,celling¦4:graming",
		"both": "1:aing,iing,fing,xing,ying,oing,hing,wing¦2:tzing,rping,izzing,bting,mning,sping,wling,rling,wding,rbing,uping,lming,wning,mping,oning,lting,mbing,lking,fting,hting,sking,gning,pting,cking,ening,nking,iling,eping,ering,rting,rming,cting,lping,ssing,nting,nding,lding,sting,rning,rding,rking¦3:belling,siping,toming,yaking,uaking,oaning,auling,ooping,aiding,naping,euring,tolling,uzzing,ganing,haning,ualing,halling,iasing,auding,ieting,ceting,ouling,voring,ralling,garing,joring,oaming,oaking,roring,nelling,ooring,uelling,eaming,ooding,eaping,eeting,ooting,ooming,xiting,keting,ooking,ulling,airing,oaring,biting,outing,oiting,earing,naling,oading,eeding,ouring,eaking,aiming,illing,oining,eaning,onging,ealing,aining,eading¦4:thoming,melling,aboring,ivoting,weating,dfilling,onoring,eriting,imiting,tialling,rgining,otoring,linging,winging,lleting,louding,spelling,mpelling,heating,feating,opelling,choring,welling,ymaking,ctoring,calling,peating,iloring,laiting,utoring,uditing,mmaking,loating,iciting,waiting,mbating,voiding,otalling,nsoring,nselling,ocusing,itoring,eloping¦5:rselling,umpeting,atrolling,treating,tselling,rpreting,pringing,ummeting,ossoming,elmaking,eselling,rediting,totyping,onmaking,rfeiting,ntrolling¦5e:chmaking,dkeeping,severing,erouting,ecreting,ephoning,uthoring,ravening,reathing,pediting,erfering,eotyping,fringing,entoring,ombining,ompeting¦4e:emaking,eething,twining,rruling,chuting,xciting,rseding,scoping,edoring,pinging,lunging,agining,craping,pleting,eleting,nciting,nfining,ncoding,tponing,ecoding,writing,esaling,nvening,gnoring,evoting,mpeding,rvening,dhering,mpiling,storing,nviting,ploring¦3e:tining,nuring,saking,miring,haling,ceding,xuding,rining,nuting,laring,caring,miling,riding,hoking,piring,lading,curing,uading,noting,taping,futing,paring,hading,loding,siring,guring,vading,voking,during,niting,laning,caping,luting,muting,ruding,ciding,juring,laming,caling,hining,uoting,liding,ciling,duling,tuting,puting,cuting,coring,uiding,tiring,turing,siding,rading,enging,haping,buting,lining,taking,anging,haring,uiring,coming,mining,moting,suring,viding,luding¦2e:tring,zling,uging,oging,gling,iging,vring,fling,lging,obing,psing,pling,ubing,cling,dling,wsing,iking,rsing,dging,kling,ysing,tling,rging,eging,nsing,uning,osing,uming,using,ibing,bling,aging,ising,asing,ating¦2ie:rlying¦1e:zing,uing,cing,ving",
		"rev": "ying:ie¦1ing:se,ke,te,we,ne,re,de,pe,me,le,c,he¦2ing:ll,ng,dd,ee,ye,oe,rg,us¦2ning:un¦2ging:og,ag,ug,ig,eg¦2ming:um¦2bing:ub,ab,eb,ob¦3ning:lan,can,hin,pin,win¦3ring:cur,lur,tir,tar,pur,car¦3ing:ait,del,eel,fin,eat,oat,eem,lel,ool,ein,uin¦3ping:rop,rap,top,uip,wap,hip,hop,lap,rip,cap¦3ming:tem,wim,rim,kim,lim¦3ting:mat,cut,pot,lit,lot,hat,set,pit,put¦3ding:hed,bed,bid¦3king:rek¦3ling:cil,pel¦3bing:rib¦4ning:egin¦4ing:isit,ruit,ilot,nsit,dget,rkel,ival,rcel¦4ring:efer,nfer¦4ting:rmit,mmit,ysit,dmit,emit,bmit,tfit,gret¦4ling:evel,xcel,ivel¦4ding:hred¦5ing:arget,posit,rofit¦5ring:nsfer¦5ting:nsmit,orget,cquit¦5ling:ancel,istil",
		"ex": "3:adding,eating,aiming,aiding,airing,outing,gassing,setting,getting,putting,cutting,winning,sitting,betting,mapping,tapping,letting,bidding,hitting,tanning,netting,popping,fitting,capping,lapping,barring,banning,vetting,topping,rotting,tipping,potting,wetting,pitting,dipping,budding,hemming,pinning,jetting,kidding,padding,podding,sipping,wedding,bedding,donning,warring,penning,gutting,cueing,wadding,petting,ripping,napping,matting,tinning,binning,dimming,hopping,mopping,nodding,panning,rapping,ridding,sinning¦4:selling,falling,calling,waiting,editing,telling,rolling,heating,boating,hanging,beating,coating,singing,tolling,felling,polling,discing,seating,voiding,gelling,yelling,baiting,reining,ruining,seeking,spanning,stepping,knitting,emitting,slipping,quitting,dialing,omitting,clipping,shutting,skinning,abutting,flipping,trotting,cramming,fretting,suiting¦5:bringing,treating,spelling,stalling,trolling,expelling,rivaling,wringing,deterring,singeing,befitting,refitting¦6:enrolling,distilling,scrolling,strolling,caucusing,travelling¦7:installing,redefining,stencilling,recharging,overeating,benefiting,unraveling,programing¦9:reprogramming¦is:being¦2e:using,aging,owing¦3e:making,taking,coming,noting,hiring,filing,coding,citing,doping,baking,coping,hoping,lading,caring,naming,voting,riding,mining,curing,lining,ruling,typing,boring,dining,firing,hiding,piling,taping,waning,baling,boning,faring,honing,wiping,luring,timing,wading,piping,fading,biting,zoning,daring,waking,gaming,raking,ceding,tiring,coking,wining,joking,paring,gaping,poking,pining,coring,liming,toting,roping,wiring,aching¦4e:writing,storing,eroding,framing,smoking,tasting,wasting,phoning,shaking,abiding,braking,flaking,pasting,priming,shoring,sloping,withing,hinging¦5e:defining,refining,renaming,swathing,fringing,reciting¦1ie:dying,tying,lying,vying¦7e:sunbathing"
	},
	"Participle": {
		"fwd": "1:mt¦2:llen¦3:iven,aken¦:ne¦y:in",
		"both": "1:wn¦2:me,aten¦3:seen,bidden,isen¦4:roven,asten¦3l:pilt¦3d:uilt¦2e:itten¦1im:wum¦1eak:poken¦1ine:hone¦1ose:osen¦1in:gun¦1ake:woken¦ear:orn¦eal:olen¦eeze:ozen¦et:otten¦ink:unk¦ing:ung",
		"rev": "2:un¦oken:eak¦ought:eek¦oven:eave¦1ne:o¦1own:ly¦1den:de¦1in:ay¦2t:am¦2n:ee¦3en:all¦4n:rive,sake,take¦5n:rgive",
		"ex": "2:been¦3:seen,run¦4:given,taken¦5:shaken¦2eak:broken¦1ive:dove¦2y:flown¦3e:hidden,ridden¦1eek:sought¦1ake:woken¦1eave:woven"
	},
	"PastTense": {
		"fwd": "1:tted,wed,gged,nned,een,rred,pped,yed,bbed,oed,dded,rd,wn,mmed¦2:eed,nded,et,hted,st,oled,ut,emed,eled,lded,ken,rt,nked,apt,ant,eped,eked¦3:eared,eat,eaded,nelled,ealt,eeded,ooted,eaked,eaned,eeted,mited,bid,uit,ead,uited,ealed,geted,velled,ialed,belled¦4:ebuted,hined,comed¦y:ied¦ome:ame¦ear:ore¦ind:ound¦ing:ung,ang¦ep:pt¦ink:ank,unk¦ig:ug¦all:ell¦ee:aw¦ive:ave¦eeze:oze¦old:eld¦ave:ft¦ake:ook¦ell:old¦ite:ote¦ide:ode¦ine:one¦in:un,on¦eal:ole¦im:am¦ie:ay¦and:ood¦1ise:rose¦1eak:roke¦1ing:rought¦1ive:rove¦1el:elt¦1id:bade¦1et:got¦1y:aid¦1it:sat¦3e:lid¦3d:pent",
		"both": "1:aed,fed,xed,hed¦2:sged,xted,wled,rped,lked,kied,lmed,lped,uped,bted,rbed,rked,wned,rled,mped,fted,mned,mbed,zzed,omed,ened,cked,gned,lted,sked,ued,zed,nted,ered,rted,rmed,ced,sted,rned,ssed,rded,pted,ved,cted¦3:cled,eined,siped,ooned,uked,ymed,jored,ouded,ioted,oaned,lged,asped,iged,mured,oided,eiled,yped,taled,moned,yled,lit,kled,oaked,gled,naled,fled,uined,oared,valled,koned,soned,aided,obed,ibed,meted,nicked,rored,micked,keted,vred,ooped,oaded,rited,aired,auled,filled,ouled,ooded,ceted,tolled,oited,bited,aped,tled,vored,dled,eamed,nsed,rsed,sited,owded,pled,sored,rged,osed,pelled,oured,psed,oated,loned,aimed,illed,eured,tred,ioned,celled,bled,wsed,ooked,oiled,itzed,iked,iased,onged,ased,ailed,uned,umed,ained,auded,nulled,ysed,eged,ised,aged,oined,ated,used,dged,doned¦4:ntied,efited,uaked,caded,fired,roped,halled,roked,himed,culed,tared,lared,tuted,uared,routed,pited,naked,miled,houted,helled,hared,cored,caled,tired,peated,futed,ciled,called,tined,moted,filed,sided,poned,iloted,honed,lleted,huted,ruled,cured,named,preted,vaded,sured,talled,haled,peded,gined,nited,uided,ramed,feited,laked,gured,ctored,unged,pired,cuted,voked,eloped,ralled,rined,coded,icited,vided,uaded,voted,mined,sired,noted,lined,nselled,luted,jured,fided,puted,piled,pared,olored,cided,hoked,enged,tured,geoned,cotted,lamed,uiled,waited,udited,anged,luded,mired,uired,raded¦5:modelled,izzled,eleted,umpeted,ailored,rseded,treated,eduled,ecited,rammed,eceded,atrolled,nitored,basted,twined,itialled,ncited,gnored,ploded,xcited,nrolled,namelled,plored,efeated,redited,ntrolled,nfined,pleted,llided,lcined,eathed,ibuted,lloted,dhered,cceded¦3ad:sled¦2aw:drew¦2ot:hot¦2ke:made¦2ow:hrew,grew¦2ose:hose¦2d:ilt¦2in:egan¦1un:ran¦1ink:hought¦1ick:tuck¦1ike:ruck¦1eak:poke,nuck¦1it:pat¦1o:did¦1ow:new¦1ake:woke¦go:went",
		"rev": "3:rst,hed,hut,cut,set¦4:tbid¦5:dcast,eread,pread,erbid¦ought:uy,eek¦1ied:ny,ly,dy,ry,fy,py,vy,by,ty,cy¦1ung:ling,ting,wing¦1pt:eep¦1ank:rink¦1ore:bear,wear¦1ave:give¦1oze:reeze¦1ound:rind,wind¦1ook:take,hake¦1aw:see¦1old:sell¦1ote:rite¦1ole:teal¦1unk:tink¦1am:wim¦1ay:lie¦1ood:tand¦1eld:hold¦2d:he,ge,re,le,leed,ne,reed,be,ye,lee,pe,we¦2ed:dd,oy,or,ey,gg,rr,us,ew,to¦2ame:ecome,rcome¦2ped:ap¦2ged:ag,og,ug,eg¦2bed:ub,ab,ib,ob¦2lt:neel¦2id:pay¦2ang:pring¦2ove:trive¦2med:um¦2ode:rride¦2at:ysit¦3ted:mit,hat,mat,lat,pot,rot,bat¦3ed:low,end,tow,und,ond,eem,lay,cho,dow,xit,eld,ald,uld,law,lel,eat,oll,ray,ank,fin,oam,out,how,iek,tay,haw,ait,vet,say,cay,bow¦3d:ste,ede,ode,ete,ree,ude,ame,oke,ote,ime,ute,ade¦3red:lur,cur,pur,car¦3ped:hop,rop,uip,rip,lip,tep,top¦3ded:bed,rod,kid¦3ade:orbid¦3led:uel¦3ned:lan,can,kin,pan,tun¦3med:rim,lim¦4ted:quit,llot¦4ed:pear,rrow,rand,lean,mand,anel,pand,reet,link,abel,evel,imit,ceed,ruit,mind,peal,veal,hool,head,pell,well,mell,uell,band,hear,weak¦4led:nnel,qual,ebel,ivel¦4red:nfer,efer,sfer¦4n:sake,trew¦4d:ntee¦4ded:hred¦4ned:rpin¦5ed:light,nceal,right,ndear,arget,hread,eight,rtial,eboot¦5d:edite,nvite¦5ted:egret¦5led:ravel",
		"ex": "2:been,upped¦3:added,aged,aided,aimed,aired,bid,died,dyed,egged,erred,eyed,fit,gassed,hit,lied,owed,pent,pied,tied,used,vied,oiled,outed,banned,barred,bet,canned,cut,dipped,donned,ended,feed,inked,jarred,let,manned,mowed,netted,padded,panned,pitted,popped,potted,put,set,sewn,sowed,tanned,tipped,topped,vowed,weed,bowed,jammed,binned,dimmed,hopped,mopped,nodded,pinned,rigged,sinned,towed,vetted¦4:ached,baked,baled,boned,bored,called,caned,cared,ceded,cited,coded,cored,cubed,cured,dared,dined,edited,exited,faked,fared,filed,fined,fired,fuelled,gamed,gelled,hired,hoped,joked,lined,mined,named,noted,piled,poked,polled,pored,pulled,reaped,roamed,rolled,ruled,seated,shed,sided,timed,tolled,toned,voted,waited,walled,waned,winged,wiped,wired,zoned,yelled,tamed,lubed,roped,faded,mired,caked,honed,banged,culled,heated,raked,welled,banded,beat,cast,cooled,cost,dealt,feared,folded,footed,handed,headed,heard,hurt,knitted,landed,leaked,leapt,linked,meant,minded,molded,neared,needed,peaked,plodded,plotted,pooled,quit,read,rooted,sealed,seeded,seeped,shipped,shunned,skimmed,slammed,sparred,stemmed,stirred,suited,thinned,twinned,swayed,winked,dialed,abutted,blotted,fretted,healed,heeded,peeled,reeled¦5:basted,cheated,equalled,eroded,exiled,focused,opined,pleated,primed,quoted,scouted,shored,sloped,smoked,sniped,spelled,spouted,routed,staked,stored,swelled,tasted,treated,wasted,smelled,dwelled,honored,prided,quelled,eloped,scared,coveted,sweated,breaded,cleared,debuted,deterred,freaked,modeled,pleaded,rebutted,speeded¦6:anchored,defined,endured,impaled,invited,refined,revered,strolled,cringed,recast,thrust,unfolded¦7:authored,combined,competed,conceded,convened,excreted,extruded,redefined,restored,secreted,rescinded,welcomed¦8:expedited,infringed¦9:interfered,intervened,persevered¦10:contravened¦eat:ate¦is:was¦go:went¦are:were¦3d:bent,lent,rent,sent¦3e:bit,fled,hid,lost¦3ed:bled,bred¦2ow:blew,grew¦1uy:bought¦2tch:caught¦1o:did¦1ive:dove,gave¦2aw:drew¦2ed:fed¦2y:flew,laid,paid,said¦1ight:fought¦1et:got¦2ve:had¦1ang:hung¦2ad:led¦2ght:lit¦2ke:made¦2et:met¦1un:ran¦1ise:rose¦1it:sat¦1eek:sought¦1each:taught¦1ake:woke,took¦1eave:wove¦2ise:arose¦1ear:bore,tore,wore¦1ind:bound,found,wound¦2eak:broke¦2ing:brought,wrung¦1ome:came¦2ive:drove¦1ig:dug¦1all:fell¦2el:felt¦4et:forgot¦1old:held¦2ave:left¦1ing:rang,sang¦1ide:rode¦1ink:sank¦1ee:saw¦2ine:shone¦4e:slid¦1ell:sold,told¦4d:spent¦2in:spun¦1in:won"
	},
	"PresentTense": {
		"fwd": "1:oes¦1ve:as",
		"both": "1:xes¦2:zzes,ches,shes,sses¦3:iases¦2y:llies,plies¦1y:cies,bies,ties,vies,nies,pies,dies,ries,fies¦:s",
		"rev": "1ies:ly¦2es:us,go,do¦3es:cho,eto",
		"ex": "2:does,goes¦3:gasses¦5:focuses¦is:are¦3y:relies¦2y:flies¦2ve:has"
	},
	"Superlative": {
		"fwd": "1st:e¦1est:l,m,f,s¦1iest:cey¦2est:or,ir¦3est:ver",
		"both": "4:east¦5:hwest¦5lest:erful¦4est:weet,lgar,tter,oung¦4most:uter¦3est:ger,der,rey,iet,ong,ear¦3test:lat¦3most:ner¦2est:pt,ft,nt,ct,rt,ht¦2test:it¦2gest:ig¦1est:b,k,n,p,h,d,w¦iest:y",
		"rev": "1:ttest,nnest,yest¦2:sest,stest,rmest,cest,vest,lmest,olest,ilest,ulest,ssest,imest,uest¦3:rgest,eatest,oorest,plest,allest,urest,iefest,uelest,blest,ugest,amest,yalest,ealest,illest,tlest,itest¦4:cerest,eriest,somest,rmalest,ndomest,motest,uarest,tiffest¦5:leverest,rangest¦ar:urthest¦3ey:riciest",
		"ex": "best:good¦worst:bad¦5est:great¦4est:fast,full,fair,dull¦3test:hot,wet,fat¦4nest:thin¦1urthest:far¦3est:gay,shy,ill¦4test:neat¦4st:late,wide,fine,safe,cute,fake,pale,rare,rude,sore,ripe,dire¦6st:severe"
	},
	"AdjToNoun": {
		"fwd": "1:tistic,eable,lful,sful,ting,tty¦2:onate,rtable,geous,ced,seful,ctful¦3:ortive,ented¦arity:ear¦y:etic¦fulness:begone¦1ity:re¦1y:tiful,gic¦2ity:ile,imous,ilous,ime¦2ion:ated¦2eness:iving¦2y:trious¦2ation:iring¦2tion:vant¦3ion:ect¦3ce:mant,mantic¦3tion:irable¦3y:est,estic¦3m:mistic,listic¦3ess:ning¦4n:utious¦4on:rative,native,vative,ective¦4ce:erant",
		"both": "1:king,wing¦2:alous,ltuous,oyful,rdous¦3:gorous,ectable,werful,amatic¦4:oised,usical,agical,raceful,ocused,lined,ightful¦5ness:stful,lding,itous,nuous,ulous,otous,nable,gious,ayful,rvous,ntous,lsive,peful,entle,ciful,osive,leful,isive,ncise,reful,mious¦5ty:ivacious¦5ties:ubtle¦5ce:ilient,adiant,atient¦5cy:icient¦5sm:gmatic¦5on:sessive,dictive¦5ity:pular,sonal,eative,entic¦5sity:uminous¦5ism:conic¦5nce:mperate¦5ility:mitable¦5ment:xcited¦5n:bitious¦4cy:brant,etent,curate¦4ility:erable,acable,icable,ptable¦4ty:nacious,aive,oyal,dacious¦4n:icious¦4ce:vient,erent,stent,ndent,dient,quent,ident¦4ness:adic,ound,hing,pant,sant,oing,oist,tute¦4icity:imple¦4ment:fined,mused¦4ism:otic¦4ry:dantic¦4ity:tund,eral¦4edness:hand¦4on:uitive¦4lity:pitable¦4sm:eroic,namic¦4sity:nerous¦3th:arm¦3ility:pable,bable,dable,iable¦3cy:hant,nant,icate¦3ness:red,hin,nse,ict,iet,ite,oud,ind,ied,rce¦3ion:lute¦3ity:ual,gal,volous,ial¦3ce:sent,fensive,lant,gant,gent,lent,dant¦3on:asive¦3m:fist,sistic,iastic¦3y:terious,xurious,ronic,tastic¦3ur:amorous¦3e:tunate¦3ation:mined¦3sy:rteous¦3ty:ain¦3ry:ave¦3ment:azed¦2ness:de,on,ue,rn,ur,ft,rp,pe,om,ge,rd,od,ay,ss,er,ll,oy,ap,ht,ld,ad,rt¦2inousness:umous¦2ity:neous,ene,id,ane¦2cy:bate,late¦2ation:ized¦2ility:oble,ible¦2y:odic¦2e:oving,aring¦2s:ost¦2itude:pt¦2dom:ee¦2ance:uring¦2tion:reet¦2ion:oted¦2sion:ending¦2liness:an¦2or:rdent¦1th:ung¦1e:uable¦1ness:w,h,k,f¦1ility:mble¦1or:vent¦1ement:ging¦1tiquity:ncient¦1ment:hed¦verty:or¦ength:ong¦eat:ot¦pth:ep¦iness:y",
		"rev": "",
		"ex": "5:forceful,humorous¦8:charismatic¦13:understanding¦5ity:active¦11ness:adventurous,inquisitive,resourceful¦8on:aggressive,automatic,perceptive¦7ness:amorous,fatuous,furtive,ominous,serious¦5ness:ample,sweet¦12ness:apprehensive,cantankerous,contemptuous,ostentatious¦13ness:argumentative,conscientious¦9ness:assertive,facetious,imperious,inventive,oblivious,rapacious,receptive,seditious,whimsical¦10ness:attractive,expressive,impressive,loquacious,salubrious,thoughtful¦3edom:boring¦4ness:calm,fast,keen,tame¦8ness:cheerful,gracious,specious,spurious,timorous,unctuous¦5sity:curious¦9ion:deliberate¦8ion:desperate¦6e:expensive¦7ce:fragrant¦3y:furious¦9ility:ineluctable¦6ism:mystical¦8ity:physical,proactive,sensitive,vertical¦5cy:pliant¦7ity:positive¦9ity:practical¦12ism:professional¦6ce:prudent¦3ness:red¦6cy:vagrant¦3dom:wise"
	}
};
//#endregion
//#region node_modules/suffix-thumb/src/convert/index.js
var checkEx = function(str, ex = {}) {
	if (ex.hasOwnProperty(str)) return ex[str];
	return null;
};
var checkSame = function(str, same = []) {
	for (let i = 0; i < same.length; i += 1) if (str.endsWith(same[i])) return str;
	return null;
};
var checkRules = function(str, fwd, both = {}) {
	fwd = fwd || {};
	let max = str.length - 1;
	for (let i = max; i >= 1; i -= 1) {
		let size = str.length - i;
		let suff = str.substring(size, str.length);
		if (fwd.hasOwnProperty(suff) === true) return str.slice(0, size) + fwd[suff];
		if (both.hasOwnProperty(suff) === true) return str.slice(0, size) + both[suff];
	}
	if (fwd.hasOwnProperty("")) return str += fwd[""];
	if (both.hasOwnProperty("")) return str += both[""];
	return null;
};
var convert = function(str = "", model = {}) {
	let out = checkEx(str, model.ex);
	out = out || checkSame(str, model.same);
	out = out || checkRules(str, model.fwd, model.both);
	out = out || str;
	return out;
};
//#endregion
//#region node_modules/suffix-thumb/src/reverse/index.js
var flipObj = function(obj) {
	return Object.entries(obj).reduce((h, a) => {
		h[a[1]] = a[0];
		return h;
	}, {});
};
var reverse = function(model = {}) {
	return {
		reversed: true,
		both: flipObj(model.both),
		ex: flipObj(model.ex),
		fwd: model.rev || {}
	};
};
//#endregion
//#region node_modules/suffix-thumb/src/compress/unpack.js
var prefix$2 = /^([0-9]+)/;
var toObject = function(txt) {
	let obj = {};
	txt.split("¦").forEach((str) => {
		let [key, vals] = str.split(":");
		vals = (vals || "").split(",");
		vals.forEach((val) => {
			obj[val] = key;
		});
	});
	return obj;
};
var growObject = function(key = "", val = "") {
	val = String(val);
	let m = val.match(prefix$2);
	if (m === null) return val;
	let num = Number(m[1]) || 0;
	return key.substring(0, num) + val.replace(prefix$2, "");
};
var unpackOne = function(str) {
	let obj = toObject(str);
	return Object.keys(obj).reduce((h, k) => {
		h[k] = growObject(k, obj[k]);
		return h;
	}, {});
};
var uncompress = function(model = {}) {
	if (typeof model === "string") model = JSON.parse(model);
	model.fwd = unpackOne(model.fwd || "");
	model.both = unpackOne(model.both || "");
	model.rev = unpackOne(model.rev || "");
	model.ex = unpackOne(model.ex || "");
	return model;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/models/index.js
var fromPast = uncompress(_data_default.PastTense);
var fromPresent = uncompress(_data_default.PresentTense);
var fromGerund = uncompress(_data_default.Gerund);
var fromParticiple = uncompress(_data_default.Participle);
var toPast$3 = reverse(fromPast);
var toPresent$2 = reverse(fromPresent);
var toGerund$2 = reverse(fromGerund);
var toParticiple = reverse(fromParticiple);
var toComparative$1 = uncompress(_data_default.Comparative);
var toSuperlative$1 = uncompress(_data_default.Superlative);
var models_default = {
	fromPast,
	fromPresent,
	fromGerund,
	fromParticiple,
	toPast: toPast$3,
	toPresent: toPresent$2,
	toGerund: toGerund$2,
	toParticiple,
	toComparative: toComparative$1,
	toSuperlative: toSuperlative$1,
	fromComparative: reverse(toComparative$1),
	fromSuperlative: reverse(toSuperlative$1),
	adjToNoun: uncompress(_data_default.AdjToNoun)
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/regex/regex-normal.js
var regex_normal_default = [
	[/^[\w.]+@[\w.]+\.[a-z]{2,3}$/, "Email"],
	[
		/^(https?:\/\/|www\.)+\w+\.[a-z]{2,3}/,
		"Url",
		"http.."
	],
	[
		/^[a-z0-9./].+\.(com|net|gov|org|ly|edu|info|biz|dev|ru|jp|de|in|uk|br|io|ai)/,
		"Url",
		".com"
	],
	[
		/^[PMCE]ST$/,
		"Timezone",
		"EST"
	],
	[
		/^ma?c'[a-z]{3}/,
		"LastName",
		"mc'neil"
	],
	[
		/^o'[a-z]{3}/,
		"LastName",
		"o'connor"
	],
	[
		/^ma?cd[aeiou][a-z]{3}/,
		"LastName",
		"mcdonald"
	],
	[
		/^(lol)+[sz]$/,
		"Expression",
		"lol"
	],
	[
		/^wo{2,}a*h?$/,
		"Expression",
		"wooah"
	],
	[
		/^(hee?){2,}h?$/,
		"Expression",
		"hehe"
	],
	[
		/^(un|de|re)\\-[a-z\u00C0-\u00FF]{2}/,
		"Verb",
		"un-vite"
	],
	[
		/^(m|k|cm|km)\/(s|h|hr)$/,
		"Unit",
		"5 k/m"
	],
	[
		/^(ug|ng|mg)\/(l|m3|ft3)$/,
		"Unit",
		"ug/L"
	],
	[
		/[^:/]\/\p{Letter}/u,
		"SlashedTerm",
		"love/hate"
	]
];
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/regex/regex-text.js
var regex_text_default = [
	[/^#[\p{Number}_]*\p{Letter}/u, "HashTag"],
	[/^@\w{2,}$/, "AtMention"],
	[
		/^([A-Z]\.){2}[A-Z]?/i,
		["Acronym", "Noun"],
		"F.B.I"
	],
	[
		/.{3}[lkmnp]in['‘’‛‵′`´]$/,
		"Gerund",
		"chillin'"
	],
	[
		/.{4}s['‘’‛‵′`´]$/,
		"Possessive",
		"flanders'"
	],
	[
		/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u,
		"Emoji",
		"emoji-class"
	]
];
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/regex/regex-numbers.js
var regex_numbers_default = [
	[
		/^@1?[0-9](am|pm)$/i,
		"Time",
		"3pm"
	],
	[
		/^@1?[0-9]:[0-9]{2}(am|pm)?$/i,
		"Time",
		"3:30pm"
	],
	[/^'[0-9]{2}$/, "Year"],
	[
		/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])$/,
		"Time",
		"3:12:31"
	],
	[
		/^[012]?[0-9](:[0-5][0-9])?(:[0-5][0-9])? ?(am|pm)$/i,
		"Time",
		"1:12pm"
	],
	[
		/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])? ?(am|pm)?$/i,
		"Time",
		"1:12:31pm"
	],
	[
		/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/i,
		"Date",
		"iso-date"
	],
	[
		/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,4}$/,
		"Date",
		"iso-dash"
	],
	[
		/^[0-9]{1,4}\/[0-9]{1,2}\/([0-9]{4}|[0-9]{2})$/,
		"Date",
		"iso-slash"
	],
	[
		/^[0-9]{1,4}\.[0-9]{1,2}\.[0-9]{1,4}$/,
		"Date",
		"iso-dot"
	],
	[
		/^[0-9]{1,4}-[a-z]{2,9}-[0-9]{1,4}$/i,
		"Date",
		"12-dec-2019"
	],
	[
		/^utc ?[+-]?[0-9]+$/,
		"Timezone",
		"utc-9"
	],
	[
		/^(gmt|utc)[+-][0-9]{1,2}$/i,
		"Timezone",
		"gmt-3"
	],
	[
		/^[0-9]{3}-[0-9]{4}$/,
		"PhoneNumber",
		"421-0029"
	],
	[
		/^(\+?[0-9][ -])?[0-9]{3}[ -]?[0-9]{3}-[0-9]{4}$/,
		"PhoneNumber",
		"1-800-"
	],
	[
		/^[-+]?\p{Currency_Symbol}[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?([kmb]|bn)?\+?$/u,
		["Money", "Value"],
		"$5.30"
	],
	[
		/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\p{Currency_Symbol}\+?$/u,
		["Money", "Value"],
		"5.30£"
	],
	[
		/^[-+]?[$£]?[0-9]([0-9,.])+(usd|eur|jpy|gbp|cad|aud|chf|cny|hkd|nzd|kr|rub)$/i,
		["Money", "Value"],
		"$400usd"
	],
	[
		/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\+?$/,
		["Cardinal", "NumericValue"],
		"5,999"
	],
	[
		/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?(st|nd|rd|r?th)$/,
		["Ordinal", "NumericValue"],
		"53rd"
	],
	[
		/^\.[0-9]+\+?$/,
		["Cardinal", "NumericValue"],
		".73th"
	],
	[
		/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?%\+?$/,
		[
			"Percent",
			"Cardinal",
			"NumericValue"
		],
		"-4%"
	],
	[
		/^\.[0-9]+%$/,
		[
			"Percent",
			"Cardinal",
			"NumericValue"
		],
		".3%"
	],
	[
		/^[0-9]{1,4}\/[0-9]{1,4}(st|nd|rd|th)?s?$/,
		["Fraction", "NumericValue"],
		"2/3rds"
	],
	[
		/^[0-9.]{1,3}[a-z]{0,2}[-–—][0-9]{1,3}[a-z]{0,2}$/,
		["Value", "NumberRange"],
		"3-4"
	],
	[
		/^[0-9]{1,2}(:[0-9][0-9])?(am|pm)? ?[-–—] ?[0-9]{1,2}(:[0-9][0-9])?(am|pm)$/,
		["Time", "NumberRange"],
		"3-4pm"
	],
	[
		/^[0-9.]+([a-z°]{1,4})$/,
		"NumericValue",
		"9km"
	]
];
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/orgWords.js
var orgWords_default = [
	"academy",
	"administration",
	"agence",
	"agences",
	"agencies",
	"agency",
	"airlines",
	"airways",
	"army",
	"assoc",
	"associates",
	"association",
	"assurance",
	"authority",
	"autorite",
	"aviation",
	"bank",
	"banque",
	"board",
	"boys",
	"brands",
	"brewery",
	"brotherhood",
	"brothers",
	"bureau",
	"cafe",
	"co",
	"caisse",
	"capital",
	"care",
	"cathedral",
	"center",
	"centre",
	"chemicals",
	"choir",
	"chronicle",
	"church",
	"circus",
	"clinic",
	"clinique",
	"club",
	"co",
	"coalition",
	"coffee",
	"collective",
	"college",
	"commission",
	"committee",
	"communications",
	"community",
	"company",
	"comprehensive",
	"computers",
	"confederation",
	"conference",
	"conseil",
	"consulting",
	"containers",
	"corporation",
	"corps",
	"corp",
	"council",
	"crew",
	"data",
	"departement",
	"department",
	"departments",
	"design",
	"development",
	"directorate",
	"division",
	"drilling",
	"education",
	"eglise",
	"electric",
	"electricity",
	"energy",
	"ensemble",
	"enterprise",
	"enterprises",
	"entertainment",
	"estate",
	"etat",
	"faculty",
	"faction",
	"federation",
	"financial",
	"fm",
	"foundation",
	"fund",
	"gas",
	"gazette",
	"girls",
	"government",
	"group",
	"guild",
	"herald",
	"holdings",
	"hospital",
	"hotel",
	"hotels",
	"inc",
	"industries",
	"institut",
	"institute",
	"institutes",
	"insurance",
	"international",
	"interstate",
	"investment",
	"investments",
	"investors",
	"journal",
	"laboratory",
	"labs",
	"llc",
	"ltd",
	"limited",
	"machines",
	"magazine",
	"management",
	"marine",
	"marketing",
	"markets",
	"media",
	"memorial",
	"ministere",
	"ministry",
	"military",
	"mobile",
	"motor",
	"motors",
	"musee",
	"museum",
	"news",
	"observatory",
	"office",
	"oil",
	"optical",
	"orchestra",
	"organization",
	"partners",
	"partnership",
	"petrol",
	"petroleum",
	"pharmacare",
	"pharmaceutical",
	"pharmaceuticals",
	"pizza",
	"plc",
	"police",
	"politburo",
	"polytechnic",
	"post",
	"power",
	"press",
	"productions",
	"quartet",
	"radio",
	"reserve",
	"resources",
	"restaurant",
	"restaurants",
	"savings",
	"school",
	"securities",
	"service",
	"services",
	"societe",
	"subsidiary",
	"society",
	"sons",
	"subcommittee",
	"syndicat",
	"systems",
	"telecommunications",
	"telegraph",
	"television",
	"times",
	"tribunal",
	"tv",
	"union",
	"university",
	"utilities",
	"workers"
].reduce((h, str) => {
	h[str] = true;
	return h;
}, {});
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/placeWords.js
var placeWords_default = [
	"atoll",
	"basin",
	"bay",
	"beach",
	"bluff",
	"bog",
	"camp",
	"canyon",
	"canyons",
	"cape",
	"cave",
	"caves",
	"cliffs",
	"coast",
	"cove",
	"coves",
	"crater",
	"crossing",
	"creek",
	"desert",
	"dune",
	"dunes",
	"downs",
	"estates",
	"escarpment",
	"estuary",
	"falls",
	"fjord",
	"fjords",
	"forest",
	"forests",
	"glacier",
	"gorge",
	"gorges",
	"grove",
	"gulf",
	"gully",
	"highland",
	"heights",
	"hollow",
	"hill",
	"hills",
	"inlet",
	"island",
	"islands",
	"isthmus",
	"junction",
	"knoll",
	"lagoon",
	"lake",
	"lakeshore",
	"marsh",
	"marshes",
	"mount",
	"mountain",
	"mountains",
	"narrows",
	"peninsula",
	"plains",
	"plateau",
	"pond",
	"rapids",
	"ravine",
	"reef",
	"reefs",
	"ridge",
	"river",
	"rivers",
	"sandhill",
	"shoal",
	"shore",
	"shoreline",
	"shores",
	"strait",
	"straits",
	"springs",
	"stream",
	"swamp",
	"tombolo",
	"trail",
	"trails",
	"trench",
	"valley",
	"vallies",
	"village",
	"volcano",
	"waterfall",
	"watershed",
	"wetland",
	"woods",
	"acres",
	"burough",
	"county",
	"district",
	"municipality",
	"prefecture",
	"province",
	"region",
	"reservation",
	"state",
	"territory",
	"borough",
	"metropolis",
	"downtown",
	"uptown",
	"midtown",
	"city",
	"town",
	"township",
	"hamlet",
	"country",
	"kingdom",
	"enclave",
	"neighbourhood",
	"neighborhood",
	"kingdom",
	"ward",
	"zone",
	"airport",
	"amphitheater",
	"arch",
	"arena",
	"auditorium",
	"bar",
	"barn",
	"basilica",
	"battlefield",
	"bridge",
	"building",
	"castle",
	"centre",
	"coliseum",
	"cineplex",
	"complex",
	"dam",
	"farm",
	"field",
	"fort",
	"garden",
	"gardens",
	"gymnasium",
	"hall",
	"house",
	"levee",
	"library",
	"manor",
	"memorial",
	"monument",
	"museum",
	"gallery",
	"palace",
	"pillar",
	"pits",
	"plantation",
	"playhouse",
	"quarry",
	"sportsfield",
	"sportsplex",
	"stadium",
	"terrace",
	"terraces",
	"theater",
	"tower",
	"park",
	"parks",
	"site",
	"ranch",
	"raceway",
	"sportsplex",
	"ave",
	"st",
	"street",
	"rd",
	"road",
	"lane",
	"landing",
	"crescent",
	"cr",
	"way",
	"tr",
	"terrace",
	"avenue"
].reduce((h, str) => {
	h[str] = true;
	return h;
}, {});
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/nouns/toSingular/_rules.js
var _rules_default = [
	[/([^v])ies$/i, "$1y"],
	[/(ise)s$/i, "$1"],
	[/(kn|[^o]l|w)ives$/i, "$1ife"],
	[/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)ves$/i, "$1f"],
	[/^(dwar|handkerchie|hoo|scar|whar)ves$/i, "$1f"],
	[/(antenn|formul|nebul|vertebr|vit)ae$/i, "$1a"],
	[/(octop|vir|radi|nucle|fung|cact|stimul)(i)$/i, "$1us"],
	[/(buffal|tomat|tornad)(oes)$/i, "$1o"],
	[/(ause)s$/i, "$1"],
	[/(ease)s$/i, "$1"],
	[/(ious)es$/i, "$1"],
	[/(ouse)s$/i, "$1"],
	[/(ose)s$/i, "$1"],
	[/(..ase)s$/i, "$1"],
	[/(..[aeiu]s)es$/i, "$1"],
	[/(vert|ind|cort)(ices)$/i, "$1ex"],
	[/(matr|append)(ices)$/i, "$1ix"],
	[/([xo]|ch|ss|sh)es$/i, "$1"],
	[/men$/i, "man"],
	[/(n)ews$/i, "$1ews"],
	[/([ti])a$/i, "$1um"],
	[/([^aeiouy]|qu)ies$/i, "$1y"],
	[/(s)eries$/i, "$1eries"],
	[/(m)ovies$/i, "$1ovie"],
	[/(cris|ax|test)es$/i, "$1is"],
	[/(alias|status)es$/i, "$1"],
	[/(ss)$/i, "$1"],
	[/(ic)s$/i, "$1"],
	[/s$/i, ""]
];
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/nouns/toSingular/index.js
var invertObj = function(obj) {
	return Object.keys(obj).reduce((h, k) => {
		h[obj[k]] = k;
		return h;
	}, {});
};
var toSingular = function(str, model) {
	const { irregularPlurals } = model.two;
	const invert = invertObj(irregularPlurals);
	if (invert.hasOwnProperty(str)) return invert[str];
	for (let i = 0; i < _rules_default.length; i++) if (_rules_default[i][0].test(str) === true) {
		str = str.replace(_rules_default[i][0], _rules_default[i][1]);
		return str;
	}
	return str;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/nouns/index.js
var all$2 = function(str, model) {
	const arr = [str];
	const p = pluralize(str, model);
	if (p !== str) arr.push(p);
	const s = toSingular(str, model);
	if (s !== str) arr.push(s);
	return arr;
};
var nouns_default$2 = {
	toPlural: pluralize,
	toSingular,
	all: all$2
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/verbs/getTense/_guess.js
var guessVerb = {
	Gerund: ["ing"],
	Actor: ["erer"],
	Infinitive: [
		"ate",
		"ize",
		"tion",
		"rify",
		"then",
		"ress",
		"ify",
		"age",
		"nce",
		"ect",
		"ise",
		"ine",
		"ish",
		"ace",
		"ash",
		"ure",
		"tch",
		"end",
		"ack",
		"and",
		"ute",
		"ade",
		"ock",
		"ite",
		"ase",
		"ose",
		"use",
		"ive",
		"int",
		"nge",
		"lay",
		"est",
		"ain",
		"ant",
		"ent",
		"eed",
		"er",
		"le",
		"unk",
		"ung",
		"upt",
		"en"
	],
	PastTense: [
		"ept",
		"ed",
		"lt",
		"nt",
		"ew",
		"ld"
	],
	PresentTense: [
		"rks",
		"cks",
		"nks",
		"ngs",
		"mps",
		"tes",
		"zes",
		"ers",
		"les",
		"acks",
		"ends",
		"ands",
		"ocks",
		"lays",
		"eads",
		"lls",
		"els",
		"ils",
		"ows",
		"nds",
		"ays",
		"ams",
		"ars",
		"ops",
		"ffs",
		"als",
		"urs",
		"lds",
		"ews",
		"ips",
		"es",
		"ts",
		"ns"
	],
	Participle: ["ken", "wn"]
};
guessVerb = Object.keys(guessVerb).reduce((h, k) => {
	guessVerb[k].forEach((a) => h[a] = k);
	return h;
}, {});
var _guess_default = guessVerb;
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/verbs/getTense/index.js
/** it helps to know what we're conjugating from */
var getTense$1 = function(str) {
	const three = str.substring(str.length - 3);
	if (_guess_default.hasOwnProperty(three) === true) return _guess_default[three];
	const two = str.substring(str.length - 2);
	if (_guess_default.hasOwnProperty(two) === true) return _guess_default[two];
	if (str.substring(str.length - 1) === "s") return "PresentTense";
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/verbs/toInfinitive/index.js
var toParts = function(str, model) {
	let prefix = "";
	let prefixes = {};
	if (model.one && model.one.prefixes) prefixes = model.one.prefixes;
	let [verb, particle] = str.split(/ /);
	if (particle && prefixes[verb] === true) {
		prefix = verb;
		verb = particle;
		particle = "";
	}
	return {
		prefix,
		verb,
		particle
	};
};
var copulaMap = {
	are: "be",
	were: "be",
	been: "be",
	is: "be",
	am: "be",
	was: "be",
	be: "be",
	being: "be"
};
var toInfinitive$1 = function(str, model, tense) {
	const { fromPast, fromPresent, fromGerund, fromParticiple } = model.two.models;
	const { prefix, verb, particle } = toParts(str, model);
	let inf = "";
	if (!tense) tense = getTense$1(str);
	if (copulaMap.hasOwnProperty(str)) inf = copulaMap[str];
	else if (tense === "Participle") inf = convert(verb, fromParticiple);
	else if (tense === "PastTense") inf = convert(verb, fromPast);
	else if (tense === "PresentTense") inf = convert(verb, fromPresent);
	else if (tense === "Gerund") inf = convert(verb, fromGerund);
	else return str;
	if (particle) inf += " " + particle;
	if (prefix) inf = prefix + " " + inf;
	return inf;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/verbs/conjugate/index.js
var parse$3 = (inf) => {
	if (/ /.test(inf)) return inf.split(/ /);
	return [inf, ""];
};
var conjugate = function(inf, model) {
	const { toPast, toPresent, toGerund, toParticiple } = model.two.models;
	if (inf === "be") return {
		Infinitive: inf,
		Gerund: "being",
		PastTense: "was",
		PresentTense: "is"
	};
	const [str, particle] = parse$3(inf);
	const found = {
		Infinitive: str,
		PastTense: convert(str, toPast),
		PresentTense: convert(str, toPresent),
		Gerund: convert(str, toGerund),
		FutureTense: "will " + str
	};
	let pastPrt = convert(str, toParticiple);
	if (pastPrt !== inf && pastPrt !== found.PastTense) {
		const lex = model.one.lexicon || {};
		if (lex[pastPrt] === "Participle" || lex[pastPrt] === "Adjective") {
			if (inf === "play") pastPrt = "played";
			found.Participle = pastPrt;
		}
	}
	if (particle) Object.keys(found).forEach((k) => {
		found[k] += " " + particle;
	});
	return found;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/verbs/index.js
var all$1 = function(str, model) {
	const res = conjugate(str, model);
	delete res.FutureTense;
	return Object.values(res).filter((s) => s);
};
var verbs_default$2 = {
	toInfinitive: toInfinitive$1,
	conjugate,
	all: all$1
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/adjectives/inflect.js
var toSuperlative = function(adj, model) {
	const mod = model.two.models.toSuperlative;
	return convert(adj, mod);
};
var toComparative = function(adj, model) {
	const mod = model.two.models.toComparative;
	return convert(adj, mod);
};
var fromComparative = function(adj, model) {
	const mod = model.two.models.fromComparative;
	return convert(adj, mod);
};
var fromSuperlative = function(adj, model) {
	const mod = model.two.models.fromSuperlative;
	return convert(adj, mod);
};
var toNoun = function(adj, model) {
	const mod = model.two.models.adjToNoun;
	return convert(adj, mod);
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/adjectives/conjugate/lib.js
var suffixLoop$1 = function(str = "", suffixes = []) {
	const len = str.length;
	const max = len <= 6 ? len - 1 : 6;
	for (let i = max; i >= 1; i -= 1) {
		const suffix = str.substring(len - i, str.length);
		if (suffixes[suffix.length].hasOwnProperty(suffix) === true) return str.slice(0, len - i) + suffixes[suffix.length][suffix];
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/adjectives/conjugate/fromAdverb.js
var ical = /* @__PURE__ */ new Set([
	"analytically",
	"chemically",
	"classically",
	"clinically",
	"critically",
	"ecologically",
	"electrically",
	"empirically",
	"frantically",
	"grammatically",
	"identically",
	"ideologically",
	"logically",
	"magically",
	"mathematically",
	"mechanically",
	"medically",
	"methodically",
	"methodically",
	"musically",
	"physically",
	"physically",
	"politically",
	"practically",
	"radically",
	"satirically",
	"statistically",
	"technically",
	"technologically",
	"theoretically",
	"typically",
	"vertically",
	"whimsically"
]);
var suffixes$2 = [
	null,
	{},
	{ "ly": "" },
	{
		"ily": "y",
		"bly": "ble",
		"ply": "ple"
	},
	{
		"ally": "al",
		"rply": "rp"
	},
	{
		"ually": "ual",
		"ially": "ial",
		"cally": "cal",
		"eally": "eal",
		"rally": "ral",
		"nally": "nal",
		"mally": "mal",
		"eeply": "eep",
		"eaply": "eap"
	},
	{ ically: "ic" }
];
var noAdj = /* @__PURE__ */ new Set([
	"early",
	"only",
	"hourly",
	"daily",
	"weekly",
	"monthly",
	"yearly",
	"mostly",
	"duly",
	"unduly",
	"especially",
	"undoubtedly",
	"conversely",
	"namely",
	"exceedingly",
	"presumably",
	"accordingly",
	"overly",
	"best",
	"latter",
	"little",
	"long",
	"low"
]);
var exceptions$2 = {
	wholly: "whole",
	fully: "full",
	truly: "true",
	gently: "gentle",
	singly: "single",
	customarily: "customary",
	idly: "idle",
	publically: "public",
	quickly: "quick",
	superbly: "superb",
	cynically: "cynical",
	well: "good"
};
var toAdjective = function(str) {
	if (!str.endsWith("ly")) return null;
	if (ical.has(str)) return str.replace(/ically/, "ical");
	if (noAdj.has(str)) return null;
	if (exceptions$2.hasOwnProperty(str)) return exceptions$2[str];
	return suffixLoop$1(str, suffixes$2) || str;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/adjectives/conjugate/toAdverb.js
var suffixes$1 = [
	null,
	{ y: "ily" },
	{
		ly: "ly",
		ic: "ically"
	},
	{
		ial: "ially",
		ual: "ually",
		tle: "tly",
		ble: "bly",
		ple: "ply",
		ary: "arily"
	},
	{},
	{},
	{}
];
var exceptions$1 = {
	cool: "cooly",
	whole: "wholly",
	full: "fully",
	good: "well",
	idle: "idly",
	public: "publicly",
	single: "singly",
	special: "especially"
};
var toAdverb = function(str) {
	if (exceptions$1.hasOwnProperty(str)) return exceptions$1[str];
	let adv = suffixLoop$1(str, suffixes$1);
	if (!adv) adv = str + "ly";
	return adv;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/adjectives/index.js
var all = function(str, model) {
	let arr = [str];
	arr.push(toSuperlative(str, model));
	arr.push(toComparative(str, model));
	arr.push(toAdverb(str));
	arr = arr.filter((s) => s);
	arr = new Set(arr);
	return Array.from(arr);
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/transform/index.js
var transform_default = {
	noun: nouns_default$2,
	verb: verbs_default$2,
	adjective: {
		toSuperlative,
		toComparative,
		toAdverb,
		toNoun,
		fromAdverb: toAdjective,
		fromSuperlative,
		fromComparative,
		all
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/expand/byTag.js
var byTag_default = {
	Singular: (word, lex, methods, model) => {
		const already = model.one.lexicon;
		const plural = methods.two.transform.noun.toPlural(word, model);
		if (!already[plural]) lex[plural] = lex[plural] || "Plural";
	},
	Actor: (word, lex, methods, model) => {
		const already = model.one.lexicon;
		const plural = methods.two.transform.noun.toPlural(word, model);
		if (!already[plural]) lex[plural] = lex[plural] || ["Plural", "Actor"];
	},
	Comparable: (word, lex, methods, model) => {
		const already = model.one.lexicon;
		const { toSuperlative, toComparative } = methods.two.transform.adjective;
		const sup = toSuperlative(word, model);
		if (!already[sup]) lex[sup] = lex[sup] || "Superlative";
		const comp = toComparative(word, model);
		if (!already[comp]) lex[comp] = lex[comp] || "Comparative";
		lex[word] = "Adjective";
	},
	Demonym: (word, lex, methods, model) => {
		const plural = methods.two.transform.noun.toPlural(word, model);
		lex[plural] = lex[plural] || ["Demonym", "Plural"];
	},
	Infinitive: (word, lex, methods, model) => {
		const already = model.one.lexicon;
		const all = methods.two.transform.verb.conjugate(word, model);
		Object.entries(all).forEach((a) => {
			if (!already[a[1]] && !lex[a[1]] && a[0] !== "FutureTense") lex[a[1]] = a[0];
		});
	},
	PhrasalVerb: (word, lex, methods, model) => {
		const already = model.one.lexicon;
		lex[word] = ["PhrasalVerb", "Infinitive"];
		const _multi = model.one._multiCache;
		const [inf, rest] = word.split(" ");
		if (!already[inf]) lex[inf] = lex[inf] || "Infinitive";
		const all = methods.two.transform.verb.conjugate(inf, model);
		delete all.FutureTense;
		Object.entries(all).forEach((a) => {
			if (a[0] === "Actor" || a[1] === "") return;
			if (!lex[a[1]] && !already[a[1]]) lex[a[1]] = a[0];
			_multi[a[1]] = 2;
			const str = a[1] + " " + rest;
			lex[str] = lex[str] || [a[0], "PhrasalVerb"];
		});
	},
	Multiple: (word, lex) => {
		lex[word] = ["Multiple", "Cardinal"];
		lex[word + "th"] = ["Multiple", "Ordinal"];
		lex[word + "ths"] = ["Multiple", "Fraction"];
	},
	Cardinal: (word, lex) => {
		lex[word] = ["TextValue", "Cardinal"];
	},
	Ordinal: (word, lex) => {
		lex[word] = ["TextValue", "Ordinal"];
		lex[word + "s"] = ["TextValue", "Fraction"];
	},
	Place: (word, lex) => {
		lex[word] = ["Place", "ProperNoun"];
	},
	Region: (word, lex) => {
		lex[word] = ["Region", "ProperNoun"];
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/expand/index.js
var expand$1 = function(words, world) {
	const { methods, model } = world;
	const lex = {};
	const _multi = {};
	Object.keys(words).forEach((word) => {
		const tag = words[word];
		word = word.toLowerCase().trim();
		word = word.replace(/'s\b/, "");
		const split = word.split(/ /);
		if (split.length > 1) {
			if (_multi[split[0]] === void 0 || split.length > _multi[split[0]]) _multi[split[0]] = split.length;
		}
		if (byTag_default.hasOwnProperty(tag) === true) byTag_default[tag](word, lex, methods, model);
		lex[word] = lex[word] || tag;
	});
	delete lex[""];
	delete lex[null];
	delete lex[" "];
	return {
		lex,
		_multi
	};
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/quickSplit.js
var splitOn = function(terms, i) {
	const isNum = /^[0-9]+$/;
	const term = terms[i];
	if (!term) return false;
	const maybeDate = /* @__PURE__ */ new Set([
		"may",
		"april",
		"august",
		"jan"
	]);
	if (term.normal === "like" || maybeDate.has(term.normal)) return false;
	if (term.tags.has("Place") || term.tags.has("Date")) return false;
	if (terms[i - 1]) {
		const lastTerm = terms[i - 1];
		if (lastTerm.tags.has("Date") || maybeDate.has(lastTerm.normal)) return false;
		if (lastTerm.tags.has("Adjective") || term.tags.has("Adjective")) return false;
	}
	const str = term.normal;
	if (str.length === 1 || str.length === 2 || str.length === 4) {
		if (isNum.test(str)) return false;
	}
	return true;
};
var quickSplit = function(document) {
	const splitHere = /[,:;]/;
	const arr = [];
	document.forEach((terms) => {
		let start = 0;
		terms.forEach((term, i) => {
			if (splitHere.test(term.post) && splitOn(terms, i + 1)) {
				arr.push(terms.slice(start, i + 1));
				start = i + 1;
			}
		});
		if (start < terms.length) arr.push(terms.slice(start, terms.length));
	});
	return arr;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/looksPlural.js
var isPlural$3 = {
	e: [
		"mice",
		"louse",
		"antennae",
		"formulae",
		"nebulae",
		"vertebrae",
		"vitae"
	],
	i: [
		"tia",
		"octopi",
		"viri",
		"radii",
		"nuclei",
		"fungi",
		"cacti",
		"stimuli"
	],
	n: ["men"],
	t: ["feet"]
};
var exceptions = /* @__PURE__ */ new Set([
	"israelis",
	"menus",
	"logos"
]);
var notPlural$1 = [
	"bus",
	"mas",
	"was",
	"ias",
	"xas",
	"vas",
	"cis",
	"lis",
	"nis",
	"ois",
	"ris",
	"sis",
	"tis",
	"xis",
	"aus",
	"cus",
	"eus",
	"fus",
	"gus",
	"ius",
	"lus",
	"nus",
	"das",
	"ous",
	"pus",
	"rus",
	"sus",
	"tus",
	"xus",
	"aos",
	"igos",
	"ados",
	"ogos",
	"'s",
	"ss"
];
var looksPlural = function(str) {
	if (!str || str.length <= 3) return false;
	if (exceptions.has(str)) return true;
	const end = str[str.length - 1];
	if (isPlural$3.hasOwnProperty(end)) return isPlural$3[end].find((suff) => str.endsWith(suff));
	if (end !== "s") return false;
	if (notPlural$1.find((suff) => str.endsWith(suff))) return false;
	return true;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/methods/index.js
var methods_default$1 = { two: {
	quickSplit,
	expandLexicon: expand$1,
	transform: transform_default,
	looksPlural
} };
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/_expand/irregulars.js
var expandIrregulars = function(model) {
	const { irregularPlurals } = model.two;
	const { lexicon } = model.one;
	Object.entries(irregularPlurals).forEach((a) => {
		lexicon[a[0]] = lexicon[a[0]] || "Singular";
		lexicon[a[1]] = lexicon[a[1]] || "Plural";
	});
	return model;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/_expand/index.js
var tmpModel = {
	one: { lexicon: {} },
	two: { models: models_default }
};
var switchDefaults = {
	"Actor|Verb": "Actor",
	"Adj|Gerund": "Adjective",
	"Adj|Noun": "Adjective",
	"Adj|Past": "Adjective",
	"Adj|Present": "Adjective",
	"Noun|Verb": "Singular",
	"Noun|Gerund": "Gerund",
	"Person|Noun": "Noun",
	"Person|Date": "Month",
	"Person|Verb": "FirstName",
	"Person|Place": "Person",
	"Person|Adj": "Comparative",
	"Plural|Verb": "Plural",
	"Unit|Noun": "Noun"
};
var expandLexicon = function(words, model) {
	const world = {
		model,
		methods: methods_default$1
	};
	const { lex, _multi } = methods_default$1.two.expandLexicon(words, world);
	Object.assign(model.one.lexicon, lex);
	Object.assign(model.one._multiCache, _multi);
	return model;
};
var addUncountables = function(words, model) {
	Object.keys(words).forEach((k) => {
		if (words[k] === "Uncountable") {
			model.two.uncountable[k] = true;
			words[k] = "Uncountable";
		}
	});
	return model;
};
var expandVerb = function(str, words, doPresent) {
	const obj = conjugate(str, tmpModel);
	words[obj.PastTense] = words[obj.PastTense] || "PastTense";
	words[obj.Gerund] = words[obj.Gerund] || "Gerund";
	if (doPresent === true) words[obj.PresentTense] = words[obj.PresentTense] || "PresentTense";
};
var expandAdjective = function(str, words, model) {
	const sup = toSuperlative(str, model);
	words[sup] = words[sup] || "Superlative";
	const comp = toComparative(str, model);
	words[comp] = words[comp] || "Comparative";
};
var expandNoun = function(str, words, model) {
	const plur = pluralize(str, model);
	words[plur] = words[plur] || "Plural";
};
var expandVariable = function(switchWords, model) {
	const words = {};
	const lex = model.one.lexicon;
	Object.keys(switchWords).forEach((w) => {
		const name = switchWords[w];
		words[w] = switchDefaults[name];
		if (name === "Noun|Verb" || name === "Person|Verb" || name === "Actor|Verb") expandVerb(w, lex, false);
		if (name === "Adj|Present") {
			expandVerb(w, lex, true);
			expandAdjective(w, lex, model);
		}
		if (name === "Person|Adj") expandAdjective(w, lex, model);
		if (name === "Adj|Gerund" || name === "Noun|Gerund") {
			const inf = toInfinitive$1(w, tmpModel, "Gerund");
			if (!lex[inf]) words[inf] = "Infinitive";
		}
		if (name === "Noun|Gerund" || name === "Adj|Noun" || name === "Person|Noun") expandNoun(w, lex, model);
		if (name === "Adj|Past") {
			const inf = toInfinitive$1(w, tmpModel, "PastTense");
			if (!lex[inf]) words[inf] = "Infinitive";
		}
	});
	model = expandLexicon(words, model);
	return model;
};
var expand = function(model) {
	model = expandLexicon(model.one.lexicon, model);
	model = addUncountables(model.one.lexicon, model);
	model = expandVariable(model.two.switches, model);
	model = expandIrregulars(model);
	return model;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/model/index.js
var model = {
	one: {
		_multiCache: {},
		lexicon,
		frozenLex: frozenLex_default
	},
	two: {
		irregularPlurals: plurals_default,
		models: models_default,
		suffixPatterns: suffixes_default,
		prefixPatterns: prefixes_default,
		endsWith: endsWith_default,
		neighbours: neighbours_default,
		regexNormal: regex_normal_default,
		regexText: regex_text_default,
		regexNumbers: regex_numbers_default,
		switches,
		clues,
		uncountable: {},
		orgWords: orgWords_default,
		placeWords: placeWords_default
	}
};
model = expand(model);
var model_default$1 = model;
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/1st-pass/01-colons.js
var byPunctuation = function(terms, i, model, world) {
	const setTag = world.methods.one.setTag;
	if (i === 0 && terms.length >= 3) {
		if (terms[0].post.match(/:/)) {
			const nextTerm = terms[1];
			if (nextTerm.tags.has("Value") || nextTerm.tags.has("Email") || nextTerm.tags.has("PhoneNumber")) return;
			setTag([terms[0]], "Expression", world, null, `2-punct-colon''`);
		}
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/1st-pass/02-hyphens.js
var byHyphen = function(terms, i, model, world) {
	const setTag = world.methods.one.setTag;
	if (terms[i].post === "-" && terms[i + 1]) setTag([terms[i], terms[i + 1]], "Hyphenated", world, null, `1-punct-hyphen''`);
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/2nd-pass/00-tagSwitch.js
var prefix$1 = /^(under|over|mis|re|un|dis|semi)-?/;
var tagSwitch = function(terms, i, model) {
	const switches = model.two.switches;
	const term = terms[i];
	if (switches.hasOwnProperty(term.normal)) {
		term.switch = switches[term.normal];
		return;
	}
	if (prefix$1.test(term.normal)) {
		const stem = term.normal.replace(prefix$1, "");
		if (stem.length > 3 && switches.hasOwnProperty(stem)) term.switch = switches[stem];
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/_fastTag.js
var log = (term, tag, reason = "") => {
	const yellow = (str) => "\x1B[33m\x1B[3m" + str + "\x1B[0m";
	const i = (str) => "\x1B[3m" + str + "\x1B[0m";
	const word = term.text || "[" + term.implicit + "]";
	if (typeof tag !== "string" && tag.length > 2) tag = tag.slice(0, 2).join(", #") + " +";
	tag = typeof tag !== "string" ? tag.join(", #") : tag;
	console.log(` ${yellow(word).padEnd(24)} \x1b[32m→\x1b[0m #${tag.padEnd(22)}  ${i(reason)}`);
};
var fastTag = function(term, tag, reason) {
	if (!tag || tag.length === 0) return;
	if (term.frozen === true) return;
	const env = typeof process === "undefined" || !process.env ? self.env || {} : process.env;
	if (env && env.DEBUG_TAGS) log(term, tag, reason);
	term.tags = term.tags || /* @__PURE__ */ new Set();
	if (typeof tag === "string") term.tags.add(tag);
	else tag.forEach((tg) => term.tags.add(tg));
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/3rd-pass/_fillTags.js
var uncountable = [
	"Acronym",
	"Abbreviation",
	"ProperNoun",
	"Uncountable",
	"Possessive",
	"Pronoun",
	"Activity",
	"Honorific",
	"Month"
];
var setPluralSingular = function(term) {
	if (!term.tags.has("Noun") || term.tags.has("Plural") || term.tags.has("Singular")) return;
	if (uncountable.find((tag) => term.tags.has(tag))) return;
	if (looksPlural(term.normal)) fastTag(term, "Plural", "3-plural-guess");
	else fastTag(term, "Singular", "3-singular-guess");
};
var setTense = function(term) {
	const tags = term.tags;
	if (tags.has("Verb") && tags.size === 1) {
		const guess = getTense$1(term.normal);
		if (guess) fastTag(term, guess, "3-verb-tense-guess");
	}
};
var fillTags = function(terms, i, model) {
	const term = terms[i];
	const tags = Array.from(term.tags);
	for (let k = 0; k < tags.length; k += 1) if (model.one.tagSet[tags[k]]) {
		const toAdd = model.one.tagSet[tags[k]].parents;
		fastTag(term, toAdd, ` -inferred by #${tags[k]}`);
	}
	setPluralSingular(term);
	setTense(term, model);
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/2nd-pass/01-case.js
var titleCase$1 = /^\p{Lu}[\p{Ll}'’]/u;
var hasNumber = /[0-9]/;
var notProper = [
	"Date",
	"Month",
	"WeekDay",
	"Unit",
	"Expression"
];
var hasIVX = /[IVX]/;
var romanNumeral = /^[IVXLCDM]{2,}$/;
var romanNumValid = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
var nope = {
	li: true,
	dc: true,
	md: true,
	dm: true,
	ml: true
};
var checkCase = function(terms, i, model) {
	const term = terms[i];
	term.index = term.index || [0, 0];
	const index = term.index[1];
	const str = term.text || "";
	if (index !== 0 && titleCase$1.test(str) === true && hasNumber.test(str) === false) {
		if (notProper.find((tag) => term.tags.has(tag))) return null;
		if (term.pre.match(/["']$/)) return null;
		if (term.normal === "the") return null;
		fillTags(terms, i, model);
		if (!term.tags.has("Noun") && !term.frozen) term.tags.clear();
		fastTag(term, "ProperNoun", "2-titlecase");
		return true;
	}
	if (str.length >= 2 && romanNumeral.test(str) && hasIVX.test(str) && romanNumValid.test(str) && !nope[term.normal]) {
		fastTag(term, "RomanNumeral", "2-xvii");
		return true;
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/2nd-pass/02-suffix.js
var suffixLoop = function(str = "", suffixes = []) {
	const len = str.length;
	let max = 7;
	if (len <= max) max = len - 1;
	for (let i = max; i > 1; i -= 1) {
		const suffix = str.substring(len - i, len);
		if (suffixes[suffix.length].hasOwnProperty(suffix) === true) return suffixes[suffix.length][suffix];
	}
	return null;
};
var tagBySuffix = function(terms, i, model) {
	const term = terms[i];
	if (term.tags.size === 0) {
		let tag = suffixLoop(term.normal, model.two.suffixPatterns);
		if (tag !== null) {
			fastTag(term, tag, "2-suffix");
			term.confidence = .7;
			return true;
		}
		if (term.implicit) {
			tag = suffixLoop(term.implicit, model.two.suffixPatterns);
			if (tag !== null) {
				fastTag(term, tag, "2-implicit-suffix");
				term.confidence = .7;
				return true;
			}
		}
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/2nd-pass/03-regex.js
var hasApostrophe = /['‘’‛‵′`´]/;
var doRegs = function(str, regs) {
	for (let i = 0; i < regs.length; i += 1) if (regs[i][0].test(str) === true) return regs[i];
	return null;
};
var doEndsWith = function(str = "", byEnd) {
	const char = str[str.length - 1];
	if (byEnd.hasOwnProperty(char) === true) {
		const regs = byEnd[char] || [];
		for (let r = 0; r < regs.length; r += 1) if (regs[r][0].test(str) === true) return regs[r];
	}
	return null;
};
var checkRegex = function(terms, i, model, world) {
	const setTag = world.methods.one.setTag;
	const { regexText, regexNormal, regexNumbers, endsWith } = model.two;
	const term = terms[i];
	const normal = term.machine || term.normal;
	let text = term.text;
	if (hasApostrophe.test(term.post) && !hasApostrophe.test(term.pre)) text += term.post.trim();
	let arr = doRegs(text, regexText) || doRegs(normal, regexNormal);
	if (!arr && /[0-9]/.test(normal)) arr = doRegs(normal, regexNumbers);
	if (!arr && term.tags.size === 0) arr = doEndsWith(normal, endsWith);
	if (arr) {
		setTag([term], arr[1], world, null, `2-regex-'${arr[2] || arr[0]}'`);
		term.confidence = .6;
		return true;
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/2nd-pass/04-prefix.js
var prefixLoop = function(str = "", prefixes = []) {
	const len = str.length;
	let max = 7;
	if (max > len - 3) max = len - 3;
	for (let i = max; i > 2; i -= 1) {
		const prefix = str.substring(0, i);
		if (prefixes[prefix.length].hasOwnProperty(prefix) === true) return prefixes[prefix.length][prefix];
	}
	return null;
};
var checkPrefix = function(terms, i, model) {
	const term = terms[i];
	if (term.tags.size === 0) {
		const tag = prefixLoop(term.normal, model.two.prefixPatterns);
		if (tag !== null) {
			fastTag(term, tag, "2-prefix");
			term.confidence = .5;
			return true;
		}
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/2nd-pass/05-year.js
var min = 1400;
var max = 2100;
var dateWords = /* @__PURE__ */ new Set([
	"in",
	"on",
	"by",
	"until",
	"for",
	"to",
	"during",
	"throughout",
	"through",
	"within",
	"before",
	"after",
	"of",
	"this",
	"next",
	"last",
	"circa",
	"around",
	"post",
	"pre",
	"budget",
	"classic",
	"plan",
	"may"
]);
var seemsGood = function(term) {
	if (!term) return false;
	const str = term.normal || term.implicit;
	if (dateWords.has(str)) return true;
	if (term.tags.has("Date") || term.tags.has("Month") || term.tags.has("WeekDay") || term.tags.has("Year")) return true;
	if (term.tags.has("ProperNoun")) return true;
	return false;
};
var seemsOkay = function(term) {
	if (!term) return false;
	if (term.tags.has("Ordinal")) return true;
	if (term.tags.has("Cardinal") && term.normal.length < 3) return true;
	if (term.normal === "is" || term.normal === "was") return true;
	return false;
};
var seemsFine = function(term) {
	return term && (term.tags.has("Date") || term.tags.has("Month") || term.tags.has("WeekDay") || term.tags.has("Year"));
};
var tagYear = function(terms, i) {
	const term = terms[i];
	if (term.tags.has("NumericValue") && term.tags.has("Cardinal") && term.normal.length === 4) {
		const num = Number(term.normal);
		if (num && !isNaN(num)) {
			if (num > min && num < max) {
				const lastTerm = terms[i - 1];
				const nextTerm = terms[i + 1];
				if (seemsGood(lastTerm) || seemsGood(nextTerm)) return fastTag(term, "Year", "2-tagYear");
				if (num >= 1920 && num < 2025) {
					if (seemsOkay(lastTerm) || seemsOkay(nextTerm)) return fastTag(term, "Year", "2-tagYear-close");
					if (seemsFine(terms[i - 2]) || seemsFine(terms[i + 2])) return fastTag(term, "Year", "2-tagYear-far");
					if (lastTerm && (lastTerm.tags.has("Determiner") || lastTerm.tags.has("Possessive"))) {
						if (nextTerm && nextTerm.tags.has("Noun") && !nextTerm.tags.has("Plural")) return fastTag(term, "Year", "2-tagYear-noun");
					}
				}
			}
		}
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/3rd-pass/07-verb-type.js
var verbType = function(terms, i, model, world) {
	const setTag = world.methods.one.setTag;
	const term = terms[i];
	const types = [
		"PastTense",
		"PresentTense",
		"Auxiliary",
		"Modal",
		"Particle"
	];
	if (term.tags.has("Verb")) {
		if (!types.find((typ) => term.tags.has(typ))) setTag([term], "Infinitive", world, null, `2-verb-type''`);
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/3rd-pass/01-acronym.js
var oneLetterAcronym = /^[A-Z]('s|,)?$/;
var isUpperCase = /^[A-Z-]+$/;
var upperThenS = /^[A-Z]+s$/;
var periodAcronym = /([A-Z]\.)+[A-Z]?,?$/;
var noPeriodAcronym = /[A-Z]{2,}('s|,)?$/;
var lowerCaseAcronym = /([a-z]\.)+[a-z]\.?$/;
var oneLetterWord = {
	I: true,
	A: true
};
var places = {
	la: true,
	ny: true,
	us: true,
	dc: true,
	gb: true
};
var isNoPeriodAcronym = function(term, model) {
	let str = term.text;
	if (isUpperCase.test(str) === false) if (str.length > 3 && upperThenS.test(str) === true) str = str.replace(/s$/, "");
	else return false;
	if (str.length > 5) return false;
	if (oneLetterWord.hasOwnProperty(str)) return false;
	if (model.one.lexicon.hasOwnProperty(term.normal)) return false;
	if (periodAcronym.test(str) === true) return true;
	if (lowerCaseAcronym.test(str) === true) return true;
	if (oneLetterAcronym.test(str) === true) return true;
	if (noPeriodAcronym.test(str) === true) return true;
	return false;
};
var isAcronym = function(terms, i, model) {
	const term = terms[i];
	if (term.tags.has("RomanNumeral") || term.tags.has("Acronym") || term.frozen) return null;
	if (isNoPeriodAcronym(term, model)) {
		term.tags.clear();
		fastTag(term, ["Acronym", "Noun"], "3-no-period-acronym");
		if (places[term.normal] === true) fastTag(term, "Place", "3-place-acronym");
		if (upperThenS.test(term.text) === true) fastTag(term, "Plural", "3-plural-acronym");
		return true;
	}
	if (!oneLetterWord.hasOwnProperty(term.text) && oneLetterAcronym.test(term.text)) {
		term.tags.clear();
		fastTag(term, ["Acronym", "Noun"], "3-one-letter-acronym");
		return true;
	}
	if (term.tags.has("Organization") && term.text.length <= 3) {
		fastTag(term, "Acronym", "3-org-acronym");
		return true;
	}
	if (term.tags.has("Organization") && isUpperCase.test(term.text) && term.text.length <= 6) {
		fastTag(term, "Acronym", "3-titlecase-acronym");
		return true;
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/3rd-pass/02-neighbours.js
var lookAtWord = function(term, words) {
	if (!term) return null;
	const found = words.find((a) => term.normal === a[0]);
	if (found) return found[1];
	return null;
};
var lookAtTag = function(term, tags) {
	if (!term) return null;
	const found = tags.find((a) => term.tags.has(a[0]));
	if (found) return found[1];
	return null;
};
var neighbours = function(terms, i, model) {
	const { leftTags, leftWords, rightWords, rightTags } = model.two.neighbours;
	const term = terms[i];
	if (term.tags.size === 0) {
		let tag = null;
		tag = tag || lookAtWord(terms[i - 1], leftWords);
		tag = tag || lookAtWord(terms[i + 1], rightWords);
		tag = tag || lookAtTag(terms[i - 1], leftTags);
		tag = tag || lookAtTag(terms[i + 1], rightTags);
		if (tag) {
			fastTag(term, tag, "3-[neighbour]");
			fillTags(terms, i, model);
			terms[i].confidence = .2;
			return true;
		}
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/3rd-pass/03-orgWords.js
var isTitleCase$2 = (str) => /^\p{Lu}[\p{Ll}'’]/u.test(str);
var isOrg = function(term, i, yelling) {
	if (!term) return false;
	if (term.tags.has("FirstName") || term.tags.has("Place")) return false;
	if (term.tags.has("ProperNoun") || term.tags.has("Organization") || term.tags.has("Acronym")) return true;
	if (!yelling && isTitleCase$2(term.text)) {
		if (i === 0) return term.tags.has("Singular");
		return true;
	}
	return false;
};
var tagOrgs$1 = function(terms, i, world, yelling) {
	const orgWords = world.model.two.orgWords;
	const setTag = world.methods.one.setTag;
	const term = terms[i];
	if (orgWords[term.machine || term.normal] === true && isOrg(terms[i - 1], i - 1, yelling)) {
		setTag([terms[i]], "Organization", world, null, "3-[org-word]");
		for (let t = i; t >= 0; t -= 1) if (isOrg(terms[t], t, yelling)) setTag([terms[t]], "Organization", world, null, "3-[org-word]");
		else break;
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/3rd-pass/04-placeWords.js
var isTitleCase$1 = (str) => /^\p{Lu}[\p{Ll}'’]/u.test(str);
var isPossessive$1 = /'s$/;
var placeCont = /* @__PURE__ */ new Set([
	"athletic",
	"city",
	"community",
	"eastern",
	"federal",
	"financial",
	"great",
	"historic",
	"historical",
	"local",
	"memorial",
	"municipal",
	"national",
	"northern",
	"provincial",
	"southern",
	"state",
	"western",
	"spring",
	"pine",
	"sunset",
	"view",
	"oak",
	"maple",
	"spruce",
	"cedar",
	"willow"
]);
var noBefore = /* @__PURE__ */ new Set([
	"center",
	"centre",
	"way",
	"range",
	"bar",
	"bridge",
	"field",
	"pit"
]);
var isPlace = function(term, i, yelling) {
	if (!term) return false;
	const tags = term.tags;
	if (tags.has("Organization") || tags.has("Possessive") || isPossessive$1.test(term.normal)) return false;
	if (tags.has("ProperNoun") || tags.has("Place")) return true;
	if (!yelling && isTitleCase$1(term.text)) {
		if (i === 0) return tags.has("Singular");
		return true;
	}
	return false;
};
var tagOrgs = function(terms, i, world, yelling) {
	const placeWords = world.model.two.placeWords;
	const setTag = world.methods.one.setTag;
	const term = terms[i];
	const str = term.machine || term.normal;
	if (placeWords[str] === true) {
		for (let n = i - 1; n >= 0; n -= 1) {
			if (placeCont.has(terms[n].normal)) continue;
			if (isPlace(terms[n], n, yelling)) {
				setTag(terms.slice(n, i + 1), "Place", world, null, "3-[place-of-foo]");
				continue;
			}
			break;
		}
		if (noBefore.has(str)) return false;
		for (let n = i + 1; n < terms.length; n += 1) {
			if (isPlace(terms[n], n, yelling)) {
				setTag(terms.slice(i, n + 1), "Place", world, null, "3-[foo-place]");
				return true;
			}
			if (terms[n].normal === "of" || placeCont.has(terms[n].normal)) continue;
			break;
		}
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/3rd-pass/05-fallback.js
var nounFallback = function(terms, i, model) {
	let isEmpty = false;
	const tags = terms[i].tags;
	if (tags.size === 0) isEmpty = true;
	else if (tags.size === 1) {
		if (tags.has("Hyphenated") || tags.has("HashTag") || tags.has("Prefix") || tags.has("SlashedTerm")) isEmpty = true;
	}
	if (isEmpty) {
		fastTag(terms[i], "Noun", "3-[fallback]");
		fillTags(terms, i, model);
		terms[i].confidence = .1;
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/3rd-pass/_adhoc.js
var isTitleCase = /^[A-Z][a-z]/;
var isCapital = (terms, i) => {
	if (terms[i].tags.has("ProperNoun") && isTitleCase.test(terms[i].text)) return "Noun";
	return null;
};
var isAlone = (terms, i, tag) => {
	if (i === 0 && !terms[1]) return tag;
	return null;
};
var isEndNoun = function(terms, i) {
	if (!terms[i + 1] && terms[i - 1] && terms[i - 1].tags.has("Determiner")) return "Noun";
	return null;
};
var isStart = function(terms, i, tag) {
	if (i === 0 && terms.length > 3) return tag;
	return null;
};
var adhoc = {
	"Adj|Gerund": (terms, i) => {
		return isCapital(terms, i);
	},
	"Adj|Noun": (terms, i) => {
		return isCapital(terms, i) || isEndNoun(terms, i);
	},
	"Actor|Verb": (terms, i) => {
		return isCapital(terms, i);
	},
	"Adj|Past": (terms, i) => {
		return isCapital(terms, i);
	},
	"Adj|Present": (terms, i) => {
		return isCapital(terms, i);
	},
	"Noun|Gerund": (terms, i) => {
		return isCapital(terms, i);
	},
	"Noun|Verb": (terms, i) => {
		return i > 0 && isCapital(terms, i) || isAlone(terms, i, "Infinitive");
	},
	"Plural|Verb": (terms, i) => {
		return isCapital(terms, i) || isAlone(terms, i, "PresentTense") || isStart(terms, i, "Plural");
	},
	"Person|Noun": (terms, i) => {
		return isCapital(terms, i);
	},
	"Person|Verb": (terms, i) => {
		if (i !== 0) return isCapital(terms, i);
		return null;
	},
	"Person|Adj": (terms, i) => {
		if (i === 0 && terms.length > 1) return "Person";
		return isCapital(terms, i) ? "Person" : null;
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/3rd-pass/06-switches.js
var env = typeof process === "undefined" || !process.env ? self.env || {} : process.env;
var prefix = /^(under|over|mis|re|un|dis|semi)-?/;
var checkWord = (term, obj) => {
	if (!term || !obj) return null;
	const str = term.normal || term.implicit;
	let found = null;
	if (obj.hasOwnProperty(str)) found = obj[str];
	if (found && env.DEBUG_TAGS) console.log(`\n  \x1b[2m\x1b[3m     ↓ - '${str}' \x1b[0m`);
	return found;
};
var checkTag = (term, obj = {}, tagSet) => {
	if (!term || !obj) return null;
	let found = Array.from(term.tags).sort((a, b) => {
		return (tagSet[a] ? tagSet[a].parents.length : 0) > (tagSet[b] ? tagSet[b].parents.length : 0) ? -1 : 1;
	}).find((tag) => obj[tag]);
	if (found && env.DEBUG_TAGS) console.log(`  \x1b[2m\x1b[3m      ↓ - '${term.normal || term.implicit}' (#${found})  \x1b[0m`);
	found = obj[found];
	return found;
};
var pickTag = function(terms, i, clues, model) {
	if (!clues) return null;
	const beforeIndex = terms[i - 1]?.text !== "also" ? i - 1 : Math.max(0, i - 2);
	const tagSet = model.one.tagSet;
	let tag = checkWord(terms[i + 1], clues.afterWords);
	tag = tag || checkWord(terms[beforeIndex], clues.beforeWords);
	tag = tag || checkTag(terms[beforeIndex], clues.beforeTags, tagSet);
	tag = tag || checkTag(terms[i + 1], clues.afterTags, tagSet);
	return tag;
};
var doSwitches = function(terms, i, world) {
	const model = world.model;
	const setTag = world.methods.one.setTag;
	const { switches, clues } = model.two;
	const term = terms[i];
	let str = term.normal || term.implicit || "";
	if (prefix.test(str) && !switches[str]) str = str.replace(prefix, "");
	if (term.switch) {
		const form = term.switch;
		if (term.tags.has("Acronym") || term.tags.has("PhrasalVerb")) return;
		let tag = pickTag(terms, i, clues[form], model);
		if (adhoc[form]) tag = adhoc[form](terms, i) || tag;
		if (tag) {
			setTag([term], tag, world, null, `3-[switch] (${form})`);
			fillTags(terms, i, model);
		} else if (env.DEBUG_TAGS) console.log(`\n -> X  - '${str}'  : (${form})  `);
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/3rd-pass/08-imperative.js
var beside = {
	there: true,
	this: true,
	it: true,
	him: true,
	her: true,
	us: true
};
var imperative = function(terms, world) {
	const setTag = world.methods.one.setTag;
	const multiWords = world.model.one._multiCache || {};
	const t = terms[0];
	if ((t.switch === "Noun|Verb" || t.tags.has("Infinitive")) && terms.length >= 2) {
		if (terms.length < 4 && !beside[terms[1].normal]) return;
		if (!t.tags.has("PhrasalVerb") && multiWords.hasOwnProperty(t.normal)) return;
		if (terms[1].tags.has("Noun") || terms[1].tags.has("Determiner")) {
			if (!terms.slice(1, 3).some((term) => term.tags.has("Verb")) || t.tags.has("#PhrasalVerb")) setTag([t], "Imperative", world, null, "3-[imperative]");
		}
	}
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/tagger/index.js
var ignoreCase = function(terms) {
	if (terms.filter((t) => !t.tags.has("ProperNoun")).length <= 3) return false;
	const lowerCase = /^[a-z]/;
	return terms.every((t) => !lowerCase.test(t.text));
};
var firstPass = function(docs, model, world) {
	docs.forEach((terms) => {
		byPunctuation(terms, 0, model, world);
	});
};
var secondPass = function(terms, model, world, isYelling) {
	for (let i = 0; i < terms.length; i += 1) {
		if (terms[i].frozen === true) continue;
		tagSwitch(terms, i, model);
		if (isYelling === false) checkCase(terms, i, model);
		tagBySuffix(terms, i, model);
		checkRegex(terms, i, model, world);
		checkPrefix(terms, i, model);
		tagYear(terms, i, model);
	}
};
var thirdPass = function(terms, model, world, isYelling) {
	for (let i = 0; i < terms.length; i += 1) {
		let found = isAcronym(terms, i, model);
		fillTags(terms, i, model);
		found = found || neighbours(terms, i, model);
		found = found || nounFallback(terms, i, model);
	}
	for (let i = 0; i < terms.length; i += 1) {
		if (terms[i].frozen === true) continue;
		tagOrgs$1(terms, i, world, isYelling);
		tagOrgs(terms, i, world, isYelling);
		doSwitches(terms, i, world);
		verbType(terms, i, model, world);
		byHyphen(terms, i, model, world);
	}
	imperative(terms, world);
};
var preTagger = function(view) {
	const { methods, model, world } = view;
	const docs = view.docs;
	firstPass(docs, model, world);
	const document = methods.two.quickSplit(docs);
	for (let n = 0; n < document.length; n += 1) {
		const terms = document[n];
		const isYelling = ignoreCase(terms);
		secondPass(terms, model, world, isYelling);
		thirdPass(terms, model, world, isYelling);
	}
	return document;
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/root.js
var toRoot$2 = {
	"Possessive": (term) => {
		let str = term.machine || term.normal || term.text;
		str = str.replace(/'s$/, "");
		return str;
	},
	"Plural": (term, world) => {
		const str = term.machine || term.normal || term.text;
		return world.methods.two.transform.noun.toSingular(str, world.model);
	},
	"Copula": () => {
		return "is";
	},
	"PastTense": (term, world) => {
		const str = term.machine || term.normal || term.text;
		return world.methods.two.transform.verb.toInfinitive(str, world.model, "PastTense");
	},
	"Gerund": (term, world) => {
		const str = term.machine || term.normal || term.text;
		return world.methods.two.transform.verb.toInfinitive(str, world.model, "Gerund");
	},
	"PresentTense": (term, world) => {
		const str = term.machine || term.normal || term.text;
		if (term.tags.has("Infinitive")) return str;
		return world.methods.two.transform.verb.toInfinitive(str, world.model, "PresentTense");
	},
	"Comparative": (term, world) => {
		const str = term.machine || term.normal || term.text;
		return world.methods.two.transform.adjective.fromComparative(str, world.model);
	},
	"Superlative": (term, world) => {
		const str = term.machine || term.normal || term.text;
		return world.methods.two.transform.adjective.fromSuperlative(str, world.model);
	},
	"Adverb": (term, world) => {
		const { fromAdverb } = world.methods.two.transform.adjective;
		return fromAdverb(term.machine || term.normal || term.text);
	}
};
var getRoot$1 = function(view) {
	const world = view.world;
	const keys = Object.keys(toRoot$2);
	view.docs.forEach((terms) => {
		for (let i = 0; i < terms.length; i += 1) {
			const term = terms[i];
			for (let k = 0; k < keys.length; k += 1) if (term.tags.has(keys[k])) {
				const fn = toRoot$2[keys[k]];
				const root = fn(term, world);
				if (term.normal !== root) term.root = root;
				break;
			}
		}
	});
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/penn.js
var mapping$1 = {
	Adverb: "RB",
	Comparative: "JJR",
	Superlative: "JJS",
	Adjective: "JJ",
	TO: "Conjunction",
	Modal: "MD",
	Auxiliary: "MD",
	Gerund: "VBG",
	PastTense: "VBD",
	Participle: "VBN",
	PresentTense: "VBZ",
	Infinitive: "VB",
	Particle: "RP",
	Verb: "VB",
	Pronoun: "PRP",
	Cardinal: "CD",
	Conjunction: "CC",
	Determiner: "DT",
	Preposition: "IN",
	QuestionWord: "WP",
	Expression: "UH",
	Possessive: "POS",
	ProperNoun: "NNP",
	Person: "NNP",
	Place: "NNP",
	Organization: "NNP",
	Singular: "NN",
	Plural: "NNS",
	Noun: "NN",
	There: "EX"
};
var toPenn = function(term) {
	if (term.tags.has("ProperNoun") && term.tags.has("Plural")) return "NNPS";
	if (term.tags.has("Possessive") && term.tags.has("Pronoun")) return "PRP$";
	if (term.normal === "there") return "EX";
	if (term.normal === "to") return "TO";
	const arr = term.tagRank || [];
	for (let i = 0; i < arr.length; i += 1) if (mapping$1.hasOwnProperty(arr[i])) return mapping$1[arr[i]];
	return null;
};
var pennTag = function(view) {
	view.compute("tagRank");
	view.docs.forEach((terms) => {
		terms.forEach((term) => {
			term.penn = toPenn(term);
		});
	});
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/compute/index.js
var compute_default$3 = {
	preTagger,
	root: getRoot$1,
	penn: pennTag
};
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/tagSet/nouns.js
var entity = [
	"Person",
	"Place",
	"Organization"
];
//#endregion
//#region node_modules/compromise/src/2-two/preTagger/plugin.js
var plugin_default$14 = {
	compute: compute_default$3,
	methods: methods_default$1,
	model: model_default$1,
	tags: Object.assign({}, {
		Noun: { not: [
			"Verb",
			"Adjective",
			"Adverb",
			"Value",
			"Determiner"
		] },
		Singular: {
			is: "Noun",
			not: ["Plural", "Uncountable"]
		},
		ProperNoun: { is: "Noun" },
		Person: {
			is: "Singular",
			also: ["ProperNoun"],
			not: [
				"Place",
				"Organization",
				"Date"
			]
		},
		FirstName: { is: "Person" },
		MaleName: {
			is: "FirstName",
			not: ["FemaleName", "LastName"]
		},
		FemaleName: {
			is: "FirstName",
			not: ["MaleName", "LastName"]
		},
		LastName: {
			is: "Person",
			not: ["FirstName"]
		},
		Honorific: {
			is: "Person",
			not: [
				"FirstName",
				"LastName",
				"Value"
			]
		},
		Place: {
			is: "Singular",
			not: ["Person", "Organization"]
		},
		Country: {
			is: "Place",
			also: ["ProperNoun"],
			not: ["City"]
		},
		City: {
			is: "Place",
			also: ["ProperNoun"],
			not: ["Country"]
		},
		Region: {
			is: "Place",
			also: ["ProperNoun"]
		},
		Address: {},
		Organization: {
			is: "ProperNoun",
			not: ["Person", "Place"]
		},
		SportsTeam: { is: "Organization" },
		School: { is: "Organization" },
		Company: { is: "Organization" },
		Plural: {
			is: "Noun",
			not: ["Singular", "Uncountable"]
		},
		Uncountable: { is: "Noun" },
		Pronoun: {
			is: "Noun",
			not: entity
		},
		Actor: {
			is: "Noun",
			not: ["Place", "Organization"]
		},
		Activity: {
			is: "Noun",
			not: ["Person", "Place"]
		},
		Unit: {
			is: "Noun",
			not: entity
		},
		Demonym: {
			is: "Noun",
			also: ["ProperNoun"],
			not: entity
		},
		Possessive: { is: "Noun" },
		Reflexive: { is: "Pronoun" }
	}, {
		Verb: { not: [
			"Noun",
			"Adjective",
			"Adverb",
			"Value",
			"Expression"
		] },
		PresentTense: {
			is: "Verb",
			not: ["PastTense", "FutureTense"]
		},
		Infinitive: {
			is: "PresentTense",
			not: ["Gerund"]
		},
		Imperative: {
			is: "Verb",
			not: [
				"PastTense",
				"Gerund",
				"Copula"
			]
		},
		Gerund: {
			is: "PresentTense",
			not: ["Copula"]
		},
		PastTense: {
			is: "Verb",
			not: [
				"PresentTense",
				"Gerund",
				"FutureTense"
			]
		},
		FutureTense: {
			is: "Verb",
			not: ["PresentTense", "PastTense"]
		},
		Copula: { is: "Verb" },
		Modal: {
			is: "Verb",
			not: ["Infinitive"]
		},
		Participle: { is: "PastTense" },
		Auxiliary: {
			is: "Verb",
			not: [
				"PastTense",
				"PresentTense",
				"Gerund",
				"Conjunction"
			]
		},
		PhrasalVerb: { is: "Verb" },
		Particle: {
			is: "PhrasalVerb",
			not: [
				"PastTense",
				"PresentTense",
				"Copula",
				"Gerund"
			]
		},
		Passive: { is: "Verb" }
	}, {
		Value: { not: [
			"Verb",
			"Adjective",
			"Adverb"
		] },
		Ordinal: {
			is: "Value",
			not: ["Cardinal"]
		},
		Cardinal: {
			is: "Value",
			not: ["Ordinal"]
		},
		Fraction: {
			is: "Value",
			not: ["Noun"]
		},
		Multiple: { is: "TextValue" },
		RomanNumeral: {
			is: "Cardinal",
			not: ["TextValue"]
		},
		TextValue: {
			is: "Value",
			not: ["NumericValue"]
		},
		NumericValue: {
			is: "Value",
			not: ["TextValue"]
		},
		Money: { is: "Cardinal" },
		Percent: { is: "Value" }
	}, {
		Date: { not: [
			"Verb",
			"Adverb",
			"Adjective"
		] },
		Month: {
			is: "Date",
			also: ["Noun"],
			not: [
				"Year",
				"WeekDay",
				"Time"
			]
		},
		WeekDay: {
			is: "Date",
			also: ["Noun"]
		},
		Year: {
			is: "Date",
			not: ["RomanNumeral"]
		},
		FinancialQuarter: {
			is: "Date",
			not: "Fraction"
		},
		Holiday: {
			is: "Date",
			also: ["Noun"]
		},
		Season: { is: "Date" },
		Timezone: {
			is: "Date",
			also: ["Noun"],
			not: ["ProperNoun"]
		},
		Time: {
			is: "Date",
			not: ["AtMention"]
		},
		Duration: {
			is: "Date",
			also: ["Noun"]
		}
	}, {
		Adjective: { not: [
			"Noun",
			"Verb",
			"Adverb",
			"Value"
		] },
		Comparable: { is: "Adjective" },
		Comparative: { is: "Adjective" },
		Superlative: {
			is: "Adjective",
			not: ["Comparative"]
		},
		NumberRange: {},
		Adverb: { not: [
			"Noun",
			"Verb",
			"Adjective",
			"Value"
		] },
		Determiner: { not: [
			"Noun",
			"Verb",
			"Adjective",
			"Adverb",
			"QuestionWord",
			"Conjunction"
		] },
		Conjunction: { not: [
			"Noun",
			"Verb",
			"Adjective",
			"Adverb",
			"Value",
			"QuestionWord"
		] },
		Preposition: { not: [
			"Noun",
			"Verb",
			"Adjective",
			"Adverb",
			"QuestionWord",
			"Determiner"
		] },
		QuestionWord: { not: ["Determiner"] },
		Currency: { is: "Noun" },
		Expression: { not: [
			"Noun",
			"Adjective",
			"Verb",
			"Adverb"
		] },
		Abbreviation: {},
		Url: { not: [
			"HashTag",
			"PhoneNumber",
			"Verb",
			"Adjective",
			"Value",
			"AtMention",
			"Email",
			"SlashedTerm"
		] },
		PhoneNumber: { not: [
			"HashTag",
			"Verb",
			"Adjective",
			"Value",
			"AtMention",
			"Email"
		] },
		HashTag: {},
		AtMention: {
			is: "Noun",
			not: ["HashTag", "Email"]
		},
		Emoji: { not: [
			"HashTag",
			"Verb",
			"Adjective",
			"Value",
			"AtMention"
		] },
		Emoticon: { not: [
			"HashTag",
			"Verb",
			"Adjective",
			"Value",
			"AtMention",
			"SlashedTerm"
		] },
		SlashedTerm: { not: [
			"Emoticon",
			"Url",
			"Value"
		] },
		Email: { not: [
			"HashTag",
			"Verb",
			"Adjective",
			"Value",
			"AtMention"
		] },
		Acronym: { not: [
			"Plural",
			"RomanNumeral",
			"Pronoun",
			"Date"
		] },
		Negative: { not: [
			"Noun",
			"Adjective",
			"Value",
			"Expression"
		] },
		Condition: { not: [
			"Verb",
			"Adjective",
			"Noun",
			"Value"
		] },
		There: { not: [
			"Verb",
			"Adjective",
			"Noun",
			"Value",
			"Conjunction",
			"Preposition"
		] },
		Prefix: { not: [
			"Abbreviation",
			"Acronym",
			"ProperNoun"
		] },
		Hyphenated: {}
	}),
	hooks: ["preTagger"]
};
//#endregion
//#region node_modules/compromise/src/2-two/contraction-two/api/contract.js
var postPunct = /[,)"';:\-–—.…]/;
var setContraction = function(m, suffix) {
	if (!m.found) return;
	const terms = m.termList();
	for (let i = 0; i < terms.length - 1; i++) {
		const t = terms[i];
		if (postPunct.test(t.post)) return;
	}
	terms[0].implicit = terms[0].normal;
	terms[0].text += suffix;
	terms[0].normal += suffix;
	terms.slice(1).forEach((t) => {
		t.implicit = t.normal;
		t.text = "";
		t.normal = "";
	});
	for (let i = 0; i < terms.length - 1; i++) terms[i].post = terms[i].post.replace(/ /, "");
};
/** turn 'i am' into i'm */
var contract = function() {
	const doc = this.not("@hasContraction");
	let m = doc.match("(we|they|you) are");
	setContraction(m, `'re`);
	m = doc.match("(he|she|they|it|we|you) will");
	setContraction(m, `'ll`);
	m = doc.match("(he|she|they|it|we) is");
	setContraction(m, `'s`);
	m = doc.match("#Person is");
	setContraction(m, `'s`);
	m = doc.match("#Person would");
	setContraction(m, `'d`);
	m = doc.match("(is|was|had|would|should|could|do|does|have|has|can) not");
	setContraction(m, `n't`);
	m = doc.match("(i|we|they) have");
	setContraction(m, `'ve`);
	m = doc.match("(would|should|could) have");
	setContraction(m, `'ve`);
	m = doc.match("i am");
	setContraction(m, `'m`);
	m = doc.match("going to");
	return this;
};
//#endregion
//#region node_modules/compromise/src/2-two/contraction-two/api/index.js
var titleCase = /^\p{Lu}[\p{Ll}'’]/u;
var toTitleCase = function(str = "") {
	str = str.replace(/^ *[a-z\u00C0-\u00FF]/, (x) => x.toUpperCase());
	return str;
};
var api$17 = function(View) {
	/** */
	class Contractions extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Contraction";
		}
		/** i've -> 'i have' */
		expand() {
			this.docs.forEach((terms) => {
				const isTitleCase = titleCase.test(terms[0].text);
				terms.forEach((t, i) => {
					t.text = t.implicit || "";
					delete t.implicit;
					if (i < terms.length - 1 && t.post === "") t.post += " ";
					t.dirty = true;
				});
				if (isTitleCase) terms[0].text = toTitleCase(terms[0].text);
			});
			this.compute("normal");
			return this;
		}
	}
	View.prototype.contractions = function() {
		const m = this.match("@hasContraction+");
		return new Contractions(this.document, m.pointer);
	};
	View.prototype.contract = contract;
};
//#endregion
//#region node_modules/compromise/src/2-two/contraction-two/compute/_splice.js
var insertContraction = function(document, point, words) {
	const [n, w] = point;
	if (!words || words.length === 0) return;
	words = words.map((word, i) => {
		word.implicit = word.text;
		word.machine = word.text;
		word.pre = "";
		word.post = "";
		word.text = "";
		word.normal = "";
		word.index = [n, w + i];
		return word;
	});
	if (words[0]) {
		words[0].pre = document[n][w].pre;
		words[words.length - 1].post = document[n][w].post;
		words[0].text = document[n][w].text;
		words[0].normal = document[n][w].normal;
	}
	document[n].splice(w, 1, ...words);
};
//#endregion
//#region node_modules/compromise/src/2-two/contraction-two/compute/apostrophe-s.js
var hasContraction$1 = /'/;
var hasWords = /* @__PURE__ */ new Set(["been", "become"]);
var isWords = /* @__PURE__ */ new Set([
	"what",
	"how",
	"when",
	"if",
	"too"
]);
var adjLike$1 = /* @__PURE__ */ new Set([
	"too",
	"also",
	"enough"
]);
var isOrHas = (terms, i) => {
	for (let o = i + 1; o < terms.length; o += 1) {
		const t = terms[o];
		if (hasWords.has(t.normal)) return "has";
		if (isWords.has(t.normal)) return "is";
		if (t.tags.has("Gerund")) return "is";
		if (t.tags.has("Determiner")) return "is";
		if (t.tags.has("Adjective")) return "is";
		if (t.switch === "Adj|Past") {
			if (terms[o + 1]) {
				if (adjLike$1.has(terms[o + 1].normal)) return "is";
				if (terms[o + 1].tags.has("Preposition")) return "is";
			}
		}
		if (t.tags.has("PastTense")) {
			if (terms[o + 1] && terms[o + 1].normal === "for") return "is";
			return "has";
		}
	}
	return "is";
};
var apostropheS$1 = function(terms, i) {
	const before = terms[i].normal.split(hasContraction$1)[0];
	if (before === "let") return [before, "us"];
	if (before === "there") {
		const t = terms[i + 1];
		if (t && t.tags.has("Plural")) return [before, "are"];
	}
	if (isOrHas(terms, i) === "has") return [before, "has"];
	return [before, "is"];
};
//#endregion
//#region node_modules/compromise/src/2-two/contraction-two/compute/apostrophe-d.js
var hasContraction = /'/;
var hadWords = /* @__PURE__ */ new Set([
	"better",
	"done",
	"before",
	"it",
	"had"
]);
var wouldWords = /* @__PURE__ */ new Set(["have", "be"]);
var hadOrWould = (terms, i) => {
	for (let o = i + 1; o < terms.length; o += 1) {
		const t = terms[o];
		if (hadWords.has(t.normal)) return "had";
		if (wouldWords.has(t.normal)) return "would";
		if (t.tags.has("PastTense") || t.switch === "Adj|Past") return "had";
		if (t.tags.has("PresentTense") || t.tags.has("Infinitive")) return "would";
		if (t.tags.has("#Determiner")) return "had";
		if (t.tags.has("Adjective")) return "would";
	}
	return false;
};
var _apostropheD = function(terms, i) {
	const before = terms[i].normal.split(hasContraction)[0];
	if (before === "how" || before === "what") return [before, "did"];
	if (hadOrWould(terms, i) === "had") return [before, "had"];
	return [before, "would"];
};
//#endregion
//#region node_modules/compromise/src/2-two/contraction-two/compute/apostrophe-t.js
var lastNoun$1 = function(terms, i) {
	for (let n = i - 1; n >= 0; n -= 1) if (terms[n].tags.has("Noun") || terms[n].tags.has("Pronoun") || terms[n].tags.has("Plural") || terms[n].tags.has("Singular")) return terms[n];
	return null;
};
var apostropheT = function(terms, i) {
	if (terms[i].normal === "ain't" || terms[i].normal === "aint") {
		if (terms[i + 1] && terms[i + 1].normal === "never") return ["have"];
		const noun = lastNoun$1(terms, i);
		if (noun) {
			if (noun.normal === "we" || noun.normal === "they") return ["are", "not"];
			if (noun.normal === "i") return ["am", "not"];
			if (noun.tags && noun.tags.has("Plural")) return ["are", "not"];
		}
		return ["is", "not"];
	}
	return [terms[i].normal.replace(/n't/, ""), "not"];
};
//#endregion
//#region node_modules/compromise/src/2-two/contraction-two/compute/isPossessive.js
var banList = {
	that: true,
	there: true,
	let: true,
	here: true,
	everywhere: true
};
var beforePossessive = {
	in: true,
	by: true,
	for: true
};
var adjLike = /* @__PURE__ */ new Set([
	"too",
	"also",
	"enough",
	"about"
]);
var nounLike = /* @__PURE__ */ new Set([
	"is",
	"are",
	"did",
	"were",
	"could",
	"should",
	"must",
	"had",
	"have"
]);
var isPossessive = (terms, i) => {
	const term = terms[i];
	if (banList.hasOwnProperty(term.machine || term.normal)) return false;
	if (term.tags.has("Possessive")) return true;
	if (term.tags.has("QuestionWord")) return false;
	if (term.normal === `he's` || term.normal === `she's`) return false;
	const nextTerm = terms[i + 1];
	if (!nextTerm) return true;
	if (term.normal === `it's`) {
		if (nextTerm.tags.has("#Noun")) return true;
		return false;
	}
	if (nextTerm.switch == "Noun|Gerund") {
		const next2 = terms[i + 2];
		if (!next2) {
			if (term.tags.has("Actor") || term.tags.has("ProperNoun")) return true;
			return false;
		}
		if (next2.tags.has("Copula")) return true;
		if (next2.normal === "on" || next2.normal === "in") return false;
		return false;
	}
	if (nextTerm.tags.has("Verb")) {
		if (nextTerm.tags.has("Infinitive")) return true;
		if (nextTerm.tags.has("Gerund")) return false;
		if (nextTerm.tags.has("PresentTense")) return true;
		return false;
	}
	if (nextTerm.switch === "Adj|Noun") {
		const twoTerm = terms[i + 2];
		if (!twoTerm) return false;
		if (nounLike.has(twoTerm.normal)) return true;
		if (adjLike.has(twoTerm.normal)) return false;
	}
	if (nextTerm.tags.has("Noun")) {
		const nextStr = nextTerm.machine || nextTerm.normal;
		if (nextStr === "here" || nextStr === "there" || nextStr === "everywhere") return false;
		if (nextTerm.tags.has("Possessive")) return false;
		if (nextTerm.tags.has("ProperNoun") && !term.tags.has("ProperNoun")) return false;
		return true;
	}
	if (terms[i - 1] && beforePossessive[terms[i - 1].normal] === true) return true;
	if (nextTerm.tags.has("Adjective")) {
		const twoTerm = terms[i + 2];
		if (!twoTerm) return false;
		if (twoTerm.tags.has("Noun") && !twoTerm.tags.has("Pronoun")) {
			const str = nextTerm.normal;
			if (str === "above" || str === "below" || str === "behind") return false;
			return true;
		}
		if (twoTerm.switch === "Noun|Verb") return true;
		return false;
	}
	if (nextTerm.tags.has("Value")) return true;
	return false;
};
//#endregion
//#region node_modules/compromise/src/2-two/contraction-two/compute/index.js
var byApostrophe = /'/;
var reIndex = function(terms) {
	terms.forEach((t, i) => {
		if (t.index) t.index[1] = i;
	});
};
var reTag = function(terms, view, start, len) {
	const tmp = view.update();
	tmp.document = [terms];
	let end = start + len;
	if (start > 0) start -= 1;
	if (terms[end]) end += 1;
	tmp.ptrs = [[
		0,
		start,
		end
	]];
	tmp.compute([
		"freeze",
		"lexicon",
		"preTagger",
		"unfreeze"
	]);
	reIndex(terms);
};
var byEnd = {
	d: (terms, i) => _apostropheD(terms, i),
	t: (terms, i) => apostropheT(terms, i),
	s: (terms, i, world) => {
		if (isPossessive(terms, i)) return world.methods.one.setTag([terms[i]], "Possessive", world, null, "2-contraction");
		return apostropheS$1(terms, i);
	}
};
var toDocs = function(words, view) {
	const doc = view.fromText(words.join(" "));
	doc.compute("id");
	return doc.docs[0];
};
var contractionTwo = (view) => {
	const { world, document } = view;
	document.forEach((terms, n) => {
		for (let i = terms.length - 1; i >= 0; i -= 1) {
			if (terms[i].implicit) continue;
			let after = null;
			if (byApostrophe.test(terms[i].normal) === true) after = terms[i].normal.split(byApostrophe)[1];
			let words = null;
			if (byEnd.hasOwnProperty(after)) words = byEnd[after](terms, i, world);
			if (words) {
				words = toDocs(words, view);
				insertContraction(document, [n, i], words);
				reTag(document[n], view, i, words.length);
				continue;
			}
		}
	});
};
//#endregion
//#region node_modules/compromise/src/2-two/contraction-two/plugin.js
var plugin_default$13 = {
	compute: { contractionTwo },
	api: api$17,
	hooks: ["contractionTwo"]
};
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/adjective/adjective.js
var adjective_default = [
	{
		match: "[(all|both)] #Determiner #Noun",
		group: 0,
		tag: "Noun",
		reason: "all-noun"
	},
	{
		match: "#Copula [(just|alone)]$",
		group: 0,
		tag: "Adjective",
		reason: "not-adverb"
	},
	{
		match: "#Singular is #Adverb? [#PastTense$]",
		group: 0,
		tag: "Adjective",
		reason: "is-filled"
	},
	{
		match: "[#PastTense] #Singular is",
		group: 0,
		tag: "Adjective",
		reason: "smoked-poutine"
	},
	{
		match: "[#PastTense] #Plural are",
		group: 0,
		tag: "Adjective",
		reason: "baked-onions"
	},
	{
		match: "well [#PastTense]",
		group: 0,
		tag: "Adjective",
		reason: "well-made"
	},
	{
		match: "#Copula [fucked up?]",
		group: 0,
		tag: "Adjective",
		reason: "swears-adjective"
	},
	{
		match: "#Singular (seems|appears) #Adverb? [#PastTense$]",
		group: 0,
		tag: "Adjective",
		reason: "seems-filled"
	},
	{
		match: "#Copula #Adjective? [(out|in|through)]$",
		group: 0,
		tag: "Adjective",
		reason: "still-out"
	},
	{
		match: "^[#Adjective] (the|your) #Noun",
		group: 0,
		notIf: "(all|even)",
		tag: "Infinitive",
		reason: "shut-the"
	},
	{
		match: "the [said] #Noun",
		group: 0,
		tag: "Adjective",
		reason: "the-said-card"
	},
	{
		match: "[#Hyphenated (#Hyphenated && #PastTense)] (#Noun|#Conjunction)",
		group: 0,
		tag: "Adjective",
		notIf: "#Adverb",
		reason: "faith-based"
	},
	{
		match: "[#Hyphenated (#Hyphenated && #Gerund)] (#Noun|#Conjunction)",
		group: 0,
		tag: "Adjective",
		notIf: "#Adverb",
		reason: "self-driving"
	},
	{
		match: "[#PastTense (#Hyphenated && #PhrasalVerb)] (#Noun|#Conjunction)",
		group: 0,
		tag: "Adjective",
		reason: "dammed-up"
	},
	{
		match: "(#Hyphenated && #Value) fold",
		tag: "Adjective",
		reason: "two-fold"
	},
	{
		match: "must (#Hyphenated && #Infinitive)",
		tag: "Adjective",
		reason: "must-win"
	},
	{
		match: `(#Hyphenated && #Infinitive) #Hyphenated`,
		tag: "Adjective",
		notIf: "#PhrasalVerb",
		reason: "vacuum-sealed"
	},
	{
		match: "too much",
		tag: "Adverb Adjective",
		reason: "bit-4"
	},
	{
		match: "a bit much",
		tag: "Determiner Adverb Adjective",
		reason: "bit-3"
	},
	{
		match: "[(un|contra|extra|inter|intra|macro|micro|mid|mis|mono|multi|pre|sub|tri|ex)] #Adjective",
		group: 0,
		tag: ["Adjective", "Prefix"],
		reason: "un-skilled"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/adjective/adj-adverb.js
var adverbAdj = `(dark|bright|flat|light|soft|pale|dead|dim|faux|little|wee|sheer|most|near|good|extra|all)`;
var noLy = "(hard|fast|late|early|high|right|deep|close|direct)";
var adj_adverb_default = [
	{
		match: `#Adverb [#Adverb] (and|or|then)`,
		group: 0,
		tag: "Adjective",
		reason: "kinda-sparkly-and"
	},
	{
		match: `[${adverbAdj}] #Adjective`,
		group: 0,
		tag: "Adverb",
		reason: "dark-green"
	},
	{
		match: `#Copula [far too] #Adjective`,
		group: 0,
		tag: "Adverb",
		reason: "far-too"
	},
	{
		match: `#Copula [still] (in|#Gerund|#Adjective)`,
		group: 0,
		tag: "Adverb",
		reason: "was-still-walking"
	},
	{
		match: `#Plural ${noLy}`,
		tag: "#PresentTense #Adverb",
		reason: "studies-hard"
	},
	{
		match: `#Verb [${noLy}] !#Noun?`,
		group: 0,
		notIf: "(#Copula|get|got|getting|become|became|becoming|feel|feels|feeling|#Determiner|#Preposition)",
		tag: "Adverb",
		reason: "shops-direct"
	},
	{
		match: `[#Plural] a lot`,
		tag: "PresentTense",
		reason: "studies-a-lot"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/adjective/adj-gerund.js
var adj_gerund_default$1 = [
	{
		match: "as [#Gerund] as",
		group: 0,
		tag: "Adjective",
		reason: "as-gerund-as"
	},
	{
		match: "more [#Gerund] than",
		group: 0,
		tag: "Adjective",
		reason: "more-gerund-than"
	},
	{
		match: "(so|very|extremely) [#Gerund]",
		group: 0,
		tag: "Adjective",
		reason: "so-gerund"
	},
	{
		match: "(found|found) it #Adverb? [#Gerund]",
		group: 0,
		tag: "Adjective",
		reason: "found-it-gerund"
	},
	{
		match: "a (little|bit|wee) bit? [#Gerund]",
		group: 0,
		tag: "Adjective",
		reason: "a-bit-gerund"
	},
	{
		match: "#Gerund [#Gerund]",
		group: 0,
		tag: "Adjective",
		notIf: "(impersonating|practicing|considering|assuming)",
		reason: "looking-annoying"
	},
	{
		match: "(looked|look|looks) #Adverb? [%Adj|Gerund%]",
		group: 0,
		tag: "Adjective",
		notIf: "(impersonating|practicing|considering|assuming)",
		reason: "looked-amazing"
	},
	{
		match: "[%Adj|Gerund%] #Determiner",
		group: 0,
		tag: "Gerund",
		reason: "developing-a"
	},
	{
		match: "#Possessive [%Adj|Gerund%] #Noun",
		group: 0,
		tag: "Adjective",
		reason: "leading-manufacturer"
	},
	{
		match: "%Noun|Gerund% %Adj|Gerund%",
		tag: "Gerund #Adjective",
		reason: "meaning-alluring"
	},
	{
		match: "(face|embrace|reveal|stop|start|resume) %Adj|Gerund%",
		tag: "#PresentTense #Adjective",
		reason: "face-shocking"
	},
	{
		match: "(are|were) [%Adj|Gerund%] #Plural",
		group: 0,
		tag: "Adjective",
		reason: "are-enduring-symbols"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/adjective/adj-noun.js
var adj_noun_default = [
	{
		match: "#Determiner [#Adjective] #Copula",
		group: 0,
		tag: "Noun",
		reason: "the-adj-is"
	},
	{
		match: "#Adjective [#Adjective] #Copula",
		group: 0,
		tag: "Noun",
		reason: "adj-adj-is"
	},
	{
		match: "(his|its) [%Adj|Noun%]",
		group: 0,
		tag: "Noun",
		notIf: "#Hyphenated",
		reason: "his-fine"
	},
	{
		match: "#Copula #Adverb? [all]",
		group: 0,
		tag: "Noun",
		reason: "is-all"
	},
	{
		match: `(have|had) [#Adjective] #Preposition .`,
		group: 0,
		tag: "Noun",
		reason: "have-fun"
	},
	{
		match: `#Gerund (giant|capital|center|zone|application)`,
		tag: "Noun",
		reason: "brewing-giant"
	},
	{
		match: `#Preposition (a|an) [#Adjective]$`,
		group: 0,
		tag: "Noun",
		reason: "an-instant"
	},
	{
		match: `no [#Adjective] #Modal`,
		group: 0,
		tag: "Noun",
		reason: "no-golden"
	},
	{
		match: `[brand #Gerund?] new`,
		group: 0,
		tag: "Adverb",
		reason: "brand-new"
	},
	{
		match: `(#Determiner|#Comparative|new|different) [kind]`,
		group: 0,
		tag: "Noun",
		reason: "some-kind"
	},
	{
		match: `#Possessive [%Adj|Noun%] #Noun`,
		group: 0,
		tag: "Adjective",
		reason: "her-favourite"
	},
	{
		match: `must && #Hyphenated .`,
		tag: "Adjective",
		reason: "must-win"
	},
	{
		match: `#Determiner [#Adjective]$`,
		tag: "Noun",
		notIf: "(this|that|#Comparative|#Superlative)",
		reason: "the-south"
	},
	{
		match: `(#Noun && #Hyphenated) (#Adjective && #Hyphenated)`,
		tag: "Adjective",
		notIf: "(this|that|#Comparative|#Superlative)",
		reason: "company-wide"
	},
	{
		match: `#Determiner [#Adjective] (#Copula|#Determiner)`,
		notIf: "(#Comparative|#Superlative)",
		group: 0,
		tag: "Noun",
		reason: "the-poor"
	},
	{
		match: `[%Adj|Noun%] #Noun`,
		notIf: "(#Pronoun|#ProperNoun)",
		group: 0,
		tag: "Adjective",
		reason: "stable-foundations"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/adjective/adj-verb.js
var adj_verb_default = [
	{
		match: "(slowly|quickly) [#Adjective]",
		group: 0,
		tag: "Verb",
		reason: "slowly-adj"
	},
	{
		match: "does (#Adverb|not)? [#Adjective]",
		group: 0,
		tag: "PresentTense",
		reason: "does-mean"
	},
	{
		match: "[(fine|okay|cool|ok)] by me",
		group: 0,
		tag: "Adjective",
		reason: "okay-by-me"
	},
	{
		match: "i (#Adverb|do)? not? [mean]",
		group: 0,
		tag: "PresentTense",
		reason: "i-mean"
	},
	{
		match: "will #Adjective",
		tag: "Auxiliary Infinitive",
		reason: "will-adj"
	},
	{
		match: "#Pronoun [#Adjective] #Determiner #Adjective? #Noun",
		group: 0,
		tag: "Verb",
		reason: "he-adj-the"
	},
	{
		match: "#Copula [%Adj|Present%] to #Verb",
		group: 0,
		tag: "Verb",
		reason: "adj-to"
	},
	{
		match: "#Copula [#Adjective] (well|badly|quickly|slowly)",
		group: 0,
		tag: "Verb",
		reason: "done-well"
	},
	{
		match: "#Adjective and [#Gerund] !#Preposition?",
		group: 0,
		tag: "Adjective",
		reason: "rude-and-x"
	},
	{
		match: "#Copula #Adverb? (over|under) [#PastTense]",
		group: 0,
		tag: "Adjective",
		reason: "over-cooked"
	},
	{
		match: "#Copula #Adjective+ (and|or) [#PastTense]$",
		group: 0,
		tag: "Adjective",
		reason: "bland-and-overcooked"
	},
	{
		match: "got #Adverb? [#PastTense] of",
		group: 0,
		tag: "Adjective",
		reason: "got-tired-of"
	},
	{
		match: "(seem|seems|seemed|appear|appeared|appears|feel|feels|felt|sound|sounds|sounded) (#Adverb|#Adjective)? [#PastTense]",
		group: 0,
		tag: "Adjective",
		reason: "felt-loved"
	},
	{
		match: "(seem|feel|seemed|felt) [#PastTense #Particle?]",
		group: 0,
		tag: "Adjective",
		reason: "seem-confused"
	},
	{
		match: "a (bit|little|tad) [#PastTense #Particle?]",
		group: 0,
		tag: "Adjective",
		reason: "a-bit-confused"
	},
	{
		match: "not be [%Adj|Past% #Particle?]",
		group: 0,
		tag: "Adjective",
		reason: "do-not-be-confused"
	},
	{
		match: "#Copula just [%Adj|Past% #Particle?]",
		group: 0,
		tag: "Adjective",
		reason: "is-just-right"
	},
	{
		match: "as [#Infinitive] as",
		group: 0,
		tag: "Adjective",
		reason: "as-pale-as"
	},
	{
		match: "[%Adj|Past%] and #Adjective",
		group: 0,
		tag: "Adjective",
		reason: "faled-and-oppressive"
	},
	{
		match: "or [#PastTense] #Noun",
		group: 0,
		tag: "Adjective",
		notIf: "(#Copula|#Pronoun)",
		reason: "or-heightened-emotion"
	},
	{
		match: "(become|became|becoming|becomes) [#Verb]",
		group: 0,
		tag: "Adjective",
		reason: "become-verb"
	},
	{
		match: "#Possessive [#PastTense] #Noun",
		group: 0,
		tag: "Adjective",
		reason: "declared-intentions"
	},
	{
		match: "#Copula #Pronoun [%Adj|Present%]",
		group: 0,
		tag: "Adjective",
		reason: "is-he-cool"
	},
	{
		match: "#Copula [%Adj|Past%] with",
		group: 0,
		tag: "Adjective",
		notIf: "(associated|worn|baked|aged|armed|bound|fried|loaded|mixed|packed|pumped|filled|sealed)",
		reason: "is-crowded-with"
	},
	{
		match: "#Copula #Adverb? [%Adj|Present%]$",
		group: 0,
		tag: "Adjective",
		reason: "was-empty$"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/adverb.js
var adverb_default = [
	{
		match: "[still] #Adjective",
		group: 0,
		tag: "Adverb",
		reason: "still-advb"
	},
	{
		match: "[still] #Verb",
		group: 0,
		tag: "Adverb",
		reason: "still-verb"
	},
	{
		match: "[so] #Adjective",
		group: 0,
		tag: "Adverb",
		reason: "so-adv"
	},
	{
		match: "[way] #Comparative",
		group: 0,
		tag: "Adverb",
		reason: "way-adj"
	},
	{
		match: "[way] #Adverb #Adjective",
		group: 0,
		tag: "Adverb",
		reason: "way-too-adj"
	},
	{
		match: "[all] #Verb",
		group: 0,
		tag: "Adverb",
		reason: "all-verb"
	},
	{
		match: "#Verb  [like]",
		group: 0,
		notIf: "(#Modal|#PhrasalVerb)",
		tag: "Adverb",
		reason: "verb-like"
	},
	{
		match: "(barely|hardly) even",
		tag: "Adverb",
		reason: "barely-even"
	},
	{
		match: "[even] #Verb",
		group: 0,
		tag: "Adverb",
		reason: "even-walk"
	},
	{
		match: "[even] #Comparative",
		group: 0,
		tag: "Adverb",
		reason: "even-worse"
	},
	{
		match: "[even] (#Determiner|#Possessive)",
		group: 0,
		tag: "#Adverb",
		reason: "even-the"
	},
	{
		match: "even left",
		tag: "#Adverb #Verb",
		reason: "even-left"
	},
	{
		match: "[way] #Adjective",
		group: 0,
		tag: "#Adverb",
		reason: "way-over"
	},
	{
		match: "#PresentTense [(hard|quick|bright|slow|fast|backwards|forwards)]",
		notIf: "#Copula",
		group: 0,
		tag: "Adverb",
		reason: "lazy-ly"
	},
	{
		match: "[much] #Adjective",
		group: 0,
		tag: "Adverb",
		reason: "bit-1"
	},
	{
		match: "#Copula [#Adverb]$",
		group: 0,
		tag: "Adjective",
		reason: "is-well"
	},
	{
		match: "a [(little|bit|wee) bit?] #Adjective",
		group: 0,
		tag: "Adverb",
		reason: "a-bit-cold"
	},
	{
		match: `[(super|pretty)] #Adjective`,
		group: 0,
		tag: "Adverb",
		reason: "super-strong"
	},
	{
		match: "(become|fall|grow) #Adverb? [#PastTense]",
		group: 0,
		tag: "Adjective",
		reason: "overly-weakened"
	},
	{
		match: "(a|an) #Adverb [#Participle] #Noun",
		group: 0,
		tag: "Adjective",
		reason: "completely-beaten"
	},
	{
		match: "#Determiner #Adverb? [close]",
		group: 0,
		tag: "Adjective",
		reason: "a-close"
	},
	{
		match: "#Gerund #Adverb? [close]",
		group: 0,
		tag: "Adverb",
		notIf: "(getting|becoming|feeling)",
		reason: "being-close"
	},
	{
		match: "(the|those|these|a|an) [#Participle] #Noun",
		group: 0,
		tag: "Adjective",
		reason: "blown-motor"
	},
	{
		match: "(#PresentTense|#PastTense) [back]",
		group: 0,
		tag: "Adverb",
		notIf: "(#PhrasalVerb|#Copula)",
		reason: "charge-back"
	},
	{
		match: "#Verb [around]",
		group: 0,
		tag: "Adverb",
		notIf: "#PhrasalVerb",
		reason: "send-around"
	},
	{
		match: "[later] #PresentTense",
		group: 0,
		tag: "Adverb",
		reason: "later-say"
	},
	{
		match: "#Determiner [well] !#PastTense?",
		group: 0,
		tag: "Noun",
		reason: "the-well"
	},
	{
		match: "#Adjective [enough]",
		group: 0,
		tag: "Adverb",
		reason: "high-enough"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/dates/date-phrase.js
var date_phrase_default = [
	{
		match: "#Holiday (day|eve)",
		tag: "Holiday",
		reason: "holiday-day"
	},
	{
		match: "#Value of #Month",
		tag: "Date",
		reason: "value-of-month"
	},
	{
		match: "#Cardinal #Month",
		tag: "Date",
		reason: "cardinal-month"
	},
	{
		match: "#Month #Value to #Value",
		tag: "Date",
		reason: "value-to-value"
	},
	{
		match: "#Month the #Value",
		tag: "Date",
		reason: "month-the-value"
	},
	{
		match: "(#WeekDay|#Month) #Value",
		tag: "Date",
		reason: "date-value"
	},
	{
		match: "#Value (#WeekDay|#Month)",
		tag: "Date",
		reason: "value-date"
	},
	{
		match: "(#TextValue && #Date) #TextValue",
		tag: "Date",
		reason: "textvalue-date"
	},
	{
		match: `#Month #NumberRange`,
		tag: "Date",
		reason: "aug 20-21"
	},
	{
		match: `#WeekDay #Month #Ordinal`,
		tag: "Date",
		reason: "week mm-dd"
	},
	{
		match: `#Month #Ordinal #Cardinal`,
		tag: "Date",
		reason: "mm-dd-yyy"
	},
	{
		match: `(#Place|#Demonmym|#Time) (standard|daylight|central|mountain)? time`,
		tag: "Timezone",
		reason: "std-time"
	},
	{
		match: `(eastern|mountain|pacific|central|atlantic) (standard|daylight|summer)? time`,
		tag: "Timezone",
		reason: "eastern-time"
	},
	{
		match: `#Time [(eastern|mountain|pacific|central|est|pst|gmt)]`,
		group: 0,
		tag: "Timezone",
		reason: "5pm-central"
	},
	{
		match: `(central|western|eastern) european time`,
		tag: "Timezone",
		reason: "cet"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/dates/date.js
var date_default = [
	{
		match: "[sun] the #Ordinal",
		tag: "WeekDay",
		reason: "sun-the-5th"
	},
	{
		match: "[sun] #Date",
		group: 0,
		tag: "WeekDay",
		reason: "sun-feb"
	},
	{
		match: "#Date (on|this|next|last|during)? [sun]",
		group: 0,
		tag: "WeekDay",
		reason: "1pm-sun"
	},
	{
		match: `(in|by|before|during|on|until|after|of|within|all) [sat]`,
		group: 0,
		tag: "WeekDay",
		reason: "sat"
	},
	{
		match: `(in|by|before|during|on|until|after|of|within|all) [wed]`,
		group: 0,
		tag: "WeekDay",
		reason: "wed"
	},
	{
		match: `(in|by|before|during|on|until|after|of|within|all) [march]`,
		group: 0,
		tag: "Month",
		reason: "march"
	},
	{
		match: "[sat] #Date",
		group: 0,
		tag: "WeekDay",
		reason: "sat-feb"
	},
	{
		match: `#Preposition [(march|may)]`,
		group: 0,
		tag: "Month",
		reason: "in-month"
	},
	{
		match: `(this|next|last) (march|may) !#Infinitive?`,
		tag: "#Date #Month",
		reason: "this-month"
	},
	{
		match: `(march|may) the? #Value`,
		tag: "#Month #Date #Date",
		reason: "march-5th"
	},
	{
		match: `#Value of? (march|may)`,
		tag: "#Date #Date #Month",
		reason: "5th-of-march"
	},
	{
		match: `[(march|may)] .? #Date`,
		group: 0,
		tag: "Month",
		reason: "march-and-feb"
	},
	{
		match: `#Date .? [(march|may)]`,
		group: 0,
		tag: "Month",
		reason: "feb-and-march"
	},
	{
		match: `#Adverb [(march|may)]`,
		group: 0,
		tag: "Verb",
		reason: "quickly-march"
	},
	{
		match: `[(march|may)] #Adverb`,
		group: 0,
		tag: "Verb",
		reason: "march-quickly"
	},
	{
		match: `#Value (am|pm)`,
		tag: "Time",
		reason: "2-am"
	}
];
var nouns_default = [
	{
		match: "(the|any) [more]",
		group: 0,
		tag: "Singular",
		reason: "more-noun"
	},
	{
		match: "[more] #Noun",
		group: 0,
		tag: "Adjective",
		reason: "more-noun"
	},
	{
		match: "(right|rights) of .",
		tag: "Noun",
		reason: "right-of"
	},
	{
		match: "a [bit]",
		group: 0,
		tag: "Singular",
		reason: "bit-2"
	},
	{
		match: "a [must]",
		group: 0,
		tag: "Singular",
		reason: "must-2"
	},
	{
		match: "(we|us) [all]",
		group: 0,
		tag: "Noun",
		reason: "we all"
	},
	{
		match: "due to [#Verb]",
		group: 0,
		tag: "Noun",
		reason: "due-to"
	},
	{
		match: "some [#Verb] #Plural",
		group: 0,
		tag: "Noun",
		reason: "determiner6"
	},
	{
		match: "#Possessive #Ordinal [#PastTense]",
		group: 0,
		tag: "Noun",
		reason: "first-thought"
	},
	{
		match: "(the|this|those|these) #Adjective [%Verb|Noun%]",
		group: 0,
		tag: "Noun",
		notIf: "#Copula",
		reason: "the-adj-verb"
	},
	{
		match: "(the|this|those|these) #Adverb #Adjective [#Verb]",
		group: 0,
		tag: "Noun",
		reason: "determiner4"
	},
	{
		match: "the [#Verb] #Preposition .",
		group: 0,
		tag: "Noun",
		reason: "determiner1"
	},
	{
		match: "(a|an|the) [#Verb] of",
		group: 0,
		tag: "Noun",
		reason: "the-verb-of"
	},
	{
		match: "#Determiner #Noun of [#Verb]",
		group: 0,
		tag: "Noun",
		notIf: "#Gerund",
		reason: "noun-of-noun"
	},
	{
		match: "#PastTense #Preposition [#PresentTense]",
		group: 0,
		notIf: "#Gerund",
		tag: "Noun",
		reason: "ended-in-ruins"
	},
	{
		match: "#Conjunction [u]",
		group: 0,
		tag: "Pronoun",
		reason: "u-pronoun-2"
	},
	{
		match: "[u] #Verb",
		group: 0,
		tag: "Pronoun",
		reason: "u-pronoun-1"
	},
	{
		match: "#Determiner [(western|eastern|northern|southern|central)] #Noun",
		group: 0,
		tag: "Noun",
		reason: "western-line"
	},
	{
		match: "(#Singular && @hasHyphen) #PresentTense",
		tag: "Noun",
		reason: "hyphen-verb"
	},
	{
		match: "is no [#Verb]",
		group: 0,
		tag: "Noun",
		reason: "is-no-verb"
	},
	{
		match: "do [so]",
		group: 0,
		tag: "Noun",
		reason: "so-noun"
	},
	{
		match: "#Determiner [(shit|damn|hell)]",
		group: 0,
		tag: "Noun",
		reason: "swears-noun"
	},
	{
		match: "to [(shit|hell)]",
		group: 0,
		tag: "Noun",
		reason: "to-swears"
	},
	{
		match: "(the|these) [#Singular] (were|are)",
		group: 0,
		tag: "Plural",
		reason: "singular-were"
	},
	{
		match: `a #Noun+ or #Adverb+? [#Verb]`,
		group: 0,
		tag: "Noun",
		reason: "noun-or-noun"
	},
	{
		match: "(the|those|these|a|an) #Adjective? [#PresentTense #Particle?]",
		group: 0,
		tag: "Noun",
		notIf: "(seem|appear|include|#Gerund|#Copula)",
		reason: "det-inf"
	},
	{
		match: "#Noun #Actor",
		tag: "Actor",
		notIf: "(#Person|#Pronoun)",
		reason: "thing-doer"
	},
	{
		match: "#Gerund #Actor",
		tag: "Actor",
		reason: "gerund-doer"
	},
	{
		match: `co #Singular`,
		tag: "Actor",
		reason: "co-noun"
	},
	{
		match: `[#Noun+] #Actor`,
		group: 0,
		tag: "Actor",
		notIf: "(#Honorific|#Pronoun|#Possessive)",
		reason: "air-traffic-controller"
	},
	{
		match: `(urban|cardiac|cardiovascular|respiratory|medical|clinical|visual|graphic|creative|dental|exotic|fine|certified|registered|technical|virtual|professional|amateur|junior|senior|special|pharmaceutical|theoretical)+ #Noun? #Actor`,
		tag: "Actor",
		reason: "fine-artist"
	},
	{
		match: `#Noun+ (coach|chef|king|engineer|fellow|personality|boy|girl|man|woman|master)`,
		tag: "Actor",
		reason: "dance-coach"
	},
	{
		match: `chief . officer`,
		tag: "Actor",
		reason: "chief-x-officer"
	},
	{
		match: `chief of #Noun+`,
		tag: "Actor",
		reason: "chief-of-police"
	},
	{
		match: `senior? vice? president of #Noun+`,
		tag: "Actor",
		reason: "president-of"
	},
	{
		match: "#Determiner [sun]",
		group: 0,
		tag: "Singular",
		reason: "the-sun"
	},
	{
		match: "#Verb (a|an) [#Value]$",
		group: 0,
		tag: "Singular",
		reason: "did-a-value"
	},
	{
		match: "the [(can|will|may)]",
		group: 0,
		tag: "Singular",
		reason: "the can"
	},
	{
		match: "#FirstName #Acronym? (#Possessive && #LastName)",
		tag: "Possessive",
		reason: "name-poss"
	},
	{
		match: "#Organization+ #Possessive",
		tag: "Possessive",
		reason: "org-possessive"
	},
	{
		match: "#Place+ #Possessive",
		tag: "Possessive",
		reason: "place-possessive"
	},
	{
		match: "#Possessive #PresentTense #Particle?",
		notIf: "(#Gerund|her)",
		tag: "Noun",
		reason: "possessive-verb"
	},
	{
		match: "(my|our|their|her|his|its) [(#Plural && #Actor)] #Noun",
		tag: "Possessive",
		reason: "my-dads"
	},
	{
		match: "#Value of a [second]",
		group: 0,
		unTag: "Value",
		tag: "Singular",
		reason: "10th-of-a-second"
	},
	{
		match: "#Value [seconds]",
		group: 0,
		unTag: "Value",
		tag: "Plural",
		reason: "10-seconds"
	},
	{
		match: "in [#Infinitive]",
		group: 0,
		tag: "Singular",
		reason: "in-age"
	},
	{
		match: "a [#Adjective] #Preposition",
		group: 0,
		tag: "Noun",
		reason: "a-minor-in"
	},
	{
		match: "#Determiner [#Singular] said",
		group: 0,
		tag: "Actor",
		reason: "the-actor-said"
	},
	{
		match: `#Determiner #Noun [(feel|sense|process|rush|side|bomb|bully|challenge|cover|crush|dump|exchange|flow|function|issue|lecture|limit|march|process)] !(#Preposition|to|#Adverb)?`,
		group: 0,
		tag: "Noun",
		reason: "the-noun-sense"
	},
	{
		match: "[#PresentTense] (of|by|for) (a|an|the) #Noun #Copula",
		group: 0,
		tag: "Plural",
		reason: "photographs-of"
	},
	{
		match: "#Infinitive and [%Noun|Verb%]",
		group: 0,
		tag: "Infinitive",
		reason: "fight and win"
	},
	{
		match: "#Noun and [#Verb] and #Noun",
		group: 0,
		tag: "Noun",
		reason: "peace-and-flowers"
	},
	{
		match: "the #Cardinal [%Adj|Noun%]",
		group: 0,
		tag: "Noun",
		reason: "the-1992-classic"
	},
	{
		match: "#Copula the [%Adj|Noun%] #Noun",
		group: 0,
		tag: "Adjective",
		reason: "the-premier-university"
	},
	{
		match: "i #Verb [me] #Noun",
		group: 0,
		tag: "Possessive",
		reason: "scottish-me"
	},
	{
		match: "[#PresentTense] (music|class|lesson|night|party|festival|league|ceremony)",
		group: 0,
		tag: "Noun",
		reason: "dance-music"
	},
	{
		match: "[wit] (me|it)",
		group: 0,
		tag: "Presposition",
		reason: "wit-me"
	},
	{
		match: "#PastTense #Possessive [#Verb]",
		group: 0,
		tag: "Noun",
		notIf: "(saw|made)",
		reason: "left-her-boots"
	},
	{
		match: "#Value [%Plural|Verb%]",
		group: 0,
		tag: "Plural",
		notIf: "(one|1|a|an)",
		reason: "35-signs"
	},
	{
		match: "had [#PresentTense]",
		group: 0,
		tag: "Noun",
		notIf: "(#Gerund|come|become)",
		reason: "had-time"
	},
	{
		match: "%Adj|Noun% %Noun|Verb%",
		tag: "#Adjective #Noun",
		notIf: "#ProperNoun #Noun",
		reason: "instant-access"
	},
	{
		match: "#Determiner [%Adj|Noun%] #Conjunction",
		group: 0,
		tag: "Noun",
		reason: "a-rep-to"
	},
	{
		match: "#Adjective #Noun [%Plural|Verb%]$",
		group: 0,
		tag: "Plural",
		notIf: "#Pronoun",
		reason: "near-death-experiences"
	},
	{
		match: "#Possessive #Noun [%Plural|Verb%]$",
		group: 0,
		tag: "Plural",
		reason: "your-guild-colors"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/verbs/noun-gerund.js
var noun_gerund_default = [
	{
		match: "(this|that|the|a|an) [#Gerund #Infinitive]",
		group: 0,
		tag: "Singular",
		reason: "the-planning-process"
	},
	{
		match: "(that|the) [#Gerund #PresentTense]",
		group: 0,
		ifNo: "#Copula",
		tag: "Plural",
		reason: "the-paving-stones"
	},
	{
		match: "#Determiner [#Gerund] #Noun",
		group: 0,
		tag: "Adjective",
		reason: "the-gerund-noun"
	},
	{
		match: `#Pronoun #Infinitive [#Gerund] #PresentTense`,
		group: 0,
		tag: "Noun",
		reason: "tipping-sucks"
	},
	{
		match: "#Adjective [#Gerund]",
		group: 0,
		tag: "Noun",
		notIf: "(still|even|just)",
		reason: "early-warning"
	},
	{
		match: "[#Gerund] #Adverb? not? #Copula",
		group: 0,
		tag: "Activity",
		reason: "gerund-copula"
	},
	{
		match: "#Copula [(#Gerund|#Activity)] #Copula",
		group: 0,
		tag: "Gerund",
		reason: "are-doing-is"
	},
	{
		match: "[#Gerund] #Modal",
		group: 0,
		tag: "Activity",
		reason: "gerund-modal"
	},
	{
		match: "#Singular for [%Noun|Gerund%]",
		group: 0,
		tag: "Gerund",
		reason: "noun-for-gerund"
	},
	{
		match: "#Comparative (for|at) [%Noun|Gerund%]",
		group: 0,
		tag: "Gerund",
		reason: "better-for-gerund"
	},
	{
		match: "#PresentTense the [#Gerund]",
		group: 0,
		tag: "Noun",
		reason: "keep-the-touching"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/verbs/verb-noun.js
var verb_noun_default = [
	{
		match: "#Infinitive (this|that|the) [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "do-this-dance"
	},
	{
		match: "#Gerund #Determiner [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "running-a-show"
	},
	{
		match: "#Determiner (only|further|just|more|backward) [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "the-only-reason"
	},
	{
		match: "(the|this|a|an) [#Infinitive] #Adverb? #Verb",
		group: 0,
		tag: "Noun",
		reason: "determiner5"
	},
	{
		match: "#Determiner #Adjective #Adjective? [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "a-nice-inf"
	},
	{
		match: "#Determiner #Demonym [#PresentTense]",
		group: 0,
		tag: "Noun",
		reason: "mexican-train"
	},
	{
		match: "#Adjective #Noun+ [#Infinitive] #Copula",
		group: 0,
		tag: "Noun",
		reason: "career-move"
	},
	{
		match: "at some [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "at-some-inf"
	},
	{
		match: "(go|goes|went) to [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "goes-to-verb"
	},
	{
		match: "(a|an) #Adjective? #Noun [#Infinitive] (#Preposition|#Noun)",
		group: 0,
		notIf: "from",
		tag: "Noun",
		reason: "a-noun-inf"
	},
	{
		match: "(a|an) #Noun [#Infinitive]$",
		group: 0,
		tag: "Noun",
		reason: "a-noun-inf2"
	},
	{
		match: "#Gerund #Adjective? for [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "running-for"
	},
	{
		match: "about [#Infinitive]",
		group: 0,
		tag: "Singular",
		reason: "about-love"
	},
	{
		match: "#Plural on [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "on-stage"
	},
	{
		match: "any [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "any-charge"
	},
	{
		match: "no [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "no-doubt"
	},
	{
		match: "number of [#PresentTense]",
		group: 0,
		tag: "Noun",
		reason: "number-of-x"
	},
	{
		match: "(taught|teaches|learns|learned) [#PresentTense]",
		group: 0,
		tag: "Noun",
		reason: "teaches-x"
	},
	{
		match: "(try|use|attempt|build|make) [#Verb #Particle?]",
		notIf: "(#Copula|#Noun|sure|fun|up)",
		group: 0,
		tag: "Noun",
		reason: "do-verb"
	},
	{
		match: "^[#Infinitive] (is|was)",
		group: 0,
		tag: "Noun",
		reason: "checkmate-is"
	},
	{
		match: "#Infinitive much [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "get-much"
	},
	{
		match: "[cause] #Pronoun #Verb",
		group: 0,
		tag: "Conjunction",
		reason: "cause-cuz"
	},
	{
		match: "the #Singular [#Infinitive] #Noun",
		group: 0,
		tag: "Noun",
		notIf: "#Pronoun",
		reason: "cardio-dance"
	},
	{
		match: "#Determiner #Modal [#Noun]",
		group: 0,
		tag: "PresentTense",
		reason: "should-smoke"
	},
	{
		match: "this [#Plural]",
		group: 0,
		tag: "PresentTense",
		notIf: "(#Preposition|#Date)",
		reason: "this-verbs"
	},
	{
		match: "#Noun that [#Plural]",
		group: 0,
		tag: "PresentTense",
		notIf: "(#Preposition|#Pronoun|way)",
		reason: "voice-that-rocks"
	},
	{
		match: "that [#Plural] to",
		group: 0,
		tag: "PresentTense",
		notIf: "#Preposition",
		reason: "that-leads-to"
	},
	{
		match: "(let|make|made) (him|her|it|#Person|#Place|#Organization)+ [#Singular] (a|an|the|it)",
		group: 0,
		tag: "Infinitive",
		reason: "let-him-glue"
	},
	{
		match: "#Verb (all|every|each|most|some|no) [#PresentTense]",
		notIf: "#Modal",
		group: 0,
		tag: "Noun",
		reason: "all-presentTense"
	},
	{
		match: "(had|have|#PastTense) #Adjective [#PresentTense]",
		group: 0,
		tag: "Noun",
		notIf: "better",
		reason: "adj-presentTense"
	},
	{
		match: "#Value #Adjective [#PresentTense]",
		group: 0,
		tag: "Noun",
		notIf: "#Copula",
		reason: "one-big-reason"
	},
	{
		match: "#PastTense #Adjective+ [#PresentTense]",
		group: 0,
		tag: "Noun",
		notIf: "(#Copula|better)",
		reason: "won-wide-support"
	},
	{
		match: "(many|few|several|couple) [#PresentTense]",
		group: 0,
		tag: "Noun",
		notIf: "#Copula",
		reason: "many-poses"
	},
	{
		match: "#Determiner #Adverb #Adjective [%Noun|Verb%]",
		group: 0,
		tag: "Noun",
		notIf: "#Copula",
		reason: "very-big-dream"
	},
	{
		match: "from #Noun to [%Noun|Verb%]",
		group: 0,
		tag: "Noun",
		reason: "start-to-finish"
	},
	{
		match: "(for|with|of) #Noun (and|or|not) [%Noun|Verb%]",
		group: 0,
		tag: "Noun",
		notIf: "#Pronoun",
		reason: "for-food-and-gas"
	},
	{
		match: "#Adjective #Adjective [#PresentTense]",
		group: 0,
		tag: "Noun",
		notIf: "#Copula",
		reason: "adorable-little-store"
	},
	{
		match: "#Gerund #Adverb? #Comparative [#PresentTense]",
		group: 0,
		tag: "Noun",
		notIf: "#Copula",
		reason: "higher-costs"
	},
	{
		match: "(#Noun && @hasComma) #Noun (and|or) [#PresentTense]",
		group: 0,
		tag: "Noun",
		notIf: "#Copula",
		reason: "noun-list"
	},
	{
		match: "(many|any|some|several) [#PresentTense] for",
		group: 0,
		tag: "Noun",
		reason: "any-verbs-for"
	},
	{
		match: `to #PresentTense #Noun [#PresentTense] #Preposition`,
		group: 0,
		tag: "Noun",
		reason: "gas-exchange"
	},
	{
		match: `#PastTense (until|as|through|without) [#PresentTense]`,
		group: 0,
		tag: "Noun",
		reason: "waited-until-release"
	},
	{
		match: `#Gerund like #Adjective? [#PresentTense]`,
		group: 0,
		tag: "Plural",
		reason: "like-hot-cakes"
	},
	{
		match: `some #Adjective [#PresentTense]`,
		group: 0,
		tag: "Noun",
		reason: "some-reason"
	},
	{
		match: `for some [#PresentTense]`,
		group: 0,
		tag: "Noun",
		reason: "for-some-reason"
	},
	{
		match: `(same|some|the|that|a) kind of [#PresentTense]`,
		group: 0,
		tag: "Noun",
		reason: "some-kind-of"
	},
	{
		match: `(same|some|the|that|a) type of [#PresentTense]`,
		group: 0,
		tag: "Noun",
		reason: "some-type-of"
	},
	{
		match: `#Gerund #Adjective #Preposition [#PresentTense]`,
		group: 0,
		tag: "Noun",
		reason: "doing-better-for-x"
	},
	{
		match: `(get|got|have) #Comparative [#PresentTense]`,
		group: 0,
		tag: "Noun",
		reason: "got-better-aim"
	},
	{
		match: "whose [#PresentTense] #Copula",
		group: 0,
		tag: "Noun",
		reason: "whos-name-was"
	},
	{
		match: `#PhrasalVerb #Particle #Preposition [#PresentTense]`,
		group: 0,
		tag: "Noun",
		reason: "given-up-on-x"
	},
	{
		match: "there (are|were) #Adjective? [#PresentTense]",
		group: 0,
		tag: "Plural",
		reason: "there-are"
	},
	{
		match: "#Value [#PresentTense] of",
		group: 0,
		notIf: "(one|1|#Copula|#Infinitive)",
		tag: "Plural",
		reason: "2-trains"
	},
	{
		match: "[#PresentTense] (are|were) #Adjective",
		group: 0,
		tag: "Plural",
		reason: "compromises-are-possible"
	},
	{
		match: "^[(hope|guess|thought|think)] #Pronoun #Verb",
		group: 0,
		tag: "Infinitive",
		reason: "suppose-i"
	},
	{
		match: "#Possessive #Adjective [#Verb]",
		group: 0,
		tag: "Noun",
		notIf: "#Copula",
		reason: "our-full-support"
	},
	{
		match: "[(tastes|smells)] #Adverb? #Adjective",
		group: 0,
		tag: "PresentTense",
		reason: "tastes-good"
	},
	{
		match: "#Copula #Gerund [#PresentTense] !by?",
		group: 0,
		tag: "Noun",
		notIf: "going",
		reason: "ignoring-commute"
	},
	{
		match: "#Determiner #Adjective? [(shed|thought|rose|bid|saw|spelt)]",
		group: 0,
		tag: "Noun",
		reason: "noun-past"
	},
	{
		match: "how to [%Noun|Verb%]",
		group: 0,
		tag: "Infinitive",
		reason: "how-to-noun"
	},
	{
		match: "which [%Noun|Verb%] #Noun",
		group: 0,
		tag: "Infinitive",
		reason: "which-boost-it"
	},
	{
		match: "#Gerund [%Plural|Verb%]",
		group: 0,
		tag: "Plural",
		reason: "asking-questions"
	},
	{
		match: "(ready|available|difficult|hard|easy|made|attempt|try) to [%Noun|Verb%]",
		group: 0,
		tag: "Infinitive",
		reason: "ready-to-noun"
	},
	{
		match: "(bring|went|go|drive|run|bike) to [%Noun|Verb%]",
		group: 0,
		tag: "Noun",
		reason: "bring-to-noun"
	},
	{
		match: "#Modal #Noun [%Noun|Verb%]",
		group: 0,
		tag: "Infinitive",
		reason: "would-you-look"
	},
	{
		match: "#Copula just [#Infinitive]",
		group: 0,
		tag: "Noun",
		reason: "is-just-spam"
	},
	{
		match: "^%Noun|Verb% %Plural|Verb%",
		tag: "Imperative #Plural",
		reason: "request-copies"
	},
	{
		match: "#Adjective #Plural and [%Plural|Verb%]",
		group: 0,
		tag: "#Plural",
		reason: "pickles-and-drinks"
	},
	{
		match: "#Determiner #Year [#Verb]",
		group: 0,
		tag: "Noun",
		reason: "the-1968-film"
	},
	{
		match: "#Determiner [#PhrasalVerb #Particle]",
		group: 0,
		tag: "Noun",
		reason: "the-break-up"
	},
	{
		match: "#Determiner [%Adj|Noun%] #Noun",
		group: 0,
		tag: "Adjective",
		notIf: "(#Pronoun|#Possessive|#ProperNoun)",
		reason: "the-individual-goals"
	},
	{
		match: "[%Noun|Verb%] or #Infinitive",
		group: 0,
		tag: "Infinitive",
		reason: "work-or-prepare"
	},
	{
		match: "to #Infinitive [#PresentTense]",
		group: 0,
		tag: "Noun",
		notIf: "(#Gerund|#Copula|help)",
		reason: "to-give-thanks"
	},
	{
		match: "[#Noun] me",
		group: 0,
		tag: "Verb",
		reason: "kills-me"
	},
	{
		match: "%Plural|Verb% %Plural|Verb%",
		tag: "#PresentTense #Plural",
		reason: "removes-wrinkles"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/numbers/money.js
var money_default = [
	{
		match: "#Money and #Money #Currency?",
		tag: "Money",
		reason: "money-and-money"
	},
	{
		match: "#Value #Currency [and] #Value (cents|ore|centavos|sens)",
		group: 0,
		tag: "money",
		reason: "and-5-cents"
	},
	{
		match: "#Value (mark|rand|won|rub|ore)",
		tag: "#Money #Currency",
		reason: "4-mark"
	},
	{
		match: "a pound",
		tag: "#Money #Unit",
		reason: "a-pound"
	},
	{
		match: "#Value (pound|pounds)",
		tag: "#Money #Unit",
		reason: "4-pounds"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/numbers/fractions.js
var fractions_default = [
	{
		match: "[(half|quarter)] of? (a|an)",
		group: 0,
		tag: "Fraction",
		reason: "millionth"
	},
	{
		match: "#Adverb [half]",
		group: 0,
		tag: "Fraction",
		reason: "nearly-half"
	},
	{
		match: "[half] the",
		group: 0,
		tag: "Fraction",
		reason: "half-the"
	},
	{
		match: "#Cardinal and a half",
		tag: "Fraction",
		reason: "and-a-half"
	},
	{
		match: "#Value (halves|halfs|quarters)",
		tag: "Fraction",
		reason: "two-halves"
	},
	{
		match: "a #Ordinal",
		tag: "Fraction",
		reason: "a-quarter"
	},
	{
		match: "[#Cardinal+] (#Fraction && /s$/)",
		tag: "Fraction",
		reason: "seven-fifths"
	},
	{
		match: "[#Cardinal+ #Ordinal] of .",
		group: 0,
		tag: "Fraction",
		reason: "ordinal-of"
	},
	{
		match: "[(#NumericValue && #Ordinal)] of .",
		group: 0,
		tag: "Fraction",
		reason: "num-ordinal-of"
	},
	{
		match: "(a|one) #Cardinal?+ #Ordinal",
		tag: "Fraction",
		reason: "a-ordinal"
	},
	{
		match: "#Cardinal+ out? of every? #Cardinal",
		tag: "Fraction",
		reason: "out-of"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/numbers/numbers.js
var numbers_default = [
	{
		match: `#Cardinal [second]`,
		tag: "Unit",
		reason: "one-second"
	},
	{
		match: "!once? [(a|an)] (#Duration|hundred|thousand|million|billion|trillion)",
		group: 0,
		tag: "Value",
		reason: "a-is-one"
	},
	{
		match: "1 #Value #PhoneNumber",
		tag: "PhoneNumber",
		reason: "1-800-Value"
	},
	{
		match: "#NumericValue #PhoneNumber",
		tag: "PhoneNumber",
		reason: "(800) PhoneNumber"
	},
	{
		match: "#Demonym #Currency",
		tag: "Currency",
		reason: "demonym-currency"
	},
	{
		match: "#Value [(buck|bucks|grand)]",
		group: 0,
		tag: "Currency",
		reason: "value-bucks"
	},
	{
		match: "[#Value+] #Currency",
		group: 0,
		tag: "Money",
		reason: "15 usd"
	},
	{
		match: "[second] #Noun",
		group: 0,
		tag: "Ordinal",
		reason: "second-noun"
	},
	{
		match: "#Value+ [#Currency]",
		group: 0,
		tag: "Unit",
		reason: "5-yan"
	},
	{
		match: "#Value [(foot|feet)]",
		group: 0,
		tag: "Unit",
		reason: "foot-unit"
	},
	{
		match: "#Value [#Abbreviation]",
		group: 0,
		tag: "Unit",
		reason: "value-abbr"
	},
	{
		match: "#Value [k]",
		group: 0,
		tag: "Unit",
		reason: "value-k"
	},
	{
		match: "#Unit an hour",
		tag: "Unit",
		reason: "unit-an-hour"
	},
	{
		match: "(minus|negative) #Value",
		tag: "Value",
		reason: "minus-value"
	},
	{
		match: "#Value (point|decimal) #Value",
		tag: "Value",
		reason: "value-point-value"
	},
	{
		match: "#Determiner [(half|quarter)] #Ordinal",
		group: 0,
		tag: "Value",
		reason: "half-ordinal"
	},
	{
		match: `#Multiple+ and #Value`,
		tag: "Value",
		reason: "magnitude-and-value"
	},
	{
		match: "#Value #Unit [(per|an) (hr|hour|sec|second|min|minute)]",
		group: 0,
		tag: "Unit",
		reason: "12-miles-per-second"
	},
	{
		match: "#Value [(square|cubic)] #Unit",
		group: 0,
		tag: "Unit",
		reason: "square-miles"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/person/person-phrase.js
var person_phrase_default = [
	{
		match: "#Copula [(#Noun|#PresentTense)] #LastName",
		group: 0,
		tag: "FirstName",
		reason: "copula-noun-lastname"
	},
	{
		match: "(sister|pope|brother|father|aunt|uncle|grandpa|grandfather|grandma) #ProperNoun",
		tag: "Person",
		reason: "lady-titlecase",
		safe: true
	},
	{
		match: "#FirstName [#Determiner #Noun] #LastName",
		group: 0,
		tag: "Person",
		reason: "first-noun-last"
	},
	{
		match: "#ProperNoun (b|c|d|e|f|g|h|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z) #ProperNoun",
		tag: "Person",
		reason: "titlecase-acronym-titlecase",
		safe: true
	},
	{
		match: "#Acronym #LastName",
		tag: "Person",
		reason: "acronym-lastname",
		safe: true
	},
	{
		match: "#Person (jr|sr|md)",
		tag: "Person",
		reason: "person-honorific"
	},
	{
		match: "#Honorific #Acronym",
		tag: "Person",
		reason: "Honorific-TitleCase"
	},
	{
		match: "#Person #Person the? #RomanNumeral",
		tag: "Person",
		reason: "roman-numeral"
	},
	{
		match: "#FirstName [/^[^aiurck]$/]",
		group: 0,
		tag: ["Acronym", "Person"],
		reason: "john-e"
	},
	{
		match: "#Noun van der? #Noun",
		tag: "Person",
		reason: "van der noun",
		safe: true
	},
	{
		match: "(king|queen|prince|saint|lady) of #Noun",
		tag: "Person",
		reason: "king-of-noun",
		safe: true
	},
	{
		match: "(prince|lady) #Place",
		tag: "Person",
		reason: "lady-place"
	},
	{
		match: "(king|queen|prince|saint) #ProperNoun",
		tag: "Person",
		notIf: "#Place",
		reason: "saint-foo"
	},
	{
		match: "al (#Person|#ProperNoun)",
		tag: "Person",
		reason: "al-borlen",
		safe: true
	},
	{
		match: "#FirstName de #Noun",
		tag: "Person",
		reason: "bill-de-noun"
	},
	{
		match: "#FirstName (bin|al) #Noun",
		tag: "Person",
		reason: "bill-al-noun"
	},
	{
		match: "#FirstName #Acronym #ProperNoun",
		tag: "Person",
		reason: "bill-acronym-title"
	},
	{
		match: "#FirstName #FirstName #ProperNoun",
		tag: "Person",
		reason: "bill-firstname-title"
	},
	{
		match: "#Honorific #FirstName? #ProperNoun",
		tag: "Person",
		reason: "dr-john-Title"
	},
	{
		match: "#FirstName the #Adjective",
		tag: "Person",
		reason: "name-the-great"
	},
	{
		match: "#ProperNoun (van|al|bin) #ProperNoun",
		tag: "Person",
		reason: "title-van-title",
		safe: true
	},
	{
		match: "#ProperNoun (de|du) la? #ProperNoun",
		tag: "Person",
		notIf: "#Place",
		reason: "title-de-title"
	},
	{
		match: "#Singular #Acronym #LastName",
		tag: "#FirstName #Person .",
		reason: "title-acro-noun",
		safe: true
	},
	{
		match: "[#ProperNoun] #Person",
		group: 0,
		tag: "Person",
		reason: "proper-person",
		safe: true
	},
	{
		match: "#Person [#ProperNoun #ProperNoun]",
		group: 0,
		tag: "Person",
		notIf: "#Possessive",
		reason: "three-name-person",
		safe: true
	},
	{
		match: "#FirstName #Acronym? [#ProperNoun]",
		group: 0,
		tag: "LastName",
		notIf: "#Possessive",
		reason: "firstname-titlecase"
	},
	{
		match: "#FirstName [#FirstName]",
		group: 0,
		tag: "LastName",
		reason: "firstname-firstname"
	},
	{
		match: "#FirstName #Acronym #Noun",
		tag: "Person",
		reason: "n-acro-noun",
		safe: true
	},
	{
		match: "#FirstName [(de|di|du|van|von)] #Person",
		group: 0,
		tag: "LastName",
		reason: "de-firstname"
	},
	{
		match: "[(lieutenant|corporal|sergeant|captain|qeen|king|admiral|major|colonel|marshal|president|queen|king)+] #ProperNoun",
		group: 0,
		tag: "Honorific",
		reason: "seargeant-john"
	},
	{
		match: "[(private|general|major|rear|prime|field|count|miss)] #Honorific? #Person",
		group: 0,
		tag: ["Honorific", "Person"],
		reason: "ambg-honorifics"
	},
	{
		match: "#Honorific #FirstName [#Singular]",
		group: 0,
		tag: "LastName",
		notIf: "#Possessive",
		reason: "dr-john-foo",
		safe: true
	},
	{
		match: "[(his|her) (majesty|honour|worship|excellency|honorable)] #Person",
		group: 0,
		tag: "Honorific",
		reason: "his-excellency"
	},
	{
		match: "#Honorific #Actor",
		tag: "Honorific",
		reason: "Lieutenant colonel"
	},
	{
		match: "(first|second|third|1st|2nd|3rd) #Actor",
		tag: "Honorific",
		reason: "first lady"
	},
	{
		match: "#Person #RomanNumeral",
		tag: "Person",
		reason: "louis-IV"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/person/ambig-name.js
var ambig_name_default = [
	{
		match: "#FirstName #Noun$",
		tag: ". #LastName",
		notIf: "(#Possessive|#Organization|#Place|#Pronoun|@hasTitleCase)",
		reason: "firstname-noun"
	},
	{
		match: "%Person|Date% #Acronym? #ProperNoun",
		tag: "Person",
		reason: "jan-thierson"
	},
	{
		match: "%Person|Noun% #Acronym? #ProperNoun",
		tag: "Person",
		reason: "switch-person",
		safe: true
	},
	{
		match: "%Person|Noun% #Organization",
		tag: "Organization",
		reason: "olive-garden"
	},
	{
		match: "%Person|Verb% #Acronym? #ProperNoun",
		tag: "Person",
		reason: "verb-propernoun",
		ifNo: "#Actor"
	},
	{
		match: `[%Person|Verb%] (will|had|has|said|says|told|did|learned|wants|wanted)`,
		group: 0,
		tag: "Person",
		reason: "person-said"
	},
	{
		match: `[%Person|Place%] (harbor|harbour|pier|town|city|place|dump|landfill)`,
		group: 0,
		tag: "Place",
		reason: "sydney-harbour"
	},
	{
		match: `(west|east|north|south) [%Person|Place%]`,
		group: 0,
		tag: "Place",
		reason: "east-sydney"
	},
	{
		match: `#Modal [%Person|Verb%]`,
		group: 0,
		tag: "Verb",
		reason: "would-mark"
	},
	{
		match: `#Adverb [%Person|Verb%]`,
		group: 0,
		tag: "Verb",
		reason: "really-mark"
	},
	{
		match: `[%Person|Verb%] (#Adverb|#Comparative)`,
		group: 0,
		tag: "Verb",
		reason: "drew-closer"
	},
	{
		match: `%Person|Verb% #Person`,
		tag: "Person",
		reason: "rob-smith"
	},
	{
		match: `%Person|Verb% #Acronym #ProperNoun`,
		tag: "Person",
		reason: "rob-a-smith"
	},
	{
		match: "[will] #Verb",
		group: 0,
		tag: "Modal",
		reason: "will-verb"
	},
	{
		match: "(will && @isTitleCase) #ProperNoun",
		tag: "Person",
		reason: "will-name"
	},
	{
		match: "(#FirstName && !#Possessive) [#Singular] #Verb",
		group: 0,
		safe: true,
		tag: "LastName",
		reason: "jack-layton"
	},
	{
		match: "^[#Singular] #Person #Verb",
		group: 0,
		safe: true,
		tag: "Person",
		reason: "sherwood-anderson"
	},
	{
		match: "(a|an) [#Person]$",
		group: 0,
		unTag: "Person",
		reason: "a-warhol"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/verbs/verbs.js
var verbs_default = [
	{
		match: "#Copula (pretty|dead|full|well|sure) (#Adjective|#Noun)",
		tag: "#Copula #Adverb #Adjective",
		reason: "sometimes-adverb"
	},
	{
		match: "(#Pronoun|#Person) (had|#Adverb)? [better] #PresentTense",
		group: 0,
		tag: "Modal",
		reason: "i-better"
	},
	{
		match: "(#Modal|i|they|we|do) not? [like]",
		group: 0,
		tag: "PresentTense",
		reason: "modal-like"
	},
	{
		match: "#Noun #Adverb? [left]",
		group: 0,
		tag: "PastTense",
		reason: "left-verb"
	},
	{
		match: "will #Adverb? not? #Adverb? [be] #Gerund",
		group: 0,
		tag: "Copula",
		reason: "will-be-copula"
	},
	{
		match: "will #Adverb? not? #Adverb? [be] #Adjective",
		group: 0,
		tag: "Copula",
		reason: "be-copula"
	},
	{
		match: "[march] (up|down|back|toward)",
		notIf: "#Date",
		group: 0,
		tag: "Infinitive",
		reason: "march-to"
	},
	{
		match: "#Modal [march]",
		group: 0,
		tag: "Infinitive",
		reason: "must-march"
	},
	{
		match: `[may] be`,
		group: 0,
		tag: "Verb",
		reason: "may-be"
	},
	{
		match: `[(subject|subjects|subjected)] to`,
		group: 0,
		tag: "Verb",
		reason: "subject to"
	},
	{
		match: `[home] to`,
		group: 0,
		tag: "PresentTense",
		reason: "home to"
	},
	{
		match: "[open] #Determiner",
		group: 0,
		tag: "Infinitive",
		reason: "open-the"
	},
	{
		match: `(were|was) being [#PresentTense]`,
		group: 0,
		tag: "PastTense",
		reason: "was-being"
	},
	{
		match: `(had|has|have) [been /en$/]`,
		group: 0,
		tag: "Auxiliary Participle",
		reason: "had-been-broken"
	},
	{
		match: `(had|has|have) [been /ed$/]`,
		group: 0,
		tag: "Auxiliary PastTense",
		reason: "had-been-smoked"
	},
	{
		match: `(had|has) #Adverb? [been] #Adverb? #PastTense`,
		group: 0,
		tag: "Auxiliary",
		reason: "had-been-adj"
	},
	{
		match: `(had|has) to [#Noun] (#Determiner|#Possessive)`,
		group: 0,
		tag: "Infinitive",
		reason: "had-to-noun"
	},
	{
		match: `have [#PresentTense]`,
		group: 0,
		tag: "PastTense",
		notIf: "(come|gotten)",
		reason: "have-read"
	},
	{
		match: `(does|will|#Modal) that [work]`,
		group: 0,
		tag: "PastTense",
		reason: "does-that-work"
	},
	{
		match: `[(sound|sounds)] #Adjective`,
		group: 0,
		tag: "PresentTense",
		reason: "sounds-fun"
	},
	{
		match: `[(look|looks)] #Adjective`,
		group: 0,
		tag: "PresentTense",
		reason: "looks-good"
	},
	{
		match: `[(start|starts|stop|stops|begin|begins)] #Gerund`,
		group: 0,
		tag: "Verb",
		reason: "starts-thinking"
	},
	{
		match: `(have|had) read`,
		tag: "Modal #PastTense",
		reason: "read-read"
	},
	{
		match: `(is|was|were) [(under|over) #PastTense]`,
		group: 0,
		tag: "Adverb Adjective",
		reason: "was-under-cooked"
	},
	{
		match: "[shit] (#Determiner|#Possessive|them)",
		group: 0,
		tag: "Verb",
		reason: "swear1-verb"
	},
	{
		match: "[damn] (#Determiner|#Possessive|them)",
		group: 0,
		tag: "Verb",
		reason: "swear2-verb"
	},
	{
		match: "[fuck] (#Determiner|#Possessive|them)",
		group: 0,
		tag: "Verb",
		reason: "swear3-verb"
	},
	{
		match: "#Plural that %Noun|Verb%",
		tag: ". #Preposition #Infinitive",
		reason: "jobs-that-work"
	},
	{
		match: "[works] for me",
		group: 0,
		tag: "PresentTense",
		reason: "works-for-me"
	},
	{
		match: "as #Pronoun [please]",
		group: 0,
		tag: "Infinitive",
		reason: "as-we-please"
	},
	{
		match: "[(co|mis|de|inter|intra|pre|re|un|out|under|over|counter)] #Verb",
		group: 0,
		tag: ["Verb", "Prefix"],
		notIf: "(#Copula|#PhrasalVerb)",
		reason: "co-write"
	},
	{
		match: "#PastTense and [%Adj|Past%]",
		group: 0,
		tag: "PastTense",
		reason: "dressed-and-left"
	},
	{
		match: "[%Adj|Past%] and #PastTense",
		group: 0,
		tag: "PastTense",
		reason: "dressed-and-left"
	},
	{
		match: "#Copula #Pronoun [%Adj|Past%]",
		group: 0,
		tag: "Adjective",
		reason: "is-he-stoked"
	},
	{
		match: "to [%Noun|Verb%] #Preposition",
		group: 0,
		tag: "Infinitive",
		reason: "to-dream-of"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/verbs/auxiliary.js
var auxiliary_default = [
	{
		match: `will (#Adverb|not)+? [have] (#Adverb|not)+? #Verb`,
		group: 0,
		tag: "Auxiliary",
		reason: "will-have-vb"
	},
	{
		match: `[#Copula] (#Adverb|not)+? (#Gerund|#PastTense)`,
		group: 0,
		tag: "Auxiliary",
		reason: "copula-walking"
	},
	{
		match: `[(#Modal|did)+] (#Adverb|not)+? #Verb`,
		group: 0,
		tag: "Auxiliary",
		reason: "modal-verb"
	},
	{
		match: `#Modal (#Adverb|not)+? [have] (#Adverb|not)+? [had] (#Adverb|not)+? #Verb`,
		group: 0,
		tag: "Auxiliary",
		reason: "would-have"
	},
	{
		match: `[(has|had)] (#Adverb|not)+? #PastTense`,
		group: 0,
		tag: "Auxiliary",
		reason: "had-walked"
	},
	{
		match: "[(do|does|did|will|have|had|has|got)] (not|#Adverb)+? #Verb",
		group: 0,
		tag: "Auxiliary",
		reason: "have-had"
	},
	{
		match: "[about to] #Adverb? #Verb",
		group: 0,
		tag: ["Auxiliary", "Verb"],
		reason: "about-to"
	},
	{
		match: `#Modal (#Adverb|not)+? [be] (#Adverb|not)+? #Verb`,
		group: 0,
		tag: "Auxiliary",
		reason: "would-be"
	},
	{
		match: `[(#Modal|had|has)] (#Adverb|not)+? [been] (#Adverb|not)+? #Verb`,
		group: 0,
		tag: "Auxiliary",
		reason: "had-been"
	},
	{
		match: "[(be|being|been)] #Participle",
		group: 0,
		tag: "Auxiliary",
		reason: "being-driven"
	},
	{
		match: "[may] #Adverb? #Infinitive",
		group: 0,
		tag: "Auxiliary",
		reason: "may-want"
	},
	{
		match: "#Copula (#Adverb|not)+? [(be|being|been)] #Adverb+? #PastTense",
		group: 0,
		tag: "Auxiliary",
		reason: "being-walked"
	},
	{
		match: "will [be] #PastTense",
		group: 0,
		tag: "Auxiliary",
		reason: "will-be-x"
	},
	{
		match: "[(be|been)] (#Adverb|not)+? #Gerund",
		group: 0,
		tag: "Auxiliary",
		reason: "been-walking"
	},
	{
		match: "[used to] #PresentTense",
		group: 0,
		tag: "Auxiliary",
		reason: "used-to-walk"
	},
	{
		match: "#Copula (#Adverb|not)+? [going to] #Adverb+? #PresentTense",
		group: 0,
		tag: "Auxiliary",
		reason: "going-to-walk"
	},
	{
		match: "#Imperative [(me|him|her)]",
		group: 0,
		tag: "Reflexive",
		reason: "tell-him"
	},
	{
		match: "(is|was) #Adverb? [no]",
		group: 0,
		tag: "Negative",
		reason: "is-no"
	},
	{
		match: "[(been|had|became|came)] #PastTense",
		group: 0,
		notIf: "#PhrasalVerb",
		tag: "Auxiliary",
		reason: "been-told"
	},
	{
		match: "[(being|having|getting)] #Verb",
		group: 0,
		tag: "Auxiliary",
		reason: "being-born"
	},
	{
		match: "[be] #Gerund",
		group: 0,
		tag: "Auxiliary",
		reason: "be-walking"
	},
	{
		match: "[better] #PresentTense",
		group: 0,
		tag: "Modal",
		notIf: "(#Copula|#Gerund)",
		reason: "better-go"
	},
	{
		match: "even better",
		tag: "Adverb #Comparative",
		reason: "even-better"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/verbs/phrasal.js
var phrasal_default = [
	{
		match: "(#Verb && @hasHyphen) up",
		tag: "PhrasalVerb",
		reason: "foo-up"
	},
	{
		match: "(#Verb && @hasHyphen) off",
		tag: "PhrasalVerb",
		reason: "foo-off"
	},
	{
		match: "(#Verb && @hasHyphen) over",
		tag: "PhrasalVerb",
		reason: "foo-over"
	},
	{
		match: "(#Verb && @hasHyphen) out",
		tag: "PhrasalVerb",
		reason: "foo-out"
	},
	{
		match: "[#Verb (in|out|up|down|off|back)] (on|in)",
		notIf: "#Copula",
		tag: "PhrasalVerb Particle",
		reason: "walk-in-on"
	},
	{
		match: "(lived|went|crept|go) [on] for",
		group: 0,
		tag: "PhrasalVerb",
		reason: "went-on"
	},
	{
		match: "#Verb (up|down|in|on|for)$",
		tag: "PhrasalVerb #Particle",
		notIf: "#PhrasalVerb",
		reason: "come-down$"
	},
	{
		match: "help [(stop|end|make|start)]",
		group: 0,
		tag: "Infinitive",
		reason: "help-stop"
	},
	{
		match: "#PhrasalVerb (in && #Particle) #Determiner",
		tag: "#Verb #Preposition #Determiner",
		unTag: "PhrasalVerb",
		reason: "work-in-the"
	},
	{
		match: "[(stop|start|finish|help)] #Gerund",
		group: 0,
		tag: "Infinitive",
		reason: "start-listening"
	},
	{
		match: "#Verb (him|her|it|us|himself|herself|itself|everything|something) [(up|down)]",
		group: 0,
		tag: "Adverb",
		reason: "phrasal-pronoun-advb"
	}
];
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/model/verbs/imperative.js
var notIf = "(i|we|they)";
var imperative_default = [
	{
		match: "^do not? [#Infinitive #Particle?]",
		notIf,
		group: 0,
		tag: "Imperative",
		reason: "do-eat"
	},
	{
		match: "^please do? not? [#Infinitive #Particle?]",
		group: 0,
		tag: "Imperative",
		reason: "please-go"
	},
	{
		match: "^just do? not? [#Infinitive #Particle?]",
		group: 0,
		tag: "Imperative",
		reason: "just-go"
	},
	{
		match: "^[#Infinitive] it #Comparative",
		notIf,
		group: 0,
		tag: "Imperative",
		reason: "do-it-better"
	},
	{
		match: "^[#Infinitive] it (please|now|again|plz)",
		notIf,
		group: 0,
		tag: "Imperative",
		reason: "do-it-please"
	},
	{
		match: "^[#Infinitive] (#Adjective|#Adverb)$",
		group: 0,
		tag: "Imperative",
		notIf: "(so|such|rather|enough)",
		reason: "go-quickly"
	},
	{
		match: "^[#Infinitive] (up|down|over) #Determiner",
		group: 0,
		tag: "Imperative",
		reason: "turn-down"
	},
	{
		match: "^[#Infinitive] (your|my|the|a|an|any|each|every|some|more|with|on)",
		group: 0,
		notIf: "like",
		tag: "Imperative",
		reason: "eat-my-shorts"
	},
	{
		match: "^[#Infinitive] (him|her|it|us|me|there)",
		group: 0,
		tag: "Imperative",
		reason: "tell-him"
	},
	{
		match: "^[#Infinitive] #Adjective #Noun$",
		group: 0,
		tag: "Imperative",
		reason: "avoid-loud-noises"
	},
	{
		match: "^[#Infinitive] (#Adjective|#Adverb)? and #Infinitive",
		group: 0,
		tag: "Imperative",
		reason: "call-and-reserve"
	},
	{
		match: "^(go|stop|wait|hurry) please?$",
		tag: "Imperative",
		reason: "go"
	},
	{
		match: "^(somebody|everybody) [#Infinitive]",
		group: 0,
		tag: "Imperative",
		reason: "somebody-call"
	},
	{
		match: "^let (us|me) [#Infinitive]",
		group: 0,
		tag: "Imperative",
		reason: "lets-leave"
	},
	{
		match: "^[(shut|close|open|start|stop|end|keep)] #Determiner #Noun",
		group: 0,
		tag: "Imperative",
		reason: "shut-the-door"
	},
	{
		match: "^[#PhrasalVerb #Particle] #Determiner #Noun",
		group: 0,
		tag: "Imperative",
		reason: "turn-off-the-light"
	},
	{
		match: "^[go] to .",
		group: 0,
		tag: "Imperative",
		reason: "go-to-toronto"
	},
	{
		match: "^#Modal you [#Infinitive]",
		group: 0,
		tag: "Imperative",
		reason: "would-you-"
	},
	{
		match: "^never [#Infinitive]",
		group: 0,
		tag: "Imperative",
		reason: "never-stop"
	},
	{
		match: "^come #Infinitive",
		tag: "Imperative",
		notIf: "on",
		reason: "come-have"
	},
	{
		match: "^come and? #Infinitive",
		tag: "Imperative . Imperative",
		notIf: "#PhrasalVerb",
		reason: "come-and-have"
	},
	{
		match: "^stay (out|away|back)",
		tag: "Imperative",
		reason: "stay-away"
	},
	{
		match: "^[(stay|be|keep)] #Adjective",
		group: 0,
		tag: "Imperative",
		reason: "stay-cool"
	},
	{
		match: "^[keep it] #Adjective",
		group: 0,
		tag: "Imperative",
		reason: "keep-it-cool"
	},
	{
		match: "^do not [#Infinitive]",
		group: 0,
		tag: "Imperative",
		reason: "do-not-be"
	},
	{
		match: "[#Infinitive] (yourself|yourselves)",
		group: 0,
		tag: "Imperative",
		reason: "allow-yourself"
	},
	{
		match: "[#Infinitive] what .",
		group: 0,
		tag: "Imperative",
		reason: "look-what"
	},
	{
		match: "^[#Infinitive] #Gerund",
		group: 0,
		tag: "Imperative",
		reason: "keep-playing"
	},
	{
		match: "^[#Infinitive] (to|for|into|toward|here|there)",
		group: 0,
		tag: "Imperative",
		reason: "go-to"
	},
	{
		match: "^[#Infinitive] (and|or) #Infinitive",
		group: 0,
		tag: "Imperative",
		reason: "inf-and-inf"
	},
	{
		match: "^[%Noun|Verb%] to",
		group: 0,
		tag: "Imperative",
		reason: "commit-to"
	},
	{
		match: "^[#Infinitive] #Adjective? #Singular #Singular",
		group: 0,
		tag: "Imperative",
		reason: "maintain-eye-contact"
	},
	{
		match: "do not (forget|omit|neglect) to [#Infinitive]",
		group: 0,
		tag: "Imperative",
		reason: "do-not-forget"
	},
	{
		match: "^[(ask|wear|pay|look|help|show|watch|act|fix|kill|stop|start|turn|try|win)] #Noun",
		group: 0,
		tag: "Imperative",
		reason: "pay-attention"
	}
];
var model_default = { two: { matches: [].concat([
	{
		match: "(got|were|was|is|are|am) (#PastTense|#Participle)",
		tag: "Passive",
		reason: "got-walked"
	},
	{
		match: "(was|were|is|are|am) being (#PastTense|#Participle)",
		tag: "Passive",
		reason: "was-being"
	},
	{
		match: "(had|have|has) been (#PastTense|#Participle)",
		tag: "Passive",
		reason: "had-been"
	},
	{
		match: "will be being? (#PastTense|#Participle)",
		tag: "Passive",
		reason: "will-be-cleaned"
	},
	{
		match: "#Noun [(#PastTense|#Participle)] by (the|a) #Noun",
		group: 0,
		tag: "Passive",
		reason: "suffered-by"
	}
], adjective_default, adj_adverb_default, adj_gerund_default$1, adj_noun_default, adverb_default, date_default, date_phrase_default, nouns_default, noun_gerund_default, verb_noun_default, money_default, fractions_default, numbers_default, person_phrase_default, ambig_name_default, verbs_default, adj_verb_default, auxiliary_default, phrasal_default, imperative_default, [{
	match: "(that|which) were [%Adj|Gerund%]",
	group: 0,
	tag: "Gerund",
	reason: "that-were-growing"
}, {
	match: "#Gerund [#Gerund] #Plural",
	group: 0,
	tag: "Adjective",
	reason: "hard-working-fam"
}], [
	{
		match: "u r",
		tag: "#Pronoun #Copula",
		reason: "u r"
	},
	{
		match: "#Noun [(who|whom)]",
		group: 0,
		tag: "Determiner",
		reason: "captain-who"
	},
	{
		match: "[had] #Noun+ #PastTense",
		group: 0,
		tag: "Condition",
		reason: "had-he"
	},
	{
		match: "[were] #Noun+ to #Infinitive",
		group: 0,
		tag: "Condition",
		reason: "were-he"
	},
	{
		match: "some sort of",
		tag: "Adjective Noun Conjunction",
		reason: "some-sort-of"
	},
	{
		match: "of some sort",
		tag: "Conjunction Adjective Noun",
		reason: "of-some-sort"
	},
	{
		match: "[such] (a|an|is)? #Noun",
		group: 0,
		tag: "Determiner",
		reason: "such-skill"
	},
	{
		match: "[right] (before|after|in|into|to|toward)",
		group: 0,
		tag: "#Adverb",
		reason: "right-into"
	},
	{
		match: "#Preposition [about]",
		group: 0,
		tag: "Adjective",
		reason: "at-about"
	},
	{
		match: "(are|#Modal|see|do|for) [ya]",
		group: 0,
		tag: "Pronoun",
		reason: "are-ya"
	},
	{
		match: "[long live] .",
		group: 0,
		tag: "#Adjective #Infinitive",
		reason: "long-live"
	},
	{
		match: "[plenty] of",
		group: 0,
		tag: "#Uncountable",
		reason: "plenty-of"
	},
	{
		match: "(always|nearly|barely|practically) [there]",
		group: 0,
		tag: "Adjective",
		reason: "always-there"
	},
	{
		match: "[there] (#Adverb|#Pronoun)? #Copula",
		group: 0,
		tag: "There",
		reason: "there-is"
	},
	{
		match: "#Copula [there] .",
		group: 0,
		tag: "There",
		reason: "is-there"
	},
	{
		match: "#Modal #Adverb? [there]",
		group: 0,
		tag: "There",
		reason: "should-there"
	},
	{
		match: "^[do] (you|we|they)",
		group: 0,
		tag: "QuestionWord",
		reason: "do-you"
	},
	{
		match: "^[does] (he|she|it|#ProperNoun)",
		group: 0,
		tag: "QuestionWord",
		reason: "does-he"
	},
	{
		match: "#Determiner #Noun+ [who] #Verb",
		group: 0,
		tag: "Preposition",
		reason: "the-x-who"
	},
	{
		match: "#Determiner #Noun+ [which] #Verb",
		group: 0,
		tag: "Preposition",
		reason: "the-x-which"
	},
	{
		match: "a [while]",
		group: 0,
		tag: "Noun",
		reason: "a-while"
	},
	{
		match: "guess who",
		tag: "#Infinitive #QuestionWord",
		reason: "guess-who"
	},
	{
		match: "[fucking] !#Verb",
		group: 0,
		tag: "#Gerund",
		reason: "f-as-gerund"
	}
], [
	{
		match: "university of #Place",
		tag: "Organization",
		reason: "university-of-Foo"
	},
	{
		match: "#Noun (&|n) #Noun",
		tag: "Organization",
		reason: "Noun-&-Noun"
	},
	{
		match: "#Organization of the? #ProperNoun",
		tag: "Organization",
		reason: "org-of-place",
		safe: true
	},
	{
		match: "#Organization #Country",
		tag: "Organization",
		reason: "org-country"
	},
	{
		match: "#ProperNoun #Organization",
		tag: "Organization",
		notIf: "#FirstName",
		reason: "titlecase-org"
	},
	{
		match: "#ProperNoun (ltd|co|inc|dept|assn|bros)",
		tag: "Organization",
		reason: "org-abbrv"
	},
	{
		match: "the [#Acronym]",
		group: 0,
		tag: "Organization",
		reason: "the-acronym",
		safe: true
	},
	{
		match: "government of the? [#Place+]",
		tag: "Organization",
		reason: "government-of-x"
	},
	{
		match: "(health|school|commerce) board",
		tag: "Organization",
		reason: "school-board"
	},
	{
		match: "(nominating|special|conference|executive|steering|central|congressional) committee",
		tag: "Organization",
		reason: "special-comittee"
	},
	{
		match: "(world|global|international|national|#Demonym) #Organization",
		tag: "Organization",
		reason: "global-org"
	},
	{
		match: "#Noun+ (public|private) school",
		tag: "School",
		reason: "noun-public-school"
	},
	{
		match: "#Place+ #SportsTeam",
		tag: "SportsTeam",
		reason: "place-sportsteam"
	},
	{
		match: "(dc|atlanta|minnesota|manchester|newcastle|sheffield) united",
		tag: "SportsTeam",
		reason: "united-sportsteam"
	},
	{
		match: "#Place+ fc",
		tag: "SportsTeam",
		reason: "fc-sportsteam"
	},
	{
		match: "#Place+ #Noun{0,2} (club|society|group|team|committee|commission|association|guild|crew)",
		tag: "Organization",
		reason: "place-noun-society"
	}
], [
	{
		match: "(west|north|south|east|western|northern|southern|eastern)+ #Place",
		tag: "Region",
		reason: "west-norfolk"
	},
	{
		match: "#City [(al|ak|az|ar|ca|ct|dc|fl|ga|id|il|nv|nh|nj|ny|oh|pa|sc|tn|tx|ut|vt|pr)]",
		group: 0,
		tag: "Region",
		reason: "us-state"
	},
	{
		match: "portland [or]",
		group: 0,
		tag: "Region",
		reason: "portland-or"
	},
	{
		match: "#ProperNoun+ (cliff|place|range|pit|place|point|room|grounds|ruins)",
		tag: "Place",
		reason: "foo-point"
	},
	{
		match: "in [#ProperNoun] #Place",
		group: 0,
		tag: "Place",
		reason: "propernoun-place"
	},
	{
		match: "#Value #Noun (st|street|rd|road|crescent|cr|way|tr|terrace|avenue|ave)",
		tag: "Address",
		reason: "address-st"
	},
	{
		match: "(port|mount|mt) #ProperName",
		tag: "Place",
		reason: "port-name"
	}
], [
	{
		match: "[so] #Noun",
		group: 0,
		tag: "Conjunction",
		reason: "so-conj"
	},
	{
		match: "[(who|what|where|why|how|when)] #Noun #Copula #Adverb? (#Verb|#Adjective)",
		group: 0,
		tag: "Conjunction",
		reason: "how-he-is-x"
	},
	{
		match: "#Copula [(who|what|where|why|how|when)] #Noun",
		group: 0,
		tag: "Conjunction",
		reason: "when-he"
	},
	{
		match: "#Verb [that] #Pronoun",
		group: 0,
		tag: "Conjunction",
		reason: "said-that-he"
	},
	{
		match: "#Noun [that] #Copula",
		group: 0,
		tag: "Conjunction",
		reason: "that-are"
	},
	{
		match: "#Noun [that] #Verb #Adjective",
		group: 0,
		tag: "Conjunction",
		reason: "that-seem"
	},
	{
		match: "#Noun #Copula not? [that] #Adjective",
		group: 0,
		tag: "Adverb",
		reason: "that-adj"
	},
	{
		match: "#Verb #Adverb? #Noun [(that|which)]",
		group: 0,
		tag: "Preposition",
		reason: "that-prep"
	},
	{
		match: "@hasComma [which] (#Pronoun|#Verb)",
		group: 0,
		tag: "Preposition",
		reason: "which-copula"
	},
	{
		match: "#Noun [like] #Noun",
		group: 0,
		tag: "Preposition",
		reason: "noun-like"
	},
	{
		match: "^[like] #Determiner",
		group: 0,
		tag: "Preposition",
		reason: "like-the"
	},
	{
		match: "a #Noun [like] (#Noun|#Determiner)",
		group: 0,
		tag: "Preposition",
		reason: "a-noun-like"
	},
	{
		match: "#Adverb [like]",
		group: 0,
		tag: "Verb",
		reason: "really-like"
	},
	{
		match: "(not|nothing|never) [like]",
		group: 0,
		tag: "Preposition",
		reason: "nothing-like"
	},
	{
		match: "#Infinitive #Pronoun [like]",
		group: 0,
		tag: "Preposition",
		reason: "treat-them-like"
	},
	{
		match: "[#QuestionWord] (#Pronoun|#Determiner)",
		group: 0,
		tag: "Preposition",
		reason: "how-he"
	},
	{
		match: "[#QuestionWord] #Participle",
		group: 0,
		tag: "Preposition",
		reason: "when-stolen"
	},
	{
		match: "[how] (#Determiner|#Copula|#Modal|#PastTense)",
		group: 0,
		tag: "QuestionWord",
		reason: "how-is"
	},
	{
		match: "#Plural [(who|which|when)] .",
		group: 0,
		tag: "Preposition",
		reason: "people-who"
	}
], [
	{
		match: "holy (shit|fuck|hell)",
		tag: "Expression",
		reason: "swears-expression"
	},
	{
		match: "^[(well|so|okay|now)] !#Adjective?",
		group: 0,
		tag: "Expression",
		reason: "well-"
	},
	{
		match: "^come on",
		tag: "Expression",
		reason: "come-on"
	},
	{
		match: "(say|says|said) [sorry]",
		group: 0,
		tag: "Expression",
		reason: "say-sorry"
	},
	{
		match: "^(ok|alright|shoot|hell|anyways)",
		tag: "Expression",
		reason: "ok-"
	},
	{
		match: "^(say && @hasComma)",
		tag: "Expression",
		reason: "say-"
	},
	{
		match: "^(like && @hasComma)",
		tag: "Expression",
		reason: "like-"
	},
	{
		match: "^[(dude|man|girl)] #Pronoun",
		group: 0,
		tag: "Expression",
		reason: "dude-i"
	}
]) } };
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/compute/index.js
var net$1 = null;
var postTagger = function(view) {
	const { world } = view;
	const { model, methods } = world;
	net$1 = net$1 || methods.one.buildNet(model.two.matches, world);
	const ptrs = methods.two.quickSplit(view.document).map((terms) => {
		const t = terms[0];
		return [
			t.index[0],
			t.index[1],
			t.index[1] + terms.length
		];
	});
	const m = view.update(ptrs);
	m.cache();
	m.sweep(net$1);
	view.uncache();
	view.unfreeze();
	return view;
};
var tagger = (view) => view.compute([
	"freeze",
	"lexicon",
	"preTagger",
	"postTagger",
	"unfreeze"
]);
var compute_default$1 = {
	postTagger,
	tagger
};
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/api.js
var round$1 = (n) => Math.round(n * 100) / 100;
function api_default$1(View) {
	View.prototype.confidence = function() {
		let sum = 0;
		let count = 0;
		this.docs.forEach((terms) => {
			terms.forEach((term) => {
				count += 1;
				sum += term.confidence || 1;
			});
		});
		if (count === 0) return 1;
		return round$1(sum / count);
	};
	View.prototype.tagger = function() {
		return this.compute(["tagger"]);
	};
}
//#endregion
//#region node_modules/compromise/src/2-two/postTagger/plugin.js
var plugin$2 = {
	api: api_default$1,
	compute: compute_default$1,
	model: model_default,
	hooks: ["postTagger"]
};
//#endregion
//#region node_modules/compromise/src/2-two/lazy/maybeMatch.js
var getWords = function(net) {
	return Object.keys(net.hooks).filter((w) => !w.startsWith("#") && !w.startsWith("%"));
};
var maybeMatch = function(doc, net) {
	const words = getWords(net);
	if (words.length === 0) return doc;
	if (!doc._cache) doc.cache();
	const cache = doc._cache;
	return doc.filter((_m, i) => {
		return words.some((str) => cache[i].has(str));
	});
};
//#endregion
//#region node_modules/compromise/src/2-two/lazy/lazyParse.js
var lazyParse = function(input, reg) {
	let net = reg;
	if (typeof reg === "string") net = this.buildNet([{ match: reg }]);
	const doc = this.tokenize(input);
	const m = maybeMatch(doc, net);
	if (m.found) {
		m.compute(["index", "tagger"]);
		return m.match(reg);
	}
	return doc.none();
};
//#endregion
//#region node_modules/compromise/src/2-two/lazy/plugin.js
var plugin_default$12 = { lib: { lazy: lazyParse } };
//#endregion
//#region node_modules/compromise/src/2-two/swap/api/swap-verb.js
var matchVerb = function(m, lemma) {
	const conjugate = m.methods.two.transform.verb.conjugate;
	const all = conjugate(lemma, m.model);
	if (m.has("#Gerund")) return all.Gerund;
	if (m.has("#PastTense")) return all.PastTense;
	if (m.has("#PresentTense")) return all.PresentTense;
	if (m.has("#Gerund")) return all.Gerund;
	return lemma;
};
var swapVerb = function(vb, lemma) {
	let str = lemma;
	vb.forEach((m) => {
		if (!m.has("#Infinitive")) str = matchVerb(m, lemma);
		m.replaceWith(str);
	});
	return vb;
};
//#endregion
//#region node_modules/compromise/src/2-two/swap/api/swap.js
var swapNoun = function(m, lemma) {
	let str = lemma;
	if (m.has("#Plural")) {
		const toPlural = m.methods.two.transform.noun.toPlural;
		str = toPlural(lemma, m.model);
	}
	m.replaceWith(str, { possessives: true });
};
var swapAdverb = function(m, lemma) {
	const { toAdverb } = m.methods.two.transform.adjective;
	const adv = toAdverb(lemma);
	if (adv) m.replaceWith(adv);
};
var swapAdjective = function(m, lemma) {
	const { toComparative, toSuperlative } = m.methods.two.transform.adjective;
	let str = lemma;
	if (m.has("#Comparative")) str = toComparative(str, m.model);
	else if (m.has("#Superlative")) str = toSuperlative(str, m.model);
	if (str) m.replaceWith(str);
};
var swap = function(from, to, tag) {
	let reg = from.split(/ /g).map((str) => str.toLowerCase().trim());
	reg = reg.filter((str) => str);
	reg = reg.map((str) => `{${str}}`).join(" ");
	let m = this.match(reg);
	if (tag) m = m.if(tag);
	if (m.has("#Verb")) return swapVerb(m, to);
	if (m.has("#Noun")) return swapNoun(m, to);
	if (m.has("#Adverb")) return swapAdverb(m, to);
	if (m.has("#Adjective")) return swapAdjective(m, to);
	return this;
};
//#endregion
//#region node_modules/compromise/src/2-two/swap/plugin.js
var api$16 = function(View) {
	View.prototype.swap = swap;
};
var plugin_default$11 = { api: api$16 };
//#endregion
//#region node_modules/compromise/src/two.js
one_default.plugin(plugin_default$14);
one_default.plugin(plugin_default$13);
one_default.plugin(plugin$2);
one_default.plugin(plugin_default$12);
one_default.plugin(plugin_default$11);
var two_default = one_default;
//#endregion
//#region node_modules/compromise/src/3-three/adjectives/plugin.js
var toRoot$1 = function(adj) {
	const { fromComparative, fromSuperlative } = adj.methods.two.transform.adjective;
	const str = adj.text("normal");
	if (adj.has("#Comparative")) return fromComparative(str, adj.model);
	if (adj.has("#Superlative")) return fromSuperlative(str, adj.model);
	return str;
};
var api$15 = function(View) {
	class Adjectives extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Adjectives";
		}
		json(opts = {}) {
			const { toAdverb, toNoun, toSuperlative, toComparative } = this.methods.two.transform.adjective;
			opts.normal = true;
			return this.map((m) => {
				const json = m.toView().json(opts)[0] || {};
				const str = toRoot$1(m);
				json.adjective = {
					adverb: toAdverb(str, this.model),
					noun: toNoun(str, this.model),
					superlative: toSuperlative(str, this.model),
					comparative: toComparative(str, this.model)
				};
				return json;
			}, []);
		}
		adverbs() {
			return this.before("#Adverb+$").concat(this.after("^#Adverb+"));
		}
		conjugate(n) {
			const { toComparative, toSuperlative, toNoun, toAdverb } = this.methods.two.transform.adjective;
			return this.getNth(n).map((adj) => {
				const root = toRoot$1(adj);
				return {
					Adjective: root,
					Comparative: toComparative(root, this.model),
					Superlative: toSuperlative(root, this.model),
					Noun: toNoun(root, this.model),
					Adverb: toAdverb(root, this.model)
				};
			}, []);
		}
		toComparative(n) {
			const { toComparative } = this.methods.two.transform.adjective;
			return this.getNth(n).map((adj) => {
				const root = toRoot$1(adj);
				const str = toComparative(root, this.model);
				return adj.replaceWith(str);
			});
		}
		toSuperlative(n) {
			const { toSuperlative } = this.methods.two.transform.adjective;
			return this.getNth(n).map((adj) => {
				const root = toRoot$1(adj);
				const str = toSuperlative(root, this.model);
				return adj.replaceWith(str);
			});
		}
		toAdverb(n) {
			const { toAdverb } = this.methods.two.transform.adjective;
			return this.getNth(n).map((adj) => {
				const root = toRoot$1(adj);
				const str = toAdverb(root, this.model);
				return adj.replaceWith(str);
			});
		}
		toNoun(n) {
			const { toNoun } = this.methods.two.transform.adjective;
			return this.getNth(n).map((adj) => {
				const root = toRoot$1(adj);
				const str = toNoun(root, this.model);
				return adj.replaceWith(str);
			});
		}
	}
	View.prototype.adjectives = function(n) {
		let m = this.match("#Adjective");
		m = m.getNth(n);
		return new Adjectives(m.document, m.pointer);
	};
	View.prototype.superlatives = function(n) {
		let m = this.match("#Superlative");
		m = m.getNth(n);
		return new Adjectives(m.document, m.pointer);
	};
	View.prototype.comparatives = function(n) {
		let m = this.match("#Comparative");
		m = m.getNth(n);
		return new Adjectives(m.document, m.pointer);
	};
};
var plugin_default$10 = { api: api$15 };
//#endregion
//#region node_modules/compromise/src/3-three/adverbs/plugin.js
var toRoot = function(adj) {
	return adj.compute("root").text("root");
};
var api$14 = function(View) {
	class Adverbs extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Adverbs";
		}
		conjugate(n) {
			return this.getNth(n).map((adv) => {
				const adj = toRoot(adv);
				return {
					Adverb: adv.text("normal"),
					Adjective: adj
				};
			}, []);
		}
		json(opts = {}) {
			const fromAdverb = this.methods.two.transform.adjective.fromAdverb;
			opts.normal = true;
			return this.map((m) => {
				const json = m.toView().json(opts)[0] || {};
				json.adverb = { adjective: fromAdverb(json.normal) };
				return json;
			}, []);
		}
	}
	View.prototype.adverbs = function(n) {
		let m = this.match("#Adverb");
		m = m.getNth(n);
		return new Adverbs(m.document, m.pointer);
	};
};
var plugin_default$9 = { api: api$14 };
//#endregion
//#region node_modules/compromise/src/3-three/chunker/api/clauses.js
var byComma = function(doc) {
	let commas = doc.match("@hasComma");
	commas = commas.filter((m) => {
		if (m.growLeft(".").wordCount() === 1) return false;
		if (m.growRight(". .").wordCount() === 1) return false;
		let more = m.grow(".");
		more = more.ifNo("@hasComma @hasComma");
		more = more.ifNo("@hasComma (and|or) .");
		more = more.ifNo("(#City && @hasComma) #Country");
		more = more.ifNo("(#WeekDay && @hasComma) #Date");
		more = more.ifNo("(#Date+ && @hasComma) #Value");
		more = more.ifNo("(#Adjective && @hasComma) #Adjective");
		return more.found;
	});
	return doc.splitAfter(commas);
};
var splitParentheses = function(doc) {
	let matches = doc.parentheses();
	matches = matches.filter((m) => {
		return m.wordCount() >= 3 && m.has("#Verb") && m.has("#Noun");
	});
	return doc.splitOn(matches);
};
var splitQuotes = function(doc) {
	let matches = doc.quotations();
	matches = matches.filter((m) => {
		return m.wordCount() >= 3 && m.has("#Verb") && m.has("#Noun");
	});
	return doc.splitOn(matches);
};
var clauses = function(n) {
	let found = this;
	found = splitParentheses(found);
	found = splitQuotes(found);
	found = byComma(found);
	found = found.splitAfter("(@hasEllipses|@hasSemicolon|@hasDash|@hasColon)");
	found = found.splitAfter("^#Pronoun (said|says)");
	found = found.splitBefore("(said|says) #ProperNoun$");
	found = found.splitBefore(". . if .{4}");
	found = found.splitBefore("and while");
	found = found.splitBefore("now that");
	found = found.splitBefore("ever since");
	found = found.splitBefore("(supposing|although)");
	found = found.splitBefore("even (while|if|though)");
	found = found.splitBefore("(whereas|whose)");
	found = found.splitBefore("as (though|if)");
	found = found.splitBefore("(til|until)");
	const m = found.match("#Verb .* [but] .* #Verb", 0);
	if (m.found) found = found.splitBefore(m);
	const condition = found.if("if .{2,9} then .").match("then");
	found = found.splitBefore(condition);
	if (typeof n === "number") found = found.get(n);
	return found;
};
//#endregion
//#region node_modules/compromise/src/3-three/chunker/api/chunks.js
var chunks = function(doc) {
	const all = [];
	let lastOne = null;
	doc.clauses().docs.forEach((terms) => {
		terms.forEach((term) => {
			if (!term.chunk || term.chunk !== lastOne) {
				lastOne = term.chunk;
				all.push([
					term.index[0],
					term.index[1],
					term.index[1] + 1
				]);
			} else all[all.length - 1][2] = term.index[1] + 1;
		});
		lastOne = null;
	});
	return doc.update(all);
};
//#endregion
//#region node_modules/compromise/src/3-three/chunker/api/api.js
var api$13 = function(View) {
	class Chunks extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Chunks";
		}
		isVerb() {
			return this.filter((c) => c.has("<Verb>"));
		}
		isNoun() {
			return this.filter((c) => c.has("<Noun>"));
		}
		isAdjective() {
			return this.filter((c) => c.has("<Adjective>"));
		}
		isPivot() {
			return this.filter((c) => c.has("<Pivot>"));
		}
		debug() {
			this.toView().debug("chunks");
			return this;
		}
		update(pointer) {
			const m = new Chunks(this.document, pointer);
			m._cache = this._cache;
			return m;
		}
	}
	View.prototype.chunks = function(n) {
		let m = chunks(this);
		m = m.getNth(n);
		return new Chunks(this.document, m.pointer);
	};
	View.prototype.clauses = clauses;
};
//#endregion
//#region node_modules/compromise/src/3-three/chunker/compute/01-easy.js
var byWord = {
	this: "Noun",
	then: "Pivot"
};
var easyMode = function(document) {
	for (let n = 0; n < document.length; n += 1) for (let t = 0; t < document[n].length; t += 1) {
		const term = document[n][t];
		if (byWord.hasOwnProperty(term.normal) === true) {
			term.chunk = byWord[term.normal];
			continue;
		}
		if (term.tags.has("Verb")) {
			term.chunk = "Verb";
			continue;
		}
		if (term.tags.has("Noun") || term.tags.has("Determiner")) {
			term.chunk = "Noun";
			continue;
		}
		if (term.tags.has("Value")) {
			term.chunk = "Noun";
			continue;
		}
		if (term.tags.has("QuestionWord")) {
			term.chunk = "Pivot";
			continue;
		}
	}
};
//#endregion
//#region node_modules/compromise/src/3-three/chunker/compute/02-neighbours.js
var byNeighbour = function(document) {
	for (let n = 0; n < document.length; n += 1) for (let t = 0; t < document[n].length; t += 1) {
		const term = document[n][t];
		if (term.chunk) continue;
		const onRight = document[n][t + 1];
		const onLeft = document[n][t - 1];
		if (term.tags.has("Adjective")) {
			if (onLeft && onLeft.tags.has("Copula")) {
				term.chunk = "Adjective";
				continue;
			}
			if (onLeft && onLeft.tags.has("Determiner")) {
				term.chunk = "Noun";
				continue;
			}
			if (onRight && onRight.tags.has("Noun")) {
				term.chunk = "Noun";
				continue;
			}
			continue;
		}
		if (term.tags.has("Adverb") || term.tags.has("Negative")) {
			if (onLeft && onLeft.tags.has("Adjective")) {
				term.chunk = "Adjective";
				continue;
			}
			if (onLeft && onLeft.tags.has("Verb")) {
				term.chunk = "Verb";
				continue;
			}
			if (onRight && onRight.tags.has("Adjective")) {
				term.chunk = "Adjective";
				continue;
			}
			if (onRight && onRight.tags.has("Verb")) {
				term.chunk = "Verb";
				continue;
			}
		}
	}
};
//#endregion
//#region node_modules/compromise/src/3-three/chunker/compute/03-matcher.js
var rules = [
	{
		match: "[that] #Determiner #Noun",
		group: 0,
		chunk: "Pivot"
	},
	{
		match: "#PastTense [that]",
		group: 0,
		chunk: "Pivot"
	},
	{
		match: "[so] #Determiner",
		group: 0,
		chunk: "Pivot"
	},
	{
		match: "#Copula #Adverb+? [#Adjective]",
		group: 0,
		chunk: "Adjective"
	},
	{
		match: "#Adjective and #Adjective",
		chunk: "Adjective"
	},
	{
		match: "#Adverb+ and #Adverb #Verb",
		chunk: "Verb"
	},
	{
		match: "#Gerund #Adjective$",
		chunk: "Verb"
	},
	{
		match: "#Gerund to #Verb",
		chunk: "Verb"
	},
	{
		match: "#PresentTense and #PresentTense",
		chunk: "Verb"
	},
	{
		match: "#Adverb #Negative",
		chunk: "Verb"
	},
	{
		match: "(want|wants|wanted) to #Infinitive",
		chunk: "Verb"
	},
	{
		match: "#Verb #Reflexive",
		chunk: "Verb"
	},
	{
		match: "#Verb [to] #Adverb? #Infinitive",
		group: 0,
		chunk: "Verb"
	},
	{
		match: "[#Preposition] #Gerund",
		group: 0,
		chunk: "Verb"
	},
	{
		match: "#Infinitive [that] <Noun>",
		group: 0,
		chunk: "Verb"
	},
	{
		match: "#Noun of #Determiner? #Noun",
		chunk: "Noun"
	},
	{
		match: "#Value+ #Adverb? #Adjective",
		chunk: "Noun"
	},
	{
		match: "the [#Adjective] #Noun",
		chunk: "Noun"
	},
	{
		match: "#Singular in #Determiner? #Singular",
		chunk: "Noun"
	},
	{
		match: "#Plural [in] #Determiner? #Noun",
		group: 0,
		chunk: "Pivot"
	},
	{
		match: "#Noun and #Determiner? #Noun",
		notIf: "(#Possessive|#Pronoun)",
		chunk: "Noun"
	}
];
var net = null;
var matcher = function(view, _, world) {
	const { methods } = world;
	net = net || methods.one.buildNet(rules, world);
	view.sweep(net);
};
//#endregion
//#region node_modules/compromise/src/3-three/chunker/compute/04-fallback.js
var setChunk = function(term, chunk) {
	if ((typeof process === "undefined" || !process.env ? self.env || {} : process.env).DEBUG_CHUNKS) {
		const str = (term.normal + "'").padEnd(8);
		console.log(`  | '${str}  →  \x1b[34m${chunk.padEnd(12)}\x1b[0m \x1b[2m -fallback- \x1b[0m`);
	}
	term.chunk = chunk;
};
var fallback = function(document) {
	for (let n = 0; n < document.length; n += 1) for (let t = 0; t < document[n].length; t += 1) {
		const term = document[n][t];
		if (term.chunk === void 0) if (term.tags.has("Conjunction")) setChunk(term, "Pivot");
		else if (term.tags.has("Preposition")) setChunk(term, "Pivot");
		else if (term.tags.has("Adverb")) setChunk(term, "Verb");
		else term.chunk = "Noun";
	}
};
//#endregion
//#region node_modules/compromise/src/3-three/chunker/compute/05-fixUp.js
var fixUp = function(docs) {
	const byChunk = [];
	let current = null;
	docs.forEach((terms) => {
		for (let i = 0; i < terms.length; i += 1) {
			const term = terms[i];
			if (current && term.chunk === current) byChunk[byChunk.length - 1].terms.push(term);
			else {
				byChunk.push({
					chunk: term.chunk,
					terms: [term]
				});
				current = term.chunk;
			}
		}
	});
	byChunk.forEach((c) => {
		if (c.chunk === "Verb") {
			if (!c.terms.find((t) => t.tags.has("Verb"))) c.terms.forEach((t) => t.chunk = null);
		}
	});
};
//#endregion
//#region node_modules/compromise/src/3-three/chunker/compute/index.js
var findChunks = function(view) {
	const { document, world } = view;
	easyMode(document);
	byNeighbour(document);
	matcher(view, document, world);
	fallback(document, world);
	fixUp(document, world);
};
//#endregion
//#region node_modules/compromise/src/3-three/chunker/plugin.js
var plugin_default$8 = {
	compute: { chunks: findChunks },
	api: api$13,
	hooks: ["chunks"]
};
//#endregion
//#region node_modules/compromise/src/3-three/misc/acronyms/index.js
var hasPeriod = /\./g;
var api$12 = function(View) {
	class Acronyms extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Acronyms";
		}
		strip() {
			this.docs.forEach((terms) => {
				terms.forEach((term) => {
					term.text = term.text.replace(hasPeriod, "");
					term.normal = term.normal.replace(hasPeriod, "");
				});
			});
			return this;
		}
		addPeriods() {
			this.docs.forEach((terms) => {
				terms.forEach((term) => {
					term.text = term.text.replace(hasPeriod, "");
					term.normal = term.normal.replace(hasPeriod, "");
					term.text = term.text.split("").join(".") + ".";
					term.normal = term.normal.split("").join(".") + ".";
				});
			});
			return this;
		}
	}
	View.prototype.acronyms = function(n) {
		let m = this.match("#Acronym");
		m = m.getNth(n);
		return new Acronyms(m.document, m.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/misc/parentheses/fns.js
var hasOpen$1 = /\(/;
var hasClosed$1 = /\)/;
var findEnd$1 = function(terms, i) {
	for (; i < terms.length; i += 1) if (terms[i].post && hasClosed$1.test(terms[i].post)) {
		let [, index] = terms[i].index;
		index = index || 0;
		return index;
	}
	return null;
};
var find$5 = function(doc) {
	const ptrs = [];
	doc.docs.forEach((terms) => {
		for (let i = 0; i < terms.length; i += 1) {
			const term = terms[i];
			if (term.pre && hasOpen$1.test(term.pre)) {
				const end = findEnd$1(terms, i);
				if (end !== null) {
					const [n, start] = terms[i].index;
					ptrs.push([
						n,
						start,
						end + 1,
						terms[i].id
					]);
					i = end;
				}
			}
		}
	});
	return doc.update(ptrs);
};
var strip$1 = function(m) {
	m.docs.forEach((terms) => {
		terms[0].pre = terms[0].pre.replace(hasOpen$1, "");
		const last = terms[terms.length - 1];
		last.post = last.post.replace(hasClosed$1, "");
	});
	return m;
};
//#endregion
//#region node_modules/compromise/src/3-three/misc/parentheses/index.js
var api$11 = function(View) {
	class Parentheses extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Possessives";
		}
		strip() {
			return strip$1(this);
		}
	}
	View.prototype.parentheses = function(n) {
		let m = find$5(this);
		m = m.getNth(n);
		return new Parentheses(m.document, m.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/misc/possessives/index.js
var apostropheS = /'s$/;
var find$4 = function(doc) {
	let m = doc.match("#Possessive+");
	if (m.has("#Person")) m = m.growLeft("#Person+");
	if (m.has("#Place")) m = m.growLeft("#Place+");
	if (m.has("#Organization")) m = m.growLeft("#Organization+");
	return m;
};
var api$10 = function(View) {
	class Possessives extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Possessives";
		}
		strip() {
			this.docs.forEach((terms) => {
				terms.forEach((term) => {
					term.text = term.text.replace(apostropheS, "");
					term.normal = term.normal.replace(apostropheS, "");
				});
			});
			return this;
		}
	}
	View.prototype.possessives = function(n) {
		let m = find$4(this);
		m = m.getNth(n);
		return new Possessives(m.document, m.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/misc/quotations/fns.js
var pairs = {
	"\"": "\"",
	"＂": "＂",
	"'": "'",
	"“": "”",
	"‘": "’",
	"‟": "”",
	"‛": "’",
	"„": "”",
	"⹂": "”",
	"‚": "’",
	"«": "»",
	"‹": "›",
	"‵": "′",
	"‶": "″",
	"‷": "‴",
	"〝": "〞",
	"`": "´",
	"〟": "〞"
};
var hasOpen = RegExp("[" + Object.keys(pairs).join("") + "]");
var hasClosed = RegExp("[" + Object.values(pairs).join("") + "]");
var findEnd = function(terms, i) {
	const have = terms[i].pre.match(hasOpen)[0] || "";
	if (!have || !pairs[have]) return null;
	const want = pairs[have];
	for (; i < terms.length; i += 1) if (terms[i].post && terms[i].post.match(want)) return i;
	return null;
};
var find$3 = function(doc) {
	const ptrs = [];
	doc.docs.forEach((terms) => {
		for (let i = 0; i < terms.length; i += 1) {
			const term = terms[i];
			if (term.pre && hasOpen.test(term.pre)) {
				const end = findEnd(terms, i);
				if (end !== null) {
					const [n, start] = terms[i].index;
					ptrs.push([
						n,
						start,
						end + 1,
						terms[i].id
					]);
					i = end;
				}
			}
		}
	});
	return doc.update(ptrs);
};
var strip = function(m) {
	m.docs.forEach((terms) => {
		terms[0].pre = terms[0].pre.replace(hasOpen, "");
		const lastTerm = terms[terms.length - 1];
		lastTerm.post = lastTerm.post.replace(hasClosed, "");
	});
};
//#endregion
//#region node_modules/compromise/src/3-three/misc/quotations/index.js
var api$9 = function(View) {
	class Quotations extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Possessives";
		}
		strip() {
			return strip(this);
		}
	}
	View.prototype.quotations = function(n) {
		let m = find$3(this);
		m = m.getNth(n);
		return new Quotations(m.document, m.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/misc/selections/index.js
/** return anything tagged as a phone number */
var phoneNumbers = function(n) {
	let m = this.splitAfter("@hasComma");
	m = m.match("#PhoneNumber+");
	m = m.getNth(n);
	return m;
};
var selections = [
	["hyphenated", "@hasHyphen ."],
	["hashTags", "#HashTag"],
	["emails", "#Email"],
	["emoji", "#Emoji"],
	["emoticons", "#Emoticon"],
	["atMentions", "#AtMention"],
	["urls", "#Url"],
	["conjunctions", "#Conjunction"],
	["prepositions", "#Preposition"],
	["abbreviations", "#Abbreviation"],
	["honorifics", "#Honorific"]
];
var aliases = [["emojis", "emoji"], ["atmentions", "atMentions"]];
var addMethods = function(View) {
	selections.forEach((a) => {
		View.prototype[a[0]] = function(n) {
			const m = this.match(a[1]);
			return typeof n === "number" ? m.get(n) : m;
		};
	});
	View.prototype.phoneNumbers = phoneNumbers;
	aliases.forEach((a) => {
		View.prototype[a[0]] = View.prototype[a[1]];
	});
};
//#endregion
//#region node_modules/compromise/src/3-three/misc/slashes/index.js
var hasSlash = /\//;
var api$8 = function(View) {
	class Slashes extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Slashes";
		}
		split() {
			return this.map((m) => {
				const arr = m.text().split(hasSlash);
				m = m.replaceWith(arr.join(" "));
				return m.growRight("(" + arr.join("|") + ")+");
			});
		}
	}
	View.prototype.slashes = function(n) {
		let m = this.match("#SlashedTerm");
		m = m.getNth(n);
		return new Slashes(m.document, m.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/misc/plugin.js
var plugin_default$7 = { api: function(View) {
	api$12(View);
	api$11(View);
	api$10(View);
	api$9(View);
	addMethods(View);
	api$8(View);
} };
//#endregion
//#region node_modules/compromise/src/3-three/normalize/methods.js
var termLoop = function(view, cb) {
	view.docs.forEach((terms) => {
		terms.forEach(cb);
	});
};
var methods_default = {
	"case": (doc) => {
		termLoop(doc, (term) => {
			term.text = term.text.toLowerCase();
		});
	},
	"unicode": (doc) => {
		const world = doc.world;
		const killUnicode = world.methods.one.killUnicode;
		termLoop(doc, (term) => term.text = killUnicode(term.text, world));
	},
	"whitespace": (doc) => {
		termLoop(doc, (term) => {
			term.post = term.post.replace(/\s+/g, " ");
			term.post = term.post.replace(/\s([.,?!:;])/g, "$1");
			term.pre = term.pre.replace(/\s+/g, "");
		});
	},
	"punctuation": (doc) => {
		termLoop(doc, (term) => {
			term.post = term.post.replace(/[–—-]/g, " ");
			term.post = term.post.replace(/[,:;]/g, "");
			term.post = term.post.replace(/\.{2,}/g, "");
			term.post = term.post.replace(/\?{2,}/g, "?");
			term.post = term.post.replace(/!{2,}/g, "!");
			term.post = term.post.replace(/\?!+/g, "?");
		});
		const docs = doc.docs;
		const terms = docs[docs.length - 1];
		if (terms && terms.length > 0) {
			const lastTerm = terms[terms.length - 1];
			lastTerm.post = lastTerm.post.replace(/ /g, "");
		}
	},
	"contractions": (doc) => {
		doc.contractions().expand();
	},
	"acronyms": (doc) => {
		doc.acronyms().strip();
	},
	"parentheses": (doc) => {
		doc.parentheses().strip();
	},
	"possessives": (doc) => {
		doc.possessives().strip();
	},
	"quotations": (doc) => {
		doc.quotations().strip();
	},
	"emoji": (doc) => {
		doc.emojis().remove();
	},
	"honorifics": (doc) => {
		doc.match("#Honorific+ #Person").honorifics().remove();
	},
	"adverbs": (doc) => {
		doc.adverbs().remove();
	},
	"nouns": (doc) => {
		doc.nouns().toSingular();
	},
	"verbs": (doc) => {
		doc.verbs().toInfinitive();
	},
	"numbers": (doc) => {
		doc.numbers().toNumber();
	},
	/** remove bullets from beginning of phrase */
	"debullet": (doc) => {
		const hasBullet = /^\s*([-–—*•])\s*$/;
		doc.docs.forEach((terms) => {
			if (hasBullet.test(terms[0].pre)) terms[0].pre = terms[0].pre.replace(hasBullet, "");
		});
		return doc;
	}
};
//#endregion
//#region node_modules/compromise/src/3-three/normalize/api.js
var split = (str) => {
	return str.split("|").reduce((h, k) => {
		h[k] = true;
		return h;
	}, {});
};
var presets = {
	light: split("unicode|punctuation|whitespace|acronyms"),
	medium: split("unicode|punctuation|whitespace|acronyms|case|contractions|parentheses|quotations|emoji|honorifics|debullet"),
	heavy: split("unicode|punctuation|whitespace|acronyms|case|contractions|parentheses|quotations|emoji|honorifics|debullet|possessives|adverbs|nouns|verbs")
};
function api_default(View) {
	View.prototype.normalize = function(opts = "light") {
		if (typeof opts === "string") opts = presets[opts];
		Object.keys(opts).forEach((fn) => {
			if (methods_default.hasOwnProperty(fn)) methods_default[fn](this, opts[fn]);
		});
		return this;
	};
}
//#endregion
//#region node_modules/compromise/src/3-three/normalize/plugin.js
var plugin_default$6 = { api: api_default };
//#endregion
//#region node_modules/compromise/src/3-three/nouns/find.js
var findNouns = function(doc) {
	let m = doc.clauses().match("<Noun>");
	let commas = m.match("@hasComma");
	commas = commas.not("#Place");
	if (commas.found) m = m.splitAfter(commas);
	m = m.splitOn("#Expression");
	m = m.splitOn("(he|she|we|you|they|i)");
	m = m.splitOn("(#Noun|#Adjective) [(he|him|she|it)]", 0);
	m = m.splitOn("[(he|him|she|it)] (#Determiner|#Value)", 0);
	m = m.splitBefore("#Noun [(the|a|an)] #Adjective? #Noun", 0);
	m = m.splitOn("[(here|there)] #Noun", 0);
	m = m.splitOn("[#Noun] (here|there)", 0);
	m = m.splitBefore("(our|my|their|your)");
	m = m.splitOn("#Noun [#Determiner]", 0);
	m = m.if("#Noun");
	return m;
};
//#endregion
//#region node_modules/compromise/src/3-three/nouns/api/isSubordinate.js
var list$1 = [
	"after",
	"although",
	"as if",
	"as long as",
	"as",
	"because",
	"before",
	"even if",
	"even though",
	"ever since",
	"if",
	"in order that",
	"provided that",
	"since",
	"so that",
	"than",
	"that",
	"though",
	"unless",
	"until",
	"what",
	"whatever",
	"when",
	"whenever",
	"where",
	"whereas",
	"wherever",
	"whether",
	"which",
	"whichever",
	"who",
	"whoever",
	"whom",
	"whomever",
	"whose"
];
var isSubordinate = function(m) {
	if (m.before("#Preposition$").found) return true;
	if (!m.before().found) return false;
	for (let i = 0; i < list$1.length; i += 1) if (m.has(list$1[i])) return true;
	return false;
};
//#endregion
//#region node_modules/compromise/src/3-three/nouns/api/isPlural.js
var notPlural = "(#Pronoun|#Place|#Value|#Person|#Uncountable|#Month|#WeekDay|#Holiday|#Possessive)";
var isPlural$2 = function(m, root) {
	if (m.has("#Plural")) return true;
	if (m.has("#Noun and #Noun")) return true;
	if (m.has("(we|they)")) return true;
	if (root.has(notPlural) === true) return false;
	if (m.has("#Singular")) return false;
	const str = root.text("normal");
	return str.length > 3 && str.endsWith("s") && !str.endsWith("ss");
};
//#endregion
//#region node_modules/compromise/src/3-three/nouns/api/parse.js
var getRoot = function(m) {
	let tmp = m.clone();
	tmp = tmp.match("#Noun+");
	tmp = tmp.remove("(#Adjective|#Preposition|#Determiner|#Value)");
	tmp = tmp.not("#Possessive");
	tmp = tmp.first();
	if (!tmp.found) return m;
	return tmp;
};
var parseNoun = function(m) {
	const root = getRoot(m);
	return {
		determiner: m.match("#Determiner").eq(0),
		adjectives: m.match("#Adjective"),
		number: m.values(),
		isPlural: isPlural$2(m, root),
		isSubordinate: isSubordinate(m),
		root
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/nouns/api/toJSON.js
var toText$2 = (m) => m.text();
var toArray$1 = (m) => m.json({
	terms: false,
	normal: true
}).map((s) => s.normal);
var getNum = function(m) {
	const num = null;
	if (!m.found) return num;
	const val = m.values(0);
	if (val.found) return (val.parse()[0] || {}).num;
	return num;
};
var toJSON$1 = function(m) {
	const res = parseNoun(m);
	return {
		root: toText$2(res.root),
		number: getNum(res.number),
		determiner: toText$2(res.determiner),
		adjectives: toArray$1(res.adjectives),
		isPlural: res.isPlural,
		isSubordinate: res.isSubordinate
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/nouns/api/hasPlural.js
var hasPlural = function(root) {
	if (root.has("^(#Uncountable|#ProperNoun|#Place|#Pronoun|#Acronym)+$")) return false;
	return true;
};
//#endregion
//#region node_modules/compromise/src/3-three/nouns/api/toPlural.js
var keep$7 = { tags: true };
var nounToPlural = function(m, parsed) {
	if (parsed.isPlural === true) return m;
	if (parsed.root.has("#Possessive")) parsed.root = parsed.root.possessives().strip();
	if (!hasPlural(parsed.root)) return m;
	const { methods, model } = m.world;
	const { toPlural } = methods.two.transform.noun;
	const plural = toPlural(parsed.root.text({ keepPunct: false }), model);
	m.match(parsed.root).replaceWith(plural, keep$7).tag("Plural", "toPlural");
	if (parsed.determiner.has("(a|an)")) m.remove(parsed.determiner);
	const copula = parsed.root.after("not? #Adverb+? [#Copula]", 0);
	if (copula.found) {
		if (copula.has("is")) m.replace(copula, "are");
		else if (copula.has("was")) m.replace(copula, "were");
	}
	return m;
};
//#endregion
//#region node_modules/compromise/src/3-three/nouns/api/toSingular.js
var keep$6 = { tags: true };
var nounToSingular = function(m, parsed) {
	if (parsed.isPlural === false) return m;
	const { methods, model } = m.world;
	const { toSingular } = methods.two.transform.noun;
	const single = toSingular(parsed.root.text("normal"), model);
	m.replace(parsed.root, single, keep$6).tag("Singular", "toPlural");
	return m;
};
//#endregion
//#region node_modules/compromise/src/3-three/nouns/api/api.js
var api$7 = function(View) {
	class Nouns extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Nouns";
		}
		parse(n) {
			return this.getNth(n).map(parseNoun);
		}
		json(n) {
			const opts = typeof n === "object" ? n : {};
			return this.getNth(n).map((m) => {
				const json = m.toView().json(opts)[0] || {};
				if (opts && opts.noun !== false) json.noun = toJSON$1(m);
				return json;
			}, []);
		}
		conjugate(n) {
			const methods = this.world.methods.two.transform.noun;
			return this.getNth(n).map((m) => {
				const parsed = parseNoun(m);
				const root = parsed.root.compute("root").text("root");
				const res = { Singular: root };
				if (hasPlural(parsed.root)) res.Plural = methods.toPlural(root, this.model);
				if (res.Singular === res.Plural) delete res.Plural;
				return res;
			}, []);
		}
		isPlural(n) {
			return this.filter((m) => parseNoun(m).isPlural).getNth(n);
		}
		isSingular(n) {
			return this.filter((m) => !parseNoun(m).isPlural).getNth(n);
		}
		adjectives(n) {
			let res = this.update([]);
			this.forEach((m) => {
				const adj = parseNoun(m).adjectives;
				if (adj.found) res = res.concat(adj);
			});
			return res.getNth(n);
		}
		toPlural(n) {
			return this.getNth(n).map((m) => {
				return nounToPlural(m, parseNoun(m));
			});
		}
		toSingular(n) {
			return this.getNth(n).map((m) => {
				return nounToSingular(m, parseNoun(m));
			});
		}
		update(pointer) {
			const m = new Nouns(this.document, pointer);
			m._cache = this._cache;
			return m;
		}
	}
	View.prototype.nouns = function(n) {
		let m = findNouns(this);
		m = m.getNth(n);
		return new Nouns(this.document, m.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/nouns/plugin.js
var plugin_default$5 = { api: api$7 };
//#endregion
//#region node_modules/compromise/src/3-three/numbers/fractions/find.js
var findFractions = function(doc, n) {
	let m = doc.match("#Fraction+");
	m = m.filter((r) => {
		return !r.lookBehind("#Value and$").found;
	});
	m = m.notIf("#Value seconds");
	if (typeof n === "number") m = m.eq(n);
	return m;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/parse/toNumber/findModifiers.js
var findModifiers = (str) => {
	const mults = [{
		reg: /^(minus|negative)[\s-]/i,
		mult: -1
	}, {
		reg: /^(a\s)?half[\s-](of\s)?/i,
		mult: .5
	}];
	for (let i = 0; i < mults.length; i++) if (mults[i].reg.test(str) === true) return {
		amount: mults[i].mult,
		str: str.replace(mults[i].reg, "")
	};
	return {
		amount: 1,
		str
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/parse/toNumber/data.js
var data_default = {
	ones: {
		zeroth: 0,
		first: 1,
		second: 2,
		third: 3,
		fourth: 4,
		fifth: 5,
		sixth: 6,
		seventh: 7,
		eighth: 8,
		ninth: 9,
		zero: 0,
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9
	},
	teens: {
		tenth: 10,
		eleventh: 11,
		twelfth: 12,
		thirteenth: 13,
		fourteenth: 14,
		fifteenth: 15,
		sixteenth: 16,
		seventeenth: 17,
		eighteenth: 18,
		nineteenth: 19,
		ten: 10,
		eleven: 11,
		twelve: 12,
		thirteen: 13,
		fourteen: 14,
		fifteen: 15,
		sixteen: 16,
		seventeen: 17,
		eighteen: 18,
		nineteen: 19
	},
	tens: {
		twentieth: 20,
		thirtieth: 30,
		fortieth: 40,
		fourtieth: 40,
		fiftieth: 50,
		sixtieth: 60,
		seventieth: 70,
		eightieth: 80,
		ninetieth: 90,
		twenty: 20,
		thirty: 30,
		forty: 40,
		fourty: 40,
		fifty: 50,
		sixty: 60,
		seventy: 70,
		eighty: 80,
		ninety: 90
	},
	multiples: {
		hundredth: 100,
		thousandth: 1e3,
		millionth: 1e6,
		billionth: 1e9,
		trillionth: 0xe8d4a51000,
		quadrillionth: 0x38d7ea4c68000,
		quintillionth: 0xde0b6b3a7640000,
		sextillionth: 1e21,
		septillionth: 1e24,
		hundred: 100,
		thousand: 1e3,
		million: 1e6,
		billion: 1e9,
		trillion: 0xe8d4a51000,
		quadrillion: 0x38d7ea4c68000,
		quintillion: 0xde0b6b3a7640000,
		sextillion: 1e21,
		septillion: 1e24,
		grand: 1e3
	}
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/parse/toNumber/validate.js
var isValid = (w, has) => {
	if (data_default.ones.hasOwnProperty(w)) {
		if (has.ones || has.teens) return false;
	} else if (data_default.teens.hasOwnProperty(w)) {
		if (has.ones || has.teens || has.tens) return false;
	} else if (data_default.tens.hasOwnProperty(w)) {
		if (has.ones || has.teens || has.tens) return false;
	}
	return true;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/parse/toNumber/parseDecimals.js
var parseDecimals = function(arr) {
	let str = "0.";
	for (let i = 0; i < arr.length; i++) {
		const w = arr[i];
		if (data_default.ones.hasOwnProperty(w) === true) str += data_default.ones[w];
		else if (data_default.teens.hasOwnProperty(w) === true) str += data_default.teens[w];
		else if (data_default.tens.hasOwnProperty(w) === true) str += data_default.tens[w];
		else if (/^[0-9]$/.test(w) === true) str += w;
		else return 0;
	}
	return parseFloat(str);
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/parse/toNumber/parseNumeric.js
var parseNumeric$1 = (str) => {
	str = str.replace(/1st$/, "1");
	str = str.replace(/2nd$/, "2");
	str = str.replace(/3rd$/, "3");
	str = str.replace(/([4567890])r?th$/, "$1");
	str = str.replace(/^[$€¥£¢]/, "");
	str = str.replace(/[%$€¥£¢]$/, "");
	str = str.replace(/,/g, "");
	str = str.replace(/([0-9])([a-z\u00C0-\u00FF]{1,2})$/, "$1");
	return str;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/parse/toNumber/index.js
var improperFraction = /^([0-9,. ]+)\/([0-9,. ]+)$/;
var casualForms = {
	"a few": 3,
	"a couple": 2,
	"a dozen": 12,
	"two dozen": 24,
	zero: 0
};
var section_sum = (obj) => {
	return Object.keys(obj).reduce((sum, k) => {
		sum += obj[k];
		return sum;
	}, 0);
};
var parse$2 = function(str) {
	if (casualForms.hasOwnProperty(str) === true) return casualForms[str];
	if (str === "a" || str === "an") return 1;
	const modifier = findModifiers(str);
	str = modifier.str;
	let last_mult = null;
	let has = {};
	let sum = 0;
	let isNegative = false;
	const terms = str.split(/[ -]/);
	for (let i = 0; i < terms.length; i++) {
		let w = terms[i];
		w = parseNumeric$1(w);
		if (!w || w === "and") continue;
		if (w === "-" || w === "negative") {
			isNegative = true;
			continue;
		}
		if (w.charAt(0) === "-") {
			isNegative = true;
			w = w.substring(1);
		}
		if (w === "point") {
			sum += section_sum(has);
			sum += parseDecimals(terms.slice(i + 1, terms.length));
			sum *= modifier.amount;
			return sum;
		}
		const fm = w.match(improperFraction);
		if (fm) {
			const num = parseFloat(fm[1].replace(/[, ]/g, ""));
			const denom = parseFloat(fm[2].replace(/[, ]/g, ""));
			if (denom) sum += num / denom || 0;
			continue;
		}
		if (data_default.tens.hasOwnProperty(w)) {
			if (has.ones && Object.keys(has).length === 1) {
				sum = has.ones * 100;
				has = {};
			}
		}
		if (isValid(w, has) === false) return null;
		if (/^[0-9.]+$/.test(w)) has.ones = parseFloat(w);
		else if (data_default.ones.hasOwnProperty(w) === true) has.ones = data_default.ones[w];
		else if (data_default.teens.hasOwnProperty(w) === true) has.teens = data_default.teens[w];
		else if (data_default.tens.hasOwnProperty(w) === true) has.tens = data_default.tens[w];
		else if (data_default.multiples.hasOwnProperty(w) === true) {
			let mult = data_default.multiples[w];
			if (mult === last_mult) return null;
			if (mult === 100 && terms[i + 1] !== void 0) {
				const w2 = terms[i + 1];
				if (data_default.multiples[w2]) {
					mult *= data_default.multiples[w2];
					i += 1;
				}
			}
			if (last_mult === null || mult < last_mult) {
				sum += (section_sum(has) || 1) * mult;
				last_mult = mult;
				has = {};
			} else {
				sum += section_sum(has);
				last_mult = mult;
				sum = (sum || 1) * mult;
				has = {};
			}
		}
	}
	sum += section_sum(has);
	sum *= modifier.amount;
	sum *= isNegative ? -1 : 1;
	if (sum === 0 && Object.keys(has).length === 0) return null;
	return sum;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/fractions/parse.js
var endS = /s$/;
var parseNumber$1 = function(m) {
	return parse$2(m.text("reduced"));
};
var mapping = {
	half: 2,
	halve: 2,
	quarter: 4
};
var slashForm = function(m) {
	const found = m.text("reduced").match(/^([-+]?[0-9]+)\/([-+]?[0-9]+)(st|nd|rd|th)?s?$/);
	if (found && found[1] && found[0]) return {
		numerator: Number(found[1]),
		denominator: Number(found[2])
	};
	return null;
};
var nOutOfN = function(m) {
	const found = m.match("[<num>#Value+] out of every? [<den>#Value+]");
	if (found.found !== true) return null;
	let { num, den } = found.groups();
	if (!num || !den) return null;
	num = parseNumber$1(num);
	den = parseNumber$1(den);
	if (!num || !den) return null;
	if (typeof num === "number" && typeof den === "number") return {
		numerator: num,
		denominator: den
	};
	return null;
};
var nOrinalth = function(m) {
	const found = m.match("[<num>(#Cardinal|a)+] [<den>#Fraction+]");
	if (found.found !== true) return null;
	let { num, den } = found.groups();
	if (num.has("a")) num = 1;
	else num = parseNumber$1(num);
	let str = den.text("reduced");
	if (endS.test(str)) {
		str = str.replace(endS, "");
		den = den.replaceWith(str);
	}
	if (mapping.hasOwnProperty(str)) den = mapping[str];
	else den = parseNumber$1(den);
	if (typeof num === "number" && typeof den === "number") return {
		numerator: num,
		denominator: den
	};
	return null;
};
var oneNth = function(m) {
	const found = m.match("^#Ordinal$");
	if (found.found !== true) return null;
	if (m.lookAhead("^of .")) return {
		numerator: 1,
		denominator: parseNumber$1(found)
	};
	return null;
};
var named = function(m) {
	const str = m.text("reduced");
	if (mapping.hasOwnProperty(str)) return {
		numerator: 1,
		denominator: mapping[str]
	};
	return null;
};
var round = (n) => {
	const rounded = Math.round(n * 1e3) / 1e3;
	if (rounded === 0 && n !== 0) return n;
	return rounded;
};
var parseFraction = function(m) {
	m = m.clone();
	const res = named(m) || slashForm(m) || nOutOfN(m) || nOrinalth(m) || oneNth(m) || null;
	if (res !== null) {
		if (res.numerator && res.denominator) {
			res.decimal = res.numerator / res.denominator;
			res.decimal = round(res.decimal);
		}
	}
	return res;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/_toString.js
/**
* turn big numbers, like 2.3e+22, into a string with a ton of trailing 0's
* */
var numToString = function(n) {
	if (n < 1e6) return String(n);
	let str;
	if (typeof n === "number") str = n.toFixed(0);
	else str = n;
	if (str.indexOf("e+") === -1) return str;
	return str.replace(".", "").split("e+").reduce(function(p, b) {
		return p + Array(b - p.length + 2).join(0);
	});
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/format/toText/data.js
var tens_mapping = [
	["ninety", 90],
	["eighty", 80],
	["seventy", 70],
	["sixty", 60],
	["fifty", 50],
	["forty", 40],
	["thirty", 30],
	["twenty", 20]
];
var ones_mapping = [
	"",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen"
];
var sequence = [
	[1e24, "septillion"],
	[0x56bc75e2d63100000, "hundred sextillion"],
	[1e21, "sextillion"],
	[0x56bc75e2d63100000, "hundred quintillion"],
	[0xde0b6b3a7640000, "quintillion"],
	[0x16345785d8a0000, "hundred quadrillion"],
	[0x38d7ea4c68000, "quadrillion"],
	[0x5af3107a4000, "hundred trillion"],
	[0xe8d4a51000, "trillion"],
	[1e11, "hundred billion"],
	[1e9, "billion"],
	[1e8, "hundred million"],
	[1e6, "million"],
	[1e5, "hundred thousand"],
	[1e3, "thousand"],
	[100, "hundred"],
	[1, "one"]
];
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/format/toText/index.js
/**
* turns an integer/float into.ber, like 'fifty-five'
*/
var breakdown_magnitudes = function(num) {
	let working = num;
	const have = [];
	sequence.forEach((a) => {
		if (num >= a[0]) {
			const howmany = Math.floor(working / a[0]);
			working -= howmany * a[0];
			if (howmany) have.push({
				unit: a[1],
				count: howmany
			});
		}
	});
	return have;
};
var breakdown_hundred = function(num) {
	const arr = [];
	if (num > 100) return arr;
	for (let i = 0; i < tens_mapping.length; i++) if (num >= tens_mapping[i][1]) {
		num -= tens_mapping[i][1];
		arr.push(tens_mapping[i][0]);
	}
	if (ones_mapping[num]) arr.push(ones_mapping[num]);
	return arr;
};
/** print-out 'point eight nine'*/
var handle_decimal = (num) => {
	const names = [
		"zero",
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine"
	];
	const arr = [];
	const decimal = numToString(num).match(/\.([0-9]+)/);
	if (!decimal || !decimal[0]) return arr;
	arr.push("point");
	const decimals = decimal[0].split("");
	for (let i = 0; i < decimals.length; i++) arr.push(names[decimals[i]]);
	return arr;
};
/** turns an integer into a textual number */
var toText$1 = function(obj) {
	let num = obj.num;
	if (num === 0 || num === "0") return "zero";
	if (num > 1e21) num = numToString(num);
	let arr = [];
	if (num < 0) {
		arr.push("minus");
		num = Math.abs(num);
	}
	const units = breakdown_magnitudes(num);
	for (let i = 0; i < units.length; i++) {
		let unit_name = units[i].unit;
		if (unit_name === "one") {
			unit_name = "";
			if (arr.length > 1) arr.push("and");
		}
		arr = arr.concat(breakdown_hundred(units[i].count));
		arr.push(unit_name);
	}
	arr = arr.concat(handle_decimal(num));
	arr = arr.filter((s) => s);
	if (arr.length === 0) arr[0] = "";
	return arr.join(" ");
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/fractions/convert/toCardinal.js
var toCardinal = function(obj) {
	if (!obj.numerator || !obj.denominator) return "";
	return `${toText$1({ num: obj.numerator })} out of ${toText$1({ num: obj.denominator })}`;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/format/toOrdinal/textOrdinal.js
var irregulars = {
	one: "first",
	two: "second",
	three: "third",
	five: "fifth",
	eight: "eighth",
	nine: "ninth",
	twelve: "twelfth",
	twenty: "twentieth",
	thirty: "thirtieth",
	forty: "fortieth",
	fourty: "fourtieth",
	fifty: "fiftieth",
	sixty: "sixtieth",
	seventy: "seventieth",
	eighty: "eightieth",
	ninety: "ninetieth"
};
/**
* convert a javascript number to 'twentieth' format
* */
var textOrdinal = (obj) => {
	const words = toText$1(obj).split(" ");
	const last = words[words.length - 1];
	if (irregulars.hasOwnProperty(last)) words[words.length - 1] = irregulars[last];
	else words[words.length - 1] = last.replace(/y$/, "i") + "th";
	return words.join(" ");
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/fractions/convert/toOrdinal.js
var toOrdinal = function(obj) {
	if (!obj.numerator || !obj.denominator) return "";
	const start = toText$1({ num: obj.numerator });
	let end = textOrdinal({ num: obj.denominator });
	if (obj.denominator === 2) end = "half";
	if (start && end) {
		if (obj.numerator !== 1) end += "s";
		return `${start} ${end}`;
	}
	return "";
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/fractions/api.js
var plugin$1 = function(View) {
	/**
	*/
	class Fractions extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Fractions";
		}
		parse(n) {
			return this.getNth(n).map(parseFraction);
		}
		get(n) {
			return this.getNth(n).map(parseFraction);
		}
		json(n) {
			return this.getNth(n).map((p) => {
				const json = p.toView().json(n)[0];
				json.fraction = parseFraction(p);
				return json;
			}, []);
		}
		toDecimal(n) {
			this.getNth(n).forEach((m) => {
				const { decimal } = parseFraction(m);
				m = m.replaceWith(String(decimal), true);
				m.tag("NumericValue");
				m.unTag("Fraction");
			});
			return this;
		}
		toFraction(n) {
			this.getNth(n).forEach((m) => {
				const obj = parseFraction(m);
				if (obj && typeof obj.numerator === "number" && typeof obj.denominator === "number") {
					const str = `${obj.numerator}/${obj.denominator}`;
					this.replace(m, str);
				}
			});
			return this;
		}
		toOrdinal(n) {
			this.getNth(n).forEach((m) => {
				let str = toOrdinal(parseFraction(m));
				if (m.after("^#Noun").found) str += " of";
				m.replaceWith(str);
			});
			return this;
		}
		toCardinal(n) {
			this.getNth(n).forEach((m) => {
				const str = toCardinal(parseFraction(m));
				m.replaceWith(str);
			});
			return this;
		}
		toPercentage(n) {
			this.getNth(n).forEach((m) => {
				const { decimal } = parseFraction(m);
				let percent = decimal * 100;
				percent = Math.round(percent * 100) / 100;
				m.replaceWith(`${percent}%`);
			});
			return this;
		}
	}
	View.prototype.fractions = function(n) {
		let m = findFractions(this);
		m = m.getNth(n);
		return new Fractions(this.document, m.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/find.js
var ones = "one|two|three|four|five|six|seven|eight|nine";
var tens = "twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty";
var findNumbers = function(doc) {
	let m = doc.match("#Value+");
	if (m.has("#NumericValue #NumericValue")) if (m.has("#Value @hasComma #Value")) m.splitAfter("@hasComma");
	else if (m.has("#NumericValue #Fraction")) m.splitAfter("#NumericValue #Fraction");
	else m = m.splitAfter("#NumericValue");
	if (m.has("#Value #Value #Value") && !m.has("#Multiple")) {
		if (m.has("(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty) #Cardinal #Cardinal")) m = m.splitAfter("(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty) #Cardinal");
	}
	if (m.has("#Value #Value")) {
		if (m.has("#NumericValue #NumericValue")) m = m.splitOn("#Year");
		if (m.has("(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty) (eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)")) m = m.splitAfter("(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty)");
		const double = m.match("#Cardinal #Cardinal");
		if (double.found && !m.has("(point|decimal|#Fraction)")) {
			if (!double.has("#Cardinal (#Multiple|point|decimal)")) {
				const noMultiple = m.has(`(${ones}) (${tens})`);
				const tensVal = double.has("(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty) #Cardinal");
				const multVal = double.has("#Multiple #Value");
				if (!noMultiple && !tensVal && !multVal) double.terms().forEach((d) => {
					m = m.splitOn(d);
				});
			}
		}
		if (m.match("#Ordinal #Ordinal").match("#TextValue").found && !m.has("#Multiple")) {
			if (!m.has("(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty) #Ordinal")) m = m.splitAfter("#Ordinal");
		}
		if (m.has("#Time")) m = m.splitOn("#Time");
		m = m.splitBefore("#Ordinal [#Cardinal]", 0);
		if (m.has("#TextValue #NumericValue") && !m.has("(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty|#Multiple)")) m = m.splitBefore("#TextValue #NumericValue");
	}
	m = m.splitAfter("#NumberRange");
	m = m.splitBefore("#Year");
	return m;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/parse/index.js
var parseNumeric = function(str, m) {
	str = str.replace(/,/g, "");
	const arr = str.split(/([0-9.,]*)/);
	let [prefix, num] = arr;
	let suffix = arr.slice(2).join("");
	if (num !== "" && m.length < 2) {
		num = Number(num || str);
		if (typeof num !== "number") num = null;
		suffix = suffix || "";
		if (suffix === "st" || suffix === "nd" || suffix === "rd" || suffix === "th") suffix = "";
		return {
			prefix: prefix || "",
			num,
			suffix
		};
	}
	return null;
};
var parseNumber = function(m) {
	if (typeof m === "string") return { num: parse$2(m) };
	let str = m.text("reduced");
	const unit = m.growRight("#Unit").match("#Unit$").text("machine");
	const hasComma = /[0-9],[0-9]/.test(m.text("text"));
	if (m.terms().length === 1 && !m.has("#Multiple")) {
		const res = parseNumeric(str, m);
		if (res !== null) {
			res.hasComma = hasComma;
			res.unit = unit;
			return res;
		}
	}
	let frPart = m.match("#Fraction{2,}$");
	frPart = frPart.found === false ? m.match("^#Fraction$") : frPart;
	let fraction = null;
	if (frPart.found) {
		if (frPart.has("#Value and #Value #Fraction")) frPart = frPart.match("and #Value #Fraction");
		fraction = parseFraction(frPart);
		m = m.not(frPart);
		m = m.not("and$");
		str = m.text("reduced");
	}
	let num = 0;
	if (str) num = parse$2(str) || 0;
	if (fraction && fraction.decimal) num += fraction.decimal;
	return {
		hasComma,
		prefix: "",
		num,
		suffix: "",
		isOrdinal: m.has("#Ordinal"),
		isText: m.has("#TextValue"),
		isFraction: m.has("#Fraction"),
		isMoney: m.has("#Money"),
		unit
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/format/toOrdinal/numOrdinal.js
/**
* turn a number like 5 into an ordinal like 5th
*/
var numOrdinal = function(obj) {
	const num = obj.num;
	if (!num && num !== 0) return null;
	const tens = num % 100;
	if (tens > 10 && tens < 20) return String(num) + "th";
	const mapping = {
		0: "th",
		1: "st",
		2: "nd",
		3: "rd"
	};
	let str = numToString(num);
	const last = str.slice(str.length - 1, str.length);
	if (mapping[last]) str += mapping[last];
	else str += "th";
	return str;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/format/suffix.js
var prefixes = {
	"¢": "cents",
	$: "dollars",
	"£": "pounds",
	"¥": "yen",
	"€": "euros",
	"₡": "colón",
	"฿": "baht",
	"₭": "kip",
	"₩": "won",
	"₹": "rupees",
	"₽": "ruble",
	"₺": "liras"
};
var suffixes = {
	"%": "percent",
	"°": "degrees"
};
var addSuffix = function(obj) {
	const res = {
		suffix: "",
		prefix: obj.prefix
	};
	if (prefixes.hasOwnProperty(obj.prefix)) {
		res.suffix += " " + prefixes[obj.prefix];
		res.prefix = "";
	}
	if (suffixes.hasOwnProperty(obj.suffix)) res.suffix += " " + suffixes[obj.suffix];
	if (res.suffix && obj.num === 1) res.suffix = res.suffix.replace(/s$/, "");
	if (!res.suffix && obj.suffix) res.suffix += " " + obj.suffix;
	return res;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/format/index.js
var format = function(obj, fmt) {
	if (fmt === "TextOrdinal") {
		const { prefix, suffix } = addSuffix(obj);
		return prefix + textOrdinal(obj) + suffix;
	}
	if (fmt === "Ordinal") return obj.prefix + numOrdinal(obj) + obj.suffix;
	if (fmt === "TextCardinal") {
		const { prefix, suffix } = addSuffix(obj);
		return prefix + toText$1(obj) + suffix;
	}
	let num = obj.num;
	if (obj.hasComma) num = num.toLocaleString();
	return obj.prefix + String(num) + obj.suffix;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/isUnit.js
var isArray = (arr) => Object.prototype.toString.call(arr) === "[object Array]";
var coerceToObject = function(input) {
	if (typeof input === "string" || typeof input === "number") {
		const tmp = {};
		tmp[input] = true;
		return tmp;
	}
	if (isArray(input)) return input.reduce((h, s) => {
		h[s] = true;
		return h;
	}, {});
	return input || {};
};
var isUnit = function(doc, input = {}) {
	input = coerceToObject(input);
	return doc.filter((p) => {
		const { unit } = parseNumber(p);
		if (unit && input[unit] === true) return true;
		return false;
	});
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/numbers/api.js
var addMethod$2 = function(View) {
	/**   */
	class Numbers extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Numbers";
		}
		parse(n) {
			return this.getNth(n).map(parseNumber);
		}
		get(n) {
			return this.getNth(n).map(parseNumber).map((o) => o.num);
		}
		json(n) {
			const opts = typeof n === "object" ? n : {};
			return this.getNth(n).map((p) => {
				const json = p.toView().json(opts)[0];
				const parsed = parseNumber(p);
				json.number = {
					prefix: parsed.prefix,
					num: parsed.num,
					suffix: parsed.suffix,
					hasComma: parsed.hasComma,
					unit: parsed.unit
				};
				return json;
			}, []);
		}
		/** any known measurement unit, for the number */
		units() {
			return this.growRight("#Unit").match("#Unit$");
		}
		/** return values that match a given unit */
		isUnit(allowed) {
			return isUnit(this, allowed);
		}
		/** return only ordinal numbers */
		isOrdinal() {
			return this.if("#Ordinal");
		}
		/** return only cardinal numbers*/
		isCardinal() {
			return this.if("#Cardinal");
		}
		/** convert to numeric form like '8' or '8th' */
		toNumber() {
			const res = this.map((val) => {
				if (!this.has("#TextValue")) return val;
				const obj = parseNumber(val);
				if (obj.num === null) return val;
				const str = format(obj, val.has("#Ordinal") ? "Ordinal" : "Cardinal");
				val.replaceWith(str, { tags: true });
				return val.tag("NumericValue");
			});
			return new Numbers(res.document, res.pointer);
		}
		/** add commas, or nicer formatting for numbers */
		toLocaleString() {
			this.forEach((val) => {
				const obj = parseNumber(val);
				if (obj.num === null) return;
				let num = obj.num.toLocaleString();
				if (val.has("#Ordinal")) {
					const end = format(obj, "Ordinal").match(/[a-z]+$/);
					if (end) num += end[0] || "";
				}
				val.replaceWith(num, { tags: true });
			});
			return this;
		}
		/** convert to numeric form like 'eight' or 'eighth' */
		toText() {
			const res = this.map((val) => {
				if (val.has("#TextValue")) return val;
				const obj = parseNumber(val);
				if (obj.num === null) return val;
				const str = format(obj, val.has("#Ordinal") ? "TextOrdinal" : "TextCardinal");
				val.replaceWith(str, { tags: true });
				val.tag("TextValue");
				return val;
			});
			return new Numbers(res.document, res.pointer);
		}
		/** convert ordinal to cardinal form, like 'eight', or '8' */
		toCardinal() {
			const res = this.map((val) => {
				if (!val.has("#Ordinal")) return val;
				const obj = parseNumber(val);
				if (obj.num === null) return val;
				const str = format(obj, val.has("#TextValue") ? "TextCardinal" : "Cardinal");
				val.replaceWith(str, { tags: true });
				val.tag("Cardinal");
				return val;
			});
			return new Numbers(res.document, res.pointer);
		}
		/** convert cardinal to ordinal form, like 'eighth', or '8th' */
		toOrdinal() {
			const res = this.map((val) => {
				if (val.has("#Ordinal")) return val;
				const obj = parseNumber(val);
				if (obj.num === null) return val;
				const str = format(obj, val.has("#TextValue") ? "TextOrdinal" : "Ordinal");
				val.replaceWith(str, { tags: true });
				val.tag("Ordinal");
				return val;
			});
			return new Numbers(res.document, res.pointer);
		}
		/** return only numbers that are == n */
		isEqual(n) {
			return this.filter((val) => {
				return parseNumber(val).num === n;
			});
		}
		/** return only numbers that are > n*/
		greaterThan(n) {
			return this.filter((val) => {
				return parseNumber(val).num > n;
			});
		}
		/** return only numbers that are < n*/
		lessThan(n) {
			return this.filter((val) => {
				return parseNumber(val).num < n;
			});
		}
		/** return only numbers > min and < max */
		between(min, max) {
			return this.filter((val) => {
				const num = parseNumber(val).num;
				return num > min && num < max;
			});
		}
		/** set these number to n */
		set(n) {
			if (n === void 0) return this;
			if (typeof n === "string") n = parseNumber(n).num;
			const res = this.map((val) => {
				const obj = parseNumber(val);
				obj.num = n;
				if (obj.num === null) return val;
				let fmt = val.has("#Ordinal") ? "Ordinal" : "Cardinal";
				if (val.has("#TextValue")) fmt = val.has("#Ordinal") ? "TextOrdinal" : "TextCardinal";
				let str = format(obj, fmt);
				if (obj.hasComma && fmt === "Cardinal") str = Number(str).toLocaleString();
				val = val.not("#Currency");
				val.replaceWith(str, { tags: true });
				return val;
			});
			return new Numbers(res.document, res.pointer);
		}
		add(n) {
			if (!n) return this;
			if (typeof n === "string") n = parseNumber(n).num;
			const res = this.map((val) => {
				const obj = parseNumber(val);
				if (obj.num === null) return val;
				obj.num += n;
				let fmt = val.has("#Ordinal") ? "Ordinal" : "Cardinal";
				if (obj.isText) fmt = val.has("#Ordinal") ? "TextOrdinal" : "TextCardinal";
				const str = format(obj, fmt);
				val.replaceWith(str, { tags: true });
				return val;
			});
			return new Numbers(res.document, res.pointer);
		}
		/** decrease each number by n*/
		subtract(n, agree) {
			return this.add(n * -1, agree);
		}
		/** increase each number by 1 */
		increment(agree) {
			return this.add(1, agree);
		}
		/** decrease each number by 1 */
		decrement(agree) {
			return this.add(-1, agree);
		}
		update(pointer) {
			const m = new Numbers(this.document, pointer);
			m._cache = this._cache;
			return m;
		}
	}
	Numbers.prototype.toNice = Numbers.prototype.toLocaleString;
	Numbers.prototype.isBetween = Numbers.prototype.between;
	Numbers.prototype.minus = Numbers.prototype.subtract;
	Numbers.prototype.plus = Numbers.prototype.add;
	Numbers.prototype.equals = Numbers.prototype.isEqual;
	View.prototype.numbers = function(n) {
		let m = findNumbers(this);
		m = m.getNth(n);
		return new Numbers(this.document, m.pointer);
	};
	View.prototype.percentages = function(n) {
		let m = findNumbers(this);
		m = m.filter((v) => v.has("#Percent") || v.after("^percent"));
		m = m.getNth(n);
		return new Numbers(this.document, m.pointer);
	};
	View.prototype.money = function(n) {
		let m = findNumbers(this);
		m = m.filter((v) => v.has("#Money") || v.after("^#Currency"));
		m = m.getNth(n);
		return new Numbers(this.document, m.pointer);
	};
	View.prototype.values = View.prototype.numbers;
};
//#endregion
//#region node_modules/compromise/src/3-three/numbers/plugin.js
var api$6 = function(View) {
	plugin$1(View);
	addMethod$2(View);
};
var plugin_default$4 = { api: api$6 };
//#endregion
//#region node_modules/compromise/src/3-three/redact/plugin.js
var defaults = {
	people: true,
	emails: true,
	phoneNumbers: true,
	places: true
};
var redact = function(opts = {}) {
	opts = Object.assign({}, defaults, opts);
	if (opts.people !== false) this.people().replaceWith("██████████");
	if (opts.emails !== false) this.emails().replaceWith("██████████");
	if (opts.places !== false) this.places().replaceWith("██████████");
	if (opts.phoneNumbers !== false) this.phoneNumbers().replaceWith("███████");
	return this;
};
var plugin = { api: function(View) {
	View.prototype.redact = redact;
} };
//#endregion
//#region node_modules/compromise/src/3-three/sentences/questions.js
var isQuestion = function(doc) {
	const clauses = doc.clauses();
	if (/\.\.$/.test(doc.out("text"))) return false;
	if (doc.has("^#QuestionWord") && doc.has("@hasComma")) return false;
	if (doc.has("or not$")) return true;
	if (doc.has("^#QuestionWord")) return true;
	if (doc.has("^(do|does|did|is|was|can|could|will|would|may) #Noun")) return true;
	if (doc.has("^(have|must) you")) return true;
	if (clauses.has("(do|does|is|was) #Noun+ #Adverb? (#Adjective|#Infinitive)$")) return true;
	return false;
};
var findQuestions = function(view) {
	const hasQ = /\?/;
	const { document } = view;
	return view.filter((m) => {
		const terms = m.docs[0] || [];
		const lastTerm = terms[terms.length - 1];
		if (!lastTerm || document[lastTerm.index[0]].length !== terms.length) return false;
		if (hasQ.test(lastTerm.post)) return true;
		return isQuestion(m);
	});
};
//#endregion
//#region node_modules/compromise/src/3-three/sentences/parse/mainClause.js
var subordinate = `(after|although|as|because|before|if|since|than|that|though|when|whenever|where|whereas|wherever|whether|while|why|unless|until|once)`;
var relative = `(that|which|whichever|who|whoever|whom|whose|whomever)`;
var mainClause = function(s) {
	let m = s;
	if (m.length === 1) return m;
	m = m.if("#Verb");
	if (m.length === 1) return m;
	m = m.ifNo(subordinate);
	m = m.ifNo("^even (if|though)");
	m = m.ifNo("^so that");
	m = m.ifNo("^rather than");
	m = m.ifNo("^provided that");
	if (m.length === 1) return m;
	m = m.ifNo(relative);
	if (m.length === 1) return m;
	m = m.ifNo("(^despite|^during|^before|^through|^throughout)");
	if (m.length === 1) return m;
	m = m.ifNo("^#Gerund");
	if (m.length === 1) return m;
	if (m.length === 0) m = s;
	return m.eq(0);
};
//#endregion
//#region node_modules/compromise/src/3-three/sentences/parse/index.js
var grammar = function(vb) {
	let tense = null;
	if (vb.has("#PastTense")) tense = "PastTense";
	else if (vb.has("#FutureTense")) tense = "FutureTense";
	else if (vb.has("#PresentTense")) tense = "PresentTense";
	return { tense };
};
var parse$1 = function(s) {
	const chunks = mainClause(s.clauses()).chunks();
	let subj = s.none();
	let verb = s.none();
	let pred = s.none();
	chunks.forEach((ch, i) => {
		if (i === 0 && !ch.has("<Verb>")) {
			subj = ch;
			return;
		}
		if (!verb.found && ch.has("<Verb>")) {
			verb = ch;
			return;
		}
		if (verb.found) pred = pred.concat(ch);
	});
	if (verb.found && !subj.found) subj = verb.before("<Noun>+").first();
	return {
		subj,
		verb,
		pred,
		grammar: grammar(verb)
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/sentences/conjugate/toPast.js
var toPast$2 = function(s) {
	let verbs = s.verbs();
	const first = verbs.eq(0);
	if (first.has("#PastTense")) return s;
	first.toPastTense();
	if (verbs.length > 1) {
		verbs = verbs.slice(1);
		verbs = verbs.filter((v) => !v.lookBehind("to$").found);
		verbs = verbs.if("#PresentTense");
		verbs = verbs.notIf("#Gerund");
		const list = s.match("to #Verb+ #Conjunction #Verb").terms();
		verbs = verbs.not(list);
		if (verbs.found) verbs.verbs().toPastTense();
	}
	return s;
};
//#endregion
//#region node_modules/compromise/src/3-three/sentences/conjugate/toPresent.js
var toPresent$1 = function(s) {
	let verbs = s.verbs();
	verbs.eq(0).toPresentTense();
	if (verbs.length > 1) {
		verbs = verbs.slice(1);
		verbs = verbs.filter((v) => !v.lookBehind("to$").found);
		verbs = verbs.notIf("#Gerund");
		if (verbs.found) verbs.verbs().toPresentTense();
	}
	return s;
};
//#endregion
//#region node_modules/compromise/src/3-three/sentences/conjugate/toFuture.js
var toFuture$1 = function(s) {
	let verbs = s.verbs();
	verbs.eq(0).toFutureTense();
	s = s.fullSentence();
	verbs = s.verbs();
	if (verbs.length > 1) {
		verbs = verbs.slice(1);
		const toChange = verbs.filter((vb) => {
			if (vb.lookBehind("to$").found) return false;
			if (vb.has("#Copula #Gerund")) return true;
			if (vb.has("#Gerund")) return false;
			if (vb.has("#Copula")) return true;
			if (vb.has("#PresentTense") && !vb.has("#Infinitive") && vb.lookBefore("(he|she|it|that|which)$").found) return false;
			return true;
		});
		if (toChange.found) toChange.forEach((m) => {
			if (m.has("#Copula")) {
				m.match("was").replaceWith("is");
				m.match("is").replaceWith("will be");
				return;
			}
			m.toInfinitive();
		});
	}
	return s;
};
//#endregion
//#region node_modules/compromise/src/3-three/sentences/conjugate/toNegative.js
var toNegative$1 = function(s) {
	s.verbs().first().toNegative().compute("chunks");
	return s;
};
var toPositive = function(s) {
	s.verbs().first().toPositive().compute("chunks");
	return s;
};
//#endregion
//#region node_modules/compromise/src/3-three/sentences/conjugate/toInfinitive.js
var toInfinitive = function(s) {
	s.verbs().toInfinitive();
	return s;
};
//#endregion
//#region node_modules/compromise/src/3-three/sentences/api.js
var api$5 = function(View) {
	class Sentences extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Sentences";
		}
		json(opts = {}) {
			return this.map((m) => {
				const json = m.toView().json(opts)[0] || {};
				const { subj, verb, pred, grammar } = parse$1(m);
				json.sentence = {
					subject: subj.text("normal"),
					verb: verb.text("normal"),
					predicate: pred.text("normal"),
					grammar
				};
				return json;
			}, []);
		}
		toPastTense(n) {
			return this.getNth(n).map((s) => {
				return toPast$2(s, parse$1(s));
			});
		}
		toPresentTense(n) {
			return this.getNth(n).map((s) => {
				return toPresent$1(s, parse$1(s));
			});
		}
		toFutureTense(n) {
			return this.getNth(n).map((s) => {
				const parsed = parse$1(s);
				s = toFuture$1(s, parsed);
				return s;
			});
		}
		toInfinitive(n) {
			return this.getNth(n).map((s) => {
				return toInfinitive(s, parse$1(s));
			});
		}
		toNegative(n) {
			return this.getNth(n).map((vb) => {
				return toNegative$1(vb, parse$1(vb));
			});
		}
		toPositive(n) {
			return this.getNth(n).map((vb) => {
				return toPositive(vb, parse$1(vb));
			});
		}
		isQuestion(n) {
			return this.questions(n);
		}
		isExclamation(n) {
			return this.filter((s) => s.lastTerm().has("@hasExclamation")).getNth(n);
		}
		isStatement(n) {
			return this.filter((s) => !s.isExclamation().found && !s.isQuestion().found).getNth(n);
		}
		update(pointer) {
			const m = new Sentences(this.document, pointer);
			m._cache = this._cache;
			return m;
		}
	}
	Sentences.prototype.toPresent = Sentences.prototype.toPresentTense;
	Sentences.prototype.toPast = Sentences.prototype.toPastTense;
	Sentences.prototype.toFuture = Sentences.prototype.toFutureTense;
	Object.assign(View.prototype, {
		sentences: function(n) {
			let m = this.map((s) => s.fullSentence());
			m = m.getNth(n);
			return new Sentences(this.document, m.pointer);
		},
		questions: function(n) {
			return findQuestions(this).getNth(n);
		}
	});
};
//#endregion
//#region node_modules/compromise/src/3-three/sentences/plugin.js
var plugin_default$3 = { api: api$5 };
//#endregion
//#region node_modules/compromise/src/3-three/topics/people/find.js
var find$2 = function(doc) {
	let m = doc.splitAfter("@hasComma");
	m = m.match("#Honorific+? #Person+");
	const poss = m.match("#Possessive").notIf("(his|her)");
	m = m.splitAfter(poss);
	return m;
};
//#endregion
//#region node_modules/compromise/src/3-three/topics/people/parse.js
var parse = function(m) {
	const res = {};
	res.firstName = m.match("#FirstName+");
	res.lastName = m.match("#LastName+");
	res.honorific = m.match("#Honorific+");
	const last = res.lastName;
	const first = res.firstName;
	if (!first.found || !last.found) {
		if (!first.found && !last.found && m.has("^#Honorific .$")) {
			res.lastName = m.match(".$");
			return res;
		}
	}
	return res;
};
//#endregion
//#region node_modules/compromise/src/3-three/topics/people/gender.js
var m = "male";
var f = "female";
var honorifics = {
	mr: m,
	mrs: f,
	miss: f,
	madam: f,
	king: m,
	queen: f,
	duke: m,
	duchess: f,
	baron: m,
	baroness: f,
	count: m,
	countess: f,
	prince: m,
	princess: f,
	sire: m,
	dame: f,
	lady: f,
	ayatullah: m,
	congressman: m,
	congresswoman: f,
	"first lady": f,
	mx: null
};
var predictGender = function(parsed, person) {
	const { firstName, honorific } = parsed;
	if (firstName.has("#FemaleName")) return f;
	if (firstName.has("#MaleName")) return m;
	if (honorific.found) {
		let hon = honorific.text("normal");
		hon = hon.replace(/\./g, "");
		if (honorifics.hasOwnProperty(hon)) return honorifics[hon];
		if (/^her /.test(hon)) return f;
		if (/^his /.test(hon)) return m;
	}
	const after = person.after();
	if (!after.has("#Person") && after.has("#Pronoun")) {
		const pro = after.match("#Pronoun");
		if (pro.has("(they|their)")) return null;
		const hasMasc = pro.has("(he|his)");
		const hasFem = pro.has("(she|her|hers)");
		if (hasMasc && !hasFem) return m;
		if (hasFem && !hasMasc) return f;
	}
	return null;
};
//#endregion
//#region node_modules/compromise/src/3-three/topics/people/api.js
var addMethod$1 = function(View) {
	/**
	*
	*/
	class People extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "People";
		}
		parse(n) {
			return this.getNth(n).map(parse);
		}
		json(n) {
			const opts = typeof n === "object" ? n : {};
			return this.getNth(n).map((p) => {
				const json = p.toView().json(opts)[0];
				const parsed = parse(p);
				json.person = {
					firstName: parsed.firstName.text("normal"),
					lastName: parsed.lastName.text("normal"),
					honorific: parsed.honorific.text("normal"),
					presumed_gender: predictGender(parsed, p)
				};
				return json;
			}, []);
		}
		presumedMale() {
			return this.filter((m) => {
				return m.has("(#MaleName|mr|mister|sr|jr|king|pope|prince|sir)");
			});
		}
		presumedFemale() {
			return this.filter((m) => {
				return m.has("(#FemaleName|mrs|miss|queen|princess|madam)");
			});
		}
		update(pointer) {
			const m = new People(this.document, pointer);
			m._cache = this._cache;
			return m;
		}
	}
	View.prototype.people = function(n) {
		let m = find$2(this);
		m = m.getNth(n);
		return new People(this.document, m.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/topics/places/find.js
var find$1 = function(doc) {
	let m = doc.match("(#Place|#Address)+");
	let splits = m.match("@hasComma");
	splits = splits.filter((c) => {
		if (c.has("(asia|africa|europe|america)$")) return true;
		if (c.has("(#City|#Region|#ProperNoun)$") && c.after("^(#Country|#Region)").found) return false;
		return true;
	});
	m = m.splitAfter(splits);
	return m;
};
//#endregion
//#region node_modules/compromise/src/3-three/topics/places/api.js
var addMethod = function(View) {
	View.prototype.places = function(n) {
		let m = find$1(this);
		m = m.getNth(n);
		return new View(this.document, m.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/topics/orgs/api.js
var api$4 = function(View) {
	View.prototype.organizations = function(n) {
		return this.match("#Organization+").getNth(n);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/topics/topics.js
var find = function(n) {
	const r = this.clauses();
	let m = r.people();
	m = m.concat(r.places());
	m = m.concat(r.organizations());
	m = m.not("(someone|man|woman|mother|brother|sister|father)");
	m = m.sort("seq");
	m = m.getNth(n);
	return m;
};
var api$3 = function(View) {
	View.prototype.topics = find;
};
//#endregion
//#region node_modules/compromise/src/3-three/topics/plugin.js
var api$2 = function(View) {
	addMethod$1(View);
	addMethod(View);
	api$4(View);
	api$3(View);
};
var plugin_default$2 = { api: api$2 };
//#endregion
//#region node_modules/compromise/src/3-three/verbs/find.js
var findVerbs = function(doc) {
	let m = doc.match("<Verb>");
	m = m.not("#Conjunction");
	m = m.not("#Preposition");
	m = m.splitAfter("@hasComma");
	m = m.splitAfter("[(do|did|am|was|is|will)] (is|was)", 0);
	m = m.splitBefore("(#Verb && !#Copula) [being] #Verb", 0);
	m = m.splitBefore("#Verb [to be] #Verb", 0);
	m = m.splitAfter("[help] #PresentTense", 0);
	m = m.splitBefore("(#PresentTense|#PastTense) [#Copula]$", 0);
	m = m.splitBefore("(#PresentTense|#PastTense) [will be]$", 0);
	m = m.splitBefore("(#PresentTense|#PastTense) [(had|has)]", 0);
	m = m.not("#Reflexive$");
	m = m.not("#Adjective");
	m = m.splitAfter("[#PastTense] #PastTense", 0);
	m = m.splitAfter("[#PastTense] #Auxiliary+ #PastTense", 0);
	m = m.splitAfter("#Copula [#Gerund] #PastTense", 0);
	m = m.if("#Verb");
	if (m.has("(#Verb && !#Auxiliary) #Adverb+? #Copula")) m = m.splitBefore("#Copula");
	return m;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/parse/root.js
var getMain = function(vb) {
	let root = vb;
	if (vb.wordCount() > 1) root = vb.not("(#Negative|#Auxiliary|#Modal|#Adverb|#Prefix)");
	if (root.length > 1 && !root.has("#Phrasal #Particle")) root = root.last();
	root = root.not("(want|wants|wanted) to");
	if (!root.found) {
		root = vb.not("#Negative");
		return root;
	}
	return root;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/parse/adverbs.js
var getAdverbs = function(vb, root) {
	const res = {
		pre: vb.none(),
		post: vb.none()
	};
	if (!vb.has("#Adverb")) return res;
	const parts = vb.splitOn(root);
	if (parts.length === 3) return {
		pre: parts.eq(0).adverbs(),
		post: parts.eq(2).adverbs()
	};
	if (parts.eq(0).isDoc(root)) {
		res.post = parts.eq(1).adverbs();
		return res;
	}
	res.pre = parts.eq(0).adverbs();
	return res;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/parse/index.js
var getAuxiliary = function(vb, root) {
	const parts = vb.splitBefore(root);
	if (parts.length <= 1) return vb.none();
	let aux = parts.eq(0);
	aux = aux.not("(#Adverb|#Negative|#Prefix)");
	return aux;
};
var getNegative = function(vb) {
	return vb.match("#Negative");
};
var getPhrasal = function(root) {
	if (!root.has("(#Particle|#PhrasalVerb)")) return {
		verb: root.none(),
		particle: root.none()
	};
	const particle = root.match("#Particle$");
	return {
		verb: root.not(particle),
		particle
	};
};
var parseVerb = function(view) {
	const vb = view.clone();
	vb.contractions().expand();
	const root = getMain(vb);
	return {
		root,
		prefix: vb.match("#Prefix"),
		adverbs: getAdverbs(vb, root),
		auxiliary: getAuxiliary(vb, root),
		negative: getNegative(vb),
		phrasal: getPhrasal(root)
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/parse/grammar/forms.js
var present = { tense: "PresentTense" };
var conditional = { conditional: true };
var future = { tense: "FutureTense" };
var prog = { progressive: true };
var past = { tense: "PastTense" };
var complete = {
	complete: true,
	progressive: false
};
var passive = { passive: true };
var plural = { plural: true };
var singular = { plural: false };
var getData = function(tags) {
	const data = {};
	tags.forEach((o) => {
		Object.assign(data, o);
	});
	return data;
};
var verbForms = {
	"imperative": [["#Imperative", []]],
	"want-infinitive": [
		["^(want|wants|wanted) to #Infinitive$", [present]],
		["^wanted to #Infinitive$", [past]],
		["^will want to #Infinitive$", [future]]
	],
	"gerund-phrase": [
		["^#PastTense #Gerund$", [past]],
		["^#PresentTense #Gerund$", [present]],
		["^#Infinitive #Gerund$", [present]],
		["^will #Infinitive #Gerund$", [future]],
		["^have #PastTense #Gerund$", [past]],
		["^will have #PastTense #Gerund$", [past]]
	],
	"simple-present": [["^#PresentTense$", [present]], ["^#Infinitive$", [present]]],
	"simple-past": [["^#PastTense$", [past]]],
	"simple-future": [["^will #Adverb? #Infinitive", [future]]],
	"present-progressive": [["^(is|are|am) #Gerund$", [present, prog]]],
	"past-progressive": [["^(was|were) #Gerund$", [past, prog]]],
	"future-progressive": [["^will be #Gerund$", [future, prog]]],
	"present-perfect": [["^(has|have) #PastTense$", [past, complete]]],
	"past-perfect": [["^had #PastTense$", [past, complete]], ["^had #PastTense to #Infinitive", [past, complete]]],
	"future-perfect": [["^will have #PastTense$", [future, complete]]],
	"present-perfect-progressive": [["^(has|have) been #Gerund$", [past, prog]]],
	"past-perfect-progressive": [["^had been #Gerund$", [past, prog]]],
	"future-perfect-progressive": [["^will have been #Gerund$", [future, prog]]],
	"passive-past": [
		["(got|were|was) #Passive", [past, passive]],
		["^(was|were) being #Passive", [past, passive]],
		["^(had|have) been #Passive", [past, passive]]
	],
	"passive-present": [
		["^(is|are|am) #Passive", [present, passive]],
		["^(is|are|am) being #Passive", [present, passive]],
		["^has been #Passive", [present, passive]]
	],
	"passive-future": [["will have been #Passive", [
		future,
		passive,
		conditional
	]], ["will be being? #Passive", [
		future,
		passive,
		conditional
	]]],
	"present-conditional": [["would be #PastTense", [present, conditional]]],
	"past-conditional": [["would have been #PastTense", [past, conditional]]],
	"auxiliary-future": [["(is|are|am|was) going to (#Infinitive|#PresentTense)", [future]]],
	"auxiliary-past": [["^did #Infinitive$", [past, singular]], ["^used to #Infinitive$", [past, complete]]],
	"auxiliary-present": [["^(does|do) #Infinitive$", [
		present,
		complete,
		plural
	]]],
	"modal-past": [["^(could|must|should|shall) have #PastTense$", [past]]],
	"modal-infinitive": [["^#Modal #Infinitive$", []]],
	"infinitive": [["^#Infinitive$", []]]
};
var list = [];
Object.keys(verbForms).map((k) => {
	verbForms[k].forEach((a) => {
		list.push({
			name: k,
			match: a[0],
			data: getData(a[1])
		});
	});
});
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/parse/grammar/index.js
var cleanUp = function(vb, res) {
	vb = vb.clone();
	if (res.adverbs.post && res.adverbs.post.found) vb.remove(res.adverbs.post);
	if (res.adverbs.pre && res.adverbs.pre.found) vb.remove(res.adverbs.pre);
	if (vb.has("#Negative")) vb = vb.remove("#Negative");
	if (vb.has("#Prefix")) vb = vb.remove("#Prefix");
	if (res.root.has("#PhrasalVerb #Particle")) vb.remove("#Particle$");
	vb = vb.not("#Adverb");
	return vb;
};
var isInfinitive = function(vb) {
	if (vb.has("#Infinitive")) {
		if (vb.growLeft("to").has("^to #Infinitive")) return true;
	}
	return false;
};
var getGrammar = function(vb, res) {
	const grammar = {};
	vb = cleanUp(vb, res);
	for (let i = 0; i < list.length; i += 1) {
		const todo = list[i];
		if (vb.has(todo.match) === true) {
			grammar.form = todo.name;
			Object.assign(grammar, todo.data);
			break;
		}
	}
	if (!grammar.form) {
		if (vb.has("^#Verb$")) grammar.form = "infinitive";
	}
	if (!grammar.tense) grammar.tense = res.root.has("#PastTense") ? "PastTense" : "PresentTense";
	grammar.copula = res.root.has("#Copula");
	grammar.isInfinitive = isInfinitive(vb);
	return grammar;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/parse/getSubject.js
var shouldSkip = function(last) {
	if (last.length <= 1) return false;
	return (last.parse()[0] || {}).isSubordinate;
};
var noSubClause = function(before) {
	let parts = before.clauses();
	parts = parts.filter((m, i) => {
		if (m.has("^(if|unless|while|but|for|per|at|by|that|which|who|from)")) return false;
		if (i > 0 && m.has("^#Verb . #Noun+$")) return false;
		if (i > 0 && m.has("^#Adverb")) return false;
		return true;
	});
	if (parts.length === 0) return before;
	return parts;
};
var lastNoun = function(vb) {
	let before = vb.before();
	before = noSubClause(before);
	const nouns = before.nouns();
	let last = nouns.last();
	const pronoun = last.match("(i|he|she|we|you|they)");
	if (pronoun.found) return pronoun.nouns();
	let det = nouns.if("^(that|this|those)");
	if (det.found) return det;
	if (nouns.found === false) {
		det = before.match("^(that|this|those)");
		if (det.found) return det;
	}
	last = nouns.last();
	if (shouldSkip(last)) {
		nouns.remove(last);
		last = nouns.last();
	}
	if (shouldSkip(last)) {
		nouns.remove(last);
		last = nouns.last();
	}
	return last;
};
var isPlural$1 = function(subj, vb) {
	if (vb.has("(are|were|does)")) return true;
	if (subj.has("(those|they|we)")) return true;
	if (subj.found && subj.isPlural) return subj.isPlural().found;
	return false;
};
var getSubject = function(vb) {
	const subj = lastNoun(vb);
	return {
		subject: subj,
		plural: isPlural$1(subj, vb)
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/lib.js
var noop = (vb) => vb;
var isPlural = (vb, parsed) => {
	const subj = getSubject(vb, parsed);
	const m = subj.subject;
	if (m.has("i") || m.has("we")) return true;
	return subj.plural;
};
var wasWere = (vb, parsed) => {
	const { subject, plural } = getSubject(vb, parsed);
	if (plural || subject.has("we")) return "were";
	return "was";
};
var isAreAm = function(vb, parsed) {
	if (vb.has("were")) return "are";
	const { subject, plural } = getSubject(vb, parsed);
	if (subject.has("i")) return "am";
	if (subject.has("we") || plural) return "are";
	return "is";
};
var doDoes = function(vb, parsed) {
	const subj = getSubject(vb, parsed);
	const m = subj.subject;
	if (m.has("i") || m.has("we")) return "do";
	if (subj.plural) return "do";
	return "does";
};
var getTense = function(m) {
	if (m.has("#Infinitive")) return "Infinitive";
	if (m.has("#Participle")) return "Participle";
	if (m.has("#PastTense")) return "PastTense";
	if (m.has("#Gerund")) return "Gerund";
	if (m.has("#PresentTense")) return "PresentTense";
};
var toInf$2 = function(vb, parsed) {
	const { toInfinitive } = vb.methods.two.transform.verb;
	let str = parsed.root.text({ keepPunct: false });
	str = toInfinitive(str, vb.model, getTense(vb));
	if (str) vb.replace(parsed.root, str);
	return vb;
};
var noWill = (vb) => {
	if (vb.has("will not")) return vb.replace("will not", "have not");
	return vb.remove("will");
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/toJSON.js
var toArray = function(m) {
	if (!m || !m.isView) return [];
	return m.json({
		normal: true,
		terms: false,
		text: false
	}).map((s) => s.normal);
};
var toText = function(m) {
	if (!m || !m.isView) return "";
	return m.text("normal");
};
var toInf$1 = function(root) {
	const { toInfinitive } = root.methods.two.transform.verb;
	return toInfinitive(root.text("normal"), root.model, getTense(root));
};
var toJSON = function(vb) {
	const parsed = parseVerb(vb);
	vb = vb.clone().toView();
	const info = getGrammar(vb, parsed);
	return {
		root: parsed.root.text(),
		preAdverbs: toArray(parsed.adverbs.pre),
		postAdverbs: toArray(parsed.adverbs.post),
		auxiliary: toText(parsed.auxiliary),
		negative: parsed.negative.found,
		prefix: toText(parsed.prefix),
		infinitive: toInf$1(parsed.root),
		grammar: info
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/conjugate/toInfinitive.js
var keep$5 = { tags: true };
var toInf = function(vb, parsed) {
	const { toInfinitive } = vb.methods.two.transform.verb;
	const { root, auxiliary } = parsed;
	const aux = auxiliary.terms().harden();
	let str = root.text("normal");
	str = toInfinitive(str, vb.model, getTense(root));
	if (str) vb.replace(root, str, keep$5).tag("Verb").firstTerm().tag("Infinitive");
	if (aux.found) vb.remove(aux);
	if (parsed.negative.found) {
		if (!vb.has("not")) vb.prepend("not");
		const does = doDoes(vb, parsed);
		vb.prepend(does);
	}
	vb.fullSentence().compute([
		"freeze",
		"lexicon",
		"preTagger",
		"postTagger",
		"unfreeze",
		"chunks"
	]);
	return vb;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/conjugate/toPast.js
var keep$4 = { tags: true };
var fns = {
	noAux: (vb, parsed) => {
		if (parsed.auxiliary.found) vb = vb.remove(parsed.auxiliary);
		return vb;
	},
	simple: (vb, parsed) => {
		const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
		const root = parsed.root;
		if (root.has("#Modal")) return vb;
		let str = root.text({ keepPunct: false });
		str = toInfinitive(str, vb.model, getTense(root));
		str = conjugate(str, vb.model).PastTense;
		str = str === "been" ? "was" : str;
		if (str === "was") str = wasWere(vb, parsed);
		if (str) vb.replace(root, str, keep$4);
		return vb;
	},
	both: function(vb, parsed) {
		if (parsed.negative.found) {
			vb.replace("will", "did");
			return vb;
		}
		vb = fns.simple(vb, parsed);
		vb = fns.noAux(vb, parsed);
		return vb;
	},
	hasHad: (vb) => {
		vb.replace("has", "had", keep$4);
		return vb;
	},
	hasParticiple: (vb, parsed) => {
		const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
		const root = parsed.root;
		let str = root.text("normal");
		str = toInfinitive(str, vb.model, getTense(root));
		return conjugate(str, vb.model).Participle;
	}
};
var forms$4 = {
	"infinitive": fns.simple,
	"simple-present": fns.simple,
	"simple-past": noop,
	"simple-future": fns.both,
	"present-progressive": (vb) => {
		vb.replace("are", "were", keep$4);
		vb.replace("(is|are|am)", "was", keep$4);
		return vb;
	},
	"past-progressive": noop,
	"future-progressive": (vb, parsed) => {
		vb.match(parsed.root).insertBefore("was");
		vb.remove("(will|be)");
		return vb;
	},
	"present-perfect": fns.hasHad,
	"past-perfect": noop,
	"future-perfect": (vb, parsed) => {
		vb.match(parsed.root).insertBefore("had");
		if (vb.has("will")) vb = noWill(vb);
		vb.remove("have");
		return vb;
	},
	"present-perfect-progressive": fns.hasHad,
	"past-perfect-progressive": noop,
	"future-perfect-progressive": (vb) => {
		vb.remove("will");
		vb.replace("have", "had", keep$4);
		return vb;
	},
	"passive-past": (vb) => {
		vb.replace("have", "had", keep$4);
		return vb;
	},
	"passive-present": (vb) => {
		vb.replace("(is|are)", "was", keep$4);
		return vb;
	},
	"passive-future": (vb, parsed) => {
		if (parsed.auxiliary.has("will be")) {
			vb.match(parsed.root).insertBefore("had been");
			vb.remove("(will|be)");
		}
		if (parsed.auxiliary.has("will have been")) {
			vb.replace("have", "had", keep$4);
			vb.remove("will");
		}
		return vb;
	},
	"present-conditional": (vb) => {
		vb.replace("be", "have been");
		return vb;
	},
	"past-conditional": noop,
	"auxiliary-future": (vb) => {
		vb.replace("(is|are|am)", "was", keep$4);
		return vb;
	},
	"auxiliary-past": noop,
	"auxiliary-present": (vb) => {
		vb.replace("(do|does)", "did", keep$4);
		return vb;
	},
	"modal-infinitive": (vb, parsed) => {
		if (vb.has("can")) vb.replace("can", "could", keep$4);
		else {
			fns.simple(vb, parsed);
			vb.match("#Modal").insertAfter("have").tag("Auxiliary");
		}
		return vb;
	},
	"modal-past": noop,
	"want-infinitive": (vb) => {
		vb.replace("(want|wants)", "wanted", keep$4);
		vb.remove("will");
		return vb;
	},
	"gerund-phrase": (vb, parsed) => {
		parsed.root = parsed.root.not("#Gerund$");
		fns.simple(vb, parsed);
		noWill(vb);
		return vb;
	}
};
var toPast$1 = function(vb, parsed, form) {
	if (forms$4.hasOwnProperty(form)) {
		vb = forms$4[form](vb, parsed);
		vb.fullSentence().compute(["tagger", "chunks"]);
		return vb;
	}
	return vb;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/conjugate/toParticiple.js
var haveHas = function(vb, parsed) {
	const subj = getSubject(vb, parsed);
	const m = subj.subject;
	if (m.has("(i|we|you)")) return "have";
	if (subj.plural === false) return "has";
	if (m.has("he") || m.has("she") || m.has("#Person")) return "has";
	return "have";
};
var simple$2 = (vb, parsed) => {
	const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
	const { root, auxiliary } = parsed;
	if (root.has("#Modal")) return vb;
	let str = root.text({ keepPunct: false });
	str = toInfinitive(str, vb.model, getTense(root));
	const all = conjugate(str, vb.model);
	str = all.Participle || all.PastTense;
	if (str) {
		vb = vb.replace(root, str);
		const have = haveHas(vb, parsed);
		vb.prepend(have).match(have).tag("Auxiliary");
		vb.remove(auxiliary);
	}
	return vb;
};
var forms$3 = {
	"infinitive": simple$2,
	"simple-present": simple$2,
	"simple-future": (vb, parsed) => vb.replace("will", haveHas(vb, parsed)),
	"present-perfect": noop,
	"past-perfect": noop,
	"future-perfect": (vb, parsed) => vb.replace("will have", haveHas(vb, parsed)),
	"present-perfect-progressive": noop,
	"past-perfect-progressive": noop,
	"future-perfect-progressive": noop
};
var toPast = function(vb, parsed, form) {
	if (forms$3.hasOwnProperty(form)) {
		vb = forms$3[form](vb, parsed);
		vb.fullSentence().compute(["tagger", "chunks"]);
		return vb;
	}
	vb = simple$2(vb, parsed, form);
	vb.fullSentence().compute(["tagger", "chunks"]);
	return vb;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/conjugate/toPresent.js
var keep$3 = { tags: true };
var simple$1 = (vb, parsed) => {
	const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
	const root = parsed.root;
	let str = root.text("normal");
	str = toInfinitive(str, vb.model, getTense(root));
	if (isPlural(vb, parsed) === false) str = conjugate(str, vb.model).PresentTense;
	if (root.has("#Copula")) str = isAreAm(vb, parsed);
	if (str) {
		vb = vb.replace(root, str, keep$3);
		vb.not("#Particle").tag("PresentTense");
	}
	return vb;
};
var toGerund$1 = (vb, parsed) => {
	const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
	const root = parsed.root;
	let str = root.text("normal");
	str = toInfinitive(str, vb.model, getTense(root));
	if (isPlural(vb, parsed) === false) str = conjugate(str, vb.model).Gerund;
	if (str) {
		vb = vb.replace(root, str, keep$3);
		vb.not("#Particle").tag("Gerund");
	}
	return vb;
};
var vbToInf = (vb, parsed) => {
	const { toInfinitive } = vb.methods.two.transform.verb;
	const root = parsed.root;
	let str = parsed.root.text("normal");
	str = toInfinitive(str, vb.model, getTense(root));
	if (str) vb = vb.replace(parsed.root, str, keep$3);
	return vb;
};
var forms$2 = {
	"infinitive": simple$1,
	"simple-present": (vb, parsed) => {
		const { conjugate } = vb.methods.two.transform.verb;
		const { root } = parsed;
		if (root.has("#Infinitive")) {
			const m = getSubject(vb, parsed).subject;
			if (isPlural(vb, parsed) || m.has("i")) return vb;
			const str = root.text("normal");
			const pres = conjugate(str, vb.model).PresentTense;
			if (str !== pres) vb.replace(root, pres, keep$3);
		} else return simple$1(vb, parsed);
		return vb;
	},
	"simple-past": simple$1,
	"simple-future": (vb, parsed) => {
		const { root, auxiliary } = parsed;
		if (auxiliary.has("will") && root.has("be")) {
			const str = isAreAm(vb, parsed);
			vb.replace(root, str);
			vb = vb.remove("will");
			vb.replace("not " + str, str + " not");
		} else {
			simple$1(vb, parsed);
			vb = vb.remove("will");
		}
		return vb;
	},
	"present-progressive": noop,
	"past-progressive": (vb, parsed) => {
		const str = isAreAm(vb, parsed);
		return vb.replace("(were|was)", str, keep$3);
	},
	"future-progressive": (vb) => {
		vb.match("will").insertBefore("is");
		vb.remove("be");
		return vb.remove("will");
	},
	"present-perfect": (vb, parsed) => {
		simple$1(vb, parsed);
		vb = vb.remove("(have|had|has)");
		return vb;
	},
	"past-perfect": (vb, parsed) => {
		const m = getSubject(vb, parsed).subject;
		if (isPlural(vb, parsed) || m.has("i")) {
			vb = toInf$2(vb, parsed);
			vb.remove("had");
			return vb;
		}
		vb.replace("had", "has", keep$3);
		return vb;
	},
	"future-perfect": (vb) => {
		vb.match("will").insertBefore("has");
		return vb.remove("have").remove("will");
	},
	"present-perfect-progressive": noop,
	"past-perfect-progressive": (vb) => vb.replace("had", "has", keep$3),
	"future-perfect-progressive": (vb) => {
		vb.match("will").insertBefore("has");
		return vb.remove("have").remove("will");
	},
	"passive-past": (vb, parsed) => {
		const str = isAreAm(vb, parsed);
		if (vb.has("(had|have|has)") && vb.has("been")) {
			vb.replace("(had|have|has)", str, keep$3);
			vb.replace("been", "being");
			return vb;
		}
		return vb.replace("(got|was|were)", str);
	},
	"passive-present": noop,
	"passive-future": (vb) => {
		vb.replace("will", "is");
		return vb.replace("be", "being");
	},
	"present-conditional": noop,
	"past-conditional": (vb) => {
		vb.replace("been", "be");
		return vb.remove("have");
	},
	"auxiliary-future": (vb, parsed) => {
		toGerund$1(vb, parsed);
		vb.remove("(going|to)");
		return vb;
	},
	"auxiliary-past": (vb, parsed) => {
		if (parsed.auxiliary.has("did")) {
			const str = doDoes(vb, parsed);
			vb.replace(parsed.auxiliary, str);
			return vb;
		}
		toGerund$1(vb, parsed);
		vb.replace(parsed.auxiliary, "is");
		return vb;
	},
	"auxiliary-present": noop,
	"modal-infinitive": noop,
	"modal-past": (vb, parsed) => {
		vbToInf(vb, parsed);
		return vb.remove("have");
	},
	"gerund-phrase": (vb, parsed) => {
		parsed.root = parsed.root.not("#Gerund$");
		simple$1(vb, parsed);
		return vb.remove("(will|have)");
	},
	"want-infinitive": (vb, parsed) => {
		let str = "wants";
		if (isPlural(vb, parsed)) str = "want";
		vb.replace("(want|wanted|wants)", str, keep$3);
		vb.remove("will");
		return vb;
	}
};
var toPresent = function(vb, parsed, form) {
	if (forms$2.hasOwnProperty(form)) {
		vb = forms$2[form](vb, parsed);
		vb.fullSentence().compute(["tagger", "chunks"]);
		return vb;
	}
	return vb;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/conjugate/toFuture.js
var keep$2 = { tags: true };
var simple = (vb, parsed) => {
	const { toInfinitive } = vb.methods.two.transform.verb;
	const { root, auxiliary } = parsed;
	if (root.has("#Modal")) return vb;
	let str = root.text("normal");
	str = toInfinitive(str, vb.model, getTense(root));
	if (str) {
		vb = vb.replace(root, str, keep$2);
		vb.not("#Particle").tag("Verb");
	}
	vb.prepend("will").match("will").tag("Auxiliary");
	vb.remove(auxiliary);
	return vb;
};
var progressive = (vb, parsed) => {
	const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
	const { root, auxiliary } = parsed;
	let str = root.text("normal");
	str = toInfinitive(str, vb.model, getTense(root));
	if (str) {
		str = conjugate(str, vb.model).Gerund;
		vb.replace(root, str, keep$2);
		vb.not("#Particle").tag("PresentTense");
	}
	vb.remove(auxiliary);
	vb.prepend("will be").match("will be").tag("Auxiliary");
	return vb;
};
var forms$1 = {
	"infinitive": simple,
	"simple-present": simple,
	"simple-past": simple,
	"simple-future": noop,
	"present-progressive": progressive,
	"past-progressive": progressive,
	"future-progressive": noop,
	"present-perfect": (vb) => {
		vb.match("(have|has)").replaceWith("will have");
		return vb;
	},
	"past-perfect": (vb) => vb.replace("(had|has)", "will have"),
	"future-perfect": noop,
	"present-perfect-progressive": (vb) => vb.replace("has", "will have"),
	"past-perfect-progressive": (vb) => vb.replace("had", "will have"),
	"future-perfect-progressive": noop,
	"passive-past": (vb) => {
		if (vb.has("got")) return vb.replace("got", "will get");
		if (vb.has("(was|were)")) {
			vb.replace("(was|were)", "will be");
			return vb.remove("being");
		}
		if (vb.has("(have|has|had) been")) return vb.replace("(have|has|had) been", "will be");
		return vb;
	},
	"passive-present": (vb) => {
		vb.replace("being", "will be");
		vb.remove("(is|are|am)");
		return vb;
	},
	"passive-future": noop,
	"present-conditional": (vb) => vb.replace("would", "will"),
	"past-conditional": (vb) => vb.replace("would", "will"),
	"auxiliary-future": noop,
	"auxiliary-past": (vb) => {
		if (vb.has("used") && vb.has("to")) {
			vb.replace("used", "will");
			return vb.remove("to");
		}
		vb.replace("did", "will");
		return vb;
	},
	"auxiliary-present": (vb) => {
		return vb.replace("(do|does)", "will");
	},
	"modal-infinitive": noop,
	"modal-past": noop,
	"gerund-phrase": (vb, parsed) => {
		parsed.root = parsed.root.not("#Gerund$");
		simple(vb, parsed);
		return vb.remove("(had|have)");
	},
	"want-infinitive": (vb) => {
		vb.replace("(want|wants|wanted)", "will want");
		return vb;
	}
};
var toFuture = function(vb, parsed, form) {
	if (vb.has("will") || vb.has("going to")) return vb;
	if (forms$1.hasOwnProperty(form)) {
		vb = forms$1[form](vb, parsed);
		vb.fullSentence().compute(["tagger", "chunks"]);
		return vb;
	}
	return vb;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/conjugate/toGerund.js
var keep$1 = { tags: true };
var toGerund = function(vb, parsed) {
	const { toInfinitive, conjugate } = vb.methods.two.transform.verb;
	const { root, auxiliary } = parsed;
	if (vb.has("#Gerund")) return vb;
	let str = root.text("normal");
	str = toInfinitive(str, vb.model, getTense(root));
	const gerund = conjugate(str, vb.model).Gerund;
	if (gerund) {
		const aux = isAreAm(vb, parsed);
		vb.replace(root, gerund, keep$1);
		vb.remove(auxiliary);
		vb.prepend(aux);
	}
	vb.replace("not is", "is not");
	vb.replace("not are", "are not");
	vb.fullSentence().compute(["tagger", "chunks"]);
	return vb;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/conjugate/toNegative.js
var keep = { tags: true };
var doesNot = function(vb, parsed) {
	const does = doDoes(vb, parsed);
	vb.prepend(does + " not");
	return vb;
};
var isWas = function(vb) {
	let m = vb.match("be");
	if (m.found) {
		m.prepend("not");
		return vb;
	}
	m = vb.match("(is|was|am|are|will|were)");
	if (m.found) {
		m.append("not");
		return vb;
	}
	return vb;
};
var hasCopula = (vb) => vb.has("(is|was|am|are|will|were|be)");
var forms = {
	"simple-present": (vb, parsed) => {
		if (hasCopula(vb) === true) return isWas(vb, parsed);
		vb = toInf$2(vb, parsed);
		vb = doesNot(vb, parsed);
		return vb;
	},
	"simple-past": (vb, parsed) => {
		if (hasCopula(vb) === true) return isWas(vb, parsed);
		vb = toInf$2(vb, parsed);
		vb.prepend("did not");
		return vb;
	},
	"imperative": (vb) => {
		vb.prepend("do not");
		return vb;
	},
	"infinitive": (vb, parsed) => {
		if (hasCopula(vb) === true) return isWas(vb, parsed);
		return doesNot(vb, parsed);
	},
	"passive-past": (vb) => {
		if (vb.has("got")) {
			vb.replace("got", "get", keep);
			vb.prepend("did not");
			return vb;
		}
		const m = vb.match("(was|were|had|have)");
		if (m.found) m.append("not");
		return vb;
	},
	"auxiliary-past": (vb) => {
		if (vb.has("used")) {
			vb.prepend("did not");
			return vb;
		}
		const m = vb.match("(did|does|do)");
		if (m.found) m.append("not");
		return vb;
	},
	"want-infinitive": (vb, parsed) => {
		vb = doesNot(vb, parsed);
		vb = vb.replace("wants", "want", keep);
		return vb;
	}
};
var toNegative = function(vb, parsed, form) {
	if (vb.has("#Negative")) return vb;
	if (forms.hasOwnProperty(form)) {
		vb = forms[form](vb, parsed);
		return vb;
	}
	let m = vb.matchOne("be");
	if (m.found) {
		m.prepend("not");
		return vb;
	}
	if (hasCopula(vb) === true) return isWas(vb, parsed);
	m = vb.matchOne("(will|had|have|has|did|does|do|#Modal)");
	if (m.found) {
		m.append("not");
		return vb;
	}
	return vb;
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/api/api.js
var api$1 = function(View) {
	class Verbs extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Verbs";
		}
		parse(n) {
			return this.getNth(n).map(parseVerb);
		}
		json(opts, n) {
			return this.getNth(n).map((vb) => {
				const json = vb.toView().json(opts)[0] || {};
				json.verb = toJSON(vb);
				return json;
			}, []);
		}
		subjects(n) {
			return this.getNth(n).map((vb) => {
				return getSubject(vb, parseVerb(vb)).subject;
			});
		}
		adverbs(n) {
			return this.getNth(n).map((vb) => vb.match("#Adverb"));
		}
		isSingular(n) {
			return this.getNth(n).filter((vb) => {
				return getSubject(vb).plural !== true;
			});
		}
		isPlural(n) {
			return this.getNth(n).filter((vb) => {
				return getSubject(vb).plural === true;
			});
		}
		isImperative(n) {
			return this.getNth(n).filter((vb) => vb.has("#Imperative"));
		}
		toInfinitive(n) {
			return this.getNth(n).map((vb) => {
				const parsed = parseVerb(vb);
				return toInf(vb, parsed, getGrammar(vb, parsed).form);
			});
		}
		toPresentTense(n) {
			return this.getNth(n).map((vb) => {
				const parsed = parseVerb(vb);
				const info = getGrammar(vb, parsed);
				if (info.isInfinitive) return vb;
				return toPresent(vb, parsed, info.form);
			});
		}
		toPastTense(n) {
			return this.getNth(n).map((vb) => {
				const parsed = parseVerb(vb);
				const info = getGrammar(vb, parsed);
				if (info.isInfinitive) return vb;
				return toPast$1(vb, parsed, info.form);
			});
		}
		toFutureTense(n) {
			return this.getNth(n).map((vb) => {
				const parsed = parseVerb(vb);
				const info = getGrammar(vb, parsed);
				if (info.isInfinitive) return vb;
				return toFuture(vb, parsed, info.form);
			});
		}
		toGerund(n) {
			return this.getNth(n).map((vb) => {
				const parsed = parseVerb(vb);
				const info = getGrammar(vb, parsed);
				if (info.isInfinitive) return vb;
				return toGerund(vb, parsed, info.form);
			});
		}
		toPastParticiple(n) {
			return this.getNth(n).map((vb) => {
				const parsed = parseVerb(vb);
				const info = getGrammar(vb, parsed);
				if (info.isInfinitive) return vb;
				return toPast(vb, parsed, info.form);
			});
		}
		conjugate(n) {
			const { conjugate, toInfinitive } = this.world.methods.two.transform.verb;
			return this.getNth(n).map((vb) => {
				const parsed = parseVerb(vb);
				const info = getGrammar(vb, parsed);
				if (info.form === "imperative") info.form = "simple-present";
				let inf = parsed.root.text("normal");
				if (!parsed.root.has("#Infinitive")) {
					const tense = getTense(parsed.root);
					inf = toInfinitive(inf, vb.model, tense) || inf;
				}
				return conjugate(inf, vb.model);
			}, []);
		}
		/** return only verbs with 'not'*/
		isNegative() {
			return this.if("#Negative");
		}
		/**  return only verbs without 'not'*/
		isPositive() {
			return this.ifNo("#Negative");
		}
		/** remove 'not' from these verbs */
		toPositive() {
			const m = this.match("do not #Verb");
			if (m.found) m.remove("do not");
			return this.remove("#Negative");
		}
		toNegative(n) {
			return this.getNth(n).map((vb) => {
				const parsed = parseVerb(vb);
				return toNegative(vb, parsed, getGrammar(vb, parsed).form);
			});
		}
		update(pointer) {
			const m = new Verbs(this.document, pointer);
			m._cache = this._cache;
			return m;
		}
	}
	Verbs.prototype.toPast = Verbs.prototype.toPastTense;
	Verbs.prototype.toPresent = Verbs.prototype.toPresentTense;
	Verbs.prototype.toFuture = Verbs.prototype.toFutureTense;
	View.prototype.verbs = function(n) {
		let vb = findVerbs(this);
		vb = vb.getNth(n);
		return new Verbs(this.document, vb.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/verbs/plugin.js
var plugin_default$1 = { api: api$1 };
//#endregion
//#region node_modules/compromise/src/3-three/coreference/compute/lib.js
var findChained = function(want, s) {
	const m = s.match(want);
	if (m.found) {
		const ref = m.pronouns().refersTo();
		if (ref.found) return ref;
	}
	return s.none();
};
var prevSentence = function(m) {
	if (!m.found) return m;
	const [n] = m.fullPointer[0];
	if (n && n > 0) return m.update([[n - 1]]);
	return m.none();
};
//#endregion
//#region node_modules/compromise/src/3-three/coreference/compute/findPerson.js
var byGender = function(ppl, gender) {
	if (gender === "m") return ppl.filter((m) => !m.presumedFemale().found);
	else if (gender === "f") return ppl.filter((m) => !m.presumedMale().found);
	return ppl;
};
var getPerson = function(s, gender) {
	let people = s.people();
	people = byGender(people, gender);
	if (people.found) return people.last();
	people = s.nouns("#Actor");
	if (people.found) return people.last();
	if (gender === "f") return findChained("(she|her|hers)", s);
	if (gender === "m") return findChained("(he|him|his)", s);
	return s.none();
};
//#endregion
//#region node_modules/compromise/src/3-three/coreference/compute/findThey.js
var getThey = function(s) {
	const nouns = s.nouns();
	let things = nouns.isPlural().notIf("#Pronoun");
	if (things.found) return things.last();
	const chain = findChained("(they|their|theirs)", s);
	if (chain.found) return chain;
	things = nouns.match("(somebody|nobody|everybody|anybody|someone|noone|everyone|anyone)");
	if (things.found) return things.last();
	return s.none();
};
//#endregion
//#region node_modules/compromise/src/3-three/coreference/compute/index.js
var addReference = function(pron, m) {
	if (m && m.found) {
		const term = pron.docs[0][0];
		term.reference = m.ptrs[0];
	}
};
var stepBack = function(m, cb) {
	let s = m.before();
	let res = cb(s);
	if (res.found) return res;
	s = prevSentence(m);
	res = cb(s);
	if (res.found) return res;
	s = prevSentence(s);
	res = cb(s);
	if (res.found) return res;
	return m.none();
};
var coreference = function(view) {
	view.pronouns().if("(he|him|his|she|her|hers|they|their|theirs|it|its)").forEach((pron) => {
		let res = null;
		if (pron.has("(he|him|his)")) res = stepBack(pron, (m) => getPerson(m, "m"));
		else if (pron.has("(she|her|hers)")) res = stepBack(pron, (m) => getPerson(m, "f"));
		else if (pron.has("(they|their|theirs)")) res = stepBack(pron, getThey);
		if (res && res.found) addReference(pron, res);
	});
};
//#endregion
//#region node_modules/compromise/src/3-three/coreference/api/pronouns.js
var api = function(View) {
	class Pronouns extends View {
		constructor(document, pointer, groups) {
			super(document, pointer, groups);
			this.viewType = "Pronouns";
		}
		hasReference() {
			this.compute("coreference");
			return this.filter((m) => {
				return m.docs[0][0].reference;
			});
		}
		refersTo() {
			this.compute("coreference");
			return this.map((m) => {
				if (!m.found) return m.none();
				const term = m.docs[0][0];
				if (term.reference) return m.update([term.reference]);
				return m.none();
			});
		}
		update(pointer) {
			const m = new Pronouns(this.document, pointer);
			m._cache = this._cache;
			return m;
		}
	}
	View.prototype.pronouns = function(n) {
		let m = this.match("#Pronoun");
		m = m.getNth(n);
		return new Pronouns(m.document, m.pointer);
	};
};
//#endregion
//#region node_modules/compromise/src/3-three/coreference/plugin.js
var plugin_default = {
	compute: { coreference },
	api
};
//#endregion
//#region node_modules/compromise/src/three.js
two_default.plugin(plugin_default$10);
two_default.plugin(plugin_default$9);
two_default.plugin(plugin_default$8);
two_default.plugin(plugin_default);
two_default.plugin(plugin_default$7);
two_default.plugin(plugin_default$6);
two_default.plugin(plugin_default$5);
two_default.plugin(plugin_default$4);
two_default.plugin(plugin);
two_default.plugin(plugin_default$3);
two_default.plugin(plugin_default$2);
two_default.plugin(plugin_default$1);
var three_default = two_default;
//#endregion
export { three_default as t };
