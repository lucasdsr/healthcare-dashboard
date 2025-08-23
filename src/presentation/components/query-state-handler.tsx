import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
} from './index';

interface QueryStateHandlerProps {
  isLoading?: boolean;
  error?: Error | null;
  loadingText?: string;
  errorTitle?: string;
  errorMessage?: string;
  errorSubtitle?: string;
  children: React.ReactNode;
  showCard?: boolean;
  className?: string;
}

export const QueryStateHandler: React.FC<QueryStateHandlerProps> = ({
  isLoading = false,
  error = null,
  loadingText = 'Loading...',
  errorTitle = 'Error',
  errorMessage,
  errorSubtitle = 'Please try again later',
  children,
  showCard = true,
  className = '',
}) => {
  if (isLoading) {
    const loadingContent = (
      <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-lg flex items-center justify-center">
        <LoadingSpinner size="lg" text={loadingText} variant="purple" />
      </div>
    );

    if (showCard) {
      return (
        <Card className={className}>
          <CardContent className="p-6">{loadingContent}</CardContent>
        </Card>
      );
    }

    return loadingContent;
  }

  if (error) {
    const errorContent = (
      <div className="h-64 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-sm font-medium mb-2">
            {errorTitle}
          </div>
          {errorMessage && (
            <div className="text-red-500 text-xs mb-2">{errorMessage}</div>
          )}
          <div className="text-red-400 text-xs">{errorSubtitle}</div>
        </div>
      </div>
    );

    if (showCard) {
      return (
        <Card className={className}>
          <CardContent className="p-6">{errorContent}</CardContent>
        </Card>
      );
    }

    return errorContent;
  }

  return <>{children}</>;
};

export const QueryStateHandlerWithHeader: React.FC<
  QueryStateHandlerProps & {
    title: string;
    subtitle?: string;
  }
> = ({
  isLoading = false,
  error = null,
  loadingText = 'Loading...',
  errorTitle = 'Error',
  errorMessage,
  errorSubtitle = 'Please try again later',
  children,
  title,
  subtitle,
  className = '',
}) => {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">
            {title}
          </CardTitle>
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-lg flex items-center justify-center">
            <LoadingSpinner size="lg" text={loadingText} variant="purple" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">
            {title}
          </CardTitle>
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 text-sm font-medium mb-2">
                {errorTitle}
              </div>
              {errorMessage && (
                <div className="text-red-500 text-xs mb-2">{errorMessage}</div>
              )}
              <div className="text-red-400 text-xs">{errorSubtitle}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral-900">
          {title}
        </CardTitle>
        {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
