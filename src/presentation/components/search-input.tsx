import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils/cn';

interface SearchResult {
  id: string;
  label: string;
  subtitle?: string;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  results?: SearchResult[];
  isLoading?: boolean;
  className?: string;
  showResults?: boolean;
  onShowResultsChange?: (show: boolean) => void;
}

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

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500',
            className
          )}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {shouldShowResults && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div>
              {results.map(result => (
                <div
                  key={result.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="font-medium">{result.label}</div>
                  {result.subtitle && (
                    <div className="text-sm text-gray-600">
                      {result.subtitle}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : value.length > 2 ? (
            <div className="p-3 text-center text-gray-500">
              No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
