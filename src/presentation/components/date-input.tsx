import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils/cn';

interface DateInputProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
  helpText?: string;
  format?: 'date' | 'datetime-local';
  timezone?: string;
}

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
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  // Initialize input value when component mounts or value changes
  useEffect(() => {
    if (value) {
      setInputValue(formatDateForInput(value));
    } else {
      setInputValue('');
    }
  }, [value]);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateForInput = (date: Date): string => {
    try {
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

  const parseDateFromInput = (dateString: string): Date | null => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch (error) {
      return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Only update parent if we have a valid date
    const parsedDate = parseDateFromInput(newValue);
    if (parsedDate || newValue === '') {
      onChange(parsedDate || undefined);
    }
  };

  const handleInputBlur = () => {
    // Validate and format on blur
    if (inputValue) {
      const parsedDate = parseDateFromInput(inputValue);
      if (parsedDate) {
        setInputValue(formatDateForInput(parsedDate));
      } else {
        // Invalid date, reset to previous value
        setInputValue(value ? formatDateForInput(value) : '');
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange(undefined);
  };

  const isError = !!error;
  const hasValue = !!value;

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
              'w-full border rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'hover:border-gray-400 hover:shadow-sm',
              sizeClasses[size],
              {
                'border-red-300 focus:border-red-500 focus:ring-red-500':
                  isError,
                'border-gray-300': !isError,
                'bg-gray-100 cursor-not-allowed': disabled,
                'bg-white': !disabled,
                'pr-10': clearable && hasValue,
                'pr-3': !clearable || !hasValue,
              },
              className
            )}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            required={required}
          />

          {/* Clear Button */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-8 flex items-center pr-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Clear date"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Calendar Picker (native browser picker) */}
        {isOpen && (
          <div className="absolute z-50 mt-1">
            {/* This will be handled by the native date picker */}
          </div>
        )}
      </div>

      {helpText && <p className="mt-2 text-xs text-gray-500">{helpText}</p>}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
