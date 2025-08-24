import React from 'react';

export interface QueryStateHandlerProps {
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

export interface QueryStateHandlerWithHeaderProps
  extends QueryStateHandlerProps {
  title: string;
  subtitle?: string;
}
