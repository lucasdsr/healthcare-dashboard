import { useState, useEffect } from 'react';

export interface DashboardMetrics {
  totalEncounters: number;
  activeEncounters: number;
  completedEncounters: number;
  averageEncounterDuration: number;
  encountersByStatus: Array<{ status: string; count: number }>;
  encountersByHour: Array<{ hour: number; count: number }>;
  encountersByDay: Array<{ date: string; count: number }>;
}

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const mockMetrics: DashboardMetrics = {
          totalEncounters: 150,
          activeEncounters: 25,
          completedEncounters: 120,
          averageEncounterDuration: 45,
          encountersByStatus: [
            { status: 'planned', count: 15 },
            { status: 'in-progress', count: 25 },
            { status: 'finished', count: 110 },
          ],
          encountersByHour: [
            { hour: 8, count: 12 },
            { hour: 9, count: 18 },
            { hour: 10, count: 22 },
            { hour: 11, count: 15 },
            { hour: 12, count: 8 },
            { hour: 13, count: 10 },
            { hour: 14, count: 16 },
            { hour: 15, count: 20 },
            { hour: 16, count: 14 },
            { hour: 17, count: 9 },
          ],
          encountersByDay: [
            { date: '2024-01-15', count: 25 },
            { date: '2024-01-16', count: 28 },
            { date: '2024-01-17', count: 22 },
            { date: '2024-01-18', count: 30 },
            { date: '2024-01-19', count: 18 },
            { date: '2024-01-20', count: 15 },
            { date: '2024-01-21', count: 12 },
          ],
        };

        setMetrics(mockMetrics);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch metrics'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
};
