import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils/cn';

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  searchable?: boolean;
  clearable?: boolean;
  label?: string;
  helpText?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false,
  error,
  required = false,
  size = 'md',
  searchable = false,
  clearable = true,
  label,
  helpText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);
  const filteredOptions = searchable
    ? options.filter(
        option =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const sizeClasses = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  const isError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative" ref={selectRef}>
        <div
          className={cn(
            'relative w-full border rounded-md cursor-pointer transition-colors',
            'focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500',
            sizeClasses[size],
            {
              'border-red-300 focus-within:border-red-500 focus-within:ring-red-500':
                isError,
              'border-neutral-300': !isError,
              'bg-neutral-100 cursor-not-allowed': disabled,
              'bg-white hover:border-neutral-400': !disabled,
            },
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${label}-label` : undefined}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {selectedOption ? (
                <span className="block truncate text-neutral-900">
                  {selectedOption.label}
                </span>
              ) : (
                <span className="block truncate text-neutral-500">
                  {placeholder}
                </span>
              )}
            </div>

            <div className="flex items-center ml-2">
              {clearable && value && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label="Clear selection"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              <ChevronDownIcon
                className={cn('w-4 h-4 text-neutral-400 transition-transform', {
                  'rotate-180': isOpen,
                })}
              />
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-neutral-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-neutral-500 text-center">
                  {searchQuery ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    className={cn(
                      'px-3 py-2 cursor-pointer transition-colors',
                      {
                        'bg-primary-50 text-primary-900':
                          index === highlightedIndex,
                        'hover:bg-neutral-50': index !== highlightedIndex,
                        'opacity-50 cursor-not-allowed': option.disabled,
                      }
                    )}
                    onClick={() =>
                      !option.disabled && handleSelect(option.value)
                    }
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-neutral-500 mt-1">
                            {option.description}
                          </div>
                        )}
                      </div>
                      {option.value === value && (
                        <CheckIcon className="w-4 h-4 text-primary-600 ml-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {helpText && <p className="mt-1 text-sm text-neutral-500">{helpText}</p>}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
