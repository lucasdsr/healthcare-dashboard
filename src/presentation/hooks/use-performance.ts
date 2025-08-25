import { useEffect, useRef } from 'react';
import { PerformanceMonitor } from '@/infrastructure/monitoring/performance-monitor';

export const usePerformance = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current++;
    lastRenderTime.current = performance.now();

    monitor.startMeasure(`${componentName}-render`);

    return () => {
      const duration = performance.now() - lastRenderTime.current;
      monitor.endMeasure(`${componentName}-render`);

      if (duration > 16) {
      }
    };
  });

  const measureOperation = (operationName: string, operation: () => void) => {
    monitor.startMeasure(`${componentName}-${operationName}`);
    try {
      operation();
    } finally {
      monitor.endMeasure(`${componentName}-${operationName}`);
    }
  };

  const measureAsyncOperation = async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    monitor.startMeasure(`${componentName}-${operationName}`);
    try {
      const result = await operation();
      return result;
    } finally {
      monitor.endMeasure(`${componentName}-${operationName}`);
    }
  };

  return {
    renderCount: renderCount.current,
    measureOperation,
    measureAsyncOperation,
    getMetrics: () => monitor.generateReport(),
  };
};
