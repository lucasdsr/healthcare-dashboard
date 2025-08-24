export const useEncounterTrendsChartLogic = () => {
  const getChartDimensions = () => ({
    maxHeight: 100,
    minHeight: 20,
    barWidth: 50,
    barMinWidth: 80,
  });

  const calculateBarHeight = (
    count: number,
    maxValue: number,
    maxHeight: number,
    minHeight: number
  ) => {
    if (maxValue <= 0) return minHeight;
    return Math.max((count / maxValue) * maxHeight, minHeight);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  const sortDates = (encountersByDate: Record<string, number>) =>
    Object.entries(encountersByDate).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );

  const calculateTotalEncounters = (encountersByDate: Record<string, number>) =>
    Object.values(encountersByDate).reduce((sum, count) => sum + count, 0);

  const getBarClasses = () => ({
    container:
      'flex flex-col items-center justify-end relative group mx-3 first:ml-0 last:mr-0',
    date: 'text-xs text-gray-600 mb-3 text-center font-medium',
    barWrapper: 'w-full relative flex flex-col items-center',
    bar: 'bg-gradient-to-t from-slate-600 to-slate-500 rounded-t-lg transition-all duration-300 hover:from-slate-700 hover:to-slate-600 shadow-md hover:shadow-lg group-hover:scale-105',
    tooltip:
      'absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg z-10',
    tooltipArrow:
      'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800',
    count: 'text-sm text-gray-700 mt-3 font-semibold text-center',
  });

  const getChartContainerClasses = () => ({
    main: 'h-64 md:h-72 lg:h-80 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-200 overflow-hidden',
    scrollContainer: 'h-full overflow-x-auto',
    chartArea: 'h-full flex items-end px-6 py-4 min-w-max',
    summaryContainer: 'pt-6 border-t border-gray-200 bg-gray-50 rounded-lg p-4',
    summaryGrid: 'grid grid-cols-2 gap-4',
    summaryItem: 'text-center',
    summaryValue: 'text-2xl font-bold text-gray-900',
    summaryLabel: 'text-sm text-gray-600 font-medium',
  });

  return {
    getChartDimensions,
    calculateBarHeight,
    formatDate,
    sortDates,
    calculateTotalEncounters,
    getBarClasses,
    getChartContainerClasses,
  };
};
