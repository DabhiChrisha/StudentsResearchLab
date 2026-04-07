import { Component } from 'react';

/**
 * ErrorBoundary
 *
 * Catches React render errors in any child subtree.
 * Shows a graceful fallback instead of a blank/crashed page.
 * Supports a "Try again" button that resets the error state.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeHeavyComponent />
 *   </ErrorBoundary>
 *
 * Optional prop `fallback` overrides the default UI.
 * Optional prop `section` names the section in the error log.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    const section = this.props.section ?? 'unknown';
    console.error(`[ErrorBoundary:${section}]`, error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.reset);
      }

      return (
        <div className="w-full flex items-center justify-center py-16 px-6">
          <div className="text-center max-w-sm">
            <div className="text-4xl mb-4 select-none">⚠️</div>
            <h2 className="text-lg font-bold text-slate-800 font-serif mb-2">
              {this.props.message ?? 'This section couldn\'t load'}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {this.props.hint ?? 'Something went wrong here. Try again or refresh the page.'}
            </p>
            <button
              onClick={this.reset}
              className="px-5 py-2 bg-teal-600 text-white rounded-full text-sm font-semibold hover:bg-teal-700 active:scale-95 transition-all duration-150 shadow-sm"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
