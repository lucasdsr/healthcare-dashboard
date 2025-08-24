import { QueryStateHandlerProps, QueryStateHandlerWithHeaderProps } from './query-state-handler.interface';

export const useQueryStateHandlerLogic = () => {
  const shouldShowLoading = (isLoading: boolean) => isLoading;
  const shouldShowError = (error: Error | null) => !!error;
  const shouldShowChildren = (isLoading: boolean, error: Error | null) => !isLoading && !error;

  const getLoadingContent = (loadingText: string) => (
    <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <div className="text-xl font-semibold text-purple-700">{loadingText}</div>
      </div>
    </div>
  );

  const getErrorContent = (errorTitle: string, errorMessage?: string, errorSubtitle: string = 'Please try again later') => (
    <div className="h-64 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-600 text-sm font-medium mb-2">{errorTitle}</div>
        {errorMessage && (
          <div className="text-red-500 text-xs mb-2">{errorMessage}</div>
        )}
        <div className="text-red-400 text-xs">{errorSubtitle}</div>
      </div>
    </div>
  );

  const wrapInCard = (content: React.ReactNode, className: string) => (
    <div className={`rounded-lg border border-gray-200 bg-white text-card-foreground shadow-md ${className}`}>
      <div className="p-6">{content}</div>
    </div>
  );

  return {
    shouldShowLoading,
    shouldShowError,
    shouldShowChildren,
    getLoadingContent,
    getErrorContent,
    wrapInCard,
  };
};
