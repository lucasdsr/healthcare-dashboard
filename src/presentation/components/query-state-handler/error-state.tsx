import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  subtitle?: string;
  showCard?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error',
  message,
  subtitle = 'Please try again later',
  showCard = true,
  className = '',
}) => {
  const errorContent = (
    <div className="h-64 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-600 text-sm font-medium mb-2">{title}</div>
        {message && <div className="text-red-500 text-xs mb-2">{message}</div>}
        <div className="text-red-400 text-xs">{subtitle}</div>
      </div>
    </div>
  );

  if (showCard) {
    return (
      <div
        className={`rounded-lg border border-gray-200 bg-white text-card-foreground shadow-md ${className}`}
      >
        <div className="p-6">{errorContent}</div>
      </div>
    );
  }

  return errorContent;
};
