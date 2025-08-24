import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { QueryStateHandlerWithHeaderProps } from './query-state-handler.interface';
import { LoadingState } from './loading-state';
import { ErrorState } from './error-state';

export const QueryStateHandlerWithHeader: React.FC<
  QueryStateHandlerWithHeaderProps
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
          <LoadingState text={loadingText} showCard={false} />
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
          <ErrorState
            title={errorTitle}
            message={errorMessage}
            subtitle={errorSubtitle}
            showCard={false}
          />
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
