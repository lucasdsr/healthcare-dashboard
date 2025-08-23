'use client';

import React from 'react';
import { useDashboardMetrics } from '@/infrastructure/queries/encounter-queries';
import { QueryStateHandlerWithHeader } from '@/presentation/components';

interface EncounterTrendsChartProps {
  filters?: any;
  isFilterLoading?: boolean;
}

export const EncounterTrendsChart: React.FC<EncounterTrendsChartProps> = ({
  filters,
  isFilterLoading = false,
}) => {
  const { data: metrics, isLoading, error } = useDashboardMetrics(filters);

  return (
    <QueryStateHandlerWithHeader
      isLoading={isFilterLoading || isLoading}
      loadingText="Loading Trend Data..."
      error={error}
      errorTitle="Error loading chart data"
      title="Daily Trends"
      subtitle="Daily encounter volume for the last week"
    >
      <div className="space-y-6">
        <div className="h-64 md:h-72 lg:h-80 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="h-full overflow-x-auto">
            <div className="h-full flex items-end px-6 py-4 min-w-max">
              {Object.entries(metrics?.encountersByDate || {})
                .sort(
                  ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
                )
                .map(([date, count]) => {
                  const maxValue = Math.max(
                    ...Object.values(metrics?.encountersByDate || {})
                  );
                  const maxHeight = 100;
                  const height =
                    maxValue > 0
                      ? Math.max((count / maxValue) * maxHeight, 20)
                      : 20;

                  return (
                    <div
                      key={date}
                      className="flex flex-col items-center justify-end relative group mx-3 first:ml-0 last:mr-0"
                      style={{ minWidth: '80px' }}
                    >
                      <div className="text-xs text-gray-600 mb-3 text-center font-medium">
                        {new Date(date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="w-full relative flex flex-col items-center">
                        <div
                          className="bg-gradient-to-t from-slate-600 to-slate-500 rounded-t-lg transition-all duration-300 hover:from-slate-700 hover:to-slate-600 shadow-md hover:shadow-lg group-hover:scale-105"
                          style={{
                            height: `${height}px`,
                            minHeight: '20px',
                            width: '50px',
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg z-10">
                            <div className="font-semibold">
                              {count} encounters
                            </div>
                            <div className="text-gray-300 text-xs">
                              {new Date(date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mt-3 font-semibold text-center">
                        {count.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Object.values(metrics?.encountersByDate || {})
                  .reduce((sum, count) => sum + count, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Total Encounters
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">
                {Math.max(
                  ...Object.values(metrics?.encountersByDate || {}),
                  0
                ).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Peak Daily
              </div>
            </div>
          </div>
        </div>

        {Object.keys(metrics?.encountersByDate || {}).length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 text-sm">No trend data available</div>
            <div className="text-gray-400 text-xs mt-1">
              Try adjusting your date filters
            </div>
          </div>
        )}
      </div>
    </QueryStateHandlerWithHeader>
  );
};
