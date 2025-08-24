'use client';

import React from 'react';
import { useDashboardMetrics } from '@/infrastructure/queries/encounter-queries';
import { QueryStateHandlerWithHeader } from '@/presentation/components';
import { EncounterStatusChartProps } from './encounter-status-chart.interface';
import { useEncounterStatusChartLogic } from './encounter-status-chart.logic';

export const EncounterStatusChart: React.FC<EncounterStatusChartProps> = ({
  filters,
  isFilterLoading = false,
}) => {
  const { data: metrics, isLoading, error } = useDashboardMetrics(filters);
  const {
    getStatusColors,
    calculateChartData,
    calculatePieSlice,
    getSingleStatusCircle,
    getSingleStatusBorder,
  } = useEncounterStatusChartLogic();

  const statusData = metrics?.encountersByStatus || {};
  const { hasData, totalEncounters } = calculateChartData(statusData);
  const statusColors = getStatusColors();

  return (
    <QueryStateHandlerWithHeader
      isLoading={isFilterLoading || isLoading}
      loadingText="Loading Status Data..."
      error={error}
      errorTitle="Error loading chart data"
      title="Status Distribution"
      subtitle="Encounters by status"
    >
      <div className="space-y-6">
        {hasData && totalEncounters > 0 ? (
          <>
            <div className="flex items-center justify-center">
              <svg className="w-64 h-64" viewBox="0 0 256 256">
                {Object.entries(statusData).map(
                  ([status, count], index, array) => {
                    const percentage = (count / totalEncounters) * 100;
                    const color =
                      statusColors[status as keyof typeof statusColors] ||
                      '#6B7280';

                    if (Object.keys(statusData).length === 1) {
                      const circleProps = getSingleStatusCircle(color);
                      const borderProps = getSingleStatusBorder();

                      return (
                        <g key={status} className="group cursor-pointer">
                          <circle {...circleProps} />
                          <circle {...borderProps} />
                        </g>
                      );
                    }

                    const previousPercentages = array
                      .slice(0, index)
                      .reduce(
                        (sum, [, prevCount]) =>
                          sum + (prevCount / totalEncounters) * 100,
                        0
                      );

                    const { x1, y1, x2, y2, largeArcFlag } = calculatePieSlice(
                      percentage,
                      previousPercentages
                    );

                    const pathData = [
                      `M 128 128`,
                      `L ${x1} ${y1}`,
                      `A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      'Z',
                    ].join(' ');

                    return (
                      <g key={status} className="group cursor-pointer">
                        <path
                          d={pathData}
                          fill={color}
                          className="transition-all duration-300 hover:opacity-80"
                        />
                        <path
                          d={pathData}
                          fill="transparent"
                          stroke="white"
                          strokeWidth="2"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        />
                      </g>
                    );
                  }
                )}
              </svg>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(statusData).map(([status, count]) => {
                const percentage = ((count / totalEncounters) * 100).toFixed(1);
                const color =
                  statusColors[status as keyof typeof statusColors] ||
                  '#6B7280';

                return (
                  <div
                    key={status}
                    className="text-center p-3 rounded-lg border border-gray-200 bg-white"
                  >
                    <div
                      className="w-3 h-3 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {status.replace('-', ' ')}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {count}
                    </div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No encounter data available
          </div>
        )}
      </div>
    </QueryStateHandlerWithHeader>
  );
};
