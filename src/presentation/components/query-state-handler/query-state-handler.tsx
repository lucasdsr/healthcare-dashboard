import React from 'react';
import { QueryStateHandlerProps } from './query-state-handler.interface';
import { LoadingState } from './loading-state';
import { ErrorState } from './error-state';
import { useQueryStateHandlerLogic } from './query-state-handler.logic';

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
  const { shouldShowLoading, shouldShowError, shouldShowChildren } =
    useQueryStateHandlerLogic();

  if (shouldShowLoading(isLoading)) {
    return (
      <LoadingState
        text={loadingText}
        showCard={showCard}
        className={className}
      />
    );
  }

  if (shouldShowError(error)) {
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessage}
        subtitle={errorSubtitle}
        showCard={showCard}
        className={className}
      />
    );
  }

  if (shouldShowChildren(isLoading, error)) {
    return <>{children}</>;
  }

  return null;
};
