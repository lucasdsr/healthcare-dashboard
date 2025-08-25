import React from 'react';

interface DateRangeErrorProps {
  isDateRangeValid: boolean;
  pendingFilters: {
    dateRange?: { start?: Date; end?: Date };
  };
}

export const DateRangeError: React.FC<DateRangeErrorProps> = ({
  isDateRangeValid,
  pendingFilters,
}) => {
  if (isDateRangeValid) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <svg
          className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="text-sm text-red-800">
          <p className="font-medium">Date Range Error</p>
          <p className="mt-1">
            {pendingFilters.dateRange?.start &&
            pendingFilters.dateRange?.end &&
            pendingFilters.dateRange.start > pendingFilters.dateRange.end
              ? 'Start date must be before end date. Please adjust the dates to continue.'
              : 'Please select a valid date range.'}
          </p>
        </div>
      </div>
    </div>
  );
};
