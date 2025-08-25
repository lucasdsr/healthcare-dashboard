'use client';

import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SearchInputProps } from './search-input.interface';
import { useSearchInputLogic } from './search-input.logic';

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Search...',
  results = [],
  isLoading = false,
  className,
  showResults = false,
  onShowResultsChange,
}) => {
  const {
    handleFocus,
    handleBlur,
    handleResultClick,
    shouldShowResults,
    getInputClasses,
  } = useSearchInputLogic(showResults, results, onShowResultsChange, onSelect);

  const inputClasses = getInputClasses(className);

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder={placeholder}
          className={inputClasses}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {shouldShowResults && (
        <div
          data-testid="search-results"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div
              data-testid="search-loading"
              className="p-4 text-center text-gray-500"
            >
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map(result => (
                <div
                  key={result.id}
                  data-testid="search-result"
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="font-medium text-gray-900">
                    {result.label}
                  </div>
                  {result.subtitle && (
                    <div className="text-sm text-gray-600 mt-1">
                      {result.subtitle}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : value.length > 2 ? (
            <div
              data-testid="no-results"
              className="p-4 text-center text-gray-500"
            >
              No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
