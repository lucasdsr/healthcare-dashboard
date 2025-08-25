import { DateRange, FilterOption } from '@/shared/types/filters';

export type { FilterOption, DateRange };

export interface DashboardFilters {
  status?: FilterOption[];
  dateRange?: DateRange;
  patient?: string;
  practitioner?: string;
}

export interface FilterBarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export interface FilterBarLogic {
  isExpanded: boolean;
  pendingFilters: DashboardFilters;
  patientSearchQuery: string;
  showPatientResults: boolean;
  isApplyingFilters: boolean;
  isSearching: boolean;
  patientSearchResults: any[] | undefined;
  hasActiveFilters: boolean;
  hasPendingChanges: boolean;
  isDateRangeValid: boolean;
  toggleExpanded: () => void;
  handleFilterChange: (key: string, value: any) => void;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
  handlePatientSelect: (result: {
    id: string;
    label: string;
    subtitle?: string;
  }) => void;
  handleStatusChange: (value: string) => void;
  handleStartDateChange: (start: Date | undefined) => void;
  handleEndDateChange: (end: Date | undefined) => void;
  formatPatientResults: () => any[];
  formatDateRange: (start?: Date, end?: Date) => string;
  setShowPatientResults: (show: boolean) => void;
}
