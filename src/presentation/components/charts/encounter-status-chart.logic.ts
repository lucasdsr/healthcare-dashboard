export const useEncounterStatusChartLogic = () => {
  const getStatusColors = () => ({
    planned: '#3B82F6',
    arrived: '#F59E0B',
    triaged: '#F97316',
    'in-progress': '#10B981',
    onleave: '#8B5CF6',
    finished: '#6B7280',
    cancelled: '#EF4444',
  });

  const calculateChartData = (statusData: Record<string, number>) => {
    const hasData = Object.keys(statusData).length > 0;
    const totalEncounters = Object.values(statusData).reduce(
      (sum, count) => sum + count,
      0
    );

    return { hasData, totalEncounters };
  };

  const calculatePieSlice = (
    percentage: number,
    previousPercentages: number
  ) => {
    const startAngle = (previousPercentages / 100) * 360;
    const endAngle = ((previousPercentages + percentage) / 100) * 360;

    const x1 = 128 + 100 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 128 + 100 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 128 + 100 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 128 + 100 * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = percentage > 50 ? 1 : 0;

    return { x1, y1, x2, y2, largeArcFlag, startAngle, endAngle };
  };

  const getSingleStatusCircle = (color: string) => ({
    cx: 128,
    cy: 128,
    r: 100,
    fill: color,
    className: 'transition-all duration-300 hover:opacity-80',
  });

  const getSingleStatusBorder = () => ({
    cx: 128,
    cy: 128,
    r: 100,
    fill: 'transparent',
    stroke: 'white',
    strokeWidth: 2,
    className:
      'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
  });

  return {
    getStatusColors,
    calculateChartData,
    calculatePieSlice,
    getSingleStatusCircle,
    getSingleStatusBorder,
  };
};
