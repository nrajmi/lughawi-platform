export type DiagnosticErrorType =
  | "API_TIMEOUT"
  | "API_KEY_MISSING"
  | "ZOD_SCHEMA_MISMATCH"
  | "NETWORK_DISCONNECT"
  | "LLM_HALLUCINATION"
  | "UNKNOWN_ERROR";

export interface DiagnosticAlert {
  type: DiagnosticErrorType;
  title: string;
  message: string;
  timestamp: number;
  details?: any;
}

const DIAGNOSTIC_LOG_KEY = "lughawi.diagnostics.log";
const MAX_LOG_ENTRIES = 50;

export class SelfDiagnosticService {
  private static instance: SelfDiagnosticService;

  private constructor() {}

  public static getInstance(): SelfDiagnosticService {
    if (!SelfDiagnosticService.instance) {
      SelfDiagnosticService.instance = new SelfDiagnosticService();
    }
    return SelfDiagnosticService.instance;
  }

  /** Persists alert to localStorage so developer can inspect it later */
  private persistAlert(alert: DiagnosticAlert): void {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(DIAGNOSTIC_LOG_KEY);
      const existing: DiagnosticAlert[] = raw ? JSON.parse(raw) : [];
      const updated = [alert, ...existing].slice(0, MAX_LOG_ENTRIES);
      localStorage.setItem(DIAGNOSTIC_LOG_KEY, JSON.stringify(updated));
    } catch {
      // localStorage may be unavailable — fail silently
    }
  }

  /** Returns the last N diagnostic alerts stored in localStorage */
  public getRecentErrors(limit = 20): DiagnosticAlert[] {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(DIAGNOSTIC_LOG_KEY);
      if (!raw) return [];
      const parsed: DiagnosticAlert[] = JSON.parse(raw);
      return parsed.slice(0, limit);
    } catch {
      return [];
    }
  }

  /** Clears the diagnostic log */
  public clearLog(): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(DIAGNOSTIC_LOG_KEY);
      }
    } catch {}
  }

  public analyzeError(error: unknown): DiagnosticAlert {
    const timestamp = Date.now();

    // ✅ SSR-safe: navigator is undefined in Node.js
    const isOffline = typeof window !== "undefined" && typeof navigator !== "undefined" && !navigator.onLine;
    if (isOffline) {
      const alert: DiagnosticAlert = {
        type: "NETWORK_DISCONNECT",
        title: "انقطع الاتصال بالشبكة",
        message: "أنت غير متصل بالإنترنت حالياً. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
        timestamp,
      };
      this.persistAlert(alert);
      return alert;
    }

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();

      if (msg.includes("api key") || msg.includes("api_key") || msg.includes("not configured") || msg.includes("api key not configured")) {
        const alert: DiagnosticAlert = {
          type: "API_KEY_MISSING",
          title: "مفتاح API غير مُهيَّأ",
          message: "لم يتم تهيئة مفتاح Gemini API. يرجى إضافة GEMINI_API_KEY إلى متغيرات البيئة في Vercel.",
          timestamp,
          details: "GEMINI_API_KEY is missing from server environment variables",
        };
        this.persistAlert(alert);
        return alert;
      }

      if (
        msg.includes("timeout") ||
        msg.includes("fetch failed") ||
        msg.includes("network request failed")
      ) {
        const alert: DiagnosticAlert = {
          type: "API_TIMEOUT",
          title: "انتهت مهلة الاستجابة",
          message: "استغرق محرك الترجمة وقتاً أطول من المتوقع. يُحتمل أن يكون ذلك بسبب حركة المرور العالية أو زمن الاستجابة في الشبكة.",
          timestamp,
          details: error.message,
        };
        this.persistAlert(alert);
        return alert;
      }

      if (
        msg.includes("zod") ||
        msg.includes("validation") ||
        msg.includes("schema") ||
        msg.includes("invalid request data format")
      ) {
        const alert: DiagnosticAlert = {
          type: "ZOD_SCHEMA_MISMATCH",
          title: "خطأ في صحة البيانات",
          message: "لم يتطابق الطلب أو الاستجابة مع هيكل البيانات المتوقع.",
          timestamp,
          details: error.message,
        };
        this.persistAlert(alert);
        return alert;
      }

      if (
        msg.includes("hallucination") ||
        msg.includes("invalid response format") ||
        msg.includes("json") ||
        msg.includes("client_fallback_required")
      ) {
        const alert: DiagnosticAlert = {
          type: "LLM_HALLUCINATION",
          title: "خطأ في استجابة النموذج",
          message: "أعاد نموذج الذكاء الاصطناعي استجابة غير صالحة أو غير قابلة للتحليل.",
          timestamp,
          details: error.message,
        };
        this.persistAlert(alert);
        return alert;
      }

      const alert: DiagnosticAlert = {
        type: "UNKNOWN_ERROR",
        title: "خطأ غير متوقع",
        message: error.message || "حدث خطأ غير معروف أثناء التنفيذ.",
        timestamp,
        details: error.stack,
      };
      this.persistAlert(alert);
      return alert;
    }

    const alert: DiagnosticAlert = {
      type: "UNKNOWN_ERROR",
      title: "فشل صامت مُعترَض",
      message: "تم التقاط استثناء غير معروف بواسطة خدمة التشخيص.",
      timestamp,
      details: error,
    };
    this.persistAlert(alert);
    return alert;
  }
}

export const diagnosticService = SelfDiagnosticService.getInstance();
