import React from 'react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  title = "Something went wrong",
  message,
  onRetry,
  onDismiss
}) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mx-4 max-w-2xl mx-auto">
      <div className="flex items-start space-x-4">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Error Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            {title}
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4 leading-relaxed">
            {message}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Try Again</span>
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-red-600 dark:text-red-300 font-medium px-4 py-2 rounded-lg border border-red-200 dark:border-red-700 transition-colors duration-200"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AlertProps {
  type: 'success' | 'warning' | 'info' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: '✅',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      titleText: 'text-green-800',
      messageText: 'text-green-700'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: '⚠️',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600',
      titleText: 'text-yellow-800',
      messageText: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'ℹ️',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      titleText: 'text-blue-800',
      messageText: 'text-blue-700'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: '❌',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      titleText: 'text-red-800',
      messageText: 'text-red-700'
    }
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} border rounded-xl p-4 mx-4 max-w-2xl mx-auto relative`}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      )}
      
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 ${style.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
          <span className={`${style.iconText} text-lg`}>{style.icon}</span>
        </div>
        
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold ${style.titleText} mb-1`}>
              {title}
            </h4>
          )}
          <p className={`${style.messageText} leading-relaxed`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
