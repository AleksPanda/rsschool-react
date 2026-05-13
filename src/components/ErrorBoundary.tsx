import { Component, type ErrorInfo, type ReactNode } from 'react';

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
          <section className="app__section error-boundary">
            <div className="header-panel">
              <div className="header-panel__content">
                <h1 className="header-panel__title">Something went wrong</h1>
                <p className="header-panel__subtitle">
                  Please refresh the page and try again.
                </p>
                <button
                  className="header-panel__test-error-button"
                  type="button"
                  onClick={this.handleGoBack}
                >
                  Refresh the page
                </button>
              </div>

              <img
                className="header-panel__image"
                src="/rick-cucumber.png"
                alt="Rick and Morty"
              />
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
