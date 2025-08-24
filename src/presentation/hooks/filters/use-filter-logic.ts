import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  FilterState,
  EncounterFilters,
  DateRange,
} from '@/shared/types/filters';

export const useFilterLogic = (initialFilters: EncounterFilters) => {
  const [pendingFilters, setPendingFilters] = useState<FilterState>(() => ({
    status: initialFilters.status
      ? [{ value: initialFilters.status, label: initialFilters.status }]
      : undefined,
    dateRange: initialFilters.dateRange,
    patient: initialFilters.patient,
    practitioner: initialFilters.practitioner,
  }));
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const prevFiltersRef = useRef(initialFilters);

  useEffect(() => {
    if (
      JSON.stringify(prevFiltersRef.current) !== JSON.stringify(initialFilters)
    ) {
      setPendingFilters({
        status: initialFilters.status
          ? [{ value: initialFilters.status, label: initialFilters.status }]
          : undefined,
        dateRange: initialFilters.dateRange,
        patient: initialFilters.patient,
        practitioner: initialFilters.practitioner,
      });
      prevFiltersRef.current = initialFilters;
    }
  }, [initialFilters]);

  const getDefaultDateRange = useCallback(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      start: firstDayOfMonth,
      end: today,
    };
  }, []);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setPendingFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Object.entries(initialFilters).some(([key, value]) => {
        if (value === undefined || value === null || value === '') return false;

        if (key === 'status' && typeof value === 'string') {
          return value.trim() !== '';
        }

        if (
          key === 'dateRange' &&
          typeof value === 'object' &&
          value !== null
        ) {
          const dateRange = value as DateRange;
          return dateRange.start !== undefined || dateRange.end !== undefined;
        }

        if (typeof value === 'string') {
          return value.trim() !== '';
        }

        return true;
      }),
    [initialFilters]
  );

  const hasPendingChanges = useMemo(() => {
    const currentFilters = {
      status: pendingFilters.status?.[0]?.value,
      dateRange: pendingFilters.dateRange,
      patient: pendingFilters.patient,
      practitioner: pendingFilters.practitioner,
    };
    return JSON.stringify(currentFilters) !== JSON.stringify(initialFilters);
  }, [pendingFilters, initialFilters]);

  const isDateRangeValid = useMemo(
    () =>
      !(
        pendingFilters.dateRange?.start &&
        pendingFilters.dateRange?.end &&
        pendingFilters.dateRange.start > pendingFilters.dateRange.end
      ),
    [pendingFilters.dateRange]
  );

  const formatDateRange = useCallback((start?: Date, end?: Date) => {
    if (!start && !end) return '';
    if (start && end) {
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    }
    if (start) return `From ${start.toLocaleDateString()}`;
    if (end) return `Until ${end.toLocaleDateString()}`;
    return '';
  }, []);

  const handleStatusChange = useCallback(
    (value: string) => {
      const statusOptions = [
        { value: 'planned', label: 'Planned' },
        { value: 'arrived', label: 'Arrived' },
        { value: 'triaged', label: 'Triaged' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'onleave', label: 'On Leave' },
        { value: 'finished', label: 'Finished' },
        { value: 'cancelled', label: 'Cancelled' },
      ];

      handleFilterChange(
        'status',
        value
          ? [
              {
                value,
                label:
                  statusOptions.find(opt => opt.value === value)?.label ||
                  value,
              },
            ]
          : undefined
      );
    },
    [handleFilterChange]
  );

  const handleStartDateChange = useCallback(
    (start: Date | undefined) => {
      const end = pendingFilters.dateRange?.end;
      if (start && end && start > end) {
        return;
      }
      handleFilterChange(
        'dateRange',
        start && end ? { start, end } : start ? { start } : undefined
      );
    },
    [pendingFilters.dateRange?.end, handleFilterChange]
  );

  const handleEndDateChange = useCallback(
    (end: Date | undefined) => {
      const start = pendingFilters.dateRange?.start;
      if (start && end && start > end) {
        return;
      }
      handleFilterChange(
        'dateRange',
        start && end ? { start, end } : end ? { end } : undefined
      );
    },
    [pendingFilters.dateRange?.start, handleFilterChange]
  );

  const handleResetFilters = useCallback(() => {
    const defaultFilters = {
      dateRange: getDefaultDateRange(),
    };
    setPendingFilters(defaultFilters);
    return defaultFilters;
  }, [getDefaultDateRange]);

  const handleApplyFilters = useCallback(
    async (
      onFiltersChange: (filters: EncounterFilters) => void,
      onLoadingChange?: (loading: boolean) => void
    ) => {
      setIsApplyingFilters(true);
      if (onLoadingChange) {
        onLoadingChange(true);
      }

      const filtersToApply: EncounterFilters = {
        status: pendingFilters.status?.[0]?.value,
        dateRange: pendingFilters.dateRange,
        patient: pendingFilters.patient,
        practitioner: pendingFilters.practitioner,
      };

      onFiltersChange(filtersToApply);

      setTimeout(() => {
        setIsApplyingFilters(false);
        if (onLoadingChange) {
          onLoadingChange(false);
        }
      }, 2000);
    },
    [pendingFilters]
  );

  return {
    pendingFilters,
    isApplyingFilters,
    hasActiveFilters,
    hasPendingChanges,
    isDateRangeValid,
    formatDateRange,
    handleFilterChange,
    handleStatusChange,
    handleStartDateChange,
    handleEndDateChange,
    handleResetFilters,
    handleApplyFilters,
  };
};
