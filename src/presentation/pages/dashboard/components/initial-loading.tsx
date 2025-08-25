import React from 'react';

export const InitialLoading: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <div className="text-xl font-semibold text-gray-700">
        Loading Dashboard...
      </div>
      <div className="text-gray-500 mt-2">Initializing healthcare data</div>
    </div>
  </div>
);
