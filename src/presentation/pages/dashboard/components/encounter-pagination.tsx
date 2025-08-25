import React from 'react';
import { Button, Card, CardContent } from '@/presentation/components';

interface EncounterPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const EncounterPagination: React.FC<EncounterPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              {totalCount} total encounters
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
