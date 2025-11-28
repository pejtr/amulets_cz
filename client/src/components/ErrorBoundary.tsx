import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Ignore generic "Script error" from external sources
    if (error.message === 'Script error.' || error.message === '') {
      console.warn('Ignoring generic script error (likely from external source)');
      // Reset error state to prevent showing error UI
      this.setState({ hasError: false, error: null });
      return;
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <h2 className="text-xl mb-4">Něco se pokazilo</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Omlouváme se, došlo k neočekávané chybě. Zkuste prosím obnovit stránku.
            </p>

            {this.state.error && (
              <div className="p-4 w-full rounded bg-muted overflow-auto mb-6 max-h-48">
                <pre className="text-sm text-muted-foreground whitespace-break-spaces">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              Obnovit stránku
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
