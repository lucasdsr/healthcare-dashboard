'use client';

import React from 'react';
import { useDashboardMetrics } from '@/infrastructure/queries/encounter-queries';
import { QueryStateHandlerWithHeader } from '@/presentation/components';

interface EncounterStatusChartProps {
  filters?: any;
  isFilterLoading?: boolean;
}

export const EncounterStatusChart: React.FC<EncounterStatusChartProps> = ({
  filters,
  isFilterLoading = false,
}) => {
  const { data: metrics, isLoading, error } = useDashboardMetrics(filters);

  // Debug: verificar dados
  const statusData = metrics?.encountersByStatus || {};
  const hasData = Object.keys(statusData).length > 0;
  const totalEncounters = Object.values(statusData).reduce(
    (sum, count) => sum + count,
    0
  );

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
                      {
                        planned: '#3B82F6',
                        arrived: '#F59E0B',
                        triaged: '#F97316',
                        'in-progress': '#10B981',
                        onleave: '#8B5CF6',
                        finished: '#6B7280',
                        cancelled: '#EF4444',
                      }[status] || '#6B7280';

                    // Para um único status, renderizar como círculo completo
                    if (Object.keys(statusData).length === 1) {
                      return (
                        <g key={status} className="group cursor-pointer">
                          <circle
                            cx="128"
                            cy="128"
                            r="100"
                            fill={color}
                            className="transition-all duration-300 hover:opacity-80"
                          />
                          <circle
                            cx="128"
                            cy="128"
                            r="100"
                            fill="transparent"
                            stroke="white"
                            strokeWidth="2"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          />
                        </g>
                      );
                    }

                    // Para múltiplos status, renderizar como fatias de pizza
                    const previousPercentages = array
                      .slice(0, index)
                      .reduce(
                        (sum, [, prevCount]) =>
                          sum + (prevCount / totalEncounters) * 100,
                        0
                      );

                    const startAngle = (previousPercentages / 100) * 360;
                    const endAngle =
                      ((previousPercentages + percentage) / 100) * 360;

                    const x1 =
                      128 + 100 * Math.cos((startAngle * Math.PI) / 180);
                    const y1 =
                      128 + 100 * Math.sin((startAngle * Math.PI) / 180);
                    const x2 = 128 + 100 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 128 + 100 * Math.sin((endAngle * Math.PI) / 180);

                    const largeArcFlag = percentage > 50 ? 1 : 0;

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

                {/* Centro do gráfico */}
                <circle
                  cx="128"
                  cy="128"
                  r="40"
                  fill="white"
                  className="shadow-sm"
                />
                <text
                  x="128"
                  y="128"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg font-bold text-gray-700"
                >
                  {totalEncounters.toLocaleString()}
                </text>
                <text
                  x="128"
                  y="148"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs text-gray-500"
                >
                  Total
                </text>
              </svg>
            </div>

            {/* Legenda */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(statusData).map(([status, count]) => {
                const percentage =
                  totalEncounters > 0
                    ? ((count / totalEncounters) * 100).toFixed(1)
                    : '0';

                const color =
                  {
                    planned: '#3B82F6',
                    arrived: '#F59E0B',
                    triaged: '#F97316',
                    'in-progress': '#10B981',
                    onleave: '#8B5CF6',
                    finished: '#6B7280',
                    cancelled: '#EF4444',
                  }[status] || '#6B7280';

                return (
                  <div
                    key={status}
                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-xs"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="capitalize text-gray-700 font-medium truncate">
                          {status.replace('-', ' ')}
                        </span>
                        <span className="font-semibold text-gray-900 ml-2">
                          {count.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 text-sm">
              No status data available
            </div>
            <div className="text-gray-400 text-xs mt-1">
              Try adjusting your filters
            </div>
          </div>
        )}
      </div>
    </QueryStateHandlerWithHeader>
  );
};
