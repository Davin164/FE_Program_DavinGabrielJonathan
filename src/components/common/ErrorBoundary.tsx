import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-surface rounded-2xl border border-border shadow-subtle m-4">
          <div className="w-14 h-14 rounded-2xl bg-danger-light text-danger flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Something went wrong</h2>
          <p className="mt-2 text-sm text-text-secondary max-w-md">
            {this.state.error?.message || 'An unexpected error occurred while rendering this view.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-subtle transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
