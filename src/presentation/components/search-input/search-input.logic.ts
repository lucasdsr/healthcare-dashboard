import { useState } from 'react';
import { SearchResult } from './search-input.interface';
import { getSearchInputClasses } from '@/shared/utils/input-classes';

export const useSearchInputLogic = (
  showResults: boolean,
  results: SearchResult[],
  onShowResultsChange?: (show: boolean) => void,
  onSelect?: (result: SearchResult) => void
) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onShowResultsChange?.(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      onShowResultsChange?.(false);
    }, 200);
  };

  const handleResultClick = (result: SearchResult) => {
    onSelect?.(result);
    onShowResultsChange?.(false);
  };

  const shouldShowResults = showResults && (isFocused || results.length > 0);

  const getInputClasses = (className?: string) =>
    getSearchInputClasses(className);

  return {
    isFocused,
    handleFocus,
    handleBlur,
    handleResultClick,
    shouldShowResults,
    getInputClasses,
  };
};
