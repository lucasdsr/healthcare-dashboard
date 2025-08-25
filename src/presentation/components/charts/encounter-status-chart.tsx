'use client';

import React from 'react';
import { useDashboardMetrics } from '@/infrastructure/queries/encounter-queries';
import { QueryStateHandlerWithHeader } from '@/presentation/components';
import { EncounterStatusChartProps } from './encounter-status-chart.interface';
import { useEncounterStatusChartLogic } from './encounter-status-chart.logic';
import { usePerformance } from '@/presentation/hooks/use-performance';

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
    getCenterCircleClasses,
    getLegendClasses,
  } = useEncounterStatusChartLogic();

  const { measureOperation } = usePerformance('EncounterStatusChart');

  const statusData = metrics?.encountersByStatus || {};
  const { hasData, totalEncounters } = calculateChartData(statusData);
  const statusColors = getStatusColors();
  const centerCircleClasses = getCenterCircleClasses();
  const legendClasses = getLegendClasses();

  const handleChartInteraction = (status: string, count: number) => {
    measureOperation('chart-interaction', () => {});
  };

  return (
    <QueryStateHandlerWithHeader
      isLoading={isFilterLoading || isLoading}
      loadingText="Loading Status Data..."
      error={error}
      errorTitle="Error loading chart data"
      title="Status Distribution"
      subtitle="Encounters by status"
    >
      <div
        className="space-y-6"
        role="region"
        aria-label="Encounter Status Distribution Chart"
      >
        {hasData && totalEncounters > 0 ? (
          <>
            <div className="flex items-center justify-center">
              <svg
                className="w-64 h-64"
                viewBox="0 0 256 256"
                role="img"
                aria-labelledby="chart-title chart-description"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const firstLegendItem = document.querySelector(
                      '[data-testid="legend-item"]'
                    );
                    if (firstLegendItem instanceof HTMLElement) {
                      firstLegendItem.focus();
                    }
                  }
                }}
              >
                <title id="chart-title">Encounter Status Distribution</title>
                <desc id="chart-description">
                  Pie chart showing distribution of encounters by status. Total
                  encounters: {totalEncounters.toLocaleString()}
                </desc>

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
                        <g
                          key={status}
                          className="group cursor-pointer"
                          role="button"
                          tabIndex={0}
                          aria-label={`${status} status: ${count} encounters (${percentage.toFixed(1)}%)`}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleChartInteraction(status, count);
                            }
                          }}
                          onClick={() => handleChartInteraction(status, count)}
                        >
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
                      <g
                        key={status}
                        className="group cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={`${status} status: ${count} encounters (${percentage.toFixed(1)}%)`}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleChartInteraction(status, count);
                          }
                        }}
                        onClick={() => handleChartInteraction(status, count)}
                      >
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
                  className={centerCircleClasses.circle}
                  role="presentation"
                  aria-hidden="true"
                />
                <text
                  x="128"
                  y="128"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={centerCircleClasses.totalText}
                  role="text"
                  aria-label={`Total encounters: ${totalEncounters.toLocaleString()}`}
                >
                  {totalEncounters.toLocaleString()}
                </text>
                <text
                  x="128"
                  y="148"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={centerCircleClasses.labelText}
                  role="text"
                  aria-label="Total"
                >
                  Total
                </text>
              </svg>
            </div>

            {/* Legenda */}
            <div
              className={legendClasses.container}
              role="list"
              aria-label="Status Legend"
            >
              {Object.entries(statusData).map(([status, count], index) => {
                const percentage =
                  totalEncounters > 0
                    ? ((count / totalEncounters) * 100).toFixed(1)
                    : '0';

                const color =
                  statusColors[status as keyof typeof statusColors] ||
                  '#6B7280';

                return (
                  <div
                    key={status}
                    className={legendClasses.item}
                    role="listitem"
                    data-testid="legend-item"
                    tabIndex={0}
                    aria-label={`${status.replace('-', ' ')}: ${count.toLocaleString()} encounters (${percentage}%)`}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleChartInteraction(status, count);
                      }
                    }}
                    onClick={() => handleChartInteraction(status, count)}
                  >
                    <div className="relative">
                      <div className={legendClasses.colorDot}></div>
                      <div
                        className="absolute inset-0 w-3 h-3 rounded-full mx-auto mt-0.5"
                        style={{ backgroundColor: color }}
                        role="presentation"
                        aria-hidden="true"
                      ></div>
                    </div>
                    <div className={legendClasses.content}>
                      <div className={legendClasses.header}>
                        <span className={legendClasses.status}>
                          {status.replace('-', ' ')}
                        </span>
                        <span className={legendClasses.count}>
                          {count.toLocaleString()}
                        </span>
                      </div>
                      <div className={legendClasses.percentage}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8" role="status" aria-live="polite">
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
