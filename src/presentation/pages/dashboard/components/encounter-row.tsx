import React from 'react';
import { EncounterRowProps } from '../interfaces/encounter-list.interface';

export const EncounterRow: React.FC<EncounterRowProps> = React.memo(
  ({ index, style, data }) => {
    const encounter = data.encounters[index];

    if (!encounter) {
      return (
        <div style={style}>
          <div className="bg-white border-b border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors last:border-b-0">
            <div className="text-center text-gray-500">Loading...</div>
          </div>
        </div>
      );
    }

    return (
      <div style={style}>
        <div className="bg-white border-b border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors last:border-b-0">
          <div className="grid grid-cols-4 gap-6">
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-800 text-xs font-mono px-2 py-1 rounded-md">
                #{encounter.id || 'Unknown'}
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                {encounter.subject?.reference || 'Unknown Patient'}
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-900">
                {encounter.period?.start
                  ? new Date(encounter.period.start).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium healthcare-status-${encounter.status}`}
              >
                {encounter.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

EncounterRow.displayName = 'EncounterRow';
