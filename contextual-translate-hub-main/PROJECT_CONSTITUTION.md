# PROJECT CONSTITUTION
## منصة لغوي — Lughawi Platform
### Official Engineering Constitution | v1.0.0 — July 2026

---

> *"The purpose of language is not to translate words — it is to bridge worlds."*
> — Lughawi Platform Design Philosophy

---

## § 1. VISION

Lughawi (لغوي) aspires to become the **leading academic translation platform** for the Arabic-speaking world — a digital institution where specialized knowledge crosses language barriers with precision, integrity, and scholarly rigor.

The long-term vision is a platform where a doctor reads a clinical paper in Arabic with the same nuance as the English original; where a jurist encounters legal texts translated with Black's Law precision; where a theologian finds Quranic concepts rendered without compromise.

Lughawi is not a tool. It is an **academic infrastructure**.

---

## § 2. MISSION

To deliver **Specialized Contextual Translation** in Language for Specific Purposes (LSP) domains — medical, legal, technical, religious, and linguistic — powered by Generative AI and controlled by domain-expert glossaries grounded in international academic standards.

**Lughawi is explicitly NOT:**
- A chatbot or AI assistant
- A ChatGPT interface or clone
- A generic machine translation service
- A social platform

Every engineering decision must reinforce the identity of a **premium academic translation platform**.

---

## § 3. CORE PRINCIPLES

### P-01 · Context Over Literal Translation
Translation must reflect the **pragmatic meaning** within its domain context, not the surface-level lexical mapping.

### P-02 · Academic Accuracy First
Terminology decisions must be grounded in **cited academic references** (ICD-11, MeSH, Black's Law, UNTERM, Quran corpus, IEEE glossaries).

### P-03 · Domain Specialization
Five specialized domains: **General, Medical, Legal, Technical, Religious**. Each domain has its own prompt instruction layer, controlled glossary, and UI presentation.

### P-04 · Zero-Cost Architecture
Entire platform must remain operable on zero-cost infrastructure: free hosting, client-side processing where possible, minimal API calls.

### P-05 · Client Performance
First Contentful Paint < 1.5s. Heavy computations use `useMemo`. Dictionaries load lazily when bundle optimization is required.

### P-06 · Security-First Development
No sensitive data reaches the client bundle. All user text passes through `sanitizeInput()`. `security.ts` is the single source of truth for sanitization and encryption.

### P-07 · Accessibility
Semantic HTML, keyboard navigation, ARIA labels, WCAG AA color contrast minimum on all interactive elements.

### P-08 · Maintainability
One responsibility per module. Business logic in `src/lib/`. UI in `src/components/` and `src/routes/`. Dictionary files are self-documenting.

### P-09 · Scalability
Adding a new domain requires changes to exactly four locations: new dictionary file, index.ts export, translate.functions.ts instruction, UI panel in index.tsx.

### P-10 · Premium Classic UI
Visual identity inspired by DeepL, Cambridge Dictionary, and Oxford Press. Ivory/Navy palette, serif typography, no neon colors, no excessive animation.

### P-11 · Linguistics-Driven Design
Every UI decision serves the linguistic workflow. Split translation panel is non-negotiable. Domain tabs visible at all times. Glossary panels appear contextually.

---

## § 4. ENGINEERING RULES

### R-01 · NEVER Expose API Keys
`GEMINI_API_KEY` exists only in server-side environment variables. Never in client bundles or browser network requests.

### R-02 · NEVER Call Gemini from Client Components
All AI API calls are made exclusively within TanStack Start Server Functions (`createServerFn`).

### R-03 · Preserve Server Functions Architecture
`translateText` in `src/lib/translate.functions.ts` is the only authorized translation entry point.

### R-04 · Strict TypeScript
All code strictly typed. `any` prohibited except for untyped browser APIs (must be commented). Zod schemas validate all server function inputs.

### R-05 · Business Logic in src/lib
State derivations, algorithms, data transformations, API interactions belong exclusively in `src/lib/`.

### R-06 · Modular Dictionaries
Each domain's glossary is a self-contained TypeScript file. Must contain: DictionaryEntry[], GlossaryEntry[], TypeScript interface, reference documentation in file header.

### R-07 · One Responsibility Per Component
`LinguisticAnalyzer` analyzes. `LanguageSelect` selects. `TranslatorPage` orchestrates. No mixing.

### R-08 · Input Sanitization Always
Every string entering the translation pipeline must pass through `sanitizeInput()`. No exceptions.

### R-09 · Error Messages Must Be User-Friendly
Internal error details never reach the user interface. User-facing messages in UI language only, never disclosing system internals.

### R-10 · History Data Is Encrypted
Translation history in `localStorage` always encrypted using `encryptData()`. Plain-text storage prohibited.

---

## § 5. UI PHILOSOPHY

### U-01 · Classic Premium Design
Ivory (`#F8F7F4`) and Royal Navy (`#1E3A5F`) in light mode. Deep Slate (`#111827`) in dark mode. No bright gradients, no neon accents.

### U-02 · No Chatbot Interface
Bilateral translation workspace, not a chat interface. No conversation history displayed as messages.

### U-03 · Split Translation Layout (Non-Negotiable)
Two-pane layout (source | divider | target) at all times on desktop. Mobile: stacked vertically.

### U-04 · Elegant Typography
`Amiri` (Arabic display), `Libre Baskerville` (Latin display), `Cairo` (Arabic body).

### U-05 · Professional Animations Only
Animations only for functional purpose: panel reveal, loading indicator, glossary expansion.

### U-06 · No Visual Clutter
Domain panel shows glossary only when that domain is active. Default view: navbar + domain tabs + translation panes + footer.

---

## § 6. LINGUISTIC STANDARDS

### L-01 · Domain-Specific Terminology
Every domain's prompt instruction layer must specify forbidden colloquial equivalents alongside preferred academic terms.

### L-02 · Glossary Consistency
Terms in controlled glossaries must be consistent with prompt instructions injected into Gemini for that domain.

### L-03 · Transliteration Rules
Islamic terms: Library of Congress Arabic Romanization (taqwā, dhikr, fatwā). Latin legal terms: retain original Latin with Arabic explanation inline.

### L-04 · Context-Aware Translation
Same English term produces different Arabic outputs by domain and tone. Enforced at the Prompt Engineering layer.

### L-05 · Academic References (Approved Sources)
- **Medical:** WHO ICD-11, MeSH, Harrison's Principles, Dorland's Medical Dictionary
- **Legal:** Black's Law Dictionary (11th Ed.), UNTERM, ICC Arabic Glossary, Arab League Legal Terminology
- **Technical:** IEEE Glossary, ISO/IEC 2382, NIST SP 800 series
- **Religious:** Quran Corpus, Lane's Arabic-English Lexicon, Sahih International
- **Linguistic:** Crystal's Dictionary of Linguistics, Al-Munjid fi al-Lugha

---

## § 7. FUTURE EXPANSION RULES

### Adding a New Domain — Required Steps (Atomic Commit)

**Step 1 — Dictionary File:** `src/lib/dictionaries/[domain].ts`
Must contain: `DictionaryEntry[]`, `GlossaryEntry[]` interface, controlled glossary array, academic references in header.

**Step 2 — Dictionary Index:** Export new glossary and type from `src/lib/dictionaries/index.ts`.

**Step 3 — Prompt Instructions:** Add `[domain]` entry to `domainInstructions` in `translate.functions.ts` with forbidden equivalents and required terms.

**Step 4 — UI Panel:** Add to `DOMAINS[]` array in `index.tsx`. Add mode notice banner and glossary panel. Choose distinct premium color fitting the palette.

**Step 5 — Validation Checklist:**
- [ ] Minimum 6 glossary entries with academic sources
- [ ] Prompt instructions tested with ≥5 domain-specific terms
- [ ] UI panel renders correctly on mobile and desktop
- [ ] Zero TypeScript errors

---

## § 8. VERSION & RELEASE

| Field | Value |
|-------|-------|
| **Version** | v1.0.0-beta |
| **Release Date** | July 2026 |
| **Status** | Public Beta |
| **Maintained by** | nrajmi |
| **License** | All Rights Reserved © 2026 Lughawi Platform |

---

*This constitution is a living document. Amendments require a formal commit with a `[CONSTITUTION]` prefix in the commit message and a version bump in this document.*
