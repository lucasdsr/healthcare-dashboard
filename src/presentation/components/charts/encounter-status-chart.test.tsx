import React from 'react';
import { render, screen } from '@testing-library/react';
import { EncounterStatusChart } from './encounter-status-chart';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children, ...props }: any) => (
    <div data-testid="responsive-container" {...props}>
      {children}
    </div>
  ),
  BarChart: ({ children, ...props }: any) => (
    <div data-testid="bar-chart" {...props}>
      {children}
    </div>
  ),
  Bar: ({ ...props }: any) => <div data-testid="bar" {...props} />,
  XAxis: ({ ...props }: any) => <div data-testid="x-axis" {...props} />,
  YAxis: ({ ...props }: any) => <div data-testid="y-axis" {...props} />,
  CartesianGrid: ({ ...props }: any) => (
    <div data-testid="cartesian-grid" {...props} />
  ),
  Tooltip: ({ ...props }: any) => <div data-testid="tooltip" {...props} />,
  Legend: ({ ...props }: any) => <div data-testid="legend" {...props} />,
}));

const mockUseDashboardMetrics = jest.fn();
jest.mock('@/infrastructure/queries/encounter-queries', () => ({
  useDashboardMetrics: () => mockUseDashboardMetrics(),
}));

describe('EncounterStatusChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render chart component', () => {
    mockUseDashboardMetrics.mockReturnValue({
      data: {
        statusDistribution: [
          { status: 'finished', count: 10 },
          { status: 'active', count: 5 },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<EncounterStatusChart />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should display chart title', () => {
    mockUseDashboardMetrics.mockReturnValue({
      data: {
        statusDistribution: [
          { status: 'finished', count: 10 },
          { status: 'active', count: 5 },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<EncounterStatusChart />);
    expect(screen.getByText('Status Distribution')).toBeInTheDocument();
  });

  it('should render chart elements', () => {
    mockUseDashboardMetrics.mockReturnValue({
      data: {
        statusDistribution: [
          { status: 'finished', count: 10 },
          { status: 'active', count: 5 },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<EncounterStatusChart />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    mockUseDashboardMetrics.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<EncounterStatusChart />);
    expect(screen.getByText('Loading Status Data...')).toBeInTheDocument();
  });

  it('should display error state', () => {
    mockUseDashboardMetrics.mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Failed to load data',
    });

    render(<EncounterStatusChart />);
    expect(screen.getByText('Error loading chart data')).toBeInTheDocument();
  });

  it('should display no data message when empty', () => {
    mockUseDashboardMetrics.mockReturnValue({
      data: {
        statusDistribution: [],
      },
      isLoading: false,
      error: null,
    });

    render(<EncounterStatusChart />);
    expect(screen.getByText('No status data available')).toBeInTheDocument();
  });

  it('should display chart description', () => {
    mockUseDashboardMetrics.mockReturnValue({
      data: {
        statusDistribution: [{ status: 'finished', count: 10 }],
      },
      isLoading: false,
      error: null,
    });

    render(<EncounterStatusChart />);
    expect(screen.getByText('Encounters by status')).toBeInTheDocument();
  });
});
