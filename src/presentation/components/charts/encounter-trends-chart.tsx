'use client';

import React from 'react';
import { useDashboardMetrics } from '@/infrastructure/queries/encounter-queries';
import { QueryStateHandlerWithHeader } from '@/presentation/components';
import { EncounterTrendsChartProps } from './encounter-trends-chart.interface';
import { useEncounterTrendsChartLogic } from './encounter-trends-chart.logic';

export const EncounterTrendsChart: React.FC<EncounterTrendsChartProps> = ({
  filters,
  isFilterLoading = false,
}) => {
  const { data: metrics, isLoading, error } = useDashboardMetrics(filters);
  const {
    getChartDimensions,
    calculateBarHeight,
    formatDate,
    sortDates,
    calculateTotalEncounters,
    getBarClasses,
    getChartContainerClasses,
  } = useEncounterTrendsChartLogic();

  const encountersByDate = metrics?.encountersByDate || {};
  const sortedDates = sortDates(encountersByDate);
  const maxValue = Math.max(...Object.values(encountersByDate));
  const totalEncounters = calculateTotalEncounters(encountersByDate);
  const dimensions = getChartDimensions();
  const barClasses = getBarClasses();
  const containerClasses = getChartContainerClasses();

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
        <div className={containerClasses.main}>
          <div className={containerClasses.scrollContainer}>
            <div className={containerClasses.chartArea}>
              {sortedDates.map(([date, count]) => {
                const height = calculateBarHeight(
                  count,
                  maxValue,
                  dimensions.maxHeight,
                  dimensions.minHeight
                );

                return (
                  <div
                    key={date}
                    className={barClasses.container}
                    style={{ minWidth: `${dimensions.barMinWidth}px` }}
                  >
                    <div className={barClasses.date}>{formatDate(date)}</div>
                    <div className={barClasses.barWrapper}>
                      <div
                        className={barClasses.bar}
                        style={{
                          height: `${height}px`,
                          minHeight: `${dimensions.minHeight}px`,
                          width: `${dimensions.barWidth}px`,
                        }}
                      >
                        <div className={barClasses.tooltip}>
                          <div className="font-semibold">
                            {count} encounters
                          </div>
                          <div className="text-gray-300 text-xs">
                            {formatDate(date)}
                          </div>
                          <div className={barClasses.tooltipArrow}></div>
                        </div>
                      </div>
                    </div>
                    <div className={barClasses.count}>
                      {count.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={containerClasses.summaryContainer}>
          <div className={containerClasses.summaryGrid}>
            <div className={containerClasses.summaryItem}>
              <div className={containerClasses.summaryValue}>
                {totalEncounters.toLocaleString()}
              </div>
              <div className={containerClasses.summaryLabel}>
                Total Encounters
              </div>
            </div>
            <div className={containerClasses.summaryItem}>
              <div className={containerClasses.summaryValue}>
                {sortedDates.length}
              </div>
              <div className={containerClasses.summaryLabel}>
                Days with Data
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryStateHandlerWithHeader>
  );
};
