import React from 'react';

export const EncounterTableHeader: React.FC = () => (
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
    <div className="grid grid-cols-4 gap-6">
      <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        ID
      </div>
      <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Patient
      </div>
      <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Date
      </div>
      <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">
        Status
      </div>
    </div>
  </div>
);
