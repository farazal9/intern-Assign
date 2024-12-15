import React from 'react';
import { Card, Button } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-default-100 dark:bg-default-50 p-4">
          <Card className="p-6 max-w-sm w-full text-center shadow-lg rounded-lg">
            <div className="flex flex-col items-center">
              <AlertTriangle className="w-16 h-16 text-danger mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">
                Oops! Something Went Wrong
              </h3>
              <p className="text-small text-default-500 mb-6">
                An unexpected error occurred. Please try reloading the application.
              </p>
              {this.state.error?.message && (
                <details className="text-small text-danger bg-danger-50 p-3 rounded-lg w-full text-left mb-4 overflow-auto max-h-32">
                  <summary className="cursor-pointer text-bold mb-2">
                    Error Details
                  </summary>
                  {this.state.error.message}
                </details>
              )}
              <Button
                color="primary"
                onPress={() => window.location.reload()}
                className="w-full"
              >
                Reload Application
              </Button>
            </div>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
