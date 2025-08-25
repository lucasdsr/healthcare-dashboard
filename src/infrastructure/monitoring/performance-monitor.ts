export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string): void {
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
  }

  endMeasure(name: string): number {
    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name)[0];
      if (!measure) {
        return 0;
      }
      const duration = measure.duration;

      // Store metric for analysis
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      this.metrics.get(name)!.push(duration);

      // Clean up marks and measures
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);

      return duration;
    }
    return 0;
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;

    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  getMetricCount(name: string): number {
    return this.metrics.get(name)?.length || 0;
  }

  clearMetrics(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }

  getPerformanceBudget(): Record<string, number> {
    return {
      'dashboard-load': 200,
      'chart-render': 100,
      'filter-apply': 50,
      'data-fetch': 300,
    };
  }

  isWithinBudget(name: string, duration: number): boolean {
    const budget = this.getPerformanceBudget()[name];
    return budget ? duration <= budget : true;
  }

  generateReport(): Record<string, any> {
    const report: Record<string, any> = {};

    this.metrics.forEach((values, name) => {
      const avg = this.getAverageMetric(name);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const budget = this.getPerformanceBudget()[name];

      report[name] = {
        average: Math.round(avg * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        count: values.length,
        withinBudget: budget ? avg <= budget : true,
        budget: budget || 'No budget set',
      };
    });

    return report;
  }
}
