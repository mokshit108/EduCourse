import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center'
    : 'flex flex-col items-center justify-center py-8';

  return (
    <div className={containerClasses}>
      <div className="text-center animate-fadeIn">
        <div 
          className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4`}
        ></div>
        {message && (
          <p className="text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;