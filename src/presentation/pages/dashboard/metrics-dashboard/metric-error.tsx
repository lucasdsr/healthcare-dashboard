import React from 'react';

export const MetricError: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        ⚠️ API Error - Using Mock Data
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-32 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-red-600 text-sm">Error loading data</div>
            <div className="text-red-500 text-xs">Check API connection</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
