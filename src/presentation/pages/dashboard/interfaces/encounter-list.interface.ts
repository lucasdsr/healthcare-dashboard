import { Encounter } from '@/domain/entities/encounter';

export interface EncounterListProps {
  filters?: any;
  isFilterLoading?: boolean;
}

export interface EncounterRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    encounters: Encounter[];
  };
}

export interface EncounterListLogic {
  encounters: Encounter[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  listHeight: number;
  isLoading: boolean;
  error: any;
  isDemoModeEnabled: boolean;
  shouldShowDemoModeIndicator: boolean;
  handlePageChange: (newPage: number) => void;
}
