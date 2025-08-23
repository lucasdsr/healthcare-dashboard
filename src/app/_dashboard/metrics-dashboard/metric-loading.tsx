import React from 'react';
import { LoadingSpinner } from '@/presentation/components';

export const MetricLoading: React.FC = () => (
  <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" text="Loading metrics..." />
      <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
        Loading dashboard data...
      </div>
    </div>
  </div>
);
