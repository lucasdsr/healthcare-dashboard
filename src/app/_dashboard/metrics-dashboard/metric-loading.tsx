import React from 'react';

export const MetricLoading: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
        Connecting to HAPI FHIR...
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-neutral-200 animate-pulse rounded-lg" />
      ))}
    </div>
  </div>
);
