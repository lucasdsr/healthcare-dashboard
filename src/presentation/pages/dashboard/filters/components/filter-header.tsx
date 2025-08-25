import React from 'react';
import { Button, Badge } from '@/presentation/components';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface FilterHeaderProps {
  hasActiveFilters: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  hasActiveFilters,
  isExpanded,
  onToggleExpanded,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <FunnelIcon className="h-5 w-5 text-gray-600" />
        <span className="font-semibold text-gray-800 text-lg">Filters</span>
      </div>
      {hasActiveFilters && (
        <Badge variant="info" size="sm">
          Active
        </Badge>
      )}
    </div>

    <div className="flex items-center space-x-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={onToggleExpanded}
        className="flex items-center space-x-2"
      >
        {isExpanded ? 'Hide' : 'Show'} Filters
      </Button>
    </div>
  </div>
);
