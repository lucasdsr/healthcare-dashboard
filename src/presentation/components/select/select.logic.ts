import { useState, useRef, useEffect } from 'react';
import { SelectOption } from './select.interface';
import {
  getSelectBaseClasses,
  getSelectStateClasses,
  getInputSizeClasses,
} from '@/shared/utils/input-classes';

export const useSelectLogic = (
  options: SelectOption[],
  value: string | undefined,
  onChange: (value: string) => void,
  searchable: boolean,
  clearable: boolean
) => {
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

  const sizeClasses = getInputSizeClasses();

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

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOptionClick = (option: SelectOption) => {
    if (!option.disabled) {
      handleSelect(option.value);
    }
  };

  const handleOptionMouseEnter = (index: number) => {
    setHighlightedIndex(index);
  };

  const getSelectClasses = (
    className?: string,
    isError?: boolean,
    disabled?: boolean
  ) => {
    const baseClasses = getSelectBaseClasses(className);
    const stateClasses = getSelectStateClasses(!!isError, !!disabled);

    return {
      base: baseClasses,
      state: stateClasses,
    };
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  return {
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
  };
};
