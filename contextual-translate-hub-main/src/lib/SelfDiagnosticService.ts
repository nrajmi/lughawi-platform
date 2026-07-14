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

export class SelfDiagnosticService {
  private static instance: SelfDiagnosticService;

  private constructor() {}

  public static getInstance(): SelfDiagnosticService {
    if (!SelfDiagnosticService.instance) {
      SelfDiagnosticService.instance = new SelfDiagnosticService();
    }
    return SelfDiagnosticService.instance;
  }

  public analyzeError(error: unknown): DiagnosticAlert {
    const timestamp = Date.now();

    // ✅ SSR-safe: navigator is undefined in Node.js
    const isOffline = typeof window !== "undefined" && typeof navigator !== "undefined" && !navigator.onLine;
    if (isOffline) {
      return {
        type: "NETWORK_DISCONNECT",
        title: "انقطع الاتصال بالشبكة",
        message: "أنت غير متصل بالإنترنت حالياً. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
        timestamp,
      };
    }

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();

      if (msg.includes("api key") || msg.includes("api_key") || msg.includes("not configured") || msg.includes("api key not configured")) {
        return {
          type: "API_KEY_MISSING",
          title: "مفتاح API غير مُهيَّأ",
          message: "لم يتم تهيئة مفتاح Gemini API. يرجى إضافة VITE_GEMINI_API_KEY إلى متغيرات البيئة في Vercel.",
          timestamp,
          details: "VITE_GEMINI_API_KEY is missing from environment variables",
        };
      }

      if (
        msg.includes("timeout") ||
        msg.includes("fetch failed") ||
        msg.includes("network request failed")
      ) {
        return {
          type: "API_TIMEOUT",
          title: "انتهت مهلة الاستجابة",
          message: "استغرق محرك الترجمة وقتاً أطول من المتوقع. يُحتمل أن يكون ذلك بسبب حركة المرور العالية أو زمن الاستجابة في الشبكة.",
          timestamp,
          details: error.message,
        };
      }

      if (
        msg.includes("zod") ||
        msg.includes("validation") ||
        msg.includes("schema") ||
        msg.includes("invalid request data format")
      ) {
        return {
          type: "ZOD_SCHEMA_MISMATCH",
          title: "خطأ في صحة البيانات",
          message: "لم يتطابق الطلب أو الاستجابة مع هيكل البيانات المتوقع.",
          timestamp,
          details: error.message,
        };
      }

      if (
        msg.includes("hallucination") ||
        msg.includes("invalid response format") ||
        msg.includes("json") ||
        msg.includes("client_fallback_required")
      ) {
        return {
          type: "LLM_HALLUCINATION",
          title: "خطأ في استجابة النموذج",
          message: "أعاد نموذج الذكاء الاصطناعي استجابة غير صالحة أو غير قابلة للتحليل.",
          timestamp,
          details: error.message,
        };
      }

      return {
        type: "UNKNOWN_ERROR",
        title: "خطأ غير متوقع",
        message: error.message || "حدث خطأ غير معروف أثناء التنفيذ.",
        timestamp,
        details: error.stack,
      };
    }

    return {
      type: "UNKNOWN_ERROR",
      title: "فشل صامت مُعترَض",
      message: "تم التقاط استثناء غير معروف بواسطة خدمة التشخيص.",
      timestamp,
      details: error,
    };
  }
}

export const diagnosticService = SelfDiagnosticService.getInstance();
