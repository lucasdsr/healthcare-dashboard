import { useState, useRef, useEffect } from 'react';
import {
  getInputBaseClasses,
  getInputSizeClasses,
  getInputStateClasses,
  getInputPaddingClasses,
} from '@/shared/utils/input-classes';

export const useDateInputLogic = (
  value: Date | undefined,
  onChange: (date: Date | undefined) => void
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = getInputSizeClasses();

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

    const parsedDate = parseDateFromInput(newValue);
    if (parsedDate || newValue === '') {
      onChange(parsedDate || undefined);
    }
  };

  const handleInputBlur = () => {
    if (inputValue) {
      const parsedDate = parseDateFromInput(inputValue);
      if (parsedDate) {
        setInputValue(formatDateForInput(parsedDate));
      } else {
        setInputValue(value ? formatDateForInput(value) : '');
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange(undefined);
  };

  const handleFocus = () => setIsOpen(true);

  const getInputClasses = (
    className?: string,
    isError?: boolean,
    disabled?: boolean,
    clearable?: boolean,
    hasValue?: boolean
  ) => {
    const baseClasses = getInputBaseClasses(className);
    const stateClasses = getInputStateClasses(!!isError, !!disabled);
    const paddingClasses = getInputPaddingClasses(!!clearable, !!hasValue);

    return {
      base: baseClasses,
      state: stateClasses,
      padding: paddingClasses,
    };
  };

  useEffect(() => {
    if (value) {
      setInputValue(formatDateForInput(value));
    } else {
      setInputValue('');
    }
  }, [value]);

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

  return {
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
  };
};
