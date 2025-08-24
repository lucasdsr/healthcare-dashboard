import React from 'react';
import { LoadingSpinner } from '../loading-spinner';

interface LoadingStateProps {
  text?: string;
  showCard?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  text = 'Loading...',
  showCard = true,
  className = '',
}) => {
  const loadingContent = (
    <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-lg flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} variant="purple" />
    </div>
  );

  if (showCard) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white text-card-foreground shadow-md ${className}`}>
        <div className="p-6">{loadingContent}</div>
      </div>
    );
  }

  return loadingContent;
};
