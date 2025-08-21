import React from 'react';
import { useEncounters } from '@/infrastructure/queries/encounter-queries';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';

export function EncounterList() {
  const { pagination, setPagination } = useEncounterStore();

  const { data, isLoading, error } = useEncounters({
    _count: pagination.pageSize,
    _page: pagination.currentPage,
  });

  const handlePageChange = (newPage: number) => {
    setPagination({ currentPage: newPage });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading encounters: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const encounters = data?.entry?.map(entry => entry.resource) || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Encounters</CardTitle>
        </CardHeader>
        <CardContent>
          {encounters.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No encounters found
            </p>
          ) : (
            <div className="space-y-4">
              {encounters.map(encounter => (
                <div
                  key={encounter.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Encounter {encounter.id}</h3>
                      <p className="text-sm text-gray-600">
                        Status: {encounter.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        Patient: {encounter.subject.reference}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium healthcare-status-${encounter.status}`}
                    >
                      {encounter.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
