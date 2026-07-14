import React, { Component, type ReactNode } from "react";
import { diagnosticService, type DiagnosticAlert } from "@/lib/SelfDiagnosticService";
import { AlertTriangle, ServerCrash, Unplug, BrainCircuit, RefreshCw, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  alert: DiagnosticAlert | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    alert: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    const alert = diagnosticService.analyzeError(error);
    return { hasError: true, alert };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught exception intercepted by GlobalErrorBoundary:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError && this.state.alert) {
      const { alert } = this.state;

      const getIcon = () => {
        switch (alert.type) {
          case "API_TIMEOUT":     return <ServerCrash className="h-10 w-10 text-orange-500" />;
          case "NETWORK_DISCONNECT": return <Unplug className="h-10 w-10 text-red-500" />;
          case "LLM_HALLUCINATION":  return <BrainCircuit className="h-10 w-10 text-purple-500" />;
          case "API_KEY_MISSING":    return <KeyRound className="h-10 w-10 text-amber-500" />;
          default: return <AlertTriangle className="h-10 w-10 text-destructive" />;
        }
      };

      const getBgColor = () => {
        switch (alert.type) {
          case "API_TIMEOUT":        return "bg-orange-500/10";
          case "NETWORK_DISCONNECT": return "bg-red-500/10";
          case "LLM_HALLUCINATION":  return "bg-purple-500/10";
          case "API_KEY_MISSING":    return "bg-amber-500/10";
          default:                   return "bg-destructive/10";
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans" dir="auto">
          <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className={cn(
              "p-6 border-b border-border flex flex-col items-center text-center gap-4",
              getBgColor()
            )}>
              <div className="p-3 bg-background rounded-full shadow-sm">
                {getIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">{alert.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              </div>
            </div>

            <div className="p-6 bg-secondary/30">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  تفاصيل التشخيص / Diagnostic Details
                </h3>
                <div className="bg-background border border-border rounded p-3 text-xs font-mono text-muted-foreground overflow-x-auto max-h-[150px] overflow-y-auto" dir="ltr">
                  <p><strong className="text-foreground">Error Code:</strong> {alert.type}</p>
                  <p className="mt-1"><strong className="text-foreground">Timestamp:</strong> {new Date(alert.timestamp).toISOString()}</p>
                  {alert.details && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <strong className="text-foreground">Raw Output:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">{typeof alert.details === "string" ? alert.details : JSON.stringify(alert.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>

              {alert.type === "API_KEY_MISSING" && (
                <div className="mb-4 p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-700 text-[11px] text-amber-800 dark:text-amber-300">
                  <p className="font-bold mb-1">🔑 خطوة مطلوبة في Vercel:</p>
                  <p>أضف المتغير <code className="font-mono bg-amber-100 dark:bg-amber-900/30 px-1 rounded">VITE_GEMINI_API_KEY</code> في إعدادات المشروع ← Environment Variables</p>
                </div>
              )}

              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-4 py-2.5 rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة تحميل التطبيق
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
