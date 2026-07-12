import React, { Component, type ReactNode } from "react";
import { diagnosticService, type DiagnosticAlert } from "@/lib/SelfDiagnosticService";
import { AlertTriangle, ServerCrash, Unplug, BrainCircuit, RefreshCw } from "lucide-react";
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
    alert: null
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
          case "API_TIMEOUT": return <ServerCrash className="h-10 w-10 text-orange-500" />;
          case "NETWORK_DISCONNECT": return <Unplug className="h-10 w-10 text-red-500" />;
          case "LLM_HALLUCINATION": return <BrainCircuit className="h-10 w-10 text-purple-500" />;
          default: return <AlertTriangle className="h-10 w-10 text-destructive" />;
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans" dir="auto">
          <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className={cn(
              "p-6 border-b border-border flex flex-col items-center text-center gap-4",
              alert.type === "API_TIMEOUT" ? "bg-orange-500/10" :
              alert.type === "NETWORK_DISCONNECT" ? "bg-red-500/10" :
              alert.type === "LLM_HALLUCINATION" ? "bg-purple-500/10" :
              "bg-destructive/10"
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
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Diagnostic Details</h3>
                <div className="bg-background border border-border rounded p-3 text-xs font-mono text-muted-foreground overflow-x-auto max-h-[150px] overflow-y-auto">
                  <p><strong className="text-foreground">Error Code:</strong> {alert.type}</p>
                  <p className="mt-1"><strong className="text-foreground">Timestamp:</strong> {new Date(alert.timestamp).toISOString()}</p>
                  {alert.details && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <strong className="text-foreground">Raw Output:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">{typeof alert.details === 'string' ? alert.details : JSON.stringify(alert.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-4 py-2.5 rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
