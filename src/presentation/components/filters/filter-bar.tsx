'use client';

import React, { useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import {
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: {
    status?: FilterOption[];
    dateRange?: { start: Date; end: Date };
    patient?: string;
    practitioner?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== null && value !== ''
  );

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-neutral-500" />
            <span className="font-medium text-neutral-700">Filters</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Active
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={localFilters.status?.[0]?.value || ''}
                  onChange={e =>
                    handleFilterChange(
                      'status',
                      e.target.value
                        ? [
                            {
                              value: e.target.value,
                              label:
                                e.target.options[e.target.selectedIndex].text,
                            },
                          ]
                        : undefined
                    )
                  }
                >
                  <option value="">All Statuses</option>
                  <option value="planned">Planned</option>
                  <option value="arrived">Arrived</option>
                  <option value="triaged">Triaged</option>
                  <option value="in-progress">In Progress</option>
                  <option value="onleave">On Leave</option>
                  <option value="finished">Finished</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={
                    localFilters.dateRange?.start
                      ?.toISOString()
                      .split('T')[0] || ''
                  }
                  onChange={e => {
                    const start = e.target.value
                      ? new Date(e.target.value)
                      : undefined;
                    const end = localFilters.dateRange?.end;
                    handleFilterChange(
                      'dateRange',
                      start && end ? { start, end } : undefined
                    );
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={
                    localFilters.dateRange?.end?.toISOString().split('T')[0] ||
                    ''
                  }
                  onChange={e => {
                    const end = e.target.value
                      ? new Date(e.target.value)
                      : undefined;
                    const start = localFilters.dateRange?.start;
                    handleFilterChange(
                      'dateRange',
                      start && end ? { start, end } : undefined
                    );
                  }}
                />
              </div>
            </div>

            {/* Search Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Patient Search
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by patient name or ID..."
                    className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={localFilters.patient || ''}
                    onChange={e =>
                      handleFilterChange('patient', e.target.value || undefined)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Practitioner Search
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by practitioner name..."
                    className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={localFilters.practitioner || ''}
                    onChange={e =>
                      handleFilterChange(
                        'practitioner',
                        e.target.value || undefined
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
