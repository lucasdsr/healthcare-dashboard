import { PerformanceMonitor } from '../performance-monitor';

describe('PerformanceMonitor', () => {
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = PerformanceMonitor.getInstance();
    performanceMonitor.clearMetrics();
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = PerformanceMonitor.getInstance();
      const instance2 = PerformanceMonitor.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('startMeasure and endMeasure', () => {
    it('should start and end a measure', () => {
      const measureName = 'test-measure';

      performanceMonitor.startMeasure(measureName);
      const duration = performanceMonitor.endMeasure(measureName);

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle multiple measures', () => {
      const measure1 = 'measure1';
      const measure2 = 'measure2';

      performanceMonitor.startMeasure(measure1);
      performanceMonitor.startMeasure(measure2);

      const duration1 = performanceMonitor.endMeasure(measure1);
      const duration2 = performanceMonitor.endMeasure(measure2);

      expect(duration1).toBeGreaterThanOrEqual(0);
      expect(duration2).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getPerformanceBudget', () => {
    it('should return performance budget object', () => {
      const budget = performanceMonitor.getPerformanceBudget();

      expect(budget).toHaveProperty('dashboard-load');
      expect(budget).toHaveProperty('chart-render');
      expect(budget).toHaveProperty('filter-apply');
      expect(budget).toHaveProperty('data-fetch');
    });

    it('should have numeric budget values', () => {
      const budget = performanceMonitor.getPerformanceBudget();

      expect(typeof budget['dashboard-load']).toBe('number');
      expect(typeof budget['chart-render']).toBe('number');
      expect(typeof budget['filter-apply']).toBe('number');
      expect(typeof budget['data-fetch']).toBe('number');
    });
  });

  describe('isWithinBudget', () => {
    it('should return true when duration is within budget', () => {
      const result = performanceMonitor.isWithinBudget('dashboard-load', 150);
      expect(result).toBe(true);
    });

    it('should return false when duration exceeds budget', () => {
      const result = performanceMonitor.isWithinBudget('dashboard-load', 250);
      expect(result).toBe(false);
    });

    it('should return true for unknown metric names', () => {
      const result = performanceMonitor.isWithinBudget('unknown-metric', 1000);
      expect(result).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty measure names', () => {
      const emptyName = '';

      performanceMonitor.startMeasure(emptyName);
      const duration = performanceMonitor.endMeasure(emptyName);

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle special characters in measure names', () => {
      const specialName = 'measure-with-special-chars!@#$%^&*()';

      performanceMonitor.startMeasure(specialName);
      const duration = performanceMonitor.endMeasure(specialName);

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle very long measure names', () => {
      const longName = 'a'.repeat(1000);

      performanceMonitor.startMeasure(longName);
      const duration = performanceMonitor.endMeasure(longName);

      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });
});
