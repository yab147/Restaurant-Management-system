/** ErrorBoundary — Catches render errors and shows a fallback UI */
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-64 p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
            Something went wrong
          </h2>
          <p className="text-sm mb-4" style={{ color: '#8B6E52' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
