import { DashboardFilters } from '../filters/filter-bar.interface';

export interface DashboardLayoutProps {}

export interface DashboardLayoutLogic {
  filters: DashboardFilters;
  showInfo: boolean;
  isInitialLoad: boolean;
  isFilterLoading: boolean;
  isFirstRender: boolean;
  handleFiltersChange: (newFilters: DashboardFilters) => void;
  handleFilterLoading: (loading: boolean) => void;
  toggleInfo: () => void;
  fhirFilters: any;
}
