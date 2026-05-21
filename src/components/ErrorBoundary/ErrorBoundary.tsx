import { Component, type ErrorInfo, type ReactNode } from 'react';
import PagePanel from '../PagePanel';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  private handleGoBack = (): void => {
    window.location.reload();
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Application error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="app">
          <PagePanel
            title="Something went wrong"
            description="Please refresh the page and try again."
            imageSrc="/rick-cucumber.png"
            actions={
              <button
                className="header-panel__test-error-button"
                type="button"
                onClick={this.handleGoBack}
              >
                Refresh the page
              </button>
            }
          />
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
