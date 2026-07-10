import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UI_TRANSLATIONS_PATH = path.join(__dirname, '../src/lib/uiTranslations.ts');

export async function runWatchdog(isDaemon = false) {
  let hasErrors = false;
  
  if (!isDaemon) {
    console.log("[\x1b[34mWatchdog\x1b[0m] Starting pre-build validation...");
  }

  // 1. Validate Zod Schemas
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

  // 2. Validate and Auto-Fix UI Translations
  try {
    // We use a custom parser to avoid caching issues with Node dynamic imports in long-running processes
    const fileContentStr = fs.readFileSync(UI_TRANSLATIONS_PATH, 'utf-8');
    
    // Quick and dirty extraction for the daemon
    const getKeys = (langBlock: string) => {
      const regex = new RegExp(`${langBlock}:\\s*\\{([\\s\\S]*?)\\n\\s*\\}`, 'm');
      const match = fileContentStr.match(regex);
      if (!match) return [];
      const lines = match[1].split('\\n');
      const keys = [];
      for (const line of lines) {
        const keyMatch = line.match(/^\\s*([a-zA-Z0-9_]+):/);
        if (keyMatch) keys.push(keyMatch[1]);
      }
      // Also grab keys via regex
      const keyMatches = Array.from(match[1].matchAll(/^\s*([a-zA-Z0-9_]+):/gm));
      return keyMatches.map(m => m[1]);
    };

    const arKeys = getKeys('ar');
    const enKeys = getKeys('en');
    
    const missingInEn = arKeys.filter(k => !enKeys.includes(k));
    const missingInAr = enKeys.filter(k => !arKeys.includes(k));

    if (missingInEn.length > 0 || missingInAr.length > 0) {
      if (isDaemon) {
        console.log(`[\x1b[33mWatchdog: Auto-Heal\x1b[0m] Detected missing keys. Auto-fixing uiTranslations.ts...`);
        let newContent = fileContentStr;
        
        if (missingInEn.length > 0) {
          for (const key of missingInEn) {
            const regexVal = new RegExp(`ar:\\s*\\{[\\s\\S]*?^\\s*${key}:\\s*(['"\`])(.*?)\\1`, 'm');
            const match = fileContentStr.match(regexVal);
            const arText = match ? match[2] : "";
            let translatedText = "[AUTO-FIX: MISSING_EN]";
            if (arText && typeof arText === 'string') {
              try {
                const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(arText)}`);
                const data = await res.json();
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                  translatedText = data[0][0][0];
                }
              } catch (e) {
                console.log(`[\x1b[33mWatchdog\x1b[0m] Auto-translate failed for ${key}, falling back to placeholder.`);
              }
            }
            const regex = /(en:\s*\{)([\s\S]*?)(\n\s*\})/;
            const safeText = translatedText.replace(/"/g, '\\"');
            newContent = newContent.replace(regex, `$1$2,\n    ${key}: "${safeText}",$3`);
          }
          console.log(`[\x1b[32mWatchdog\x1b[0m] Auto-translated and injected missing EN keys:`, missingInEn);
        }
        
        if (missingInAr.length > 0) {
          for (const key of missingInAr) {
            const regexVal = new RegExp(`en:\\s*\\{[\\s\\S]*?^\\s*${key}:\\s*(['"\`])(.*?)\\1`, 'm');
            const match = fileContentStr.match(regexVal);
            const enText = match ? match[2] : "";
            let translatedText = "[AUTO-FIX: MISSING_AR]";
            if (enText && typeof enText === 'string') {
              try {
                const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(enText)}`);
                const data = await res.json();
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                  translatedText = data[0][0][0];
                }
              } catch (e) {
                console.log(`[\x1b[33mWatchdog\x1b[0m] Auto-translate failed for ${key}, falling back to placeholder.`);
              }
            }
            const regex = /(ar:\s*\{)([\s\S]*?)(\n\s*\})/;
            // Escape quotes in the translated text to prevent breaking the JS file
            const safeText = translatedText.replace(/"/g, '\\"');
            newContent = newContent.replace(regex, `$1$2,\n    ${key}: "${safeText}",$3`);
          }
          console.log(`[\x1b[32mWatchdog\x1b[0m] Auto-translated and injected missing AR keys:`, missingInAr);
        }
        
        // Clean up any double commas
        newContent = newContent.replace(/,,/g, ',');
        fs.writeFileSync(UI_TRANSLATIONS_PATH, newContent, 'utf-8');
        console.log(`[\x1b[32mWatchdog\x1b[0m] Auto-healing complete.`);
      } else {
        if (missingInEn.length > 0) console.error("[\x1b[31mError\x1b[0m] Missing English keys:", missingInEn);
        if (missingInAr.length > 0) console.error("[\x1b[31mError\x1b[0m] Missing Arabic keys:", missingInAr);
        hasErrors = true;
      }
    }
  } catch (err) {
    console.error("[\x1b[31mError\x1b[0m] Failed to parse UI Translations:", err);
    hasErrors = true;
  }

  if (hasErrors && !isDaemon) {
    console.error("[\x1b[31mWatchdog\x1b[0m] Validation failed. Build halted to prevent broken UI / State leaks.");
    process.exit(1);
  } else if (!isDaemon) {
    console.log("[\x1b[32mWatchdog\x1b[0m] All checks passed successfully. Proceeding to build.");
  }
}

if (process.argv[1] && process.argv[1].endsWith('watchdog.ts')) {
  const isDaemonMode = process.argv.includes('--daemon');
  if (isDaemonMode) {
    console.log("[\x1b[35mWatchdog Daemon\x1b[0m] Started in background mode. Listening for localization leaks...");
    setInterval(() => runWatchdog(true), 5000); // Fast interval for dev
  } else {
    runWatchdog(false);
  }
}
