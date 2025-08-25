import { useState, useEffect, useCallback } from 'react';
import { usePatientSearch } from '@/infrastructure/queries/encounter-queries';
import {
  FilterBarLogic,
  FilterBarProps,
  DashboardFilters,
} from './filter-bar.interface';

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned', description: 'Appointment scheduled' },
  { value: 'arrived', label: 'Arrived', description: 'Patient has arrived' },
  {
    value: 'triaged',
    label: 'Triaged',
    description: 'Initial assessment completed',
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    description: 'Currently being treated',
  },
  {
    value: 'onleave',
    label: 'On Leave',
    description: 'Patient temporarily away',
  },
  { value: 'finished', label: 'Finished', description: 'Treatment completed' },
  {
    value: 'cancelled',
    label: 'Cancelled',
    description: 'Appointment cancelled',
  },
];

const getDefaultDateRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    start: firstDayOfMonth,
    end: today,
  };
};

export const useFilterBarLogic = ({
  filters,
  onFiltersChange,
  onLoadingChange,
}: FilterBarProps): FilterBarLogic => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(filters);
  const [patientSearchQuery, setPatientSearchQuery] = useState(
    filters.patient || ''
  );
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const { data: patientSearchResults, isLoading: isSearching } =
    usePatientSearch(patientSearchQuery);

  useEffect(() => {
    setPendingFilters(filters);
    setPatientSearchQuery(filters.patient || '');
  }, [filters]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      const newFilters = { ...pendingFilters, [key]: value };
      setPendingFilters(newFilters);

      if (key === 'patient') {
        setPatientSearchQuery(value || '');
      }
    },
    [pendingFilters]
  );

  const handleApplyFilters = useCallback(() => {
    setIsApplyingFilters(true);
    if (onLoadingChange) {
      onLoadingChange(true);
    }
    onFiltersChange(pendingFilters);

    setTimeout(() => {
      setIsApplyingFilters(false);
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    }, 2000);
  }, [pendingFilters, onFiltersChange, onLoadingChange]);

  const handleResetFilters = useCallback(() => {
    const defaultFilters = {
      status: undefined,
      dateRange: undefined,
      patient: undefined,
      practitioner: undefined,
    };

    setPendingFilters(defaultFilters);
    setPatientSearchQuery('');
    onFiltersChange(defaultFilters);
  }, [onFiltersChange]);

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (value === undefined || value === null || value === '') return false;

    if (key === 'status' && Array.isArray(value)) {
      return value.length > 0;
    }

    if (key === 'dateRange' && typeof value === 'object' && value !== null) {
      const dateRange = value as { start?: Date; end?: Date };
      return dateRange.start !== undefined || dateRange.end !== undefined;
    }

    if (typeof value === 'string') {
      return value.trim() !== '';
    }

    return true;
  });

  const hasPendingChanges =
    JSON.stringify(pendingFilters) !== JSON.stringify(filters);

  const isDateRangeValid = !(
    pendingFilters.dateRange?.start &&
    pendingFilters.dateRange?.end &&
    pendingFilters.dateRange.start > pendingFilters.dateRange.end
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

  const handlePatientSelect = useCallback(
    (result: { id: string; label: string; subtitle?: string }) => {
      setPatientSearchQuery(result.label);
      setShowPatientResults(false);
      handleFilterChange('patient', result.id);
    },
    [handleFilterChange]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      handleFilterChange(
        'status',
        value
          ? [
              {
                value,
                label:
                  STATUS_OPTIONS.find(opt => opt.value === value)?.label ||
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

  const formatPatientResults = useCallback(() => {
    if (!patientSearchResults) return [];

    return patientSearchResults.map(patient => ({
      id: patient.id,
      label: patient.name?.[0]?.text || `Patient ${patient.id}`,
      subtitle: `ID: ${patient.id}`,
    }));
  }, [patientSearchResults]);

  return {
    isExpanded,
    pendingFilters,
    patientSearchQuery,
    showPatientResults,
    isApplyingFilters,
    isSearching,
    patientSearchResults,
    hasActiveFilters,
    hasPendingChanges,
    isDateRangeValid,
    toggleExpanded,
    handleFilterChange,
    handleApplyFilters,
    handleResetFilters,
    handlePatientSelect,
    handleStatusChange,
    handleStartDateChange,
    handleEndDateChange,
    formatPatientResults,
    formatDateRange,
    setShowPatientResults,
  };
};
