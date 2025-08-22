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
}

export const EncounterTrendsChart: React.FC<EncounterTrendsChartProps> = ({
  filters,
}) => {
  const { data: metrics, isLoading, error } = useDashboardMetrics(filters);

  if (isLoading) {
    return (
      <Card className="bg-white border border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Daily Trends
          </CardTitle>
          <p className="text-sm text-neutral-500">
            Daily encounter volume for the last week
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-72 lg:h-80 bg-neutral-100 animate-pulse rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white border border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Daily Trends
          </CardTitle>
          <p className="text-sm text-neutral-500">
            Daily encounter volume for the last week
          </p>
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

  const dateData = metrics?.encountersByDate || {};
  const hasData = Object.keys(dateData).length > 0;

  if (!hasData) {
    return (
      <Card className="bg-white border border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Daily Trends
          </CardTitle>
          <p className="text-sm text-neutral-500">
            Daily encounter volume for the last week
          </p>
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
    <Card className="bg-white border border-neutral-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral-900">
          Daily Trends
        </CardTitle>
        <p className="text-sm text-neutral-500">
          Daily encounter volume for the last week
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-72 lg:h-80 flex items-end justify-between space-x-2">
          {sortedDates.map((date, index) => {
            const value = dateData[date];
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;

            return (
              <div key={date} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-neutral-500 mb-2 text-center">
                  {formatDate(date)}
                </div>
                <div className="w-full bg-blue-100 rounded-t-sm relative">
                  <div
                    className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                      {value} encounters
                    </div>
                  </div>
                </div>
                <div className="text-xs text-neutral-700 mt-2 font-medium">
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-neutral-200 mt-4">
          <div className="flex justify-between items-center text-sm text-neutral-600">
            <span>
              Total:{' '}
              {Object.values(dateData).reduce((sum, count) => sum + count, 0)}
            </span>
            <span>Max: {maxValue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
