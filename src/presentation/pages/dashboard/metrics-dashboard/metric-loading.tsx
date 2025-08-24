import React from 'react';
import { LoadingSpinner } from '@/presentation/components';

export const MetricLoading: React.FC = () => (
  <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-lg flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading metrics..." variant="purple" />
  </div>
);
