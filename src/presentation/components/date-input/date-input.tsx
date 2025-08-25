'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils/cn';
import { DateInputProps } from './date-input.interface';
import { useDateInputLogic } from './date-input.logic';

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  className,
  disabled = false,
  min,
  max,
  error,
  required = false,
  size = 'md',
  clearable = true,
  helpText,
  format = 'date',
  timezone = 'UTC',
}) => {
  const {
    isOpen,
    inputValue,
    inputRef,
    containerRef,
    sizeClasses,
    getInputClasses,
    handleInputChange,
    handleInputBlur,
    handleClear,
    handleFocus,
  } = useDateInputLogic(value, onChange);

  const isError = !!error;
  const hasValue = !!value;
  const inputClasses = getInputClasses(
    className,
    isError,
    disabled,
    clearable,
    hasValue
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative" ref={containerRef}>
        <div className="relative">
          <input
            ref={inputRef}
            type={format}
            className={cn(
              inputClasses.base,
              sizeClasses[size],
              inputClasses.state,
              inputClasses.padding,
              '[-webkit-calendar-picker-indicator:hidden] [calendar-picker-indicator:hidden]'
            )}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            required={required}
          />

          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-3 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Clear date"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {isOpen && <div className="absolute z-50 mt-1"></div>}
      </div>

      {helpText && <p className="mt-2 text-xs text-gray-500">{helpText}</p>}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
