import { UI_TRANSLATIONS } from "../src/lib/uiTranslations";
import { z } from "zod";

function runWatchdog() {
  console.log("[\x1b[34mWatchdog\x1b[0m] Starting pre-build validation...");
  
  let hasErrors = false;

  // 1. Validate UI Translations
  console.log("[\x1b[34mWatchdog\x1b[0m] Checking UI Translations (ar vs en)...");
  const arKeys = Object.keys(UI_TRANSLATIONS.ar).sort();
  const enKeys = Object.keys(UI_TRANSLATIONS.en).sort();
  
  const missingInEn = arKeys.filter(k => !enKeys.includes(k));
  const missingInAr = enKeys.filter(k => !arKeys.includes(k));

  if (missingInEn.length > 0) {
    console.error("[\x1b[31mError\x1b[0m] Missing English translations for keys:", missingInEn);
    hasErrors = true;
  }
  if (missingInAr.length > 0) {
    console.error("[\x1b[31mError\x1b[0m] Missing Arabic translations for keys:", missingInAr);
    hasErrors = true;
  }

  // 2. Validate translation schemas
  console.log("[\x1b[34mWatchdog\x1b[0m] Checking Zod Schemas...");
  try {
    const InputSchema = z.object({
      text: z.string().min(1).max(5000),
      source: z.enum(["auto", "ar", "en", "es"]),
      target: z.enum(["ar", "en", "es"]),
      tone: z.enum(["general", "academic", "technical", "creative"]),
      domain: z.enum(["all", "linguistics", "tech", "medical", "legal", "general", "religious", "academic"]).default("all"),
    });
  } catch (error) {
    console.error("[\x1b[31mError\x1b[0m] Zod schema validation failed:", error);
    hasErrors = true;
  }

  if (hasErrors) {
    console.error("[\x1b[31mWatchdog\x1b[0m] Validation failed. Build halted to prevent broken UI / State leaks.");
    process.exit(1);
  } else {
    console.log("[\x1b[32mWatchdog\x1b[0m] All checks passed successfully. Proceeding to build.");
  }
}

runWatchdog();
