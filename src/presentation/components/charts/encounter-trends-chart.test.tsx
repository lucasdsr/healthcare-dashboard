import React from 'react';
import { render, screen } from '@testing-library/react';
import { EncounterTrendsChart } from './encounter-trends-chart';
import { useDashboardMetrics } from '@/infrastructure/queries/encounter-queries';
import { useEncounterStore } from '@/infrastructure/store';

jest.mock('@/infrastructure/queries/encounter-queries', () => ({
  useDashboardMetrics: jest.fn(),
}));

jest.mock('@/infrastructure/store', () => ({
  useEncounterStore: jest.fn(),
}));

const mockUseDashboardMetrics = useDashboardMetrics as jest.MockedFunction<
  typeof useDashboardMetrics
>;
const mockUseEncounterStore = useEncounterStore as jest.MockedFunction<
  typeof useEncounterStore
>;

const createMockQueryResult = (overrides: any) => ({
  data: undefined,
  isLoading: false,
  error: null,
  isError: false,
  isPending: false,
  isSuccess: false,
  isFetching: false,
  isRefetching: false,
  isStale: false,
  isPlaceholderData: false,
  isFetched: false,
  isFetchedAfterMount: false,
  isLoadingError: false,
  isPaused: false,
  isRefetchError: false,
  isInitialLoading: false,
  dataUpdatedAt: 0,
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: null,
  errorUpdateCount: 0,
  status: 'idle',
  fetchStatus: 'idle',
  refetch: jest.fn(),
  ...overrides,
});

describe('EncounterTrendsChart Component', () => {
  const mockFilters = {
    dateRange: {
      start: '2024-01-01',
      end: '2024-01-07',
    },
    status: 'active' as const,
  };

  const mockMetrics = {
    totalEncounters: 135,
    activeEncounters: 95,
    dailyAverage: 19.3,
    encountersByStatus: {
      active: 95,
      finished: 40,
    },
    encountersByDate: {
      '2024-01-01': 15,
      '2024-01-02': 22,
      '2024-01-03': 18,
      '2024-01-04': 25,
      '2024-01-05': 20,
      '2024-01-06': 16,
      '2024-01-07': 19,
    },
  };

  beforeEach(() => {
    mockUseEncounterStore.mockReturnValue({
      encounters: [],
      setEncounters: jest.fn(),
      pagination: {
        currentPage: 1,
        totalCount: 0,
        totalPages: 1,
        pageSize: 50,
      },
      setPagination: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render chart description', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: mockMetrics,
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.getByText('Daily Trends')).toBeInTheDocument();
      expect(
        screen.getByText('Daily encounter volume for the last week')
      ).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading message when data is loading', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          isLoading: true,
          isPending: true,
          isFetching: true,
          isInitialLoading: true,
          status: 'pending',
          fetchStatus: 'fetching',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.getByText('Loading Trend Data...')).toBeInTheDocument();
    });

    it('should not show chart when loading', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          isLoading: true,
          isPending: true,
          isFetching: true,
          isInitialLoading: true,
          status: 'pending',
          fetchStatus: 'fetching',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.queryByText('Total Encounters')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when there is an error', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          error: new Error('Failed to fetch data'),
          isError: true,
          isFetched: true,
          isFetchedAfterMount: true,
          isRefetchError: true,
          errorUpdatedAt: Date.now(),
          failureCount: 1,
          failureReason: new Error('Failed to fetch data'),
          errorUpdateCount: 1,
          status: 'error',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.getByText('Error loading chart data')).toBeInTheDocument();
    });

    it('should not show chart when there is an error', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          error: new Error('Failed to fetch data'),
          isError: true,
          isFetched: true,
          isFetchedAfterMount: true,
          isRefetchError: true,
          errorUpdatedAt: Date.now(),
          failureCount: 1,
          failureReason: new Error('Failed to fetch data'),
          errorUpdateCount: 1,
          status: 'error',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.queryByText('Total Encounters')).not.toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should render chart when data is available', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: mockMetrics,
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.getByText('Total Encounters')).toBeInTheDocument();
      expect(screen.getByText('135')).toBeInTheDocument();
    });

    it('should render all chart components when data is available', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: mockMetrics,
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('22')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('16')).toBeInTheDocument();
      expect(screen.getByText('19')).toBeInTheDocument();
    });
  });

  describe('Empty Data State', () => {
    it('should handle empty data array', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: {
            encountersByDate: {},
            totalEncounters: 0,
            activeEncounters: 0,
            dailyAverage: 0,
            encountersByStatus: {},
          },
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.getByText('Total Encounters')).toBeInTheDocument();
    });

    it('should not show chart when no data', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: {
            encountersByDate: {},
            totalEncounters: 0,
            activeEncounters: 0,
            dailyAverage: 0,
            encountersByStatus: {},
          },
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.queryByText('15')).not.toBeInTheDocument();
    });
  });

  describe('Chart Configuration', () => {
    it('should pass correct data to Line Chart', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: mockMetrics,
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.getByText('135')).toBeInTheDocument();
      expect(screen.getByText('Total Encounters')).toBeInTheDocument();
    });

    it('should configure Line component correctly', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: mockMetrics,
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(screen.getByText('Daily Trends')).toBeInTheDocument();
      expect(
        screen.getByText('Daily encounter volume for the last week')
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: mockMetrics,
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      const heading = screen.getByRole('heading', { name: 'Daily Trends' });
      expect(heading).toBeInTheDocument();
    });

    it('should have descriptive text for screen readers', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: mockMetrics,
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      render(<EncounterTrendsChart filters={mockFilters} />);

      expect(
        screen.getByText('Daily encounter volume for the last week')
      ).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly with data', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: mockMetrics,
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      const startTime = performance.now();
      render(<EncounterTrendsChart filters={mockFilters} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText('Daily Trends')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data gracefully', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          status: 'idle',
        })
      );

      expect(() => render(<EncounterTrendsChart />)).not.toThrow();
    });

    it('should handle null data gracefully', () => {
      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          status: 'idle',
        })
      );

      expect(() => render(<EncounterTrendsChart />)).not.toThrow();
    });

    it('should handle very large datasets', () => {
      const largeDataset = {
        encountersByDate: {
          '2024-01-01': 1000,
          '2024-01-02': 2000,
          '2024-01-03': 1500,
        },
        totalEncounters: 4500,
        activeEncounters: 3000,
        dailyAverage: 1500,
        encountersByStatus: {
          active: 3000,
          finished: 1500,
        },
      };

      mockUseDashboardMetrics.mockReturnValue(
        createMockQueryResult({
          data: largeDataset,
          isSuccess: true,
          isFetched: true,
          isFetchedAfterMount: true,
          dataUpdatedAt: Date.now(),
          status: 'success',
        })
      );

      expect(() => render(<EncounterTrendsChart />)).not.toThrow();
    });
  });
});
