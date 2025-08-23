'use client';

import React from 'react';
import {
  useDashboardMetrics,
  useEncounters,
} from '@/infrastructure/queries/encounter-queries';
import { Encounter } from '@/domain/entities/encounter';
import { Status } from '@/domain/value-objects/status';
import { DateRange } from '@/domain/value-objects/date-range';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components';

interface EncounterStatusChartProps {
  filters?: any;
  isFilterLoading?: boolean;
}

export const EncounterStatusChart: React.FC<EncounterStatusChartProps> = ({
  filters,
  isFilterLoading = false,
}) => {
  const { data: metrics, isLoading, error } = useDashboardMetrics(filters);

  // Show loading for filter changes, not initial load
  if (isFilterLoading || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Status Distribution
          </CardTitle>
          <p className="text-sm text-neutral-500">Encounters by status</p>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-72 lg:h-80 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-blue-700 font-medium text-lg">
                Loading Status Data...
              </div>
              <div className="text-blue-500 text-sm mt-2">
                Applying filters to encounters
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Status Distribution
          </CardTitle>
          <p className="text-sm text-neutral-500">Encounters by status</p>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-72 lg:h-80 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 text-sm">
                Error loading chart data
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusData = metrics?.encountersByStatus || {};
  const hasData = Object.keys(statusData).length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Status Distribution
          </CardTitle>
          <p className="text-sm text-neutral-500">Encounters by status</p>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-72 lg:h-80 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-neutral-500 text-sm">No data available</div>
              <div className="text-neutral-400 text-xs">
                Try adjusting your filters
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusColors: Record<string, string> = {
    planned: 'bg-blue-500',
    arrived: 'bg-yellow-500',
    triaged: 'bg-orange-500',
    'in-progress': 'bg-green-500',
    onleave: 'bg-purple-500',
    finished: 'bg-gray-500',
    cancelled: 'bg-red-500',
  };

  const totalEncounters = Object.values(statusData).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral-900">
          Status Distribution
        </CardTitle>
        <p className="text-sm text-neutral-500">Encounters by status</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(statusData).map(([status, count]) => {
              const percentage = ((count / totalEncounters) * 100).toFixed(1);
              const color = statusColors[status] || 'bg-neutral-500';

              return (
                <div key={status} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${color}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize text-neutral-700">
                        {status.replace('-', ' ')}
                      </span>
                      <span className="font-medium text-neutral-900">
                        {count}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-neutral-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">
                {totalEncounters.toLocaleString()}
              </div>
              <div className="text-sm text-neutral-500">Total Encounters</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
