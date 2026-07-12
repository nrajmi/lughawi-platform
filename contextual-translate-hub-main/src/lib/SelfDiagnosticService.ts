export type DiagnosticErrorType = 
  | "API_TIMEOUT"
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
    
    if (!navigator.onLine) {
      return {
        type: "NETWORK_DISCONNECT",
        title: "Network Disconnected",
        message: "You are currently offline. Please check your internet connection.",
        timestamp
      };
    }

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      
      if (msg.includes("timeout") || msg.includes("fetch failed") || msg.includes("network request failed")) {
        return {
          type: "API_TIMEOUT",
          title: "API Timeout",
          message: "The translation engine took too long to respond. This might be due to high traffic or network latency.",
          timestamp,
          details: error.message
        };
      }

      if (msg.includes("zod") || msg.includes("validation") || msg.includes("schema") || msg.includes("invalid request data format")) {
        return {
          type: "ZOD_SCHEMA_MISMATCH",
          title: "Schema Validation Error",
          message: "The request or response did not match the expected data structure.",
          timestamp,
          details: error.message
        };
      }
      
      if (msg.includes("hallucination") || msg.includes("invalid response format") || msg.includes("json") || msg.includes("client_fallback_required")) {
         return {
          type: "LLM_HALLUCINATION",
          title: "Model Error Detected",
          message: "The AI model returned an invalid or unparseable response.",
          timestamp,
          details: error.message
        };
      }

      return {
        type: "UNKNOWN_ERROR",
        title: "Unexpected Error",
        message: error.message || "An unknown error occurred during execution.",
        timestamp,
        details: error.stack
      };
    }

    return {
      type: "UNKNOWN_ERROR",
      title: "Silent Failure Intercepted",
      message: "An unknown exception was caught by the diagnostic service.",
      timestamp,
      details: error
    };
  }
}

export const diagnosticService = SelfDiagnosticService.getInstance();
