export interface FilterOption {
  label: string;
  value: string;
  description?: string;
}

export interface DateRange {
  start?: Date;
  end?: Date;
}

export interface EncounterFilters {
  status?: string;
  dateRange?: DateRange;
  patient?: string;
  practitioner?: string;
  _count?: number;
  _page?: number;
}

export interface FilterState {
  status?: FilterOption[];
  dateRange?: DateRange;
  patient?: string;
  practitioner?: string;
}

export interface PatientSearchResult {
  id: string;
  label: string;
  subtitle?: string;
}
