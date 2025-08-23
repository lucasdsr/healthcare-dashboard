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

interface EncounterTrendsChartProps {
  filters?: any;
  isFilterLoading?: boolean;
}

export const EncounterTrendsChart: React.FC<EncounterTrendsChartProps> = ({
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
            Daily Trends
          </CardTitle>
          <p className="text-sm text-neutral-500">
            Daily encounter volume for the last week
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-72 lg:h-80 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-dashed border-green-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <div className="text-green-700 font-medium text-lg">
                Loading Trend Data...
              </div>
              <div className="text-green-500 text-sm mt-2">
                Calculating daily statistics
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">
            Daily Trends
          </CardTitle>
          <p className="text-sm text-gray-600">
            Daily encounter volume for the last week
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-72 lg:h-80 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 text-lg font-medium">
                Error loading chart data
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const dateData = metrics?.encountersByDate || {};
  const hasData = Object.keys(dateData).length > 0;

  if (!hasData) {
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">
            Daily Trends
          </CardTitle>
          <p className="text-sm text-gray-600">
            Daily encounter volume for the last week
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-72 lg:h-80 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-500 text-lg font-medium">
                No data available
              </div>
              <div className="text-gray-400 text-sm mt-2">
                Try adjusting your filters
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedDates = Object.keys(dateData).sort();
  const maxValue = Math.max(...Object.values(dateData));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900">
          Daily Trends
        </CardTitle>
        <p className="text-sm text-gray-600">
          Daily encounter volume for the last week
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-64 md:h-72 lg:h-80 flex items-end justify-between space-x-3 p-6 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-200">
            {sortedDates.map((date, index) => {
              const value = dateData[date];
              const maxHeight = 120; // altura máxima em pixels
              const height =
                maxValue > 0
                  ? Math.max((value / maxValue) * maxHeight, 20)
                  : 20;

              return (
                <div
                  key={date}
                  className="flex-1 flex flex-col items-center justify-end relative group"
                >
                  <div className="text-xs text-gray-600 mb-3 text-center font-medium">
                    {formatDate(date)}
                  </div>
                  <div className="w-full relative flex flex-col items-center">
                    <div
                      className="bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg group-hover:scale-105"
                      style={{
                        height: `${height}px`,
                        minHeight: '20px',
                        width: '70%',
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                        <div className="font-semibold">{value} encounters</div>
                        <div className="text-gray-300 text-xs">
                          {formatDate(date)}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mt-3 font-semibold">
                    {value.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {Object.values(dateData)
                    .reduce((sum, count) => sum + count, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Total Encounters
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {maxValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Peak Daily
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
