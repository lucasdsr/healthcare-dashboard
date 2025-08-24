'use client';

import React from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils/cn';
import { SelectProps } from './select.interface';
import { useSelectLogic } from './select.logic';

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
  const {
    isOpen,
    searchQuery,
    highlightedIndex,
    selectRef,
    searchInputRef,
    selectedOption,
    filteredOptions,
    sizeClasses,
    getSelectClasses,
    handleKeyDown,
    handleClear,
    toggleOpen,
    handleSearchChange,
    handleOptionClick,
    handleOptionMouseEnter,
  } = useSelectLogic(options, value, onChange, searchable, clearable);

  const isError = !!error;
  const selectClasses = getSelectClasses(className, isError, disabled);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative" ref={selectRef}>
        <div
          className={cn(
            selectClasses.base,
            sizeClasses[size],
            selectClasses.state
          )}
          onClick={() => !disabled && toggleOpen()}
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
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  {searchQuery ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    className={cn(
                      'px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0',
                      {
                        'bg-blue-50 text-blue-900 border-blue-200':
                          index === highlightedIndex,
                        'hover:bg-gray-50': index !== highlightedIndex,
                        'opacity-50 cursor-not-allowed': option.disabled,
                      }
                    )}
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={() => handleOptionMouseEnter(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {option.description}
                          </div>
                        )}
                      </div>
                      {option.value === value && (
                        <CheckIcon className="w-4 h-4 text-blue-600 ml-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {helpText && <p className="mt-2 text-xs text-gray-500">{helpText}</p>}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
