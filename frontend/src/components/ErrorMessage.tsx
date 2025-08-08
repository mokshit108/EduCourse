import React from 'react';
import { useRouter } from 'next/router';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  showGoHome?: boolean;
  fullScreen?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  showRetry = true,
  onRetry,
  showGoHome = true,
  fullScreen = false
}) => {
  const router = useRouter();

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center'
    : 'flex flex-col items-center justify-center py-16';

  return (
    <div className={containerClasses}>
      <div className="text-center animate-fadeIn max-w-md mx-auto px-4">
        <div className="text-8xl text-red-300 mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 text-lg mb-8">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Try Again</span>
            </button>
          )}
          {showGoHome && (
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Go Home</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;