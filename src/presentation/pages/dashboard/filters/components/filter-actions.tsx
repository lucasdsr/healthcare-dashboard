import React from 'react';
import { Button } from '@/presentation/components';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface FilterActionsProps {
  hasActiveFilters: boolean;
  hasPendingChanges: boolean;
  isDateRangeValid: boolean;
  isApplyingFilters: boolean;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

export const FilterActions: React.FC<FilterActionsProps> = ({
  hasActiveFilters,
  hasPendingChanges,
  isDateRangeValid,
  isApplyingFilters,
  onResetFilters,
  onApplyFilters,
}) => (
  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
    <Button
      variant="success"
      onClick={onResetFilters}
      disabled={!hasActiveFilters}
    >
      Reset
    </Button>
    <Button
      variant="secondary"
      onClick={onApplyFilters}
      disabled={!hasPendingChanges || !isDateRangeValid || isApplyingFilters}
      className="relative"
    >
      {isApplyingFilters ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Applying...
        </div>
      ) : (
        <>
          <FunnelIcon className="h-4 w-4 mr-2" />
          Apply Filters
        </>
      )}
    </Button>
  </div>
);
