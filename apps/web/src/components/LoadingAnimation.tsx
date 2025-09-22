import React from 'react';

interface LoadingAnimationProps {
  message?: string;
  step?: string;
  progress?: number;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Generating Report...", 
  step = "",
  progress = 0 
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-navy-600 to-accent-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{message}</h3>
          {step && (
            <p className="text-sm text-gray-600">{step}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-navy-600 to-accent-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          </div>
        </div>

        {/* Steps Animation */}
        <div className="space-y-3">
          <StepItem 
            icon="search" 
            label="Fetching Treasury Data" 
            completed={progress > 25}
            active={progress <= 25}
          />
          <StepItem 
            icon="shield" 
            label="Generating ZK Proofs" 
            completed={progress > 50}
            active={progress > 25 && progress <= 50}
          />
          <StepItem 
            icon="check" 
            label="Verifying Proofs" 
            completed={progress > 75}
            active={progress > 50 && progress <= 75}
          />
          <StepItem 
            icon="chart" 
            label="AI Report Generation" 
            completed={progress > 90}
            active={progress > 75}
          />
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center mt-6 space-x-1">
          <div className="w-2 h-2 bg-navy-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-accent-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-navy-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

interface StepItemProps {
  icon: 'search' | 'shield' | 'check' | 'chart';
  label: string;
  completed: boolean;
  active: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ icon, label, completed, active }) => {
  const getIcon = () => {
    if (completed) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }

    switch (icon) {
      case 'search':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'check':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
      active ? 'bg-navy-50 border border-navy-200' : ''
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        completed 
          ? 'bg-accent-500 text-white' 
          : active 
            ? 'bg-navy-500 text-white animate-pulse' 
            : 'bg-gray-200 text-gray-500'
      }`}>
        {getIcon()}
      </div>
      <span className={`font-medium transition-colors duration-300 ${
        completed 
          ? 'text-accent-700' 
          : active 
            ? 'text-navy-700' 
            : 'text-gray-500'
      }`}>
        {label}
      </span>
      {active && (
        <div className="ml-auto">
          <div className="w-4 h-4 border-2 border-navy-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
